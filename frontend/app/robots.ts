import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/orders", "/login", "/register", "/forgot-password"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
