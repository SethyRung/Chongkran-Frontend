<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const toast = useToast();

const {
  data: shoppingList,
  pending,
  refresh,
} = await useAsyncData("shopping-list", async () => {
  const res = await $fetch<ApiResponse<ShoppingListResponse>>("/api/shopping-lists");
  if (isSuccessResponse(res)) return res.data;
  return null;
});

const items = computed(() => shoppingList.value?.items ?? []);
const checkedCount = computed(() => items.value.filter((i) => i.checked).length);

const addSchema = z.object({
  name: z.string("Item name is required").trim().min(1, "Item name is required"),
  quantity: z.string("Quantity is required").trim().min(1, "Quantity is required"),
});

type AddSchema = z.output<typeof addSchema>;

const addState = reactive({
  name: undefined as string | undefined,
  quantity: undefined as string | undefined,
});

const confirmModal = ref(false);
const saving = ref(false);

async function createList(initialItems?: ShoppingItem[]) {
  try {
    saving.value = true;
    const res = await $fetch<ApiResponse<ShoppingListResponse>>("/api/shopping-lists", {
      method: "POST",
      body: { items: initialItems ?? [] },
    });
    if (isSuccessResponse(res)) {
      toast.add({
        title: "Shopping list created",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      await refresh();
    } else {
      toast.add({
        title: "Failed to create list",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({ title: "Something went wrong", color: "error", icon: "i-lucide-alert-circle" });
  } finally {
    saving.value = false;
  }
}

async function updateItems(updatedItems: ShoppingItem[]) {
  if (!shoppingList.value) return;
  try {
    const res = await $fetch<ApiResponse<ShoppingListResponse>>("/api/shopping-lists", {
      method: "PATCH",
      body: { items: updatedItems },
    });
    if (isSuccessResponse(res)) {
      shoppingList.value = res.data;
    } else {
      toast.add({
        title: "Update failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
      await refresh();
    }
  } catch {
    toast.add({ title: "Something went wrong", color: "error", icon: "i-lucide-alert-circle" });
    await refresh();
  }
}

async function onAddItem(_event: FormSubmitEvent<AddSchema>) {
  const newItem: ShoppingItem = {
    name: addState.name!,
    quantity: addState.quantity!,
    checked: false,
  };

  const updatedItems = [...items.value, newItem];

  if (!shoppingList.value) {
    await createList([newItem]);
  } else {
    await updateItems(updatedItems);
  }

  addState.name = undefined;
  addState.quantity = undefined;
}

async function toggleItem(index: number) {
  const updatedItems = items.value.map((item, i) =>
    i === index ? { ...item, checked: !item.checked } : item,
  );
  await updateItems(updatedItems);
}

async function removeItem(index: number) {
  const updatedItems = items.value.filter((_, i) => i !== index);
  await updateItems(updatedItems);
}

async function deleteList() {
  try {
    const res = await $fetch<ApiResponse<string>>("/api/shopping-lists", {
      method: "DELETE",
    });
    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Shopping list deleted",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      await refresh();
    } else {
      toast.add({
        title: "Delete failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({ title: "Something went wrong", color: "error", icon: "i-lucide-alert-circle" });
  } finally {
    confirmModal.value = false;
  }
}
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div class="mb-8 flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">My Shopping List</h1>
          <p class="text-muted">Keep track of ingredients you need to buy</p>
        </div>
        <UButton
          v-if="shoppingList"
          label="Delete List"
          icon="i-lucide:trash"
          color="error"
          variant="subtle"
          @click="confirmModal = true"
        />
      </div>

      <div v-if="pending" class="space-y-4">
        <USkeleton class="h-16 rounded-lg" />
        <USkeleton class="h-12 rounded-lg" />
        <USkeleton class="h-12 rounded-lg" />
        <USkeleton class="h-12 rounded-lg" />
      </div>

      <div v-else class="max-w-2xl space-y-6">
        <UForm
          v-if="shoppingList || items.length > 0"
          :schema="addSchema"
          :state="addState"
          @submit="onAddItem"
        >
          <UCard>
            <div class="flex items-end gap-3">
              <UFormField name="name" label="Item" class="flex-1">
                <UInput v-model="addState.name" placeholder="e.g., Tomatoes" />
              </UFormField>
              <UFormField name="quantity" label="Quantity" class="w-36">
                <UInput v-model="addState.quantity" placeholder="e.g., 2 lbs" />
              </UFormField>
              <UButton type="submit" icon="i-lucide:plus" :loading="saving" label="Add" />
            </div>
          </UCard>
        </UForm>

        <div v-if="items.length > 0" class="space-y-2">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted">
              {{ checkedCount }} of {{ items.length }} item{{ items.length !== 1 ? "s" : "" }}
              checked
            </p>
            <UButton
              v-if="checkedCount > 0"
              label="Clear checked"
              variant="ghost"
              size="sm"
              icon="i-lucide:x"
              @click="updateItems(items.filter((i) => !i.checked))"
            />
          </div>

          <UCard
            v-for="(item, index) in items"
            :key="index"
            :class="{ 'opacity-60': item.checked }"
          >
            <div class="flex items-center gap-3">
              <UCheckbox :model-value="item.checked" @update:model-value="toggleItem(index)" />
              <div class="flex-1 min-w-0">
                <p
                  class="font-medium text-default"
                  :class="{ 'line-through text-muted': item.checked }"
                >
                  {{ item.name }}
                </p>
              </div>
              <UBadge variant="subtle" color="neutral" size="sm">{{ item.quantity }}</UBadge>
              <UButton
                icon="i-lucide:trash"
                variant="ghost"
                color="error"
                size="xs"
                @click="removeItem(index)"
              />
            </div>
          </UCard>
        </div>

        <div v-else-if="shoppingList" class="text-center py-12">
          <UIcon name="i-lucide:shopping-basket" class="size-12 mx-auto mb-4 text-muted" />
          <h3 class="text-lg font-medium mb-2">Your list is empty</h3>
          <p class="text-muted">Add items above to start building your shopping list</p>
        </div>

        <div v-else class="text-center py-16">
          <UIcon name="i-lucide:shopping-cart" class="size-16 mx-auto mb-4 text-muted" />
          <h3 class="text-lg font-medium mb-2">No shopping list yet</h3>
          <p class="text-muted mb-6">Create a shopping list to keep track of ingredients</p>
          <UButton
            label="Create Shopping List"
            icon="i-lucide:plus"
            :loading="saving"
            @click="createList()"
          />
        </div>
      </div>

      <UModal v-model:open="confirmModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">Delete Shopping List</h3>
            </template>
            <p class="text-muted">
              Are you sure you want to delete your shopping list? All items will be removed. This
              action cannot be undone.
            </p>
            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  @click="confirmModal = false"
                />
                <UButton label="Delete" color="error" @click="deleteList" />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </UContainer>
  </UPage>
</template>
