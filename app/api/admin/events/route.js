import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import slugify from "slugify";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      organizer,
      categoryId,
      startAt,
      endAt,
      location,
      registerLink,
      mapsEmbedSrc,
      poster,
    } = body;

    // VALIDASI WAJIB
    if (!title || !categoryId || !startAt || !location || !poster) {
      return NextResponse.json({ message: "Field wajib belum lengkap" }, { status: 400 });
    }

    // SLUG
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slugCount = await prisma.event.count({ where: { slug: { startsWith: baseSlug } } });
    const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

    // CATEGORY CHECK
    const categoryExists = await prisma.category.findUnique({ where: { id: Number(categoryId) } });
    if (!categoryExists) return NextResponse.json({ message: "Kategori tidak valid" }, { status: 400 });

    // STATUS OTOMATIS
    const now = new Date();
    let status = "DRAFT";
    const startDateObj = new Date(startAt);
    if (now < startDateObj) status = "UPCOMING";
    else if (now.toDateString() === startDateObj.toDateString()) status = "ONGOING";
    else status = "FINISHED";

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        organizer,
        categoryId: Number(categoryId),
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null, // optional
        location,
        registerLink,
        mapsEmbedSrc,
        poster,
        status,
        isPublished: true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Gagal membuat event" }, { status: 500 });
  }
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { title: true } } },
  });
  return NextResponse.json(events);
}