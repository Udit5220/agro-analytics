// import React, { useState, useEffect } from "react";
// import { Cpu, ChevronDown, Info, Layers, MapPin, Loader2 } from "lucide-react";
// import { getRiskPrediction } from "../../services/diseaseGeminiService";
// import {
//   INDIAN_STATES,
//   getSoilDataByPincode,
// } from "../../services/locationService";

// const STAGES = [
//   "Seed",
//   "Germination",
//   "Vegetative",
//   "Flowering",
//   "Grain Fill",
//   "Harvest",
// ];

// export default function RiskPredictionEngine() {
//   // Farm Conditions State Configuration
//   const [crop, setCrop] = useState("Rice");
//   const [growthStage, setGrowthStage] = useState("Vegetative");

//   // Dynamic Location state synced with the selector component
//   const [location, setLocation] = useState({
//     state: "Haryana",
//     district: "Faridabad",
//     pincode: "121001",
//     soilData: getSoilDataByPincode("121001"),
//   });

//   // Dynamic Telemetry Form States
//   const [temperature, setTemperature] = useState(28);
//   const [humidity, setHumidity] = useState(82);
//   const [rainfall, setRainfall] = useState(18);
//   const [windSpeed, setWindSpeed] = useState(8);

//   const [isLoading, setIsLoading] = useState(false);
//   const [predictionData, setPredictionData] = useState({
//     compositeRiskScore: 65,
//     riskLevel: "Moderate",
//     pathogens: [
//       {
//         name: "Blast Disease",
//         probability: 72,
//         severity: "High",
//         trend: "Rising",
//       },
//       {
//         name: "Brown Spot",
//         probability: 55,
//         severity: "Medium",
//         trend: "Stable",
//       },
//       {
//         name: "Sheath Blight",
//         probability: 45,
//         severity: "Medium",
//         trend: "Stable",
//       },
//       {
//         name: "Leaf Blight",
//         probability: 25,
//         severity: "Low",
//         trend: "Falling",
//       },
//     ],
//     treatments: [
//       {
//         priority: "Immediate",
//         action: "Apply fungicide immediately — Propiconazole 0.1%",
//         product: "Propiconazole",
//       },
//       {
//         priority: "Preventive",
//         action: "Spray Tricyclazole 75 WP @ 300g/acre",
//         product: "Tricyclazole",
//       },
//       {
//         priority: "Monitor",
//         action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
//         product: "Imidacloprid",
//       },
//     ],
//     analysis:
//       "Warm nights and high humidity favor blast pathogen growth. Dense canopy increases leaf wetness duration.",
//   });

//   // Handle location selectors
//   const handleStateChange = (stateName) => {
//     const districts = INDIAN_STATES[stateName] || [];
//     const firstDistrict = districts[0] || "";
//     const newLoc = {
//       state: stateName,
//       district: firstDistrict,
//       pincode: location.pincode,
//       soilData: getSoilDataByPincode(location.pincode),
//     };
//     setLocation(newLoc);
//   };

//   const handleDistrictChange = (districtName) => {
//     const newLoc = {
//       ...location,
//       district: districtName,
//     };
//     setLocation(newLoc);
//   };

//   const handlePincodeChange = (e) => {
//     const val = e.target.value.replace(/\D/g, "").slice(0, 6);
//     const newLoc = {
//       ...location,
//       pincode: val,
//       soilData: getSoilDataByPincode(val),
//     };
//     setLocation(newLoc);
//   };

//   // Load baseline statistics once on mount
//   useEffect(() => {
//     let active = true;
//     const loadBaseline = async () => {
//       setIsLoading(true);
//       const data = await getRiskPrediction(
//         crop,
//         growthStage,
//         location,
//         temperature,
//         humidity,
//         rainfall,
//         windSpeed,
//       );
//       if (active) {
//         setPredictionData(data);
//         setIsLoading(false);
//       }
//     };
//     loadBaseline();
//     return () => {
//       active = false;
//     };
//   }, []);

//   const handleRunInference = async (e) => {
//     if (e) e.preventDefault();
//     setIsLoading(true);
//     try {
//       const data = await getRiskPrediction(
//         crop,
//         growthStage,
//         location,
//         temperature,
//         humidity,
//         rainfall,
//         windSpeed,
//       );
//       setPredictionData(data);
//     } catch (err) {
//       console.error("Failed to run AI risk prediction:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getBarColor = (prob) => {
//     if (prob >= 70) return "bg-[#dc2626]";
//     if (prob >= 40) return "bg-[#d97706]";
//     return "bg-[#16a34a]";
//   };

