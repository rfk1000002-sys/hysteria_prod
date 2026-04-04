import Link from "next/link";
import InstagramPostCard from "@/components/program-detail/InstagramPostCard";

export default function OtherReviewsSection({
  title = "Review Lainnya",
  items = [],
  programSlug,
  moreHref,
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#E83C91]">
      <div className="mx-auto max-w-6xl px-6 py-16 font-poppins">
        <h3 className="text-center text-[28px] sm:text-3xl font-bold text-white mb-12">{title}</h3>

        <div className="mt-8">
          {/* Tampilan Desktop */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-5">
            {items.slice(0, 5).map((it) => (
              <InstagramPostCard
                key={it.id}
                href={`/program/${programSlug}/${it.id}`}
                thumbnailUrl={it.thumbnailUrl}
                alt={it.alt ?? it.title ?? "Thumbnail"}
                title={it.heading || it.title}
                previewText={it.shortText}
              />
            ))}
          </div>

          {/* Tampilan Mobile (Scroll Samping) */}
          <div className="lg:hidden">
            <div className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-6 snap-x no-scrollbar touch-pan-y">
              {items.map((it) => (
                <div key={it.id} className="w-[220px] shrink-0 snap-center">
                  <InstagramPostCard
                    href={`/program/${programSlug}/${it.id}`}
                    thumbnailUrl={it.thumbnailUrl}
                    alt={it.alt ?? it.title ?? "Thumbnail"}
                    title={it.heading || it.title}
                    previewText={it.shortText}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tombol Lihat Lebih Banyak */}
        <div className="mt-12 flex justify-center">
          <Link
            href={moreHref || `/program/${programSlug}`}
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#E83C91] hover:bg-pink-50 transition-transform duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl"
          >
            Lihat Lebih Banyak
          </Link>
        </div>
      </div>
    </section>
  );
}