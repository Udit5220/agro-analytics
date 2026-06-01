// import React, { useState, useEffect } from "react";
// import { Check, ChevronDown, ChevronUp, Cpu, Lightbulb, CloudRain, ShieldAlert, Calendar, Loader2 } from "lucide-react";
// import LocationSelector from "../../components/LocationSelector";
// import { getSoilDataByPincode } from "../../services/locationService";
// import { getLifecycleGuidance } from "../../services/geminiService";

// // Crop specific lifecycle phases fallback matrix
// const FALLBACK_PHASES = {
//   "Wheat (गेहूं)": [
//     { id: 1, name: "Land Preparation", desc: "Field plowed and baseline gypsum applied for salinity buffering.", date: "Nov 05, 2025" },
//     { id: 2, name: "Sowing", desc: "Certified HD-3086 wheat seeds sown at 4-5 cm depth.", date: "Nov 15, 2025" },
//     { id: 3, name: "Germination", desc: "Coleoptile emergence success rate mapped at 96%.", date: "Nov 25, 2025" },
//     { id: 4, name: "Tillering", desc: "Crown roots initiating. Critical Nitrogen top-dressing required for maximum tiller density.", date: "Dec 18, 2025" },
//     { id: 5, name: "Jointing", desc: "Stalk elongation phase. First node visible. Keep soil moisture at baseline field capacity.", date: "Jan 15, 2026" },
//     { id: 6, name: "Flowering", desc: "Pollen tube expansion and spikelet emergence. Avoid chemical sprays at this stage.", date: "Feb 10, 2026" },
//     { id: 7, name: "Grain Filling", desc: "Milk-to-dough photosynthates translocation to grain kernels. Maintain mild moistening.", date: "Feb 28, 2026" },
//     { id: 8, name: "Harvest", desc: "Physiological maturity. Reaping recommended when grain moisture falls to 14%.", date: "Mar 20, 2026" }
//   ],
//   "Rice (धान)": [
//     { id: 1, name: "Nursery Preparation", desc: "Seeding wet-bed nursery with organic manures and bio-composts.", date: "Jun 01, 2025" },
//     { id: 2, name: "Land Puddling", desc: "Standing water flooded tillage for clay pan compaction layer setup.", date: "Jun 20, 2025" },
//     { id: 3, name: "Transplanting", desc: "Healthy 25-day nursery seedlings transplanted in puddle field at 15x20cm density.", date: "Jun 30, 2025" },
//     { id: 4, name: "Tillering", desc: "Panicle numbers initiating. Maintain stable 5cm water level to block weed growth.", date: "Jul 25, 2025" },
//     { id: 5, name: "Panicle Initiation", desc: "Flag leaf emergence. Stem elongation. High micro-nutrient draw rate.", date: "Aug 20, 2025" },
//     { id: 6, name: "Flowering", desc: "Anther dehiscence. Keep water levels optimal. Avoid chemical spray treatments.", date: "Sep 15, 2025" },
//     { id: 7, name: "Dough Stage", desc: "Grain starch content solidifying. Drain standing water 10 days before harvesting.", date: "Oct 05, 2025" },
//     { id: 8, name: "Harvest", desc: "Physiological maturity reached. Combine reaping recommended at 18-20% grain moisture.", date: "Oct 25, 2025" }
//   ],
//   "Cotton (कपास)": [
//     { id: 1, name: "Land Tillage", desc: "Deep plowing and ridge bed configurations to assist taproot penetration.", date: "Apr 15, 2025" },
//     { id: 2, name: "Sowing", desc: "Bt Cotton seeds sown at 3-4 cm depth under ridge beds.", date: "May 05, 2025" },
//     { id: 3, name: "Seedling Stage", desc: "Thinning completed. Gap filling done to ensure perfect plant count setup.", date: "May 25, 2025" },
//     { id: 4, name: "Squaring", desc: "First sympodial branches forming flower buds (squares). Keep tracking bollworm pests.", date: "Jun 20, 2025" },
//     { id: 5, name: "Flowering", desc: "Golden white petals showing up. Pollination peaking. Moisture deficiency strictly avoided.", date: "Jul 15, 2025" },
//     { id: 6, name: "Boll Development", desc: "Active boll sizing. Translocation of nutrients critical. Track humidity index.", date: "Aug 10, 2025" },
//     { id: 7, name: "Boll Bursting", desc: "Bolls open to expose dry cotton fiber. Avoid any rain or overhead water spray.", date: "Sep 10, 2025" },
//     { id: 8, name: "Harvest", desc: "Hand picking or mechanical picking cycles. Store dry cotton bales in ventilated bays.", date: "Oct 05, 2025" }
//   ]
// };

// const FALLBACK_INTERVENTIONS = [
//   {
//     type: "weather",
//     title: "Nitrogen Application Optimization",
//     desc: "Based on this week's localized weather forecast (light rain expected on Thursday), the AI model advises delaying urea top-dressing by 3 days."
//   },
//   {
//     type: "pest",
//     title: "Microclimate Proximity Warning",
//     desc: "Thermal humidity index spikes detected. Monitor leaf wetness thresholds closely during the next 48 hours to prevent early Leaf Blight."
//   }
// ];

// export default function LifecyclePredictor() {
//   const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
//   const [sowingDate, setSowingDate] = useState("2025-11-05");
//   const [completedPhases, setCompletedPhases] = useState([1, 2, 3]);
//   const [expandedPhase, setExpandedPhase] = useState(4);
//   const [loading, setLoading] = useState(true);