//   const getSeverityBadgeStyle = (sev) => {
//     if (sev === "High") return "bg-red-50 text-[#dc2626] border border-red-200";
//     if (sev === "Medium" || sev === "Moderate")
//       return "bg-amber-50 text-[#d97706] border border-amber-200";
//     return "bg-emerald-50 text-[#16a34a] border border-[#31572c]/20";
//   };

//   const getPriorityBadgeStyle = (priority) => {
//     if (priority === "Immediate")
//       return "bg-red-100 text-red-950 font-bold px-2 py-0.5 rounded text-[9px]";
//     if (priority === "Preventive")
//       return "bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-[9px]";
//     return "bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px]";
//   };

//   const getRiskLevelColor = (level) => {
//     if (level === "High") return "text-[#dc2626]";
//     if (level === "Medium" || level === "Moderate") return "text-[#d97706]";
//     return "text-[#16a34a]";
//   };

//   // Convert score 0-100% to angle -90 to +90 degrees for SVG rotation
//   const needleAngle = -90 + predictionData.compositeRiskScore * 1.8;

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased">
//       {/* --- MAIN ROOT VIEW TITLE --- */}
//       <header className="border-b border-gray-200 pb-4">
//         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
//           Predictive Diagnostics
//         </span>
//         <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#132a13]">
//           AI analysis of disease outbreak probability for your conditions
//         </h1>
//       </header>

//       {/* --- DUAL COLUMN LAYOUT MATRIX ON DESKTOP --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//         {/* LEFT-HAND SIDE PANEL INPUTS COLUMN (SPAN 1) */}
//         <div className="lg:col-span-1 space-y-4">
//           {/* Top Card Component: Location Selector */}
//           <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
//             <div>
//               <h3 className="text-sm font-bold text-[#132a13] uppercase tracking-wider flex items-center gap-1.5">
//                 <MapPin className="h-4 w-4 text-[#31572c]" />
//                 <span>Location Selector</span>
//               </h3>
//               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
//                 Select farm coordinates to load local soil chemistry
//               </p>
//             </div>

//             {/* Dropdown controls aligned perfectly on a shared horizontal line axis */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
//               {/* Select State */}
//               <div className="flex flex-col space-y-1">
//                 <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">
//                   State
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={location.state}
//                     onChange={(e) => handleStateChange(e.target.value)}
//                     className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer h-[34px]"
//                   >
//                     {Object.keys(INDIAN_STATES).map((st) => (
//                       <option key={st} value={st}>
//                         {st}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Select District */}
//               <div className="flex flex-col space-y-1">
//                 <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">
//                   District
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={location.district}
//                     onChange={(e) => handleDistrictChange(e.target.value)}
//                     className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer h-[34px]"
//                   >
//                     {(INDIAN_STATES[location.state] || []).map((dst) => (
//                       <option key={dst} value={dst}>
//                         {dst}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Pincode numerical entry */}
//               <div className="flex flex-col space-y-1">
//                 <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">
//                   Pincode
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-2.5 top-2 text-xs font-bold text-gray-400">
//                     #
//                   </span>
//                   <input
//                     type="text"
//                     value={location.pincode}
//                     onChange={handlePincodeChange}
//                     placeholder="121001"
//                     className="w-full bg-white border border-gray-200 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] h-[34px]"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Card Component: Simulation Conditions */}
//           <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
//             <div>
//               <h3 className="text-sm font-bold text-[#132a13] uppercase tracking-wider flex items-center gap-1.5">
//                 <Cpu className="h-4 w-4 text-[#31572c]" />
//                 <span>Simulation Conditions</span>
//               </h3>
//               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
//                 Configure crop stage and soil-climate inputs for prediction
//               </p>
//             </div>

//             {/* Dropdown: Crop Selection */}
//             <div className="space-y-1">
//               <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block">
//                 Crop
//               </label>
//               <div className="relative">
//                 <select
//                   value={crop}
//                   onChange={(e) => setCrop(e.target.value)}
//                   className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer h-[34px]"
//                 >
//                   <option>Rice</option>
//                   <option>Wheat</option>
//                   <option>Maize</option>
//                 </select>
//                 <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//               </div>
//             </div>

