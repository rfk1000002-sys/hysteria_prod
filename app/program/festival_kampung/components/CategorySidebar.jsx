import { X } from "lucide-react";

export default function CategorySidebar({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  setCurrentPage, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) {
  return (
    <aside className={`${
      mobileMenuOpen ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:relative lg:bg-transparent" : "hidden lg:block"
    }`}>
      {mobileMenuOpen && <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />}
      
      <div className={`${
        mobileMenuOpen ? "absolute top-0 left-0 w-64 h-screen p-4" : ""
      } bg-white rounded-xl border border-[#D63384] lg:sticky lg:top-24 lg:w-[200px] shadow-sm lg:shadow-none overflow-hidden shrink-0`}>
        <div className="flex flex-col">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
                setMobileMenuOpen(false);
              }}
              className={`group w-full px-2 py-3 text-center text-[11px] font-bold transition-all duration-300 border-b border-[#D63384]/20 last:border-none ${
                activeCategory === cat ? "bg-[#D63384] text-white" : "text-[#D63384] hover:bg-pink-50"
              }`}
            >
              <span className="truncate block w-full">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}