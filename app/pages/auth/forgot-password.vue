<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Forgot password · Chongkran",
  meta: [
    {
      name: "description",
      content:
        "Reset your Chongkran password. Enter your email and we'll send you a link to choose a new one.",
    },
  ],
});

const submitted = ref(false);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const schema = z.object({
  email: z.email("Invalid email address"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data } = event;
  loading.value = true;
  errorMessage.value = null;

  try {
    const client = useAuthClient();
    await client?.requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });

    submitted.value = true;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Could not send the reset link. Please try again.";
  } finally {
    loading.value = false;
  }
}

function tryAnother() {
  submitted.value = false;
  state.email = "";
  errorMessage.value = null;
}
</script>

<template>
  <div>
    <template v-if="!submitted">
      <header class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-highlighted">
          Forgot your password?
        </h1>
        <p class="mt-2 text-base text-muted">
          Enter your email and we'll send you a link to choose a new password.
        </p>
      </header>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="subtle"
        :title="errorMessage"
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

        <UButton type="submit" label="Send reset link" size="lg" block :loading="loading" />
      </UForm>
    </template>

    <div v-else class="text-center py-4">
      <div
        class="mx-auto size-16 rounded-full bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center mb-6"
      >
        <UIcon name="i-lucide-mail-check" class="size-8 text-primary" />
      </div>
      <h2 class="text-2xl font-semibold tracking-tight text-highlighted">Check your inbox</h2>
      <p class="mt-3 text-base text-muted leading-relaxed">
        We sent a reset link to
        <span class="font-medium text-default break-all">{{ state.email }}</span
        >. The link expires in 1 hour.
      </p>
      <UButton
        label="Try another email"
        color="neutral"
        variant="ghost"
        size="md"
        class="mt-8"
        @click="tryAnother"
      />
    </div>

    <p class="mt-10 text-sm text-muted text-center">
      <NuxtLink
        to="/auth/login"
        class="inline-flex items-center gap-1.5 text-default hover:text-primary transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back to sign in
      </NuxtLink>
    </p>
  </div>
</template>
