// Stub for `bun:test` so Vite doesn't try to bundle the real bun:test
// runtime module (which only exists under Bun, not under Node). When
// @nuxt/test-utils/runtime-detects Bun via process.versions.bun and
// dynamically imports `bun:test`, the import resolves to this stub
// under Vitest (which runs in Node). The stub provides the same
// surface area so the rest of setupBun() can execute without throwing.
//
// Once @nuxt/test-utils detects the vitest runner via the `runner`
// option (or auto-detection skips the bun path entirely), this stub
// becomes dead code and can be deleted.

export function mock(): typeof mock {
  return mock;
}

export const beforeAll = (fn: (...args: unknown[]) => unknown): void => {
  fn();
};
export const beforeEach = (fn: (...args: unknown[]) => unknown): void => {
  fn();
};
export const afterEach = (fn: (...args: unknown[]) => unknown): void => {
  fn();
};
export const afterAll = (fn: (...args: unknown[]) => unknown): void => {
  fn();
};
