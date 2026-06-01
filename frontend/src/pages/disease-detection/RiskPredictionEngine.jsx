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

// components/RiskPredictionEngine.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Cpu,
  ChevronDown,
  Layers,
  Loader2,
  MapPin,
  Droplets,
  Thermometer,
  Wind,
  RefreshCw,
} from "lucide-react";
import { getRiskPrediction } from "../../services/diseaseGeminiService";
import { getSoilDataByPincode, INDIAN_STATES } from "../../services/locationService";
import LocationSelector from "../../components/LocationSelector";
import { profileApi } from "../../services/apiService";

// Disease Risk Engine Logic
export const calculateDiseaseRisk = ({
  temperature,
  humidity,
  rainfall,
  windSpeed,
  growthStage,
  soilData,
}) => {
  let score = 0;

  // Humidity contribution (30%)
  score += (humidity / 100) * 30;

  // Rainfall contribution (25%)
  score += Math.min(rainfall / 100, 1) * 25;

  // Temperature contribution (20%) - optimal around 24°C
  const optimalTemp = 24;
  score += Math.max(0, 20 - Math.abs(optimalTemp - temperature) * 1.2);

  // Wind speed contribution (10%) - lower wind = higher risk
  if (windSpeed < 5) score += 10;
  else if (windSpeed < 10) score += 8;
  else if (windSpeed < 20) score += 5;
  else score += 2;

  // Growth stage contribution (10%)
  const stageRisk = {
    Seed: 2,
    Germination: 8,
    Vegetative: 10,
    Flowering: 10,
    "Grain Fill": 6,
    Harvest: 2,
  };
  score += stageRisk[growthStage] || 0;

  // Soil contribution (5%)
  let soilRisk = 0;
  if (soilData) {
    if (soilData.pH < 5.5 || soilData.pH > 8) soilRisk += 2;
    if (
      soilData.soilType?.toLowerCase().includes("clay") ||
      soilData.soilType?.toLowerCase().includes("alluvial")
    ) {
      soilRisk += 3;
    }
  }
  score += soilRisk;

  const finalScore = Math.min(Math.round(score), 100);
  let riskLevel = "Low";
  if (finalScore >= 75) riskLevel = "High";
  else if (finalScore >= 45) riskLevel = "Medium";

  return { compositeRiskScore: finalScore, riskLevel };
};

export const generateAnalysis = ({
  temperature,
  humidity,
  rainfall,
  windSpeed,
}) => {
  const reasons = [];
  if (humidity > 75)
    reasons.push("High humidity favors fungal disease development.");
  if (rainfall > 50)
    reasons.push("Recent rainfall increases leaf wetness duration.");
  if (temperature >= 18 && temperature <= 30)
    reasons.push("Temperature is favorable for pathogen growth.");
  if (windSpeed < 8) reasons.push("Low wind speed reduces canopy drying.");
  if (!reasons.length)
    reasons.push(
      "Current environmental conditions indicate low disease pressure.",
    );
  return reasons.join(" ");
};

export const generatePathogens = (risk) => {
  return [
    {
      name: "Blast Disease",
      probability: Math.min(risk + 10, 95),
      severity: risk >= 70 ? "High" : risk >= 45 ? "Medium" : "Low",
      trend: risk >= 70 ? "Rising" : risk >= 45 ? "Stable" : "Falling",
    },
    {
      name: "Brown Spot",
      probability: Math.max(risk - 5, 10),
      severity: risk >= 60 ? "Medium" : "Low",
      trend: risk >= 60 ? "Stable" : "Falling",
    },
    {
      name: "Leaf Blight",
      probability: Math.max(risk - 20, 5),
      severity: "Low",
      trend: "Stable",
    },
    {
      name: "Sheath Blight",
      probability: Math.max(risk - 15, 5),
      severity: risk >= 75 ? "Medium" : "Low",
      trend: risk >= 75 ? "Rising" : "Stable",
    },
  ];
};

// Generate treatments based on risk score and pathogen
const generateTreatments = (riskScore, pathogens) => {
  const treatments = [];

  if (riskScore >= 70) {
    treatments.push({
      priority: "Immediate",
      action: "Apply fungicide immediately — Propiconazole 0.1%",
      product: "Propiconazole",
    });
  }

  if (riskScore >= 50) {
    treatments.push({
      priority: "Preventive",
      action: "Spray Tricyclazole 75 WP @ 300g/acre",
      product: "Tricyclazole",
    });
  }

  treatments.push({
    priority: "Monitor",
    action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
    product: "Imidacloprid",
  });

  // Add disease-specific treatments
  if (pathogens.some((p) => p.name === "Blast Disease" && p.probability > 60)) {
    treatments.unshift({
      priority: "Critical",
      action: "Immediate Blast control with Tricyclazole @ 0.6g/L",
      product: "Tricyclazole + Kasugamycin",
    });
  }

  return treatments.slice(0, 4);
};

