export type LatLng = { lat: number; lng: number };

export async function routeWalkingOSRM(start: LatLng, end: LatLng): Promise<LatLng[]> {
  // OSRM expects lng,lat order in the URL
  const url = `https://router.project-osrm.org/route/v1/foot/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

  const resp = await fetch(url);
  if (!resp.ok) return [];
  const data = await resp.json();

  const coords = data?.routes?.[0]?.geometry?.coordinates;
  if (!coords) return [];

  // Convert [lng, lat] -> {lat, lng}
  return coords.map(([lng, lat]: [number, number]) => ({ lat, lng }));
}