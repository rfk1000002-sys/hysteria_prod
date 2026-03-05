"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import EventDescriptionEditor from "./EventDescriptionEditor";
import TagInput from "./TagInput";

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      {title && (
        <h3 className="font-medium text-black mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
}

export default function EventForm({ initialData = null, isEdit = false, eventId = null }) {
  const router = useRouter();

  const [organizerItems, setOrganizerItems] = useState([]);
  const [platformTree, setPlatformTree] = useState([]);
  const [programTree, setProgramTree] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [programCategoryId, setProgramCategoryId] = useState(null);
  const [errors, setErrors] = useState({});

  const organizerRef = useRef(null);
  const categoryRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    categoryItemIds: [],
    organizerIds: [],
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    address: "",
    registerLink: "",
    mapsEmbed: "",
    poster: "",
    status: "PUBLISHED",      
    driveLink: "",            
    youtubeLink: "", 
    instagramLink: "",
    drivebukuLink: "",
    tags: [],
    isFlexibleTime : false,
  });

  const PROGRAM_CATEGORY_SLUG = "program-hysteria";
  const PROGRAM_ORGANIZER_ID = "PROGRAM-HYSTERIA";

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      const [platformRes, programRes] = await Promise.all([
        fetch("/api/categories/platform"),
        fetch("/api/categories/program-hysteria"),
      ]);

      const platformJson = await platformRes.json();
      const programJson  = await programRes.json();

      const platformItems = platformJson?.data?.items || [];
      const programItems  = programJson?.data?.items || [];

      setProgramCategoryId(programJson?.data?.category?.id);

      setPlatformTree(platformItems);
      setProgramTree(programItems);

      const sortAZ = (a, b) =>
        a.title.localeCompare(b.title, "id-ID", { sensitivity: "base" });

      const organizers = [
        ...platformItems.map(item => ({
          id: Number(item.id),
          title: item.title,
        })),
        {
          id: PROGRAM_ORGANIZER_ID,
          title: "Hysteria", 
        }
      ].sort(sortAZ);

      setOrganizerItems(organizers);
    };

    fetchData();
  }, []);

  // PREFILL EDIT
  useEffect(() => {
    if (!initialData) return;
    if (!platformTree.length && !programTree.length) return;

    const start = new Date(initialData.startAt);
    const end = initialData.endAt ? new Date(initialData.endAt) : null;
    const isFlexible = Boolean(initialData.isFlexibleTime);

    setForm((prev) => ({
      ...prev,
      title: initialData.title || "",
      organizerIds: [
        ...new Set(
          initialData.organizers?.map(o => {

            const isProgram = programTree.some(
              item => Number(item.id) === Number(o.categoryItemId)
            );

            return isProgram
              ? PROGRAM_ORGANIZER_ID
              : Number(o.categoryItemId);

          }) || []
        )
      ],
      categoryItemIds:
        initialData.eventCategories?.map(ec =>
          Number(ec.categoryItemId)
        ) || [],

      description: initialData.description || "",
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
      tags:
        initialData.tags?.map(t =>
          t.tag?.name
        ).filter(Boolean) || [],
      mapsEmbed: initialData.mapsEmbedSrc
        ? `<iframe src="${initialData.mapsEmbedSrc}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
        : "",

      isFlexibleTime: isFlexible,
    }));
  }, [initialData, platformTree, programTree, programCategoryId]);

  const filteredCategoryItems = useMemo(() => {
    const subs = [];

    for (const organizerId of form.organizerIds) {

      // PLATFORM
      const platform = platformTree.find(
        p => Number(p.id) === Number(organizerId)
      );

      if (platform) {
        for (const child of platform.children || []) {
          subs.push({
            id: child.id,
            title: child.title,
            source: platform.title
          });
        }
      }

      // PROGRAM-HYSTERIA
      if (organizerId === PROGRAM_ORGANIZER_ID) {
        for (const item of programTree) {
          // kalau punya children pakai children
          if (item.children?.length) {
            for (const child of item.children) {
              subs.push({
                id: child.id,
                title: child.title,
                source: "Hysteria"
              });
            }
          } else {
            // kalau tidak punya children → root itu sendiri jadi sub kategori
            subs.push({
              id: item.id,
              title: item.title,
              source: "Hysteria"
            });
          }
        }
      }
    }

    return subs;

  }, [form.organizerIds, platformTree, programTree]);

  // CLEAN CATEGORY WHEN ORGANIZER CHANGES
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      categoryItemIds: prev.categoryItemIds.filter(id =>
        filteredCategoryItems.some(c => Number(c.id) === Number(id))
      ),
    }));
  }, [filteredCategoryItems]);

  const toggleOrganizer = (id) => {
    setForm(prev => ({
      ...prev,
      organizerIds: prev.organizerIds.includes(id)
        ? prev.organizerIds.filter(x => x !== id)
        : [...prev.organizerIds, id],
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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const organizerItemIds = form.organizerIds.flatMap(id => {
    // kalau Hysteria
    if (id === PROGRAM_ORGANIZER_ID) {
      // ambil root pertama sebagai representasi organizer
      return programTree.length
        ? [Number(programTree[0].id)]
        : [];
    }

    return [Number(id)];
  });

  useEffect(() => {
    if (form.isFlexibleTime) {
      setForm(prev => ({
        ...prev,
        startTime: "",
        endTime: "",
      }));
    }
  }, [form.isFlexibleTime]);

  const getOrganizerTitle = (id) => {
    if (id === PROGRAM_ORGANIZER_ID) return "Hysteria";

    if (!organizerItems.length) return "";

    return organizerItems.find(item => item.id === id)?.title || "";
  };

  const getCategoryTitle = (id) => {

    const fromFiltered = filteredCategoryItems.find(
      (item) => Number(item.id) === Number(id)
    );

    if (fromFiltered) return fromFiltered.title;

    const fromInitial = initialData?.eventCategories?.find(
      (ec) => Number(ec.categoryItemId) === Number(id)
    );

    if (fromInitial) {
      return fromInitial.categoryItem?.title || "";
    }

    return "";
  };

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

  const convertGoogleMapsToEmbed = (input) => {
    if (!input) return null;

    // jika admin paste iframe
    if (input.includes("<iframe")) {
      const match = input.match(/src="([^"]+)"/);
      return match ? match[1] : null;
    }

    // shortlink maps.app.goo.gl
    if (input.includes("maps.app.goo.gl")) {
      return input;
    }

    // link google maps biasa
    if (input.includes("google.com/maps")) {
      if (input.includes("/embed")) return input;

      if (input.includes("?")) {
        return `${input}&output=embed`;
      }

      return `${input}?output=embed`;
    }

    return null;
  };

  const isIframeEmbed = (input) => {
    if (!input) return false;
    return input.includes("<iframe");
  };

  const mapSrc = isIframeEmbed(form.mapsEmbed)
    ? convertGoogleMapsToEmbed(form.mapsEmbed)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi
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

    const organizerItemIds = form.organizerIds.flatMap(id => {

      // kalau Hysteria → pakai parent PROGRAM-HYSTERIA
      if (id === PROGRAM_ORGANIZER_ID) {
        const parent = programTree.find(item => !item.parentId);
        return parent ? [Number(parent.id)] : [];
      }
      return [Number(id)];
    });

    const payload = {
      title           : form.title,
      organizerItemIds,
      categoryItemIds : form.categoryItemIds,
      description     : form.description,

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
      mapsEmbedSrc    : convertGoogleMapsToEmbed(form.mapsEmbed),
      poster          : form.poster,
      isPublished     : form.status === "PUBLISHED", 
      driveLink       : form.driveLink,                
      youtubeLink     : form.youtubeLink,
      instagramLink   : form.instagramLink,
      drivebukuLink   : form.drivebukuLink,
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

    router.push("/admin/events");
  };

  const inputClass =
    "w-full border border-gray-300 bg-white text-black placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500";

  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="font-poppins space-y-6">
      {/* HEADER */}
      <div className="right items-right justify-between">
        {/* ACTION */}
        <div className="flex justify-end">
          <button type="submit" className="px-5 py-2 rounded-2xl bg-[var(--Color-1)] text-white
               transition-all duration-300 ease-out
               hover:bg-[#5c4a65] hover:shadow-xl hover:-translate-y-1
               active:translate-y-0 active:shadow-md active:scale-95"
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
            <p className="text-xs text-gray-500 mt-2">Masukkan judul yang jelas dan deskriptif</p>
          </Card>

          {/* DESCRIPTION */}
          <Card title="Deskripsi *">
            <EventDescriptionEditor
              value={form.description}
              onChange={(html) =>
                setForm((prev) => ({ ...prev, description: html }))
              }
            />
            <p className="text-xs text-gray-500 mt-2">
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
            <p className="text-xs text-gray-500 mt-2">Tulis alamat pelaksanaan acara secara lengkap</p>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            />
            
            <p className="text-xs text-gray-500 mt-2">Tambahkan detail lokasi mengguanakan Google Maps</p>
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

          <Card title="Arsip Kegiatan">
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mt-2">Link Drive Dokumentasi</p>
              <input
                type="url"
                name="driveLink"
                value={form.driveLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />

              <p className="text-xs text-gray-500 mt-2">Link Dokumentasi YouTube</p>
              <input
                type="url"
                name="youtubeLink"
                value={form.youtubeLink}
                onChange={handleChange}
                placeholder="https://www.youtube.com/..."
                className={inputClass}
              />

              <p className="text-xs text-gray-500 mt-2">Link Dokumentasi Instagram</p>
              <input
                type="url"
                name="instagramLink"
                value={form.instagramLink}
                onChange={handleChange}
                placeholder="https://www.instagram.com/..."
                className={inputClass}
              />

              <p className="text-xs text-gray-500 mt-2">Link Drive Buku</p>
              <input
                type="url"
                name="drivebukuLink"
                value={form.drivebukuLink}
                onChange={handleChange}
                placeholder="https://drive.google.com/drive/folders/..."
                className={inputClass}
              />

              <p className="text-xs text-pink-600">
                Lakukan pengisian link sesuai dengan kebutuhan
              </p>
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* ORGANIZER MULTI SELECT */}
          <Card title="Penyelenggara *">
            <div ref={organizerRef} className="relative space-y-2">
              {/* CHIPS */}
              {form.organizerIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.organizerIds.map((id) => (
                    <span
                      key={id}
                      className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {getOrganizerTitle(id)}
                      <button
                        type="button"
                        onClick={() => toggleOrganizer(id)}
                        className="hover:text-pink-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="button"
                onClick={() => setOrganizerOpen(!organizerOpen)}
                className={`${inputClass} flex justify-between items-center`}
              >
                <span>
                  {form.organizerIds.length > 0
                    ? `${form.organizerIds.length} penyelenggara dipilih`
                    : "Pilih penyelenggara"}
                </span>
                <span className="text-gray-500">▾</span>
              </button>

              {/* DROPDOWN */}
              {organizerOpen && (
                <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-lg border bg-white shadow">
                  {organizerItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.organizerIds.includes(item.id)}
                        onChange={() => toggleOrganizer(item.id)}
                        className="accent-pink-600"
                      />
                      <span className="text-sm text-black">{item.title}</span>
                    </label>
                  ))}

                  {organizerItems.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Tidak ada penyelenggara
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        
          {/* CATEGORY MULTISELECT */}
          <Card title="Sub Kategori *">
            <div ref={categoryRef} className="relative space-y-2">
              {/* CHIPS */}
              {form.categoryItemIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.categoryItemIds.map((id) => (
                    <span
                      key={id}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {getCategoryTitle(id)}
                      <button
                        type="button"
                        onClick={() => toggleCategory(id)}
                        className="hover:text-gray-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="button"
                onClick={() => setCategoryOpen(!categoryOpen)}
                className={`${inputClass} flex justify-between items-center`}
              >
                <span>
                  {form.categoryItemIds.length > 0
                    ? `${form.categoryItemIds.length} kategori dipilih`
                    : "Pilih kategori"}
                </span>
                <span className="text-gray-500">▾</span>
              </button>

              {/* DROPDOWN */}
              {categoryOpen && (
                <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-lg border bg-white shadow">
                  {filteredCategoryItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.categoryItemIds.includes(item.id)}
                        onChange={() => toggleCategory(item.id)}
                        className="mt-1 accent-pink-600"
                      />
                      <div>
                        <p className="text-sm text-black">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.source}</p>
                      </div>
                    </label>
                  ))}

                  {filteredCategoryItems.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Tidak ada kategori
                    </p>
                  )}
                </div>
              )}
            </div>
            
          </Card>
          
          {/* POSTER */}
          <Card title="Foto Utama *">
            <ImageUpload
              value={form.poster}
              onChange={(url) => setForm({ ...form, poster: url })}
            />

            <p className="text-xs text-pink-600 mt-2">
              Recommended: 800 × 1000px (Ratio 4:5)
              <br />
              Maksimal Size: 3 MB
            </p>
          </Card>

          <Card title="Durasi Acara *">
            <div className="space-y-3">
              <Card title="Tanggal Mulai">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Card>
              
              <Card title="Tanggal Selesai">
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Card>
              
              <Card title="Waktu Acara">
                {/* TIME INPUT */}
                {!form.isFlexibleTime && (
                  <div className="flex gap-2">
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <span className="text-xs text-gray-500 self-center">Hingga</span>
                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}
      
                {/* CHECKBOX */}
                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFlexibleTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isFlexibleTime: e.target.checked,
                      }))
                    }
                    className="mt-1 accent-pink-600"
                  />
                  <div>
                    <p className="text-sm text-black font-medium">
                      Menyesuaikan
                    </p>
                    <p className="text-xs text-pink-600">
                      Centang jika waktu pelaksanaan lebih dari 1 waktu dan atau 1 hari
                    </p>
                  </div>
                </label>

                {form.isFlexibleTime && (
                  <p className="text-xs text-pink-600">
                    Waktu acara akan ditampilkan sebagai <b>“Menyesuaikan”</b>
                  </p>
                )}
              </Card>
            </div>
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

            <p className="text-xs text-pink-600 mt-2">
              Draft tidak akan tampil di halaman publik
            </p>
          </Card>
        </div>
      </div>
    </form>
  );
}

