// import React, { useState, useEffect } from "react";
// import { MapPin, AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
// import LocationSelector from "../../components/LocationSelector";
// import { getSoilDataByPincode } from "../../services/locationService";
// import { getFertilizerPlan } from "../../services/geminiService";

// export default function FertilizerPlanner() {
//   const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
//   const [selectedStage, setSelectedStage] = useState("Tillering");
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
//   const [targetNPK, setTargetNPK] = useState({ nitrogen: 120, phosphorus: 60, potassium: 40 });
//   const [isExcessN, setIsExcessN] = useState(false);
//   const [warningText, setWarningText] = useState("");
//   const [scheduleSteps, setScheduleSteps] = useState([]);

//   // Handle global coordinates / district update
//   const handleLocationChange = (newLocation) => {
//     setLocation(newLocation);
//   };

//   // Re-fetch dynamic fertilizer split calibrations whenever filters shift
//   useEffect(() => {
//     let active = true;
//     setLoading(true);

//     const loadPlan = async () => {
//       const n = location.soilData?.nitrogen || 120;
//       const p = location.soilData?.phosphorus || 40;
//       const k = location.soilData?.potassium || 40;

//       const result = await getFertilizerPlan(
//         selectedCrop,
//         selectedStage,
//         `${location.district}, ${location.state}`,
//         n,
//         p,
//         k
//       );

//       if (active) {
//         setTargetNPK(result.targetNPK || { nitrogen: 120, phosphorus: 60, potassium: 40 });
//         setIsExcessN(result.isExcessN !== undefined ? result.isExcessN : n > (result.targetNPK?.nitrogen || 120));
//         setWarningText(result.warningText || "");
//         setScheduleSteps(result.scheduleSteps || []);
//         setLoading(false);
//       }
//     };

//     loadPlan();

//     return () => {
//       active = false;
//     };
//   }, [
//     selectedCrop,
//     selectedStage,
//     location.district,
//     location.state,
//     location.pincode,
//     location.soilData?.nitrogen,
//     location.soilData?.phosphorus,
//     location.soilData?.potassium
//   ]);

//   const currentN = location.soilData?.nitrogen || 120;
//   const currentP = location.soilData?.phosphorus || 40;
//   const currentK = location.soilData?.potassium || 40;

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">

//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
//         <div className="text-left">
//           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <span>Fertilizer Planner</span>
//             <span className="text-gray-300 font-light text-xl">|</span>
//             <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
//               खाद नियोजक
//             </span>
//           </h1>
//           <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1">
//             Automated location-targeted nutrient calibrations and split dressing programs.
//           </p>
//         </div>
//       </div>

//       {/* Global Location Selector Card */}
//       <LocationSelector value={location} onChange={handleLocationChange} />

//       {/* Selector Dropdown Panel Row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
//               <option value="Jointing">Jointing</option>
//               <option value="Flowering">Flowering</option>
//               <option value="Harvest">Harvest</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {/* Location Soil Telemetry Strip */}
//       <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
//         <div className="flex items-center gap-3 text-left">
//           <div className="p-2.5 bg-white border border-gray-200 rounded-xl text-[#31572c] shadow-sm shrink-0">
//             <MapPin className="w-4 h-4" />
//           </div>
//           <div>
//             <span className="text-xs font-bold text-gray-900 block">
//               Location Baseline: {location.district}, {location.state} {location.pincode ? `(${location.pincode})` : ''}
//             </span>
//             <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
//               Live Telemetry Profile: {location.soilData?.soilType || "Clay-Loam"} alluvial soil profile synchronized.
//             </span>
//           </div>
//         </div>
//         <span className="bg-[#31572c]/8 text-[#31572c] font-black text-[9px] tracking-wider uppercase px-2 py-1 rounded-md shrink-0 self-start sm:self-auto shadow-sm">
//           Telemetry Sync: Active
//         </span>
//       </div>

