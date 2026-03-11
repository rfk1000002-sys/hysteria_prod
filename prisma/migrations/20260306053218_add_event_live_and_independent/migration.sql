/*
  Warnings:

  - You are about to drop the `PlatformContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformContentImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlatformContent" DROP CONSTRAINT "PlatformContent_categoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformContent" DROP CONSTRAINT "PlatformContent_platformId_fkey";

-- DropForeignKey
ALTER TABLE "PlatformContentImage" DROP CONSTRAINT "PlatformContentImage_contentId_fkey";

-- AlterTable
ALTER TABLE "CategoryItem" ADD COLUMN     "isIndependent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "instagramLiveLink" VARCHAR(500),
ADD COLUMN     "tiktokLiveLink" VARCHAR(500),
ADD COLUMN     "youtubeLiveLink" VARCHAR(500);

-- DropTable
DROP TABLE "PlatformContent";

-- DropTable
DROP TABLE "PlatformContentImage";
