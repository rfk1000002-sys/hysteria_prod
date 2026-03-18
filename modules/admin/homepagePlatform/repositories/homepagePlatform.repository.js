import { prisma } from "../../../../lib/prisma.js";

export function findHomepagePlatformCards() {
  return prisma.homepagePlatformCard.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      platform: {
        select: {
          id: true,
          slug: true,
          name: true,
          mainImageUrl: true,
          isActive: true,
        },
      },
    },
  });
}

export function listPlatformOptions() {
  return prisma.platform.findMany({
    where: { isActive: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      mainImageUrl: true,
    },
  });
}

export function replaceHomepagePlatformCards(cards) {
  return prisma.$transaction(async (tx) => {
    await tx.homepagePlatformCard.deleteMany({});
    if (cards.length > 0) {
      await tx.homepagePlatformCard.createMany({
        data: cards,
      });
    }

    return tx.homepagePlatformCard.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: {
        platform: {
          select: {
            id: true,
            slug: true,
            name: true,
            mainImageUrl: true,
            isActive: true,
          },
        },
      },
    });
  });
}
