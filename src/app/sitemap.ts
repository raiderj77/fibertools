import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { blogPosts } from "@/lib/blog";
import { getAllGuides } from "@/lib/guides";

const BASE_URL = "https://fibertools.app";
const TODAY = new Date().toISOString().split("T")[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools
    .filter((t) => t.ready)
    .map((t) => ({
      url: `${BASE_URL}/${t.slug}`,
      lastModified: new Date(TODAY),
      changeFrequency: "monthly" as const,
      priority: t.tier === 1 ? 0.9 : t.tier === 2 ? 0.8 : 0.7,
    }));

  const blogPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guidePages = getAllGuides().map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const staticPages = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/blog", priority: 0.7, freq: "weekly" as const },
    { path: "/guides", priority: 0.7, freq: "weekly" as const },
    { path: "/about", priority: 0.5, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
    { path: "/cookies", priority: 0.3, freq: "yearly" as const },
    { path: "/accessibility", priority: 0.3, freq: "yearly" as const },
    { path: "/contact", priority: 0.4, freq: "yearly" as const },
    { path: "/crochet-tools", priority: 0.85, freq: "monthly" as const },
    { path: "/knitting-tools", priority: 0.85, freq: "monthly" as const },
    { path: "/weaving-tools", priority: 0.85, freq: "monthly" as const },
  ].map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: new Date(TODAY),
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...blogPages,
    ...guidePages,
  ];
}
