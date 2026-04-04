"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
});

export default function PodcastSection({ podcasts }) {
  const [podcastLinks, setPodcastLinks] = useState({
    aston: "",
    soreDiStonen: "",
  });

  useEffect(() => {
    async function fetchPodcastData() {
      try {
        const res = await fetch("/api/admin/programs/podcast");
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setPodcastLinks({
              aston: data.astonLink || "",
              soreDiStonen: data.soreDiStonenLink || "",
            });
          }
        }
      } catch (error) {
        console.error("Gagal mengambil link podcast:", error);
      }
    }
    fetchPodcastData();
  }, []);

  const PODCAST_ITEMS = [
    {
      id: 1,
      title: podcasts?.safariMemori?.title || "Safari Memori",
      desc: podcasts?.safariMemori?.subtitle || "Podcast tentang arsip, nostalgia, dan penelusuran jejak",
      image: podcasts?.safariMemori?.image || "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000&auto=format&fit=crop",
      link: "/program/safari-memori",
    },
    {
      id: 2,
      title: podcasts?.aston?.title || "Aston",
      desc: podcasts?.aston?.subtitle || "Podcast tentang perspektif personal anak stonen dalam membahas isu sosial",
      image: podcasts?.aston?.image || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
      link: podcastLinks.aston, 
    },
    {
      id: 3,
      title: podcasts?.soreDiStonen?.title || "Sore di Stonen",
      desc: podcasts?.soreDiStonen?.subtitle || "Podcast yang berfokus pada suasana ngobrol yang santai dan reflektif",
      image: podcasts?.soreDiStonen?.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop",
      link: podcastLinks.soreDiStonen,
    },
  ];

  return (
    <section id="podcast" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-20">
      
      {/* 👉 PERUBAHAN: Bungkus Judul agar 100% rata Kiri */}
      <div className="w-full flex justify-start items-center mb-6 md:mb-8">
        <h2 className={`${poppins.className} text-[22px] md:text-[32px] font-bold text-black text-left`}>
          Podcast
        </h2>
      </div>

      <div className="flex md:grid overflow-x-auto md:overflow-visible md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:w-[1px] after:flex-shrink-0 md:after:hidden">
        {PODCAST_ITEMS.map((item) => {
          const hasLink = Boolean(item.link);
          const isExternalLink = hasLink && item.link.startsWith("http");
          const hrefTarget = hasLink ? item.link : "#"; 

          return (
            <Link
              href={hrefTarget}
              key={item.id}
              target={isExternalLink ? "_blank" : "_self"}
              rel={isExternalLink ? "noopener noreferrer" : ""}
              onClick={(e) => {
                if (!hasLink) {
                  e.preventDefault();
                  alert("Link podcast ini belum diperbarui oleh Admin.");
                }
              }}
              className="w-[260px] md:w-full flex-shrink-0 snap-start group bg-white rounded-2xl md:rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col"
            >
              <div className="relative w-full h-[160px] md:h-[220px] bg-gray-200 overflow-hidden">
                 <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 260px, (max-width: 1200px) 50vw, 33vw" />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              <div className="p-5 md:p-8 text-center flex flex-col items-center justify-center flex-grow min-h-[140px] md:min-h-[180px]">
                <h3 className={`${poppins.className} text-[#D63384] text-lg md:text-xl font-bold mb-2 md:mb-3`}>{item.title}</h3>
                <p className={`${poppins.className} text-[#D63384] text-xs md:text-sm leading-relaxed max-w-[280px] font-normal`}>{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}