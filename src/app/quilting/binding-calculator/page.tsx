import type { Metadata } from "next";
import CalculatorPage from "../CalculatorPage";
export const metadata: Metadata = { title: "Quilt Binding Calculator", description: "Calculate quilt binding strips and yardage.", alternates: { canonical: "/quilting/binding-calculator" }, openGraph: { images: ["https://fibertools.app/og-image.png"] } };
export default function Page() { return <CalculatorPage type="binding" />; }
