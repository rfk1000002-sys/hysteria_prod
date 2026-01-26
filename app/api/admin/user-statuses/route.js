import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import { respondSuccess, respondError } from '../../../../lib/response.js';
import { requireAuthWithPermission } from '../../../../lib/helper/permission.helper.js';
import logger from '../../../../lib/logger.js';

/**
 * GET /api/admin/user-statuses
 * Fetch all available user statuses
 * Required permission: users.read
 */
export async function GET(request) {
  try {
    // Require authentication and 'users.read' permission (consistent with other admin routes)
    const user = await requireAuthWithPermission(request, 'users.read');

    const statuses = await prisma.userStatus.findMany({
      select: {
        id: true,
        key: true,
        name: true,
        description: true,
      },
      orderBy: {
        key: 'asc',
      },
    });

    return respondSuccess({ statuses });
  } catch (error) {
    logger.error('Error fetching user statuses', { error: error && error.message ? error.message : error })
    return respondError(error)
  }
}
