import { prisma } from "@/lib/prisma";
import { serializeAdminSettings } from "@/lib/admin/serializers";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import { updateSettingsSchema } from "@/lib/validators/settings";

export { dynamic };

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return jsonError("Configuración no encontrada", 404);
    }

    return jsonOk({ settings: serializeAdminSettings(settings) });
  } catch (error) {
    return handleApiError(error, "api/admin/settings GET");
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;

    const existing = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!existing) {
      return jsonError("Configuración no encontrada", 404);
    }

    const settings = await prisma.businessSettings.update({
      where: { id: "default" },
      data: input,
    });

    return jsonOk({ settings: serializeAdminSettings(settings) });
  } catch (error) {
    return handleApiError(error, "api/admin/settings PATCH");
  }
}
