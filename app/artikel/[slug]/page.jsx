import { articles } from "../dummyarticles";
import Link from "next/link";

export default async function DetailArtikel({ params }) {
  const { slug } = await params;

  const artikel = articles.find(
    (a) => a.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!artikel) return <div>Artikel tidak ditemukan</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8">

        {/* ===== TITLE ===== */}
        <h1 className="text-4xl md:text-5xl font-bold mt-16 leading-tight">
          {artikel.title}
        </h1>

        {/* ===== META ===== */}
        <div className="flex items-center gap-4 text-gray-700 mt-6 text-lg">
          <span className="text-pink-500 font-semibold">{artikel.author}</span>
          <span>|</span>
          <span>{artikel.date}</span>
        </div>

        {/* ===== HERO IMAGE ===== */}
        <img
          src={artikel.image}
          className="mt-10 rounded-lg shadow-md w-full"
        />

        {/* ===== CONTENT ===== */}
        <div
          className="prose max-w-none prose-lg mt-12 text-justify"
          dangerouslySetInnerHTML={{ __html: artikel.content }}
        />

        {/* ===== TAGS + SHARE ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-16 gap-6">

          <div>
            <h3 className="font-bold text-xl mb-3">Tags</h3>
            <div className="flex gap-3">
              <span className="border border-pink-500 text-pink-500 px-4 py-1 rounded-md">
                {artikel.category}
              </span>
              <span className="border border-pink-500 text-pink-500 px-4 py-1 rounded-md">
                Rilisan Buku
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-3">Share</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[#43334C] rounded-md" />
              <div className="w-10 h-10 bg-[#43334C] rounded-md" />
              <div className="w-10 h-10 bg-[#43334C] rounded-md" />
            </div>
          </div>
        </div>

        {/* ===== RELATED ARTICLES ===== */}
        <h2 className="text-3xl font-bold mt-20 mb-8">Artikel lainnya</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((a) => (
            <Link key={a.id} href={`/artikel/${a.slug}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
                <img src={a.image} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <span className="text-pink-500 text-xs font-semibold">
                    {a.category}
                  </span>
                  <h3 className="font-semibold mt-2 text-sm line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                    {a.excerpt}
                  </p>
                  <div className="flex justify-between text-pink-500 text-xs mt-3">
                    <span>{a.author}</span>
                    <span>{a.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
