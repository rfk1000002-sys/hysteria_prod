'use client';

import React from 'react';

export default function ManageRolesModal({
  open,
  roleUser,
  availableRoles = [],
  selectedRoles = new Set(),
  toggleRole,
  onClose,
  onSave,
  loading,
}) {
  if (!open || !roleUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h3 className="text-lg font-medium mb-4 text-zinc-900">Manage Roles for {roleUser.name}</h3>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {availableRoles.map((role) => (
            <label
              key={role.id}
              className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedRoles.has(role.id)}
                onChange={() => toggleRole(role.id)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <div className="font-medium text-zinc-900">{role.key}</div>
                <div className="text-sm text-zinc-600">{role.name || role.description || '-'}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 text-zinc-800 rounded-md hover:bg-zinc-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Roles'}
          </button>
        </div>
      </div>
    </div>
  );
}
