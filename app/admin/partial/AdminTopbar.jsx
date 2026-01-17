"use client";

import { Avatar, IconMenu } from "../../../components/adminUI/icon";

export default function AdminTopbar({ onOpenSidebar }) {
  return (
    <div className="flex w-full items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <button onClick={onOpenSidebar} className="lg:hidden p-2 rounded-md hover:bg-zinc-100" aria-label="Open menu">
          <IconMenu className="h-5 w-5 text-zinc-700" />
        </button>
        <h1 className="text-lg font-semibold text-zinc-900">Admin Area</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Cari..."
            className="hidden sm:inline-block w-64 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1 text-sm hover:bg-zinc-100">
            <Avatar className="h-8 w-8" />
            <span className="hidden sm:inline text-zinc-700">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
