// import React, { useState, useEffect } from "react";
// import {
//   CircleDollarSign,
//   Coins,
//   TrendingUp,
//   Sparkles,
//   Sprout,
//   Wheat,
//   BarChart3,
//   HelpCircle,
//   AlertCircle,
//   FileText,
//   Landmark,
// } from "lucide-react";
// import { getYieldRoiPrediction } from "../../../services/geminiService";

// const CROP_PROFILES = [
//   {
//     id: "rice",
//     name: "Rice (Paddy)",
//     hindi: "धान",
//     baseYield: 22,
//     pricePerQtl: 2200,
//     icon: "Wheat",
//   },
//   {
//     id: "wheat",
//     name: "Wheat",
//     hindi: "गेहूं",
//     baseYield: 19,
//     pricePerQtl: 2275,
//     icon: "Wheat",
//   },
//   {
//     id: "cotton",
//     name: "Cotton",
//     hindi: "कपास",
//     baseYield: 8.5,
//     pricePerQtl: 7000,
//     icon: "Sprout",
//   },
//   {
//     id: "maize",
//     name: "Maize (Corn)",
//     hindi: "मक्का",
//     baseYield: 21,
//     pricePerQtl: 2090,
//     icon: "Wheat",
//   },
// ];

// const SEED_GRADES = [
//   { label: "Basic", costPerAcre: 800, desc: "Local standard seeds" },
//   { label: "Standard", costPerAcre: 1500, desc: "Certified high germination" },
//   {
//     label: "Premium",
//     costPerAcre: 2400,
//     desc: "Hybrids with disease protection",
//   },
// ];

// export default function YieldRoiPredictor() {
//   const [selectedCrop, setSelectedCrop] = useState(CROP_PROFILES[0]);
//   const [acreage, setAcreage] = useState(5);
//   const [seedGrade, setSeedGrade] = useState(SEED_GRADES[1]); // Standard
//   const [fertilizerBudget, setFertilizerBudget] = useState(3500); // ₹ per acre
//   const [isFetching, setIsFetching] = useState(false);

//   // Simulation outputs synced dynamically with Gemini API/fallbacks
//   const [outputs, setOutputs] = useState({
//     totalYield: 0,
//     totalCost: 0,
//     grossRevenue: 0,
//     netProfit: 0,
//     roiPercent: 0,
//     breakEvenYield: 0,
//     downsideProfit: 0,
//     kccLoanEstimate: 0,
//     costBreakdown: {
//       seedCost: 0,
//       fertilizerCost: 0,
//       operationsCost: 0,
//     },
//     subsidy: {
//       schemeName: "Pradhan Mantri Fasal Bima Yojana",
//       amount: "₹2,500/acre premium subsidy",
//       deadline: "31st July 2026",
//     },
//   });

//   const handleApplySimulation = async () => {
//     setIsFetching(true);
//     try {
//       const data = await getYieldRoiPrediction(
//         selectedCrop.name,
//         acreage,
//         seedGrade.label,
//         fertilizerBudget,
//         "Faridabad", // Default target district
//       );
//       setOutputs(data);
//     } catch (err) {
//       console.error("Failed to fetch ROI predictions:", err);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   // Initialize prediction metrics on component mount
//   useEffect(() => {
//     handleApplySimulation();
//   }, []);

//   const formatCurrency = (val) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(val);
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
//           <CircleDollarSign className="h-6.5 w-6.5 text-[#31572c]" />
//           <span>Yield & ROI Predictor</span>
//         </h1>
//         <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1">
//           Simulate crops, acreage, and agronomic seed grades to forecast
//           expected yields and financial ROI.
//         </p>
//       </div>

//       {/* 2-Column Responsive Split */}
//       <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
//         {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
//         {/* LEFT COLUMN: Input Matrix Form            */}
//         {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
//         <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-5">
//           <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-2.5 border-b border-gray-100">
//             <Coins className="h-4 w-4 text-[#4f772d]" />
//             <span>Simulation Parameters</span>
//           </h2>

