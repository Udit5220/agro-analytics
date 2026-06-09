// CropRecAdoptionAnalytics.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Send,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Trophy,
  Star,
  Sparkles,
  Loader2,
  Award,
  Map,
  Activity,
  Layers,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts";

// Mock Data
const ADOPTION_BARRIERS = [
  { barrier: "High Seed Costs", value: 45, color: "#dc2626", details: "Farmers hesitant to invest in premium LS-21 soybean seed variants." },
  { barrier: "Water Concerns", value: 38, color: "#ea580c", details: "Fears of insufficient rainfall or tubewell power supply limits." },
  { barrier: "Market Uncertainty", value: 32, color: "#d97706", details: "Lack of guaranteed buyback contracts for alternative crops." },
  { barrier: "Knowledge Gaps", value: 25, color: "#2563eb", details: "Lack of experience in interpreting fertilizer/NPK recommendations." },
  { barrier: "Financial Constraints", value: 20, color: "#7c3aed", details: "Delayed credit clearance from cooperative banks." },
];

const TRAINING_RECOMMENDATIONS = [
  { village: "Lakshmipur", barrier: "High Seed Costs", program: "Subsidized Sowing Inputs Demo", schedule: "Next Tuesday, 10 AM", staff: "Dr. A. Sharma", status: "PLANNED" },
  { village: "Devipur", barrier: "Market Uncertainty", program: "Contract Buyback Alignment Camp", schedule: "Next Friday, 2 PM", staff: "R. Patel", status: "IN PROGRESS" },
  { village: "Anandpur", barrier: "Water Concerns", program: "Micro-Irrigation & Mulching Clinic", schedule: "June 12, 11 AM", staff: "M. Kumar", status: "PLANNED" },
  { village: "Sitapur", barrier: "High Seed Costs", program: "Cooperative Micro-Credit Drive", schedule: "June 15, 9 AM", staff: "S. Varma", status: "PLANNED" },
  { village: "Rampur", barrier: "Water Concerns", program: "Rainwater Harvesting Demo Session", schedule: "Completed", staff: "M. Kumar", status: "COMPLETED" },
  { village: "Chandpur", barrier: "Knowledge Gaps", program: "Smart App Navigation Workshop", schedule: "June 18, 4 PM", staff: "S. Varma", status: "PLANNED" },
];

const VILLAGE_ADOPTION_DATA = [
  { id: "v-1", name: "Govindpur", coordinates: [28.4189, 77.2478], gen: 172, acc: 138, imp: 128, rate: 80.2, barrier: "None", trend: "UP" },
  { id: "v-2", name: "Chandpur", coordinates: [28.3689, 77.2278], gen: 156, acc: 118, imp: 106, rate: 75.6, barrier: "Knowledge Gaps", trend: "UP" },
  { id: "v-3", name: "Rampur", coordinates: [28.3889, 77.2978], gen: 168, acc: 112, imp: 98, rate: 66.7, barrier: "Water Concerns", trend: "UP" },
  { id: "v-4", name: "Krishnapur", coordinates: [28.4789, 77.3578], gen: 148, acc: 98, imp: 86, rate: 66.2, barrier: "Financial Constraints", trend: "UP" },
  { id: "v-5", name: "Sitapur", coordinates: [28.4289, 77.3478], gen: 142, acc: 78, imp: 64, rate: 54.9, barrier: "High Seed Costs", trend: "FLAT" },
  { id: "v-6", name: "Devipur", coordinates: [28.4589, 77.2778], gen: 134, acc: 62, imp: 48, rate: 46.3, barrier: "Market Uncertainty", trend: "DOWN" },
  { id: "v-7", name: "Anandpur", coordinates: [28.4689, 77.3078], gen: 144, acc: 66, imp: 54, rate: 45.8, barrier: "Water Concerns", trend: "FLAT" },
  { id: "v-8", name: "Lakshmipur", coordinates: [28.3489, 77.3178], gen: 128, acc: 52, imp: 38, rate: 40.6, barrier: "High Seed Costs", trend: "DOWN" },
];

