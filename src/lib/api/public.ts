import { NextResponse } from "next/server";
import type { Decimal } from "@prisma/client/runtime/library";

export function decimalToNumber(value: Decimal | number | string): number {
  return Number(value);
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown, context: string) {
  console.error(`[${context}]`, error);
  return jsonError("Error interno del servidor", 500);
}
