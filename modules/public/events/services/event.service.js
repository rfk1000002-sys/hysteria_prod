import * as repository from "../repositories/event.repository";
import { mapEventStatus } from "../mappers/event.mapper";

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