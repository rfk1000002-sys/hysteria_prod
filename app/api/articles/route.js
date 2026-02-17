import { NextResponse } from "next/server";
import { getPublicArticles } from "@/modules/public/articles/services/services/article.public.service";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const data = await getPublicArticles({ search });

  return NextResponse.json({
    success: true,
    data,
  });
}
