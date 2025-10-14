export type GeocodeResult = {
    lat: number;
    lng: number;
    raw: any;
  };
  
  /** Geocode an address using OneMap Public Search (no auth) */
  export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const url = `https://developers.onemap.sg/commonapi/search?searchVal=${encodeURIComponent(
      address
    )}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
  
    if (!data?.results?.length) return null;
  
    const first = data.results[0];
    return {
      lat: parseFloat(first.LATITUDE),
      lng: parseFloat(first.LONGITUDE),
      raw: first,
    };
  }