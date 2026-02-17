'use client';

import React from 'react';

export default function Sheet({ open, onClose, children, panelClassName = '' }) {
  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      </div>

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'} ${panelClassName}`}
      >
        {children}
      </aside>
    </>
  );
}
