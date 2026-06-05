// import React from "react";
// import { X, Plus, HelpCircle, Columns } from "lucide-react";

// export default function MultiCropCompare() {
//   // Static crop configurations matching the visualization matrix
//   const selectedCrops = [
//     { id: "wheat", name: "Wheat", color: "#4f772d" },
//     { id: "rice", name: "Rice", color: "#132a13" },
//     { id: "maize", name: "Maize", color: "#90a955" },
//   ];

//   const attributes = [
//     {
//       label: "Suitability Score",
//       wheat: { value: "92/100", status: "optimal" },
//       rice: { value: "85/100", status: "neutral" },
//       maize: { value: "78/100", status: "warning" },
//     },
//     {
//       label: "Yield (qtl/acre)",
//       wheat: { value: "22 qtl", status: "neutral" },
//       rice: { value: "18 qtl", status: "warning" },
//       maize: { value: "25 qtl", status: "optimal" },
//     },
//     {
//       label: "ROI (₹/acre)",
//       wheat: { value: "₹18,400", status: "optimal" },
//       rice: { value: "₹15,200", status: "neutral" },
//       maize: { value: "₹12,800", status: "warning" },
//     },
//     {
//       label: "Water Need",
//       wheat: { value: "Medium", status: "optimal" },
//       rice: { value: "Very High", status: "warning" },
//       maize: { value: "Medium", status: "optimal" },
//     },
//     {
//       label: "Pest Risk",
//       wheat: { value: "Low", status: "optimal" },
//       rice: { value: "High", status: "warning" },
//       maize: { value: "Medium", status: "neutral" },
//     },
//     {
//       label: "Market Demand",
//       wheat: { value: "Very High", status: "optimal" },
//       rice: { value: "Very High", status: "optimal" },
//       maize: { value: "High", status: "warning" },
//     },
//     {
//       label: "Harvest Days",
//       wheat: { value: "120 days", status: "neutral" },
//       rice: { value: "135 days", status: "warning" },
//       maize: { value: "90 days", status: "optimal" },
//     },
//   ];

//   const getBadgeStyle = (status) => {
//     switch (status) {
//       case "optimal":
//         return "bg-[#ecf39e] text-[#132a13] font-bold";
//       case "warning":
//         return "bg-red-50 text-red-750 border border-red-200/50 font-medium";
//       default:
//         return "text-gray-900 font-medium";
//     }
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased">
//       {/* Page Header */}
//       <div>
//         <div className="flex items-center gap-2.5">
//           <Columns className="h-6.5 w-6.5 text-[#31572c]" />
//           <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
//             <span>Multi-Crop Comparison Matrix</span>
//             <span className="text-gray-300 font-light text-xl">|</span>
//             <span className="text-[#31572c] font-bold text-sm md:text-base">
//               फसल तुलना
//             </span>
//           </h1>
//         </div>
//         <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
//           Compare crop suitability, water demands, harvest cycles, and economic returns side-by-side.
//         </p>
//       </div>

//       <div className="space-y-4">
//         {/* --- TOP BANNER / CONTROLS --- */}
//         <div className="flex flex-wrap items-center gap-3">
//           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block w-full mb-1">
//             Compare up to 4 crops side-by-side
//           </span>

//           {/* Active Chips */}
//           {selectedCrops.map((crop) => (
//             <div
//               key={crop.id}
//               className="flex items-center gap-1.5 bg-[#31572c] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
//             >
//               <span>{crop.name}</span>
//               <button className="hover:text-[#ecf39e] transition-colors cursor-pointer">
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           ))}

//           {/* Add Crop Button */}
//           <button className="flex items-center gap-1.5 border-2 border-dashed border-[#90a955] text-[#31572c] bg-white/60 hover:bg-white px-3 py-1.2 rounded-full text-xs font-bold transition-all cursor-pointer">
//             <Plus className="w-3.5 h-3.5" />
//             <span>Add Crop</span>
//           </button>
//         </div>

