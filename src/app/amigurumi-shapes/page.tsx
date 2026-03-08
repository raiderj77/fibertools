import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AmigurumiShapesTool from "./AmigurumiShapesTool";

export const metadata: Metadata = {
  title: "Amigurumi Shape Calculator — Crochet Spheres",
  description:
    "Calculate round-by-round increases and decreases for crochet spheres, cones, cylinders, and ovals. Free amigurumi shape patterns — no signup.",
  keywords: [
    "amigurumi shapes",
    "crochet sphere pattern",
    "amigurumi ball pattern",
    "crochet cone shape",
    "crochet cylinder pattern",
    "amigurumi basic shapes",
    "crochet 3d shapes",
    "amigurumi increase pattern",
    "amigurumi decrease pattern",
    "crochet oval pattern",
    "amigurumi body shapes",
    "crochet sphere calculator",
    "amigurumi tutorial shapes",
    "crochet round shapes",
    "amigurumi pattern generator",
  ],
  alternates: { canonical: "/amigurumi-shapes" },
};

export default function AmigurumiShapesPage() {
  return (
    <ToolLayout slug="amigurumi-shapes">
      <AmigurumiShapesTool />
    </ToolLayout>
  );
}