//             {/* Growth Stage selection */}
//             <div className="space-y-1.5">
//               <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block">
//                 Growth Stage
//               </label>
//               <div className="flex flex-wrap gap-1.5">
//                 {STAGES.map((stage) => {
//                   const isActive = growthStage === stage;
//                   return (
//                     <button
//                       key={stage}
//                       type="button"
//                       onClick={() => setGrowthStage(stage)}
//                       className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
//                         isActive
//                           ? "bg-[#31572c] border-[#31572c] text-white shadow-sm"
//                           : "bg-white border-gray-200 text-gray-600 hover:bg-[#f4f7f4]"
//                       }`}
//                     >
//                       {stage}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Telemetry Input Sliders */}
//             <div className="space-y-3.5 border-t border-gray-100 pt-3">
//               {/* Temperature Slider */}
//               <div className="space-y-1">
//                 <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
//                   <span className="text-gray-500">Temperature</span>
//                   <span className="text-[#31572c] font-black">
//                     {temperature}°C
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="10"
//                   max="45"
//                   value={temperature}
//                   onChange={(e) => setTemperature(Number(e.target.value))}
//                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
//                 />
//               </div>

//               {/* Humidity Slider */}
//               <div className="space-y-1">
//                 <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
//                   <span className="text-gray-500">Humidity</span>
//                   <span className="text-[#31572c] font-black">{humidity}%</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="20"
//                   max="100"
//                   value={humidity}
//                   onChange={(e) => setHumidity(Number(e.target.value))}
//                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
//                 />
//               </div>

//               {/* Rainfall Slider */}
//               <div className="space-y-1">
//                 <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
//                   <span className="text-gray-500">Rainfall Last 7 Days</span>
//                   <span className="text-[#31572c] font-black">
//                     {rainfall}MM
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   value={rainfall}
//                   onChange={(e) => setRainfall(Number(e.target.value))}
//                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
//                 />
//               </div>

//               {/* Wind Speed Slider */}
//               <div className="space-y-1">
//                 <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
//                   <span className="text-gray-500">Wind Speed</span>
//                   <span className="text-[#31572c] font-black">
//                     {windSpeed}KM/H
//                   </span>
//                 </div>
//                 <input
//                   type="range"
//                   min="0"
//                   max="40"
//                   value={windSpeed}
//                   onChange={(e) => setWindSpeed(Number(e.target.value))}
//                   className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
//                 />
//               </div>
//             </div>

//             {/* Soil Chemistry Telemetry */}
//             {location.soilData && (
//               <div className="bg-[#f4f7f4]/60 border border-gray-100 rounded-xl p-3 space-y-2 text-xs">
//                 <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#31572c] uppercase tracking-wider border-b border-gray-200/50 pb-1">
//                   <Layers className="w-3.5 h-3.5 text-[#31572c]" />
//                   <span>Resolved Soil Chemistry Profile</span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
//                       Soil Type
//                     </span>
//                     <span className="font-extrabold text-gray-700">
//                       {location.soilData.soilType}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
//                       Soil pH
//                     </span>
//                     <span className="font-extrabold text-gray-700">
//                       {location.soilData.pH}
//                     </span>
//                   </div>
//                   <div className="col-span-2 grid grid-cols-3 gap-1 pt-1.5 border-t border-gray-200/50">
//                     <div>
//                       <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
//                         Nitrogen
//                       </span>
//                       <span className="font-bold text-[#31572c]">
//                         {location.soilData.nitrogen}{" "}
//                         <span className="text-[7px] text-gray-400 block font-normal">
//                           kg/ha
//                         </span>
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
//                         Phosphorus
//                       </span>
//                       <span className="font-bold text-[#31572c]">
//                         {location.soilData.phosphorus}{" "}
//                         <span className="text-[7px] text-gray-400 block font-normal">
//                           kg/ha
//                         </span>
//                       </span>
//                     </div>
//                     <div>
//                       <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
//                         Potassium
//                       </span>
//                       <span className="font-bold text-[#31572c]">
//                         {location.soilData.potassium}{" "}
//                         <span className="text-[7px] text-gray-400 block font-normal">
//                           kg/ha
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Run Inference Submission CTA */}
//             <button
//               onClick={handleRunInference}
//               disabled={isLoading}
//               className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 active:scale-[0.98] cursor-pointer"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-4 h-4 animate-spin text-[#ecf39e]" />
//               ) : (
//                 <Cpu className="w-4 h-4 text-[#ecf39e]" />
//               )}
//               <span>
//                 {isLoading ? "Running AI Diagnostics..." : "Run AI Diagnostics"}
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* RIGHT-HAND SIDE DIAGNOSTICS RESULTS COLUMN (SPAN 2) */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Top Main Dashboard Card: Outbreak Probability Speedometer */}
//           <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative">
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-2xl">
//                 <Loader2 className="h-10 w-10 text-[#31572c] animate-spin" />
//               </div>
//             )}

