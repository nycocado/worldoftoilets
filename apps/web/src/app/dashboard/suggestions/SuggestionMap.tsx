'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';

interface SuggestionMapProps {
  toiletLat: number;
  toiletLon: number;
  userLat: number;
  userLon: number;
  editMode: boolean;
  onUserMarkerDrag: (lat: number, lng: number) => void;
}

export function SuggestionMap({
  toiletLat,
  toiletLon,
  userLat,
  userLon,
  editMode,
  onUserMarkerDrag,
}: SuggestionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const toiletMarkerRef = useRef<maplibregl.Marker | null>(null);

  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check for valid coordinates before initializing
    if (
      toiletLat === 0 ||
      toiletLon === 0 ||
      userLat === 0 ||
      userLon === 0
    )
      return;

    const isDark = theme === 'dark' || resolvedTheme === 'dark';
    const styleUrl = isDark
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [toiletLon, toiletLat],
        zoom: 13,
        attributionControl: false,
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Fit bounds to show both points with padding
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([toiletLon, toiletLat]);
      bounds.extend([userLon, userLat]);
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 16 });

      // Toilet Marker (Blue)
      toiletMarkerRef.current = new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat([toiletLon, toiletLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(
            'Localização da Casa de Banho'
          )
        )
        .addTo(map.current);

      // User Marker (Red)
      userMarkerRef.current = new maplibregl.Marker({
        color: '#ef4444',
        draggable: editMode,
      })
        .setLngLat([userLon, userLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(
            editMode
              ? 'Localização do Utilizador (arraste para ajustar)'
              : 'Localização do Utilizador'
          )
        )
        .addTo(map.current);

      userMarkerRef.current.on('dragend', () => {
        const lngLat = userMarkerRef.current!.getLngLat();
        onUserMarkerDrag(lngLat.lat, lngLat.lng);
      });
    } else {
      // Update existing markers
      if (toiletMarkerRef.current) {
        toiletMarkerRef.current.setLngLat([toiletLon, toiletLat]);
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([userLon, userLat]);
        userMarkerRef.current.setDraggable(editMode);
      }

      // Update bounds
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([toiletLon, toiletLat]);
      bounds.extend([userLon, userLat]);
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 16 });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [
    theme,
    resolvedTheme,
    toiletLat,
    toiletLon,
    userLat,
    userLon,
    editMode,
    onUserMarkerDrag,
  ]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-2 rounded-md border shadow-sm text-[10px] z-10 flex flex-col gap-1.5">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
          onClick={() => {
            if (map.current) {
              map.current.flyTo({ center: [toiletLon, toiletLat], zoom: 16 });
            }
          }}
          title="Centralizar na Casa de Banho"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] border border-white shadow-sm" />
          <span className="font-medium text-muted-foreground">
            Casa de Banho
          </span>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
          onClick={() => {
            if (map.current) {
              map.current.flyTo({ center: [userLon, userLat], zoom: 16 });
            }
          }}
          title="Centralizar no Utilizador"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white shadow-sm" />
          <span className="font-medium text-foreground">Utilizador</span>
        </div>
      </div>
    </div>
  );
}
