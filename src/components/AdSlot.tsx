interface AdSlotProps {
  position: "after-tool" | "mid-content" | "before-footer";
  className?: string;
}

/*
 * Ad Integration Guide:
 * ─────────────────────
 * Replace the placeholder div below with your ad network's code.
 *
 * GOOGLE ADSENSE:
 *   1. Add <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossOrigin="anonymous" />
 *      to layout.tsx <head>.
 *   2. Replace the inner div with:
 *      <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXXX" data-ad-slot="YYYYY" data-ad-format="auto" data-full-width-responsive="true" />
 *   3. Push: (window.adsbygoogle = window.adsbygoogle || []).push({});
 *
 * MEDIAVINE / RAPTIVE:
 *   1. Add their script to layout.tsx.
 *   2. They auto-inject ads into data-ad-position divs.
 *
 * EZOIC:
 *   1. Add their script.
 *   2. Use ezoic-ad tags with the data-ez attributes below.
 */

const SLOT_CONFIG = {
  "after-tool": {
    id: "ad-after-tool",
    minHeight: 250,
    label: "Advertisement",
  },
  "mid-content": {
    id: "ad-mid-content",
    minHeight: 250,
    label: "Advertisement",
  },
  "before-footer": {
    id: "ad-before-footer",
    minHeight: 90,
    label: "Advertisement",
  },
};

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const config = SLOT_CONFIG[position];

  return (
    <div
      className={`my-10 ${className}`}
      id={config.id}
      data-ad-position={position}
      aria-hidden="true"
    >
      {/* Placeholder - visible until ad network fills the slot */}
      <div
        className="mx-auto max-w-[728px] rounded-xl bg-cream-100 dark:bg-bark-800 border border-dashed border-cream-300 dark:border-bark-700 flex items-center justify-center text-xs text-bark-300 dark:text-bark-600"
        style={{ minHeight: config.minHeight }}
      >
        {/* Remove this placeholder text once ads are live */}
      </div>
    </div>
  );
}