//   // Global location state synchronized
//   const [location, setLocation] = useState({
//     state: "Haryana",
//     district: "Faridabad",
//     pincode: "121001",
//     latitude: 28.4089,
//     longitude: 77.3178,
//     soilData: getSoilDataByPincode("121001")
//   });

//   // Dynamic state loaded from Gemini/fallback
//   const [phases, setPhases] = useState(FALLBACK_PHASES["Wheat (गेहूं)"]);
//   const [harvestWindow, setHarvestWindow] = useState("Mar 15 - Mar 22");
//   const [baseYieldAtRisk, setBaseYieldAtRisk] = useState("20% - 25%");
//   const [interventions, setInterventions] = useState(FALLBACK_INTERVENTIONS);

//   // Handle global location selector triggers
//   const handleLocationChange = (newLocation) => {
//     setLocation(newLocation);
//   };

//   // Re-fetch agronomical lifecycle predictions whenever selections shift
//   useEffect(() => {
//     let active = true;
//     setLoading(true);

//     const loadGuidance = async () => {
//       const result = await getLifecycleGuidance(
//         selectedCrop,
//         sowingDate,
//         location.district,
//         location.state
//       );

//       if (active) {
//         setPhases(result.phases || FALLBACK_PHASES[selectedCrop] || FALLBACK_PHASES["Wheat (गेहूं)"]);
//         setHarvestWindow(result.harvestWindow || "Mar 15 - Mar 22");
//         setBaseYieldAtRisk(result.yieldAtRisk || "20% - 25%");
//         setInterventions(result.interventions || FALLBACK_INTERVENTIONS);
//         setLoading(false);
//       }
//     };

//     loadGuidance();

//     return () => {
//       active = false;
//     };
//   }, [selectedCrop, sowingDate, location.district, location.state]);

//   // Dynamic metrics updates based on completed status
//   const isPhase4Complete = completedPhases.includes(4);
//   const yieldAtRisk = isPhase4Complete ? "0% - 5%" : baseYieldAtRisk;
//   const activeIrrigationNote = isPhase4Complete ? "CRI IRRIGATION SYNCED" : "MISSING CRI IRRIGATION";

//   const handleToggleAccordion = (id) => {
//     setExpandedPhase(expandedPhase === id ? null : id);
//   };

//   const handleMarkComplete = (id) => {
//     if (!completedPhases.includes(id)) {
//       setCompletedPhases([...completedPhases, id]);
//       // Auto expand next stage for a satisfying, premium flow experience
//       if (id < 8) {
//         setExpandedPhase(id + 1);
//       }
//     } else {
//       setCompletedPhases(completedPhases.filter(val => val !== id));
//     }
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">

//       {/* Module Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-150">
//         <div className="text-left">
//           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <span>AI Lifecycle Guidance Engine</span>
//             <span className="text-gray-300 font-light text-xl">|</span>
//             <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
//               फसल चक्र पूर्वानुमान
//             </span>
//           </h1>
//           <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
//             Predictive growth timeline modeling, real-time stress simulations, and split agronomical actions.
//           </p>
//         </div>

//         {/* Dropdown Filters & Date Picker */}
//         <div className="flex flex-wrap items-center gap-3">
//           {/* Crop Selector */}
//           <div className="relative">
//             <select
//               value={selectedCrop}
//               onChange={(e) => {
//                 setSelectedCrop(e.target.value);
//                 setCompletedPhases([1, 2, 3]); // Reset completion loop to stage 4
//                 setExpandedPhase(4);
//               }}
//               className="appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm min-w-[150px]"
//             >
//               <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
//               <option value="Rice (धान)">Rice (धान)</option>
//               <option value="Cotton (कपास)">Cotton (कपास)</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//           </div>

//           {/* Sowing Date Picker */}
//           <div className="relative">
//             <input
//               type="date"
//               value={sowingDate}
//               onChange={(e) => setSowingDate(e.target.value)}
//               className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] shadow-sm min-w-[160px] cursor-pointer"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Global Location Selector Card */}
//       <LocationSelector value={location} onChange={handleLocationChange} />

//       {/* Top 4-Column Predictive Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-left">
//         {/* Card 1 (Current Lifecycle Phase) */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">CURRENT PHASE</span>
//           <h4 className="text-xl font-black text-gray-900 mt-1">{phases[expandedPhase - 1]?.name || "Tillering"}</h4>
//           <span className="bg-[#31572c]/8 text-[#31572c] font-black text-[9px] px-2 py-0.5 rounded w-max mt-2 tracking-wider uppercase">
//             STAGE {expandedPhase || 4} OF 8
//           </span>
//         </div>

//         {/* Card 2 (AI-Calculated Harvest Window) */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">ESTIMATED HARVEST</span>
//           <h4 className="text-sm font-black text-gray-900 mt-2">{harvestWindow}</h4>
//           <span className="bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[9px] px-2 py-0.5 rounded w-max mt-1 uppercase tracking-wider">
//             ACCELERATED BY WEATHER (+3D)
//           </span>
//         </div>

