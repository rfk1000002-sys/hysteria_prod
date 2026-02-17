import { NextResponse } from 'next/server';
import { respondSuccess, respondError, AppError } from '../../../../lib/response';
import { requireAuthWithPermission } from '../../../../lib/helper/permission.helper';
import logger from '../../../../lib/logger.js';
import * as contactService from '../../../../modules/admin/contact/services/contact.service.js';

// GET - Fetch all contact sections
export async function GET(request) {
  try {
    // await requireAuthWithPermission(request, "contact.read");

    logger.info('API GET /api/admin/contact called', { url: request.url });

    const { searchParams } = new URL(request.url);

    const options = {
      perPage: 10,
      cursor: null,
      isActive: null,
    };

    if (searchParams.has('perPage')) {
      const perPage = parseInt(searchParams.get('perPage'), 10);
      if (!isNaN(perPage) && perPage > 0 && perPage <= 100) {
        options.perPage = perPage;
      }
    }

    if (searchParams.has('cursor')) {
      const cursor = parseInt(searchParams.get('cursor'), 10);
      if (!isNaN(cursor) && cursor > 0) {
        options.cursor = cursor;
      }
    }

    if (searchParams.has('isActive')) {
      const isActive = searchParams.get('isActive');
      options.isActive = isActive === 'true';
    }

    const result = await contactService.getAllContacts(options);

    logger.info('Fetched contacts', {
      count: Array.isArray(result.contacts) ? result.contacts.length : undefined,
    });

    return respondSuccess(result, 200);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    logger.error('GET /api/admin/contact error:', { error: error.message, stack: error.stack });

    if (error instanceof AppError) {
      return respondError(error.message, error.statusCode);
    }

    return respondError('Internal server error', 500);
  }
}

// POST - Create new contact section
export async function POST(request) {
  try {
    // await requireAuthWithPermission(request, "contact.create");

    logger.info('API POST /api/admin/contact called');

    const body = await request.json();
    const newContact = await contactService.createContact(body);

    logger.info('Contact created', { id: newContact.id });

    return respondSuccess(newContact, 201);
  } catch (error) {
    console.error('Error creating contact:', error);
    logger.error('POST /api/admin/contact error:', { error: error.message, stack: error.stack });

    if (error instanceof AppError) {
      return respondError(error.message, error.statusCode);
    }

    return respondError('Internal server error', 500);
  }
}
