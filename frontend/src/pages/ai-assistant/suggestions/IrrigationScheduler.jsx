// import React, { useState, useEffect } from "react";
// import { Download, AlertTriangle, Droplet, Lightbulb, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
// import LocationSelector from "../../../components/LocationSelector";
// import { getSoilDataByPincode } from "../../../services/locationService";
// import { getIrrigationSchedule } from "../../../services/geminiService";

// export default function IrrigationScheduler() {
//   const [selectedFarm, setSelectedFarm] = useState("Ramu's Farm — Block A");
//   const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
//   const [selectedStage, setSelectedStage] = useState("Tillering");
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Dynamic state hooks mapped to Gemini calculations
//   const [scheduledDays, setScheduledDays] = useState([1, 5, 12, 18, 26, 30]);
//   const [optionalDays, setOptionalDays] = useState([8, 22]);
//   const [moisture, setMoisture] = useState(62);
//   const [waterSavingTip, setWaterSavingTip] = useState("Drip irrigation saves 40% water vs flood irrigation.");

//   const [location, setLocation] = useState({
//     state: "Haryana",
//     district: "Faridabad",
//     pincode: "121001",
//     latitude: 28.4089,
//     longitude: 77.3178,
//     soilData: getSoilDataByPincode("121001")
//   });

//   // Re-fetch dynamic schedule whenever selections shift
//   useEffect(() => {
//     let active = true;
//     setLoading(true);

//     const loadSchedule = async () => {
//       const result = await getIrrigationSchedule(
//         selectedCrop,
//         selectedStage,
//         location.district,
//         location.state
//       );
//       if (active) {
//         setScheduledDays(result.scheduledDays || [1, 5, 12, 18, 26, 30]);
//         setOptionalDays(result.optionalDays || [8, 22]);
//         setMoisture(result.moistureLevel || 62);
//         setWaterSavingTip(result.waterSavingTip || "Drip irrigation saves 40% water.");
//         setLoading(false);
//       }
//     };

//     loadSchedule();

//     return () => {
//       active = false;
//     };
//   }, [selectedCrop, selectedStage, location.district, location.state]);

//   const handleLocationChange = (newLocation) => {
//     setLocation(newLocation);
//   };

//   const radius = 36;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference * (1 - moisture / 100);

//   // Standard month data: June 2025 starts on a Wednesday (2 blank offset cells)
//   const blankCells = [null, null];
//   const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
//   const calendarCells = [...blankCells, ...daysInMonth];

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">

//       {/* 1. Header Controls with PDF Export Button */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
//         <div className="text-left">
//           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <span>Irrigation Scheduler</span>
//             <span className="text-gray-300 font-light text-xl">|</span>
//             <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
//               सिंचाई शेड्यूल
//             </span>
//           </h1>
//           <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
//             Plan, monitor, and execute water delivery programs based on real-time soil moisture telemetry.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="flex items-center gap-1.5 bg-white border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-55 transition-colors cursor-pointer text-gray-700 active:scale-[0.98] shrink-0"
//         >
//           <Download className="w-3.5 h-3.5 text-[#31572c]" />
//           <span>Export PDF</span>
//         </button>
//       </div>

//       {/* 2. Consolidated Location Selector */}
//       <LocationSelector value={location} onChange={handleLocationChange} />

//       {/* 3. Unified Select Filters Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//         {/* Farm Selector */}
//         <div className="text-left">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//             Farm Selector
//           </span>
//           <div className="relative">
//             <select
//               value={selectedFarm}
//               onChange={(e) => setSelectedFarm(e.target.value)}
//               className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm"
//             >
//               <option value="Ramu's Farm — Block A">Ramu's Farm — Block A</option>
//               <option value="Ramu's Farm — Block B">Ramu's Farm — Block B</option>
//               <option value="Hari's Range">Hari's Range</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//           </div>
//         </div>

//         {/* Crop Selector */}
//         <div className="text-left">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//             Crop Selector
//           </span>
//           <div className="relative">
//             <select
//               value={selectedCrop}
//               onChange={(e) => setSelectedCrop(e.target.value)}
//               className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm"
//             >
//               <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
//               <option value="Rice (धान)">Rice (धान)</option>
//               <option value="Cotton (कपास)">Cotton (कपास)</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//           </div>
//         </div>

