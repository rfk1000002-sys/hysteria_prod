"use server";

import { trackEventView } from "../services/event.service";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Server action to increment views for an event
 * @param {string} slug 
 */
export async function trackEventViewAction(slug) {
  if (!slug) return null;
  
  try {
    const result = await trackEventView(slug);
    
    // Force Next.js to clear cache for this page
    revalidatePath(`/event/${slug}`);
    
    return result;
  } catch (error) {
    console.error(`[ACTION ERROR] Failed to increment views for ${slug}:`, error.message);
    return null;
  }
}
