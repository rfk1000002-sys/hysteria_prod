import { prisma } from '../../../lib/prisma.js';
import { respondSuccess, respondError } from '../../../lib/response.js';

/**
 * GET /api/collaboration-content
 * Public endpoint - Get active collaboration page content
 */
export async function GET() {
  try {
    const content = await prisma.collaborationPageContent.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!content) {
      return respondError('Konten kolaborasi tidak ditemukan', 404);
    }

    return respondSuccess(content, 200);
  } catch (error) {
    console.error('Error fetching collaboration content:', error);
    return respondError('Gagal mengambil konten kolaborasi', 500);
  }
}
