import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWaitlistPromotionEmail } from "@/lib/email";
import { getIO } from "@/lib/socket";

// This endpoint should be called by a cron job (e.g., Vercel Cron, Railway Cron)
// Runs every hour to check for expired PENDING_CONFIRMATION registrations
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (for security - set in environment variables)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find all expired PENDING_CONFIRMATION registrations
    const expiredRegistrations = await prisma.registration.findMany({
      where: {
        status: "PENDING_CONFIRMATION",
        confirmation_expires_at: {
          lte: now,
        },
      },
      include: {
        course: true,
        user: true,
      },
    });

    const results = [];

    for (const expired of expiredRegistrations) {
      try {
        await prisma.$transaction(async (tx) => {
          // Delete the expired registration
          await tx.registration.delete({
            where: { id: expired.id },
          });

          // Decrement waitlist count
          await tx.course.update({
            where: { id: expired.course_id },
            data: {
              waitlist_current: {
                decrement: 1,
              },
            },
          });

          // Find the next person on the waitlist
          const nextWaitlisted = await tx.registration.findFirst({
            where: {
              course_id: expired.course_id,
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
            // Promote next person
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

            // Send email notification
            try {
              await sendWaitlistPromotionEmail(
                promoted.user.email,
                promoted.user.name,
                promoted.course.title,
                promoted.course.course_code,
                promoted.id
              );

              results.push({
                expired: expired.id,
                promoted: promoted.id,
                emailSent: true,
              });
            } catch (emailError) {
              console.error("Failed to send email:", emailError);
              results.push({
                expired: expired.id,
                promoted: promoted.id,
                emailSent: false,
              });
            }
          } else {
            // No more waitlist - increment remaining seats
            await tx.course.update({
              where: { id: expired.course_id },
              data: {
                remaining_seats: {
                  increment: 1,
                },
              },
            });

            results.push({
              expired: expired.id,
              promoted: null,
              seatReturned: true,
            });
          }

          // Emit real-time update
          const io = getIO();
          if (io) {
            const course = await tx.course.findUnique({
              where: { id: expired.course_id },
            });
            if (course) {
              io.emit("seat-update", {
                courseId: expired.course_id,
                newSeatCount: course.remaining_seats,
                newWaitlistCount: course.waitlist_current,
              });
            }
          }
        });
      } catch (error: any) {
        console.error(`Error processing expired registration ${expired.id}:`, error);
        results.push({
          expired: expired.id,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${expiredRegistrations.length} expired registrations`,
      results,
    });
  } catch (error: any) {
    console.error("Expire waitlist error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process expired waitlist" },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing (remove in production or protect with auth)
export async function GET(req: NextRequest) {
  return POST(req);
}

