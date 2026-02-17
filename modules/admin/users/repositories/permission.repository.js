import { prisma } from '../../../../lib/prisma.js';

/**
 * Find permissions with cursor pagination and optional search
 */
export async function findAllPermissions({
  perPage = 20,
  cursor = null,
  search = '',
  groupId = null,
} = {}) {
  const where = search
    ? {
        OR: [
          { key: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  if (groupId) {
    where.groupId = parseInt(groupId);
  }

  const permissions = await prisma.permission.findMany({
    where,
    take: perPage + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
    include: { group: true },
  });

  const hasMore = permissions.length > perPage;
  const returned = hasMore ? permissions.slice(0, perPage) : permissions;
  const nextCursor = hasMore ? returned[returned.length - 1].id : null;

  return { permissions: returned, nextCursor, hasMore };
}

export async function countPermissions(search = '', groupId = null) {
  const where = search
    ? {
        OR: [
          { key: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  if (groupId) {
    where.groupId = parseInt(groupId);
  }

  return prisma.permission.count({ where });
}

export async function findPermissionById(id) {
  return prisma.permission.findUnique({ where: { id }, include: { group: true } });
}

export async function findPermissionByKey(key) {
  return prisma.permission.findUnique({ where: { key }, include: { group: true } });
}

export async function createPermission(data) {
  return prisma.permission.create({ data });
}

export async function createPermissions(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return [];
  }

  // collect keys from payload
  const keys = dataArray.map((d) => d.key);

  // find existing permissions with same keys to avoid unique constraint errors
  const existing = await prisma.permission.findMany({
    where: { key: { in: keys } },
    select: { key: true },
  });
  const existingKeys = new Set(existing.map((e) => e.key));

  // filter out items that already exist
  const toInsert = dataArray.filter((d) => !existingKeys.has(d.key));

  if (toInsert.length === 0) {
    return [];
  }

  // Use createMany for bulk insert; skipDuplicates as a safety
  await prisma.permission.createMany({
    data: toInsert.map((d) => ({
      key: d.key,
      name: d.name ?? null,
      description: d.description ?? null,
      groupId: d.groupId ?? null,
    })),
    skipDuplicates: true,
  });

  // Return the created records
  const insertedKeys = toInsert.map((d) => d.key);
  return prisma.permission.findMany({
    where: { key: { in: insertedKeys } },
    include: { group: true },
  });
}

export async function updatePermissionById(id, data) {
  return prisma.permission.update({ where: { id }, data });
}

export async function deletePermissionById(id) {
  // find roles that reference this permission so we can invalidate tokens for affected users
  const roleLinks = await prisma.rolePermission.findMany({
    where: { permissionId: id },
    select: { roleId: true },
  });
  const roleIds = roleLinks.map((r) => r.roleId);

  const deleted = await prisma.permission.delete({ where: { id } });

  if (roleIds.length > 0) {
    try {
      await prisma.user.updateMany({
        where: { roles: { some: { roleId: { in: roleIds } } } },
        data: { tokenVersion: { increment: 1 } },
      });
    } catch (e) {
      console.warn('Failed to bump tokenVersion after deletePermissionById', e && e.message);
    }
  }

  return deleted;
}