//             <div className="relative w-48 h-28 flex flex-col items-center justify-center">
//               {/* SVG Gauge Construction - Mathematically precise non-clipping layouts */}
//               <svg
//                 className="w-full h-full overflow-visible"
//                 viewBox="0 0 100 65"
//               >
//                 {/* Segment 1: Low Risk (Green) */}
//                 <path
//                   d="M 22 42 A 28 28 0 0 1 36 17.8"
//                   fill="none"
//                   stroke="#16a34a"
//                   strokeWidth="7"
//                   strokeLinecap="round"
//                 />
//                 {/* Segment 2: Med Risk (Amber) */}
//                 <path
//                   d="M 36 17.8 A 28 28 0 0 1 64 17.8"
//                   fill="none"
//                   stroke="#d97706"
//                   strokeWidth="7"
//                 />
//                 {/* Segment 3: High Risk (Red) */}
//                 <path
//                   d="M 64 17.8 A 28 28 0 0 1 78 42"
//                   fill="none"
//                   stroke="#dc2626"
//                   strokeWidth="7"
//                   strokeLinecap="round"
//                 />

//                 {/* Semicircle Outer Labels - Clipless */}
//                 <text
//                   x="13"
//                   y="45"
//                   textAnchor="middle"
//                   fill="#9ca3af"
//                   className="text-[7px] font-extrabold tracking-wider"
//                 >
//                   LOW
//                 </text>
//                 <text
//                   x="50"
//                   y="9"
//                   textAnchor="middle"
//                   fill="#9ca3af"
//                   className="text-[7px] font-extrabold tracking-wider"
//                 >
//                   MED
//                 </text>
//                 <text
//                   x="87"
//                   y="45"
//                   textAnchor="middle"
//                   fill="#9ca3af"
//                   className="text-[7px] font-extrabold tracking-wider"
//                 >
//                   HIGH
//                 </text>

//                 {/* Dynamic Needle Pin anchored precisely at center baseline point (50, 42) */}
//                 <g transform={`translate(50, 42) rotate(${needleAngle})`}>
//                   <line
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="-25"
//                     stroke="#1f2937"
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     className="transition-transform duration-500 ease-out"
//                   />
//                   <circle cx="0" cy="0" r="3.5" fill="#1f2937" />
//                 </g>

//                 {/* Dynamic Score Text inside SVG to prevent any absolute layout overlapping */}
//                 <text
//                   x="50"
//                   y="57"
//                   textAnchor="middle"
//                   fill="#111827"
//                   className="font-sans"
//                   style={{ fontSize: "10px", fontWeight: "900" }}
//                 >
//                   {predictionData.compositeRiskScore}%
//                 </text>
//               </svg>
//             </div>

//             <div className="mt-2">
//               <h3
//                 className={`text-sm font-extrabold uppercase tracking-wide ${getRiskLevelColor(predictionData.riskLevel)}`}
//               >
//                 {predictionData.riskLevel} Risk
//               </h3>
//               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
//                 For {crop} in {location.district} at {growthStage} stage
//               </p>
//             </div>

//             {/* Explanatory Insights Subtext Block */}
//             {predictionData.analysis && (
//               <p className="text-gray-500 text-xs italic mt-4 max-w-md leading-relaxed text-center">
//                 * {predictionData.analysis}
//               </p>
//             )}

//             {/* Footer Integrity Meta Tag */}
//             <div className="mt-4 pt-3 border-t border-gray-50 w-full flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
//               <span>
//                 ℹ️ MODEL CONFIDENCE: 91% — BASED ON LIVE CONDITIONS TELEMETRY
//               </span>
//             </div>
//           </div>

//           {/* Bottom List Card: Top Pathogen Risks & Treatments */}
//           <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
//             <h3 className="text-xs font-bold text-[#31572c] uppercase tracking-widest flex items-center gap-1.5">
//               <Layers className="h-4 w-4" />
//               <span>Top Pathogen Risks & Treatments</span>
//             </h3>

