// import React, { useState, useEffect } from "react";
// import { Chart } from "react-google-charts";
// import { MapPin, Calendar, ChevronDown, Loader2 } from "lucide-react";
// import { getHeatmapData } from "../../../services/diseaseGeminiService";

// const DISEASE_LIST = [
//   "All",
//   "Blast Disease",
//   "Yellow Rust",
//   "Whitefly",
//   "Leaf Blight",
//   "Sheath Blight",
//   "Alternaria Blight",
// ];

// const STATE_LIST = ["All", "Haryana", "Punjab", "Uttar Pradesh", "Rajasthan"];

// // HIGH CONTRAST TOKENS TO DEEPEN MAP CANVAS SHADES & SHARPEN LINES
// const geoChartOptions = {
//   region: "IN",
//   domain: "IN",
//   displayMode: "regions",
//   resolution: "provinces",
//   colorAxis: {
//     minValue: 1,
//     maxValue: 3,
//     colors: ["#15803d", "#d97706", "#b91c1c"], // Rich Saturated Green, Amber, Dark Crimson
//   },
//   backgroundColor: "transparent",
//   datalessRegionColor: "#cbd5e1",
//   defaultColor: "#cbd5e1",

//   // FIXED STATE BORDER VISIBILITY FOR EXTREME BOUNDARY DEFINITION
//   borderOptions: {
//     color: "#ffffff",
//     width: 2,
//   },

//   // HOVER EFFECTS & CLICK ACCESSIBILITY
//   keepAspectRatio: true,
//   tooltip: {
//     textStyle: {
//       color: "#132a13",
//       fontName: "Plus Jakarta Sans",
//       fontSize: 12,
//     },
//     trigger: "focus",
//   },
//   magnifyingGlass: { enable: false },
// };

// // State & District Hierarchy Telemetry: Localized Pulse Nodes
// // const HARDCODED_FALLBACK_NODES = [
// //   {
// //     id: "h1",
// //     name: "Karnal Core",
// //     x: 340,
// //     y: 130,
// //     riskWeight: 85,
// //     state: "Haryana",
// //     crop: "Rice",
// //     metrics: "Humidity 82% | Spore Load High",
// //   },
// //   {
// //     id: "h2",
// //     name: "Panipat Core",
// //     x: 355,
// //     y: 145,
// //     riskWeight: 78,
// //     state: "Haryana",
// //     crop: "Wheat",
// //     metrics: "Humidity 79% | Spore Load High",
// //   },
// //   {
// //     id: "h3",
// //     name: "Gharaunda Sector",
// //     x: 335,
// //     y: 160,
// //     riskWeight: 80,
// //     state: "Haryana",
// //     crop: "Rice",
// //     metrics: "Microclimate Alert",
// //   },
// //   {
// //     id: "h4",
// //     name: "Assandh Belt",
// //     x: 320,
// //     y: 120,
// //     riskWeight: 92,
// //     state: "Haryana",
// //     crop: "Rice",
// //     metrics: "Sustained Vector Incidents",
// //   },
// //   {
// //     id: "h5",
// //     name: "Faridabad Zone",
// //     x: 310,
// //     y: 340,
// //     riskWeight: 55,
// //     state: "Haryana",
// //     crop: "Wheat",
// //     metrics: "Humidity 64% | Mod Risk",
// //   },
// //   {
// //     id: "h6",
// //     name: "Palwal Core",
// //     x: 325,
// //     y: 365,
// //     riskWeight: 88,
// //     state: "Haryana",
// //     crop: "Cotton",
// //     metrics: "Whitefly Activity Spike",
// //   },
// //   {
// //     id: "h7",
// //     name: "Sirsa Fields",
// //     x: 110,
// //     y: 250,
// //     riskWeight: 18,
// //     state: "Haryana",
// //     crop: "Mustard",
// //     metrics: "Stable Conditions",
// //   },
// //   {
// //     id: "h8",
// //     name: "Rohtak Basin",
// //     x: 260,
// //     y: 250,
// //     riskWeight: 62,
// //     state: "Haryana",
// //     crop: "Maize",
// //     metrics: "Humidity 68%",
// //   },
// //   {
// //     id: "h9",
// //     name: "Jind Agri Range",
// //     x: 230,
// //     y: 180,
// //     riskWeight: 45,
// //     state: "Haryana",
// //     crop: "Rice",
// //     metrics: "Slight Spore Elevation",
// //   },
// // ];

// export const buildRegionalNodes = (districts, weatherMap) => {
//   return districts.map((district, index) => {
//     const weather = weatherMap[district.name];

//     const risk = calculateRegionalRisk({
//       temperature: weather.temperature,
//       humidity: weather.humidity,
//       rainfall: weather.rainfall,
//       windSpeed: weather.windSpeed,
//     });

//     return {
//       id: district.id,
//       name: district.name,
//       x: district.x,
//       y: district.y,
//       state: district.state,
//       crop: district.crop,
//       riskWeight: risk,
//       metrics: `
//         Temp ${weather.temperature}°C
//         Humidity ${weather.humidity}%
//         Rainfall ${weather.rainfall}mm
//       `,
//     };
//   });
// };

