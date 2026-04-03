const { Client } = require("pg");
const logger = require("../../lib/logger");

/**
 * 020-visitor-stats.js
 * 
 * Mengumpulkan statistik kunjungan dari Article, Event, dan PlatformContent
 * lalu menyimpannya ke tabel VisitorStats sesuai tanggal pembuatannya.
 * Berguna untuk inisialisasi data statistik awal dari data yang sudah ada.
 */
module.exports = async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    logger.warn("DATABASE_URL not set; skipping 020-visitor-stats");
    return;
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  logger.info("020: Seeding VisitorStats using pg...");

  try {
    // 1. Ambil artikel yang memiliki views > 0
    const { rows: articleRows } = await client.query('SELECT "createdAt", "views" FROM "Article" WHERE "views" > 0');
    // 2. Ambil event yang memiliki views > 0
    const { rows: eventRows } = await client.query('SELECT "createdAt", "views" FROM "Event" WHERE "views" > 0');
    // 3. Ambil platform contents yang memiliki views > 0
    const { rows: platformRows } = await client.query('SELECT "createdAt", "views" FROM "PlatformContent" WHERE "views" > 0');

    const statsMap = {};

    const processRows = (rows, field) => {
      rows.forEach(row => {
        const d = new Date(row.createdAt);
        d.setHours(0, 0, 0, 0); // Reset jam ke 00:00:00 untuk grouping harian
        const iso = d.toISOString();
        if (!statsMap[iso]) {
          statsMap[iso] = { date: d, article: 0, event: 0, platform: 0 };
        }
        statsMap[iso][field] += row.views || 0;
      });
    };

    processRows(articleRows, "article");
    processRows(eventRows, "event");
    processRows(platformRows, "platform");

    const entries = Object.keys(statsMap);
    logger.info(`  Upserting ${entries.length} daily stats records...`);

    for (const iso in statsMap) {
      const s = statsMap[iso];
      await client.query(
        `INSERT INTO "VisitorStats" ("date", "articleViews", "eventViews", "platformViews", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT ("date") DO UPDATE SET
           "articleViews" = EXCLUDED."articleViews",
           "eventViews" = EXCLUDED."eventViews",
           "platformViews" = EXCLUDED."platformViews",
           "updatedAt" = NOW()`,
        [s.date, s.article, s.event, s.platform]
      );
    }

    logger.info("020: VisitorStats seed complete");
  } catch (e) {
    logger.error("020 seeder error:", { error: e.message });
    throw e;
  } finally {
    await client.end();
  }
};
