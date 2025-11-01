import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        schedules: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      course_code,
      title,
      description,
      department,
      professor,
      total_seats,
      waitlist_capacity,
      credits,
      schedules,
    } = body;

    // Check if course exists
    const existing = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if course_code is being changed and if it conflicts
    if (course_code && course_code !== existing.course_code) {
      const codeExists = await prisma.course.findUnique({
        where: { course_code },
      });
      if (codeExists) {
        return NextResponse.json(
          { error: "Course code already exists" },
          { status: 409 }
        );
      }
    }

    // Calculate seat difference
    const seatDiff = parseInt(total_seats) - existing.total_seats;
    const newRemainingSeats = Math.max(
      0,
      existing.remaining_seats + seatDiff
    );

    // Update course
    const course = await prisma.$transaction(async (tx) => {
      // Delete existing schedules
      await tx.schedule.deleteMany({
        where: { course_id: params.id },
      });

      // Update course
      const updated = await tx.course.update({
        where: { id: params.id },
        data: {
          course_code,
          title,
          description,
          department,
          professor,
          total_seats: parseInt(total_seats),
          remaining_seats: newRemainingSeats,
          waitlist_capacity: parseInt(waitlist_capacity) || 10,
          credits: parseInt(credits),
          schedules: {
            create: schedules?.map((s: any) => ({
              day_of_week: s.day_of_week,
              start_time: s.start_time,
              end_time: s.end_time,
            })) || [],
          },
        },
        include: {
          schedules: true,
        },
      });

      return updated;
    });

    return NextResponse.json({ course });
  } catch (error: any) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if course has registrations
    const registrations = await prisma.registration.count({
      where: { course_id: params.id },
    });

    if (registrations > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete course. There are ${registrations} active registrations.`,
        },
        { status: 400 }
      );
    }

    // Delete course (schedules will be deleted via cascade)
    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete course" },
      { status: 500 }
    );
  }
}

