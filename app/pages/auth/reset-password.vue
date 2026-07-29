<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Set new password · Chongkran",
  meta: [
    {
      name: "description",
      content: "Choose a new password for your Chongkran account.",
    },
  ],
});

const route = useRoute();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const token = computed(() => {
  const raw = route.query.token;
  return typeof raw === "string" ? raw : "";
});

const hasToken = computed(() => token.value.length > 0);

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  password: "",
  confirmPassword: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data } = event;
  if (!token.value) return;

  loading.value = true;
  errorMessage.value = null;
  try {
    const client = useAuthClient();
    await client?.resetPassword({
      newPassword: data.password,
      token: token.value,
    });

    await navigateTo("/auth/login");
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Could not update the password. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div></div>
</template>
