import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const storageKey = "theme";

const setThemeValidator = z.enum(["light", "dark", "system"]);
export type Theme = z.infer<typeof setThemeValidator>;

export const getThemeServerFn = createServerFn().handler(
  () => (getCookie(storageKey) ?? "dark") as Theme,
);
export const setThemeServerFn = createServerFn()
  .inputValidator(setThemeValidator)
  .handler(({ data }) => setCookie(storageKey, data));
