<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { AuthorRequestResponse } from "#shared/types";

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
const statusFilter = ref("all");

const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const {
  data: requestsData,
  pending,
  refresh,
} = await useFetch("/api/users/authors/requests", {
  query: {
    offset,
    limit,
    status: statusFilter,
  },
});

const total = computed(() =>
  isSuccessResponse(requestsData.value) ? (requestsData.value.meta?.total ?? 0) : 0,
);
const requests = computed(() => requestsData.value?.data ?? []);

function statusColor(s?: string) {
  if (s === "approved") return "success";
  if (s === "rejected") return "error";
  return "warning";
}

function formatDate(dateStr?: Date | string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UAvatar = resolveComponent("UAvatar");

const table = useTemplateRef("table");
const columnFilters = ref([]);

const confirmModal = ref(false);
const confirmAction = ref<{ id: string; action: string; label: string } | null>(null);

function openConfirm(id: string, action: string, label: string) {
  confirmAction.value = { id, action, label };
  confirmModal.value = true;
}

async function executeAction() {
  if (!confirmAction.value) return;

  try {
    const { id, action } = confirmAction.value;

    const res = await $fetch<ApiResponse<string>>(`/api/users/authors/requests/${id}/${action}`, {
      method: "PATCH",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: `Request ${action}d`,
        color: action === "approve" ? "success" : "warning",
        icon: action === "approve" ? "i-lucide-check-circle" : "i-lucide:x-circle",
      });
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
    confirmModal.value = false;
    confirmAction.value = null;
  }
}

const columns: TableColumn<AuthorRequestResponse>[] = [
  {
    accessorKey: "firstName",
    header: "User",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: row.original.user.avatar,
          alt: `${row.original.user.firstName} ${row.original.user.lastName}`,
          size: "sm",
          icon: "i-lucide:user",
        }),
        h("div", [
          h(
            "p",
            { class: "font-medium text-default" },
            `${row.original.user.firstName} ${row.original.user.lastName}`,
          ),
          h("p", { class: "text-xs text-muted" }, row.original.user.email),
        ]),
      ]),
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
    id: "actions",
    header: "",
    cell: ({ row }) => {
      if (row.original.status !== "pending") {
        return null;
      }

      return h("div", { class: "flex gap-1" }, [
        h(UButton, {
          label: "Approve",
          size: "xs",
          color: "success",
          variant: "ghost",
          icon: "i-lucide:check",
          onClick: () =>
            openConfirm(
              row.original.id,
              "approve",
              `Approve "${row.original.user.firstName} ${row.original.user.lastName}"?`,
            ),
        }),
        h(UButton, {
          label: "Reject",
          size: "xs",
          color: "error",
          variant: "ghost",
          icon: "i-lucide:x",
          onClick: () =>
            openConfirm(
              row.original.id,
              "reject",
              `Reject "${row.original.user.firstName} ${row.original.user.lastName}"?`,
            ),
        }),
      ]);
    },
  },
];
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Author Requests">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #right>
          <USelectMenu
            v-model="statusFilter"
            value-key="value"
            :items="statusFilterOptions"
            placeholder="Filter status"
            class="w-40"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="requests"
        :columns="columns"
        :loading="pending"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-lucide:user-check" class="size-10 text-muted" />
            <p class="text-sm text-muted">No author requests found.</p>
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
                  :label="confirmAction?.action === 'approve' ? 'Approve' : 'Reject'"
                  :color="confirmAction?.action === 'approve' ? 'success' : 'error'"
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
