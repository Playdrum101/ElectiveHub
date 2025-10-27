import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { registrationId: string } }
) {
  try {
    // Get authenticated user
    let user;
    try {
      user = getAuthUser(req);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the registration
    const registration = await prisma.registration.findUnique({
      where: { id: params.registrationId },
      include: { course: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Check if this registration belongs to the user
    if (registration.user_id !== user.userId) {
      return NextResponse.json(
        { error: "Unauthorized to drop this course" },
        { status: 403 }
      );
    }

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // Delete the registration
      await tx.registration.delete({
        where: { id: params.registrationId },
      });

      if (registration.status === "REGISTERED") {
        // If student was registered, increment remaining seats
        await tx.course.update({
          where: { id: registration.course_id },
          data: {
            remaining_seats: {
              increment: 1,
            },
          },
        });
      } else if (registration.status === "WAITLISTED") {
        // If student was waitlisted, decrement waitlist count
        await tx.course.update({
          where: { id: registration.course_id },
          data: {
            waitlist_current: {
              decrement: 1,
            },
          },
        });
      }
      // If status is PENDING_CONFIRMATION, we don't modify seats
      // (handled by the expiration cron job)
    });

    return NextResponse.json({
      message: "Course dropped successfully",
    });
  } catch (error: any) {
    console.error("Drop course error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to drop course" },
      { status: 500 }
    );
  }
}

