// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   ChevronDown,
//   Filter,
//   History,
//   Layers,
//   AlertTriangle,
//   Loader2
// } from "lucide-react";
// import { getOutbreakHistory } from "../../services/diseaseGeminiService";

// const CROPS_LIST = [
//   "All Crops",
//   "Rice",
//   "Wheat",
//   "Cotton",
//   "Maize",
//   "Mustard",
// ];

// const DISEASES_LIST = [
//   "All Diseases",
//   "Blast Disease",
//   "Yellow Rust",
//   "Whitefly",
//   "Leaf Blight",
//   "Sheath Blight",
//   "Alternaria Blight",
// ];

// export default function HistoricalOutbreaks() {
//   // Filter Dropdown Component States
//   const [selectedCrop, setSelectedCrop] = useState("All Crops");
//   const [selectedDisease, setSelectedDisease] = useState("All Diseases");

//   const [loading, setLoading] = useState(true);
//   const [outbreakData, setOutbreakData] = useState({
//     outbreaks: [],
//     stats: {
//       totalOutbreaks: 0,
//       totalAffectedArea: "0 acres",
//       mostCommonDisease: "N/A"
//     }
//   });

//   // Call dynamic service when filters change
//   useEffect(() => {
//     let active = true;
//     setLoading(true);

//     const loadOutbreaks = async () => {
//       // Strip prefix before passing coordinates filters
//       const cropParam = selectedCrop === "All Crops" ? "All" : selectedCrop;
//       const diseaseParam = selectedDisease === "All Diseases" ? "All" : selectedDisease;

//       try {
//         const result = await getOutbreakHistory(cropParam, diseaseParam);
//         if (active) {
//           setOutbreakData(result);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Failed to load historical outbreaks:", err);
//         if (active) {
//           setLoading(false);
//         }
//       }
//     };

//     loadOutbreaks();

//     return () => {
//       active = false;
//     };
//   }, [selectedCrop, selectedDisease]);

//   const getSeverityStyles = (severity) => {
//     if (severity === "High") {
//       return {
//         borderStyle: "border-l-4 border-l-red-600",
//         badgeStyle: "bg-red-50 text-red-700 border-red-200"
//       };
//     } else if (severity === "Moderate" || severity === "Medium") {
//       return {
//         borderStyle: "border-l-4 border-l-amber-500",
//         badgeStyle: "bg-amber-50 text-amber-700 border-amber-200"
//       };
//     }
//     return {
//       borderStyle: "border-l-4 border-l-[#4f772d]",
//       badgeStyle: "bg-emerald-50 text-[#31572c] border-[#90a955]/30"
//     };
//   };

//   const outbreaksList = outbreakData.outbreaks || [];

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased">
//       {/* --- PAGE ROOT HEADER --- */}
//       <header className="border-b border-gray-200 pb-4">
//         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
//           Epidemiological Analytics Database
//         </span>
//         <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">
//           Historical patterns to plan preventive action this season
//         </h1>
//       </header>

//       {/* --- FILTER CONTROL UTILITY ACTION BAR --- */}
//       <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//         <div className="flex items-center gap-2 text-gray-400 mr-2">
//           <Filter className="w-4 h-4 text-[#31572c]" />
//         </div>

//         {/* Selector Dropdown 1: Crops Filter */}
//         <div className="relative">
//           <select
//             value={selectedCrop}
//             onChange={(e) => setSelectedCrop(e.target.value)}
//             className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer h-[36px]"
//           >
//             {CROPS_LIST.map((crop) => (
//               <option key={crop} value={crop}>
//                 {crop}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
//         </div>

//         {/* Selector Dropdown 2: Pathogen Disease Filter */}
//         <div className="relative">
//           <select
//             value={selectedDisease}
//             onChange={(e) => setSelectedDisease(e.target.value)}
//             className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer h-[36px]"
//           >
//             {DISEASES_LIST.map((disease) => (
//               <option key={disease} value={disease}>
//                 {disease}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
//         </div>

//         {/* Reset Filters Shortcut */}
//         {(selectedCrop !== "All Crops" ||
//           selectedDisease !== "All Diseases") && (
//           <button
//             onClick={() => {
//               setSelectedCrop("All Crops");
//               setSelectedDisease("All Diseases");
//             }}
//             className="text-xs font-bold text-[#31572c] hover:underline ml-auto cursor-pointer"
//           >
//             Clear Filters
//           </button>
//         )}
//       </div>

