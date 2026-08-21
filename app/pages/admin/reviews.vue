<script setup lang="ts">
import { h } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { ReviewResponse } from "#shared/types";

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
const search = ref("");
const ratingMin = ref<"any" | number>("any");
const ratingMax = ref<"any" | number>("any");

watch(search, () => {
  page.value = 1;
});

watch(ratingMin, (value) => {
  if (value !== "any" && ratingMax.value !== "any" && value > ratingMax.value) {
    ratingMax.value = value;
  }
  page.value = 1;
});

watch(ratingMax, (value) => {
  if (value !== "any" && ratingMin.value !== "any" && value < ratingMin.value) {
    ratingMin.value = value;
  }
  page.value = 1;
});

const ratingMinOptions = [
  { label: "Any", value: "any" },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "5", value: 5 },
];

const ratingMaxOptions = [
  { label: "Any", value: "any" },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const searchParam = computed(() => search.value || undefined);
const ratingMinParam = computed(() => (ratingMin.value === "any" ? undefined : ratingMin.value));
const ratingMaxParam = computed(() => (ratingMax.value === "any" ? undefined : ratingMax.value));

const {
  data: reviewsData,
  pending,
  refresh,
} = await useFetch("/api/reviews", {
  query: {
    offset,
    limit,
    search: searchParam,
    ratingMin: ratingMinParam,
    ratingMax: ratingMaxParam,
  },
});

const total = computed(() =>
  isSuccessResponse(reviewsData.value) ? (reviewsData.value.meta?.total ?? 0) : 0,
);
const reviews = computed(() => reviewsData.value?.data ?? []);

function resolveUserName(review: ReviewResponse) {
  if (review.userName) return review.userName;
  if (review.user) {
    const name = `${review.user.firstName ?? ""} ${review.user.lastName ?? ""}`.trim();
    if (name) return name;
  }
  return review.userId || "Unknown user";
}

function resolveUserEmail(review: ReviewResponse) {
  return review.user?.email ?? "";
}

function resolveUserAvatar(review: ReviewResponse) {
  return review.userAvatar ?? review.user?.avatar;
}

function resolveRecipeTitle(review: ReviewResponse) {
  return review.recipeTitle ?? review.recipe?.title ?? "—";
}

function resolveRecipeId(review: ReviewResponse) {
  return review.recipeId ?? review.recipe?.id;
}

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UIcon = resolveComponent("UIcon");

const table = useTemplateRef("table");
const columnFilters = ref([]);

const confirmModal = ref(false);
const confirmAction = ref<{ id: string; label: string } | null>(null);

function openConfirm(id: string, label: string) {
  confirmAction.value = { id, label };
  confirmModal.value = true;
}

function renderRating(rating: number) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));

  return h("div", { class: "flex items-center gap-1" }, [
    ...Array.from({ length: 5 }, (_, index) =>
      h(UIcon, {
        name: "i-lucide:star",
        class: index < filled ? "text-warning" : "text-muted",
      }),
    ),
    h("span", { class: "text-xs text-muted ml-1" }, Number(rating).toFixed(1)),
  ]);
}

async function executeAction() {
  if (!confirmAction.value) return;

  try {
    const res = await $fetch<ApiResponse<string>>(`/api/reviews/${confirmAction.value.id}`, {
      method: "DELETE",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Review deleted",
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

const columns: TableColumn<ReviewResponse>[] = [
  {
    accessorKey: "userId",
    header: "User",
    cell: ({ row }) => {
      const name = resolveUserName(row.original);
      const email = resolveUserEmail(row.original);

      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: resolveUserAvatar(row.original),
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
    accessorKey: "recipeTitle",
    header: "Recipe",
    cell: ({ row }) => {
      const title = resolveRecipeTitle(row.original);
      const recipeId = resolveRecipeId(row.original);

      if (!recipeId) {
        return h("span", { class: "text-sm text-muted" }, title);
      }

      return h(
        "span",
        {
          class: "font-medium text-default cursor-pointer hover:text-primary transition-colors",
          onClick: () => router.push(`/recipes/${recipeId}`),
        },
        title,
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => renderRating(row.original.rating),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) =>
      h("p", { class: "text-sm text-muted line-clamp-2 max-w-sm" }, row.original.comment || "—"),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
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
                  openConfirm(
                    row.original.id,
                    `Delete review from "${resolveUserName(row.original)}"?`,
                  ),
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
      <UDashboardNavbar title="Review Moderation">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="search"
            icon="i-lucide:search"
            placeholder="Search comment or recipe..."
            class="w-72"
          />
        </template>

        <template #right>
          <div class="flex items-center gap-3">
            <USelectMenu
              v-model="ratingMin"
              value-key="value"
              :items="ratingMinOptions"
              placeholder="Min rating"
              class="w-32"
            />
            <USelectMenu
              v-model="ratingMax"
              value-key="value"
              :items="ratingMaxOptions"
              placeholder="Max rating"
              class="w-32"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="reviews"
        :columns="columns"
        :loading="pending"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-lucide:message-square" class="size-10 text-muted" />
            <p class="text-sm text-muted">No reviews found.</p>
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