//       {/* Adaptive Warning Banner */}
//       {!loading && warningText && (
//         <div
//           className={`rounded-xl p-4 flex items-start gap-3 mt-4 transition-all duration-300 border ${
//             isExcessN
//               ? "bg-red-50/60 border-red-100 text-red-900"
//               : "bg-emerald-50/30 border-emerald-100 text-emerald-950"
//           }`}
//         >
//           <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isExcessN ? "text-red-700 animate-pulse" : "text-emerald-700"}`} />
//           <div className="space-y-0.5 text-left">
//             <h4 className={`text-xs font-black ${isExcessN ? "text-red-950" : "text-emerald-955"}`}>
//               {isExcessN ? "Excess Nitrogen Warning" : "Nutrient Levels Sub-optimal"}
//             </h4>
//             <p className={`text-[11px] font-medium leading-relaxed ${isExcessN ? "text-red-800" : "text-emerald-800"}`}>
//               {warningText}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Core Workspace Layout Split Matrix */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative min-h-[300px]">
//         {loading && (
//           <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
//             <div className="flex flex-col items-center gap-2">
//               <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
//               <span className="text-xs font-black text-gray-700">Syncing AI Soil Calibrations...</span>
//             </div>
//           </div>
//         )}

//         {/* Left Column: 4-Step Fertilizer Schedule Feed (Span: 2) */}
//         <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm space-y-5">
//           <h3 className="text-xs font-black text-gray-900 tracking-wide pb-3 border-b border-gray-100 uppercase text-left">
//             Split Fertilizer Application Schedule
//           </h3>

//           <div className="space-y-4 relative pl-4 text-left border-l border-gray-100">
//             {scheduleSteps.map((step, idx) => (
//               <div key={idx} className="relative space-y-1">
//                 {/* Green badge indicator */}
//                 <div className="absolute -left-[27px] top-0 w-5.5 h-5.5 rounded-full bg-[#edf7f4] border border-[#cbdcd5] text-[#1e4638] font-black text-[10px] flex items-center justify-center shadow-sm">
//                   {step.step}
//                 </div>
//                 <div>
//                   <div className="flex justify-between items-center flex-wrap">
//                     <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
//                     <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider bg-gray-50 border px-1.5 py-0.5 rounded">
//                       {step.timing}
//                     </span>
//                   </div>
//                   <p className="text-gray-655 text-[11px] leading-relaxed font-medium mt-1 pr-4">
//                     {step.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Column: NPK Balance Bar Chart (Span: 1) */}
//         <div className="lg:col-span-1 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
//           <h3 className="text-xs font-black text-gray-900 tracking-wide pb-3 border-b border-gray-100 uppercase text-left">
//             NPK Balance Diagnostics
//           </h3>

//           <div className="space-y-4">
//             {/* Nitrogen (N) */}
//             <div className="space-y-1.5 text-left">
//               <div className="flex justify-between text-[11px] font-bold text-gray-800">
//                 <span>Nitrogen (N)</span>
//                 <span>{currentN} / {targetNPK.nitrogen} kg/ha</span>
//               </div>
//               <div className="space-y-1">
//                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
//                   {/* Target bar */}
//                   <div className="absolute left-0 top-0 h-full bg-[#10b981]/50 rounded-full" style={{ width: `${(targetNPK.nitrogen / Math.max(200, currentN, targetNPK.nitrogen)) * 100}%` }} />
//                   {/* Current bar */}
//                   <div
//                     className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
//                       isExcessN ? "bg-red-500 animate-pulse" : "bg-[#31572c]"
//                     }`}
//                     style={{ width: `${(currentN / Math.max(200, currentN, targetNPK.nitrogen)) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Phosphorus (P) */}
//             <div className="space-y-1.5 text-left">
//               <div className="flex justify-between text-[11px] font-bold text-gray-800">
//                 <span>Phosphorus (P)</span>
//                 <span>{currentP} / {targetNPK.phosphorus} kg/ha</span>
//               </div>
//               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
//                 {/* Target bar */}
//                 <div className="absolute left-0 top-0 h-full bg-[#10b981]/50 rounded-full" style={{ width: `${(targetNPK.phosphorus / Math.max(100, currentP, targetNPK.phosphorus)) * 100}%` }} />
//                 {/* Current bar */}
//                 <div className="absolute left-0 top-0 h-full bg-[#31572c] rounded-full" style={{ width: `${(currentP / Math.max(100, currentP, targetNPK.phosphorus)) * 100}%` }} />
//               </div>
//             </div>

