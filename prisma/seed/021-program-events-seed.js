const { Client } = require("pg");
const logger = require("../../lib/logger");

/**
 * 018-program-events-seed.js — generated seed
 * Khusus untuk mengisi data Program Hysteria ke dalam tabel Event
 */

// ——— Helpers —————————————————————————————————————————————————————————
const addWeeks = (base, n) => new Date(+base + n * 7 * 24 * 3600 * 1000);

function gen({ label, slugPrefix, topics, categoryItemSlugs, organizerSlugs, tagSlugs = [],
               baseDate, intervalWeeks = 4, location = "Semarang", durationHours = 3 }) {
  return topics.map((topic, i) => {
    const n       = i + 1;
    const startAt = addWeeks(baseDate, i * intervalWeeks);
    const endAt   = durationHours ? new Date(+startAt + durationHours * 3600 * 1000) : null;
    const slug    = `${slugPrefix}-${n}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    return {
      title: `${label} #${n} — ${topic}`,
      slug,
      description: `Ini adalah deskripsi dummy untuk program ${label} edisi ke-${n} dengan tema ${topic}. Acara ini diinisiasi oleh Kolektif Hysteria untuk merespon isu-isu urban dan kebudayaan lokal di Semarang.`,
      poster: `https://picsum.photos/seed/${slugPrefix}-${n}/800/1000`, // Rasio 4:5
      startAt,
      endAt,
      isFlexibleTime: false,
      location,
      mapsEmbedSrc: null,
      registerLink: null,
      driveLink: null,
      youtubeLink: null,
      instagramLink: null,
      drivebukuLink: null,
      isPublished: true,
      categoryItemSlugs, // Sub kategori spesifik
      organizerSlugs,    // Pasti Hysteria
      tagSlugs,
    };
  });
}

// ——— Kumpulan Topik per Kategori ——————————————————————————————————————
const FESTIVAL_KAMPUNG_DATA = [
  { slug: "gebyuran-bustaman", name: "Gebyuran Bustaman", topics: ["Tradisi Air Bustaman", "Perayaan Jelang Ramadhan", "Seni Partisipatoris Warga"] },
  { slug: "nginguk-githok", name: "Nginguk Githok", topics: ["Refleksi Masa Lalu", "Pameran Arsip Kampung", "Zine Warga"] },
  { slug: "festival-bukit-jatiwayang", name: "Festival Bukit Jatiwayang", topics: ["Mitos dan Lanskap", "Kesenian Lereng", "Pasar Budaya"] },
  { slug: "sobo-roworejo", name: "Sobo Roworejo", topics: ["Menyusuri Rawa", "Pameran Tepi Air", "Susur Kampung"] },
  { slug: "srawung-sendang", name: "Srawung Sendang", topics: ["Mata Air Kehidupan", "Ritual dan Seni Kontemporer"] },
  { slug: "festival-ngijo", name: "Festival Ngijo", topics: ["Menghijaukan Ingatan", "Seni Ekologis"] },
  { slug: "banyu-pitu", name: "Banyu Pitu", topics: ["Tujuh Sumber Air", "Kirab Budaya"] },
  { slug: "bulusan-fest", name: "Bulusan Fest", topics: ["Bulus dan Mitos Lokal", "Panggung Rakyat"] },
  { slug: "labuhan-kali", name: "Labuhan Kali", topics: ["Merawat Sungai", "Instalasi Bambu"] },
  { slug: "iki-buntu-fest", name: "Iki Buntu Fest", topics: ["Jalan Buntu Tak Mati", "Mural Gang Sempit"] },
  { slug: "festival-ke-tugu", name: "Festival ke Tugu", topics: ["Jejak Sejarah Tugu", "Pasar Tiban"] }
];

const FESTIVAL_KOTA_DATA = [
  { slug: "zine-fest", name: "Zine Fest", topics: ["Jejaring Cetak Mandiri", "Pameran Zine Alternatif", "Workshop Zine"] },
  { slug: "semarang-writers-week", name: "Semarang Writers Week", topics: ["Sastra Kota", "Menulis Semarang", "Bincang Penulis"] },
  { slug: "city-canvas", name: "City Canvas", topics: ["Mural Ruang Publik", "Graffiti Jam"] },
  { slug: "dokumentaria", name: "Dokumentaria", topics: ["Arsip Visual Semarang", "Pameran Fotografi Jalanan"] }
];

