import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "../../lib/jwt.js";
import { COOKIE_NAMES } from "../../config/cookie.config.js";
import { ROLE_KEYS } from "../../modules/auth/domain/role.constants.js";
import { STATUS_KEYS } from "../../modules/auth/domain/status.constants.js";
import logger from "../../lib/logger.js";
import AdminShell from "./partial/AdminShell.jsx";

export default async function AdminLayout({ children }) {
	// `cookies()` can be async in some Next versions / runtimes
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAMES.access)?.value;
	if (!token) {
		logger.warn('AdminLayout: missing access token, redirecting to login')
		redirect("/auth/login");
	}

	try {
		const payload = verifyAccessToken(token);
		const roles = payload.roles || [];
		const status = payload.status;
		const hasRole = roles.includes(ROLE_KEYS.SUPERADMIN) || roles.includes(ROLE_KEYS.ADMIN);

		if (!hasRole || status !== STATUS_KEYS.ACTIVE) {
			logger.warn('AdminLayout: unauthorized access attempt', { userId: payload.sub, roles, status })
			redirect("/auth/login");
		}
	} catch (error) {
		logger.error('AdminLayout: token verification failed', { error: error.message })
		redirect("/auth/login");
	}

	return (
		<AdminShell>{children}</AdminShell>
	);
}
