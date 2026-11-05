import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Batting Calculator", description: "Calculate quilt batting dimensions and packaged-size fit.", alternates: { canonical: "/quilting/batting-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="batting" />; }
