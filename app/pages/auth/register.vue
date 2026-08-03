<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Create account · Chongkran",
  meta: [
    {
      name: "description",
      content:
        "Join Chongkran — a community-driven recipe platform where home cooks discover, create, and share culinary creations.",
    },
  ],
});

const toast = useToast();
const signUpEmail = useSignUp("email");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const authError = computed(() => humaniseAuthError(signUpEmail.error.value));

const isSubmitting = computed(() => signUpEmail.status.value === "pending");

const schema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data } = event;

  await signUpEmail.execute({
    email: data.email,
    password: data.password,
    name: `${data.firstName} ${data.lastName}`.trim(),
    ...({ firstName: data.firstName, lastName: data.lastName } as Record<string, unknown>),
  });

  if (signUpEmail.error.value) return;

  toast.add({
    title: "Account created!",
    description: "Check your inbox to verify your email.",
    color: "success",
    icon: "i-lucide-check-circle",
  });

  await navigateTo({
    path: "/auth/verify-email",
    query: { email: data.email },
  });
}
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-highlighted">Join Chongkran</h1>
      <p class="mt-2 text-base text-muted">Create an account to save, plan, and share recipes.</p>
    </header>

    <UAlert
      v-if="authError"
      color="error"
      variant="subtle"
      :title="authError.title"
      :description="authError.description"
      icon="i-lucide-alert-circle"
      class="mb-6"
    />

    <UForm :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
      <div class="grid grid-cols-2 gap-3">
        <UFormField name="firstName" label="First name">
          <UInput v-model="state.firstName" placeholder="Mali" size="lg" autocomplete="given-name">
            <template #leading>
              <UIcon name="i-lucide-user" class="size-4 text-muted" />
            </template>
          </UInput>
        </UFormField>

        <UFormField name="lastName" label="Last name">
          <UInput v-model="state.lastName" placeholder="Suk" size="lg" autocomplete="family-name" />
        </UFormField>
      </div>

      <UFormField name="email" label="Email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="you@example.com"
          size="lg"
          autocomplete="email"
        >
          <template #leading>
            <UIcon name="i-lucide-mail" class="size-4 text-muted" />
          </template>
        </UInput>
      </UFormField>

      <UFormField name="password" label="Password">
        <template #hint>
          <span class="text-xs text-muted">At least 8 characters</span>
        </template>
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Choose a strong password"
          size="lg"
          autocomplete="new-password"
        >
          <template #leading>
            <UIcon name="i-lucide-lock" class="size-4 text-muted" />
          </template>
          <template #trailing>
            <UButton
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField name="confirmPassword" label="Confirm password">
        <UInput
          v-model="state.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Repeat the password"
          size="lg"
          autocomplete="new-password"
        >
          <template #leading>
            <UIcon name="i-lucide-lock-keyhole" class="size-4 text-muted" />
          </template>
          <template #trailing>
            <UButton
              :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField name="terms">
        <UCheckbox v-model="state.terms" color="primary">
          <template #label>
            <span class="text-sm text-muted">
              I agree to the
              <span class="text-primary">Terms of Service</span>
              and
              <span class="text-primary">Privacy Policy</span>.
            </span>
          </template>
        </UCheckbox>
      </UFormField>

      <UButton type="submit" label="Create account" size="lg" block :loading="isSubmitting" />
    </UForm>

    <p class="mt-8 text-sm text-muted text-center">
      Already have an account?
      <NuxtLink
        to="/auth/login"
        class="text-primary font-medium hover:underline underline-offset-2"
      >
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
