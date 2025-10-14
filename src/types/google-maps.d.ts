declare global {
    interface Window {
      google: typeof google;
    }
  }
  
  declare namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
      }
      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
      }
      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map?: Map, anchor?: Marker): void;
        close(): void;
      }
      class Size {
        constructor(width: number, height: number);
      }
      class Point {
        constructor(x: number, y: number);
      }
      class Geocoder {
        geocode(
          request: GeocoderRequest,
          callback: (results: GeocoderResult[], status: GeocoderStatus) => void
        ): void;
      }
      type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
  
      interface GeocoderRequest {
        address?: string;
        componentRestrictions?: { country?: string };
        location?: LatLng | LatLngLiteral;
      }
      interface GeocoderResult {
        geometry: { location: LatLng };
        formatted_address: string;
      }
  
      class DirectionsService {
        route(
          request: DirectionsRequest,
          callback: (result: DirectionsResult, status: DirectionsStatus) => void
        ): void;
      }
      class DirectionsRenderer {
        constructor(opts?: DirectionsRendererOptions);
        setMap(map: Map | null): void;
        setDirections(result: DirectionsResult): void;
      }
      type DirectionsStatus = 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_WAYPOINTS_EXCEEDED' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';
  
      interface DirectionsRequest {
        origin: LatLng | LatLngLiteral | string;
        destination: LatLng | LatLngLiteral | string;
        travelMode: TravelMode;
        provideRouteAlternatives?: boolean;
      }
      interface DirectionsResult {
        routes: Array<{
          legs: Array<{
            distance?: { text: string; value: number };
            duration?: { text: string; value: number };
          }>;
          overview_path?: LatLng[];
        }>;
      }
      interface DirectionsRendererOptions {
        map?: Map;
        suppressMarkers?: boolean;
        preserveViewport?: boolean;
        polylineOptions?: PolylineOptions;
      }
      interface PolylineOptions {
        strokeColor?: string;
        strokeWeight?: number;
        strokeOpacity?: number;
      }
      type TravelMode = 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING' | 'TWO_WHEELER';
      interface MapOptions {
        zoom?: number;
        center?: LatLng | LatLngLiteral;
        styles?: MapTypeStyle[];
        gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
        disableDefaultUI?: boolean;
        streetViewControl?: boolean;
        fullscreenControl?: boolean;
        mapTypeControl?: boolean;
      }
      interface MarkerOptions {
        position?: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        icon?: string | Icon | Symbol;
      }
      interface InfoWindowOptions {
        content?: string | HTMLElement;
      }
  
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
      interface LatLng {
        lat(): number;
        lng(): number;
      }
      interface Icon {
        url: string;
        scaledSize?: Size;
        anchor?: Point;
      }
      interface Symbol {
        path: string;
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
        scale?: number;
      }
      interface MapTypeStyle {
        elementType?: string;
        featureType?: string;
        stylers?: Array<{ [key: string]: any }>;
      }
  
      namespace places {
        class PlacesService {
          constructor(map: Map | HTMLDivElement);
          nearbySearch(
            request: NearbySearchRequest,
            callback: (results: PlaceResult[], status: PlacesServiceStatus, pagination?: any) => void
          ): void;
          textSearch(
            request: TextSearchRequest,
            callback: (results: PlaceResult[], status: PlacesServiceStatus) => void
          ): void;
        }
        type PlacesServiceStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
  
        interface NearbySearchRequest {
          location: LatLng | LatLngLiteral;
          radius?: number;
          type?: string | string[];
          keyword?: string;
          rankBy?: any;
        }
        interface TextSearchRequest {
          location?: LatLng | LatLngLiteral;
          radius?: number;
          query: string;
        }
        interface PlaceResult {
          name?: string;
          geometry?: { location?: LatLng };
        }
      }
    }
  }
  
  export {};