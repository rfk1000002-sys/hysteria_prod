import { AppError } from "../../../../lib/response.js";
import logger from "../../../../lib/logger.js";
import Uploads from "../../../../lib/upload/uploads.js";
import * as platformRepository from "../repositories/platform.repository.js";
import * as platformImageRepository from "../repositories/platformImage.repository.js";
import { platformSlugSchema, updatePlatformSchema, validatePlatformData } from "../validators/platform.validator.js";

const normalizeSlug = (slug) =>
  String(slug || "")
    .trim()
    .toLowerCase();

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

export async function getPlatformBySlug(slug) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][GET] Start", { slug: normalizedSlug });

  let validated;
  try {
    validated = validatePlatformData({ slug: normalizedSlug }, platformSlugSchema);
  } catch (error) {
    throw new AppError(error?.errors?.[0]?.message || "Invalid platform slug", 400, "VALIDATION_ERROR");
  }

  const platform = await platformRepository.findPlatformBySlugWithImages(validated.slug);
  logger.info("[Platform][Service][GET] Success", { slug: validated.slug, found: !!platform });
  return platform;
}

export async function listPlatforms() {
  logger.info("[Platform][Service][LIST] Start");
  const platforms = await platformRepository.listAllPlatforms(true);
  logger.info("[Platform][Service][LIST] Success", { count: Array.isArray(platforms) ? platforms.length : 0 });
  return Array.isArray(platforms) ? platforms : [];
}

export async function updatePlatformBySlug(slug, data = {}) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][UPDATE] Start", {
    slug: normalizedSlug,
    dataKeys: Object.keys(data || {}),
  });

  let validated;
  try {
    validated = validatePlatformData({ ...data, slug: normalizedSlug }, updatePlatformSchema);
  } catch (error) {
    logger.warn("[Platform][Service][UPDATE] Validation failed", { slug: normalizedSlug, error: error?.errors });
    throw new AppError(error?.errors?.[0]?.message || "Invalid platform data", 400, "VALIDATION_ERROR");
  }

  const { slug: validatedSlug, ...payload } = validated;
  const existing = await platformRepository.findPlatformBySlug(validatedSlug);

  if (!existing) {
    throw new AppError(`Platform '${validatedSlug}' not found`, 404, "NOT_FOUND");
  }

  const platform = await platformRepository.upsertPlatformBySlug(validatedSlug, payload);
  logger.info("[Platform][Service][UPDATE] Success", { slug: validatedSlug, id: platform?.id });
  return platform;
}

export async function updatePlatformWithMainImage(slug, data = {}, file) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][UPLOAD] Start", {
    slug: normalizedSlug,
    fileName: file?.originalname || file?.filename || null,
    fileType: file?.mimetype || null,
  });

  let validated;
  try {
    validated = validatePlatformData(
      { ...data, slug: normalizedSlug },
      updatePlatformSchema.omit({ mainImageUrl: true }),
    );
  } catch (error) {
    logger.warn("[Platform][Service][UPLOAD] Validation failed", { slug: normalizedSlug, error: error?.errors });
    throw new AppError(error?.errors?.[0]?.message || "Invalid platform data", 400, "VALIDATION_ERROR");
  }

  const existing = await platformRepository.findPlatformBySlug(validated.slug);
  if (!existing) {
    throw new AppError(`Platform '${validated.slug}' not found`, 404, "NOT_FOUND");
  }

  const uploads = new Uploads();
  let uploadedUrl = null;

  try {
    logger.info("[Platform][Service][UPLOAD] Uploading main image", { slug: validated.slug });
    const uploadResult = await uploads.handleUpload(file);
    uploadedUrl = uploadResult?.url;

    if (!uploadedUrl) {
      throw new AppError("Failed to upload image", 500);
    }

    const { slug: validatedSlug, ...textFields } = validated;
    const payload = { ...textFields, mainImageUrl: uploadedUrl };
    const platform = await platformRepository.upsertPlatformBySlug(validatedSlug, payload);

    logger.info("[Platform][Service][UPLOAD] Persisted", { slug: validatedSlug, id: platform?.id });

    if (existing.mainImageUrl && existing.mainImageUrl !== uploadedUrl && isManagedUpload(existing.mainImageUrl)) {
      try {
        await uploads.deleteFile(existing.mainImageUrl);
      } catch (cleanupError) {
        logger.warn("[Platform][Service][UPLOAD] Failed to delete old main image", {
          slug: validatedSlug,
          oldImage: existing.mainImageUrl,
          error: cleanupError?.message,
        });
      }
    }

    return platform;
  } catch (error) {
    logger.error("[Platform][Service][UPLOAD] Failed", { slug: normalizedSlug, error: error?.message });
    if (uploadedUrl) {
      try {
        await uploads.deleteFile(uploadedUrl);
      } catch (cleanupError) {
        logger.warn("[Platform][Service][UPLOAD] Cleanup failed", { uploadedUrl, error: cleanupError?.message });
      }
    }
    if (error instanceof AppError) throw error;
    throw new AppError(error?.message || "Failed to save platform", 500);
  }
}

