export type BabyLookLanguage = "en" | "ro";

export interface BabyLook {
  week: number;
  imagePath: string;
  concept: Record<BabyLookLanguage, string>;
  visualFocus: Record<BabyLookLanguage, string>;
}

import { babyLooks } from "@content/babyLooks";

export const babyLooksByWeek: Record<number, BabyLook> = babyLooks;


export function getBabyLookForWeek(week: number): BabyLook {
  const safeWeek = Math.min(40, Math.max(4, Math.round(week)));
  return babyLooksByWeek[safeWeek] ?? babyLooksByWeek[4];
}
