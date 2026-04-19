import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

// ==========================================
// METHOD GET: Ambil Semua Data Berkelana
// ==========================================
export async function GET() {
  try {
    const posts = await prisma.berkelanaPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tags: { include: { tag: true } },
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data", details: error.message }, { status: 500 });
  }
}

// ==========================================
// METHOD POST: Buat Postingan Berkelana Baru
// ==========================================
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title, description, preview, host, podcaster, 
      poster, instagramLink, youtubeLink, tagNames = [], isPublished,
    } = body;

    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slugCount = await prisma.berkelanaPost.count({
      where: { slug: { startsWith: baseSlug } },
    });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

    // Simpan data & relasi tags pakai Transaction
    const newPost = await prisma.$transaction(async (tx) => {
      // 1. Buat data post utama
      const post = await tx.berkelanaPost.create({
        data: {
          title, 
          slug, 
          description: description || "", 
          preview, 
          host, 
          podcaster,
          poster, 
          instagramLink, 
          youtubeLink, 
          isPublished: Boolean(isPublished),
        },
      });

      // 2. Proses Tags (Buat baru jika belum ada, lalu hubungkan)
      for (const name of tagNames) {
        if (!name) continue;
        const tagSlug = slugify(name, { lower: true, strict: true });
        
        const tag = await tx.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name, slug: tagSlug },
        });
        
        await tx.berkelanaPostTag.create({
          data: { berkelanaPostId: post.id, tagId: tag.id },
        });
      }
      return post;
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan data", details: error.message }, { status: 500 });
  }
}