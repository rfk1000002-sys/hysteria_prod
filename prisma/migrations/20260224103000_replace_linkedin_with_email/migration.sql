-- AlterTable
ALTER TABLE "ContactSection"
DROP COLUMN "linkedinUrl",
ADD COLUMN     "email" VARCHAR(255);
