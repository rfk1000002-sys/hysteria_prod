"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProgramSearchBar from "./ProgramSearchBar.client";
import InstagramPostCard from "./InstagramPostCard";
import PaginationPill from "./PaginationPill";

export default function ProgramPostsSection({
  programSlug,
  posts = [],
  totalPages = 5,
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Ambil state halaman saat ini
  const page = useMemo(() => {
    const raw = Number(sp.get("page") ?? "1");
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }, [sp]);

  // Ambil state pencarian & sort dari URL
  const initialQuery = sp.get("q") ?? "";
  const initialSort = sp.get("sort") ?? "Terbaru"; 
  const [localQuery, setLocalQuery] = useState(initialQuery);

  function pushParams(next) {
    startTransition(() => {
      router.push(`?${next.toString()}`, { scroll: false }); // scroll false agar layar tidak loncat ke atas
    });
  }

  // Handle Search Input
  function handleSearch(q) {
    setLocalQuery(q);
    const next = new URLSearchParams(sp.toString());
    if (q?.trim()) next.set("q", q.trim());
    else next.delete("q");
    next.set("page", "1"); // Reset ke halaman 1 tiap cari baru
    pushParams(next);
  }

  // 👉 FUNGSI BARU: Handle Perubahan Dropdown Sort/Filter
  function handleSortChange(sortOpt) {
    const next = new URLSearchParams(sp.toString());
    if (sortOpt && sortOpt !== "Terbaru") {
      next.set("sort", sortOpt);
    } else {
      next.delete("sort"); // Hapus dari URL jika pilihannya default (Terbaru)
    }
    next.set("page", "1"); // Reset ke halaman 1 tiap ganti filter
    pushParams(next);
  }

  // Handle Paginasi
  function handlePageChange(nextPage) {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(nextPage));
    pushParams(next);
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        
        {/* Lempar initialSort dan onSortChange ke Search Bar */}
        <ProgramSearchBar
          initialQuery={localQuery}
          initialSort={initialSort}
          onSearch={handleSearch}
          onSortChange={handleSortChange} 
          isLoading={isPending}
        />

        <div className="mt-12 grid grid-cols-2 gap-7 sm:grid-cols-3 sm:gap-9 lg:grid-cols-5">
          {posts.map((post) => {
            // 👉 PERBAIKAN SLUG: Gunakan post.postSlug jika ada, jika tidak fallback ke post.id
            const detailSlug = post.postSlug || post.id;
            
            return (
              <InstagramPostCard
                key={post.id}
                href={`/program/${programSlug}/${detailSlug}`} 
                thumbnailUrl={post.thumbnailUrl}
                alt={post.alt ?? post.heading ?? "Instagram thumbnail"}
                title={post.heading}       
                previewText={post.shortText} 
              />
            );
          })}
        </div>

        <div className="mt-14">
          <PaginationPill
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
}