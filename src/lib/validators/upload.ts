import { UPLOAD } from "@/lib/constants";

export const UPLOAD_FOLDERS = ["products", "promos", "hero", "settings"] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export function isAllowedUploadFolder(value: string): value is UploadFolder {
  return UPLOAD_FOLDERS.includes(value as UploadFolder);
}

export function isAllowedMimeType(value: string): boolean {
  return UPLOAD.allowedMimeTypes.includes(
    value as (typeof UPLOAD.allowedMimeTypes)[number],
  );
}

export function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
