import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

// ==========================================
// METHOD GET: Ambil 1 Data Berkelana untuk di-Edit
// ==========================================
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);
    
    const post = await prisma.berkelanaPost.findUnique({
      where: { id },
      include: { 
        tags: { include: { tag: true } } 
      },
    });

    if (!post) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("GET by ID Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data", details: error.message }, { status: 500 });
  }
}

// ==========================================
// METHOD PUT: Simpan Hasil Edit (Update)
// ==========================================
export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const body = await req.json();

    const {
      title, description, preview, host, podcaster, 
      poster, instagramLink, youtubeLink, tagNames = [], isPublished,
    } = body;

    // Cek ketersediaan slug baru
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slugCount = await prisma.berkelanaPost.count({
      where: { slug: { startsWith: baseSlug }, id: { not: id } },
    });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

    // Pakai Transaction untuk update
    const updatedPost = await prisma.$transaction(async (tx) => {
      // 1. Hapus relasi tag yang lama
      await tx.berkelanaPostTag.deleteMany({ where: { berkelanaPostId: id } });

      // 2. Update Data Utama
      const post = await tx.berkelanaPost.update({
        where: { id },
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

      // 3. Masukkan tag yang baru/diupdate
      for (const name of tagNames) {
        if (!name) continue;
        const tagSlug = slugify(name, { lower: true, strict: true });
        
        const tag = await tx.tag.upsert({
          where: { slug: tagSlug }, 
          update: {}, 
          create: { name, slug: tagSlug },
        });
        
        await tx.berkelanaPostTag.create({
          data: { berkelanaPostId: id, tagId: tag.id },
        });
      }
      return post;
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ message: "Gagal update data", details: err.message }, { status: 500 });
  }
}

// ==========================================
// METHOD DELETE: Hapus Data Berkelana
// ==========================================
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    
    // Menghapus data berkelanaPost (relasi berkelanaPostTag akan otomatis terhapus jika di schema ada onDelete: Cascade)
    await prisma.berkelanaPost.delete({ where: { id } });
    
    return NextResponse.json({ message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Gagal menghapus data", details: error.message }, { status: 500 });
  }
}