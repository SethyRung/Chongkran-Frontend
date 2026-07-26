<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user } = useUserSession();
const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Overview",
    icon: "i-lucide-user",
    to: "/profile",
    active: route.path === "/profile",
  },
  {
    label: "My Recipes",
    icon: "i-lucide-book-open",
    to: "/profile/recipes",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/profile/settings",
  },
]);
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div
        class="relative mb-8 rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8"
      >
        <div class="flex flex-col items-center gap-6 sm:flex-row">
          <UAvatar
            :src="user?.image"
            :alt="`${user?.firstName} ${user?.lastName}`"
            size="3xl"
            icon="i-lucide-user"
            :ui="{
              root: 'ring ring-primary/20',
            }"
          />

          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-bold md:text-3xl">
              {{ user?.firstName }} {{ user?.lastName }}
            </h1>
            <p class="mt-1 text-muted">{{ user?.email }}</p>
            <UBadge
              v-if="user?.role"
              :color="
                user.role === 'admin' ? 'error' : user.role === 'author' ? 'primary' : 'neutral'
              "
              variant="subtle"
              class="mt-2 capitalize"
            >
              {{ user.role }}
            </UBadge>
            <p v-if="user?.bio" class="mt-3 max-w-lg text-sm text-muted">{{ user.bio }}</p>
          </div>

          <UButton
            to="/profile/settings"
            icon="i-lucide-pencil"
            label="Edit Profile"
            color="neutral"
            variant="subtle"
          />
        </div>
      </div>

      <UNavigationMenu
        :items="items"
        :ui="{
          link: 'before:bg-transparent',
        }"
        class="mb-8"
      />

      <NuxtPage />
    </UContainer>
  </UPage>
</template>
