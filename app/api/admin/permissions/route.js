import { NextResponse } from 'next/server'
import {
  findAllPermissions,
  countPermissions,
  findPermissionById,
  createPermission,
  createPermissions,
  updatePermissionById,
  deletePermissionById,
} from '../../../../modules/admin/users/repositories/permission.repository.js'
import { respondError } from '../../../../lib/response.js'
import { requireAuthWithPermission } from '../../../../lib/helper/permission.helper.js'
import logger from '../../../../lib/logger.js'

/**
 * GET /api/admin/permissions
 * Query params: perPage, cursor, search
 */
export async function GET(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.read')

    const { searchParams } = new URL(request.url)
    const perPage = parseInt(searchParams.get('perPage') || '25')
    const cursor = searchParams.get('cursor') ? parseInt(searchParams.get('cursor')) : null
    const search = searchParams.get('search') || ''
    const groupId = searchParams.get('groupId') || null

    if (perPage < 1 || perPage > 200) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'perPage must be between 1 and 200' })
    }

    const { permissions, nextCursor, hasMore } = await findAllPermissions({ perPage, cursor, search, groupId })
    const total = await countPermissions(search, groupId)

    logger.info('Permissions fetched', { adminId: user.id, count: permissions.length })

    return NextResponse.json({ success: true, data: { permissions, pagination: { nextCursor, hasMore, total, perPage } } })
  } catch (error) {
    logger.error('Failed to fetch permissions', { error: error.message })
    return respondError(error)
  }
}

/**
 * POST /api/admin/permissions
 * Body: { key, name, description, groupId }
 */
export async function POST(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.create')
    const body = await request.json()

    if (!body) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'Request body is required' })
    }

    // Bulk create when body is an array
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'Request array is empty' })
      }

      for (const item of body) {
        if (!item || !item.key) {
          return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'Each permission must include a key' })
        }
      }

      const toCreate = body.map((item) => ({
        key: item.key,
        name: item.name || null,
        description: item.description || null,
        groupId: item.groupId || null,
      }))

      const created = await createPermissions(toCreate)

      logger.info('Permissions created', { adminId: user.id, count: created.length })

      return NextResponse.json({ success: true, data: { permissions: created } })
    }

    // Single create
    if (!body.key) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'Permission key is required' })
    }

    const created = await createPermission({
      key: body.key,
      name: body.name || null,
      description: body.description || null,
      groupId: body.groupId || null,
    })

    logger.info('Permission created', { adminId: user.id, permissionId: created.id })

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    logger.error('Failed to create permission', { error: error.message })
    return respondError(error)
  }
}

/**
 * PUT /api/admin/permissions
 * Body: { id, name?, description?, groupId? }
 */
export async function PUT(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.update')
    const body = await request.json()

    if (!body || !body.id) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'Permission id is required' })
    }

    const updated = await updatePermissionById(parseInt(body.id), {
      name: body.name ?? undefined,
      description: body.description ?? undefined,
      groupId: body.groupId ?? undefined,
    })

    logger.info('Permission updated', { adminId: user.id, permissionId: updated.id })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    logger.error('Failed to update permission', { error: error.message })
    return respondError(error)
  }
}

/**
 * DELETE /api/admin/permissions?id=123
 */
export async function DELETE(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.delete')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'Permission id is required' })
    }

    const deleted = await deletePermissionById(parseInt(id))

    logger.info('Permission deleted', { adminId: user.id, permissionId: deleted.id })

    return NextResponse.json({ success: true, data: { message: 'Permission deleted' } })
  } catch (error) {
    logger.error('Failed to delete permission', { error: error.message })
    return respondError(error)
  }
}
