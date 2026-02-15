import Image from "next/image";

export default function FestivalCard({ item }) {
  return (
    <div className="group relative w-full aspect-[253/320] rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all duration-500 hover:shadow-2xl">
      {/* Gambar atau Placeholder */}
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className={`absolute inset-0 ${item.bgColor || 'bg-gray-300'} flex items-center justify-center p-6 text-center text-white/20 font-black text-2xl uppercase italic`}>
          FESTIVAL
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      
      {/* Konten */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-center text-white">
        <span className="inline-block px-2 py-0.5 bg-[#D63384] text-[8px] sm:text-[9px] rounded-full font-bold uppercase mb-2">
          {item.status || "Telah Berakhir"}
        </span>
        <h3 className="text-[10px] sm:text-xs font-bold leading-tight line-clamp-2 mb-1 uppercase">
          {item.title}
        </h3>
        <p className="text-[8px] sm:text-[9px] text-gray-300 mb-2">
          {item.date || "Selasa, 15 Juli 2025"}
        </p>
        
        <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300">
          <button className="w-full py-1.5 bg-[#D63384] text-[9px] font-bold rounded-lg hover:bg-pink-700">
            Ikuti Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}