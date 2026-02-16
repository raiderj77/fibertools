"use client";

import { useState, useMemo } from "react";

type Shape = "sphere" | "cone" | "cylinder" | "oval";

interface ShapeDef {
  key: Shape;
  name: string;
  emoji: string;
  desc: string;
}

const SHAPES: ShapeDef[] = [
  { key: "sphere", name: "Sphere / Ball", emoji: "🔵", desc: "Increase to max width, work even, then decrease symmetrically." },
  { key: "cone", name: "Cone", emoji: "🔺", desc: "Gradual increases from tip to base. Great for horns, carrots, noses." },
  { key: "cylinder", name: "Cylinder / Tube", emoji: "🟩", desc: "Flat circle base, then even rounds for height. Arms, legs, bodies." },
  { key: "oval", name: "Oval", emoji: "🥚", desc: "Chain start with increases on both ends. Feet, muzzles, bases." },
];

function generateSphere(rounds: number): string[] {
  const half = Math.ceil(rounds / 2);
  const lines: string[] = [];

  // Increase half
  for (let r = 1; r <= half; r++) {
    const total = 6 * r;
    if (r === 1) {
      lines.push(`Rnd 1: Magic ring, 6 sc. (6)`);
    } else if (r === 2) {
      lines.push(`Rnd 2: 2 sc in each st around. (12)`);
    } else {
      lines.push(`Rnd ${r}: *sc ${r - 2}, 2 sc in next st* x6. (${total})`);
    }
  }

  // Even rounds (1-2 rounds for rounder shape)
  const evenCount = rounds % 2 === 0 ? 2 : 1;
  const maxSt = 6 * half;
  for (let i = 0; i < evenCount; i++) {
    const r = half + 1 + i;
    lines.push(`Rnd ${r}: sc in each st around. (${maxSt})`);
  }

  // Decrease half
  let decStart = half + evenCount + 1;
  for (let r = half; r >= 2; r--) {
    const total = 6 * r;
    if (r === 2) {
      lines.push(`Rnd ${decStart}: *sc2tog* x6. (6)`);
    } else {
      lines.push(`Rnd ${decStart}: *sc ${r - 2}, sc2tog* x6. (${total - 6})`);
    }
    decStart++;
  }

  lines.push(`Stuff firmly before closing. Fasten off, sew hole closed.`);
  return lines;
}

function generateCone(rounds: number): string[] {
  const lines: string[] = [];
  lines.push(`Rnd 1: Magic ring, 6 sc. (6)`);

  let totalSt = 6;
  for (let r = 2; r <= rounds; r++) {
    // Increase every other round for gradual taper
    if (r % 2 === 0) {
      totalSt += 6;
      const normal = Math.floor(totalSt / 6) - 2;
      if (normal <= 0) {
        lines.push(`Rnd ${r}: 2 sc in each st around. (${totalSt})`);
      } else {
        lines.push(`Rnd ${r}: *sc ${normal}, 2 sc in next st* x6. (${totalSt})`);
      }
    } else {
      lines.push(`Rnd ${r}: sc in each st around. (${totalSt})`);
    }
  }

  lines.push(`Stuff as you go for narrow shapes. Fasten off.`);
  return lines;
}

function generateCylinder(rounds: number, baseRounds: number): string[] {
  const lines: string[] = [];

  // Flat circle base
  for (let r = 1; r <= baseRounds; r++) {
    const total = 6 * r;
    if (r === 1) {
      lines.push(`Rnd 1: Magic ring, 6 sc. (6)`);
    } else if (r === 2) {
      lines.push(`Rnd 2: 2 sc in each st around. (12)`);
    } else {
      lines.push(`Rnd ${r}: *sc ${r - 2}, 2 sc in next st* x6. (${total})`);
    }
  }

  // Even rounds for height
  const maxSt = 6 * baseRounds;
  for (let r = baseRounds + 1; r <= rounds; r++) {
    lines.push(`Rnd ${r}: sc in each st around. (${maxSt})`);
  }

  lines.push(`Stuff before closing. Fasten off.`);
  return lines;
}

function generateOval(length: number): string[] {
  const chainCount = length + 1;
  const lines: string[] = [];
  const rnd1Total = (length - 1) * 2 + 6; // sc along both sides + 3 in each end

  lines.push(`Ch ${chainCount}.`);
  lines.push(`Rnd 1: Starting in 2nd ch from hook — sc ${length - 1}, 3 sc in last ch. Working along other side: sc ${length - 1}, 2 sc in last st. (${rnd1Total})`);

  let total = rnd1Total;
  const ovalRounds = Math.min(length, 6);
  for (let r = 2; r <= ovalRounds; r++) {
    total += 6;
    lines.push(`Rnd ${r}: sc to 1 st before end curve, *2 sc in next st, sc 1* x3, sc across, *2 sc in next st, sc 1* x3. (${total})`);
  }

  lines.push(`Continue even rounds for desired height. Fasten off.`);
  return lines;
}

