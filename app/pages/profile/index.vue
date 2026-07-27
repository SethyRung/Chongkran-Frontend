<script setup lang="ts">
const { user } = useUserSession();

const { data: stats } = await useFetch(`/api/follows/stats/${user.value?.id}`, {
  lazy: true,
});

const followersCount = computed(() => stats.value?.data?.followersCount ?? 0);
const followingCount = computed(() => stats.value?.data?.followingCount ?? 0);
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <UCard class="text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <UIcon name="i-lucide-book-open" class="size-5 text-primary" />
          </div>
          <span class="text-2xl font-bold">—</span>
          <span class="text-sm text-muted">Recipes</span>
        </div>
      </UCard>

      <UCard class="text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <UIcon name="i-lucide-heart" class="size-5 text-primary" />
          </div>
          <span class="text-2xl font-bold">{{ followersCount }}</span>
          <span class="text-sm text-muted">Followers</span>
        </div>
      </UCard>

      <UCard class="text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <UIcon name="i-lucide-users" class="size-5 text-primary" />
          </div>
          <span class="text-2xl font-bold">{{ followingCount }}</span>
          <span class="text-sm text-muted">Following</span>
        </div>
      </UCard>

      <UCard class="text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <UIcon name="i-lucide-eye" class="size-5 text-primary" />
          </div>
          <span class="text-2xl font-bold">—</span>
          <span class="text-sm text-muted">Total Views</span>
        </div>
      </UCard>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user" class="size-5 text-primary" />
            <h3 class="font-semibold">About</h3>
          </div>
        </template>

        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-mail" class="size-4 text-muted" />
            <span class="text-sm">{{ user?.email }}</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-shield" class="size-4 text-muted" />
            <UBadge
              :color="
                user?.role === 'admin' ? 'error' : user?.role === 'author' ? 'primary' : 'neutral'
              "
              variant="subtle"
              class="capitalize"
            >
              {{ user?.role }}
            </UBadge>
          </div>
          <div v-if="user?.bio" class="flex items-start gap-3">
            <UIcon name="i-lucide-file-text" class="mt-0.5 size-4 text-muted" />
            <p class="text-sm text-muted">{{ user.bio }}</p>
          </div>
          <div v-if="!user?.bio" class="flex items-start gap-3">
            <UIcon name="i-lucide-file-text" class="mt-0.5 size-4 text-muted" />
            <p class="text-sm italic text-muted">No bio yet</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
            <h3 class="font-semibold">Quick Actions</h3>
          </div>
        </template>

        <div class="flex flex-col gap-2">
          <UButton
            to="/profile/recipes"
            label="View My Recipes"
            icon="i-lucide-book-open"
            variant="soft"
            color="neutral"
            block
          />
          <UButton
            to="/profile/settings"
            label="Edit Profile"
            icon="i-lucide-settings"
            variant="soft"
            color="neutral"
            block
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
