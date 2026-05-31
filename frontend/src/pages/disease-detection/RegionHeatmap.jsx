import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { MapPin, Calendar, ChevronDown, Loader2 } from "lucide-react";
import { getHeatmapData } from "../../services/diseaseGeminiService";

const DISEASE_LIST = [
  "All",
  "Blast Disease",
  "Yellow Rust",
  "Whitefly",
  "Leaf Blight",
  "Sheath Blight",
  "Alternaria Blight",
];

const STATE_LIST = ["All", "Haryana", "Punjab", "Uttar Pradesh", "Rajasthan"];

// National Map Table Configuration Datasets — Heat Data for Country Scope
const nationalMapGeoData = [
  ["State", "Risk Density Index Value"],
  ["IN-HR", 3], // Haryana - High Outbreak Risk
  ["IN-PB", 2], // Punjab - Moderate Vector Load
  ["IN-UP", 2], // Uttar Pradesh - Moderate Spore Count
  ["IN-RJ", 1], // Rajasthan - Low Risk
  ["IN-MP", 1], // Madhya Pradesh - Low Risk
];

// HIGH CONTRAST TOKENS TO DEEPEN MAP CANVAS SHADES & SHARPEN LINES
const geoChartOptions = {
  region: "IN",
  domain: "IN",
  displayMode: "regions",
  resolution: "provinces",
  colorAxis: {
    minValue: 1,
    maxValue: 3,
    colors: ["#15803d", "#d97706", "#b91c1c"], // Saturated Green, Amber, Dark Crimson
  },
  backgroundColor: "transparent",
  datalessRegionColor: "#94a3b8", // Darker unmapped background baseline for popping shapes
  defaultColor: "#94a3b8",

  // FIXED STATE BORDER VISIBILITY
  stroke: "#ffffff", // Forces a crisp white outline on all inactive/active states
  strokeWidth: 1.5, // Thickens borders so boundaries are clearly defined

  // HOVER EFFECTS & CLICK ACCESSIBILITY
  keepAspectRatio: true,
  tooltip: {
    textStyle: {
      color: "#132a13",
      fontName: "Plus Jakarta Sans",
      fontSize: 12,
    },
    trigger: "focus",
  },
  magnifyingGlass: { enable: false },
};

// State & District Hierarchy Telemetry: Localized Pulse Nodes
const HARDCODED_FALLBACK_NODES = [
  {
    id: "h1",
    name: "Karnal Core",
    x: 340,
    y: 130,
    riskWeight: 85,
    state: "Haryana",
    crop: "Rice",
    metrics: "Humidity 82% | Spore Load High",
  },
  {
    id: "h2",
    name: "Panipat Core",
    x: 355,
    y: 145,
    riskWeight: 78,
    state: "Haryana",
    crop: "Wheat",
    metrics: "Humidity 79% | Spore Load High",
  },
  {
    id: "h3",
    name: "Gharaunda Sector",
    x: 335,
    y: 160,
    riskWeight: 80,
    state: "Haryana",
    crop: "Rice",
    metrics: "Microclimate Alert",
  },
  {
    id: "h4",
    name: "Assandh Belt",
    x: 320,
    y: 120,
    riskWeight: 92,
    state: "Haryana",
    crop: "Rice",
    metrics: "Sustained Vector Incidents",
  },
  {
    id: "h5",
    name: "Faridabad Zone",
    x: 310,
    y: 340,
    riskWeight: 55,
    state: "Haryana",
    crop: "Wheat",
    metrics: "Humidity 64% | Mod Risk",
  },
  {
    id: "h6",
    name: "Palwal Core",
    x: 325,
    y: 365,
    riskWeight: 88,
    state: "Haryana",
    crop: "Cotton",
    metrics: "Whitefly Activity Spike",
  },
  {
    id: "h7",
    name: "Sirsa Fields",
    x: 110,
    y: 250,
    riskWeight: 18,
    state: "Haryana",
    crop: "Mustard",
    metrics: "Stable Conditions",
  },
  {
    id: "h8",
    name: "Rohtak Basin",
    x: 260,
    y: 250,
    riskWeight: 62,
    state: "Haryana",
    crop: "Maize",
    metrics: "Humidity 68%",
  },
  {
    id: "h9",
    name: "Jind Agri Range",
    x: 230,
    y: 180,
    riskWeight: 45,
    state: "Haryana",
    crop: "Rice",
    metrics: "Slight Spore Elevation",
  },
];