// export default function RegionHeatmap() {
//   const [selectedState, setSelectedState] = useState("All");
//   const [selectedDisease, setSelectedDisease] = useState("All");
//   const [dateRange, setDateRange] = useState("Today — May 30");

//   const [latitude, setLatitude] = useState("28.4089");
//   const [longitude, setLongitude] = useState("77.3178");
//   const [isSearchingCoords, setIsSearchingCoords] = useState(false);
//   const [hoveredRegion, setHoveredRegion] = useState(null);

//   const [mapData, setMapData] = useState({ nodes: [], activeIncidents: [] });
//   const [isLoading, setIsLoading] = useState(false);

//   // Hook Gemini API calls to state and disease selection
//   useEffect(() => {
//     let active = true;
//     setIsLoading(true);

//     const loadHeatmap = async () => {
//       try {
//         const result = await getHeatmapData(
//           selectedDisease,
//           selectedState,
//           null,
//         );
//         if (active) {
//           setMapData(result);
//           setIsLoading(false);
//         }
//       } catch (err) {
//         console.error("Failed to fetch dynamic heatmap metrics:", err);
//         if (active) setIsLoading(false);
//       }
//     };

//     loadHeatmap();

//     return () => {
//       active = false;
//     };
//   }, [selectedDisease, selectedState]);

//   // Handle manual coordinate form submits
//   const handleCoordinatesSubmit = (e) => {
//     e.preventDefault();
//     if (latitude && longitude) {
//       setIsSearchingCoords(true);
//       setSelectedState("Haryana"); // Deep focus zoom straight to coordinate target area
//     }
//   };

//   // Derive stateSummary dynamically from nodes if missing
//   const derivedStateSummary =
//     mapData.stateSummary ||
//     (mapData.nodes && mapData.nodes.length > 0
//       ? (() => {
//           const STATE_ISO_MAP = {
//             haryana: "IN-HR",
//             punjab: "IN-PB",
//             "uttar pradesh": "IN-UP",
//             rajasthan: "IN-RJ",
//             "madhya pradesh": "IN-MP",
//           };
//           const maxRisks = {};
//           mapData.nodes.forEach((node) => {
//             const key = node.state.toLowerCase();
//             const iso = STATE_ISO_MAP[key];
//             if (iso) {
//               let val = 1;
//               if (node.riskWeight >= 75) val = 3;
//               else if (node.riskWeight >= 40) val = 2;
//               if (!maxRisks[iso] || val > maxRisks[iso]) {
//                 maxRisks[iso] = val;
//               }
//             }
//           });
//           return Object.entries(maxRisks);
//         })()
//       : []);

//   // 1. Dynamic National Mapping State Assembler Lookups
//   const computedGeoData = [
//     ["State", "Risk Density Index Value"],
//     ...(derivedStateSummary && derivedStateSummary.length > 0
//       ? derivedStateSummary
//       : [
//           ["IN-HR", 3],
//           ["IN-PB", 2],
//           ["IN-UP", 2],
//           ["IN-RJ", 1],
//           ["IN-MP", 1],
//         ]),
//   ];

//   // 2. Adaptive Cluster Tracking Data Extraction Rules
//   const liveDataNodes =
//     mapData.nodes && mapData.nodes.length > 0
//       ? mapData.nodes
//       : HARDCODED_FALLBACK_NODES;

//   // 3. Sync matching filter tracking states functionally across dropdown actions
//   const filteredNodes = liveDataNodes.filter((node) =>
//     selectedState === "All"
//       ? true
//       : node.state.toLowerCase() === selectedState.toLowerCase(),
//   );

//   // Bidirectional interaction sync: clicking vector region switches the filter dropdown context
//   const handleChartSelect = ({ chartWrapper }) => {
//     const chart = chartWrapper.getChart();
//     const selection = chart.getSelection();
//     if (selection.length === 0) return;

//     const stateIsoCode = computedGeoData[selection[0].row + 1][0];
//     if (stateIsoCode === "IN-HR") setSelectedState("Haryana");
//     if (stateIsoCode === "IN-PB") setSelectedState("Punjab");
//     if (stateIsoCode === "IN-UP") setSelectedState("Uttar Pradesh");
//     if (stateIsoCode === "IN-RJ") setSelectedState("Rajasthan");
//   };

//   // Dynamic Ledger Computations based on filtered parameters
//   const highRiskCount = filteredNodes.filter((n) => n.riskWeight >= 75).length;
//   const modRiskCount = filteredNodes.filter(
//     (n) => n.riskWeight >= 40 && n.riskWeight < 75,
//   ).length;
//   const lowRiskCount = filteredNodes.filter((n) => n.riskWeight < 40).length;

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased">
//       {/* 1. CLEANED ROW FILTERS ACTION HEADER PANEL */}
//       <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm">
//         <div className="flex flex-wrap items-center gap-4">
//           {/* Select Region Filter */}
//           <div>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//               Select Region
//             </span>
//             <div className="relative">
//               <select
//                 value={selectedState}
//                 onChange={(e) => {
//                   setSelectedState(e.target.value);
//                   setIsSearchingCoords(false);
//                 }}
//                 className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 h-[38px] text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[140px]"
//               >
//                 <option value="All">All India View</option>
//                 {STATE_LIST.filter((s) => s !== "All").map((st) => (
//                   <option key={st} value={st}>
//                     {st}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
//             </div>
//           </div>

