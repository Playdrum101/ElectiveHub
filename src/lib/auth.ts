import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function hashPassword(password: string): string {
  const bcrypt = require("bcryptjs");
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  const bcrypt = require("bcryptjs");
  return bcrypt.compareSync(password, hash);
}

