<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user } = useUserSession();
const route = useRoute();

const navItems = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Dashboard",
      icon: "i-lucide:layout-dashboard",
      to: "/admin",
    },
    {
      label: "Recipes",
      icon: "i-lucide:chef-hat",
      to: "/admin/recipes",
    },
    {
      label: "Reviews",
      icon: "i-lucide:star",
      to: "/admin/reviews",
    },
    {
      label: "Users",
      icon: "i-lucide:users",
      to: "/admin/users",
    },
    {
      label: "Author Requests",
      icon: "i-lucide:user-check",
      to: "/admin/author-requests",
    },
    {
      label: "Categories",
      icon: "i-lucide:tag",
      to: "/admin/categories",
    },
    {
      label: "Meal Plans",
      icon: "i-lucide:calendar",
      to: "/admin/meal-plans",
    },
    {
      label: "Shopping Lists",
      icon: "i-lucide:shopping-basket",
      to: "/admin/shopping-lists",
    },
  ],
  [
    {
      label: "Back to Site",
      icon: "i-lucide:arrow-left",
      to: "/",
    },
  ],
]);
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable class="bg-elevated/50">
      <template #header="{ collapsed }">
        <UIcon name="i-lucide:cooking-pot" class="size-8 shrink-0 text-primary" />
        <div v-if="!collapsed" class="flex items-center gap-2">
          <span class="text-lg font-bold">Chongkran</span>
          <UBadge label="Admin" color="primary" variant="subtle" size="xs" />
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="navItems" orientation="vertical" />
      </template>

      <template #footer="{ collapsed }">
        <UAvatar
          :src="user?.image"
          :alt="`${user?.firstName} ${user?.lastName}`"
          size="sm"
          icon="i-lucide:user"
        />

        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p class="truncate text-sm font-medium text-default">
            {{ user?.firstName }} {{ user?.lastName }}
          </p>
          <p class="truncate text-xs text-muted">{{ user?.email }}</p>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
