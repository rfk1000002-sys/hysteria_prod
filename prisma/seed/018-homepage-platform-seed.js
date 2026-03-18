const logger = require("../../lib/logger");
const { prisma } = require("../../lib/prisma");

module.exports = async function seedHomepagePlatformCards() {
  try {
    const existing = await prisma.homepagePlatformCard.count();
    if (existing > 0) {
      logger.info("HomepagePlatformCard seed: already exists, skipping");
      return;
    }

    const platforms = await prisma.platform.findMany({ where: { isActive: true }, orderBy: [{ name: "asc" }], take: 5 });
    if (!platforms || platforms.length === 0) {
      logger.warn("No active platforms found to seed homepage cards");
      return;
    }

    const cards = platforms.map((p, idx) => ({
      platformId: p.id,
      titleOverride: null,
      imageUrlOverride: null,
      linkUrl: null,
      slotType: idx < 3 ? "tall" : "short",
      order: idx,
      isActive: true,
    }));

    await prisma.homepagePlatformCard.createMany({ data: cards });
    logger.info("Seeded homepagePlatformCard with", { count: cards.length });
  } catch (err) {
    logger.error("Error seeding homepage platform cards", { error: err && (err.stack || err.message) });
    throw err;
  }
};
