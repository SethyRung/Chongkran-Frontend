<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import type { FollowStatsResponse, UserResponse } from "#shared/types";

definePageMeta({ layout: "admin" });

const toast = useToast();
const editForm = useTemplateRef("editForm");

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
const search = ref("");
const roleFilter = ref("all");

const roleFilterOptions = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Author", value: "author" },
  { label: "User", value: "user" },
];

const {
  data: usersData,
  pending,
  refresh,
} = await useFetch<ApiResponse<UserResponse[]>>("/api/users", {
  query: {
    offset,
    limit,
  },
});

const total = computed(() =>
  isSuccessResponse(usersData.value) ? (usersData.value.meta?.total ?? 0) : 0,
);
const users = computed(() => usersData.value?.data ?? []);

const filteredUsers = computed(() => {
  let result = users.value;

  if (roleFilter.value !== "all") {
    result = result.filter((u) => u.role === roleFilter.value);
  }

  if (search.value) {
    const q = search.value.toLowerCase();
    result = result.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }

  return result;
});

const followStatsByUser = reactive<Record<string, FollowStatsResponse | null>>({});
const followStatsLoading = reactive<Record<string, boolean>>({});
const followStatsErrorShown = ref(false);

watch(
  () => filteredUsers.value.map((user) => user.id),
  async (userIds) => {
    const missing = userIds.filter(
      (id) => followStatsByUser[id] === undefined && !followStatsLoading[id],
    );
    if (!missing.length) return;

    await Promise.all(
      missing.map(async (id) => {
        followStatsLoading[id] = true;

        try {
          const res = await $fetch<ApiResponse<FollowStatsResponse>>(`/api/follows/stats/${id}`);

          if (res.status.code === ApiResponseCode.Success) {
            followStatsByUser[id] = res.data;
          } else {
            followStatsByUser[id] = null;
            if (!followStatsErrorShown.value) {
              followStatsErrorShown.value = true;
              toast.add({
                title: "Failed to load follow stats",
                description: res.status.message || "Some follow stats could not be loaded.",
                color: "warning",
                icon: "i-lucide-alert-circle",
              });
            }
          }
        } catch {
          followStatsByUser[id] = null;
          if (!followStatsErrorShown.value) {
            followStatsErrorShown.value = true;
            toast.add({
              title: "Failed to load follow stats",
              description: "Some follow stats could not be loaded.",
              color: "warning",
              icon: "i-lucide-alert-circle",
            });
          }
        } finally {
          followStatsLoading[id] = false;
        }
      }),
    );
  },
  { immediate: true },
);

function roleColor(role: string) {
  if (role === "admin") return "error";
  if (role === "author") return "primary";
  return "neutral";
}

function formatDate(dateStr?: Date | string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderFollowCount(userId: string, key: "followersCount" | "followingCount") {
  if (followStatsLoading[userId]) {
    return h(UIcon, { name: "i-lucide:loader-circle", class: "size-4 text-muted animate-spin" });
  }

  const stats = followStatsByUser[userId];
  if (!stats) {
    return h("span", { class: "text-sm text-muted" }, "—");
  }

  return h("span", { class: "text-sm text-default" }, String(stats[key]));
}

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UAvatar = resolveComponent("UAvatar");
const UIcon = resolveComponent("UIcon");

const table = useTemplateRef("table");
const columnFilters = ref([]);

const editModal = ref(false);
const editLoading = ref(false);
const editingUser = ref<UserResponse | null>(null);

const confirmModal = ref(false);
const confirmAction = ref<{ id: string; action: string; label: string } | null>(null);

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  dateOfBirth: "",
});

function openEditModal(user: UserResponse) {
  editingUser.value = user;
  state.firstName = user.firstName;
  state.lastName = user.lastName;
  state.email = user.email;
  state.gender = user.gender ?? "";
  state.dateOfBirth = user.dateOfBirth
    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
    : "";
  editModal.value = true;
}

