import React, { useEffect, useRef } from "react";

export default function CompanyLeafletMap({
  center = [20.5937, 78.9629],
  zoom = 5,
  circles = [],
  markers = [],
  activeLayer = "production", // production, revenue, risk, contract, readiness
  onSelectElement
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.L || mapInstance.current) return;

    // Initialize Map Instance
    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true, // Enabled for cursor zoom in/out
    }).setView(center, zoom);

    mapInstance.current = map;

    // Premium MapTiler Satellite Layer
    window.L.tileLayer(
      "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=Js3t7mr8sd7cdIiAAyVp",
      {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        maxZoom: 18,
      }
    ).addTo(map);

    // Initialize Group Layer
    const layerGroup = window.L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Auto resize trigger
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

  // Sync Layers & Overlays
  useEffect(() => {
    if (!mapInstance.current || !layerGroupRef.current || !window.L) return;

    // Clear old elements
    layerGroupRef.current.clearLayers();

    // 1. Draw Circles (Hotspots, Sourcing Regions, Risk Zones)
    circles.forEach((c) => {
      // Determine color based on active layer
      let strokeColor = c.color || "#10b981";
      if (activeLayer === "risk") strokeColor = c.riskColor || "#ef4444";
      if (activeLayer === "revenue") strokeColor = c.revenueColor || "#f59e0b";
      if (activeLayer === "readiness") strokeColor = c.readinessColor || "#3b82f6";
      if (activeLayer === "contract") strokeColor = c.contractColor || "#8b5cf6";

      const circle = window.L.circle(c.coords, {
        color: strokeColor,
        fillColor: strokeColor,
        fillOpacity: 0.55,
        radius: c.radius || 120000,
        weight: 2,
      });

      if (c.tooltip) {
        circle.bindTooltip(`
          <div class="text-xs p-1 font-sans">
            <p class="font-bold text-slate-800">${c.name}</p>
            <p class="text-slate-500 font-medium">${c.tooltip}</p>
          </div>
        `, { direction: "top" });
      }

      circle.on("click", () => {
        if (onSelectElement) onSelectElement(c);
      });

      circle.addTo(layerGroupRef.current);
    });

    // 2. Draw Markers (FPOs, Warehouses, Collection Centers)
    markers.forEach((m) => {
      const pinIcon = window.L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg text-white font-bold text-xs" style="background-color: ${m.color || "#132a13"}">
            ${m.icon || "🏠"}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = window.L.marker(m.coords, { icon: pinIcon });

      if (m.tooltip) {
        marker.bindTooltip(`
          <div class="text-xs p-1 font-sans">
            <p class="font-bold text-slate-800">${m.name}</p>
            <p class="text-slate-500 font-medium">${m.tooltip}</p>
          </div>
        `, { direction: "top" });
      }

      marker.on("click", () => {
        if (onSelectElement) onSelectElement(m);
      });

      marker.addTo(layerGroupRef.current);
    });

  }, [circles, markers, activeLayer, onSelectElement]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl border border-slate-200 shadow-inner overflow-hidden z-0">
      <div ref={mapRef} className="w-full h-full bg-slate-900" />
      
      {/* Dynamic Layer indicator tag */}
      <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border border-slate-800 shadow backdrop-blur z-[1000] tracking-wider">
        Active View Layer: <span className="text-emerald-400 font-bold">{activeLayer}</span>
      </div>
    </div>
  );
}
