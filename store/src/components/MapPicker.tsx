"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  centerLat: number;
  centerLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
  showStoreMarker?: boolean;
  userLat?: number | null;
  userLng?: number | null;
}

export default function MapPicker({
  centerLat,
  centerLng,
  onLocationSelect,
  height = "h-80",
  showStoreMarker = true,
  userLat = null,
  userLng = null,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    if (showStoreMarker) {
      const storeIcon = L.divIcon({
        html: '<div style="background:#dc2626;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏪</div>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([centerLat, centerLng], { icon: storeIcon })
        .addTo(map)
        .bindPopup("<b>موقع المتجر</b>");
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);

      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }
      const userIcon = L.divIcon({
        html: '<div style="background:#2563eb;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">📍</div>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon, draggable: true })
        .addTo(map)
        .bindPopup("<b>موقعك</b>")
        .openPopup();

      userMarkerRef.current.on("dragend", (ev: L.DragEndEvent) => {
        const pos = (ev.target as L.Marker).getLatLng();
        onLocationSelect(pos.lat, pos.lng);
      });
    });

    mapInstance.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapInstance.current = null;
      userMarkerRef.current = null;
    };
  }, [centerLat, centerLng]);

  // تحديث marker المستخدم لو تغيّر من GPS
  useEffect(() => {
    if (!mapInstance.current || userLat === null || userLng === null) return;
    if (userMarkerRef.current) {
      mapInstance.current.removeLayer(userMarkerRef.current);
    }
    const userIcon = L.divIcon({
      html: '<div style="background:#2563eb;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">📍</div>',
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, draggable: true })
      .addTo(mapInstance.current)
      .bindPopup("<b>موقعك</b>")
      .openPopup();
    mapInstance.current.setView([userLat, userLng], 14);

    userMarkerRef.current.on("dragend", (ev: L.DragEndEvent) => {
      const pos = (ev.target as L.Marker).getLatLng();
      onLocationSelect(pos.lat, pos.lng);
    });
  }, [userLat, userLng]);

  return (
    <div className="relative">
      <div ref={mapRef} className={`${height} w-full rounded-lg border-2 border-gray-200 z-0`} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500 font-bold">جاري تحميل الخريطة...</p>
        </div>
      )}
    </div>
  );
}
