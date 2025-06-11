import "@nuxt/types";

declare module "#app" {
  interface NuxtApp {
    $api: $Fetch<unknown, NitroFetchRequest>;
  }
}

declare module "#vue" {
  interface ComponentCustomProperties {
    $api: $Fetch<unknown, NitroFetchRequest>;
  }
}
