// app/program/festival_kampung/page.jsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

// --- DATA KATEGORI ---
const KATEGORI = [
  "Semua",
  "Gebyuran Bustaman",
  "Nginguk Githok",
  "Festival Bukit Jatiwayang",
  "Sobo Praworejo",
  "Srawung Kendang",
  "Festival Ngijo",
  "Banyu Pitu",
  "Bulusan Fest",
  "Lobahan Kali",
  "Ili Buntu Fest",
  "Festival Ijo Tugu"
];

// --- KONSTANTA PAGINATION ---
const ITEMS_PER_PAGE = 25;

// --- DATA DUMMY ---
const DATA_FESTIVAL = [
  { id: 1, title: "DI KOREA MUNG PINDAH TURU TOK!", subTitle: "Buah Tangan #01", category: "Gebyuran Bustaman", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "MEMBACA ARSIP KOTA LAMA", subTitle: "Buah Tangan #02", category: "Nginguk Githok", image: "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "MEDITASI DI TENGAH KEBISINGAN", subTitle: "Buah Tangan #03", category: "Festival Bukit Jatiwayang", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "SIMPOSIUM SENI & TEKNOLOGI", subTitle: "Buah Tangan #04", category: "Sobo Praworejo", image: "https://images.unsplash.com/photo-1543906965-f9520aa2ed8a?auto=format&fit=crop&w=600&q=80" },
  { id: 5, title: "JALAN JALAN SORE", subTitle: "Buah Tangan #05", category: "Srawung Kendang", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: "FESTIVAL BUNGA DESA", subTitle: "Buah Tangan #06", category: "Festival Ngijo", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80" },
  { id: 7, title: "PASAR KREATIF WARGA", subTitle: "Buah Tangan #07", category: "Banyu Pitu", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" },
  { id: 8, title: "KULINER TRADISIONAL", subTitle: "Buah Tangan #08", category: "Bulusan Fest", image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=600&q=80" },
  { id: 9, title: "PANGGUNG RAKYAT", subTitle: "Buah Tangan #09", category: "Lobahan Kali", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=600&q=80" },
  { id: 10, title: "LAYAR TANCEP DIGITAL", subTitle: "Buah Tangan #10", category: "Ili Buntu Fest", image: "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&w=600&q=80" },
  { id: 11, title: "WORKSHOP ANYAMAN", subTitle: "Buah Tangan #11", category: "Festival Ijo Tugu", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
  { id: 12, title: "PAMERAN FOTO LAWAS", subTitle: "Buah Tangan #12", category: "Gebyuran Bustaman", image: "https://images.unsplash.com/photo-1543906965-f9520aa2ed8a?auto=format&fit=crop&w=600&q=80" },
  { id: 13, title: "MUSIK KAMPUNG", subTitle: "Buah Tangan #13", category: "Nginguk Githok", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80" },
  { id: 14, title: "TARI KONTEMPORER", subTitle: "Buah Tangan #14", category: "Festival Bukit Jatiwayang", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80" },
  { id: 15, title: "WAYANG KULIT MILENIAL", subTitle: "Buah Tangan #15", category: "Sobo Praworejo", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" },
  { id: 16, title: "DISKUSI SENJA", subTitle: "Buah Tangan #16", category: "Srawung Kendang", image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=600&q=80" },
  { id: 17, title: "MURAL BERSAMA", subTitle: "Buah Tangan #17", category: "Festival Ngijo", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=600&q=80" },
  { id: 18, title: "BATIK CELUP", subTitle: "Buah Tangan #18", category: "Banyu Pitu", image: "https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&w=600&q=80" },
  { id: 19, title: "DONGENG ANAK", subTitle: "Buah Tangan #19", category: "Bulusan Fest", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" },
  { id: 20, title: "LOMBA FOTO", subTitle: "Buah Tangan #20", category: "Lobahan Kali", image: "https://images.unsplash.com/photo-1543906965-f9520aa2ed8a?auto=format&fit=crop&w=600&q=80" },
  { id: 21, title: "JALAN SANTAI", subTitle: "Buah Tangan #21", category: "Ili Buntu Fest", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80" },
  { id: 22, title: "BAZAR BUKU", subTitle: "Buah Tangan #22", category: "Festival Ijo Tugu", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80" },
  { id: 23, title: "KERAMIK STUDIO", subTitle: "Buah Tangan #23", category: "Gebyuran Bustaman", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" },
  { id: 24, title: "SKETSA KOTA", subTitle: "Buah Tangan #24", category: "Nginguk Githok", image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=600&q=80" },
  { id: 25, title: "PENUTUPAN FESTIVAL", subTitle: "Buah Tangan #25", category: "Festival Bukit Jatiwayang", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=600&q=80" },
];

export default function FestivalKampungPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter Data
  const filteredData = useMemo(() => {
    if (activeCategory === "Semua") return DATA_FESTIVAL;
    return DATA_FESTIVAL.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate pagination buttons logic
  const paginationButtons = useMemo(() => {
    const buttons = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) buttons.push(i);
        buttons.push("...");
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1);
        buttons.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) buttons.push(i);
      } else {
        buttons.push(1);
        buttons.push("...");
        buttons.push(currentPage - 1);
        buttons.push(currentPage);
        buttons.push(currentPage + 1);
        buttons.push("...");
        buttons.push(totalPages);
      }
    }
    return buttons;
  }, [currentPage, totalPages]);

  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      
      {/* 1. HERO HEADER (MENGIKUTI STYLE FORUM) */}
      <div className="relative w-full h-[400px] md:h-[450px] bg-gradient-to-br from-[#D63384] via-[#c2185b] to-[#880e4f] flex items-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
             <div className="absolute top-10 left-1/4 w-96 h-96 bg-pink-400 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Festival Kampung</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90 leading-relaxed">
            Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.
          </p>
        </div>
      </div>

      {/* 2. MAIN CONTENT SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        
        {/* MOBILE MENU BUTTON (ONLY VISIBLE ON MOBILE) */}
        <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <span className="text-sm font-bold text-[#D63384] uppercase tracking-wider">Kategori Festival</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X size={20} className="text-[#D63384]" /> : <Menu size={20} className="text-[#D63384]" />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR KATEGORI */}
          <aside className={`${
            mobileMenuOpen ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:relative lg:bg-transparent" : "hidden lg:block"
            }`}>
            {/* Overlay Close for Mobile */}
            {mobileMenuOpen && <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />}

            <div className={`${
                mobileMenuOpen ? "absolute top-0 left-0 w-64 h-screen p-4" : ""
            } bg-white rounded-xl border border-[#D63384] lg:sticky lg:top-24 lg:w-[190px] shadow-sm lg:shadow-none overflow-hidden`}>
                
                <div className="flex flex-col">
                {KATEGORI.map((cat, idx) => (
                    <button
                    key={idx}
                    onClick={() => {
                        setActiveCategory(cat);
                        setCurrentPage(1);
                        setMobileMenuOpen(false);
                    }}
                    // MODIFIKASI: 
                    // 1. text-center (Teks ke tengah)
                    // 2. border-b (Garis pembatas pink tipis antar kategori)
                    className={`group w-full px-2 py-2.5 text-center text-xs font-bold transition-all duration-300 border-b border-[#D63384]/20 last:border-none ${
                        activeCategory === cat
                        ? "bg-[#D63384] text-white"
                        : "text-[#D63384] hover:bg-pink-50"
                    }`}
                    >
                    {/* Truncate tetap ada untuk menjaga jika teks terlalu panjang tidak merusak layout */}
                    <span className="truncate block w-full">{cat}</span>
                    </button>
                ))}
                </div>
            </div>
          </aside>

        {/* CONTAINER UTAMA - Pastikan menggunakan flex agar sidebar dan konten sejajar */}
        <div className="flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR KAMU DI SINI (Pastikan tidak ada w-full yang menutupi) */}

        {/* GRID CONTENT */}
        <div className="flex-1 min-w-0">
            
            {/* Debugging: Cek apakah data masuk. Jika muncul angka di layar, berarti data ada. */}
            {/* <div className="text-black">Jumlah Data: {paginatedData?.length}</div> */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 mb-16">
            {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                <div
                    key={item.id}
                    className="group relative w-full aspect-[253/320] rounded-xl overflow-hidden cursor-pointer bg-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                    {/* Image dengan layout fill harus dibungkus parent relative (sudah di atas) */}
                    <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    priority={true} // Memaksa gambar dimuat lebih cepat
                    />
                    
                    {/* Overlay Gradasi */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    {/* Content Teks */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <div className="text-white text-center">
                        <span className="inline-block px-2 py-0.5 bg-[#D63384] text-[8px] sm:text-[9px] rounded-full font-bold uppercase mb-2">
                        {item.status || "Telah Berakhir"}
                        </span>
                        <h3 className="text-[10px] sm:text-xs font-bold leading-tight line-clamp-2 mb-1">
                        {item.title}
                        </h3>
                        <p className="text-[8px] sm:text-[9px] text-gray-300 mb-2">
                        {item.date || "15 Juli 2025"}
                        </p>
                        
                        {/* Tombol Ikuti Sekarang */}
                        <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300">
                        <button className="w-full py-1.5 bg-[#D63384] text-[9px] font-bold rounded-lg">
                            Ikuti Sekarang
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            ) : (
                /* Jika data benar-benar kosong */
                <div className="col-span-full text-center py-20 text-gray-500 font-bold">
                Data tidak ditemukan atau sedang memuat...
                </div>
            )}
            </div>
        </div>
        </div>

        </div>
      </section>
    </main>
  );
}