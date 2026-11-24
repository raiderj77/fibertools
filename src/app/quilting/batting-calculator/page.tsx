import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Batting Calculator", description: "Enter your quilt dimensions and overhang to find the batting size you need and see which common packaged size fits, or check a roll width you enter.", alternates: { canonical: "/quilting/batting-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="batting" />; }
