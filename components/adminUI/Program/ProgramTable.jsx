"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgramTable() {
  const router = useRouter();
  
  // 1. STATE UNTUK MENYIMPAN DATA
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 👉 STATE UNTUK FILTER
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 2. FETCH DATA DARI API
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/admin/programs", { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  // 3. FUNGSI HAPUS ASLI
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Yakin ingin menghapus postingan ini?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");

      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // 👉 LOGIKA STATUS ACARA
  const getEventStatus = (startAt, categoryName) => {
    if (categoryName && categoryName.toLowerCase().includes("berkelana")) {
      return "-";
    }

    if (!startAt) return "-";
    const startDate = new Date(startAt);
    const today = new Date();
    return startDate > today ? "Akan Berlangsung" : "Telah Berakhir";
  };

  // 👉 MENGAMBIL DAFTAR KATEGORI UNIK UNTUK DROPDOWN
  const uniqueCategories = useMemo(() => {
    const categories = programs.map(p => p.eventCategories?.[0]?.categoryItem?.title || "Program");
    return [...new Set(categories)].filter(Boolean);
  }, [programs]);

  // 👉 MELAKUKAN FILTER DATA
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const categoryName = program.eventCategories?.[0]?.categoryItem?.title || "Program";
      const statusName = getEventStatus(program.startAt, categoryName);

      const matchCategory = filterCategory === "" || categoryName === filterCategory;
      const matchStatus = filterStatus === "" || statusName === filterStatus;

      return matchCategory && matchStatus;
    });
  }, [programs, filterCategory, filterStatus]);


  if (loading) return <div className="text-center py-20 font-medium text-gray-500 text-lg">Memuat data dari database...</div>;
  if (error) return <div className="text-center py-20 font-medium text-[#E83C91] text-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* HEADER: Judul & Subjudul */}
      <div>
        <h1 className="text-3xl font-bold text-black font-poppins">Program</h1>
        <p className="text-gray-600 mt-1 font-poppins">Kelola semua konten program Hysteria</p>
      </div>

      {/* TOOLBAR: Filter Dropdown & Tombol Tambah */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white font-medium shadow-sm cursor-pointer"
          >
            <option value="">Semua Sub Kategori</option>
            {uniqueCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white font-medium shadow-sm cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="Akan Berlangsung">Akan Berlangsung</option>
            <option value="Telah Berakhir">Telah Berakhir</option>
          </select>
        </div>

        <Link
          href="/admin/programs/create"
          className="bg-[#413153] hover:bg-[#2d2239] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Tambah Postingan
        </Link>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-300 text-black font-semibold bg-white">
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
              
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Tidak ada data program yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => {
                  const startDate = program.startAt ? new Date(program.startAt) : null;
                  const categoryName = program.eventCategories?.[0]?.categoryItem?.title || "Program";
                  const statusAcara = getEventStatus(program.startAt, categoryName);
                  
                  // 👉 PERUBAHAN: Cek apakah ini Hysteria Berkelana
                  const isBerkelana = categoryName.toLowerCase().includes("berkelana");

                  return (
                    <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                      {/* Thumbnail Kolom */}
                      <td className="py-4 px-6 flex justify-center">
                        {program.poster ? (
                          <img
                            src={program.poster}
                            alt={program.title}
                            className="w-16 h-16 object-cover rounded bg-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-400 text-xs rounded text-center px-2">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* Title Kolom */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-black mb-2 line-clamp-2">
                          {program.title}
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded text-[11px] font-bold text-white tracking-wide ${
                            program.isPublished ? "bg-[#413153]" : "bg-[#E83C91]"
                          }`}
                        >
                          {program.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      {/* Tipe Kategori Kolom */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                          {categoryName}
                        </span>
                      </td>

                      {/* 👉 Date Kolom (Diperbarui) */}
                      <td className="py-4 px-6 text-center text-sm text-gray-600">
                        {isBerkelana ? "-" : (
                          startDate ? (
                            new Intl.DateTimeFormat("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(startDate)
                          ) : (
                            "-"
                          )
                        )}
                      </td>

                      {/* Event Status Kolom */}
                      <td className="py-4 px-6 text-center text-sm font-medium">
                        <span className={`${statusAcara === "Akan Berlangsung" ? "text-pink-600" : "text-gray-500"}`}>
                           {statusAcara}
                        </span>
                      </td>

                      {/* Action Kolom */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/programs/${program.id}/edit`)}
                            className="bg-[#413153] hover:bg-[#2d2239] text-white px-4 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            disabled={deletingId === program.id}
                            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                              deletingId === program.id
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-[#E83C91] hover:bg-[#c22e75] text-white"
                            }`}
                          >
                            {deletingId === program.id ? "..." : "Hapus"}
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
      </div>
    </div>
  );
}