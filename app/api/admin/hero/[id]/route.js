import { NextResponse } from "next/server";
import { respondSuccess, respondError, AppError } from "../../../../../lib/response";
import { requireAuthWithPermission } from "../../../../../lib/helper/permission.helper";
import { parseMultipartForm, validateFileMimeType, validateFileSize } from "../../../../../lib/upload/multipart";
import * as heroService from "../../../../../modules/admin/hero/services/hero.service.js";
import {
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "../../../../../modules/admin/hero/validators/hero.validator.js";
import logger from "../../../../../lib/logger.js";

// GET - Fetch single hero
export async function GET(request, { params }) {
  try {
    await requireAuthWithPermission(request, "hero.read");

    const { id } = await params;
    logger.info('API GET /api/admin/hero/:id called', { id });

    const hero = await heroService.getHeroById(parseInt(id));

    logger.info('Fetched hero', { id: hero?.id });

    return respondSuccess(hero, 200);
  } catch (error) {
    logger.error('Error fetching hero', { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Gagal memuat data hero", 500));
  }
}

// PUT - Update hero (supports JSON or multipart with file upload)
export async function PUT(request, { params }) {
  try {
    await requireAuthWithPermission(request, "hero.update");

    const { id } = await params;
    logger.info('API PUT /api/admin/hero/:id called', { id });
    const heroId = Number(id);
    
    if (!Number.isInteger(heroId)) {
      return respondError(new AppError("Invalid hero id", 400));
    }

    const contentType = request.headers.get("content-type") || "";
    let body = {};
    let sourceUrl = null;

    // Max upload size in bytes (adjust as needed)
    const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseMultipartForm(request, {
        maxFileSize: MAX_UPLOAD_SIZE,
      });

      body = fields;

      if (body.isActive !== undefined) {
        body.isActive = body.isActive === "true" || body.isActive === true;
      }

      if (files && files.length > 0) {
        const file = files[0];

        // Specific allowed MIME types: webp, jpg, webm, mp4
        const allowedTypes = [
          "image/webp",
          "image/jpeg",
          "image/jpg",
          "video/webm",
          "video/mp4"
        ];

        if (!validateFileMimeType(file, allowedTypes)) {
          return respondError(
            new AppError(
              "Tipe file tidak didukung. Gunakan: WebP, JPG, WebM, atau MP4.",
              415,
            ),
          );
        }

        // Dynamic size validation
        const isVideo = file.mimetype?.startsWith("video/") || file.type?.startsWith("video/");
        const limit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        const limitName = isVideo ? "Video" : "Gambar";
        const limitMB = limit / (1024 * 1024);

        if (!validateFileSize(file, limit)) {
          return respondError(
            new AppError(
              `Ukuran file ${limitName} terlalu besar. Maksimal: ${limitMB}MB`,
              413,
            ),
          );
        }

        // Use service function for transactional update with upload
        const hero = await heroService.updateHeroWithFile(heroId, body, file);
        logger.info('Hero updated with file', { heroId: hero?.id, file: file.originalFilename || file.newFilename || file.name });
        return respondSuccess(hero, 200);
      }
      
      // Multipart but no file: field-only update
      const hero = await heroService.updateHero(heroId, body);
      logger.info('Hero fields updated', { heroId: hero?.id });
      return respondSuccess(hero, 200);

    } else {
      // Regular JSON body
      try {
        body = await request.json();
      } catch (e) {
        return respondError(new AppError("Invalid JSON body", 400));
      }

      const hero = await heroService.updateHero(heroId, body);
      logger.info('Hero updated', { heroId: hero?.id });
      return respondSuccess(hero, 200);
    }
  } catch (error) {
    logger.error('Error updating hero', { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Gagal memperbarui data hero", 500));
  }
}

// DELETE - Delete hero
export async function DELETE(request, { params }) {
  try {
    await requireAuthWithPermission(request, "hero.delete");
    const { id } = await params;
    logger.info('API DELETE /api/admin/hero/:id called', { id });

    await heroService.deleteHero(parseInt(id));

    logger.info('Hero deleted', { id });

    return respondSuccess(null, 200);
  } catch (error) {
    logger.error('Error deleting hero', { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Gagal menghapus hero", 500));
  }
}