const STAGES = [
  "Seed",
  "Germination",
  "Vegetative",
  "Flowering",
  "Grain Fill",
  "Harvest",
];

// User Profile with farms
const USER_PROFILE = {
  name: "Suresh Kumar",
  location: "Faridabad, Haryana",
  pincode: "121001",
  farms: [
    {
      _id: "farm_1",
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
      _id: "farm_2",
      name: "Northern Tube-well Plot",
      location: "Ballabhgarh Boundary",
      district: "Ballabhgarh",
      state: "Haryana",
      pincode: "121004",
      totalLand: 3.2,
      crops: [{ name: "Wheat", sowingDate: "2025-11-10", sownArea: 2.0 }],
    },
  ],
};

// Smooth number animation hook
const useAnimatedValue = (targetValue, duration = 800) => {
  const [currentValue, setCurrentValue] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startValueRef.current = currentValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue =
        startValueRef.current + (targetValue - startValueRef.current) * easeOut;
      setCurrentValue(Math.round(newValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return currentValue;
};

export default function RiskPredictionEngine() {
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

  const [farmsList, setFarmsList] = useState([]);
  const [activeFarm, setActiveFarm] = useState(null);
  const [growthStage, setGrowthStage] = useState("Vegetative");
  const [selectedCrop, setSelectedCrop] = useState("Rice (Paddy)");

  // Weather state
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(82);
  const [rainfall, setRainfall] = useState(18);
  const [windSpeed, setWindSpeed] = useState(8);

  const [isLoading, setIsLoading] = useState(false);
  const [hasRunDiagnostics, setHasRunDiagnostics] = useState(false);

  // Load farms from profile
  useEffect(() => {
    const loadFarms = async () => {
      try {
        const res = await profileApi.getProfile();
        if (res.success && res.data) {
          const list = res.data.farms || [];
          setFarmsList(list);
          if (list.length > 0) {
            setActiveFarm(list[0]);
            if (list[0].crops && list[0].crops.length > 0) {
              setSelectedCrop(list[0].crops[0].name);
            }
          }
        }
      } catch (err) {
        console.warn("Offline fallback for farms list in Risk Engine");
        setFarmsList(USER_PROFILE.farms);
        setActiveFarm(USER_PROFILE.farms[0]);
      }
    };
    loadFarms();
  }, []);

  // Prediction state - initialized with 0 for smooth animation
  const [predictionData, setPredictionData] = useState({
    compositeRiskScore: 0,
    riskLevel: "Low",
    pathogens: generatePathogens(0),
    treatments: generateTreatments(0, generatePathogens(0)),
    analysis: generateAnalysis({
      temperature: 28,
      humidity: 82,
      rainfall: 18,
      windSpeed: 8,
    }),
  });

  // Animated risk score
  const animatedRiskScore = useAnimatedValue(
    predictionData.compositeRiskScore,
    800,
  );

  const soilData = location.soilData;
  const locationContext = location;

  // Handle Location Selector Change
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setHasRunDiagnostics(false);

    // Find the farm in farmsList that matches the pincode of the new location
    const matchedFarm = farmsList.find((f) => f.pincode === newLocation.pincode);
    if (matchedFarm) {
      setActiveFarm(matchedFarm);
      if (matchedFarm.crops && matchedFarm.crops.length > 0) {
        setSelectedCrop(matchedFarm.crops[0].name);
      }
    } else {
      setActiveFarm(null);
    }

    // Reset prediction for smooth transitions
    setPredictionData({
      compositeRiskScore: 0,
      riskLevel: "Low",
      pathogens: generatePathogens(0),
      treatments: generateTreatments(0, generatePathogens(0)),
      analysis: generateAnalysis({
        temperature,
        humidity,
        rainfall,
        windSpeed,
      }),
    });
  };

  // Run AI Diagnostics - calculates using the local risk engine first, then AI enhancement
  const handleRunInference = useCallback(async () => {
    setIsLoading(true);

    try {
      // Calculate local risk first (instant)
      const riskResult = calculateDiseaseRisk({
        temperature,
        humidity,
        rainfall,
        windSpeed,
        growthStage,
        soilData,
      });

      const pathogens = generatePathogens(riskResult.compositeRiskScore);
      const treatments = generateTreatments(
        riskResult.compositeRiskScore,
        pathogens,
      );
      const analysis = generateAnalysis({
        temperature,
        humidity,
        rainfall,
        windSpeed,
      });

      // Update with local calculation
      setPredictionData({
        compositeRiskScore: riskResult.compositeRiskScore,
        riskLevel: riskResult.riskLevel,
        pathogens,
        treatments,
        analysis,
      });

      setHasRunDiagnostics(true);

      // Try AI enhancement in background (doesn't block UI)
      try {
        const aiData = await getRiskPrediction(
          selectedCrop,
          growthStage,
          locationContext,
          temperature,
          humidity,
          rainfall,
          windSpeed,
        );

        // Merge AI data with local calculation
        if (aiData && aiData.compositeRiskScore) {
          setPredictionData({
            compositeRiskScore: aiData.compositeRiskScore,
            riskLevel: aiData.riskLevel || riskResult.riskLevel,
            pathogens: aiData.pathogens || pathogens,
            treatments: aiData.treatments || treatments,
            analysis: aiData.analysis || analysis,
          });
        }
      } catch (aiError) {
        console.warn("AI enhancement failed, using local prediction:", aiError);
      }
    } catch (err) {
      console.error("Risk prediction failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    temperature,
    humidity,
    rainfall,
    windSpeed,
    growthStage,
    soilData,
    selectedCrop,
    locationContext,
  ]);

  // Needle angle: -90° (Low) to +90° (High)
  const needleAngle = -90 + animatedRiskScore * 1.8;

  // Helpers
  const getBarColor = (prob) => {
    if (prob >= 70) return "bg-red-500";
    if (prob >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getSeverityBadge = (sev) => {
    if (sev === "High") return "bg-red-50 text-red-700 border-red-200";
    if (sev === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getPriorityBadge = (priority) => {
    if (priority === "Critical")
      return "bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[9px]";
    if (priority === "Immediate")
      return "bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[9px]";
    if (priority === "Preventive")
      return "bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[9px]";
    return "bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[9px]";
  };

  const getRiskLevelColor = (level) => {
    if (level === "High") return "text-red-600";
    if (level === "Medium") return "text-amber-600";
    return "text-emerald-600";
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased max-w-7xl mx-auto p-4">
      {/* Header */}
      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Predictive Diagnostics
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#132a13]">
          AI analysis of disease outbreak probability for your conditions
        </h1>
      </header>

      {/* 2-Section Compound Field Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN - Simulation Conditions */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-[#31572c]" />
              <h2 className="text-sm font-bold text-[#132a13] uppercase tracking-wider">
                Simulation Conditions
              </h2>
            </div>

            {/* Crop Selection */}
            <div className="mb-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Crop
              </label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full appearance-none bg-[#f4f7f4] border border-gray-[#cbdcd5] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {activeFarm && activeFarm.crops && activeFarm.crops.length > 0 ? (
                    activeFarm.crops.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Rice (Paddy)">Rice (Paddy)</option>
                      <option value="Mustard">Mustard</option>
                      <option value="Wheat">Wheat</option>
                    </>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Growth Stage */}
            <div className="mb-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Growth Stage
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setGrowthStage(stage)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
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

            {/* Weather Sliders */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Environmental Parameters
              </p>

              {/* Temperature */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-500" />
                    <span className="text-xs font-medium text-gray-600">
                      Temperature
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#31572c]">
                    {temperature}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              {/* Humidity */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-gray-600">
                      Humidity
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#31572c]">
                    {humidity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              {/* Rainfall */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-500" />
                    <span className="text-xs font-medium text-gray-600">
                      Rainfall (7 days)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#31572c]">
                    {rainfall} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              {/* Wind Speed */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">
                      Wind Speed
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#31572c]">
                    {windSpeed} km/h
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>
            </div>

            {/* Soil Data */}
            {soilData && (
              <div className="bg-[#f4f7f4] rounded-xl p-3 mt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Layers className="w-3.5 h-3.5 text-[#31572c]" />
                  <span className="text-[9px] font-bold text-[#31572c] uppercase tracking-wider">
                    Soil Profile
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-[8px] text-gray-400">Type</p>
                    <p className="font-bold text-gray-700">
                      {soilData.soilType}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400">pH</p>
                    <p className="font-bold text-gray-700">{soilData.pH}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-400">Organic</p>
                    <p className="font-bold text-gray-700">
                      {soilData.organicCarbon || "0.8"}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Run AI Button */}
            <button
              onClick={handleRunInference}
              disabled={isLoading}
              className="w-full mt-5 py-3 bg-gradient-to-r from-[#31572c] to-[#132a13] hover:from-[#132a13] hover:to-[#0a1a0a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Cpu className="w-5 h-5" />
              )}
              <span>
                {isLoading ? "Running AI Diagnostics..." : "Run AI Diagnostics"}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Risk Gauge & Results */}
        <div className="space-y-4">
          {/* Risk Gauge Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Disease Outbreak Probability
              </p>

              {/* SVG Gauge */}
              <div className="relative w-64 h-32 mx-auto">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 200 100"
                >
                  {/* Background arc */}
                  <path
                    d="M 30 85 A 70 70 0 0 1 170 85"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Green segment (Low) */}
                  <path
                    d="M 30 85 A 70 70 0 0 1 65 24.4"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Amber segment (Medium) */}
                  <path
                    d="M 65 24.4 A 70 70 0 0 1 135 24.4"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                  />
                  {/* Red segment (High) */}
                  <path
                    d="M 135 24.4 A 70 70 0 0 1 170 85"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Labels */}
                  <text
                    x="20"
                    y="92"
                    textAnchor="middle"
                    fill="#9ca3af"
                    className="text-[8px] font-bold"
                  >
                    LOW
                  </text>
                  <text
                    x="100"
                    y="18"
                    textAnchor="middle"
                    fill="#9ca3af"
                    className="text-[8px] font-bold"
                  >
                    MED
                  </text>
                  <text
                    x="180"
                    y="92"
                    textAnchor="middle"
                    fill="#9ca3af"
                    className="text-[8px] font-bold"
                  >
                    HIGH
                  </text>

                  {/* Needle */}
                  <g transform={`translate(100, 85) rotate(${needleAngle})`}>
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-55"
                      stroke="#1f2937"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="0" cy="0" r="6" fill="#1f2937" />
                    <circle cx="0" cy="0" r="3" fill="#ef4444" />
                  </g>

                  {/* Center score */}
                  <text
                    x="100"
                    y="75"
                    textAnchor="middle"
                    fill="#111827"
                    className="font-sans text-xl font-black"
                  >
                    {animatedRiskScore}%
                  </text>
                </svg>
              </div>

              {/* Risk Level Badge */}
              <div className="mt-2">
                <h3
                  className={`text-lg font-black uppercase tracking-wide ${getRiskLevelColor(predictionData.riskLevel)}`}
                >
                  {predictionData.riskLevel} Risk
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  For {selectedCrop} in {locationContext.district} at{" "}
                  {growthStage} stage
                </p>
              </div>

              {/* Analysis Text */}
              {predictionData.analysis && hasRunDiagnostics && (
                <p className="text-gray-600 text-xs italic mt-4 max-w-md mx-auto leading-relaxed">
                  * {predictionData.analysis}
                </p>
              )}

              {/* Confidence Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                <span>
                  🤖 Model Confidence: 91% — Based on live conditions telemetry
                </span>
              </div>
            </div>
          </div>

          {/* Pathogen Risks & Treatments Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-[#31572c] uppercase tracking-wider flex items-center gap-1.5 mb-4">
              <Layers className="w-4 h-4" />
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
                  <div key={idx} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-extrabold text-gray-900">
                            {pathogen.name}
                          </h4>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadge(pathogen.severity)}`}
                          >
                            {pathogen.severity} Severity
                          </span>
                          <span className="text-[9px] font-bold text-gray-400">
                            Trend:{" "}
                            <span className="text-gray-700">
                              {pathogen.trend}
                            </span>
                          </span>
                        </div>

                        {/* Probability Bar */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-bold text-gray-400 w-16">
                            Probability
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(pathogen.probability)}`}
                              style={{ width: `${pathogen.probability}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-gray-700 w-8 text-right">
                            {pathogen.probability}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Treatment */}
                    {treatment && hasRunDiagnostics && (
                      <div className="mt-3 bg-amber-50/40 border border-amber-100 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <span
                            className={getPriorityBadge(treatment.priority)}
                          >
                            {treatment.priority}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-700">
                              {treatment.action}
                            </p>
                            <p className="text-[9px] font-bold text-[#31572c] uppercase tracking-wider mt-1">
                              Active Ingredient: {treatment.product}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* No diagnostics run message */}
            {!hasRunDiagnostics && (
              <div className="text-center py-8 text-gray-400">
                <Cpu className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">
                  Click "Run AI Diagnostics" to see pathogen risks and
                  treatments
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
