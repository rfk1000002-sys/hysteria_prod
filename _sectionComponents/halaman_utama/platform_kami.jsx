"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="24">Image unavailable</text></svg>';

const fallbackItems = [
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", title: "Hysteria Artlab", slotType: "tall", order: 0, linkUrl: "/platform/hysteria-artlab" },
  { src: "https://images.unsplash.com/photo-1502920917128-1aa500764b0d?auto=format&fit=crop&w=1200&q=80", title: "Peka Kota", slotType: "tall", order: 1, linkUrl: "/platform/peka-kota" },
  { src: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80", title: "Laki Masak", slotType: "tall", order: 2, linkUrl: "/platform/laki-masak" },
  { src: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=80", title: "Bukit Buku", slotType: "short", order: 3, linkUrl: "/platform/bukit-buku" },
  { src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80", title: "Ditam Part", slotType: "short", order: 4, linkUrl: "/platform/ditampart" },
];

function ItemCard({ item, tall = false }) {
  const [src, setSrc] = useState(item.src || placeholder);

  return (
    <article
      className="relative rounded-lg overflow-hidden"
      aria-label={item.title}>
      <div style={{ position: "relative", width: "100%", paddingTop: tall ? "66.66%" : "40%" }}>
        <Image
          src={src}
          alt={item.title}
          fill
          unoptimized
          priority={tall}
          sizes={tall ? "(min-width:960px) 33vw, 100vw" : "(min-width:960px) 50vw, 100vw"}
          style={{ objectFit: "cover" }}
          onError={() => setSrc(placeholder)}
        />
      </div>

      <div className="absolute left-3 right-3 bottom-3 flex">
        <span className="bg-black/60 text-white px-3 py-1 rounded text-sm font-semibold">{item.title}</span>
      </div>
    </article>
  );
}

export default function PlatformKami({ items = [] }) {
  const normalizedItems = (Array.isArray(items) && items.length ? items : fallbackItems)
    .map((item, index) => ({
      title: item?.title || `Platform ${index + 1}`,
      src: item?.src || "",
      linkUrl: item?.linkUrl || null,
      slotType: item?.slotType === "short" ? "short" : "tall",
      order: typeof item?.order === "number" ? item.order : index,
    }))
    .sort((a, b) => a.order - b.order);

  const tallItems = normalizedItems.filter((item) => item.slotType === "tall").slice(0, 3);
  const shortItems = normalizedItems.filter((item) => item.slotType === "short").slice(0, 2);

  const rowOne = tallItems.length === 3 ? tallItems : normalizedItems.slice(0, 3).map((item) => ({ ...item, slotType: "tall" }));
  const rowTwo = shortItems.length === 2 ? shortItems : normalizedItems.slice(3, 5).map((item) => ({ ...item, slotType: "short" }));

  return (
    <section
      // className="w-full p-6 mb-20 border border-zinc-900"
      className="w-full p-6 mb-20"
      aria-labelledby="platform-kami-title">
      <header className="max-w-2xl text-center mx-auto">
        <h2
          id="platform-kami-title"
          className="text-2xl font-bold">
          Platform Kami
        </h2>
        <p className="mt-1 text-zinc-600">5 pilar yang menopang ekosistem gerobak hysteria</p>
      </header>

      <div className="max-w-[1200px] mx-auto mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {rowOne.map((item, index) => (
            <div key={`${item.title}-${index}`}>
              {item.linkUrl ? (
                <Link
                  href={item.linkUrl}
                  aria-label={`Buka ${item.title}`}>
                  <ItemCard
                    item={item}
                    tall
                  />
                </Link>
              ) : (
                <ItemCard
                  item={item}
                  tall
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {rowTwo.map((item, index) => (
            <div key={`${item.title}-${index}`}>
              {item.linkUrl ? (
                <Link
                  href={item.linkUrl}
                  aria-label={`Buka ${item.title}`}>
                  <ItemCard item={item} />
                </Link>
              ) : (
                <ItemCard item={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
