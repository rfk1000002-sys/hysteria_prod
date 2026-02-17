import { findPublishedArticles, findPublishedBySlug } from "../../repositories/article.public.repository";

export async function getPublicArticles({ search }) {
  const articles = await findPublishedArticles({ search });

  return articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    image: a.featuredImage,
    author: a.authorName,
    date: a.publishedAt,
    category: a.categories[0]?.category?.title || "Uncategorized",
  }));
}

export async function getPublicArticleDetail(slug) {
  const article = await findPublishedBySlug(slug);

  if (!article) return null;

  return {
    id: article.id,
    title: article.title,
    content:
      typeof article.content === "string"
        ? JSON.parse(article.content)
        : article.content,
    excerpt: article.excerpt,
    image: article.featuredImage,
    author: article.authorName,
    date: article.publishedAt,
    categories: article.categories.map((c) => c.category.title),
    tags: article.tags.map((t) => t.tag.name),
  };
}
