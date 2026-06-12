// // PAGE 1 — Executive Dashboard
// // File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/ExecutiveDashboard.jsx

// import React, { useState, useEffect } from "react";
// import seededData from "../../../seed-json/seededData.json";
// import StatsCard from "../../../components/partials/StatsCard";
// import {
//   Users,
//   MapPin,
//   Sprout,
//   Shield,
//   AlertTriangle,
//   Activity,
//   TrendingUp,
//   Bell,
//   CheckCircle,
//   ShieldAlert,
//   Sparkles,
//   ArrowUpRight,
//   ArrowDownRight,
// } from "lucide-react";
// import GenericTable from "../../../components/partials/GenericTable";

// export default function ExecutiveDashboard() {
//   const [selectedDisease, setSelectedDisease] = useState(null);

//   const [dataState, setDataState] = useState(() => {
//     const saved = localStorage.getItem("fpoDiseaseDetectionState");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (parsed && Array.isArray(parsed.kpis)) {
//           return parsed;
//         }
//       } catch (e) {
//         console.error("Failed to parse FPO state", e);
//       }
//     }
//     return seededData.fpoDiseaseDetection;
//   });

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const saved = localStorage.getItem("fpoDiseaseDetectionState");
//       if (saved) {
//         try {
//           const parsed = JSON.parse(saved);
//           if (parsed && Array.isArray(parsed.kpis)) {
//             setDataState(parsed);
//           }
//         } catch (e) {
//           console.error("Failed to parse FPO state from storage event", e);
//         }
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const headerStats = dataState.headerStats || [
//     { label: "Total Farmers", value: "1,247" },
//     { label: "Total Villages", value: "23" },
//     { label: "Total Crops", value: "11" },
//     { label: "Acres Monitored", value: "34,820" },
//   ];

//   const getKpiColor = (colorType) => {
//     switch (colorType) {
//       case "red":
//         return "text-red-700 bg-red-500/10 border-red-500/20";
//       case "amber":
//         return "text-amber-600 bg-amber-500/10 border-amber-500/20";
//       case "blue":
//         return "text-blue-600 bg-blue-500/10 border-blue-500/20";
//       case "green":
//         return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
//       default:
//         return "text-slate-605 bg-slate-500/10 border-slate-500/20";
//     }
//   };

//   const kpis = Array.isArray(dataState.kpis) ? dataState.kpis : [];
//   const distribution = Array.isArray(dataState.diseaseDistribution)
//     ? dataState.diseaseDistribution
//     : [];
//   const topThreats = Array.isArray(dataState.topThreats)
//     ? dataState.topThreats
//     : [];
//   const trendData = Array.isArray(dataState.caseTrend30D)
//     ? dataState.caseTrend30D
//     : [];
//   const riskVillages = Array.isArray(dataState.riskVillages)
//     ? dataState.riskVillages
//     : [];
//   const emergencyActions = Array.isArray(dataState.emergencyActions)
//     ? dataState.emergencyActions
//     : [];
//   const aiRecommendations = Array.isArray(dataState.aiRecommendations)
//     ? dataState.aiRecommendations
//     : [];

//   return (
//     <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
//       {/* Page Header */}
//       <div className="space-y-1 text-left">
//         <h1 className="text-2xl font-black text-[#132a13] tracking-tight">
//           Surveillance Intelligence Command Center
//         </h1>
//         <p className="text-slate-500 text-xs font-semibold">
//           Real-time pathogen tracking, alert coordinates, and response campaigns
//           for regional agricultural blocks.
//         </p>
//       </div>
//       {/* Stats Cards Row */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {headerStats.map((stat, idx) => {
//           const Icon =
//             idx === 0
//               ? Users
//               : idx === 1
//                 ? MapPin
//                 : idx === 2
//                   ? Sprout
//                   : Shield;
//           return (
//             <StatsCard
//               key={idx}
//               title={stat.label}
//               value={stat.value}
//               icon={<Icon className="text-emerald-700" />}
//               subtext="Monitored in database"
//             />
//           );
//         })}
//       </div>
//       {/* KPI Cards */}
//       {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {kpis.map((kpi, idx) => (
//           <div
//             key={idx}
//             className={`p-4 rounded-2xl border flex flex-col justify-between h-24 shadow-sm hover:shadow-md transition-all ${getKpiColor(kpi.colorType)}`}
//           >
//             <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
//               {kpi.label}
//             </span>
//             <span className="text-xl font-black tracking-tight">
//               {kpi.value}
//             </span>
//           </div>
//         ))}
//       </div> */}
//       {/* Stats Row 2: Uniform White Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//         {kpis.map((kpi, idx) => (
//           <div
//             key={idx}
//             className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
//           >
//             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
//               {kpi.label}
//             </span>
//             <span className="text-lg font-black text-gray-900 mt-1 block">
//               {kpi.value}
//             </span>
//           </div>
//         ))}
//       </div>
//       {/* Main dashboard widgets grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Threats Table */}
//           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//               <Activity className="w-4 h-4 text-red-500" />
//               Top Regional Threats
//             </h3>

//             <div className="overflow-x-auto">
//               {/* <table className="w-full text-xs text-left">
//                 <thead>
//                   <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     <th className="py-2.5">Disease</th>
//                     <th className="py-2.5">Village</th>
//                     <th className="py-2.5 text-center">Severity</th>
//                     <th className="py-2.5 text-center">Farmers</th>
//                     <th className="py-2.5 text-center">Acres</th>
//                     <th className="py-2.5 text-right">Trend</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 font-bold">
//                   {topThreats.map((threat, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="py-3 text-slate-900 flex items-center gap-1.5">
//                         <Sprout className="w-3.5 h-3.5 text-[#31572c]" />{" "}
//                         {threat.disease}
//                       </td>
//                       <td className="py-3 text-slate-500">{threat.village}</td>
//                       <td className="py-3 text-center">
//                         <span
//                           className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
//                             threat.severity === "Critical"
//                               ? "bg-red-100 text-red-700"
//                               : threat.severity === "High"
//                                 ? "bg-amber-100 text-amber-700"
//                                 : "bg-blue-100 text-blue-700"
//                           }`}
//                         >
//                           {threat.severity}
//                         </span>
//                       </td>
//                       <td className="py-3 text-center text-slate-700">
//                         {threat.farmers}
//                       </td>
//                       <td className="py-3 text-center text-slate-700">
//                         {threat.acres} ac
//                       </td>
//                       <td className="py-3 text-right">
//                         <span
//                           className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
//                             threat.trend === "up"
//                               ? "text-red-700 bg-red-100"
//                               : threat.trend === "down"
//                                 ? "text-emerald-700 bg-emerald-100"
//                                 : "text-slate-600 bg-slate-100"
//                           }`}
//                         >
//                           {threat.trend === "up" ? (
//                             <ArrowUpRight className="w-3 h-3" />
//                           ) : (
//                             <ArrowDownRight className="w-3 h-3" />
//                           )}
//                           {threat.trend === "up"
//                             ? "Increasing"
//                             : threat.trend === "down"
//                               ? "Decreasing"
//                               : "Stable"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table> */}
//               <GenericTable
//                 showSearch={true}
//                 showSort={true}
//                 searchPlaceholder="Search threats..."
//                 data={topThreats}
//                 itemsPerPage={10}
//                 onRowClick={(row) => console.log(row)}
//                 columns={[
//                   {
//                     header: "Disease",
//                     accessor: "disease",
//                     cell: (value) => (
//                       <div className="flex items-center gap-1.5">
//                         <Sprout className="w-3.5 h-3.5 text-[#31572c]" />
//                         <span className="text-slate-900 font-bold">
//                           {value}
//                         </span>
//                       </div>
//                     ),
//                   },
//                   {
//                     header: "Village",
//                     accessor: "village",
//                     cell: (value) => (
//                       <span className="text-slate-500">{value}</span>
//                     ),
//                   },
//                   {
//                     header: "Severity",
//                     accessor: "severity",
//                     cell: (value) => (
//                       <div className="text-center">
//                         <span
//                           className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
//                             value === "Critical"
//                               ? "bg-red-100 text-red-700"
//                               : value === "High"
//                                 ? "bg-amber-100 text-amber-700"
//                                 : "bg-blue-100 text-blue-700"
//                           }`}
//                         >
//                           {value}
//                         </span>
//                       </div>
//                     ),
//                   },
//                   {
//                     header: "Farmers",
//                     accessor: "farmers",
//                     cell: (value) => (
//                       <div className="text-center text-slate-700">{value}</div>
//                     ),
//                   },
//                   {
//                     header: "Acres",
//                     accessor: "acres",
//                     cell: (value) => (
//                       <div className="text-center text-slate-700">
//                         {value} ac
//                       </div>
//                     ),
//                   },
//                   {
//                     header: "Trend",
//                     accessor: "trend",
//                     cell: (value) => (
//                       <div className="flex justify-end">
//                         <span
//                           className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
//                             value === "up"
//                               ? "text-red-700 bg-red-100"
//                               : value === "down"
//                                 ? "text-emerald-700 bg-emerald-100"
//                                 : "text-slate-600 bg-slate-100"
//                           }`}
//                         >
//                           {value === "up" ? (
//                             <ArrowUpRight className="w-3 h-3" />
//                           ) : (
//                             <ArrowDownRight className="w-3 h-3" />
//                           )}
//                           {value === "up"
//                             ? "Increasing"
//                             : value === "down"
//                               ? "Decreasing"
//                               : "Stable"}
//                         </span>
//                       </div>
//                     ),
//                   },
//                 ]}
//               />
//             </div>
//           </div>

//           {/* Trend Chart (SVG Line & Bar) */}
//           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
//               <TrendingUp className="w-4 h-4 text-purple-600" />
//               30-Day Case Progression
//             </h3>

//             <div className="h-48 relative w-full pt-4">
//               <svg
//                 className="w-full h-full"
//                 viewBox="0 0 500 150"
//                 preserveAspectRatio="none"
//               >
//                 {/* Horizontal grid lines */}
//                 <line
//                   x1="40"
//                   y1="20"
//                   x2="480"
//                   y2="20"
//                   stroke="#f1f5f9"
//                   strokeWidth="1"
//                 />
//                 <line
//                   x1="40"
//                   y1="70"
//                   x2="480"
//                   y2="70"
//                   stroke="#f1f5f9"
//                   strokeWidth="1"
//                 />
//                 <line
//                   x1="40"
//                   y1="120"
//                   x2="480"
//                   y2="120"
//                   stroke="#cbd5e1"
//                   strokeWidth="1.5"
//                 />

//                 {/* Bars drawing */}
//                 {trendData.map((d, idx) => {
//                   const x = 55 + idx * 75;
//                   const newH = Math.min(100, d.newCases * 3.5);
//                   const resH = Math.min(100, d.resolvedCases * 3.5);
//                   return (
//                     <g key={idx}>
//                       {/* New Cases (Red bar) */}
//                       <rect
//                         x={x}
//                         y={120 - newH}
//                         width="12"
//                         height={newH}
//                         fill="#ef4444"
//                         opacity="0.85"
//                         rx="2"
//                       />
//                       {/* Resolved (Green bar) */}
//                       <rect
//                         x={x + 16}
//                         y={120 - resH}
//                         width="12"
//                         height={resH}
//                         fill="#4f772d"
//                         opacity="0.85"
//                         rx="2"
//                       />
//                       {/* Text */}
//                       <text
//                         x={x}
//                         y="138"
//                         fill="#94a3b8"
//                         fontSize="8"
//                         fontWeight="bold"
//                       >
//                         {d.day}
//                       </text>
//                     </g>
//                   );
//                 })}
//               </svg>
//             </div>
//             <div className="flex justify-center gap-6 text-[10px] font-black uppercase text-slate-500 pt-1">
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded bg-red-500" /> New Cases
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2.5 w-2.5 rounded bg-brand-medium" /> Resolved
//                 Cases
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Right Columns Widgets */}
//         <div className="space-y-6">
//           {/* Disease Distribution SVG Donut */}
//           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
//               Disease Distribution
//             </h3>

