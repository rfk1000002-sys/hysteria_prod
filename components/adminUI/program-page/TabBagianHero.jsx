"use client";

import { useState } from "react";
// 👉 Import komponen UploadBox asli (Global)
import UploadBox from "@/components/adminUI/UploadBox";

function ChevronIcon({ open }) {
  return (
    <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Wrapper untuk menghubungkan state Object baru ke UploadBox global
const ProgramUploadBox = ({ label, sizeText, state, onChange }) => {
  return (
    <div className="w-full">
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

export default function TabBagianHero({ slugHeros, setSlugHeros }) {
  const [openKey, setOpenKey] = useState(null);
  const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key));
  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-black placeholder-gray-400";

  const categoryList = [
    { key: "festivalKampung", label: "Hero Page Festival Kampung" },
    { key: "festivalKota", label: "Hero Page Festival Kota" },
    { key: "biennale", label: "Hero Page Biennale" },
    { key: "forum", label: "Hero Page Forum" },
    { key: "musik", label: "Hero Page Musik" },
    { key: "flashResidency", label: "Hero Page Flash Residency" },
    { key: "kandangTandang", label: "Hero Page Kandang Tandang" },
    { key: "safariMemori", label: "Hero Page Safari Memori" },
    { key: "pemutaranFilm", label: "Hero Page Pemutaran Film" },
    { key: "sapaWarga", label: "Hero Page Sapa Warga" },
    { key: "hysteriaBerkelana", label: "Hero Page Hysteria Berkelana" },
  ];

  const handleHeroChange = (categoryKey, field, value) => {
    setSlugHeros((prev) => ({
      ...prev,
      [categoryKey]: {
        ...(prev[categoryKey] || {}),
        [field]: value,
      },
    }));
  };

  const handleDetailChange = (field, value) => {
    setSlugHeros((prev) => ({
      ...prev,
      detail: {
        ...(prev.detail || {}),
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-10">
      <div>
        <h2 className="text-xl font-bold text-black mb-2">Pengaturan Hero per Kategori Program</h2>
        <p className="text-gray-500 text-sm mb-6">Kelola judul, deskripsi, dan background Hero untuk setiap halaman spesifik.</p>
      </div>

      <div className="space-y-2">
        {categoryList.map((cat) => {
          const isOpen = openKey === cat.key;
          const data = slugHeros[cat.key] || { title: "", subtitle: "", image: { files: [], existingUrl: null, pendingClear: false } };
          
          return (
            <div key={cat.key} className="border border-gray-300 rounded-lg overflow-hidden">
              <button type="button" onClick={() => toggle(cat.key)} className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-pink-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <ChevronIcon open={isOpen} />
                  <span className="text-sm font-medium text-gray-800">{cat.label}</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-3 bg-white border-t border-gray-100 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input type="text" value={data.title} onChange={(e) => handleHeroChange(cat.key, "title", e.target.value)} className={inputClass} placeholder="Masukkan judul hero..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                      <input type="text" value={data.subtitle} onChange={(e) => handleHeroChange(cat.key, "subtitle", e.target.value)} className={inputClass} placeholder="Subtitle / deskripsi singkat..." />
                    </div>
                  </div>
                  <div className="pt-2">
                    <ProgramUploadBox label="Upload Gambar" sizeText="ukuran 1920 x 850 px" state={data.image} onChange={(val) => handleHeroChange(cat.key, "image", val)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <button type="button" onClick={() => toggle("detailPage")} className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-pink-200 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <ChevronIcon open={openKey === "detailPage"} />
                <span className="text-sm font-medium text-gray-800">Hero Page Detail</span>
              </div>
            </button>

            {openKey === "detailPage" && (
              <div className="px-5 pb-5 pt-4 bg-white border-t border-gray-100 space-y-6">
                <ProgramUploadBox label="Background Default Halaman Detail" sizeText="ukuran 1920 x 850 px" state={slugHeros.detail?.image} onChange={(val) => handleDetailChange("image", val)} />
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <input type="checkbox" id="blurCheckbox" checked={slugHeros.detail?.isBlur || false} onChange={(e) => handleDetailChange("isBlur", e.target.checked)} className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500 accent-pink-600 cursor-pointer" />
                  <label htmlFor="blurCheckbox" className="text-sm font-bold text-gray-700 cursor-pointer select-none">Tampilkan Efek Blur pada Background</label>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}