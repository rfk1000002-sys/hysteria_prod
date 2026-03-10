import { NextResponse } from "next/server";
import { getEventCategoriesByOrganizers } from "@/modules/admin/events";

export async function GET(req) {

  const { searchParams } = new URL(req.url);

  const organizerIds = searchParams.get("organizerIds");

  if (!organizerIds) {
    return NextResponse.json([]);
  }

  const ids = organizerIds
    .split(",")
    .map(Number)
    .filter(Boolean);

  const categories = await getEventCategoriesByOrganizers(ids);
  
  return NextResponse.json(categories);
}