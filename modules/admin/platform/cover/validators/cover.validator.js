import { z } from "zod";

const optionalText = (max, message) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === "null") return undefined;
    return val;
  }, z.string().max(max, message).optional().nullable());

export const updateCoverSchema = z.object({
  title: optionalText(500, "Title must not exceed 500 characters"),
  subtitle: optionalText(2000, "Subtitle must not exceed 2000 characters"),
});

export function validateCoverData(data, schema = updateCoverSchema) {
  return schema.parse(data);
}
