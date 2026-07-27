import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";
import type { ApiResponse } from "#shared/types";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/reviews (admin global list)", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/reviews");
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});

describe("GET /api/reviews/recipe/:recipeId (auth-required per-recipe list)", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/reviews/recipe/some-recipe-id");
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});

describe("GET /api/reviews/:id (single review)", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch<ApiResponse<unknown>>("/api/reviews/some-review-id");
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});
