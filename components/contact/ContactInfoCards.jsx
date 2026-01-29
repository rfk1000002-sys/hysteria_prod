import { MapPin, Clock3 } from "lucide-react";

export default function ContactInfoCards() {
  return (
    <section className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
      {/* Lokasi */}
      <div className="rounded-xl bg-[#9B95A0] px-8 pb-[30px] pt-[38px] text-white shadow-lg">
        <div className="place-items-center pb-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow">
            <MapPin className="h-6 w-6 text-[#FF8FB7]" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-extrabold text-[#43334C]">Lokasi Kami</h2>
        <div className="mt-[20px] mb-[20px] text-center text-sm leading-6">
          <div className="font-semibold">Gerobak Artkos x Hysteria</div>
          <div className="opacity-95">
            Jl. Stonen No.29, Bendan Ngisor, Kec. Gajahmungkur,
            <br />
            Kota Semarang, Jawa Tengah 50233
          </div>
        </div>
      </div>

      {/* Jam Operasional */}
      <div className="rounded-xl bg-[#9B95A0] px-8 pb-[30px] pt-[38px] text-white shadow-lg">
        <div className="place-items-center pb-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow">
            <Clock3 className="h-6 w-6 text-[#FF8FB7]" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-extrabold text-[#43334C]">Jam Operasional</h2>
        <div className="mt-[20px] mb-[20px] text-center text-sm leading-6">
          <div>
            <span className="font-semibold">Senin - Jumat:</span> 09:00 - 17:00 WIB
          </div>
          <div>
            <span className="font-semibold">Sabtu:</span> 10:00 - 15:00 WIB
          </div>
          <div className="font-semibold">Minggu &amp; Libur: Tutup</div>
        </div>
      </div>
    </section>
  );
}
