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

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

  toast.add({
    title: "Welcome back!",
    description: "You have been logged in successfully.",
    color: "success",
    icon: "i-lucide-check-circle",
  });

  await navigateTo("/");
}
</script>

<template>
  <div></div>
</template>