const CROP_ADOPTION_DATA = [
  { name: "Maize", adopt: 76, impl: 91, success: 85 },
  { name: "Wheat", adopt: 72, impl: 88, success: 82 },
  { name: "Rice", adopt: 68, impl: 84, success: 78 },
  { name: "Mustard", adopt: 61, impl: 78, success: 74 },
  { name: "Chickpea", adopt: 54, impl: 71, success: 68 },
  { name: "Soybean", adopt: 49, impl: 65, success: 62 },
];

const MONTHLY_ADOPTION_TREND = [
  { name: "Jan", rate: 42, avg: 40 },
  { name: "Feb", rate: 44, avg: 41 },
  { name: "Mar", rate: 47, avg: 43 },
  { name: "Apr", rate: 49, avg: 45 },
  { name: "May", rate: 51, avg: 46 },
  { name: "Jun", rate: 53, avg: 48 },
  { name: "Jul", rate: 54, avg: 49 },
  { name: "Aug", rate: 56, avg: 51 },
  { name: "Sep", rate: 57, avg: 52 },
  { name: "Oct", rate: 58, avg: 53 },
  { name: "Nov", rate: 60, avg: 55 },
  { name: "Dec", rate: 62, avg: 56 },
];

const RADAR_ENGAGEMENT_DATA = [
  { subject: "App Usage", value: 61, fullMark: 100, benchmark: 55 },
  { subject: "Rec Views", value: 79, fullMark: 100, benchmark: 70 },
  { subject: "Implementation", value: 84, fullMark: 100, benchmark: 75 },
  { subject: "Feedback Given", value: 42, fullMark: 100, benchmark: 35 },
  { subject: "Query Rate", value: 38, fullMark: 100, benchmark: 30 },
  { subject: "Profile Completion", value: 71, fullMark: 100, benchmark: 65 },
];

