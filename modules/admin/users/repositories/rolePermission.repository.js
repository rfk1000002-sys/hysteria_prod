import { prisma } from '../../../../lib/prisma.js'

export async function listPermissionsForRole(roleId) {
  return prisma.rolePermission.findMany({
    where: { roleId: parseInt(roleId) },
    include: { permission: true },
  }).then(rows => rows.map(r => r.permission))
}

export async function assignPermissionToRole(roleId, permissionId) {
  return prisma.rolePermission.create({ data: { roleId: parseInt(roleId), permissionId: parseInt(permissionId) } })
}

export async function removePermissionFromRole(roleId, permissionId) {
  return prisma.rolePermission.deleteMany({ where: { roleId: parseInt(roleId), permissionId: parseInt(permissionId) } })
}

export async function replacePermissionsForRole(roleId, permissionIds = []) {
  // Replace by deleting existing and inserting given ones in a transaction
  const rid = parseInt(roleId)
  return prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: rid } })
    if (!permissionIds || permissionIds.length === 0) return []
    const creates = permissionIds.map(pid => ({ roleId: rid, permissionId: parseInt(pid) }))
    return tx.rolePermission.createMany({ data: creates, skipDuplicates: true })
  })
}
