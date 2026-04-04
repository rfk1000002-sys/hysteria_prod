"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/adminUI/Event/ImageUpload";
import EventDescriptionEditor from "@/components/adminUI/Event/EventDescriptionEditor";
import TagInput from "@/components/adminUI/Event/TagInput";

function Card({ title, children }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-5">
      {title && <h3 className="font-medium text-[var(--foreground)] mb-3">{title}</h3>}
      {children}
    </div>
  );
}

// 👉 PERUBAHAN: Terima props initialData, isEdit, dan eventId
export default function BerkelanaForm({ initialData = null, isEdit = false, eventId = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoIds, setAutoIds] = useState({ organizerId: null, categoryId: null });
  const [description, setDescription] = useState("");
  const [form, setForm] = useState({
    title: "", preview: "", host: "", podcaster: "", poster: "",
    instagramLink: "", youtubeLink: "", status: "DRAFT", tags: [],
  });

  // 👉 PERUBAHAN: PREFILL DATA JIKA MODE EDIT
  useEffect(() => {
    if (isEdit && initialData) {
      // Trik Memecah Deskripsi Kembali ke Input Box (Preview, Host, Podcaster)
      let parsedDesc = initialData.description || "";
      let pPreview = "", pHost = "", pPodcaster = "";

      if (parsedDesc.includes("---")) {
        const parts = parsedDesc.split("---");
        parsedDesc = parts[0].trim(); // Ambil deskripsi utama
        const meta = parts[1]; // Ambil data sisipan

        const prevMatch = meta.match(/\*\*Preview:\*\*\s*(.*)/);
        const hostMatch = meta.match(/\*\*Host:\*\*\s*(.*)/);
        const podMatch = meta.match(/\*\*Podcaster:\*\*\s*(.*)/);

        if (prevMatch && prevMatch[1] !== "-") pPreview = prevMatch[1];
        if (hostMatch && hostMatch[1] !== "-") pHost = hostMatch[1];
        if (podMatch && podMatch[1] !== "-") pPodcaster = podMatch[1];
      }

      setDescription(parsedDesc);
      setForm({
        title: initialData.title || "",
        preview: pPreview,
        host: pHost,
        podcaster: pPodcaster,
        poster: initialData.poster || "",
        instagramLink: initialData.instagramLink || "",
        youtubeLink: initialData.youtubeLink || "",
        status: initialData.isPublished ? "PUBLISHED" : "DRAFT",
        tags: initialData.tags?.map(t => t.tag?.name).filter(Boolean) || [],
      });
    }
  }, [initialData, isEdit]);

  // FETCH ID Hysteria (Hanya jika mode Create / POST)
  useEffect(() => {
    if (isEdit) return; // Kalau edit gak usah fetch ID lagi
    const fetchCategoryIds = async () => {
      try {
        const res = await fetch("/api/categories/program-hysteria");
        const json = await res.json();
        const items = json?.data?.items || [];
        if (items.length > 0) {
          const orgId = items[0].id;
          let catId = null;
          items.forEach(group => {
            group.children?.forEach(child => {
              if (child.slug === 'hysteria-berkelana' || child.title.toLowerCase().includes('berkelana')) catId = child.id;
            });
          });
          setAutoIds({ organizerId: Number(orgId), categoryId: Number(catId) });
        }
      } catch (error) { console.error(error); }
    };
    fetchCategoryIds();
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || (!description && description !== undefined) || !form.poster) {
      return alert("Judul, Deskripsi Utama, dan Foto Utama wajib diisi!");
    }
    setLoading(true);

    // GABUNGKAN LAGI DATA SAAT MAU DISIMPAN
    const combinedDesc = `
${description}

---
**Preview:** ${form.preview || "-"}
**Host:** ${form.host || "-"}
**Podcaster:** ${form.podcaster || "-"}
    `.trim();

    const payload = {
      title: form.title,
      description: combinedDesc,
      poster: form.poster,
      instagramLink: form.instagramLink,
      youtubeLink: form.youtubeLink,
      isPublished: form.status === "PUBLISHED",
      tagNames: Array.isArray(form.tags) ? form.tags.filter(Boolean) : [],
    };

    // Data wajib untuk mode CREATE (POST) saja
    if (!isEdit) {
      payload.categoryItemIds = autoIds.categoryId ? [autoIds.categoryId] : [];
      payload.organizerItemIds = autoIds.organizerId ? [autoIds.organizerId] : [];
      payload.startAt = new Date().toISOString();
      payload.isFlexibleTime = true;
      payload.location = "Menyesuaikan";
    }

    try {
      // 👉 PERUBAHAN: API Nembak sesuai mode (PUT / POST)
      const targetUrl = isEdit ? `/api/admin/events/${eventId}` : "/api/admin/events";
      const targetMethod = isEdit ? "PUT" : "POST";

      const res = await fetch(targetUrl, {
        method: targetMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      alert(`🎉 Postingan Hysteria Berkelana berhasil ${isEdit ? 'diperbarui' : 'dibuat'}!`);
      router.push("/admin/programs");
      router.refresh();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--Color-1)] disabled:bg-[var(--muted)] disabled:text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black font-poppins">
            {isEdit ? "Edit Hysteria Berkelana" : "Tambah Hysteria Berkelana"}
          </h1>
          <p className="text-sm text-gray-500 font-poppins">
            {isEdit ? "Perbarui konten yang sudah ada" : "Create new content for publication"}
          </p>
        </div>
        <button type="submit" disabled={loading} className="bg-[var(--btn-normal)] hover:bg-[var(--btn-normal-hover)] text-white px-6 py-2.5 rounded-lg transition font-semibold">
          {loading ? "Menyimpan..." : "Simpan Postingan"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Judul Postingan *">
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
          </Card>
          <Card title="Deskripsi *">
            {/* Editor harus render kalau undefined bukan undefined biar gak kedip */}
            {description !== undefined && (
                <EventDescriptionEditor value={description} onChange={setDescription} />
            )}
          </Card>
          <Card title="Preview Deskripsi *">
            <input name="preview" value={form.preview} onChange={handleChange} className={inputClass} required />
          </Card>
          <Card title="Tags / Keywords">
            <TagInput value={form.tags} onChange={(tags) => setForm((prev) => ({ ...prev, tags }))} />
          </Card>
          <Card title="Arsip Kegiatan">
            <div className="space-y-4">
              <div><p className="text-xs mb-1">Link Dokumentasi Instagram</p><input type="url" name="instagramLink" value={form.instagramLink} onChange={handleChange} className={inputClass} /></div>
              <div><p className="text-xs mb-1">Link Dokumentasi Youtube</p><input type="url" name="youtubeLink" value={form.youtubeLink} onChange={handleChange} className={inputClass} /></div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div><label className="block text-sm mb-2">Penyelenggara</label><input type="text" value="Hysteria" disabled className={inputClass} /></div>
              <div><label className="block text-sm mb-2">Sub Kategori</label><input type="text" value="Hysteria Berkelana" disabled className={inputClass} /></div>
            </div>
          </Card>
          <Card title="Thumbnail Foto Utama *">
            <ImageUpload value={form.poster} onChange={(url) => setForm((prev) => ({ ...prev, poster: url }))} />
          </Card>
          <Card>
            <div className="space-y-4">
              <div><label className="block text-sm mb-2">Pengisi / Host</label><input name="host" value={form.host} onChange={handleChange} className={inputClass} /></div>
              <div><label className="block text-sm mb-2">Podcaster</label><input name="podcaster" value={form.podcaster} onChange={handleChange} className={inputClass} /></div>
            </div>
          </Card>
          <Card title="Status Event">
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </Card>
        </div>
      </div>
    </form>
  );
}