//             {/* Potassium (K) */}
//             <div className="space-y-1.5 text-left">
//               <div className="flex justify-between text-[11px] font-bold text-gray-800">
//                 <span>Potassium (K)</span>
//                 <span>{currentK} / {targetNPK.potassium} kg/ha</span>
//               </div>
//               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
//                 {/* Target bar */}
//                 <div className="absolute left-0 top-0 h-full bg-[#10b981]/50 rounded-full" style={{ width: `${(targetNPK.potassium / Math.max(100, currentK, targetNPK.potassium)) * 100}%` }} />
//                 {/* Current bar */}
//                 <div className="absolute left-0 top-0 h-full bg-[#31572c] rounded-full" style={{ width: `${(currentK / Math.max(100, currentK, targetNPK.potassium)) * 100}%` }} />
//               </div>
//             </div>

//             {/* Custom chart legend color indicators */}
//             <div className="border-t border-gray-50 pt-3 space-y-2 text-left">
//               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                 Chart Legend
//               </h4>
//               <div className="flex items-center text-[11px] font-bold text-gray-600">
//                 <span className="w-3.5 h-3.5 rounded bg-[#10b981]/50 inline-block mr-2 shadow-sm" />
//                 <span>Target Baseline (kg/ha)</span>
//               </div>
//               <div className="flex items-center text-[11px] font-bold text-gray-600">
//                 <span className="w-3.5 h-3.5 rounded bg-[#31572c] inline-block mr-2 shadow-sm" />
//                 <span>Current Baseline (kg/ha)</span>
//               </div>
//               {isExcessN && (
//                 <div className="flex items-center text-[11px] font-bold text-red-600 animate-pulse">
//                   <span className="w-3.5 h-3.5 rounded bg-red-500 inline-block mr-2 shadow-sm" />
//                   <span>Excess Soil Imbalance (Flashing)</span>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { MapPin, AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { getFertilizerPlan } from "../../services/geminiService";
import { profileApi } from "../../services/apiService";
import { getFertilizerRecommendation } from "../../logic/fertilizerLogic";

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

