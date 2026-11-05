import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Border Calculator", description: "Compare mitered quilt border fabric plans.", alternates: { canonical: "/quilting/border-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="border" />; }
