import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Binding Calculator", description: "Enter your quilt dimensions, strip width, and fabric width to estimate the binding length, number of strips, and fabric yardage for continuous binding.", alternates: { canonical: "/quilting/binding-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="binding" />; }
