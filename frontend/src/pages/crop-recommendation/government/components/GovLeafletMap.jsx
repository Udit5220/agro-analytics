// GovLeafletMap.jsx
import React, { useEffect, useRef } from "react";
import { COLORS } from "../utils/constants";

export default function GovLeafletMap({ center = [20.5937, 78.9629], zoom = 4.5, circles, onSelectCircle }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  // 1. Initialize Map once on mount
  useEffect(() => {
    if (!mapRef.current || !window.L || mapInstance.current) return;

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(center, zoom);

    mapInstance.current = map;

    // Use MapTiler Satellite Map
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        maxZoom: 18,
      },
    ).addTo(map);

    // Initialize layer group for dynamic circles
    const layerGroup = window.L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 2. Update circles dynamically when layer group or props change (prevents map flickering)
  useEffect(() => {
    if (!mapInstance.current || !layerGroupRef.current || !window.L) return;

    // Clear previous dynamic layers
    layerGroupRef.current.clearLayers();

    if (circles) {
      circles.forEach((c) => {
        const circle = window.L.circle(c.coords, {
          color: c.color || COLORS.primary,
          fillColor: c.color || COLORS.primary,
          fillOpacity: 0.65,
          radius: c.radius || 150000,
          weight: c.weight || 2,
        });

        if (c.tooltip) {
          circle.bindTooltip(c.tooltip, { direction: "top" });
        }

        circle.on("click", () => {
          if (onSelectCircle) {
            onSelectCircle(c.name);
          }
        });

        circle.addTo(layerGroupRef.current);
      });
    }
  }, [circles, onSelectCircle]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[420px] rounded-2xl border border-gray-200 bg-slate-800 relative z-0"
    />
  );
}