//         {/* Card 3 (Active Yield Risk Factor) */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">YIELD AT RISK</span>
//           <h4 className={`text-xl font-black mt-1 ${isPhase4Complete ? "text-emerald-700" : "text-red-600"}`}>
//             {yieldAtRisk}
//           </h4>
//           <span className={`border font-black text-[9px] px-2 py-0.5 rounded w-max mt-1 uppercase tracking-wider ${
//             isPhase4Complete
//               ? "bg-emerald-50 text-emerald-700 border-emerald-100"
//               : "bg-red-50 text-red-700 border-red-100"
//           }`}>
//             {activeIrrigationNote}
//           </span>
//         </div>

//         {/* Card 4 (Automated Agent Diagnostics) */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">TELEMETRY SYNC</span>
//           <h4 className="text-sm font-bold text-gray-900 mt-2 flex items-center gap-1.5">
//             <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
//             <span>Live Scan</span>
//           </h4>
//           <span className="bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[9px] px-2 py-0.5 rounded w-max mt-1 uppercase tracking-wider">
//             GEMINI CALCULATIONS ACTIVE
//           </span>
//         </div>
//       </div>

//       {/* Core Workspace Layout Split Matrix */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start relative min-h-[400px]">
//         {loading && (
//           <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
//             <div className="flex flex-col items-center gap-2">
//               <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
//               <span className="text-xs font-black text-gray-700">Syncing AI Lifecycle Guidance...</span>
//             </div>
//           </div>
//         )}

//         {/* Panel A: The Interactive AI Predictive Timeline (Left Columns — Span: 2) */}
//         <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
//           <div className="border-b border-gray-50 pb-3 mb-4 text-left">
//             <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase">
//               AI Crops Rotational Growth Program
//             </h3>
//           </div>

//           <div className="relative space-y-6">
//             {/* The vertical timeline spine line */}
//             <div className="w-0.5 bg-gray-150 absolute left-6 top-4 bottom-4 z-0 pointer-events-none" />

//             {phases.map((phase) => {
//               const isCompleted = completedPhases.includes(phase.id);
//               const isActive = expandedPhase === phase.id;
//               const isFuture = !isCompleted && !isActive;

//               return (
//                 <div key={phase.id} className="relative flex items-start gap-4 z-10">

//                   {/* Stem Circle node indicator */}
//                   <button
//                     onClick={() => handleToggleAccordion(phase.id)}
//                     className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold z-10 shrink-0 shadow-sm transition-all duration-300 ${
//                       isCompleted
//                         ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
//                         : isActive
//                           ? "border-emerald-600 bg-white text-emerald-700 font-black text-sm ring-4 ring-emerald-50/60 scale-105"
//                           : "bg-gray-100 border-gray-200 text-gray-400 text-xs font-bold hover:bg-gray-200"
//                     }`}
//                   >
//                     {isCompleted ? <Check className="w-5.5 h-5.5" strokeWidth={3} /> : phase.id}
//                   </button>

//                   {/* Accordion panel area */}
//                   <div className="flex-1 text-left bg-white rounded-xl border border-gray-150/40 p-3 hover:shadow-sm transition-all duration-200">

//                     {/* Header Row */}
//                     <div
//                       onClick={() => handleToggleAccordion(phase.id)}
//                       className="flex justify-between items-center cursor-pointer"
//                     >
//                       <div>
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <h4 className="text-xs font-black text-gray-900">
//                             {phase.id}. {phase.name}
//                           </h4>
//                           {isActive && (
//                             <span className="bg-emerald-50 border border-emerald-100 text-[#1e4638] font-extrabold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-inner animate-pulse">
//                               Current
//                             </span>
//                           )}
//                         </div>
//                         <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
//                           Date Milestone: {phase.date}
//                         </span>
//                       </div>

//                       {isActive ? (
//                         <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
//                       ) : (
//                         <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
//                       )}
//                     </div>

//                     {/* Detailed Content Zone (Accordion body) */}
//                     {isActive && (
//                       <div className="mt-4 pt-3 border-t border-gray-100 space-y-4 animate-fadeIn">

//                         <p className="text-xs text-gray-600 leading-relaxed font-medium">
//                           {phase.desc}
//                         </p>

//                         {/* Phase 4 Specialized Content Card Block */}
//                         {phase.id === 4 && (
//                           <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 space-y-4 text-left mt-2">

//                             {/* Key Actions Ledger */}
//                             <div>
//                               <h5 className="text-[10px] font-black text-gray-400 tracking-wider mb-2.5 uppercase">
//                                 Key Predictive Actions Required
//                               </h5>
//                               <div className="space-y-2">
//                                 <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
//                                   <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
//                                   <span>First nitrogen top-dress (<span className="text-gray-900 font-extrabold">Urea 30 kg/acre</span>) — <span className="text-gray-400 italic">Target: Days 21-25</span></span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
//                                   <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
//                                   <span>First irrigation at 21 DAS (<span className="text-gray-900 font-extrabold">CRI stage critical window</span>)</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
//                                   <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
//                                   <span>Weed management control application (<span className="text-gray-900 font-extrabold">Sulfosulfuron spray protocol</span>)</span>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Live Yield Penalty Simulation Warning */}
//                             <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-semibold text-amber-900 shadow-sm text-left">
//                               <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
//                               <div>
//                                 <h6 className="font-black text-amber-955 block">Yield Reduction Simulation Penalty</h6>
//                                 <p className="text-[11px] text-amber-800 font-medium leading-relaxed mt-0.5">
//                                   Missing CRI irrigation parameters at this milestone will permanently reduce harvest yield weight metrics by <span className="font-extrabold text-amber-950">20-25%</span>.
//                                 </p>
//                               </div>
//                             </div>

