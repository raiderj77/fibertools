import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AmigurumiShapesTool from "./AmigurumiShapesTool";

export const metadata: Metadata = {
  title: "Amigurumi Shapes Guide — Sphere, Cone, Cylinder Patterns | FiberTools",
  description:
    "Basic crochet shapes for amigurumi: sphere, cone, cylinder, flat circle, and oval. Get round-by-round increase and decrease instructions for each shape.",
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
};

export default function AmigurumiShapesPage() {
  return (
    <ToolLayout slug="amigurumi-shapes">
      <AmigurumiShapesTool />
    </ToolLayout>
  );
}
