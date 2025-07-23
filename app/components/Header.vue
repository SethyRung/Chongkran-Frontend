<template>
  <header
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
      :content="{
        align: 'end',
      }"
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
      label="Log in"
      variant="outline"
      class="hidden @md/header:inline-flex"
      to="/auth/login"
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
          label="Log in"
          variant="outline"
          size="xl"
          block
          to="/auth/login"
        />
      </template>
    </USlideover>
  </header>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { StatusCode } from "#shared/enums/base";

const accessToken = useCookie("access_token");
const refreshToken = useCookie("refresh_token");
const isAuthenticated = useCookie<boolean>("authenticated");
const isOpen = ref<boolean>(false);

const route = useRoute();
watch(route, () => {
  isOpen.value = false;
});

const toast = useToast();

const logout = async () => {
  const response = await useApi("/auth/logout", {
    method: "POST",
  });
  if (response.status.code === StatusCode.OK) {
    isAuthenticated.value = false;
    accessToken.value = null;
    refreshToken.value = null;
    navigateTo("/");
  } else {
    toast.add({
      title: "Error",
      description: response.status.message,
      color: "error",
    });
  }
};

const profileItems = reactive<DropdownMenuItem[][]>([
  [
    { icon: "i-lucide-user", label: "Your Profile", to: "/profile" },
    {
      icon: "i-lucide-heart",
      label: "Favorites",
      to: "/recipes?tab=favorites",
    },
    { icon: "i-lucide-user-pen", label: "Become Author" },
  ],
  [{ icon: "i-lucide-log-out", label: "Logout", onSelect: logout }],
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
]);

const items = reactive([
  ...navigationItems,
  isAuthenticated.value
    ? {
        icon: "i-lucide-user",
        label: "Profile",
        children: profileItems,
      }
    : {},
]);
</script>
