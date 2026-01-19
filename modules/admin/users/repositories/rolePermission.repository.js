import { prisma } from '../../../../lib/prisma.js'

export async function listPermissionsForRole(roleId) {
  return prisma.rolePermission.findMany({
    where: { roleId: parseInt(roleId) },
    include: { permission: true },
  }).then(rows => rows.map(r => r.permission))
}

export async function assignPermissionToRole(roleId, permissionId) {
  const rp = await prisma.rolePermission.create({ data: { roleId: parseInt(roleId), permissionId: parseInt(permissionId) } })

// Invalidate tokens and force logout for users who have this role
	try {
		await prisma.user.updateMany({
			where: { roles: { some: { roleId: parseInt(roleId) } } },
			data: { tokenVersion: { increment: 1 } },
		})
		// Force logout by revoking refresh tokens for all affected users
		const affectedUsers = await prisma.user.findMany({ where: { roles: { some: { roleId: parseInt(roleId) } } }, select: { id: true } })
		for (const user of affectedUsers) {
			await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } })
		}
	} catch (e) {
		console.warn('Failed to bump tokenVersion or revoke tokens after assignPermissionToRole', e && e.message)
  }

  return rp
}

export async function removePermissionFromRole(roleId, permissionId) {
  const res = await prisma.rolePermission.deleteMany({ where: { roleId: parseInt(roleId), permissionId: parseInt(permissionId) } })

  try {
    await prisma.user.updateMany({
      where: { roles: { some: { roleId: parseInt(roleId) } } },
      data: { tokenVersion: { increment: 1 } },
    })
		// Force logout by revoking refresh tokens for all affected users
		const affectedUsers = await prisma.user.findMany({ where: { roles: { some: { roleId: parseInt(roleId) } } }, select: { id: true } })
		for (const user of affectedUsers) {
			await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } })
		}
	} catch (e) {
		console.warn('Failed to bump tokenVersion or revoke tokens after removePermissionFromRole', e && e.message)
  	}
	
  	return res
  }

export async function replacePermissionsForRole(roleId, permissionIds = []) {
  // Replace by deleting existing and inserting given ones in a transaction
  const rid = parseInt(roleId)
  const result = await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: rid } })
    if (!permissionIds || permissionIds.length === 0) {
      // bump tokenVersion even when cleared
      await tx.user.updateMany({ where: { roles: { some: { roleId: rid } } }, data: { tokenVersion: { increment: 1 } } })
      return []
    }
    const creates = permissionIds.map(pid => ({ roleId: rid, permissionId: parseInt(pid) }))
    const created = await tx.rolePermission.createMany({ data: creates, skipDuplicates: true })
    return created
  })

  // After transaction, bump tokenVersion and revoke refresh tokens for affected users
  try {
    await prisma.user.updateMany({ where: { roles: { some: { roleId: rid } } }, data: { tokenVersion: { increment: 1 } } })
    // Force logout by revoking refresh tokens for all affected users
    const affectedUsers = await prisma.user.findMany({ where: { roles: { some: { roleId: rid } } }, select: { id: true } })
    for (const user of affectedUsers) {
      await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } })
    }
  } catch (e) {
    console.warn('Failed to bump tokenVersion or revoke tokens after replacePermissionsForRole', e && e.message)
  }

  return result
}
