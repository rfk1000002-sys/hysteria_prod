"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Instagram, Facebook, Twitter, ArrowRight } from "lucide-react";

import { EVENT_STATUS_LABEL } from "@/lib/event-status"; 
import { getOrganizerDisplay } from "@/lib/organizer-helper";
import ShareButtons from "@/components/adminUI/Event/ShareButtons";
import LiveArchiveLinks from "@/components/adminUI/Event/LiveArchiveLinks";
import ViewsTracker from "@/components/tracker/views.tracker";

export default function DefaultProgramPostDetailView({ slug, id, heroData, detailHeroData }) {
  const router = useRouter();
  
  const [event, setEvent] = useState(null);
  const [otherEvents, setOtherEvents] = useState([]);
  const [relatedCategoryName, setRelatedCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // 1. LOGIKA FETCHING DATA
  // ==========================================
  useEffect(() => {
    async function fetchDetail() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/events/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data program");
        const data = await res.json();
        setEvent(data);

        const ignoredTerms = ['hysteria', 'program-hysteria', 'program hysteria', 'semua'];
        let targetCategory = data.eventCategories?.find(c => c.categoryItem?.slug === slug);

        if (!targetCategory) {
          targetCategory = data.eventCategories?.find(c => {
            const catName = c.categoryItem?.title?.toLowerCase().trim();
            const catSlug = c.categoryItem?.slug?.toLowerCase().trim();
            return catName && !ignoredTerms.includes(catName) && !ignoredTerms.includes(catSlug);
          });
        }

        const categoryId = targetCategory?.categoryItem?.id;
        const categoryTitle = targetCategory?.categoryItem?.title || slug.replace(/-/g, ' ');
        setRelatedCategoryName(categoryTitle);
        
        if (categoryId) {
          const resRelated = await fetch(`/api/admin/events?categoryId=${categoryId}&limit=6`);
          if (resRelated.ok) {
            const dataRelated = await resRelated.json();
            setOtherEvents(dataRelated.filter(item => item.id !== id).slice(0, 5));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id, slug]);

  if (isLoading) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-pink-600 font-bold text-xl animate-pulse">Memuat Detail Program...</div>;
  if (error || !event) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-red-500 font-bold text-xl">Postingan Tidak Ditemukan.</div>;

  // ==========================================
  // 2. LOGIKA TANGGAL & STATUS (GAYA EVENT DETAIL)
  // ==========================================
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const startDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : null;
  const rawStatus = startDate && startDate > new Date() ? "UPCOMING" : (endDate && endDate < new Date() ? "FINISHED" : "ONGOING");
  const status = event.status || rawStatus;

  const sameMonth = endDate && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
  const sameYear = endDate && startDate.getFullYear() === endDate.getFullYear();
  const sameDay = endDate && startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();

  const formattedDate = endDate
    ? sameDay      
      ? startDate.toLocaleDateString("id-ID", { day: "numeric", weekday: "long", month: "long", year: "numeric" })
      : sameMonth
        ? `${startDate.getDate()} – ${endDate.getDate()} ${startDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`
        : sameYear
        ? `${startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long" })} – ${endDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
        : `${startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} – ${endDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
    : startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const formattedTime = event.isFlexibleTime
    ? "Menyesuaikan"
    : `${startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}${
        endDate ? ` – ${endDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}` : ""
      } WIB`;

  const isEmbedMap = event.mapsEmbedSrc?.includes("/maps/embed");
  
  // 👉 PERUBAHAN: Background Image mengutamakan heroData, detailHeroData, lalu event.poster
  const bgHeroImage = detailHeroData?.image || heroData?.image || event?.heroImage || event?.poster || "/image/bg_program.jpeg";
  const isBlurActive = detailHeroData?.isBlur === true || heroData?.isBlur === true;

  // Filter Kategori agar "Hysteria" tidak muncul
  const categories = event.eventCategories
    ?.map(c => c.categoryItem?.title)
    .filter(Boolean)
    .filter(title => !['hysteria', 'program-hysteria', 'program hysteria', 'semua'].includes(title.toLowerCase().trim())) || [];

  // ==========================================
  // 3. UI RENDER 
  // ==========================================
  return (
    <div className="w-full font-poppins pb-20 bg-[var(--background)]">
      {ViewsTracker && <ViewsTracker slug={event.slug} />}
      
      {/* ==========================================
          HEADER HERO (MENGGUNAKAN DESAIN ASLI ANDA) 
          ========================================== */}
      <div className="w-full h-[320px] relative z-0 overflow-hidden bg-black">
        <img 
          src={bgHeroImage} 
          alt="Background Hero Detail" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 transition-all duration-500 ${isBlurActive ? 'backdrop-blur-md' : ''}`}></div>
        
        {/* Tombol Back di dalam Hero seperti desain Event Detail */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition hover:bg-white/10 mt-16 md:mt-20" aria-label="Kembali">
          <ArrowLeft className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* ==========================================
          KONTEN UTAMA (MENGGUNAKAN GAYA EVENT DETAIL) 
          ========================================== */}
      <div className="mx-auto px-6 -mt-32 space-y-16 bg-transparent max-w-7xl relative z-10">

        {/* HEADER (POSTER + INFO) */}
        <section className="grid md:grid-cols-3 gap-10 items-start">
          {/* POSTER */}
          <div className="md:col-span-1">
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-white border-[6px] border-white">
              <Image
                src={event.poster || "https://via.placeholder.com/400x500?text=No+Poster"}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="md:col-span-2 space-y-4 pt-10 mt-28 bg-white/80 md:bg-transparent p-4 md:p-0 rounded-2xl md:backdrop-blur-none">            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-block px-4 py-1 rounded-full bg-[var(--Color-3)] text-[var(--Color-1)] border border-[var(--Color-1)] text-xs transition"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[var(--Color-5)]">
              {event.title}
            </h1>

            {event.organizers?.length > 0 && (
              <p className="text-sm text-[var(--Color-5)]">
                Diselenggarakan oleh:
                <span className="ml-2 inline-flex flex-wrap gap-2">
                  {getOrganizerDisplay && getOrganizerDisplay(event.organizers).map((org, index) => (
                    <Link key={`${org.key}-${index}`} href={org.href || "#"} className="inline-block px-4 py-1 rounded-full bg-[var(--Color-1)] text-[var(--Color-3)] border border-[var(--Color-1)] text-xs hover:bg-[var(--Color-3)] hover:text-[var(--Color-1)] transition">
                      {org.label}
                    </Link>
                  ))}
                </span>
              </p>
            )}

            <div className="flex flex-wrap gap-3 items-center">
              <p className="text-sm text-[var(--Color-5)]">
                Status Event:{" "}
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--Color-3)] text-[var(--Color-1)] border border-[var(--Color-1)] text-xs font-bold">
                  {EVENT_STATUS_LABEL ? EVENT_STATUS_LABEL[status] : status}
                </span>
              </p>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--Color-3)] text-[var(--Color-1)] border border-[var(--Color-1)] text-xs font-bold">
                <Eye className="w-3.5 h-3.5" /> {(event.views || 0).toLocaleString("id-ID")} kali dilihat
              </span>
            </div>
          </div>
        </section>

        {/* DETAIL */}
        <section className="grid md:grid-cols-3 gap-10">
          {/* SIDEBAR (Kiri) */}
          <aside className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-[var(--Color-5)] text-[18px]">Ikuti Keseruan Kami</h3>
              {event.registerLink && (
                <a
                  href={status === "FINISHED" ? undefined : event.registerLink} target="_blank" rel="noopener noreferrer"
                  className={`mt-2 flex items-center justify-center w-full sm:w-[140px] h-[40px] rounded-[8px] text-[12px] font-medium shadow transition
                    ${status === "FINISHED" ? "bg-[var(--Color-4)] text-[var(--Color-3)] cursor-not-allowed pointer-events-none" : "bg-[var(--Color-1)] text-[var(--Color-3)] hover:opacity-90"}`}
                >
                  Daftar Sekarang
                </a>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-[var(--Color-5)] text-[18px]">Jadwal Pelaksanaan</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="grid grid-cols-[140px_10px_1fr]">
                  <span className="font-medium">Tanggal Acara</span><span>:</span><span>{formattedDate}</span>
                </div>
                <div className="grid grid-cols-[140px_10px_1fr]">
                  <span className="font-medium">Waktu Acara</span><span>:</span><span className={event.isFlexibleTime ? "font-medium" : ""}>{formattedTime}</span>
                </div>
              </div>
            </div>

            {event.location && (
              <div>
                <h3 className="font-semibold mb-2 text-[var(--Color-5)] text-[18px]">Lokasi</h3>
                <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                {event.mapsEmbedSrc && (
                  isEmbedMap ? (
                    <div className="w-full h-[280px] rounded-xl overflow-hidden border">
                      <iframe src={event.mapsEmbedSrc} className="w-full h-full" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    </div>
                  ) : (
                    <a href={event.mapsEmbedSrc} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full h-[40px] rounded-[8px] bg-[var(--Color-1)] text-[var(--Color-3)] text-[13px] font-medium shadow hover:opacity-90 transition">
                      Buka di Google Maps
                    </a>
                  )
                )}
              </div>
            )}
            
            <div>
              {LiveArchiveLinks && <LiveArchiveLinks event={event} status={status} />}
            </div>
          </aside>

          {/* DESKRIPSI (Kanan) */}
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-4 text-[var(--Color-5)] text-[18px]">Deskripsi</h2>
            {event.description ? (
              <div className="prose prose-p:leading-relaxed prose-img:rounded-xl prose-img:mx-auto prose-a:text-pink-600 hover:prose-a:underline max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: event.description }} />
            ) : (
              <p className="text-sm italic text-gray-500">Belum ada deskripsi.</p>
            )}

            <div className="mt-8 flex flex-wrap items-start gap-2">
              <h2 className="font-semibold text-[var(--Color-5)] text-[18px] whitespace-nowrap">Tags:</h2>
              {event.tags && event.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((et) => (
                    <span key={et.tag.id} className="text-[16px] text-[var(--Color-1)] font-medium">#{et.tag.name}</span>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[var(--Color-1)]">Tidak ada tag</p>
              )}
            </div>
            
            <div className="mt-8">
              {ShareButtons ? <ShareButtons url={shareUrl} title={event.title} /> : (
                <div className="flex items-center gap-4 border-t border-gray-200 pt-8">
                  <span className="font-extrabold text-sm text-black">Share:</span>
                  <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank")} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><Facebook size={16} /></button>
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, "_blank")} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all"><Twitter size={16} /></button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* EVENT LAINNYA */}
        {otherEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4"> 
              <h2 className="font-semibold text-[var(--Color-5)] text-[18px] capitalize"> Event {relatedCategoryName} Lainnya </h2> 
              <Link href="/program" className="text-[var(--Color-1)] hover:underline font-medium text-sm"> Lihat semua </Link> 
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
              {otherEvents.map((other) => {
                const isFinished = other.status === "FINISHED" || (other.endAt && new Date(other.endAt) < new Date());
                return (
                  <Link key={other.id} href={`/program/${slug}/${other.id}`} className="group relative min-w-[260px] aspect-[4/5] rounded-xl overflow-hidden block snap-start shrink-0">
                    <Image src={other.poster || "https://via.placeholder.com/400x500?text=No+Poster"} alt={other.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-4 backdrop-blur-sm bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                      <div className="inline-flex gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center justify-center px-3 h-[26px] rounded-[10px] border text-[12px] font-bold ${isFinished ? "border-gray-400 bg-gray-700 text-gray-200" : "border-[var(--Color-1)] bg-[var(--Color-3)] text-[var(--Color-1)]"}`}>
                          {isFinished ? "Telah Berakhir" : "Akan Datang"}
                        </span>
                      </div>
                      <h3 className="text-[14px] font-bold text-[var(--Color-3)] line-clamp-2">{other.title}</h3>
                      <p className="text-[12px] text-[var(--Color-3)]">
                        {new Date(other.startAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <div className={`mt-2 flex items-center justify-center w-full sm:w-[140px] h-[35px] rounded-[8px] text-[12px] font-bold shadow transition ${isFinished ? "bg-[var(--Color-4)] text-[var(--Color-3)]" : "bg-[var(--Color-1)] text-[var(--Color-3)]"}`}>
                        Lihat Sekarang
                      </div>
                    </div>
                  </Link>
                );
              })}
              
              <Link href="/program" className="min-w-[260px] flex items-center justify-center rounded-xl border-2 border-dashed border-[var(--Color-1)] text-[var(--Color-1)] font-bold hover:bg-[var(--Color-1)]/10 snap-start shrink-0">
                Lihat Semua Event →
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}