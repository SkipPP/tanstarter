import { createFileRoute } from "@tanstack/react-router";

const siteUrl = new URL("/", import.meta.env.VITE_BASE_URL);

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            "User-agent: *",
            "Allow: /",
            "Disallow: /api/",
            "Disallow: /app",
            "Disallow: /forgot-password",
            "Disallow: /login",
            "Disallow: /reset-password",
            "Disallow: /signup",
            "Disallow: /verify-email",
            `Sitemap: ${new URL("/sitemap.xml", siteUrl).href}`,
            "",
          ].join("\n"),
          {
            headers: {
              "Cache-Control": "public, max-age=3600",
              "Content-Type": "text/plain; charset=utf-8",
            },
          },
        ),
    },
  },
});
