import { prisma } from '../../../../lib/prisma.js'

/**
 * Find permissions with cursor pagination and optional search
 */
export async function findAllPermissions({ perPage = 20, cursor = null, search = '' } = {}) {
  const where = search
    ? {
        OR: [
          { key: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  const permissions = await prisma.permission.findMany({
    where,
    take: perPage + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' },
    include: { group: true },
  })

  const hasMore = permissions.length > perPage
  const returned = hasMore ? permissions.slice(0, perPage) : permissions
  const nextCursor = hasMore ? returned[returned.length - 1].id : null

  return { permissions: returned, nextCursor, hasMore }
}

export async function countPermissions(search = '') {
  const where = search
    ? {
        OR: [
          { key: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  return prisma.permission.count({ where })
}

export async function findPermissionById(id) {
  return prisma.permission.findUnique({ where: { id }, include: { group: true } })
}

export async function findPermissionByKey(key) {
  return prisma.permission.findUnique({ where: { key }, include: { group: true } })
}

export async function createPermission(data) {
  return prisma.permission.create({ data })
}

export async function updatePermissionById(id, data) {
  return prisma.permission.update({ where: { id }, data })
}

export async function deletePermissionById(id) {
  return prisma.permission.delete({ where: { id } })
}