//         {/* Growth Stage Selector */}
//         <div className="text-left">
//           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//             Growth Stage Selector
//           </span>
//           <div className="relative">
//             <select
//               value={selectedStage}
//               onChange={(e) => setSelectedStage(e.target.value)}
//               className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm"
//             >
//               <option value="Tillering">Tillering</option>
//               <option value="Crown Root Initiation">Crown Root Initiation</option>
//               <option value="Flowering">Flowering</option>
//               <option value="Maturity">Maturity</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {/* 4. Moisture Deficit Warning Banner */}
//       <div className={`bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mt-4 transition-all duration-300 ${moisture < 65 ? "animate-pulse border-amber-300" : "opacity-90"}`}>
//         <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
//         <div className="space-y-0.5 text-left">
//           <h4 className="text-xs font-black text-amber-950">
//             {moisture < 65 ? "Moisture deficit detected" : "Moisture Levels Stable"}
//           </h4>
//           <p className="text-amber-800 text-[11px] font-medium leading-relaxed">
//             {moisture < 65
//               ? `Advance next irrigation by 2 days — soil moisture (${moisture}%) sits below optimal threshold.`
//               : `Current soil moisture (${moisture}%) is well-maintained inside crop baseline boundaries.`}
//           </p>
//         </div>
//       </div>

//       {/* 5. Core Workspace Split Matrix */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">

//         {/* Panel A: The 30-Day Calendar Schedule Grid (Left Column — Span: 2) */}
//         <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[460px] relative">

//           {loading && (
//             <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
//               <div className="flex flex-col items-center gap-2">
//                 <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
//                 <span className="text-xs font-black text-gray-700">Syncing AI Water Calendars...</span>
//               </div>
//             </div>
//           )}

//           <div>
//             <h3 className="text-xs font-black text-gray-900 tracking-wide pb-4 border-b border-gray-100 flex justify-between items-center">
//               <span>30-Day Schedule — June 2025</span>
//               <span className="text-[10px] text-gray-400 font-bold tracking-wider">
//                 ACTIVE CROP: {selectedCrop.toUpperCase()}
//               </span>
//             </h3>

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center mt-4">
//               {/* Weekday labels */}
//               {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
//                 <span
//                   key={day}
//                   className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-1"
//                 >
//                   {day}
//                 </span>
//               ))}

//               {/* Day cells */}
//               {calendarCells.map((day, idx) => {
//                 if (day === null) {
//                   return <div key={`empty-${idx}`} className="h-14" />;
//                 }

//                 const isScheduled = scheduledDays.includes(day);
//                 const isOptional = optionalDays.includes(day);
//                 const isSelected = selectedDay === day;

//                 let cellClass = "text-xs font-bold text-gray-600 h-14 flex items-center justify-center rounded-xl hover:bg-gray-55 transition-colors cursor-pointer border border-transparent";
//                 let content = <span>{day}</span>;

//                 if (isScheduled) {
//                   cellClass = `border rounded-xl h-14 flex flex-col items-center justify-center gap-1 bg-[#edf7f4] border-[#cbdcd5] text-[#1e4638] font-black text-xs shadow-sm cursor-pointer hover:opacity-90 transition-all ${
//                     isSelected ? "ring-2 ring-[#31572c]" : ""
//                   }`;
//                   content = (
//                     <>
//                       <span>{day}</span>
//                       <Droplet className="w-2.5 h-2.5 text-[#31572c] fill-[#31572c]" />
//                     </>
//                   );
//                 } else if (isOptional) {
//                   cellClass = `border rounded-xl h-14 flex flex-col items-center justify-center gap-1 bg-[#f4f9eb] border-[#e2edd1] text-[#415e19] font-black text-xs shadow-sm cursor-pointer hover:opacity-90 transition-all ${
//                     isSelected ? "ring-2 ring-[#415e19]" : ""
//                   }`;
//                   content = (
//                     <>
//                       <span>{day}</span>
//                       <Droplet className="w-2.5 h-2.5 text-[#a3e635] fill-[#a3e635]" />
//                     </>
//                   );
//                 } else if (isSelected) {
//                   cellClass = "text-xs font-black text-[#132a13] bg-[#31572c]/10 border border-[#31572c]/30 h-14 flex items-center justify-center rounded-xl cursor-pointer shadow-sm";
//                 }

