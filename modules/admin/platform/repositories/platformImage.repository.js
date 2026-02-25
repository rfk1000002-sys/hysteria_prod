import { prisma } from "../../../../lib/prisma.js";

export async function findImageByPlatformAndKey(platformId, key) {
  const rows = await prisma.$queryRaw`
    SELECT id, "platformId", key, type, label, title, subtitle,
           "imageUrl", "order", "createdAt", "updatedAt"
    FROM "PlatformImage"
    WHERE "platformId" = ${platformId} AND key = ${key}
    LIMIT 1
  `;
  return Array.isArray(rows) ? rows[0] || null : null;
}

export async function listImagesByPlatformId(platformId, type = null) {
  if (type) {
    return prisma.$queryRaw`
      SELECT id, "platformId", key, type, label, title, subtitle,
             "imageUrl", "order", "createdAt", "updatedAt"
      FROM "PlatformImage"
      WHERE "platformId" = ${platformId} AND type = ${type}
      ORDER BY "order" ASC, id ASC
    `;
  }
  return prisma.$queryRaw`
    SELECT id, "platformId", key, type, label, title, subtitle,
           "imageUrl", "order", "createdAt", "updatedAt"
    FROM "PlatformImage"
    WHERE "platformId" = ${platformId}
    ORDER BY "order" ASC, id ASC
  `;
}

export async function upsertImageByKey(platformId, key, data) {
  const hasImageUrl = Object.prototype.hasOwnProperty.call(data || {}, "imageUrl");
  const imageUrl = data?.imageUrl ?? null;
  const title = data?.title ?? null;
  const subtitle = data?.subtitle ?? null;

  const updated = await prisma.$queryRaw`
    UPDATE "PlatformImage"
    SET
      "title"     = COALESCE(${title}, "title"),
      "subtitle"  = COALESCE(${subtitle}, "subtitle"),
      "imageUrl"  = CASE WHEN ${hasImageUrl} THEN ${imageUrl} ELSE "imageUrl" END,
      "updatedAt" = NOW()
    WHERE "platformId" = ${platformId} AND key = ${key}
    RETURNING id, "platformId", key, type, label, title, subtitle,
              "imageUrl", "order", "createdAt", "updatedAt"
  `;

  return Array.isArray(updated) ? updated[0] || null : null;
}
