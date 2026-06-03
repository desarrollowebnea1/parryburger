import type { ZodError } from "zod";

const FIELD_LABELS: Record<string, string> = {
  name: "nombre",
  price: "precio",
  categoryId: "categoría",
  imageUrl: "imagen",
  description: "descripción",
  sortOrder: "orden",
  imagePosition: "posición de imagen",
  active: "activo",
  featured: "destacado",
  slug: "slug",
};

function messageForIssue(issue: ZodError["issues"][number]): string {
  const field = issue.path[0];
  const label = typeof field === "string" ? FIELD_LABELS[field] ?? field : "campo";

  if (field === "name") {
    if (issue.code === "too_small") return "El nombre es obligatorio (mínimo 2 caracteres).";
    return "El nombre no es válido.";
  }

  if (field === "price") {
    return "El precio debe ser un número válido mayor a 0.";
  }

  if (field === "categoryId") {
    return "Debe seleccionar una categoría válida.";
  }

  if (field === "imageUrl") {
    return "La imagen debe ser una URL válida (subí el archivo o dejá el campo vacío).";
  }

  if (field === "sortOrder") {
    return "El orden debe ser un número entero entre 0 y 9999.";
  }

  if (field === "description") {
    return "La descripción es demasiado larga.";
  }

  if (field === "imagePosition") {
    return "La posición de imagen no es válida.";
  }

  const fallback = issue.message;
  if (fallback && fallback !== "Invalid input") {
    return fallback;
  }

  return `El ${label} no es válido.`;
}

export function formatZodError(error: ZodError): string {
  const first = error.issues[0];
  if (!first) return "Datos inválidos.";
  return messageForIssue(first);
}

export function logZodValidation(route: string, error: ZodError): void {
  console.error(`[${route}] Validación fallida:`, error.flatten());
}
