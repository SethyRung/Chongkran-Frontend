import { eq } from "drizzle-orm";
import { z } from "zod";
import { user } from "hub:db:schema";
import type { UpdateUserDto, UserResponse } from "~~/server/types";
import { formatUserResponse } from "~~/server/utils/user";

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.email().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const { user: sessionUser } = await requireSession(event);

  if (sessionUser.role !== "admin" && sessionUser.id !== id) {
    return createResponse({
      code: ApiResponseCode.Forbidden,
      message: "Sorry, you don't have permission to update this user's information.",
    });
  }

  const body = (await readValidatedBody(event, updateUserSchema.parse)) as UpdateUserDto;

  const updates: Partial<typeof user.$inferInsert> = {};
  if (body.firstName !== undefined) updates.firstName = body.firstName;
  if (body.lastName !== undefined) updates.lastName = body.lastName;
  if (body.email !== undefined) updates.email = body.email;
  if (body.gender !== undefined) updates.gender = body.gender;
  if (body.dateOfBirth !== undefined) {
    updates.dateOfBirth =
      body.dateOfBirth instanceof Date ? body.dateOfBirth.toISOString() : body.dateOfBirth;
  }

  if (Object.keys(updates).length === 0) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "No fields to update" });
  }

  const [row] = await db.update(user).set(updates).where(eq(user.id, id)).returning();
  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  await refreshSessionCookieCache(event);

  return createResponse({ code: ApiResponseCode.Success }, formatUserResponse(row));
});
