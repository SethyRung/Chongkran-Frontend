import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/categories", () => {
  it("returns an empty list with the standard envelope", async () => {
    const res = await $fetch("/api/categories");
    expect(res.status.code).toBe("SUCCESS");
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("includes a non-negative recipeCount on every category", async () => {
    const res = await $fetch("/api/categories");
    expect(res.status.code).toBe("SUCCESS");
    for (const category of res.data ?? []) {
      expect(typeof category.recipeCount).toBe("number");
      expect(category.recipeCount).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("POST /api/categories", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/categories", {
      method: "POST",
      body: { name: "Should Fail" },
    });
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});
