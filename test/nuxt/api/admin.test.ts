import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/admin/stats", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/admin/stats");
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});
