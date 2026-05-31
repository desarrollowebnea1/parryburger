import { z } from "zod";
import { imagePositionSchema } from "@/lib/image-position";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  price: z.number().positive().max(9999999),
  categoryId: z.string().cuid(),
  imageUrl: z.string().url().optional().nullable(),
  imagePosition: imagePositionSchema,
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
