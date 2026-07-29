import { createFileRoute } from "@tanstack/react-router";

const homeUrl = new URL("/", import.meta.env.VITE_BASE_URL).href;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeXml(homeUrl)}</loc>
  </url>
</urlset>
`,
          {
            headers: {
              "Cache-Control": "public, max-age=3600",
              "Content-Type": "application/xml; charset=utf-8",
            },
          },
        ),
    },
  },
});

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