//           {/* Select Disease Filter */}
//           <div>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//               Select Disease
//             </span>
//             <div className="relative">
//               <select
//                 value={selectedDisease}
//                 onChange={(e) => setSelectedDisease(e.target.value)}
//                 className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 h-[38px] text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[140px]"
//               >
//                 {DISEASE_LIST.map((dis) => (
//                   <option key={dis} value={dis}>
//                     {dis === "All" ? "All Diseases" : dis}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
//             </div>
//           </div>

//           {/* Telemetry Date Filter */}
//           <div>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//               Telemetry Date
//             </span>
//             <div className="relative">
//               <select
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//                 className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 h-[38px] text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[140px]"
//               >
//                 <option>Today — May 30</option>
//                 <option>Yesterday — May 29</option>
//                 <option>Historical Baseline</option>
//               </select>
//               <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Lat/Long Coordinate Form */}
//         <form
//           onSubmit={handleCoordinatesSubmit}
//           className="flex flex-wrap items-end gap-2 bg-[#f4f7f4] p-2 rounded-lg border border-gray-200 w-full xl:w-auto"
//         >
//           <div className="w-24">
//             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">
//               Latitude
//             </span>
//             <input
//               type="text"
//               value={latitude}
//               onChange={(e) => setLatitude(e.target.value)}
//               className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:border-[#31572c] h-[26px]"
//               placeholder="28.4089"
//             />
//           </div>
//           <div className="w-24">
//             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">
//               Longitude
//             </span>
//             <input
//               type="text"
//               value={longitude}
//               onChange={(e) => setLongitude(e.target.value)}
//               className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:border-[#31572c] h-[26px]"
//               placeholder="77.3178"
//             />
//           </div>
//           <button
//             type="submit"
//             className="px-3 py-1 bg-brand-dark hover:bg-[#132a13] text-white font-extrabold text-[10px] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 h-[26px] cursor-pointer"
//           >
//             <MapPin className="w-3 h-3 text-[#ecf39e]" />
//             <span>Query</span>
//           </button>
//         </form>
//       </header>

//       {/* 2. CORE DASHBOARD MATRIX SECTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//         {/* LEFT COLUMNS: INTERACTIVE MAPPING CARD (SPAN: 2) */}
//         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 shadow-sm relative min-h-[520px] flex flex-col justify-between overflow-hidden">
//           <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f4f7f4]/20">
//             <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
//               {selectedState === "All"
//                 ? "All India Risk Heat Distribution"
//                 : `${selectedState} Regional Coordinate Overlay`}
//             </h2>
//             {selectedState !== "All" && (
//               <button
//                 type="button"
//                 onClick={() => setSelectedState("All")}
//                 className="flex items-center gap-1 text-[11px] font-extrabold text-[#31572c] hover:underline cursor-pointer bg-transparent border-0 p-0"
//               >
//                 &larr; Back to National Map
//               </button>
//             )}
//           </div>

//           {/* DYNAMIC CONDITION BASED RENDER FIELD */}
//           <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/20 min-h-[380px] relative">
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20">
//                 <Loader2 className="h-8 w-8 text-[#31572c] animate-spin" />
//               </div>
//             )}

//             {/* HIGH-CONTRAST DYNAMIC CONTEXT TOOLTIP OVERLAY */}
//             {hoveredRegion && (
//               <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100/80 z-30 space-y-1.5 max-w-xs animate-in fade-in zoom-in-95 duration-100 text-left">
//                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
//                   {hoveredRegion.state} Scope
//                 </span>
//                 <h4 className="text-xs font-black text-gray-900">
//                   {hoveredRegion.name}
//                 </h4>
//                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
//                   {hoveredRegion.metrics || "Radar path metrics active"}
//                 </p>
//                 <div className="pt-1 flex gap-3 text-[9px] font-bold text-gray-600 uppercase tracking-wider border-t border-gray-100">
//                   <span>
//                     Crop:{" "}
//                     <b className="text-gray-900">
//                       {hoveredRegion.crop || "N/A"}
//                     </b>
//                   </span>
//                   <span>
//                     Risk:{" "}
//                     <b className="text-[#b91c1c]">
//                       {hoveredRegion.riskWeight}%
//                     </b>
//                   </span>
//                 </div>
//               </div>
//             )}

