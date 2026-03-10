import { NextResponse } from "next/server";
import { createEvent, getEvents } from "@/modules/admin/events";

export async function GET() {
  try {

    const events = await getEvents();

    return NextResponse.json(events);

  } catch (error) {

    return NextResponse.json(
      { message: "Gagal mengambil event" },
      { status: 500 }
    );
  }
}

export async function POST(req) {

  try {

    const body = await req.json();

    const event = await createEvent(body);

    return NextResponse.json(event, { status: 201 });

  } catch (error) {

    if (error.errors) {
      return NextResponse.json(
        { message: error.message, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Gagal membuat event" },
      { status: 500 }
    );
  }
}