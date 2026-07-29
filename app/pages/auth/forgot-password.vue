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
</script>

<template>
  <div></div>
</template>