//             {selectedState === "All" ? (
//               /* --- NATIONAL MAP ELEMENT ENGINE WITH CUSTOM POINTER CURSOR OVERRIDES --- */
//               <div className="w-full max-w-xl h-[380px] [&_path]:cursor-pointer [&_path]:transition-all [&_path]:duration-150 [&_path:hover]:opacity-85">
//                 <Chart
//                   chartType="GeoChart"
//                   width="100%"
//                   height="100%"
//                   data={computedGeoData}
//                   options={geoChartOptions}
//                   chartEvents={[
//                     { eventName: "select", callback: handleChartSelect },
//                   ]}
//                   loader={
//                     <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400">
//                       Loading Geographic Vector Engine...
//                     </div>
//                   }
//                 />
//               </div>
//             ) : (
//               /* --- STATE ELEMENT VIEW: CONCENTRIC RADAR SCATTER HOTSPOTS CANVAS --- */
//               <div className="w-full max-w-md aspect-square relative border border-gray-100 bg-white rounded-xl shadow-inner overflow-hidden flex items-center justify-center animate-fadeIn">
//                 <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
//                   {[...Array(16)].map((_, i) => (
//                     <div key={i} className="border-[0.5px] border-gray-100" />
//                   ))}
//                 </div>

//                 <svg
//                   viewBox="0 0 500 500"
//                   className="w-full h-full z-10 overflow-visible p-4"
//                 >
//                   {/* Geographic trace loop for state boundary limits */}
//                   <path
//                     d="M 120,100 C 150,80 220,80 260,95 C 310,110 380,100 410,140 C 430,170 410,210 390,240 C 370,270 380,310 395,340 C 410,380 390,430 350,450 C 300,480 250,460 210,430 C 170,450 130,440 100,410 C 70,370 70,300 90,240 C 80,180 90,130 120,100 Z"
//                     fill="none"
//                     stroke="#cbd5e1"
//                     strokeWidth="3.5"
//                     strokeDasharray="4,4"
//                   />

//                   {/* Dynamic cluster point map loops */}
//                   {filteredNodes.map((node) => {
//                     const isHigh = node.riskWeight >= 75;
//                     const isMod = node.riskWeight >= 40 && node.riskWeight < 75;
//                     const nodeColor = isHigh
//                       ? "#b91c1c"
//                       : isMod
//                         ? "#d97706"
//                         : "#15803d";

//                     return (
//                       <g
//                         key={node.id}
//                         className="cursor-pointer group"
//                         onMouseEnter={() => setHoveredRegion(node)}
//                         onMouseLeave={() => setHoveredRegion(null)}
//                       >
//                         <circle
//                           cx={node.x}
//                           cy={node.y}
//                           r="22"
//                           fill={nodeColor}
//                           fillOpacity="0.12"
//                           className="animate-ping origin-center"
//                           style={{
//                             animationDuration: isHigh ? "1.8s" : "2.8s",
//                           }}
//                         />
//                         <circle
//                           cx={node.x}
//                           cy={node.y}
//                           r="15"
//                           fill={nodeColor}
//                           fillOpacity="0.1"
//                         />
//                         <circle
//                           cx={node.x}
//                           cy={node.y}
//                           r="5"
//                           fill={nodeColor}
//                           stroke="#ffffff"
//                           strokeWidth="1.5"
//                           className="transition-transform group-hover:scale-125 origin-center"
//                         />
//                       </g>
//                     );
//                   })}
//                 </svg>
//               </div>
//             )}
//           </div>

//           <div className="bg-gray-50 text-center p-3 border-t border-gray-100">
//             <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
//               Interactive Canvas · Hover elements for specific regional logs
//             </span>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: SIDE ANALYTICS PANEL (SPAN: 1) */}
//         <div className="lg:col-span-1 space-y-4">
//           {/* Risk Legend Spectrum Badge metrics */}
//           <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
//             <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest border-b border-gray-50 pb-2">
//               Risk Legend Spectrum
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <span className="w-3.5 h-3.5 rounded bg-[#15803d] block" />
//                   <span className="text-xs font-bold text-gray-700">
//                     Low Risk Zones
//                   </span>
//                 </div>
//                 <span className="text-xs font-black text-gray-400">
//                   {lowRiskCount} Nodes Cluster
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <span className="w-3.5 h-3.5 rounded bg-[#d97706] block" />
//                   <span className="text-xs font-bold text-gray-700">
//                     Moderate Risk Zones
//                   </span>
//                 </div>
//                 <span className="text-xs font-black text-gray-400">
//                   {modRiskCount} Nodes Cluster
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2.5">
//                   <span className="w-3.5 h-3.5 rounded bg-[#b91c1c] block" />
//                   <span className="text-xs font-bold text-gray-700">
//                     High Risk Threat Levels
//                   </span>
//                 </div>
//                 <span className="text-xs font-black text-gray-400">
//                   {highRiskCount} Nodes Cluster
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Active Outbreak Incidents Ledger */}
//           <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
//             <div>
//               <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
//                 Active Vector Incidents
//               </h3>
//               <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">
//                 AGGREGATE:{" "}
//                 {filteredNodes.reduce(
//                   (acc, node) => acc + (node.incidents || 0),
//                   0,
//                 ) || 94}{" "}
//                 TOTAL SYSTEM ALERTS RELEASED
//               </p>
//             </div>

