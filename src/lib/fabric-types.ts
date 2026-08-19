export type FabricConstruction = "woven" | "knit";
export type FabricWeightLabel = "very light" | "light" | "medium" | "heavy" | "very heavy";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface FabricSourceReference {
  id: string;
  note: string;
}

export interface FabricRecord {
  id: string;
  slug: string;
  displayName: string;
  aliases: string[];
  description: string;
  construction: FabricConstruction;
  constructionSubtype: string;
  commonFibers: string[];
  weightGsmMin: number;
  weightGsmMax: number;
  weightLabel: FabricWeightLabel;
  drapeRating: Rating;
  structureRating: Rating;
  opacityRating: Rating;
  recoveryRating: Rating;
  sewingDifficultyRating: Rating;
  horizontalStretchMin: number;
  horizontalStretchMax: number;
  verticalStretchMin: number;
  verticalStretchMax: number;
  commonUses: string[];
  poorUses: string[];
  recommendedSubstitutes: string[];
  poorSubstitutes: string[];
  beginnerNotes: string;
  handlingNotes: string;
  sourceReferences: FabricSourceReference[];
  lastReviewedDate: string;
}

export interface ScoreBreakdown {
  construction: number;
  stretch: number;
  weight: number;
  drape: number;
  structure: number;
  opacity: number;
  recovery: number;
}

export type MatchLabel = "Strong substitute" | "Reasonable substitute" | "Possible substitute with adjustments" | "Poor substitute";

export interface FabricMatch {
  fabric: FabricRecord;
  score: number;
  label: MatchLabel;
  breakdown: ScoreBreakdown;
  reasons: string[];
  cautions: string[];
}

export interface ProjectSuggestion {
  name: string;
  suitability: "Strong" | "Reasonable" | "Possible with adjustments";
  why: string;
  limitations: string;
  beginnerDifficulty: "Beginner-friendly" | "Manageable" | "Advanced handling";
  liningUseful: boolean;
  stretchImportant: boolean;
  behavior: string;
}

export interface FabricRetailerLink {
  fabricId: string;
  retailerId: string;
  label: string;
  url: string;
  affiliate: boolean;
  approved: boolean;
  disclosure: string;
}
