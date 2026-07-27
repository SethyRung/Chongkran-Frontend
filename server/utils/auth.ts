import type { H3Event } from "h3";
import { type Role, ApiResponseCode } from "#shared/types";

/**
 * Reply with an error envelope and halt the handler.
 *
 * We write the body ourselves (so clients receive our ApiResponse shape, not
 * h3's `{ statusCode, statusMessage, data }` wrapper), then rethrow so the
 * caller stops. h3's sendError no-ops once the response is ended.
 */
function authFail(
  event: H3Event,
  code: ApiResponseCode.Unauthorized | ApiResponseCode.Forbidden,
  message: string,
): never {
  // HTTP 200 + error envelope (project convention); body carries the real status.
  const body = createResponse({ code, message });
  event.node.res.setHeader("content-type", "application/json");
  event.node.res.end(JSON.stringify(body));
  // Halt the handler; sendError no-ops because res is already ended.
  throw createError({ statusCode: 200, statusMessage: message, data: body });
}

/**
 * Require an authenticated session (any role). Returns the session on success;
 * on failure replies with the Unauthorized envelope (HTTP 200) and halts.
 */
export async function requireSession(event: H3Event) {
  try {
    return await requireUserSession(event);
  } catch {
    authFail(event, ApiResponseCode.Unauthorized, "Authentication required");
  }
}

/**
 * Require the current session to belong to an admin user.
 */
export async function requireAdmin(event: H3Event) {
  try {
    return await requireUserSession(event, { user: { role: "admin" } });
  } catch (err) {
    const unauth = (err as { statusCode?: number }).statusCode === 401;
    authFail(
      event,
      unauth ? ApiResponseCode.Unauthorized : ApiResponseCode.Forbidden,
      unauth ? "Authentication required" : "Admin access required",
    );
  }
}

/**
 * Require the current session to belong to a user with one of the given roles.
 * Single role or array of allowed roles.
 */
export async function requireRole(event: H3Event, role: Role | Role[]) {
  try {
    return await requireUserSession(event, { user: { role } });
  } catch (err) {
    const unauth = (err as { statusCode?: number }).statusCode === 401;
    authFail(
      event,
      unauth ? ApiResponseCode.Unauthorized : ApiResponseCode.Forbidden,
      unauth ? "Authentication required" : "Access denied",
    );
  }
}
