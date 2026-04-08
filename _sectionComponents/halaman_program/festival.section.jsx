import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function FestivalSection({ covers }) {
  const fallbackKampung = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80";
  const fallbackKota = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80";
  const fallbackBiennale = "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80";

  const imgKampung = covers?.festivalKampung || fallbackKampung;
  const imgKota = covers?.festivalKota || fallbackKota;
  const imgBiennale = covers?.biennale || fallbackBiennale;

  const festivalItems = [
    { title: "Festival Kampung", image: imgKampung, link: "/program/festival-kampung" },
    { title: "Festival Kota", image: imgKota, link: "/program/festival-kota" },
    { title: "Biennale", image: imgBiennale, link: "/program/festival-biennale" },
  ];

  return (
    <section id="festival" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 py-10 mb-6 md:mb-10">
      
      <div className="flex justify-between items-end mb-6 md:mb-8">
        <h2 className={`${poppins.className} text-[22px] md:text-[32px] font-bold text-black`}>
            Festival dan Pameran
        </h2>
      </div>

      {/* 👉 TAMPILAN MOBILE (HORIZONTAL SCROLL) - Ditambah 'after:' agar kanan tidak mentok */}
      <div className="flex lg:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:w-[1px] after:flex-shrink-0">
        {festivalItems.map((item, idx) => (
          <Link 
            key={idx}
            href={item.link} 
            // 👉 PERUBAHAN: snap-center diubah menjadi snap-start
            className="relative w-[260px] sm:w-[300px] h-[180px] sm:h-[220px] flex-shrink-0 snap-start rounded-2xl overflow-hidden group shadow-md"
          >
            <FestivalCardContent title={item.title} image={item.image} mobile />
          </Link>
        ))}
      </div>

      {/* 👉 TAMPILAN DESKTOP (GRID ASIMETRIS ASLI) */}
      <div className="hidden lg:flex flex-col lg:flex-row gap-6 h-[500px]">
        {/* Kolom Kiri */}
        <Link 
            href="/program/festival-kampung" 
            className="relative w-full lg:w-3/5 h-full rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300"
        >
             <FestivalCardContent title="Festival Kampung" image={imgKampung} />
        </Link>

        {/* Kolom Kanan */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6 h-full">
          <Link 
            href="/program/festival-kota"
            className="relative w-full h-1/2 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300"
          >
             <FestivalCardContent title="Festival Kota" image={imgKota} />
          </Link>
          <Link 
            href="/program/festival-biennale"
            className="relative w-full h-1/2 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300"
          >
             <FestivalCardContent title="Biennale" image={imgBiennale} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FestivalCardContent({ title, image, mobile }) {
  return (
    <>
      <div className="absolute inset-0 w-full h-full bg-gray-200">
         <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 1024px) 300px, 50vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      <div className={`absolute inset-0 flex items-end justify-between z-10 ${mobile ? 'p-4' : 'p-6'}`}>
        <h3 className={`${poppins.className} text-white ${mobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold drop-shadow-md`}>
          {title}
        </h3>
        <div className={`bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:translate-x-2 group-hover:bg-pink-600 text-pink-600 group-hover:text-white border border-white/50 ${mobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <svg width={mobile ? "16" : "20"} height={mobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
          </svg>
        </div>
      </div>
    </>
  );
}