export default function RegionHeatmap() {
  const [selectedState, setSelectedState] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState("All");
  const [dateRange, setDateRange] = useState("Today — May 30");

  const [latitude, setLatitude] = useState("28.4089");
  const [longitude, setLongitude] = useState("77.3178");
  const [isSearchingCoords, setIsSearchingCoords] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const [mapData, setMapData] = useState({ nodes: [], activeIncidents: [] });
  const [isLoading, setIsLoading] = useState(false);

  // Hook Gemini API calls to state and disease selection
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const loadHeatmap = async () => {
      try {
        const result = await getHeatmapData(
          selectedDisease,
          selectedState,
          null,
        );
        if (active) {
          setMapData(result);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic heatmap metrics:", err);
        if (active) setIsLoading(false);
      }
    };

    loadHeatmap();

    return () => {
      active = false;
    };
  }, [selectedDisease, selectedState]);

  // Handle manual coordinate form submits
  const handleCoordinatesSubmit = (e) => {
    e.preventDefault();
    if (latitude && longitude) {
      setIsSearchingCoords(true);
      setSelectedState("Haryana"); // Deep focus zoom straight to coordinate target area
    }
  };

  // Bidirectional interaction sync: clicking vector region switches the filter dropdown context
  const handleChartSelect = ({ chartWrapper }) => {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection();
    if (selection.length === 0) return;

    const stateIsoCode = nationalMapGeoData[selection[0].row + 1][0];
    if (stateIsoCode === "IN-HR") setSelectedState("Haryana");
    if (stateIsoCode === "IN-PB") setSelectedState("Punjab");
    if (stateIsoCode === "IN-UP") setSelectedState("Uttar Pradesh");
    if (stateIsoCode === "IN-RJ") setSelectedState("Rajasthan");
  };

  // SYNC STRATEGY: Parse cluster data with dynamic data-binding and programmatic layout fallbacks
  const visibleHotspots =
    mapData.nodes && mapData.nodes.length > 0
      ? mapData.nodes
      : HARDCODED_FALLBACK_NODES;

  // Dynamic filter nodes arrays mapped directly against active selected state strings
  const filteredNodes = visibleHotspots.filter((node) =>
    selectedState === "All"
      ? true
      : node.state.toLowerCase() === selectedState.toLowerCase(),
  );

  // Dynamic Ledger Computations based on filtered parameters
  const highRiskCount = filteredNodes.filter((n) => n.riskWeight >= 75).length;
  const modRiskCount = filteredNodes.filter(
    (n) => n.riskWeight >= 40 && n.riskWeight < 75,
  ).length;
  const lowRiskCount = filteredNodes.filter((n) => n.riskWeight < 40).length;

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* 1. CLEANED ROW FILTERS ACTION HEADER PANEL */}
      <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Select Region Filter */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Select Region
            </span>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setIsSearchingCoords(false);
                }}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 h-[38px] text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[140px]"
              >
                <option value="All">All India View</option>
                {STATE_LIST.filter((s) => s !== "All").map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Select Disease Filter */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Select Disease
            </span>
            <div className="relative">
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 h-[38px] text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[140px]"
              >
                {DISEASE_LIST.map((dis) => (
                  <option key={dis} value={dis}>
                    {dis === "All" ? "All Diseases" : dis}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Telemetry Date Filter */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Telemetry Date
            </span>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 h-[38px] text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[140px]"
              >
                <option>Today — May 30</option>
                <option>Yesterday — May 29</option>
                <option>Historical Baseline</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Lat/Long Coordinate Form */}
        <form
          onSubmit={handleCoordinatesSubmit}
          className="flex flex-wrap items-end gap-2 bg-[#f4f7f4] p-2 rounded-lg border border-gray-200 w-full xl:w-auto"
        >
          <div className="w-24">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">
              Latitude
            </span>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:border-[#31572c] h-[26px]"
              placeholder="28.4089"
            />
          </div>
          <div className="w-24">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">
              Longitude
            </span>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:border-[#31572c] h-[26px]"
              placeholder="77.3178"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1 bg-[#31572c] hover:bg-[#132a13] text-white font-extrabold text-[10px] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 h-[26px] cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#ecf39e]" />
            <span>Query</span>
          </button>
        </form>
      </header>

      {/* 2. CORE DASHBOARD MATRIX SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMNS: INTERACTIVE MAPPING CARD (SPAN: 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 shadow-sm relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f4f7f4]/20">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              {selectedState === "All"
                ? "All India Risk Heat Distribution"
                : `${selectedState} Regional Coordinate Overlay`}
            </h2>
            {selectedState !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedState("All")}
                className="flex items-center gap-1 text-[11px] font-extrabold text-[#31572c] hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                &larr; Back to National Map
              </button>
            )}
          </div>

          {/* DYNAMIC CONDITION BASED RENDER FIELD */}
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/20 min-h-[380px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
                <Loader2 className="h-8 w-8 text-[#31572c] animate-spin" />
              </div>
            )}

            {/* HIGH-CONTRAST DYNAMIC CONTEXT TOOLTIP OVERLAY */}
            {hoveredRegion && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100/80 z-30 space-y-1.5 max-w-xs animate-in fade-in zoom-in-95 duration-100 text-left">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
                  {hoveredRegion.state} Scope
                </span>
                <h4 className="text-xs font-black text-gray-900">
                  {hoveredRegion.name}
                </h4>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  {hoveredRegion.metrics || "Radar path metrics active"}
                </p>
                <div className="pt-1 flex gap-3 text-[9px] font-bold text-gray-600 uppercase tracking-wider border-t border-gray-100">
                  <span>
                    Crop:{" "}
                    <b className="text-gray-900">
                      {hoveredRegion.crop || "N/A"}
                    </b>
                  </span>
                  <span>
                    Risk:{" "}
                    <b className="text-[#b91c1c]">
                      {hoveredRegion.riskWeight}%
                    </b>
                  </span>
                </div>
              </div>
            )}

            {selectedState === "All" ? (
              /* --- NATIONAL MAP ELEMENT ENGINE WITH CUSTOM POINTER CURSOR OVERRIDES --- */
              <div className="w-full max-w-xl h-[380px] [&_path]:cursor-pointer [&_path]:transition-all [&_path]:duration-150 [&_path:hover]:opacity-85">
                <Chart
                  chartType="GeoChart"
                  width="100%"
                  height="100%"
                  data={nationalMapGeoData}
                  options={geoChartOptions}
                  chartEvents={[
                    { eventName: "select", callback: handleChartSelect },
                  ]}
                  loader={
                    <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400">
                      Loading Geographic Vector Engine...
                    </div>
                  }
                />
              </div>
            ) : (
              /* --- STATE ELEMENT VIEW: CONCENTRIC RADAR SCATTER HOTSPOTS CANVAS --- */
              <div className="w-full max-w-md aspect-square relative border border-gray-100 bg-white rounded-xl shadow-inner overflow-hidden flex items-center justify-center animate-fadeIn">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-gray-100" />
                  ))}
                </div>

                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full z-10 overflow-visible p-4"
                >
                  {/* Geographic trace loop for state boundary limits */}
                  <path
                    d="M 120,100 C 150,80 220,80 260,95 C 310,110 380,100 410,140 C 430,170 410,210 390,240 C 370,270 380,310 395,340 C 410,380 390,430 350,450 C 300,480 250,460 210,430 C 170,450 130,440 100,410 C 70,370 70,300 90,240 C 80,180 90,130 120,100 Z"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="3.5"
                    strokeDasharray="4,4"
                  />

                  {/* Dynamic cluster point map loops */}
                  {filteredNodes.map((node) => {
                    const isHigh = node.riskWeight >= 75;
                    const isMod = node.riskWeight >= 40 && node.riskWeight < 75;
                    const nodeColor = isHigh
                      ? "#b91c1c"
                      : isMod
                        ? "#d97706"
                        : "#15803d";

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredRegion(node)}
                        onMouseLeave={() => setHoveredRegion(null)}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill={nodeColor}
                          fillOpacity="0.12"
                          className="animate-ping origin-center"
                          style={{
                            animationDuration: isHigh ? "1.8s" : "2.8s",
                          }}
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="15"
                          fill={nodeColor}
                          fillOpacity="0.1"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="5"
                          fill={nodeColor}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="transition-transform group-hover:scale-125 origin-center"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          <div className="bg-gray-50 text-center p-3 border-t border-gray-100">
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
              Interactive Canvas · Hover elements for specific regional logs
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDE ANALYTICS PANEL (SPAN: 1) */}
        <div className="lg:col-span-1 space-y-4">
          {/* Risk Legend Spectrum Badge metrics */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest border-b border-gray-50 pb-2">
              Risk Legend Spectrum
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#15803d] block" />
                  <span className="text-xs font-bold text-gray-700">
                    Low Risk Zones
                  </span>
                </div>
                <span className="text-xs font-black text-gray-400">
                  {selectedState === "All" ? "1" : lowRiskCount} Nodes Cluster
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#d97706] block" />
                  <span className="text-xs font-bold text-gray-700">
                    Moderate Risk Zones
                  </span>
                </div>
                <span className="text-xs font-black text-gray-400">
                  {selectedState === "All" ? "3" : modRiskCount} Nodes Cluster
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#b91c1c] block" />
                  <span className="text-xs font-bold text-gray-700">
                    High Risk Threat Levels
                  </span>
                </div>
                <span className="text-xs font-black text-gray-400">
                  {selectedState === "All" ? "4" : highRiskCount} Nodes Cluster
                </span>
              </div>
            </div>
          </div>

          {/* Active Outbreak Incidents Ledger */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
                Active Vector Incidents
              </h3>
              <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">
                AGGREGATE: 94 TOTAL SYSTEM ALERTS RELEASED
              </p>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:bg-red-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900">
                    Karnal Region
                  </h4>
                  <p className="text-[9px] font-extrabold text-[#b91c1c] uppercase tracking-widest block">
                    2 HOURS AGO · DISEASE: BLAST DISEASE
                  </p>
                </div>
                <span className="bg-white border border-red-200 text-[#b91c1c] px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase shrink-0 font-sans shadow-sm">
                  340 ACRES
                </span>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:bg-amber-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900">
                    Panipat Region
                  </h4>
                  <p className="text-[9px] font-extrabold text-[#d97706] uppercase tracking-widest block">
                    4 HOURS AGO · DISEASE: YELLOW RUST
                  </p>
                </div>
                <span className="bg-white border border-amber-200 text-[#d97706] px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase shrink-0 font-sans shadow-sm">
                  180 ACRES
                </span>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:bg-emerald-50 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900">
                    Sirsa Region
                  </h4>
                  <p className="text-[9px] font-extrabold text-[#15803d] uppercase tracking-widest block">
                    1 DAY AGO · DISEASE: WHITEFLY
                  </p>
                </div>
                <span className="bg-white border-emerald-200 text-[#15803d] px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase shrink-0 font-sans shadow-sm">
                  210 ACRES
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
