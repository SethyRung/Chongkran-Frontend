export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  css: ["~/assets/css/main.css", "~/assets/css/tailwind.css"],

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: "light",
  },

  compatibilityDate: "2024-11-27",
});
