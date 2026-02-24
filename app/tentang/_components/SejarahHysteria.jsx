"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";

// Placeholder images - in real app would use real image paths
const historyImages = [
  { src: "/image/tim-hero.png", year: "2004", description: "Awal berdiri" },
  { src: "/image/tim-hero.png", year: "2008", description: "Perkembangan awal" },
  { src: "/image/tim-hero.png", year: "2012", description: "Era baru komunitas" },
  { src: "/image/tim-hero.png", year: "2016", description: "Ekspansi jaringan" },
  { src: "/image/tim-hero.png", year: "2020", description: "Adaptasi digital" },
  { src: "/image/tim-hero.png", year: "2024", description: "Masa depan" },
];

export default function SejarahHysteria() {
  return (
    <div className="w-full px-4">
      <Swiper
        slidesPerView={1.2}
        spaceBetween={20}
        freeMode={true}
        navigation={true}
        modules={[FreeMode, Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3.2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 40,
          },
        }}
        className="mySwiper w-full h-[600px]">
        {historyImages.map((item, index) => (
          <SwiperSlide
            key={index}
            className="relative group overflow-hidden rounded-xl bg-gray-200">
            <div className="relative w-[455px] h-full">
              {/* Use unoptimized if local images or configure next.config.mjs */}
              <Image
                src={item.src}
                alt={`Sejarah Hysteria ${item.year}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-white font-bold text-3xl font-poppins">{item.year}</span>
                <p className="text-white/90 text-lg font-poppins">{item.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
