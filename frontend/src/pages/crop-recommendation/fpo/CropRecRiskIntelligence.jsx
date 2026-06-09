// CropRecRiskIntelligence.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ShieldAlert,
  CloudLightning,
  Bug,
  Droplet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Bell,
  Activity,
  Sparkles,
  Loader2,
  CheckCircle,
  Package,
  Truck,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ComposedChart,
  ReferenceLine,
  Cell,
} from "recharts";
import seededData from "../../../seed-json/seededData.json";

const {
  temperatureForecast: TEMPERATURE_FORECAST,
  activeDiseases: ACTIVE_DISEASES,
  activePests: ACTIVE_PESTS,
  waterRiskMonthlyData: WATER_RISK_DATA,
  highRiskRegions: HIGH_RISK_REGIONS,
  riskTrends: RISK_TRENDS,
  villagesRiskMap: VILLAGES_RISK_MAP
} = seededData.cropRecommendation1.fpo;

export default function CropRecRiskIntelligence() {
  const [layers, setLayers] = useState({
    climate: true,
    water: true,
    buyer: true,
    storage: false,
    input: true,
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapCircles = useRef([]);

  // Leaflet Dynamic Loader
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const checkLeaflet = () => {
      if (window.L) {
        setMapLoaded(true);
        return true;
      }
      return false;
    };

    if (checkLeaflet()) return;

    let script = document.getElementById("leaflet-js");
    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      if (window.L) setMapLoaded(true);
    };
    script.addEventListener("load", handleLoad);
    const interval = setInterval(() => {
      if (checkLeaflet()) clearInterval(interval);
    }, 100);
    return () => {
      if (script) script.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, []);

  // Map Initialization
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;
    let resizeObserver = null;
    const timer = setTimeout(() => {
      if (!mapRef.current) return;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const map = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([28.4089, 77.2978], 11);
      
      mapInstance.current = map;
      
      window.L.tileLayer(
        `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
        {
          attribution: '&copy; MapTiler',
          maxZoom: 18,
        }
      ).addTo(map);

      renderHeatmapCircles();
      map.invalidateSize();

      resizeObserver = new ResizeObserver(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapRef.current);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [mapLoaded]);

  // Re-draw circles when active layers toggle
  useEffect(() => {
    if (mapInstance.current) renderHeatmapCircles();
  }, [layers, mapLoaded]);

  const renderHeatmapCircles = () => {
    if (!mapInstance.current || !window.L) return;

    // Clear previous shapes
    mapCircles.current.forEach((c) => c.remove());
    mapCircles.current = [];

    const L = window.L;
    const map = mapInstance.current;

    const getColor = (score) => {
      if (score > 75) return "#ef4444"; // red
      if (score > 60) return "#f97316"; // orange
      if (score > 40) return "#f59e0b"; // amber
      return "#10b981"; // green
    };

    VILLAGES_RISK_MAP.forEach((v) => {
      const activeScores = [];
      
      if (layers.climate) activeScores.push({ val: v.climate, color: getColor(v.climate), name: "Climate Risk" });
      if (layers.water) activeScores.push({ val: v.water, color: "#0ea5e9", name: "Water Stress" });
      if (layers.buyer) activeScores.push({ val: v.buyer, color: "#10b981", name: "Buyer Default Risk" });
      if (layers.storage) activeScores.push({ val: v.storage, color: "#a855f7", name: "Storage Overflow Risk" });
      if (layers.input) activeScores.push({ val: v.input, color: "#e11d48", name: "Input Shortage Risk" });

      activeScores.forEach((layerData, idx) => {
        const radius = layerData.val / 5;
        // Shift latitude slightly to allow multiple layers of circles around a single village coordinates
        const latOffset = (idx - activeScores.length / 2) * 0.003;
        const coords = [v.coords[0] + latOffset, v.coords[1]];
        
        const circle = L.circle(coords, {
          radius: radius * 120, // scale for zoom level 11
          fillColor: layerData.color,
          color: layerData.val > 75 ? "#ef4444" : "#1e293b",
          weight: layerData.val > 75 ? 2 : 1,
          fillOpacity: 0.5,
        }).addTo(map);

        circle.bindPopup(`
          <div style="color: #1e293b; font-family: sans-serif; font-size: 11px;">
            <h4 style="margin: 0; font-weight: bold;">${v.name}</h4>
            <p style="margin: 4px 0 0;"><b>${layerData.name}:</b> <span style="color:${layerData.color}; font-weight:bold">${layerData.val}/100</span></p>
            <p style="margin: 2px 0 0; color:#64748b;">Soil & Sowing Risk Indicator</p>
          </div>
        `);
        
        mapCircles.current.push(circle);
      });
    });
  };

  const toggleLayer = (type) => {
    setLayers((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const queryAiInsights = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiReport(`### **AI RISK INTEGRATION INTELLIGENCE**

1. **Buyer & Offtake Contract Risk**: In Devipur, buyer default vulnerability has risen to **60/100** due to local trader solvency shifts. ITC and Cargill forward contract guarantees cover 55% of overall FPO acreage, but open-market spot components in Lakshmipur face buying delays.

2. **Storage & Post-Harvest Risk**: FPO storage loading is projected to peak at **88% capacity** in August. Lack of refrigerated/cold-room storage for oilseeds in Sitapur (risk score 55/100) exposes the crop to moisture damage if monsoon rains extend.

3. **Input Availability Risk**: Seed logistical delays in Lakshmipur (input availability threat at **82/100**) are delaying sowed acreages. High seed costs are preventing 45% of farmers from buying recommendations.

4. **Actionable Directives**:
   - Secure seed delivery buffer inventory from the Faridabad central warehouse immediately.
   - Negotiate a cold storage lease extension with Haryana Agri-Logistics for Sitapur.
   - Redirect Devipur Soybean volumes under forward contract linkage terms to guarantee payout.`);
      setAiLoading(false);
    }, 1500);
  };

  const formattedTrends = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, i) => ({
      name: m,
      climate: RISK_TRENDS.climate[i],
      water: RISK_TRENDS.water[i],
      buyer: RISK_TRENDS.buyer[i],
      storage: RISK_TRENDS.storage[i],
      input: RISK_TRENDS.input[i],
    }));
  }, []);

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-[#ef4444]" />
          <span>FPO Risk Intelligence & Early Warning Center</span>
          <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
            | RISK MONITORING CONSOLE
          </span>
        </h1>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Monitor agribusiness business threats · Buyer contracts · Storage overflow risks · Input buffer availability
        </p>
      </div>

      {/* SECTION 1 - RISK KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Aggregated Risk Index", val: "64/100", label: "MODERATE RISK", color: "orange", icon: <ShieldAlert size={16} />, class: "border-amber-300" },
          { title: "Climate & Drought Risk", val: "74/100", label: "HIGH RISK", color: "orange", icon: <CloudLightning size={16} />, class: "border-orange-300 shadow-[0_2px_10px_rgba(249,115,22,0.08)]" },
          { title: "Water Stress level", val: "71/100", label: "HIGH RISK", color: "orange", icon: <Droplet size={16} />, class: "border-orange-300 shadow-[0_2px_10px_rgba(249,115,22,0.08)]" },
          { title: "Buyer Contract Risk", val: "48/100", label: "MEDIUM RISK", color: "amber", icon: <Users size={16} />, class: "border-amber-200" },
          { title: "Storage Overflow Risk", val: "52/100", label: "MEDIUM RISK", color: "amber", icon: <Package size={16} />, class: "border-amber-200" },
          { title: "Input Availability Risk", val: "65/100", label: "HIGH WARNING", color: "orange", icon: <Truck size={16} />, class: "border-orange-300" },
          { title: "High Risk Villages", val: "6 Zones", label: "AT RISK", color: "red", icon: <AlertTriangle size={16} />, class: "border-red-300 shadow-[0_2px_10px_rgba(239,68,68,0.1)]" },
          { title: "Active Alerts", val: "14 Alerts", label: "ACTIVE NOW", color: "red", icon: <Bell size={16} />, class: "border-red-300" },
        ].map((c, i) => (
          <div key={i} className={`bg-white border rounded-2xl p-4 flex flex-col justify-between min-h-[110px] ${c.class}`}>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{c.title}</span>
              <div className="text-xl font-extrabold mt-1 text-gray-900">{c.val}</div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                c.color === "red" ? "bg-red-50 text-red-700 border border-red-100" :
                c.color === "orange" ? "bg-orange-50 text-orange-850 border border-orange-200" :
                c.color === "amber" ? "bg-amber-50 text-amber-900 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}>{c.label}</span>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2 - RISK HEATMAP MAP */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-sm font-black text-gray-900">Cooperative Spatial Risk Layer Map</h2>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">Toggle risk layers to view spatial alert coordinates</p>
          </div>
          
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            {[
              { id: "climate", label: "Climate", color: "text-orange-600" },
              { id: "water", label: "Water Stress", color: "text-blue-600" },
              { id: "buyer", label: "Buyer Risk", color: "text-emerald-700" },
              { id: "storage", label: "Storage Risk", color: "text-purple-600" },
              { id: "input", label: "Input Shortage", color: "text-rose-600" },
            ].map((layer) => (
              <label key={layer.id} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={layers[layer.id]}
                  onChange={() => toggleLayer(layer.id)}
                  className="rounded text-red-650 accent-[#31572c] h-3 w-3"
                />
                <span className={layer.color}>{layer.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div
          ref={mapRef}
          className="w-full h-[380px] rounded-xl border bg-gray-100 border-gray-200/60 relative z-0"
          style={{ minHeight: "380px" }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-gray-805 rounded-xl">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading risk coordinates...
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 - RISK TREND ANALYSIS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Risk Factor Trend Analysis (12 Months)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: "Climate Risk Trend", key: "climate", color: "#f97316", status: "HIGH ↑", textStyle: "text-red-700" },
            { title: "Water Stress Trend", key: "water", color: "#0ea5e9", status: "WORSENING ↑", textStyle: "text-red-700" },
            { title: "Buyer Def. Risk Trend", key: "buyer", color: "#10b981", status: "STABLE →", textStyle: "text-gray-500" },
            { title: "Storage Risk Trend", key: "storage", color: "#a855f7", status: "SEASONAL PEAK ↑", textStyle: "text-orange-600" },
            { title: "Input Shortage Trend", key: "input", color: "#e11d48", status: "HIGH DELAYS ↑", textStyle: "text-red-700" },
          ].map((chart, idx) => (
            <div key={idx} className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl flex flex-col justify-between h-[230px]">
              <div>
                <h4 className="text-[10px] font-bold text-gray-700">{chart.title}</h4>
                <span className={`text-[9px] font-black uppercase ${chart.textStyle}`}>{chart.status}</span>
              </div>

              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedTrends}>
                    <XAxis dataKey="name" stroke="#cbd5e1" fontSize={8} tickLine={false} />
                    <YAxis stroke="#cbd5e1" fontSize={8} domain={[0, 100]} tickLine={false} />
                    <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={1.5} dot={false} />
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 - HIGH RISK REGIONS TABLE & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Center */}
        <div className="lg:col-span-1 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Early Warning Alerts
          </h2>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {[
              { type: "CRITICAL", title: "Lakshmipur: Seed Delay", desc: "Soybean seeds delayed 8 days. Mandi window closes soon.", border: "border-l-red-500 bg-red-50/30" },
              { type: "CRITICAL", title: "Anandpur: Extreme Drought", desc: "No rainfall expected for 14 days. Water index is 86.", border: "border-l-red-500 bg-red-50/30" },
              { type: "WARNING", title: "Sitapur: Storage Load", desc: "Warehouse at 85% capacity. Risk of outdoor spoilage.", border: "border-l-orange-500 bg-orange-50/20" },
              { type: "WARNING", title: "Devipur: Buyer Contract Delay", desc: "Local buyer trading licenses suspended. Secure ITC contract.", border: "border-l-orange-500 bg-orange-50/20" },
            ].map((alert, i) => (
              <div key={i} className={`p-3 border-l-4 rounded-xl border border-gray-150 ${alert.border} text-xs font-semibold`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900">{alert.title}</span>
                  <span className="text-[8px] font-black">{alert.type}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{alert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Regions Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900">Priority Regional Intervention Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400">
                  <th className="py-2.5 px-3">Village Zone</th>
                  <th className="py-2.5 px-3">Primary Threat</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Crop Impact</th>
                  <th className="py-2.5 px-3">Action Required</th>
                  <th className="py-2.5 px-3">Intervention</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 font-semibold">
                {HIGH_RISK_REGIONS.map((row, idx) => {
                  const isCritical = row.severity === "CRITICAL";
                  const isHigh = row.severity === "HIGH";
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-3 font-bold text-gray-900">{row.name}</td>
                      <td className="py-3 px-3 text-gray-700">{row.type}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                          isCritical ? "bg-red-50 text-red-700 border border-red-100" :
                          isHigh ? "bg-orange-50 text-orange-850 border border-orange-200" : "bg-amber-50 text-amber-900 border border-amber-200"
                        }`}>{row.severity}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{row.crop}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#ef4444]">{row.prio} - IMMEDIATE</td>
                      <td className="py-3 px-3">
                        <button className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition ${
                          isCritical ? "bg-red-600 hover:bg-red-700 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                        }`}>
                          {isCritical ? "Dispatch Help" : "Investigate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 5 - CLIMATE VS WATER COMPOSED DETAILS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Hydro-Meterological Sowing Corroboration</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 border rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">90-Day Temperature Forecast vs Rainfall Telemetry</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={TEMPERATURE_FORECAST}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={9} />
                  <RechartsTooltip />
                  <Bar yAxisId="left" dataKey="rain" name="Rainfall (mm)" fill="#0ea5e9" opacity={0.3} />
                  <Line yAxisId="left" type="monotone" dataKey="temp7" name="Forecast Temp" stroke="#f97316" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Pest & Disease Host Outbreak Distribution</h3>
            <div className="space-y-4 pt-2">
              {ACTIVE_PESTS.slice(0, 3).map((p, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{p.pest} ({p.crops})</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{p.villages} affected</span>
                  </div>
                  <span className="font-bold text-amber-700">₹{p.loss} Lakh risk exposure</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 - AI RISK INTELLIGENCE REPORT */}
      <div className="bg-[#4f772d]/5 border border-[#31572c]/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#31572c] to-[#4f772d] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">AI Risk Intelligence Report</h2>
          </div>
          <button
            onClick={queryAiInsights}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition disabled:opacity-50 text-xs font-black"
          >
            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            <span>Generate Risk Report</span>
          </button>
        </div>

        {aiLoading && (
          <div className="p-12 text-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#31572c] mb-2" />
            <p className="text-xs font-bold text-gray-800">Consulting AI Risk Analyst...</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Analyzing climate variables, storage capacity thresholds, and buyer default risks</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 rounded px-2.5 py-1 text-[9px] font-black uppercase w-max">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Risk Mitigation Directive Active</span>
            </div>

            {aiReport.split("\n\n").filter(Boolean).map((para, idx) => {
              const cleaned = para.replace(/[#*]/g, "").trim();
              const isHeading = para.startsWith("#") || (para.startsWith("**") && para.endsWith("**"));

              if (isHeading) {
                return (
                  <h4 key={idx} className="text-xs font-black text-[#31572c] uppercase tracking-wider mt-4 first:mt-0">
                    {cleaned}
                  </h4>
                );
              }

              let borderColor = "border-l-emerald-600";
              if (cleaned.startsWith("1")) borderColor = "border-l-red-500";
              else if (cleaned.startsWith("2")) borderColor = "border-l-orange-500";
              else if (cleaned.startsWith("3")) borderColor = "border-l-amber-500";
              else if (cleaned.startsWith("4")) borderColor = "border-l-red-500";

              return (
                <div key={idx} className={`pl-3.5 border-l-4 ${borderColor} py-1.5 text-xs font-semibold leading-relaxed text-gray-700`}>
                  {cleaned}
                </div>
              );
            })}
          </div>
        )}

        {!aiReport && !aiLoading && (
          <div className="p-12 text-center text-gray-500 bg-white">
            <Sparkles className="w-6 h-6 text-[#31572c] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-gray-600">Click "Generate Report" to run AI recommendations</p>
          </div>
        )}
      </div>

    </div>
  );
}
