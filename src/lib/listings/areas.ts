/**
 * Peterborough public-area registry used by the property filters, the static
 * schematic map and the appraisal form. Names are neighbourhood names in
 * common use; coordinates are approximate centres for schematic placement
 * only — never a property location.
 */

export interface Area {
  readonly key: string;
  readonly name: string;
  readonly outwardPostcode: string;
  readonly approximateLatitude: number;
  readonly approximateLongitude: number;
}

export const areas: readonly Area[] = [
  { key: "central", name: "Central Peterborough", outwardPostcode: "PE1", approximateLatitude: 52.573, approximateLongitude: -0.243 },
  { key: "millfield", name: "Millfield", outwardPostcode: "PE1", approximateLatitude: 52.585, approximateLongitude: -0.25 },
  { key: "newengland", name: "New England", outwardPostcode: "PE1", approximateLatitude: 52.593, approximateLongitude: -0.252 },
  { key: "eastfield", name: "Eastfield", outwardPostcode: "PE1", approximateLatitude: 52.582, approximateLongitude: -0.225 },
  { key: "dogsthorpe", name: "Dogsthorpe", outwardPostcode: "PE1", approximateLatitude: 52.59, approximateLongitude: -0.225 },
  { key: "fletton", name: "Fletton", outwardPostcode: "PE2", approximateLatitude: 52.56, approximateLongitude: -0.24 },
  { key: "woodston", name: "Woodston", outwardPostcode: "PE2", approximateLatitude: 52.563, approximateLongitude: -0.262 },
  { key: "stanground", name: "Stanground", outwardPostcode: "PE2", approximateLatitude: 52.56, approximateLongitude: -0.215 },
  { key: "orton", name: "Orton", outwardPostcode: "PE2", approximateLatitude: 52.553, approximateLongitude: -0.3 },
  { key: "bretton", name: "Bretton", outwardPostcode: "PE3", approximateLatitude: 52.59, approximateLongitude: -0.29 },
  { key: "westtown", name: "West Town", outwardPostcode: "PE3", approximateLatitude: 52.575, approximateLongitude: -0.262 },
  { key: "netherton", name: "Netherton", outwardPostcode: "PE3", approximateLatitude: 52.58, approximateLongitude: -0.278 },
  { key: "longthorpe", name: "Longthorpe", outwardPostcode: "PE3", approximateLatitude: 52.575, approximateLongitude: -0.29 },
  { key: "werrington", name: "Werrington", outwardPostcode: "PE4", approximateLatitude: 52.61, approximateLongitude: -0.265 },
  { key: "paston", name: "Paston", outwardPostcode: "PE4", approximateLatitude: 52.605, approximateLongitude: -0.235 },
  { key: "walton", name: "Walton", outwardPostcode: "PE4", approximateLatitude: 52.6, approximateLongitude: -0.255 },
  { key: "hampton", name: "Hampton", outwardPostcode: "PE7", approximateLatitude: 52.535, approximateLongitude: -0.25 },
] as const;

export type AreaKey = (typeof areas)[number]["key"];

export const areaKeys: readonly string[] = areas.map((a) => a.key);

export function getArea(key: string): Area | undefined {
  return areas.find((a) => a.key === key);
}

export function isAreaKey(value: string): value is AreaKey {
  return areaKeys.includes(value);
}

/** "Fletton, Peterborough (PE2)" */
export function areaDisplayName(key: string): string {
  const area = getArea(key);
  return area ? `${area.name}, Peterborough` : "Peterborough";
}