//                             {/* Action Interaction Tool */}
//                             <button
//                               onClick={() => handleMarkComplete(4)}
//                               className={`h-[36px] w-full text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 border border-transparent ${
//                                 isPhase4Complete
//                                   ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer"
//                                   : "bg-[#31572c] hover:bg-[#132a13] text-[#ecf39e] active:scale-[0.98] cursor-pointer"
//                               }`}
//                             >
//                               <Check className="w-4 h-4" />
//                               <span>{isPhase4Complete ? "Reopen Phase Actions" : "Mark Phase Actions Complete"}</span>
//                             </button>

//                           </div>
//                         )}

//                         {/* Collapsed view markup representation for other phases */}
//                         {phase.id !== 4 && (
//                           <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-2">
//                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Growth Phase Status</span>
//                             <div className="flex items-center justify-between">
//                               <span className="text-xs font-semibold text-gray-500">
//                                 {isCompleted ? "Status: Milestone Completed Successfully" : "Status: Awaiting Prior Milestones"}
//                               </span>
//                               <button
//                                 onClick={() => handleMarkComplete(phase.id)}
//                                 className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
//                                   isCompleted
//                                     ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
//                                     : "bg-white border-gray-250 text-gray-600 hover:bg-gray-55"
//                                   }`}
//                               >
//                                 {isCompleted ? "Mark Incomplete" : "Mark Complete"}
//                               </button>
//                             </div>
//                           </div>
//                         )}

//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Panel B: AI Real-Time Weather Intervention Logs (Right Column — Span: 1) */}
//         <div className="lg:col-span-1 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4 min-h-[460px] text-left">

//           {/* Panel Header */}
//           <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
//             <Cpu className="h-4.5 w-4.5 text-gray-400" />
//             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//               AI Live Interventions
//             </h3>
//           </div>

//           <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
//             Dynamic anomaly trackers scanning regional crop grids for weather fluctuations and pathogen threats.
//           </p>

//           <div className="space-y-4">
//             {interventions.map((item, idx) => (
//               <div
//                 key={idx}
//                 className={`border rounded-xl p-4 space-y-1.5 shadow-sm text-left ${
//                   item.type === "weather"
//                     ? "bg-emerald-50/40 border-emerald-100/70 text-emerald-800"
//                     : "bg-red-50/40 border-red-100/70 text-red-950"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   {item.type === "weather" ? (
//                     <CloudRain className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
//                   ) : (
//                     <ShieldAlert className="w-4.5 h-4.5 text-red-700 shrink-0" />
//                   )}
//                   <h4 className="text-xs font-bold text-gray-900">
//                     {item.title}
//                   </h4>
//                 </div>
//                 <p className={`text-[11px] leading-relaxed font-medium ${item.type === "weather" ? "text-gray-500" : "text-red-800"}`}>
//                   {item.desc}
//                 </p>
//               </div>
//             ))}

//             {/* Info Pill */}
//             <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-3 flex items-start gap-2.5">
//               <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
//               <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
//                 Diagnostics scan fully refreshed against regional ISRO BHUMI satellite spectral feed parameters.
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lightbulb,
  CloudRain,
  ShieldAlert,
  Calendar,
  Loader2,
  MapPin,
} from "lucide-react";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { getLifecycleGuidance } from "../../services/geminiService";
import { profileApi, weatherApi } from "../../services/apiService";

