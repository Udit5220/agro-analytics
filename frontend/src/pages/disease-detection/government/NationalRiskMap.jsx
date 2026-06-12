import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Activity,
  Flame,
  Bell,
  ShieldAlert,
  Layers,
  MapPin,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Map as MapIcon,
  Download,
  Clock,
  Compass,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip
} from "recharts";

// ------------------------------------------------------------------
// MOCK DATA (GIS intelligence - India national scale)
// ------------------------------------------------------------------

const RISK_ZONE_STATS = {
  safe: 312,
  moderate: 184,
  high: 98,
  critical: 43
};

const HIGH_RISK_STATES = [
  { rank: 1, name: "Uttar Pradesh", score: 94, barWidth: "94%" },
  { rank: 2, name: "Punjab", score: 91, barWidth: "91%" },
  { rank: 3, name: "Odisha", score: 87, barWidth: "87%" },
  { rank: 4, name: "Maharashtra", score: 83, barWidth: "83%" },
  { rank: 5, name: "Andhra Pradesh", score: 79, barWidth: "79%" }
];

const HIGH_RISK_DISTRICTS = [
  { name: "Ludhiana", state: "Punjab", severity: "Critical" },
  { name: "Gorakhpur", state: "UP", severity: "Critical" },
  { name: "Cuttack", state: "Odisha", severity: "High" },
  { name: "Nagpur", state: "Maharashtra", severity: "High" },
  { name: "Mandya", state: "Karnataka", severity: "High" },
  { name: "Patna", state: "Bihar", severity: "Moderate" },
  { name: "Indore", state: "MP", severity: "Moderate" },
  { name: "Jaipur", state: "Rajasthan", severity: "Moderate" },
  { name: "Ambala", state: "Haryana", severity: "High" },
  { name: "Hooghly", state: "WB", severity: "Moderate" }
];

const EMERGING_HOTSPOTS = [
  { district: "Amritsar", state: "Punjab", disease: "Rice Blast", trend: "up", delta: "+18%" },
  { district: "Baleswar", state: "Odisha", disease: "BPH", trend: "up", delta: "+15%" },
  { district: "Rohtas", state: "Bihar", disease: "Yellow Mosaic", trend: "up", delta: "+12%" },
  { district: "Nadia", state: "WB", disease: "Late Blight", trend: "down", delta: "-4%" },
  { district: "Guntur", state: "AP", disease: "BPH", trend: "stable", delta: "0%" }
];

const MAP_LAYERS = [
  { id: "disease_hotspots", label: "Disease Hotspots", color: "#e74c3c" },
  { id: "weather_risk", label: "Weather Risk", color: "#f39c12" },
  { id: "satellite_stress", label: "Satellite Stress", color: "#90a955" },
  { id: "farmer_reports", label: "Farmer Reports", color: "#4f772d" },
  { id: "govt_reports", label: "Government Reports", color: "#ecf39e" },
  { id: "historical_outbreaks", label: "Historical Outbreaks", color: "#132a13" },
  { id: "forecasted_outbreaks", label: "Forecasted Outbreaks", color: "#dc2626" }
];

const SPREAD_SIMULATION = {
  "3D": { spreadArea: "42,000 Ha", newDistricts: 3, primaryDisease: "Rice Blast", progression: [10, 22, 42] },
  "7D": { spreadArea: "84,000 Ha", newDistricts: 7, primaryDisease: "Rice Blast", progression: [10, 22, 42, 60, 84] },
  "14D": { spreadArea: "1,56,000 Ha", newDistricts: 14, primaryDisease: "BPH", progression: [10, 22, 42, 60, 84, 110, 156] },
  "30D": { spreadArea: "3,20,000 Ha", newDistricts: 28, primaryDisease: "BPH", progression: [10, 22, 42, 60, 84, 110, 156, 210, 320] }
};

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
          {title}
        </h1>
        <span className="text-xs font-black text-[#31572c] uppercase font-mono tracking-wider pl-3 ml-3 border-l-2 border-gray-300">
          {subtitle}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Secure Govt Network
        </span>
      </div>
    </div>
  );
};

