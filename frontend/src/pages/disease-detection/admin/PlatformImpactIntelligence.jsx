// import React, { useState, useEffect, useRef } from "react";
// import {
//   Download,
//   Calendar,
//   Layers,
//   MapPin,
//   TrendingUp,
//   Award,
//   BookOpen,
//   ArrowRight,
//   Sprout,
//   DollarSign,
//   Heart
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   CartesianGrid,
//   ScatterChart,
//   Scatter
// } from "recharts";

// export default function PlatformImpactIntelligence() {
//   const [loading, setLoading] = useState(true);
//   const [period, setPeriod] = useState("This Year");
//   const [valueMode, setValueMode] = useState("absolute"); // absolute or growth

//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 200);
//     return () => clearTimeout(timer);
//   }, []);

//   // Map Initialization
//   useEffect(() => {
//     if (loading || !mapRef.current || !window.L) return;

//     if (mapInstance.current) {
//       mapInstance.current.remove();
//       mapInstance.current = null;
//     }

//     const map = window.L.map(mapRef.current, {
//       zoomControl: true,
//       scrollWheelZoom: false
//     }).setView([22.5937, 78.9629], 5);

//     mapInstance.current = map;

//     const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp";
//     window.L.tileLayer(
//       `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
//       {
//         attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
//         maxZoom: 18
//       }
//     ).addTo(map);

//     // Mock impact regions
//     const impactZones = [
//       { coords: [30.9, 75.8], name: "Punjab Protected Zone", type: "High Impact", color: "#132a13" },
//       { coords: [26.7, 83.3], name: "UP Covered Zone", type: "Protected Coverage", color: "#31572c" },
//       { coords: [20.0, 77.0], name: "Vidarbha Cotton Hub", type: "High Impact", color: "#132a13" }
//     ];

//     impactZones.forEach(z => {
//       const circle = window.L.circle(z.coords, {
//         color: z.color,
//         fillColor: z.color,
//         fillOpacity: 0.5,
//         radius: 85000,
//         weight: 2
//       }).addTo(map);
//       circle.bindTooltip(`<b>${z.name}</b><br/>Impact Layer: ${z.type}`);
//     });

//     const observer = new ResizeObserver(() => map.invalidateSize());
//     observer.observe(mapRef.current);

//     return () => {
//       observer.disconnect();
//       if (mapInstance.current) {
//         mapInstance.current.remove();
//         mapInstance.current = null;
//       }
//     };
//   }, [loading]);

//   const kpis = [
//     { label: "Economic Impact", val: "₹4,840 Cr", sub: "revenue protected", change: "↑24%", state: "healthy" },
//     { label: "Agricultural Impact", val: "2.1M MT", sub: "yield saved", change: "↑18%", state: "healthy" },
//     { label: "Environmental Impact", val: "840 MT", sub: "pesticide overuse avoided", change: "↑12%", state: "healthy" },
//     { label: "Food Security Impact", val: "12.4M", sub: "food supply protected", change: "↑21%", state: "healthy" }
//   ];

//   // Value Creation Trend (Stacked Area, 12 Months)
//   const valueTrendData = [
//     { month: "Jul", economic: 1200, yield: 0.5, farmers: 2.1 },
//     { month: "Sep", economic: 2100, yield: 0.9, farmers: 3.5 },
//     { month: "Dec", economic: 3400, yield: 1.4, farmers: 5.8 },
//     { month: "Mar", economic: 4200, yield: 1.8, farmers: 7.2 },
//     { month: "Jun", economic: 4840, yield: 2.1, farmers: 8.42 }
//   ];

//   // Agricultural saved by crop volume
//   const cropSavedData = [
//     { name: "Rice", val: 1.2 },
//     { name: "Wheat", val: 0.6 },
//     { name: "Cotton", val: 0.2 },
//     { name: "Maize", val: 0.1 }
//   ];

