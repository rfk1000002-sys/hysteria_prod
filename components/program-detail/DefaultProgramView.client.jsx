// components/program-detail/DefaultProgramView.client.jsx
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const PROGRAM_DATA = {
  'festival-kampung': { title: 'Festival Kampung', desc: 'Perayaan seni, budaya, dan kehidupan kampung.', categories: [{ name: 'Semua', id: 'semua' }, { name: 'Gebyuran Bustaman', id: 'gebyuran-bustaman' }, { name: 'Nginguk Githok', id: 'nginguk-githok' }, { name: 'Festival Bukit Jatiwayang', id: 'festival-bukit-jatiwayang' }, { name: 'Sobo Roworejo', id: 'sobo-roworejo' }, { name: 'Srawung Sendang', id: 'srawung-sendang' }, { name: 'Festival Ngijo', id: 'festival-ngijo' }, { name: 'Banyu Pitu', id: 'banyu-pitu' }, { name: 'Bulusan Fest', id: 'bulusan-fest' }, { name: 'Labuhan Kali', id: 'labuhan-kali' }, { name: 'Iki Buntu Fest', id: 'iki-buntu-fest' }, { name: 'Festival ke Tugu', id: 'festival-ke-tugu' }] },
  'festival-kota': { title: 'Festival Kota', desc: 'Perayaan seni di ruang publik.', categories: [{ name: 'Semua', id: 'semua' }, { name: 'Zine Fest', id: 'zine-fest' }, { name: 'Semarang Writers Week', id: 'semarang-writers-week' }, { name: 'City Canvas', id: 'city-canvas' }, { name: 'Dokumentaria', id: 'dokumentaria' }] },
  'festival-biennale': { title: 'Biennale', desc: 'Perhelatan dua tahunan.', categories: [{ name: 'Semua', id: 'semua' }, { name: 'Pentak Labs', id: 'pentak-labs' }, { name: 'Tengok Bustaman', id: 'tengok-bustaman' }] },
  'forum': { title: 'Forum', desc: 'Ruang diskusi dan pertukaran gagasan.', categories: [{ name: 'Semua', id: 'semua' }, { name: 'Temu Jejaring', id: 'temu-jejaring' }, { name: 'Buah tangan', id: 'buah-tangan' }, { name: 'Lawatan Jalan Terus', id: 'lawatan-jalan-terus' }, { name: 'Simposium', id: 'simposium' }, { name: 'Meditasi', id: 'meditasi' }] },
  'music': { title: 'Music', desc: 'Pertunjukan musik dan eksplorasi bunyi.', categories: [{ name: 'Semua', id: 'semua' }, { name: 'SGRT', id: 'sgrt' }, { name: 'Kotak Listrik', id: 'kotak-listrik' }, { name: 'Di(e)gital', id: 'die-gital' }, { name: 'Bunyi Halaman Belakang', id: 'bunyi-halaman-belakang' }, { name: 'Folk Me Up', id: 'folk-me-up' }] },
  'pemutaran-film': { title: 'Pemutaran Film', desc: 'Apresiasi sinema alternatif.', categories: [{ name: 'Semua', id: 'semua' }, { name: 'Screening AM', id: 'screening-am-film' }, { name: 'Lawatan Bandeng Keliling', id: 'lawatan-bandeng-keliling-film' }] },
  
  // KELOMPOK 6 CARD (TANPA SIDEBAR)
  'flash-residency': { title: 'Flash Residency', desc: 'Program residensi singkat.', categories: [] },
  'kandang-tandang': { title: 'Kandang Tandang', desc: 'Pertukaran seniman antar wilayah.', categories: [] },
  'safari-memori': { title: 'Safari Memori', desc: 'Penelusuran sejarah dan ingatan kolektif warga melalui medium siniar dan obrolan.', categories: [] },
  'aston': { title: 'Aston', desc: 'Seri podcast yang membahas fenomena urban.', categories: [] },
  'sore-di-stonen': { title: 'Sore di Stonen', desc: 'Bincang santai menjelang senja.', categories: [] },
  'sapa-warga': { title: 'Sapa Warga', desc: 'Dokumentasi video interaksi warga.', categories: [] }
};

