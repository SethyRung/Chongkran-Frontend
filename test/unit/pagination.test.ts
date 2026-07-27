import { describe, expect, it } from "vitest";
import { clampLimit, clampOffset, DEFAULT_LIMIT, MAX_LIMIT } from "../../server/utils/pagination";

describe("clampLimit", () => {
  it("returns the default when value is undefined", () => {
    expect(clampLimit(undefined)).toBe(DEFAULT_LIMIT);
  });

  it("returns the default when value is null", () => {
    expect(clampLimit(null)).toBe(DEFAULT_LIMIT);
  });

  it("returns the default when value is an empty string", () => {
    expect(clampLimit("")).toBe(DEFAULT_LIMIT);
  });

  it("returns the default when value is non-numeric", () => {
    expect(clampLimit("abc")).toBe(DEFAULT_LIMIT);
    expect(clampLimit({})).toBe(DEFAULT_LIMIT);
  });

  it("returns the default when value is zero or negative", () => {
    expect(clampLimit(0)).toBe(DEFAULT_LIMIT);
    expect(clampLimit(-5)).toBe(DEFAULT_LIMIT);
    expect(clampLimit("-1")).toBe(DEFAULT_LIMIT);
  });

  it("parses a valid integer string", () => {
    expect(clampLimit("25")).toBe(25);
  });

  it("parses a valid number", () => {
    expect(clampLimit(42)).toBe(42);
  });

  it("floors non-integer numbers", () => {
    expect(clampLimit(7.9)).toBe(7);
    expect(clampLimit("12.5")).toBe(12);
  });

  it("caps at the default MAX_LIMIT", () => {
    expect(clampLimit(9999)).toBe(MAX_LIMIT);
  });

  it("honors a custom default", () => {
    expect(clampLimit(undefined, { default: 5 })).toBe(5);
  });

  it("honors a custom max", () => {
    expect(clampLimit(100, { max: 50 })).toBe(50);
  });

  it("returns NaN/Infinity safely", () => {
    expect(clampLimit(NaN)).toBe(DEFAULT_LIMIT);
    expect(clampLimit(Infinity)).toBe(DEFAULT_LIMIT);
  });
});

describe("clampOffset", () => {
  it("returns 0 for undefined / null / empty", () => {
    expect(clampOffset(undefined)).toBe(0);
    expect(clampOffset(null)).toBe(0);
    expect(clampOffset("")).toBe(0);
  });

  it("returns 0 for non-numeric values", () => {
    expect(clampOffset("abc")).toBe(0);
    expect(clampOffset({})).toBe(0);
  });

  it("returns 0 for negative numbers", () => {
    expect(clampOffset(-1)).toBe(0);
    expect(clampOffset(-100)).toBe(0);
  });

  it("parses a valid integer", () => {
    expect(clampOffset(50)).toBe(50);
    expect(clampOffset("50")).toBe(50);
  });

  it("floors non-integer numbers", () => {
    expect(clampOffset(12.7)).toBe(12);
  });
});
