import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AnswerBlock from "@/components/AnswerBlock";
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
  openGraph: {
    title: "Amigurumi Shape Calculator — Crochet Spheres",
    description:
      "Calculate round-by-round increases and decreases for crochet spheres, cones, cylinders, and ovals. Free amigurumi shape patterns — no signup.",
    url: "https://fibertools.app/amigurumi-shapes",
    images: [{ url: "https://fibertools.app/og-image.png", width: 1200, height: 630, alt: "Amigurumi Shape Calculator — Crochet Spheres" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amigurumi Shape Calculator — Crochet Spheres",
    description:
      "Calculate round-by-round increases and decreases for crochet spheres, cones, cylinders, and ovals. Free amigurumi shape patterns — no signup.",
    images: ["https://fibertools.app/og-image.png"],
  },
  alternates: { canonical: "/amigurumi-shapes" },
};

export default function AmigurumiShapesPage() {
  return (
    <ToolLayout slug="amigurumi-shapes" widgetFirst>
      <AnswerBlock
        what="A calculator that generates round-by-round increase and decrease instructions for crochet spheres, cones, cylinders, and ovals."
        who="Amigurumi makers who need custom shape patterns without guessing at stitch counts for each round."
        bottomLine="Select your shape, enter your starting stitch count, and get a complete round-by-round pattern instantly."
        lastUpdated="2026-03-16"
      />
      <div className="sr-only">
        <h2>Amigurumi Shapes Guide Tool</h2>
        <h2>How to Crochet Basic Amigurumi Shapes</h2>
        <h2>Shape Patterns and Round-by-Round Instructions</h2>
      </div>
      <AmigurumiShapesTool />
    </ToolLayout>
  );
}
