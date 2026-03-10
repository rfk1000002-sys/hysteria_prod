"use client";

import { useEffect, useState, useRef } from "react";

export default function TagInput({ value = [], onChange }) {
  const [newTag, setNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  // Ambil semua tag dari DB
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/admin/tags");

        if (!res.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await res.json();
        setAllTags(data || []);
      } catch (err) {
        console.error("Gagal ambil tag:", err);
      }
    };

    fetchTags();
  }, []);

  const normalize = (tag) =>
    tag.trim().toLowerCase().replace(/\s+/g, "");

  const addTag = (customTag = null) => {
    const tag = normalize(customTag ?? newTag);

    if (!tag) return;
    if (value.includes(tag)) return;

    onChange([...value, tag]);
    setNewTag("");
    setShowDropdown(false);
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  // Handle typing (tanpa spasi)
  const handleChange = (e) => {
    const cleanValue = e.target.value.replace(/\s/g, "");
    setNewTag(cleanValue);

    if (!cleanValue) {
      setSuggestions([]);
      return;
    }

    const filtered = allTags
      .filter((tag) => {
        const normalizedTag = tag.name
          .toLowerCase()
          .replace(/\s+/g, "");

        return (
          normalizedTag.includes(cleanValue.toLowerCase()) &&
          !value.includes(normalizedTag)
        );
      })
      .slice(0, 6);
      
    setSuggestions(filtered);
    setShowDropdown(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm relative">
      <label className="block font-semibold mb-2">
        Tags / Keywords
      </label>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={newTag}
          onChange={handleChange}
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="Masukkan tag (tanpa spasi)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />

        <button
          type="button"
          onClick={() => addTag()}
          className="px-4 py-2 bg-[#4B3D52] text-white rounded-lg"
        >
          +
        </button>
      </div>

      {/* Dropdown Suggestion */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-40 overflow-auto">
          {suggestions.map((tag) => (
            <div
              key={tag.id}
              onClick={() => addTag(tag.name)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              #{tag.name}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {value.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm flex items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-gray-600 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}