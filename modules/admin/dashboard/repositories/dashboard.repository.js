import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalArticles,
    totalEvents,
    totalMedia,
    totalPrograms,
    totalPlatforms,
    recentArticles,
    recentEvents,
  ] = await Promise.all([
    prisma.article.count({ where: { isDeleted: false } }),
    prisma.event.count(),
    prisma.articleMedia.count(),

    prisma.program.count({
      where: { isPublished: true },
    }),

    prisma.platform.count({
      where: { isActive: true },
    }),

    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        authorName: true,
      },
    }),

    prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        startAt: true,
        isPublished: true,
      },
    }),
  ]);

  return {
    totalContent: totalArticles + totalEvents + totalMedia,

    totalArticles,
    totalEvents,
    totalMedia,

    totalPrograms,
    totalPlatforms,

    recentArticles,
    recentEvents,
  };
}

export async function getArticleAnalytics(range = "weekly") {
  const now = new Date();

  let startDate;

  if (range === "weekly") {
    startDate = new Date(now.setDate(now.getDate() - 7));
  } else if (range === "monthly") {
    startDate = new Date(now.setMonth(now.getMonth() - 1));
  } else {
    startDate = new Date(now.setFullYear(now.getFullYear() - 1));
  }

  const articles = await prisma.article.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      views: true,
    },
  });

  return articles;
}
