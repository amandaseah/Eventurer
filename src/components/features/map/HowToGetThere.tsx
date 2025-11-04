// src/components/features/map/HowToGetThere.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Crosshair, Loader2, MapPin, Navigation } from 'lucide-react';
import { loadGoogleMapsScript } from '../../../lib/loadGoogleMaps';
import { geocodeAddress as geocodeOneMap } from '../../../lib/onemapPublic';

type LatLng = { lat: number; lng: number };
type TransitOption = {
  name: string;
  dist?: number;
  address?: string;
  position?: LatLng;
};

type TransitLegMeta = {
  durationText?: string;
  distanceText?: string;
  modeLabel?: string;
  durationSeconds?: number;
  distanceMeters?: number;
};

type TransitSummary = {
  path: LatLng[];
  walkingPath?: LatLng[];
  hoverHtml: string;
  lines?: string[];
  walkToEvent?: TransitLegMeta;
  transitToEvent?: TransitLegMeta;
  fromYou?: TransitLegMeta;
  travelMode: 'TRANSIT' | 'WALKING';
  googleMapsUrls?: {
    walk?: string;
    transit?: string;
    fullTransit?: string;
  };
};

const MAP_READY_TIMEOUT_MS = 1500;

// ---------- helpers ----------
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const normalizeLatLng = (value: any): LatLng | null => {
  if (!value) return null;
  const latCandidate = isFiniteNumber(value.lat)
    ? value.lat
    : isFiniteNumber(value.latitude)
    ? value.latitude
    : null;
  const lngCandidate = isFiniteNumber(value.lng)
    ? value.lng
    : isFiniteNumber(value.longitude)
    ? value.longitude
    : null;
  if (latCandidate === null || lngCandidate === null) return null;
  return { lat: latCandidate, lng: lngCandidate };
};

