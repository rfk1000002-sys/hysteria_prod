import { prisma } from '../../../../lib/prisma.js'

/**
 * Assign role to user
 * @param {number} userId
 * @param {number} roleId
 * @returns {Promise<UserRole>}
 */
export async function assignRoleToUser(userId, roleId) {
	const ur = await prisma.userRole.create({
		data: {
			userId,
			roleId,
		},
		include: {
			role: true,
			user: {
				select: {
					id: true,
					email: true,
					name: true,
				},
			},
		},
	})

	// bump tokenVersion and revoke refresh tokens to force logout
	try {
	  await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })
	  // Force logout by revoking all refresh tokens
	  await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
	} catch (e) {
	  console.warn('Failed to bump tokenVersion or revoke tokens after assignRoleToUser', e && e.message)
	}

	return ur
}

/**
 * Remove role from user
 * @param {number} userId
 * @param {number} roleId
 * @returns {Promise<UserRole>}
 */
export async function removeRoleFromUser(userId, roleId) {
		const res = await prisma.userRole.deleteMany({ where: { userId, roleId } })
		try {
			await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })
			// Force logout by revoking all refresh tokens
			await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
		} catch (e) {
			console.warn('Failed to bump tokenVersion or revoke tokens after removeRoleFromUser', e && e.message)
		}
		return res
}

/**
 * Get all roles for a user
 * @param {number} userId
 * @returns {Promise<UserRole[]>}
 */
export async function getUserRoles(userId) {
	return prisma.userRole.findMany({
		where: { userId },
		include: {
			role: true,
		},
	})
}

/**
 * Replace all roles for a user (bulk operation)
 * @param {number} userId
 * @param {number[]} roleIds
 * @returns {Promise<void>}
 */
export async function replaceUserRoles(userId, roleIds) {
	await prisma.$transaction(async (tx) => {
		await tx.userRole.deleteMany({ where: { userId } })
		if (roleIds.length > 0) {
			await tx.userRole.createMany({ data: roleIds.map((roleId) => ({ userId, roleId })) })
		}
	})

	// bump tokenVersion and revoke refresh tokens to force logout
	try {
	  await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })
	  // Force logout by revoking all refresh tokens
	  await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
	} catch (e) {
	  console.warn('Failed to bump tokenVersion or revoke tokens after replaceUserRoles', e && e.message)
	}
}

/**
 * Get all available roles
 * @returns {Promise<Role[]>}
 */
export async function findAllRoles() {
	return prisma.role.findMany({
		orderBy: { key: 'asc' },
	})
}
