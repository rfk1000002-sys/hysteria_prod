import {
  findPublishedArticles,
  findPublishedBySlug,
  findRecommendedArticles,
} from "../repositories/article.public.repository";

import { incrementArticleViews } from "../repositories/article.public.repository";

export async function getPublicArticles(params) {
  const result = await findPublishedArticles(params);

  return {
    data: result.data.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      authorName: a.authorName,
      publishedAt: a.publishedAt,

      categories: a.categories.map((c) => ({
        id: c.category.id,
        title: c.category.title,
      })),
    })),

    meta: result.meta,
  };
}

export async function getPublicArticleDetail(slug) {
  const article = await findPublishedBySlug(slug);

  if (!article) return null;

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,

    content:
      typeof article.content === "string"
        ? JSON.parse(article.content)
        : article.content,

    excerpt: article.excerpt,

    featuredImage: article.featuredImage,
    featuredImageSource: article.featuredImageSource, // ✅ TAMBAHAN

    authorName: article.authorName,
    editorName: article.editorName,
    publishedAt: article.publishedAt,

    views: article.views,

    categories: article.categories.map((c) => ({
      id: c.category.id,
      title: c.category.title,
    })),

    tags: article.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
    })),

    references: article.references ?? [], // ✅ TAMBAHAN
  };
}

export async function getRecommendedArticles({ slug, categoryIds }) {
  const articles = await findRecommendedArticles({
    slug,
    categoryIds,
  });

  return articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    featuredImage: a.featuredImage,
    authorName: a.authorName,
    publishedAt: a.publishedAt,

    categories: a.categories.map((c) => ({
      id: c.category.id,
      title: c.category.title,
    })),
  }));
}

export async function addArticleView(slug) {
  return incrementArticleViews(slug);
}
