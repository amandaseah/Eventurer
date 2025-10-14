// src/components/features/map/Map.tsx
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import './map.css';

// ---- Fix default marker icons (Vite can't resolve Leaflet's defaults) ----
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: shadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Optional: a blue “you are here” icon
export const youIcon = L.divIcon({
  className: 'bg-blue-600 rounded-full shadow-lg ring-4 ring-blue-300/40',
  html: `<div style="width:12px;height:12px;border-radius:9999px;background:#2563eb"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function AutoResize() {
  const map = useMap();
  useEffect(() => {
    let raf = 0;
    const invalidate = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => map.invalidateSize());
    };
    const ro = new ResizeObserver(invalidate);
    ro.observe(map.getContainer());
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', invalidate);
    };
  }, [map]);
  return null;
}

export type MarkerPoint = {
  pos: LatLngExpression;
  label?: string;
  icon?: L.Icon | L.DivIcon;
};

/** Auto-fit the map to markers and/or route (if enough points) */
function FitToContent({
  markers,
  route,
}: {
  markers: MarkerPoint[];
  route: LatLngExpression[];
}) {
  const map = useMap();
  useEffect(() => {
    const pts: [number, number][] = [];

    // collect marker points
    markers.forEach((m) => {
      const p = m.pos as [number, number];
      if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') {
        pts.push([p[0], p[1]]);
      }
    });

    // collect route points
    (route as [number, number][]).forEach((p) => {
      if (Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number') {
        pts.push([p[0], p[1]]);
      }
    });

    // Fit if we have 2+ points; otherwise leave default center/zoom
    if (pts.length >= 2) {
      const bounds = L.latLngBounds(pts.map(([lat, lng]) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 });
    }
  }, [markers, route, map]);

  return null;
}

export default function Map({
  center,
  zoom = 12,
  markers = [],
  route = [],
}: {
  center: LatLngExpression;
  zoom?: number;
  markers?: MarkerPoint[];
  route?: LatLngExpression[];
}) {
  return (
    <div className="map-wrapper">
      {/* isolates stacking and clips tiles */}
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-[360px]"
        whenReady={(e) => setTimeout(() => e.target.invalidateSize(), 0)}
        scrollWheelZoom={false}
        tap={false}
      >
        {/* OpenStreetMap tiles (stable + free) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {markers.map((m, i) => (
          <Marker position={m.pos} key={i} icon={m.icon}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}

        {route.length > 1 && (
          <Polyline positions={route} color="#8b5cf6" weight={5} opacity={0.8} />
        )}

        {/* Auto-fit to markers/route once rendered */}
        <FitToContent markers={markers} route={route} />

        <AutoResize />
      </MapContainer>
    </div>
  );
}