export default function FertilizerPlanner() {
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

  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fertilizer state
  const [targetNPK, setTargetNPK] = useState({
    nitrogen: 120,
    phosphorus: 60,
    potassium: 40,
  });
  const [isExcessN, setIsExcessN] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [scheduleSteps, setScheduleSteps] = useState([]);

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
        // Mock fallback for development
        setFarmsList([
          {
            _id: "1",
            name: "Home Sector Flatlands",
            crops: [
              { _id: "c1", name: "Rice (Paddy)", sowingDate: "2026-05-01" },
              { _id: "c2", name: "Mustard", sowingDate: "2026-05-15" },
            ],
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

  // --- Load fertilizer plan (Hybrid: Gemini first, then logic) ---
  useEffect(() => {
    let active = true;
    if (!selectedCrop || !growthStage || !location.district) return;

    const loadPlan = async () => {
      setLoading(true);
      setUsingFallback(false);

      const currentN = location.soilData?.nitrogen || 80;
      const currentP = location.soilData?.phosphorus || 35;
      const currentK = location.soilData?.potassium || 35;

      // Try Gemini first
      try {
        const result = await getFertilizerPlan(
          selectedCrop,
          growthStage,
          `${location.district}, ${location.state}`,
          currentN,
          currentP,
          currentK,
        );

        if (active && result) {
          setTargetNPK(
            result.targetNPK || {
              nitrogen: 120,
              phosphorus: 60,
              potassium: 40,
            },
          );
          setIsExcessN(
            result.isExcessN !== undefined ? result.isExcessN : false,
          );
          setWarningText(result.warningText || "");
          setScheduleSteps(result.scheduleSteps || []);
          setLoading(false);
        }
      } catch (error) {
        console.warn("Gemini failed, using fallback:", error);

        // Fallback to rule-based logic
        const fallbackResult = getFertilizerRecommendation({
          crop: selectedCrop,
          growthStage: growthStage,
          location: location.district,
          soilData: location.soilData,
          currentNPK: {
            nitrogen: currentN,
            phosphorus: currentP,
            potassium: currentK,
          },
        });

        if (active) {
          setTargetNPK(fallbackResult.targetNPK);
          setIsExcessN(fallbackResult.isExcessN);
          setWarningText(fallbackResult.warningText);
          setScheduleSteps(fallbackResult.scheduleSteps);
          setUsingFallback(true);
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      active = false;
    };
  }, [
    selectedCrop,
    growthStage,
    location.district,
    location.state,
    location.pincode,
    location.soilData,
  ]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleFarmChange = (farmId) => {
    const farm = farmsList.find((f) => (f._id || f.id) === farmId);
    if (farm) {
      setSelectedFarmId(farmId);
      setSelectedFarm(farm);
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

  const currentN = location.soilData?.nitrogen || 80;
  const currentP = location.soilData?.phosphorus || 35;
  const currentK = location.soilData?.potassium || 35;

  return (
    <div className="space-y-5 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif] text-xs">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="text-left">
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Fertilizer Planner</span>
            <span className="text-gray-300 font-light">|</span>
            <span className="text-[#31572c] font-bold text-[10px] md:text-xs bg-[#31572c]/8 px-2 py-0.5 rounded-md">
              खाद नियोजक
            </span>
          </h1>
          <p className="text-gray-500 text-[10px] mt-0.5">
            Location-targeted nutrient calibrations and split dressing programs
            {usingFallback && (
              <span className="ml-2 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[9px]">
                Using rule-based engine
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Selector Panel Row - Updated with farm & crop from profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
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

        {/* Crop Selector - Shows ALL crops */}
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Crop
          </label>
          <div className="relative">
            <select
              value={selectedCropId || ""}
              onChange={(e) => handleCropChange(e.target.value)}
              disabled={cropsList.length === 0}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer disabled:bg-gray-100"
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

      {/* Location Soil Telemetry Strip */}
      <div className="bg-gray-50 border border-gray-200/60 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#31572c] shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-gray-700 block">
              {location.district}, {location.state} ({location.pincode})
            </span>
            <span className="text-[9px] text-gray-500">
              {location.soilData?.soilType || "Clay-Loam"} alluvial soil
            </span>
          </div>
        </div>
        <span className="bg-[#31572c]/8 text-[#31572c] text-[9px] font-bold px-2 py-0.5 rounded">
          Telemetry Active
        </span>
      </div>

      {/* Warning Banner */}
      {!loading && warningText && (
        <div
          className={`rounded-lg p-2.5 flex items-start gap-2 ${
            isExcessN
              ? "bg-red-50 border border-red-200"
              : "bg-emerald-50/40 border border-emerald-100"
          }`}
        >
          <AlertTriangle
            className={`w-4 h-4 shrink-0 mt-0.5 ${isExcessN ? "text-red-600" : "text-emerald-600"}`}
          />
          <p
            className={`text-[10px] font-medium ${isExcessN ? "text-red-800" : "text-emerald-800"}`}
          >
            {warningText}
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-1">
              <Loader2 className="w-6 h-6 text-[#31572c] animate-spin" />
              <span className="text-[10px] font-medium text-gray-600">
                {usingFallback ? "Calculating..." : "Syncing AI..."}
              </span>
            </div>
          </div>
        )}

        {/* Left: Schedule Steps */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-bold text-gray-700 pb-2 border-b border-gray-100">
            Split Fertilizer Schedule
          </h3>

          <div className="space-y-3 mt-3 pl-3 border-l border-gray-100">
            {scheduleSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[23px] top-0 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold flex items-center justify-center">
                  {step.step}
                </div>
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <h4 className="text-[10px] font-bold text-gray-800">
                    {step.title}
                  </h4>
                  <span className="text-[8px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                    {step.timing}
                  </span>
                </div>
                <p className="text-[9px] text-gray-600 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: NPK Balance */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-[11px] font-bold text-gray-700 pb-2 border-b border-gray-100">
            NPK Balance
          </h3>

          <div className="space-y-3 mt-3">
            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-[9px] font-semibold text-gray-700">
                <span>Nitrogen (N)</span>
                <span>
                  {currentN} / {targetNPK.nitrogen} kg/ha
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (currentN / Math.max(targetNPK.nitrogen, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-[9px] font-semibold text-gray-700">
                <span>Phosphorus (P)</span>
                <span>
                  {currentP} / {targetNPK.phosphorus} kg/ha
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (currentP / Math.max(targetNPK.phosphorus, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-[9px] font-semibold text-gray-700">
                <span>Potassium (K)</span>
                <span>
                  {currentK} / {targetNPK.potassium} kg/ha
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (currentK / Math.max(targetNPK.potassium, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
