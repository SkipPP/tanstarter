import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const storageKey = "theme";

const setThemeValidator = z.enum(["light", "dark", "system"]);
export type Theme = z.infer<typeof setThemeValidator>;

export const getThemeServerFn = createServerFn().handler(
  () => (getCookie(storageKey) ?? "dark") as Theme,
);

export const themeQueryOptions = () =>
  queryOptions({
    queryKey: ["theme"],
    queryFn: ({ signal }) => getThemeServerFn({ signal }),
    // Cookie only changes via setThemeServerFn; invalidate manually on toggle.
    staleTime: Number.POSITIVE_INFINITY,
  });
  
export const setThemeServerFn = createServerFn()
  .inputValidator(setThemeValidator)
  .handler(({ data }) =>
    setCookie(storageKey, data, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    }),
  );