//             <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
//               {(mapData.activeIncidents && mapData.activeIncidents.length > 0
//                 ? mapData.activeIncidents
//                 : [
//                     {
//                       location: "Karnal",
//                       disease: "Blast Disease",
//                       severity: "High",
//                       reportedAt: "2 hours ago",
//                       affectedArea: "340 acres",
//                     },
//                     {
//                       location: "Panipat",
//                       disease: "Yellow Rust",
//                       severity: "Moderate",
//                       reportedAt: "4 hours ago",
//                       affectedArea: "180 acres",
//                     },
//                     {
//                       location: "Sirsa",
//                       disease: "Whitefly",
//                       severity: "High",
//                       reportedAt: "1 day ago",
//                       affectedArea: "210 acres",
//                     },
//                     {
//                       location: "Faridabad",
//                       disease: "Sheath Blight",
//                       severity: "Moderate",
//                       reportedAt: "3 days ago",
//                       affectedArea: "145 acres",
//                     },
//                   ]
//               ).map((incident, idx) => {
//                 const isHigh = incident.severity.toLowerCase() === "high";
//                 const isMod = incident.severity.toLowerCase() === "moderate";

//                 const cardClass = isHigh
//                   ? "bg-red-50/60 border-red-100 text-red-700"
//                   : isMod
//                     ? "bg-amber-50/50 border-amber-100 text-amber-700"
//                     : "bg-emerald-50/50 border-emerald-100 text-emerald-700";

//                 const badgeColor = isHigh
//                   ? "text-[#b91c1c] border-red-200"
//                   : isMod
//                     ? "text-[#d97706] border-amber-200"
//                     : "text-[#15803d] border-emerald-200";

//                 const textLabelColor = isHigh
//                   ? "text-[#b91c1c]"
//                   : isMod
//                     ? "text-[#d97706]"
//                     : "text-[#15803d]";

//                 return (
//                   <div
//                     key={idx}
//                     className={`border rounded-xl p-3.5 flex items-center justify-between gap-3 hover:opacity-90 transition-colors ${cardClass}`}
//                   >
//                     <div className="space-y-1">
//                       <h4 className="text-xs font-black text-gray-900">
//                         {incident.location} Region
//                       </h4>
//                       <p
//                         className={`text-[9px] font-extrabold uppercase tracking-widest block ${textLabelColor}`}
//                       >
//                         {incident.reportedAt.toUpperCase()} · DISEASE:{" "}
//                         {incident.disease.toUpperCase()}
//                       </p>
//                     </div>
//                     <span
//                       className={`bg-white border px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase shrink-0 font-sans shadow-sm ${badgeColor}`}
//                     >
//                       {incident.affectedArea}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// components/RegionHeatmap.jsx (Updated)
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  MapPin,
  ChevronDown,
  Loader2,
  Activity,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";
import {
  fetchAllRegionsWeather,
  filterRegions,
  calculateDiseaseRisk,
} from "../../../logic/heatmapRiskEngine";

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

// GeoChart options
const geoChartOptions = {
  region: "IN",
  domain: "IN",
  displayMode: "regions",
  resolution: "provinces",
  colorAxis: {
    minValue: 1,
    maxValue: 3,
    colors: ["#15803d", "#d97706", "#b91c1c"],
  },
  backgroundColor: "transparent",
  datalessRegionColor: "#cbd5e1",
  defaultColor: "#cbd5e1",
  borderOptions: { color: "#ffffff", width: 2 },
  keepAspectRatio: true,
  tooltip: {
    textStyle: {
      color: "#132a13",
      fontName: "Plus Jakarta Sans",
      fontSize: 12,
    },
    trigger: "focus",
  },
};

const STATE_ISO_MAP = {
  haryana: "IN-HR",
  punjab: "IN-PB",
  "uttar pradesh": "IN-UP",
  rajasthan: "IN-RJ",
};

const buildStateSummary = (nodes = []) => {
  const maxRisks = {};
  nodes.forEach((node) => {
    if (!node.state) return;
    let value = node.riskScore >= 75 ? 3 : node.riskScore >= 40 ? 2 : 1;
    const isoKey = STATE_ISO_MAP[node.state.toLowerCase()] || node.state;
    maxRisks[isoKey] = Math.max(maxRisks[isoKey] || 0, value);
  });
  return Object.entries(maxRisks);
};

