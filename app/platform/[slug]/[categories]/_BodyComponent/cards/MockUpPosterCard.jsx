"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * MockUpPosterCard — kartu vertikal dengan gambar, tahun+judul, deskripsi, dan tombol CTA
 *
 * Props:
 *   imageUrl    : string   — URL gambar (fallback ke DummyPoster)
 *   alt         : string   — alt text gambar
 *   year        : string   — tahun (e.g. "2024"), digabung dengan title: "2024 – Title"
 *   title       : string   — judul konten
 *   description : string   — deskripsi singkat
 *   href        : string   — link tombol CTA (opsional)
 *   buttonLabel : string   — label tombol (default: "Lihat File")
 */
export default function MockUpPosterCard({
  imageUrl,
  alt,
  year,
  title,
  description,
  href,
  buttonLabel = "Lihat File",
}) {
  const imgSrc = imageUrl || "/image/DummyPoster.webp";
  const isLocal = typeof imgSrc === "string" && imgSrc.startsWith("/");
  const fullTitle = year && title ? `${year} - ${title}` : title || year || "";

  return (
    <div className="w-full md:max-w-[380px] md:aspect-[3/4] flex flex-col overflow-hidden rounded-md bg-white border border-zinc-300 shadow-xl hover:translate-y-[-6px]">
      {/* Image */}
      <div className="relative w-full aspect-video flex-shrink-0 bg-zinc-300">
        <Image
          src={imgSrc}
          alt={alt || fullTitle || "Poster"}
          fill
          unoptimized={!isLocal}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-4 py-3 flex-1">
        {fullTitle && (
          <h3 className="text-zinc-900 text-xs md:text-base font-semibold leading-5 line-clamp-2 flex-shrink">
            {fullTitle}
          </h3>
        )}
        {description && (
          <p className="text-zinc-600 text-xs md:text-sm leading-4 line-clamp-4">
            {description}
          </p>
        )}

        {/* CTA Button */}
        <div className="mt-auto">
          {href ? (
            <Link
              href={href}
              className="block w-full rounded-xl bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              {buttonLabel}
            </Link>
          ) : (
            <button
              type="button"
              className="w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
