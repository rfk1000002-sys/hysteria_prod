import React from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import HeadSection from '../../../_sectionComponents/halaman_platform/head.section'
import ListCategorySection from '../../../_sectionComponents/halaman_platform/list_category.section'
import MediaSection from '../../../_sectionComponents/halaman_platform/media.section'
import { getPlatformBySlug, listPlatforms } from '../../../modules/admin/platform/services/platform.service'
import logger from '@/lib/logger'

export async function generateMetadata({ params }) {
  const { slug } = (await params) || {};
  if (!slug) return {};
  try {
    const platform = await getPlatformBySlug(slug);
    if (!platform) return {};
    const logoPath = '/svg/Logo-hysteria.svg';
    const ogImage = platform.mainImageUrl || logoPath;

    return {
      title: platform.headline || slug,
      description: platform.subHeadline || undefined,
      icons: {
        icon: logoPath,
        shortcut: logoPath,
        apple: logoPath,
      },
      openGraph: {
        title: platform.headline || slug,
        description: platform.subHeadline || undefined,
        images: [{ url: ogImage, alt: platform.name || 'Hysteria' }],
      },
      twitter: {
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

const MAINTENNACE = false

export async function generateStaticParams() {
  try {
    const platforms = await listPlatforms()
    return (platforms || []).map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

function transformPlatformData(slug, db) {
  if (!db) return null;

  const mainImages = (db.images || [])
    .filter((img) => img.type === 'main' && img.imageUrl)
    .sort((a, b) => a.order - b.order)
    .map((img) => ({ src: img.imageUrl, alt: img.label || slug }))

  const images =
    mainImages.length > 0
      ? mainImages
      : db.mainImageUrl
      ? [{ src: db.mainImageUrl, alt: db.name || slug }]
      : []

  const coverImages = (db.images || [])
    .filter((img) => img.type === 'cover' && img.imageUrl)
    .sort((a, b) => a.order - b.order)

  const categories = (db.categories || [])
    .sort((a, b) => a.order - b.order)
    .map((cat, idx) => ({
      title:       cat.title,
      slug:        cat.slug,
      url:         cat.url,
      layout:      cat.layout || 'grid',
      description: cat.description || '',
      imageUrl:    coverImages[idx]?.imageUrl || '',
    }))

  return {
    headline:       db.headline       || '',
    subHeadline:    db.subHeadline    || '',
    instagram:      db.instagram      || '',
    youtube:        db.youtube        || '',
    youtubeProfile: db.youtubeProfile || '',
    multyImages:    images.length > 1,
    images,
    categories,
  }
}

export default async function Page({ params }) {
  const { slug } = (await params) || {}

  if (!slug) return notFound()

  let data = null
  try {
    logger.info(`[Page] Directly fetching platform data for: ${slug}`)
    const db = await getPlatformBySlug(slug)
    data = transformPlatformData(slug, db)
    logger.info(`[Page] Data transformed: ${!!data}`)
  } catch (err) {
    logger.error(`[Page] Service call error: ${err.message}`)
    // silently fall back to maintenance view
  }

  if (!data || MAINTENNACE) {
    return (
      <main className="bg-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl text-zinc-900 font-bold mb-4">Platform: {slug}</h1>
          <p className="mt-4 text-zinc-700">
            Sedang dalam tahap maintenance atau data tidak ditemukan.
          </p>
        </div>
      </main>
    )
  }

  // Pass DB field names directly — components use exact same names as DB columns
  const {
    headline,      // Platform.headline
    subHeadline,   // Platform.subHeadline
    instagram,     // Platform.instagram
    youtube,       // Platform.youtube
    youtubeProfile,// Platform.youtubeProfile
    images,        // PlatformImage[] type=main → [{ src, alt }]
    multyImages,   // derived: images.length > 1
    categories,    // PlatformCategory[] → [{ title, slug, url, imageUrl, ... }]
  } = data

  return (
    <main className="bg-white min-h-screen">
      
      <HeadSection
        headline={headline}
        subHeadline={subHeadline}
        instagram={instagram}
        youtube={youtube}
        images={images}
        multyImages={multyImages}
      />

      <div className='max-w-[1800px] mx-auto px-4 mt-10'>
        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 text-center uppercase tracking-wider leading-tight drop-shadow-sm">Media Profile</h2>
        <div className="mt-3 h-1 w-70 md:w-100  bg-zinc-200 rounded mx-auto" aria-hidden="true" />
        <MediaSection youtubeProfile={youtubeProfile} />
      </div>
      <div className='max-w-[1800px] mx-auto px-4 mt-10'>
        <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 text-center uppercase tracking-wider leading-tight drop-shadow-sm">Kategori Platform</h2>
        <div className="mt-3 h-1 w-70 md:w-100 bg-zinc-200 rounded mx-auto" aria-hidden="true" />
        <ListCategorySection categories={categories} />
      </div>
    </main>
  )
}