// Helper: Auto-detect growth stage from planting date
const calculateCurrentStage = (plantingDate, cropName) => {
  if (!plantingDate)
    return {
      stageId: 3,
      stageName: "Germination",
      daysInStage: 0,
      daysRemaining: 20,
      progress: 25,
    };

  const sowing = new Date(plantingDate);
  const now = new Date();
  const diffDays = Math.ceil((now - sowing) / (1000 * 60 * 60 * 24));

  const cropLower = cropName?.toLowerCase() || "";
  const isRice = cropLower.includes("rice") || cropLower.includes("paddy");
  const isWheat = cropLower.includes("wheat");
  const isCotton = cropLower.includes("cotton");

  if (isRice) {
    if (diffDays < 20)
      return {
        stageId: 3,
        stageName: "Germination",
        daysInStage: diffDays,
        daysRemaining: 20 - diffDays,
        progress: (diffDays / 20) * 100,
      };
    if (diffDays < 45)
      return {
        stageId: 4,
        stageName: "Tillering",
        daysInStage: diffDays - 20,
        daysRemaining: 45 - diffDays,
        progress: ((diffDays - 20) / 25) * 100,
      };
    if (diffDays < 75)
      return {
        stageId: 6,
        stageName: "Flowering",
        daysInStage: diffDays - 45,
        daysRemaining: 75 - diffDays,
        progress: ((diffDays - 45) / 30) * 100,
      };
    return {
      stageId: 7,
      stageName: "Maturity",
      daysInStage: diffDays - 75,
      daysRemaining: Math.max(0, 105 - diffDays),
      progress: Math.min(100, ((diffDays - 75) / 30) * 100),
    };
  } else if (isWheat) {
    if (diffDays < 15)
      return {
        stageId: 3,
        stageName: "Germination",
        daysInStage: diffDays,
        daysRemaining: 15 - diffDays,
        progress: (diffDays / 15) * 100,
      };
    if (diffDays < 50)
      return {
        stageId: 4,
        stageName: "Tillering",
        daysInStage: diffDays - 15,
        daysRemaining: 50 - diffDays,
        progress: ((diffDays - 15) / 35) * 100,
      };
    if (diffDays < 90)
      return {
        stageId: 6,
        stageName: "Flowering",
        daysInStage: diffDays - 50,
        daysRemaining: 90 - diffDays,
        progress: ((diffDays - 50) / 40) * 100,
      };
    return {
      stageId: 8,
      stageName: "Harvest",
      daysInStage: diffDays - 90,
      daysRemaining: Math.max(0, 120 - diffDays),
      progress: Math.min(100, ((diffDays - 90) / 30) * 100),
    };
  } else if (isCotton) {
    if (diffDays < 20)
      return {
        stageId: 3,
        stageName: "Seedling",
        daysInStage: diffDays,
        daysRemaining: 20 - diffDays,
        progress: (diffDays / 20) * 100,
      };
    if (diffDays < 50)
      return {
        stageId: 4,
        stageName: "Squaring",
        daysInStage: diffDays - 20,
        daysRemaining: 50 - diffDays,
        progress: ((diffDays - 20) / 30) * 100,
      };
    if (diffDays < 80)
      return {
        stageId: 5,
        stageName: "Flowering",
        daysInStage: diffDays - 50,
        daysRemaining: 80 - diffDays,
        progress: ((diffDays - 50) / 30) * 100,
      };
    if (diffDays < 110)
      return {
        stageId: 6,
        stageName: "Boll Development",
        daysInStage: diffDays - 80,
        daysRemaining: 110 - diffDays,
        progress: ((diffDays - 80) / 30) * 100,
      };
    return {
      stageId: 8,
      stageName: "Harvest",
      daysInStage: diffDays - 110,
      daysRemaining: Math.max(0, 150 - diffDays),
      progress: Math.min(100, ((diffDays - 110) / 40) * 100),
    };
  }

  return {
    stageId: 4,
    stageName: "Tillering",
    daysInStage: diffDays,
    daysRemaining: 30,
    progress: 50,
  };
};

// Crop-specific lifecycle phases
const CROP_PHASES = {
  Wheat: [
    {
      id: 1,
      name: "Land Preparation",
      desc: "Field plowed and baseline gypsum applied for salinity buffering.",
    },
    {
      id: 2,
      name: "Sowing",
      desc: "Certified HD-3086 wheat seeds sown at 4-5 cm depth.",
    },
    {
      id: 3,
      name: "Germination",
      desc: "Coleoptile emergence success rate mapped at 96%.",
    },
    {
      id: 4,
      name: "Tillering",
      desc: "Crown roots initiating. Critical Nitrogen top-dressing required.",
    },
    {
      id: 5,
      name: "Jointing",
      desc: "Stalk elongation phase. First node visible.",
    },
    {
      id: 6,
      name: "Flowering",
      desc: "Pollen tube expansion and spikelet emergence.",
    },
    {
      id: 7,
      name: "Grain Filling",
      desc: "Milk-to-dough photosynthates translocation to grain kernels.",
    },
    {
      id: 8,
      name: "Harvest",
      desc: "Physiological maturity. Reaping when grain moisture falls to 14%.",
    },
  ],
  Rice: [
    {
      id: 1,
      name: "Nursery Preparation",
      desc: "Seeding wet-bed nursery with organic manures.",
    },
    {
      id: 2,
      name: "Land Puddling",
      desc: "Standing water flooded tillage for clay pan compaction.",
    },
    {
      id: 3,
      name: "Transplanting",
      desc: "25-day nursery seedlings transplanted at 15x20cm density.",
    },
    {
      id: 4,
      name: "Tillering",
      desc: "Panicle numbers initiating. Maintain stable 5cm water level.",
    },
    {
      id: 5,
      name: "Panicle Initiation",
      desc: "Flag leaf emergence. Stem elongation.",
    },
    {
      id: 6,
      name: "Flowering",
      desc: "Anther dehiscence. Keep water levels optimal.",
    },
    { id: 7, name: "Dough Stage", desc: "Grain starch content solidifying." },
    { id: 8, name: "Harvest", desc: "Physiological maturity reached." },
  ],
  Cotton: [
    {
      id: 1,
      name: "Land Tillage",
      desc: "Deep plowing and ridge bed configurations.",
    },
    {
      id: 2,
      name: "Sowing",
      desc: "Bt Cotton seeds sown at 3-4 cm depth under ridge beds.",
    },
    {
      id: 3,
      name: "Seedling Stage",
      desc: "Thinning completed. Gap filling done.",
    },
    {
      id: 4,
      name: "Squaring",
      desc: "First sympodial branches forming flower buds.",
    },
    {
      id: 5,
      name: "Flowering",
      desc: "Golden white petals showing up. Pollination peaking.",
    },
    {
      id: 6,
      name: "Boll Development",
      desc: "Active boll sizing. Translocation of nutrients critical.",
    },
    {
      id: 7,
      name: "Boll Bursting",
      desc: "Bolls open to expose dry cotton fiber.",
    },
    {
      id: 8,
      name: "Harvest",
      desc: "Hand picking or mechanical picking cycles.",
    },
  ],
  Mustard: [
    {
      id: 1,
      name: "Land Preparation",
      desc: "Fine tilth preparation with proper drainage.",
    },
    { id: 2, name: "Sowing", desc: "Line sowing with row spacing of 45cm." },
    {
      id: 3,
      name: "Germination",
      desc: "Seed sprouting and emergence within 5-7 days.",
    },
    {
      id: 4,
      name: "Vegetative Growth",
      desc: "Leaf development and branch initiation.",
    },
    {
      id: 5,
      name: "Flowering",
      desc: "Yellow flower appearance. Critical for pod formation.",
    },
    { id: 6, name: "Pod Formation", desc: "Pod development and seed filling." },
    { id: 7, name: "Maturity", desc: "Pod color changes to yellowish-brown." },
    { id: 8, name: "Harvest", desc: "Harvest when 80% pods turn yellow." },
  ],
};