//             <div className="divide-y divide-gray-100">
//               {predictionData.pathogens.map((pathogen, idx) => {
//                 const treatment =
//                   predictionData.treatments[idx] ||
//                   predictionData.treatments[
//                     predictionData.treatments.length - 1
//                   ];
//                 return (
//                   <div
//                     key={idx}
//                     className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4"
//                   >
//                     <div className="space-y-1 flex-1">
//                       <div className="flex items-center gap-2">
//                         <h4 className="text-sm font-extrabold text-gray-900 tracking-tight">
//                           {pathogen.name}
//                         </h4>
//                         <span
//                           className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadgeStyle(pathogen.severity)}`}
//                         >
//                           {pathogen.severity} Severity
//                         </span>
//                       </div>
//                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                         Outbreak Trend:{" "}
//                         <span className="text-gray-700">{pathogen.trend}</span>
//                       </p>
//                       {treatment && (
//                         <div className="mt-2 bg-[#f4f7f4]/60 border border-gray-200/50 rounded-xl p-3 flex items-start gap-2">
//                           <span
//                             className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${getPriorityBadgeStyle(treatment.priority)}`}
//                           >
//                             {treatment.priority}
//                           </span>
//                           <div>
//                             <p className="text-xs font-medium text-gray-700">
//                               {treatment.action}
//                             </p>
//                             <span className="text-[9px] font-extrabold text-[#31572c] uppercase tracking-wider mt-0.5 block">
//                               Active Ingredient: {treatment.product}
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-3 shrink-0 self-end md:self-start">
//                       <span className="text-[10px] font-extrabold text-gray-400 uppercase">
//                         Probability
//                       </span>
//                       <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
//                         <div
//                           className={`h-full rounded-full transition-all duration-500 ${getBarColor(pathogen.probability)}`}
//                           style={{ width: `${pathogen.probability}%` }}
//                         />
//                       </div>
//                       <span className="text-xs font-black text-gray-800 w-8 text-right">
//                         {pathogen.probability}%
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";

import { Cpu, ChevronDown, Layers, Loader2, RefreshCw } from "lucide-react";

import {
  getRiskPrediction,
  fetchOpenMeteoWeather,
  HARYANA_DISTRICT_COORDS,
} from "../../services/diseaseGeminiService";

import {
  calculateDiseaseRisk,
  generateAnalysis,
  generatePathogens,
} from "../../logic/diseaseRiskEngine";

import { getSoilDataByPincode } from "../../services/locationService";

// ─── USER PROFILE (replace with context/store in production) ───

const USER_PROFILE = {
  name: "Suresh Kumar",

  location: "Faridabad, Haryana",

  pincode: "121001",

  farms: [
    {
      _id: "6a1bd649ff396ef5e03a3394",

      name: "Home Sector Flatlands",

      location: "Faridabad Outskirts",

      district: "Faridabad",

      state: "Haryana",

      pincode: "121001",

      totalLand: 4.5,

      crops: [
        { name: "Rice (Paddy)", sowingDate: "2026-05-01", sownArea: 2.5 },

        { name: "Mustard", sowingDate: "2026-05-15", sownArea: 1.5 },
      ],
    },

    {
      _id: "6a1bd649ff396ef5e03a3397",

      name: "Northern Tube-well Plot",

      location: "Ballabhgarh Boundary",

      district: "Ballabhgarh",

      state: "Haryana",

      pincode: "121004",

      totalLand: 3.2,

      crops: [{ name: "Wheat", sowingDate: "2025-11-10", sownArea: 2 }],
    },
  ],
};

const STAGES = [
  "Seed",

  "Germination",

  "Vegetative",

  "Flowering",

  "Grain Fill",

  "Harvest",
];

const DEFAULT_PREDICTION = {
  compositeRiskScore: 0,

  riskLevel: "Low",

  pathogens: [],

  treatments: [],

  analysis: "",
};

