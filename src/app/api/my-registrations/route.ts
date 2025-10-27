import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    let user;
    try {
      user = getAuthUser(req);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all registrations for the student
    const registrations = await prisma.registration.findMany({
      where: {
        user_id: user.userId,
      },
      include: {
        course: {
          include: {
            schedules: true,
          },
        },
      },
      orderBy: {
        registered_at: "desc",
      },
    });

    // Group by status
    const registered = registrations.filter(
      (reg) => reg.status === "REGISTERED"
    );
    const waitlisted = registrations.filter((reg) => reg.status === "WAITLISTED");
    const pending = registrations.filter(
      (reg) => reg.status === "PENDING_CONFIRMATION"
    );

    return NextResponse.json({
      registrations: {
        registered,
        waitlisted,
        pending,
      },
      totalCredits: registered.reduce(
        (sum, reg) => sum + reg.course.credits,
        0
      ),
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

