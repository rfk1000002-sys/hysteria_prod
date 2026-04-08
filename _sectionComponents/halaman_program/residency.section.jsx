import Image from "next/image";
import Link from "next/link"; 
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function ResidencySection({ covers }) {
  const fallbackFlash = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop";
  const fallbackKandang = "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop";

  const residencyItems = [
    { id: 1, title: "Flash Residency", image: covers?.flashResidency || fallbackFlash, link: "/program/flash-residency" },
    { id: 2, title: "Kandang Tandang", image: covers?.kandangTandang || fallbackKandang, link: "/program/kandang-tandang" },
  ];

  return (
    <section id="residensi-workshop" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-20 mb-16 md:mb-20">
      
      {/* 👉 PERUBAHAN: Bungkus Judul agar 100% rata Kiri */}
      <div className="w-full flex justify-start items-center mb-6 md:mb-8">
        <h2 className={`${poppins.className} text-[22px] md:text-[32px] font-bold text-black text-left`}>
          Residensi dan Workshop
        </h2>
      </div>

      <div className="flex md:grid overflow-x-auto md:overflow-visible md:grid-cols-2 gap-4 md:gap-8 snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:w-[1px] after:flex-shrink-0 md:after:hidden">
        {residencyItems.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            className="block group relative w-[280px] sm:w-[320px] md:w-full flex-shrink-0 snap-start h-[200px] sm:h-[240px] md:h-[380px] rounded-2xl md:rounded-[24px] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gray-200">
               <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 320px, 50vw" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-[#3E3245] p-4 md:p-8 flex items-center justify-between transition-colors duration-300 group-hover:bg-[#5a4863]">
              <h3 className={`${poppins.className} text-white text-lg md:text-2xl font-bold truncate pr-2`}>{item.title}</h3>
              <div className="flex-shrink-0 bg-white/10 p-1.5 md:p-2 rounded-full text-white transform group-hover:translate-x-2 group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}