//   // Economic protected by state
//   const stateEcoData = [
//     { name: "Punjab", val: 1840 },
//     { name: "UP", val: 1240 },
//     { name: "Maharashtra", val: 860 },
//     { name: "Karnataka", val: 540 },
//     { name: "Odisha", val: 360 }
//   ];

//   // Success Stories (Horizontal Scrollable)
//   const caseStudies = [
//     { title: "Vidarbha FPO Network — Maharashtra", disease: "Cotton Leaf Curl Virus", intervention: "Early warning + field response", outcome: "84% disease reduction, ₹2.4 Cr revenue protected for 1,200 farmers" },
//     { title: "Ludhiana Growers — Punjab", disease: "Rice Blast Spores", intervention: "Precision chemical buffer advisory", outcome: "91% accuracy forecast, 18,400 MT grain saved" },
//     { title: "Cuttack Paddy Cooperatives — Odisha", disease: "Brown Plant Hopper", status: "Outbreak Contained", outcome: "₹1.8 Cr yield saved, 4,200 smallholders notified" },
//     { title: "Gorakhpur Wheat Farmers — UP", disease: "Ug99 Leaf Rust", status: "Contained", outcome: "48% pesticide usage drop, ₹3.1 Cr protected value" }
//   ];

//   // Monthly Impact Timeline
//   const monthlyTimeline = [
//     { name: "Jan", Farmers: 4.5, Outbreaks: 80, Revenue: 180 },
//     { name: "Feb", Farmers: 5.2, Outbreaks: 95, Revenue: 210 },
//     { name: "Mar", Farmers: 6.8, Outbreaks: 110, Revenue: 280 },
//     { name: "Apr", Farmers: 7.5, Outbreaks: 120, Revenue: 340 },
//     { name: "May", Farmers: 8.42, Outbreaks: 124, Revenue: 484 }
//   ];

//   // Platform Growth vs Impact correlation scatter
//   const scatterData = [
//     { customers: 120, impact: 22 },
//     { customers: 240, impact: 35 },
//     { customers: 480, impact: 58 },
//     { customers: 820, impact: 74 },
//     { customers: 1284, impact: 87 }
//   ];

//   if (loading) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div className="h-44 bg-slate-200 rounded-2xl" />
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
//           ))}
//         </div>
//         <div className="h-[400px] bg-slate-200 rounded-2xl" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fadeIn pb-12">

//       {/* Hero Impact Banner */}
//       <div className="bg-[#132a13] rounded-2xl p-8 text-white border border-[#31572c]/40 shadow-xl relative overflow-hidden flex flex-col justify-between gap-6">
//         <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

//         <div className="flex justify-between items-center z-10">
//           <div>
//             <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">Business Intelligence</span>
//             <h2 className="text-2xl font-black tracking-tight">AgroAnalytics Platform Impact</h2>
//             <p className="text-xs text-slate-300 font-bold font-mono mt-1">
//               Across 18 states, 284 districts, 12,400 villages · Date: {new Date().toLocaleDateString("en-IN")}
//             </p>
//           </div>
//           <div className="flex border border-[#31572c] rounded-xl overflow-hidden text-[9px] font-black shrink-0">
//             {["This Year", "All Time"].map(p => (
//               <button
//                 key={p}
//                 onClick={() => setPeriod(p)}
//                 className={`px-3 py-1.5 transition ${
//                   period === p ? "bg-brand-medium text-white" : "bg-[#1a3a1a] text-slate-400 hover:text-white"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 6 Large Impact Numbers in a Row */}
//         <div className="grid grid-cols-2 md:grid-cols-6 gap-6 z-10 border-t border-[#31572c]/40 pt-6 text-center">
//           <div>
//             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Protected Farmers</span>
//             <span className="text-xl font-black text-white block mt-1">8.42L</span>
//           </div>
//           <div>
//             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Area Covered</span>
//             <span className="text-xl font-black text-[#ecf39e] block mt-1">12.4M Ha</span>
//           </div>
//           <div>
//             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Yield Saved</span>
//             <span className="text-xl font-black text-[#90a955] block mt-1">2.1M MT</span>
//           </div>
//           <div>
//             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Revenue Protected</span>
//             <span className="text-xl font-black text-white block mt-1">₹4,840 Cr</span>
//           </div>
//           <div>
//             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Outbreaks Prevented</span>
//             <span className="text-xl font-black text-[#ecf39e] block mt-1">1,240</span>
//           </div>
//           <div>
//             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">AI Accuracy</span>
//             <span className="text-xl font-black text-emerald-400 block mt-1">83.4%</span>
//           </div>
//         </div>
//       </div>

