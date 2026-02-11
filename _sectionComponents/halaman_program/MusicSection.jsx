// _components/MusicSection.jsx
"use client";

import Image from "next/image"; // Import Image untuk gambar asli
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Data Sesuai Gambar UI (Ditambah URL Image agar lebih visual)
const MUSIC_ITEMS = [
  { 
    id: 1, 
    title: "SGRT",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80" // Gambar Surfing/Pantai/Indie
  },
  { 
    id: 2, 
    title: "Kotak Listrik",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80" // Gambar Synthesizer/Elektronik
  },
  { 
    id: 3, 
    title: "Di(e)gital",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" // Gambar Cyberpunk/Digital
  },
  { 
    id: 4, 
    title: "Bunyi Halaman Belakang",
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80" // Gambar Akustik/Gitar
  },
  { 
    id: 5, 
    title: "Folk Me Up",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80" // Gambar Folk/Gitar
  },
];

export default function MusicSection() {
  return (
    // PENYESUAIAN CONTAINER:
    // 1. px-6 md:px-10 lg:px-20 (Agar sejajar lurus dengan section lain)
    // 2. max-w-[1440px] mx-auto (Standar lebar)
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* JUDUL: Ukuran disamakan dengan FestivalSection (text-[28px] md:text-[32px]) */}
        <h2 className={`${poppins.className} text-[28px] md:text-[32px] font-bold text-black`}>
          Musik
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MUSIC_ITEMS.map((item) => (
          <div 
            key={item.id}
            // Aspect ratio 4/3 agar kotak persegi panjang
            className="group relative w-full aspect-[4/3] rounded-[24px] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
               <Image 
                 src={item.image}
                 alt={item.title}
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
               {/* Overlay Warna (Agar teks terbaca) */}
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
            </div>

            {/* Overlay Text & Icon */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <div className="flex items-end justify-between w-full">
                    {/* Judul Lagu */}
                    <h3 className={`${poppins.className} text-white text-xl md:text-2xl font-bold leading-tight drop-shadow-md max-w-[85%]`}>
                        {item.title}
                    </h3>
                    
                    {/* Icon Panah */}
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white transform group-hover:bg-[#D63384] group-hover:scale-110 transition-all duration-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}