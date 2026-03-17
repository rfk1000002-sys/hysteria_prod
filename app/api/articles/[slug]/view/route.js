import { NextResponse } from "next/server";
import { addArticleView } from "@/modules/public/articles/services/article.public.service";

const rateLimit = new Map();

export async function POST(req, { params }) {
  const { slug } = params;

  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "";

    // ================= BOT FILTER =================
    if (
      userAgent.includes("bot") ||
      userAgent.includes("crawl") ||
      userAgent.includes("spider")
    ) {
      return NextResponse.json({ success: true });
    }

    // ================= RATE LIMIT =================
    const key = `${ip}-${slug}`;
    const now = Date.now();

    const lastRequest = rateLimit.get(key);

    if (lastRequest && now - lastRequest < 30000) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    rateLimit.set(key, now);

    // ================= ADD VIEW =================
    await addArticleView(slug);

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to add view" },
      { status: 500 }
    );
  }
}