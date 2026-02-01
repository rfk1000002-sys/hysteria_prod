import { respondSuccess, respondError, AppError } from "../../../../lib/response.js";
import logger from "../../../../lib/logger.js";
import { requireAuthWithPermission } from "../../../../lib/helper/permission.helper.js";
import { getTeamCategoriesWithMembers, createTeamCategory, createTeamMember } from "../../../../modules/admin/team/index.js";

// GET - Fetch team categories with members
export async function GET(request) {
  try {
    await requireAuthWithPermission(request, "team.read");

    const { searchParams } = new URL(request.url);
    const perPage = searchParams.get("perPage");
    const cursor = searchParams.get("cursor");
    const isActive = searchParams.get("isActive");

    const perPageValue = perPage ? parseInt(perPage, 10) : undefined;
    const cursorValue = cursor ? parseInt(cursor, 10) : undefined;

    const options = {
      perPage: Number.isFinite(perPageValue) && perPageValue > 0 ? perPageValue : 50,
      cursor: Number.isFinite(cursorValue) && cursorValue > 0 ? cursorValue : null,
      isActive: isActive === null ? null : isActive === "true",
    };

    const result = await getTeamCategoriesWithMembers(options);
    return respondSuccess(result, 200);
  } catch (error) {
    logger.error("Error fetching team categories", { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Failed to fetch team data", 500));
  }
}

// POST - Create team category or member
export async function POST(request) {
  try {
    await requireAuthWithPermission(request, "team.create");

    const body = await request.json();
    const type = body?.type;

    if (type === "category") {
      const category = await createTeamCategory(body);
      return respondSuccess(category, 201);
    }

    if (type === "member") {
      const member = await createTeamMember(body);
      return respondSuccess(member, 201);
    }

    throw new AppError("Invalid team payload type", 400);
  } catch (error) {
    logger.error("Error creating team entity", { error: error && (error.stack || error.message || error) });
    if (error instanceof AppError) {
      return respondError(error);
    }
    return respondError(new AppError("Failed to create team entity", 500));
  }
}
