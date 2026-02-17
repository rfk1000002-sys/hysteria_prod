import { prisma } from '../../../../lib/prisma.js';
import { AppError } from '../../../../lib/response.js';
import logger from '../../../../lib/logger.js';

/**
 * Create a new contact section
 */
export async function createContact(data) {
  try {
    // If this contact is set as active, deactivate all others
    if (data.isActive) {
      await prisma.contactSection.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const contact = await prisma.contactSection.create({
      data: {
        mapsEmbedUrl: data.mapsEmbedUrl || '',
        locationTitle: data.locationTitle || '',
        locationAddress: data.locationAddress || '',
        operationalHours: data.operationalHours || '',
        whatsappNumber: data.whatsappNumber || '',
        phoneNumber: data.phoneNumber || '',
        instagramUrl:
          data.instagramUrl && data.instagramUrl.trim() !== '' ? data.instagramUrl : null,
        twitterUrl: data.twitterUrl && data.twitterUrl.trim() !== '' ? data.twitterUrl : null,
        facebookUrl: data.facebookUrl && data.facebookUrl.trim() !== '' ? data.facebookUrl : null,
        linkedinUrl: data.linkedinUrl && data.linkedinUrl.trim() !== '' ? data.linkedinUrl : null,
        youtubeUrl: data.youtubeUrl && data.youtubeUrl.trim() !== '' ? data.youtubeUrl : null,
        isActive: data.isActive ?? false,
      },
    });

    return contact;
  } catch (error) {
    logger.error('Error in createContact:', error);
    console.error('Full error:', error);
    throw new AppError('Failed to create contact: ' + error.message, 500);
  }
}

/**
 * Update an existing contact section
 */
export async function updateContact(id, data) {
  try {
    // If this contact is being set as active, deactivate all others
    if (data.isActive) {
      await prisma.contactSection.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      });
    }

    const contact = await prisma.contactSection.update({
      where: { id },
      data: {
        mapsEmbedUrl: data.mapsEmbedUrl || '',
        locationTitle: data.locationTitle || '',
        locationAddress: data.locationAddress || '',
        operationalHours: data.operationalHours || '',
        whatsappNumber: data.whatsappNumber || '',
        phoneNumber: data.phoneNumber || '',
        instagramUrl:
          data.instagramUrl && data.instagramUrl.trim() !== '' ? data.instagramUrl : null,
        twitterUrl: data.twitterUrl && data.twitterUrl.trim() !== '' ? data.twitterUrl : null,
        facebookUrl: data.facebookUrl && data.facebookUrl.trim() !== '' ? data.facebookUrl : null,
        linkedinUrl: data.linkedinUrl && data.linkedinUrl.trim() !== '' ? data.linkedinUrl : null,
        youtubeUrl: data.youtubeUrl && data.youtubeUrl.trim() !== '' ? data.youtubeUrl : null,
        isActive: data.isActive,
      },
    });

    return contact;
  } catch (error) {
    logger.error('Error in updateContact:', error);
    console.error('Full error:', error);
    if (error.code === 'P2025') {
      throw new AppError('Contact not found', 404);
    }
    throw new AppError('Failed to update contact: ' + error.message, 500);
  }
}

/**
 * Delete a contact section
 */
export async function deleteContact(id) {
  try {
    await prisma.contactSection.delete({
      where: { id },
    });
  } catch (error) {
    logger.error('Error in deleteContact:', error);
    if (error.code === 'P2025') {
      throw new AppError('Contact not found', 404);
    }
    throw new AppError('Failed to delete contact', 500);
  }
}

/**
 * Get all contact sections with optional filtering
 */
export async function getAllContacts(options = {}) {
  try {
    const { perPage = 10, cursor = null, isActive = null } = options;

    const where = {};
    if (isActive !== null) {
      where.isActive = isActive;
    }

    const contacts = await prisma.contactSection.findMany({
      where,
      take: perPage + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
    });

    const hasMore = contacts.length > perPage;
    const contactList = hasMore ? contacts.slice(0, -1) : contacts;
    const nextCursor = hasMore ? contactList[contactList.length - 1].id : null;

    return {
      contacts: contactList,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    logger.error('Error in getAllContacts:', error);
    throw new AppError('Failed to fetch contacts', 500);
  }
}

/**
 * Toggle contact active status
 */
export async function toggleContactStatus(id) {
  try {
    const contact = await prisma.contactSection.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    const newStatus = !contact.isActive;

    // If activating, deactivate all others
    if (newStatus) {
      await prisma.contactSection.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      });
    }

    const updatedContact = await prisma.contactSection.update({
      where: { id },
      data: { isActive: newStatus },
    });

    return updatedContact;
  } catch (error) {
    logger.error('Error in toggleContactStatus:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to toggle contact status', 500);
  }
}
