import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(_, { params }) {
  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json(event);
}

export async function PUT(req, { params }) {
  const body = await req.json();

  const startAt = new Date(`${body.startDate}T${body.startTime}`);

  const event = await prisma.event.update({
    where: { id: Number(params.id) },
    data: {
      title: body.title,
      description: body.description,
      organizer: body.organizer,
      categoryId: Number(body.categoryId),
      startAt,
      location: body.location,
      registerLink: body.registerLink,
      mapsEmbedSrc: body.mapsEmbedSrc,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(_, { params }) {
  await prisma.event.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ success: true });
}
