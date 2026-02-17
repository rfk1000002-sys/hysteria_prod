"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArtikelPage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async (keyword = "") => {
    const res = await fetch(`/api/articles?search=${keyword}`);
    const json = await res.json();
    setArticles(json.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Artikel</h1>

      <div className="flex gap-3 mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari artikel..."
          className="flex-1 border border-pink-400 rounded-full px-5 py-3"
        />
        <button
          onClick={() => fetchArticles(search)}
          className="bg-pink-500 text-white px-5 rounded-full"
        >
          Cari
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link key={a.id} href={`/artikel/${a.slug}`}>
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer">
              <img src={a.image} className="rounded-lg mb-3" />
              <span className="text-xs text-pink-500 font-semibold">
                {a.category}
              </span>
              <h2 className="font-semibold mt-1 line-clamp-2">
                {a.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {a.excerpt}
              </p>
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>{a.author}</span>
                <span>
                  {a.date
                    ? new Date(a.date).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
