"use client";

import { useEffect } from "react";

export default function ArticleViewTracker({ slug }) {
  useEffect(() => {

    const viewed = localStorage.getItem(`viewed-${slug}`);

    if (viewed) return;

    fetch(`/api/articles/${slug}`, {
      method: "POST",
    });

    localStorage.setItem(`viewed-${slug}`, "true");

  }, [slug]);

  return null;
}