"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

export default function EventForm({ initialData = null, isEdit = false, eventId = null }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Track field error
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    organizer: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    registerLink: "",
    mapsEmbed: "",
    poster: "",
  });

  // PREFILL EDIT
  useEffect(() => {
    if (!initialData) return;

    const start = new Date(initialData.startAt);
    const end = initialData.endAt ? new Date(initialData.endAt) : null;

    setForm({
      title: initialData.title || "",
      categoryId: initialData.categoryId?.toString() || "",
      organizer: initialData.organizer || "",
      description: initialData.description || "",
      startDate: start.toISOString().slice(0, 10),
      startTime: start.toTimeString().slice(0, 5),
      endDate: end ? end.toISOString().slice(0, 10) : "",
      endTime: end ? end.toTimeString().slice(0, 5) : "",
      location: initialData.location || "",
      registerLink: initialData.registerLink || "",
      mapsEmbed: initialData.mapsEmbedSrc || "",
      poster: initialData.poster || "",
    });
  }, [initialData]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const extractMapSrc = (iframeHtml) => {
    if (!iframeHtml) return null;
    const match = iframeHtml.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };
  const mapSrc = extractMapSrc(form.mapsEmbed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi
    const missingFields = [];
    if (!form.title) missingFields.push("Judul Event");
    if (!form.categoryId) missingFields.push("Kategori");
    if (!form.startDate || !form.startTime) missingFields.push("Tanggal & Waktu Mulai");
    if (!form.poster) missingFields.push("Poster Event");
    if (!form.location) missingFields.push("Lokasi");

    if (missingFields.length > 0) {
      alert("Field berikut belum diisi:\n- " + missingFields.join("\n- "));
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      categoryId: Number(form.categoryId),
      organizer: form.organizer,
      description: form.description,
      startAt: new Date(`${form.startDate}T${form.startTime}`).toISOString(),
      endAt: form.endDate && form.endTime
        ? new Date(`${form.endDate}T${form.endTime}`).toISOString()
        : null, // optional
      location: form.location,
      registerLink: form.registerLink,
      mapsEmbedSrc: extractMapSrc(form.mapsEmbed),
      poster: form.poster,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/events/${eventId}` : "/api/admin/events",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan event");
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      alert("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 bg-white text-black placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500";

  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* POSTER */}
      <div>
        <label className="block font-medium mb-2 text-black">Poster Event</label>
        <ImageUpload value={form.poster} onChange={(url) => setForm({ ...form, poster: url })} />
      </div>

      {/* TITLE */}
      <div>
        <label className="block font-medium mb-1 text-black">Judul Event</label>
        <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block font-medium mb-1 text-black">Kategori</label>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass} required>
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>
      </div>

      {/* ORGANIZER */}
      <div>
        <label className="block font-medium mb-1 text-black">Diselenggarakan oleh</label>
        <input name="organizer" value={form.organizer} onChange={handleChange} className={inputClass} />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block font-medium mb-1 text-black">Deskripsi</label>
        <textarea name="description" rows={5} value={form.description} onChange={handleChange} className={inputClass} />
      </div>

      {/* START & END */}
      <div>
        <label className="block font-medium mb-2 text-black">Tanggal & Waktu</label>
        <label className="block font-medium mb-1 text-black">Mulai</label>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass} required />
          <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className={inputClass} required />
        </div>
        <label className="block font-medium mb-1 text-black">Hingga (Opsional)</label>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputClass} />
          <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      {/* LOCATION */}
      <div>
        <label className="block font-medium mb-1 text-black">Lokasi</label>
        <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
      </div>

      {/* REGISTER LINK */}
      <div>
        <label className="block font-medium mb-1 text-black">Link Pendaftaran</label>
        <input type="url" name="registerLink" value={form.registerLink} onChange={handleChange} className={inputClass} />
      </div>

      {/* MAPS */}
      <div>
        <label className="block font-medium mb-1 text-black">Google Maps</label>
        <textarea name="mapsEmbed" value={form.mapsEmbed} onChange={handleChange} rows={3} className={inputClass} />
        {mapSrc && (
          <div className="mt-3 rounded-lg overflow-hidden border">
            <iframe src={mapSrc} width="100%" height="300" style={{ border: 0 }} loading="lazy" allowFullScreen />
          </div>
        )}
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-5 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Event"}
        </button>
      </div>
    </form>
  );
}
