import React from "react";
import { notFound } from "next/navigation";
import HeroSection from "../_component/HeroSection";
import VideoCard from "../_BodyComponent/cards/VideoCard";
import PosterCard from "../_BodyComponent/cards/PosterCard";
import ArtistCard from "../_BodyComponent/cards/ArtistCard";
import {
  listPublicPlatforms,
  getPublicPlatform,
  getPublicCategory,
} from "../../../../../modules/public/platform/services/platform.public.service.js";
import AnitalkInteractiveSection from "./_components/AnitalkInteractiveSection";

const ANITALK_SLUG = "anitalk";

export async function generateStaticParams() {
  try {
    const platforms = await listPublicPlatforms();
    const params = [];

    for (const platform of platforms) {
      for (const category of platform.categories || []) {
        const categoryData = await getPublicCategory(platform.slug, category.slug);
        for (const sub of categoryData?.subCategories || []) {
          if (!sub?.slug) continue;
          params.push({
            slug: platform.slug,
            categories: category.slug,
            subCategory: sub.slug,
          });
        }
      }
    }

    return params;
  } catch {
    return [];
  }
}

function CardByType({ cardType, item }) {
  if (cardType === "video") {
    return (
      <VideoCard
        imageUrl={item.imageUrl || item.src}
        youtube={item.youtube}
        url={item.url}
        alt={item.alt}
        title={item.title}
        description={item.description}
        tags={item.tags}
        host={item.host}
        guests={item.guests}
      />
    );
  }

  if (cardType === "artist") {
    return (
      <ArtistCard
        imageUrl={item.imageUrl || item.src}
        alt={item.alt}
        title={item.title}
        description={item.description}
        host={item.host}
        guests={item.guests}
        url={item.url}
        tags={item.tags}
      />
    );
  }

  return (
    <PosterCard
      imageUrl={item.imageUrl || item.src}
      alt={item.alt}
      title={item.title}
      description={item.description || item.subtitle}
      tags={item.tags || []}
      meta={item.meta}
    />
  );
}

export default async function Page({ params }) {
  const { slug, categories, subCategory } = (await params) || {};
  if (!slug || !categories || !subCategory) return notFound();

  const [categoryData, platformData] = await Promise.all([
    getPublicCategory(slug, categories),
    getPublicPlatform(slug),
  ]);

  if (!categoryData || !platformData) return notFound();

  const selectedSub = (categoryData.subCategories || []).find(
    (sub) => sub.slug === subCategory
  );

  if (!selectedSub) return notFound();

  const cardType = selectedSub.cardType || "poster";
  const items = selectedSub.items || [];
  const isAnitalkPage = subCategory === ANITALK_SLUG;
  return (
    <div className="bg-[#f3f3f3] overflow-x-hidden">
      <main className="font-sans w-full max-w-480 mx-auto min-h-screen overflow-x-hidden">
        <HeroSection
          imageUrl={categoryData.image || "/image/ilustrasi-menu.png"}
          title={selectedSub.title || categoryData.title || platformData.head?.title || "Platform"}
          description={categoryData.imageSubtitle || categoryData.description || "Explore content"}
        />

        {isAnitalkPage ? (
          <AnitalkInteractiveSection selectedSub={selectedSub} items={items} />
        ) : (
          <GenericSubCategorySection selectedSub={selectedSub} cardType={cardType} items={items} />
        )}
      </main>
    </div>
  );
}

function GenericSubCategorySection({ selectedSub, cardType, items }) {
  return (
    <section className="w-full max-w-480 mx-auto px-4 md:px-24 py-10 md:py-14 bg-white">
      <h2 className="font-poppins font-bold text-[24px] md:text-[32px] text-black mb-8">
        {selectedSub.title}
      </h2>

      {!items.length ? (
        <p className="text-zinc-500">Belum ada konten untuk kategori ini.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((item, idx) => (
            <CardByType key={`${selectedSub.slug}-${idx}`} cardType={cardType} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

