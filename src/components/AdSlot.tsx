/*
 * AdSlot — Manual ad placement component
 * ═══════════════════════════════════════
 *
 * CURRENT STRATEGY: Auto ads only (no manual slots)
 * ─────────────────────────────────────────────────
 * The AdSense auto-ads script in layout.tsx handles all ad placement.
 * Google's ML picks optimal positions, formats, and frequency per user.
 * This gives the best revenue without cluttering pages with empty slots.
 *
 * Auto ads covers: display, in-article, in-feed, multiplex, anchor (sticky
 * bottom), and side rail ads. Configure in AdSense dashboard under
 * "Auto ads" settings.
 *
 * WHEN TO ADD MANUAL SLOTS:
 * ─────────────────────────
 * If you want guaranteed ad placement in a specific spot (e.g. always
 * show an ad after the tool results), create a Display or In-article
 * ad unit in AdSense, copy the slot ID, and uncomment the component
 * below. Then use <AdSlot slotId="1234567890" /> in your layout.
 *
 * Manual + auto ads work together — Google deduplicates automatically.
 */

// Uncomment when you have ad unit slot IDs from AdSense:
//
// "use client";
//
// import { useEffect, useRef } from "react";
//
// declare global {
//   interface Window {
//     adsbygoogle: Array<Record<string, unknown>>;
//   }
// }
//
// interface AdSlotProps {
//   slotId: string;
//   format?: "auto" | "horizontal" | "vertical" | "rectangle";
//   className?: string;
// }
//
// export default function AdSlot({ slotId, format = "auto", className = "" }: AdSlotProps) {
//   const pushed = useRef(false);
//
//   useEffect(() => {
//     if (pushed.current) return;
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//       pushed.current = true;
//     } catch {
//       // AdSense not loaded or ad blocker active
//     }
//   }, []);
//
//   return (
//     <div className={`my-10 ${className}`} aria-hidden="true">
//       <ins
//         className="adsbygoogle"
//         style={{ display: "block", minHeight: 100 }}
//         data-ad-client="ca-pub-7171402107622932"
//         data-ad-slot={slotId}
//         data-ad-format={format}
//         data-full-width-responsive="true"
//       />
//     </div>
//   );
// }

// Placeholder export — auto ads handles everything
export default function AdSlot() {
  return null;
}
