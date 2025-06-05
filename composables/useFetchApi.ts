import type { UseFetchOptions } from "#app";

export const useFetchApi = async <T = unknown>(
  url: string | (() => string),
  options: UseFetchOptions<T>
) => {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
};