//         {/* --- MAIN SPLIT CONTAINER --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           {/* TABLE COMPARISON CANVAS */}
//           <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-[#f4f7f4]/50">
//                     <th className="p-4 text-xs font-bold text-[#31572c] tracking-wide uppercase max-w-[160px]">
//                       Attribute
//                     </th>
//                     <th className="p-4 text-sm font-black text-[#4f772d] tracking-tight">
//                       Wheat
//                     </th>
//                     <th className="p-4 text-sm font-black text-[#132a13] tracking-tight">
//                       Rice
//                     </th>
//                     <th className="p-4 text-sm font-black text-[#90a955] tracking-tight">
//                       Maize
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {attributes.map((row, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-[#f4f7f4]/30 transition-colors"
//                     >
//                       {/* Attribute Label */}
//                       <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider max-w-[160px]">
//                         {row.label}
//                       </td>

//                       {/* Wheat Metrics */}
//                       <td className="p-4 text-sm">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-xs inline-block ${getBadgeStyle(row.wheat.status)}`}
//                         >
//                           {row.wheat.value}
//                         </span>
//                       </td>

//                       {/* Rice Metrics */}
//                       <td className="p-4 text-sm">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-xs inline-block ${getBadgeStyle(row.rice.status)}`}
//                         >
//                           {row.rice.value}
//                         </span>
//                       </td>

//                       {/* Maize Metrics */}
//                       <td className="p-4 text-sm">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-xs inline-block ${getBadgeStyle(row.maize.status)}`}
//                         >
//                           {row.maize.value}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* RADAR OVERVIEW CARD */}
//           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
//             <div>
//               <h3 className="text-sm font-bold text-gray-950 tracking-tight mb-4 flex items-center gap-1.5">
//                 Radar Overview
//                 <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
//               </h3>

//               {/* Vector Radar Visualization */}
//               <div className="relative w-full aspect-square max-w-[260px] mx-auto my-2 flex items-center justify-center">
//                 <svg
//                   viewBox="0 0 100 100"
//                   className="w-full h-full transform -rotate-18"
//                 >
//                   {/* Concentric Web Grid Lines */}
//                   <polygon
//                     points="50,10 88,38 73,83 27,83 12,38"
//                     fill="none"
//                     stroke="#e5e7eb"
//                     strokeWidth="0.75"
//                   />
//                   <polygon
//                     points="50,22 78,42 67,74 33,74 22,42"
//                     fill="none"
//                     stroke="#e5e7eb"
//                     strokeWidth="0.5"
//                     strokeDasharray="1"
//                   />
//                   <polygon
//                     points="50,34 69,47 61,65 39,65 31,47"
//                     fill="none"
//                     stroke="#e5e7eb"
//                     strokeWidth="0.5"
//                   />

//                   {/* Axis Spokes */}
//                   <line
//                     x1="50"
//                     y1="50"
//                     x2="50"
//                     y2="10"
//                     stroke="#f3f4f6"
//                     strokeWidth="0.75"
//                   />
//                   <line
//                     x1="50"
//                     y1="50"
//                     x2="88"
//                     y2="38"
//                     stroke="#f3f4f6"
//                     strokeWidth="0.75"
//                   />
//                   <line
//                     x1="50"
//                     y1="50"
//                     x2="73"
//                     y2="83"
//                     stroke="#f3f4f6"
//                     strokeWidth="0.75"
//                   />
//                   <line
//                     x1="50"
//                     y1="50"
//                     x2="27"
//                     y2="83"
//                     stroke="#f3f4f6"
//                     strokeWidth="0.75"
//                   />
//                   <line
//                     x1="50"
//                     y1="50"
//                     x2="12"
//                     y2="38"
//                     stroke="#f3f4f6"
//                     strokeWidth="0.75"
//                   />

//                   {/* Wheat Polygon Array (Active Element Green #4f772d) */}
//                   <polygon
//                     points="50,16 82,39 68,75 34,70 18,39"
//                     fill="#4f772d"
//                     fillOpacity="0.15"
//                     stroke="#4f772d"
//                     strokeWidth="1.5"
//                   />

//                   {/* Rice Polygon Array (Deep Forest Green #132a13) */}
//                   <polygon
//                     points="50,24 74,40 60,80 40,81 24,45"
//                     fill="#132a13"
//                     fillOpacity="0.1"
//                     stroke="#132a13"
//                     strokeWidth="1.5"
//                   />

//                   {/* Maize Polygon Array (Sage Accent #90a955) */}
//                   <polygon
//                     points="50,28 85,38 65,68 31,78 20,41"
//                     fill="#90a955"
//                     fillOpacity="0.15"
//                     stroke="#90a955"
//                     strokeWidth="1.5"
//                   />
//                 </svg>

//                 {/* Fixed Labels overlaid around the SVG container */}
//                 <span className="absolute top-0 text-[9px] font-black uppercase text-gray-400 tracking-widest">
//                   Suit.
//                 </span>
//                 <span className="absolute right-0 top-[35%] text-[9px] font-black uppercase text-gray-400 tracking-widest">
//                   Yield
//                 </span>
//                 <span className="absolute right-3 bottom-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">
//                   ROI
//                 </span>
//                 <span className="absolute bottom-0 text-[9px] font-black uppercase text-gray-400 tracking-widest">
//                   Water
//                 </span>
//                 <span className="absolute left-3 bottom-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">
//                   Pest
//                 </span>
//                 <span className="absolute left-0 top-[35%] text-[9px] font-black uppercase text-gray-400 tracking-widest">
//                   Demand
//                 </span>
//               </div>
//             </div>

//             {/* Micro Telemetry Legend System */}
//             <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
//               <div className="flex items-center gap-2">
//                 <span className="w-2.5 h-2.5 rounded-full bg-[#4f772d]"></span>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
//                   Wheat
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-2.5 h-2.5 rounded-full bg-[#132a13]"></span>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
//                   Rice
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-2.5 h-2.5 rounded-full bg-[#90a955]"></span>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
//                   Maize
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Columns,
  Landmark,
  Sparkles,
  AlertTriangle,
  Eye,
  Info,
} from "lucide-react";
import { profileApi } from "../../../services/apiService";

const ALL_REGION_CROPS = [
  {
    id: "wheat",
    name: "Wheat",
    color: "#4f772d",
    suitability: 92,
    baseYield: 19,
    baseRoi: 18400,
    water: 40,
    pest: 20,
    market: 90,
    waterLabel: "Medium",
    pestLabel: "Low",
    harvest: "120 days",
    status: "optimal",
    trend: "+1.9%",
  },
  {
    id: "rice",
    name: "Rice",
    color: "#132a13",
    suitability: 85,
    baseYield: 22,
    baseRoi: 15200,
    water: 90,
    pest: 80,
    market: 85,
    waterLabel: "Very High",
    pestLabel: "High",
    harvest: "135 days",
    status: "warning",
    trend: "-1.4%",
  },
  {
    id: "mustard",
    name: "Mustard",
    color: "#7f9c67",
    suitability: 74,
    baseYield: 7.5,
    baseRoi: 11000,
    water: 25,
    pest: 45,
    market: 70,
    waterLabel: "Low",
    pestLabel: "Medium",
    harvest: "110 days",
    status: "neutral",
    trend: "+0.5%",
  },
  {
    id: "maize",
    name: "Maize",
    color: "#90a955",
    suitability: 78,
    baseYield: 21,
    baseRoi: 12800,
    water: 50,
    pest: 50,
    market: 75,
    waterLabel: "Medium",
    pestLabel: "Medium",
    harvest: "90 days",
    status: "optimal",
    trend: "+3.1%",
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    color: "#31572c",
    suitability: 72,
    baseYield: 340,
    baseRoi: 45000,
    water: 80,
    pest: 50,
    market: 80,
    waterLabel: "High",
    pestLabel: "Medium",
    harvest: "300 days",
    status: "neutral",
    trend: "+1.1%",
  },
  {
    id: "cotton",
    name: "Cotton",
    color: "#a3b18a",
    suitability: 65,
    baseYield: 8.5,
    baseRoi: 22000,
    water: 55,
    pest: 70,
    market: 72,
    waterLabel: "Medium",
    pestLabel: "High",
    harvest: "165 days",
    status: "warning",
    trend: "+0.8%",
  },
  {
    id: "bajra",
    name: "Bajra",
    color: "#556b2f",
    suitability: 55,
    baseYield: 9.2,
    baseRoi: 9500,
    water: 20,
    pest: 20,
    market: 65,
    waterLabel: "Low",
    pestLabel: "Low",
    harvest: "85 days",
    status: "optimal",
    trend: "+1.5%",
  },
  {
    id: "moong",
    name: "Moong",
    color: "#2e4f4f",
    suitability: 48,
    baseYield: 5.5,
    baseRoi: 14000,
    water: 15,
    pest: 15,
    market: 60,
    waterLabel: "Low",
    pestLabel: "Low",
    harvest: "70 days",
    status: "neutral",
    trend: "-0.2%",
  },
];

const RADAR_AXES = ["suitability", "yield", "roi", "water", "pest", "market"];
const CENTER = 50;
const MAX_RADIUS = 38; // Slightly compressed safety radius to guarantee zero boundary clipping

export default function MultiCropCompare() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [currentAcreage, setCurrentAcreage] = useState(5);
  const [dataSource, setDataSource] = useState("Local Ingestion Registry");
  const [focusedCropId, setFocusedCropId] = useState("wheat");

  useEffect(() => {
    const loadProfileFarms = async () => {
      try {
        const res = await profileApi.getProfile();
        if (res?.success && res?.data?.farms && res.data.farms.length > 0) {
          setFarms(res.data.farms);
          const defaultFarm = res.data.farms[0];
          setSelectedFarmId(defaultFarm._id);
          setCurrentAcreage(defaultFarm.totalLand || 5);
        }
      } catch (err) {
        console.warn("Using offline standalone fallbacks.");
      }
    };
    loadProfileFarms();
  }, []);

  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
    const activeFarm = farms.find((f) => f._id === farmId);
    if (activeFarm) {
      setCurrentAcreage(activeFarm.totalLand || 5);
    }
  };

  // âœ¨ RESTRUCTURED MATHEMATICAL MODEL: Uniform axis-specific scaling mapping values 0-100 perfectly
  const getNormalizedAxisValue = (axis, crop) => {
    switch (axis) {
      case "suitability":
        return crop.suitability;
      case "yield":
        // Evaluate dynamic yields based on crop profile categories (Tonnage perennials vs low-yield legumes)
        if (crop.id === "sugarcane") return 85;
        if (crop.baseYield > 20) return 80;
        if (crop.baseYield > 10) return 65;
        return 45; // Baseline floor for micro-yield pulses
      case "roi":
        // Maps financial profit return ratios cleanly to fit web charts symmetrically
        if (crop.baseRoi > 40000) return 90;
        if (crop.baseRoi > 20000) return 75;
        if (crop.baseRoi > 14000) return 60;
        return 40;
      case "water":
        return crop.water;
      case "pest":
        // Invert pest risk mapping: higher vulnerability shortens vector distance to highlight weakness
        return 100 - crop.pest;
      case "market":
        return crop.market;
      default:
        return 50;
    }
  };

  const generateRadarPoints = (crop) => {
    return RADAR_AXES.map((axis, index) => {
      // 60-degree rotational spacing intervals around the layout circle
      const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2;
      const valuePct = getNormalizedAxisValue(axis, crop);

      const radius = (valuePct / 100) * MAX_RADIUS;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case "optimal":
        return "bg-[#ecf39e] text-[#132a13] font-black border border-[#31572c]/30 shadow-sm";
      case "warning":
        return "bg-red-50 text-red-950 border border-red-300 font-bold";
      default:
        return "bg-gray-50 text-gray-950 font-bold border border-gray-300";
    }
  };

  const focusedCropData =
    ALL_REGION_CROPS.find((c) => c.id === focusedCropId) || ALL_REGION_CROPS[0];

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Columns className="h-6.5 w-6.5 text-[#31572c]" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
              <span>Multi-Crop Comparison Matrix</span>
              <span className="text-gray-300 font-light text-xl">|</span>
              <span className="text-[#31572c] font-black text-sm md:text-base">
                फसल तुलना Matrix
              </span>
            </h1>
          </div>
          <p className="text-gray-900 text-[11px] md:text-xs font-semibold mt-1.5">
            Side-by-side agricultural parameters evaluated against active
            regional farm boundaries.
          </p>
        </div>
      </div>

      {/* Profile Farm Selector Bar */}
      {farms.length > 0 && (
        <div className="bg-[#f4f7f4] border border-gray-300 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#31572c]" />
            <span className="text-xs font-black text-gray-950 uppercase tracking-wide">
              Evaluate Metrics Against Active Land Unit:
            </span>
          </div>
          <select
            value={selectedFarmId}
            onChange={(e) => handleFarmChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[240px]"
          >
            {farms.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.totalLand} Acres)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* DATA MATRIX TABLE */}
      <div className="bg-white rounded-2xl p-1 border border-gray-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-100">
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase w-[240px] bg-gray-200 border-r border-gray-300">
                  Attribute Matrix
                </th>
                {ALL_REGION_CROPS.map((crop) => (
                  <th
                    key={crop.id}
                    onClick={() => setFocusedCropId(crop.id)}
                    className={`p-4 text-xs font-black tracking-tight text-center cursor-pointer transition-colors ${
                      focusedCropId === crop.id
                        ? "bg-[#31572c]/10 text-[#132a13]"
                        : "text-gray-950 hover:bg-gray-50"
                    }`}
                    style={{ borderTop: `4px solid ${crop.color}` }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>{crop.name}</span>
                      {focusedCropId === crop.id && (
                        <Eye className="w-3 h-3 text-[#31572c]" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Suitability Score
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-sm text-center ${focusedCropId === c.id ? "bg-[#31572c]/5 font-extrabold" : ""}`}
                  >
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1 ${getBadgeStyle(c.status)}`}
                    >
                      {c.status === "warning" && (
                        <AlertTriangle className="w-3 h-3 text-red-700 shrink-0" />
                      )}
                      {c.suitability}/100
                    </span>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Projected Yield ({currentAcreage} Ac)
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-xs font-black text-center ${focusedCropId === c.id ? "bg-[#31572c]/5 text-[#132a13] text-sm" : "text-gray-950"}`}
                  >
                    {Math.round(c.baseYield * currentAcreage)} qtl
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Net ROI Forecast ({currentAcreage} Ac)
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-xs font-black text-center ${focusedCropId === c.id ? "bg-[#31572c]/5 text-sm" : ""} ${c.status === "warning" ? "text-red-700" : "text-emerald-800"}`}
                  >
                    ₹
                    {Math.round(c.baseRoi * currentAcreage).toLocaleString(
                      "en-IN",
                    )}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Market Spot Trend (WoW)
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-xs font-black text-center ${focusedCropId === c.id ? "bg-[#31572c]/5" : ""} ${c.trend.includes("+") ? "text-emerald-700" : "text-red-700"}`}
                  >
                    {c.trend}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Water Demand Index
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-xs font-bold text-center ${focusedCropId === c.id ? "bg-[#31572c]/5 text-gray-950 font-black" : "text-gray-900"}`}
                  >
                    {c.waterLabel}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Pest Risk Profile
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-xs font-bold text-center ${focusedCropId === c.id ? "bg-[#31572c]/5 text-gray-950 font-black" : "text-gray-900"}`}
                  >
                    {c.pestLabel}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-[#f4f7f4]/30 transition-colors">
                <td className="p-4 text-[11px] font-black text-gray-950 uppercase tracking-wider bg-gray-100 border-r border-gray-300 shadow-sm">
                  Harvest Window
                </td>
                {ALL_REGION_CROPS.map((c) => (
                  <td
                    key={c.id}
                    className={`p-4 text-xs font-bold text-center ${focusedCropId === c.id ? "bg-[#31572c]/5 text-gray-950 font-black" : "text-gray-900"}`}
                  >
                    {c.harvest}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TARGET RADAR CHART COMPONENT */}
      <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#31572c]" />
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider">
              Focus Parameter Analysis:{" "}
              <span className="text-[#31572c] font-black underline decoration-2">
                {focusedCropData.name}
              </span>
            </h3>
          </div>
          <div className="text-[10px] text-gray-600 font-bold flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Hover or click cards below to swap
            matrix focus
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-around gap-6 py-2">
          <div className="relative w-full aspect-square max-w-[260px] flex items-center justify-center shrink-0 mx-auto lg:mx-4 bg-gray-50/50 p-4 rounded-full border border-gray-100">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-18"
            >
              {/* Reference Boundary Line Framework Loops */}
              <polygon
                points="50,12 88,38 73,83 27,83 12,38"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              <polygon
                points="50,22 78,42 67,74 33,74 22,42"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.75"
                strokeDasharray="1.5"
              />
              <polygon
                points="50,34 69,47 61,65 39,65 31,47"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.75"
              />

              {/* Intersect Spoke Tracks */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="12"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="88"
                y2="38"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="73"
                y2="83"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="27"
                y2="83"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="50"
                x2="12"
                y2="38"
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              {/* Dynamic Symmetric Polygon Track bounded securely within vectors */}
              <polygon
                points={generateRadarPoints(focusedCropData)}
                fill={focusedCropData.color}
                fillOpacity="0.25"
                stroke={focusedCropData.color}
                strokeWidth="2.5"
                className="transition-all duration-300 ease-out"
              />
            </svg>

            {/* Graphic Overlaid Labels */}
            <span className="absolute top-0 text-[9px] font-black uppercase text-gray-700 tracking-widest">
              Suitability
            </span>
            <span className="absolute right-0 top-[35%] text-[9px] font-black uppercase text-gray-700 tracking-widest">
              Yield
            </span>
            <span className="absolute right-3 bottom-3 text-[9px] font-black uppercase text-gray-700 tracking-widest">
              ROI
            </span>
            <span className="absolute bottom-0 text-[9px] font-black uppercase text-gray-700 tracking-widest">
              Water
            </span>
            <span className="absolute left-3 bottom-3 text-[9px] font-black uppercase text-gray-700 tracking-widest">
              Pest
            </span>
            <span className="absolute left-0 top-[35%] text-[9px] font-black uppercase text-gray-700 tracking-widest">
              Market
            </span>
          </div>

          {/* Interactive Card Selection Deck */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {ALL_REGION_CROPS.map((crop) => (
              <div
                key={crop.id}
                onMouseEnter={() => setFocusedCropId(crop.id)}
                onClick={() => setFocusedCropId(crop.id)}
                className={`border p-3 rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer shadow-sm ${
                  focusedCropId === crop.id
                    ? "bg-white border-2 border-gray-950 scale-[1.02] shadow-md"
                    : "bg-[#f4f7f4]/40 border-gray-300 hover:border-gray-500 hover:bg-white"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-inner shrink-0"
                  style={{ backgroundColor: crop.color }}
                />
                <div className="text-left">
                  <span className="text-xs font-black text-gray-950 block">
                    {crop.name}
                  </span>
                  <span className="text-[10px] font-bold text-gray-700 block mt-0.5">
                    WoW:{" "}
                    <span
                      className={
                        crop.trend.includes("+")
                          ? "text-emerald-800 font-extrabold"
                          : "text-red-700 font-extrabold"
                      }
                    >
                      {crop.trend}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
