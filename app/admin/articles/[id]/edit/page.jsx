"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleForm from "@/components/ui/Article/ArticleForm";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id; 

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [articleRes, categoryRes] = await Promise.all([
          fetch(`/api/admin/articles/${id}`),
          fetch(`/api/categories/artikel`),
        ]);

        const articleJson = await articleRes.json();
        const categoryJson = await categoryRes.json();

        console.log("ARTICLE:", articleJson);
        console.log("CATEGORIES:", categoryJson);

        if (articleJson.success) {
          setInitialData(articleJson.data);
        }

        if (categoryJson.success) {
          setCategories(categoryJson.data.items);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Update gagal");
      }

      const json = await res.json();

      alert("Artikel berhasil diperbarui");

      router.replace("/admin");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!id) return <div>Loading ID...</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <ArticleForm
      initialData={initialData}
      categories={categories}
      mode="edit"
      onSubmit={handleUpdate}
    />
  );
}
