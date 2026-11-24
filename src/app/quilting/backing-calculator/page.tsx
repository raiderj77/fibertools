import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Backing Calculator", description: "Enter your quilt dimensions and overhang to compare backing yardage, panel counts, and seams for standard and wideback fabric before you shop.", alternates: { canonical: "/quilting/backing-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="backing" />; }
