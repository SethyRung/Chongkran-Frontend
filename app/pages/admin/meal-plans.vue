<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { MealPlanResponse } from "#shared/types";

definePageMeta({ layout: "admin" });

const toast = useToast();

const page = ref(1);
const limit = ref(10);
const limitOptions = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

watch(limit, () => {
  page.value = 1;
});

const offset = computed(() => (page.value - 1) * limit.value);

const {
  data: mealPlansData,
  pending,
  refresh,
} = await useFetch("/api/meal-plans", {
  query: {
    offset,
    limit,
  },
});

const total = computed(() =>
  isSuccessResponse(mealPlansData.value) ? (mealPlansData.value.meta?.total ?? 0) : 0,
);
const mealPlans = computed(() => mealPlansData.value?.data ?? []);

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function resolveOwnerName(plan: MealPlanResponse) {
  if (plan.userName) return plan.userName;
  if (plan.user) {
    const name = `${plan.user.firstName ?? ""} ${plan.user.lastName ?? ""}`.trim();
    if (name) return name;
  }
  return plan.userId || "Unknown user";
}

function resolveOwnerEmail(plan: MealPlanResponse) {
  return plan.userEmail ?? plan.user?.email ?? "";
}

function resolveOwnerAvatar(plan: MealPlanResponse) {
  return plan.userAvatar ?? plan.user?.avatar;
}

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const table = useTemplateRef("table");
const columnFilters = ref([]);

const confirmModal = ref(false);
const confirmAction = ref<{ id: string; label: string } | null>(null);

function openConfirm(id: string, label: string) {
  confirmAction.value = { id, label };
  confirmModal.value = true;
}

async function executeAction() {
  if (!confirmAction.value) return;

  try {
    const res = await $fetch<ApiResponse<string>>(`/api/meal-plans/${confirmAction.value.id}`, {
      method: "DELETE",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Meal plan deleted",
        color: "success",
        icon: "i-lucide-check-circle",
      });
    } else {
      toast.add({
        title: "Delete failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }

    await refresh();
  } catch {
    toast.add({
      title: "Delete failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    confirmModal.value = false;
    confirmAction.value = null;
  }
}

const columns: TableColumn<MealPlanResponse>[] = [
  {
    accessorKey: "userId",
    header: "Owner",
    cell: ({ row }) => {
      const name = resolveOwnerName(row.original);
      const email = resolveOwnerEmail(row.original);

      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: resolveOwnerAvatar(row.original),
          alt: name,
          size: "sm",
          icon: "i-lucide:user",
        }),
        h("div", [
          h("p", { class: "font-medium text-default" }, name),
          email ? h("p", { class: "text-xs text-muted" }, email) : null,
        ]),
      ]);
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) =>
      h("span", { class: "font-medium text-default" }, row.original.title || "Untitled"),
  },
  {
    accessorKey: "recipes",
    header: "Recipe count",
    cell: ({ row }) => String(row.original.recipes?.length ?? 0),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) =>
      h(
        UDropdownMenu,
        {
          items: [
            [
              {
                label: "Delete",
                icon: "i-lucide:trash",
                color: "error",
                onSelect: () =>
                  openConfirm(row.original.id, `Delete "${row.original.title || "Meal plan"}"?`),
              },
            ],
          ],
        },
        {
          default: () =>
            h(UButton, {
              icon: "i-lucide:ellipsis",
              color: "neutral",
              variant: "ghost",
            }),
        },
      ),
    meta: { class: { td: "w-10" } },
  },
];
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Meal Plans">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="mealPlans"
        :columns="columns"
        :loading="pending"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-lucide:calendar" class="size-10 text-muted" />
            <p class="text-sm text-muted">No meal plans found.</p>
          </div>
        </template>
      </UTable>

      <div class="w-full flex justify-between items-center">
        <div>
          <span>item: </span>
          <USelect v-model="limit" :items="limitOptions" />
        </div>

        <UPagination v-model:page="page" :total="total" :items-per-page="limit" />
      </div>

      <UModal v-model:open="confirmModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">Confirm Action</h3>
            </template>

            <p class="text-muted">{{ confirmAction?.label }}</p>

            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  @click="confirmModal = false"
                />
                <UButton label="Delete" color="error" @click="executeAction" />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
