import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  // data total konten
  const [
    totalArticles,
    totalEvents,
    totalMedia,
    totalPrograms,
    totalPlatformContents,
    recentArticles,
    recentEvents,
  ] = await Promise.all([
    prisma.article.count({ where: { isDeleted: false } }),
    prisma.event.count(),
    prisma.articleMedia.count(),

    prisma.program.count({
      where: { isPublished: true },
    }),

    prisma.platformContent.count({
      where: { isActive: true },
    }),

    // data recent articles, show 5 datas
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

    // data recent events, show 5 datas
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
    totalContent:
      totalArticles + totalEvents + totalMedia + totalPlatformContents,

    totalArticles,
    totalEvents,
    totalMedia,

    totalPrograms,
    totalPlatformContents,

    recentArticles,
    recentEvents,
  };
}

export async function getDashboardAnalytics(range = "weekly") {
  const now = new Date();
  let startDate = new Date();

  const statsMap = {};
  
  // Helper to format date to YYYY-MM-DD in Asia/Jakarta (+7)
  const formatLocal = (d) => {
    const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    return local.toISOString().split("T")[0];
  };

  let formatKey; // date or hour

  if (range === "weekly") {
    startDate.setDate(now.getDate() - 7);
    formatKey = formatLocal;
    // Initialize 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = formatLocal(d);
      statsMap[label] = {
        label,
        article: 0,
        event: 0,
        platform: 0,
        rawDate: d,
      };
    }
  } else if (range === "monthly") {
    startDate.setMonth(now.getMonth() - 1);
    formatKey = formatLocal;
    // Initialize 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const label = formatLocal(d);
      statsMap[label] = {
        label,
        article: 0,
        event: 0,
        platform: 0,
        rawDate: d,
      };
    }
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
    formatKey = (d) => {
      const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);
      return local.toISOString().slice(0, 7); // YYYY-MM
    };
    // Initialize 12 months
    for (let i = 0; i < 12; i++) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i);
      const label = formatKey(d);
      statsMap[label] = {
        label,
        article: 0,
        event: 0,
        platform: 0,
        rawDate: d,
      };
    }
  }

  // Fetch BOTH sources to provide historical baseline + live tracking
  try {
    const [stats] = await Promise.all([
      prisma.visitorStats.findMany({
        where: { date: { gte: startDate } },
        orderBy: { date: "asc" },
      }),
    ]);

    // Process Live Stats (VisitorStats)
    stats.forEach((item) => {
      const label = formatKey(item.date);
      if (statsMap[label]) {
        statsMap[label].article += item.articleViews || 0;
        statsMap[label].event += item.eventViews || 0;
        statsMap[label].platform += item.platformViews || 0;
      }
    });

  } catch (err) {
    console.error("ANALYTICS FETCH ERROR DEEP:", err);
    throw err; // Let's throw it so it cascades or logs properly
  }

  // Convert map to sorted array by label (YYYY-MM-DD)
  return Object.values(statsMap).sort((a, b) => a.label.localeCompare(b.label));
}
