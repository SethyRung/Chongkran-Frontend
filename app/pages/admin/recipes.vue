<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { RecipeResponse } from "#shared/types";

definePageMeta({ layout: "admin" });

const toast = useToast();
const router = useRouter();

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

const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const {
  data: recipesData,
  pending,
  refresh,
} = await useFetch("/api/recipes", {
  query: {
    offset,
    limit,
  },
});

const total = computed(() =>
  isSuccessResponse(recipesData.value) ? (recipesData.value.meta?.total ?? 0) : 0,
);
const recipes = computed(() => recipesData.value?.data ?? []);

const table = useTemplateRef("table");
const columnFilters = ref([]);

const confirmModal = ref(false);
const confirmAction = ref<{ id: string; action: string; label: string } | null>(null);

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UAvatar = resolveComponent("UAvatar");

function difficultyColor(d: string) {
  if (d === "easy") return "success";
  if (d === "medium") return "warning";
  return "error";
}

function statusColor(s?: string) {
  if (s === "approved") return "success";
  if (s === "rejected") return "error";
  return "warning";
}

const columns: TableColumn<RecipeResponse>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) =>
      h(UAvatar, {
        src: row.original.image,
        alt: row.original.title,
        size: "sm",
        icon: "i-lucide:image",
      }),
    meta: { class: { td: "w-12" } },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) =>
      h(
        "span",
        {
          class: "font-medium text-default cursor-pointer hover:text-primary transition-colors",
          onClick: () => router.push(`/recipes/${row.original.id}`),
        },
        row.original.title,
      ),
  },
  {
    accessorKey: "authorName",
    header: "Author",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.difficulty,
        color: difficultyColor(row.original.difficulty),
        variant: "subtle",
        size: "sm",
      }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.status ?? "pending",
        color: statusColor(row.original.status),
        variant: "subtle",
        size: "sm",
        class: "capitalize",
      }),
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
                label: "View",
                icon: "i-lucide:eye",
                onSelect: () => router.push(`/recipes/${row.original.id}`),
              },
            ],
            [
              {
                label: "Approve",
                icon: "i-lucide:check",
                onSelect: () =>
                  openConfirm(row.original.id, "approved", `Approve "${row.original.title}"?`),
              },
              {
                label: "Reject",
                icon: "i-lucide:x",
                color: "warning",
                onSelect: () =>
                  openConfirm(row.original.id, "rejected", `Reject "${row.original.title}"?`),
              },
            ],
            [
              {
                label: "Delete",
                icon: "i-lucide:trash",
                color: "error",
                onSelect: () =>
                  openConfirm(row.original.id, "delete", `Delete "${row.original.title}"?`),
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

function openConfirm(id: string, action: string, label: string) {
  confirmAction.value = { id, action, label };
  confirmModal.value = true;
}

async function executeAction() {
  if (!confirmAction.value) return;

  try {
    const { id, action } = confirmAction.value;

    if (action === "delete") {
      const res = await $fetch<ApiResponse<RecipeResponse>>(`/api/recipes/${id}`, {
        method: "DELETE",
      });
      if (res.status.code === ApiResponseCode.Success) {
        toast.add({
          title: "Recipe deleted",
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
    } else {
      const res = await $fetch<ApiResponse<RecipeResponse>>(
        `/api/recipes/update-status?id=${id}&status=${action}`,
        {
          method: "PUT",
        },
      );
      if (res.status.code === ApiResponseCode.Success) {
        toast.add({
          title: `Recipe ${action}`,
          color: action === "approved" ? "success" : "warning",
          icon: action === "approved" ? "i-lucide-check-circle" : "i-lucide:x-circle",
        });
      } else {
        toast.add({
          title: "Action failed",
          description: res.status.message,
          color: "error",
          icon: "i-lucide-alert-circle",
        });
      }
    }

    await refresh();
  } catch {
    toast.add({
      title: "Action failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    confirmModal.value = false;
    confirmAction.value = null;
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Recipe Management">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UInput
          :model-value="table?.tableApi?.getColumn('title')?.getFilterValue() as string"
          icon="i-lucide:search"
          placeholder="Filter title..."
          class="w-64"
          @update:model-value="table?.tableApi?.getColumn('title')?.setFilterValue($event)"
        />

        <USelectMenu
          :model-value="(table?.tableApi?.getColumn('status')?.getFilterValue() as string) ?? 'all'"
          value-key="value"
          :items="statusFilterOptions"
          placeholder="Filter status"
          class="w-40"
          @update:model-value="
            table?.tableApi
              ?.getColumn('status')
              ?.setFilterValue($event === 'all' ? undefined : $event)
          "
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="recipes"
        :columns="columns"
        :loading="pending"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-lucide:chef-hat" class="size-10 text-muted" />
            <p class="text-sm text-muted">No recipes found.</p>
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
                <UButton
                  :label="
                    confirmAction?.action === 'delete'
                      ? 'Delete'
                      : confirmAction?.action === 'approved'
                        ? 'Approve'
                        : 'Reject'
                  "
                  :color="
                    confirmAction?.action === 'delete' || confirmAction?.action === 'rejected'
                      ? 'error'
                      : 'success'
                  "
                  @click="executeAction"
                />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
