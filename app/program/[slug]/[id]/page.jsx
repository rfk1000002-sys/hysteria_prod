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
    
    const currentPost = await prisma.event.findUnique({
      where: { id: postId },
      include: { tags: { include: { tag: true } } }
    });

    if (!currentPost) return notFound();

    const otherPostsFromDb = await prisma.event.findMany({
      where: {
        isPublished: true,
        id: { not: postId }, 
        eventCategories: {
          some: { categoryItem: { slug: 'hysteria-berkelana' } }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 8, 
    });

    const formattedOtherReviews = otherPostsFromDb.map(event => {
      let previewText = "";
      if (event.description && event.description.includes("**Preview:**")) {
        const match = event.description.match(/\*\*Preview:\*\*\s*(.*)/);
        if (match && match[1] !== "-") previewText = match[1];
      } else {
        previewText = event.description ? event.description.substring(0, 80) + "..." : "";
      }

      return {
        id: event.id,
        title: event.title,
        thumbnailUrl: event.poster || "/image/default-placeholder.png",
        shortText: previewText,
      };
    });

    return (
      // 👉 PERUBAHAN: ProgramHero dihapus, ditambah pt-32 agar tidak nabrak navbar
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
  return (
    <DefaultProgramPostDetailView 
      slug={slug} 
      id={id} 
      heroData={heroData} 
      detailHeroData={detailHeroData} 
    />
  );
}