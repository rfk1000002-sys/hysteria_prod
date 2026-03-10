import { prisma } from "../../../../lib/prisma.js";

export function findAllEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      eventCategories: {
        include: {
          categoryItem: { select: { title: true } }
        }
      }
    }
  });
}

export function findEventById(id) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      eventCategories: {
        include: { categoryItem: true }
      },
      organizers: true,
      tags: {
        include: { tag: true }
      }
    }
  });
}

export function deleteEvent(id) {
  return prisma.event.delete({
    where: { id }
  });
}

export function findCategories(ids) {
  return prisma.categoryItem.findMany({
    where: { id: { in: ids }, isIndependent: false },
    select: { id: true, categoryId: true }
  });
}

export function findProgramParent() {
  return prisma.categoryItem.findFirst({
    where: {
      categoryId: 1,
      parentId: null
    },
    select: { id: true }
  });
}

export function countSlug(baseSlug) {
  return prisma.event.count({
    where: { slug: { startsWith: baseSlug } }
  });
}