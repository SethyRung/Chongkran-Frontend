import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UpdateAuthorProfileDto, UserResponse } from "#shared/types";

const allowedKeys = [
  "bio",
  "expertise",
  "image",
  "website",
  "instagram",
  "youtube",
  "tiktok",
] as const;

const updateAuthorSchema = z
  .object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    bio: z.string().max(500).optional(),
    expertise: z.array(z.string()).optional(),
    avatar: z.string().url().optional(),
    socialMedia: z
      .object({
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        website: z.string().url().optional(),
        youtube: z.string().optional(),
        facebook: z.string().optional(),
      })
      .optional(),
    notificationPreferences: z
      .object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        marketing: z.boolean().optional(),
      })
      .optional(),
  })
  .strict();

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Author id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  if (sessionUser.role !== "admin" && sessionUser.id !== id) {
    return createResponse({
      code: ApiResponseCode.Forbidden,
      message: "Sorry, you don't have permission to update this author's profile.",
    });
  }

  const body = (await readValidatedBody(event, updateAuthorSchema.parse)) as UpdateAuthorProfileDto;

  const updates: Partial<typeof user.$inferInsert> = {};
  if (body.firstName !== undefined) updates.firstName = body.firstName;
  if (body.lastName !== undefined) updates.lastName = body.lastName;
  if (body.bio !== undefined) updates.bio = body.bio;
  if (body.expertise !== undefined) updates.expertise = body.expertise;
  if (body.avatar !== undefined) updates.image = body.avatar;
  if (body.socialMedia?.instagram !== undefined) updates.instagram = body.socialMedia.instagram;
  if (body.socialMedia?.twitter !== undefined) updates.instagram = body.socialMedia.twitter;
  if (body.socialMedia?.website !== undefined) updates.website = body.socialMedia.website;
  if (body.socialMedia?.youtube !== undefined) updates.youtube = body.socialMedia.youtube;

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(
      ([key]) =>
        (allowedKeys as readonly string[]).includes(key) ||
        key === "firstName" ||
        key === "lastName",
    ),
  );

  if (Object.keys(filteredUpdates).length === 0) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "No fields to update" });
  }

  const [row] = await db
    .update(user)
    .set(filteredUpdates as Partial<typeof user.$inferInsert>)
    .where(and(eq(user.id, id), eq(user.role, "author")))
    .returning();

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Author not found" });
  }

  await refreshSessionCookieCache(event);

  return createResponse({ code: ApiResponseCode.Success }, formatUserResponse(row));
});
