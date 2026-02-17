import { NextResponse } from 'next/server';
import { respondSuccess, respondError, AppError } from '../../../../../lib/response';
import { requireAuthWithPermission } from '../../../../../lib/helper/permission.helper';
import logger from '../../../../../lib/logger.js';
import * as contactService from '../../../../../modules/admin/contact/services/contact.service.js';

// PUT - Update contact section
export async function PUT(request, { params }) {
  try {
    // await requireAuthWithPermission(request, "contact.update");

    const { id } = await params;
    logger.info('API PUT /api/admin/contact/[id] called', { id });

    const body = await request.json();
    const updatedContact = await contactService.updateContact(parseInt(id), body);

    logger.info('Contact updated', { id: updatedContact.id });

    return respondSuccess(updatedContact, 200);
  } catch (error) {
    console.error('Error updating contact:', error);
    logger.error('PUT /api/admin/contact/[id] error:', {
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) {
      return respondError(error.message, error.statusCode);
    }

    return respondError('Internal server error', 500);
  }
}

// DELETE - Delete contact section
export async function DELETE(request, { params }) {
  try {
    // await requireAuthWithPermission(request, "contact.delete");

    const { id } = await params;
    logger.info('API DELETE /api/admin/contact/[id] called', { id });

    await contactService.deleteContact(parseInt(id));

    logger.info('Contact deleted', { id });

    return respondSuccess({ message: 'Contact deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting contact:', error);
    logger.error('DELETE /api/admin/contact/[id] error:', {
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof AppError) {
      return respondError(error.message, error.statusCode);
    }

    return respondError('Internal server error', 500);
  }
}
