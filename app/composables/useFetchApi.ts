import type { UseFetchOptions } from "#app";
import type { Response } from "#shared/types/Response";

export const useFetchApi = async <T>(
  url: string | (() => string),
  options: UseFetchOptions<Response<T>>
) => {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
};
