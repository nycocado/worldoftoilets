'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { pt } from '@/locales/pt';

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
  const tMap = pt.dashboard.suggestions.dialog.map;

  useEffect(() => {
    if (!mapContainer.current) return;

    if (toiletLat === 0 || toiletLon === 0 || userLat === 0 || userLon === 0)
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

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([toiletLon, toiletLat]);
      bounds.extend([userLon, userLat]);
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 16 });

      toiletMarkerRef.current = new maplibregl.Marker({ color: '#3b82f6' })
        .setLngLat([toiletLon, toiletLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(tMap.toiletLocation),
        )
        .addTo(map.current);

      userMarkerRef.current = new maplibregl.Marker({
        color: '#ef4444',
        draggable: editMode,
      })
        .setLngLat([userLon, userLat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(
            editMode ? tMap.userLocationDrag : tMap.userLocation,
          ),
        )
        .addTo(map.current);

      userMarkerRef.current.on('dragend', () => {
        const lngLat = userMarkerRef.current!.getLngLat();
        onUserMarkerDrag(lngLat.lat, lngLat.lng);
      });
    } else {
      if (toiletMarkerRef.current) {
        toiletMarkerRef.current.setLngLat([toiletLon, toiletLat]);
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([userLon, userLat]);
        userMarkerRef.current.setDraggable(editMode);
      }

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
    tMap,
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
          title={tMap.centerToilet}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] border border-white shadow-sm" />
          <span className="font-medium text-muted-foreground">
            {tMap.toilet}
          </span>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
          onClick={() => {
            if (map.current) {
              map.current.flyTo({ center: [userLon, userLat], zoom: 16 });
            }
          }}
          title={tMap.centerUser}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-white shadow-sm" />
          <span className="font-medium text-foreground">{tMap.user}</span>
        </div>
      </div>
    </div>
  );
}
