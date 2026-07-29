import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2026-03-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/ui",
    "@nuxthub/core",
    "@vueuse/nuxt",
    "@onmax/nuxt-better-auth",
    "@nuxt/test-utils/module",
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["better-auth/client/plugins"],
    },
  },

  runtimeConfig: {
    resend: {
      apiKey: "",
      fromEmail: "",
    },
    public: {
      siteUrl: "",
    },
  },

  hub: {
    db: {
      dialect: "postgresql",
      driver: process.env.DATABASE_DRIVER as any,
      casing: "snake_case",
    },
    kv: true,
  },

  auth: {
    hubSecondaryStorage: true,
    schema: {
      casing: "snake_case",
    },
    redirects: {
      login: "/auth/login",
      guest: "/",
      authenticated: "/",
      logout: "/auth/login",
    },
    preserveRedirect: true,
  },

  routeRules: {
    "/admin/**": { auth: { user: { role: "admin" } } },
    "/profile/**": { auth: "user" },
    "/meal-plans/**": { auth: "user" },
    "/shopping-lists/**": { auth: "user" },
    "/auth/**": { auth: "guest" },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  fonts: {
    families: [
      { name: "Geist", provider: "local" },
      { name: "Geist Mono", provider: "local" },
      { name: "Geist Pixel", provider: "local" },
    ],
  },
});
