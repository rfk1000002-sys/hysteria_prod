"use client";

import { useState, useEffect } from "react";
import TabTampilanUtama from "@/components/adminUI/program-page/TabTampilanUtama";
import TabBagianHero from "@/components/adminUI/program-page/TabBagianHero";

// State bawaan untuk image object
const defImg = () => ({ files: [], existingUrl: null, pendingClear: false });

export default function PageProgram() {
  const [activeTab, setActiveTab] = useState("utama");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ================= STATE TAB 1 (Struktur Baru) =================
  const [mainHero, setMainHero] = useState({ headline: "", subHeadline: "", tautan: "", gambarKiri: defImg(), gambarKanan: defImg() });
  const [covers, setCovers] = useState({ festivalKampung: defImg(), festivalKota: defImg(), biennale: defImg(), flashResidency: defImg(), kandangTandang: defImg(), sapaWarga: defImg(), hysteriaBerkelana: defImg() });
  const [podcasts, setPodcasts] = useState({ safariMemori: { title: "", subtitle: "", image: defImg() }, aston: { title: "", subtitle: "", image: defImg() }, soreDiStonen: { title: "", subtitle: "", image: defImg() } });

  // ================= STATE TAB 2 (Struktur Baru) =================
  const [slugHeros, setSlugHeros] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/page-program");
        if (res.ok) {
          const data = await res.json();
          
          // Helper untuk memetakan string database -> Object UI
          const mapImg = (url) => ({ files: [], existingUrl: url || null, pendingClear: false });
          
          if (data.mainHero) {
            setMainHero({ ...data.mainHero, gambarKiri: mapImg(data.mainHero.gambarKiri), gambarKanan: mapImg(data.mainHero.gambarKanan) });
          }
          
          if (data.slugHeros) {
            const parsedSlugHeros = {};
            for (const key in data.slugHeros) {
              parsedSlugHeros[key] = { ...data.slugHeros[key], image: mapImg(data.slugHeros[key].image) };
            }
            setSlugHeros(parsedSlugHeros);
          }
          
          if (data.covers) {
            const { podcasts: dbPodcasts, ...dbCovers } = data.covers;
            if (Object.keys(dbCovers).length > 0) {
              const parsedCovers = {};
              for (const key in dbCovers) parsedCovers[key] = mapImg(dbCovers[key]);
              setCovers((prev) => ({ ...prev, ...parsedCovers }));
            }
            if (dbPodcasts) {
              const parsedPod = {};
              for (const key in dbPodcasts) parsedPod[key] = { ...dbPodcasts[key], image: mapImg(dbPodcasts[key].image) };
              setPodcasts((prev) => ({ ...prev, ...parsedPod }));
            }
          }
        }
      } catch (error) {
        console.error("Gagal memuat data pengaturan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      let fileCounter = 0;

      // Logika cerdas pemindai objek gambar secara rekursif
      const processPayload = (obj) => {
        if (Array.isArray(obj)) return obj.map(item => processPayload(item));
        else if (obj !== null && typeof obj === 'object') {
          // Apakah ini objek Gambar?
          if ('files' in obj && 'existingUrl' in obj && 'pendingClear' in obj) {
            if (obj.files.length > 0) {
              const fileId = `img_${fileCounter++}`;
              formData.append(`file_${fileId}`, obj.files[0]);
              return `UPLOAD_PENDING_${fileId}`; // Penanda untuk server
            } else if (obj.pendingClear) {
              return null;
            } else {
              return obj.existingUrl;
            }
          }
          // Objek biasa
          const newObj = {};
          for (const key in obj) newObj[key] = processPayload(obj[key]);
          return newObj;
        }
        return obj;
      };

      const rawPayload = { mainHero, covers: { ...covers, podcasts }, slugHeros };
      const cleanedPayload = processPayload(rawPayload);

      formData.append("payload", JSON.stringify(cleanedPayload));

      const res = await fetch("/api/admin/page-program", {
        method: "POST",
        body: formData, // 👉 Sekarang kita kirim Multipart FormData
      });

      if (!res.ok) throw new Error("Gagal menyimpan ke server");

      alert("🎉 Pengaturan berhasil disimpan ke Database!");
      window.location.reload(); // Reload agar data File terbaru ter-render sebagai Url
    } catch (error) {
      alert("❌ Terjadi kesalahan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] text-[#E83C91]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E83C91] mb-3"></div>
        <p className="font-semibold font-poppins text-sm animate-pulse">Menyinkronkan dengan Database...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-5xl mx-auto font-poppins">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Hero Page Program</h1>
          <p className="text-sm text-gray-500">Kelola bagian Hero dan tampilan utama pada bagian Program Hysteria.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-[#413153] hover:bg-[#2d2239] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50">
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div className="flex gap-8 mb-8 border-b">
        <button onClick={() => setActiveTab("utama")} className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "utama" ? "text-[#E83C91]" : "text-gray-400 hover:text-gray-700"}`}>
          Tampilan Utama Program
          {activeTab === "utama" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E83C91]" />}
        </button>
        <button onClick={() => setActiveTab("hero")} className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === "hero" ? "text-[#E83C91]" : "text-gray-400 hover:text-gray-700"}`}>
          Bagian Hero
          {activeTab === "hero" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E83C91]" />}
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "utama" ? (
          <TabTampilanUtama mainHero={mainHero} setMainHero={setMainHero} covers={covers} setCovers={setCovers} podcasts={podcasts} setPodcasts={setPodcasts} />
        ) : (
          <TabBagianHero slugHeros={slugHeros} setSlugHeros={setSlugHeros} />
        )}
      </div>
    </div>
  );
}