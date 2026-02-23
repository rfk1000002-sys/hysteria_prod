"use client";

import HeadSection from "../../_sectionComponents/halaman_program/head.Section";
import FestivalSection from "../../_sectionComponents/halaman_program/festival.section";
import ForumSection from "../../_sectionComponents/halaman_program/forum.section";
import MusicSection from "../../_sectionComponents/halaman_program/music.section";
import ResidencySection from "../../_sectionComponents/halaman_program/residency.section";
import PodcastSection from "../../_sectionComponents/halaman_program/podcast.section";
import FilmSection from "../../_sectionComponents/halaman_program/film.section";
import VideoSeriesSection from "../../_sectionComponents/halaman_program/video_series.Section"; 

export default function ProgramPage() {
  return (
    <main className="min-h-screen bg-white text-black font-sans pb-20">
      <div className="max-w-8xl mx-auto px-5 md:px-8 py-12">
        <HeadSection />
        <FestivalSection />
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