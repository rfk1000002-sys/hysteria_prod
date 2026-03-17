"use client";

import { useEffect } from "react";

export default function ArticleViewTracker({ slug }) {
  useEffect(() => {
    const key = `viewed-${slug}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      const { time } = JSON.parse(stored);

      const oneDay = 24 * 60 * 60 * 1000;

      if (Date.now() - time < oneDay) return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/articles/${slug}/view`, {
        method: "POST",
        keepalive: true
      });

      localStorage.setItem(
        key,
        JSON.stringify({
          time: Date.now()
        })
      );
    }, 5000); // user membaca 5 detik

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}