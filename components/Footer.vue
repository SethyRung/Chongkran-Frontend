<template>
  <footer
    class="px-8 py-6 mx-4 md:mx-12 lg:mx-20 rounded-t-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 bg-stone-900 text-white"
  >
    <div class="space-y-5">
      <h1 class="text-4xl font-semibold">
        CHONG<span class="text-primary-500">KRAN</span>
      </h1>
      <p class="text-xl text-gray-300">
        Join Chongkran now and embark on a culinary journey to explore, create,
        and savor amazing recipes!
      </p>
    </div>
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div class="space-y-6">
        <h2 class="text-xl font-semibold">Company</h2>
        <div class="space-y-4">
          <NuxtLink
            v-for="(navigation, index) in navigationItems"
            :key="index"
            :to="navigation.to"
            class="block w-fit hover:underline text-gray-300 decoration-gray-300 transition-all"
            active-class="text-primary-500"
          >
            {{ navigation.label }}
          </NuxtLink>
        </div>
      </div>
      <div class="space-y-6">
        <h2 class="text-xl font-semibold">Contact</h2>
        <div class="space-y-4">
          <NuxtLink
            v-for="(navigation, index) in contactItems"
            :key="index"
            :to="navigation.to"
            class="block w-fit hover:underline text-gray-300 decoration-gray-300 transition-all"
            active-class="text-primary-500"
          >
            {{ navigation.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="w-full flex flex-col md:flex-row gap-2 lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3"
    >
      <UInput
        placeholder="Enter your email"
        :ui="{
          root: 'grow',
          base: 'h-10 px-5 rounded-full',
        }"
      />
      <UButton
        label="Sign up"
        class="min-w-28 h-10 grow md:grow-0 justify-center rounded-full"
      />
    </div>
    <p
      class="text-gray-300 self-center lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3"
    >
      Copyright © 2025 Chongkran. All rights reserved.
    </p>
  </footer>
</template>

<script lang="ts" setup>
const navigationItems = reactive<{ label: string; to: string }[]>([
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Recipes",
    to: "/recipes",
  },
  {
    label: "About",
    to: "/about",
  },
]);

const contactItems = reactive<{ label: string; to: string }[]>([
  {
    label: "Facebook",
    to: "https://web.facebook.com/Joker.username/",
  },
  {
    label: "Telegram",
    to: "https://t.me/sethyrung",
  },
]);
</script>
