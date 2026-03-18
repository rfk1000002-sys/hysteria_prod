"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import DataTable from "../../../components/ui/DataTable";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ArticlesPage({ onNavigate }) {
  const router = useRouter();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/artikel");
        const json = await res.json();

        if (json.success) {
          setCategories(json.data.items);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
        search,
        category: typeFilter,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/articles?${params}`);

      if (!res.ok) {
        throw new Error("Gagal mengambil data artikel");
      }

      const json = await res.json();

      setArticles(json.data.data);
      setMeta(json.data.meta);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, search, typeFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    await fetch(`/api/admin/articles/${id}`, {
      method: "DELETE",
    });

    fetchArticles();
  };

  const columns = [
    {
      field: "thumbnail",
      headerName: "",
      width: 90,
      render: (row) => (
        <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-100">
          {row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-zinc-400">
              No Image
            </div>
          )}
        </div>
      ),
    },

    {
      field: "title",
      headerName: "Judul",
      width: 320,
      render: (row) => (
        <p className="font-semibold text-zinc-800">{row.title}</p>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "PUBLISHED"
              ? "bg-emerald-100 text-emerald-700"
              : row.status === "DRAFT"
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },

    {
      field: "categories",
      headerName: "Kategori",
      width: 250,
      render: (row) => {
        if (!row.categories || row.categories.length === 0) {
          return "-";
        }

        return (
          <div className="flex flex-wrap gap-1">
            {row.categories.map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-md"
              >
                {cat.title}
              </span>
            ))}
          </div>
        );
      },
    },

    {
      field: "views",
      headerName: "Views",
      width: 50,
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1 text-zinc-700">
          <span>👁</span>
          <span className="font-semibold">
            {row.views?.toLocaleString("id-ID") || 0}
          </span>
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
      align: "center",
      render: (row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push(`/admin/articles/${row.id}/edit`)}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <EditIcon fontSize="small" />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 transition"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900">Artikel</h1>
          <p className="text-sm text-zinc-600 mt-1">
            Kelola semua artikel dan konten website.
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* SEARCH + FILTER */}
          <div className="flex gap-6">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-4 py-2 border rounded-xl w-[220px] 
      text-black placeholder:text-black"
            />

            {/* Jenis Artikel */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="min-w-[180px] px-4 py-2 border rounded-xl text-black"
            >
              <option value="">Jenis Artikel</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="min-w-[180px] px-4 py-2 border rounded-xl text-black"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => onNavigate("article.create")}
            className="px-6 py-3 rounded-xl bg-[#4B3D52] text-white 
    text-sm font-semibold shadow-md
    hover:shadow-lg hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm
    transition-all duration-200"
          >
            Tambah Konten
          </button>
        </div>
      </div>

      <Card>
        {error && <div className="p-4 text-sm text-red-600">{error}</div>}

        <DataTable
          columns={columns}
          rows={articles}
          loading={loading}
          getRowId={(row) => row.id}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {meta.page} of {meta.totalPages}
          </span>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}
