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

type UI = {
  base?: string;
  label?: string;
  leadingIcon?: string;
  trailingIcon?: string;
};

type DatePickerProps = {
  label?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "error"
    | "neutral";
  variant?: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  square?: boolean;
  block?: boolean;
  loadingAuto?: boolean;
  icon?: string;
  leading?: boolean;
  leadingIcon?: string;
  trailing?: boolean;
  trailingIcon?: string;
  loading?: boolean;
  loadingIcon?: string;
  to?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: null | "_blank" | "_parent" | "_self" | "_top" | string;
  ui?: UI;
};

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const modelValue = defineModel<CalendarDate>();

const props = withDefaults(defineProps<DatePickerProps>(), {
  color: "neutral",
  variant: "outline",
  icon: "i-lucide-calendar",
  size: "md",
  block: false,
  square: false,
  loading: false,
  loadingAuto: false,
  disabled: false,
  leading: true,
  trailing: false,
  type: "button",
  label: undefined,
  leadingIcon: undefined,
  trailingIcon: undefined,
  loadingIcon: undefined,
  to: undefined,
  target: "_self",
  ui: undefined,
});

const { size: formGroupSize } = useFormField();
const buttonSize = computed(() => props.size || formGroupSize.value);
</script>
