import Image from "next/image";

export default function InstagramPreviewCard({
  thumbnailUrl,
  alt = "Instagram preview",
  leftBadge,
  rightBadge,
  className = "",
}) {
  const displayImage = thumbnailUrl || "https://via.placeholder.com/400x600?text=No+Image";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className="relative aspect-[9/16] w-full bg-gray-200">
        <Image
          src={displayImage}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 300px, 80vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
          unoptimized
        />
      </div>

      {leftBadge ? (
        <div className="absolute bottom-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur shadow-sm">
          {leftBadge}
        </div>
      ) : null}

      {rightBadge ? (
        <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur shadow-sm">
          {rightBadge}
        </div>
      ) : null}
    </div>
  );
}