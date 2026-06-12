import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CircleDollarSign,
  Activity,
  FolderKanban,
  Warehouse,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Map,
  MapPin,
  ChevronRight,
  Plus,
  CheckCircle2,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";

export default function GovCommandCenter() {
  const [activeLayer, setActiveLayer] = useState("coverage"); // coverage, budget, fpos, infrastructure
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [activeTab, setActiveTab] = useState("infrastructure");
  const [coords, setCoords] = useState({ lat: "29.0583", lng: "76.9248" });

  // Mock data for heat map districts
  const districts = [
    {
      id: "hry-01",
      name: "Sonipat",
      coverage: "84%",
      budget: "₹72.8 Cr",
      fpos: "12 Active",
      infra: "45 Units",
      colorMap: {
        coverage: "bg-brand-darkest",
        budget: "bg-brand-dark",
        fpos: "bg-brand-medium",
        infra: "bg-[#2ec4b6]",
      },
      fillMap: {
        coverage: "var(--brand-darkest)",
        budget: "var(--brand-dark)",
        fpos: "var(--brand-medium)",
        infra: "#2ec4b6",
      },
      path: "M 230,190 L 340,200 L 310,280 L 210,270 Z",
      centroid: { x: 272, y: 235 },
      lat: "28.9931",
      lng: "77.0192",
      text: "Excellent PMFBY and KCC scheme adoption. Top ROI in warehouse setups.",
    },
    {
      id: "hry-02",
      name: "Rohtak",
      coverage: "71%",
      budget: "₹48.2 Cr",
      fpos: "8 Active",
      infra: "28 Units",
      colorMap: {
        coverage: "bg-brand-dark",
        budget: "bg-brand-medium",
        fpos: "bg-[#2ec4b6]",
        infra: "bg-brand-medium",
      },
      fillMap: {
        coverage: "var(--brand-dark)",
        budget: "var(--brand-medium)",
        fpos: "#2ec4b6",
        infra: "var(--brand-medium)",
      },
      path: "M 120,130 L 250,120 L 230,190 L 210,270 L 110,230 Z",
      centroid: { x: 180, y: 185 },
      lat: "28.8969",
      lng: "76.6001",
      text: "Moderate scheme penetration. High requirement for cold chain links.",
    },
    {
      id: "hry-03",
      name: "Jhajjar",
      coverage: "58%",
      budget: "₹31.5 Cr",
      fpos: "5 Active",
      infra: "12 Units",
      colorMap: {
        coverage: "bg-brand-medium",
        budget: "bg-[#2ec4b6]",
        fpos: "bg-amber-600/70",
        infra: "bg-[#2ec4b6]",
      },
      fillMap: {
        coverage: "var(--brand-medium)",
        budget: "#2ec4b6",
        fpos: "#d97706",
        infra: "#2ec4b6",
      },
      path: "M 110,230 L 210,270 L 310,280 L 290,360 L 190,350 Z",
      centroid: { x: 222, y: 298 },
      lat: "28.6060",
      lng: "76.6566",
      text: "Declining micro-irrigation applications. Subsidies underutilized.",
    },
    {
      id: "hry-04",
      name: "Panipat",
      coverage: "42%",
      budget: "₹18.9 Cr",
      fpos: "3 Active",
      infra: "8 Units",
      colorMap: {
        coverage: "bg-[#2ec4b6]",
        budget: "bg-amber-600/70",
        fpos: "bg-red-600/70",
        infra: "bg-amber-600/70",
      },
      fillMap: {
        coverage: "#2ec4b6",
        budget: "#d97706",
        fpos: "#dc2626",
        infra: "#d97706",
      },
      path: "M 250,120 L 360,130 L 340,200 L 230,190 Z",
      centroid: { x: 295, y: 160 },
      lat: "29.3909",
      lng: "76.9635",
      text: "Critical need for crop insurance campaign. High percentage of marginal farmers.",
    },
    {
      id: "hry-05",
      name: "Karnal",
      coverage: "89%",
      budget: "₹94.5 Cr",
      fpos: "15 Active",
      infra: "62 Units",
      colorMap: {
        coverage: "bg-brand-darkest",
        budget: "bg-brand-darkest",
        fpos: "bg-brand-dark",
        infra: "bg-brand-darkest",
      },
      fillMap: {
        coverage: "var(--brand-darkest)",
        budget: "var(--brand-darkest)",
        fpos: "var(--brand-dark)",
        infra: "var(--brand-darkest)",
      },
      path: "M 260,40 L 380,50 L 360,130 L 250,120 Z",
      centroid: { x: 312, y: 85 },
      lat: "29.6857",
      lng: "76.9905",
      text: "Highest budget utilization. Excellent solar energy grid integration.",
    },
  ];

  const layerOptions = [
    { id: "coverage", label: "Scheme Coverage %" },
    { id: "budget", label: "Budget Utilized" },
    { id: "fpos", label: "FPO Density" },
    { id: "infrastructure", label: "Infrastructure Assets" },
  ];

  const legends = {
    coverage: [
      { label: "Top (80%+)", color: "var(--brand-darkest)" },
      { label: "High (70%-80%)", color: "var(--brand-dark)" },
      { label: "Moderate (50%-70%)", color: "var(--brand-medium)" },
      { label: "Low (40%-50%)", color: "#2ec4b6" },
    ],
    budget: [
      { label: "Max (₹70Cr+)", color: "var(--brand-darkest)" },
      { label: "High (₹40Cr-70Cr)", color: "var(--brand-dark)" },
      { label: "Moderate (₹20Cr-40Cr)", color: "var(--brand-medium)" },
      { label: "Low (<₹20Cr)", color: "#2ec4b6" },
      { label: "Alert", color: "#d97706" },
    ],
    fpos: [
      { label: "High (12+)", color: "var(--brand-darkest)" },
      { label: "Good (8-12)", color: "var(--brand-dark)" },
      { label: "Moderate (5-8)", color: "var(--brand-medium)" },
      { label: "Low (3-5)", color: "#2ec4b6" },
      { label: "Critical (<3)", color: "#dc2626" },
    ],
    infrastructure: [
      { label: "Excellent (60+)", color: "var(--brand-darkest)" },
      { label: "Good (40-60)", color: "var(--brand-dark)" },
      { label: "Moderate (20-40)", color: "var(--brand-medium)" },
      { label: "Low (10-20)", color: "#2ec4b6" },
      { label: "Alert (<10)", color: "#d97706" },
    ],
  };

  const briefPoints = [
    {
      type: "warning",
      text: "District Panipat has the lowest PMFBY adoption. Campaign recommended.",
    },
    {
      type: "info",
      text: "₹120 Cr remains unused in processing infrastructure support statewide.",
    },
    {
      type: "warning",
      text: "Three districts (Jhajjar, Rohtak, Panipat) show declining scheme utilization.",
    },
    {
      type: "success",
      text: "Warehouse investments are generating the highest ROI statewide (+24% YoY).",
    },
    {
      type: "success",
      text: "Farmer scheme coverage improved by 7.2% overall this quarter.",
    },
  ];

  const trendData = [
    { month: "Jan", budgetUtil: 45, applications: 2300 },
    { month: "Feb", budgetUtil: 52, applications: 3100 },
    { month: "Mar", budgetUtil: 60, applications: 4200 },
    { month: "Apr", budgetUtil: 72, applications: 5600 },
    { month: "May", budgetUtil: 84, applications: 7800 },
    { month: "Jun", budgetUtil: 91, applications: 9400 },
  ];

  // Dynamic scale and pan calculations for the map zoom effect
  let transformStr = "translate(0px, 0px) scale(1)";
  if (selectedDistrict) {
    const scale = 1.6;
    const cx = selectedDistrict.centroid.x;
    const cy = selectedDistrict.centroid.y;
    // We want the centroid to align to the viewport center (250, 200)
    const tx = 250 - cx * scale;
    const ty = 180 - cy * scale;
    transformStr = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  return (
    <>
      <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-brand-darkest">
        {/* Page Header */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-darkest flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-brand-medium" />
              Agricultural Governance Command Center
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Real-time executive oversight, financial health monitoring, and
              geospatial insights of government programs.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold bg-brand-darkest/10 text-brand-darkest px-3.5 py-1.5 rounded-xl border border-brand-darkest/15 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-medium" /> Haryana State
              Control Panel
            </span>
          </div>
        </div>

        {/* KPI Layer */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatsCard
            title="Total Farmers"
            value="4.2 Lakh"
            trend="84% Eligible"
            subtext="Registered: 3.5L"
            icon={<Users className="text-brand-medium" />}
          />
          <StatsCard
            title="Total FPOs"
            value="45 Active"
            trend="+5 this Q"
            subtext="Funded: 28 FPOs"
            icon={<Building2 className="text-brand-medium" />}
          />
          <StatsCard
            title="Government Budget"
            value="₹245.5 Cr"
            trend="91% Utilized"
            subtext="Released: ₹220 Cr"
            icon={<CircleDollarSign className="text-brand-medium" />}
          />
          <StatsCard
            title="Active Schemes"
            value="18 Running"
            trend="12 High-Perf"
            subtext="Under-perf: 2"
            icon={<Activity className="text-brand-medium" />}
          />
          <StatsCard
            title="Application Pipeline"
            value="12,450"
            trend="4.5 Days Avg"
            subtext="Approved: 9,210"
            icon={<FolderKanban className="text-brand-medium" />}
          />
          <StatsCard
            title="Infrastructure Created"
            value="155 Assets"
            trend="+18% YoY"
            subtext="Storage, Processing, Solar"
            icon={<Warehouse className="text-brand-medium" />}
          />
        </div>

        {/* Main Grid: Heat Map & AI Brief */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heat Map Column */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="font-bold text-brand-darkest text-sm flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-brand-medium" /> State Geospatial
                  Intelligence Layer
                </h3>
                <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1 gap-1">
                  {layerOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setActiveLayer(opt.id)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                        activeLayer === opt.id
                          ? "bg-brand-darkest text-white"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive SVG Heat Map Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                {/* Left Side: SVG Map Card */}
                <div className={`${
                  selectedDistrict ? "lg:col-span-3" : "lg:col-span-5"
                } flex flex-col justify-between h-[490px] border border-gray-150 bg-[#f4f7f4]/20 rounded-2xl p-4 relative overflow-hidden shadow-sm transition-all duration-500`}>
                  {/* Subtle dot matrix background inside the map card */}
                  <div className="absolute inset-0 bg-[#f4f7f4]/10 opacity-30 bg-[radial-gradient(#d1e2d1_1.5px,transparent_1.5px)] [background-size:15px_15px] pointer-events-none"></div>

                  {/* Top telemetry status */}
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mb-2 bg-white/80 border border-gray-100 px-3 py-1.5 rounded-lg z-10 shadow-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-brand-medium rounded-full animate-ping"></span>
                      SYSTEM: ACTIVE FEED
                    </span>
                    <span>
                      CURSOR: {coords.lat}° N, {coords.lng}° E
                    </span>
                  </div>

                  {/* SVG Container */}
                  <div 
                    className="relative flex-grow flex items-center justify-center cursor-crosshair z-10 h-[310px]"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const pctX = x / rect.width;
                      const pctY = y / rect.height;
                      const lat = (29.8 - pctY * (29.8 - 28.3)).toFixed(4);
                      const lng = (76.2 + pctX * (77.2 - 76.2)).toFixed(4);
                      setCoords({ lat, lng });
                    }}
                    onMouseLeave={() => {
                      setCoords({ lat: "29.0583", lng: "76.9248" });
                    }}
                  >
                    <svg viewBox="0 0 500 400" className="w-full h-full max-h-[295px] p-1">
                      {/* Grid Lines */}
                      <g stroke="#e2ece2" strokeWidth="1" strokeDasharray="3 3" opacity="0.8">
                        <line x1="150" y1="20" x2="150" y2="380" />
                        <line x1="250" y1="20" x2="250" y2="380" />
                        <line x1="350" y1="20" x2="350" y2="380" />
                        
                        <line x1="80" y1="100" x2="440" y2="100" />
                        <line x1="80" y1="200" x2="440" y2="200" />
                        <line x1="80" y1="300" x2="440" y2="300" />
                      </g>

                      {/* Grid Labels */}
                      <g fill="var(--brand-medium)" fontSize="7" opacity="0.65" fontWeight="semibold" fontFamily="monospace">
                        <text x="150" y="15" textAnchor="middle">76°30'E</text>
                        <text x="250" y="15" textAnchor="middle">76°45'E</text>
                        <text x="350" y="15" textAnchor="middle">77°00'E</text>

                        <text x="75" y="102" textAnchor="end">29°30'N</text>
                        <text x="75" y="202" textAnchor="end">29°15'N</text>
                        <text x="75" y="302" textAnchor="end">29°00'N</text>
                      </g>

                      {/* Compass Rose */}
                      <g transform="translate(45, 65)" className="opacity-35 text-brand-dark">
                        <circle r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="0" y1="-22" x2="0" y2="22" stroke="currentColor" strokeWidth="1" />
                        <line x1="-22" y1="0" x2="22" y2="0" stroke="currentColor" strokeWidth="1" />
                        <polygon points="0,0 -3,-18 0,-24" fill="currentColor" />
                        <polygon points="0,0 3,-18 0,-24" fill="none" stroke="currentColor" strokeWidth="1" />
                        <polygon points="0,0 3,18 0,22" fill="currentColor" />
                        <polygon points="0,0 -3,18 0,22" fill="none" stroke="currentColor" strokeWidth="1" />
                        <polygon points="0,0 18,-3 22,0" fill="currentColor" />
                        <polygon points="0,0 18,3 22,0" fill="none" stroke="currentColor" strokeWidth="1" />
                        <polygon points="0,0 -18,3 -22,0" fill="currentColor" />
                        <polygon points="0,0 -18,-3 -22,0" fill="none" stroke="currentColor" strokeWidth="1" />
                        <text x="0" y="-28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">N</text>
                      </g>

                      {/* Scale Bar */}
                      <g transform="translate(390, 370)" className="opacity-45 text-brand-darkest">
                        <line x1="0" y1="0" x2="80" y2="0" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="0" y1="-4" x2="0" y2="4" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="40" y1="-4" x2="40" y2="4" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="80" y1="-4" x2="80" y2="4" stroke="currentColor" strokeWidth="1.5" />
                        <text x="0" y="-8" fontSize="8" fontWeight="medium" textAnchor="middle" fill="currentColor">0</text>
                        <text x="40" y="-8" fontSize="8" fontWeight="medium" textAnchor="middle" fill="currentColor">12.5 km</text>
                        <text x="80" y="-8" fontSize="8" fontWeight="medium" textAnchor="middle" fill="currentColor">25 km</text>
                      </g>

                      {/* Zoomable District Paths Group */}
                      <g 
                        style={{
                          transform: transformStr,
                          transformOrigin: "250px 200px",
                          transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                      >
                        {districts.map((d) => {
                          const isSelected = selectedDistrict?.id === d.id;
                          const fillValue = d.fillMap[activeLayer];
                          return (
                            <g key={d.id} className="group cursor-pointer">
                              <path
                                  d={d.path}
                                  fill={fillValue}
                                  stroke={isSelected ? "#ffc857" : "#ffffff"}
                                  strokeWidth={isSelected ? 3.5 : 1.5}
                                  className="transition-all duration-300 ease-in-out hover:opacity-90 hover:stroke-[#2e4057] hover:stroke-[2.5px]"
                                  onClick={() => setSelectedDistrict(d)}
                              />
                              
                              <g transform={`translate(${d.centroid.x}, ${d.centroid.y})`} className="pointer-events-none select-none">
                                <rect
                                  x="-32"
                                  y="-12"
                                  width="64"
                                  height="24"
                                  rx="4"
                                  fill="rgba(19, 42, 19, 0.7)"
                                  className="transition-opacity duration-300 opacity-60 group-hover:opacity-85"
                                />
                                <text
                                  textAnchor="middle"
                                  y="-1"
                                  fontSize="8"
                                  fontWeight="bold"
                                  fill="#ffffff"
                                  className="uppercase tracking-wider"
                                >
                                  {d.name}
                                </text>
                                <text
                                  textAnchor="middle"
                                  y="8"
                                  fontSize="7"
                                  fontWeight="black"
                                  fill="#ffc857"
                                >
                                  {activeLayer === "coverage" && d.coverage}
                                  {activeLayer === "budget" && d.budget}
                                  {activeLayer === "fpos" && d.fpos}
                                  {activeLayer === "infrastructure" && d.infra}
                                </text>
                              </g>
                            </g>
                          );
                        })}
                      </g>
                    </svg>
                  </div>

                  {/* Legend & Telemetry Status Footer */}
                  {!selectedDistrict ? (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/95 border border-gray-150 p-4 rounded-xl shadow-sm z-10 animate-fadeIn">
                      {/* Telemetry ready message on the left */}
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-brand-darkest uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-brand-medium rounded-full animate-ping"></span>
                          GIS Telemetry Status
                        </h5>
                        <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                          Select any district boundary in the Haryana State Layer to initialize geospatial telemetry overlays, historical tranches, and FPO coordination maps.
                        </p>
                      </div>

                      {/* Legend in the middle */}
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-black text-brand-darkest uppercase tracking-wider">Legend</h5>
                        <div className="grid grid-cols-2 gap-1.5">
                          {legends[activeLayer].map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded border border-gray-200 shadow-sm shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Telemetry Diagnostics on the right */}
                      <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-gray-150 pt-2 md:pt-0 md:pl-4">
                        <h5 className="text-xs font-black text-brand-darkest uppercase tracking-wider">Telemetry Diagnostics</h5>
                        <div className="grid grid-cols-3 gap-2 text-center font-mono">
                          <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase block">Districts</span>
                            <span className="text-xs font-black text-brand-darkest">5 Active</span>
                          </div>
                          <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase block">Area</span>
                            <span className="text-xs font-black text-brand-darkest">~4.5K km²</span>
                          </div>
                          <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase block">Ping</span>
                            <span className="text-xs font-black text-brand-darkest">1.2s RT</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 bg-white/95 border border-gray-150 p-3 rounded-xl shadow-sm z-10 animate-fadeIn">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] font-black text-brand-darkest/70 uppercase tracking-wider">Map Legend:</span>
                        <div className="flex flex-wrap gap-3">
                          {legends[activeLayer].map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: item.color }} />
                              <span className="text-[9px] font-bold text-gray-600">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: HUD Info Panel Card (only shown when a district is selected) */}
                {selectedDistrict && (
                  <div className="lg:col-span-2 flex flex-col justify-between h-[490px] border border-gray-150 bg-[#f4f7f4]/20 rounded-2xl p-4 shadow-sm relative overflow-hidden animate-slideLeft">
                    <div className="space-y-3.5 animate-fadeIn flex-1 flex flex-col justify-between h-full z-10">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-black text-brand-darkest tracking-wide flex items-center gap-1.5 uppercase">
                              <MapPin className="w-4 h-4 text-brand-medium" /> {selectedDistrict.name} Region
                            </h4>
                            <p className="text-[9px] text-gray-400 font-mono mt-0.5">
                              LAT: {selectedDistrict.lat}° N | LON: {selectedDistrict.lng}° E
                            </p>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                            selectedDistrict.id === "hry-05" || selectedDistrict.id === "hry-01"
                              ? "bg-emerald-100 text-emerald-800"
                              : selectedDistrict.id === "hry-04"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}>
                            {selectedDistrict.id === "hry-05" || selectedDistrict.id === "hry-01"
                              ? "Optimized"
                              : selectedDistrict.id === "hry-04"
                                ? "Intervention Needed"
                                : "Under Review"}
                          </span>
                        </div>

                        {/* Comparative Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-3.5">
                          <div className="bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Coverage Rate</span>
                            <p className="text-xs font-black text-brand-darkest mt-0.5">{selectedDistrict.coverage}</p>
                          </div>
                          <div className="bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Budget Spent</span>
                            <p className="text-xs font-black text-brand-darkest mt-0.5">{selectedDistrict.budget}</p>
                          </div>
                          <div className="bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Active FPOs</span>
                            <p className="text-xs font-black text-brand-darkest mt-0.5">{selectedDistrict.fpos}</p>
                          </div>
                          <div className="bg-white/80 p-2.5 rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Storage & Infra</span>
                            <p className="text-xs font-black text-brand-darkest mt-0.5">{selectedDistrict.infra}</p>
                          </div>
                        </div>

                        {/* Dynamic narrative */}
                        <div className="mt-3.5 bg-white/90 border border-brand-darkest/10 p-3 rounded-xl shadow-sm">
                          <h5 className="text-[9px] font-bold text-brand-darkest uppercase tracking-wider mb-1">Regional Intelligence Brief</h5>
                          <p className="text-[11px] text-brand-darkest/90 font-semibold leading-relaxed">
                            {selectedDistrict.text}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDistrict(null)}
                        className="w-full text-[10px] font-bold text-gray-500 hover:text-brand-darkest border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 py-2 rounded-xl transition shadow-sm"
                      >
                        Reset Map Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Brief Column */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-brand-darkest text-sm mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-medium" /> AI Governance
                Brief
              </h3>
              <p className="text-[10px] text-gray-400 mb-4 leading-normal">
                Machine learning analytics generated from real-time district
                feeds and budget utilization telemetry.
              </p>
              <div className="space-y-3">
                {briefPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 transition ${
                      pt.type === "warning"
                        ? "bg-amber-50/50 border-amber-100/50 text-amber-900"
                        : pt.type === "success"
                          ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-950"
                          : "bg-blue-50/50 border-blue-100/50 text-blue-950"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        pt.type === "warning"
                          ? "text-amber-600"
                          : pt.type === "success"
                            ? "text-emerald-700"
                            : "text-blue-600"
                      }`}
                    />
                    <p className="text-[11px] font-medium leading-relaxed">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quarterly Budget Utilization Progress
              </h4>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f3f1"
                      vertical={false}
                    />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => `${value}%`}
                      labelClassName="text-[10px]"
                    />
                    <Area
                      type="monotone"
                      dataKey="budgetUtil"
                      stroke="var(--brand-medium)"
                      fill="#ffc857"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Infrastructure + AI Brief Tabs - INSIDE the main wrapper */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm">
        {/* Tab Buttons */}
        <div className="flex gap-3 p-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab("infrastructure")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "infrastructure"
                ? "bg-brand-darkest text-white"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Infrastructure
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "ai"
                ? "bg-brand-darkest text-white"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            AI Brief
          </button>
        </div>

        <div className="p-5">
          {/* INFRASTRUCTURE TAB */}
          {activeTab === "infrastructure" && (
            <div className="space-y-6">
              {/* Capacity Bars */}
              <div className="space-y-4">
                <h3 className="font-bold text-brand-darkest text-sm">
                  State Storage Capacity & Utilization
                </h3>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Warehouse Storage Capacity</span>
                    <span>2,500 MT / 92% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-darkest h-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Cold Room Storage Capacity</span>
                    <span>200 MT / 74% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-dark h-full"
                      style={{ width: "74%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Processing Cluster Output</span>
                    <span>500 MT/day / 85% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Asset Performance Alerts */}
              <div className="space-y-2">
                <h3 className="font-bold text-brand-darkest text-sm">
                  Asset Performance Alerts
                </h3>
                <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-red-800">Idle Asset Triggered</p>
                  <p className="text-gray-500 font-semibold">
                    Jhajjar Solar Grid Link A shows only 58% output. Inverter
                    calibration required.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-amber-800">
                    Underutilized Custom Hiring Center
                  </p>
                  <p className="text-gray-500 font-semibold">
                    Panipat Tractor Center shows only 42% booking rate. Local
                    FPO training dispatch recommended.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-emerald-800">
                    Outstanding ROI Asset
                  </p>
                  <p className="text-gray-500 font-semibold">
                    Sonipat Central Warehouse reaches 92% capacity utilization.
                    Generating ₹1.2 Cr in member savings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI BRIEF TAB */}
          {activeTab === "ai" && (
            <div className="space-y-3">
              <h3 className="font-bold text-brand-darkest text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-medium" />
                AI Governance Brief
              </h3>
              <p className="text-[10px] text-gray-400 leading-normal">
                Machine learning analytics generated from real-time district
                feeds and budget utilization telemetry.
              </p>
              {briefPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    pt.type === "warning"
                      ? "bg-amber-50/50 border-amber-100/50 text-amber-900"
                      : pt.type === "success"
                        ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-950"
                        : "bg-blue-50/50 border-blue-100/50 text-blue-950"
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      pt.type === "warning"
                        ? "text-amber-600"
                        : pt.type === "success"
                          ? "text-emerald-700"
                          : "text-blue-600"
                    }`}
                  />
                  <p className="text-[11px] font-medium leading-relaxed">
                    {pt.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
