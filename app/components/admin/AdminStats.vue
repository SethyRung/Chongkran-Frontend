<script lang="ts">
import type { AdminStatsResponse } from "~~/shared/types";

interface AdminStatsProps {
  stats?: AdminStatsResponse;
  loading?: boolean;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<AdminStatsProps>(), {
  stats: undefined,
  loading: false,
});

const cards = computed(() => [
  {
    icon: "i-lucide:users",
    title: "Total Users",
    value: props.stats?.totalUsers ?? 0,
    color: "text-primary",
  },
  {
    icon: "i-lucide:chef-hat",
    title: "Total Recipes",
    value: props.stats?.totalRecipes ?? 0,
    color: "text-primary",
  },
  {
    icon: "i-lucide:clock",
    title: "Pending Recipes",
    value: props.stats?.totalPendingRecipes ?? 0,
    color: "text-warning",
  },
  {
    icon: "i-lucide:user-check",
    title: "Pending Author Requests",
    value: props.stats?.totalPendingAuthorRequests ?? 0,
    color: "text-warning",
  },
]);
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in cards"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: `p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col`,
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span v-if="!loading" class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>
        <USkeleton v-else class="h-7 w-16" />
      </div>
    </UPageCard>
  </UPageGrid>
</template>
