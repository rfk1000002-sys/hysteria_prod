"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* UPDATE URL */
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    if (sort !== "latest") params.set("sort", sort);

    router.push(`/event?${params.toString()}`);
  }, [q, status, sort]);

  /* FETCH DATA */
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const res = await fetch(
        `/api/events?q=${q}&status=${status}&sort=${sort}`
      );
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }

    loadEvents();
  }, [q, status, sort]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Daftar Event</h1>

      {/* FILTER */}
      <div className="grid md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari event..."
          className="px-4 py-2 rounded-lg border"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="all">Semua Event</option>
          <option value="upcoming">Akan Berlangsung</option>
          <option value="ongoing">Sedang Berlangsung</option>
          <option value="past">Telah Berakhir</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="latest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="nearest">Terdekat</option>
          <option value="farthest">Terjauh</option>
        </select>
      </div>

      {/* GRID */}
      {loading ? (
        <p className="text-gray-500">Memuat event...</p>
      ) : !events.length ? (
        <p className="text-gray-500">Event tidak ditemukan.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.slug}`}
              className="group relative rounded-xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="relative h-[420px]">
                <Image
                  src={event.poster || "/placeholder-event.jpg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="absolute inset-0 p-5 flex flex-col justify-end bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <span className="text-xs bg-pink-600 text-white px-3 py-1 rounded-full w-fit">
                  {event.category?.title}
                </span>

                <h2 className="text-white font-semibold text-lg mt-2">
                  {event.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
