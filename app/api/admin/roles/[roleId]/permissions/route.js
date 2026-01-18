import { NextResponse } from 'next/server'
import { requireAuthWithPermission } from '../../../../../../lib/helper/permission.helper.js'
import { respondError } from '../../../../../../lib/response.js'
import logger from '../../../../../../lib/logger.js'
import {
  listPermissionsForRole,
  assignPermissionToRole,
  removePermissionFromRole,
  replacePermissionsForRole,
} from '../../../../../../modules/admin/users/repositories/rolePermission.repository.js'

import { findPermissionById } from '../../../../../../modules/admin/users/repositories/permission.repository.js'

export async function GET(request, { params }) {
  try {
    const user = await requireAuthWithPermission(request, 'roles.permissions.read')
    const { roleId } = await params
    const perms = await listPermissionsForRole(roleId)
    logger.info('Fetched role permissions', { adminId: user.id, roleId })
    return NextResponse.json({ success: true, data: { permissions: perms } })
  } catch (error) {
    logger.error('Failed to list role permissions', { error: error.message })
    return respondError(error)
  }
}

export async function POST(request, { params }) {
  try {
    const user = await requireAuthWithPermission(request, 'roles.permissions.assign')
    const { roleId } = await params
    const body = await request.json()
    const { permissionId } = body
    if (!permissionId) return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'permissionId is required' })

    // Ensure permission exists
    const perm = await findPermissionById(parseInt(permissionId))
    if (!perm) return respondError({ status: 404, code: 'NOT_FOUND', message: 'Permission not found' })

    const assigned = await assignPermissionToRole(roleId, permissionId)
    logger.info('Assigned permission to role', { adminId: user.id, roleId, permissionId })
    return NextResponse.json({ success: true, data: assigned })
  } catch (error) {
    logger.error('Failed to assign permission', { error: error.message })
    return respondError(error)
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuthWithPermission(request, 'roles.permissions.remove')
    const { roleId } = await params
    const { searchParams } = new URL(request.url)
    const permissionId = searchParams.get('permissionId')
    if (!permissionId) return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'permissionId is required' })

    await removePermissionFromRole(roleId, permissionId)
    logger.info('Removed permission from role', { adminId: user.id, roleId, permissionId })
    return NextResponse.json({ success: true, data: { message: 'Removed' } })
  } catch (error) {
    logger.error('Failed to remove permission', { error: error.message })
    return respondError(error)
  }
}

export async function PUT(request, { params }) {
  // Bulk replace permissions for role
  try {
    const user = await requireAuthWithPermission(request, 'roles.permissions.replace')
    const { roleId } = await params
    const body = await request.json()
    const { permissionIds } = body
    if (!Array.isArray(permissionIds)) return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'permissionIds array required' })

    await replacePermissionsForRole(roleId, permissionIds)
    logger.info('Replaced permissions for role', { adminId: user.id, roleId })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to replace permissions', { error: error.message })
    return respondError(error)
  }
}