export default function RiskPredictionEngine() {
  const [selectedFarmId, setSelectedFarmId] = useState(
    USER_PROFILE.farms[0]._id,
  );

  const [growthStage, setGrowthStage] = useState("Vegetative");

  const [selectedCrop, setSelectedCrop] = useState(
    USER_PROFILE.farms[0].crops[0].name,
  );

  // Weather sliders — pre-filled by Open-Meteo on farm change

  const [temperature, setTemperature] = useState(28);

  const [humidity, setHumidity] = useState(82);

  const [rainfall, setRainfall] = useState(18);

  const [windSpeed, setWindSpeed] = useState(8);

  const [weatherLoading, setWeatherLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [predictionData, setPredictionData] = useState(DEFAULT_PREDICTION);

  const [weatherFetched, setWeatherFetched] = useState(false);

  const selectedFarm = USER_PROFILE.farms.find((f) => f._id === selectedFarmId);

  // Derived: soil data from farm pincode

  const soilData = getSoilDataByPincode(selectedFarm?.pincode || "121001");

  useEffect(() => {
    const riskResult = calculateDiseaseRisk({
      temperature,

      humidity,

      rainfall,

      windSpeed,

      growthStage,

      soilData,
    });

    setPredictionData((prev) => ({
      ...prev,

      compositeRiskScore: riskResult.compositeRiskScore,

      riskLevel: riskResult.riskLevel,

      pathogens: generatePathogens(riskResult.compositeRiskScore),

      analysis: generateAnalysis({
        temperature,

        humidity,

        rainfall,

        windSpeed,
      }),
    }));
  }, [temperature, humidity, rainfall, windSpeed, growthStage, soilData]);

  // Derived: location object for Gemini

  const locationContext = {
    state: selectedFarm?.state || "Haryana",

    district: selectedFarm?.district || "Faridabad",

    pincode: selectedFarm?.pincode || "121001",

    soilData,
  };

  // ── When farm changes: update crop selection + fetch real weather ──

  const handleFarmChange = useCallback(async (farmId) => {
    const farm = USER_PROFILE.farms.find((f) => f._id === farmId);

    if (!farm) return;

    setSelectedFarmId(farmId);

    setSelectedCrop(farm.crops[0]?.name || "Rice");

    setWeatherFetched(false);

    // Fetch real weather for new farm location

    const district = farm.district || "Faridabad";

    const coords =
      HARYANA_DISTRICT_COORDS[district] || HARYANA_DISTRICT_COORDS["Faridabad"];

    setWeatherLoading(true);

    const weather = await fetchOpenMeteoWeather(coords.lat, coords.lng);

    setTemperature(weather.current.temperature);

    setHumidity(weather.current.humidity);

    setRainfall(weather.current.rainfall);

    setWindSpeed(weather.current.windSpeed);

    setWeatherLoading(false);

    setWeatherFetched(true);
  }, []);

  // ── On mount: fetch weather for default farm ──

  useEffect(() => {
    handleFarmChange(USER_PROFILE.farms[0]._id);
  }, []);

  // ── Run AI inference ──

  const handleRunInference = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getRiskPrediction(
        selectedCrop,

        growthStage,

        locationContext,

        temperature,

        humidity,

        rainfall,

        windSpeed,
      );

      // setPredictionData(data);

      setPredictionData((prev) => ({
        ...prev,

        ...data,
      }));
    } catch (err) {
      console.error("Risk prediction failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCrop,

    growthStage,

    locationContext,

    temperature,

    humidity,

    rainfall,

    windSpeed,
  ]);

  // Needle angle formula: -90 (left/Low) to +90 (right/High)

  const needleAngle = -90 + predictionData.compositeRiskScore * 1.8;

  // ── Style helpers ──

  const getBarColor = (prob) => {
    if (prob >= 70) return "bg-[#dc2626]";

    if (prob >= 40) return "bg-[#d97706]";

    return "bg-[#16a34a]";
  };

  const getSeverityBadge = (sev) => {
    if (sev === "High") return "bg-red-50 text-[#dc2626] border border-red-200";

    if (sev === "Medium" || sev === "Moderate")
      return "bg-amber-50 text-[#d97706] border border-amber-200";

    return "bg-emerald-50 text-[#16a34a] border border-[#31572c]/20";
  };

  const getPriorityBadge = (priority) => {
    if (priority === "Immediate")
      return "bg-red-100 text-red-950 font-bold px-2 py-0.5 rounded text-[9px]";

    if (priority === "Preventive")
      return "bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-[9px]";

    return "bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px]";
  };

  const getRiskLevelColor = (level) => {
    if (level === "High") return "text-[#dc2626]";

    if (level === "Medium" || level === "Moderate") return "text-[#d97706]";

    return "text-[#16a34a]";
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* ── Header ── */}

      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Predictive Diagnostics
        </span>

        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#132a13]">
          AI analysis of disease outbreak probability for your conditions
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── LEFT PANEL ── */}

        <div className="lg:col-span-1 space-y-4">
          {/* Card 1: Farm Selector */}

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#132a13] uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-base">🌾</span>

                <span>Farm Selector</span>
              </h3>

              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                Select farm to auto-load location, soil, and weather data
              </p>
            </div>

            {/* Farm dropdown */}

            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block">
                Active Farm
              </label>

              <div className="relative">
                <select
                  value={selectedFarmId}
                  onChange={(e) => handleFarmChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer h-[36px]"
                >
                  {USER_PROFILE.farms.map((farm) => (
                    <option key={farm._id} value={farm._id}>
                      {farm.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Farm context pills */}

            {selectedFarm && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-[#31572c]/8 text-[#31572c] text-[10px] font-bold px-2 py-1 rounded-lg">
                    📍 {selectedFarm.district}, {selectedFarm.state}
                  </span>

                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                    📌 {selectedFarm.pincode}
                  </span>

                  <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-sky-100">
                    🌾 {selectedFarm.totalLand} acres
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedFarm.crops.map((c) => (
                    <span
                      key={c.name}
                      className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-1 rounded-lg border border-emerald-100"
                    >
                      {c.name} · {c.sownArea}ac
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved location display */}

            <div className="bg-[#f4f7f4]/60 border border-gray-100 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="text-[9px] font-extrabold text-[#31572c] uppercase tracking-wider border-b border-gray-200/50 pb-1">
                Resolved Location Context
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
                    State
                  </span>

                  <span className="font-extrabold text-gray-700 text-[10px]">
                    {locationContext.state}
                  </span>
                </div>

                <div>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
                    District
                  </span>

                  <span className="font-extrabold text-gray-700 text-[10px]">
                    {locationContext.district}
                  </span>
                </div>

                <div>
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
                    Pincode
                  </span>

                  <span className="font-extrabold text-gray-700 text-[10px]">
                    {locationContext.pincode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Simulation Conditions */}

          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#132a13] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-[#31572c]" />

                <span>Simulation Conditions</span>
              </h3>

              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                Configure crop stage and climate inputs for prediction
              </p>
            </div>

            {/* Crop dropdown — from farm's actual crops */}

            <div className="space-y-1">
              <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block">
                Crop (from farm)
              </label>

              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer h-[36px]"
                >
                  {(selectedFarm?.crops || []).map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Growth Stage pills */}

            <div className="space-y-1.5">
              <label className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block">
                Growth Stage
              </label>

              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setGrowthStage(stage)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                      growthStage === stage
                        ? "bg-[#31572c] border-[#31572c] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-[#f4f7f4]"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather sliders — pre-filled from Open-Meteo */}

            <div className="space-y-3.5 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
                  Weather Inputs
                </span>

                {weatherLoading ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-sky-600">
                    <Loader2 size={10} className="animate-spin" /> Fetching live
                    data...
                  </span>
                ) : weatherFetched ? (
                  <span className="text-[9px] font-bold text-emerald-600">
                    ✓ Open-Meteo live
                  </span>
                ) : null}
              </div>

              {/* Temperature */}

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="text-gray-500">Temperature</span>

                  <span className="text-[#31572c] font-black">
                    {temperature}°C
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="45"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              {/* Humidity */}

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="text-gray-500">Humidity</span>

                  <span className="text-[#31572c] font-black">{humidity}%</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              {/* Rainfall */}

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="text-gray-500">Rainfall Last 7 Days</span>

                  <span className="text-[#31572c] font-black">
                    {rainfall}MM
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              {/* Wind Speed */}

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider">
                  <span className="text-gray-500">Wind Speed</span>

                  <span className="text-[#31572c] font-black">
                    {windSpeed}KM/H
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>
            </div>

            {/* Soil Chemistry Block */}

            {soilData && (
              <div className="bg-[#f4f7f4]/60 border border-gray-100 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#31572c] uppercase tracking-wider border-b border-gray-200/50 pb-1">
                  <Layers className="w-3.5 h-3.5 text-[#31572c]" />

                  <span>Resolved Soil Chemistry Profile</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
                      Soil Type
                    </span>

                    <span className="font-extrabold text-gray-700">
                      {soilData.soilType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
                      Soil pH
                    </span>

                    <span className="font-extrabold text-gray-700">
                      {soilData.pH}
                    </span>
                  </div>

                  <div className="col-span-2 grid grid-cols-3 gap-1 pt-1.5 border-t border-gray-200/50">
                    {[
                      {
                        label: "Nitrogen",

                        val: soilData.nitrogen,

                        unit: "kg/ha",
                      },

                      {
                        label: "Phosphorus",

                        val: soilData.phosphorus,

                        unit: "kg/ha",
                      },

                      {
                        label: "Potassium",

                        val: soilData.potassium,

                        unit: "kg/ha",
                      },
                    ].map(({ label, val, unit }) => (
                      <div key={label}>
                        <span className="text-[8px] font-extrabold text-gray-400 uppercase block">
                          {label}
                        </span>

                        <span className="font-bold text-[#31572c]">
                          {val}

                          <span className="text-[7px] text-gray-400 block font-normal">
                            {unit}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Run AI CTA */}

            <button
              onClick={handleRunInference}
              disabled={isLoading || weatherLoading}
              className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#ecf39e]" />
              ) : (
                <Cpu className="w-4 h-4 text-[#ecf39e]" />
              )}

              <span>
                {isLoading ? "Running AI Diagnostics..." : "Run AI Diagnostics"}
              </span>
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}

        <div className="lg:col-span-2 space-y-6">
          {/* Speedometer Gauge Card */}

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-2xl">
                <Loader2 className="h-10 w-10 text-[#31572c] animate-spin" />
              </div>
            )}

            <div className="relative w-48 h-28 flex flex-col items-center justify-center">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 65"
              >
                {/* Green segment: Low */}

                <path
                  d="M 22 42 A 28 28 0 0 1 36 17.8"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                {/* Amber segment: Medium */}

                <path
                  d="M 36 17.8 A 28 28 0 0 1 64 17.8"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="7"
                />

                {/* Red segment: High */}

                <path
                  d="M 64 17.8 A 28 28 0 0 1 78 42"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                <text
                  x="13"
                  y="45"
                  textAnchor="middle"
                  fill="#9ca3af"
                  className="text-[7px] font-extrabold tracking-wider"
                >
                  LOW
                </text>

                <text
                  x="50"
                  y="9"
                  textAnchor="middle"
                  fill="#9ca3af"
                  className="text-[7px] font-extrabold tracking-wider"
                >
                  MED
                </text>

                <text
                  x="87"
                  y="45"
                  textAnchor="middle"
                  fill="#9ca3af"
                  className="text-[7px] font-extrabold tracking-wider"
                >
                  HIGH
                </text>

                <g transform={`translate(50, 42) rotate(${needleAngle})`}>
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-25"
                    stroke="#1f2937"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <circle cx="0" cy="0" r="3.5" fill="#1f2937" />
                </g>

                <text
                  x="50"
                  y="57"
                  textAnchor="middle"
                  fill="#111827"
                  className="font-sans"
                  style={{ fontSize: "10px", fontWeight: "900" }}
                >
                  {predictionData.compositeRiskScore}%
                </text>
              </svg>
            </div>

            <div className="mt-2">
              <h3
                className={`text-sm font-extrabold uppercase tracking-wide ${getRiskLevelColor(predictionData.riskLevel)}`}
              >
                {predictionData.riskLevel} Risk
              </h3>

              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                For {selectedCrop} in {locationContext.district} at{" "}
                {growthStage} stage
              </p>
            </div>

            {predictionData.analysis && (
              <p className="text-gray-500 text-xs italic mt-4 max-w-md leading-relaxed text-center">
                * {predictionData.analysis}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-gray-50 w-full flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <span>
                ℹ️ Model Confidence: 91% — Based on live conditions telemetry
              </span>
            </div>
          </div>

          {/* Pathogen Risk + Treatments Card */}

          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-[#31572c] uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="h-4 w-4" />

              <span>Top Pathogen Risks & Treatments</span>
            </h3>

            <div className="divide-y divide-gray-100">
              {predictionData.pathogens.map((pathogen, idx) => {
                const treatment =
                  predictionData.treatments[idx] ||
                  predictionData.treatments[
                    predictionData.treatments.length - 1
                  ];

                return (
                  <div
                    key={idx}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-gray-900 tracking-tight">
                          {pathogen.name}
                        </h4>

                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadge(pathogen.severity)}`}
                        >
                          {pathogen.severity} Severity
                        </span>
                      </div>

                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Outbreak Trend:{" "}
                        <span className="text-gray-700">{pathogen.trend}</span>
                      </p>

                      {treatment && (
                        <div className="mt-2 bg-[#f4f7f4]/60 border border-gray-200/50 rounded-xl p-3 flex items-start gap-2">
                          <span
                            className={getPriorityBadge(treatment.priority)}
                          >
                            {treatment.priority}
                          </span>

                          <div>
                            <p className="text-xs font-medium text-gray-700">
                              {treatment.action}
                            </p>

                            <span className="text-[9px] font-extrabold text-[#31572c] uppercase tracking-wider mt-0.5 block">
                              Active Ingredient: {treatment.product}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-start">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase">
                        Probability
                      </span>

                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getBarColor(pathogen.probability)}`}
                          style={{ width: `${pathogen.probability}%` }}
                        />
                      </div>

                      <span className="text-xs font-black text-gray-800 w-8 text-right">
                        {pathogen.probability}%
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
