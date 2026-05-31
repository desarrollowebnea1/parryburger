import { z } from "zod";

export const IMAGE_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
] as const;

export type ImagePosition = (typeof IMAGE_POSITIONS)[number];

export const imagePositionSchema = z.enum(IMAGE_POSITIONS).optional();

export const IMAGE_POSITION_LABELS: Record<ImagePosition, string> = {
  center: "Centro",
  top: "Arriba",
  bottom: "Abajo",
  left: "Izquierda",
  right: "Derecha",
};

export const IMAGE_POSITION_OPTIONS = IMAGE_POSITIONS.map((value) => ({
  value,
  label: IMAGE_POSITION_LABELS[value],
}));

export function normalizeImagePosition(
  value: string | null | undefined,
): ImagePosition {
  if (value && IMAGE_POSITIONS.includes(value as ImagePosition)) {
    return value as ImagePosition;
  }
  return "center";
}

export function toObjectPosition(
  value: string | null | undefined,
): string {
  return normalizeImagePosition(value);
}
