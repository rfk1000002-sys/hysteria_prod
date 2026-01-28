"use client";

export default function EventTable({ events = [] }) {
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
              <td
                colSpan={6}
                className="text-center py-6 text-black"
              >
                Belum ada event
              </td>
            </tr>
          )}

          {events.map((event, index) => (
            <tr
              key={index}
              className="border-t border-black hover:bg-gray-100"
            >
              {/* POSTER */}
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

              {/* JUDUL */}
              <td className="px-4 py-3 text-black font-medium">
                {event.title}
              </td>

              {/* TANGGAL */}
              <td className="px-4 py-3 text-black">
                {event.date} <br />
                <span className="text-sm">{event.time}</span>
              </td>

              {/* LOKASI */}
              <td className="px-4 py-3 text-black">
                {event.location}
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === "Upcoming"
                      ? "bg-yellow-200 text-black"
                      : event.status === "Ongoing"
                      ? "bg-green-200 text-black"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {event.status}
                </span>
              </td>

              {/* AKSI */}
              <td className="px-4 py-3 text-center space-x-2">
                <button className="px-3 py-1 border border-black rounded text-black hover:bg-black hover:text-white">
                  Edit
                </button>
                <button className="px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