export default function AmigurumiShapesTool() {
  const [shape, setShape] = useState<Shape>("sphere");
  const [rounds, setRounds] = useState(12);
  const [baseRounds, setBaseRounds] = useState(4);
  const [ovalLength, setOvalLength] = useState(6);
  const [copied, setCopied] = useState(false);

  const pattern = useMemo(() => {
    switch (shape) {
      case "sphere": return generateSphere(rounds);
      case "cone": return generateCone(rounds);
      case "cylinder": return generateCylinder(rounds, baseRounds);
      case "oval": return generateOval(ovalLength);
    }
  }, [shape, rounds, baseRounds, ovalLength]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Shape selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SHAPES.map((s) => (
          <button
            key={s.key}
            onClick={() => setShape(s.key)}
            className={`py-3 px-3 rounded-xl text-sm font-medium transition-colors text-center ${
              shape === s.key
                ? "bg-sage-600 text-white"
                : "bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 text-bark-700 dark:text-cream-300 hover:border-sage-400"
            }`}
          >
            <span className="text-lg block mb-0.5">{s.emoji}</span>
            {s.name}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-bark-500 dark:text-bark-400">
        {SHAPES.find((s) => s.key === shape)?.desc}
      </p>

      {/* Controls */}
      {shape === "oval" ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-bark-500 dark:text-bark-400">
              Starting chain length
            </label>
            <span className="text-sm font-bold text-bark-700 dark:text-cream-300">{ovalLength}</span>
          </div>
          <input type="range" min={4} max={20} value={ovalLength} onChange={(e) => setOvalLength(Number(e.target.value))} className="w-full accent-sage-600" />
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-bark-500 dark:text-bark-400">
                Total rounds
              </label>
              <span className="text-sm font-bold text-bark-700 dark:text-cream-300">{rounds}</span>
            </div>
            <input type="range" min={6} max={30} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className="w-full accent-sage-600" />
          </div>
          {shape === "cylinder" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-bark-500 dark:text-bark-400">
                  Base rounds (flat circle)
                </label>
                <span className="text-sm font-bold text-bark-700 dark:text-cream-300">{baseRounds}</span>
              </div>
              <input type="range" min={2} max={10} value={baseRounds} onChange={(e) => setBaseRounds(Number(e.target.value))} className="w-full accent-sage-600" />
            </div>
          )}
        </>
      )}

      {/* Pattern output */}
      <div className="bg-white dark:bg-bark-800 border border-bark-200 dark:border-bark-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-bark-200 dark:border-bark-700 flex items-center justify-between">
          <h2 className="font-bold text-bark-700 dark:text-cream-300">Pattern</h2>
          <button onClick={handleCopy} className="text-xs text-sage-600 dark:text-sage-400 hover:underline">
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <div className="p-5 space-y-1.5">
          {pattern.map((line, i) => (
            <p key={`${shape}-${rounds}-${i}`} className="text-sm text-bark-700 dark:text-cream-300 font-mono leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-cream-100 dark:bg-bark-700 border border-bark-200 dark:border-bark-600 rounded-xl p-4">
        <p className="text-sm font-semibold text-bark-700 dark:text-cream-300 mb-1">Amigurumi tips</p>
        <ul className="text-sm text-bark-500 dark:text-bark-400 space-y-1">
          <li>• Use a hook 1-2 sizes smaller than the yarn label suggests for tighter fabric that holds stuffing.</li>
          <li>• Work in continuous rounds (no joining, no turning chain) unless your pattern says otherwise.</li>
          <li>• Use a stitch marker in the first stitch of each round to keep track.</li>
          <li>• Stuff firmly but not so tight that the stuffing shows between stitches.</li>
          <li>• Safety eyes must be inserted before you close the opening.</li>
        </ul>
      </div>

      {/* SEO Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-bark-700 dark:text-cream-300">Basic Amigurumi Shapes Explained</h2>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          Every amigurumi figure is built from a handful of basic 3D shapes worked in the round with single crochet. A sphere is the foundation for heads and bodies. Cones make noses, horns, and carrots. Cylinders form arms, legs, and torsos. Ovals create feet, muzzles, and bases. Once you can make these four shapes, you can construct virtually any amigurumi character by combining and scaling them.
        </p>
        <p className="text-sm text-bark-500 dark:text-bark-400">
          The key principle is simple: increasing makes fabric spread outward (wider), even rounds maintain the current width, and decreasing pulls fabric inward (narrower). A sphere increases to its widest point, holds for a round or two, then mirrors the increases with decreases. A cone increases gradually with even rounds between increase rounds. A cylinder is a flat circle followed by all even rounds.
        </p>
      </div>
    </div>
  );
}
