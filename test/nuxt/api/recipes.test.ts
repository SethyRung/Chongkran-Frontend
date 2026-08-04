import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";
import { isSuccessResponse } from "#shared/utils";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/recipes", () => {
  it("returns the standard envelope with an array data field", async () => {
    const res = await $fetch("/api/recipes");
    expect(res.status.code).toBe("SUCCESS");
    expect(Array.isArray(res.data)).toBe(true);
    if (isSuccessResponse(res)) {
      expect(res.meta).toEqual(
        expect.objectContaining({
          total: expect.any(Number),
          limit: expect.any(Number),
          offset: expect.any(Number),
        }),
      );
    }
  });
});

describe("GET /api/recipes/:id", () => {
  it("returns the NotFound envelope (HTTP 200) for a non-existent recipe id", async () => {
    const res = await $fetch("/api/recipes/non-existent-id");
    expect(res.status.code).toBe("NOT_FOUND");
    expect(res.data).toBeNull();
  });
});

describe("GET /api/recipes/popular", () => {
  it("returns the standard envelope with an array data field", async () => {
    const res = await $fetch("/api/recipes/popular");
    expect(res.status.code).toBe("SUCCESS");
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("orders approved recipes by views desc", async () => {
    const res = await $fetch("/api/recipes/popular");
    if (!isSuccessResponse(res) || !res.data || res.data.length < 2) return;
    const views = res.data.map((r: { views?: number }) => r.views ?? 0);
    for (let i = 1; i < views.length; i++) {
      expect(views[i - 1] ?? 0).toBeGreaterThanOrEqual(views[i] ?? 0);
    }
  });

  it("respects the limit query param (clamped)", async () => {
    const res = await $fetch("/api/recipes/popular", { query: { limit: 3 } });
    expect(res.data?.length ?? 0).toBeLessThanOrEqual(3);
  });
});