function openConfirm(id: string, action: string, label: string) {
  confirmAction.value = { id, action, label };
  confirmModal.value = true;
}

function onSaveClick() {
  editForm.value?.submit();
}

async function onEditSubmit(event: FormSubmitEvent<Schema>) {
  if (!editingUser.value) return;

  try {
    editLoading.value = true;
    const { data } = event;

    const res = await $fetch<ApiResponse<UserResponse>>(`/api/users/${editingUser.value.id}`, {
      method: "PATCH",
      body: {
        ...data,
        dateOfBirth: data.dateOfBirth || undefined,
      },
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "User updated",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      editModal.value = false;
      await refresh();
    } else {
      toast.add({
        title: "Update failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Update failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    editLoading.value = false;
  }
}

async function executeAction() {
  if (!confirmAction.value) return;

  try {
    const { id } = confirmAction.value;

    const res = await $fetch<ApiResponse<UserResponse>>(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "User deleted",
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

const columns: TableColumn<UserResponse>[] = [
  {
    accessorKey: "firstName",
    header: "User",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: row.original.avatar,
          alt: `${row.original.firstName} ${row.original.lastName}`,
          size: "sm",
          icon: "i-lucide:user",
        }),
        h("div", [
          h(
            "p",
            { class: "font-medium text-default" },
            `${row.original.firstName} ${row.original.lastName}`,
          ),
          h("p", { class: "text-xs text-muted" }, row.original.email),
        ]),
      ]),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.role,
        color: roleColor(row.original.role),
        variant: "subtle",
        size: "sm",
        class: "capitalize",
      }),
  },
  {
    id: "followers",
    header: "Followers",
    cell: ({ row }) => renderFollowCount(row.original.id, "followersCount"),
  },
  {
    id: "following",
    header: "Following",
    cell: ({ row }) => renderFollowCount(row.original.id, "followingCount"),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
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
                  openConfirm(
                    row.original.id,
                    "delete",
                    `Delete "${row.original.firstName} ${row.original.lastName}"?`,
                  ),
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
      <UDashboardNavbar title="User Management">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide:search"
            placeholder="Search users..."
            class="w-64"
          />
        </template>

        <template #right>
          <USelectMenu
            v-model="roleFilter"
            value-key="value"
            :items="roleFilterOptions"
            placeholder="Filter role"
            class="w-40"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="filteredUsers"
        :columns="columns"
        :loading="pending"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-lucide:users" class="size-10 text-muted" />
            <p class="text-sm text-muted">No users found.</p>
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

      <UModal v-model:open="editModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">Edit User</h3>
            </template>

            <UForm
              ref="editForm"
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onEditSubmit"
            >
              <div class="flex gap-4">
                <UFormField name="firstName" label="First name" required class="flex-1">
                  <UInput v-model="state.firstName" placeholder="John" class="w-full" />
                </UFormField>

                <UFormField name="lastName" label="Last name" required class="flex-1">
                  <UInput v-model="state.lastName" placeholder="Doe" class="w-full" />
                </UFormField>
              </div>

              <UFormField name="email" label="Email" required>
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="you@example.com"
                  icon="i-lucide:mail"
                  class="w-full"
                />
              </UFormField>

              <USeparator />

              <div class="flex gap-4">
                <UFormField name="gender" label="Gender" class="flex-1">
                  <USelectMenu
                    v-model="state.gender"
                    :items="genderOptions"
                    value-key="value"
                    placeholder="Select gender"
                    class="w-full"
                  />
                </UFormField>

                <UFormField name="dateOfBirth" label="Date of Birth" class="flex-1">
                  <UInput v-model="state.dateOfBirth" type="date" class="w-full" />
                </UFormField>
              </div>
            </UForm>

            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  @click="editModal = false"
                />
                <UButton
                  label="Save Changes"
                  icon="i-lucide:check"
                  :loading="editLoading"
                  @click="onSaveClick"
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
