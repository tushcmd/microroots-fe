// Delivery zones and postcode lookup.
//
// Today this is a static lookup table. When `delivery-and-logistics` ships
// public routes, move the data behind these functions and the checker keeps
// working unchanged.

export interface DeliveryZone {
  /** Neighbourhood / estate name customers search for. */
  area: string
  /** Nairobi postal codes served by this zone. */
  postcodes: string[]
  /** Weekday deliveries run on. */
  day: string
  /** Time window for that day. */
  slot: string
  /** Delivery fee in KES. */
  feeKes: number
  /** Free delivery threshold in KES, if any. */
  freeOverKes?: number
}

export interface PickupSpot {
  name: string
  area: string
  detail: string
}

export const deliveryZones: DeliveryZone[] = [
  {
    area: "Westlands",
    postcodes: ["00100", "00515", "00100"],
    day: "Tuesday & Friday",
    slot: "9:00am–1:00pm",
    feeKes: 200,
    freeOverKes: 2500,
  },
  {
    area: "Parklands & Highridge",
    postcodes: ["00100", "00200"],
    day: "Tuesday & Friday",
    slot: "9:00am–1:00pm",
    feeKes: 200,
    freeOverKes: 2500,
  },
  {
    area: "Karen & Langata",
    postcodes: ["00200", "00100"],
    day: "Wednesday & Saturday",
    slot: "10:00am–2:00pm",
    feeKes: 300,
    freeOverKes: 3000,
  },
  {
    area: "Kilimani & Kileleshwa",
    postcodes: ["00100", "00200"],
    day: "Tuesday & Friday",
    slot: "9:00am–1:00pm",
    feeKes: 200,
    freeOverKes: 2500,
  },
  {
    area: "Lavington & Kileleshwa",
    postcodes: ["00100", "00200"],
    day: "Wednesday & Saturday",
    slot: "10:00am–2:00pm",
    feeKes: 250,
    freeOverKes: 2500,
  },
  {
    area: "Gigiri, Muthaiga & Runda",
    postcodes: ["00100", "00200"],
    day: "Thursday",
    slot: "9:00am–12:00pm",
    feeKes: 350,
    freeOverKes: 3500,
  },
  {
    area: "South B & South C",
    postcodes: ["00100", "00515"],
    day: "Wednesday & Saturday",
    slot: "10:00am–2:00pm",
    feeKes: 250,
    freeOverKes: 2500,
  },
  {
    area: "Embakasi & Donholm",
    postcodes: ["00100", "00515"],
    day: "Saturday",
    slot: "9:00am–1:00pm",
    feeKes: 300,
  },
  {
    area: "CBD & Upper Hill",
    postcodes: ["00100"],
    day: "Tuesday & Friday",
    slot: "9:00am–1:00pm",
    feeKes: 250,
    freeOverKes: 2500,
  },
]

export const pickupSpots: PickupSpot[] = [
  {
    name: "Farm gate pickup",
    area: "Nairobi",
    detail: "Collect your order at the grow rooms. Message us on WhatsApp to arrange a time.",
  },
  {
    name: "Saturday market stand",
    area: "Kilimani",
    detail: "Find us at the neighbourhood farmers market on Saturday mornings, 8:00am–12:00pm.",
  },
]

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * Check whether an area name or Nairobi postal code is served.
 * Returns the matching zone, or null when we don't deliver there yet.
 */
export function checkDeliveryZone(query: string): DeliveryZone | null {
  const q = normalise(query)
  if (!q) return null

  const postcodeMatch = deliveryZones.find((zone) =>
    zone.postcodes.some((code) => code === q),
  )
  if (postcodeMatch) return postcodeMatch

  const areaMatch = deliveryZones.find((zone) => {
    const area = normalise(zone.area)
    if (area === q) return true
    if (area.includes(q) || q.includes(area)) return true
    // Match individual words, e.g. "Kilimani" against "Kilimani & Kileleshwa".
    return area
      .split(/[&,]/)
      .map((part) => normalise(part))
      .some((part) => part === q)
  })
  return areaMatch ?? null
}

export function getDeliveryZones(): DeliveryZone[] {
  return deliveryZones
}

export function getPickupSpots(): PickupSpot[] {
  return pickupSpots
}