//                 return (
//                   <div
//                     key={`day-${day}`}
//                     onClick={() => setSelectedDay(day)}
//                     className={cellClass}
//                   >
//                     {content}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Day selection detail status strip */}
//           <div className="bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-3.5 mt-6 flex justify-between items-center text-xs">
//             {selectedDay ? (
//               <>
//                 <div className="space-y-0.5 text-left">
//                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
//                     Selected Date: June {selectedDay}, 2025
//                   </span>
//                   <p className="font-bold text-gray-800">
//                     {scheduledDays.includes(selectedDay)
//                       ? "ðŸ’§ Core irrigation event scheduled. Soil target: 5.5mm volume delivery."
//                       : optionalDays.includes(selectedDay)
//                         ? "ðŸŒ± Light moisture calibration day. Optional soil micro-drenching."
//                         : "ðŸšœ General observation day. Maintain active moisture telemetry checks."}
//                   </p>
//                 </div>
//                 <span className="shrink-0 flex items-center gap-1 text-[10px] font-black text-[#31572c] bg-white border px-2.5 py-1 rounded-md shadow-sm uppercase">
//                   <CheckCircle2 className="w-3 h-3 text-[#31572c]" />
//                   Active
//                 </span>
//               </>
//             ) : (
//               <span className="text-gray-400 font-semibold italic text-center w-full block">
//                 Click any scheduled or optional date to review specific irrigation volumes.
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Panel B: Analytics Metric Sidebar Cards Group (Right Column — Span: 1) */}
//         <div className="lg:col-span-1 space-y-4 w-full">

//           {/* Card 1: Soil Moisture Radial Donut Meter */}
//           <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center justify-center min-h-[180px]">
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
//               Soil Moisture
//             </span>

//             {/* SVG Donut Circle Gauge */}
//             <div className="relative flex items-center justify-center">
//               <svg width="100" height="100" className="transform -rotate-95">
//                 {/* Background Ring */}
//                 <circle
//                   cx="50"
//                   cy="50"
//                   r={radius}
//                   fill="transparent"
//                   stroke="#e2e8f0"
//                   strokeWidth="8"
//                 />
//                 {/* Progress Ring */}
//                 <circle
//                   cx="50"
//                   cy="50"
//                   r={radius}
//                   fill="transparent"
//                   stroke="#31572c"
//                   strokeWidth="8"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={strokeDashoffset}
//                   strokeLinecap="round"
//                   className="transition-all duration-500"
//                 />
//               </svg>
//               {/* Inner Label Stacks */}
//               <div className="absolute flex flex-col items-center justify-center">
//                 <span className="text-xl font-black text-gray-900">{moisture}%</span>
//                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
//                   {moisture > 65 ? "Optimal" : "Deficit"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Card 2: Water Saving Tip Alert Box */}
//           <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 text-left">
//             <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
//             <div className="space-y-0.5">
//               <h4 className="text-xs font-bold text-gray-900">
//                 Water Saving Tip
//               </h4>
//               <p className="text-gray-600 text-[11px] leading-relaxed font-medium">
//                 {waterSavingTip}
//               </p>
//             </div>
//           </div>

//           {/* Card 3: Schedule Condition Legend Map */}
//           <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm space-y-3 text-left">
//             <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-55 pb-1.5 block">
//               Legend
//             </h4>
//             <div className="space-y-2">
//               <div className="flex items-center">
//                 <span className="w-3.5 h-3.5 rounded bg-[#10b981] inline-block mr-2.5 align-middle shadow-sm" />
//                 <span className="text-xs font-semibold text-gray-650 align-middle">
//                   Scheduled Irrigation
//                 </span>
//               </div>
//               <div className="flex items-center">
//                 <span className="w-3.5 h-3.5 rounded bg-[#a3e635] inline-block mr-2.5 align-middle shadow-sm" />
//                 <span className="text-xs font-semibold text-gray-650 align-middle">
//                   Optional Water Calibration
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
  Download,
  AlertTriangle,
  Droplet,
  Lightbulb,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import LocationSelector from "../../../components/LocationSelector";
import { getSoilDataByPincode } from "../../../services/locationService";
import { getIrrigationSchedule } from "../../../services/geminiService";
import { profileApi, weatherApi } from "../../../services/apiService";
// Import the logic file for direct use if needed
import { getIrrigationRecommendation } from "../../../logic/irrigationLogic";