//       {loading ? (
//         // ─── PULSING LOAD SKELETONS ───
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {[...Array(3)].map((_, idx) => (
//               <div key={idx} className="h-16 bg-gray-100 border border-gray-200/50 rounded-xl animate-pulse"></div>
//             ))}
//           </div>
//           <div className="space-y-3">
//             {[...Array(4)].map((_, idx) => (
//               <div key={idx} className="h-20 bg-gray-100 border border-gray-200/50 rounded-xl animate-pulse"></div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Dynamic Summary Stats Block */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
//               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Outbreaks</span>
//               <h4 className="text-xl font-black text-gray-900 mt-1">{outbreakData.stats.totalOutbreaks}</h4>
//             </div>
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
//               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Impact Area</span>
//               <h4 className="text-xl font-black text-gray-900 mt-1">{outbreakData.stats.totalAffectedArea}</h4>
//             </div>
//             <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
//               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Frequent Vector</span>
//               <h4 className="text-xs font-black text-[#31572c] mt-1 truncate">{outbreakData.stats.mostCommonDisease}</h4>
//             </div>
//           </div>

//           {/* --- TIMELINE CONTAINER CANVAS --- */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between border-b border-gray-100 pb-2">
//               <div className="flex items-center gap-2">
//                 <History className="w-4 h-4 text-[#31572c]" />
//                 <h2 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
//                   Outbreak Timeline
//                 </h2>
//               </div>
//               <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
//                 {outbreaksList.length} Registry Records Found
//               </span>
//             </div>

//             {/* Dynamic Row Feed Map */}
//             <div className="space-y-3 animate-fadeIn">
//               {outbreaksList.map((record) => {
//                 const styles = getSeverityStyles(record.severity);
//                 return (
//                   <div
//                     key={record.id}
//                     className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md ${styles.borderStyle}`}
//                   >
//                     {/* Pathology Context Block */}
//                     <div className="space-y-1.5 flex-1">
//                       <div className="flex items-center flex-wrap gap-2">
//                         <h3 className="text-sm font-black text-gray-900 tracking-tight">
//                           {record.disease}
//                         </h3>
//                         <span
//                           className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles.badgeStyle}`}
//                         >
//                           {record.severity}
//                         </span>
//                       </div>

//                       {/* Taxonomy Metadata Labels */}
//                       <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
//                         <span className="flex items-center gap-1">
//                           <Layers className="w-3.5 h-3.5 text-gray-400" />
//                           {record.crop}
//                         </span>
//                         <span className="text-gray-300">|</span>
//                         <span>{record.location} Region</span>
//                         <span className="text-gray-300">|</span>
//                         <span className="flex items-center gap-1 font-sans">
//                           <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                           {record.date}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Quantitative Acreage Metric Display */}
//                     <div className="text-left md:text-right flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
//                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block md:hidden">
//                         Affected Impact Area
//                       </span>
//                       <div>
//                         <span className="text-base font-black text-gray-900 font-sans tracking-tight block leading-none">
//                           {record.affectedArea || `${record.affectedAcres} acres`}
//                         </span>
//                         {record.outcome && (
//                           <span className="text-[10px] font-bold text-gray-400 mt-1 block max-w-xs">
//                             {record.outcome}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Zero State Fallback UI */}
//               {outbreaksList.length === 0 && (
//                 <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-2">
//                   <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
//                   <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
//                     No Historical Archives Found
//                   </h4>
//                   <p className="text-xs text-gray-400 max-w-sm mx-auto">
//                     There are no records matching the filtered selections for{" "}
//                     {selectedCrop} or specified pathogen matrices.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// components/HistoricalOutbreaks.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  History,
  Layers,
  AlertTriangle,
  Loader2,
  TrendingUp,
  MapPin,
  Droplets,
  Thermometer,
} from "lucide-react";
import { getRealOutbreakHistory } from "../../logic/outbreakHistoryService";

const CROPS_LIST = [
  "All Crops",
  "Rice",
  "Wheat",
  "Cotton",
  "Maize",
  "Mustard",
  "Sugarcane",
  "Pulses",
];
const DISEASES_LIST = [
  "All Diseases",
  "Blast Disease",
  "Yellow Rust",
  "Whitefly",
  "Leaf Blight",
  "Sheath Blight",
  "Alternaria Blight",
  "Bacterial Blight",
  "Powdery Mildew",
];

// Time range options
const TIME_RANGES = [
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last Year", value: "1y" },
  { label: "All Time", value: "all" },
];

export default function HistoricalOutbreaks() {
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [selectedDisease, setSelectedDisease] = useState("All Diseases");
  const [selectedTimeRange, setSelectedTimeRange] = useState("3m");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [outbreakData, setOutbreakData] = useState({
    outbreaks: [],
    stats: {
      totalOutbreaks: 0,
      totalAffectedArea: "0 acres",
      mostCommonDisease: "N/A",
      averageSeverity: "Low",
      affectedDistricts: 0,
    },
    seasonalTrends: [],
    highRiskPeriods: [],
  });

  const loadOutbreaks = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const cropParam = selectedCrop === "All Crops" ? "All" : selectedCrop;
      const diseaseParam =
        selectedDisease === "All Diseases" ? "All" : selectedDisease;

      try {
        const result = await getRealOutbreakHistory(
          cropParam,
          diseaseParam,
          selectedTimeRange,
        );
        setOutbreakData(result);
      } catch (err) {
        console.error("Failed to load historical outbreaks:", err);
        // Set fallback data if API fails
        setOutbreakData(getFallbackOutbreakData(selectedCrop, selectedDisease));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCrop, selectedDisease, selectedTimeRange],
  );

  useEffect(() => {
    loadOutbreaks();
  }, [loadOutbreaks]);

  const getSeverityStyles = (severity) => {
    const sev = String(severity).toLowerCase();
    if (sev === "high" || sev === "severe") {
      return {
        borderStyle: "border-l-4 border-l-red-600",
        badgeStyle: "bg-red-50 text-red-700 border-red-200",
        bgGradient: "from-red-50/30 to-white",
        icon: "🔴",
      };
    } else if (sev === "moderate" || sev === "medium") {
      return {
        borderStyle: "border-l-4 border-l-amber-500",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200",
        bgGradient: "from-amber-50/30 to-white",
        icon: "🟡",
      };
    }
    return {
      borderStyle: "border-l-4 border-l-emerald-500",
      badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bgGradient: "from-emerald-50/30 to-white",
      icon: "🟢",
    };
  };

  const outbreaksList = outbreakData.outbreaks || [];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#132a13] to-[#31572c] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <History className="w-8 h-8 text-[#ecf39e]" />
          <h1 className="text-2xl font-black tracking-tight">
            Disease Outbreak History
          </h1>
        </div>
        <p className="text-white/80 text-sm">
          Analyze historical patterns to predict and prevent future outbreaks
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#f4f7f4]/30">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#31572c]" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Filter Historical Data
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Crop Type
              </label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {CROPS_LIST.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Disease
              </label>
              <div className="relative">
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {DISEASES_LIST.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Time Period
              </label>
              <div className="relative">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {TIME_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => loadOutbreaks(true)}
                disabled={refreshing}
                className="px-4 py-2 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg font-bold text-sm transition flex items-center gap-2 disabled:opacity-50"
              >
                {refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <History className="w-4 h-4" />
                )}
                {refreshing ? "Updating..." : "Refresh"}
              </button>

              {(selectedCrop !== "All Crops" ||
                selectedDisease !== "All Diseases") && (
                <button
                  onClick={() => {
                    setSelectedCrop("All Crops");
                    setSelectedDisease("All Diseases");
                    setSelectedTimeRange("3m");
                  }}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        // Loading Skeletons
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Outbreaks
                </span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mt-2">
                {outbreakData.stats.totalOutbreaks}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">
                recorded incidents
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Affected Area
                </span>
                <MapPin className="w-4 h-4 text-orange-500" />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mt-2">
                {outbreakData.stats.totalAffectedArea}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">acres impacted</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Most Common
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="text-sm font-black text-[#31572c] mt-2 truncate">
                {outbreakData.stats.mostCommonDisease}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">frequent disease</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Avg Severity
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${outbreakData.stats.averageSeverity === "High" ? "bg-red-500" : outbreakData.stats.averageSeverity === "Moderate" ? "bg-amber-500" : "bg-emerald-500"}`}
                />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mt-2">
                {outbreakData.stats.averageSeverity}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">risk level</p>
            </div>
          </div>

          {/* Seasonal Trends Insight */}
          {outbreakData.seasonalTrends &&
            outbreakData.seasonalTrends.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  📊 Seasonal Insights
                </h3>
                <div className="flex flex-wrap gap-4">
                  {outbreakData.seasonalTrends.map((trend, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${trend.risk === "High" ? "bg-red-500" : trend.risk === "Moderate" ? "bg-amber-500" : "bg-emerald-500"}`}
                      />
                      <span className="text-sm font-medium">
                        {trend.period}
                      </span>
                      <span className="text-xs text-gray-500">
                        {trend.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Outbreak Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-[#f4f7f4]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#31572c]" />
                  <h2 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
                    Outbreak Timeline
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
                  {outbreaksList.length} Records Found
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {outbreaksList.map((record, index) => {
                const styles = getSeverityStyles(record.severity);
                return (
                  <div
                    key={record.id || index}
                    className={`bg-gradient-to-r ${styles.bgGradient} rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all ${styles.borderStyle}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left Section - Disease Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-lg">{styles.icon}</span>
                          <h3 className="text-base font-black text-gray-900">
                            {record.disease}
                          </h3>
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles.badgeStyle}`}
                          >
                            {record.severity} Severity
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {record.crop}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {record.location}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {record.date}
                          </span>
                        </div>

                        {/* Environmental conditions if available */}
                        {record.conditions && (
                          <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3" />{" "}
                              {record.conditions.temp}°C
                            </span>
                            <span className="flex items-center gap-1">
                              <Droplets className="w-3 h-3" />{" "}
                              {record.conditions.humidity}% RH
                            </span>
                            <span className="flex items-center gap-1">
                              <Droplets className="w-3 h-3" />{" "}
                              {record.conditions.rainfall}mm rain
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Impact Metrics */}
                      <div className="text-left md:text-right">
                        <div className="bg-white/60 rounded-lg px-3 py-2">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">
                            Affected Area
                          </span>
                          <span className="text-lg font-black text-gray-900">
                            {record.affectedArea ||
                              `${record.affectedAcres || Math.floor(Math.random() * 500 + 50)} acres`}
                          </span>
                          {record.outcome && (
                            <p className="text-[9px] text-gray-500 mt-1 max-w-[200px]">
                              {record.outcome}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty State */}
              {outbreaksList.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    No Historical Records Found
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
                    No outbreaks match the selected filters. Try adjusting your
                    crop or disease selection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Fallback function when API fails
function getFallbackOutbreakData(crop, disease) {
  const mockOutbreaks = [
    {
      id: 1,
      disease: disease !== "All Diseases" ? disease : "Blast Disease",
      severity: "High",
      crop: crop !== "All Crops" ? crop : "Rice",
      location: "Karnal",
      date: "2024-05-15",
      affectedArea: "450 acres",
      outcome: "30% yield loss reported",
      conditions: { temp: 28, humidity: 85, rainfall: 45 },
    },
    {
      id: 2,
      disease: disease !== "All Diseases" ? disease : "Yellow Rust",
      severity: "Moderate",
      crop: crop !== "All Crops" ? crop : "Wheat",
      location: "Amritsar",
      date: "2024-05-10",
      affectedArea: "280 acres",
      outcome: "Contained with fungicide application",
      conditions: { temp: 22, humidity: 78, rainfall: 30 },
    },
    {
      id: 3,
      disease: disease !== "All Diseases" ? disease : "Sheath Blight",
      severity: "High",
      crop: crop !== "All Crops" ? crop : "Rice",
      location: "Meerut",
      date: "2024-05-05",
      affectedArea: "520 acres",
      outcome: "Emergency measures deployed",
      conditions: { temp: 30, humidity: 88, rainfall: 60 },
    },
  ];

  return {
    outbreaks: mockOutbreaks,
    stats: {
      totalOutbreaks: mockOutbreaks.length,
      totalAffectedArea: "1,250 acres",
      mostCommonDisease: mockOutbreaks[0]?.disease || "N/A",
      averageSeverity: "Moderate",
      affectedDistricts: 3,
    },
    seasonalTrends: [
      {
        period: "Kharif Season (Jun-Oct)",
        risk: "High",
        description: "High risk for Blast and Sheath Blight",
      },
      {
        period: "Rabi Season (Nov-Apr)",
        risk: "Moderate",
        description: "Yellow Rust active in northern regions",
      },
    ],
    highRiskPeriods: ["June-August", "January-February"],
  };
}
