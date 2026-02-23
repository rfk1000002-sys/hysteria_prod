'use client';

import React, { useState, useMemo, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// ==========================================
// 1. DATA KONFIGURASI PROGRAM
// ==========================================
const PROGRAM_DATA = {
  // --- FESTIVAL ---
  'festival-kampung': {
    title: 'Festival Kampung',
    desc: 'Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.',
    categories: [
      { name: 'Semua', path: '' },
      { name: 'Gebyuran Bustaman', path: '/program/festival-kampung/gebyuran-bustaman' },
      { name: 'Nginguk Githok', path: '/program/festival-kampung/nginguk-githok' },
      { name: 'Festival Bukit Jatiwayang', path: '/program/festival-kampung/festival-bukit-jatiwayang' },
      { name: 'Sobo Roworejo', path: '/program/festival-kampung/sobo-roworejo' },
      { name: 'Srawung Sendang', path: '/program/festival-kampung/srawung-sendang' },
      { name: 'Festival Ngijo', path: '/program/festival-kampung/festival-ngijo' },
      { name: 'Banyu Pitu', path: '/program/festival-kampung/banyu-pitu' },
      { name: 'Bulusan Fest', path: '/program/festival-kampung/bulusan-fest' },
      { name: 'Labuhan Kali', path: '/program/festival-kampung/labuhan-kali' },
      { name: 'Iki Buntu Fest', path: '/program/festival-kampung/iki-buntu-fest' },
      { name: 'Festival ke Tugu', path: '/program/festival-kampung/festival-ke-tugu' }
    ]
  },
  'festival-kota': {
    title: 'Festival Kota',
    desc: 'Perayaan seni, budaya, dan kehidupan kota melalui kerja kreatif warga dan seniman di ruang publik.',
    categories: ['Semua', 'Zine Fest', 'Semarang Writers Week', 'City Canvas', 'Dokumentaria']
  },
  'festival-biennale': {
    title: 'Biennale',
    desc: 'Perhelatan dua tahunan skala internasional yang mempertemukan gagasan lokal dan global.',
    categories: ['Semua', 'Pentak Labs', 'Tengok Bustaman']
  },
  'forum': {
    title: 'Forum',
    desc: 'Ruang diskusi dan pertukaran gagasan mengenai isu-isu terkini dalam seni dan budaya.',
    categories: ['Semua', 'Temu Jejaring', 'Buah tangan', 'Lawatan Jalan Terus', 'Simposium', 'Meditasi']
  },
  'music': {
    title: 'Music',
    desc: 'Pertunjukan musik yang menampilkan eksplorasi bunyi dan kolaborasi lintas genre.',
    categories: ['Semua', 'SGRT', 'Kotak Listrik', 'Di(e)gital', 'Bunyi Halaman Belakang', 'Folk Me Up']
  },
  'pemutaran-film': {
    title: 'Pemutaran Film',
    desc: 'Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.', // (Silakan ubah deskripsi ini jika perlu)
    categories: [
        'Semua', 
        'Screening AM', 
        'Lawatan Bandeng Keling'
    ] 
  },

  // --- NEW: RESIDENSI & WORKSHOP (TANPA KATEGORI) ---
  'flash-residency': {
    title: 'Flash Residency',
    desc: 'Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.',
    categories: [] // Dikosongkan agar sidebar tidak muncul
  },
  'kandang-tandang': {
    title: 'Kandang Tandang',
    desc: 'Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.',
    categories: [] // Dikosongkan agar sidebar tidak muncul
  },
  'safari-memori': {
    title: 'safari-memori',
    desc: 'Perayaan seni, budaya, dan kehidupan kampung melalui kerja kolektif warga dan seniman.', // Ubah deskripsi jika perlu
    categories: [] // Dikosongkan agar sidebar tidak muncul
  }
};

// ==========================================
// 2. GENERATE DUMMY CONTENT
// ==========================================
const generateDummyData = (slug) => {
  const rawCategories = PROGRAM_DATA[slug]?.categories || [];
  
  const categories = rawCategories
    .map(c => typeof c === 'object' ? c.name : c)
    .filter(c => c !== 'Semua');
  
  // Deteksi apakah program ini punya kategori atau tidak
  const hasCategories = categories.length > 0;

  return Array.from({ length: 150 }).map((_, index) => {
    // Jika tidak ada kategori, isi saja dengan string kosong/umum
    const category = hasCategories ? categories[index % categories.length] : 'Umum'; 
    return {
      id: index,
      title: `Program ${slug.toUpperCase()} ${hasCategories ? `- ${category} ` : ''}#${index + 1}: Di Korea Mung Pindah Turu Tok!`,
      year: 2023 + (index % 3),
      category: category,
      isChoice: index % 3 === 0, 
    };
  });
};

export default function ProgramDetailPage({ params }) {
  const { slug } = use(params); 
  const data = PROGRAM_DATA[slug];

  // State
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  
  // Cek apakah punya sidebar (jika array categories tidak kosong)
  const hasSidebar = data?.categories && data.categories.length > 0;
  
  // Jika tidak pakai sidebar (layout penuh), buat 18 per halaman (grid 6x3 rapi)
  const itemsPerPage = hasSidebar ? 15 : 18; 

  const allItems = useMemo(() => generateDummyData(slug), [slug]);

  // 1. Filter Data
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Jika tidak ada sidebar, abaikan filter kategori
      const matchCategory = !hasSidebar || activeCategory === 'Semua' || item.category === activeCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allItems, activeCategory, searchQuery, hasSidebar]);

  // 2. Hitung Total Halaman
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // 3. Potong Data (Slice)
  const currentDisplayItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // 4. LOGIKA PAGINASI GESER (SLIDING WINDOW)
  const getVisiblePageNumbers = () => {
    const maxVisibleButtons = 5; 

    if (totalPages <= maxVisibleButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = currentPage - Math.floor(maxVisibleButtons / 2);
    let endPage = currentPage + Math.floor(maxVisibleButtons / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = maxVisibleButtons;
    }

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisibleButtons + 1;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
  }

  // JIKA SLUG TIDAK ADA DI PROGRAM_DATA, MAKA MUNCUL 404
  if (!data) return notFound();

  return (
    <main className={`min-h-screen bg-white ${poppins.className}`}>

      {/* HERO SECTION */}
      <section className="relative w-full h-[700px]">
        <div className="absolute inset-0">
          <Image src="/image/bg_program.jpeg" alt="Background Program" fill priority className="object-cover" quality={100} />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative z-10 w-full px-10 lg:px-20 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-md tracking-tight uppercase">{data.title}</h1>
          <p className="text-lg md:text-xl max-w-2xl font-medium opacity-95 leading-relaxed drop-shadow-sm">{data.desc}</p>
        </div>
      </section>

      {/* SEARCH & FILTER SECTION */}
      <div className="w-full px-10 lg:px-20 mt-10 mb-8">
        <div className="flex gap-4 items-center w-full max-w-3xl mx-auto">
            <div className="relative flex-grow">
              <input 
                type="text" placeholder="Cari program atau karya..." value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full border border-[#D63384] rounded-full py-3 px-6 text-[#D63384] placeholder-[#D63384]/60 focus:outline-none focus:ring-1 focus:ring-[#D63384] transition-all bg-white shadow-sm"
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[#D63384]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); setCurrentPage(1); }} className="flex-shrink-0 w-12 h-12 rounded-full border border-[#D63384] flex items-center justify-center text-[#D63384] hover:bg-pink-50 transition-colors bg-white shadow-sm" title="Reset Filter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full px-10 lg:px-20 pb-20">
         
         <div className="flex flex-row gap-8 items-start justify-center lg:justify-start">
            
            {/* === SIDEBAR (Hanya tampil jika ada kategori) === */}
            {hasSidebar && (
                <aside className="w-[240px] flex-shrink-0 hidden md:block">
                   <div className="flex flex-col border border-[#D63384] rounded-xl overflow-hidden shadow-sm">
                      {data.categories.map((catItem, index) => {
                         const categoryName = typeof catItem === 'object' ? catItem.name : catItem;
                         const isActive = activeCategory === categoryName;
                         const isLast = index === data.categories.length - 1;

                         return (
                            <button 
                               key={index} 
                               onClick={() => { setActiveCategory(categoryName); setCurrentPage(1); }}
                               className={`
                                  w-full py-3 px-4 text-sm font-semibold transition-all duration-200 text-center
                                  ${!isLast ? 'border-b border-[#D63384]' : ''}
                                  ${isActive ? 'bg-[#D63384] text-white' : 'bg-white text-[#D63384] hover:bg-pink-50'}
                               `}
                            >
                               {categoryName}
                            </button>
                         );
                      })}
                   </div>
                </aside>
            )}

            {/* === CARD AREA === */}
            <div className="flex-1 w-full">
                {currentDisplayItems.length === 0 ? (
                    <div className="w-full h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-lg font-medium">Tidak ada program yang ditemukan.</p>
                        <button onClick={() => {setSearchQuery(''); setActiveCategory('Semua'); setCurrentPage(1);}} className="mt-2 text-[#D63384] underline text-sm">Reset Pencarian</button>
                    </div>
                ) : (
                    <div className={`flex flex-wrap gap-4 ${hasSidebar ? 'justify-between' : 'justify-center xl:justify-start gap-x-[1.2rem]'}`}>
                        {currentDisplayItems.map((item) => (
                            <div key={item.id} className="group relative rounded-[10px] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                                style={{ width: '210px', height: '290px', background: 'linear-gradient(180deg, #F2C94C 0%, #F2994A 100%)', flexShrink: 0 }}>
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-0"></div>
                                <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                                    <div className="self-start">
                                        {item.isChoice && (
                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded backdrop-blur-sm border border-white/10">Pilihan</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold block mb-1 opacity-90">{item.year}</span>
                                        <h3 className="font-bold text-sm leading-tight line-clamp-3 group-hover:underline underline-offset-2 uppercase">{item.title}</h3>
                                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-[#D63384] text-white text-[10px] py-1 px-3 rounded-full font-bold">Ikuti Sekarang</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {[...Array(6)].map((_, i) => (
                            <div key={`dummy-${i}`} style={{ width: '210px', height: 0, padding: 0, margin: 0 }} />
                        ))}
                    </div>
                )}

                {/* PAGINATION SECTION */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex items-center gap-2 bg-[#D63384] px-3 py-2 rounded-full shadow-lg">
                            <button 
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#D63384] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            <div className="flex items-center gap-1 px-2">
                                {getVisiblePageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`
                                            w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all
                                            ${currentPage === page 
                                                ? 'bg-white/30 text-white' 
                                                : 'text-white hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#D63384] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </main>
  );
}