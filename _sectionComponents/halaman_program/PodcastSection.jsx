// _components/PodcastSection.jsx
"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Menambahkan weight 400 untuk deskripsi
});

const PODCAST_ITEMS = [
  {
    id: 1,
    title: "Safari Memori",
    desc: "Podcast tentang arsip, nostalgia, dan penelusuran jejak",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 2,
    title: "Aston",
    desc: "Podcast tentang perspektif personal anak stonen dalam membahas isu sosial",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 3,
    title: "Sore di Stonen",
    desc: "Podcast yang berfokus pada suasana ngobrol yang santai dan reflektif",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop",
    link: "#",
  },
];

export default function PodcastSection() {
  return (
    // PENYESUAIAN CONTAINER:
    // 1. px-6 md:px-10 lg:px-20 (Agar sejajar lurus)
    // 2. max-w-[1440px] mx-auto
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-20">
      
      {/* JUDUL SECTION */}
      {/* Ukuran disamakan: text-[28px] md:text-[32px] */}
      <h2
        className={`${poppins.className} text-[28px] md:text-[32px] font-bold text-black mb-8`}
      >
        Podcast
      </h2>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {PODCAST_ITEMS.map((item) => (
          <div
            key={item.id}
            // Radius diperhalus jadi rounded-[24px] agar konsisten
            className="group bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col"
          >
            {/* 1. BAGIAN GAMBAR (Atas) */}
            <div className="relative w-full h-[220px] bg-gray-200 overflow-hidden">
               <Image 
                 src={item.image} 
                 alt={item.title} 
                 fill 
                 className="object-cover group-hover:scale-105 transition-transform duration-700" 
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
               {/* Overlay tipis saat hover */}
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* 2. BAGIAN KONTEN (Bawah - Putih) */}
            <div className="p-8 text-center flex flex-col items-center justify-center flex-grow min-h-[180px]">
              {/* Judul Podcast */}
              <h3 className={`${poppins.className} text-[#D63384] text-xl font-bold mb-3`}>
                {item.title}
              </h3>

              {/* Deskripsi */}
              <p className={`${poppins.className} text-[#FF7F9D] text-sm leading-relaxed max-w-[280px] font-normal`}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}