//       {/* Row 1 — 4 Impact Category KPI cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {kpis.map((card, idx) => (
//           <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
//             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
//             <span className="text-2xl font-black text-slate-950 tracking-tight font-mono my-2">{card.val}</span>
//             <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
//               <span className="text-[9px] text-[#31572c] font-black uppercase">{card.sub}</span>
//               <span className="text-emerald-600 font-extrabold">{card.change}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Row 2 — 2 cols */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[460px]">
//         {/* Left: Value Creation Trend */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full">
//           <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
//             <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Value Creation Trend</h3>
//             <div className="flex border border-gray-200 rounded-lg overflow-hidden text-[8px] font-black">
//               {["absolute", "growth"].map(m => (
//                 <button
//                   key={m}
//                   onClick={() => setValueMode(m)}
//                   className={`px-2 py-1 transition ${
//                     valueMode === m ? "bg-brand-dark text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
//                   }`}
//                 >
//                   {m.toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={valueTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="month" style={{ fontSize: "9px" }} />
//                 <YAxis style={{ fontSize: "9px" }} />
//                 <Tooltip contentStyle={{ fontSize: "9px" }} />
//                 <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
//                 <Area type="monotone" dataKey="economic" stackId="1" stroke="#4f772d" fill="#4f772d" fillOpacity={0.25} name="Economic (₹Cr)" />
//                 <Area type="monotone" dataKey="farmers" stackId="2" stroke="#90a955" fill="#90a955" fillOpacity={0.2} name="Farmers Protected (L)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Right: Impact Map */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full relative">
//           <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
//             Protected Regions Impact Mapping
//           </h3>
//           <div ref={mapRef} className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-200 z-0" />
//         </div>
//       </div>

//       {/* Row 3 — Impact by Dimension (3 cards) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Agricultural Impact breakdown */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
//           <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
//             <Sprout className="text-[#31572c]" size={16} />
//             <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Agricultural Impact</h4>
//           </div>
//           <div className="h-32">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={cropSavedData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
//                 <XAxis dataKey="name" style={{ fontSize: "8px", fontWeight: "bold" }} />
//                 <YAxis style={{ fontSize: "8px" }} />
//                 <Tooltip contentStyle={{ fontSize: "9px" }} />
//                 <Bar dataKey="val" fill="#4f772d" name="Yield Saved (M MT)" radius={[2, 2, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="flex justify-between text-[10px] text-gray-500 font-bold border-t border-gray-50 pt-2">
//             <span>Kharif Saved: 1.4M MT</span>
//             <span>Rabi Saved: 0.7M MT</span>
//           </div>
//         </div>

//         {/* Economic Impact breakdown */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
//           <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
//             <DollarSign className="text-[#31572c]" size={16} />
//             <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Economic Impact</h4>
//           </div>
//           <div className="h-32">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={stateEcoData} layout="vertical" margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
//                 <XAxis type="number" style={{ fontSize: "8px" }} />
//                 <YAxis dataKey="name" type="category" style={{ fontSize: "8px", fontWeight: "bold" }} width={45} />
//                 <Tooltip contentStyle={{ fontSize: "9px" }} />
//                 <Bar dataKey="val" fill="#90a955" name="Revenue Protected (₹Cr)" radius={[0, 2, 2, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="flex justify-between text-[10px] text-gray-500 font-bold border-t border-gray-50 pt-2">
//             <span>Avg Protected per farmer: ₹57,000</span>
//             <span>ROI ratio: 1:12.4 value</span>
//           </div>
//         </div>

