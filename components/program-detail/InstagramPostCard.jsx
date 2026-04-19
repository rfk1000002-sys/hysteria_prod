import Link from "next/link";
import Image from "next/image";

// 👉 KOMPONEN ICON USER
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

// 👉 KOMPONEN ICON SPEAKER (SOUND OFF)
function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
  );
}

export default function InstagramPostCard({
  href,
  thumbnailUrl,
  alt = "Instagram thumbnail",
  title,
  previewText,
}) {
  return (
    <Link href={href} className="group block" aria-label="Open post detail">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.18)] bg-gray-200">
        
        <Image
          src={thumbnailUrl || "https://via.placeholder.com/400x600?text=No+Image"}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />

        {/* 👉 BADGE KIRI BAWAH (Icon Orang) */}
        <div className="absolute bottom-3.5 left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur shadow-sm z-10 transition-opacity duration-300 group-hover:opacity-0">
          <UserIcon />
        </div>

        {/* 👉 BADGE KANAN BAWAH (Icon Speaker Mute) */}
        <div className="absolute bottom-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur shadow-sm z-10 transition-opacity duration-300 group-hover:opacity-0">
          <SoundOffIcon />
        </div>

        {/* 👉 OVERLAY HOVER (Muncul saat di-hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-5 z-20">
          
          {/* Teks Atas: Judul & Preview */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-lg leading-tight mb-3 line-clamp-3">
              {title}
            </h3>
            <p className="text-gray-200 text-sm font-medium leading-relaxed line-clamp-4">
              {previewText}
            </p>
          </div>

          {/* Tombol Bawah */}
          <div className="w-full bg-white text-[#ff4aa2] font-bold text-center py-3 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100">
            Lihat Detail
          </div>
        </div>

      </div>
    </Link>
  );
}