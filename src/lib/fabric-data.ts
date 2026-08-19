import rawFabrics from "@/data/fabrics.json";
import type { FabricRecord } from "@/lib/fabric-types";

export const fabrics = rawFabrics as FabricRecord[];

export const fabricById = new Map(fabrics.map((fabric) => [fabric.id, fabric]));

export function getFabricById(id: string): FabricRecord | undefined {
  return fabricById.get(id);
}
