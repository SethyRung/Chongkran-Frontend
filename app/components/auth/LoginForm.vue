<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const toast = useToast();
const signInEmail = useSignIn("email");

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

  if (signInEmail.error.value) {
    toast.add({
      title: "Login failed",
      description: signInEmail.error.value.message ?? "Please check your credentials.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
    return;
  }

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
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
    <UFormField name="email" label="Email" required>
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@example.com"
        icon="i-lucide-mail"
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
        autocomplete="current-password"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <div class="flex items-center justify-between">
      <UCheckbox label="Remember me" size="xl" />
      <ULink to="/auth" variant="soft" color="neutral"> Forgot password? </ULink>
    </div>

    <UButton
      label="Sign in"
      type="submit"
      :loading="signInEmail.status.value === 'pending'"
      block
      size="xl"
    />

    <USeparator label="OR" />

    <UButton
      icon="i-lucide-home"
      label="Continue as guest"
      size="xl"
      variant="outline"
      color="neutral"
      block
      to="/"
    />
  </UForm>
</template>
