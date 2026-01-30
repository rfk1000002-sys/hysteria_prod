"use client";

import { useEffect, useState } from "react";

export default function EventTable() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/admin/events");
        if (!res.ok) throw new Error("Gagal mengambil data event");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center py-6 text-red-600">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full border border-black">
        <thead className="bg-black text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm">Poster</th>
            <th className="px-4 py-3 text-left text-sm">Judul</th>
            <th className="px-4 py-3 text-left text-sm">Tanggal</th>
            <th className="px-4 py-3 text-left text-sm">Lokasi</th>
            <th className="px-4 py-3 text-left text-sm">Status</th>
            <th className="px-4 py-3 text-center text-sm">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-black">
                Belum ada event
              </td>
            </tr>
          )}

          {events.map((event) => {
            const startDate = new Date(event.startAt);
            const formattedDate = startDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            const formattedTime = startDate.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <tr key={event.id} className="border-t border-black hover:bg-gray-100">
                <td className="px-4 py-3">
                  {event.poster ? (
                    <img
                      src={event.poster}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center border border-black text-xs text-black">
                      No Image
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 text-black font-medium">{event.title}</td>

                <td className="px-4 py-3 text-black">
                  {formattedDate} <br />
                  <span className="text-sm">{formattedTime}</span>
                </td>

                <td className="px-4 py-3 text-black">{event.location}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === "UPCOMING"
                        ? "bg-yellow-200 text-black"
                        : event.status === "ONGOING"
                        ? "bg-green-200 text-black"
                        : event.status === "FINISHED"
                        ? "bg-gray-300 text-black"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center space-x-2">
                  <button className="px-3 py-1 border border-black rounded text-black hover:bg-black hover:text-white">
                    Edit
                  </button>
                  <button className="px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white">
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
