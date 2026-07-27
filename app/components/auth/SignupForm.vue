<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const toast = useToast();
const signUpEmail = useSignUp("email");
const emit = defineEmits<{
  success: [email: string];
}>();

const schema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
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
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data } = event;

  await signUpEmail.execute({
    email: data.email,
    password: data.password,
    name: `${data.firstName} ${data.lastName}`.trim(),
    ...({ firstName: data.firstName, lastName: data.lastName } as Record<string, unknown>),
  });

  if (signUpEmail.error.value) {
    toast.add({
      title: "Signup failed",
      description: signUpEmail.error.value.message ?? "Please try again.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
    return;
  }

  toast.add({
    title: "Account created!",
    description: "Check your inbox to verify your email.",
    color: "success",
    icon: "i-lucide-check-circle",
  });

  emit("success", data.email);
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
    <div class="flex gap-6">
      <UFormField name="firstName" label="First name" required class="flex-1">
        <UInput
          v-model="state.firstName"
          icon="i-lucide-user"
          placeholder="John"
          autocomplete="given-name"
          size="xl"
          class="w-full"
        />
      </UFormField>

      <UFormField name="lastName" label="Last name" required class="flex-1">
        <UInput
          v-model="state.lastName"
          placeholder="Doe"
          autocomplete="family-name"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField name="email" label="Email" required>
      <UInput
        v-model="state.email"
        type="email"
        icon="i-lucide-mail"
        placeholder="you@example.com"
        autocomplete="email"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField name="password" label="Password" required>
      <UInput
        v-model="state.password"
        type="password"
        placeholder="••••••••"
        icon="i-lucide-lock"
        autocomplete="new-password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField name="confirmPassword" label="Confirm password" required>
      <UInput
        v-model="state.confirmPassword"
        type="password"
        placeholder="••••••••"
        icon="i-lucide:lock"
        autocomplete="new-password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField name="terms">
      <UCheckbox label="I agree to the Terms of Service and Privacy Policy" required />
    </UFormField>

    <UButton
      type="submit"
      label="Create account"
      :loading="signUpEmail.status.value === 'pending'"
      block
      size="xl"
    />
  </UForm>
</template>