export default function DefaultProgramView({ actualSlug, heroData }) {
  const data = PROGRAM_DATA[actualSlug];

  const displayTitle = heroData?.title || data?.title || "Program";
  const displayDesc = heroData?.subtitle || data?.desc || "";
  const displayImage = heroData?.image || "/image/bg_program.jpeg";

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [sortOption, setSortOption] = useState('Terbaru');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [realItems, setRealItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 👉 STATE UNTUK CUSTOM SCROLLBAR MOBILE
  const categoryScrollRef = useRef(null);
  const [catScrollProgress, setCatScrollProgress] = useState(0);
  const [catThumbWidth, setCatThumbWidth] = useState(20);

  const hasSidebar = data?.categories && data.categories.length > 0;
  const itemsPerPage = hasSidebar ? 15 : 18; 

  // Tutup Dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Data dari API Database
  useEffect(() => {
    async function fetchPrograms() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/programs');
        if (!res.ok) throw new Error('Gagal memuat data');
        const dbPrograms = await res.json();

        const mainTitle = data?.title.toLowerCase().trim() || "";
        const fallbackTitle = actualSlug.toLowerCase().replace(/-/g, ' ').trim();
        
        const validCategoryNames = data?.categories
            ?.map(c => c.name.toLowerCase().trim())
            .filter(name => name !== 'semua') || [];

        const validPageTags = [mainTitle, fallbackTitle, ...validCategoryNames];

        const formatted = dbPrograms
          .filter(p => p.isPublished)
          .filter(p => {
             const catNames = p.eventCategories?.map(pc => pc.categoryItem?.title.toLowerCase().trim()) || [];
             return catNames.some(cat => validPageTags.includes(cat));
          })
          .map(p => {
            const startDate = p.startAt ? new Date(p.startAt) : null;
            const today = new Date();
            const status = startDate && startDate > today ? 'Akan Berlangsung' : 'Telah Berakhir';
            
            const dateStr = startDate 
              ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(startDate)
              : 'Waktu Menyesuaikan';

            const rawDate = startDate ? startDate.getTime() : new Date(p.createdAt).getTime();

            const rawCats = p.eventCategories?.map(pc => pc.categoryItem) || [];
            const filterCategoryNames = rawCats.map(c => c?.title?.trim()).filter(Boolean);

            const specificCats = rawCats.filter(c => 
                c?.title &&
                c.title.toLowerCase() !== mainTitle && 
                c.title.toLowerCase() !== fallbackTitle &&
                c.title.toLowerCase() !== 'semua'
            );
            
            const primaryCatObj = specificCats.length > 0 ? specificCats[0] : rawCats[0];
            const primaryCatName = primaryCatObj?.title || data?.title || 'Program';
            
            const itemSlug = primaryCatObj?.slug || actualSlug;

            return {
              id: p.id,
              title: p.title,
              category: primaryCatName, 
              slug: itemSlug, 
              filterCategories: filterCategoryNames, 
              status: status,
              date: dateStr,
              rawDate: rawDate, 
              image: p.poster,
              isChoice: false 
            };
          });

        setRealItems(formatted);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrograms();
  }, [actualSlug, data]);

  // Fungsi Logika Sync Scrollbar Mobile
  const handleCategoryScroll = () => {
    const el = categoryScrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScrollLeft = scrollWidth - clientWidth;
      const progress = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
      setCatScrollProgress(progress);

      const thumbW = Math.max((clientWidth / scrollWidth) * 100, 10);
      setCatThumbWidth(thumbW);
    }
  };

  useEffect(() => {
    handleCategoryScroll();
    window.addEventListener('resize', handleCategoryScroll);
    return () => window.removeEventListener('resize', handleCategoryScroll);
  }, [data?.categories]);

  const scrollCatRight = () => {
    if (categoryScrollRef.current) categoryScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  const scrollCatLeft = () => {
    if (categoryScrollRef.current) categoryScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  useEffect(() => {
    const paramKategori = searchParams.get('kategori');
    if (paramKategori && data?.categories) {
      const foundCategory = data.categories.find(c => c.id === paramKategori);
      if (foundCategory) {
        setActiveCategory(foundCategory.name);
        setCurrentPage(1);
      }
    }
  }, [searchParams, data]);

  const handleCategoryChange = (categoryObj) => {
    setActiveCategory(categoryObj.name);
    setCurrentPage(1);
    if (categoryObj.id && categoryObj.id !== 'semua') {
      router.replace(`${pathname}?kategori=${categoryObj.id}`, { scroll: false });
    } else {
      router.replace(pathname, { scroll: false }); 
    }
  };

  const filteredItems = useMemo(() => {
    let result = realItems.filter((item) => {
      const matchCategory = !hasSidebar || activeCategory === 'Semua' || 
          item.filterCategories.some(c => c.toLowerCase() === activeCategory.toLowerCase().trim());
          
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchCategory && matchSearch;
    });

    result = result.sort((a, b) => {
      if (sortOption === 'Terbaru') return b.rawDate - a.rawDate;
      if (sortOption === 'Terlama') return a.rawDate - b.rawDate;
      if (sortOption === 'Judul, A - Z') return a.title.localeCompare(b.title);
      if (sortOption === 'Judul, Z - A') return b.title.localeCompare(a.title);
      return 0;
    });

    return result;
  }, [realItems, activeCategory, searchQuery, hasSidebar, sortOption]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentDisplayItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const getVisiblePageNumbers = () => {
    const maxVisibleButtons = 5; 
    if (totalPages <= maxVisibleButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let startPage = currentPage - Math.floor(maxVisibleButtons / 2);
    let endPage = currentPage + Math.floor(maxVisibleButtons / 2);

    if (startPage < 1) { startPage = 1; endPage = maxVisibleButtons; }
    if (endPage > totalPages) { endPage = totalPages; startPage = totalPages - maxVisibleButtons + 1; }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  if (!data) return null;

  return (
    <main className={`min-h-screen bg-white ${poppins.className}`}>
      
      {/* 👉 HERO SECTION: Tinggi diperpanjang di Mobile (min-h-[400px]), di Desktop tetap aspect ratio 1920/850 */}
      <section className="relative w-full bg-[#1a1a1a] flex flex-col justify-end overflow-hidden min-h-[400px] md:min-h-0 md:aspect-[1920/850]">
        <div className="absolute inset-0 w-full h-full">
          <Image src={displayImage} alt={displayTitle} fill priority className="object-cover object-center" quality={100} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:via-black/30"></div> 
        </div>
        <div className="relative z-10 w-full px-6 md:px-10 lg:px-20 pb-8 md:pb-12 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold mb-3 md:mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] tracking-tight uppercase whitespace-pre-line leading-tight">
            {displayTitle}
          </h1>
          <p className="text-sm md:text-lg lg:text-xl max-w-3xl font-medium opacity-95 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-pre-line line-clamp-4 md:line-clamp-none">
            {displayDesc}
          </p>
        </div>
      </section>

      {/* 👉 SEARCH & FILTER SECTION */}
      <div className="w-full px-6 md:px-10 lg:px-20 mt-6 md:mt-10 mb-4 md:mb-6">
        <div className="flex gap-3 md:gap-4 items-center w-full max-w-3xl mx-auto">
            
            {/* Search Input */}
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                className="w-full border border-[#D63384] rounded-full py-2.5 md:py-3 px-5 md:px-6 text-sm md:text-base text-[#D63384] placeholder-[#D63384]/60 focus:outline-none focus:ring-1 focus:ring-[#D63384] transition-all bg-white shadow-sm" 
              />
              <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-[#D63384] pointer-events-none">
                <svg width="18" height="18" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#D63384] flex items-center justify-center text-[#D63384] transition-colors shadow-sm ${isDropdownOpen ? 'bg-pink-50' : 'bg-white hover:bg-pink-50'}`}
              >
                <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 z-50">
                  <p className="text-[#3F334D] font-bold px-4 pt-2 pb-2 text-xs md:text-sm">Sort by</p>
                  <div className="flex flex-col gap-1">
                    {['Terbaru', 'Terlama', 'Judul, A - Z', 'Judul, Z - A'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortOption(opt); setIsDropdownOpen(false); setCurrentPage(1); }}
                        className={`text-left px-4 py-2 text-xs md:text-[13px] rounded-lg transition-colors ${sortOption === opt ? 'bg-pink-50 text-[#D63384] font-semibold' : 'text-[#3F334D] hover:bg-gray-50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

        </div>
      </div>

      {/* 👉 KATEGORI MOBILE KHUSUS (Tampil sebagai Chips Horizontal Scroll & Custom Scrollbar) */}
      {hasSidebar && (
         <div className="md:hidden w-full pb-6">
            
            {/* Wrapper Tombol Chips - Menggunakan Spacer untuk Padding Kiri/Kanan agar bisa tembus edge */}
            <div 
              ref={categoryScrollRef}
              onScroll={handleCategoryScroll}
              className="w-full flex overflow-x-auto gap-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
               {/* Spacer Kiri seukuran px-6 (24px) */}
               <div className="w-6 flex-shrink-0" />
               
               {data.categories.map((catItem, index) => {
                 const isActive = activeCategory === catItem.name;
                 return (
                    <button 
                      key={index} 
                      onClick={() => handleCategoryChange(catItem)}
                      className={`flex-shrink-0 snap-start px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap
                        ${isActive ? 'bg-[#D63384] text-white border-[#D63384]' : 'bg-white text-[#D63384] border-[#D63384] hover:bg-pink-50'}`}
                    >
                      {catItem.name}
                    </button>
                 );
               })}
               
               {/* Spacer Kanan seukuran px-6 (24px) */}
               <div className="w-6 flex-shrink-0" />
            </div>

            {/* Custom Bar Scroll Indicator sesuai Desain */}
            <div className="flex items-center justify-between px-6 mt-4 gap-2">
              <button onClick={scrollCatLeft} className="text-[#D63384] flex-shrink-0 focus:outline-none text-[10px] sm:text-xs">
                ◀
              </button>

              {/* Track Bar (Latar Abu-abu Tipis) */}
              <div className="flex-1 bg-gray-200 h-2.5 rounded-full relative overflow-hidden">
                 {/* Thumb Bar (Indikator Scroll Abu-abu Gelap) */}
                 <div 
                   className="absolute top-0 bottom-0 bg-[#A39CA9] rounded-full transition-all duration-150"
                   style={{
                     width: `${catThumbWidth}%`,
                     left: `${catScrollProgress * (100 - catThumbWidth)}%`
                   }}
                 />
              </div>

              <button onClick={scrollCatRight} className="text-[#D63384] flex-shrink-0 focus:outline-none text-[10px] sm:text-xs">
                ▶
              </button>
            </div>

         </div>
      )}

      {/* 👉 MAIN CONTENT AREA */}
      <div className="w-full px-6 md:px-10 lg:px-20 pb-16 md:pb-20">
         <div className={`flex flex-row gap-8 items-start ${hasSidebar ? 'justify-center lg:justify-start' : 'justify-center'}`}>
            
            {/* 👉 SIDEBAR DESKTOP (Sembunyi di Mobile) */}
            {hasSidebar && (
                <aside className="w-[240px] flex-shrink-0 hidden md:block">
                   <div className="flex flex-col border border-[#D63384] rounded-xl overflow-hidden shadow-sm">
                      {data.categories.map((catItem, index) => {
                         const isActive = activeCategory === catItem.name;
                         const isLast = index === data.categories.length - 1;
                         return (
                            <button key={index} onClick={() => handleCategoryChange(catItem)}
                               className={`w-full py-3 px-4 text-sm font-semibold transition-all duration-200 text-center ${!isLast ? 'border-b border-[#D63384]' : ''} ${isActive ? 'bg-[#D63384] text-white' : 'bg-white text-[#D63384] hover:bg-pink-50'}`}>
                               {catItem.name}
                            </button>
                         );
                      })}
                   </div>
                </aside>
            )}

            {/* 👉 GRID KARTU (CARD) */}
            <div className={`flex-1 w-full ${!hasSidebar ? 'max-w-7xl mx-auto' : ''}`}>
                {isLoading ? (
                    <div className="w-full h-[300px] md:h-[400px] flex flex-col items-center justify-center text-[#D63384]">
                        <p className="text-base md:text-lg font-medium animate-pulse">Memuat program...</p>
                    </div>
                ) : currentDisplayItems.length === 0 ? (
                    <div className="w-full h-[300px] md:h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl px-4 text-center">
                        <p className="text-sm md:text-lg font-medium">Tidak ada program yang ditemukan.</p>
                    </div>
                ) : (
                    <div className={`grid gap-4 md:gap-6 justify-items-start md:justify-items-center ${
                        hasSidebar 
                        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                    }`}>
                        {currentDisplayItems.map((item) => (
                            <Link 
                                  href={`/program/${item.slug}/${item.id}`} 
                                  key={item.id} 
                                  className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full aspect-[4/5] md:max-w-[210px] md:h-[290px] block bg-gray-100" 
                              >
                                <Image 
                                  src={item.image || "https://via.placeholder.com/400x500?text=No+Poster"} 
                                  alt={item.title} 
                                  fill 
                                  className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                                  sizes="(max-width: 640px) 50vw, 210px"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                                
                                {/* Info Default (Selalu Tampil di Mobile, Hilang saat hover di Desktop) */}
                                <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end text-white transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 pointer-events-none">
                                    <div className="self-start mb-1">{item.isChoice && <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 md:py-1 rounded backdrop-blur-sm border border-white/10">Pilihan</span>}</div>
                                    <div>
                                      <span className="text-[9px] md:text-[10px] font-medium text-pink-300 block mb-0.5 md:mb-1 line-clamp-1">{item.category}</span>
                                      <h3 className="font-bold text-xs md:text-sm leading-tight line-clamp-2 drop-shadow-md">{item.title}</h3>
                                    </div>
                                </div>

                                {/* Hover Overlay (Hanya aktif di Desktop) */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col justify-end p-3 md:p-4 hidden md:flex">
                                    <div className="flex flex-col transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="mb-2">
                                          <span className="bg-white text-[#D63384] text-[9px] md:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm inline-block">
                                            {item.status}
                                          </span>
                                        </div>
                                        <h3 className="font-bold text-xs md:text-sm leading-snug text-white drop-shadow-md mb-0.5 line-clamp-2">{item.title}</h3>
                                        <h4 className="font-bold text-xs md:text-sm leading-snug text-white drop-shadow-md mb-1 line-clamp-1">-{item.category}-</h4>
                                        <span className="text-[9px] md:text-[10px] font-medium text-gray-200 block mb-3">{item.date}</span>
                              
                                        <span className={`text-white text-[10px] md:text-[11px] py-1.5 md:py-2 px-3 md:px-4 rounded-md font-semibold w-max transition-colors shadow-md block text-center
                                            ${item.status === 'Akan Berlangsung' ? 'bg-[#D63384] hover:bg-[#b52a6f]' : 'bg-[#3F334D] hover:bg-[#2c2336]'}
                                        `}>
                                            Lihat Sekarang
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* 👉 PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10 md:mt-12">
                        <div className="flex items-center gap-1 md:gap-2 bg-[#D63384] px-2 md:px-3 py-1.5 md:py-2 rounded-full shadow-lg">
                            <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white text-[#D63384] disabled:opacity-50 text-xs md:text-sm">&lt;</button>
                            <div className="flex items-center gap-0.5 md:gap-1 px-1 md:px-2">
                                {getVisiblePageNumbers().map((page) => (
                                    <button key={page} onClick={() => handlePageChange(page)} className={`w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full text-xs md:text-sm font-bold ${currentPage === page ? 'bg-white/30 text-white' : 'text-white'}`}>{page}</button>
                                ))}
                            </div>
                            <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white text-[#D63384] disabled:opacity-50 text-xs md:text-sm">&gt;</button>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </main>
  );
}