import { z } from "zod";

const slugSchema = z
  .string()
  .min(1, "Platform slug is required")
  .max(100, "Platform slug must not exceed 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Platform slug must be lowercase alphanumeric with hyphens only");

const optionalText = (max, message) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === "null") return undefined;
    return val;
  }, z.string().max(max, message).optional().nullable());

const optionalUrl = (max, message) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === "null") return undefined;
    return val;
  }, z.string().url(message).max(max, `${message} must not exceed ${max} characters`).optional().nullable());

const mainImageUrlSchema = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === "null") return null;
    return val;
  },
  z
    .string()
    .max(500, "Image URL must not exceed 500 characters")
    .refine(
      (url) => {
        if (!url || typeof url !== "string") return false;
        if (url.startsWith("/")) {
          return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url);
        }
        try {
          const parsed = new URL(url);
          return parsed.protocol === "https:" || parsed.protocol === "http:";
        } catch {
          return false;
        }
      },
      { message: "Image URL must be a valid local path or HTTP(S) URL" },
    )
    .nullable(),
);

export const platformSlugSchema = z.object({
  slug: slugSchema,
});

export const updatePlatformSchema = z.object({
  slug: slugSchema,
  headline: optionalText(500, "Headline must not exceed 500 characters"),
  subHeadline: optionalText(5000, "Sub-headline must not exceed 5000 characters"),
  instagram: optionalUrl(500, "Instagram URL"),
  youtube: optionalUrl(500, "YouTube URL"),
  youtubeProfile: optionalUrl(500, "YouTube profile URL"),
  mainImageUrl: mainImageUrlSchema.optional(),
});

export function validatePlatformData(data, schema) {
  return schema.parse(data);
}
