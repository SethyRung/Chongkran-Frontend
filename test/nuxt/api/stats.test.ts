import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";
import { isSuccessResponse } from "#shared/utils";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/stats", () => {
  it("returns non-negative counts for recipes, categories, and authors", async () => {
    const res = await $fetch("/api/stats");
    expect(res.status.code).toBe("SUCCESS");
    if (!isSuccessResponse(res) || !res.data) return;
    expect(res.data).toEqual(
      expect.objectContaining({
        recipes: expect.any(Number),
        categories: expect.any(Number),
        authors: expect.any(Number),
      }),
    );
    expect(res.data.recipes).toBeGreaterThanOrEqual(0);
    expect(res.data.categories).toBeGreaterThanOrEqual(0);
    expect(res.data.authors).toBeGreaterThanOrEqual(0);
  });
});
