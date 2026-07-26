<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import type { UserResponse } from "#server/types";

const toast = useToast();
const { user, fetchSession } = useUserSession();
const loading = ref(false);
const avatarFile = ref<File | undefined>(undefined);

const schema = z.object({
  firstName: z.string().trim().min(1, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(1, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  bio: z.string().max(300, "Bio must be 300 characters or less").optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: user.value?.firstName ?? "",
  lastName: user.value?.lastName ?? "",
  email: user.value?.email ?? "",
  bio: user.value?.bio ?? "",
});

const avatarPreview = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value);
  }
  return user.value?.image;
});

const bioCount = computed(() => state.bio?.length ?? 0);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    const { data } = event;

    let avatarUrl: string | undefined;

    if (avatarFile.value) {
      const formData = new FormData();
      formData.append("file", avatarFile.value);

      const uploadRes = await useApi("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.status.code === ApiResponseCode.Success && uploadRes.data) {
        avatarUrl = uploadRes.data.url;
      }
    }

    const res = await useApi<ApiResponse<UserResponse>>("/api/users/" + user.value?.id, {
      method: "PATCH",
      body: {
        ...data,
        avatar: avatarUrl,
      },
    });

    if (res.status.code === ApiResponseCode.Success) {
      await fetchSession({ force: true });

      avatarFile.value = undefined;

      toast.add({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
        color: "success",
        icon: "i-lucide-check-circle",
      });
    } else {
      toast.add({
        title: "Update failed",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Update failed",
      description: "Something went wrong. Please try again.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="w-full space-y-6" @submit="onSubmit">
    <UCard>
      <UFileUpload
        v-model="avatarFile"
        accept="image/*"
        :multiple="false"
        :interactive="false"
        :preview="false"
        :dropzone="false"
        class="w-full"
      >
        <template #default="{ open }">
          <div class="flex flex-col items-center gap-4 sm:flex-row">
            <div class="group relative cursor-pointer" @click="open()">
              <UAvatar
                :src="avatarPreview"
                :alt="`${user?.firstName} ${user?.lastName}`"
                size="3xl"
                icon="i-lucide-user"
                :ui="{ root: 'ring-2 ring-primary/20' }"
              />
              <div
                class="absolute inset-0 flex items-center justify-center rounded-full bg-default/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <UIcon name="i-lucide-camera" class="size-6 text-white" />
              </div>
            </div>

            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-lg font-semibold">{{ user?.firstName }} {{ user?.lastName }}</h3>
              <p class="text-sm text-muted">{{ user?.email }}</p>
              <div class="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <UButton
                  size="xs"
                  label="Upload Photo"
                  icon="i-lucide-upload"
                  color="neutral"
                  variant="outline"
                  @click.stop="open()"
                />
                <UButton
                  v-if="avatarFile"
                  size="xs"
                  label="Remove"
                  icon="i-lucide-x"
                  color="error"
                  variant="ghost"
                  @click.stop="avatarFile = undefined"
                />
              </div>
            </div>
          </div>
        </template>
      </UFileUpload>
    </UCard>

    <UCard>
      <template #header>
        <div>
          <h3 class="font-semibold">Personal Information</h3>
          <p class="text-sm text-muted">Update your personal details here.</p>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex gap-4">
          <UFormField name="firstName" label="First name" required class="flex-1">
            <UInput
              v-model="state.firstName"
              placeholder="John"
              autocomplete="given-name"
              class="w-full"
            />
          </UFormField>

          <UFormField name="lastName" label="Last name" required class="flex-1">
            <UInput
              v-model="state.lastName"
              placeholder="Doe"
              autocomplete="family-name"
              class="w-full"
            />
          </UFormField>
        </div>

        <USeparator />

        <UFormField name="email" label="Email address" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            class="w-full"
          />
        </UFormField>

        <USeparator />

        <UFormField
          name="bio"
          label="Bio"
          description="Tell us a little about yourself."
          :hint="`${bioCount}/300`"
        >
          <UTextarea
            v-model="state.bio"
            placeholder="Tell us about yourself..."
            :rows="4"
            class="w-full"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton label="Cancel" color="neutral" variant="ghost" to="/profile" />

          <UButton type="submit" label="Save Changes" icon="i-lucide-check" :loading="loading" />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
