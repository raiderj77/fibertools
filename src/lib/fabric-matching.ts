import type { FabricMatch, FabricRecord, MatchLabel, ProjectSuggestion } from "@/lib/fabric-types";
import {
  labelForScore as labelForScoreEngine,
  projectSuggestionsFor as projectSuggestionsForEngine,
  rankFabricSubstitutes as rankFabricSubstitutesEngine,
  scoreFabricPair as scoreFabricPairEngine,
  searchFabrics as searchFabricsEngine,
} from "./fabric-matching-engine.mjs";

export const labelForScore = (score: number): MatchLabel => labelForScoreEngine(score) as MatchLabel;

export const scoreFabricPair = (source: FabricRecord, candidate: FabricRecord): FabricMatch =>
  scoreFabricPairEngine(source, candidate) as unknown as FabricMatch;

export const rankFabricSubstitutes = (source: FabricRecord, allFabrics: FabricRecord[]): FabricMatch[] =>
  rankFabricSubstitutesEngine(source, allFabrics) as unknown as FabricMatch[];

export const searchFabrics = (query: string, allFabrics: FabricRecord[]): FabricRecord[] =>
  searchFabricsEngine(query, allFabrics) as FabricRecord[];

export const projectSuggestionsFor = (fabric: FabricRecord): ProjectSuggestion[] =>
  projectSuggestionsForEngine(fabric) as ProjectSuggestion[];
