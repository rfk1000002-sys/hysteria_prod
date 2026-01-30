-- CreateTable
CREATE TABLE "ContactSection" (
    "id" SERIAL NOT NULL,
    "mapsEmbedUrl" TEXT NOT NULL,
    "locationTitle" VARCHAR(255) NOT NULL,
    "locationAddress" TEXT NOT NULL,
    "operationalHours" TEXT NOT NULL,
    "whatsappNumber" VARCHAR(50) NOT NULL,
    "instagramUrl" VARCHAR(500),
    "twitterUrl" VARCHAR(500),
    "facebookUrl" VARCHAR(500),
    "linkedinUrl" VARCHAR(500),
    "youtubeUrl" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSection_pkey" PRIMARY KEY ("id")
);
