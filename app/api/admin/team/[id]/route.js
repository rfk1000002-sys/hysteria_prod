import { respondSuccess, respondError, AppError } from "../../../../../lib/response.js";
import logger from "../../../../../lib/logger.js";
import { requireAuthWithPermission } from "../../../../../lib/helper/permission.helper.js";
import { getTeamCategoryById, updateTeamCategory, deleteTeamCategory, getTeamMemberById, updateTeamMember, deleteTeamMember } from "../../../../../modules/admin/team/index.js";

const resolveType = (request, body) => {
  const { searchParams } = new URL(request.url);
  return body?.type || searchParams.get("type");
};

// GET - Fetch single team category or member
export async function GET(request, { params }) {
  try {
    await requireAuthWithPermission(request, "team.read");

    const { id } = await params;
    const entityId = parseInt(id, 10);
    if (!entityId || isNaN(entityId)) {
      return respondError(new AppError("Invalid team id", 400));
    }

    const type = resolveType(request, {});
    if (type === "member") {
      const member = await getTeamMemberById(entityId);
      return respondSuccess(member, 200);
    }

    if (type === "category") {
      const category = await getTeamCategoryById(entityId);
      return respondSuccess(category, 200);
    }

    throw new AppError("Invalid team payload type", 400);
  } catch (error) {
    logger.error("Error fetching team entity", { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Failed to fetch team entity", 500));
  }
}

// PUT - Update team category or member
export async function PUT(request, { params }) {
  try {
    await requireAuthWithPermission(request, "team.update");

    const { id } = await params;
    const entityId = parseInt(id, 10);
    if (!entityId || isNaN(entityId)) {
      return respondError(new AppError("Invalid team id", 400));
    }

    const body = await request.json();
    const type = resolveType(request, body);

    if (type === "member") {
      const member = await updateTeamMember(entityId, body);
      return respondSuccess(member, 200);
    }

    if (type === "category") {
      const category = await updateTeamCategory(entityId, body);
      return respondSuccess(category, 200);
    }

    throw new AppError("Invalid team payload type", 400);
  } catch (error) {
    logger.error("Error updating team entity", { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Failed to update team entity", 500));
  }
}

// DELETE - Delete team category or member
export async function DELETE(request, { params }) {
  try {
    await requireAuthWithPermission(request, "team.delete");

    const { id } = await params;
    const entityId = parseInt(id, 10);
    if (!entityId || isNaN(entityId)) {
      return respondError(new AppError("Invalid team id", 400));
    }

    const type = resolveType(request, {});
    if (type === "member") {
      const result = await deleteTeamMember(entityId);
      return respondSuccess(result, 200);
    }

    if (type === "category") {
      const result = await deleteTeamCategory(entityId);
      return respondSuccess(result, 200);
    }

    throw new AppError("Invalid team payload type", 400);
  } catch (error) {
    logger.error("Error deleting team entity", { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Failed to delete team entity", 500));
  }
}
