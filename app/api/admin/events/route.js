import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

// ==========================================
// METHOD GET: Mengambil Semua Data Program
// ==========================================
export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        programCategories: {
          include: {
            categoryItem: {
              select: { title: true },
            },
          },
        },
      },
    });

    return NextResponse.json(programs, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/programs ERROR:", err);
    return NextResponse.json(
      { message: "Gagal mengambil data program" },
      { status: 500 }
    );
  }
}

// ==========================================
// METHOD POST: Menyimpan Data Postingan Baru
// ==========================================
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      type = "UMUM",
      description,
      categoryItemIds = [],
      organizerItemIds = [],
      startAt,
      endAt,
      isFlexibleTime,
      location,
      registerLink,
      mapsEmbedSrc,
      poster,
      driveLink,
      youtubeLink,
      instagramLink,
      drivebukuLink,
      tagNames = [],
      isPublished,
    } = body;

    /* ================= CEK KATEGORI (Mencegah Error ID) ================= */
    const validCategoryIds = categoryItemIds.map(Number).filter(id => !isNaN(id));
    const validOrganizerIds = organizerItemIds.map(Number).filter(id => !isNaN(id));

    /* ================= SLUG OTOMATIS ================= */
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slugCount = await prisma.program.count({
      where: { slug: { startsWith: baseSlug } },
    });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

    /* ================= TRANSACTION: CREATE PROGRAM & TAGS ================= */
    // Menggunakan Transaction (Proses berantai persis seperti file Event)
    const program = await prisma.$transaction(async (tx) => {
      
      // 1. Buat Data Program Utama & Sambungkan ke Kategori/Penyelenggara
      const createdProgram = await tx.program.create({
        data: {
          title,
          slug,
          description: description || "",
          type,
          poster,
          isPublished: Boolean(isPublished),
          startAt: startAt ? new Date(startAt) : null,
          endAt: endAt ? new Date(endAt) : null,
          isFlexibleTime: Boolean(isFlexibleTime),
          location,
          registerLink,
          mapsEmbedSrc,
          driveLink,
          youtubeLink,
          instagramLink,
          drivebukuLink,

          // Relasi Kategori
          programCategories: {
            create: validCategoryIds.map((id, idx) => ({
              categoryItemId: id,
              isPrimary: idx === 0,
              order: idx,
            })),
          },

          // Relasi Penyelenggara
          programOrganizers: {
            create: validOrganizerIds.map((id) => ({
              categoryItemId: id,
            })),
          },
        },
      });

      // 2. Proses Tags Satu per Satu (Anti Gagal)
      for (const name of tagNames) {
        if (!name) continue;
        const tagSlug = slugify(name, { lower: true, strict: true });

        // Cari tag, kalau belum ada ya dibikin baru
        const tag = await tx.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name, slug: tagSlug },
        });

        // Sambungkan Tag ke Program
        await tx.programTag.create({
          data: {
            programId: createdProgram.id,
            tagId: tag.id,
          },
        });
      }

      return createdProgram;
    });

    return NextResponse.json(program, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/programs ERROR:", err);
    return NextResponse.json(
      { message: "Gagal membuat program", details: err.message },
      { status: 500 }
    );
  }
}