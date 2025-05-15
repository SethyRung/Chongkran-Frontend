<template>
  <div class="max-w-5xl px-4 md:px-12 lg:px-20 mt-8 mb-20 mx-auto space-y-6">
    <div class="flex flex-wrap justify-between items-center gap-6">
      <div class="flex items-center gap-5">
        <NuxtImg
          src="https://avatars.githubusercontent.com/u/72643226?v=4"
          class="size-22 rounded-full"
        />
        <div>
          <h3 class="text-lg font-semibold">Sethy Rung</h3>
          <p class="text-slate-500">rungsethyhk@gmail.com</p>
        </div>
      </div>
      <UButton icon="i-lucide-brush" label="Edit" class="h-fit" />
    </div>
    <UForm :state="formState" class="grid sm:grid-cols-2 gap-6">
      <UFormField label="First Name" name="firstName" size="xl">
        <UInput class="w-full" />
      </UFormField>
      <UFormField label="Last Name" name="lastName" size="xl">
        <UInput class="w-full" />
      </UFormField>
      <UFormField label="Gender" name="gender" size="xl">
        <USelect class="w-full" :items="genderOptions" />
      </UFormField>
      <UFormField label="Email" name="email" size="xl">
        <UInput class="w-full" />
      </UFormField>
      <UFormField label="Date of Birth" name="email" size="xl">
        <DatePicker class="w-full" />
      </UFormField>
      <UFormField label="Role" name="role" size="xl">
        <UInput class="w-full" disabled />
      </UFormField>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import type { SelectItem } from "@nuxt/ui";
import DatePicker from "~/components/forms/DatePicker.vue";

const genderOptions: SelectItem[] = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

const formState = reactive({
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  dateOfBirth: "",
  role: "",
});
</script>
