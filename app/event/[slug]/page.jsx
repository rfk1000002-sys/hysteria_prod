export const dynamic = "force-dynamic";

import { prisma } from "../../../lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function EventDetailPage({ params }) {
  const { slug } = params;

  const event = await prisma.event.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      category: true,
    },
  });

  if (!event) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* POSTER */}
      <div className="relative w-full h-[480px] rounded-xl overflow-hidden">
        <Image
          src={event.poster || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* META */}
      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-pink-600 text-white text-sm">
          {event.category?.title}
        </span>

        <h1 className="text-3xl font-bold">{event.title}</h1>

        <p className="text-gray-600">
          {new Date(event.startAt).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* DESCRIPTION */}
      {event.description && (
        <p className="text-gray-700 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* ACTION */}
      {event.registerLink && (
        <a
          href={event.registerLink}
          target="_blank"
          className="inline-block px-6 py-3 rounded-lg bg-pink-600 text-white"
        >
          Ikuti Sekarang
        </a>
      )}
    </div>
  );
}
