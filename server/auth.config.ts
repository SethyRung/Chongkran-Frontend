import { admin } from "better-auth/plugins";
import { defineServerAuth } from "@onmax/nuxt-better-auth/config";

export default defineServerAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      sendPasswordResetEmail({ to: user.email, name: user.name, url });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      sendVerificationEmail({ to: user.email, name: user.name, url });
    },
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      bio: { type: "string", required: false },
      expertise: { type: "string[]", required: false },
      website: { type: "string", required: false },
      instagram: { type: "string", required: false },
      youtube: { type: "string", required: false },
      tiktok: { type: "string", required: false },
      followersCount: { type: "number", required: false, defaultValue: 0 },
      followingCount: { type: "number", required: false, defaultValue: 0 },
      recipesCount: { type: "number", required: false, defaultValue: 0 },
      totalViews: { type: "number", required: false, defaultValue: 0 },
      totalLikes: { type: "number", required: false, defaultValue: 0 },
      authorRequestStatus: { type: "string", required: false },
      gender: { type: "string", required: false },
      dateOfBirth: { type: "string", required: false },
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
