import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { UPLOAD } from "@/lib/constants";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import {
  isAllowedMimeType,
  isAllowedUploadFolder,
  sanitizeFilename,
} from "@/lib/validators/upload";

export { dynamic };

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return jsonError(
        "BLOB_READ_WRITE_TOKEN no está configurado en el entorno",
        503,
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");

    if (!(file instanceof File)) {
      return jsonError('Campo "file" requerido', 400);
    }

    const folder =
      typeof folderRaw === "string" && folderRaw.trim()
        ? folderRaw.trim()
        : "products";

    if (!isAllowedUploadFolder(folder)) {
      return jsonError(
        "Carpeta inválida. Usar: products, promos, hero o settings",
        400,
      );
    }

    if (!isAllowedMimeType(file.type)) {
      return jsonError("Tipo de archivo no permitido. Usar JPG, PNG o WEBP", 400);
    }

    if (file.size > UPLOAD.maxSizeBytes) {
      return jsonError("El archivo supera el máximo de 5 MB", 400);
    }

    const safeName = sanitizeFilename(file.name || "image");
    const pathname = `parry/${folder}/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await prisma.imageAsset.create({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        filename: safeName,
        folder,
        size: file.size,
        mimeType: file.type,
      },
    });

    return jsonOk({ url: blob.url }, 201);
  } catch (error) {
    return handleApiError(error, "api/admin/upload");
  }
}