// Auto-detect growth stage from planting date
const getGrowthStageFromPlantingDate = (plantingDate, cropName) => {
  if (!plantingDate) return "Tillering";
  const sowing = new Date(plantingDate);
  const now = new Date();
  const diffDays = Math.ceil((now - sowing) / (1000 * 60 * 60 * 24));

  const cropLower = cropName?.toLowerCase() || "";
  const isRice = cropLower.includes("rice") || cropLower.includes("paddy");
  const isWheat = cropLower.includes("wheat");

  if (isRice) {
    if (diffDays < 20) return "Germination";
    if (diffDays < 45) return "Tillering";
    if (diffDays < 75) return "Flowering";
    return "Maturity";
  } else if (isWheat) {
    if (diffDays < 15) return "Germination";
    if (diffDays < 50) return "Tillering";
    if (diffDays < 90) return "Flowering";
    return "Maturity";
  } else {
    if (diffDays < 20) return "Germination";
    if (diffDays < 50) return "Tillering";
    if (diffDays < 80) return "Flowering";
    return "Maturity";
  }
};

export default function IrrigationScheduler() {
  // --- Profile state ---
  const [farmsList, setFarmsList] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // --- Crops from selected farm ---
  const [cropsList, setCropsList] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [plantingDate, setPlantingDate] = useState(null);

  // --- Growth stage (auto-derived) ---
  const [growthStage, setGrowthStage] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false); // Track if using rule-based

  // AI-generated schedule
  const [scheduledDays, setScheduledDays] = useState([]);
  const [optionalDays, setOptionalDays] = useState([]);
  const [moisture, setMoisture] = useState(62);
  const [waterSavingTip, setWaterSavingTip] = useState("");
  const [deficitMessage, setDeficitMessage] = useState("");

  // Rainfall data state
  const [rainfallData, setRainfallData] = useState(null);

  // Location state
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

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

          // Populate crops from this farm
          const crops = defaultFarm.crops || [];
          setCropsList(crops);

          if (crops.length > 0) {
            const defaultCrop = crops[0];
            setSelectedCropId(defaultCrop._id || defaultCrop.id);
            setSelectedCrop(defaultCrop.name);
            setPlantingDate(defaultCrop.sowingDate);
          }
        }
      } catch (error) {
        console.error("Failed to load farms:", error);
        // Fallback mock data for development
        setFarmsList([
          {
            _id: "1",
            name: "Home Sector Flatlands",
            location: "Faridabad Outskirts",
            totalLand: 4.5,
            crops: [
              { _id: "c1", name: "Rice (Paddy)", sowingDate: "2026-05-01" },
              { _id: "c2", name: "Mustard", sowingDate: "2026-05-15" },
            ],
          },
          {
            _id: "2",
            name: "Northern Tube-well Plot",
            location: "Ballabhgarh Boundary",
            totalLand: 3.2,
            crops: [{ _id: "c3", name: "Wheat", sowingDate: "2025-11-10" }],
          },
        ]);
        setSelectedFarmId("1");
        setSelectedFarm({
          _id: "1",
          name: "Home Sector Flatlands",
          crops: [
            { _id: "c1", name: "Rice (Paddy)", sowingDate: "2026-05-01" },
            { _id: "c2", name: "Mustard", sowingDate: "2026-05-15" },
          ],
        });
        setCropsList([
          { _id: "c1", name: "Rice (Paddy)", sowingDate: "2026-05-01" },
          { _id: "c2", name: "Mustard", sowingDate: "2026-05-15" },
        ]);
        setSelectedCropId("c1");
        setSelectedCrop("Rice (Paddy)");
        setPlantingDate("2026-05-01");
      }
    };
    loadFarms();
    return () => {
      active = false;
    };
  }, []);

  // --- When farm changes, update crops list ---
  useEffect(() => {
    if (selectedFarm) {
      const crops = selectedFarm.crops || [];
      setCropsList(crops);

      // Auto-select first crop if available
      if (crops.length > 0 && !selectedCropId) {
        const firstCrop = crops[0];
        setSelectedCropId(firstCrop._id || firstCrop.id);
        setSelectedCrop(firstCrop.name);
        setPlantingDate(firstCrop.sowingDate);
      }
    }
  }, [selectedFarm]);

  // --- Auto-derive growth stage ---
  useEffect(() => {
    if (selectedCrop && plantingDate) {
      const stage = getGrowthStageFromPlantingDate(plantingDate, selectedCrop);
      setGrowthStage(stage);
    }
  }, [selectedCrop, plantingDate]);

  // --- Fetch rainfall data ---
  const fetchRainfallData = async () => {
    if (!location.district) return null;
    try {
      const res = await weatherApi.getRainfall(location.district, 7);
      if (res && res.success) {
        setRainfallData(res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Rainfall API failed:", error);
      return null;
    }
  };

  // --- Reload schedule (Hybrid: Gemini first, then rule-based) ---
  useEffect(() => {
    let active = true;
    if (!selectedCrop || !growthStage || !location.district) return;

    const loadSchedule = async () => {
      setLoading(true);
      setUsingFallback(false);

      // Step 1: Fetch rainfall data
      const rainfall = await fetchRainfallData();

      // Step 2: Try Gemini first (hybrid strategy)
      const result = await getIrrigationSchedule(
        selectedCrop,
        growthStage,
        location.district,
        location.state,
        rainfall,
        null, // temperature data
        null, // current moisture (will be calculated)
      );

      if (active) {
        setScheduledDays(result.scheduledDays || []);
        setOptionalDays(result.optionalDays || []);
        setMoisture(result.moistureLevel ?? 62);
        setWaterSavingTip(result.waterSavingTip || getDefaultTip());

        // Check if we're using fallback
        if (result._source === "rule-based-engine") {
          setUsingFallback(true);
        }

        // Set deficit message if available
        if (result.deficitMessage) {
          setDeficitMessage(result.deficitMessage);
        } else {
          // Generate deficit message based on moisture
          if (result.moistureLevel < 65) {
            setDeficitMessage(
              `Soil moisture (${result.moistureLevel}%) below optimal threshold.`,
            );
          } else {
            setDeficitMessage("");
          }
        }

        setLoading(false);
      }
    };

    loadSchedule();

    return () => {
      active = false;
    };
  }, [selectedCrop, growthStage, location.district, location.state]);

  const getDefaultTip = () => {
    return "Drip irrigation saves 40% water compared to flood irrigation.";
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleFarmChange = (farmId) => {
    const farm = farmsList.find((f) => (f._id || f.id) === farmId);
    if (farm) {
      setSelectedFarmId(farmId);
      setSelectedFarm(farm);
      // Reset crop selection
      setSelectedCropId(null);
      setSelectedCrop(null);
      setPlantingDate(null);
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

  // Donut chart
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - moisture / 100);

  const getMoistureColor = () => {
    if (moisture >= 65) return "text-green-700";
    if (moisture >= 45) return "text-amber-600";
    return "text-red-600";
  };

  // Calendar (June 2025 starts on Sunday? Let's calculate properly)
  // June 1, 2025 is a Sunday â†’ 0 blank cells
  const blankCells = []; // Sunday start â†’ no blanks
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const calendarCells = [...blankCells, ...daysInMonth];

  return (
    <div className="space-y-5 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif] text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="text-left">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Irrigation Scheduler</span>
            <span className="text-gray-300 font-light">|</span>
            <span className="text-[#31572c] font-bold text-[10px] md:text-xs bg-[#31572c]/8 px-2 py-0.5 rounded-md">
              सिंचाई शेड्यूल
            </span>
          </h1>
          <p className="text-gray-500 text-[10px] mt-0.5">
            AI-powered water scheduling with real-time soil & rainfall data
            {usingFallback && (
              <span className="ml-2 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[9px]">
                Using rule-based engine
              </span>
            )}
          </p>
        </div>

        <button className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-semibold shadow-sm hover:bg-gray-50 transition-colors">
          <Download className="w-3 h-3 text-[#31572c]" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Location Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Farm Selector */}
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Farm
          </label>
          <div className="relative">
            <select
              value={selectedFarmId || ""}
              onChange={(e) => handleFarmChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer"
            >
              {farmsList.map((farm) => (
                <option key={farm._id || farm.id} value={farm._id || farm.id}>
                  {farm.name} ({farm.totalLand || "?"} acres)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Crop Selector - Now shows ALL crops */}
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Crop
          </label>
          <div className="relative">
            <select
              value={selectedCropId || ""}
              onChange={(e) => handleCropChange(e.target.value)}
              disabled={cropsList.length === 0}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {cropsList.map((crop) => (
                <option key={crop._id || crop.id} value={crop._id || crop.id}>
                  {crop.name}{" "}
                  {crop.sowingDate
                    ? `(sown: ${new Date(crop.sowingDate).toLocaleDateString()})`
                    : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Growth Stage - Auto-derived */}
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Growth Stage (auto-detected)
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">
            {growthStage || "—"}
          </div>
        </div>
      </div>

      {/* Moisture Warning Banner */}
      {(moisture < 65 || deficitMessage) && (
        <div
          className={`rounded-lg p-2.5 flex items-center gap-2 ${
            moisture < 45
              ? "bg-red-50 border border-red-200"
              : "bg-amber-50/80 border border-amber-200"
          }`}
        >
          <AlertTriangle
            className={`w-4 h-4 ${moisture < 45 ? "text-red-600" : "text-amber-600"} shrink-0`}
          />
          <div className="text-left">
            <p className="text-[10px] font-bold text-amber-900">
              {moisture < 65
                ? `Moisture deficit: ${moisture}%`
                : "Moisture alert"}
            </p>
            <p className="text-amber-800 text-[9px]">
              {deficitMessage ||
                `Advance next irrigation by 2 days — soil moisture (${moisture}%) sits below optimal threshold.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative min-h-[380px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-1">
                <Loader2 className="w-6 h-6 text-[#31572c] animate-spin" />
                <span className="text-[10px] font-medium text-gray-600">
                  {usingFallback
                    ? "Calculating schedule..."
                    : "Fetching AI schedule..."}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
            <h3 className="text-[11px] font-bold text-gray-700">
              June 2025 Schedule
            </h3>
            {growthStage && (
              <span className="text-[9px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">
                {growthStage.toUpperCase()}
              </span>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span
                key={day}
                className="text-[9px] font-bold text-gray-400 uppercase"
              >
                {day.substring(0, 3)}
              </span>
            ))}

            {calendarCells.map((day, idx) => {
              if (day === null)
                return <div key={`empty-${idx}`} className="h-10" />;

              const isScheduled = scheduledDays.includes(day);
              const isOptional = optionalDays.includes(day);
              const isSelected = selectedDay === day;

              let cellClass =
                "h-10 flex items-center justify-center rounded-lg text-[10px] font-medium cursor-pointer transition-all";
              let content = day;

              if (isScheduled) {
                cellClass += ` bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold ${isSelected ? "ring-2 ring-emerald-500" : ""}`;
                content = (
                  <div className="flex flex-col items-center">
                    <span>{day}</span>
                    <Droplet className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                );
              } else if (isOptional) {
                cellClass += ` bg-lime-50 border border-lime-200 text-lime-700 ${isSelected ? "ring-2 ring-lime-500" : ""}`;
                content = (
                  <div className="flex flex-col items-center">
                    <span>{day}</span>
                    <Droplet className="w-2.5 h-2.5 text-lime-500" />
                  </div>
                );
              } else if (isSelected) {
                cellClass +=
                  " bg-gray-100 border border-gray-300 text-gray-800 font-bold";
              } else {
                cellClass += " hover:bg-gray-50 text-gray-600";
              }

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cellClass}
                >
                  {content}
                </div>
              );
            })}
          </div>

          {/* Selected day info */}
          <div className="bg-gray-50 rounded-lg p-2.5 mt-4 text-[9px]">
            {selectedDay ? (
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  June {selectedDay}:{" "}
                  {scheduledDays.includes(selectedDay)
                    ? "ðŸ’§ Scheduled irrigation (5-7mm water)"
                    : optionalDays.includes(selectedDay)
                      ? "ðŸŒ± Optional calibration (2-3mm if needed)"
                      : "ðŸ“‹ Observation day — check soil moisture"}
                </span>
                <CheckCircle2 className="w-3 h-3 text-[#31572c]" />
              </div>
            ) : (
              <span className="text-gray-400 italic">
                Click a date for irrigation details
              </span>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Soil Moisture Gauge */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Soil Moisture
            </span>
            <div className="relative flex justify-center my-2">
              <svg width="80" height="80" className="transform -rotate-95">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="7"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="#31572c"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center inset-0">
                <span className={`text-lg font-black ${getMoistureColor()}`}>
                  {moisture}%
                </span>
                <span className="text-[9px] text-gray-500 font-medium">
                  {moisture >= 65
                    ? "Optimal"
                    : moisture >= 45
                      ? "Low"
                      : "Critical"}
                </span>
              </div>
            </div>
            {usingFallback && (
              <div className="mt-2 text-[8px] text-gray-400 bg-gray-50 rounded px-2 py-1">
                Calculated using rule-based engine
              </div>
            )}
          </div>

          {/* Water Saving Tip */}
          {waterSavingTip && (
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-semibold text-emerald-800 mb-0.5">
                  Water Saving Tip
                </p>
                <p className="text-[10px] text-gray-700 leading-relaxed">
                  {waterSavingTip}
                </p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white border border-gray-200 rounded-xl p-3">
            <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Legend
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-[10px] text-gray-600">
                  Scheduled Irrigation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-lime-400" />
                <span className="text-[10px] text-gray-600">
                  Optional Calibration
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
