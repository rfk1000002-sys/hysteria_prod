import * as repository from "../repositories/event.repository";
import { mapEventStatus } from "../mappers/event.mapper";
import { prisma } from "@/lib/prisma";

export async function getAllEvents() {
  return repo.findAllEvents();
}

export async function getEvents({ q, status, sort }) {
  const events = await repository.findEvents({
    q,
    statusFilter: status,
    sort,
  });

  return events.map(mapEventStatus);
}

export async function getEventDetail(slug) {
  const event = await repository.findEventBySlug(slug);

  if (!event) {
    throw new Error("Event not found");
  }

  return mapEventStatus(event);
}

export async function getOtherEvents(slug) {
  const events = await repository.findOtherEvents(slug);

  return events.map(mapEventStatus);
}

export async function getLatestEvents(take = 10) {
  const events = await repository.findLatestEvents(take);

  return events.map(mapEventStatus).map((e) => {
    // Determine primary category for badge
    const primaryCat =
      e.eventCategories.find((ec) => ec.isPrimary) || e.eventCategories[0];

    // Status mapping in Indonesian
    const statusLabels = {
      UPCOMING: "Akan Datang",
      ONGOING: "Sedang Berlangsung",
      FINISHED: "Telah Berakhir",
    };

    return {
      ...e,
      categoryTitle: primaryCat?.categoryItem?.title || "Event",
      statusLabel: statusLabels[e.status] || "Event",
    };
  });
}

// helper parsing
function parsePageProgram(config) {
  const slugHeros = config?.slugHeros ?? {};

  return {
    detailHero: {
      image:
        typeof slugHeros?.detail?.image === "string"
          ? slugHeros.detail.image
          : null,
      isBlur:
        typeof slugHeros?.detail?.isBlur === "boolean"
          ? slugHeros.detail.isBlur
          : false,
    },
  };
}

export async function getProgramPageConfig() {
  const config = await prisma.pageProgram.findUnique({
    where: { pageSlug: "program" },
  });

  if (!config) {
    return {
      detailHero: {
        image: null,
        isBlur: false,
      },
    };
  }
  return parsePageProgram(config);
}

export async function trackEventView(slug) {
  try {
    const result = await repository.incrementEventViews(slug);
    console.log(`[EVENT VIEW] Updated DB for ${slug}: new views = ${result.views}`);
    return result;
  } catch (error) {
    console.error(`[EVENT VIEW] Error incrementing views for event: ${slug}`, error);
    throw error;
  }
}