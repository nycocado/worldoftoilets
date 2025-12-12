'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface SuggestionMiniMapProps {
  origin: [number, number];
  destination: [number, number];
  isDark: boolean;
}

export function SuggestionMiniMap({
  origin,
  destination,
  isDark,
}: SuggestionMiniMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (
      origin[0] === 0 ||
      origin[1] === 0 ||
      destination[0] === 0 ||
      destination[1] === 0
    )
      return;

    const styleUrl = isDark
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: origin,
        zoom: 13,
        interactive: false,
        attributionControl: false,
      });

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      map.current.fitBounds(bounds, { padding: 30, maxZoom: 15 });

      new maplibregl.Marker({ color: '#3b82f6', scale: 0.6 })
        .setLngLat(origin)
        .addTo(map.current);

      new maplibregl.Marker({ color: '#ef4444', scale: 0.6 })
        .setLngLat(destination)
        .addTo(map.current);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isDark, origin, destination]);

  return <div ref={mapContainer} className="w-full h-full bg-muted" />;
}
