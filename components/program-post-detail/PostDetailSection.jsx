import Link from "next/link";
import InstagramPreviewCard from "./InstagramPreviewCard";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
  );
}

export default function PostDetailSection({ post }) {
  if (!post) return null;

  // 1. OLAH DATA TAGS
  const tagNames = post.tags && Array.isArray(post.tags) 
    ? post.tags.map(t => t.tag?.name).filter(Boolean)
    : [];

  // 👉 PERUBAHAN BESAR: 
  // Karena sekarang tabel BerkelanaPost sudah punya kolom sendiri,
  // Kita tinggal panggil datanya langsung! (Tanpa perlu Regex / Split "---")
  const mainDescription = post.description || "";
  const host = post.host || "";
  const podcaster = post.podcaster || "";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 pb-20">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* BAGIAN KIRI: GAMBAR */}
          <div className="w-full lg:w-[340px] flex-shrink-0 mx-auto lg:mx-0">
            <InstagramPreviewCard
              thumbnailUrl={post.poster || "/image/default-placeholder.png"}
              alt={post.title || "Post Image"}
              leftBadge={<UserIcon />}
              rightBadge={<SoundOffIcon />}
            />
          </div>

          {/* BAGIAN KANAN: TEKS */}
          <div className="flex-1 w-full pt-2 lg:pt-4 overflow-hidden">
            
            {/* Judul */}
            <h1 className="text-3xl md:text-[36px] font-black uppercase tracking-wide text-[#3F334D] mb-8 leading-[1.2]">
              {post.title}
            </h1>

            {/* INFO HOST & PODCASTER */}
            {(host || podcaster) && (
              <div className="mb-10 p-5 bg-pink-50/40 border border-pink-100 rounded-2xl inline-block w-full sm:w-auto min-w-[280px]">
                {host && (
                  <p className="text-sm text-[#8a2a78] font-medium mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-[#ff4aa2] block mb-0.5">Pengisi / Host</span>
                    {host}
                  </p>
                )}
                {podcaster && (
                  <p className={`text-sm text-[#8a2a78] font-medium ${host ? "mt-4 pt-4 border-t border-pink-200/50" : ""}`}>
                    <span className="font-bold uppercase tracking-wider text-[11px] text-[#ff4aa2] block mb-0.5">Podcaster</span>
                    {podcaster}
                  </p>
                )}
              </div>
            )}

            {/* Deskripsi */}
            {mainDescription ? (
              <div 
                className="space-y-5 text-[15px] md:text-base leading-relaxed text-[#3F334D] font-medium break-words prose prose-p:my-0 max-w-none"
                dangerouslySetInnerHTML={{ __html: mainDescription }}
              />
            ) : (
               <p className="text-base text-[#3F334D]/70 italic">Belum ada deskripsi.</p>
            )}

            {/* List Tags */}
            {tagNames.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 text-base">
                <span className="font-black text-[#3F334D] mr-2 text-[17px]">Tags:</span>
                {tagNames.map((tag, idx) => (
                  <Link 
                    key={idx} 
                    href={`/program/hysteria-berkelana?q=${tag}`} 
                    className="text-[#E83C91] hover:text-[#b02a6b] font-medium transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={post.instagramLink || "#"}
                className="inline-flex items-center justify-center rounded-xl bg-[#3F334D] px-8 py-3.5 text-[15px] font-bold text-white hover:bg-[#2c2336] transition-colors shadow-lg"
                target={post.instagramLink ? "_blank" : "_self"}
                rel="noreferrer"
              >
                Lihat di Instagram
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}