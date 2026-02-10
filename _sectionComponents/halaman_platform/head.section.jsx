import React from 'react'
import Image from 'next/image'

/**
 * HeadSection
 * --------------------------------------------------
 * Komponen hero/header reusable.
 * Menampilkan teks (title + description) dan visual (gambar tunggal / multiple).
 * Layout responsif dan dikontrol penuh via props.
 */
export default function HeadSection({
  title,                 // Judul utama section
  description,           // Deskripsi pendukung
  instagramUrl,          // URL Instagram (opsional)
  youtubeUrl,            // URL YouTube (opsional)
  images = [],           // Array data gambar
  showSocialButtons = true, // Toggle tampil/tidak tombol sosial
  multyImages = false    // Mode tampilan gambar besar / multiple
}) {

  /**
   * Konstanta ukuran gambar
   * Dipakai untuk next/image agar:
   * - layout stabil (no CLS)
   * - optimisasi image tetap jalan
   */
  const SINGLE_W = 500
  const SINGLE_H = 516
  const MULTI_W = 480
  const MULTI_H = 600

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 text-black">
      
      <div className="mx-auto w-full max-w-[1100px] sm:max-w-[1200px] md:max-w-[1400px] lg:max-w-[1800px] px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">

        {/* ================= TEXT AREA ================= */}
        <div>
          {/* Title */}
          <h1 className="text-[28px] sm:text-[40px] md:text-[50px] font-bold leading-[150%] mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-black mb-6 max-w-full sm:max-w-xl text-[14px] sm:text-[16px] md:text-[20px] font-normal leading-[150%]">
            {description}
          </p>

          {/* Social buttons hanya dirender jika diaktifkan */}
          {showSocialButtons && (
            <div className="flex gap-3 flex-wrap">
              <a
                href={instagramUrl || "#"}
                className="
                  inline-block bg-white text-pink-600 px-4 py-2 rounded-md 
                  border border-pink-400 shadow-sm 
                  hover:bg-[#E1306C] hover:border-[#C13584] hover:text-white
                  transition-colors
                "
              >
                Instagram
              </a>
              <a
                href={youtubeUrl || "#"}
                className="
                  inline-block bg-white text-pink-600 px-4 py-2 rounded-md
                  border border-pink-400 shadow-sm
                  hover:bg-[#ff0000] hover:border-[#cc0000] hover:text-white
                  transition-colors
                "
              >
                Youtube
              </a>

            </div>
          )}
        </div>

        {/* ================= IMAGE AREA ================= */}
        <div className="flex justify-center md:justify-end order-first md:order-last">

          {/* ===== CASE: SATU GAMBAR ===== */}
          {images.length === 1 ? (
            <div
              /**
               * Container image tunggal (responsive, mobile constrained)
               * - Small screens: full width but limited max-height to avoid oversized hero
               * - Larger screens: constrained max-width and taller max-height
               */
              className={`w-full relative overflow-hidden bg-white rounded-lg p-2 sm:p-3 mx-auto
                ${multyImages
                  ? 'max-w-[92%] sm:max-w-[720px]'
                  : 'max-w-[70%] sm:max-w-[360px]'}
                max-h-[320px] sm:max-h-[380px] md:max-h-[600px]`}
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                width={SINGLE_W}
                height={SINGLE_H}
                className="rounded-lg w-full h-full object-cover border border-zinc-400"
              />
            </div>
          ) : (
            /**
             * ===== CASE: MULTIPLE GAMBAR =====
             * Ditampilkan dalam posisi staggered (naik–turun)
             * untuk efek depth / layering visual
             */
            <div
              className={`flex ${
                multyImages
                  ? 'gap-10 sm:gap-12 md:gap-16'
                  : 'gap-3 sm:gap-4 md:gap-6'
              } items-center`}
            >
              {images.map((image, index) => {

                /**
                 * Wrapper tiap gambar:
                 * - Ukuran beda tergantung multyImages
                 * - Gambar pertama naik, kedua turun
                 * - z-index untuk efek tumpukan
                 */
                const wrapperClass = multyImages
                  ? `w-36 sm:w-48 md:w-64 bg-white rounded-lg shadow-lg transform
                     ${index === 0
                       ? '-translate-y-4 md:-translate-y-8 z-20'
                       : 'translate-y-4 md:translate-y-8 z-10'}`
                  : `w-32 sm:w-44 md:w-56 bg-white rounded-lg shadow-lg p-3 transform
                     ${index === 0
                       ? '-translate-y-7 md:-translate-y-12 z-20'
                       : 'translate-y-7 md:translate-y-12 z-10'}`

                return (
                  <div key={index} className={wrapperClass}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={multyImages ? MULTI_W : SINGLE_W}
                      height={multyImages ? MULTI_H : SINGLE_H}
                      className="rounded-lg w-full h-auto object-cover border border-zinc-400"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
