import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  sessionCookieOptions,
  signSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth-session";
import { SESSION_COOKIE } from "@/lib/constants";

export type { SessionPayload } from "@/lib/auth-session";
export {
  getSessionFromRequest,
  getSessionTokenFromRequest,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth-session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function setSessionCookie(token: string): Promise<void> {
  cookies().set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function clearSessionCookie(): Promise<void> {
  cookies().set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
}
