/*
  Warnings:

  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgramCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgramOrganizer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgramTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgramCategory" DROP CONSTRAINT "ProgramCategory_categoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramCategory" DROP CONSTRAINT "ProgramCategory_programId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramOrganizer" DROP CONSTRAINT "ProgramOrganizer_categoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramOrganizer" DROP CONSTRAINT "ProgramOrganizer_programId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramTag" DROP CONSTRAINT "ProgramTag_programId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramTag" DROP CONSTRAINT "ProgramTag_tagId_fkey";

-- DropTable
DROP TABLE "Program";

-- DropTable
DROP TABLE "ProgramCategory";

-- DropTable
DROP TABLE "ProgramOrganizer";

-- DropTable
DROP TABLE "ProgramTag";
