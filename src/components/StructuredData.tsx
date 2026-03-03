/**
 * JSON-LD structured data components for FiberTools.
 * Server components — output <script type="application/ld+json"> tags.
 * Required for SEO and rich snippets.
 */

import { Tool } from "@/lib/tools";

type JsonLdProps = {
  data: Record<string, unknown>;
};

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * WebApplication schema — for tool pages.
 * Tells Google this page is a web app, not just a blog post.
 */
export function WebAppSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        browserRequirements: "Requires JavaScript",
        softwareHelp: {
          "@type": "CreativeWork",
          url: "https://fibertools.app/blog",
        },
      }}
    />
  );
}

/**
 * FAQ schema — for pages with Q&A sections.
 * Enables FAQ rich snippets in search results.
 */
export function FaqSchema({
  items,
  toolName,
}: {
  items: Array<{ q: string; a: string }>;
  toolName: string;
}) {
  if (!items.length) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: toolName,
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }}
    />
  );
}

/**
 * Breadcrumb schema — for navigation context in search results.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; href: string }>;
}) {
  const SITE_URL = "https://fibertools.app";
  
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => {
          const entry: Record<string, unknown> = {
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
          };
          if (i < items.length - 1) {
            entry.item = `${SITE_URL}${item.href}`;
          }
          return entry;
        }),
      }}
    />
  );
}

/**
 * Tool-specific schema combining WebApplication and relevant schemas
 */
export function ToolSchema({ tool, faqs }: { tool: Tool; faqs: Array<{ q: string; a: string }> }) {
  const SITE_URL = "https://fibertools.app";
  
  return (
    <>
      <WebAppSchema
        name={tool.name}
        description={tool.description}
        url={`${SITE_URL}/${tool.slug}`}
      />
      {faqs.length > 0 && <FaqSchema items={faqs} toolName={tool.name} />}
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: tool.name, href: `/${tool.slug}` },
        ]}
      />
    </>
  );
}

/**
 * Organization schema — for the site-wide identity.
 */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FiberTools",
        url: "https://fibertools.app",
        description: "Free online tools for knitters, crocheters, weavers, and fiber artists.",
        logo: "https://fibertools.app/icon-192.png",
        sameAs: [
          "https://github.com/yourusername/fibertools",
        ],
      }}
    />
  );
}