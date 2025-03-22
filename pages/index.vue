<template>
  <div class="p-4 md:px-12 lg:px-20 space-y-8">
    <div
      class="relative md:h-[500px] p-4 md:p-12 rounded-2xl overflow-hidden flex justify-between items-center gap-4 bg-[url('/images/hero.jpg')] bg-cover bg-right"
    >
      <div class="absolute inset-0 bg-gray-50/50"></div>
      <div
        v-motion-slide-visible-once-bottom
        :duration="800"
        class="h-full space-y-3 z-10"
      >
        <h2 class="font-semibold text-2xl md:text-5xl text-black">
          Adventure <br /><span class="text-primary-500">of Delicacies</span>
        </h2>
        <p class="max-w-lg text-xl">
          Unlock a world of variety culinary recipes and unleash your inner chef
          the easy way with <span class="text-primary-500">Chongkran</span>.
        </p>
        <UButton
          trailing-icon="i-lucide-chef-hat"
          label="Explore Recipes"
          size="xl"
          color="neutral"
          class="mt-8 rounded-full"
          to="/recipes"
        />
      </div>
    </div>
    <div
      class="p-6 rounded-2xl bg-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-10"
    >
      <div>
        <div class="size-8 mb-4 rounded-full bg-white relative">
          <UIcon
            name="i-lucide-user"
            class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            size="20"
          />
        </div>
        <h3 class="font-bold mb-1">User-Centered</h3>
        <p>
          Your feedback shapes our platform, ensuring a seamless and satisfying
          culinary journey.
        </p>
      </div>
      <div>
        <div class="size-8 mb-4 rounded-full bg-white relative">
          <UIcon
            name="i-lucide-contrast"
            class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            size="20"
          />
        </div>
        <h3 class="font-bold mb-1">Diverse Recipes</h3>
        <p>
          We celebrate diverse culinary traditions from around the world,
          inspiring you today.
        </p>
      </div>
      <div>
        <div class="size-8 mb-4 rounded-full bg-white relative">
          <UIcon
            name="i-lucide-heart"
            class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            size="20"
          />
        </div>
        <h3 class="font-bold mb-1">Fun Community</h3>
        <p>
          We foster a vibrant foodie community where joy comes with sharing
          recipes with us.
        </p>
      </div>
    </div>
    <div>
      <div class="max-w-96 mx-auto mt-14 mb-8 space-y-3">
        <h2 class="font-bold text-3xl text-center">
          Become a true <span class="text-primary-500">chef</span> with our
          recipes.
        </h2>
        <p class="text-lg text-center">
          We are a home to variety of recipes worldwide for you to learn.
        </p>
      </div>
      <div
        class="overflow-hidden flex flex-wrap justify-center items-end gap-6"
      >
        <div
          v-motion-slide-visible-once-top
          :delay="200"
          :duration="800"
          class="relative w-full md:w-80 max-w-md h-80 md:mb-10 rounded-2xl bg-[url('/images/follow-recipe.jpg')] bg-cover bg-center"
        >
          <div
            class="absolute left-4 bottom-4 w-fit p-2 rounded-full flex justify-center items-center gap-2 bg-white"
          >
            <div class="size-8 p-2 rounded-full bg-primary-200">
              <UIcon name="i-lucide-slice" class="text-primary-500" />
            </div>
            <p>Easy to follow recipes</p>
          </div>
        </div>
        <div
          v-motion-slide-visible-once-bottom
          :duration="800"
          :delay="30"
          class="md:w-80 h-48 p-4 rounded-2xl grid place-items-center bg-primary-500/80"
        >
          <p class="text-4xl font-semibold text-white">
            “Cooking has never been this easy!”
          </p>
        </div>
        <div
          v-motion-slide-visible-once-top
          :duration="800"
          :delay="400"
          class="w-full md:w-80 max-w-md p-4 md:mb-16 space-y-2 rounded-2xl bg-gray-100/50 flex flex-col"
        >
          <div class="px-4 py-2 rounded-lg bg-white flex items-center gap-4">
            <div class="size-14 rounded-full bg-primary-200 relative">
              <UIcon
                name="i-lucide-tv-minimal-play"
                class="text-primary-500 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                size="28"
              />
            </div>
            <div>
              <h4 class="font-bold">Watch Now</h4>
              <p class="text-sm">Cook with Master chef</p>
            </div>
          </div>
          <div class="px-4 py-2 rounded-lg bg-white flex items-center gap-4">
            <div class="size-14 rounded-full bg-primary-200 relative">
              <UIcon
                name="i-lucide-concierge-bell"
                class="text-primary-500 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                size="28"
              />
            </div>
            <div>
              <h4 class="font-bold">Today's Recipe</h4>
              <p class="text-sm">Caprese Salad Skewers</p>
            </div>
          </div>
          <div class="px-4 py-2 rounded-lg bg-white flex items-center gap-4">
            <div class="size-14 rounded-full bg-primary-200 relative">
              <UIcon
                name="i-lucide-chef-hat"
                class="text-primary-500 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                size="28"
              />
            </div>
            <div>
              <h4 class="font-bold">Contribute Now</h4>
              <p class="text-sm">Share your special recipe!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold">
          Popular <span class="text-primary-500">Recipes</span> Today
        </h3>
        <UButton label="More Recipe" variant="subtle" to="/recipes" />
      </div>
      <div
        class="mt-8 grid grid-cols-[repeat(auto-fit,_minmax(288px,_1fr))] gap-4"
      >
        <RecipeCard
          v-for="recipe in allRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Recipe } from "~/types/Recipe";

const allRecipes = ref<Recipe[]>([
  {
    id: "1",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Aubergine and Sesame Noodles",
    type: "Vegetarian Delights",
    isFavorite: true,
  },
  {
    id: "2",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Spaghetti Carbonara",
    type: "Main Courses",
    isFavorite: false,
  },
  {
    id: "3",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Caesar Salad",
    type: "Salads & Sides",
    isFavorite: false,
  },
  {
    id: "4",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Chocolate Cake",
    type: "Desserts & Sweets",
    isFavorite: false,
  },
]);
</script>
