import { getPublicArticleDetail } from "@/modules/public/articles/services/services/article.public.service";

export default async function ArtikelDetail({ params }) {
  const article = await getPublicArticleDetail(params.slug);

  if (!article) {
    return <div>Artikel tidak ditemukan</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {article.image && (
        <img src={article.image} className="rounded-xl mb-8" />
      )}

      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      <div className="text-sm text-gray-500 mb-6">
        {article.author} •{" "}
        {article.date
          ? new Date(article.date).toLocaleDateString()
          : ""}
      </div>

      <div className="prose max-w-none">
        <pre>{JSON.stringify(article.content, null, 2)}</pre>
      </div>
    </div>
  );
}
