"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getEventStatus, EVENT_STATUS_LABEL } from "@/lib/event-status";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function EventTable({ events = [], onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);
  
  const [selectedOrganizers, setSelectedOrganizers] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;

    try {
      setDeletingId(id);
      await onDelete(id); 
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FILTER OPTIONS =================
  const organizerOptions = [
    ...new Map(
      events.flatMap((e) =>
        (e.organizers || [])
          .filter((o) => o?.categoryItem)
          .map((o) => {
            const isProgram = o.categoryItem.categoryId === 1;

            return [
              isProgram ? "hysteria" : o.categoryItem.id,
              {
                value: isProgram ? "hysteria" : String(o.categoryItem.id),
                label: isProgram ? "Hysteria" : o.categoryItem.title,
              },
            ];
          })
      )
    ).values(),
  ];

  const categoryOptions = [
    ...new Set(
      events.flatMap((e) =>
        e.eventCategories?.map((c) => c.categoryItem?.title)
      )
    ),
  ].filter(Boolean);

  const statusOptions = [
    { value: "UPCOMING", label: "Akan Berlangsung" },
    { value: "ONGOING", label: "Sedang Berlangsung" },
    { value: "FINISHED", label: "Selesai" },
  ];

  // ================= FILTER LOGIC =================
  const filteredEvents = events.filter((event) => {
    const status = getEventStatus(event.startAt, event.endAt);

    // ORGANIZER
    const matchOrganizer =
      selectedOrganizers.length === 0 ||
      event.organizers?.some((o) => {
        const isProgram = o.categoryItem?.categoryId === 1;

        if (selectedOrganizers.includes("hysteria")) {
          if (isProgram) return true;
        }

        return selectedOrganizers.includes(
          String(o.categoryItem.id)
        );
      });

    // CATEGORY
    const matchCategory =
      selectedCategories.length === 0 ||
      event.eventCategories?.some((c) =>
        selectedCategories.includes(c.categoryItem?.title)
      );

    // STATUS
    const matchStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(status);

    return matchOrganizer && matchCategory && matchStatus;
  });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // AUTO FIX PAGE kalau out of range
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [filteredEvents]);

  // ================= HELPER =================
  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(date);

  const formatTime = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    })
      .format(date)
      .replace(":", ".") + " WIB";

  // ================= RENDER =================
  return (
    <div>
      {/* ================= FILTER ================= */}
      <div className="flex flex-wrap gap-3 p-4">
        <MultiSelect
          label="Penyelenggara"
          options={organizerOptions}
          selectedValues={selectedOrganizers}
          setSelectedValues={setSelectedOrganizers}
        />

        <MultiSelect
          label="Sub Kategori"
          options={categoryOptions.map((c) => ({
            value: c,
            label: c,
          }))}
          selectedValues={selectedCategories}
          setSelectedValues={setSelectedCategories}
        />

        <MultiSelect
          label="Status"
          options={statusOptions}
          selectedValues={selectedStatuses}
          setSelectedValues={setSelectedStatuses}
        />
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          {/* HEADER */}
          <thead className="border-b border-gray-300 text-black font-semibold bg-white">
            <tr>
              <th className="py-4 px-6 text-center w-24">Thumbnail</th>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6 text-center">Organizer</th>
              <th className="py-4 px-6 text-center">Sub Categories</th>
              <th className="py-4 px-6 text-center">Date</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  Belum ada event.
                </td>
              </tr>
            ) : (
              paginatedEvents.map((event) => {
                const startDate = new Date(event.startAt);
                const status = getEventStatus(event.startAt, event.endAt);

                return (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* THUMBNAIL */}
                    <td className="py-4 px-6 flex justify-center">
                      {event.poster ? (
                        <Image
                          src={event.poster}
                          alt={event.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded bg-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-400 text-xs rounded">
                          No Image
                        </div>
                      )}
                    </td>

                    {/* TITLE */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-black line-clamp-2">
                        {event.title}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          event.isPublished
                            ? "bg-[#413153] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* ORGANIZER */}
                    <td className="py-4 px-6 text-center">
                      {event.organizers?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {event.organizers.map((o, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">
                              {o.categoryItem?.categoryId === 1
                                ? "Hysteria"
                                : o.categoryItem?.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* SUB CATEGORY */}
                    <td className="py-4 px-6 text-center">
                      {event.eventCategories?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {event.eventCategories.map((cat) => (
                            <span
                              key={cat.categoryItem.id}
                              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border"
                            >
                              {cat.categoryItem.title}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* DATE */}
                    <td className="py-4 px-6 text-center text-sm">
                      <div>{formatDate(startDate)}</div>
                      <div className="text-gray-500">
                        {formatTime(startDate)}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-6 text-center">
                      {EVENT_STATUS_LABEL[status]}
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(event.id) }
                          className="bg-[#413153] hover:bg-[#2d2239] text-white px-4 py-1.5 rounded text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={deletingId === event.id}
                          className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                            deletingId === event.id
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-[#E83C91] hover:bg-[#c22e75] text-white"
                          }`}
                        >
                          {deletingId === event.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 mb-8 px-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 h-[44px] sm:h-[50px] rounded-full bg-[var(--btn-normal)]">
            {/* PREV */}
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-[var(--background)] shadow disabled:opacity-40"
            >
              <ChevronLeft size={20} strokeWidth={3} color="var(--Color-6)"/>
            </button>

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-4 text-[var(--Color-1)] text-xl font-medium">
              {(() => {
                const pages = [];
                const maxVisible = 3;
                let start = Math.max(1, page - Math.floor(maxVisible / 2));
                let end = start + maxVisible - 1;

                if (end > totalPages) {
                  end = totalPages;
                  start = Math.max(1, end - maxVisible + 1);
                }

                if (start > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setPage(1)}
                      className="hover:scale-110 transition text-[var(--Color-3)]"
                    >
                      1
                    </button>
                  );
                  if (start > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="opacity-70 text-[var(--Color-3)]">
                        ...
                      </span>
                    );
                  }
                }

                for (let i = start; i <= end; i++) {
                  const isActive = i === page;

                  pages.push(
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full text-[16px] sm:text-[20px] transition-all duration-300
                      ${
                        i === page
                          ? "text-[var(--Color-3)] bg-[var(--Color-3)]/40 rounded-[6px]"
                          : "text-[var(--Color-3)]"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="opacity-70 text-[var(--Color-3)]">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setPage(totalPages)}
                      className="hover:scale-110 transition text-[var(--Color-3)]"
                    >
                      {totalPages}
                    </button>
                  );
                }
                return pages;
              })()}
            </div>

            {/* NEXT */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-[var(--Color-3)] shadow disabled:opacity-40"
            >
              <ChevronRight size={20} strokeWidth={3} color="var(--Color-6)"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selectedValues,
  setSelectedValues,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  // CLOSE KLIK LUAR
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FILTER SEARCH
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const selectAll = () => {
    setSelectedValues(options.map((o) => o.value));
  };

  const clearAll = () => {
    setSelectedValues([]);
  };

  return (
    <div ref={ref} className="relative min-w-[220px]">
      {/* LABEL + CHIP */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-black px-3 py-2 rounded bg-white cursor-pointer text-left"
      >
        {/* LABEL */}
        <div className="text-md text-black">{label}</div>

        {/* CHIP */}
        {selectedValues.length > 0 && (
          <div
            className="flex flex-wrap gap-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedValues.map((val) => {
              const item = options.find((o) => o.value === val);

              return (
                <span
                  key={val}
                  className="bg-white border border-[var(--Color-1)] text-[var(--Color-1)] px-2 py-0.5 rounded-md text-xs flex items-center gap-1"
                >
                  {item?.label}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(val);
                    }}
                    className="ml-1 text-[var(--Color-1)] hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg p-3 space-y-2">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm text-gray-700 focus:outline-none focus:ring focus:ring-[var(--Color-3)]"
          />

          {/* ACTION */}
          <div className="flex justify-between text-xs text-gray-500">
            <button onClick={selectAll}>Pilih Semua</button>
            <button onClick={clearAll}>Clear</button>
          </div>

          {/* LIST */}
          <div className="max-h-48 overflow-auto space-y-1">
            {filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer text-sm text-[var(--Color-5)]"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                />
                <span className="text-sm text-[var(--Color-5)]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}