import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/recipes", () => {
  it("returns the standard envelope with an array data field", async () => {
    const res = await $fetch("/api/recipes");
    expect(res.status.code).toBe("SUCCESS");
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.meta).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        limit: expect.any(Number),
        offset: expect.any(Number),
      }),
    );
  });
});

describe("GET /api/recipes/:id", () => {
  it("returns the NotFound envelope for a non-existent recipe id", async () => {
    const res = await $fetch("/api/recipes/non-existent-id");
    expect(res.status.code).toBe("NOT_FOUND");
    expect(res.data).toBeNull();
  });
});
