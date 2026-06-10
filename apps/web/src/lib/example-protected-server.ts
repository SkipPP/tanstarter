import { authMiddleware } from "@repo/auth/tanstack/middleware";
import { createServerFn } from "@tanstack/react-start";

/**
 * Example protected server function: requires an authenticated user.
 * Use this pattern for any server function that should only run for logged-in users.
 *
 * @example
 * export const myProtectedFn = createServerFn()
 *   .middleware(authMiddleware)
 *   .handler(async ({ context }) => {
 *     // context.user is typed and guaranteed by the middleware
 *     return doSomething(context.user);
 *   });
 */
export const $getGreeting = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return {
      message: `A message from protected server function`,
      email: context.user.email,
    };
  });
