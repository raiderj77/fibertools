import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

const BASE_URL = "https://fibertools.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools
    .filter((t) => t.ready)
    .map((t) => ({
      url: `${BASE_URL}/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: t.tier === 1 ? 0.9 : t.tier === 2 ? 0.8 : 0.7,
    }));

  const blogPages = tools
    .filter((t) => t.ready)
    .map((t) => ({
      url: `${BASE_URL}/blog/${t.slug}-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...toolPages,
    ...blogPages,
  ];
}
