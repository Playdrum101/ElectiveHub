import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRegistrationConfirmationEmail } from "@/lib/email";
import { getIO } from "@/lib/socket";

export async function POST(
  req: NextRequest,
  { params }: { params: { registrationId: string } }
) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: params.registrationId },
      include: {
        user: true,
        course: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Check if status is PENDING_CONFIRMATION
    if (registration.status !== "PENDING_CONFIRMATION") {
      return NextResponse.json(
        { 
          error: "This registration is not pending confirmation",
          status: registration.status,
        },
        { status: 400 }
      );
    }

    // Check if expired
    if (registration.confirmation_expires_at) {
      const now = new Date();
      const expiresAt = new Date(registration.confirmation_expires_at);
      
      if (now > expiresAt) {
        return NextResponse.json(
          { error: "This confirmation link has expired. The spot has been offered to the next person." },
          { status: 410 }
        );
      }
    }

    // Accept the registration
    const result = await prisma.$transaction(async (tx) => {
      // Update status to REGISTERED
      const updated = await tx.registration.update({
        where: { id: params.registrationId },
        data: {
          status: "REGISTERED",
          confirmation_expires_at: null,
        },
        include: {
          user: true,
          course: true,
        },
      });

      // Decrement remaining seats (seat was reserved, now confirmed)
      await tx.course.update({
        where: { id: registration.course_id },
        data: {
          remaining_seats: {
            decrement: 1,
          },
        },
      });

      return updated;
    });

    // Send confirmation email
    try {
      await sendRegistrationConfirmationEmail(
        result.user.email,
        result.user.name,
        result.course.title,
        result.course.course_code
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Emit real-time update
    const io = getIO();
    if (io) {
      const course = await prisma.course.findUnique({
        where: { id: registration.course_id },
      });
      if (course) {
        io.emit("seat-update", {
          courseId: registration.course_id,
          newSeatCount: course.remaining_seats,
          newWaitlistCount: course.waitlist_current,
        });
      }
    }

    return NextResponse.json({
      message: "Registration confirmed successfully!",
      registration: result,
    });
  } catch (error: any) {
    console.error("Accept waitlist error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept waitlist spot" },
      { status: 500 }
    );
  }
}

