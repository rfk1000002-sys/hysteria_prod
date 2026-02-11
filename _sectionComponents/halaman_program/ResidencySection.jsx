// _components/ResidencySection.jsx
"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Data dengan URL gambar Unsplash
const RESIDENCY_ITEMS = [
  {
    id: 1,
    title: "Flash Residency",
    // Gambar studio seni
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
    link: "#",
  },
  {
    id: 2,
    title: "Kandang Tandang",
    // Gambar workshop kolaboratif
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
    link: "#",
  },
];

export default function ResidencySection() {
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
        Residensi dan Workshop
      </h2>

      {/* GRID LAYOUT (2 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {RESIDENCY_ITEMS.map((item) => (
          <div
            key={item.id}
            // Menggunakan aspect-[4/3] atau height fix yang proporsional
            // rounded-[24px] agar konsisten dengan section Music/Festival
            className="group relative w-full h-[300px] md:h-[380px] rounded-[24px] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* 1. BACKGROUND IMAGE */}
            <div className="absolute inset-0 bg-gray-200">
               <Image 
                 src={item.image} 
                 alt={item.title} 
                 fill 
                 className="object-cover group-hover:scale-105 transition-transform duration-700" 
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
               {/* Overlay tipis agar tulisan di bawah pop-up jika gambar terlalu terang */}
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* 2. FOOTER BAR (Judul & Panah) */}
            {/* Background solid tetap dipertahankan sesuai desain asli, tapi dipercantik */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#3E3245] p-6 md:p-8 flex items-center justify-between transition-colors duration-300 group-hover:bg-[#5a4863]">
              
              {/* Judul */}
              <h3 className={`${poppins.className} text-white text-xl md:text-2xl font-bold`}>
                {item.title}
              </h3>

              {/* Ikon Panah Kanan */}
              <div className="bg-white/10 p-2 rounded-full text-white transform group-hover:translate-x-2 group-hover:bg-white/20 transition-all duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}