import { describe, expect, it } from "vitest";
import { ApiResponseCode } from "../../shared/types";
import { isSuccessResponse } from "../../shared/utils";
import { createResponse } from "../../server/utils/response";

describe("createResponse", () => {
  it("builds a success envelope with data and meta", () => {
    const res = createResponse({ code: ApiResponseCode.Success }, [{ id: "1" }, { id: "2" }], {
      total: 2,
      limit: 10,
      offset: 0,
    });

    expect(res.status.code).toBe(ApiResponseCode.Success);
    expect(res.status.message).toBe("");
    expect(typeof res.status.requestId).toBe("string");
    expect(res.status.requestId.length).toBeGreaterThan(0);
    expect(typeof res.status.requestTime).toBe("number");
    expect(res.data).toEqual([{ id: "1" }, { id: "2" }]);
    expect(res.meta).toEqual({ total: 2, limit: 10, offset: 0 });
  });

  it("accepts a custom success message", () => {
    const res = createResponse(
      { code: ApiResponseCode.Success, message: "Recipe created" },
      { id: "r1" },
    );

    expect(res.status.message).toBe("Recipe created");
    expect(res.data).toEqual({ id: "r1" });
    expect(res.meta).toBeUndefined();
  });

  it("builds an error envelope with null data and no meta", () => {
    const res = createResponse({
      code: ApiResponseCode.NotFound,
      message: "Recipe not found",
    });

    expect(res.status.code).toBe(ApiResponseCode.NotFound);
    expect(res.status.message).toBe("Recipe not found");
    expect(res.data).toBeNull();
    expect(res.meta).toBeUndefined();
  });

  it("preserves the requestId + requestTime on error responses", () => {
    const res = createResponse({ code: ApiResponseCode.Forbidden, message: "nope" });

    expect(res.status.requestId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(res.status.requestTime).toBeGreaterThan(0);
  });

  it("emits a unique requestId per call", () => {
    const a = createResponse({ code: ApiResponseCode.Success }, null);
    const b = createResponse({ code: ApiResponseCode.Success }, null);
    expect(a.status.requestId).not.toBe(b.status.requestId);
  });
});

describe("isSuccessResponse", () => {
  it("returns true when the code is SUCCESS", () => {
    expect(isSuccessResponse(createResponse({ code: ApiResponseCode.Success }, { ok: true }))).toBe(
      true,
    );
  });

  it("returns false for error codes", () => {
    expect(
      isSuccessResponse(createResponse({ code: ApiResponseCode.NotFound, message: "no" })),
    ).toBe(false);
    expect(
      isSuccessResponse(createResponse({ code: ApiResponseCode.Forbidden, message: "no" })),
    ).toBe(false);
    expect(
      isSuccessResponse(createResponse({ code: ApiResponseCode.ValidationError, message: "no" })),
    ).toBe(false);
  });

  it("returns false for undefined / null inputs", () => {
    expect(isSuccessResponse(undefined)).toBe(false);
    expect(isSuccessResponse(null)).toBe(false);
  });
});
