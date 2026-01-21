"use client";

import React, { useMemo } from "react";
import { useAuth } from "../../lib/context/auth-context";

/**
 * PermissionGate
 * Props:
 * - requiredPermissions: string | string[] (required)
 * - requireAll: boolean (default false) - require all permissions instead of any
 * - fallback: React node to display when access denied (optional)
 */
export default function PermissionGate({ requiredPermissions, requireAll = false, fallback = null, hideOnDenied = false, disableOnDenied = false, children }) {
  const auth = useAuth();
  const { user, isLoading, isAuthenticated } = auth || {};

  const hasPermission = useMemo(() => {
    if (!isAuthenticated || isLoading) return false;

    const userRoles = user?.roles || [];
    // Superadmin bypass (string name kept generic)
    if (userRoles.includes("SUPERADMIN")) return true;

    const userPermissions = user?.permissions || [];
    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    if (requireAll) {
      return perms.every((p) => userPermissions.includes(p));
    }

    return perms.some((p) => userPermissions.includes(p));
  }, [user, isLoading, isAuthenticated, requiredPermissions, requireAll]);

  // While auth is initializing, render nothing to avoid flash
  if (isLoading) return null;

  if (hasPermission) return <>{children}</>;

  // If caller prefers to hide the denied children (legacy), return null
  if (hideOnDenied) return null;

  // If caller prefers to render the children but disabled (for inline action buttons), clone children and add disabled props
  if (disableOnDenied) {
    const cloned = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const extra = { disabled: true, "aria-disabled": true };
        // Preserve existing className but add a disabled opacity if needed
        if (child.props && typeof child.props.className === 'string') {
          extra.className = `${child.props.className} opacity-50 pointer-events-none`;
        }
        return React.cloneElement(child, extra);
      }
      return child;
    });
    return <>{cloned}</>;
  }

  // Show provided fallback or a simple message
  return (
    <div style={{ padding: 16, borderRadius: 6, background: "#fff6f6", color: "#721c24", border: "1px solid #f5c6cb" }}>
      {fallback || <div>Anda tidak memiliki izin untuk melihat konten ini.</div>}
    </div>
  );
}
