import { NextResponse } from "next/server";
import { respondSuccess, respondError, AppError } from "../../../../../../lib/response";
import { requireAuthWithPermission } from "../../../../../../lib/helper/permission.helper";
import logger from "../../../../../../lib/logger.js";
import * as contactService from "../../../../../../modules/admin/contact/services/contact.service.js";

// POST - Toggle contact section active status
export async function POST(request, { params }) {
  try {
    // await requireAuthWithPermission(request, "contact.update");

    const { id } = await params;
    logger.info('API POST /api/admin/contact/[id]/toggle called', { id });

    const updatedContact = await contactService.toggleContactStatus(parseInt(id));

    logger.info('Contact status toggled', { id: updatedContact.id, isActive: updatedContact.isActive });

    return respondSuccess(updatedContact, 200);
  } catch (error) {
    console.error("Error toggling contact status:", error);
    logger.error("POST /api/admin/contact/[id]/toggle error:", { error: error.message, stack: error.stack });

    if (error instanceof AppError) {
      return respondError(error.message, error.statusCode);
    }

    return respondError("Internal server error", 500);
  }
}
