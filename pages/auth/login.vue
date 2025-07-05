<template>
  <div
    class="max-h-full flex lg:gap-10 p-7 lg:pr-0 lg:p-14 bg-white border border-[#666]/35 rounded-3xl"
  >
    <div class="max-w-[534px] max-h-full flex flex-col gap-10">
      <h1 class="text-3xl">Log in</h1>
      <UForm
        :schema="schema"
        :state="state"
        class="max-h-full overflow-y-auto space-y-6"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          required
          size="xl"
          :ui="{
            label: 'text-[#666] font-normal',
            error: 'text-xs',
          }"
        >
          <UInput
            v-model="state.email"
            :ui="{
              root: 'w-full',
              base: 'rounded-[12px] ring-[#666]/35',
            }"
          />
        </UFormField>
        <UFormField
          label="Password"
          name="password"
          required
          size="xl"
          :ui="{
            label: 'text-[#666] font-normal',
            error: 'text-xs',
          }"
        >
          <UInput
            v-model="state.password"
            type="password"
            :ui="{
              root: 'w-full',
              base: 'rounded-[12px] ring-[#666]/35',
            }"
          />
        </UFormField>
        <p class="text-[#666] text-xs">
          By continuing, you agree to the
          <a href="#" class="underline">Terms of use</a> and
          <a href="#" class="underline">Privacy Policy</a>
        </p>
        <UButton
          label="Log in"
          type="submit"
          size="xl"
          block
          class="rounded-[12px]"
          :loading="isSubmitting"
        />
        <p class="text-sm text-center text-[#666]">
          Don't have an ccount?
          <NuxtLink to="/auth/sign-up" class="underline text-neutral-900"
            >Sign up</NuxtLink
          >
        </p>
      </UForm>
    </div>
    <div class="hidden lg:flex justify-center items-center">
      <img src="/images/sign-up.png" alt="sign-up" class="size-72" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { StatusCode } from "~/enums/base";

definePageMeta({
  layout: "auth",
});

const config = useRuntimeConfig();

const toast = useToast();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const accessToken = useCookie("access_token", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.atMaxAge),
});
const refreshToken = useCookie("refresh_token", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.rtMaxAge),
});
const isAuthenticated = useCookie<boolean>("authenticated", {
  secure: true,
  sameSite: "strict",
  maxAge: parseInt(config.public.rtMaxAge),
});

const isSubmitting = ref<boolean>(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;
  const response = await useApi<{
    accessToken: string;
    refreshToken: string;
  }>("/auth/login", {
    method: "POST",
    body: event.data,
  });
  if (response.status.code === StatusCode.OK) {
    isAuthenticated.value = true;
    accessToken.value = response.data.accessToken;
    refreshToken.value = response.data.refreshToken;
    navigateTo("/");
  } else {
    toast.add({
      title: "Error",
      description: response.status.message,
      color: "error",
    });
  }
  isSubmitting.value = false;
}
</script>
