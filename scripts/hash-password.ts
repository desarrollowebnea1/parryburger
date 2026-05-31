/**
 * Cambiar contraseña del admin en la base de datos.
 *
 * Uso:
 *   npm run admin:hash-password -- admin@parryburger.com nuevaPassword123
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = (process.argv[2] || "admin@parryburger.com").trim().toLowerCase();
  const password = process.argv[3];

  if (!password || password.length < 8) {
    console.error(
      "Uso: npm run admin:hash-password -- admin@parryburger.com nuevaPassword123",
    );
    console.error("La contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Usuario no encontrado: ${email}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`✓ Contraseña actualizada para ${email}`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
