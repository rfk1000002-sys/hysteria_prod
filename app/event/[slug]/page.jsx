import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventStatus, EVENT_STATUS_LABEL } from "../../../lib/event-status";
import ShareButtons from "../../../components/adminUI/Event/ShareButtons";
import { ArrowLeft } from "lucide-react";
import { getEventDetail, getOtherEvents } from "../../../modules/public/events/services/event.service";
import { getOrganizerDisplay } from "../../../lib/organizer-helper";
import LiveArchiveLinks from "../../../components/adminUI/Event/LiveArchiveLinks";
import { getProgramPageConfig } from "../../../modules/public/events/services/event.service";
import ViewsTracker from "../../../components/tracker/views.tracker";
import { Eye } from "lucide-react";

export const revalidate = 0;

export default async function EventDetailPage({ params }) {
  const { slug } = await params;

  const [event, otherEvents, pageConfig] = await Promise.all([
    getEventDetail(slug),
    getOtherEvents(slug),
    getProgramPageConfig(),
  ]);

  if (!event) return notFound();

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/event/${event.slug}`;
  const status = getEventStatus(event.startAt, event.endAt);
  const startDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : null;

  const sameMonth =
    endDate &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  const sameYear =
    endDate &&
    startDate.getFullYear() === endDate.getFullYear();

  const sameDay =
    endDate &&
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  const formattedDate = endDate
    ? sameDay      
      ? startDate.toLocaleDateString("id-ID", {
          day: "numeric",
          weekday: "long",
          month: "long",
          year: "numeric",
        })
      : sameMonth
        ? `${startDate.getDate()} – ${endDate.getDate()} ${startDate.toLocaleDateString(
            "id-ID",
            { month: "long", year: "numeric" }
          )}`
        : sameYear
        ? `${startDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
          })} – ${endDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`
        : `${startDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} – ${endDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`
    : startDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const formattedTime = event.isFlexibleTime
    ? "Menyesuaikan"
    : `${startDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}${
        endDate
          ? ` – ${endDate.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : ""
      } WIB`;

  const organizerSlug = event.organizers?.[0]?.categoryItem?.slug;
  const isEmbedMap = event.mapsEmbedSrc?.includes("/maps/embed");
  const detailHero = pageConfig?.detailHero ?? {
    image: null,
    isBlur: false,
  };
  const bgImage = event?.heroImage || detailHero.image;
  const isBlur = detailHero.isBlur;

  return (
    <div className="w-full">
      <ViewsTracker slug={event.slug} />
      
      {/* 👉 HERO SECTION (REsponsive Mobile & Desktop) */}
      <section className="relative w-full h-[220px] sm:h-[300px] md:h-[450px] lg:h-[500px] flex flex-col justify-end bg-black">
        
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={bgImage || "/image/bg_program.jpeg"} 
            alt={event.title || "Background Hero Detail"} 
            fill 
            priority 
            className="object-cover object-center" 
            quality={100} 
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-black/40 ${isBlur ? 'backdrop-blur-md' : ''}`}></div>
        </div>

        {/* BACK BUTTON */}
        <Link
          href="/event"
          className="absolute top-6 md:top-24 left-4 md:left-10 z-10 inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-white transition hover:bg-white/20"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
        </Link>
        
        {/* CONTAINER PEMBATAS POSTER */}
        <div className="absolute inset-x-0 bottom-[-80px] sm:bottom-[-100px] md:bottom-[-160px] lg:bottom-[-200px] z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          
          {/* POSTER (Ukuran lebih kecil di HP, membesar di Desktop) */}
          <div className="relative w-[160px] sm:w-[220px] md:w-[300px] lg:w-[340px] aspect-[3/4] rounded-[12px] md:rounded-2xl overflow-hidden shadow-xl bg-white mx-auto md:mx-0 pointer-events-auto border-2 md:border-4 border-white/10">
            <Image
              src={event.poster || "/placeholder-event.jpg"}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          
        </div>
      </section>

      {/* 👉 WRAPPER BACKGROUND FULL WIDTH */}
      <div className="w-full bg-[var(--background)]">
        
        {/* CONTENT */}
        {/* Padding-top di-set 24 di HP agar poster tidak menutupi teks, dan dikembalikan ke 6 di Desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-6 pb-20">
          
          {/* 👉 HEADER INFO (Judul, Organizer, Status) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
            <div className="hidden md:block" />
            <div className="md:col-span-2 flex flex-col gap-3 md:gap-4">     
              
              {/* KATEGORI */}       
              <div className="flex flex-wrap gap-2">
                {event.eventCategories?.map((cat) => (
                  <Link
                    key={cat.categoryItem.id}
                    href={cat.categoryItem.url ?? "#"}
                    className="px-4 py-1 rounded-full text-[11px] md:text-xs border border-[var(--Color-1)] text-[var(--Color-1)] bg-white hover:bg-[var(--Color-1)] hover:text-white transition"
                  >
                    {cat.categoryItem.title}
                  </Link>
                ))}
              </div>

              {/* JUDUL */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[var(--Color-5)]">
                {event.title}
              </h1>

              {/* PENYELENGGARA */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm text-[var(--Color-5)] mt-1">
                <span className="font-medium md:font-normal">Diselenggarakan oleh :</span>
                <span className="flex flex-wrap gap-2">
                  {getOrganizerDisplay(event.organizers)?.map((org, index) => (
                    <Link
                      key={`${org.key}-${index}`} 
                      href={org.href}
                      className="px-3 py-1 rounded-full text-xs bg-[var(--Color-1)] text-white border border-[var(--Color-1)] hover:bg-white hover:text-[var(--Color-1)] transition"
                    >
                      {org.label}
                    </Link>
                  ))}
                </span>
              </div>

              {/* STATUS & VIEWS */}
              <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-sm text-[var(--Color-5)]">
                  <span className="font-medium md:font-normal">Status Event :</span>
                  <span className="px-4 py-1 rounded-full text-[11px] md:text-xs border border-[var(--Color-1)] bg-white text-[var(--Color-1)]">
                    {EVENT_STATUS_LABEL[status]}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] md:text-xs border border-[var(--Color-1)] bg-white text-[var(--Color-1)]">
                  <Eye className="w-3.5 h-3.5" /> {(event.views || 0).toLocaleString("id-ID")} kali dilihat
                </span>
              </div>
            </div>
          </section>

          {/* 👉 MAIN DETAIL SECTION (Tukar posisi Deskripsi & Sidebar di Mobile) */}
          <section className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-10 mt-10 md:mt-12">
            
            {/* ======================= SIDEBAR ======================= */}
            {/* order-2: Di HP muncul di bawah Deskripsi. md:order-1: Di Desktop muncul di kiri */}
            <aside className="order-2 md:order-1 flex flex-col gap-8 md:gap-6">
              
              {/* IKUTI KESERUAN KAMI */}
              <div>
                <h3 className="font-bold mb-3 text-[var(--Color-5)] text-[16px] md:text-[18px]">Ikuti Keseruan Kami</h3>
                {event.registerLink && (
                  <a
                    href={status === "FINISHED" ? undefined : event.registerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-2 flex items-center justify-center w-full md:w-[140px] h-[40px] rounded-[8px] text-[13px] md:text-[12px] font-medium shadow transition
                      ${
                        status === "FINISHED"
                          ? "bg-[var(--Color-4)] text-[var(--Color-3)] cursor-not-allowed pointer-events-none"
                          : "bg-[var(--Color-1)] text-[var(--Color-3)] hover:opacity-90"
                      }`}
                  >
                    Daftar Sekarang
                  </a>
                )}
              </div>

              {/* JADWAL PELAKSANAAN */}
              <div>
                <h3 className="font-bold mb-3 text-[var(--Color-5)] text-[16px] md:text-[18px]">Jadwal Pelaksanaan</h3>
                <div className="text-[13px] md:text-sm text-[var(--Color-5)] space-y-2">
                  <div className="grid grid-cols-[120px_10px_1fr] md:grid-cols-[140px_10px_1fr]">
                    <span className="font-medium md:font-normal">Tanggal Acara</span>
                    <span>:</span>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="grid grid-cols-[120px_10px_1fr] md:grid-cols-[140px_10px_1fr]">
                    <span className="font-medium md:font-normal">Waktu Acara</span>
                    <span>:</span>
                    <span className={event.isFlexibleTime ? "font-medium" : ""}>
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* LOKASI */}
              <div>
                <h3 className="font-bold mb-3 text-[var(--Color-5)] text-[16px] md:text-[18px]">Lokasi</h3>
                <p className="text-[13px] md:text-sm text-[var(--Color-5)] mb-3 leading-relaxed">
                  {event.location}
                </p>

                {event.mapsEmbedSrc && (
                  isEmbedMap ? (
                    <div className="w-full h-[200px] md:h-[280px] rounded-xl overflow-hidden border">
                      <iframe
                        src={event.mapsEmbedSrc}
                        className="w-full h-full"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <a
                      href={event.mapsEmbedSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 h-[36px] md:h-[40px] md:w-full rounded-full md:rounded-[8px] border border-[var(--Color-1)] text-[var(--Color-1)] bg-transparent md:bg-[var(--Color-1)] md:text-[var(--Color-3)] text-[13px] font-medium hover:bg-[var(--Color-1)] hover:text-white transition"
                    >
                      Lacak Lokasi
                    </a>
                  )
                )}
              </div>
              
              {/* ARSIP */}
              <div>
                <LiveArchiveLinks event={event} status={status} />
              </div>
            </aside>

            {/* ======================= DESKRIPSI ======================= */}
            {/* order-1: Di HP muncul di atas (langsung setelah Header Info). md:order-2: Di Desktop muncul di kanan */}
            <div className="order-1 md:order-2 md:col-span-2">
              <h2 className="font-bold mb-3 md:mb-4 text-[var(--Color-5)] text-[16px] md:text-[18px]">Deskripsi</h2>

              <div
                className="
                  prose prose-p:leading-relaxed prose-sm md:prose-base
                  prose-img:rounded-xl prose-img:mx-auto
                  prose-img:w-[160px] sm:prose-img:w-[220px] md:prose-img:w-[300px] lg:prose-img:w-[340px]
                  prose-img:aspect-[3/4] prose-img:object-cover
                  prose-a:text-[var(--Color-1)] hover:prose-a:underline
                  max-w-none text-[var(--Color-5)]
                "
                dangerouslySetInnerHTML={{ __html: event.description }}
              />

              {/* TAGS */}
              <div className="mt-8 flex flex-wrap items-start gap-2">
                <h2 className="font-bold text-[var(--Color-5)] text-[16px] md:text-[18px] whitespace-nowrap">
                  Tag:
                </h2>
                {event.tags && event.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((et) => (
                      <span
                        key={et.tag.id}
                        className="text-[14px] md:text-[16px] text-[var(--Color-1)] font-medium"
                      >
                        #{et.tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] md:text-[14px] text-[var(--Color-1)]">Tidak ada tag</p>
                )}
              </div>
              
              {/* SHARE */}
              <div className="mt-8 flex items-center gap-4">
                <span className="font-bold text-[var(--Color-5)] text-[16px] md:text-[18px]">Share:</span>
                <ShareButtons url={shareUrl} title={event.title} />
              </div>
            </div>

          </section>

          {/* 👉 EVENT LAINNYA */}
          <section className="mt-12 md:mt-16 border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between mb-6"> 
              <h2 className="font-bold text-[var(--Color-5)] text-[16px] md:text-[18px]"> Event lainnya </h2> 
              <Link href="/event" className="text-[12px] md:text-[14px] text-[var(--Color-5)] hover:text-[var(--Color-1)] underline md:no-underline font-medium"> Lihat semua </Link> 
            </div>

            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x">
              {otherEvents?.map((other) => {
                const isFinished = other.status === "FINISHED";

                return (
                  <Link
                    key={other.id}
                    href={`/event/${other.slug}`}
                    className="group relative min-w-[200px] md:min-w-[260px] aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden block snap-start shrink-0 shadow-sm border border-gray-100"
                  >
                    <Image
                      src={other.poster || "/placeholder-event.jpg"}
                      alt={other.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 backdrop-blur-sm bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">

                      <div className="inline-flex gap-2 flex-wrap mb-1.5 md:mb-1">
                        {other.status === "UPCOMING" && <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 rounded-md border border-[var(--Color-1)] bg-[var(--Color-3)] text-[var(--Color-1)] text-[10px] md:text-[12px] font-bold">Akan Datang</span>}
                        {other.status === "ONGOING" && <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 rounded-md border border-[var(--Color-1)] bg-[var(--Color-3)] text-[var(--Color-1)] text-[10px] md:text-[12px] font-bold">Berlangsung</span>}
                        {isFinished && <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 rounded-md border border-[var(--Color-1)] bg-[var(--Color-3)] text-[var(--Color-1)] text-[10px] md:text-[12px] font-bold">Telah Berakhir</span>}
                      </div>

                      <h3 className="text-[13px] md:text-[14px] font-bold text-white line-clamp-2 leading-snug">
                        {other.title}
                      </h3>

                      <p className="text-[11px] md:text-[12px] text-gray-200 mt-1">
                        {new Date(other.startAt).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {/* CARD LIHAT SEMUA */}
              <Link
                href="/event"
                className="min-w-[200px] md:min-w-[260px] flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[var(--Color-1)] hover:text-[var(--Color-1)] font-semibold transition snap-start shrink-0 text-sm"
              >
                Lihat Semua Event →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}