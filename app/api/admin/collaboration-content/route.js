import { respondSuccess, respondError, AppError } from "../../../../lib/response.js";
import logger from "../../../../lib/logger.js";
import { requireAuthWithPermission } from "../../../../lib/helper/permission.helper.js";
import {
  getAdminCollaborationContent,
  upsertAdminCollaborationContent,
} from "../../../../modules/admin/collaboration/index.js";

function mapPrismaRouteError(error) {
  const code = error?.code;

  if (code === "P2021") {
    return new AppError("Collaboration content table is not available. Please run Prisma migrations.", 500);
  }

  if (code === "P2022") {
    return new AppError("Collaboration content schema is out of sync. Please run Prisma migrations.", 500);
  }

  return null;
}

export async function GET(request) {
  try {
    await requireAuthWithPermission(request, ["tentang.read"]);
    const collaboration = await getAdminCollaborationContent();
    return respondSuccess({ collaboration }, 200);
  } catch (error) {
    logger.error("Error fetching admin collaboration content", { error: error && (error.stack || error.message || error) });

    const prismaError = mapPrismaRouteError(error);
    if (prismaError) return respondError(prismaError);

    if (error instanceof AppError) return respondError(error);
    return respondError(new AppError("Failed to fetch collaboration content", 500));
  }
}

export async function PUT(request) {
  try {
    await requireAuthWithPermission(request, ["tentang.update"]);
    const body = await request.json();
    const collaboration = await upsertAdminCollaborationContent(body || {});
    return respondSuccess({ collaboration }, 200);
  } catch (error) {
    logger.error("Error saving admin collaboration content", { error: error && (error.stack || error.message || error) });

    const prismaError = mapPrismaRouteError(error);
    if (prismaError) return respondError(prismaError);

    if (error instanceof AppError) return respondError(error);
    return respondError(new AppError("Failed to save collaboration content", 500));
  }
}
