import type { H3Event } from "h3";

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
