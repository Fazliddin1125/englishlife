import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://englishlifehr.uz"

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/dashboard", "/login"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

