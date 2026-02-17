'use client';

import { useRef } from 'react';
import Image from "next/image";

const defaultItems = [
  {
    title: "Pendekatan Kolaboratif\nyang Setara",
    desc: "Hysteria bekerja dengan prinsip kerja bersama, kolaborator diposisikan sebagai mitra, bukan sekadar pengisi program.",
    img: "/images/kolaborasi/why-1.png",
  },
  {
    title: "Pengalaman Produksi &\nPengelolaan Program",
    desc: "Berpengalaman mengelola program dan event seni-budaya dari tahap ide, produksi, hingga dokumentasi.",
    img: "/images/kolaborasi/why-1.png",
  },
  {
    title: "Jejaring Seniman &\nKomunitas yang Aktif",
    desc: "Terhubung dengan seniman, komunitas, dan praktisi lintas disiplin yang relevan dan terus berkembang.",
    img: "/images/kolaborasi/why-1.png",
  },
  {
    title: "Fokus pada Dampak",
    desc: "Tidak hanya mengejar output, tetapi juga kualitas proses, keberlanjutan relasi, dan dampak sosial-kultural.",
    img: "/images/kolaborasi/why-1.png",
  },
];

export default function WhyCollaborate({ 
  title = "Mengapa Berkolaborasi dengan Kami?",
  description = "",
  benefits = []
}) {
  const scrollContainerRef = useRef(null);
  const items = benefits && benefits.length > 0 ? benefits : defaultItems;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="mengapa" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-zinc-700">
            {description}
          </p>
        )}

        <div className="mt-12">
          <div className="flex items-center gap-4">
            {/* Prev Button (outside container) */}
            <button
              onClick={() => scroll('left')}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-zinc-100 transition-colors hidden lg:flex items-center justify-center w-10 h-10"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-[#E93C8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scroll-smooth scrollbar-hide flex-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex gap-7 p-2">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md h-64 flex flex-col"
                  >
                    {it.imageUrl || it.img ? (
                      <div className="relative h-24 w-full">
                        <Image
                          src={it.imageUrl || it.img}
                          alt={it.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-full bg-gradient-to-br from-purple-400 to-purple-600" />
                    )}

                    <div className="px-5 py-4 text-center flex-1 flex flex-col justify-center">
                      <h3 className="whitespace-pre-line text-xs font-extrabold text-[#E93C8E]">
                        {it.title}
                      </h3>
                      <p className="mx-auto mt-2 text-xs leading-4 text-[#E93C8E]/90">
                        {it.description || it.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button (outside container) */}
            <button
              onClick={() => scroll('right')}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-zinc-100 transition-colors hidden lg:flex items-center justify-center w-10 h-10"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-[#E93C8E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
