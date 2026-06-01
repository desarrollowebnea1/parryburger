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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative mx-auto h-32 w-full max-w-[200px] overflow-hidden rounded-lg border border-brand-gray1 bg-brand-black2 sm:mx-0 sm:h-28 sm:w-28 sm:max-w-none">
          <Image
            src={value || PLACEHOLDER_FOOD}
            alt="Vista previa"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-1">
          <AdminButton
            type="button"
            variant="secondary"
            disabled={uploading}
            className="w-full"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Subiendo..." : "Subir imagen"}
          </AdminButton>
          {value ? (
            <AdminButton
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => onChange("")}
            >
              Eliminar imagen
            </AdminButton>
          ) : null}
          <p className="text-center text-[10px] text-brand-cream/35 sm:text-left">
            JPG, PNG o WEBP · máx. 5 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            capture="environment"
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
