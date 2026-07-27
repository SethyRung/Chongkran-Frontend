import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/follows/stats/:userId (public)", () => {
  it("returns the NotFound envelope (HTTP 200) for a non-existent user", async () => {
    const res = await $fetch("/api/follows/stats/test-user-id");
    expect(res.status.code).toBe("NOT_FOUND");
    expect(res.data).toBeNull();
  });
});

describe("GET /api/follows/is-following/:followingId", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/follows/is-following/some-user-id");
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});
