"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import EventDescriptionEditor from "./EventDescriptionEditor";
import TagInput from "./TagInput";
import { extractMapSrc, getPreviewSrc } from "@/lib/maps";
import OrganizerSelect from "./OrganizerSelect";
import CategorySelect from "./CategorySelect";
import EventDuration from "./EventDuration";

function Card({ title, children }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm p-5">
      {title && (
        <h3 className="font-medium text-[var(--foreground)] mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
}

export default function EventForm({ initialData = null, isEdit = false, eventId = null }) {
  const router = useRouter();

  const [organizerItems, setOrganizerItems] = useState([]);
  const [programTree, setProgramTree] = useState([]);
  const [platformTree, setPlatformTree] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const organizerRef = useRef(null);
  const categoryRef = useRef(null);

  const getOrganizerTitle = (id) => {
    return organizerItems.find(o => o.id === id)?.title || id;
  };

  const getCategoryTitle = (id) =>
    filteredCategoryItems.find(
      (c) => Number(c.id) === Number(id)
    )?.title || id;

  const [description, setDescription] = useState(undefined);

  const [form, setForm] = useState({
    title: "",
    categoryItemIds: [],
    organizerIds: [],
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    registerLink: "",
    mapsEmbed: "",
    poster: "",
    status: "PUBLISHED",      
    driveLink: "",            
    youtubeLink: "", 
    instagramLink: "",
    drivebukuLink: "",
    youtubeLiveLink: "",
    instagramLiveLink: "",
    tiktokLiveLink: "",
    tags: [],
    isFlexibleTime : false,
  });

  // PREFILL EDIT
  useEffect(() => {
    if (!initialData) return;

    const start = new Date(initialData.startAt);
    const end = initialData.endAt ? new Date(initialData.endAt) : null;
    const isFlexible = Boolean(initialData.isFlexibleTime);
    setDescription(initialData.description || "");

    setForm((prev) => ({
      ...prev,

      title: initialData.title || "",

      categoryItemIds:
        initialData.eventCategories?.map(ec =>
          Number(ec.categoryItemId)
        ) || [],

      organizerIds:
        initialData.organizers?.map(o =>
          Number(o.categoryItemId)
        ) || [],

      startDate: start.toISOString().slice(0, 10),
      startTime: isFlexible ? "" : start.toTimeString().slice(0, 5),
      endDate: end ? end.toISOString().slice(0, 10) : "",
      endTime: isFlexible
        ? ""
        : (end ? end.toTimeString().slice(0, 5) : ""),

      location: initialData.location || "",
      registerLink: initialData.registerLink || "",
      poster: initialData.poster || "",
      status: initialData.isPublished ? "PUBLISHED" : "DRAFT",
      driveLink: initialData.driveLink || "",
      youtubeLink: initialData.youtubeLink || "",
      instagramLink: initialData.instagramLink || "",
      drivebukuLink: initialData.drivebukuLink || "",
      youtubeLiveLink: initialData.youtubeLiveLink || "",
      instagramLiveLink: initialData.instagramLiveLink || "",
      tiktokLiveLink: initialData.tiktokLiveLink || "",

      tags:
        initialData.tags?.map(t =>
          t.tag?.name
        ).filter(Boolean) || [],

      mapsEmbed: initialData.mapsEmbedSrc || "",
      isFlexibleTime: isFlexible,
    }));
  }, [initialData]);

  useEffect(() => {
    if (form.isFlexibleTime) {
      setForm(prev => ({
        ...prev,
        startTime: "",
        endTime: "",
      }));
    }
  }, [form.isFlexibleTime]);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (e) => {
      if (organizerRef.current && !organizerRef.current.contains(e.target))
        setOrganizerOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setCategoryOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      const [platformRes, programRes] = await Promise.all([
        fetch("/api/categories/platform"),
        fetch("/api/categories/program-hysteria"),
      ]);

      const platformItemsRaw = (await platformRes.json())?.data?.items || [];
      const programItemsRaw = (await programRes.json())?.data?.items || [];

      /* FILTER SUB CATEGORY */
      const filterChildren = (items) => {
        return (items || []).map((item) => ({
          ...item,
          children: filterChildren(
            (item.children || []).filter((child) => !child.isIndependent)
          ),
        }));
      };

      const platformItems = filterChildren(platformItemsRaw);
      const programItems = filterChildren(programItemsRaw);
      
      setPlatformTree(platformItems);
      setProgramTree(programItems);
      
      const sortAZ = (a, b) =>
        a.title.localeCompare(b.title, "id-ID", { sensitivity: "base" });

      const organizers = platformItems
        .map(p => ({ id: p.id, title: p.title }))
        .sort(sortAZ);
      
      const hysteriaId = programItemsRaw?.[0]?.id;

      setOrganizerItems([
        ...organizers,
        {
          id: hysteriaId,
          title: "Hysteria",
        },
      ]);
    };

    fetchData();
  }, []);

  
  // SUB CATEGORY LOGIC
  const getPlatformSubCategories = () => {
    const subs = [];

    for (const organizer of platformTree) {
      if (!form.organizerIds.includes(Number(organizer.id))) continue;

      for (const child of organizer.children || []) {
        if (child.isIndependent) continue;
        subs.push({
          id: child.id,
          title: child.title,
          source: organizer.title,
        });
      }
    }
    return subs;
  };

  const getHysteriaSubCategories = () => {
    if (!programTree.length) return [];
    if (!form.organizerIds.includes(programTree[0].id)) return [];

    const result = [];

    for (const group of programTree) {
      for (const child of group.children || []) {
        if (child.isIndependent) continue;
        result.push({
          id: child.id,
          title: child.title,
          source: "Hysteria",
        });
      }
    }
    return result;
  };
  
  const filteredCategoryItems = useMemo(() => {
    return [
      ...getPlatformSubCategories(),
      ...getHysteriaSubCategories(),
    ];
  }, [form.organizerIds, platformTree, programTree]);
  
  // CLEAN CATEGORY WHEN ORGANIZER CHANGES
  useEffect(() => {
    if (!form.organizerIds.length) return;
    if (!filteredCategoryItems.length) return;

    setForm((prev) => ({
      ...prev,
      categoryItemIds: prev.categoryItemIds.filter((id) =>
        filteredCategoryItems.some(
          (c) => Number(c.id) === Number(id)
        )
      ),
    }));
  }, [form.organizerIds, filteredCategoryItems]);

  const normalizeId = (id) => Number(id);

  const toggleOrganizer = (id) => {
    const normalized = normalizeId(id);

    setForm((prev) => ({
      ...prev,
      organizerIds: prev.organizerIds.includes(normalized)
        ? prev.organizerIds.filter((x) => x !== normalized)
        : [...prev.organizerIds, normalized],
    }));
  };

  const toggleCategory = (id) => {
    const numId = Number(id);

    setForm(prev => ({
      ...prev,
      categoryItemIds: prev.categoryItemIds.includes(numId)
        ? prev.categoryItemIds.filter(x => x !== numId)
        : [...prev.categoryItemIds, numId],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const mapSrc = getPreviewSrc(form.mapsEmbed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const missingFields = [];

    if (!form.title) missingFields.push("Judul Event");
    if (!Array.isArray(form.categoryItemIds) || form.categoryItemIds.length === 0)
      missingFields.push("Kategori");
    if (!form.startDate)
      missingFields.push("Tanggal Mulai");
    if (!form.isFlexibleTime && !form.startTime)
      missingFields.push("Waktu Mulai");
    if (!form.poster) missingFields.push("Poster Event");
    if (!form.location) missingFields.push("Lokasi");

    if (missingFields.length > 0) {
      alert("Field berikut belum diisi:\n- " + missingFields.join("\n- "));
      setLoading(false);
      return;
    }

    const payload = {
      title           : form.title,
      categoryItemIds : form.categoryItemIds,
      organizerItemIds: form.organizerIds,
      description     : description,

      startAt: form.isFlexibleTime
        ? new Date(`${form.startDate}T00:00`).toISOString()
        : new Date(`${form.startDate}T${form.startTime}`).toISOString(),

      endAt: form.isFlexibleTime
        ? null
        : form.endDate && form.endTime
          ? new Date(`${form.endDate}T${form.endTime}`).toISOString()
          : null,
      
      location        : form.location,
      registerLink    : form.registerLink,
      mapsEmbedSrc    : extractMapSrc(form.mapsEmbed),
      poster          : form.poster,
      isPublished     : form.status === "PUBLISHED", 
      driveLink       : form.driveLink,                
      youtubeLink     : form.youtubeLink,
      instagramLink   : form.instagramLink,
      drivebukuLink   : form.drivebukuLink,
      youtubeLiveLink   : form.youtubeLiveLink,
      instagramLiveLink : form.instagramLiveLink,
      tiktokLiveLink    : form.tiktokLiveLink,
      isFlexibleTime: form.isFlexibleTime,
      tagNames: Array.isArray(form.tags)
        ? form.tags.filter(Boolean)
        : [],
    };

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
      alert(err.message);
      return;
    }
    setLoading(false);
    router.push("/admin/events");
  };

  const inputClass = "w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--Color-1)] disabled:bg-[var(--muted)]";
  const errorClass = "text-[var(--destructive)] text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER */}
      <div className="right items-right justify-between">
        {/* ACTION */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-[var(--btn-normal)] hover:bg-[var(--btn-normal-hover)] active:bg-[var(--btn-normal-active)] text-white px-6 py-2 rounded-lg transition"
          >
            {loading ? "Menyimpan..." : "Simpan Event"}
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* TITLE */}
          <Card title="Judul Postingan *">
            <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
            <p className="text-xs text-[var(--muted-foreground)] mt-2">Masukkan judul yang jelas dan deskriptif</p>
          </Card>

          {/* DESCRIPTION */}
          <Card title="Deskripsi *">
            {description !== undefined && (
              <EventDescriptionEditor
                key={eventId || "new"}
                value={description}
                onChange={setDescription}
              />
            )}
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Isi deskripsi disarankan lebih dari 300 kata
            </p>
          </Card>

          {/* REGISTER LINK */}
          <Card title="Link Pendaftaran/Tiket/Formulir">
            <input
              type="url"
              name="registerLink"
              value={form.registerLink}
              onChange={handleChange}
              className={inputClass}
            />
          </Card>

          <Card title="Lokasi">
            <p className="text-xs text-[var(--muted-foreground)] mt-2">Tulis alamat pelaksanaan acara secara lengkap</p>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            />
            
            <p className="text-xs text-[var(--muted-foreground)] mt-2">Tambahkan detail lokasi mengguanakan Google Maps</p>
            <textarea
              name="mapsEmbed"
              value={form.mapsEmbed}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} mt-3`}
            />
            
            {mapSrc && (
              <div className="mt-3 rounded-lg overflow-hidden border">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="220"
                  loading="lazy"
                />
              </div>
            )}
          </Card>

          <Card title="Live Streaming">
            <div className="space-y-3">
              <p className="text-xs text-[var(--Color-1)]">
                Isi jika acara memiliki siaran langsung
              </p>

              <p className="text-xs text-[var(--muted-foreground)]">
                YouTube Live
              </p>
              <input
                type="url"
                name="youtubeLiveLink"
                value={form.youtubeLiveLink}
                onChange={handleChange}
                placeholder="https://youtube.com/live/..."
                className={inputClass}
              />

              <p className="text-xs text-[var(--muted-foreground)]">
                Instagram Live
              </p>
              <input
                type="url"
                name="instagramLiveLink"
                value={form.instagramLiveLink}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className={inputClass}
              />

              <p className="text-xs text-[var(--muted-foreground)]">
                TikTok Live
              </p>
              <input
                type="url"
                name="tiktokLiveLink"
                value={form.tiktokLiveLink}
                onChange={handleChange}
                placeholder="https://tiktok.com/..."
                className={inputClass}
              />

            </div>
          </Card>
          <Card title="Arsip Kegiatan">
            <div className="space-y-3">
              <p className="text-xs text-[var(--muted-foreground)] mt-2">Link Drive Dokumentasi</p>
              <input
                type="url"
                name="driveLink"
                value={form.driveLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />

              <p className="text-xs text-[var(--muted-foreground)] mt-2">Link Dokumentasi YouTube</p>
              <input
                type="url"
                name="youtubeLink"
                value={form.youtubeLink}
                onChange={handleChange}
                placeholder="https://www.youtube.com/..."
                className={inputClass}
              />

              <p className="text-xs text-[var(--muted-foreground)] mt-2">Link Dokumentasi Instagram</p>
              <input
                type="url"
                name="instagramLink"
                value={form.instagramLink}
                onChange={handleChange}
                placeholder="https://www.instagram.com/..."
                className={inputClass}
              />

              <p className="text-xs text-[var(--muted-foreground)] mt-2">Link Drive Buku</p>
              <input
                type="url"
                name="drivebukuLink"
                value={form.drivebukuLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />

              <p className="text-xs text-[var(--Color-1)]">
                Lakukan pengisian link sesuai dengan kebutuhan
              </p>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* ORGANIZER MULTI SELECT */}
          <Card title="Penyelenggara *">
            <OrganizerSelect
              organizerItems={organizerItems}
              organizerIds={form.organizerIds}
              toggleOrganizer={toggleOrganizer}
              organizerOpen={organizerOpen}
              setOrganizerOpen={setOrganizerOpen}
              organizerRef={organizerRef}
              inputClass={inputClass}
              getOrganizerTitle={getOrganizerTitle}
            />
          </Card>
        
          {/* CATEGORY MULTISELECT */}
          <Card title="Sub Kategori *">
            <CategorySelect
              categoryItems={filteredCategoryItems}
              categoryIds={form.categoryItemIds}
              toggleCategory={toggleCategory}
              categoryOpen={categoryOpen}
              setCategoryOpen={setCategoryOpen}
              categoryRef={categoryRef}
              inputClass={inputClass}
              getCategoryTitle={getCategoryTitle}
            />
          </Card>
          
          {/* POSTER */}
          <Card title="Foto Utama *">
            <ImageUpload
              value={form.poster}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, poster: url }))
              }
            />

            <p className="text-xs text-[var(--Color-1)] mt-2">
              Recommended: 800 × 1000px (Ratio 4:5)
              <br />
              Maksimal Size: 3 MB
            </p>
          </Card>

          <Card title="Durasi Acara *">
            <EventDuration
              form={form}
              handleChange={handleChange}
              setForm={setForm}
              inputClass={inputClass}
            />
          </Card>

          {/* TAGS */}
          <TagInput
            value={form.tags}
            onChange={(tags) =>
              setForm((prev) => ({ ...prev, tags }))
            }
          />

          {/* STATUS */}
          <Card title="Status Event">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Publish</option>
            </select>

            <p className="text-xs text-[var(--Color-1)] mt-2">
              Draft tidak akan tampil di halaman publik
            </p>
          </Card>
        </div>
      </div>
    </form>
  );
}