export async function getPlatformImages(slug, type = null) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][IMAGES] Start", { slug: normalizedSlug, type });

  const platform = await platformRepository.findPlatformBySlug(normalizedSlug);
  if (!platform) {
    throw new AppError(`Platform '${normalizedSlug}' not found`, 404, "NOT_FOUND");
  }

  const images = await platformImageRepository.listImagesByPlatformId(platform.id, type || null);
  return Array.isArray(images) ? images : [];
}

export async function getPlatformImage(slug, key) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][IMAGE-GET] Start", { slug: normalizedSlug, key });

  const platform = await platformRepository.findPlatformBySlug(normalizedSlug);
  if (!platform) {
    throw new AppError(`Platform '${normalizedSlug}' not found`, 404, "NOT_FOUND");
  }

  const image = await platformImageRepository.findImageByPlatformAndKey(platform.id, key);
  if (!image) {
    throw new AppError(`Image '${key}' not found for platform '${normalizedSlug}'`, 404, "NOT_FOUND");
  }

  logger.info("[Platform][Service][IMAGE-GET] Success", { slug: normalizedSlug, key, id: image.id });
  return image;
}

export async function updatePlatformImage(slug, key, data = {}) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][IMAGE-UPDATE] Start", { slug: normalizedSlug, key });

  const platform = await platformRepository.findPlatformBySlug(normalizedSlug);
  if (!platform) {
    throw new AppError(`Platform '${normalizedSlug}' not found`, 404, "NOT_FOUND");
  }

  const existing = await platformImageRepository.findImageByPlatformAndKey(platform.id, key);
  if (!existing) {
    throw new AppError(`Image '${key}' not found for platform '${normalizedSlug}'`, 404, "NOT_FOUND");
  }

  const payload = {};
  if (data?.title !== undefined) payload.title = data.title;
  if (data?.subtitle !== undefined) payload.subtitle = data.subtitle;

  const image = await platformImageRepository.upsertImageByKey(platform.id, key, payload);
  logger.info("[Platform][Service][IMAGE-UPDATE] Success", { slug: normalizedSlug, key, id: image?.id });
  return image;
}

export async function updatePlatformImageWithFile(slug, key, data = {}, file) {
  const normalizedSlug = normalizeSlug(slug);
  logger.info("[Platform][Service][IMAGE-UPLOAD] Start", {
    slug: normalizedSlug,
    key,
    fileName: file?.originalname || file?.filename || null,
    fileType: file?.mimetype || null,
  });

  const platform = await platformRepository.findPlatformBySlug(normalizedSlug);
  if (!platform) {
    throw new AppError(`Platform '${normalizedSlug}' not found`, 404, "NOT_FOUND");
  }

  const existing = await platformImageRepository.findImageByPlatformAndKey(platform.id, key);
  if (!existing) {
    throw new AppError(`Image '${key}' not found for platform '${normalizedSlug}'`, 404, "NOT_FOUND");
  }

  const uploads = new Uploads();
  let uploadedUrl = null;

  try {
    const uploadResult = await uploads.handleUpload(file);
    uploadedUrl = uploadResult?.url;

    if (!uploadedUrl) {
      throw new AppError("Failed to upload image", 500);
    }

    const payload = { imageUrl: uploadedUrl };
    if (data?.title !== undefined) payload.title = data.title;
    if (data?.subtitle !== undefined) payload.subtitle = data.subtitle;

    const image = await platformImageRepository.upsertImageByKey(platform.id, key, payload);
    logger.info("[Platform][Service][IMAGE-UPLOAD] Persisted", { slug: normalizedSlug, key, id: image?.id });

    if (existing.imageUrl && existing.imageUrl !== uploadedUrl && isManagedUpload(existing.imageUrl)) {
      try {
        await uploads.deleteFile(existing.imageUrl);
      } catch (cleanupError) {
        logger.warn("[Platform][Service][IMAGE-UPLOAD] Failed to delete old image", {
          slug: normalizedSlug,
          key,
          oldImage: existing.imageUrl,
          error: cleanupError?.message,
        });
      }
    }

    return image;
  } catch (error) {
    logger.error("[Platform][Service][IMAGE-UPLOAD] Failed", { slug: normalizedSlug, key, error: error?.message });
    if (uploadedUrl) {
      try {
        await uploads.deleteFile(uploadedUrl);
      } catch (cleanupError) {
        logger.warn("[Platform][Service][IMAGE-UPLOAD] Cleanup failed", { uploadedUrl, error: cleanupError?.message });
      }
    }
    if (error instanceof AppError) throw error;
    throw new AppError(error?.message || "Failed to save image", 500);
  }
}
