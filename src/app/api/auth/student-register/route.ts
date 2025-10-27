import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, reg_number, department } = body;

    // Validate input
    if (!email || !password || !name || !reg_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check if reg_number already exists
    const existingRegNumber = await prisma.user.findUnique({
      where: { reg_number },
    });

    if (existingRegNumber) {
      return NextResponse.json(
        { error: "Registration number already exists" },
        { status: 409 }
      );
    }

    // Create new student
    const password_hash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name,
        reg_number,
        department,
        role: "STUDENT",
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: "STUDENT",
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

