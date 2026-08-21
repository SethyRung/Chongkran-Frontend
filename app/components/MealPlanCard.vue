<script lang="ts">
interface MealPlanCardProps {
  mealPlan: MealPlanResponse;
}
</script>
<script setup lang="ts">
const props = defineProps<MealPlanCardProps>();

const router = useRouter();

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

const groupedRecipes = computed(() => {
  const groups: Record<string, RecipeEntry[]> = {};
  for (const day of days) {
    const entries = props.mealPlan.recipes.filter((r) => r.day === day);
    if (entries.length > 0) {
      groups[day] = entries;
    }
  }
  return groups;
});

const recipeCount = computed(() => props.mealPlan.recipes.length);

const formattedDate = computed(() => formatDate(props.mealPlan.createdAt));

function navigateToDetail() {
  router.push(`/meal-plans/${props.mealPlan.id}`);
}
</script>

<template>
  <UCard
    :ui="{
      root: 'group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col',
      body: 'flex-1',
      footer: 'flex items-center justify-between',
    }"
    @click="navigateToDetail"
  >
    <div class="flex items-center gap-3 mb-4">
      <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
        <UIcon name="i-lucide:calendar" class="size-6" />
      </div>
      <div class="flex-1 min-w-0">
        <h3
          class="text-lg font-semibold text-default truncate group-hover:text-primary transition-colors"
        >
          {{ mealPlan.title }}
        </h3>
        <p class="text-sm text-muted">{{ formattedDate }}</p>
      </div>
    </div>

    <div class="space-y-3 mb-4">
      <div v-for="(entries, day) in groupedRecipes" :key="day" class="flex items-start gap-2">
        <span class="text-xs font-medium text-muted w-20 shrink-0 pt-0.5">{{ day }}</span>
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="entry in entries"
            :key="`${entry.day}-${entry.mealType}-${entry.recipeId}`"
            variant="soft"
            size="xs"
            color="neutral"
          >
            {{ entry.mealType }}
          </UBadge>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-1 text-sm text-muted">
        <UIcon name="i-lucide:utensils" class="size-4" />
        <span>{{ recipeCount }} recipe{{ recipeCount !== 1 ? "s" : "" }}</span>
      </div>

      <div
        class="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span>View</span>
        <UIcon name="i-lucide:arrow-right" class="size-4" />
      </div>
    </template>
  </UCard>
</template>
