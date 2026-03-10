"use client";

import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

export default function AnitalkInteractiveSection({ selectedSub, items = [] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    const matched = items.filter((episode) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          episode?.title,
          episode?.description,
          episode?.host,
          ...(episode?.guests || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesQuery;
    });

    const sorted = [...matched];

    if (sortBy === "a-z") {
      sorted.sort((a, b) => (a?.title || "").localeCompare(b?.title || "", "id"));
    } else if (sortBy === "z-a") {
      sorted.sort((a, b) => (b?.title || "").localeCompare(a?.title || "", "id"));
    } else if (sortBy === "latest" || sortBy === "oldest") {
      const hasYear = sorted.some((x) => Number.isFinite(Number(x?.year)));
      if (hasYear) {
        sorted.sort((a, b) => {
          const ay = Number(a?.year) || 0;
          const by = Number(b?.year) || 0;
          return sortBy === "latest" ? by - ay : ay - by;
        });
      } else if (sortBy === "latest") {
        sorted.reverse();
      }
    }

    return sorted;
  }, [items, normalizedQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const applySort = (value) => {
    setSortBy(value);
    setPage(1);
    setOpenFilter(false);
  };

  const onSearchChange = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-2 py-8 sm:px-4 sm:py-10 lg:px-6 lg:py-12">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 sm:gap-4">
          <div className="min-w-0 flex h-12 flex-1 items-center rounded-full border border-[#ec3f94] bg-white px-4 shadow-sm sm:h-16 sm:px-6">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-[#ec3f94]/70"
            />
            <button className="ml-4 text-[#ec3f94] transition hover:scale-110" aria-label="Search" type="button">
              <SearchIcon />
            </button>
          </div>

          <div className="relative">
            <button
              className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full border border-[#ec3f94] bg-white text-[#ec3f94] shadow-sm transition hover:scale-105 sm:h-16 sm:w-16"
              aria-label="Filter"
              type="button"
              onClick={() => setOpenFilter((prev) => !prev)}
            >
              <FilterIcon />
            </button>

            {openFilter && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                <FilterButton label="Podcast terbaru" active={sortBy === "latest"} onClick={() => applySort("latest")} />
                <FilterButton label="Podcast terlama" active={sortBy === "oldest"} onClick={() => applySort("oldest")} />
                <FilterButton label="A - Z" active={sortBy === "a-z"} onClick={() => applySort("a-z")} />
                <FilterButton label="Z - A" active={sortBy === "z-a"} onClick={() => applySort("z-a")} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full max-w-480 mx-auto px-3 pb-12 sm:px-4 md:px-8 md:pb-14 lg:px-12 lg:pb-16 xl:px-24">
        {!pagedItems.length ? (
          <p className="text-zinc-500">Tidak ada hasil sesuai pencarian/filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {pagedItems.map((episode, idx) => (
              <AnitalkEpisodeCard
                key={`${selectedSub.slug}-${safePage}-${idx}`}
                episode={episode}
                index={(safePage - 1) * PAGE_SIZE + idx}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <AnitalkPagination
            totalPages={totalPages}
            currentPage={safePage}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onPick={(p) => setPage(p)}
          />
        )}
      </section>
    </>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "w-full rounded-lg px-3 py-2 text-left text-sm transition " +
        (active ? "bg-pink-100 text-pink-700" : "text-zinc-700 hover:bg-zinc-100")
      }
    >
      {label}
    </button>
  );
}

function AnitalkEpisodeCard({ episode, index }) {
  const href = episode.youtube || episode.url || null;
  const cardClassName =
    "block w-full min-w-0 overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl";
  const content = (
    <>
      <div className="relative h-52 overflow-hidden sm:h-56">
        <img
          src={episode.imageUrl || episode.src || "/image/video.webp"}
          alt={episode.alt || episode.title || "Episode"}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#50355f]/90 text-white shadow-lg sm:h-14 sm:w-14">
          <PlayIcon />
        </span>

        <span className="absolute bottom-3 right-3 text-2xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-3xl">
          {episode.timestamp || "22.00"}
        </span>
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-[#111] sm:text-2xl">
          {episode.title || `Anitalk #${index + 1}`}
        </h3>

        <p className="mt-3 wrap-break-word text-sm leading-6 text-gray-600 sm:mt-4 sm:leading-7">
          {episode.description || "Belum ada deskripsi."}
        </p>

        <div className="mt-4 space-y-1 text-sm text-[#ec3f94] sm:mt-5">
          <div className="grid grid-cols-[110px_12px_1fr] items-start">
            <span className="font-bold">Pengisi/Host</span>
            <span className="text-gray-400">:</span>
            <span>{episode.host || "-"}</span>
          </div>
          <div className="grid grid-cols-[110px_12px_1fr] items-start">
            <span className="font-bold">Podcaster</span>
            <span className="text-gray-400">:</span>
            <span>{episode.guests?.[0] || "-"}</span>
          </div>
        </div>
      </div>
    </>
  );

  if (!href) {
    return <article className={`${cardClassName} cursor-not-allowed opacity-80`}>{content}</article>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka video ${episode.title || index + 1}`}
      className={`${cardClassName} cursor-pointer`}
    >
      {content}
    </a>
  );
}

function AnitalkPagination({ totalPages, currentPage, onPrev, onNext, onPick }) {
  const visibleCount = Math.min(totalPages, 4);

  return (
    <div className="mt-10 flex justify-center sm:mt-12">
      <div className="flex items-center gap-2 rounded-full bg-[#ec3f94] px-4 py-2 text-white shadow-md">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        >
          {"<"}
        </button>
        {Array.from({ length: visibleCount }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = pageNumber === currentPage;
          return (
            <button
              type="button"
              key={pageNumber}
              onClick={() => onPick(pageNumber)}
              className={
                isActive
                  ? "flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#ec3f94]"
                  : "text-sm opacity-90"
              }
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onNext}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16l-6 7v5l-4 2v-7L4 5z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  );
}