export default function CropRecAdoptionAnalytics() {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("v-1");
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const circlesRef = useRef([]);

  const selectedVillage = useMemo(() => {
    return VILLAGE_ADOPTION_DATA.find((v) => v.id === selectedVillageId) || VILLAGE_ADOPTION_DATA[0];
  }, [selectedVillageId]);

  // Leaflet map injection
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
      script.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;
    let resizeObserver = null;
    const timer = setTimeout(() => {
      if (!mapRef.current) return;
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
      const map = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([28.4089, 77.2978], 11);
      leafletMapInstance.current = map;
      window.L.tileLayer(
        `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
        { attribution: "&copy; MapTiler", maxZoom: 18 }
      ).addTo(map);
      renderMapOverlays();
      map.invalidateSize();

      resizeObserver = new ResizeObserver(() => {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.invalidateSize();
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

  useEffect(() => {
    if (leafletMapInstance.current) renderMapOverlays();
  }, [selectedVillageId]);

  useEffect(() => {
    if (leafletMapInstance.current && selectedVillage) {
      leafletMapInstance.current.setView(selectedVillage.coordinates, 11, {
        animate: true,
      });
    }
  }, [selectedVillageId]);

  const renderMapOverlays = () => {
    if (!leafletMapInstance.current || !window.L) return;
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    VILLAGE_ADOPTION_DATA.forEach((v) => {
      const isSelected = v.id === selectedVillageId;
      const color = v.rate >= 75 ? "#10b981" : v.rate >= 55 ? "#f59e0b" : "#dc2626";
      const circle = window.L.circle(v.coordinates, {
        color: isSelected ? "#3b82f6" : color,
        fillColor: color,
        fillOpacity: isSelected ? 0.75 : 0.45,
        radius: isSelected ? 700 : 500,
        weight: isSelected ? 3 : 1,
      }).addTo(leafletMapInstance.current);

      circle.bindTooltip(
        `<div class="p-2 font-sans text-xs"><b>${v.name}</b><br/>Adoption: ${v.rate}%<br/>Primary Barrier: ${v.barrier}</div>`,
        { direction: "top" }
      );
      circle.on("click", () => setSelectedVillageId(v.id));
      circlesRef.current.push(circle);
    });
  };

  const queryAiInsights = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiReport(`### **AI ADOPTION BEHAVIOR ANALYSIS**

1. **Adoption Barriers Analysis**: In Lakshmipur (40.6% adoption) and Devipur (46.3% adoption), the primary bottlenecks are digital illiteracy (lack of confidence in using the smart recommendations interface) and seed cost thresholds. Farmers are conventional and risk-averse.

2. **Training Opportunities**: FPO extension workers should launch village-level digital training bootcamps. Focused training on interpreting NPK recommendations and pest warning triggers will bridge the 35% agri-skill gap identified in the low-adoption zones.

3. **Behavior Analysis**: Engagement metrics show that villages with a higher density of progressive farming groups (such as Govindpur at 80.2%) act as localized demonstration models. Recommendation views peak on Mondays following weekly weather forecast updates.

4. **Improvement Suggestions**: To push the overall FPO adoption rate from 58.4% to the target 75%, introduce bilingual voice advisories and SMS fallbacks for non-smartphone users. Replicate the Govindpur peer-mentor system in Anandpur.

5. **Village Interventions**: Targeted action plans for the bottom three villages:
   - *Lakshmipur*: Deploy an on-field FPO champion to guide the weekly logs.
   - *Anandpur*: Group orders of recommended seeds at a 15% cooperative discount.
   - *Devipur*: Host physical demonstration trials comparing conventional plots with recommendation-aligned plots.`);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-[#31572c]" />
          <span>Farmer Engagement & Adoption Console</span>
          <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
            | COOPERATIVE ADOPTION MANAGEMENT
          </span>
        </h1>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Monitor farmer adoption statistics · Behavioral barriers · Extension training recommendations
        </p>
      </div>

      {/* SECTION 1 - ADOPTION KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "FPO Member Count", val: "4,250 Farmers", desc: "Total registered cooperative members", icon: <Users size={18} className="text-[#31572c]" /> },
          { title: "Avg FPO Adoption Rate", val: "58.4%", desc: "Average crop recommendation adoption", icon: <TrendingUp size={18} className="text-[#31572c]" />, progress: 58.4 },
          { title: "Sowing Compliance", val: "84.5%", desc: "Implemented recommendations from accepted", icon: <CheckCircle size={18} className="text-emerald-700" />, progress: 84.5 },
          { title: "Training Coverage", val: "42 Sessions", desc: "Village demonstrations conducted YTD", icon: <Award size={18} className="text-amber-600" /> },
        ].map((c, i) => (
          <div key={i} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{c.title}</span>
              <div className="text-lg font-black mt-1 text-gray-900">{c.val}</div>
              <span className="text-[9px] text-gray-500 mt-0.5 block">{c.desc}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              {c.progress !== undefined ? (
                <div className="w-full mr-4">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${c.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <span className="text-[9px] text-gray-400 font-bold">METRIC VALUE</span>
              )}
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2 - ADOPTION BARRIER ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress List of Barriers */}
        <div className="lg:col-span-1 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-black text-gray-900">Farmer Adoption Barriers</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Primary reasons for recommendation rejection
            </p>
          </div>
          <div className="space-y-4">
            {ADOPTION_BARRIERS.map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>{b.barrier}</span>
                  <span style={{ color: b.color }}>{b.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: b.color }}></div>
                </div>
                <p className="text-[9px] text-gray-500">{b.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Recharts Barrier Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900">Adoption Barrier Prevalence Chart</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-4">
              Share of non-adopting farmers listing barrier (%)
            </p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADOPTION_BARRIERS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="barrier" tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip formatter={(v) => `${v}% of Farmers`} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {ADOPTION_BARRIERS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3 - SPATIAL ADOPTION MAP & DRILLDOWN */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <Map className="w-5 h-5 text-[#31572c]" />
              Village Farmer Adoption Map
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Spatial tracking of adoption rates across regional cluster villages
            </p>
          </div>
          
          <select
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="text-xs font-bold bg-gray-50 border rounded-xl px-3 py-1.5"
          >
            {VILLAGE_ADOPTION_DATA.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} (Adoption: {v.rate}%)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              ref={mapRef}
              className="w-full h-[320px] rounded-xl border bg-slate-800 relative"
              style={{ minHeight: "320px" }}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading map...
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-2 text-[9px] font-bold uppercase">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> High (≥75%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Moderate (55-75%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span> Low (&lt;55%)
              </span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Selected Village</span>
              <span className="text-base font-black text-gray-900 mt-1 block">{selectedVillage.name}</span>
              
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-semibold">Adoption Rate:</span>
                  <span className="font-bold text-gray-900">{selectedVillage.rate}%</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-semibold">Recommendations Sown:</span>
                  <span className="font-bold text-gray-900">{selectedVillage.imp} / {selectedVillage.acc}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-semibold">Primary Adoption Barrier:</span>
                  <span className="font-bold text-red-600">{selectedVillage.barrier}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500 font-semibold">Trend Indicator:</span>
                  <span className={`font-bold ${
                    selectedVillage.trend === "UP" ? "text-emerald-700" :
                    selectedVillage.trend === "DOWN" ? "text-red-700" : "text-gray-600"
                  }`}>{selectedVillage.trend}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#31572c]/5 border border-[#31572c]/10 rounded-xl p-3 text-[10px] text-gray-600 leading-relaxed font-semibold mt-3">
              <span className="font-black text-[#31572c] uppercase block">Spatial Action Advice</span>
              {selectedVillage.rate < 55 ? (
                <span>Priority training area! Barriers of <b>{selectedVillage.barrier}</b> are slowing community momentum. Arrange a field visit immediately.</span>
              ) : (
                <span>Healthy cluster behavior. Peer network is actively driving crop recommendations. Sowing rates remain stable.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 - VILLAGE TRAINING RECOMMENDATION ENGINE */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-gray-900">Village Training Recommendation Engine</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            Intervention training calendar mapping localized barrier solutions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th className="py-2.5 px-3">Target Village</th>
                <th className="py-2.5 px-3">Addressed Barrier</th>
                <th className="py-2.5 px-3">Recommended Program / Initiative</th>
                <th className="py-2.5 px-3">Schedule / Timeline</th>
                <th className="py-2.5 px-3">Assigned Specialist</th>
                <th className="py-2.5 px-3">Intervention Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 font-semibold">
              {TRAINING_RECOMMENDATIONS.map((r, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{r.village}</td>
                  <td className="py-3 px-3 font-medium text-red-600">{r.barrier}</td>
                  <td className="py-3 px-3 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-[#31572c]" />
                    <span>{r.program}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-500 font-mono">{r.schedule}</td>
                  <td className="py-3 px-3 text-gray-600">{r.staff}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      r.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      r.status === "IN PROGRESS" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-blue-55 text-blue-700 border border-blue-100"
                    }`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5 - CROP-WISE ADOPTION TELEMETRY */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Crop Adoption Success Metrics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 border rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Crop Sowing Sourcing Compliance (%)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CROP_ADOPTION_DATA} layout="vertical" margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={9} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} />
                  <RechartsTooltip />
                  <Bar dataKey="adopt" name="Adoption Rate (%)" radius={[0, 4, 4, 0]} fill="#31572c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 p-4 border rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Monthly Sowing Trends (YTD)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_ADOPTION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} domain={[0, 100]} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="rate" name="Adoption Rate (%)" stroke="#31572c" strokeWidth={2} dot={true} />
                  <Line type="monotone" dataKey="avg" name="Moving Average" stroke="#90a955" strokeWidth={1.5} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 - AI BEHAVIORAL ANALYTICS */}
      <div className="bg-[#4f772d]/5 border border-[#31572c]/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#31572c] to-[#4f772d] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">AI Adoption Intelligence</h2>
          </div>
          <button
            onClick={queryAiInsights}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition disabled:opacity-50 text-xs font-black"
          >
            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            <span>Generate Behavior Report</span>
          </button>
        </div>

        {aiLoading && (
          <div className="p-12 text-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#31572c] mb-2" />
            <p className="text-xs font-bold text-gray-800">Consulting AI Behavioral Analyst...</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Analyzing community barriers, credit flows, and demo schedules</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="p-6 bg-white space-y-4">
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
              else if (cleaned.startsWith("3")) borderColor = "border-l-emerald-600";
              else if (cleaned.startsWith("4")) borderColor = "border-l-amber-500";
              else if (cleaned.startsWith("5")) borderColor = "border-l-blue-500";

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
            <p className="text-xs font-bold text-gray-600">Click "Generate Behavior Report" to run AI recommendations</p>
          </div>
        )}
      </div>

    </div>
  );
}
