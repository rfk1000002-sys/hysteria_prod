import { NextResponse } from "next/server";
import { respondSuccess, respondError, AppError } from "../../../lib/response";
import logger from "../../../lib/logger.js";
import { prisma } from "../../../lib/prisma.js";

// GET - Fetch active contact section (public endpoint)
export async function GET(request) {
  try {
    logger.info('API GET /api/contact called', { url: request.url });

    const activeContact = await prisma.contactSection.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!activeContact) {
      return respondSuccess({ contact: null }, 200);
    }

    logger.info('Fetched active contact', { id: activeContact.id });

    return respondSuccess({ contact: activeContact }, 200);
  } catch (error) {
    console.error("Error fetching active contact:", error);
    logger.error("GET /api/contact error:", { error: error.message, stack: error.stack });
    
    return respondError("Failed to fetch contact information", 500);
  }
}
