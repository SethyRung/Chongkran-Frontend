import { eq } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { user } from "hub:db:schema";

const DEMO_ADMIN = {
  email: "admin@chongkran.com",
  password: "Password123!",
  firstName: "Admin",
  lastName: "User",
  role: "admin" as const,
};

const DEMO_USER = {
  email: "demo@chongkran.com",
  password: "Password123!",
  firstName: "Demo",
  lastName: "User",
  role: "user" as const,
};

/**
 * Seed task for database initialization.
 *
 * Creates demo admin + user accounts via Better Auth, then patches:
 *   - `role`             (public sign-up always assigns `defaultRole`)
 *   - `firstName`/`lastName` (Better-Auth's sign-up takes only `name`)
 *   - `emailVerified`    (mark verified so local dev can sign in immediately
 *                         without a working Resend / SMTP setup)
 *
 * Idempotent: re-running skips rows that already exist.
 */
export default defineTask({
  meta: {
    name: "db:seed",
    description: "Seed database with demo admin + user accounts",
  },
  async run() {
    console.log("🌱 Starting database seed...");

    try {
      await seedUser(DEMO_ADMIN);
      await seedUser(DEMO_USER);

      console.log("Seed completed successfully!");
      return { result: "Seed completed successfully" };
    } catch (error) {
      console.error("Seed failed:", error);
      return { result: "Seed failed", error: String(error) };
    }
  },
});

async function seedUser(seed: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
}): Promise<void> {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, seed.email),
  });

  if (existing) {
    const updates: Partial<typeof existing> = {};
    if (existing.role !== seed.role) updates.role = seed.role;
    if (existing.firstName !== seed.firstName) updates.firstName = seed.firstName;
    if (existing.lastName !== seed.lastName) updates.lastName = seed.lastName;
    if (!existing.emailVerified) updates.emailVerified = true;

    if (Object.keys(updates).length > 0) {
      await db.update(user).set(updates).where(eq(user.id, existing.id));
      console.log(`Updated ${seed.email}: ${Object.keys(updates).join(", ")}`);
    } else {
      console.log(`User already exists: ${seed.email}`);
    }
    return;
  }

  const auth = serverAuth();
  const result = await auth.api.signUpEmail({
    body: {
      email: seed.email,
      password: seed.password,
      name: `${seed.firstName} ${seed.lastName}`.trim(),
    },
  });

  await db
    .update(user)
    .set({
      role: seed.role,
      firstName: seed.firstName,
      lastName: seed.lastName,
      emailVerified: true,
    })
    .where(eq(user.id, result.user.id));

  console.log(`Created ${seed.role} user: ${seed.email} (password: ${seed.password})`);
}
