import { NextResponse } from 'next/server'
import {
	getUserRoles,
	assignRoleToUser,
	removeRoleFromUser,
	replaceUserRoles,
	findAllRoles,
} from '../../../../../../modules/admin/users/repositories/userRole.repository.js'
import { findUserById } from '../../../../../../modules/admin/users/repositories/user.repository.js'
import { respondError } from '../../../../../../lib/response.js'
import { requireAuthWithPermission } from '../../../../../../lib/helper/permission.helper.js'
import logger from '../../../../../../lib/logger.js'

/**
 * GET /api/admin/users/[id]/roles
 * Get all roles assigned to a user
 */
export async function GET(request, { params }) {
	try {
		const user = await requireAuthWithPermission(request, 'users.roles.read')

		const resolvedParams = await params
		const userId = parseInt(resolvedParams.id)

		if (!userId || isNaN(userId)) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'Invalid user ID',
			})
		}

		// Check if user exists
		const targetUser = await findUserById(userId)
		if (!targetUser) {
			return respondError({
				status: 404,
				code: 'USER_NOT_FOUND',
				message: 'User not found',
			})
		}

		const userRoles = await getUserRoles(userId)

		logger.info('User roles fetched', {
			adminId: user.id,
			targetUserId: userId,
			rolesCount: userRoles.length,
		})

		return NextResponse.json({
			success: true,
			data: {
				roles: userRoles,
			},
		})
	} catch (error) {
		logger.error('Failed to fetch user roles', { error: error.message })
		return respondError(error)
	}
}

/**
 * POST /api/admin/users/[id]/roles
 * Assign a role to a user
 * Body: { roleId }
 */
export async function POST(request, { params }) {
	try {
		const user = await requireAuthWithPermission(request, 'users.roles.assign')

		const resolvedParams = await params
		const userId = parseInt(resolvedParams.id)
		const body = await request.json()

		if (!userId || isNaN(userId)) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'Invalid user ID',
			})
		}

		if (!body.roleId) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'Role ID is required',
			})
		}

		const roleId = parseInt(body.roleId)

		// Check if user exists
		const targetUser = await findUserById(userId)
		if (!targetUser) {
			return respondError({
				status: 404,
				code: 'USER_NOT_FOUND',
				message: 'User not found',
			})
		}

		// Assign role
		const assigned = await assignRoleToUser(userId, roleId)

		logger.info('Role assigned to user', {
			adminId: user.id,
			targetUserId: userId,
			roleId,
		})

		return NextResponse.json({
			success: true,
			data: assigned,
		})
	} catch (error) {
		logger.error('Failed to assign role to user', { error: error.message })

		// Handle duplicate role assignment
		if (error.code === 'P2002') {
			return respondError({
				status: 409,
				code: 'ROLE_ALREADY_ASSIGNED',
				message: 'Role already assigned to this user',
			})
		}

		return respondError(error)
	}
}

/**
 * DELETE /api/admin/users/[id]/roles?roleId=X
 * Remove a role from a user
 */
export async function DELETE(request, { params }) {
	try {
		const user = await requireAuthWithPermission(request, 'users.roles.remove')

		const resolvedParams = await params
		const userId = parseInt(resolvedParams.id)
		const { searchParams } = new URL(request.url)
		const roleId = searchParams.get('roleId')

		if (!userId || isNaN(userId)) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'Invalid user ID',
			})
		}

		if (!roleId) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'Role ID is required',
			})
		}

		const roleIdInt = parseInt(roleId)

		// Check if user exists
		const targetUser = await findUserById(userId)
		if (!targetUser) {
			return respondError({
				status: 404,
				code: 'USER_NOT_FOUND',
				message: 'User not found',
			})
		}

		// Remove role
		await removeRoleFromUser(userId, roleIdInt)

		logger.info('Role removed from user', {
			adminId: user.id,
			targetUserId: userId,
			roleId: roleIdInt,
		})

		return NextResponse.json({
			success: true,
			data: { message: 'Role removed successfully' },
		})
	} catch (error) {
		logger.error('Failed to remove role from user', { error: error.message })
		return respondError(error)
	}
}

/**
 * PUT /api/admin/users/[id]/roles
 * Replace all roles for a user (bulk operation)
 * Body: { roleIds: [1, 2, 3] }
 */
export async function PUT(request, { params }) {
	try {
		const user = await requireAuthWithPermission(request, 'users.roles.replace')

		const resolvedParams = await params
		const userId = parseInt(resolvedParams.id)
		const body = await request.json()

		if (!userId || isNaN(userId)) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'Invalid user ID',
			})
		}

		if (!Array.isArray(body.roleIds)) {
			return respondError({
				status: 400,
				code: 'VALIDATION_ERROR',
				message: 'roleIds must be an array',
			})
		}

		// Check if user exists
		const targetUser = await findUserById(userId)
		if (!targetUser) {
			return respondError({
				status: 404,
				code: 'USER_NOT_FOUND',
				message: 'User not found',
			})
		}

		// Replace roles
		await replaceUserRoles(userId, body.roleIds)

		// Fetch updated roles
		const updatedRoles = await getUserRoles(userId)

		logger.info('User roles replaced', {
			adminId: user.id,
			targetUserId: userId,
			newRolesCount: updatedRoles.length,
		})

		return NextResponse.json({
			success: true,
			data: {
				roles: updatedRoles,
			},
		})
	} catch (error) {
		logger.error('Failed to replace user roles', { error: error.message })
		return respondError(error)
	}
}
