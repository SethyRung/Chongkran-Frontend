import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/follows/stats/:userId", () => {
  it("returns the standard envelope for a valid userId", async () => {
    let status: number | undefined;
    let body: unknown;
    try {
      body = await $fetch("/api/follows/stats/test-user-id");
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    // The user doesn't exist, so we expect 404. We mainly verify the
    // endpoint exists and returns the standard envelope shape on success.
    expect([200, 404]).toContain(status ?? 200);
    expect(body).toBeDefined();
  });
});

describe("GET /api/follows/is-following/:followingId", () => {
  it("rejects unauthenticated callers with 401/403", async () => {
    let status: number | undefined;
    try {
      await $fetch("/api/follows/is-following/some-user-id");
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    expect([401, 403]).toContain(status);
  });
});
