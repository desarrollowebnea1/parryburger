"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { adminUpload } from "@/lib/admin/api-client";
import { PLACEHOLDER_FOOD } from "@/lib/format";
import AdminButton from "@/components/admin/AdminButton";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "products" | "promos" | "hero" | "settings";
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const result = await adminUpload(file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="admin-label mb-1 block text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
        {label}
      </span>

      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-brand-gray1 bg-brand-black2">
          <Image
            src={value || PLACEHOLDER_FOOD}
            alt="Vista previa"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <AdminButton
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Subiendo..." : "Subir imagen"}
          </AdminButton>
          {value ? (
            <AdminButton type="button" variant="ghost" onClick={() => onChange("")}>
              Eliminar imagen
            </AdminButton>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-brand-orange">{error}</p> : null}
    </div>
  );
}