const BIENNALE_DATA = [
  { slug: "pentak-labs", name: "Pentak Labs", topics: ["Eksperimentasi Ruang", "Inkubasi Seniman Muda", "Open Studio"] },
  { slug: "tengok-bustaman", name: "Tengok Bustaman", topics: ["Biennale Kampung", "Seni di Tengah Pemukiman", "Pameran Lorong"] }
];

const FORUM_DATA = [
  { slug: "temu-jejaring", name: "Temu Jejaring", topics: ["Konsolidasi Kolektif", "Pemetaan Ruang Seni", "Sinergi Komunitas"] },
  { slug: "buah-tangan", name: "Buah Tangan", topics: ["Oleh-Oleh Pemikiran", "Bincang Kritis"] },
  { slug: "lawatan-jalan-terus", name: "Lawatan Jalan Terus", topics: ["Safari Ruang Alternatif", "Diskusi Lintas Kota"] },
  { slug: "simposium", name: "Simposium", topics: ["Masa Depan Seni Urban", "Kebijakan Ruang Publik"] },
  { slug: "meditasi", name: "Meditasi", topics: ["Jeda di Tengah Kota", "Seni dan Kesadaran"] }
];

const MUSIC_DATA = [
  { slug: "sgrt", name: "SGRT", topics: ["Gigs Kolektif", "Suara Pinggiran"] },
  { slug: "kotak-listrik", name: "Kotak Listrik", topics: ["Eksperimen Elektronik", "Noise dan Distorsi"] },
  { slug: "die-gital", name: "Di(e)gital", topics: ["Chiptune Night", "Visual dan Bebunyian"] },
  { slug: "bunyi-halaman-belakang", name: "Bunyi Halaman Belakang", topics: ["Akustikan Sore", "Sesi Intim"] },
  { slug: "folk-me-up", name: "Folk Me Up", topics: ["Folk dan Balada", "Nyanyian Alam"] }
];

const RESIDENSI_DATA = [
  { slug: "flash-residency", name: "Flash Residency", topics: ["Satu Bulan Berkarya", "Respon Cepat Isu Lokal", "Presentasi Akhir"] },
  { slug: "kandang-tandang", name: "Kandang Tandang", topics: ["Pertukaran Seniman Lintas Kota", "Menetap dan Menyerap"] }
];

const PODCAST_DATA = [
  { slug: "safari-memori", name: "Safari Memori", topics: ["Merekam Ingatan Warga", "Sejarah Trem Semarang", "Bangunan Tua"] },
  { slug: "aston", name: "Aston", topics: ["Anak Stonen Menggugat", "Obrolan Santai Tongkrongan"] },
  { slug: "sore-di-stonen", name: "Sore di Stonen", topics: ["Bincang Senja", "Menyikapi Isu Terkini"] }
];

const FILM_DATA = [
  { slug: "screening-am-film", name: "Screening AM", topics: ["Pemutaran Film Alternatif", "Sineas Lokal Berbicara", "Sinema dan Kota"] },
  { slug: "lawatan-bandeng-keliling-film", name: "Lawatan Bandeng Keliling", topics: ["Layar Tancap Kampung", "Sinema Masuk Gang"] }
];

const VIDEO_SERIES_DATA = [
  { slug: "sapa-warga", name: "Sapa Warga", topics: ["Dokumenter Interaksi Lokal", "Potret Warga Kota"] },
  { slug: "hysteria-berkelana", name: "Hysteria Berkelana", topics: ["Jejak Kolektif", "Perjalanan Ruang Seni"] }
];

// ——— Setup Organizer —————————————————————————————————————————————————
// 💡 TIPS: Jika muncul peringatan kuning "Kategori program-hysteria tidak ditemukan",
// itu artinya slug Hysteria di DB Mas Uqy berbeda (Mungkin 'hysteria' atau 'hysteria-artlab').
// Ganti nilai di bawah ini dengan slug yang tepat jika diperlukan.
const ORGANIZER_HYSTERIA = "Hysteria";

