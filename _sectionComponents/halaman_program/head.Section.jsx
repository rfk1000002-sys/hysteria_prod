// _components/HeroSection.jsx
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// KOMPONEN MENERIMA DATA SEBAGAI "PROPS" (mainHero) DARI LUAR
export default function HeroSection({ mainHero }) {
  
  // Siapkan nilai default (Fallback) kalau admin belum ngisi data di CMS
  const headline = mainHero?.headline || "Laboratorium Para Seniman Semarang Eksis";
  const subHeadline = mainHero?.subHeadline || "Kolektif Hysteria merupakan ruang produksi artistik sekaligus fasilitator untuk pertemuan lintas disipliner dalam skala lokal hingga global untuk mencari terobosan-terobosan dalam persoalan kreatifitas, seni, komunitas, anak muda, dan isu kota.";
  const tautan = mainHero?.tautan || "https://drive.google.com/drive/folders/1VCbeKsG-Pnwvh7DDzPE4kM9J0U-Rvobb";
  const gambarKiri = mainHero?.gambarKiri || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80";
  const gambarKanan = mainHero?.gambarKanan || "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 pt-6 lg:pt-5 pb-16 md:pb-20">
      
      {/* Container Flex */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-16">
        
        {/* 👉 TAMPILAN MOBILE KHUSUS: Judul Pindah ke Paling Atas (Hanya muncul di HP) */}
        <div className="w-full lg:hidden flex flex-col order-1">
          <h1 className={`${poppins.className} text-[32px] sm:text-[40px] font-bold text-[#0A0A0A] leading-[1.2] tracking-tight whitespace-pre-line`}>
            {headline}
          </h1>
        </div>

        {/* --- BAGIAN KIRI (TEKS DESKTOP) --- */}
        {/* Di Desktop: Tetap di kiri (urutan normal flex-row). Di Mobile: Pindah ke bawah gambar (order-3) */}
        <div className="w-full lg:w-5/12 flex flex-col mt-4 lg:mt-0 order-3 lg:order-none">
          
          {/* 👉 Judul ini hanya muncul di Desktop */}
          <h1
            className={`${poppins.className} hidden lg:block text-[40px] md:text-[56px] lg:text-[60px] font-bold text-[#0A0A0A] leading-[1.2] tracking-tight whitespace-pre-line`}
          >
            {headline}
          </h1>
          
          <p
            className={`${poppins.className} text-sm sm:text-base md:text-lg text-[#4a4a4a] leading-relaxed mt-0 lg:mt-6 max-w-[500px] text-left whitespace-pre-line`}
          >
            {subHeadline}
          </p>

          {/* --- BUTTON TERBITAN HYSTERIA --- */}
          {tautan && (
            <div className="mt-8 lg:mt-12">
              <a
                href={tautan}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  ${poppins.className} 
                  inline-flex items-center justify-center 
                  px-6 md:px-8 py-2.5 md:py-3 
                  bg-white text-pink-600 
                  border border-pink-400 
                  font-semibold rounded-full lg:rounded-xl shadow-sm 
                  transition-colors duration-300
                  hover:bg-pink-600 hover:border-pink-600 hover:text-white
                  text-sm md:text-base
                `}
              >
                Terbitan Hysteria
              </a>
            </div>
          )}
        </div>

        {/* --- BAGIAN KANAN (GAMBAR KOLASE) --- */}
        {/* Di Desktop: Tetap di kanan. Di Mobile: Ada di tengah (order-2) */}
        <div className="w-full lg:w-7/12 flex justify-center lg:justify-end gap-4 md:gap-6 items-start relative mt-4 lg:mt-0 order-2 lg:order-none">
          
          {/* GAMBAR 1 (KIRI) */}
          <div className="relative w-[48%] md:w-[280px] lg:w-[320px] aspect-[320/420] rounded-2xl lg:rounded-[24px] overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02]">
            <Image 
              src={gambarKiri} 
              alt="Gambar Hysteria 1" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 48vw, 320px"
              priority
            />
          </div>

          {/* GAMBAR 2 (KANAN) */}
          <div className="relative w-[48%] md:w-[280px] lg:w-[320px] aspect-[320/420] rounded-2xl lg:rounded-[24px] overflow-hidden shadow-lg mt-10 md:mt-20 lg:mt-32 transform transition-transform hover:scale-[1.02]">
            <Image 
              src={gambarKanan} 
              alt="Gambar Hysteria 2" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 48vw, 320px"
            />
          </div>

        </div>

      </div>
    </section>
  );
}