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

definePageMeta({
  layout: "auth",
});

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {}
</script>
