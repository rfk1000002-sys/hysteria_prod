import { AppError } from "../../../../lib/response.js";
import { findHomepagePlatformCards, listPlatformOptions, replaceHomepagePlatformCards } from "../repositories/homepagePlatform.repository.js";
import { validateHomepagePlatformPayload } from "../validators/homepagePlatform.validator.js";

function toAdminCard(card) {
  return {
    id: card.id,
    platformId: card.platformId,
    platformName: card.platform?.name || "",
    platformSlug: card.platform?.slug || "",
    platformImageUrl: card.platform?.mainImageUrl || null,
    titleOverride: card.titleOverride || "",
    imageUrlOverride: card.imageUrlOverride || "",
    linkUrl: card.linkUrl || "",
    slotType: card.slotType,
    order: card.order,
    isActive: card.isActive,
  };
}

function assertCardConstraints(cards) {
  const activeCards = cards.filter((card) => card.isActive);
  if (activeCards.length !== 5) {
    throw new AppError("Harus ada tepat 5 kartu aktif", 400, "VALIDATION_ERROR");
  }

  const tallCount = activeCards.filter((card) => card.slotType === "tall").length;
  const shortCount = activeCards.filter((card) => card.slotType === "short").length;

  if (tallCount !== 3 || shortCount !== 2) {
    throw new AppError("Komposisi kartu harus 3 Tall dan 2 Short", 400, "VALIDATION_ERROR");
  }

  const platformIds = activeCards.map((card) => card.platformId);
  if (new Set(platformIds).size !== platformIds.length) {
    throw new AppError("Setiap kartu harus memilih platform yang berbeda", 400, "VALIDATION_ERROR");
  }

  const orders = activeCards.map((card) => card.order);
  if (new Set(orders).size !== orders.length) {
    throw new AppError("Order kartu tidak boleh duplikat", 400, "VALIDATION_ERROR");
  }
}

export async function getHomepagePlatformSettings() {
  const [cards, platformOptions] = await Promise.all([findHomepagePlatformCards(), listPlatformOptions()]);

  return {
    cards: cards.map(toAdminCard),
    platformOptions,
  };
}

export async function saveHomepagePlatformSettings(payload) {
  let validated;
  try {
    validated = validateHomepagePlatformPayload(payload);
  } catch (error) {
    throw new AppError(error.errors?.[0]?.message || "Payload tidak valid", 400, "VALIDATION_ERROR");
  }

  assertCardConstraints(validated.cards);

  const saved = await replaceHomepagePlatformCards(
    validated.cards.map((card) => ({
      platformId: card.platformId,
      titleOverride: card.titleOverride,
      imageUrlOverride: card.imageUrlOverride,
      linkUrl: card.linkUrl,
      slotType: card.slotType,
      order: card.order,
      isActive: card.isActive,
    })),
  );

  return saved.map(toAdminCard);
}
