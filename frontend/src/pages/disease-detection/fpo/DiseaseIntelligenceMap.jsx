// PAGE 3 — Disease Intelligence Map
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/DiseaseIntelligenceMap.jsx

import React, { useState, useEffect } from "react";
import seededData from "../../../seed-json/seededData.json";
import StatsCard from "../../../components/partials/StatsCard";
import { Layers, MapPin, Activity, Bell, Info, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Popup, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DiseaseIntelligenceMap() {
  const [dataState, setDataState] = useState(() => {
    const saved = localStorage.getItem("fpoDiseaseDetectionState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.hotspots)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse FPO state", e);
      }
    }
    return seededData.fpoDiseaseDetection;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("fpoDiseaseDetectionState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.hotspots)) {
            setDataState(parsed);
          }
        } catch (e) {
          console.error("Failed to parse FPO state from storage event", e);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const hotspots = dataState.hotspots || seededData.fpoDiseaseDetection.hotspots || [];

  const [layers, setLayers] = useState({
    disease: true,
    weather: true,
    satellite: false,
    forecast: false
  });

  const [forecastHorizon, setForecastHorizon] = useState(7); // 3, 7, 14 days

  // Inject Leaflet CSS dynamically to prevent gray-tile rendering issues
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Page Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">Geographical Disease Mapping</h1>
        <p className="text-slate-500 text-xs font-semibold">
          Coordinate transmission indices, monitor regional spread coordinates, and overlay weather parameters.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Hotspots"
          value={hotspots.length}
          icon={<Activity className="text-emerald-700" />}
          subtext="Monitored zones"
        />
        <StatsCard
          title="Critical Clusters"
          value={hotspots.filter(h => h.severity === "Critical").length}
          icon={<AlertTriangle className="text-emerald-700" />}
          subtext="High probability threats"
        />
        <StatsCard
          title="Affected Farmers"
          value={hotspots.reduce((sum, h) => sum + h.farmers, 0)}
          icon={<Users className="text-emerald-700" />}
          subtext="Aggregated growers"
        />
        <StatsCard
          title="Monitored Villages"
          value={dataState.summary ? dataState.summary.totalVillages : "23"}
          icon={<MapPin className="text-emerald-700" />}
          subtext="Within FPO territory"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Sidebar Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5 h-fit">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#31572c]" />
            Surveillance Layers
          </h2>

          <div className="space-y-3 mt-4">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.disease}
                onChange={(e) => setLayers(prev => ({ ...prev, disease: e.target.checked }))}
                className="rounded border-slate-300 text-[#31572c] focus:ring-[#31572c] h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Disease Reports
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.weather}
                onChange={(e) => setLayers(prev => ({ ...prev, weather: e.target.checked }))}
                className="rounded border-slate-300 text-[#31572c] focus:ring-[#31572c] h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Weather Risk Matrix
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.satellite}
                onChange={(e) => setLayers(prev => ({ ...prev, satellite: e.target.checked }))}
                className="rounded border-slate-300 text-[#31572c] focus:ring-[#31572c] h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Satellite Indicators
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={layers.forecast}
                onChange={(e) => setLayers(prev => ({ ...prev, forecast: e.target.checked }))}
                className="rounded border-slate-300 text-[#31572c] focus:ring-[#31572c] h-4 w-4"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Forecasted Outbreaks
              </span>
            </label>
          </div>
        </div>

        {/* Hotspot Legend */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
            Hotspot Legend
          </h4>
          <div className="space-y-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500" />
              <span>Critical Zone (Risk &gt; 70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500" />
              <span>Moderate Zone (Risk 40-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
              <span>Safe Zone (Risk &lt; 40%)</span>
            </div>
          </div>
        </div>

        {/* Forecast Horizon simulation */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-[10px] font-black text-slate-455 uppercase tracking-widest">
            Forecast Spread Horizon
          </h4>
          <div className="grid grid-cols-3 gap-1.5">
            {[3, 7, 14].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForecastHorizon(d)}
                className={`py-1.5 rounded-xl text-[10px] font-black uppercase transition cursor-pointer ${
                  forecastHorizon === d ? "bg-brand-dark text-white" : "bg-slate-105 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d}-Day
              </button>
            ))}
          </div>
          <p className="text-[10px] font-semibold leading-relaxed text-slate-500">
            Adjusting timeline opacity & radius based on spore drifting weather correlation index models.
          </p>
        </div>

        {/* Risk Stats summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5 font-bold text-xs text-slate-700">
          <div className="flex justify-between">
            <span>Total Hotspots:</span>
            <span>7</span>
          </div>
          <div className="flex justify-between">
            <span>Critical Zones:</span>
            <span className="text-red-600">2</span>
          </div>
          <div className="flex justify-between">
            <span>Villages Monitored:</span>
            <span>23</span>
          </div>
        </div>

      </div>

      {/* Interactive Map view */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
        <div className="relative flex-1 min-h-[500px] z-0">
          <MapContainer 
            center={[30.0, 75.5]} 
            zoom={9.5} 
            className="w-full h-full min-h-[500px]"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <LayerGroup>
              {hotspots.map((spot, idx) => {
                // Determine whether layer is enabled
                if (spot.type === "disease" && !layers.disease) return null;
                if (spot.type === "weather" && !layers.weather) return null;
                if (spot.type === "satellite" && !layers.satellite) return null;
                if (spot.type === "forecast" && !layers.forecast) return null;

                // Color based on risk score
                const color = spot.score >= 70 ? "#ef4444" : spot.score >= 40 ? "#f59e0b" : "#10b981";
                
                // Opacity & Size adjustments based on forecast selections
                const baseRadius = spot.score * 120;
                const sizeMult = forecastHorizon === 14 ? 1.3 : forecastHorizon === 3 ? 0.95 : 1.1;
                const finalRadius = baseRadius * sizeMult;

                return (
                  <CircleMarker
                    key={idx}
                    center={spot.coords}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.25,
                      weight: 1.5
                    }}
                    radius={Math.min(30, finalRadius / 400)}
                  >
                    <Popup>
                      <div className="font-['Plus_Jakarta_Sans',_sans-serif] text-xs space-y-1">
                        <h4 className="font-black text-slate-900 border-b pb-1 mb-1">{spot.name}</h4>
                        <div><b>Pathogen:</b> {spot.disease}</div>
                        <div><b>Risk Level:</b> <span className="font-bold" style={{ color }}>{spot.score}%</span></div>
                        <div><b>Affected Farmers:</b> {spot.farmers} Growers</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </LayerGroup>

          </MapContainer>
        </div>
      </div>

      </div>
    </div>
  );
}
