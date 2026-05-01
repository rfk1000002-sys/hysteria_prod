"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgramTable() {
  const router = useRouter();
  
  // 1. STATE UNTUK MENYIMPAN DATA GABUNGAN
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // STATE: PENCARIAN & PAGINASI
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // STATE: FILTER
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 2. FETCH KEDUA DATA (PROGRAM & BERKELANA) LALU GABUNGKAN
  useEffect(() => {
    async function fetchData() {
      try {
        // Ambil data secara paralel biar cepat
        const [resPrograms, resBerkelana] = await Promise.all([
          fetch("/api/admin/programs", { cache: "no-store" }).catch(() => null),
          // 👉 PERBAIKAN 1: Ganti URL fetch ke folder yang baru
          fetch("/api/admin/programs/berkelana", { cache: "no-store" }).catch(() => null)
        ]);

        const dataPrograms = resPrograms?.ok ? await resPrograms.json() : [];
        const dataBerkelana = resBerkelana?.ok ? await resBerkelana.json() : [];

        // Normalisasi Data Program (Tambahkan penanda tipe dan URL)
        const normalizedPrograms = dataPrograms.map(p => ({
          ...p,
          _type: "program",
          _categoryName: p.eventCategories?.[0]?.categoryItem?.title || "Program",
          _editUrl: `/admin/programs/${p.id}/edit`,
          _deleteUrl: `/api/admin/programs/${p.id}`, 
        }));

        // Normalisasi Data Berkelana
        const normalizedBerkelana = dataBerkelana.map(b => ({
          ...b,
          _type: "berkelana",
          _categoryName: "Hysteria Berkelana",
          _editUrl: `/admin/programs/berkelana/${b.id}/edit`, 
          // 👉 PERBAIKAN 2: Ganti URL delete ke folder yang baru
          _deleteUrl: `/api/admin/programs/berkelana/${b.id}`,
        }));

        // Gabungkan dan urutkan berdasarkan yang paling baru dibuat
        const combinedData = [...normalizedPrograms, ...normalizedBerkelana].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        setPrograms(combinedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 3. FUNGSI HAPUS DINAMIS BERDASARKAN TIPE
  const handleDelete = async (id, _type, _deleteUrl) => {
    const confirmed = window.confirm("Yakin ingin menghapus postingan ini?");
    if (!confirmed) return;

    // Pakai unique key untuk state loading (karena ID Program dan Berkelana bisa ada yang sama, misal sama-sama ID 1)
    const uniqueKey = `${_type}-${id}`;
    
    try {
      setDeletingId(uniqueKey);
      const res = await fetch(_deleteUrl, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");

      // Hapus dari state
      setPrograms((prev) => prev.filter((p) => !(p.id === id && p._type === _type)));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // 4. LOGIKA STATUS ACARA
  const getEventStatus = (startAt, categoryName) => {
    if (categoryName && categoryName.toLowerCase().includes("berkelana")) {
      return "-";
    }
    if (!startAt) return "-";
    const startDate = new Date(startAt);
    const today = new Date();
    return startDate > today ? "Akan Berlangsung" : "Telah Berakhir";
  };

  // 5. MENGAMBIL DAFTAR KATEGORI UNIK UNTUK DROPDOWN
  const uniqueCategories = useMemo(() => {
    const categories = programs.map(p => p._categoryName);
    return [...new Set(categories)].filter(Boolean);
  }, [programs]);

  // RESET KE HALAMAN 1 JIKA MELAKUKAN PENCARIAN ATAU FILTER
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStatus]);

  // 6. LOGIKA FILTER & SEARCH
  const filteredPrograms = useMemo(() => {
    let result = programs;

    if (searchQuery) {
      result = result.filter((p) => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result = result.filter((item) => {
      const statusName = getEventStatus(item.startAt, item._categoryName);
      const matchCategory = filterCategory === "" || item._categoryName === filterCategory;
      const matchStatus = filterStatus === "" || statusName === filterStatus;
      return matchCategory && matchStatus;
    });

    return result;
  }, [programs, filterCategory, filterStatus, searchQuery]);

  // 7. PAGINASI (SLICING DATA)
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const currentDisplayPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 👉 LOGIKA SLIDING WINDOW PAGINATION (Membatasi jumlah angka halaman)
  const getPaginationGroup = () => {
    let pages = [];
    if (totalPages <= 7) {
      // Jika halaman 7 ke bawah, tampilkan semua angka (1,2,3,4,5,6,7)
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Jika di awal
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, 5, "...", totalPages];
      } 
      // Jika di akhir
      else if (currentPage >= totalPages - 3) {
        pages = [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } 
      // Jika di tengah (menampilkan angka di sekeliling halaman saat ini)
      else {
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }
    return pages;
  };

  if (loading) return <div className="text-center py-20 font-medium text-gray-500 text-lg">Memuat data dari database...</div>;
  if (error) return <div className="text-center py-20 font-medium text-[#E83C91] text-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-black font-poppins">Program & Berkelana</h1>
        <p className="text-gray-600 mt-1 font-poppins">Kelola semua konten program Hysteria</p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
          >
            <option value="">Semua Kategori</option>
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 text-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
          >
            <option value="">Semua Status</option>
            <option value="Akan Berlangsung">Akan Berlangsung</option>
            <option value="Telah Berakhir">Telah Berakhir</option>
          </select>

          {/* Tombol Tambah bisa diarahkan ke modal atau halaman pilih tipe form */}
          <Link
            href="/admin/programs/create"
            className="bg-[#413153] hover:bg-[#2d2239] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            + Tambah Program
          </Link>
          {/* Tombol Tambah Khusus Berkelana (Opsional) */}
          <Link
            href="/admin/programs/berkelana/create"
            className="bg-[#E83C91] hover:bg-[#c9307b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            + Berkelana
          </Link>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-300 text-black font-semibold bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-center w-24">Thumbnail</th>
                <th className="py-4 px-6 text-left">Title</th>
                <th className="py-4 px-6 text-center">Kategori</th>
                <th className="py-4 px-6 text-center">Date</th>
                <th className="py-4 px-6 text-center">Status Acara</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {currentDisplayPrograms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              ) : (
                currentDisplayPrograms.map((item) => {
                  const startDate = item.startAt ? new Date(item.startAt) : null;
                  const statusAcara = getEventStatus(item.startAt, item._categoryName);
                  const isBerkelana = item._type === "berkelana";
                  const uniqueKey = `${item._type}-${item.id}`;

                  return (
                    <tr key={uniqueKey} className="hover:bg-gray-50 transition-colors">
                      {/* Thumbnail */}
                      <td className="py-4 px-6 flex justify-center">
                        {item.poster ? (
                          <img src={item.poster} alt={item.title} className="w-14 h-14 object-cover rounded bg-gray-200 shadow-sm" />
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-gray-400 text-[10px] rounded text-center px-1">No Image</div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-6 max-w-[200px]">
                        <div className="font-semibold text-black mb-1 line-clamp-2" title={item.title}>
                          {item.title}
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wide ${item.isPublished ? "bg-green-600" : "bg-[#E83C91]"}`}>
                          {item.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      {/* Kategori */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${isBerkelana ? 'bg-pink-50 text-pink-700 border-pink-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {item._categoryName}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-center text-sm text-gray-600 whitespace-nowrap">
                        {isBerkelana ? "-" : (startDate ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(startDate) : "-")}
                      </td>

                      {/* Status Acara */}
                      <td className="py-4 px-6 text-center text-sm font-medium whitespace-nowrap">
                        <span className={`${statusAcara === "Akan Berlangsung" ? "text-[#E83C91] bg-pink-50 px-3 py-1 rounded-full" : "text-gray-500"}`}>
                           {statusAcara}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => router.push(item._editUrl)}
                            className="bg-[#413153] hover:bg-[#2d2239] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item._type, item._deleteUrl)}
                            disabled={deletingId === uniqueKey}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${deletingId === uniqueKey ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
                          >
                            {deletingId === uniqueKey ? "..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 👉 PAGINATION CONTROLS (SLIDING WINDOW) */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 mb-3 md:mb-0">
              Menampilkan <span className="font-semibold text-black">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-black">{Math.min(currentPage * itemsPerPage, filteredPrograms.length)}</span> dari <span className="font-semibold text-black">{filteredPrograms.length}</span> data
            </span>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-600 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center px-2 gap-1 hidden sm:flex">
                {getPaginationGroup().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === "..."}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#E83C91] text-white border border-[#E83C91]"
                        : page === "..." 
                        ? "bg-transparent text-gray-500 cursor-default"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-600 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}