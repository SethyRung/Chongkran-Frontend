export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/image"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: "light",
  },

  compatibilityDate: "2024-11-27",
});
