import { NextResponse } from "next/server";
import {
  respondSuccess,
  respondError,
  AppError,
} from "../../../../lib/response";
import { requireAuthWithPermission } from "../../../../lib/helper/permission.helper";
import logger from "../../../../lib/logger.js";
import {
  parseMultipartForm,
  validateFileMimeType,
  validateFileSize,
} from "../../../../lib/upload/multipart";
import {
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "../../../../modules/admin/hero/validators/hero.validator.js";
import * as heroService from "../../../../modules/admin/hero/services/hero.service.js";

// GET - Fetch all hero sections
export async function GET(request) {
  try {
    await requireAuthWithPermission(request, "hero.read");

    logger.info("API GET /api/admin/hero called", { url: request.url });

    // Parse query parameters with defaults
    const { searchParams } = new URL(request.url);

    const options = {
      perPage: 10,
      cursor: null,
      isActive: null,
    };

    // Only set if provided
    if (searchParams.has("perPage")) {
      const perPage = parseInt(searchParams.get("perPage"), 10);
      if (!isNaN(perPage) && perPage > 0 && perPage <= 100) {
        options.perPage = perPage;
      }
    }

    if (searchParams.has("cursor")) {
      const cursor = parseInt(searchParams.get("cursor"), 10);
      if (!isNaN(cursor) && cursor > 0) {
        options.cursor = cursor;
      }
    }

    if (searchParams.has("isActive")) {
      const isActive = searchParams.get("isActive");
      options.isActive = isActive === "true";
    }

    const result = await heroService.getAllHeroes(options);

    logger.info("Fetched heroes", {
      count: Array.isArray(result.heroes) ? result.heroes.length : undefined,
    });

    return respondSuccess(result, 200);
  } catch (error) {
    console.error("Error fetching heroes:", error);
    console.error("Error stack:", error.stack);
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Failed to fetch heroes", 500));
  }
}

// POST - Create new hero section (supports JSON or multipart with file upload)
export async function POST(request) {
  try {
    await requireAuthWithPermission(request, "hero.create");
    logger.info("API POST /api/admin/hero (file-only) called", {
      url: request.url,
    });

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return respondError(
        new AppError("Hero creation requires multipart file upload", 400),
      );
    }

    // Max possible upload size (5MB)
    const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

    const { fields, files } = await parseMultipartForm(request, {
      maxFileSize: MAX_UPLOAD_SIZE,
    });

    const body = fields;
    if (body.isActive !== undefined) {
      body.isActive = body.isActive === "true" || body.isActive === true;
    }

    if (!files || files.length === 0) {
      return respondError(new AppError("File media (gambar/video) wajib diunggah", 400));
    }

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

    const hero = await heroService.createHeroWithFile(body, file);
    logger.info("Hero created with file", {
      heroId: hero?.id,
      file: file.originalFilename || file.newFilename || file.name,
    });
    return respondSuccess(hero, 201);
  } catch (error) {
    logger.error("Error creating hero", {
      error: error && (error.stack || error.message || error),
    });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Gagal menyimpan data hero ke server", 500));
  }
}