// ——— Runner ——————————————————————————————————————————————————————————
module.exports = async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    logger.warn("DATABASE_URL not set; skipping 018-program-events-seed");
    return;
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  console.log("🎬 Seeding Data Program Hysteria (Festival, Forum, Musik, dll)...");

  try {
    await client.query("BEGIN");

    // 1. Kumpulkan semua Event Generator
    let allEvents = [];
    const baseDate = new Date("2023-01-01T10:00:00+07:00");

    const categoriesList = [
      FESTIVAL_KAMPUNG_DATA, FESTIVAL_KOTA_DATA, BIENNALE_DATA, 
      FORUM_DATA, MUSIC_DATA, RESIDENSI_DATA, PODCAST_DATA, 
      FILM_DATA, VIDEO_SERIES_DATA
    ];

    categoriesList.forEach((catGroup, groupIdx) => {
      catGroup.forEach((subCat, idx) => {
        allEvents = allEvents.concat(
          gen({
            label: subCat.name,
            slugPrefix: subCat.slug,
            topics: subCat.topics,
            categoryItemSlugs: [subCat.slug], // Relasi ke Sub Kategori Spesifik
            organizerSlugs: [ORGANIZER_HYSTERIA],
            baseDate: addWeeks(baseDate, (groupIdx * 10) + idx), // Tanggal disebar
          })
        );
      });
    });

    // 2. Preload CategoryItem slug -> id
    const allCatSlugs = [...new Set(allEvents.flatMap((e) => [...e.categoryItemSlugs, ...e.organizerSlugs]))];
    const catRows = await client.query(`SELECT id, slug FROM "CategoryItem" WHERE slug = ANY($1::text[])`, [allCatSlugs]);
    
    const catIdMap = {};
    for (const row of catRows.rows) catIdMap[row.slug] = row.id;

    for (const slug of allCatSlugs) {
      if (!catIdMap[slug]) console.warn(`  ⚠️ Kategori '${slug}' tidak ditemukan di DB. Dilewati.`);
    }

    // 3. Insert Events (KOLOM TYPE SUDAH DIHAPUS)
    let count = 0;
    for (const ev of allEvents) {
      const evRes = await client.query(
        `INSERT INTO "Event" (
           title, slug, description, poster, "startAt", "endAt", "isFlexibleTime",
           location, "mapsEmbedSrc", "registerLink", "driveLink", "youtubeLink", "instagramLink", "drivebukuLink",
           "isPublished", "createdAt", "updatedAt"
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,now(),now()
         )
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [
          ev.title, ev.slug, ev.description, ev.poster, ev.startAt, ev.endAt ?? null, ev.isFlexibleTime,
          ev.location, ev.mapsEmbedSrc, ev.registerLink, ev.driveLink, ev.youtubeLink, ev.instagramLink, ev.drivebukuLink,
          ev.isPublished
        ]
      );

      // Jika slug sudah ada (DO NOTHING), lewati relasinya
      if (evRes.rows.length === 0) continue; 
      
      const eventId = evRes.rows[0].id;
      count++;

      // Relasi Kategori (EventCategory)
      for (let i = 0; i < ev.categoryItemSlugs.length; i++) {
        const catId = catIdMap[ev.categoryItemSlugs[i]];
        if (catId) {
          await client.query(
            `INSERT INTO "EventCategory" ("eventId", "categoryItemId", "isPrimary", "order") VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
            [eventId, catId, i === 0, i]
          );
        }
      }

      // Relasi Organizer (EventOrganizer) -> Hysteria
      for (const orgSlug of ev.organizerSlugs) {
        const orgId = catIdMap[orgSlug];
        if (orgId) {
          await client.query(
            `INSERT INTO "EventOrganizer" ("eventId","categoryItemId") VALUES ($1,$2) ON CONFLICT DO NOTHING`,
            [eventId, orgId]
          );
        }
      }
    }

    await client.query("COMMIT");
    console.log(`\n✅ Program events berhasil disemai — ${count} data berhasil dimasukkan!`);
  } catch (e) {
    await client.query("ROLLBACK");
    logger.error("018 seeder error:", { error: e.message, stack: e.stack });
    throw e;
  } finally {
    await client.end();
  }
};