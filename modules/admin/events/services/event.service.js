import slugify from "slugify";
import { prisma } from "../../../../lib/prisma.js";
import * as repo from "../repositories/event.repository.js";
import { validateEvent } from "../validators/event.validator.js";

export async function getEvents() {
  return repo.findAllEvents();
}

export async function getEventById(id) {

  const event = await repo.findEventById(id);

  if (!event) {
    throw new Error("Event tidak ditemukan");
  }

  return event;
}

export async function createEvent(body) {

  const errors = validateEvent(body);

  if (Object.keys(errors).length > 0) {
    const err = new Error("Validasi gagal");
    err.errors = errors;
    throw err;
  }

  const categories = await repo.findCategories(body.categoryItemIds.map(Number));

  if (categories.length !== body.categoryItemIds.length) {
    throw new Error("Kategori tidak valid");
  }

  const hasProgramCategory = categories.some(c => c.categoryId === 1);

  let finalOrganizerIds = (body.organizerItemIds || []).map(Number);

  if (hasProgramCategory) {

    const programParent = await repo.findProgramParent();

    if (programParent) {
      finalOrganizerIds.push(programParent.id);
    }
  }

  finalOrganizerIds = [...new Set(finalOrganizerIds)];

  const baseSlug = slugify(body.title, { lower: true, strict: true });

  const slugCount = await repo.countSlug(baseSlug);

  const slug = slugCount > 0 ? `${baseSlug}-${slugCount + 1}` : baseSlug;

  return prisma.$transaction(async (tx) => {

    const event = await tx.event.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        startAt: new Date(body.startAt),
        endAt: body.endAt ? new Date(body.endAt) : null,
        location: body.location,
        registerLink: body.registerLink,
        mapsEmbedSrc: body.mapsEmbedSrc,
        poster: body.poster,
        driveLink: body.driveLink,
        youtubeLink: body.youtubeLink,
        instagramLink: body.instagramLink,
        drivebukuLink: body.drivebukuLink,
        instagramLiveLink: body.instagramLiveLink,
        tiktokLiveLink: body.tiktokLiveLink,
        youtubeLiveLink: body.youtubeLiveLink,
        isPublished: Boolean(body.isPublished),
        isFlexibleTime: Boolean(body.isFlexibleTime),

        eventCategories: {
          create: categories.map((c, i) => ({
            categoryItemId: c.id,
            isPrimary: i === 0,
            order: i
          }))
        },

        organizers: {
          create: finalOrganizerIds.map(id => ({
            categoryItemId: id
          }))
        }
      }
    });

    for (const name of body.tagNames || []) {

      const slug = slugify(name, { lower: true, strict: true });

      const tag = await tx.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug }
      });

      await tx.eventTag.create({
        data: {
          eventId: event.id,
          tagId: tag.id
        }
      });
    }

    return event;
  });
}

export async function updateEvent(eventId, body) {

  return prisma.$transaction(async (tx) => {

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
        instagramLiveLink: body.instagramLiveLink,
        tiktokLiveLink: body.tiktokLiveLink,
        youtubeLiveLink: body.youtubeLiveLink,
        isPublished: body.isPublished,
        isFlexibleTime: body.isFlexibleTime,
        startAt: new Date(body.startAt),
        endAt: body.endAt ? new Date(body.endAt) : null
      }
    });

    await tx.eventCategory.deleteMany({ where: { eventId } });

    await tx.eventCategory.createMany({
      data: body.categoryItemIds.map((id, i) => ({
        eventId,
        categoryItemId: Number(id),
        isPrimary: i === 0,
        order: i
      }))
    });

    await tx.eventOrganizer.deleteMany({ where: { eventId } });

    await tx.eventOrganizer.createMany({
      data: body.organizerItemIds.map(id => ({
        eventId,
        categoryItemId: Number(id)
      }))
    });

    await tx.eventTag.deleteMany({ where: { eventId } });

    for (const name of body.tagNames || []) {

      const slug = slugify(name, { lower: true, strict: true });

      const tag = await tx.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug }
      });

      await tx.eventTag.create({
        data: {
          eventId,
          tagId: tag.id
        }
      });
    }

    return { success: true };
  });
}

export async function removeEvent(id) {
  return repo.deleteEvent(id);
}

function flattenCategoryTree(items, parentTitle = null, result = []) {

  for (const item of items) {

    result.push({
      id: item.id,
      title: item.title,
      parentId: item.parentId,
      category: item.category,
      parentTitle
    });

    if (item.children?.length) {
      flattenCategoryTree(item.children, item.title, result);
    }

  }

  return result;
}

export async function getEventCategoriesByOrganizers(organizerIds) {

  const organizers = await prisma.categoryItem.findMany({
    where: {
      id: { in: organizerIds }
    },
    include: {
      children: {
        where: {
          isActive: true,
          isIndependent: false
        },
        include: {
          category: true,
          children: {
            where: {
              isActive: true,
              isIndependent: false
            },
            include: {
              category: true,
              children: {
                where: {
                  isActive: true,
                  isIndependent: false
                },
                include: {
                  category: true,
                  children: true
                }
              }
            }
          }
        }
      }
    }
  });

  const result = [];

  for (const organizer of organizers) {

    const flattened = flattenCategoryTree(organizer.children);

    result.push(...flattened);

  }

  return result;
}