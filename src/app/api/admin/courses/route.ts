import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, getAuthUser } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        schedules: true,
      },
      orderBy: {
        course_code: "asc",
      },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    // Validate required fields
    if (!course_code || !title || !total_seats || !credits) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if course_code already exists
    const existing = await prisma.course.findUnique({
      where: { course_code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Course code already exists" },
        { status: 409 }
      );
    }

    // Create course with schedules
    const course = await prisma.course.create({
      data: {
        course_code,
        title,
        description,
        department,
        professor,
        total_seats: parseInt(total_seats),
        remaining_seats: parseInt(total_seats),
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

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}

