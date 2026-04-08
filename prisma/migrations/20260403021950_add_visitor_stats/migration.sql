-- CreateTable
CREATE TABLE "VisitorStats" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "articleViews" INTEGER NOT NULL DEFAULT 0,
    "eventViews" INTEGER NOT NULL DEFAULT 0,
    "platformViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorStats_date_key" ON "VisitorStats"("date");

-- CreateIndex
CREATE INDEX "VisitorStats_date_idx" ON "VisitorStats"("date");
