import type { H3Event } from "h3";
import type { Role } from "#shared/types";

/**
 * Require the current session to belong to an admin user.
 *
 * Throws the standard envelope (401 / 403) on failure — let it bubble,
 * do not catch in handlers.
 */
export async function requireAdmin(event: H3Event) {
  return requireUserSession(event, {
    user: { role: "admin" },
  });
}

/**
 * Require the current session to belong to a user with one of the given roles.
 * Single role or array of allowed roles.
 */
export async function requireRole(event: H3Event, role: Role | Role[]) {
  return requireUserSession(event, {
    user: { role },
  });
}
