import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { getAllGuides } from "@/lib/guides";
import { REVIEW_DATES } from "@/lib/review-dates.mjs";

const BASE_URL = "https://fibertools.app";

const STANDALONE_TOOL_SLUGS = ["yarn-weight-calculator"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools
    .filter((t) => t.ready)
    .map((t) => ({
      url: `${BASE_URL}/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: t.tier === 1 ? 0.9 : t.tier === 2 ? 0.8 : 0.7,
    }));

  const guidePages = getAllGuides().map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const standaloneToolPages = STANDALONE_TOOL_SLUGS.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const staticPageConfig: Array<{
    path: string;
    priority: number;
    freq: "weekly" | "monthly" | "yearly";
    lastModified?: string;
  }> = [
    { path: "", priority: 1.0, freq: "weekly", lastModified: REVIEW_DATES.homepage.iso },
    { path: "/guides", priority: 0.7, freq: "weekly" as const },
    { path: "/formula-library", priority: 0.75, freq: "monthly" as const },
    { path: "/newsletter", priority: 0.65, freq: "weekly" as const },
    { path: "/embeds", priority: 0.65, freq: "monthly" as const },
    { path: "/fiber-project-planning-pack", priority: 0.75, freq: "monthly" as const },
    { path: "/about", priority: 0.5, freq: "monthly" as const },
    { path: "/privacy", priority: 0.3, freq: "yearly" as const },
    { path: "/terms", priority: 0.3, freq: "yearly" as const },
    { path: "/cookies", priority: 0.3, freq: "yearly" as const },
    { path: "/accessibility", priority: 0.3, freq: "yearly" as const },
    { path: "/affiliate-disclosure", priority: 0.3, freq: "yearly" as const },
    { path: "/do-not-sell", priority: 0.3, freq: "yearly" as const },
    { path: "/contact", priority: 0.4, freq: "yearly" as const },
    { path: "/crochet-tools", priority: 0.85, freq: "monthly" as const },
    { path: "/designer-pattern-preflight", priority: 0.8, freq: "monthly" as const },
    { path: "/knitting-tools", priority: 0.85, freq: "monthly" as const },
    { path: "/weaving-tools", priority: 0.85, freq: "monthly" as const },
    { path: "/best-yarn-for-beginners", priority: 0.85, freq: "monthly" as const },
    { path: "/best-knitting-needles", priority: 0.85, freq: "monthly" as const },
    { path: "/best-crochet-hooks", priority: 0.85, freq: "monthly" as const },
    { path: "/best-yarn-for-blankets", priority: 0.85, freq: "monthly" as const },
    { path: "/best-yarn-for-amigurumi", priority: 0.85, freq: "monthly" as const },
  ];

  const staticPages = staticPageConfig.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    changeFrequency: p.freq,
    priority: p.priority,
    ...(p.lastModified ? { lastModified: p.lastModified } : {}),
  }));

  return [
    ...staticPages,
    ...toolPages,
    ...standaloneToolPages,
    ...guidePages,
  ];
}
