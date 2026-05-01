const { Client } = require("pg");
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const logger = require("../../lib/logger");

module.exports = async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    logger.warn("DATABASE_URL not set; skipping data-hysteria");
    return;
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  const results = [];
  const csvFilePath = path.join(__dirname, 'events_final.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error(`Error: File tidak ditemukan di ${csvFilePath}`);
    await client.end();
    return;
  }

  console.log('Mulai proses seeding (Event + Relasi) dengan Bypass Constraint...');

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('error', reject)
      .on('end', resolve);
  });

  let suksesEvent = 0;
  let suksesRelasi = 0;

  try {
    await client.query("BEGIN");

    console.log("Menyinkronkan ulang penghitung ID otomatis...");
    await client.query(`
      SELECT setval(
        pg_get_serial_sequence('"Event"', 'id'), 
        (SELECT COALESCE(MAX(id), 1) FROM "Event")
      );
    `);
    
    // TAHAP 1: KAMUS KATEGORI & ORGANIZER
    const catRes = await client.query(`SELECT id, slug FROM "CategoryItem"`);
    const dbCategories = {};
    catRes.rows.forEach(row => { 
      dbCategories[row.slug] = row.id; 
    });

    for (const row of results) {
      // TAHAP 2: INSERT / UPDATE EVENT
      const resEvent = await client.query(
        `INSERT INTO "Event" (
          title, slug, description, poster, "startAt", "endAt", "createdAt", "updatedAt",
          location, "mapsEmbedSrc", "registerLink", "isPublished", "isFlexibleTime",
          "driveLink", "youtubeLink", "drivebukuLink", "instagramLink", "instagramLiveLink", 
          "tiktokLiveLink", "youtubeLiveLink", views
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
        )
        ON CONFLICT (slug) DO UPDATE SET 
          title = EXCLUDED.title,
          description = EXCLUDED.description
        RETURNING id`,
        [
          row.title || 'Untitled', row.slug, row.description || null, row.poster || null,
          row.startAt ? new Date(row.startAt) : new Date(), row.endAt ? new Date(row.endAt) : null,
          row.createdAt ? new Date(row.createdAt) : new Date(), row.updatedAt ? new Date(row.updatedAt) : new Date(),
          row.location || null, row.mapsEmbedSrc || null, row.registerLink || null,
          String(row.isPublished).toLowerCase() === 'true', String(row.isFlexibleTime).toLowerCase() === 'true',
          row.driveLink || null, row.youtubeLink || null, row.drivebukuLink || null,
          row.instagramLink || null, row.instagramLiveLink || null, row.tiktokLiveLink || null,
          row.youtubeLiveLink || null, Number(row.views) || 0
        ]
      );

      const eventId = resEvent.rows[0].id;
      suksesEvent++;

      // TAHAP 3: RELASI CATEGORY (Cek manual sebelum insert)
      if (row.category_slugs) {
        const catSlugs = row.category_slugs.split(',');
        let isPrimary = true; 

        for (const slug of catSlugs) {
          const cleanSlug = slug.trim();
          const catId = dbCategories[cleanSlug]; 
          
          if (catId) {
            const checkCat = await client.query(`SELECT 1 FROM "EventCategory" WHERE "eventId" = $1 AND "categoryItemId" = $2`, [eventId, catId]);
            if (checkCat.rows.length === 0) {
              await client.query(`INSERT INTO "EventCategory" ("eventId", "categoryItemId", "isPrimary", "order") VALUES ($1, $2, $3, 0)`, [eventId, catId, isPrimary]);
              suksesRelasi++;
            }
            isPrimary = false; 
          }
        }
      }

      // TAHAP 4: RELASI ORGANIZER (Cek manual sebelum insert)
      if (row.organizer_slugs) {
        const orgSlugs = row.organizer_slugs.split(',');
        
        for (const slug of orgSlugs) {
          const cleanSlug = slug.trim();
          const orgId = dbCategories[cleanSlug]; 
          
          if (orgId) {
            const checkOrg = await client.query(`SELECT 1 FROM "EventOrganizer" WHERE "eventId" = $1 AND "categoryItemId" = $2`, [eventId, orgId]);
            if (checkOrg.rows.length === 0) {
              await client.query(`INSERT INTO "EventOrganizer" ("eventId", "categoryItemId") VALUES ($1, $2)`, [eventId, orgId]);
              suksesRelasi++;
            }
          }
        }
      }

      // =====================================================================
      // TAHAP 5: RELASI TAGS (Cek manual untuk Tag dan EventTag)
      // =====================================================================
      if (row.tag_names) {
        const tags = row.tag_names.split(',');
        for (const tag of tags) {
          const cleanTag = tag.trim();
          if (!cleanTag) continue;

          // BIKIN SLUG OTOMATIS
          const tagSlug = cleanTag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

          let tagId;
          
          // PERBAIKAN: Cek ketersediaan berdasarkan SLUG, bukan Name
          const checkTag = await client.query(`SELECT id FROM "Tag" WHERE slug = $1`, [tagSlug]);
          
          if (checkTag.rows.length > 0) {
            // Jika slug sudah ada, gunakan ID-nya
            tagId = checkTag.rows[0].id;
          } else {
            // Jika slug belum ada, baru kita masukkan ke database
            const newTag = await client.query(
              `INSERT INTO "Tag" (name, slug) VALUES ($1, $2) RETURNING id`, 
              [cleanTag, tagSlug]
            );
            tagId = newTag.rows[0].id;
          }
          
          // Cek apakah relasi EventTag sudah ada
          const checkEventTag = await client.query(
            `SELECT 1 FROM "EventTag" WHERE "eventId" = $1 AND "tagId" = $2`, 
            [eventId, tagId]
          );
          if (checkEventTag.rows.length === 0) {
            await client.query(
              `INSERT INTO "EventTag" ("eventId", "tagId") VALUES ($1, $2)`, 
              [eventId, tagId]
            );
          }
        }
      }
    }

    await client.query("COMMIT");
    console.log(`🎉 Seeding selesai! Diproses: ${suksesEvent} Event, ${suksesRelasi} Relasi tersambung.`);
  } catch (e) {
    await client.query("ROLLBACK");
    logger.error("Seeder error:", { error: e.message, stack: e.stack });
    throw e;
  } finally {
    await client.end();
  }
};