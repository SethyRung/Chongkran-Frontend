import { ApiResponseCode, type ApiResponse, type ApiResponseSuccess } from "../types";

export function isSuccessResponse<T>(res?: ApiResponse<T>): res is ApiResponseSuccess<T> {
  return !!res && res.status.code === ApiResponseCode.Success;
}
