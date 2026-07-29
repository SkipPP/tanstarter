/**
 * Restricts redirects to same-app relative paths (blocks open redirects).
 */
function hasUnsafeRedirectCharacter(value: string): boolean {
  return [...value].some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint <= 0x1f || codePoint === 0x7f || character === "\\";
  });
}

export function safeInternalRedirectPath(path: string, fallback = "/app"): string {
  const safeFallback =
    fallback.startsWith("/") && !fallback.startsWith("//") && !fallback.includes("\\")
      ? fallback
      : "/app";

  if (path !== path.trim() || !path.startsWith("/") || path.startsWith("//")) {
    return safeFallback;
  }

  if (hasUnsafeRedirectCharacter(path)) {
    return safeFallback;
  }

  try {
    const { pathname, search, hash } = new URL(path, "http://local.invalid");
    const decodedPathname = decodeURIComponent(pathname);

    if (
      !pathname.startsWith("/") ||
      pathname.startsWith("//") ||
      decodedPathname.startsWith("//") ||
      hasUnsafeRedirectCharacter(decodedPathname)
    ) {
      return safeFallback;
    }

    return pathname + search + hash;
  } catch {
    return safeFallback;
  }
}
