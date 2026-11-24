import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Border Calculator", description: "Enter your quilt dimensions, cut border width, and fabric width to compare yardage for lengthwise and crosswise strips and see the finished quilt size.", alternates: { canonical: "/quilting/border-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="border" />; }
