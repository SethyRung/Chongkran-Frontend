<template>
  <UPopover>
    <UButton v-bind="props" :size="buttonSize">
      {{
        modelValue
          ? df.format(modelValue.toDate(getLocalTimeZone()))
          : "Select a date"
      }}
    </UButton>
    <template #content>
      <UCalendar v-model="modelValue" class="p-2" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import type { ButtonProps } from "@nuxt/ui";

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const modelValue = defineModel<CalendarDate>();

const props = withDefaults(defineProps<ButtonProps>(), {
  color: "neutral",
  variant: "outline",
  icon: "i-lucide-calendar",
});

const { size: formGroupSize } = useFormField();
const buttonSize = computed(() => props.size || formGroupSize.value);
</script>
