// components/FestivalSection.jsx
"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Data untuk section ini (SAMA SEPERTI KODE ANDA)
const FESTIVALS = [
  {
    id: 1,
    title: "Festival Kampung",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
    link: "#",
  },
  {
    id: 2,
    title: "Festival Kota",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    link: "#",
  },
  {
    id: 3,
    title: "Biennale",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",
    link: "#",
  },
];

export default function FestivalSection() {
  return (
    // PERUBAHAN HANYA DI SINI:
    // Menambahkan class container standard agar sejajar dengan Hero Section:
    // 1. w-full max-w-[1440px] mx-auto (Agar lebar dan tengahnya sama)
    // 2. px-6 md:px-10 lg:px-20 (Padding kiri-kanan yang sama persis)
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-20">
      
      {/* JUDUL SECTION (TETAP SAMA) */}
      <h2
        className={`${poppins.className} text-[28px] md:text-[32px] font-bold text-black mb-8`}
      >
        Festival dan Pameran
      </h2>

      {/* GRID LAYOUT (TETAP SAMA) */}
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[500px]">
        
        {/* --- KOLOM KIRI (ITEM BESAR/UTAMA) --- */}
        <div className="relative w-full lg:w-3/5 h-[300px] lg:h-full rounded-2xl overflow-hidden group cursor-pointer shadow-md">
           <FestivalCard item={FESTIVALS[0]} />
        </div>

        {/* --- KOLOM KANAN (2 ITEM KECIL DITUMPUK) --- */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6 h-full">
          
          {/* Item Atas */}
          <div className="relative w-full h-[240px] lg:h-1/2 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
            <FestivalCard item={FESTIVALS[1]} />
          </div>

          {/* Item Bawah */}
          <div className="relative w-full h-[240px] lg:h-1/2 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
            <FestivalCard item={FESTIVALS[2]} />
          </div>

        </div>
      </div>
    </section>
  );
}

// Sub-komponen Card (TIDAK ADA PERUBAHAN)
function FestivalCard({ item }) {
  return (
    <>
      {/* Background Image dengan efek zoom saat hover */}
      <div className="absolute inset-0 w-full h-full">
         <Image 
            src={item.image} 
            alt={item.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
         />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Konten (Teks & Tombol) */}
      <div className="absolute inset-0 p-6 flex items-end justify-between z-10">
        <h3 className={`${poppins.className} text-white text-xl md:text-2xl font-bold drop-shadow-md`}>
          {item.title}
        </h3>
        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:translate-x-2 group-hover:bg-[#D63384] group-hover:text-white text-[#D63384]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="currentColor" 
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );
}