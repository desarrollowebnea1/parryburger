import { z } from "zod";
import { imagePositionSchema } from "@/lib/image-position";
import { normalizeWhatsAppDigits } from "@/lib/social-links";

const openingHourSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  days: z.string().min(1),
  hours: z.string().min(1),
});

const paymentMethodSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  active: z.boolean(),
});

export const updateSettingsSchema = z.object({
  businessName: z.string().trim().min(2).max(120).optional(),
  slogan: z.string().trim().max(300).optional().nullable(),
  whatsappNumber: z
    .string()
    .trim()
    .min(8, "WhatsApp inválido")
    .transform((value) => normalizeWhatsAppDigits(value))
    .refine(
      (value) => /^549\d{10}$/.test(value),
      "WhatsApp debe ser un móvil argentino válido (ej. 3794180972 o 5493794180972)",
    )
    .optional(),
  instagramUrl: z.string().url().optional().nullable(),
  facebookUrl: z.string().url().optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  mapsUrl: z.string().url().optional().nullable(),
  mapsEmbedUrl: z.string().url().optional().nullable(),
  deliveryCost: z.number().min(0).max(9999999).optional(),
  heroTag: z.string().trim().max(200).optional().nullable(),
  heroTitleLine1: z.string().trim().max(80).optional().nullable(),
  heroTitleLine2: z.string().trim().max(80).optional().nullable(),
  heroTitleLine3: z.string().trim().max(80).optional().nullable(),
  heroDescription: z.string().trim().max(2000).optional().nullable(),
  heroImageUrl: z.string().url().optional().nullable(),
  heroImagePosition: imagePositionSchema,
  footerText: z.string().trim().max(1000).optional().nullable(),
  openingHoursJson: z.array(openingHourSchema).optional(),
  paymentMethodsJson: z.array(paymentMethodSchema).optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
