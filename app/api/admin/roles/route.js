import { NextResponse } from 'next/server'
import { findAllRoles } from '../../../../modules/admin/users/repositories/userRole.repository.js'
import { respondError } from '../../../../lib/response.js'
import { requireAuthWithPermission } from '../../../../lib/helper/permission.helper.js'
import logger from '../../../../lib/logger.js'

/**
 * GET /api/admin/roles
 * Get all available roles
 */
export async function GET(request) {
	try {
		const user = await requireAuthWithPermission(request, 'roles.read')

		const roles = await findAllRoles()

		logger.info('Roles fetched', {
			adminId: user.id,
			count: roles.length,
		})

		return NextResponse.json({
			success: true,
			data: { roles },
		})
	} catch (error) {
		logger.error('Failed to fetch roles', { error: error.message })
		return respondError(error)
	}
}
