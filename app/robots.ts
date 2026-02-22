import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/signin", "/api"],
    },
    sitemap: "https://datadiego.com/sitemap.xml",
  };
}
