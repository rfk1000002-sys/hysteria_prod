import { prisma } from '../../../../../lib/prisma.js';
import { AppError, respondSuccess, respondError } from '../../../../../lib/response.js';
import { requireAuthWithPermission } from '../../../../../lib/helper/permission.helper.js';

/**
 * GET /api/admin/collaboration-content/[id]
 * Get single collaboration content by ID
 */
export async function GET(req, { params }) {
  try {
    await requireAuthWithPermission(req, 'collaboration.view');

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const content = await prisma.collaborationPageContent.findUnique({
      where: { id },
    });

    if (!content) {
      return respondError(new AppError('Konten tidak ditemukan', 404, 'NOT_FOUND'));
    }

    return respondSuccess(content, 200);
  } catch (error) {
    console.error('Error fetching collaboration content:', error);
    return respondError(error);
  }
}

/**
 * PUT /api/admin/collaboration-content/[id]
 * Update collaboration page content
 */
export async function PUT(req, { params }) {
  try {
    await requireAuthWithPermission(req, 'collaboration.update');

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();

    const existing = await prisma.collaborationPageContent.findUnique({
      where: { id },
    });

    if (!existing) {
      return respondError(new AppError('Konten tidak ditemukan', 404, 'NOT_FOUND'));
    }

    // Validation
    if (!body.heroTitle || !body.heroDescription) {
      return respondError(
        new AppError('Hero title dan description wajib diisi', 400, 'BAD_REQUEST')
      );
    }

    if (!body.googleFormUrl) {
      return respondError(new AppError('Google Form URL wajib diisi', 400, 'BAD_REQUEST'));
    }

    if (!body.whyBenefits || !Array.isArray(body.whyBenefits) || body.whyBenefits.length === 0) {
      return respondError(
        new AppError('Minimal 1 benefit di "Mengapa Berkolaborasi" harus diisi', 400, 'BAD_REQUEST')
      );
    }

    if (!body.schemes || !Array.isArray(body.schemes) || body.schemes.length === 0) {
      return respondError(
        new AppError('Minimal 1 scheme di "Skema Kolaborasi" harus diisi', 400, 'BAD_REQUEST')
      );
    }

    if (!body.flowSteps || !Array.isArray(body.flowSteps) || body.flowSteps.length === 0) {
      return respondError(
        new AppError('Minimal 1 step di "Alur Kolaborasi" harus diisi', 400, 'BAD_REQUEST')
      );
    }

    // If setting as active, deactivate others
    if (body.isActive && !existing.isActive) {
      await prisma.collaborationPageContent.updateMany({
        where: {
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      });
    }

    const updated = await prisma.collaborationPageContent.update({
      where: { id },
      data: {
        heroTitle: body.heroTitle,
        heroDescription: body.heroDescription,
        googleFormUrl: body.googleFormUrl,
        ctaDescription: body.ctaDescription || '',
        whyBenefits: body.whyBenefits,
        schemes: body.schemes,
        flowSteps: body.flowSteps,
        isActive: body.isActive,
      },
    });

    return respondSuccess(updated, 200);
  } catch (error) {
    console.error('Error updating collaboration content:', error);
    return respondError(error);
  }
}

/**
 * DELETE /api/admin/collaboration-content/[id]
 * Delete collaboration page content
 */
export async function DELETE(req, { params }) {
  try {
    await requireAuthWithPermission(req, 'collaboration.delete');

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const existing = await prisma.collaborationPageContent.findUnique({
      where: { id },
    });

    if (!existing) {
      return respondError(new AppError('Konten tidak ditemukan', 404, 'NOT_FOUND'));
    }

    await prisma.collaborationPageContent.delete({
      where: { id },
    });

    return respondSuccess(null, 200);
  } catch (error) {
    console.error('Error deleting collaboration content:', error);
    return respondError(error);
  }
}
