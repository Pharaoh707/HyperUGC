// SINGLE SOURCE OF TRUTH FOR SPOTS COUNT
// ALL displays on the page read from this central object

export const SPOTS_TOTAL = 20;
export const SPOTS_SOLD = 7;
export const SPOTS_REMAINING = SPOTS_TOTAL - SPOTS_SOLD; // = 13

// Calculated end date for the countdown (e.g. 24 hours from visit, persisted in localStorage so it persists per user)
export function getCountdownTarget(): Date {
  const key = "mandjack_countdown_target";
  const existing = localStorage.getItem(key);
  if (existing) {
    const parsed = new Date(existing);
    if (parsed.getTime() > Date.now()) {
      return parsed;
    }
  }
  // Default: set countdown to end at midnight of current local day or +14 hours
  const target = new Date();
  target.setHours(target.getHours() + 14);
  target.setMinutes(target.getMinutes() + 25);
  localStorage.setItem(key, target.toISOString());
  return target;
}
