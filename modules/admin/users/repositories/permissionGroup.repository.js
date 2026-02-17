import { prisma } from '../../../../lib/prisma.js';

export async function findAllPermissionGroups({ perPage = 100, cursor = null, search = '' } = {}) {
  const where = search
    ? {
        OR: [
          { key: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const groups = await prisma.permissionGroup.findMany({
    where,
    take: perPage + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
  });

  const hasMore = groups.length > perPage;
  const returned = hasMore ? groups.slice(0, perPage) : groups;
  const nextCursor = hasMore ? returned[returned.length - 1].id : null;

  return { groups: returned, nextCursor, hasMore };
}

export async function countPermissionGroups(search = '') {
  const where = search
    ? {
        OR: [
          { key: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  return prisma.permissionGroup.count({ where });
}

export async function findPermissionGroupById(id) {
  return prisma.permissionGroup.findUnique({ where: { id } });
}

export async function findPermissionGroupByKey(key) {
  return prisma.permissionGroup.findUnique({ where: { key } });
}

export async function createPermissionGroup(data) {
  return prisma.permissionGroup.create({ data });
}

export async function updatePermissionGroupById(id, data) {
  return prisma.permissionGroup.update({ where: { id }, data });
}

export async function deletePermissionGroupById(id) {
  return prisma.permissionGroup.delete({ where: { id } });
}
