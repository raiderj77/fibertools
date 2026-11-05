import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Backing Calculator", description: "Compare quilt backing yardage across fabric widths.", alternates: { canonical: "/quilting/backing-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="backing" />; }
