"use client";

import { useState } from "react";
import Image from "next/image";

// --- DATA DUMMY (Updated: "Selesai" -> "Telah Berakhir") ---
const KATEGORI = [
  "Semua", "Temu Jejaring", "Buah Tangan", "Simposium", "Meditasi", "Lawatan Jalan Terus"
];

const DATA_FORUM = [
  // BARIS 1
  {
    id: 1,
    title: "DI KOREA MUNG PINDAH TURU TOK!",
    subTitle: "Buah Tangan dari Korsel",
    date: "Sabtu, 8 Mar 2026",
    status: "Akan Berlangsung",
    category: "Buah Tangan",
    image: "https://images.unsplash.com/photo-1531685218426-903db4c5b6a4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "MEMBACA ARSIP KOTA LAMA",
    subTitle: "Diskusi Sejarah",
    date: "Minggu, 9 Mar 2026",
    status: "Akan Berlangsung",
    category: "Temu Jejaring",
    image: "https://images.unsplash.com/photo-1582555172866-fc5e7144e45c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "MEDITASI URBAN",
    subTitle: "Healing Space",
    date: "Senin, 10 Mar 2026",
    status: "Telah Berakhir", // UPDATE
    category: "Meditasi",
    image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "SIMPOSIUM AI",
    subTitle: "Teknologi & Seni",
    date: "Selasa, 11 Mar 2026",
    status: "Akan Berlangsung",
    category: "Simposium",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
  },
  // BARIS 2
  {
    id: 5,
    title: "LAWATAN KOTA",
    subTitle: "Jalan Santai",
    date: "Rabu, 12 Mar 2026",
    status: "Akan Berlangsung",
    category: "Lawatan Jalan Terus",
    image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "JEJARING SENIMAN",
    subTitle: "Kumpul Komunitas",
    date: "Kamis, 13 Mar 2026",
    status: "Akan Berlangsung",
    category: "Temu Jejaring",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "BUAH TANGAN #48",
    subTitle: "Oleh-oleh Cerita",
    date: "Jumat, 14 Mar 2026",
    status: "Telah Berakhir", // UPDATE
    category: "Buah Tangan",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    title: "MINDFULNESS 101",
    subTitle: "Meditasi Pemula",
    date: "Sabtu, 15 Mar 2026",
    status: "Akan Berlangsung",
    category: "Meditasi",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=600&q=80",
  },
  // BARIS 3
  {
    id: 9,
    title: "ARSITEKTUR KAMPUNG",
    subTitle: "Bedah Rumah",
    date: "Minggu, 16 Mar 2026",
    status: "Akan Berlangsung",
    category: "Simposium",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    title: "PASAR KREATIF",
    subTitle: "Ekonomi Warga",
    date: "Senin, 17 Mar 2026",
    status: "Akan Berlangsung",
    category: "Buah Tangan",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    title: "SOUNDSCAPING",
    subTitle: "Merekam Kota",
    date: "Selasa, 18 Mar 2026",
    status: "Telah Berakhir", // UPDATE
    category: "Temu Jejaring",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    title: "YOGA SUNSET",
    subTitle: "Kesehatan Mental",
    date: "Rabu, 19 Mar 2026",
    status: "Akan Berlangsung",
    category: "Meditasi",
    image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=600&q=80",
  },
  // BARIS 4
  {
    id: 13,
    title: "TUR DE SEMARANG",
    subTitle: "Keliling Kota",
    date: "Kamis, 20 Mar 2026",
    status: "Akan Berlangsung",
    category: "Lawatan Jalan Terus",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 14,
    title: "DIGITAL ART JAM",
    subTitle: "Kolaborasi Visual",
    date: "Jumat, 21 Mar 2026",
    status: "Akan Berlangsung",
    category: "Simposium",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 15,
    title: "DISKUSI SENJA",
    subTitle: "Ngopi & Ngobrol",
    date: "Sabtu, 22 Mar 2026",
    status: "Telah Berakhir", // UPDATE
    category: "Temu Jejaring",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 16,
    title: "ZEN GARDEN",
    subTitle: "Taman Ketenangan",
    date: "Minggu, 23 Mar 2026",
    status: "Akan Berlangsung",
    category: "Meditasi",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState("Semua");

  const filteredData = activeTab === "Semua"
    ? DATA_FORUM
    : DATA_FORUM.filter((item) => item.category === activeTab);

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="relative w-full h-[400px] md:h-[450px] bg-gradient-to-br from-[#D63384] via-[#c2185b] to-[#880e4f] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
             <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-400 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Forum</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90 leading-relaxed">
            Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.
          </p>
        </div>
      </div>

      {/* 2. CONTENT SECTION */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        
        {/* FILTER TABS */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {KATEGORI.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`relative pb-3 text-base md:text-lg transition-all duration-300
                ${activeTab === cat
                  ? "text-black font-extrabold"
                  : "text-black font-medium hover:text-[#D63384]"
                }`}
            >
              {cat}
              {activeTab === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[6px] bg-[#D63384] rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredData.map((post) => {
            // Cek apakah statusnya "Telah Berakhir"
            const isEnded = post.status === "Telah Berakhir";

            return (
              <div 
                key={post.id}
                className="group relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-md transition-all duration-300"
              >
                {/* --- 1. BACKGROUND IMAGE --- */}
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* --- 2. DEFAULT OVERLAY (ORANGE TINT) --- */}
                {/* Hanya muncul jika tidak sedang di-hover. Hilang saat hover. */}
                <div className="absolute inset-0 bg-orange-500/40 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0" />

                {/* --- 3. HOVER OVERLAY --- */}
                {/* LOGIKA: 
                    - Jika isEnded (Telah Berakhir): Overlay Coklat Hangat/Sepia (Sesuai Desain Gambar)
                    - Jika Masih Aktif: Overlay Hitam (Sesuai Desain Awal)
                */}
                <div className={`absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300
                    ${isEnded 
                        ? "bg-gradient-to-t from-[#8E4B4B]/95 via-[#A66D62]/90 to-[#C48B76]/50" // Gradient Coklat Sepia untuk "Telah Berakhir"
                        : "bg-black/60" // Gradient Hitam untuk "Aktif"
                    }
                `} />

                {/* --- 4. CONTENT WRAPPER --- */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  
                  {/* DEFAULT VIEW: Judul Poster Besar (Hilang saat hover) */}
                  <div className="transform transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 absolute bottom-6 left-6 right-6">
                      <h3 className="text-white font-black text-2xl uppercase leading-tight opacity-90 drop-shadow-md">
                        {post.title}
                      </h3>
                  </div>

                  {/* HOVER VIEW: Konten Detail (Muncul saat hover) */}
                  <div className="flex flex-col justify-end items-start transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 w-full">
                      
                      {/* Badge Status */}
                      <div className="mb-3">
                         <span className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide
                             ${isEnded 
                                ? "bg-white text-[#D63384]" // Badge Putih-Pink untuk "Telah Berakhir"
                                : "bg-white text-[#D63384]" // Sama, tapi bisa dibedakan jika mau
                             }
                         `}>
                            {post.status}
                         </span>
                      </div>

                      {/* Judul */}
                      <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">
                          {post.title}
                      </h3>
                      
                      {/* Subjudul */}
                      <p className="text-white text-sm font-medium mb-1 drop-shadow-md">
                          -{post.subTitle}-
                      </p>

                      {/* Tanggal */}
                      <p className="text-gray-200 text-xs font-normal mb-4">
                          {post.date}
                      </p>

                      {/* Tombol Action (HANYA MUNCUL JIKA TIDAK BERAKHIR) */}
                      {!isEnded && (
                          <button className="bg-[#D63384] hover:bg-[#ad2466] text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-lg w-fit transition-colors">
                              Ikuti Sekarang
                          </button>
                      )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D63384] text-white font-bold text-sm hover:bg-[#ad2466] transition">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition font-medium text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition font-medium text-sm">3</button>
            <span className="text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition font-medium text-sm">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>

      </div>
    </main>
  );
}