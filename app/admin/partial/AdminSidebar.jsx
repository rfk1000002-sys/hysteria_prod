"use client";

import Link from "next/link";
import { Logo, IconDashboard, IconUsers, IconSettings } from "../../../components/adminUI/icon";

export default function AdminSidebar({ open, collapsed, onClose, onToggleCollapse }) {
  return (
    <div className="h-screen overflow-y-auto bg-white">
      
      {/* Logo dan tombol tutup */}
      <div className={`px-4 py-4 flex items-center border-b border-zinc-100 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className={`flex items-center gap-3 ${collapsed ? "w-full justify-center" : ""}`}>
          <button
            onClick={onToggleCollapse}
            aria-pressed={collapsed}
            className="flex items-center gap-3 focus:outline-none"
            title={collapsed ? "Open sidebar" : "Collapse sidebar"}
          >
            <Logo size={40} />
            {!collapsed && <span className="text-sm font-semibold text-zinc-900">Hysteria</span>}
          </button>
        </div>
        <div className={`flex items-center gap-2 ${collapsed ? "hidden" : ""}`}>
          <button onClick={onClose} className="lg:hidden p-2 rounded-md text-zinc-600 hover:bg-zinc-50">Close</button>
        </div>
      </div>

      {/* Navigasi tabs */}
      <nav className="px-2 py-6">
        <ul className="space-y-1">
          <li>
            <Link
              href="/admin"
              title="Dashboard"
              className={`group relative flex items-center gap-3 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2"}`}
              aria-label="Dashboard"
            >
              <IconDashboard />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/admin/users"
              title="Users"
              className={`group relative flex items-center gap-3 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2"}`}
              aria-label="Users"
            >
              <IconUsers />
              {!collapsed && <span>Users</span>}
            </Link>
          </li>

          <li>
            <Link
              href="/admin/settings"
              title="Settings"
              className={`group relative flex items-center gap-3 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2"}`}
              aria-label="Settings"
            >
              <IconSettings />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
