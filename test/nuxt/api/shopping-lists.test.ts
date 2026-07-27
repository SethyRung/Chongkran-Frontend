import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/shopping-lists", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/shopping-lists");
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});

describe("POST /api/shopping-lists", () => {
  it("rejects unauthenticated callers with the Unauthorized envelope (HTTP 200)", async () => {
    const res = await $fetch("/api/shopping-lists", {
      method: "POST",
      body: { items: [] },
    });
    expect(res.status.code).toBe("UNAUTHORIZED");
    expect(res.data).toBeNull();
  });
});
