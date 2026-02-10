export const dynamic = "force-dynamic";

import { prisma } from "../../../lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventStatus } from "../../../lib/event-status";

export default async function EventDetailPage({ params }) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      categoryItem: true,
    },
  });

  const otherEvents = await prisma.event.findMany({
    where: {
      isPublished: true,
      slug: { not: slug }, // jangan tampilkan event ini
    },
    include: {
      categoryItem: true,
    },
    orderBy: {
      startAt: "asc",
    },
    take: 5, // jumlah event yang ditampilkan
  });

  if (!event) return notFound();

  const status = getEventStatus(event.startAt, event.endAt);

  return (
    <div className="w-full">
      {/* HERO GRADIENT */}
      <section className="w-full h-[260px] bg-gradient-to-r from-pink-600 via-fuchsia-600 to-pink-500" />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 space-y-16">

        {/* HEADER (POSTER + INFO) */}
        <section className="grid md:grid-cols-3 gap-10 items-start">
          {/* POSTER */}
          <div className="md:col-span-1">
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-black">
              <Image
                src={event.poster || "/placeholder-event.jpg"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* INFO */}
          <div className="md:col-span-2 space-y-4 pt-10 mt-28">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-600 text-white text-sm">
              {event.categoryItem?.title}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {event.title}
            </h1>

            <p className="text-sm text-gray-600">
              Diselenggarakan oleh:{" "}
              <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs">
                {event.organizer}
              </span>
            </p>

            <p className="text-sm">
              Status Event:{" "}
              <span className="inline-block px-3 py-1 rounded-full bg-pink-600 text-white text-xs">
                {status}
              </span>
            </p>
          </div>
        </section>

        {/* DETAIL */}
        <section className="grid md:grid-cols-3 gap-10">
          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Ikuti Keseruan Kami</h3>

              {/* BUTTON DAFTAR EVENT */}
              {status === "UPCOMING" && event.registerLink && (
                <form action={event.registerLink} target="_blank">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                  >
                    Daftar Sekarang
                  </button>
                </form>
              )}

              {status === "ONGOING" && event.registerLink && (
                <button
                  className="w-full px-6 py-3 rounded-lg bg-yellow-500 text-white cursor-not-allowed"
                >
                  Sedang Berlangsung
                </button>
              )}

              {status === "FINISHED" && (
                <button
                  disabled
                  className="w-full px-6 py-3 rounded-lg bg-gray-400 text-white cursor-not-allowed"
                >
                  Event Telah Selesai
                </button>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Jadwal Pelaksanaan</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.startAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(event.startAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Lokasi</h3>
              <p className="text-sm text-gray-600 mb-1">
                Nama Tempat
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {event.location}
              </p>

              {event.mapsEmbedSrc && (
                <div className="w-full h-[280px] rounded-xl overflow-hidden border">
                  <iframe
                    src={event.mapsEmbedSrc}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </aside>

          {/* DESKRIPSI */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* BUTTONS */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href={event.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3
                          rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
              >
                Dokumentasi
              </a>

              <a
                href={event.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3
                          rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Youtube
              </a>
            </div>
          </div>
        </section>

        {/* EVENT LAINNYA */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Event Lainnya</h2>
            <Link href="/event" className="text-pink-600 hover:underline">
              Lihat semua
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {otherEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.slug}`}
                className="min-w-[260px] relative rounded-xl overflow-hidden shadow group"
              >
                <div className="relative h-[340px]">
                  <Image
                    src={event.poster || "/placeholder-event.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="absolute inset-0 p-4 flex flex-col justify-end
                  bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  <h3 className="text-white font-semibold text-sm">
                    {event.title}
                  </h3>
                </div>
              </Link>
            ))}

            <Link
              href="/event"
              className="min-w-[260px] flex items-center justify-center
                        rounded-xl border-2 border-dashed border-pink-500
                        text-pink-600 font-semibold hover:bg-pink-50"
            >
              Lihat Semua Event →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );

}
