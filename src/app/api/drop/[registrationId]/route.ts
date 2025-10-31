import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";
import { getIO } from "@/lib/socket";

export async function POST(
  req: NextRequest,
  { params }: { params: { registrationId: string } }
) {
  try {
    let user;
    try {
      user = getAuthUser(req);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (registration.user_id !== user.userId) {
      return NextResponse.json(
        { error: "Unauthorized to drop this course" },
        { status: 403 }
      );
    }

    let updated;
    await prisma.$transaction(async (tx) => {
      await tx.registration.delete({
        where: { id: params.registrationId },
      });

      if (registration.status === "REGISTERED") {
        updated = await tx.course.update({
          where: { id: registration.course_id },
          data: {
            remaining_seats: {
              increment: 1,
            },
          },
        });
      } else if (registration.status === "WAITLISTED") {
        updated = await tx.course.update({
          where: { id: registration.course_id },
          data: {
            waitlist_current: {
              decrement: 1,
            },
          },
        });
      } else {
        updated = await tx.course.findUnique({ where: { id: registration.course_id } });
      }
    });

    const io = getIO();
    if (io && updated) {
      io.emit("seat-update", {
        courseId: registration.course_id,
        newSeatCount: updated.remaining_seats,
        newWaitlistCount: updated.waitlist_current,
      });
    }

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

