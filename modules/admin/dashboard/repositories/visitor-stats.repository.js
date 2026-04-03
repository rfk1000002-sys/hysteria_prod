import { prisma } from "@/lib/prisma";

/**
 * Mendapatkan awal hari untuk tanggal tertentu dalam format Date (Asia/Jakarta +7)
 */
function getStartOfDay(date = new Date()) {
  const JKT_OFFSET = 7 * 60 * 60 * 1000;
  // Geser ke JKT
  const jktDate = new Date(date.getTime() + JKT_OFFSET);
  // Atur ke tengah malam UTC (yang sekarang mewakili tengah malam JKT)
  jktDate.setUTCHours(0, 0, 0, 0);
  // Kembalikan ke UTC absolut untuk disimpan di database
  return new Date(jktDate.getTime() - JKT_OFFSET);
}

/**
 * Increment statistik pengunjung harian
 * @param {'article' | 'event' | 'platform'} type 
 */
export async function incrementDailyStats(type) {
  const today = getStartOfDay();
  const fieldMap = {
    article: "articleViews",
    event: "eventViews",
    platform: "platformViews",
  };

  const field = fieldMap[type];
  if (!field) return;

  try {
    return await prisma.visitorStats.upsert({
      where: { date: today },
      update: {
        [field]: { increment: 1 },
      },
      create: {
        date: today,
        [field]: 1,
      },
    });
  } catch (error) {
    console.error("FAILED TO INCREMENT DAILY STATS:", error);
  }
}
