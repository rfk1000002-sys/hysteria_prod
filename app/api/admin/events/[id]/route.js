import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

/* =========================
   GET EVENT BY ID
========================= */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE EVENT
========================= */
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const eventId = Number(id);
    const body = await req.json();

    if (isNaN(eventId)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    let startAt;

    if (body.startDate && body.startTime) {
      startAt = new Date(`${body.startDate}T${body.startTime}`);
    } else if (body.startAt) {
      startAt = new Date(body.startAt);
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: body.title,
        description: body.description,
        organizer: body.organizer,
        categoryId: Number(body.categoryId),
        startAt,
        location: body.location,
        registerLink: body.registerLink,
        mapsEmbedSrc: body.mapsEmbedSrc,
        poster: body.poster || null,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengupdate event" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE EVENT
========================= */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const eventId = Number(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Gagal menghapus event" },
      { status: 500 }
    );
  }
}
