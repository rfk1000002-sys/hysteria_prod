import { prisma } from '../../../../lib/prisma.js'

/**
 * Assign role to user
 * @param {number} userId
 * @param {number} roleId
 * @returns {Promise<UserRole>}
 */
export async function assignRoleToUser(userId, roleId) {
	return prisma.userRole.create({
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
}

/**
 * Remove role from user
 * @param {number} userId
 * @param {number} roleId
 * @returns {Promise<UserRole>}
 */
export async function removeRoleFromUser(userId, roleId) {
	return prisma.userRole.deleteMany({
		where: {
			userId,
			roleId,
		},
	})
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
		// Delete all existing roles
		await tx.userRole.deleteMany({
			where: { userId },
		})

		// Create new role assignments
		if (roleIds.length > 0) {
			await tx.userRole.createMany({
				data: roleIds.map((roleId) => ({
					userId,
					roleId,
				})),
			})
		}
	})
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
