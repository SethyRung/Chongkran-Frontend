<template>
  <header
    ref="header"
    class="h-14 px-4 md:px-12 lg:px-20 sticky top-0 z-[99999] @container/header flex items-center justify-between bg-white/80 shadow-sm backdrop-blur-lg"
  >
    <NuxtLink
      to="/"
      class="font-bold text-primary-500 flex items-center gap-1.5"
    >
      <UIcon name="i-lucide-cooking-pot" size="24" /> Chongkran
    </NuxtLink>
    <UNavigationMenu
      :items="navigationItems"
      class="w-fit mx-auto hidden @md/header:flex"
    />
    <UDropdownMenu
      v-if="isAuthenticated"
      :items="profileItems"
      :ui="{
        content: 'w-40',
      }"
    >
      <UButton
        icon="i-lucide-user"
        size="lg"
        color="primary"
        variant="soft"
        class="rounded-full hidden @md/header:inline-flex"
      />
    </UDropdownMenu>
    <UButton
      v-else
      label="Sign in"
      variant="outline"
      class="hidden @md/header:inline-flex"
    />
    <UButton
      icon="i-lucide-menu"
      color="neutral"
      variant="ghost"
      class="@md/header:hidden"
      @click="isOpen = !isOpen"
    />
    <USlideover
      v-model:open="isOpen"
      :ui="{ body: 'py-0 pb-10 flex flex-col justify-between' }"
    >
      <template #title>
        <NuxtLink
          to="/"
          class="font-bold text-primary-500 flex items-center gap-1.5"
        >
          <UIcon name="i-lucide-cooking-pot" size="24" /> Chongkran
        </NuxtLink>
      </template>
      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{
            item: 'not-last:border-b border-gray-300',
            link: 'h-10 bg-white',
          }"
        />
        <UButton
          v-if="!isAuthenticated"
          label="Sign in"
          variant="outline"
          size="xl"
          block
        />
      </template>
    </USlideover>
  </header>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const isAuthenticated = ref(true);
const isOpen = ref<boolean>(false);

const profileItems = reactive<DropdownMenuItem[] | DropdownMenuItem[][]>([
  [
    { icon: "i-lucide-user", label: "Your Profile", to: "/profile" },
    { icon: "i-lucide-heart", label: "Favorites", to: "/favorites" },
    { icon: "i-lucide-user-pen", label: "Become Author", to: "/become-author" },
  ],
  [{ icon: "i-lucide-log-out", label: "Logout" }],
]);

const navigationItems = reactive<NavigationMenuItem[]>([
  {
    icon: "i-lucide-house",
    label: "Home",
    to: "/",
  },
  {
    icon: "i-lucide-notebook",
    label: "Recipes",
    to: "/recipes",
  },
  {
    icon: "i-lucide-info",
    label: "About",
    to: "/about",
  },
]);

const items = reactive([
  ...navigationItems,
  isAuthenticated.value
    ? {
        icon: "i-lucide-user",
        label: "Profile",
        children: profileItems.flatMap((item) => item),
      }
    : {},
]);
</script>
