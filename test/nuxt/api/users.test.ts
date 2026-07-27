import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, expect, it } from "vitest";

await setup({ rootDir: process.cwd(), dev: true, setupTimeout: 300_000 });

describe("GET /api/users (admin only)", () => {
  it("rejects unauthenticated callers with 401/403", async () => {
    let status: number | undefined;
    try {
      await $fetch("/api/users");
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    expect([401, 403]).toContain(status);
  });
});

describe("GET /api/users/authors (auth required)", () => {
  it("rejects unauthenticated callers with 401/403", async () => {
    let status: number | undefined;
    try {
      await $fetch("/api/users/authors");
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    expect([401, 403]).toContain(status);
  });
});

describe("PUT /api/users/become-author", () => {
  it("rejects unauthenticated callers with 401/403", async () => {
    let status: number | undefined;
    try {
      await $fetch("/api/users/become-author", { method: "PUT" });
    } catch (err) {
      const e = err as { statusCode?: number };
      status = e.statusCode;
    }
    expect([401, 403]).toContain(status);
  });
});
