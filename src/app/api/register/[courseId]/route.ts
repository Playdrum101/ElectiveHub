import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get authenticated user
    let user;
    try {
      user = getAuthUser(req);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        schedules: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if student is already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        user_id_course_id: {
          user_id: user.userId,
          course_id: params.courseId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this course" },
        { status: 400 }
      );
    }

    // Get all student's current registrations (REGISTERED status only)
    const studentRegistrations = await prisma.registration.findMany({
      where: {
        user_id: user.userId,
        status: "REGISTERED",
      },
      include: {
        course: {
          include: {
            schedules: true,
          },
        },
      },
    });

    // Conflict Detection Logic
    const MAX_CREDITS = 20; // Maximum credit limit

    // Check 1: Credit Limit
    const totalCredits = studentRegistrations.reduce(
      (sum, reg) => sum + reg.course.credits,
      0
    );

    if (totalCredits + course.credits > MAX_CREDITS) {
      return NextResponse.json(
        {
          error: `This registration would exceed your credit limit. Current: ${totalCredits}/${MAX_CREDITS} credits`,
        },
        { status: 400 }
      );
    }

    // Check 2: Schedule Conflicts
    for (const registration of studentRegistrations) {
      const existingSchedules = registration.course.schedules;

      // Check each new course schedule against each existing course schedule
      for (const newSchedule of course.schedules) {
        for (const existingSchedule of existingSchedules) {
          // Time conflict detection: same day + overlapping times
          const daysMatch =
            newSchedule.day_of_week === existingSchedule.day_of_week;
          const timeConflict =
            newSchedule.start_time < existingSchedule.end_time &&
            newSchedule.end_time > existingSchedule.start_time;

          if (daysMatch && timeConflict) {
            return NextResponse.json(
              {
                error: `Schedule conflict detected with ${registration.course.title}. This course overlaps with your existing class on ${newSchedule.day_of_week}`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    // No conflicts - proceed with registration
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Lock the course to prevent race conditions
      const courseLock = await tx.course.findUnique({
        where: { id: params.courseId },
      });

      if (!courseLock) {
        throw new Error("Course not found");
      }

      // Check remaining seats one more time (inside transaction)
      if (courseLock.remaining_seats > 0) {
        // Decrement remaining seats and create registration
        await tx.course.update({
          where: { id: params.courseId },
          data: {
            remaining_seats: {
              decrement: 1,
            },
          },
        });

        const registration = await tx.registration.create({
          data: {
            user_id: user.userId,
            course_id: params.courseId,
            status: "REGISTERED",
          },
        });

        return { registration, waitlisted: false };
      } else if (courseLock.waitlist_current < courseLock.waitlist_capacity) {
        // Join waitlist
        await tx.course.update({
          where: { id: params.courseId },
          data: {
            waitlist_current: {
              increment: 1,
            },
          },
        });

        const registration = await tx.registration.create({
          data: {
            user_id: user.userId,
            course_id: params.courseId,
            status: "WAITLISTED",
          },
        });

        return { registration, waitlisted: true };
      } else {
        throw new Error("Course and waitlist are both full");
      }
    });

    return NextResponse.json({
      message: result.waitlisted
        ? "Added to waitlist successfully"
        : "Registered successfully",
      registration: result.registration,
      waitlisted: result.waitlisted,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}

