// Live-harvest summary.
//
// Placeholder data for the "Fresh this week" strip. When crop/tray endpoints
// exist, move the data behind getThisWeekHarvest() and pages stay unchanged.

export interface HarvestItem {
  name: string
  growRoom: string
  /** Human label for when it was cut, e.g. "Cut today". */
  timing: string
  /** Approximate quantity ready this week. */
  available: string
}

const thisWeek: HarvestItem[] = [
  { name: "Pea Shoots", growRoom: "Room A", timing: "Cut today", available: "12 trays" },
  { name: "Broccoli Microgreens", growRoom: "Room B", timing: "Cut yesterday", available: "9 trays" },
  { name: "Sunflower Shoots", growRoom: "Room A", timing: "Cut today", available: "7 trays" },
  { name: "Chef's Blend", growRoom: "Room C", timing: "Cut 2 days ago", available: "6 trays" },
]

export function getThisWeekHarvest(): HarvestItem[] {
  return thisWeek
}