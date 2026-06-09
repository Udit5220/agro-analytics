import React, { useState, useEffect, useRef } from "react";
import { 
  Map, ShieldAlert, Eye, CloudLightning, 
  Wind, Thermometer, Compass, Play, RefreshCw, BarChart2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const REGIONAL_HOTSPOTS = [
  { id: 1, village: "Kharindwa Block", risk: "92%", status: "Critical Outbreak", crop: "Rice (Paddy)", ndvi: "0.42 (Stress)" },
  { id: 2, village: "Bhucho Mandi", risk: "85%", status: "Active Rust Spores", crop: "Wheat", ndvi: "0.55 (Moderate)" },
  { id: 3, village: "Raman Cluster", risk: "68%", status: "Early Warning", crop: "Potato", ndvi: "0.62 (Healthy)" },
  { id: 4, village: "Gharaunda Sector", risk: "42%", status: "Monitoring", crop: "Mustard", ndvi: "0.74 (Optimal)" },
  { id: 5, village: "Nilokheri Village", risk: "28%", status: "Healthy", crop: "Sugarcane", ndvi: "0.81 (Excellent)" }
];

const HISTORICAL_RISK_TREND = [
  { day: "Day 1", risk: 32 },
  { day: "Day 3", risk: 38 },
  { day: "Day 5", risk: 45 },
  { day: "Day 7", risk: 58 },
  { day: "Day 9", risk: 64 },
  { day: "Day 11", risk: 78 },
  { day: "Day 13", risk: 85 },
  { day: "Day 14", risk: 92 }
];

export default function RegionalIntelligence() {
  const [simulationStep, setSimulationStep] = useState(0);
  const [activeLayer, setActiveLayer] = useState("satellite"); // satellite | gov | spread
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  // Initialize Leaflet satellite map
  useEffect(() => {
    if (!mapRef.current || !window.L || mapInstance.current) return;

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([30.35, 76.0], 9);

    mapInstance.current = map;

    // MapTiler Satellite Tiles
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
      {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        maxZoom: 18,
      }
    ).addTo(map);

    const lg = window.L.layerGroup().addTo(map);
    layerGroupRef.current = lg;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map overlays based on active layer
  useEffect(() => {
    if (!mapInstance.current || !layerGroupRef.current || !window.L) return;
    layerGroupRef.current.clearLayers();

    const hotspots = [
      { coords: [30.45, 75.85], label: "Kharindwa Block", risk: 92, color: "#ef4444", radius: 3000 },
      { coords: [30.30, 75.55], label: "Bhucho Mandi", risk: 85, color: "#f59e0b", radius: 2500 },
      { coords: [30.18, 76.15], label: "Raman Cluster", risk: 68, color: "#f59e0b", radius: 2000 },
      { coords: [29.53, 76.96], label: "Gharaunda Sector", risk: 42, color: "#3b82f6", radius: 1800 },
      { coords: [29.83, 76.77], label: "Nilokheri Village", risk: 28, color: "#22c55e", radius: 1200 }
    ];

    hotspots.forEach(h => {
      const c = window.L.circle(h.coords, {
        color: h.color,
        fillColor: h.color,
        fillOpacity: activeLayer === "satellite" ? 0.45 : 0.25,
        radius: h.radius,
        weight: 2,
      });
      c.bindTooltip(`<b>${h.label}</b><br/>Risk: ${h.risk}%`, { direction: "top" });
      c.addTo(layerGroupRef.current);
    });

    if (activeLayer === "gov") {
      const govMarker = window.L.marker([30.45, 75.85], {
        icon: window.L.divIcon({
          className: "",
          html: '<div style="background:#b91c1c;color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:bold;white-space:nowrap;">🚨 Yellow Alert</div>',
          iconSize: [90, 22],
          iconAnchor: [45, 30],
        }),
      });
      govMarker.addTo(layerGroupRef.current);
    }

    if (activeLayer === "spread") {
      const polyline = window.L.polyline(
        [[30.45, 75.85], [30.35, 76.1], [30.18, 76.15]],
        { color: "#3b82f6", weight: 3, dashArray: "8 6", opacity: 0.8 }
      );
      polyline.bindTooltip("N-E Spore Drift Vector", { sticky: true });
      polyline.addTo(layerGroupRef.current);
    }
  }, [activeLayer]);

  const handleNextSimulation = () => {
    setSimulationStep(prev => (prev + 1) % 4);
  };

  const resetSimulation = () => {
    setSimulationStep(0);
  };

  const getSimulationStepText = () => {
    switch (simulationStep) {
      case 1:
        return "Step 1: Spore spores emerge from primary infection centers. High wind humidity provides optimal spores drift conditions.";
      case 2:
        return "Step 2: Spores disperse towards North-East wind vector corridors. Host crops (Rice) show early microscopic tissue stresses.";
      case 3:
        return "Step 3: Major pathogen manifestation! Yield loss risk escalates to 65% across 4 adjoining village clusters.";
      default:
        return "Initial State: Outbreak isolated in primary block center. Ambient temperature 28°C, humidity 82%.";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Regional Disease Surveillance</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Perform regional disease surveillance, simulate vector spread corridors, and analyze satellite foliage stress layers.
        </p>
      </div>

      {/* Surveillance Stats KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="GIS Max Risk index"
          value="92%"
          trend="Kharindwa"
          trendType="danger"
          subtext="Critical pathogen activity"
          icon={<Map className="text-[#31572c]" />}
        />
        <StatsCard
          title="Satellite Anomalies"
          value="4 Zones"
          trend="Foliage Stress"
          trendType="neutral"
          subtext="Low NDVI index flagged"
          icon={<Eye className="text-[#31572c]" />}
        />
        <StatsCard
          title="Gov Directives"
          value="2 Warnings"
          trend="State Alerts"
          trendType="danger"
          subtext="Yellow rust advisory issued"
          icon={<CloudLightning className="text-[#31572c]" />}
        />
        <StatsCard
          title="Vector Spore Drift"
          value="18 km/h"
          trend="North-East"
          trendType="neutral"
          subtext="Active wind transmission corridor"
          icon={<Wind className="text-[#31572c]" />}
        />
      </div>

      {/* GIS map & Spread Simulation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mock GIS Map Canvas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Map className="w-4 h-4 text-[#31572c]" /> GIS Interactive Surveillance Map
            </h3>
            
            {/* Layer Toggles */}
            <div className="flex gap-1 bg-slate-105 p-1 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setActiveLayer("satellite")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLayer === "satellite" ? "bg-[#31572c] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Satellite NDVI
              </button>
              <button
                onClick={() => setActiveLayer("gov")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLayer === "gov" ? "bg-[#31572c] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Gov Advisories
              </button>
              <button
                onClick={() => setActiveLayer("spread")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLayer === "spread" ? "bg-[#31572c] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Wind Vectors
              </button>
            </div>
          </div>

          {/* Leaflet Satellite Map */}
          <div className="relative rounded-xl overflow-hidden border border-slate-100">
            <div
              ref={mapRef}
              className="w-full h-[340px] bg-slate-800 z-0"
            />
            {/* Floating Legend */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-100 p-2.5 rounded-xl text-[8px] font-bold space-y-1 shadow-sm z-[1000]">
              <span className="text-slate-400 block uppercase">Surveillance Legend</span>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Outbreak Risk &gt; 80%</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate Risk 40-79%</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#22c55e]" /> Healthy / Secured Zone</div>
            </div>
          </div>
        </div>

        {/* Vector Spread Simulation */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> Disease Spread Simulation
            </h3>
            
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-[#31572c] uppercase tracking-wider">Simulation Step</span>
                <span className="text-[10px] font-black text-slate-500">{simulationStep} / 3</span>
              </div>
              <p className="text-[10px] text-slate-605 leading-relaxed font-semibold">
                {getSimulationStepText()}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 pt-4 border-t border-slate-100/60 mt-2">
            <button
              onClick={handleNextSimulation}
              className="flex-1 py-2 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> {simulationStep === 3 ? "Restart" : "Next Step"}
            </button>
            <button
              onClick={resetSimulation}
              className="py-2 px-3 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase flex items-center justify-center cursor-pointer"
              title="Reset Simulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Active Outbreak & Stress Hotspots — Full Width */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-500" /> Active Outbreak & Stress Hotspots
        </h3>
        <GenericTable
          columns={[
            { header: "Village / Location", accessor: "village", className: "font-black text-slate-900" },
            { header: "Target Crop", accessor: "crop" },
            { header: "Risk Score", accessor: "risk" },
            { header: "NDVI Index", accessor: "ndvi" },
            { 
              header: "Surveillance Status", 
              accessor: "status",
              cell: (val) => (
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  val.includes("Critical") ? "bg-red-105 text-red-700" : val.includes("Active") ? "bg-amber-105 text-amber-700" : "bg-blue-105 text-blue-700"
                }`}>
                  {val}
                </span>
              )
            }
          ]}
          data={REGIONAL_HOTSPOTS}
          showSearch={false}
          itemsPerPage={5}
        />
      </div>

      {/* 14-Day Spore Risk Acceleration — Full Width Below Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-[#31572c]" /> 14-Day Spore Risk Acceleration
        </h3>
        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HISTORICAL_RISK_TREND}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
              <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" unit="%" />
              <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '10px', backgroundColor: '#132a13', color: 'white', borderColor: 'transparent' }} />
              <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#riskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
