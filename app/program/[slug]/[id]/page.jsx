// app/program/[slug]/[id]/page.jsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import PostDetailSection from "@/components/program-post-detail/PostDetailSection";
import OtherReviewsSection from "@/components/program-post-detail/OtherReviewsSection";
import DefaultProgramPostDetailView from "@/components/program-post-detail/DefaultProgramPostDetailView";

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

export default async function ProgramPostDetailPage({ params }) {
  const resolvedParams = await params;
  const { slug, id } = resolvedParams;
  const postId = Number(id);

  const settings = await prisma.pageProgram.findUnique({
    where: { pageSlug: "program" },
  });
  
  const dbKey = slugToDbKey[slug] || 'hysteriaBerkelana';
  const heroData = settings?.slugHeros?.[dbKey] || null;
  const detailHeroData = settings?.slugHeros?.detail || null; 

  // ==========================================================
  // KONDISI 1: HYSTERIA BERKELANA 
  // ==========================================================
  if (slug === 'hysteria-berkelana') {
    
    // 👉 KITA GANTI KE TABEL BERKELANA
    const currentPost = await prisma.berkelanaPost.findUnique({
      where: { id: postId },
      include: { tags: { include: { tag: true } } }
    });

    if (!currentPost || !currentPost.isPublished) return notFound();

    // 👉 KITA GANTI KE TABEL BERKELANA (Tanpa filter eventCategories)
    const otherPostsFromDb = await prisma.berkelanaPost.findMany({
      where: {
        isPublished: true,
        id: { not: postId }, 
      },
      orderBy: { createdAt: "desc" },
      take: 8, 
    });

    // 👉 PARSING DATA LEBIH BERSIH (Tanpa Regex Split)
    const formattedOtherReviews = otherPostsFromDb.map(post => {
      return {
        id: post.id,
        title: post.title,
        thumbnailUrl: post.poster || "/image/default-placeholder.png",
        shortText: post.preview || (post.description ? post.description.substring(0, 80) + "..." : ""),
      };
    });

    return (
      <main className="min-h-screen bg-white pt-32 pb-10">
        <PostDetailSection post={currentPost} />
        
        <OtherReviewsSection
          title="Review Lainnya"
          items={formattedOtherReviews}
          programSlug={slug}
          moreHref={`/program/${slug}`}
        />
      </main>
    );
  }

  // ==========================================================
  // KONDISI 2: DEFAULT / SLUG LAINNYA 
  // ==========================================================
  // 👉 Komponen temanmu aman tidak tersentuh
  return (
    <DefaultProgramPostDetailView 
      slug={slug} 
      id={id} 
      heroData={heroData} 
      detailHeroData={detailHeroData} 
    />
  );
}