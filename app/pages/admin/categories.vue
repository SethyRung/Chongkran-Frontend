<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import type { CategoryResponse } from "#shared/types";

definePageMeta({ layout: "admin" });

const toast = useToast();
const categoryForm = useTemplateRef("categoryForm");

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
  data: categoriesData,
  pending,
  refresh,
} = await useFetch("/api/categories", {
  query: {
    offset,
    limit,
  },
});

const total = computed(() =>
  isSuccessResponse(categoriesData.value) ? (categoriesData.value.meta?.total ?? 0) : 0,
);
const categories = computed(() => categoriesData.value?.data ?? []);

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const table = useTemplateRef("table");
const columnFilters = ref([]);

const formModal = ref(false);
const formLoading = ref(false);
const editingCategory = ref<CategoryResponse | null>(null);

const confirmModal = ref(false);
const confirmAction = ref<{ id: string; action: string; label: string } | null>(null);

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  description: "",
});

function openCreateModal() {
  editingCategory.value = null;
  state.name = "";
  state.description = "";
  formModal.value = true;
}

function openEditModal(category: CategoryResponse) {
  editingCategory.value = category;
  state.name = category.name;
  state.description = category.description ?? "";
  formModal.value = true;
}

function openConfirm(id: string, action: string, label: string) {
  confirmAction.value = { id, action, label };
  confirmModal.value = true;
}

function onCategorySaveClick() {
  categoryForm.value?.submit();
}

async function onFormSubmit(event: FormSubmitEvent<Schema>) {
  try {
    formLoading.value = true;
    const { data } = event;

    let res;

    if (editingCategory.value) {
      res = await $fetch<ApiResponse<CategoryResponse>>(
        `/api/categories/${editingCategory.value.id}`,
        {
          method: "PATCH",
          body: data,
        },
      );
    } else {
      res = await $fetch<ApiResponse<CategoryResponse>>("/api/categories", {
        method: "POST",
        body: data,
      });
    }

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: editingCategory.value ? "Category updated" : "Category created",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      formModal.value = false;
      await refresh();
    } else {
      toast.add({
        title: "Action failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Action failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    formLoading.value = false;
  }
}

async function executeAction() {
  if (!confirmAction.value) return;

  try {
    const { id } = confirmAction.value;

    const res = await $fetch<ApiResponse<CategoryResponse>>(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Category deleted",
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

const columns: TableColumn<CategoryResponse>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => h("span", { class: "font-medium text-default" }, row.original.name),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) =>
      h(
        "p",
        { class: "text-sm text-muted line-clamp-2 max-w-xs" },
        row.original.description || "—",
      ),
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
                label: "Edit",
                icon: "i-lucide:pencil",
                onSelect: () => openEditModal(row.original),
              },
            ],
            [
              {
                label: "Delete",
                icon: "i-lucide:trash",
                color: "error",
                onSelect: () =>
                  openConfirm(row.original.id, "delete", `Delete "${row.original.name}"?`),
              },
            ],
          ],
        },
        {
          default: () =>
            h(UButton, { icon: "i-lucide:ellipsis", color: "neutral", variant: "ghost" }),
        },
      ),
    meta: { class: { td: "w-10" } },
  },
];
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Category Management">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #right>
          <UButton label="New Category" icon="i-lucide:plus" @click="openCreateModal" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="categories"
        :columns="columns"
        :loading="pending"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-lucide:tag" class="size-10 text-muted" />
            <p class="text-sm text-muted">No categories found.</p>
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

      <UModal v-model:open="formModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">
                {{ editingCategory ? "Edit Category" : "New Category" }}
              </h3>
            </template>

            <UForm
              ref="categoryForm"
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onFormSubmit"
            >
              <UFormField name="name" label="Name" required>
                <UInput v-model="state.name" placeholder="Category name" class="w-full" />
              </UFormField>

              <UFormField name="description" label="Description">
                <UTextarea
                  v-model="state.description"
                  placeholder="Optional description..."
                  :rows="3"
                  class="w-full"
                />
              </UFormField>
            </UForm>

            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  @click="formModal = false"
                />
                <UButton
                  :label="editingCategory ? 'Save Changes' : 'Create Category'"
                  icon="i-lucide:check"
                  :loading="formLoading"
                  @click="onCategorySaveClick"
                />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>

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
