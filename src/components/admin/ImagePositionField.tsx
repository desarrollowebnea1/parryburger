"use client";

import { AdminSelect } from "@/components/admin/AdminFields";
import {
  IMAGE_POSITION_OPTIONS,
  normalizeImagePosition,
  type ImagePosition,
} from "@/lib/image-position";

type ImagePositionFieldProps = {
  label?: string;
  value: string | null | undefined;
  onChange: (value: ImagePosition) => void;
};

export default function ImagePositionField({
  label = "Posición de imagen",
  value,
  onChange,
}: ImagePositionFieldProps) {
  return (
    <AdminSelect
      label={label}
      value={normalizeImagePosition(value ?? undefined)}
      onChange={(e) => onChange(normalizeImagePosition(e.target.value))}
    >
      {IMAGE_POSITION_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </AdminSelect>
  );
}
