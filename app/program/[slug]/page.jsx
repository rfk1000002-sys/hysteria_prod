// app/program/[slug]/page.jsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import ProgramHero from "@/components/program-detail/ProgramHero";
import ProgramPostsSection from "@/components/program-detail/ProgramPostsSection.client";
import DefaultProgramView from "@/components/program-detail/DefaultProgramView.client";

const VALID_SLUGS = [
  'festival-kampung', 'festival-kota', 'festival-biennale', 
  'forum', 'music', 'pemutaran-film', 
  'flash-residency', 'kandang-tandang', 'safari-memori',
  'aston', 'sore-di-stonen', 'sapa-warga', 'hysteria-berkelana'
];

const slugToDbKey = {
  'festival-kampung': 'festivalKampung',
  'festival-kota': 'festivalKota',
  'festival-biennale': 'biennale',
  'forum': 'forum',
  'music': 'musik',
  'pemutaran-film': 'pemutaranFilm',
  'flash-residency': 'flashResidency',
  'kandang-tandang': 'kandangTandang',
  'safari-memori': 'safariMemori',
  'aston': 'aston', 
  'sore-di-stonen': 'soreDiStonen', 
  'sapa-warga': 'sapaWarga',
  'hysteria-berkelana': 'hysteriaBerkelana'
};

export default async function ProgramDetailPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const rawSlug = resolvedParams.slug;
  const actualSlug = Array.isArray(rawSlug) ? rawSlug[rawSlug.length - 1] : rawSlug;

  if (!VALID_SLUGS.includes(actualSlug)) {
    return notFound();
  }

  // ==========================================================
  // AMBIL DATA HERO DARI DATABASE PRISMA
  // ==========================================================
  const settings = await prisma.pageProgram.findUnique({
    where: { pageSlug: "program" },
  });

  const slugHerosData = settings?.slugHeros || {};
  const dbKey = slugToDbKey[actualSlug]; 
  const heroData = slugHerosData[dbKey] || null;

  // ==========================================================
  // KONDISI 1: JIKA USER MEMBUKA HALAMAN HYSTERIA BERKELANA
  // ==========================================================
  if (actualSlug === 'hysteria-berkelana') {
    const q = resolvedSearchParams?.q ?? "";
    const page = Number(resolvedSearchParams?.page ?? 1);
    const itemsPerPage = 6; 
    
    // 1. Buat Filter Pencarian Langsung ke Tabel BerkelanaPost
    const whereClause = {
      isPublished: true,
      // Fitur Search (Jika ada inputan di search bar)
      ...(q ? { title: { contains: q, mode: 'insensitive' } } : {})
    };

    // 2. Hitung Total Data & Halaman dari BerkelanaPost
    const totalItems = await prisma.berkelanaPost.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    // 3. Tarik Data dari Tabel BerkelanaPost
    const dbPosts = await prisma.berkelanaPost.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    // 4. Format Data Agar Cocok dengan Komponen (Lebih rapi tanpa split string!)
    const formattedPosts = dbPosts.map(post => {
      return {
        id: post.id,
        title: post.title,
        slug: actualSlug, 
        thumbnailUrl: post.poster || "/image/default-placeholder.png",
        heading: post.title,
        // Langsung ambil kolom preview dari database!
        shortText: post.preview || (post.description ? post.description.substring(0, 80) + "..." : ""), 
      };
    });

    return (
      <main className="min-h-screen bg-white">
        <ProgramHero 
          title={heroData?.title || "Hysteria Berkelana"} 
          subtitle={heroData?.subtitle || "Jelajah dan Dokumentasi"} 
          heroImage={heroData?.image} 
        />
        <ProgramPostsSection
          programSlug={actualSlug} 
          posts={formattedPosts}      // 👉 Lempar data yang sudah diolah
          totalPages={totalPages}     // 👉 Lempar jumlah halaman
        />
      </main>
    );
  }

  // ==========================================================
  // KONDISI 2: DEFAULT PROGRAM (Selain Berkelana)
  // ==========================================================
  return <DefaultProgramView actualSlug={actualSlug} heroData={heroData} />;
}