// ========== INLINE FALLBACK FUNCTIONS (no external file needed) ==========
const getFallbackHarvestWindow = (plantingDate, cropName) => {
  if (!plantingDate) return "Estimated 110-130 days from sowing";
  const cropLower = cropName?.toLowerCase() || "";
  const duration = cropLower.includes("rice")
    ? 120
    : cropLower.includes("wheat")
      ? 110
      : cropLower.includes("cotton")
        ? 140
        : 120;
  const harvestDate = new Date(plantingDate);
  harvestDate.setDate(harvestDate.getDate() + duration);
  return harvestDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getFallbackYieldRisk = (stageName) => {
  if (stageName === "Tillering") return "20% - 25% if irrigation missed";
  if (stageName === "Flowering") return "30% - 40% if water stressed";
  if (stageName === "Maturity") return "5% - 10% due to lodging risk";
  return "15% - 20% baseline";
};

const getFallbackInterventions = (cropName, stageName, weatherAlert) => {
  const interventions = [];
  const cropLower = cropName?.toLowerCase() || "";

  if (stageName === "Tillering") {
    interventions.push({
      type: "weather",
      title: "Nitrogen Top Dressing",
      desc: "Apply first dose of urea @ 30 kg/acre during active tillering phase.",
    });
    interventions.push({
      type: "weather",
      title: "CRI Irrigation",
      desc: "Critical stage - ensure irrigation within next 3-5 days.",
    });
  } else if (stageName === "Flowering") {
    interventions.push({
      type: "pest",
      title: "Pest Monitoring",
      desc: cropLower.includes("cotton")
        ? "Watch for bollworms. Install pheromone traps."
        : "Monitor for aphids and mites.",
    });
    interventions.push({
      type: "weather",
      title: "Micronutrient Spray",
      desc: "Apply Boron and Zinc for better grain/pod formation.",
    });
  } else if (stageName === "Maturity") {
    interventions.push({
      type: "weather",
      title: "Stop Irrigation",
      desc: "Discontinue irrigation 10-15 days before harvest.",
    });
  } else {
    interventions.push({
      type: "weather",
      title: "Soil Moisture Management",
      desc: "Maintain optimal soil moisture for uniform germination.",
    });
  }

  // Add weather-based intervention
  if (weatherAlert?.type === "rain") {
    interventions.unshift({
      type: "weather",
      title: "Weather Alert",
      desc: weatherAlert.msg,
    });
  }

  return interventions.slice(0, 3);
};

export default function LifecycleGuidance() {
  // --- Profile state ---
  const [farmsList, setFarmsList] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // --- Crops from selected farm ---
  const [cropsList, setCropsList] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [plantingDate, setPlantingDate] = useState(null);

  // --- Current stage (auto-derived) ---
  const [currentStage, setCurrentStage] = useState({
    stageId: 4,
    stageName: "Tillering",
    daysInStage: 0,
    daysRemaining: 0,
    progress: 50,
  });
  const [expandedPhase, setExpandedPhase] = useState(4);
  const [completedPhases, setCompletedPhases] = useState([1, 2, 3]);

  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState(null);

  // Location state
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

  // Dynamic state from AI/fallback
  const [phases, setPhases] = useState(CROP_PHASES["Wheat"]);
  const [harvestWindow, setHarvestWindow] = useState("");
  const [yieldAtRisk, setYieldAtRisk] = useState("");
  const [interventions, setInterventions] = useState([]);

  // --- Fetch farms on mount ---
  useEffect(() => {
    let active = true;
    const loadFarms = async () => {
      try {
        const res = await profileApi.getProfile();
        if (active && res?.success && res?.data?.farms?.length) {
          const farms = res.data.farms;
          setFarmsList(farms);
          const defaultFarm = farms[0];
          setSelectedFarmId(defaultFarm._id || defaultFarm.id);
          setSelectedFarm(defaultFarm);

          const crops = defaultFarm.crops || [];
          setCropsList(crops);

          if (crops.length > 0) {
            const defaultCrop = crops[0];
            setSelectedCropId(defaultCrop._id || defaultCrop.id);
            setSelectedCrop(defaultCrop.name);
            setPlantingDate(defaultCrop.sowingDate);
          }

          // Update location from profile
          if (res.data.location) {
            const parts = res.data.location.split(",");
            setLocation((prev) => ({
              ...prev,
              district: parts[0]?.trim() || prev.district,
              state: parts[1]?.trim() || prev.state,
              pincode: res.data.pincode || prev.pincode,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load farms:", error);
        // Mock fallback for development
        setFarmsList([
          {
            _id: "1",
            name: "Home Sector Flatlands",
            crops: [{ _id: "c1", name: "Wheat", sowingDate: "2025-11-05" }],
          },
        ]);
        setSelectedCrop("Wheat");
        setPlantingDate("2025-11-05");
        setCropsList([{ _id: "c1", name: "Wheat", sowingDate: "2025-11-05" }]);
      }
    };
    loadFarms();
    return () => {
      active = false;
    };
  }, []);

  // --- When farm changes, update crops ---
  useEffect(() => {
    if (selectedFarm) {
      const crops = selectedFarm.crops || [];
      setCropsList(crops);
      if (crops.length > 0 && !selectedCropId) {
        const firstCrop = crops[0];
        setSelectedCropId(firstCrop._id || firstCrop.id);
        setSelectedCrop(firstCrop.name);
        setPlantingDate(firstCrop.sowingDate);
      }
    }
  }, [selectedFarm]);

  // --- Auto-calculate current stage ---
  useEffect(() => {
    if (selectedCrop && plantingDate) {
      const stage = calculateCurrentStage(plantingDate, selectedCrop);
      setCurrentStage(stage);
      setExpandedPhase(stage.stageId);

      // Auto-complete previous stages
      const completed = [];
      for (let i = 1; i < stage.stageId; i++) completed.push(i);
      setCompletedPhases(completed);

      // Update phases based on crop
      const cropKey = selectedCrop.split(" ")[0];
      const cropPhases = CROP_PHASES[cropKey] || CROP_PHASES["Wheat"];
      setPhases(cropPhases);
    }
  }, [selectedCrop, plantingDate]);

  // --- Fetch weather and load guidance (Hybrid: Gemini first, then inline fallback) ---
  useEffect(() => {
    let active = true;
    if (!selectedCrop || !currentStage.stageName || !location.district) return;

    const loadGuidance = async () => {
      setLoading(true);
      setUsingFallback(false);

      try {
        // Fetch weather first
        const weather = await weatherApi?.getCurrentWeather?.(
          location.district,
          location.latitude,
          location.longitude,
        );
        if (weather?.success) {
          const temp = weather.data?.temperature;
          const humidity = weather.data?.humidity;
          const rainfall = weather.data?.rainfall;

          if (rainfall > 10)
            setWeatherAlert({
              type: "rain",
              msg: "Skip next irrigation - sufficient rainfall received",
            });
          else if (temp > 35)
            setWeatherAlert({
              type: "heat",
              msg: "High temperature - increase irrigation frequency",
            });
          else if (humidity > 80)
            setWeatherAlert({
              type: "humidity",
              msg: "High humidity - monitor for fungal diseases",
            });
          else setWeatherAlert(null);
        }

        // Try Gemini first
        const result = await getLifecycleGuidance(
          selectedCrop,
          plantingDate,
          location.district,
          location.state,
        );

        if (active && result) {
          setHarvestWindow(
            result.harvestWindow ||
              getFallbackHarvestWindow(plantingDate, selectedCrop),
          );
          setYieldAtRisk(
            result.yieldAtRisk || getFallbackYieldRisk(currentStage.stageName),
          );
          setInterventions(
            result.interventions ||
              getFallbackInterventions(
                selectedCrop,
                currentStage.stageName,
                weatherAlert,
              ),
          );
          setUsingFallback(false);
        }
      } catch (error) {
        console.warn("Gemini failed, using inline fallback:", error);

        // Inline fallback - NO external file needed
        if (active) {
          setHarvestWindow(
            getFallbackHarvestWindow(plantingDate, selectedCrop),
          );
          setYieldAtRisk(getFallbackYieldRisk(currentStage.stageName));
          setInterventions(
            getFallbackInterventions(
              selectedCrop,
              currentStage.stageName,
              weatherAlert,
            ),
          );
          setUsingFallback(true);
        }
      }
      setLoading(false);
    };

    loadGuidance();
  }, [selectedCrop, currentStage.stageName, location.district, plantingDate]);

  const handleLocationChange = (newLocation) => setLocation(newLocation);

  const handleFarmChange = (farmId) => {
    const farm = farmsList.find((f) => (f._id || f.id) === farmId);
    if (farm) {
      setSelectedFarmId(farmId);
      setSelectedFarm(farm);
      setSelectedCropId(null);
      setSelectedCrop(null);
    }
  };

  const handleCropChange = (cropId) => {
    const crop = cropsList.find((c) => (c._id || c.id) === cropId);
    if (crop) {
      setSelectedCropId(cropId);
      setSelectedCrop(crop.name);
      setPlantingDate(crop.sowingDate);
    }
  };

  const handleMarkComplete = (id) => {
    if (!completedPhases.includes(id)) {
      setCompletedPhases([...completedPhases, id]);
      if (id < 8) setExpandedPhase(id + 1);
    } else {
      setCompletedPhases(completedPhases.filter((v) => v !== id));
    }
  };

  const handleToggleAccordion = (id) =>
    setExpandedPhase(expandedPhase === id ? null : id);

  const isPhase4Complete = completedPhases.includes(4);
  const displayYieldRisk = isPhase4Complete ? "0% - 5%" : yieldAtRisk;
  const cropKey = selectedCrop?.split(" ")[0] || "Wheat";
  const currentPhases = phases.length
    ? phases
    : CROP_PHASES[cropKey] || CROP_PHASES["Wheat"];

  const getDaysToHarvest = () => {
    if (!plantingDate) return "—";
    const cropLower = selectedCrop?.toLowerCase() || "";
    const duration = cropLower.includes("rice") || cropLower.includes("paddy")
      ? 120
      : cropLower.includes("wheat")
        ? 110
        : cropLower.includes("cotton")
          ? 140
          : 120;
    const sowing = new Date(plantingDate);
    const harvestDate = new Date(sowing);
    harvestDate.setDate(sowing.getDate() + duration);
    const now = new Date();
    const diffTime = harvestDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : "Ready for Harvest";
  };


  return (
    <div className="space-y-5 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif] text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="text-left">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>AI Lifecycle Guidance</span>
            <span className="text-gray-300 font-light">|</span>
            <span className="text-[#31572c] font-bold text-[10px] md:text-xs bg-[#31572c]/8 px-2 py-0.5 rounded-md">
              फसल चक्र पूर्वानुमान
            </span>
          </h1>
          <p className="text-gray-500 text-[10px] mt-0.5">
            Predictive growth timeline with AI-powered recommendations
            {usingFallback && (
              <span className="ml-2 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[9px]">
                Using rule-based estimates
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Farm & Crop Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">
            Select Farm
          </label>
          <select
            value={selectedFarmId || ""}
            onChange={(e) => handleFarmChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
          >
            {farmsList.map((farm) => (
              <option key={farm._id || farm.id} value={farm._id || farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">
            Select Crop
          </label>
          <select
            value={selectedCropId || ""}
            onChange={(e) => handleCropChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
          >
            {cropsList.map((crop) => (
              <option key={crop._id || crop.id} value={crop._id || crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">
            Current Stage
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700">
            {currentStage.stageName} • Day {currentStage.daysInStage} •{" "}
            {Math.round(currentStage.progress)}% complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-[#31572c] h-full rounded-full transition-all"
          style={{ width: `${(currentStage.stageId / 8) * 100}%` }}
        />
      </div>

      {/* Weather Alert Banner */}
      {weatherAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-amber-600" />
          <p className="text-[10px] text-amber-800">{weatherAlert.msg}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase">
            Current Stage
          </p>
          <p className="text-xs font-bold text-gray-800 mt-1">
            {currentStage.stageName}
          </p>
          <p className="text-[9px] text-gray-500">
            Stage {currentStage.stageId} of 8
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase">
            Harvest Window
          </p>
          <p className="text-[10px] font-bold text-gray-800 mt-1">
            {harvestWindow || "Calculating..."}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase">
            Yield at Risk
          </p>
          <p
            className={`text-[10px] font-bold mt-1 ${isPhase4Complete ? "text-emerald-600" : "text-red-600"}`}
          >
            {displayYieldRisk || "Estimating..."}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase">
            Days to Harvest
          </p>
          <p className="text-xs font-bold text-gray-800 mt-1">
            {getDaysToHarvest()}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
            <Loader2 className="w-6 h-6 text-[#31572c] animate-spin" />
          </div>
        )}

        {/* Timeline Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-bold text-gray-700 pb-2 border-b border-gray-100">
            Growth Timeline
          </h3>
          <div className="space-y-3 mt-3">
            {currentPhases.map((phase) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isActive = expandedPhase === phase.id;
              const isCurrent = phase.id === currentStage.stageId;

              return (
                <div key={phase.id} className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleAccordion(phase.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                          ? "bg-[#31572c] text-white ring-4 ring-[#31572c]/20"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : phase.id}
                  </button>
                  <div className="flex-1">
                    <div
                      onClick={() => handleToggleAccordion(phase.id)}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-gray-800">
                          {phase.name}
                        </span>
                        {isCurrent && (
                          <span className="ml-2 text-[8px] text-[#31572c] bg-[#31572c]/10 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isActive ? "rotate-180" : ""}`}
                      />
                    </div>
                    {isActive && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[9px] text-gray-600 leading-relaxed">
                          {phase.desc}
                        </p>
                        {phase.id === 4 && !isCompleted && (
                          <button
                            onClick={() => handleMarkComplete(4)}
                            className="mt-2 w-full bg-[#31572c] text-white text-[9px] font-bold py-1.5 rounded-lg hover:bg-[#1e3a1a] transition-colors"
                          >
                            Mark Phase Complete
                          </button>
                        )}
                        {phase.id === 4 && isCompleted && (
                          <div className="mt-2 text-[9px] text-emerald-600 bg-emerald-50 p-2 rounded-lg text-center">
                            ✓ Phase completed - Critical irrigation marked
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - AI Recommendations */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Cpu className="w-3.5 h-3.5 text-gray-400" />
              <h3 className="text-[10px] font-bold text-gray-500 uppercase">
                AI Recommendations
              </h3>
            </div>
            <div className="space-y-3 mt-3">
              {interventions.length > 0 ? (
                interventions.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg ${
                      item.type === "weather"
                        ? "bg-emerald-50/40 border border-emerald-100"
                        : "bg-amber-50/40 border border-amber-100"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {item.type === "weather" ? (
                        <CloudRain className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                      )}
                      <p className="text-[9px] font-semibold text-gray-700">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-[8px] text-gray-500 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[9px] text-gray-400 text-center py-2">
                  No active recommendations
                </p>
              )}

              {/* Info Box */}
              <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-2.5 flex items-start gap-2">
                <Lightbulb className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[8px] text-blue-700 leading-relaxed">
                  AI model trained on regional crop data, weather patterns, and
                  historical yield analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
