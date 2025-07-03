import type { NitroFetchOptions } from "nitropack";
import type { Response } from "~/types/Response";

export const useApi = async <T>(
  url: string,
  options: NitroFetchOptions<
    string,
    | "get"
    | "head"
    | "patch"
    | "post"
    | "put"
    | "delete"
    | "connect"
    | "options"
    | "trace"
  >
): Promise<Response<T>> => {
  return useNuxtApp().$api(url, options);
};