//             <div className="flex items-center justify-around gap-4 py-2">
//               <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
//                 <svg
//                   className="w-full h-full transform -rotate-90"
//                   viewBox="0 0 100 100"
//                 >
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     stroke="#f1f5f9"
//                     strokeWidth="12"
//                   />

//                   {/* Slices representation strokeDasharray/offsets based on percentages */}
//                   {/* Rice Blast 34% (stroke: 85.4) */}
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     stroke="#ef4444"
//                     strokeWidth={selectedDisease === 0 ? "14" : "11"}
//                     strokeDasharray="85.4 251.2"
//                     strokeDashoffset="0"
//                     className="cursor-pointer transition-all"
//                     onClick={() => setSelectedDisease(0)}
//                   />
//                   {/* Yellow Rust 28% (stroke: 70.3) */}
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     stroke="#f59e0b"
//                     strokeWidth={selectedDisease === 1 ? "14" : "11"}
//                     strokeDasharray="70.3 251.2"
//                     strokeDashoffset="-85.4"
//                     className="cursor-pointer transition-all"
//                     onClick={() => setSelectedDisease(1)}
//                   />
//                   {/* Late Blight 19% (stroke: 47.7) */}
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     stroke="#8b5cf6"
//                     strokeWidth={selectedDisease === 2 ? "14" : "11"}
//                     strokeDasharray="47.7 251.2"
//                     strokeDashoffset="-155.7"
//                     className="cursor-pointer transition-all"
//                     onClick={() => setSelectedDisease(2)}
//                   />
//                   {/* Downy Mildew 12% (stroke: 30.1) */}
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     stroke="#3b82f6"
//                     strokeWidth={selectedDisease === 3 ? "14" : "11"}
//                     strokeDasharray="30.1 251.2"
//                     strokeDashoffset="-203.4"
//                     className="cursor-pointer transition-all"
//                     onClick={() => setSelectedDisease(3)}
//                   />
//                   {/* Other 7% (stroke: 17.6) */}
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     fill="transparent"
//                     stroke="#10b981"
//                     strokeWidth={selectedDisease === 4 ? "14" : "11"}
//                     strokeDasharray="17.6 251.2"
//                     strokeDashoffset="-233.5"
//                     className="cursor-pointer transition-all"
//                     onClick={() => setSelectedDisease(4)}
//                   />
//                 </svg>
//                 <div className="absolute text-center">
//                   <span className="text-sm font-black text-slate-800">
//                     {selectedDisease !== null
//                       ? distribution[selectedDisease].value
//                       : 100}
//                     %
//                   </span>
//                   <span className="text-[7px] text-slate-400 font-bold block uppercase">
//                     {selectedDisease !== null
//                       ? distribution[selectedDisease].name.split(" ")[0]
//                       : "Total"}
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-1.5 text-[10px] font-bold text-slate-600">
//                 {distribution.map((item, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => setSelectedDisease(idx)}
//                     className={`flex items-center gap-1.5 cursor-pointer p-1 rounded transition ${selectedDisease === idx ? "bg-slate-50" : ""}`}
//                   >
//                     <span
//                       className="h-2 w-2 rounded-full"
//                       style={{ backgroundColor: item.color }}
//                     />
//                     <span>
//                       {item.name} ({item.value}%)
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {selectedDisease !== null && (
//               <div className="bg-slate-50 p-3 rounded-xl flex justify-between text-[11px] font-bold">
//                 <div>
//                   <span className="text-[8px] text-slate-400 uppercase block">
//                     Impacted Farmers
//                   </span>
//                   <span className="text-slate-800">
//                     {distribution[selectedDisease].farmers} Growers
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-[8px] text-slate-400 uppercase block">
//                     Acreage Affected
//                   </span>
//                   <span className="text-slate-800">
//                     {distribution[selectedDisease].acres} acres
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* High-Risk Villages Progress */}
//           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
//               High-Risk Villages Index
//             </h3>

//             <div className="space-y-3.5">
//               {riskVillages.map((item, idx) => (
//                 <div key={idx} className="space-y-1.5 text-xs font-bold">
//                   <div className="flex justify-between">
//                     <span className="text-slate-800">{item.name}</span>
//                     <span className="text-slate-400">
//                       {item.affected} Farmers affected
//                     </span>
//                   </div>
//                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
//                     <div
//                       className={`h-full rounded-full ${
//                         item.risk >= 80
//                           ? "bg-red-500"
//                           : item.risk >= 60
//                             ? "bg-amber-500"
//                             : "bg-blue-500"
//                       }`}
//                       style={{ width: `${item.risk}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between text-[9px] font-black uppercase">
//                     <span className="text-purple-600">{item.disease} Tag</span>
//                     <span className="text-slate-400">
//                       {item.risk}% Risk Score
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-6">
//           {/* Emergency Action Center */}
//           <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4.5 space-y-3">
//             <h3 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center gap-1.5">
//               <ShieldAlert className="w-4 h-4 text-red-600" />
//               Emergency Action Center
//             </h3>
//             <div className="space-y-2.5">
//               {emergencyActions.map((action) => (
//                 <div
//                   key={action.id}
//                   className="bg-white border border-slate-100 p-3 rounded-xl space-y-2 text-xs"
//                 >
//                   <p className="text-slate-700 leading-relaxed font-semibold">
//                     {action.msg}
//                   </p>
//                   <button
//                     type="button"
//                     className="w-full py-1.5 bg-brand-dark hover:bg-[#132a13] text-white rounded-lg font-black uppercase tracking-wider text-[9px] cursor-pointer"
//                   >
//                     {action.btnText}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* AI Recommendations */}
//           <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4.5 space-y-3.5">
//             <h3 className="text-xs font-black text-purple-800 uppercase tracking-widest flex items-center gap-1.5">
//               <Sparkles className="w-4 h-4 text-purple-600" />
//               AI Surveillance Directives
//             </h3>

//             <div className="space-y-3">
//               {aiRecommendations.map((rec, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white border border-slate-100 p-3.5 rounded-xl space-y-1.5 text-xs"
//                 >
//                   <div className="flex justify-between items-center">
//                     <h4 className="font-black text-slate-800">{rec.title}</h4>
//                     <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[8px] font-black uppercase">
//                       AI Advisory
//                     </span>
//                   </div>
//                   <p className="text-slate-500 leading-normal font-semibold text-[11px]">
//                     {rec.desc}
//                   </p>
//                   <button
//                     type="button"
//                     className="text-[#31572c] hover:text-[#132a13] font-black text-[9px] uppercase tracking-wider block pt-1"
//                   >
//                     {rec.action} ➔
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       //{" "}
//     </div>
//   );
// }

// PAGE 1 — Executive Dashboard
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/ExecutiveDashboard.jsx

import React, { useState, useEffect } from "react";
import seededData from "../../../seed-json/seededData.json";
import StatsCard from "../../../components/partials/StatsCard";
import {
  Users,
  MapPin,
  Sprout,
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  Bell,
  CheckCircle,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import GenericTable from "../../../components/partials/GenericTable";

export default function ExecutiveDashboard() {
  const [selectedDisease, setSelectedDisease] = useState(null);

  const [dataState, setDataState] = useState(() => {
    const saved = localStorage.getItem("fpoDiseaseDetectionState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.kpis)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse FPO state", e);
      }
    }
    return seededData.fpoDiseaseDetection;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("fpoDiseaseDetectionState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.kpis)) {
            setDataState(parsed);
          }
        } catch (e) {
          console.error("Failed to parse FPO state from storage event", e);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const headerStats = dataState.headerStats || [
    { label: "Total Farmers", value: "1,247" },
    { label: "Total Villages", value: "23" },
    { label: "Total Crops", value: "11" },
    { label: "Acres Monitored", value: "34,820" },
  ];

  const getKpiColor = (colorType) => {
    switch (colorType) {
      case "red":
        return "text-red-700 bg-red-500/10 border-red-500/20";
      case "amber":
        return "text-amber-600 bg-amber-500/10 border-amber-500/20";
      case "blue":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20";
      case "green":
        return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "text-slate-605 bg-slate-500/10 border-slate-500/20";
    }
  };

  const kpis = Array.isArray(dataState.kpis) ? dataState.kpis : [];
  const distribution = Array.isArray(dataState.diseaseDistribution)
    ? dataState.diseaseDistribution
    : [];
  const topThreats = Array.isArray(dataState.topThreats)
    ? dataState.topThreats
    : [];
  const trendData = Array.isArray(dataState.caseTrend30D)
    ? dataState.caseTrend30D
    : [];
  const riskVillages = Array.isArray(dataState.riskVillages)
    ? dataState.riskVillages
    : [];
  const emergencyActions = Array.isArray(dataState.emergencyActions)
    ? dataState.emergencyActions
    : [];
  const aiRecommendations = Array.isArray(dataState.aiRecommendations)
    ? dataState.aiRecommendations
    : [];

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif] p-6">
      {/* Page Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">
          Surveillance Intelligence Command Center
        </h1>
        <p className="text-slate-500 text-xs font-semibold">
          Real-time pathogen tracking, alert coordinates, and response campaigns
          for regional agricultural blocks.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {headerStats.map((stat, idx) => {
          const Icon =
            idx === 0
              ? Users
              : idx === 1
                ? MapPin
                : idx === 2
                  ? Sprout
                  : Shield;
          return (
            <StatsCard
              key={idx}
              title={stat.label}
              value={stat.value}
              icon={<Icon className="text-emerald-700" />}
              subtext="Monitored in database"
            />
          );
        })}
      </div>

      {/* Stats Row 2: Uniform White Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
          >
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
              {kpi.label}
            </span>
            <span className="text-lg font-black text-gray-900 mt-1 block">
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main dashboard widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2 columns width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Threats Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              Top Regional Threats
            </h3>

            <div className="overflow-x-auto">
              <GenericTable
                showSearch={true}
                showSort={true}
                searchPlaceholder="Search threats..."
                data={topThreats}
                itemsPerPage={10}
                onRowClick={(row) => console.log(row)}
                columns={[
                  {
                    header: "Disease",
                    accessor: "disease",
                    cell: (value) => (
                      <div className="flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-[#31572c]" />
                        <span className="text-slate-900 font-bold">
                          {value}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: "Village",
                    accessor: "village",
                    cell: (value) => (
                      <span className="text-slate-500">{value}</span>
                    ),
                  },
                  {
                    header: "Severity",
                    accessor: "severity",
                    cell: (value) => (
                      <div className="text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            value === "Critical"
                              ? "bg-red-100 text-red-700"
                              : value === "High"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: "Farmers",
                    accessor: "farmers",
                    cell: (value) => (
                      <div className="text-center text-slate-700">{value}</div>
                    ),
                  },
                  {
                    header: "Acres",
                    accessor: "acres",
                    cell: (value) => (
                      <div className="text-center text-slate-700">
                        {value} ac
                      </div>
                    ),
                  },
                  {
                    header: "Trend",
                    accessor: "trend",
                    cell: (value) => (
                      <div className="flex justify-end">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            value === "up"
                              ? "text-red-700 bg-red-100"
                              : value === "down"
                                ? "text-emerald-700 bg-emerald-100"
                                : "text-slate-600 bg-slate-100"
                          }`}
                        >
                          {value === "up" ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {value === "up"
                            ? "Increasing"
                            : value === "down"
                              ? "Decreasing"
                              : "Stable"}
                        </span>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Trend Chart (SVG Line & Bar) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              30-Day Case Progression
            </h3>

            <div className="h-48 relative w-full pt-4">
              <svg
                className="w-full h-full"
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
              >
                {/* Horizontal grid lines */}
                <line
                  x1="40"
                  y1="20"
                  x2="480"
                  y2="20"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <line
                  x1="40"
                  y1="70"
                  x2="480"
                  y2="70"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <line
                  x1="40"
                  y1="120"
                  x2="480"
                  y2="120"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />

                {/* Bars drawing */}
                {trendData.map((d, idx) => {
                  const x = 55 + idx * 75;
                  const newH = Math.min(100, d.newCases * 3.5);
                  const resH = Math.min(100, d.resolvedCases * 3.5);
                  return (
                    <g key={idx}>
                      {/* New Cases (Red bar) */}
                      <rect
                        x={x}
                        y={120 - newH}
                        width="12"
                        height={newH}
                        fill="#ef4444"
                        opacity="0.85"
                        rx="2"
                      />
                      {/* Resolved (Green bar) */}
                      <rect
                        x={x + 16}
                        y={120 - resH}
                        width="12"
                        height={resH}
                        fill="#4f772d"
                        opacity="0.85"
                        rx="2"
                      />
                      {/* Text */}
                      <text
                        x={x}
                        y="138"
                        fill="#94a3b8"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {d.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-center gap-6 text-[10px] font-black uppercase text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-red-500" /> New Cases
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-brand-medium" /> Resolved
                Cases
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Single column width on large screens */}
        <div className="space-y-6">
          {/* Disease Distribution SVG Donut */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
              Disease Distribution
            </h3>

            <div className="flex items-center justify-around gap-4 py-2">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                  />

                  {/* Slices representation strokeDasharray/offsets based on percentages */}
                  {/* Rice Blast 34% (stroke: 85.4) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth={selectedDisease === 0 ? "14" : "11"}
                    strokeDasharray="85.4 251.2"
                    strokeDashoffset="0"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedDisease(0)}
                  />
                  {/* Yellow Rust 28% (stroke: 70.3) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth={selectedDisease === 1 ? "14" : "11"}
                    strokeDasharray="70.3 251.2"
                    strokeDashoffset="-85.4"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedDisease(1)}
                  />
                  {/* Late Blight 19% (stroke: 47.7) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth={selectedDisease === 2 ? "14" : "11"}
                    strokeDasharray="47.7 251.2"
                    strokeDashoffset="-155.7"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedDisease(2)}
                  />
                  {/* Downy Mildew 12% (stroke: 30.1) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth={selectedDisease === 3 ? "14" : "11"}
                    strokeDasharray="30.1 251.2"
                    strokeDashoffset="-203.4"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedDisease(3)}
                  />
                  {/* Other 7% (stroke: 17.6) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth={selectedDisease === 4 ? "14" : "11"}
                    strokeDasharray="17.6 251.2"
                    strokeDashoffset="-233.5"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedDisease(4)}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-sm font-black text-slate-800">
                    {selectedDisease !== null
                      ? distribution[selectedDisease].value
                      : 100}
                    %
                  </span>
                  <span className="text-[7px] text-slate-400 font-bold block uppercase">
                    {selectedDisease !== null
                      ? distribution[selectedDisease].name.split(" ")[0]
                      : "Total"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] font-bold text-slate-600">
                {distribution.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDisease(idx)}
                    className={`flex items-center gap-1.5 cursor-pointer p-1 rounded transition ${selectedDisease === idx ? "bg-slate-50" : ""}`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedDisease !== null && (
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between text-[11px] font-bold">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block">
                    Impacted Farmers
                  </span>
                  <span className="text-slate-800">
                    {distribution[selectedDisease].farmers} Growers
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-400 uppercase block">
                    Acreage Affected
                  </span>
                  <span className="text-slate-800">
                    {distribution[selectedDisease].acres} acres
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* High-Risk Villages Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
              High-Risk Villages Index
            </h3>

            <div className="space-y-3.5">
              {riskVillages.map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-slate-800">{item.name}</span>
                    <span className="text-slate-400">
                      {item.affected} Farmers affected
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${
                        item.risk >= 80
                          ? "bg-red-500"
                          : item.risk >= 60
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${item.risk}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-purple-600">{item.disease} Tag</span>
                    <span className="text-slate-400">
                      {item.risk}% Risk Score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency and AI Recommendations Section - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Action Center */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            Emergency Action Center
          </h3>
          <div className="space-y-2.5">
            {emergencyActions.map((action) => (
              <div
                key={action.id}
                className="bg-white border border-slate-100 p-3 rounded-xl space-y-2 text-xs"
              >
                <p className="text-slate-700 leading-relaxed font-semibold">
                  {action.msg}
                </p>
                <button
                  type="button"
                  className="w-full py-1.5 bg-brand-dark hover:bg-[#132a13] text-white rounded-lg font-black uppercase tracking-wider text-[9px] cursor-pointer transition-colors"
                >
                  {action.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-6 space-y-3.5">
          <h3 className="text-xs font-black text-purple-800 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Surveillance Directives
          </h3>

          <div className="space-y-3">
            {aiRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 p-3.5 rounded-xl space-y-1.5 text-xs"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-slate-800">{rec.title}</h4>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[8px] font-black uppercase">
                    AI Advisory
                  </span>
                </div>
                <p className="text-slate-500 leading-normal font-semibold text-[11px]">
                  {rec.desc}
                </p>
                <button
                  type="button"
                  className="text-[#31572c] hover:text-[#132a13] font-black text-[9px] uppercase tracking-wider block pt-1 transition-colors"
                >
                  {rec.action} ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
