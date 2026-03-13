"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function PosterCard({
  imageUrl,
  alt,
  title,
  description,
  tags,
  badge,
  meta,
}) {
  const imgSrc = imageUrl || "/image/DummyPoster.webp";
  const isLocal = typeof imgSrc === "string" && imgSrc.startsWith("/");

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function onDoc(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [isOpen]);

  const badgeLabel = badge || (tags && tags.length > 0 ? tags[0] : null);

  return (
    <div
      ref={wrapperRef}
      role="button"
      tabIndex={0}
      className="group relative w-full aspect-[2/3] overflow-hidden rounded-xl cursor-pointer shadow-xl border-1 border-zinc-300"
      onClick={(e) => {
        const tgt = e.target;
        if (tgt && tgt.tagName) {
          const tag = tgt.tagName.toUpperCase();
          const interactive = [
            "A",
            "BUTTON",
            "INPUT",
            "SELECT",
            "TEXTAREA",
            "LABEL",
          ];
          if (interactive.includes(tag)) return;
        }
        setIsOpen((s) => !s);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen((s) => !s);
        }
      }}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        {/* Image — blurs and scales on hover */}
        <Image
          src={imgSrc}
          alt={alt || title || "Poster"}
          fill
          unoptimized={!isLocal}
          priority={true}
          sizes="(max-width:640px) 50vw, 260px"
          className={`object-cover block transition-all duration-300 ${
            isOpen
              ? "scale-105 blur-xl brightness-50"
              : "group-hover:scale-105 group-hover:blur-xl group-hover:brightness-50 border border-zinc-300"
          }`}
          style={{ objectPosition: "center center" }}
        />

        {/* Hover overlay */}
        <div
          className={
            "absolute inset-0 z-10 transition-opacity duration-200 " +
            (isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto")
          }
        >
          {/* Badge — top-left, white background with pink border */}
          {badgeLabel && (
            <div className="absolute top-3 left-3 z-30">
              <span className="bg-white text-pink-500 border border-pink-400 text-[9px] md:text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                {badgeLabel}
              </span>
            </div>
          )}

          {/* Bottom white info panel */}
          <div className="absolute left-0 right-0 bottom-0 z-30 bg-transparent px-3 pt-3 pb-3 space-y-3">
            {title && (
              <h3 className="text-zinc-100 text-[12px] md:text-base font-semibold leading-snug line-clamp-2">
                {title}
              </h3>
            )}
            {meta && (
              <p className="text-zinc-100 text-[9px] md:text-xs mt-1 line-clamp-2">
                {meta}
              </p>
            )}
            <button className="mt-2 w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[9px] md:text-xs font-semibold py-1.5 rounded-md cursor-pointer">
              Lihat Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
