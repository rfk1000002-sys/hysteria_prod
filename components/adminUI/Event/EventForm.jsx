"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

export default function EventForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    organizer: "",
    description: "",
    startDate: "",
    startTime: "",
    location: "",
    registerLink: "",
    mapsShortLink: "",
    mapsEmbed: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===============================
    EVENT STATUS (AUTO)
  =============================== */
  const getEventStatus = () => {
    if (!form.startDate || !form.startTime) return "Draft";

    const eventDateTime = new Date(
      `${form.startDate}T${form.startTime}`
    );
    const now = new Date();

    if (now < eventDateTime) return "Upcoming";
    if (now.toDateString() === eventDateTime.toDateString())
      return "Ongoing";

    return "Finished";
  };

  /* ===============================
    MAPS EMBED EXTRACTOR
  =============================== */
  const extractMapSrc = (iframeHtml) => {
    if (!iframeHtml) return null;
    const match = iframeHtml.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  };

  const mapSrc = extractMapSrc(form.mapsEmbed);

  /* ===============================
    SUBMIT
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      status: getEventStatus(),
      mapsEmbedSrc: mapSrc,
    };

    console.log("DATA EVENT:", payload);
  };

  const inputClass =
    "w-full border border-gray-300 bg-white text-black " +
    "placeholder-gray-400 rounded-lg px-3 py-2 " +
    "focus:outline-none focus:ring-2 focus:ring-pink-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-6"
    >
      {/* STATUS */}
      <div className="text-sm text-black">
        Status Event:
        <span className="ml-2 font-semibold text-pink-600">
          {getEventStatus()}
        </span>
      </div>

      {/* POSTER */}
      <div>
        <label className="block font-medium mb-2 text-black">Poster Event</label>
        <ImageUpload />
      </div>

      {/* JUDUL */}
      <div>
        <label className="block font-medium mb-1 text-black">Judul Event</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* KATEGORI */}
      <div>
        <label className="block font-medium mb-1 text-black">Kategori</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* PENYELENGGARA */}
      <div>
        <label className="block font-medium mb-1 text-black">
          Diselenggarakan oleh
        </label>
        <input
          name="organizer"
          value={form.organizer}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* DESKRIPSI */}
      <div>
        <label className="block font-medium mb-1 text-black">Deskripsi</label>
        <textarea
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* JADWAL */}
      <div>
        <label className="block font-medium mb-1 text-black">Tanggal & Waktu</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* LOKASI */}
      <div>
        <label className="block font-medium mb-1 text-black">Lokasi</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* LINK DAFTAR */}
      <div>
        <label className="block font-medium mb-1 text-black">Link Pendaftaran</label>
        <input
          type="url"
          name="registerLink"
          placeholder="https://"
          value={form.registerLink}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* MAPS */}
      <div>
        <label className="block font-medium mb-1 text-black">Google Maps</label>

        <textarea
          name="mapsEmbed"
          placeholder="Paste iframe Google Maps di sini"
          value={form.mapsEmbed}
          onChange={handleChange}
          rows={3}
          className={`${inputClass} mt-2`}
        />

        {/* MAP PREVIEW */}
        {mapSrc && (
          <div className="mt-3 rounded-lg overflow-hidden border">
            <iframe
              src={mapSrc}
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 bg-pink-600 text-white rounded-lg"
        >
          Simpan Event
        </button>
      </div>
    </form>
  );
}
