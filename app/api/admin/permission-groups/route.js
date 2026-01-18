import { NextResponse } from 'next/server'
import {
  findAllPermissionGroups,
  countPermissionGroups,
  findPermissionGroupById,
  createPermissionGroup,
  updatePermissionGroupById,
  deletePermissionGroupById,
} from '../../../../modules/admin/users/repositories/permissionGroup.repository.js'
import { respondError } from '../../../../lib/response.js'
import { requireAuthWithPermission } from '../../../../lib/helper/permission.helper.js'
import logger from '../../../../lib/logger.js'

/**
 * GET /api/admin/permission-groups
 * Query params: perPage, cursor, search
 */
export async function GET(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.read')

    const { searchParams } = new URL(request.url)
    const perPage = parseInt(searchParams.get('perPage') || '100')
    const cursor = searchParams.get('cursor') ? parseInt(searchParams.get('cursor')) : null
    const search = searchParams.get('search') || ''

    if (perPage < 1 || perPage > 1000) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'perPage must be between 1 and 1000' })
    }

    const { groups, nextCursor, hasMore } = await findAllPermissionGroups({ perPage, cursor, search })
    const total = await countPermissionGroups(search)

    logger.info('Permission groups fetched', { adminId: user.id, count: groups.length })

    return NextResponse.json({ success: true, data: { groups, pagination: { nextCursor, hasMore, total, perPage } } })
  } catch (error) {
    logger.error('Failed to fetch permission groups', { error: error.message })
    return respondError(error)
  }
}

/**
 * POST /api/admin/permission-groups
 * Body: { key, name?, description? }
 */
export async function POST(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.create')
    const body = await request.json()

    if (!body || !body.key) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'PermissionGroup key is required' })
    }

    const created = await createPermissionGroup({
      key: body.key,
      name: body.name || null,
      description: body.description || null,
    })

    logger.info('Permission group created', { adminId: user.id, groupId: created.id })

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    logger.error('Failed to create permission group', { error: error.message })
    return respondError(error)
  }
}

/**
 * PUT /api/admin/permission-groups
 * Body: { id, key?, name?, description? }
 */
export async function PUT(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.update')
    const body = await request.json()

    if (!body || !body.id) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'PermissionGroup id is required' })
    }

    const updated = await updatePermissionGroupById(parseInt(body.id), {
      key: body.key ?? undefined,
      name: body.name ?? undefined,
      description: body.description ?? undefined,
    })

    logger.info('Permission group updated', { adminId: user.id, groupId: updated.id })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    logger.error('Failed to update permission group', { error: error.message })
    return respondError(error)
  }
}

/**
 * DELETE /api/admin/permission-groups?id=123
 */
export async function DELETE(request) {
  try {
    const user = await requireAuthWithPermission(request, 'permissions.delete')

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return respondError({ status: 400, code: 'VALIDATION_ERROR', message: 'PermissionGroup id is required' })
    }

    const deleted = await deletePermissionGroupById(parseInt(id))

    logger.info('Permission group deleted', { adminId: user.id, groupId: deleted.id })

    return NextResponse.json({ success: true, data: { message: 'Permission group deleted' } })
  } catch (error) {
    logger.error('Failed to delete permission group', { error: error.message })
    return respondError(error)
  }
}
