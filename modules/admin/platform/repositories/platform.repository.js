import { prisma } from "../../../../lib/prisma.js";

export async function findPlatformBySlug(slug) {
  const rows = await prisma.$queryRaw`
    SELECT id, slug, name, headline, "subHeadline",
           instagram, youtube, "youtubeProfile", "mainImageUrl", "isActive",
           "createdAt", "updatedAt"
    FROM "Platform"
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return Array.isArray(rows) ? rows[0] || null : null;
}

export async function findPlatformBySlugWithImages(slug) {
  const platform = await findPlatformBySlug(slug);
  if (!platform) return null;

  const images = await prisma.$queryRaw`
    SELECT id, "platformId", key, type, label, title, subtitle,
           "imageUrl", "order", "createdAt", "updatedAt"
    FROM "PlatformImage"
    WHERE "platformId" = ${platform.id}
    ORDER BY "order" ASC, id ASC
  `;

  return { ...platform, images: Array.isArray(images) ? images : [] };
}

export async function listAllPlatforms(onlyActive = true) {
  if (onlyActive) {
    return prisma.$queryRaw`
      SELECT id, slug, name, headline, "subHeadline",
             instagram, youtube, "youtubeProfile", "mainImageUrl", "isActive",
             "createdAt", "updatedAt"
      FROM "Platform"
      WHERE "isActive" = true
      ORDER BY id ASC
    `;
  }
  return prisma.$queryRaw`
    SELECT id, slug, name, headline, "subHeadline",
           instagram, youtube, "youtubeProfile", "mainImageUrl", "isActive",
           "createdAt", "updatedAt"
    FROM "Platform"
    ORDER BY id ASC
  `;
}

export async function upsertPlatformBySlug(slug, data) {
  const headline = data?.headline ?? null;
  const subHeadline = data?.subHeadline ?? null;
  const instagram = data?.instagram ?? null;
  const youtube = data?.youtube ?? null;
  const youtubeProfile = data?.youtubeProfile ?? null;
  const hasMainImageUrl = Object.prototype.hasOwnProperty.call(data || {}, "mainImageUrl");
  const mainImageUrl = data?.mainImageUrl ?? null;

  const updated = await prisma.$queryRaw`
    UPDATE "Platform"
    SET
      "headline"       = COALESCE(${headline}, "headline"),
      "subHeadline"    = COALESCE(${subHeadline}, "subHeadline"),
      "instagram"      = COALESCE(${instagram}, "instagram"),
      "youtube"        = COALESCE(${youtube}, "youtube"),
      "youtubeProfile" = COALESCE(${youtubeProfile}, "youtubeProfile"),
      "mainImageUrl"   = CASE WHEN ${hasMainImageUrl} THEN ${mainImageUrl} ELSE "mainImageUrl" END,
      "updatedAt"      = NOW()
    WHERE slug = ${slug}
    RETURNING id, slug, name, headline, "subHeadline",
              instagram, youtube, "youtubeProfile", "mainImageUrl", "isActive",
              "createdAt", "updatedAt"
  `;

  return Array.isArray(updated) ? updated[0] || null : null;
}
