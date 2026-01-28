"use client";

import { useRef, useState } from "react";

export default function ImageUpload() {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setFileName("");
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* PREVIEW AREA */}
      <div
        className="w-full h-52 border-2 border-dashed border-black rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => !preview && inputRef.current.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Poster Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-center space-y-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-black text-black hover:bg-black hover:text-white transition"
            >
              Upload Poster
            </button>
            <p className="text-sm text-black">
              PNG / JPG
            </p>
          </div>
        )}
      </div>

      {/* FILE NAME */}
      {fileName && (
        <div className="text-sm font-medium text-black truncate">
          {fileName}
        </div>
      )}

      {/* ACTION BUTTONS */}
      {preview && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="px-4 py-2 rounded-lg border border-black text-black hover:bg-black hover:text-white transition"
          >
            Ganti Poster
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
          >
            Hapus
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
