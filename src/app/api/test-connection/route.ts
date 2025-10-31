import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try a simple query
    await prisma.user.count();
    return NextResponse.json({ message: "✅ Database connected successfully!" });
  } catch (error: any) {
    return NextResponse.json(
      { message: `❌ Database error: ${error.message}` },
      { status: 500 }
    );
  }
}

