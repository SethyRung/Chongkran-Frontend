<template>
  <div
    class="max-h-full flex lg:gap-10 p-7 lg:pr-0 lg:p-14 bg-white border border-[#666]/35 rounded-3xl"
  >
    <div class="max-w-[534px] max-h-full flex flex-col gap-10">
      <div class="space-y-4">
        <h1 class="text-3xl">Create an account</h1>
        <p>
          Already have an ccount?
          <NuxtLink to="/auth/login" class="underline">Log in</NuxtLink>
        </p>
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="max-h-full overflow-y-auto no-scrollbar space-y-6"
        @submit="onSubmit"
      >
        <div class="grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-4">
          <UFormField
            label="First name"
            name="firstName"
            required
            size="xl"
            :ui="{
              root: 'w-full',
              label: 'text-[#666] font-normal',
              error: 'text-xs',
            }"
          >
            <UInput
              v-model="state.firstName"
              :ui="{
                root: 'w-full',
                base: 'rounded-[12px] ring-[#666]/35',
              }"
            />
          </UFormField>
          <UFormField
            label="Last name"
            name="lastName"
            required
            size="xl"
            :ui="{
              root: 'w-full',
              label: 'text-[#666] font-normal',
              error: 'text-xs',
            }"
          >
            <UInput
              v-model="state.lastName"
              :ui="{
                root: 'w-full',
                base: 'rounded-[12px] ring-[#666]/35',
              }"
            />
          </UFormField>
        </div>
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
        <div class="grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-4">
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
              :type="isShowPassword ? 'text' : 'password'"
              :ui="{
                root: 'w-full',
                base: 'rounded-[12px] ring-[#666]/35',
              }"
            />
          </UFormField>
          <UFormField
            label="Confirm your password"
            name="confirmPassword"
            required
            size="xl"
            :ui="{
              label: 'text-[#666] font-normal',
              error: 'text-xs',
            }"
          >
            <UInput
              v-model="state.confirmPassword"
              type="password"
              :ui="{
                root: 'w-full',
                base: 'rounded-[12px] ring-[#666]/35',
              }"
            />
          </UFormField>
        </div>
        <p class="text-[#666] text-xs">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </p>
        <UCheckbox
          v-model="isShowPassword"
          label="Show password"
          :ui="{
            label: 'text-[#666]',
          }"
        />
        <UButton
          label="Create an account"
          type="submit"
          size="xl"
          block
          class="rounded-[12px]"
        />
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
import { StatusCode } from "#shared/enums/base";

definePageMeta({
  layout: "auth",
});

const toast = useToast();

const isShowPassword = ref<boolean>(false);

const schema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const isSubmitting = ref<boolean>(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;
  const response = await useApi<string>("/auth/signup", {
    method: "POST",
    body: {
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email,
      password: event.data.password,
    },
  });
  if (response.status.code === StatusCode.OK) {
    toast.add({
      title: "Success",
      description: response.data,
      color: "success",
    });
    navigateTo("/auth/login");
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