//           <div className="space-y-4">
//             {/* Crop Profile Selection Cards */}
//             <div>
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
//                 Select Crop Profile
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {CROP_PROFILES.map((crop) => (
//                   <button
//                     key={crop.id}
//                     type="button"
//                     onClick={() => setSelectedCrop(crop)}
//                     className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
//                       selectedCrop.id === crop.id
//                         ? "bg-[#31572c]/10 border-[#31572c] text-[#132a13] font-bold shadow-sm"
//                         : "bg-white border-gray-200 text-gray-600 hover:border-[#90a955] hover:text-[#31572c]"
//                     }`}
//                   >
//                     <span className="text-xs block leading-tight font-extrabold">
//                       {crop.name}
//                     </span>
//                     <span className="text-[9px] text-gray-400 font-bold tracking-wide mt-0.5 block">
//                       {crop.hindi}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Land Area Slider */}
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
//                   Cultivation Land Size
//                 </label>
//                 <span className="text-[#31572c] font-bold text-xs">
//                   {acreage} ACRES
//                 </span>
//               </div>
//               <input
//                 type="range"
//                 min="0.5"
//                 max="50"
//                 step="0.5"
//                 value={acreage}
//                 onChange={(e) => setAcreage(Number(e.target.value))}
//                 className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
//                 style={{
//                   background: `linear-gradient(to right, #31572c ${((acreage - 0.5) / 49.5) * 100}%, #f3f4f6 ${((acreage - 0.5) / 49.5) * 100}%)`,
//                 }}
//               />
//               <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
//                 <span>0.5 ac</span>
//                 <span>50 ac</span>
//               </div>
//             </div>

//             {/* Seed Quality Grade Selector */}
//             <div>
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
//                 Seed Quality Standard
//               </label>
//               <div className="space-y-2">
//                 {SEED_GRADES.map((grade) => (
//                   <button
//                     key={grade.label}
//                     type="button"
//                     onClick={() => setSeedGrade(grade)}
//                     className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all duration-200 cursor-pointer ${
//                       seedGrade.label === grade.label
//                         ? "bg-[#31572c] border-[#31572c] text-white shadow-sm font-bold"
//                         : "bg-white border-gray-200 text-gray-600 hover:border-[#90a955] hover:text-[#31572c]"
//                     }`}
//                   >
//                     <div>
//                       <span className="text-xs block leading-tight font-extrabold">
//                         {grade.label}
//                       </span>
//                       <span
//                         className={`text-[9px] mt-0.5 block ${seedGrade.label === grade.label ? "text-gray-100" : "text-gray-400"}`}
//                       >
//                         {grade.desc}
//                       </span>
//                     </div>
//                     <span className="text-xs font-black shrink-0">
//                       ₹{grade.costPerAcre}/ac
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Fertilizer Budget Slider */}
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
//                   Fertilizer & NPK Budget
//                 </label>
//                 <span className="text-[#31572c] font-bold text-xs">
//                   {formatCurrency(fertilizerBudget)}/acre
//                 </span>
//               </div>
//               <input
//                 type="range"
//                 min="1000"
//                 max="8000"
//                 step="250"
//                 value={fertilizerBudget}
//                 onChange={(e) => setFertilizerBudget(Number(e.target.value))}
//                 className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
//                 style={{
//                   background: `linear-gradient(to right, #4f772d ${((fertilizerBudget - 1000) / 7000) * 100}%, #f3f4f6 ${((fertilizerBudget - 1000) / 7000) * 100}%)`,
//                 }}
//               />
//               <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
//                 <span>₹1,000/ac</span>
//                 <span>₹8,000/ac</span>
//               </div>
//             </div>

//             {/* --- Explicit Apply Button --- */}
//             <button
//               type="button"
//               onClick={handleApplySimulation}
//               disabled={isFetching}
//               className="w-full bg-[#31572c] text-white hover:bg-[#132a13] font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-4"
//             >
//               <TrendingUp
//                 className={`h-3.5 w-3.5 ${isFetching ? "animate-pulse" : ""}`}
//               />
//               {isFetching ? "Applying Inferences..." : "Apply Simulation"}
//             </button>
//           </div>
//         </div>

//         {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
//         {/* RIGHT COLUMN: Output Dashboard Matrix       */}
//         {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
//         <div
//           className={`space-y-6 ${isFetching ? "opacity-50 pointer-events-none" : ""} transition-opacity duration-200`}
//         >
//           {/* Top Row: Profitability Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* Projected Net Profit Card */}
//             <div className="bg-[#4f772d]/[0.08] border border-[#4f772d]/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
//                     Projected Net Profit
//                   </span>
//                   <h3 className="text-2xl font-black text-emerald-700 leading-tight">
//                     {formatCurrency(outputs.netProfit)}
//                   </h3>
//                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
//                     Estimated after all operations
//                   </p>
//                 </div>
//                 <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
//                   <TrendingUp className="h-5 w-5 animate-pulse" />
//                 </div>
//               </div>
//             </div>

//             {/* Total Yield Forecast */}
//             <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
//               <div className="flex items-start justify-between">
//                 <div className="space-y-1">
//                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
//                     Yield Estimation
//                   </span>
//                   <h3 className="text-2xl font-black text-gray-900 leading-tight">
//                     {outputs.totalYield}{" "}
//                     <span className="text-xs font-semibold text-gray-400">
//                       Quintals
//                     </span>
//                   </h3>
//                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
//                     Base yield: {selectedCrop.baseYield} qtl/acre
//                   </p>
//                 </div>
//                 <div className="p-2.5 bg-[#4f772d]/10 text-[#31572c] rounded-xl">
//                   <Wheat className="h-5 w-5" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* New Display widget A: Break-even quintal target Card */}
//           <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4.5 flex items-center space-x-3.5 shadow-sm">
//             <div className="p-2 bg-amber-500/15 text-amber-700 rounded-xl">
//               <AlertCircle className="h-5 w-5" />
//             </div>
//             <div>
//               <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">
//                 Production Break-Even Metric
//               </span>
//               <p className="text-xs font-bold text-gray-800 mt-0.5">
//                 You need exactly{" "}
//                 <span className="text-amber-700 font-black text-sm px-0.5">
//                   {outputs.breakEvenYield}
//                 </span>{" "}
//                 quintals of yield to fully recover your base investments.
//               </p>
//             </div>
//           </div>

//           {/* Middle Row: Live Cost & Revenue Breakdown */}
//           <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
//             <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
//               <BarChart3 className="h-4 w-4 text-[#4f772d]" />
//               <span>Rotational ROI Ledger Summary</span>
//             </h3>

//             <div className="space-y-3.5 pt-2">
//               {/* Gross Revenues row */}
//               <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
//                 <span className="text-gray-500 font-semibold flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-[#90a955]" />
//                   Projected Gross Revenues
//                 </span>
//                 <span className="text-gray-800 font-extrabold text-sm">
//                   {formatCurrency(outputs.grossRevenue)}
//                 </span>
//               </div>

//               {/* Total Input Costs row */}
//               <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
//                 <span className="text-gray-500 font-semibold flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-red-400" />
//                   Total Input Costs (Seed + NPK + Operations)
//                 </span>
//                 <span className="text-gray-800 font-extrabold text-sm text-red-600">
//                   {formatCurrency(outputs.totalCost)}
//                 </span>
//               </div>

//               {/* New Display widget B: Downside Risk Yield projection row */}
//               <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
//                 <span className="text-gray-500 font-semibold flex items-center gap-2">
//                   <span className="h-2 w-2 rounded-full bg-red-500" />
//                   Downside Scenario (20% below yield)
//                 </span>
//                 <span
//                   className={`font-extrabold text-xs ${outputs.downsideProfit >= 0 ? "text-emerald-600" : "text-red-655"}`}
//                 >
//                   Net: {outputs.downsideProfit >= 0 ? "+" : ""}
//                   {formatCurrency(outputs.downsideProfit)}
//                 </span>
//               </div>

//               {/* Detail list itemizing costs */}
//               <div className="bg-[#f4f7f4]/40 rounded-xl p-3 grid grid-cols-3 gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">
//                 <div>
//                   <p className="text-gray-400">Seed Costs</p>
//                   <p className="text-gray-800 mt-0.5">
//                     {formatCurrency(outputs.costBreakdown.seedCost)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400">Fertilizers</p>
//                   <p className="text-gray-800 mt-0.5">
//                     {formatCurrency(outputs.costBreakdown.fertilizerCost)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400">Operations</p>
//                   <p className="text-gray-800 mt-0.5">
//                     {formatCurrency(outputs.costBreakdown.operationsCost)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Row: ROI Efficiency Ring & KCC Loan Calculator */}
//           <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center gap-5 justify-between">
//             <div className="space-y-1">
//               <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
//                 <Sparkles className="h-4 w-4 text-[#90a955]" />
//                 <span>ROI Efficiency Index</span>
//               </h4>
//               <p className="text-gray-500 text-[11px] font-medium leading-relaxed max-w-sm">
//                 Shows the returns yielded for every rupee invested. An index
//                 above 100% signifies doubling seed investment value.
//               </p>

//               {/* New Display widget C: Recommended KCC Credit Loan Advisor */}
//               <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
//                 <Landmark className="h-4 w-4 text-[#31572c]" />
//                 <span>
//                   KCC Credit Limit Recommendation:{" "}
//                   <span className="text-emerald-700 font-black">
//                     {formatCurrency(outputs.kccLoanEstimate)}
//                   </span>
//                 </span>
//               </div>
//             </div>

//             {/* Visual Indicator Progress Badge */}
//             <div className="flex items-center space-x-3 shrink-0">
//               <div className="text-right">
//                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
//                   Efficiency Ratio
//                 </p>
//                 <p className="text-lg font-black text-[#132a13] leading-none mt-0.5">
//                   {outputs.roiPercent}%
//                 </p>
//               </div>
//               <div
//                 className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 flex items-center justify-center font-bold text-[10px] text-emerald-700 animate-spin-slow shrink-0"
//                 style={{ animationDuration: "6s" }}
//               >
//                 ROI
//               </div>
//             </div>
//           </div>

//           {/* New Display widget D: Rotational Subsidy Scheme Card */}
//           {outputs.subsidy && (
//             <div className="bg-white border border-[#4f772d]/20 rounded-2xl p-5 shadow-sm space-y-3">
//               <h4 className="text-xs font-bold text-[#132a13] uppercase tracking-wider flex items-center gap-2">
//                 <FileText className="h-4 w-4 text-[#31572c]" />
//                 <span>Applicable Governmental Subsidy Scheme</span>
//               </h4>
//               <div className="bg-[#4f772d]/[0.03] border border-[#4f772d]/10 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
//                 <div>
//                   <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
//                     Scheme
//                   </span>
//                   <span className="font-extrabold text-gray-800 leading-tight block mt-0.5">
//                     {outputs.subsidy.schemeName}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
//                     Value
//                   </span>
//                   <span className="font-black text-emerald-700 block mt-0.5">
//                     {outputs.subsidy.amount}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
//                     Deadline
//                   </span>
//                   <span className="font-extrabold text-amber-700 block mt-0.5">
//                     {outputs.subsidy.deadline}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  CircleDollarSign,
  Coins,
  TrendingUp,
  Sparkles,
  Sprout,
  Wheat,
  BarChart3,
  AlertCircle,
  FileText,
  Landmark,
  Loader2,
} from "lucide-react";
import { profileApi } from "../../../services/apiService";
import { getYieldRoiPrediction } from "../../../services/geminiService";
import seededData from "../../../seed-json/seededData.json";

// Expanded crop matrix to handle any profile configurations cleanly
const CROP_PROFILES = seededData.cropRecommendation.cropProfiles;

const SEED_GRADES = seededData.cropRecommendation.seedGrades;

export default function YieldRoiPredictor() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(CROP_PROFILES[0]);
  const [acreage, setAcreage] = useState(5);
  const [seedGrade, setSeedGrade] = useState(SEED_GRADES[1]);
  const [fertilizerBudget, setFertilizerBudget] = useState(3500);
  const [isFetching, setIsFetching] = useState(false);
  const [dataSource, setDataSource] = useState("Seeded Engine");

  const [outputs, setOutputs] = useState({
    totalYield: 0,
    totalCost: 0,
    grossRevenue: 0,
    netProfit: 0,
    roiPercent: 0,
    breakEvenYield: 0,
    downsideProfit: 0,
    kccLoanEstimate: 0,
    costBreakdown: { seedCost: 0, fertilizerCost: 0, operationsCost: 0 },
    subsidy: {
      schemeName: "Pradhan Mantri Fasal Bima Yojana",
      amount: "₹2,500/acre premium subsidy",
      deadline: "31st July 2026",
    },
  });

  // Pull dynamic profile values on component mount and compute initial simulation instantly
  useEffect(() => {
    const loadProfileAndInitialize = async () => {
      try {
        setIsFetching(true);
        const res = await profileApi.getProfile();
        if (res?.success && res?.data?.farms && res.data.farms.length > 0) {
          const firstFarm = res.data.farms[0];
          setFarms(res.data.farms);
          setSelectedFarmId(firstFarm._id);

          // âœ¨ FIX 1: Automatically set initial land size from active backend data
          const initialLand = firstFarm.totalLand || 5;
          setAcreage(initialLand);

          // âœ¨ FIX 2: Compute real data metrics at first load using active farm parameters
          await executeYieldSimulation(
            selectedCrop,
            initialLand,
            seedGrade,
            fertilizerBudget,
          );
        } else {
          // Normal fallback initialize if user profile has zero registered farms
          await handleApplySimulation();
        }
      } catch (err) {
        console.warn(
          "Profile registry offline. Hydrating baseline configurations.",
          err.message,
        );
        await handleApplySimulation();
      }
    };
    loadProfileAndInitialize();
  }, []);

  // âœ¨ FIX 3: Automatically updates land size slider immediately when user toggles the farm drop-down
  useEffect(() => {
    if (!selectedFarmId || farms.length === 0) return;
    const activeFarm = farms.find((f) => f._id === selectedFarmId);
    if (activeFarm) {
      const updatedLand = activeFarm.totalLand || 5;
      setAcreage(updatedLand);

      // Auto-trigger calculation for selected farm context shifts to keep calculations fresh
      executeYieldSimulation(
        selectedCrop,
        updatedLand,
        seedGrade,
        fertilizerBudget,
      );
    }
  }, [selectedFarmId]);

  // Centralized analytical simulation executor to split calls between API and local engines cleanly
  const executeYieldSimulation = async (
    crop,
    currentAcreage,
    currentSeed,
    currentFertilizer,
  ) => {
    setIsFetching(true);
    try {
      const data = await getYieldRoiPrediction(
        crop.name,
        currentAcreage,
        currentSeed.label,
        currentFertilizer,
        "Faridabad",
      );
      if (data && data.netProfit) {
        setOutputs(data);
        setDataSource("Gemini Live Inference");
        setIsFetching(false);
        return;
      }
    } catch (err) {
      console.warn(
        "Live model inference bypassed. Running client-side mathematical projection ledger...",
      );
    }

    // Mathematical processing fallback loop running on 100% data fidelity
    const seedTotalCost = currentSeed.costPerAcre * currentAcreage;
    const fertilizerTotalCost = currentFertilizer * currentAcreage;
    const operationCostFixed = 4200 * currentAcreage;
    const totalCostCalculated =
      seedTotalCost + fertilizerTotalCost + operationCostFixed;

    const fertilizerMultiplier =
      currentFertilizer >= 3500 && currentFertilizer <= 5500 ? 1.08 : 0.98;
    const computedYieldTotal = Number(
      (
        crop.baseYield *
        currentAcreage *
        currentSeed.yieldMult *
        fertilizerMultiplier
      ).toFixed(1),
    );
    const grossRevenueCalculated = Math.round(
      computedYieldTotal * crop.pricePerQtl,
    );
    const netProfitCalculated = grossRevenueCalculated - totalCostCalculated;
    const roiPercentCalculated =
      totalCostCalculated > 0
        ? Math.round((netProfitCalculated / totalCostCalculated) * 100)
        : 0;
    const breakEvenCalculated = Number(
      (totalCostCalculated / crop.pricePerQtl).toFixed(1),
    );
    const downsideYield = computedYieldTotal * 0.8;
    const downsideProfitCalculated = Math.round(
      downsideYield * crop.pricePerQtl - totalCostCalculated,
    );

    setOutputs({
      totalYield: computedYieldTotal,
      totalCost: totalCostCalculated,
      grossRevenue: grossRevenueCalculated,
      netProfit: netProfitCalculated,
      roiPercent: roiPercentCalculated,
      breakEvenYield: breakEvenCalculated,
      downsideProfit: downsideProfitCalculated,
      kccLoanEstimate: Math.round(currentAcreage * 34000),
      costBreakdown: {
        seedCost: seedTotalCost,
        fertilizerCost: fertilizerTotalCost,
        operationsCost: operationCostFixed,
      },
      subsidy: {
        schemeName: "Pradhan Mantri Fasal Bima Yojana",
        amount: `₹${(currentAcreage * 2500).toLocaleString("en-IN")} Regional Premium Inward`,
        deadline: "31st July 2026",
      },
    });

    setDataSource("Seeded Analytical Client Matrix");
    setIsFetching(false);
  };

  const handleApplySimulation = () => {
    executeYieldSimulation(selectedCrop, acreage, seedGrade, fertilizerBudget);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
            <CircleDollarSign className="h-6.5 w-6.5 text-[#31572c]" />
            <span>Yield & ROI Predictor</span>
          </h1>
          <p className="text-gray-900 text-[11px] md:text-xs font-semibold mt-1">
            Simulate crops, acreage, and agronomic seed grades to forecast
            expected yields and financial ROI.
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm text-[10px] font-black uppercase tracking-wider text-gray-950">
          Compute Core: {dataSource}
        </div>
      </div>

      {/* Dynamic Profile Active Selector Bar */}
      {farms.length > 0 && (
        <div className="bg-[#f4f7f4] border border-gray-300 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#31572c]" />
            <span className="text-xs font-black text-gray-950 uppercase tracking-wide">
              Sync with Profile Registered Land Asset:
            </span>
          </div>
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[240px]"
          >
            {farms.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.totalLand} Ac)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 2-Column Dashboard Work Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
        {/* LEFT COLUMN: Input Matrix Form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-300 shadow-sm space-y-5">
          <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-2.5 border-b border-gray-200">
            <Coins className="h-4 w-4 text-[#4f772d]" />
            <span>Simulation Parameters</span>
          </h2>

          <div className="space-y-4">
            {/* Expanded Crop Selection Interface */}
            <div>
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider mb-2 block">
                Select Crop Profile Options
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 border border-gray-100 p-1 rounded-xl bg-gray-50/50">
                {CROP_PROFILES.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedCrop.id === crop.id
                        ? "bg-[#31572c] border-[#31572c] text-white font-bold shadow-sm"
                        : "bg-white border-gray-300 text-gray-800 hover:border-[#31572c]"
                    }`}
                  >
                    <span
                      className={`text-xs block font-black leading-tight ${selectedCrop.id === crop.id ? "text-white" : "text-gray-950"}`}
                    >
                      {crop.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold tracking-wide block mt-0.5 ${selectedCrop.id === crop.id ? "text-emerald-100" : "text-gray-600"}`}
                    >
                      {crop.hindi}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Land Size Slider Grid Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider">
                  Cultivation Land Size
                </label>
                <span className="text-[#31572c] font-black text-xs">
                  {acreage} ACRES
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #31572c ${((acreage - 0.5) / 49.5) * 100}%, #e5e7eb ${((acreage - 0.5) / 49.5) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-700 mt-1 font-bold">
                <span>0.5 ac</span>
                <span>50 ac</span>
              </div>
            </div>

            {/* Seed Quality Selector Standard */}
            <div>
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider mb-2 block">
                Seed Quality Standard
              </label>
              <div className="space-y-2">
                {SEED_GRADES.map((grade) => (
                  <button
                    key={grade.label}
                    type="button"
                    onClick={() => setSeedGrade(grade)}
                    className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                      seedGrade.label === grade.label
                        ? "bg-[#31572c] border-[#31572c] text-white shadow-sm font-bold"
                        : "bg-white border-gray-300 text-gray-800 hover:border-[#31572c]"
                    }`}
                  >
                    <div>
                      <span className="text-xs block leading-tight font-black">
                        {grade.label}
                      </span>
                      <span
                        className={`text-[10px] mt-0.5 block ${seedGrade.label === grade.label ? "text-gray-100 font-bold" : "text-gray-700"}`}
                      >
                        {grade.desc}
                      </span>
                    </div>
                    <span className="text-xs font-black shrink-0">
                      ₹{grade.costPerAcre}/ac
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fertilizer Budget Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider">
                  Fertilizer & NPK Budget
                </label>
                <span className="text-[#31572c] font-black text-xs">
                  {formatCurrency(fertilizerBudget)}/acre
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="8000"
                step="250"
                value={fertilizerBudget}
                onChange={(e) => setFertilizerBudget(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #4f772d ${((fertilizerBudget - 1000) / 7000) * 100}%, #e5e7eb ${((fertilizerBudget - 1000) / 7000) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-700 mt-1 font-bold">
                <span>₹1,000/ac</span>
                <span>₹8,000/ac</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplySimulation}
              disabled={isFetching}
              className="w-full bg-[#31572c] text-white hover:bg-[#132a13] font-black py-2.5 px-4 rounded-xl shadow-sm transition-all uppercase tracking-wider text-[10px] flex items-center justify-center gap-2"
            >
              {isFetching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
              {isFetching ? "Applying Inferences..." : "Apply Simulation"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Hud Analytics Board Panels */}
        <div
          className={`space-y-6 ${isFetching ? "opacity-40 pointer-events-none" : ""} transition-opacity duration-200`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#4f772d]/[0.08] border border-[#4f772d]/30 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">
                    Projected Net Profit
                  </span>
                  <h3 className="text-2xl font-black text-emerald-800 leading-tight">
                    {formatCurrency(outputs.netProfit)}
                  </h3>
                  <p className="text-[10px] text-gray-800 font-bold mt-0.5 uppercase tracking-wider">
                    Estimated after operations
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-800 rounded-xl">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">
                    Yield Estimation
                  </span>
                  <h3 className="text-2xl font-black text-gray-950 leading-tight">
                    {outputs.totalYield}{" "}
                    <span className="text-xs font-bold text-gray-700">
                      Quintals
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-800 font-bold mt-0.5 uppercase tracking-wider">
                    Base target: {selectedCrop.baseYield} qtl/acre
                  </p>
                </div>
                <div className="p-2.5 bg-[#4f772d]/10 text-[#31572c] rounded-xl">
                  <Wheat className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Break even details block banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-center space-x-3.5 shadow-sm">
            <div className="p-2 bg-amber-500/15 text-amber-900 rounded-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">
                Production Break-Even Metric
              </span>
              <p className="text-xs font-bold text-gray-950 mt-0.5">
                You need exactly{" "}
                <span className="text-amber-900 font-black text-sm px-0.5">
                  {outputs.breakEvenYield}
                </span>{" "}
                quintals of yield to recover total base seed and NPK
                investments.
              </p>
            </div>
          </div>

          {/* Ledger analysis board */}
          <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-950 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-[#4f772d]" />
              <span>Rotational ROI Ledger Summary</span>
            </h3>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-200">
                <span className="text-gray-800 font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#90a955]" />{" "}
                  Projected Gross Revenues
                </span>
                <span className="text-gray-950 font-black text-sm">
                  {formatCurrency(outputs.grossRevenue)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-200">
                <span className="text-gray-800 font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Total
                  Input Costs (Seed + NPK)
                </span>
                <span className="text-red-700 font-black text-sm">
                  {formatCurrency(outputs.totalCost)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-200">
                <span className="text-gray-800 font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />{" "}
                  Downside Scenario (20% below yield)
                </span>
                <span
                  className={`font-black text-xs ${outputs.downsideProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}
                >
                  Net: {outputs.downsideProfit >= 0 ? "+" : ""}
                  {formatCurrency(outputs.downsideProfit)}
                </span>
              </div>

              <div className="bg-[#f4f7f4] rounded-xl p-3 grid grid-cols-3 gap-2 text-[10px] text-gray-800 font-bold uppercase tracking-wider text-center border border-gray-200">
                <div>
                  <p className="text-gray-700">Seed Cost</p>
                  <p className="text-gray-950 font-black mt-0.5">
                    {formatCurrency(outputs.costBreakdown.seedCost)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">Fertilizers</p>
                  <p className="text-gray-950 font-black mt-0.5">
                    {formatCurrency(outputs.costBreakdown.fertilizerCost)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">Operations</p>
                  <p className="text-gray-950 font-black mt-0.5">
                    {formatCurrency(outputs.costBreakdown.operationsCost)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Index and KCC Loan Advisor parameters */}
          <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center gap-5 justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-950 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#31572c]" />{" "}
                <span>ROI Efficiency Index</span>
              </h4>
              <p className="text-gray-800 text-[11px] font-bold leading-relaxed max-w-sm">
                Shows returns for every rupee invested. An index above 100%
                signifies doubling seed investment value.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-black text-gray-950 uppercase tracking-wide border-t border-gray-100 mt-2">
                <Landmark className="h-4 w-4 text-[#31572c]" />
                <span>
                  KCC Credit Recommendation:{" "}
                  <span className="text-emerald-800 font-black">
                    {formatCurrency(outputs.kccLoanEstimate)}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">
                  Efficiency Ratio
                </p>
                <p className="text-lg font-black text-[#132a13] mt-0.5">
                  {outputs.roiPercent}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-700 flex items-center justify-center font-black text-[10px] text-emerald-800 shrink-0">
                ROI
              </div>
            </div>
          </div>

          {/* Insurance Subsidies section layout */}
          {outputs.subsidy && (
            <div className="bg-white border border-[#4f772d]/30 rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-[#132a13] uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#31572c]" />{" "}
                <span>Applicable Governmental Subsidy Scheme</span>
              </h4>
              <div className="bg-[#4f772d]/[0.03] border border-gray-300 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block">
                    Scheme
                  </span>
                  <span className="font-black text-gray-950 block mt-0.5 leading-tight">
                    {outputs.subsidy.schemeName}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block">
                    Value
                  </span>
                  <span className="font-black text-emerald-800 block mt-0.5">
                    {outputs.subsidy.amount}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest block">
                    Deadline
                  </span>
                  <span className="font-black text-amber-800 block mt-0.5">
                    {outputs.subsidy.deadline}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
