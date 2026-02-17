import { AppError } from '../response.js';
import { ROLE_KEYS } from '../../modules/auth/domain/role.constants.js';
import { requireAuth } from './auth.helper.js';

/**
 * Check if user has required permission
 * SUPERADMIN automatically bypasses all permission checks
 *
 * @param {Object} user - User object with roles and permissions
 * @param {string|string[]} requiredPermissions - Permission key(s) required
 * @throws {AppError} If user doesn't have required permission
 */
export function requirePermission(user, requiredPermissions) {
  const userRoles = user?.roles || [];

  // SUPERADMIN bypass - has access to everything
  if (userRoles.includes(ROLE_KEYS.SUPERADMIN)) {
    return true;
  }

  const userPermissions = user?.permissions || [];
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  // Debug logging
  if (userPermissions.length === 0) {
    console.log('⚠️  WARNING: User has no permissions in token!', {
      userId: user.id || user.sub,
      email: user.email,
      roles: userRoles,
      requiredPermissions: permissions,
    });
  }

  // Check if user has at least one of the required permissions
  const hasPermission = permissions.some((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    throw new AppError('Insufficient permission', 403, 'FORBIDDEN_PERMISSION');
  }

  return true;
}

/**
 * Require authentication and check permission
 * SUPERADMIN automatically bypasses permission check
 *
 * @param {Request} request - Next.js request object
 * @param {string|string[]} requiredPermissions - Permission key(s) required
 * @returns {Promise<Object>} User payload
 */
export async function requireAuthWithPermission(request, requiredPermissions) {
  // First, authenticate user (no role restriction)
  const user = await requireAuth(request);

  // Then check permission (SUPERADMIN will bypass this)
  requirePermission(user, requiredPermissions);

  return user;
}