export default function DiseaseHeatmap() {
  const [selectedState, setSelectedState] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState("All");
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [weatherSource, setWeatherSource] = useState("Open-Meteo");

  // GIS Layer Toggles
  const [activeLayer, setActiveLayer] = useState("Farmer Report"); // "Government Outbreak", "Farmer Report", "Historical Disease", "Satellite Disease"

  // Spread Simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [windDirection, setWindDirection] = useState("North-East");
  const simIntervalRef = useRef(null);

  // Leaflet references and loader state
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);
  const simulationLayerGroupRef = useRef(null);

  const filteredRegions = useMemo(() => {
    return filterRegions(regions, selectedState, selectedDisease);
  }, [regions, selectedState, selectedDisease]);

  // Dynamic Leaflet CSS and JS Injector
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

  // Initialize Map once Leaflet assets are loaded
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current || mapInstance.current) return;

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([22.5937, 78.9629], 4.5);

    mapInstance.current = map;

    window.L.tileLayer(
      `https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
      {
        attribution: '&copy; MapTiler',
        maxZoom: 18,
      }
    ).addTo(map);

    const layerGroup = window.L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    const simulationLayerGroup = window.L.layerGroup().addTo(map);
    simulationLayerGroupRef.current = simulationLayerGroup;

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
  }, [mapLoaded]);

  // Center map on state changes
  useEffect(() => {
    if (!mapInstance.current || !window.L) return;

    const STATE_CENTERS = {
      All: { coords: [22.5937, 78.9629], zoom: 4.5 },
      Haryana: { coords: [29.0588, 76.0856], zoom: 8 },
      Punjab: { coords: [31.1471, 75.3412], zoom: 8 },
      "Uttar Pradesh": { coords: [26.8467, 80.9462], zoom: 7 },
      Rajasthan: { coords: [27.0238, 74.2179], zoom: 7 },
    };

    const target = STATE_CENTERS[selectedState] || STATE_CENTERS["All"];
    mapInstance.current.setView(target.coords, target.zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [selectedState]);

  // Redraw markers when regions data changes
  useEffect(() => {
    if (!mapInstance.current || !layerGroupRef.current || !window.L) return;

    layerGroupRef.current.clearLayers();

    filteredRegions.forEach((region) => {
      const nodeColor = region.riskScore >= 75
        ? "#ef4444"
        : region.riskScore >= 40
          ? "#f59e0b"
          : "#10b981";

      const colorPrefix = region.riskScore >= 75
        ? "red"
        : region.riskScore >= 40
          ? "amber"
          : "emerald";

      // Create a gorgeous custom HTML/Tailwind pulsating marker
      const markerIcon = window.L.divIcon({
        className: "!bg-transparent !border-none",
        html: `
          <div class="relative flex items-center justify-center w-6 h-6">
            <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-${colorPrefix}-400 opacity-75" style="animation-duration: 2.5s;"></span>
            <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-${colorPrefix}-500 border-2 border-white shadow-md"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Main Marker
      const marker = window.L.marker([region.lat, region.lon], {
        icon: markerIcon,
      });

      // Bind rich popup
      marker.bindPopup(`
        <div style="color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; min-width: 160px; text-align: left;">
          <h4 style="margin: 0; font-weight: 900; font-size: 12px; color: #132a13;">${region.name} District</h4>
          <p style="margin: 4px 0 2px;"><b>State:</b> ${region.state}</p>
          <p style="margin: 2px 0 2px;"><b>Primary Crop:</b> ${region.crop}</p>
          <p style="margin: 2px 0 2px;"><b>Temperature:</b> ${region.temperature}°C</p>
          <p style="margin: 2px 0 2px;"><b>Humidity:</b> ${region.humidity}%</p>
          <p style="margin: 2px 0 2px;"><b>Risk Score:</b> <span style="color: ${nodeColor}; font-weight: 900;">${region.riskScore}%</span></p>
          <p style="margin: 4px 0 0; border-top: 1px solid #e2e8f0; padding-top: 4px; font-weight: bold; color: #31572c;"><b>Disease:</b> ${region.disease}</p>
        </div>
      `);

      // Mouseover/out handlers for district profile card
      marker.on("mouseover", (e) => {
        setHoveredRegion(region);
      });
      marker.on("mouseout", (e) => {
        setHoveredRegion(null);
      });

      marker.addTo(layerGroupRef.current);
    });
  }, [filteredRegions]);

  // Redraw simulation rings on a separate layer group
  useEffect(() => {
    if (!mapInstance.current || !simulationLayerGroupRef.current || !window.L) return;

    simulationLayerGroupRef.current.clearLayers();

    if (!isSimulating) return;

    filteredRegions.forEach((region) => {
      const nodeColor = region.riskScore >= 75
        ? "#ef4444"
        : region.riskScore >= 40
          ? "#f59e0b"
          : "#10b981";

      let latOffset = 0;
      let lonOffset = 0;
      const driftFactor = simTime * 0.0015;

      if (windDirection === "North-East") {
        latOffset = driftFactor;
        lonOffset = driftFactor;
      } else if (windDirection === "North-West") {
        latOffset = driftFactor;
        lonOffset = -driftFactor;
      } else if (windDirection === "South-East") {
        latOffset = -driftFactor;
        lonOffset = driftFactor;
      } else if (windDirection === "South-West") {
        latOffset = -driftFactor;
        lonOffset = -driftFactor;
      }

      const simCenter = [region.lat + latOffset, region.lon + lonOffset];
      const simRadius = 12000 + (simTime * 3500);

      window.L.circle(simCenter, {
        color: nodeColor,
        fillColor: nodeColor,
        fillOpacity: 0.06,
        radius: simRadius,
        weight: 1.5,
        dashArray: "4 4",
        interactive: false, // Critical: stops rings from intercepting mouse events and causing hover flicker
      }).addTo(simulationLayerGroupRef.current);
    });
  }, [filteredRegions, isSimulating, simTime, windDirection]);

  const runSimulation = () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setIsSimulating(true);
    setSimTime(0);
    const windDirections = ["North-East", "North-West", "South-East", "South-West"];
    setWindDirection(windDirections[Math.floor(Math.random() * windDirections.length)]);
    
    let count = 0;
    simIntervalRef.current = setInterval(() => {
      count += 1;
      setSimTime(count);
      if (count >= 10) {
        clearInterval(simIntervalRef.current);
        setIsSimulating(false);
      }
    }, 1000);
  };

  const loadHeatmapData = useCallback(async () => {
    setIsLoading(true);
    try {
      const liveRegions = await fetchAllRegionsWeather();

      // Load overrides from localStorage
      try {
        const overrides = JSON.parse(localStorage.getItem("heatmapRiskUpdates") || "{}");
        liveRegions.forEach(region => {
          if (overrides[region.name]) {
            region.riskScore = overrides[region.name].riskScore;
            region.riskWeight = overrides[region.name].riskScore;
            region.riskLevel = overrides[region.name].riskLevel;
            if (overrides[region.name].crop) {
              region.crop = overrides[region.name].crop;
            }
          }
        });
      } catch (e) {
        console.error("Failed to parse heatmap overrides", e);
      }

      setRegions(liveRegions);
      setLastUpdated(new Date());
      setWeatherSource("Open-Meteo Live Data");
    } catch (error) {
      console.error("Failed to load disease heatmap data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHeatmapData();
    const interval = setInterval(() => loadHeatmapData(), 10 * 60 * 1000);
    return () => {
      clearInterval(interval);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [loadHeatmapData]);

  const highRiskCount = filteredRegions.filter((r) => r.riskScore >= 75).length;
  const modRiskCount = filteredRegions.filter(
    (r) => r.riskScore >= 40 && r.riskScore < 75,
  ).length;
  const lowRiskCount = filteredRegions.filter((r) => r.riskScore < 40).length;
  const totalAlerts = filteredRegions.reduce(
    (acc, r) => acc + (r.incidents || 0),
    0,
  );

  const getRiskColor = (score) => {
    if (score >= 75)
      return {
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
        badge: "bg-red-100 text-red-800",
      };
    if (score >= 40)
      return {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-800",
      };
    return {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-800",
    };
  };

  // Dynamic SVG ViewBox to auto-zoom on selected region
  let viewBox = "0 0 500 500";
  if (selectedState !== "All" && filteredRegions.length > 0) {
    const xs = filteredRegions.map(r => r.x);
    const ys = filteredRegions.map(r => r.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const width = Math.max(maxX - minX, 80);
    const height = Math.max(maxY - minY, 80);
    
    const padding = 70;
    const x = Math.max(0, minX - padding);
    const y = Math.max(0, minY - padding);
    const w = Math.min(500, width + padding * 2);
    const h = Math.min(500, height + padding * 2);
    viewBox = `${x} ${y} ${w} ${h}`;
  }

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#132a13] to-[#31572c] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-[#ecf39e]" />
          <h1 className="text-2xl font-black tracking-tight">
            Disease Risk Intelligence Map
          </h1>
        </div>
        <p className="text-white/80 text-sm font-semibold">
          Real-time disease pressure monitoring powered by live weather data and manual predictions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
            State / Region
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800"
          >
            {STATE_LIST.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All India" : s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
            Disease Type
          </label>
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800"
          >
            {DISEASE_LIST.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={loadHeatmapData}
            disabled={isLoading}
            className="px-4 py-2 bg-brand-dark hover:bg-[#132a13] text-white rounded-lg font-black text-sm transition flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            Refresh Data
          </button>
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="flex items-center justify-between bg-[#f4f7f4] rounded-xl px-4 py-2 border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider text-green-700 uppercase">
            LIVE WEATHER SYNCHRONIZED
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold">
          <span>Source: {weatherSource}</span>
          {lastUpdated && (
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {/* GIS Layer Toggles */}
      <div className="flex flex-wrap gap-2.5">
        {["Government Outbreak", "Farmer Report", "Historical Disease", "Satellite Disease"].map((layer) => (
          <button
            key={layer}
            type="button"
            onClick={() => setActiveLayer(layer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
              activeLayer === layer
                ? "bg-brand-dark border-[#31572c] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {layer} Layer
          </button>
        ))}
      </div>

      {/* Main Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAP COLUMN */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-[#f4f7f4]/20 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              {selectedState === "All"
                ? `National Disease Risk Distribution — ${activeLayer} View`
                : `${selectedState} Regional Overrides — ${activeLayer} View`}
            </h2>
            {selectedState !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedState("All")}
                className="text-xs font-black text-[#31572c] hover:underline cursor-pointer"
              >
                &larr; National Map
              </button>
            )}
          </div>

          <div className="relative min-h-[500px] flex-1 flex flex-col bg-white dark:bg-brand-darkest">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-brand-darkest/70 z-20">
                <Loader2 className="h-10 w-10 text-[#31572c] animate-spin" />
              </div>
            )}

            {hoveredRegion && (
              <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-30 w-64 space-y-2 animate-in fade-in zoom-in text-left">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-[8px] font-black text-gray-400 uppercase block">
                    District Profile
                  </span>
                  <h4 className="text-sm font-black text-gray-900">
                    {hoveredRegion.name}, {hoveredRegion.state}
                  </h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Primary Crop:</span>
                    <span className="font-bold text-gray-900">{hoveredRegion.crop}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Thermometer className="w-3 h-3" /> Temp:
                    </div>
                    <span className="font-bold text-gray-900">
                      {hoveredRegion.temperature}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Droplets className="w-3 h-3" /> Humidity:
                    </div>
                    <span className="font-bold text-gray-900">{hoveredRegion.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Wind className="w-3 h-3" /> Wind:
                    </div>
                    <span className="font-bold text-gray-900">
                      {hoveredRegion.windSpeed} km/h
                    </span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                  <div className="text-[8px] font-bold text-red-500 uppercase">
                    Risk Assessment Score
                  </div>
                  <div className="text-2xl font-black text-red-700">
                    {hoveredRegion.riskScore}%
                  </div>
                  <div className="text-xs font-black text-red-800">
                    {hoveredRegion.disease}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 flex items-stretch min-h-[500px] w-full relative z-0">
              <div
                ref={mapRef}
                className="w-full h-full min-h-[500px] z-0"
              />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-brand-darkest/80 z-20 text-[#31572c] dark:text-[#ecf39e] text-xs font-black">
                  <Loader2 className="h-8 w-8 text-[#31572c] dark:text-[#ecf39e] animate-spin mr-2" />
                  Initializing Spatial Vector Map Engine...
                </div>
              )}
            </div>

            {/* GIS Spread Simulation Console */}
            {selectedState !== "All" && (
              <div className="bg-[#f4f7f4]/95 border border-slate-200/80 dark:bg-brand-darkest/95 dark:border-brand-dark/25 text-slate-800 dark:text-white rounded-xl p-4 shadow-md space-y-3 mx-4 mb-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#31572c] dark:text-[#ecf39e]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#31572c] dark:text-[#ecf39e]">
                      GIS Vector Spread Simulation
                    </span>
                  </div>
                  {isSimulating && (
                    <span className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest animate-pulse">
                      Simulating spores drift...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-white/50 uppercase block">Simulation Target</span>
                    <span className="text-xs font-black">{selectedState} Region</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-white/50 uppercase block">Wind Direction Vector</span>
                    <span className="text-xs font-black flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-[#31572c] dark:text-[#ecf39e]" />
                      {windDirection} (14 km/h)
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={runSimulation}
                      disabled={isSimulating}
                      className="w-full py-1.5 bg-brand-dark hover:bg-[#132a13] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      {isSimulating ? `Running (${simTime}s)` : "Simulate Spread"}
                    </button>
                  </div>
                </div>

                {isSimulating && (
                  <div className="space-y-1 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-slate-500 dark:text-white/60">Pathogen Ring Spread Radius</span>
                      <span className="text-[#31572c] dark:text-[#ecf39e]">{simTime * 15} Meters</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full" style={{ width: `${simTime * 10}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ANALYTICS PANEL */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest mb-3">
              Risk Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Low Risk
                </span>
                <span className="font-black">{lowRiskCount} Districts</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                <span className="text-sm font-bold text-amber-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Moderate Risk
                </span>
                <span className="font-black">{modRiskCount} Districts</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                <span className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  High Risk
                </span>
                <span className="font-black">{highRiskCount} Districts</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
                Active Disease Incidents
              </h3>
              <span className="text-[10px] font-black text-gray-400">
                Total: {totalAlerts} Alerts
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredRegions.slice(0, 8).map((region) => {
                const colors = getRiskColor(region.riskScore);
                return (
                  <div
                    key={region.id}
                    className={`border rounded-xl p-3 cursor-pointer transition ${colors.bg}`}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {region.name}
                        </h4>
                        <p className="text-[9px] font-extrabold uppercase tracking-wider mt-0.5">
                          {region.reportedAt} · {region.disease}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${colors.badge}`}
                      >
                        {region.affectedArea}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${region.riskScore}%`,
                            backgroundColor:
                              region.riskScore >= 75
                                ? "#b91c1c"
                                : region.riskScore >= 40
                                  ? "#d97706"
                                  : "#15803d",
                          }}
                        />
                      </div>
                      <span className="text-[9px] font-bold">
                        {region.riskScore}% Risk
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