export default function NationalRiskMap() {
  const [activeLayers, setActiveLayers] = useState({
    disease_hotspots: true,
    weather_risk: true,
    satellite_stress: false,
    farmer_reports: true,
    govt_reports: true,
    historical_outbreaks: false,
    forecasted_outbreaks: true
  });
  const [simHorizon, setSimHorizon] = useState("7D");

  // Toggle sidebars state
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const toggleLayer = (layerId) => {
    setActiveLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  // Map initialization
  useEffect(() => {
    if (!mapContainerRef.current || !window.L || mapInstanceRef.current) return;

    const map = window.L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([20.5937, 78.9629], 5);

    mapInstanceRef.current = map;

    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
      {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        maxZoom: 18
      }
    ).addTo(map);

    const lg = window.L.layerGroup().addTo(map);
    layerGroupRef.current = lg;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapContainerRef.current);

    return () => {
      observer.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !window.L) return;
    layerGroupRef.current.clearLayers();

    const layerFeatures = {
      disease_hotspots: [
        { name: "Ludhiana", state: "Punjab", label: "Rice Blast", val: "Critical (Score: 96)", coords: [30.901, 75.8573], color: "#e74c3c" },
        { name: "Gorakhpur", state: "UP", label: "BPH", val: "Critical (Score: 94)", coords: [26.7606, 83.3732], color: "#e74c3c" }
      ],
      weather_risk: [
        { name: "Nagpur", state: "Maharashtra", label: "Leaf Rust Risk", val: "High humidity risk", coords: [21.1458, 79.0882], color: "#f39c12" },
        { name: "Indore", state: "MP", label: "Wheat Rust Risk", val: "Thermal index alarm", coords: [22.7196, 75.8577], color: "#f39c12" }
      ],
      satellite_stress: [
        { name: "Cuttack", state: "Odisha", label: "Chlorophyll Deficit", val: "NDVI Index: 0.38", coords: [20.4625, 85.883], color: "#90a955" },
        { name: "Mandya", state: "Karnataka", label: "Canopy Stress", val: "High water stress", coords: [12.5218, 76.8973], color: "#90a955" }
      ],
      farmer_reports: [
        { name: "Bathinda", state: "Punjab", label: "Farmer Spore Alert", val: "5 active reports", coords: [30.211, 74.945], color: "#4f772d" },
        { name: "Guntur", state: "AP", label: "Farmer BPH Alert", val: "12 active reports", coords: [16.3067, 80.4365], color: "#4f772d" }
      ],
      govt_reports: [
        { name: "Rohtas", state: "Bihar", label: "Advisory Confirm", val: "Yellow Mosaic confirmed", coords: [24.964, 84.015], color: "#ecf39e" },
        { name: "Nadia", state: "WB", label: "District Squad", val: "Blight quarantine recommended", coords: [23.476, 88.563], color: "#ecf39e" }
      ],
      historical_outbreaks: [
        { name: "Amritsar", state: "Punjab", label: "Blast Outbreak (2024)", val: "Acreage affected: 24k Ha", coords: [31.634, 74.872], color: "#132a13" },
        { name: "Baleswar", state: "Odisha", label: "BPH Outbreak (2023)", val: "Acreage affected: 18k Ha", coords: [21.493, 86.933], color: "#132a13" }
      ],
      forecasted_outbreaks: [
        { name: "Patna", state: "Bihar", label: "Forecasted Outbreak", val: "85% Probability in Kharif", coords: [25.5941, 85.1376], color: "#dc2626" },
        { name: "Jaipur", state: "Rajasthan", label: "Forecasted Mildew", val: "60% Probability in Rabi", coords: [26.9124, 75.7873], color: "#dc2626" }
      ]
    };

    Object.keys(activeLayers).forEach((layerId) => {
      if (activeLayers[layerId] && layerFeatures[layerId]) {
        layerFeatures[layerId].forEach((feat) => {
          const circle = window.L.circle(feat.coords, {
            color: feat.color,
            fillColor: feat.color,
            fillOpacity: 0.45,
            radius: 35000,
            weight: 2
          });
          circle.bindTooltip(
            `<b>${feat.name}, ${feat.state}</b><br/>Type: ${feat.label}<br/>Status: ${feat.val}`,
            { direction: "top" }
          );
          circle.addTo(layerGroupRef.current);
        });
      }
    });
  }, [activeLayers]);

  const currentSim = SPREAD_SIMULATION[simHorizon];
  const chartData = currentSim.progression.map((val, idx) => ({ day: `Step ${idx + 1}`, value: val }));

  const getSeverityBadge = (severity) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-200",
      Moderate: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${styles[severity] || styles.Low}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-1 pb-10">
      <Header title="National Risk Map" subtitle="राष्ट्रीय जोखिम मानचित्र" />

      {/* Side-by-side Layout with reduced height h-[550px] */}
      <div className="h-[550px] flex overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-md transition-all">
        {/* Left panel (Map Layers) */}
        <aside className={`bg-white transition-all duration-300 overflow-y-auto shrink-0 flex flex-col justify-between ${
          isLeftOpen ? "w-64 p-4 border-r border-gray-150" : "w-0 p-0 overflow-hidden border-r-0"
        }`}>
          {isLeftOpen && (
            <>
              <div>
                <div className="flex items-center gap-1.5 mb-4 border-b pb-2">
                  <Layers size={14} className="text-[#31572c]" />
                  <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Map Layers</h2>
                </div>
                <div className="space-y-1.5">
                  {MAP_LAYERS.map((layer) => (
                    <label key={layer.id} className="flex items-center justify-between cursor-pointer group p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: layer.color }} />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{layer.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeLayers[layer.id]}
                        onChange={() => toggleLayer(layer.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#31572c] focus:ring-[#31572c] cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <MapIcon size={14} className="text-[#31572c]" />
                  <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Risk Zone Legend</h2>
                </div>
                <div className="space-y-2.5 mt-1">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-55/40 border border-emerald-100/50">
                    <span className="flex items-center gap-2 font-bold text-emerald-800 text-xs"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />Safe</span>
                    <span className="font-mono text-emerald-950 font-black text-xs">{RISK_ZONE_STATS.safe} districts</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-yellow-55/40 border border-yellow-100/50">
                    <span className="flex items-center gap-2 font-bold text-yellow-800 text-xs"><span className="h-2 w-2 rounded-full bg-[#ecf39e]" />Moderate</span>
                    <span className="font-mono text-yellow-950 font-black text-xs">{RISK_ZONE_STATS.moderate} districts</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-orange-55/40 border border-orange-100/50">
                    <span className="flex items-center gap-2 font-bold text-orange-800 text-xs"><span className="h-2 w-2 rounded-full bg-[#f39c12]" />High</span>
                    <span className="font-mono text-orange-950 font-black text-xs">{RISK_ZONE_STATS.high} districts</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-red-55/40 border border-red-100/50">
                    <span className="flex items-center gap-2 font-bold text-red-800 text-xs"><span className="h-2 w-2 rounded-full bg-[#e74c3c]" />Critical</span>
                    <span className="font-mono text-red-950 font-black text-xs">{RISK_ZONE_STATS.critical} districts</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Center: Map area */}
        <main className="flex-1 bg-gray-100 relative h-full flex flex-col justify-end">
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-gray-200" />
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50 flex items-center gap-2 text-xs font-black text-gray-900 tracking-wide uppercase">
            <Compass size={14} className="text-[#31572c] animate-spin" />
            Live GIS Satellite Outlays Active
          </div>

          {/* Sidebar Toggle Buttons at the bottom of the map */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-3">
            <button
              onClick={() => setIsLeftOpen(!isLeftOpen)}
              className="px-4 py-2 bg-[#132a13] text-[#ecf39e] hover:bg-brand-dark font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95 border border-[#ecf39e]/20 cursor-pointer"
            >
              {isLeftOpen ? "Hide Map Layers" : "Show Map Layers"}
            </button>
            <button
              onClick={() => setIsRightOpen(!isRightOpen)}
              className="px-4 py-2 bg-[#132a13] text-[#ecf39e] hover:bg-brand-dark font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95 border border-[#ecf39e]/20 cursor-pointer"
            >
              {isRightOpen ? "Hide Disease Spread Simulation" : "Show Disease Spread Simulation"}
            </button>
          </div>
        </main>

        {/* Right panel (Simulation & Heatmaps) */}
        <aside className={`bg-white transition-all duration-300 overflow-y-auto shrink-0 flex flex-col gap-5 ${
          isRightOpen ? "w-80 p-4 border-l border-gray-150" : "w-0 p-0 overflow-hidden border-l-0"
        }`}>
          {isRightOpen && (
            <>
              <div>
                <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Disease Spread Simulation</h2>
                <div className="flex bg-gray-100/80 border border-gray-200/40 p-1 rounded-xl text-xs font-bold text-gray-600 mb-3">
                  {["3D", "7D", "14D", "30D"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSimHorizon(tab)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-wider transition ${
                        simHorizon === tab ? "bg-brand-dark text-[#ecf39e] shadow-sm font-extrabold" : "hover:text-[#31572c] hover:bg-white/50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="space-y-2.5 bg-gradient-to-br from-gray-55 to-white p-3.5 rounded-2xl border border-gray-100 shadow-xs mb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">Spread Area:</span>
                    <span className="font-black text-gray-950">{currentSim.spreadArea}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">New Districts:</span>
                    <span className="font-black text-gray-950 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {currentSim.newDistricts} affected
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">Primary Vector:</span>
                    <span className="bg-brand-dark/10 text-[#31572c] px-2.5 py-0.5 rounded-md font-black text-[10px]">{currentSim.primaryDisease}</span>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip contentStyle={{ display: "none" }} />
                      <Bar dataKey="value" fill="#4f772d" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Flame size={14} className="text-[#31572c]" />
                  <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Heatmap Analytics</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">High Risk States</p>
                    <div className="space-y-3">
                      {HIGH_RISK_STATES.map((st) => (
                        <div key={st.rank} className="space-y-1 p-1.5 rounded-lg hover:bg-gray-50 transition">
                          <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span>{st.name}</span>
                            <span className="font-mono text-[#31572c] font-black">{st.score}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4f772d] to-[#31572c] h-full rounded-full" style={{ width: st.barWidth }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Emerging Hotspots</p>
                    <div className="space-y-2">
                      {EMERGING_HOTSPOTS.map((hot, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-gray-50/50 border border-gray-100/55 hover:bg-gray-50 transition">
                          <div>
                            <span className="text-xs font-bold text-gray-800">{hot.district}</span>
                            <span className="text-[10px] text-gray-400 font-bold ml-1.5 uppercase font-mono">{hot.state}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-red-700 bg-red-50 border border-red-100/60 px-2 py-0.5 rounded-md uppercase">{hot.disease}</span>
                            <span className={`flex items-center font-mono font-black text-[10px] ${hot.trend === "up" ? "text-red-600" : hot.trend === "down" ? "text-emerald-600" : "text-gray-400"}`}>
                              {hot.trend === "up" ? <TrendingUp size={11} className="mr-0.5" /> : hot.trend === "down" ? <TrendingDown size={11} className="mr-0.5" /> : null}
                              {hot.delta}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
