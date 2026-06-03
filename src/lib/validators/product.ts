import { z } from "zod";
import { imagePositionSchema } from "@/lib/image-position";

const optionalImageUrl = z.preprocess(
  (value) => {
    if (value === "" || value === undefined) return null;
    return value;
  },
  z.union([z.null(), z.string().url("La imagen debe ser una URL válida")]).optional(),
);

const optionalDescription = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return value;
  },
  z.string().trim().max(2000, "La descripción es demasiado larga").optional(),
);

export const createProductSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(2, "El nombre es obligatorio (mínimo 2 caracteres)")
    .max(120, "El nombre es demasiado largo"),
  slug: z.string().trim().min(2).max(120).optional(),
  description: optionalDescription,
  price: z.coerce
    .number({ error: "El precio debe ser un número válido" })
    .positive("El precio debe ser un número válido mayor a 0")
    .max(9999999, "El precio es demasiado alto"),
  categoryId: z
    .string({ error: "Debe seleccionar una categoría válida" })
    .min(1, "Debe seleccionar una categoría válida")
    .cuid("Debe seleccionar una categoría válida"),
  imageUrl: optionalImageUrl,
  imagePosition: imagePositionSchema,
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce
    .number()
    .int("El orden debe ser un número entero")
    .min(0)
    .max(9999)
    .optional()
    .default(0),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
