export interface WeekData {
  week: number;
  trimester: string;
  glassType: string;
  fillDescription: string;
  fillPercent: number;
  babyWeight?: string;
  babyLength?: string;
  toast?: string;
  babyThisWeek: {
    summary: string;
    milestones: string[];
  };
  momThisWeek: {
    physical: string[];
    emotional: string[];
  };
  dadActions: string[];
  headsUp: string;
  dadTip: string;
  sayThis?: string;
  notThat?: string;
  emergencyContact?: {
    urgentSymptoms: string[];
    advice: string;
  };
}

import { weeks } from "@content/weeks";

/** The week data itself lives in the swappable content layer (see @content). */
export const pregnancyWeeks: WeekData[] = weeks;


export function getWeekData(week: number): WeekData | undefined {
  return pregnancyWeeks.find(w => w.week === week);
}
