import { cookies } from "next/headers";
import { verifySessionToken, type SessionPayload } from "@/lib/auth-session";
import { SESSION_COOKIE } from "@/lib/constants";

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado");
  }
  return session;
}
