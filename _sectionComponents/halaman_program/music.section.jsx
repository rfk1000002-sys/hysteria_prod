"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const musicSlugs = [
  'music', 
  'sgrt', 
  'kotak-listrik', 
  'die-gital', 
  'bunyi-halaman-belakang', 
  'folk-me-up'
];

export default function MusicSection() {
  const [musicData, setMusicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function fetchMusicEvents() {
      try {
        const res = await fetch('/api/admin/programs'); 
        if (!res.ok) throw new Error("Gagal mengambil data");
        const allPrograms = await res.json();
        
        const musicEvents = allPrograms
          .filter(event => 
            event.isPublished && 
            event.eventCategories?.some(cat => musicSlugs.includes(cat.categoryItem?.slug))
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          .slice(0, 10); 

        setMusicData(musicEvents);
      } catch (error) {
        console.error("Error fetching music events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMusicEvents();
  }, []);

  const handleMouseDown = (e) => {
    setIsDown(true);
    if(scrollRef.current) {
        scrollRef.current.style.scrollBehavior = 'auto'; 
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    if(scrollRef.current) scrollRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseUp = () => {
    setIsDown(false);
    if(scrollRef.current) scrollRef.current.style.scrollBehavior = 'smooth';
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    if(scrollRef.current) {
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const container = scrollRef.current;
      const scrollPos = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      if (Math.abs(maxScrollLeft - scrollPos) <= 5) {
        setActiveIndex(musicData.length - 1);
      } else {
        const firstCard = container.children[0];
        const itemWidth = firstCard ? firstCard.clientWidth : 300; 
        const gap = window.innerWidth < 768 ? 16 : 24; 
        const totalItemWidth = itemWidth + gap; 
        const index = Math.round(scrollPos / totalItemWidth);
        
        setActiveIndex(Math.min(index, musicData.length - 1));
      }
    }
  };

  const scrollToSlide = (index) => {
    if (scrollRef.current && scrollRef.current.children.length > 0) {
      const container = scrollRef.current;
      const firstCard = container.children[0];
      const itemWidth = firstCard ? firstCard.clientWidth : 300;
      const gap = window.innerWidth < 768 ? 16 : 24; 
      
      container.style.scrollBehavior = 'smooth';
      
      if (index === musicData.length - 1) {
        container.scrollTo({ left: container.scrollWidth });
      } else {
        container.scrollTo({ left: (itemWidth + gap) * index });
      }
      
      setActiveIndex(index);
    }
  };

  const formatEventTime = (startAt) => {
    if (!startAt) return "Waktu Menyesuaikan";
    const date = new Date(startAt);
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const checkStatus = (startAt) => {
    if (!startAt) return "Telah Berakhir";
    return new Date(startAt) > new Date() ? "Akan Berlangsung" : "Telah Berakhir";
  };

  if (isLoading) {
    return (
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-20 flex justify-center py-10 md:py-20">
         <div className="animate-pulse text-[#E83C91] font-bold">Memuat Data Musik...</div>
      </section>
    );
  }

  if (musicData.length === 0) {
    return (
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-20">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className={`${poppins.className} text-[22px] md:text-[32px] font-bold text-black`}>Musik</h2>
        </div>
        <div className="w-full py-10 flex justify-center items-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
           <p className="text-gray-400 font-medium text-sm md:text-base">Belum ada acara Musik yang diterbitkan.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="music" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-20">
      
      {/* Header Responsif */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className={`${poppins.className} text-[22px] md:text-[32px] font-bold text-black`}>
          Musik
        </h2>
        <Link href="/program/music" className="text-xs md:text-sm text-black font-semibold underline underline-offset-4 hover:text-[#D63384] transition">
            Lihat Semua
        </Link>
      </div>
      
      {/* Slider Container */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onScroll={handleScroll}
        className={`flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-2 -mx-6 px-6 md:mx-0 md:px-0 md:pr-10 touch-pan-y overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${isDown ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'} 
        `}
      >
        {musicData.map((post) => {
          const dateStr = formatEventTime(post.startAt);
          const statusEvent = checkStatus(post.startAt);
          const specificCategory = post.eventCategories?.find(cat => musicSlugs.includes(cat.categoryItem?.slug))?.categoryItem?.title || "Music";

          return (
            <div 
              key={post.id} 
              // 👉 KUNCI RESPONSIVE: Lebar 160px di HP, 240px di Tablet, 300px di Desktop
              className="flex-shrink-0 group relative w-[160px] sm:w-[240px] md:w-[300px] aspect-[4/5] snap-start rounded-xl overflow-hidden shadow-lg transition-all duration-300 select-none hover:shadow-2xl bg-gray-100"
            >
              <Image
                  src={post.poster || "https://via.placeholder.com/400x500?text=No+Poster"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 240px, 300px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Tampilan Default */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-white transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 pointer-events-none">
                 <h3 className="text-sm sm:text-lg md:text-2xl font-black leading-tight uppercase mb-1 md:mb-2 drop-shadow-lg line-clamp-2">
                     {post.title}
                 </h3>
                 <div className="flex items-center gap-2 opacity-90 text-[10px] md:text-xs">
                     <span className="truncate">🎵 {specificCategory}</span>
                 </div>
              </div>
              
              {/* Tampilan Saat Di-Hover (Desktop Only) */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                  <div className="relative z-10 h-full p-6 flex flex-col justify-end items-start text-left">
                      <div className="mb-3">
                         <span className="bg-white text-[#D63384] text-xs font-semibold px-3.5 py-1 rounded-full shadow-sm inline-block">
                            {statusEvent}
                         </span>
                      </div>
                      <h3 className="text-white font-bold text-xl leading-snug drop-shadow-md line-clamp-2">{post.title}</h3>
                      <h4 className="text-white font-bold text-lg leading-snug mb-2 drop-shadow-md line-clamp-1">-{specificCategory}-</h4>
                      <p className="text-gray-200 text-sm font-medium mb-5">{dateStr}</p>
                      
                      <Link 
                          href={`/program/music/${post.id}`}
                          className={`text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-lg ${statusEvent === 'Akan Berlangsung' ? 'bg-[#D63384] hover:bg-[#b02a6b]' : 'bg-[#3F334D] hover:bg-[#2c2336]'}`}
                      >
                          Lihat Sekarang
                      </Link>
                  </div>
              </div>

              {/* 👉 Fallback klik langsung ke detail untuk versi Mobile */}
              <Link href={`/program/music/${post.id}`} className="absolute inset-0 z-30 md:hidden"></Link>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {musicData.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4 md:mt-8 h-6 flex-wrap">
          {musicData.map((_, index) => (
            <button
              key={index} onClick={() => scrollToSlide(index)}
              className={`rounded-full transition-all duration-300 flex-shrink-0 ${activeIndex === index ? "w-3 h-3 md:w-4 md:h-4 bg-[#D63384] opacity-100" : "w-1.5 h-1.5 md:w-2 md:h-2 bg-[#D63384] opacity-40 hover:opacity-100" }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}