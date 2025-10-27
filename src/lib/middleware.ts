import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function isAuthenticated(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  try {
    verifyToken(token);
    return true;
  } catch {
    return false;
  }
}

export function getAuthUser(req: NextRequest): any {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authentication token");
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function isStudent(req: NextRequest): boolean {
  try {
    const user = getAuthUser(req);
    return user.role === "STUDENT";
  } catch {
    return false;
  }
}

export function isAdmin(req: NextRequest): boolean {
  try {
    const user = getAuthUser(req);
    return user.role === "ADMIN";
  } catch {
    return false;
  }
}

