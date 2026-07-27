import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/admin/stats", () => {
  it("rejects unauthenticated callers with 401/403", async () => {
    let status: number | undefined;
    try {
      await $fetch("/api/admin/stats");
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    expect([401, 403]).toContain(status);
  });
});
