import type { Metadata } from "next";
import Link from "next/link";
import QuiltingLayout from "./QuiltingLayout";
import { calculateBacking } from "@/lib/quilting-planning.mjs";

const example = calculateBacking({ width: 84, length: 96, overhang: 4 });
export const metadata: Metadata = { title: "Quilting Calculators", description: "Plan backing, binding, borders, and batting for a quilt.", alternates: { canonical: "/quilting" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function QuiltingPage() {
  const wideback = example.status === "ready" ? example.options.find(option => option.fabricWidth === 108) : null;
  const standard = example.status === "ready" ? example.options.find(option => option.fabricWidth === 44) : null;
  return <QuiltingLayout title="Quilting Calculators" description="Free browser-based planning tools for common quilt material calculations.">
    <section className="mt-8 grid gap-4 sm:grid-cols-2">{[
      ["Backing calculator", "/quilting/backing-calculator", "Compare panels and yardage by backing width."], ["Binding calculator", "/quilting/binding-calculator", "Plan strips, length, and yardage."],
      ["Border calculator", "/quilting/border-calculator", "Compare mitered border cutting methods."], ["Batting calculator", "/quilting/batting-calculator", "Find batting dimensions and size fit."],
    ].map(([name, href, text]) => <Link key={href} href={href} className="tool-card"><h2 className="font-semibold text-bark-700">{name}</h2><p className="mt-1 text-sm text-bark-500">{text}</p></Link>)}</section>
    <section className="mt-10"><h2 className="section-heading">Why compare wideback fabric?</h2><p className="text-bark-600">For the backing calculator example, 108 inch wideback uses {wideback?.yardage} yards and {wideback?.panels} panel, versus {standard?.yardage} yards and {standard?.panels} panels at 44 inches: {standard && wideback ? standard.yardage - wideback.yardage : 0} fewer yards and {standard && wideback ? standard.panels - wideback.panels : 0} fewer seams in this calculation.</p></section>
    <p className="mt-10 text-sm text-bark-500">Amazon links are affiliate links and cost the reader nothing extra. The Fat Quarter Shop link is a regular retailer link, not an affiliate link.</p>
  </QuiltingLayout>;
}
