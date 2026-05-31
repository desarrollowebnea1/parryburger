import { z } from "zod";
import { imagePositionSchema } from "@/lib/image-position";

export const createPromoSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  price: z.number().positive().max(9999999),
  imageUrl: z.string().url().optional().nullable(),
  imagePosition: imagePositionSchema,
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  productIds: z.array(z.string().cuid()).optional(),
});

export const updatePromoSchema = createPromoSchema.partial();

export type CreatePromoInput = z.infer<typeof createPromoSchema>;
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>;
