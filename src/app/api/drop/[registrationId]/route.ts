import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";
import { getIO } from "@/lib/socket";
import { sendWaitlistPromotionEmail } from "@/lib/email";

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
      include: { 
        course: true,
        user: true,
      },
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
    let promotedRegistration = null;

    await prisma.$transaction(async (tx) => {
      await tx.registration.delete({
        where: { id: params.registrationId },
      });

      if (registration.status === "REGISTERED") {
        // Seat opened - check for waitlist
        updated = await tx.course.update({
          where: { id: registration.course_id },
          data: {
            remaining_seats: {
              increment: 1,
            },
          },
        });

        // Find the next person on the waitlist (oldest first)
        const nextWaitlisted = await tx.registration.findFirst({
          where: {
            course_id: registration.course_id,
            status: "WAITLISTED",
          },
          include: {
            user: true,
            course: true,
          },
          orderBy: {
            registered_at: "asc",
          },
        });

        if (nextWaitlisted) {
          // Promote to PENDING_CONFIRMATION with 24-hour expiration
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 24);

          const promoted = await tx.registration.update({
            where: { id: nextWaitlisted.id },
            data: {
              status: "PENDING_CONFIRMATION",
              confirmation_expires_at: expirationDate,
            },
            include: {
              user: true,
              course: true,
            },
          });

          promotedRegistration = promoted;
          
          // Don't increment remaining_seats - seat is reserved for pending student
          // Update waitlist count
          await tx.course.update({
            where: { id: registration.course_id },
            data: {
              waitlist_current: {
                decrement: 1,
              },
            },
          });
        }
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
        // PENDING_CONFIRMATION dropped - just delete, don't change seats
        updated = await tx.course.findUnique({ where: { id: registration.course_id } });
      }
    });

    // Send email notification if someone was promoted
    if (promotedRegistration) {
      try {
        await sendWaitlistPromotionEmail(
          promotedRegistration.user.email,
          promotedRegistration.user.name,
          promotedRegistration.course.title,
          promotedRegistration.course.course_code,
          promotedRegistration.id
        );
      } catch (emailError) {
        console.error("Failed to send waitlist promotion email:", emailError);
        // Don't fail the request if email fails
      }
    }

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

