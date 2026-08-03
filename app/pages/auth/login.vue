<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Sign in · Chongkran",
  meta: [
    {
      name: "description",
      content:
        "Sign in to your Chongkran account to discover, create, and share recipes with home cooks around the world.",
    },
  ],
});

const toast = useToast();
const signInEmail = useSignIn("email");

const showPassword = ref(false);

const authError = computed(() => humaniseAuthError(signInEmail.error.value));

const isSubmitting = computed(() => signInEmail.status.value === "pending");

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be provided"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
  password: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data } = event;

  await signInEmail.execute({
    email: data.email,
    password: data.password,
  });

  if (signInEmail.error.value) return;

  await navigateTo("/");
}
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-highlighted">Welcome back</h1>
      <p class="mt-2 text-base text-muted">Sign in to your account to keep cooking.</p>
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
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-primary hover:underline underline-offset-2"
          >
            Forgot password?
          </NuxtLink>
        </template>
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Your password"
          size="lg"
          autocomplete="current-password"
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

      <UButton type="submit" label="Sign in" size="lg" block :loading="isSubmitting" />
    </UForm>

    <USeparator label="or" class="my-8" />

    <div class="grid grid-cols-2 gap-3">
      <UButton
        icon="i-simple-icons-google"
        label="Google"
        color="neutral"
        variant="outline"
        size="lg"
        disabled
        block
      />
      <UButton
        icon="i-simple-icons-github"
        label="GitHub"
        color="neutral"
        variant="outline"
        size="lg"
        disabled
        block
      />
    </div>

    <p class="mt-8 text-sm text-muted text-center">
      Don't have an account?
      <NuxtLink
        to="/auth/register"
        class="text-primary font-medium hover:underline underline-offset-2"
      >
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>
