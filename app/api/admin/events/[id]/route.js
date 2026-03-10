import { NextResponse } from "next/server";
import { getEventById, updateEvent, removeEvent } from "@/modules/admin/events";

export async function GET(req, { params }) {
  try {

    const { id } = await params;

    const eventId = Number(id);

    const event = await getEventById(eventId);

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 404 }
    );
  }
}

export async function PUT(req, { params }) {

  try {

    const id = Number(params.id);

    const body = await req.json();

    const result = await updateEvent(id, body);

    return NextResponse.json(result);

  } catch (error) {

    return NextResponse.json(
      { message: "Gagal update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {

  try {

    const id = Number(params.id);

    await removeEvent(id);

    return NextResponse.json({ success: true });

  } catch (error) {

    return NextResponse.json(
      { message: "Gagal menghapus event" },
      { status: 500 }
    );
  }
}