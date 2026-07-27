import { put } from "@vercel/blob";
import type { UploadResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UploadResponse>> => {
  const { user: sessionUser } = await requireSession(event);

  const form = await readMultipartFormData(event);
  const file = form?.find((p) => p.name === "file");
  if (!file?.data || !file.filename) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "file is required" });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "BLOB_READ_WRITE_TOKEN is not configured",
    });
  }

  try {
    const blob = await put(
      `recipes/${sessionUser.id}/${crypto.randomUUID()}-${file.filename}`,
      file.data,
      {
        access: "public",
        token,
      },
    );

    return createResponse(
      { code: ApiResponseCode.Success },
      { public_id: blob.pathname, url: blob.url },
    );
  } catch {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "Failed to upload file",
    });
  }
});
