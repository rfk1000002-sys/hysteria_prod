"use client";

import React from "react";

export default function UserModal({ open, mode = 'create', formData, setFormData, onClose, onSubmit, loading }) {
  if (!open) return null;

  const title = mode === 'create' ? 'Create New User' : 'Edit User';
  const submitLabel = mode === 'create' ? 'Create' : 'Save';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h3 className="text-lg font-medium mb-4 text-zinc-900">{title}</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-zinc-700 block mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-white text-zinc-900 placeholder:text-zinc-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-700 block mb-1">
              Password {mode === 'create' ? '*' : '(leave empty to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-white text-zinc-900 placeholder:text-zinc-400"
              placeholder={mode === 'create' ? '' : 'Leave empty to keep current password'}
              {...(mode === 'create' ? { required: true } : {})}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-700 block mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-white text-zinc-900 placeholder:text-zinc-400"
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-md hover:bg-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
