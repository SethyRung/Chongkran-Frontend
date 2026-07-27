import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/categories", () => {
  it("returns an empty list with the standard envelope", async () => {
    const res = await $fetch("/api/categories");
    expect(res.status.code).toBe("SUCCESS");
    expect(Array.isArray(res.data)).toBe(true);
  });
});

describe("POST /api/categories", () => {
  it("rejects unauthenticated callers with 401/403", async () => {
    let status: number | undefined;
    try {
      await $fetch("/api/categories", {
        method: "POST",
        body: { name: "Should Fail" },
      });
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    expect([401, 403]).toContain(status);
  });
});
