-- AlterTable
ALTER TABLE "BusinessSettings" ADD COLUMN "heroImagePosition" TEXT NOT NULL DEFAULT 'center';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "imagePosition" TEXT NOT NULL DEFAULT 'center';

-- AlterTable
ALTER TABLE "Promo" ADD COLUMN "imagePosition" TEXT NOT NULL DEFAULT 'center';
