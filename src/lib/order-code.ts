import type { Prisma, PrismaClient } from "@prisma/client";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type OrderCodeLookup = Pick<PrismaClient, "order"> | Prisma.TransactionClient;

function randomSuffix(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return result;
}

function formatDatePart(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export async function generateOrderCode(
  prisma: OrderCodeLookup,
): Promise<string> {
  const datePart = formatDatePart(new Date());
  const prefix = `PB-${datePart}-`;

  for (let attempt = 0; attempt < 12; attempt++) {
    const orderCode = `${prefix}${randomSuffix(4)}`;
    const existing = await prisma.order.findUnique({
      where: { orderCode },
      select: { id: true },
    });
    if (!existing) {
      return orderCode;
    }
  }

  throw new Error("No se pudo generar un código de pedido único");
}
