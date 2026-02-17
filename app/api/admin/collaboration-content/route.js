import { prisma } from '../../../../lib/prisma.js';
import { AppError, respondSuccess, respondError } from '../../../../lib/response.js';
import { requireAuthWithPermission } from '../../../../lib/helper/permission.helper.js';

/**
 * GET /api/admin/collaboration-content
 * Get all collaboration page content (admin)
 */
export async function GET(req) {
  try {
    await requireAuthWithPermission(req, 'collaboration.view');

    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '10');

    const [contents, total] = await Promise.all([
      prisma.collaborationPageContent.findMany({
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.collaborationPageContent.count(),
    ]);

    return respondSuccess(
      {
        contents,
        pagination: {
          total,
          pages: Math.ceil(total / take),
        },
      },
      200
    );
  } catch (error) {
    console.error('Error fetching collaboration contents:', error);
    return respondError('Gagal mengambil data', 500);
  }
}

/**
 * POST /api/admin/collaboration-content
 * Create new collaboration page content
 */
export async function POST(req) {
  try {
    await requireAuthWithPermission(req, 'collaboration.create');

    const body = await req.json();
    const {
      heroTitle,
      heroDescription,
      googleFormUrl,
      ctaDescription,
      whyBenefits,
      schemes,
      flowSteps,
      isActive,
    } = body;

    // Validation
    if (!heroTitle || !heroDescription) {
      return respondError(
        new AppError('Hero title dan description wajib diisi', 400, 'BAD_REQUEST')
      );
    }

    if (!googleFormUrl) {
      return respondError(new AppError('Google Form URL wajib diisi', 400, 'BAD_REQUEST'));
    }

    if (!whyBenefits || !Array.isArray(whyBenefits) || whyBenefits.length === 0) {
      return respondError(
        new AppError('Minimal 1 benefit di "Mengapa Berkolaborasi" harus diisi', 400, 'BAD_REQUEST')
      );
    }

    if (!schemes || !Array.isArray(schemes) || schemes.length === 0) {
      return respondError(
        new AppError('Minimal 1 scheme di "Skema Kolaborasi" harus diisi', 400, 'BAD_REQUEST')
      );
    }

    if (!flowSteps || !Array.isArray(flowSteps) || flowSteps.length === 0) {
      return respondError(
        new AppError('Minimal 1 step di "Alur Kolaborasi" harus diisi', 400, 'BAD_REQUEST')
      );
    }

    // If setting as active, deactivate others
    if (isActive) {
      await prisma.collaborationPageContent.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const content = await prisma.collaborationPageContent.create({
      data: {
        heroTitle,
        heroDescription,
        googleFormUrl,
        ctaDescription: ctaDescription || '',
        whyBenefits,
        schemes,
        flowSteps,
        isActive: isActive || false,
      },
    });

    return respondSuccess(content, 201);
  } catch (error) {
    console.error('Error creating collaboration content:', error);
    return respondError(error);
  }
}
