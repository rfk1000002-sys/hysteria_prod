-- CreateEnum
CREATE TYPE "CollaborationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "ContactSection" ADD COLUMN     "phoneNumber" VARCHAR(50);

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" SERIAL NOT NULL,
    "organizationName" VARCHAR(255) NOT NULL,
    "contactPerson" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentUrl" VARCHAR(500),
    "status" "CollaborationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "repliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaborationPageContent" (
    "id" SERIAL NOT NULL,
    "heroTitle" VARCHAR(500) NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "googleFormUrl" VARCHAR(500) NOT NULL,
    "ctaDescription" TEXT,
    "whyBenefits" JSONB NOT NULL,
    "schemes" JSONB NOT NULL,
    "flowSteps" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollaborationPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Collaboration_status_idx" ON "Collaboration"("status");

-- CreateIndex
CREATE INDEX "Collaboration_email_idx" ON "Collaboration"("email");

-- CreateIndex
CREATE INDEX "Collaboration_createdAt_idx" ON "Collaboration"("createdAt");
