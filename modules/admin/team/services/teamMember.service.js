import { AppError } from "../../../../lib/response.js";
import logger from "../../../../lib/logger.js";
import * as teamMemberRepository from "../repositories/teamMember.repository.js";
import * as teamCategoryRepository from "../repositories/teamCategory.repository.js";
import { createTeamMemberSchema, updateTeamMemberSchema, validateTeamMemberData } from "../validators/teamMember.validator.js";

const toSlug = (value) => {
  const base = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "item";
};

export async function getTeamMemberById(id) {
  const member = await teamMemberRepository.findTeamMemberById(id);
  if (!member) {
    throw new AppError("Team member not found", 404);
  }
  return member;
}

export async function createTeamMember(data) {
  const payload = { ...data };
  delete payload.type;
  if (!payload.slug && payload.name) {
    payload.slug = toSlug(payload.name);
  }

  let validatedData;
  try {
    validatedData = validateTeamMemberData(payload, createTeamMemberSchema);
  } catch (error) {
    logger.warn("Team member validation failed", { payload, error: error.errors });
    throw new AppError(error.errors?.[0]?.message || "Invalid team member data", 400, "VALIDATION_ERROR");
  }

  const category = await teamCategoryRepository.findTeamCategoryById(validatedData.categoryId);
  if (!category) {
    throw new AppError("Team category not found", 404);
  }

  const existing = await teamMemberRepository.findTeamMemberBySlugName(validatedData.slug, validatedData.name);
  if (existing) {
    throw new AppError("Team member with this slug and name already exists", 400);
  }

  try {
    const member = await teamMemberRepository.createTeamMember(validatedData);
    logger.info("Team member created", { memberId: member.id, categoryId: member.categoryId });
    return member;
  } catch (error) {
    logger.error("Error creating team member", { error: error.message });
    throw new AppError("Failed to create team member", 500);
  }
}

export async function updateTeamMember(id, data) {
  const existingMember = await getTeamMemberById(id);

  const payload = { ...data };
  delete payload.type;
  if (!payload.slug && payload.name) {
    payload.slug = toSlug(payload.name);
  }

  let validatedData;
  try {
    validatedData = validateTeamMemberData(payload, updateTeamMemberSchema);
  } catch (error) {
    logger.warn("Team member update validation failed", { memberId: id, error: error.errors });
    throw new AppError(error.errors?.[0]?.message || "Invalid team member data", 400, "VALIDATION_ERROR");
  }

  const nextName = validatedData.name ?? existingMember.name;
  const nextSlug = validatedData.slug ?? existingMember.slug;
  if (nextName && nextSlug) {
    const conflict = await teamMemberRepository.findTeamMemberBySlugName(nextSlug, nextName);
    if (conflict && conflict.id !== id) {
      throw new AppError("Team member with this slug and name already exists", 400);
    }
  }

  if (validatedData.categoryId) {
    const category = await teamCategoryRepository.findTeamCategoryById(validatedData.categoryId);
    if (!category) {
      throw new AppError("Team category not found", 404);
    }
  }

  try {
    const member = await teamMemberRepository.updateTeamMember(id, validatedData);
    logger.info("Team member updated", { memberId: id, changes: Object.keys(validatedData) });
    return member;
  } catch (error) {
    logger.error("Error updating team member", { memberId: id, error: error.message });
    throw new AppError("Failed to update team member", 500);
  }
}

export async function deleteTeamMember(id) {
  await getTeamMemberById(id);

  try {
    await teamMemberRepository.deleteTeamMember(id);
    logger.info("Team member deleted", { memberId: id });
    return { message: "Team member deleted successfully" };
  } catch (error) {
    logger.error("Error deleting team member", { memberId: id, error: error.message });
    throw new AppError("Failed to delete team member", 500);
  }
}
