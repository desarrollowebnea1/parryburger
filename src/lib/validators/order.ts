import { z } from "zod";

const orderItemSchema = z
  .object({
    productId: z.string().cuid().optional(),
    promoId: z.string().cuid().optional(),
    quantity: z.number().int().min(1).max(99),
  })
  .refine(
    (item) =>
      (Boolean(item.productId) && !item.promoId) ||
      (Boolean(item.promoId) && !item.productId),
    { message: "Cada ítem debe tener productId o promoId, no ambos" },
  );

export const createOrderSchema = z
  .object({
    customerName: z.string().trim().min(2).max(120),
    customerPhone: z.string().trim().min(6).max(30),
    deliveryType: z.enum(["RETIRO", "DELIVERY"]),
    address: z.string().trim().max(300).optional(),
    zone: z.string().trim().max(120).optional(),
    paymentMethod: z.string().trim().min(2).max(80),
    notes: z.string().trim().max(1000).optional(),
    items: z.array(orderItemSchema).min(1).max(50),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "DELIVERY" && !data.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La dirección es obligatoria para delivery",
        path: ["address"],
      });
    }
  });

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
