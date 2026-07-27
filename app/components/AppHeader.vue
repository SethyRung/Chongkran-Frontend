<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const { user, signOut } = useUserSession();

const displayName = computed(() =>
  `${user.value?.firstName ?? ""} ${user.value?.lastName ?? ""}`.trim(),
);

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to);
}

const navigation = computed<NavigationMenuItem[]>(() => [
  { label: "Home", active: isActive("/"), to: "/" },
  { label: "Recipes", active: isActive("/recipes"), to: "/recipes" },
  { label: "Categories", active: isActive("/categories"), to: "/categories" },
  ...(user.value
    ? [
        { label: "Meal Plans", active: isActive("/meal-plans"), to: "/meal-plans" },
        { label: "Shopping List", active: isActive("/shopping-lists"), to: "/shopping-lists" },
      ]
    : []),
]);

const userMenuItems = computed(() => [
  { label: "Profile", icon: "i-lucide:user", to: "/profile" },
  user.value?.role === "admin"
    ? { label: "Admin Portal", icon: "i-lucide:layout-dashboard", to: "/admin" }
    : user.value?.role === "author"
      ? {
          label: "My Recipes",
          icon: "i-lucide:book-open",
          to: "/profile/recipes",
        }
      : {
          label: "Become an Author",
          icon: "i-lucide:user-plus",
          onSelect: () => {
            // TODO: Implement author application flow
          },
        },
  {
    label: "Logout",
    icon: "i-lucide:log-out",
    onSelect: logout,
  },
]);

async function logout() {
  await signOut();
  await navigateTo("/auth");
}
</script>

<template>
  <UHeader class="border-b border-muted">
    <template #title>
      <UIcon name="i-lucide:cooking-pot" class="text-primary size-8" />
      <span class="text-xl font-bold">Chongkran</span>
    </template>

    <template #default>
      <UNavigationMenu
        :items="navigation"
        :ui="{
          link: 'before:bg-transparent',
        }"
      />
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <UButton icon="i-lucide:search" color="neutral" variant="ghost" />
        <UColorModeButton />

        <UDropdownMenu v-if="user" :items="userMenuItems">
          <UButton
            trailing-icon="i-lucide:chevron-down"
            color="neutral"
            variant="ghost"
            :ui="{
              trailingIcon: 'hidden md:block',
            }"
          >
            <UUser
              :name="displayName"
              :avatar="{
                src: user.image ?? undefined,
                loading: 'lazy',
              }"
              :ui="{
                root: 'cursor-pointer',
                wrapper: 'hidden md:block',
              }"
            />
          </UButton>
        </UDropdownMenu>

        <UButton v-else to="/auth">Login</UButton>
      </div>
    </template>

    <template #body>
      <UNavigationMenu
        :items="navigation"
        orientation="vertical"
        :ui="{
          link: 'h-10',
        }"
      />
    </template>
  </UHeader>
</template>
