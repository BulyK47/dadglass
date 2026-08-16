/**
 * Convert a due date (ISO yyyy-mm-dd) to the current pregnancy week, clamped
 * to the app's supported range (4–40). Returns null when the input is empty
 * or not a valid date. Shared by onboarding and the profile screen.
 */
export function weekFromDueDate(dueDate: string): number | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return null;
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksRemaining = (due.getTime() - Date.now()) / msPerWeek;
  const week = Math.round(40 - weeksRemaining);
  return Math.max(4, Math.min(40, week));
}
