import React, { useState, useEffect } from "react";
import { Download, AlertTriangle, Droplet, Lightbulb, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { getIrrigationSchedule } from "../../services/geminiService";

export default function IrrigationScheduler() {
  const [selectedFarm, setSelectedFarm] = useState("Ramu's Farm — Block A");
  const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
  const [selectedStage, setSelectedStage] = useState("Tillering");
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic state hooks mapped to Gemini calculations
  const [scheduledDays, setScheduledDays] = useState([1, 5, 12, 18, 26, 30]);
  const [optionalDays, setOptionalDays] = useState([8, 22]);
  const [moisture, setMoisture] = useState(62);
  const [waterSavingTip, setWaterSavingTip] = useState("Drip irrigation saves 40% water vs flood irrigation.");

  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    soilData: getSoilDataByPincode("121001")
  });

  // Re-fetch dynamic schedule whenever selections shift
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadSchedule = async () => {
      const result = await getIrrigationSchedule(
        selectedCrop,
        selectedStage,
        location.district,
        location.state
      );
      if (active) {
        setScheduledDays(result.scheduledDays || [1, 5, 12, 18, 26, 30]);
        setOptionalDays(result.optionalDays || [8, 22]);
        setMoisture(result.moistureLevel || 62);
        setWaterSavingTip(result.waterSavingTip || "Drip irrigation saves 40% water.");
        setLoading(false);
      }
    };

    loadSchedule();

    return () => {
      active = false;
    };
  }, [selectedCrop, selectedStage, location.district, location.state]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - moisture / 100);

  // Standard month data: June 2025 starts on a Wednesday (2 blank offset cells)
  const blankCells = [null, null];
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const calendarCells = [...blankCells, ...daysInMonth];

  return (
    <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* 1. Header Controls with PDF Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Irrigation Scheduler</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
              सिंचाई शेड्यूल
            </span>
          </h1>
          <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
            Plan, monitor, and execute water delivery programs based on real-time soil moisture telemetry.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 bg-white border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-55 transition-colors cursor-pointer text-gray-700 active:scale-[0.98] shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-[#31572c]" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* 2. Consolidated Location Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* 3. Unified Select Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Farm Selector */}
        <div className="text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Farm Selector
          </span>
          <div className="relative">
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm"
            >
              <option value="Ramu's Farm — Block A">Ramu's Farm — Block A</option>
              <option value="Ramu's Farm — Block B">Ramu's Farm — Block B</option>
              <option value="Hari's Range">Hari's Range</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

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
              <option value="Crown Root Initiation">Crown Root Initiation</option>
              <option value="Flowering">Flowering</option>
              <option value="Maturity">Maturity</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Moisture Deficit Warning Banner */}
      <div className={`bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mt-4 transition-all duration-300 ${moisture < 65 ? "animate-pulse border-amber-300" : "opacity-90"}`}>
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-left">
          <h4 className="text-xs font-black text-amber-950">
            {moisture < 65 ? "Moisture deficit detected" : "Moisture Levels Stable"}
          </h4>
          <p className="text-amber-800 text-[11px] font-medium leading-relaxed">
            {moisture < 65 
              ? `Advance next irrigation by 2 days — soil moisture (${moisture}%) sits below optimal threshold.`
              : `Current soil moisture (${moisture}%) is well-maintained inside crop baseline boundaries.`}
          </p>
        </div>
      </div>

      {/* 5. Core Workspace Split Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
        
        {/* Panel A: The 30-Day Calendar Schedule Grid (Left Column — Span: 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[460px] relative">
          
          {loading && (
            <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
                <span className="text-xs font-black text-gray-700">Syncing AI Water Calendars...</span>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-black text-gray-900 tracking-wide pb-4 border-b border-gray-100 flex justify-between items-center">
              <span>30-Day Schedule — June 2025</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-wider">
                ACTIVE CROP: {selectedCrop.toUpperCase()}
              </span>
            </h3>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center mt-4">
              {/* Weekday labels */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-1"
                >
                  {day}
                </span>
              ))}

              {/* Day cells */}
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-14" />;
                }

                const isScheduled = scheduledDays.includes(day);
                const isOptional = optionalDays.includes(day);
                const isSelected = selectedDay === day;

                let cellClass = "text-xs font-bold text-gray-600 h-14 flex items-center justify-center rounded-xl hover:bg-gray-55 transition-colors cursor-pointer border border-transparent";
                let content = <span>{day}</span>;

                if (isScheduled) {
                  cellClass = `border rounded-xl h-14 flex flex-col items-center justify-center gap-1 bg-[#edf7f4] border-[#cbdcd5] text-[#1e4638] font-black text-xs shadow-sm cursor-pointer hover:opacity-90 transition-all ${
                    isSelected ? "ring-2 ring-[#31572c]" : ""
                  }`;
                  content = (
                    <>
                      <span>{day}</span>
                      <Droplet className="w-2.5 h-2.5 text-[#31572c] fill-[#31572c]" />
                    </>
                  );
                } else if (isOptional) {
                  cellClass = `border rounded-xl h-14 flex flex-col items-center justify-center gap-1 bg-[#f4f9eb] border-[#e2edd1] text-[#415e19] font-black text-xs shadow-sm cursor-pointer hover:opacity-90 transition-all ${
                    isSelected ? "ring-2 ring-[#415e19]" : ""
                  }`;
                  content = (
                    <>
                      <span>{day}</span>
                      <Droplet className="w-2.5 h-2.5 text-[#a3e635] fill-[#a3e635]" />
                    </>
                  );
                } else if (isSelected) {
                  cellClass = "text-xs font-black text-[#132a13] bg-[#31572c]/10 border border-[#31572c]/30 h-14 flex items-center justify-center rounded-xl cursor-pointer shadow-sm";
                }

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={cellClass}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day selection detail status strip */}
          <div className="bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-3.5 mt-6 flex justify-between items-center text-xs">
            {selectedDay ? (
              <>
                <div className="space-y-0.5 text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Selected Date: June {selectedDay}, 2025
                  </span>
                  <p className="font-bold text-gray-800">
                    {scheduledDays.includes(selectedDay)
                      ? "💧 Core irrigation event scheduled. Soil target: 5.5mm volume delivery."
                      : optionalDays.includes(selectedDay)
                        ? "🌱 Light moisture calibration day. Optional soil micro-drenching."
                        : "🚜 General observation day. Maintain active moisture telemetry checks."}
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-1 text-[10px] font-black text-[#31572c] bg-white border px-2.5 py-1 rounded-md shadow-sm uppercase">
                  <CheckCircle2 className="w-3 h-3 text-[#31572c]" />
                  Active
                </span>
              </>
            ) : (
              <span className="text-gray-400 font-semibold italic text-center w-full block">
                Click any scheduled or optional date to review specific irrigation volumes.
              </span>
            )}
          </div>
        </div>

        {/* Panel B: Analytics Metric Sidebar Cards Group (Right Column — Span: 1) */}
        <div className="lg:col-span-1 space-y-4 w-full">
          
          {/* Card 1: Soil Moisture Radial Donut Meter */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center justify-center min-h-[180px]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Soil Moisture
            </span>

            {/* SVG Donut Circle Gauge */}
            <div className="relative flex items-center justify-center">
              <svg width="100" height="100" className="transform -rotate-95">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#31572c"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              {/* Inner Label Stacks */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900">{moisture}%</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {moisture > 65 ? "Optimal" : "Deficit"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Water Saving Tip Alert Box */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 text-left">
            <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-900">
                Water Saving Tip
              </h4>
              <p className="text-gray-600 text-[11px] leading-relaxed font-medium">
                {waterSavingTip}
              </p>
            </div>
          </div>

          {/* Card 3: Schedule Condition Legend Map */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm space-y-3 text-left">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-55 pb-1.5 block">
              Legend
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3.5 h-3.5 rounded bg-[#10b981] inline-block mr-2.5 align-middle shadow-sm" />
                <span className="text-xs font-semibold text-gray-650 align-middle">
                  Scheduled Irrigation
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-3.5 h-3.5 rounded bg-[#a3e635] inline-block mr-2.5 align-middle shadow-sm" />
                <span className="text-xs font-semibold text-gray-650 align-middle">
                  Optional Water Calibration
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
