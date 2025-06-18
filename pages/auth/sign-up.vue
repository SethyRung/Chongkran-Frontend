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
      <UForm :state="state" class="max-h-full overflow-y-auto space-y-6">
        <div class="grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-4">
          <UFormField
            label="First name"
            name="firstName"
            required
            size="xl"
            :ui="{
              root: 'w-full',
              label: 'text-[#666] font-normal',
            }"
          >
            <UInput
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
            }"
          >
            <UInput
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
          }"
        >
          <UInput
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
            }"
          >
            <UInput
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
            }"
          >
            <UInput
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
          label="Show password"
          :ui="{
            label: 'text-[#666]',
          }"
        />
        <UButton
          label="Create an account"
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
definePageMeta({
  layout: "auth",
});

const state = reactive({});
</script>
