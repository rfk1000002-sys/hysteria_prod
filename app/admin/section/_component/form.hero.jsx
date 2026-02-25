"use client";
import React from "react";
import ListHero from "./_list.hero.jsx";

export default function FormHero({
  items = [],
  onFilesChange = () => {},
  onItemChange = () => {},
  onSubmit = () => {},
  submitting = false,
}) {
  return (
    <div className="bg-white rounded">
      <ListHero
        items={items}
        onFilesChange={onFilesChange}
        onItemChange={onItemChange}
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onSubmit(items)}
          disabled={submitting}
          className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-60"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