const makeGoogleMapsUrl = (
  origin: LatLng | null | undefined,
  destination: LatLng | null | undefined,
  mode: 'walking' | 'transit'
) => {
  if (!origin || !destination) return undefined;
  const params = new URLSearchParams({
    api: '1',
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    travelmode: mode,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

const formatDurationMinutes = (seconds?: number) => {
  if (!Number.isFinite(seconds) || seconds === undefined) return undefined;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
};

const ensureSingaporeSuffix = (query?: string) => {
  if (typeof query !== 'string') return '';
  const trimmed = query.trim();
  if (!trimmed) return '';
  return /singapore/i.test(trimmed) ? trimmed : `${trimmed}, Singapore`;
};

const buildSearchQueries = (event: any): string[] => {
  if (!event) return [];
  const raw = [
    event?.mapLocation?.address,
    event?.mapLocation?.query,
    event?.location,
    event?.title,
  ];
  const cleaned = raw
    .map((item) => ensureSingaporeSuffix(typeof item === 'string' ? item : undefined))
    .filter((item): item is string => Boolean(item));
  return Array.from(new Set(cleaned));
};

const haversine = (a: LatLng, b: LatLng) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
};

const km = (m: number) => (m / 1000).toFixed(2);

function fmtDuration(distanceM: number, secFromAPI?: number) {
  const realistic = distanceM / 1.25; // ~4.5 km/h
  let s = secFromAPI ?? realistic;
  if (secFromAPI && (secFromAPI < realistic * 0.5 || secFromAPI > realistic * 3)) {
    s = realistic;
  }

  const mins = Math.round(s / 60);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

async function geocode(address: string, country = 'SG'): Promise<LatLng | null> {
  return new Promise((resolve) => {
    if (!window.google?.maps?.Geocoder) return resolve(null);
    const gc = new window.google.maps.Geocoder();
    gc.geocode(
      { address, componentRestrictions: { country } },
      (results: any[], status: string) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          resolve(null);
        }
      }
    );
  });
}

function nearbySearchPromise(svc: any, req: any): Promise<any[]> {
  return new Promise((resolve) => {
    if (!svc?.nearbySearch) return resolve([]);
    svc.nearbySearch(req, (results: any[], status: string) => {
      if (status === 'OK' && results?.length) resolve(results);
      else resolve([]);
    });
  });
}

function textSearchPromise(svc: any, req: any): Promise<any[]> {
  return new Promise((resolve) => {
    if (!svc?.textSearch) return resolve([]);
    svc.textSearch(req, (results: any[], status: string) => {
      if (status === 'OK' && results?.length) resolve(results);
      else resolve([]);
    });
  });
}

// ---------- main ----------
export default function HowToGetThere({ event }: { event: any }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<google.maps.Map | null>(null);
  const dirRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const youMarkerRef = useRef<google.maps.Marker | null>(null);
  const eventMarkerRef = useRef<google.maps.Marker | null>(null);
  const highlightMarkerRef = useRef<google.maps.Marker | null>(null);
  const stationRoutePolylineRef = useRef<google.maps.Polyline | null>(null);
  const stationRouteInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const stationRouteListenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const [eventPos, setEventPos] = useState<LatLng | null>(null);
  const [youPos, setYouPos] = useState<LatLng | null>(null);
  const [distanceM, setDistanceM] = useState<number | null>(null);
  const [durationS, setDurationS] = useState<number | null>(null);

  const [mrtStations, setMrtStations] = useState<TransitOption[] | null>(null);
  const [busStops, setBusStops] = useState<TransitOption[] | null>(null);
  const [transitNotes, setTransitNotes] = useState<{ mrt?: string; bus?: string }>({});
  const [transitLoading, setTransitLoading] = useState(false);
  const [selectedTransit, setSelectedTransit] = useState<{ type: 'mrt' | 'bus'; index: number } | null>(null);
  const [transitSummaries, setTransitSummaries] = useState<Record<string, TransitSummary>>({});
  const [transitRouteLoadingKey, setTransitRouteLoadingKey] = useState<string | null>(null);
  // === Local card selection key (for active border highlight) ===
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);

  const getCardKey = (opt: TransitOption, type: 'mrt' | 'bus', idx: number) =>
  `${type}:${opt.placeId ?? `${opt.name}:${idx}`}`;

  const [geoPending, setGeoPending] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const transitRouteRequestRef = useRef<{ key: string } | null>(null);

  const fallbackCenter = useMemo(() => ({ lat: 1.3521, lng: 103.8198 }), []);
  const manualCoords = useMemo<LatLng | null>(() => {
    if (!event) return null;
    return (
      normalizeLatLng(event.mapLocation) ??
      normalizeLatLng(event.coordinates) ??
      normalizeLatLng({ lat: event.lat, lng: event.lng }) ??
      normalizeLatLng({ lat: event.latitude, lng: event.longitude }) ??
      null
    );
  }, [event]);
  const searchQueries = useMemo(() => buildSearchQueries(event), [event]);

  const updateTransitNote = (type: 'mrt' | 'bus', message?: string) => {
    setTransitNotes((prev) => {
      const next = { ...prev };
      if (!message) delete next[type];
      else next[type] = message;
      return next;
    });
  };

  const clearHighlightMarker = () => {
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.setMap(null);
      highlightMarkerRef.current = null;
    }
  };

  const clearTransitRoute = () => {
    stationRouteListenersRef.current.forEach((listener) => listener.remove());
    stationRouteListenersRef.current = [];
    if (stationRoutePolylineRef.current) {
      stationRoutePolylineRef.current.setMap(null);
      stationRoutePolylineRef.current = null;
    }
    if (stationRouteInfoWindowRef.current) {
      stationRouteInfoWindowRef.current.close();
      stationRouteInfoWindowRef.current = null;
    }
  };

  const createPinIcon = (color: string) => {
    if (!window.google?.maps) return undefined;
    const svg = `
      <svg width="38" height="52" viewBox="0 0 38 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0C8.507 0 0 8.438 0 18.85C0 33.67 19 52 19 52C19 52 38 33.67 38 18.85C38 8.438 29.493 0 19 0Z" fill="${color}" />
        <circle cx="19" cy="19" r="8.5" fill="white" fill-opacity="0.9"/>
      </svg>
    `;
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(38, 52),
      anchor: new window.google.maps.Point(19, 52),
    } as google.maps.Icon;
  };

  const highlightTransitMarker = (option: TransitOption, type: 'mrt' | 'bus') => {
    if (!option.position || !mapObj.current) return;

    if (!highlightMarkerRef.current) {
      highlightMarkerRef.current = new window.google.maps.Marker({
        map: mapObj.current,
        zIndex: 1200,
      });
    }

    const icon = createPinIcon(type === 'mrt' ? '#7C3AED' : '#059669');
    if (icon) {
      highlightMarkerRef.current.setIcon(icon);
    }
    highlightMarkerRef.current.setTitle(`${option.name} (${type.toUpperCase()})`);
    const target = option.position as google.maps.LatLngLiteral;
    highlightMarkerRef.current.setPosition(target);
    highlightMarkerRef.current.setMap(mapObj.current);

    const animation = window.google?.maps?.Animation;
    if (animation) {
      highlightMarkerRef.current.setAnimation(animation.DROP);
      setTimeout(() => highlightMarkerRef.current?.setAnimation(null), 1400);
    }

    const currentZoom = typeof mapObj.current.getZoom === 'function' ? mapObj.current.getZoom() ?? 0 : 0;
    if (currentZoom < 16) {
      mapObj.current.setZoom(16);
    }
    mapObj.current.panTo(target);
  };

  const renderTransitRoute = (summary: TransitSummary, option: TransitOption, type: 'mrt' | 'bus') => {
    if (!mapObj.current || !window.google?.maps) return;

    clearTransitRoute();

    const pathToRender = summary.walkingPath?.length ? summary.walkingPath : summary.path;

    const polyline = new window.google.maps.Polyline({
      path: pathToRender,
      geodesic: true,
      strokeColor: '#ec4899',
      strokeOpacity: 0.9,
      strokeWeight: 5,
      icons: [
        {
          icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4,
            strokeColor: '#f472b6',
          },
          offset: '0',
          repeat: '24px',
        },
      ],
    });
    polyline.setMap(mapObj.current);
    stationRoutePolylineRef.current = polyline;

    const infoWindow = new window.google.maps.InfoWindow({
      content: summary.hoverHtml,
      maxWidth: 280,
    });
    stationRouteInfoWindowRef.current = infoWindow;

    const openAt = (position: google.maps.LatLng | google.maps.LatLngLiteral | null) => {
      if (!position) return;
      infoWindow.setPosition(position as any);
      infoWindow.open({
        map: mapObj.current!,
        anchor: undefined,
        shouldFocus: false,
      });
    };

    const midpointLiteral =
      pathToRender[Math.floor(pathToRender.length / 2)] ??
      option.position ??
      (eventPos ?? null);
    if (midpointLiteral) {
      openAt(midpointLiteral as any);
      setTimeout(() => infoWindow.close(), 3500);
    }

    const listeners = [
      polyline.addListener('mouseover', (evt: google.maps.MapMouseEvent) => {
        if (!evt.latLng) return;
        openAt(evt.latLng);
      }),
      polyline.addListener('mousemove', (evt: google.maps.MapMouseEvent) => {
        if (!evt.latLng) return;
        infoWindow.setPosition(evt.latLng);
      }),
      polyline.addListener('mouseout', () => {
        infoWindow.close();
      }),
      polyline.addListener('click', (evt: google.maps.MapMouseEvent) => {
        if (!evt.latLng) return;
        openAt(evt.latLng);
      }),
    ];
    stationRouteListenersRef.current = listeners;
  };

  const buildTransitSummary = async (
    option: TransitOption,
    type: 'mrt' | 'bus'
  ): Promise<TransitSummary | null> => {
    if (!option.position || !eventPos || !window.google?.maps) return null;

    const gm = window.google.maps;

    const getRoute = (request: google.maps.DirectionsRequest) =>
      new Promise<google.maps.DirectionsResult | null>((resolve) => {
        const svc = new gm.DirectionsService();
        svc.route(request, (result, status) => {
          if (status === 'OK' && result?.routes?.[0]) resolve(result);
          else resolve(null);
        });
      });

    const transitModes =
      type === 'mrt'
        ? [gm.TransitMode.SUBWAY]
        : [gm.TransitMode.BUS];

    const walkingResult = await getRoute({
      origin: option.position,
      destination: eventPos,
      travelMode: gm.TravelMode.WALKING,
    });
    const walkingLeg = walkingResult?.routes?.[0]?.legs?.[0];
    const walkingPath = walkingResult?.routes?.[0]?.overview_path?.map((p) => ({
      lat: p.lat(),
      lng: p.lng(),
    }));

    const walkingMeta: TransitLegMeta | undefined = walkingLeg
      ? {
          durationText: walkingLeg.duration?.text,
          distanceText: walkingLeg.distance?.text,
          modeLabel: 'Walk',
          durationSeconds: walkingLeg.duration?.value,
          distanceMeters: walkingLeg.distance?.value,
        }
      : undefined;

    const transitRequest: google.maps.DirectionsRequest = {
      origin: option.position,
      destination: eventPos,
      travelMode: gm.TravelMode.TRANSIT,
      provideRouteAlternatives: false,
      transitOptions: {
        modes: transitModes,
        routingPreference: gm.TransitRoutePreference.FEWER_TRANSFERS,
      },
    };

    const transitResult = await getRoute(transitRequest);
    let travelMode: 'TRANSIT' | 'WALKING' = transitResult ? 'TRANSIT' : 'WALKING';

    let transitMeta: TransitLegMeta | undefined;
    let lines: string[] = [];
    if (transitResult?.routes?.[0]) {
      const leg = transitResult.routes[0].legs?.[0];
      if (leg) {
        transitMeta = {
          durationText: leg.duration?.text,
          distanceText: leg.distance?.text,
          durationSeconds: leg.duration?.value,
          distanceMeters: leg.distance?.value,
        };
      }
      if (leg?.steps?.length) {
        lines = leg.steps
          .filter((step: any) => step.travel_mode === 'TRANSIT' && step.transit)
          .map((step: any) => {
            const line = step.transit.line;
            const vehicleName =
              line?.short_name ||
              line?.name ||
              line?.vehicle?.short_name ||
              line?.vehicle?.name ||
              (type === 'mrt' ? 'MRT' : 'Bus');
            const headsign = step.transit.headsign ? ` → ${step.transit.headsign}` : '';
            return `${vehicleName}${headsign}`;
          });
        if (transitMeta) {
          transitMeta.modeLabel =
            lines.length > 0
              ? lines.join(' • ')
              : type === 'mrt'
              ? 'MRT'
              : 'Bus';
        }
      } else if (transitMeta) {
        transitMeta.modeLabel = type === 'mrt' ? 'MRT' : 'Bus';
      }
    }

    const path = walkingPath?.length
      ? walkingPath
      : transitResult?.routes?.[0]?.overview_path?.map((p) => ({ lat: p.lat(), lng: p.lng() })) ?? [
          option.position,
          eventPos,
        ];

    let fromYou: TransitLegMeta | undefined;
    if (youPos && eventPos) {
      const fromYouResult = await getRoute({
        origin: youPos,
        destination: eventPos,
        travelMode: gm.TravelMode.WALKING,
      });
      const fromLeg = fromYouResult?.routes?.[0]?.legs?.[0];
      if (fromLeg) {
        fromYou = {
          durationText: fromLeg.duration?.text,
          distanceText: fromLeg.distance?.text,
          modeLabel: 'Walk',
          durationSeconds: fromLeg.duration?.value,
          distanceMeters: fromLeg.distance?.value,
        };
      }
    }

    const hoverParts = [`<div style="font-weight:600">${option.name} → ${event?.title ?? 'Event'}</div>`];
    if (fromYou?.durationText) {
      const dist = fromYou.distanceText ? ` • ${fromYou.distanceText}` : '';
      hoverParts.push(
        `<div style="margin-top:6px;font-size:12px;color:#475569;">Direct walk from you: ${fromYou.durationText}${dist}</div>`
      );
    }
    if (walkingMeta?.durationText) {
      const dist = walkingMeta.distanceText ? ` • ${walkingMeta.distanceText}` : '';
      hoverParts.push(
        `<div style="font-size:12px;color:#475569;">Walk to event: ${walkingMeta.durationText}${dist}</div>`
      );
    }
    if (transitMeta?.modeLabel) {
      hoverParts.push(
        `<div style="color:${type === 'mrt' ? '#6b21a8' : '#047857'};font-size:12px;">${transitMeta.modeLabel}</div>`
      );
    }

    const googleMapsUrls = {
      walk: makeGoogleMapsUrl(option.position, eventPos, 'walking'),
      transit: transitResult ? makeGoogleMapsUrl(option.position, eventPos, 'transit') : undefined,
      fullTransit: youPos ? makeGoogleMapsUrl(youPos, eventPos, 'transit') : undefined,
    };

    return {
      path,
      walkingPath,
      hoverHtml: hoverParts.join(''),
      lines,
      walkToEvent: walkingMeta,
      transitToEvent: transitMeta,
      fromYou,
      travelMode,
      googleMapsUrls,
    };
  };

  const handleTransitSelection = async (
    option: TransitOption,
    type: 'mrt' | 'bus',
    index: number,
    opts?: { force?: boolean }
  ) => {
    if (!option.position || !mapObj.current) return;
    setSelectedTransit({ type, index });
    highlightTransitMarker(option, type);
    clearTransitRoute();

    const key = `${type}-${index}`;
    const cached = transitSummaries[key];
    if (cached && !opts?.force) {
      renderTransitRoute(cached, option, type);
      return;
    }

    setTransitRouteLoadingKey(key);
    transitRouteRequestRef.current = { key };
    try {
      const summary = await buildTransitSummary(option, type);
      if (transitRouteRequestRef.current?.key !== key) return;

      if (!summary) {
        updateTransitNote(
          type,
          `Could not load ${type === 'mrt' ? 'MRT' : 'bus'} route details right now.`
        );
        return;
      }

      setTransitSummaries((prev) => ({ ...prev, [key]: summary }));
      renderTransitRoute(summary, option, type);
    } finally {
      if (transitRouteRequestRef.current?.key === key) {
        transitRouteRequestRef.current = null;
        setTransitRouteLoadingKey(null);
      }
    }
  };

  // 1) Initialize the map
  useEffect(() => {
    let canceled = false;
    let tileListener: any = null;

    (async () => {
      try {
        setMapReady(false);
        await loadGoogleMapsScript();
        if (canceled || !mapRef.current) return;

        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

        const MapCtor = window.google?.maps?.Map as typeof google.maps.Map | undefined;
        if (!MapCtor) throw new Error('google.maps.Map unavailable');

        const instance = new MapCtor(mapRef.current!, {
          center: fallbackCenter,
          zoom: 12,
          gestureHandling: 'cooperative',
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });
        mapObj.current = instance;

        if (instance?.addListener) {
          tileListener = instance.addListener('tilesloaded', () => {
            setMapReady(true);
            tileListener?.remove?.();
          });
        }
        setTimeout(() => {
          if (!canceled) setMapReady(true);
        }, MAP_READY_TIMEOUT_MS);

        if (window.google.maps.DirectionsRenderer) {
          dirRenderer.current = new window.google.maps.DirectionsRenderer({
            map: mapObj.current,
            suppressMarkers: true,
            preserveViewport: false,
            polylineOptions: { strokeColor: '#7c3aed', strokeWeight: 5, strokeOpacity: 0.9 },
          });
        }
        setMapError(null);
      } catch (e: any) {
        console.error('[HowToGetThere:init] Map error:', e);
        setMapError('Map failed to initialize. Check API restrictions & billing.');
      }
    })();

    return () => {
      canceled = true;
      tileListener?.remove?.();
      dirRenderer.current?.setMap(null);
      dirRenderer.current = null;
      mapObj.current = null;
      setMapReady(false);
      clearHighlightMarker();
      clearTransitRoute();
      setSelectedTransit(null);
      setSelectedCardKey(null);
      setTransitSummaries({});
      setTransitRouteLoadingKey(null);
      transitRouteRequestRef.current = null;
    };
  }, [fallbackCenter]);

  // 2) Resolve event location (reuse manual coords when provided)
  useEffect(() => {
    let canceled = false;
    (async () => {
      if (manualCoords) {
        setEventPos(manualCoords);
        return;
      }

      if (!searchQueries.length) {
        setEventPos(fallbackCenter);
        return;
      }

      let resolved: LatLng | null = null;
      let mapsReady = false;

      try {
        await loadGoogleMapsScript();
        mapsReady = true;
      } catch (err) {
        console.warn('[HowToGetThere:geocode] Google Maps unavailable, using OneMap fallback.', err);
      }

      if (mapsReady) {
        for (const query of searchQueries) {
          if (canceled) return;
          try {
            const loc = await geocode(query, 'SG');
            if (loc) {
              resolved = loc;
              break;
            }
          } catch (err) {
            console.warn('[HowToGetThere:geocode] Google geocode failed for query', query, err);
          }
        }
      }

      if (!resolved) {
        for (const query of searchQueries) {
          if (canceled) return;
          try {
            const alt = await geocodeOneMap(query);
            if (alt) {
              resolved = { lat: alt.lat, lng: alt.lng };
              break;
            }
          } catch (err) {
            console.warn('[HowToGetThere:geocode] OneMap geocode failed for query', query, err);
          }
        }
      }

      if (!canceled) setEventPos(resolved ?? fallbackCenter);
    })();
    return () => {
      canceled = true;
    };
  }, [manualCoords, searchQueries, fallbackCenter]);

  // 3) User location
  const locateMe = () => {
    if (!navigator.geolocation) {
      console.warn('[HowToGetThere] Geolocation not supported');
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoPending(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('[HowToGetThere] Location success:', pos.coords);
        setYouPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoPending(false);
      },
      (error) => {
        console.warn('[HowToGetThere] Location error:', error.code, error.message);

        // Provide user-friendly error messages
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        alert(errorMessage);

        setYouPos(null);
        setGeoPending(false);
      },
      {
        enableHighAccuracy: false, // Use less accurate but faster location on mobile
        timeout: 15000, // Increased timeout for iOS
        maximumAge: 300000 // Cache location for 5 minutes
      }
    );
  };

  // Auto-request location on mount (will only work if user has previously granted permission)
  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation || !navigator.permissions) {
      return;
    }

    // Check permission status without triggering a prompt
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        // User has already granted permission, auto-fetch location
        console.log('[HowToGetThere] Auto-requesting location (permission already granted)');
        locateMe();
      } else if (permissionStatus.state === 'prompt') {
        // Permission not yet determined - don't auto-request, wait for user to click button
        console.log('[HowToGetThere] Geolocation permission not yet granted - waiting for user action');
      } else {
        // Permission denied
        console.log('[HowToGetThere] Geolocation permission denied');
      }
    }).catch((err) => {
      // Fallback for browsers that don't support permissions API
      console.warn('[HowToGetThere] Permissions API not supported, will wait for user to click button', err);
    });
  }, []);

  useEffect(() => {
    if (!youPos || !selectedTransit || transitRouteLoadingKey) return;
    const list = selectedTransit.type === 'mrt' ? mrtStations : busStops;
    const option = list?.[selectedTransit.index];
    if (!option?.position) return;
    handleTransitSelection(option, selectedTransit.type, selectedTransit.index, { force: true });
  }, [youPos?.lat, youPos?.lng]);

  // 4) Place/refresh markers + fit bounds
  useEffect(() => {
    if (!mapObj.current || !eventPos) return;

    if (!eventMarkerRef.current) {
      eventMarkerRef.current = new window.google.maps.Marker({
        position: eventPos,
        map: mapObj.current,
        title: event?.title || 'Event',
      });
    } else {
      eventMarkerRef.current.setMap(mapObj.current);
      eventMarkerRef.current.setPosition(eventPos);
    }

    if (youPos) {
      const youIcon = {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
            <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="8" fill="#2563eb"/>
              <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48S32 28 32 16C32 7.16 24.84 0 16 0Z" fill="rgba(37,99,235,0.2)"/>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(32, 48),
        anchor: new window.google.maps.Point(16, 48),
      };

      if (!youMarkerRef.current) {
        youMarkerRef.current = new window.google.maps.Marker({
          position: youPos,
          map: mapObj.current,
          title: 'You are here',
          icon: youIcon,
        });
      } else {
        youMarkerRef.current.setMap(mapObj.current);
        youMarkerRef.current.setPosition(youPos);
      }
    } else {
      youMarkerRef.current?.setMap(null);
    }

    const b = new window.google.maps.LatLngBounds();
    b.extend(eventPos as any);
    if (youPos) b.extend(youPos as any);
    mapObj.current.fitBounds(b, 60);
  }, [eventPos, youPos, event?.title]);

  useEffect(() => {
    setSelectedTransit(null);
    setSelectedCardKey(null);
    clearHighlightMarker();
    clearTransitRoute();
    setTransitSummaries({});
    setTransitRouteLoadingKey(null);
    transitRouteRequestRef.current = null;
  }, [event?.id]);

  // 5) Directions (walking) – use fallback if Directions API is off
  useEffect(() => {
    if (!mapObj.current || !dirRenderer.current || !eventPos || !youPos) return;

    if (!window.google?.maps?.DirectionsService) {
      const d = haversine(youPos, eventPos);
      setDistanceM(d);
      setDurationS(undefined as any);
      return;
    }

    const svc = new window.google.maps.DirectionsService();
    svc.route(
      { origin: youPos, destination: eventPos, travelMode: 'WALKING' },
      (result: any, status: string) => {
        if (status === 'OK' && result?.routes?.[0]?.legs?.[0]) {
          dirRenderer.current!.setDirections(result);
          const leg = result.routes[0].legs[0];
          setDistanceM(leg.distance?.value ?? haversine(youPos, eventPos));
          setDurationS(leg.duration?.value ?? undefined as any);
        } else {
          const d = haversine(youPos, eventPos);
          setDistanceM(d);
          setDurationS(undefined as any);
          dirRenderer.current!.setDirections({ routes: [] } as any);
        }
      }
    );
  }, [eventPos, youPos]);

  // 6) Places: MRT + Bus
  useEffect(() => {
    let canceled = false;

    (async () => {
      if (!mapObj.current || !eventPos) return;
      setTransitLoading(true);
      setSelectedTransit(null);
      clearHighlightMarker();
      clearTransitRoute();
      setTransitSummaries({});
      setTransitRouteLoadingKey(null);
      transitRouteRequestRef.current = null;
      setMrtStations(null);
      setBusStops(null);
      updateTransitNote('mrt');
      updateTransitNote('bus');

      try {
        await loadGoogleMapsScript();

        if (!window.google?.maps?.places?.PlacesService) {
          if (!canceled) {
            updateTransitNote('mrt', 'Enable the Google Places API for MRT suggestions.');
            updateTransitNote('bus', 'Enable the Google Places API for bus stop suggestions.');
            setMrtStations([]);
            setBusStops([]);
          }
          return;
        }

        const svc = new window.google.maps.places.PlacesService(mapObj.current);
        const MRT_RADIUS = 4200;
        const BUS_RADIUS = 2800;

        const collectPlaces = async (requests: any[]) => {
          const byId = new Map<string, any>();
          for (const req of requests) {
            const res = await nearbySearchPromise(svc, req);
            res.forEach((place: any) => {
              const key = place.place_id || `${place.name}_${place.vicinity ?? ''}`;
              if (!byId.has(key)) byId.set(key, place);
            });
            if (byId.size >= 10) break;
          }
          return Array.from(byId.values());
        };

        const [mrtRaw, busNearby] = await Promise.all([
          collectPlaces([
            { location: eventPos, radius: MRT_RADIUS, type: 'subway_station' },
            { location: eventPos, radius: MRT_RADIUS, type: 'transit_station', keyword: 'MRT' },
            { location: eventPos, radius: MRT_RADIUS, keyword: 'MRT station' },
          ]),
          collectPlaces([
            { location: eventPos, radius: BUS_RADIUS, type: 'bus_station' },
            { location: eventPos, radius: BUS_RADIUS, type: 'transit_station', keyword: 'bus stop' },
            { location: eventPos, radius: BUS_RADIUS, keyword: 'bus interchange' },
          ]),
        ]);

        if (canceled) return;

        const toTransitOptions = (places: any[], origin: LatLng): TransitOption[] =>
          places
            .filter((p) => p?.geometry?.location)
            .map((p) => {
              const loc = p.geometry.location;
              const coord = { lat: loc.lat(), lng: loc.lng() };
              return {
                name: p.name || 'Unknown stop',
                dist: Math.round(haversine(origin, coord)),
                address: p.vicinity || p.formatted_address || '',
                position: coord,
                placeId: p.place_id,
              } as any;
            });

        const mrtOptions = toTransitOptions(mrtRaw, eventPos)
          .sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9))
          .slice(0, 4);
        if (!canceled) {
          setMrtStations(mrtOptions);
          updateTransitNote('mrt', mrtOptions.length ? undefined : 'No MRT stations within ~4 km.');
        }

        let busRaw = busNearby;
        if (!busRaw.length) {
          busRaw = await textSearchPromise(svc, {
            location: eventPos,
            radius: BUS_RADIUS,
            query: 'bus stop',
          });
        }
        if (!Array.isArray(busRaw)) busRaw = [];

        if (!canceled) {
          const busOptions = toTransitOptions(busRaw, eventPos)
            .sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9))
            .slice(0, 6);
          setBusStops(busOptions);
          updateTransitNote('bus', busOptions.length ? undefined : 'No bus stops within ~2.8 km.');
        }
      } catch (err) {
        console.warn('[HowToGetThere:places] Failed to load transit options:', err);
        if (!canceled) {
          updateTransitNote('mrt', 'Transit data temporarily unavailable.');
          updateTransitNote('bus', 'Transit data temporarily unavailable.');
          setMrtStations([]);
          setBusStops([]);
        }
      } finally {
        if (!canceled) setTransitLoading(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [eventPos]);

  const showSummary = Boolean(eventPos && youPos);
  const safeDist = distanceM ?? (eventPos && youPos ? haversine(youPos, eventPos) : 0);
  const durationTxt = showSummary ? fmtDuration(safeDist, durationS ?? undefined) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Navigation className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl sm:text-xl font-semibold">How to Get There</h2>
        </div>
        <button
          onClick={locateMe}
          className="px-4 py-2 rounded-full bg-white border hover:bg-pink-50 flex items-center gap-2 transition-colors"
        >
          <Crosshair className="w-4 h-4 text-pink-500" />
          <span>{geoPending ? 'Locating…' : 'Use My Location'}</span>
        </button>
      </div>

      {/* Map */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full min-h-[360px]"
            style={{ minHeight: 360 }}
          />
          {!mapReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm text-gray-500 text-sm font-medium animate-pulse pointer-events-none">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-400 text-pink-600 shadow-sm">
                <Navigation className="h-5 w-5" />
              </span>
              <span>Loading interactive map…</span>
            </div>
          )}
        </div>
      </div>

      {mapError && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          {mapError}
        </div>
      )}

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-2xl bg-white text-slate-900 shadow-lg p-6 border border-gray-200"
        >
          <span aria-hidden className="htgt-route-card-gradient" />
          <span aria-hidden className="htgt-card-dim" />
          <div className="relative z-10 text-center flex flex-col items-center">
            <span className="block w-14 rounded-full bg-pink-500/80 mb-2 shadow-[0_0_10px_rgba(190,24,93,0.45)]" />
            <p className="text-xl font-semibold uppercase tracking-[0.2em] text-pink-900 mb-3 drop-shadow-[0_3px_8px_rgba(190,24,93,0.24)]">Route Summary</p>
            {showSummary ? (
              <>
                <p className="text-xl font-extrabold leading-tight text-slate-900 drop-shadow-[0_10px_22px_rgba(168,85,247,0.3)]">
                  {km(safeDist)} km away
                </p>
                {durationTxt && (
                  <p className="mt-2 text-xs text-slate-800 drop-shadow-sm">Walking time ≈ {durationTxt}</p>
                )}
              </>
            ) : (
              <p className="text-slate-800 drop-shadow-sm">Enable location to see how far you are from the event.</p>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl bg-pink-50 shadow-xl p-6 border border-pink-200"
        >
          <span aria-hidden className="htgt-tips-card-gradient" />
          <span aria-hidden className="htgt-card-dim" />
          <div className="relative z-10 text-center flex flex-col items-center">
            <span className="block h-1 w-14 rounded-full bg-pink-400/80 mb-3 shadow-[0_0_10px_rgba(244,114,182,0.45)]" />
            <p className="text-xl font-semibold uppercase tracking-[0.2em] text-pink-900 mb-3 drop-shadow-[0_3px_8px_rgba(244,114,182,0.24)]">Tips</p>
            <p className="text-xs text-gray-800 mb-3 leading-relaxed drop-shadow-sm max-w-[26rem]">
              Tap a station or stop to highlight the walking path, then use the buttons to open the route directly in Google Maps.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Public Transport */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-800 text-xl">Public Transport Options</p>
          {transitLoading && (
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-400 bg-white px-3 py-1 text-xs font-semibold text-pink-500 shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Fetching nearby stops…</span>
            </span>
          )}
        </div>

        {/* MRT */}
        <div className="mt-3">
          <p className="flex items-center gap-2 font-semibold text-purple-600">
            <span className="text-lg leading-none">🚇</span>
            <span>Nearest MRT Stations</span>
          </p>
          <AnimatePresence initial={false}>
            {mrtStations === null ? (
              <motion.div
                key="mrt-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 grid gap-2"
              >
                <p className="text-sm text-gray-500">Looking for nearby MRT stations…</p>
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-16 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}
              </motion.div>
            ) : mrtStations.length ? (
              <motion.div
                key="mrt-results"
                layout
                className="mt-3 grid gap-3"
              >
                {mrtStations.map((station, idx) => {
                  const summaryKey = `mrt-${idx}`;
                  const summary = transitSummaries[summaryKey];
                  const loadingThis = transitRouteLoadingKey === summaryKey;
                  const cardKey = getCardKey(station, 'mrt', idx);
                  const isActive = selectedCardKey === cardKey;
                  const isClickable = Boolean(station.position);
                  const cardClasses = [
                    'group relative w-full rounded-2xl bg-white px-4 py-4 text-left transition-[transform,box-shadow,border-color] duration-200 focus-visible:outline-none',
                    // active: extra-thick purple border + strong glow shadow
                    // inside MRT cardClasses
                    isActive
                    ? 'overflow-visible border-[3px] border-purple-400 outline outline-2 outline-purple-500/60 shadow-[0_0_0_4px_rgba(168,85,247,0.4),0_18px_40px_rgba(168,85,247,0.3)]'
                    : 'overflow-hidden border border-purple-400 bg-white shadow-sm shadow-purple-400/30',
                    isClickable
                      ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-300/60'
                      : 'cursor-default opacity-70',
                    !isClickable ? 'pointer-events-none' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return (
                    <motion.button
                      key={`${station.name}-${idx}`}
                      type="button"
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={isClickable ? { y: -6, scale: 1.01 } : undefined}
                      whileTap={isClickable ? { scale: 0.99 } : undefined}
                      onClick={() => {
                        if (!isClickable) return;
                        setSelectedCardKey(cardKey);
                        handleTransitSelection(station, 'mrt', idx);
                      }}
                      className={cardClasses}
                      disabled={!isClickable}
                    >
                      {/* left accent bar to make the active state unmistakable */}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-2xl transition-opacity duration-200 ${
                          isActive ? 'opacity-100 bg-purple-500' : 'opacity-0 group-hover:opacity-60 bg-purple-400'
                        }`}
                      />
                      <div className="relative flex items-start justify-between gap-3 text-sm font-semibold text-purple-900">
                        <span className="flex-1">{station.name}</span>
                        <div className="flex flex-col items-end gap-1">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-white px-2 py-0.5 text-[10px] font-semibold text-purple-600 shadow-sm">
                              <Navigation className="h-3 w-3" />
                              On map
                            </span>
                          )}
                          {typeof station.dist === 'number' && (
                            <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                              {station.dist} m
                            </span>
                          )}
                        </div>
                      </div>
                      {station.address && (
                        <p className="relative mt-1 text-xs text-gray-500">{station.address}</p>
                      )}
                      {summary ? (
                        <div className="relative mt-3 space-y-3 text-xs text-gray-600">
                          <div className="flex flex-wrap items-center gap-2">
                            {summary.walkToEvent?.durationText && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-700">
                                🚶‍♀️ Station → Event {summary.walkToEvent.durationText}
                              </span>
                            )}
                          </div>
                          {!summary.transitToEvent && (
                            <p className="text-[11px] text-gray-500">
                              Transit details unavailable from Google right now — showing walking route from the station to the event.
                            </p>
                          )}
                          {(summary.lines?.length ?? 0) > 0 && (
                            <p className="text-[11px] text-purple-600">
                              {summary.lines?.join(' • ')}
                            </p>
                          )}
                          {summary.transitToEvent &&
                            (summary.googleMapsUrls?.transit || summary.googleMapsUrls?.fullTransit) && (
                            <div className="relative flex flex-wrap gap-2 text-[11px]">
                              {summary.googleMapsUrls?.transit && summary.transitToEvent && (
                                <a
                                  href={summary.googleMapsUrls.transit}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-purple-600 shadow-sm ring-1 ring-purple-400 hover:bg-purple-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  🚇 Station → Event
                                </a>
                              )}
                              {summary.googleMapsUrls?.fullTransit && summary.transitToEvent && (
                                <a
                                  href={summary.googleMapsUrls.fullTransit}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-purple-600 shadow-sm ring-1 ring-purple-400 hover:bg-purple-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  🗺️ Full transit
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="relative mt-3 text-[11px] text-gray-500">
                          Tap to preview route details on the map.
                        </p>
                      )}
                      {loadingThis && (
                        <div className="relative mt-3 flex items-center gap-2 text-[11px] font-medium text-purple-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Calculating route…
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.p
                key="mrt-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-gray-500"
              >
                {transitNotes.mrt ?? 'Not available'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Buses */}
        <div className="mt-6">
          <p className="flex items-center gap-2 font-semibold text-pink-500">
            <span className="text-lg leading-none">🚌</span>
            <span>Nearby Bus Stops</span>
          </p>
          <AnimatePresence initial={false}>
            {busStops === null ? (
              <motion.div
                key="bus-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 grid gap-2"
              >
                <p className="text-sm text-gray-500">Looking for nearby bus stops…</p>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-16 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}
              </motion.div>
            ) : busStops.length ? (
              <motion.div
                key="bus-results"
                layout
                className="mt-3 grid gap-3"
              >
                {busStops.map((stop, idx) => {
                  const summaryKey = `bus-${idx}`;
                  const summary = transitSummaries[summaryKey];
                  const loadingThis = transitRouteLoadingKey === summaryKey;
                  const cardKey = getCardKey(stop, 'bus', idx);
                  const isActive = selectedCardKey === cardKey;
                  const isClickable = Boolean(stop.position);
                  const cardClasses = [
                    'group relative w-full rounded-2xl bg-white px-4 py-4 text-left transition-[transform,box-shadow,border-color] duration-200 focus-visible:outline-none',
                    // active: extra-thick pink border + strong glow shadow
                    isActive
                      ? 'overflow-visible border-[3px] border-pink-500 outline outline-2 outline-pink-400/60 shadow-[0_0_0_4px_rgba(244,114,182,0.4),0_18px_40px_rgba(236,72,153,0.3)]'
                      : 'overflow-hidden border border-pink-200 bg-white shadow-sm shadow-pink-200/40',
                    isClickable
                      ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-400/60'
                      : 'cursor-default opacity-70',
                    !isClickable ? 'pointer-events-none' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                    
                  return (
                    
                    <motion.button
                      key={`${stop.name}-${idx}`}
                      type="button"
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={isClickable ? { y: -6, scale: 1.01 } : undefined}
                      whileTap={isClickable ? { scale: 0.99 } : undefined}
                      onClick={() => {
                           if (!isClickable) return;
                           setSelectedCardKey(cardKey);
                           handleTransitSelection(stop, 'bus', idx);
                         }}
                      className={cardClasses}
                      disabled={!isClickable}
                    >
                      {/* left accent bar to make the active state unmistakable */}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-2xl transition-opacity duration-200 ${
                          isActive ? 'opacity-100 bg-pink-500' : 'opacity-0 group-hover:opacity-60 bg-pink-500'
                        }`}
                      />
                      <div className="relative flex items-start justify-between gap-3 text-sm font-semibold text-pink-600">
                        <span className="flex-1">{stop.name}</span>
                        <div className="flex flex-col items-end gap-1">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-pink-200/80 bg-white px-2 py-0.5 text-[10px] font-semibold text-pink-500 shadow-sm">
                              <Navigation className="h-3 w-3" />
                              On map
                            </span>
                          )}
                          {typeof stop.dist === 'number' && (
                            <span className="inline-flex items-center justify-center rounded-full bg-pink-400 px-2 py-0.5 text-xs text-white font-medium">
                              {stop.dist} m
                            </span>
                          )}
                        </div>
                      </div>
                      {stop.address && (
                        <p className="relative mt-1 text-xs text-pink-500/80">{stop.address}</p>
                      )}
                      {summary ? (
                        <div className="relative mt-3 space-y-3 text-xs text-pink-600/80">
                          <div className="flex flex-wrap items-center gap-2">
                            {summary.walkToEvent?.durationText && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-500/80">
                                🚶‍♀️ Stop → Event {summary.walkToEvent.durationText}
                              </span>
                            )}
                          </div>
                          {!summary.transitToEvent && (
                            <p className="text-[11px] text-pink-500/80">
                              Transit details unavailable — showing the walking path from this stop.
                            </p>
                          )}
                          {(summary.lines?.length ?? 0) > 0 && (
                            <p className="text-[11px] text-pink-500/90">
                              {summary.lines?.join(' • ')}
                            </p>
                          )}
                          {(summary.googleMapsUrls?.transit || summary.googleMapsUrls?.fullTransit) && (
                            <div className="relative flex flex-wrap gap-2 text-[11px]">
                              {summary.googleMapsUrls?.transit && (
                                <a
                                  href={summary.googleMapsUrls.transit}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-pink-500 shadow-sm ring-1 ring-pink-200 hover:bg-pink-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  🚌 Stop → Event
                                </a>
                              )}
                              {summary.googleMapsUrls?.fullTransit && (
                                <a
                                  href={summary.googleMapsUrls.fullTransit}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-pink-500 shadow-sm ring-1 ring-pink-200 hover:bg-pink-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  🗺️ Full transit
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="relative mt-3 text-[11px] text-pink-500/80">
                          Tap to preview route details on the map.
                        </p>
                      )}
                      {loadingThis && (
                        <div className="relative mt-3 flex items-center gap-2 text-[11px] font-medium text-pink-500">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Calculating route…
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.p
                key="bus-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-gray-500"
              >
                {transitNotes.bus ?? 'Not available'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {event?.location && (
        <div className="mt-6 flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-pink-500" />
          <span className="text-sm">{event.location}</span>
        </div>
      )}
    </motion.div>
  );
}
