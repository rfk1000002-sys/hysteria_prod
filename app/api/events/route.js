import { prisma } from "../../../lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "latest";

  const now = new Date();

  let where = {
    isPublished: true,
    title: {
      contains: q,
      mode: "insensitive",
    },
  };

  if (status === "upcoming") where.startAt = { gt: now };
  if (status === "past") where.endAt = { lt: now };
  if (status === "ongoing") {
    where.AND = [
      { startAt: { lte: now } },
      { endAt: { gte: now } },
    ];
  }

  let orderBy = { startAt: "desc" };
  if (sort === "oldest") orderBy = { startAt: "asc" };
  if (sort === "nearest") orderBy = { startAt: "asc" };
  if (sort === "farthest") orderBy = { startAt: "desc" };

  const events = await prisma.event.findMany({
    where,
    orderBy,
    include: { category: true },
  });

  return Response.json(events);
}
