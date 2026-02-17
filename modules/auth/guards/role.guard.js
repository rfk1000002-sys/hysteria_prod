import { AppError } from '../../../lib/response.js';
import { ROLE_KEYS } from '../domain/role.constants.js';

export function requireRole(user, allowedRoles = []) {
  const userRoles = user?.roles || [];

  // Bypass permission check for SUPERADMIN
  if (userRoles.includes(ROLE_KEYS.SUPERADMIN)) {
    return;
  }

  const hasRole = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasRole) {
    throw new AppError('Insufficient role', 403, 'FORBIDDEN_ROLE');
  }
}
