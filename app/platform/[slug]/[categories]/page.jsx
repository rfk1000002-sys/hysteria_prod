import React from "react";
import { notFound } from "next/navigation";
import HeroSection from "./_component/HeroSection";
import CarouselBody from "./_BodyComponent/CarouselBody";
import GridBody from "./_BodyComponent/GridBody";
import {
  listPublicPlatforms,
  getPublicPlatform,
  getPublicCategory,
  getPublicEventItems,
  getPublicEventItemsByOrganizer,
} from "../../../../modules/public/platform/services/platform.public.service.js";

// Kategori yang datanya bersumber dari model Event (bukan PlatformContent).
// value: { type: 'category' | 'organizer', slug: string }
const EVENT_DRIVEN_CATEGORIES = {
  "workshop":         { type: "category",  slug: "workshop" },
  "screening-film":   { type: "category",  slug: "screening-film" },
  "untuk-perhatian":  { type: "category",  slug: "untuk-perhatian" },
  "meramu":           { type: "category",  slug: "meramu" },
  "event-ditampart":  { type: "organizer", slug: "ditampart" },
};

export async function generateMetadata({ params }) {
  const { slug, categories } = (await params) || {};
  if (!slug) return {};
  try {
    const [item, platform] = await Promise.all([
      getPublicCategory(slug, categories),
      getPublicPlatform(slug),
    ]);
    if (!item) return {};
    const logoPath = '/svg/Logo-hysteria.svg';
    const ogImage = item.image || platform?.head?.images?.[0]?.src || logoPath;

    return {
      title: item.title || platform?.head?.title || slug,
      description: item.imageSubtitle || platform?.head?.description || undefined,
      icons: {
        icon: logoPath,
        shortcut: logoPath,
        apple: logoPath,
      },
      openGraph: {
        title: item.title || platform?.head?.title || slug,
        description: item.imageSubtitle || platform?.head?.description || undefined,
        images: [{ url: ogImage, alt: item.title || platform?.head?.title || 'Hysteria' }],
      },
      twitter: {
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const platforms = await listPublicPlatforms();
    return platforms.flatMap(({ slug, categories }) =>
      (categories || []).map((c) => ({
        slug,
        categories: c.slug || (c.title || "").toLowerCase().replace(/\s+/g, "-"),
      }))
    );
  } catch {
    return [];
  }
}

export default async function Page({ params }) {
  const { slug, categories } = (await params) || {};
  if (!slug) return notFound();

  const eventDriven = EVENT_DRIVEN_CATEGORIES[categories];

  const [item, platform, eventItems] = await Promise.all([
    getPublicCategory(slug, categories),
    getPublicPlatform(slug),
    eventDriven
      ? eventDriven.type === "organizer"
        ? getPublicEventItemsByOrganizer(eventDriven.slug)
        : getPublicEventItems(eventDriven.slug)
      : Promise.resolve(null),
  ]);
  if (!platform || !item) return notFound();

  const resolvedItems = (eventDriven && eventItems) ? eventItems : (item.items || []);

  // Determine layout — default to 'grid' when not specified
  const layout = item.layout || "grid";

  return (
    <div className="bg-white">
      <main className="font-sans w-full max-w-[1920px] mx-auto bg-zinc-100 min-h-screen">
        {/* Shared hero section — same component, different metadata */}
        <HeroSection
          imageUrl={item.image || "/image/ilustrasi-menu.png"}
          title={item.imageTitle || item.title || platform.head?.title || "Platform"}
          description={item.imageSubtitle || "Explore our platform categories"}
        />

        {/* Dynamic body based on layout type */}
        {layout === "carousel" ? (
          <CarouselBody subCategories={item.subCategories || []} platformSlug={slug} categorySlug={categories} />
        ) : (
          <GridBody
            items={resolvedItems}
            filters={item.filters || []}
            cardType={item.cardType || "poster"}
            showFilterIcon={categories !== 'event-ditampart'}
            itemsPerPageOverride={categories === 'event-ditampart' ? 18 : undefined}
            gridCols={categories === 'event-ditampart' ? 6 : undefined}
          />
        )}
      </main>
    </div>
  );
}
