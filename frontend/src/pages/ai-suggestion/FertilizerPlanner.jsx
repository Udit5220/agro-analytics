import React, { useState, useEffect } from "react";
import { MapPin, AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { getFertilizerPlan } from "../../services/geminiService";

export default function FertilizerPlanner() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
  const [selectedStage, setSelectedStage] = useState("Tillering");
  const [loading, setLoading] = useState(true);

  // Global location state synchronized
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    soilData: getSoilDataByPincode("121001")
  });

  // Dynamic state loaded from Gemini/fallback
  const [targetNPK, setTargetNPK] = useState({ nitrogen: 120, phosphorus: 60, potassium: 40 });
  const [isExcessN, setIsExcessN] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [scheduleSteps, setScheduleSteps] = useState([]);

  // Handle global coordinates / district update
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Re-fetch dynamic fertilizer split calibrations whenever filters shift
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadPlan = async () => {
      const n = location.soilData?.nitrogen || 120;
      const p = location.soilData?.phosphorus || 40;
      const k = location.soilData?.potassium || 40;

      const result = await getFertilizerPlan(
        selectedCrop,
        selectedStage,
        `${location.district}, ${location.state}`,
        n,
        p,
        k
      );

      if (active) {
        setTargetNPK(result.targetNPK || { nitrogen: 120, phosphorus: 60, potassium: 40 });
        setIsExcessN(result.isExcessN !== undefined ? result.isExcessN : n > (result.targetNPK?.nitrogen || 120));
        setWarningText(result.warningText || "");
        setScheduleSteps(result.scheduleSteps || []);
        setLoading(false);
      }
    };

    loadPlan();

    return () => {
      active = false;
    };
  }, [
    selectedCrop,
    selectedStage,
    location.district,
    location.state,
    location.pincode,
    location.soilData?.nitrogen,
    location.soilData?.phosphorus,
    location.soilData?.potassium
  ]);

  const currentN = location.soilData?.nitrogen || 120;
  const currentP = location.soilData?.phosphorus || 40;
  const currentK = location.soilData?.potassium || 40;

  return (
    <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Fertilizer Planner</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
              खाद नियोजक
            </span>
          </h1>
          <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1">
            Automated location-targeted nutrient calibrations and split dressing programs.
          </p>
        </div>
      </div>

      {/* Global Location Selector Card */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Selector Dropdown Panel Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Crop Selector */}
        <div className="text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Crop Selector
          </span>
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm"
            >
              <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
              <option value="Rice (धान)">Rice (धान)</option>
              <option value="Cotton (कपास)">Cotton (कपास)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Growth Stage Selector */}
        <div className="text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Growth Stage Selector
          </span>
          <div className="relative">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm"
            >
              <option value="Tillering">Tillering</option>
              <option value="Jointing">Jointing</option>
              <option value="Flowering">Flowering</option>
              <option value="Harvest">Harvest</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Location Soil Telemetry Strip */}
      <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 bg-white border border-gray-200 rounded-xl text-[#31572c] shadow-sm shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              Location Baseline: {location.district}, {location.state} {location.pincode ? `(${location.pincode})` : ''}
            </span>
            <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
              Live Telemetry Profile: {location.soilData?.soilType || "Clay-Loam"} alluvial soil profile synchronized.
            </span>
          </div>
        </div>
        <span className="bg-[#31572c]/8 text-[#31572c] font-black text-[9px] tracking-wider uppercase px-2 py-1 rounded-md shrink-0 self-start sm:self-auto shadow-sm">
          Telemetry Sync: Active
        </span>
      </div>

      {/* Adaptive Warning Banner */}
      {!loading && warningText && (
        <div
          className={`rounded-xl p-4 flex items-start gap-3 mt-4 transition-all duration-300 border ${
            isExcessN
              ? "bg-red-50/60 border-red-100 text-red-900"
              : "bg-emerald-50/30 border-emerald-100 text-emerald-950"
          }`}
        >
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isExcessN ? "text-red-700 animate-pulse" : "text-emerald-700"}`} />
          <div className="space-y-0.5 text-left">
            <h4 className={`text-xs font-black ${isExcessN ? "text-red-950" : "text-emerald-955"}`}>
              {isExcessN ? "Excess Nitrogen Warning" : "Nutrient Levels Sub-optimal"}
            </h4>
            <p className={`text-[11px] font-medium leading-relaxed ${isExcessN ? "text-red-800" : "text-emerald-800"}`}>
              {warningText}
            </p>
          </div>
        </div>
      )}

      {/* Core Workspace Layout Split Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
              <span className="text-xs font-black text-gray-700">Syncing AI Soil Calibrations...</span>
            </div>
          </div>
        )}

        {/* Left Column: 4-Step Fertilizer Schedule Feed (Span: 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-black text-gray-900 tracking-wide pb-3 border-b border-gray-100 uppercase text-left">
            Split Fertilizer Application Schedule
          </h3>

          <div className="space-y-4 relative pl-4 text-left border-l border-gray-100">
            {scheduleSteps.map((step, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Green badge indicator */}
                <div className="absolute -left-[27px] top-0 w-5.5 h-5.5 rounded-full bg-[#edf7f4] border border-[#cbdcd5] text-[#1e4638] font-black text-[10px] flex items-center justify-center shadow-sm">
                  {step.step}
                </div>
                <div>
                  <div className="flex justify-between items-center flex-wrap">
                    <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider bg-gray-50 border px-1.5 py-0.5 rounded">
                      {step.timing}
                    </span>
                  </div>
                  <p className="text-gray-655 text-[11px] leading-relaxed font-medium mt-1 pr-4">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: NPK Balance Bar Chart (Span: 1) */}
        <div className="lg:col-span-1 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-900 tracking-wide pb-3 border-b border-gray-100 uppercase text-left">
            NPK Balance Diagnostics
          </h3>

          <div className="space-y-4">
            {/* Nitrogen (N) */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-[11px] font-bold text-gray-800">
                <span>Nitrogen (N)</span>
                <span>{currentN} / {targetNPK.nitrogen} kg/ha</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                  {/* Target bar */}
                  <div className="absolute left-0 top-0 h-full bg-[#10b981]/50 rounded-full" style={{ width: `${(targetNPK.nitrogen / Math.max(200, currentN, targetNPK.nitrogen)) * 100}%` }} />
                  {/* Current bar */}
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                      isExcessN ? "bg-red-500 animate-pulse" : "bg-[#31572c]"
                    }`}
                    style={{ width: `${(currentN / Math.max(200, currentN, targetNPK.nitrogen)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-[11px] font-bold text-gray-800">
                <span>Phosphorus (P)</span>
                <span>{currentP} / {targetNPK.phosphorus} kg/ha</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                {/* Target bar */}
                <div className="absolute left-0 top-0 h-full bg-[#10b981]/50 rounded-full" style={{ width: `${(targetNPK.phosphorus / Math.max(100, currentP, targetNPK.phosphorus)) * 100}%` }} />
                {/* Current bar */}
                <div className="absolute left-0 top-0 h-full bg-[#31572c] rounded-full" style={{ width: `${(currentP / Math.max(100, currentP, targetNPK.phosphorus)) * 100}%` }} />
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-[11px] font-bold text-gray-800">
                <span>Potassium (K)</span>
                <span>{currentK} / {targetNPK.potassium} kg/ha</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                {/* Target bar */}
                <div className="absolute left-0 top-0 h-full bg-[#10b981]/50 rounded-full" style={{ width: `${(targetNPK.potassium / Math.max(100, currentK, targetNPK.potassium)) * 100}%` }} />
                {/* Current bar */}
                <div className="absolute left-0 top-0 h-full bg-[#31572c] rounded-full" style={{ width: `${(currentK / Math.max(100, currentK, targetNPK.potassium)) * 100}%` }} />
              </div>
            </div>

            {/* Custom chart legend color indicators */}
            <div className="border-t border-gray-50 pt-3 space-y-2 text-left">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Chart Legend
              </h4>
              <div className="flex items-center text-[11px] font-bold text-gray-600">
                <span className="w-3.5 h-3.5 rounded bg-[#10b981]/50 inline-block mr-2 shadow-sm" />
                <span>Target Baseline (kg/ha)</span>
              </div>
              <div className="flex items-center text-[11px] font-bold text-gray-600">
                <span className="w-3.5 h-3.5 rounded bg-[#31572c] inline-block mr-2 shadow-sm" />
                <span>Current Baseline (kg/ha)</span>
              </div>
              {isExcessN && (
                <div className="flex items-center text-[11px] font-bold text-red-600 animate-pulse">
                  <span className="w-3.5 h-3.5 rounded bg-red-500 inline-block mr-2 shadow-sm" />
                  <span>Excess Soil Imbalance (Flashing)</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
