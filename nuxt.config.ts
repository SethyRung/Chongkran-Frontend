export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
    "@sentry/nuxt/module",
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

  runtimeConfig: {
    public: {
      apiBaseUrl: "",
      atMaxAge: "",
      rtMaxAge: "",
      sentry: {
        dns: "",
      },
    },
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: "sethy-rung",
      project: "chongkran",
    },
    autoInjectServerSentry: "top-level-import",
    enabled: process.env.ENV === "production",
  },

  sourcemap: {
    client: "hidden",
  },
});
