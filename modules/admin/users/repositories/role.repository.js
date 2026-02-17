import { prisma } from '../../../../lib/prisma.js';

export async function findAllRoles({ order = { key: 'asc' } } = {}) {
  return prisma.role.findMany({ orderBy: order });
}

export async function findRoleById(id) {
  return prisma.role.findUnique({ where: { id } });
}

export async function findRoleByKey(key) {
  return prisma.role.findUnique({ where: { key } });
}

export async function createRole(data) {
  return prisma.role.create({ data });
}

export async function updateRoleById(id, data) {
  return prisma.role.update({ where: { id }, data });
}

export async function deleteRoleById(id) {
  return prisma.role.delete({ where: { id } });
}
