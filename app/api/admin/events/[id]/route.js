import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import slugify from "slugify";

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
      include: {
        eventCategories: {
          include: {
            categoryItem: true,
          },
        },
        organizers: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
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

    /* ================= VALIDATE CATEGORY ================= */
    const categories = await prisma.categoryItem.findMany({
      where: { id: { in: body.categoryItemIds.map(Number) } },
      select: { categoryId: true },
    });

    const hasProgramCategory = categories.some(
      c => c.categoryId === 1
    );

    /* ================= DETERMINE ORGANIZER ================= */
    let finalOrganizerIds = (body.organizerItemIds || []).map(Number);

    if (hasProgramCategory) {

      const programParent = await prisma.categoryItem.findFirst({
        where: { categoryId: 1, parentId: null },
        select: { id: true }
      });

      if (programParent) {
        finalOrganizerIds.push(programParent.id);
      }
    }
    finalOrganizerIds = [...new Set(finalOrganizerIds)];

    await prisma.$transaction(async (tx) => {
      await tx.event.update({
        where: { id: eventId },
        data: {
          title: body.title,
          description: body.description,
          location: body.location,
          registerLink: body.registerLink,
          mapsEmbedSrc: body.mapsEmbedSrc,
          poster: body.poster,
          driveLink: body.driveLink,
          youtubeLink: body.youtubeLink,
          instagramLink: body.instagramLink,
          drivebukuLink: body.drivebukuLink,
          isPublished: body.isPublished,
          isFlexibleTime: body.isFlexibleTime,
          startAt: new Date(body.startAt),
          endAt: body.endAt ? new Date(body.endAt) : null
        }
      });

      /* ================= REPLACE CATEGORIES ================= */
      await tx.eventCategory.deleteMany({ where: { eventId } });

      await tx.eventCategory.createMany({
        data: body.categoryItemIds.map((id, i) => ({
          eventId,
          categoryItemId: Number(id),
          isPrimary: i === 0,
          order: i
        }))
      });

      /* ================= REPLACE ORGANIZERS ================= */
      await tx.eventOrganizer.deleteMany({ where: { eventId } });

      await tx.eventOrganizer.createMany({
        data: finalOrganizerIds.map(id => ({
          eventId,
          categoryItemId: id,
        })),
      });

    /* ================= REPLACE TAGS ================= */
      await tx.eventTag.deleteMany({ where: { eventId } });

      if (body.tagNames?.length) {

        const tags = await Promise.all(
          body.tagNames.map(name => {
            const slug = slugify(name, { lower: true, strict: true });

            return tx.tag.upsert({
              where: { slug },
              update: {},
              create: { name, slug }
            });
          })
        );

        await tx.eventTag.createMany({
          data: tags.map(tag => ({
            eventId,
            tagId: tag.id
          }))
        });
      }
    });

    return NextResponse.json({ success: true });

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
