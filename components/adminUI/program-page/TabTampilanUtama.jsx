"use client";

import { useState } from "react";
// 👉 Import komponen UploadBox asli (Global)
import UploadBox from "@/components/adminUI/UploadBox";

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-4 shadow-sm">
      <div
        className="w-full bg-gray-50 flex items-center justify-between p-4 font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 pointer-events-none">
          <span className="text-gray-400">≡</span>
          <span>{title}</span>
        </div>
        <span className={`transform transition-transform text-gray-500 pointer-events-none ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>
      <div className={`p-5 bg-white border-t border-gray-200 ${isOpen ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
};

// Wrapper untuk menghubungkan state Object baru ke UploadBox global
const ProgramUploadBox = ({ label, sizeText, state, onChange }) => {
  return (
    <div className="w-full mb-6">
      <p className="text-sm font-medium text-red-500 mb-3">
        {label} {sizeText ? `- ${sizeText}` : ""}
      </p>
      <UploadBox
        files={state?.files || []}
        setFiles={(newFiles) => onChange({ ...state, files: newFiles })}
        existingUrl={state?.existingUrl || null}
        onClearExisting={() => onChange({ ...state, files: [], existingUrl: null, pendingClear: true })}
        maxSizeMB={2}
      />
    </div>
  );
};

export default function TabTampilanUtama({ mainHero, setMainHero, covers, setCovers, podcasts, setPodcasts }) {
  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-black placeholder-gray-400";

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. HERO PAGE PROGRAM HYSTERIA */}
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-lg font-bold text-black mb-5">Hero Page Program Hysteria</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline *</label>
            <input type="text" value={mainHero.headline || ""} onChange={(e) => setMainHero({ ...mainHero, headline: e.target.value })} className={inputClass} placeholder="Contoh: Laboratorium Perkotaan Semarang Kita" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Headline *</label>
            <textarea rows="3" value={mainHero.subHeadline || ""} onChange={(e) => setMainHero({ ...mainHero, subHeadline: e.target.value })} className={inputClass} placeholder="Tulis deskripsi program hysteria di sini..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Hysteria (Opsional)</label>
            <input type="url" value={mainHero.tautan || ""} onChange={(e) => setMainHero({ ...mainHero, tautan: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <ProgramUploadBox label="Gambar Utama kiri" sizeText="ukuran ratio 3:4" state={mainHero.gambarKiri} onChange={(val) => setMainHero({ ...mainHero, gambarKiri: val })} />
            <ProgramUploadBox label="Gambar Utama kanan" sizeText="ukuran ratio 3:4" state={mainHero.gambarKanan} onChange={(val) => setMainHero({ ...mainHero, gambarKanan: val })} />
          </div>
        </div>
      </div>

      {/* 2. ACCORDION COVER */}
      <div className="pt-2">
        <Accordion title="Cover Festival dan Pameran">
          <div className="space-y-2 pt-2">
            <ProgramUploadBox label="Cover Festival Kampung" sizeText="ukuran 1920 x 850 px" state={covers.festivalKampung} onChange={(val) => setCovers({ ...covers, festivalKampung: val })} />
            <ProgramUploadBox label="Cover Festival Kota" sizeText="ukuran 1920 x 850 px" state={covers.festivalKota} onChange={(val) => setCovers({ ...covers, festivalKota: val })} />
            <ProgramUploadBox label="Cover Biennale" sizeText="ukuran 1920 x 850 px" state={covers.biennale} onChange={(val) => setCovers({ ...covers, biennale: val })} />
          </div>
        </Accordion>

        <Accordion title="Cover Residensi dan Workshop">
          <div className="space-y-2 pt-2">
            <ProgramUploadBox label="Cover Flash Residency" sizeText="ukuran 1920 x 850 px" state={covers.flashResidency} onChange={(val) => setCovers({ ...covers, flashResidency: val })} />
            <ProgramUploadBox label="Cover Kandang Tandang" sizeText="ukuran 1920 x 850 px" state={covers.kandangTandang} onChange={(val) => setCovers({ ...covers, kandangTandang: val })} />
          </div>
        </Accordion>
      </div>

      {/* 3. ACCORDION PODCAST */}
      <div className="pt-2">
        <Accordion title="Cover Safari Memori">
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-black mb-2">Hero Page Tentang Safari Memori</h3>
            <input type="text" value={podcasts.safariMemori?.title || ""} onChange={(e) => setPodcasts({ ...podcasts, safariMemori: { ...podcasts.safariMemori, title: e.target.value } })} className={inputClass} placeholder="Title" />
            <textarea rows="2" value={podcasts.safariMemori?.subtitle || ""} onChange={(e) => setPodcasts({ ...podcasts, safariMemori: { ...podcasts.safariMemori, subtitle: e.target.value } })} className={inputClass} placeholder="Subtitle" />
            <div className="pt-2">
              <ProgramUploadBox label="Gambar Cover" sizeText="ukuran 1920 x 850 px" state={podcasts.safariMemori?.image} onChange={(val) => setPodcasts({ ...podcasts, safariMemori: { ...podcasts.safariMemori, image: val } })} />
            </div>
          </div>
        </Accordion>

        <Accordion title="Cover Aston">
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-black mb-2">Hero Page Tentang Aston</h3>
            <input type="text" value={podcasts.aston?.title || ""} onChange={(e) => setPodcasts({ ...podcasts, aston: { ...podcasts.aston, title: e.target.value } })} className={inputClass} placeholder="Title" />
            <textarea rows="2" value={podcasts.aston?.subtitle || ""} onChange={(e) => setPodcasts({ ...podcasts, aston: { ...podcasts.aston, subtitle: e.target.value } })} className={inputClass} placeholder="Subtitle" />
            <div className="pt-2">
              <ProgramUploadBox label="Gambar Cover" sizeText="ukuran 1920 x 850 px" state={podcasts.aston?.image} onChange={(val) => setPodcasts({ ...podcasts, aston: { ...podcasts.aston, image: val } })} />
            </div>
          </div>
        </Accordion>

        <Accordion title="Cover Sore Di Stonen">
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-black mb-2">Hero Page Tentang Sore Di Stonen</h3>
            <input type="text" value={podcasts.soreDiStonen?.title || ""} onChange={(e) => setPodcasts({ ...podcasts, soreDiStonen: { ...podcasts.soreDiStonen, title: e.target.value } })} className={inputClass} placeholder="Title" />
            <textarea rows="2" value={podcasts.soreDiStonen?.subtitle || ""} onChange={(e) => setPodcasts({ ...podcasts, soreDiStonen: { ...podcasts.soreDiStonen, subtitle: e.target.value } })} className={inputClass} placeholder="Subtitle" />
            <div className="pt-2">
              <ProgramUploadBox label="Gambar Cover" sizeText="ukuran 1920 x 850 px" state={podcasts.soreDiStonen?.image} onChange={(val) => setPodcasts({ ...podcasts, soreDiStonen: { ...podcasts.soreDiStonen, image: val } })} />
            </div>
          </div>
        </Accordion>
      </div>

      {/* 4. ACCORDION COVER VIDEO SERIES */}
      <div className="pt-2">
        <Accordion title="Cover Video Series">
          <div className="space-y-2 pt-2">
            <ProgramUploadBox label="Cover Sapa Warga" sizeText="ukuran 1920 x 850 px" state={covers.sapaWarga} onChange={(val) => setCovers({ ...covers, sapaWarga: val })} />
            <ProgramUploadBox label="Cover Hysteria Berkelana" sizeText="ukuran 1920 x 850 px" state={covers.hysteriaBerkelana} onChange={(val) => setCovers({ ...covers, hysteriaBerkelana: val })} />
          </div>
        </Accordion>
      </div>

    </div>
  );
}