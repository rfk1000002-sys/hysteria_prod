"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getEventStatus } from "../../lib/event-status";

const ITEMS_PER_PAGE = 6;

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* =========================
     SYNC STATE DARI URL
  ========================== */
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setStatus(searchParams.get("status") || "all");
    setSort(searchParams.get("sort") || "latest");
  }, [searchParams]);

  /* =========================
     UPDATE URL
  ========================== */
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    if (sort !== "latest") params.set("sort", sort);

    router.replace(`/event?${params.toString()}`);
    setPage(1);
  }, [q, status, sort, router]);

  /* =========================
     FETCH DATA
  ========================== */
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/events?q=${q}&status=${status}&sort=${sort}`
        );
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [q, status, sort]);

  /* =========================
     PROSES STATUS EVENT
     - statusLogic : UPPERCASE
     - statusFilter: lowercase
  ========================== */
  const processedEvents = useMemo(() => {
    return events.map((event) => {
      const statusLogic = getEventStatus(event.startAt, event.endAt);

      return {
        ...event,
        status: statusLogic, // untuk UI logic
        statusFilter: statusLogic.toLowerCase(), // untuk filter
      };
    });
  }, [events]);

  /* =========================
     FILTER BERDASARKAN STATUS
  ========================== */
  const filteredEvents =
    status === "all"
      ? processedEvents
      : processedEvents.filter(
          (event) => event.statusFilter === status
        );

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
          <option value="finished">Telah Berakhir</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="latest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Memuat event...</p>
      ) : !filteredEvents.length ? (
        <p className="text-gray-500">Event tidak ditemukan.</p>
      ) : (
        <>
          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
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

                <div
                  className="absolute inset-0 p-5 flex flex-col justify-end
                  bg-gradient-to-t from-black/70 via-black/40 to-transparent
                  opacity-0 group-hover:opacity-100 transition duration-300"
                >
                  <div className="flex flex-wrap gap-2 mb-2">
                    {event.categoryItem?.title && (
                      <span className="text-xs bg-pink-600 text-white px-3 py-1 rounded-full">
                        {event.categoryItem.title}
                      </span>
                    )}
                    {event.organizer && (
                      <span className="text-xs bg-white/90 text-black px-3 py-1 rounded-full">
                        {event.organizer}
                      </span>
                    )}
                  </div>

                  <h2 className="text-white font-semibold text-lg">
                    {event.title}
                  </h2>

                  <p className="text-sm text-gray-200 mt-1">
                    {new Date(event.startAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  {event.status === "UPCOMING" && event.registerLink && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(event.registerLink, "_blank");
                      }}
                      className="mt-4 px-5 py-2.5 rounded-lg
                                bg-pink-600 text-white text-sm
                                hover:bg-pink-700 transition"
                    >
                      Ikuti Sekarang
                    </button>
                  )}

                  {event.status === "ONGOING" && event.registerLink && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(event.registerLink, "_blank");
                      }}
                      className="mt-4 px-5 py-2.5 rounded-lg
                                bg-yellow-500 text-white text-sm
                                hover:bg-yellow-600 transition"
                    >
                      Sedang Berlangsung
                    </button>
                  )}

                  {event.status === "FINISHED" && (
                    <button
                      disabled
                      className="mt-4 px-5 py-2.5 rounded-lg
                                bg-gray-400 text-white text-sm cursor-not-allowed"
                    >
                      Event Telah Berakhir
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded border disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded border ${
                    page === i + 1
                      ? "bg-pink-600 text-white border-pink-600"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded border disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