//         {/* Social & Food Security Impact */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
//           <div>
//             <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 mb-3">
//               <Heart className="text-[#31572c]" size={16} />
//               <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Social & Food Security</h4>
//             </div>
//             <div className="space-y-3.5 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-gray-400 font-bold">Smallholder Farmer %:</span>
//                 <span className="font-black text-[#31572c]">68.4% beneficiary</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400 font-bold">Women Smallholders:</span>
//                 <span className="font-black text-slate-800">1.82 Lakh protected</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400 font-bold">Farmer Income Improvement:</span>
//                 <span className="font-black text-emerald-600">+12% estimated</span>
//               </div>
//             </div>
//           </div>
//           <div className="bg-emerald-50 text-emerald-800 text-[10px] p-2.5 rounded-xl border border-emerald-100 font-bold">
//             Caloric grain supplies secured for 12.4M people annually.
//           </div>
//         </div>
//       </div>

//       {/* Row 4 — Success Stories (full width carousel) */}
//       <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
//         <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
//           Client Case Study ledger
//         </h3>
//         <div className="flex space-x-4 overflow-x-auto scrollbar-thin pb-2">
//           {caseStudies.map((study, idx) => (
//             <div key={idx} className="bg-slate-50 border border-gray-200/60 p-4 rounded-xl min-w-[280px] max-w-[320px] flex flex-col justify-between shrink-0 text-xs">
//               <div>
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">FPO Network</span>
//                 <h4 className="font-bold text-gray-900 leading-snug">{study.title}</h4>
//                 <p className="text-[#31572c] font-black mt-2 font-mono text-[10px]">{study.disease}</p>
//                 <p className="text-slate-500 font-semibold mt-1.5 leading-relaxed">{study.outcome}</p>
//               </div>
//               <button className="text-[9px] font-black text-[#31572c] uppercase hover:underline flex items-center gap-0.5 mt-4">
//                 Read Full Case Study <ArrowRight size={10} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Row 5 — 2 cols */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left: Monthly Impact Trend */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
//           <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
//             Platform Monthly Growth Metrics
//           </h4>
//           <div className="h-56">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={monthlyTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="name" style={{ fontSize: "9px" }} />
//                 <YAxis style={{ fontSize: "9px" }} />
//                 <Tooltip contentStyle={{ fontSize: "9px" }} />
//                 <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
//                 <Line type="monotone" dataKey="Farmers" stroke="#4f772d" strokeWidth={2} name="Farmers Protected (L)" />
//                 <Line type="monotone" dataKey="Outbreaks" stroke="#ecf39e" strokeWidth={2} name="Outbreaks Prevented" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Right: Growth vs Impact ScatterChart */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
//           <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
//             Platform Scaling vs Cumulative Impact Index
//           </h4>
//           <div className="h-56">
//             <ResponsiveContainer width="100%" height="100%">
//               <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis type="number" dataKey="customers" name="Customers Connected" style={{ fontSize: "9px" }} />
//                 <YAxis type="number" dataKey="impact" name="Impact Index Score" style={{ fontSize: "9px" }} />
//                 <Tooltip contentStyle={{ fontSize: "9px" }} />
//                 <Scatter name="Network Effect" data={scatterData} fill="#31572c" line={{ stroke: '#90a955', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
//               </ScatterChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sprout,
  Heart,
  IndianRupee,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ScatterChart,
  Scatter,
} from "recharts";

// ─── All Data by Period & Mode ───────────────────────────────────────────────

