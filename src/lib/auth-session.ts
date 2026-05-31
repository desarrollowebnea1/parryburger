import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";

export type SessionPayload = JWTPayload & {
  userId: string;
  email: string;
  role: "ADMIN" | "STAFF";
};

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: Omit<SessionPayload, keyof JWTPayload>,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "STAFF")
    ) {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function getSessionTokenFromRequest(
  request: NextRequest,
): string | undefined {
  return request.cookies.get(SESSION_COOKIE)?.value;
}

export async function getSessionFromRequest(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;
  return verifySessionToken(token);
}
