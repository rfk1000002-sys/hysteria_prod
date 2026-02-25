import { AppError } from "../../../../../lib/response.js";
import logger from "../../../../../lib/logger.js";
import Uploads from "../../../../../lib/upload/uploads.js";
import * as platformRepository from "../../repositories/platform.repository.js";
import * as platformImageRepository from "../../repositories/platformImage.repository.js";
import { updateCoverSchema, validateCoverData } from "../validators/cover.validator.js";

const isManagedUpload = (source) => {
  if (!source || typeof source !== "string") return false;
  const normalized = source.replace(/\\/g, "/");
  if (normalized.startsWith("/uploads/") || normalized.startsWith("uploads/") || normalized.includes("/uploads/")) return true;
  if (process.env.S3_PUBLIC_URL) {
    const publicUrl = process.env.S3_PUBLIC_URL.replace(/\/$/, "");
    if (normalized.startsWith(publicUrl)) return true;
  }
  if (/s3\.amazonaws\.com/.test(normalized) || /s3[.-]/.test(normalized)) return true;
  return false;
};

async function resolvePlatformId(slug) {
  const platform = await platformRepository.findPlatformBySlug(slug);
  if (!platform) {
    throw new AppError(`Platform '${slug}' not found`, 404, "NOT_FOUND");
  }
  return platform.id;
}

export async function getCoverImage(slug, key) {
  logger.info("[Cover][Service][GET] Start", { slug, key });

  const platformId = await resolvePlatformId(slug);
  const image = await platformImageRepository.findImageByPlatformAndKey(platformId, key);

  if (!image) {
    throw new AppError(`Cover image '${key}' not found for platform '${slug}'`, 404, "NOT_FOUND");
  }
  if (image.type !== "cover") {
    throw new AppError(`Image '${key}' is not a cover image`, 400, "INVALID_TYPE");
  }

  logger.info("[Cover][Service][GET] Success", { slug, key, id: image.id });
  return image;
}

export async function listCoverImages(slug) {
  logger.info("[Cover][Service][LIST] Start", { slug });
  const platformId = await resolvePlatformId(slug);
  const images = await platformImageRepository.listImagesByPlatformId(platformId, "cover");
  logger.info("[Cover][Service][LIST] Success", { slug, count: Array.isArray(images) ? images.length : 0 });
  return Array.isArray(images) ? images : [];
}

export async function updateCoverImage(slug, key, data = {}) {
  logger.info("[Cover][Service][UPDATE] Start", { slug, key });

  let validated;
  try {
    validated = validateCoverData(data, updateCoverSchema);
  } catch (error) {
    throw new AppError(error?.errors?.[0]?.message || "Invalid cover data", 400, "VALIDATION_ERROR");
  }

  const platformId = await resolvePlatformId(slug);
  const existing = await platformImageRepository.findImageByPlatformAndKey(platformId, key);

  if (!existing) {
    throw new AppError(`Cover image '${key}' not found for platform '${slug}'`, 404, "NOT_FOUND");
  }
  if (existing.type !== "cover") {
    throw new AppError(`Image '${key}' is not a cover image`, 400, "INVALID_TYPE");
  }

  const image = await platformImageRepository.upsertImageByKey(platformId, key, validated);
  logger.info("[Cover][Service][UPDATE] Success", { slug, key, id: image?.id });
  return image;
}

export async function updateCoverImageWithFile(slug, key, data = {}, file) {
  logger.info("[Cover][Service][UPLOAD] Start", {
    slug,
    key,
    fileName: file?.originalname || file?.filename || null,
    fileType: file?.mimetype || null,
  });

  let validated;
  try {
    validated = validateCoverData(data, updateCoverSchema);
  } catch (error) {
    throw new AppError(error?.errors?.[0]?.message || "Invalid cover data", 400, "VALIDATION_ERROR");
  }

  const platformId = await resolvePlatformId(slug);
  const existing = await platformImageRepository.findImageByPlatformAndKey(platformId, key);

  if (!existing) {
    throw new AppError(`Cover image '${key}' not found for platform '${slug}'`, 404, "NOT_FOUND");
  }
  if (existing.type !== "cover") {
    throw new AppError(`Image '${key}' is not a cover image`, 400, "INVALID_TYPE");
  }

  const uploads = new Uploads();
  let uploadedUrl = null;

  try {
    logger.info("[Cover][Service][UPLOAD] Uploading file", { slug, key });
    const uploadResult = await uploads.handleUpload(file);
    uploadedUrl = uploadResult?.url;

    if (!uploadedUrl) {
      throw new AppError("Failed to upload image", 500);
    }

    const payload = { ...validated, imageUrl: uploadedUrl };
    const image = await platformImageRepository.upsertImageByKey(platformId, key, payload);

    logger.info("[Cover][Service][UPLOAD] Persisted", { slug, key, id: image?.id });

    if (existing.imageUrl && existing.imageUrl !== uploadedUrl && isManagedUpload(existing.imageUrl)) {
      try {
        await uploads.deleteFile(existing.imageUrl);
      } catch (cleanupError) {
        logger.warn("[Cover][Service][UPLOAD] Failed to delete old image", {
          slug,
          key,
          oldImage: existing.imageUrl,
          error: cleanupError?.message,
        });
      }
    }

    return image;
  } catch (error) {
    logger.error("[Cover][Service][UPLOAD] Failed", { slug, key, error: error?.message });
    if (uploadedUrl) {
      try {
        await uploads.deleteFile(uploadedUrl);
      } catch (cleanupError) {
        logger.warn("[Cover][Service][UPLOAD] Cleanup failed", { uploadedUrl, error: cleanupError?.message });
      }
    }
    if (error instanceof AppError) throw error;
    throw new AppError(error?.message || "Failed to save cover image", 500);
  }
}
