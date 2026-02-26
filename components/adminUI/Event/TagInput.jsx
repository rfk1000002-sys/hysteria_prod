"use client";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "event-tag-history";

export default function TagInput({ value = [], onChange }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  // load history dari browser
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    setHistory(saved);
  }, []);

  const saveToHistory = (tag) => {
    const next = Array.from(
      new Set([...history, tag])
    );
    setHistory(next);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
  };

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (value.includes(tag)) return;

    onChange([...value, tag]);
    saveToHistory(tag);
    setInput("");
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  const suggestions = useMemo(() => {
    if (!input) return [];
    return history.filter(
      (t) =>
        t.includes(input.toLowerCase()) &&
        !value.includes(t)
    );
  }, [input, history, value]);

  return (
    <div className="relative">
      {/* TAG CHIPS */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-pink-500 hover:text-pink-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
        }}
        placeholder="Ketik tag lalu Enter"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
      />

      {/* AUTOCOMPLETE */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}