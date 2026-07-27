<script lang="ts">
import { tv } from "tailwind-variants";

const theme = tv({
  slots: {
    root: "rounded-lg overflow-hidden bg-default ring ring-default divide-y divide-default w-full",
    base: "p-4 sm:p-6 flex items-center gap-4",
    wrapper: "size-12 shrink-0 rounded-full flex items-center justify-center",
    leadingIcon: "size-6",
    content: "min-w-0",
  },
  variants: {
    color: {
      primary: { wrapper: "bg-primary/10", leadingIcon: "text-primary" },
      warning: { wrapper: "bg-warning/10", leadingIcon: "text-warning" },
      success: { wrapper: "bg-success/10", leadingIcon: "text-success" },
      error: { wrapper: "bg-error/10", leadingIcon: "text-error" },
      neutral: { wrapper: "bg-neutral/10", leadingIcon: "text-neutral" },
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

type ColorVariant = "primary" | "warning" | "success" | "error" | "neutral";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: ColorVariant;
  loading?: boolean;
  class?: any;
  ui?: Record<string, string>;
}
</script>

<script setup lang="ts">
const props = defineProps<AdminStatCardProps>();

const ui = theme({ color: props.color });
</script>

<template>
  <div :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.base({ class: props.ui?.base })">
      <div :class="ui.wrapper({ class: props.ui?.wrapper })">
        <UIcon :name="icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </div>

      <div :class="ui.content({ class: props.ui?.content })">
        <p class="text-sm text-muted">{{ title }}</p>
        <p v-if="!loading" class="text-2xl font-bold text-default">
          {{ value }}
        </p>
        <USkeleton v-else class="h-7 w-16" />
      </div>
    </div>
  </div>
</template>
