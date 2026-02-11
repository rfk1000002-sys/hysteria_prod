"use client";

// --- IMPORT SEMUA KOMPONEN ---
// Gunakan "../../" untuk mundur 2 langkah:
// 1. Keluar dari folder 'program'
// 2. Keluar dari folder 'app'
// 3. Masuk ke '_sectionComponents' di root

import HeroSection from "../../_sectionComponents/halaman_program/HeroSection";
import FestivalSection from "../../_sectionComponents/halaman_program/FestivalSection";
import ForumSection from "../../_sectionComponents/halaman_program/ForumSection";
import MusicSection from "../../_sectionComponents/halaman_program/MusicSection";
import ResidencySection from "../../_sectionComponents/halaman_program/ResidencySection";
import PodcastSection from "../../_sectionComponents/halaman_program/PodcastSection";
import FilmSection from "../../_sectionComponents/halaman_program/FilmSection";
import VideoSeriesSection from "../../_sectionComponents/halaman_program/VideoSeriesSection"; 

export default function ProgramPage() {
  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      <div className="max-w-8xl mx-auto px-5 md:px-8 py-12">
        
        {/* 1. HERO SECTION */}
        <HeroSection />

        {/* 2. FESTIVAL SECTION */}
        <FestivalSection />

        {/* 3. FORUM SECTION */}
        <ForumSection />

        <MusicSection />

        <ResidencySection />

        <PodcastSection />

        <FilmSection />

        <VideoSeriesSection />

       
      </div>
    </main>
  );
}