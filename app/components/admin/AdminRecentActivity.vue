<script lang="ts">
import type { AdminActivityItem } from "#shared/types";

interface AdminRecentActivityProps {
  items?: AdminActivityItem[];
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<AdminRecentActivityProps>(), {
  items: undefined,
});

const iconMap: Record<string, string> = {
  user: "i-lucide:user-plus",
  recipe: "i-lucide:chef-hat",
  review: "i-lucide:star",
};
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h3 class="font-semibold">Recent Activity</h3>
        <p class="text-sm text-muted">Latest signups, recipes, and reviews</p>
      </div>
    </template>

    <div v-if="items?.length" class="space-y-3">
      <div
        v-for="(item, index) in items"
        :key="`${item.type}-${index}`"
        class="flex items-center gap-3 p-3 rounded-lg bg-elevated/50"
      >
        <UIcon :name="iconMap[item.type] ?? 'i-lucide:activity'" class="size-4 text-primary" />

        <div class="flex-1 min-w-0">
          <p class="truncate text-sm font-medium">{{ item.description }}</p>
        </div>

        <span class="text-xs text-muted">{{ formatDate(item.timestamp) }}</span>
      </div>
    </div>

    <UAlert
      v-else
      icon="i-lucide-check-circle"
      title="No recent activity"
      description="New events will show up here."
      color="neutral"
      variant="subtle"
    />
  </UCard>
</template>