const DATA = {
  "This Year": {
    kpis: [
      {
        label: "Economic Impact",
        val: "₹4,840 Cr",
        sub: "revenue protected",
        change: "↑24%",
        state: "healthy",
      },
      {
        label: "Agricultural Impact",
        val: "2.1M MT",
        sub: "yield saved",
        change: "↑18%",
        state: "healthy",
      },
      {
        label: "Environmental Impact",
        val: "840 MT",
        sub: "pesticide overuse avoided",
        change: "↑12%",
        state: "healthy",
      },
      {
        label: "Food Security Impact",
        val: "12.4M",
        sub: "food supply protected",
        change: "↑21%",
        state: "healthy",
      },
    ],
    hero: {
      farmers: "8.42L",
      area: "12.4M Ha",
      yield: "2.1M MT",
      revenue: "₹4,840 Cr",
      outbreaks: "1,240",
      accuracy: "83.4%",
    },
    cropSavedData: [
      { name: "Rice", val: 1.2 },
      { name: "Wheat", val: 0.6 },
      { name: "Cotton", val: 0.2 },
      { name: "Maize", val: 0.1 },
    ],
    stateEcoData: [
      { name: "Punjab", val: 1840 },
      { name: "UP", val: 1240 },
      { name: "Maharashtra", val: 860 },
      { name: "Karnataka", val: 540 },
      { name: "Odisha", val: 360 },
    ],
    social: {
      smallholder: "68.4% beneficiary",
      women: "1.82 Lakh protected",
      income: "+12% estimated",
      caloric: "12.4M",
    },
    monthlyTimeline: [
      { name: "Jan", Farmers: 4.5, Outbreaks: 80, Revenue: 180 },
      { name: "Feb", Farmers: 5.2, Outbreaks: 95, Revenue: 210 },
      { name: "Mar", Farmers: 6.8, Outbreaks: 110, Revenue: 280 },
      { name: "Apr", Farmers: 7.5, Outbreaks: 120, Revenue: 340 },
      { name: "May", Farmers: 8.42, Outbreaks: 124, Revenue: 484 },
    ],
    scatterData: [
      { customers: 120, impact: 22 },
      { customers: 240, impact: 35 },
      { customers: 480, impact: 58 },
      { customers: 820, impact: 74 },
      { customers: 1284, impact: 87 },
    ],
  },
  "All Time": {
    kpis: [
      {
        label: "Economic Impact",
        val: "₹14,200 Cr",
        sub: "revenue protected",
        change: "↑68%",
        state: "healthy",
      },
      {
        label: "Agricultural Impact",
        val: "6.8M MT",
        sub: "yield saved",
        change: "↑54%",
        state: "healthy",
      },
      {
        label: "Environmental Impact",
        val: "2,400 MT",
        sub: "pesticide overuse avoided",
        change: "↑38%",
        state: "healthy",
      },
      {
        label: "Food Security Impact",
        val: "38.6M",
        sub: "food supply protected",
        change: "↑72%",
        state: "healthy",
      },
    ],
    hero: {
      farmers: "24.6L",
      area: "38.4M Ha",
      yield: "6.8M MT",
      revenue: "₹14,200 Cr",
      outbreaks: "3,890",
      accuracy: "85.1%",
    },
    cropSavedData: [
      { name: "Rice", val: 3.8 },
      { name: "Wheat", val: 1.9 },
      { name: "Cotton", val: 0.7 },
      { name: "Maize", val: 0.4 },
    ],
    stateEcoData: [
      { name: "Punjab", val: 5200 },
      { name: "UP", val: 3800 },
      { name: "Maharashtra", val: 2600 },
      { name: "Karnataka", val: 1600 },
      { name: "Odisha", val: 1000 },
    ],
    social: {
      smallholder: "71.2% beneficiary",
      women: "5.4 Lakh protected",
      income: "+18% estimated",
      caloric: "38.6M",
    },
    monthlyTimeline: [
      { name: "2021", Farmers: 5.2, Outbreaks: 210, Revenue: 320 },
      { name: "2022", Farmers: 9.8, Outbreaks: 480, Revenue: 680 },
      { name: "2023", Farmers: 15.4, Outbreaks: 890, Revenue: 1240 },
      { name: "2024", Farmers: 20.1, Outbreaks: 1240, Revenue: 2100 },
      { name: "2025", Farmers: 24.6, Outbreaks: 3890, Revenue: 3480 },
    ],
    scatterData: [
      { customers: 380, impact: 28 },
      { customers: 720, impact: 44 },
      { customers: 1200, impact: 63 },
      { customers: 2400, impact: 78 },
      { customers: 3860, impact: 92 },
    ],
  },
};

