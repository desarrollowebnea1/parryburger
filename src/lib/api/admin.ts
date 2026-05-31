import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import type { SessionPayload } from "@/lib/auth-session";
import { handleApiError, jsonError, jsonOk } from "@/lib/api/public";

export { jsonOk, jsonError, handleApiError };

export async function requireAdminApi(): Promise<
  { session: SessionPayload; error: null } | { session: null; error: NextResponse }
> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { session: null, error: jsonError("No autorizado", 401) };
  }

  return { session, error: null };
}

export const dynamic = "force-dynamic";
