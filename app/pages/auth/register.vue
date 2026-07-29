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
  <div></div>
</template>
