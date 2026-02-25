/**
 * Platform module
 * Handles platform page metadata, main images, and image slots (cover + hero).
 */

import * as platformService from "./services/platform.service.js";

export * from "./services/platform.service.js";
export * from "./repositories/platform.repository.js";
export * from "./repositories/platformImage.repository.js";
export * from "./validators/platform.validator.js";

// Convenience named exports
export const getPlatformBySlug = platformService.getPlatformBySlug;
export const listPlatforms = platformService.listPlatforms;
export const updatePlatformBySlug = platformService.updatePlatformBySlug;
export const updatePlatformWithMainImage = platformService.updatePlatformWithMainImage;
export const getPlatformImages = platformService.getPlatformImages;
export const getPlatformImage = platformService.getPlatformImage;
export const updatePlatformImage = platformService.updatePlatformImage;
export const updatePlatformImageWithFile = platformService.updatePlatformImageWithFile;
