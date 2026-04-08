"use client";

import { useState, useRef, useEffect } from "react";

// 👉 PERUBAHAN: Icon Search disesuaikan dengan desain UI (kaca pembesar)
function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></line>
    </svg>
  );
}

// 👉 PERUBAHAN: Icon Filter diubah menjadi Funnel (Corong) seperti desain UI
function FilterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></polygon>
    </svg>
  );
}

export default function ProgramSearchBar({
  initialQuery = "",
  onSearch,
  onSortChange, // Tambahan prop kalau nanti mau dihubungkan dengan filter Hysteria
  isLoading = false,
}) {
  const [q, setQ] = useState(initialQuery);
  
  // 👉 STATE BARU: Untuk mengontrol Dropdown Filter
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Terbaru');
  const dropdownRef = useRef(null);

  // Menutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function submit(e) {
    e.preventDefault();
    onSearch?.(q);
  }

  function handleSortSelection(opt) {
    setSortOption(opt);
    setIsDropdownOpen(false);
    onSortChange?.(opt); // Mengirim pilihan filter ke komponen induk (jika diperlukan)
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {/* AREA SEARCH (Ukuran Tetap max-w-3xl) */}
      <form
        onSubmit={submit}
        className="relative w-full max-w-3xl"
        aria-label="Search form"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-full border border-[#D63384] bg-white px-6 py-4 pr-14 text-sm text-[#D63384] outline-none placeholder:text-[#D63384]/60 focus:ring-2 focus:ring-[#D63384]/20 shadow-sm transition-all"
        />

        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#D63384] hover:bg-pink-50 transition-colors"
          aria-label="Search"
          disabled={isLoading}
        >
          <SearchIcon className="h-[22px] w-[22px]" />
        </button>

        {isLoading ? (
          <div className="absolute -bottom-6 left-6 text-xs text-[#D63384]/60">
            Loading...
          </div>
        ) : null}
      </form>

      {/* AREA FILTER & DROPDOWN */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex h-14 w-14 items-center justify-center rounded-full border border-[#D63384] transition-colors shadow-sm ${
            isDropdownOpen ? 'bg-pink-50 text-[#D63384]' : 'bg-white text-[#D63384] hover:bg-pink-50'
          }`}
          aria-label="Filter"
        >
          <FilterIcon className="h-5 w-5" />
        </button>

        {/* Menu Dropdown Popup */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 z-50">
            <p className="text-[#3F334D] font-bold px-4 pt-2 pb-3 text-sm">Sort by</p>
            <div className="flex flex-col gap-1">
              {['Terbaru', 'Terlama', 'Judul, A - Z', 'Judul, Z - A'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSortSelection(opt)}
                  className={`text-left px-4 py-2.5 text-[13px] rounded-lg transition-colors ${
                    sortOption === opt 
                      ? 'bg-pink-50 text-[#D63384] font-semibold' 
                      : 'text-[#3F334D] hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}