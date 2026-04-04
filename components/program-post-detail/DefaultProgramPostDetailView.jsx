"use client";

import { ArrowLeft, ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DefaultProgramPostDetailView({ slug, id, heroData, detailHeroData }) {
  const router = useRouter();
  
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data program");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-[#E83C91] font-bold text-xl font-poppins animate-pulse">Memuat Detail Program...</div>;
  if (error || !post) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-xl font-poppins">Postingan Tidak Ditemukan.</div>;

  const startDate = post.startAt ? new Date(post.startAt) : null;
  const status = startDate && startDate > new Date() ? "Akan Berlangsung" : "Selesai";
  
  const dateStr = startDate 
    ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(startDate)
    : 'Menyesuaikan';
    
  const timeStr = startDate
    ? new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(startDate).replace(':', '.') + " WIB"
    : '-';

  const categories = post.eventCategories?.map(c => c.categoryItem?.title).filter(Boolean) || [];
  const organizers = post.organizers?.map(c => c.categoryItem?.title).filter(Boolean) || [];
  const tags = post.tags?.map(t => t.tag?.name).filter(Boolean) || [];

  const bgHeroImage = detailHeroData?.image || heroData?.image || "/image/bg_program.jpeg";
  const isBlurActive = detailHeroData?.isBlur === true; 

  return (
    <div className="min-h-screen bg-white font-poppins pb-20">
      
      {/* HEADER HERO */}
      <div className="w-full h-[320px] relative z-0 overflow-hidden bg-black">
        <img 
          src={bgHeroImage} 
          alt="Background Hero Detail" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 transition-all duration-500 ${isBlurActive ? 'backdrop-blur-md' : ''}`}></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 -mt-[240px] flex flex-col md:flex-row gap-12">
        
        {/* KOLOM KIRI (Sidebar) */}
        <div className="w-full md:w-[320px] shrink-0">
          <button 
            onClick={() => router.back()} 
            className="text-white hover:text-gray-200 transition-colors mb-6 flex items-center shadow-sm drop-shadow-md"
          >
            <ArrowLeft size={28} />
          </button>

          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden mb-8 border-[6px] border-white">
            <img 
              src={post.poster || "https://via.placeholder.com/400x500?text=No+Poster"} 
              alt={post.title} 
              className="w-full h-auto object-cover aspect-[4/5]"
            />
          </div>

          <div className="space-y-8">
            {post.registerLink && (
              <div>
                <h3 className="font-extrabold text-lg text-black mb-3">Ikuti Keseruan Kami</h3>
                {status === "Selesai" ? (
                  <span className="inline-block bg-[#413153] text-gray-300 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed shadow-sm">
                    Daftar Sekarang
                  </span>
                ) : (
                  <Link href={post.registerLink} target="_blank" className="inline-block bg-[#E83C91] hover:bg-[#c22e75] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md">
                    Daftar Sekarang
                  </Link>
                )}
              </div>
            )}

            <div>
              <h3 className="font-extrabold text-lg text-black mb-3">Jadwal Pelaksanaan</h3>
              <table className="text-sm text-black font-medium">
                <tbody>
                  <tr>
                    <td className="pr-4 py-1 align-top">Tanggal Acara</td>
                    <td className="align-top">: {dateStr}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-1 align-top">Waktu Acara</td>
                    <td className="align-top">: {timeStr}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {post.location && (
              <div>
                <h3 className="font-extrabold text-lg text-black mb-3">Lokasi</h3>
                <p className="text-sm text-black font-medium mb-3 leading-relaxed whitespace-pre-line">
                  {post.location}
                </p>
                {post.mapsEmbedSrc && (
                  <Link href={post.mapsEmbedSrc} target="_blank" className="inline-block bg-[#E83C91] hover:bg-[#c22e75] text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md">
                    Lacak Lokasi
                  </Link>
                )}
              </div>
            )}

            {(post.driveLink || post.youtubeLink || post.instagramLink) && (
              <div>
                <h3 className="font-extrabold text-lg text-black mb-3">Arsip Kegiatan</h3>
                <div className="flex flex-col gap-3 items-start">
                  {post.driveLink && (
                    <Link href={post.driveLink} target="_blank" className="border-2 border-[#E83C91] text-[#E83C91] hover:bg-pink-50 px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                      Dokumentasi
                    </Link>
                  )}
                  {post.youtubeLink && (
                    <Link href={post.youtubeLink} target="_blank" className="border-2 border-[#E83C91] text-[#E83C91] hover:bg-pink-50 px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                      Youtube
                    </Link>
                  )}
                  {post.instagramLink && (
                    <Link href={post.instagramLink} target="_blank" className="border-2 border-[#E83C91] text-[#E83C91] hover:bg-pink-50 px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                      Instagram
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =======================================================
            KOLOM KANAN (Konten Deskripsi) 
            👉 PERUBAHAN: Menambah padding atas dari pt-[240px] jadi pt-[280px]
            ======================================================= */}
        <div className="flex-1 pt-8 md:pt-[280px]"> 
          <div className="flex flex-wrap gap-2 mb-4 relative z-10">
            {categories.map((sub, idx) => (
              <span key={idx} className="border border-[#E83C91] text-[#E83C91] px-4 py-1 rounded-full text-xs font-bold bg-white/50 backdrop-blur-sm">
                {sub}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-black leading-tight mb-6 transition-colors duration-300 relative z-10">
            {post.title}
          </h1>

          <div className="space-y-4 mb-10">
            {organizers.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-black font-semibold">Diselenggarakan oleh :</span>
                <div className="flex flex-wrap gap-2">
                  {organizers.map((org, idx) => (
                    <span key={idx} className="bg-[#E83C91] text-white px-3 py-1 rounded-full text-xs font-bold">
                      {org}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-black font-semibold">Status Event :</span>
              <span className={`border px-4 py-1 rounded-full text-xs font-bold ${status === 'Akan Berlangsung' ? 'border-[#E83C91] text-[#E83C91]' : 'border-gray-500 text-gray-500'}`}>
                {status}
              </span>
            </div>
          </div>

          <div className="text-black space-y-6">
            <h2 className="text-2xl font-extrabold mb-4">Deskripsi</h2>
            
            {post.description ? (
              <div 
                // 👉 PERUBAHAN: max-w-[320px] agar ukurannya sama persis dengan Cover Poster di kiri
                className="text-sm font-medium leading-loose space-y-5 [&_img]:w-full md:[&_img]:max-w-[320px] [&_img]:rounded-[20px] [&_img]:my-6 [&_img]:shadow-md [&_img]:object-cover"
                dangerouslySetInnerHTML={{ __html: post.description }} 
              />
            ) : (
              <p className="text-sm leading-relaxed italic text-gray-500">Belum ada deskripsi.</p>
            )}

            {tags.length > 0 && (
              <div className="flex items-center gap-2 pt-6">
                <strong className="text-sm">Tag:</strong>
                <p className="text-sm font-bold text-[#E83C91]">
                  {tags.map(t => `#${t.replace(/\s+/g, '')}`).join(" ")}
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center gap-4 text-black border-t border-gray-200 pt-8 pb-4">
            <span className="font-extrabold text-sm">Share:</span>
            <button onClick={() => window.open(`https://www.instagram.com/`, "_blank")} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-[#E83C91] hover:text-white hover:border-[#E83C91] transition-all"><Instagram size={16} /></button>
            <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-[#E83C91] hover:text-white hover:border-[#E83C91] transition-all"><Facebook size={16} /></button>
            <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-[#E83C91] hover:text-white hover:border-[#E83C91] transition-all"><Twitter size={16} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-black">Event lainnya</h2>
          <button onClick={() => router.push('/program')} className="w-10 h-10 border border-[#E83C91] rounded-full flex items-center justify-center text-[#E83C91] hover:bg-pink-50 transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-orange-200 rounded-2xl aspect-[4/5] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group border border-gray-100 shadow-sm">
              <img src={`https://via.placeholder.com/400x500/FDBA74/ffffff?text=Event+${item}`} className="w-full h-full object-cover" alt="Other event" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-[#E83C91] text-white px-5 py-2 rounded-full text-xs font-bold">Lihat Detail</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}