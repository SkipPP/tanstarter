/**
 * Restricts redirects to same-app relative paths (blocks open redirects).
 */
export function safeInternalRedirectPath(path: string, fallback = "/app"): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  if (path.includes(":\\") || path.includes("\\")) {
    return fallback;
  }

  try {
    const { pathname, search, hash } = new URL(path, "http://local.invalid");

    if (!pathname.startsWith("/") || pathname.startsWith("//")) {
      return fallback;
    }

    return pathname + search + hash;
  } catch {
    return fallback;
  }
}
