-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "replacedByTokenHash" VARCHAR(255);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3);