// Growth-mode transforms absolute data → YoY % growth
function toGrowthTrend(data) {
  return data.map((d, i) => {
    if (i === 0) return { ...d, economic: 0, farmers: 0 };
    const prev = data[i - 1];
    return {
      ...d,
      economic: prev.economic
        ? +(
            (((d.Revenue || d.economic) - (prev.Revenue || prev.economic)) /
              (prev.Revenue || prev.economic)) *
            100
          ).toFixed(1)
        : 0,
      farmers: prev.Farmers
        ? +(
            (((d.Farmers || d.farmers) - (prev.Farmers || prev.farmers)) /
              (prev.Farmers || prev.farmers)) *
            100
          ).toFixed(1)
        : 0,
    };
  });
}

function buildValueTrend(period, mode) {
  const raw = DATA[period].monthlyTimeline;
  if (mode === "absolute") {
    return raw.map((d) => ({
      month: d.name,
      economic: d.Revenue,
      farmers: d.Farmers,
    }));
  }
  // growth mode
  return raw.map((d, i) => {
    if (i === 0) return { month: d.name, economic: 0, farmers: 0 };
    const prev = raw[i - 1];
    return {
      month: d.name,
      economic: prev.Revenue
        ? +(((d.Revenue - prev.Revenue) / prev.Revenue) * 100).toFixed(1)
        : 0,
      farmers: prev.Farmers
        ? +(((d.Farmers - prev.Farmers) / prev.Farmers) * 100).toFixed(1)
        : 0,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlatformImpactIntelligence() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("This Year");
  const [valueMode, setValueMode] = useState("absolute");

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current || !window.L) return;
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([22.5937, 78.9629], 5);
    mapInstance.current = map;

    const mapTilerKey =
      import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp";
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
      {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>',
        maxZoom: 18,
      },
    ).addTo(map);

    const impactZones = [
      {
        coords: [30.9, 75.8],
        name: "Punjab Protected Zone",
        type: "High Impact",
        color: "#132a13",
      },
      {
        coords: [26.7, 83.3],
        name: "UP Covered Zone",
        type: "Protected Coverage",
        color: "#31572c",
      },
      {
        coords: [20.0, 77.0],
        name: "Vidarbha Cotton Hub",
        type: "High Impact",
        color: "#132a13",
      },
    ];

    impactZones.forEach((z) => {
      const circle = window.L.circle(z.coords, {
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.5,
        radius: 85000,
        weight: 2,
      }).addTo(map);
      circle.bindTooltip(`<b>${z.name}</b><br/>Impact Layer: ${z.type}`);
    });

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-[400px] bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const d = DATA[period];
  const valueTrendData = buildValueTrend(period, valueMode);
  const yLabel =
    valueMode === "absolute"
      ? { economic: "Revenue (₹Cr)", farmers: "Farmers Protected (L)" }
      : { economic: "Revenue Growth (%)", farmers: "Farmer Growth (%)" };

  const caseStudies = [
    {
      title: "Vidarbha FPO Network — Maharashtra",
      disease: "Cotton Leaf Curl Virus",
      outcome:
        "84% disease reduction, ₹2.4 Cr revenue protected for 1,200 farmers",
    },
    {
      title: "Ludhiana Growers — Punjab",
      disease: "Rice Blast Spores",
      outcome: "91% accuracy forecast, 18,400 MT grain saved",
    },
    {
      title: "Cuttack Paddy Cooperatives — Odisha",
      disease: "Brown Plant Hopper",
      outcome: "₹1.8 Cr yield saved, 4,200 smallholders notified",
    },
    {
      title: "Gorakhpur Wheat Farmers — UP",
      disease: "Ug99 Leaf Rust",
      outcome: "48% pesticide usage drop, ₹3.1 Cr protected value",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Impact Banner */}
      <div className="bg-[#132a13] rounded-2xl p-8 text-white border border-[#31572c]/40 shadow-xl relative overflow-hidden flex flex-col justify-between gap-6">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="flex justify-between items-center z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
              Business Intelligence
            </span>
            <h2 className="text-2xl font-black tracking-tight">
              AgroAnalytics Platform Impact
            </h2>
            <p className="text-xs text-slate-300 font-bold font-mono mt-1">
              Across 18 states, 284 districts, 12,400 villages ·{" "}
              {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="flex border border-[#31572c] rounded-xl overflow-hidden text-[9px] font-black shrink-0">
            {["This Year", "All Time"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 transition ${period === p ? "bg-brand-medium text-white" : "bg-[#1a3a1a] text-slate-400 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 z-10 border-t border-[#31572c]/40 pt-6 text-center">
          {[
            {
              label: "Protected Farmers",
              val: d.hero.farmers,
              color: "text-white",
            },
            {
              label: "Area Covered",
              val: d.hero.area,
              color: "text-[#ecf39e]",
            },
            {
              label: "Yield Saved",
              val: d.hero.yield,
              color: "text-[#90a955]",
            },
            {
              label: "Revenue Protected",
              val: d.hero.revenue,
              color: "text-white",
            },
            {
              label: "Outbreaks Prevented",
              val: d.hero.outbreaks,
              color: "text-[#ecf39e]",
            },
            {
              label: "AI Accuracy",
              val: d.hero.accuracy,
              color: "text-emerald-400",
            },
          ].map((item, i) => (
            <div key={i}>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <span className={`text-xl font-black block mt-1 ${item.color}`}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {d.kpis.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {card.label}
            </span>
            <span className="text-2xl font-black text-slate-950 tracking-tight font-mono my-2">
              {card.val}
            </span>
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
              <span className="text-[9px] text-[#31572c] font-black uppercase">
                {card.sub}
              </span>
              <span className="text-emerald-600 font-extrabold">
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 — Trend + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[460px]">
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">
              Value Creation Trend
            </h3>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden text-[8px] font-black">
              {["absolute", "growth"].map((m) => (
                <button
                  key={m}
                  onClick={() => setValueMode(m)}
                  className={`px-2 py-1 transition ${valueMode === m ? "bg-brand-dark text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={valueTrendData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} />
                <Tooltip
                  contentStyle={{ fontSize: "9px" }}
                  formatter={(val, name) => [
                    val,
                    name === "economic" ? yLabel.economic : yLabel.farmers,
                  ]}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Area
                  type="monotone"
                  dataKey="economic"
                  stackId="1"
                  stroke="#4f772d"
                  fill="#4f772d"
                  fillOpacity={0.25}
                  name={yLabel.economic}
                />
                <Area
                  type="monotone"
                  dataKey="farmers"
                  stackId="2"
                  stroke="#90a955"
                  fill="#90a955"
                  fillOpacity={0.2}
                  name={yLabel.farmers}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full relative">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
            Protected Regions Impact Mapping
          </h3>
          <div
            ref={mapRef}
            className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-200 z-0"
          />
        </div>
      </div>

      {/* Row 3 — Impact Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agricultural */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Sprout className="text-[#31572c]" size={16} />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
              Agricultural Impact
            </h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={d.cropSavedData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  style={{ fontSize: "8px", fontWeight: "bold" }}
                />
                <YAxis style={{ fontSize: "8px" }} />
                <Tooltip contentStyle={{ fontSize: "9px" }} />
                <Bar
                  dataKey="val"
                  fill="#4f772d"
                  name="Yield Saved (M MT)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 font-bold border-t border-gray-50 pt-2">
            <span>
              Kharif Saved: {period === "This Year" ? "1.4M MT" : "4.2M MT"}
            </span>
            <span>
              Rabi Saved: {period === "This Year" ? "0.7M MT" : "2.6M MT"}
            </span>
          </div>
        </div>

        {/* Economic — IndianRupee icon replaces DollarSign */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <IndianRupee className="text-[#31572c]" size={16} />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
              Economic Impact
            </h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={d.stateEcoData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: -15, bottom: 0 }}
              >
                <XAxis type="number" style={{ fontSize: "8px" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  style={{ fontSize: "8px", fontWeight: "bold" }}
                  width={45}
                />
                <Tooltip contentStyle={{ fontSize: "9px" }} />
                <Bar
                  dataKey="val"
                  fill="#90a955"
                  name="Revenue Protected (₹Cr)"
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 font-bold border-t border-gray-50 pt-2">
            <span>
              Avg per farmer: {period === "This Year" ? "₹57,000" : "₹57,700"}
            </span>
            <span>
              ROI ratio: {period === "This Year" ? "1:12.4" : "1:14.1"}
            </span>
          </div>
        </div>

        {/* Social & Food Security */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 mb-3">
              <Heart className="text-[#31572c]" size={16} />
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
                Social & Food Security
              </h4>
            </div>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">
                  Smallholder Farmer %:
                </span>
                <span className="font-black text-[#31572c]">
                  {d.social.smallholder}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">
                  Women Smallholders:
                </span>
                <span className="font-black text-slate-800">
                  {d.social.women}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">
                  Farmer Income Improvement:
                </span>
                <span className="font-black text-emerald-600">
                  {d.social.income}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-800 text-[10px] p-2.5 rounded-xl border border-emerald-100 font-bold">
            Caloric grain supplies secured for {d.social.caloric} people
            annually.
          </div>
        </div>
      </div>

      {/* Row 4 — Case Studies */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
          Client Case Study Ledger
        </h3>
        <div className="flex space-x-4 overflow-x-auto scrollbar-thin pb-2">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-gray-200/60 p-4 rounded-xl min-w-[280px] max-w-[320px] flex flex-col justify-between shrink-0 text-xs"
            >
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                  FPO Network
                </span>
                <h4 className="font-bold text-gray-900 leading-snug">
                  {study.title}
                </h4>
                <p className="text-[#31572c] font-black mt-2 font-mono text-[10px]">
                  {study.disease}
                </p>
                <p className="text-slate-500 font-semibold mt-1.5 leading-relaxed">
                  {study.outcome}
                </p>
              </div>
              <button className="text-[9px] font-black text-[#31572c] uppercase hover:underline flex items-center gap-0.5 mt-4">
                Read Full Case Study <ArrowRight size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Row 5 — Monthly Growth + Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
            Platform {period === "This Year" ? "Monthly" : "Yearly"} Growth
            Metrics
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={d.monthlyTimeline}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Line
                  type="monotone"
                  dataKey="Farmers"
                  stroke="#4f772d"
                  strokeWidth={2}
                  name="Farmers Protected (L)"
                />
                <Line
                  type="monotone"
                  dataKey="Outbreaks"
                  stroke="#ecf39e"
                  strokeWidth={2}
                  name="Outbreaks Prevented"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
            Platform Scaling vs Cumulative Impact Index
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 10, right: 10, bottom: 0, left: -25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="customers"
                  name="Customers Connected"
                  style={{ fontSize: "9px" }}
                />
                <YAxis
                  type="number"
                  dataKey="impact"
                  name="Impact Index Score"
                  style={{ fontSize: "9px" }}
                />
                <Tooltip contentStyle={{ fontSize: "9px" }} />
                <Scatter
                  name="Network Effect"
                  data={d.scatterData}
                  fill="#31572c"
                  line={{
                    stroke: "#90a955",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 4",
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
