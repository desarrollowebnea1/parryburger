import { z } from "zod";

export const orderStatusSchema = z.enum([
  "NUEVO",
  "PREPARANDO",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
]);

export const adminOrdersQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  search: z.string().trim().max(120).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const updateAdminOrderSchema = z.object({
  status: orderStatusSchema,
});

export type AdminOrdersQuery = z.infer<typeof adminOrdersQuerySchema>;
export type UpdateAdminOrderInput = z.infer<typeof updateAdminOrderSchema>;
