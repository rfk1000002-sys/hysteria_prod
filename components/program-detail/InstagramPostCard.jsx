import Link from "next/link";
import Image from "next/image";

// 👉 Tambahkan props title dan previewText
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

        {/* 👉 OVERLAY HOVER SESUAI DESAIN UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-5">
          
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