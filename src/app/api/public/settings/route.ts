import { prisma } from "@/lib/prisma";
import {
  decimalToNumber,
  handleApiError,
  jsonError,
  jsonOk,
} from "@/lib/api/public";
import type {
  PublicOpeningHour,
  PublicPaymentMethod,
  PublicSettings,
} from "@/types";

export const dynamic = "force-dynamic";

function parseOpeningHours(value: unknown): PublicOpeningHour[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const row = entry as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        label: String(row.label ?? ""),
        days: String(row.days ?? ""),
        hours: String(row.hours ?? ""),
      };
    });
}

function parsePaymentMethods(value: unknown): PublicPaymentMethod[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const row = entry as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        label: String(row.label ?? ""),
        active: Boolean(row.active),
      };
    })
    .filter((method) => method.active);
}

export async function GET() {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return jsonError("Configuración no encontrada", 404);
    }

    const payload: PublicSettings = {
      businessName: settings.businessName,
      slogan: settings.slogan,
      whatsappNumber: settings.whatsappNumber,
      instagramUrl: settings.instagramUrl,
      facebookUrl: settings.facebookUrl,
      address: settings.address,
      mapsUrl: settings.mapsUrl,
      mapsEmbedUrl: settings.mapsEmbedUrl,
      deliveryCost: decimalToNumber(settings.deliveryCost),
      heroTag: settings.heroTag,
      heroTitleLine1: settings.heroTitleLine1,
      heroTitleLine2: settings.heroTitleLine2,
      heroTitleLine3: settings.heroTitleLine3,
      heroDescription: settings.heroDescription,
      heroImageUrl: settings.heroImageUrl,
      heroImagePosition: settings.heroImagePosition,
      footerText: settings.footerText,
      openingHours: parseOpeningHours(settings.openingHoursJson),
      paymentMethods: parsePaymentMethods(settings.paymentMethodsJson),
    };

    return jsonOk(payload);
  } catch (error) {
    return handleApiError(error, "api/public/settings");
  }
}
