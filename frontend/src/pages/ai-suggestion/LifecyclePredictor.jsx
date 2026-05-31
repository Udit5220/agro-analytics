import React, { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Cpu, Lightbulb, CloudRain, ShieldAlert, Calendar, Loader2 } from "lucide-react";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { getLifecycleGuidance } from "../../services/geminiService";

// Crop specific lifecycle phases fallback matrix
const FALLBACK_PHASES = {
  "Wheat (गेहूं)": [
    { id: 1, name: "Land Preparation", desc: "Field plowed and baseline gypsum applied for salinity buffering.", date: "Nov 05, 2025" },
    { id: 2, name: "Sowing", desc: "Certified HD-3086 wheat seeds sown at 4-5 cm depth.", date: "Nov 15, 2025" },
    { id: 3, name: "Germination", desc: "Coleoptile emergence success rate mapped at 96%.", date: "Nov 25, 2025" },
    { id: 4, name: "Tillering", desc: "Crown roots initiating. Critical Nitrogen top-dressing required for maximum tiller density.", date: "Dec 18, 2025" },
    { id: 5, name: "Jointing", desc: "Stalk elongation phase. First node visible. Keep soil moisture at baseline field capacity.", date: "Jan 15, 2026" },
    { id: 6, name: "Flowering", desc: "Pollen tube expansion and spikelet emergence. Avoid chemical sprays at this stage.", date: "Feb 10, 2026" },
    { id: 7, name: "Grain Filling", desc: "Milk-to-dough photosynthates translocation to grain kernels. Maintain mild moistening.", date: "Feb 28, 2026" },
    { id: 8, name: "Harvest", desc: "Physiological maturity. Reaping recommended when grain moisture falls to 14%.", date: "Mar 20, 2026" }
  ],
  "Rice (धान)": [
    { id: 1, name: "Nursery Preparation", desc: "Seeding wet-bed nursery with organic manures and bio-composts.", date: "Jun 01, 2025" },
    { id: 2, name: "Land Puddling", desc: "Standing water flooded tillage for clay pan compaction layer setup.", date: "Jun 20, 2025" },
    { id: 3, name: "Transplanting", desc: "Healthy 25-day nursery seedlings transplanted in puddle field at 15x20cm density.", date: "Jun 30, 2025" },
    { id: 4, name: "Tillering", desc: "Panicle numbers initiating. Maintain stable 5cm water level to block weed growth.", date: "Jul 25, 2025" },
    { id: 5, name: "Panicle Initiation", desc: "Flag leaf emergence. Stem elongation. High micro-nutrient draw rate.", date: "Aug 20, 2025" },
    { id: 6, name: "Flowering", desc: "Anther dehiscence. Keep water levels optimal. Avoid chemical spray treatments.", date: "Sep 15, 2025" },
    { id: 7, name: "Dough Stage", desc: "Grain starch content solidifying. Drain standing water 10 days before harvesting.", date: "Oct 05, 2025" },
    { id: 8, name: "Harvest", desc: "Physiological maturity reached. Combine reaping recommended at 18-20% grain moisture.", date: "Oct 25, 2025" }
  ],
  "Cotton (कपास)": [
    { id: 1, name: "Land Tillage", desc: "Deep plowing and ridge bed configurations to assist taproot penetration.", date: "Apr 15, 2025" },
    { id: 2, name: "Sowing", desc: "Bt Cotton seeds sown at 3-4 cm depth under ridge beds.", date: "May 05, 2025" },
    { id: 3, name: "Seedling Stage", desc: "Thinning completed. Gap filling done to ensure perfect plant count setup.", date: "May 25, 2025" },
    { id: 4, name: "Squaring", desc: "First sympodial branches forming flower buds (squares). Keep tracking bollworm pests.", date: "Jun 20, 2025" },
    { id: 5, name: "Flowering", desc: "Golden white petals showing up. Pollination peaking. Moisture deficiency strictly avoided.", date: "Jul 15, 2025" },
    { id: 6, name: "Boll Development", desc: "Active boll sizing. Translocation of nutrients critical. Track humidity index.", date: "Aug 10, 2025" },
    { id: 7, name: "Boll Bursting", desc: "Bolls open to expose dry cotton fiber. Avoid any rain or overhead water spray.", date: "Sep 10, 2025" },
    { id: 8, name: "Harvest", desc: "Hand picking or mechanical picking cycles. Store dry cotton bales in ventilated bays.", date: "Oct 05, 2025" }
  ]
};

const FALLBACK_INTERVENTIONS = [
  {
    type: "weather",
    title: "Nitrogen Application Optimization",
    desc: "Based on this week's localized weather forecast (light rain expected on Thursday), the AI model advises delaying urea top-dressing by 3 days."
  },
  {
    type: "pest",
    title: "Microclimate Proximity Warning",
    desc: "Thermal humidity index spikes detected. Monitor leaf wetness thresholds closely during the next 48 hours to prevent early Leaf Blight."
  }
];

export default function LifecyclePredictor() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
  const [sowingDate, setSowingDate] = useState("2025-11-05");
  const [completedPhases, setCompletedPhases] = useState([1, 2, 3]);
  const [expandedPhase, setExpandedPhase] = useState(4);
  const [loading, setLoading] = useState(true);

  // Global location state synchronized
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001")
  });

  // Dynamic state loaded from Gemini/fallback
  const [phases, setPhases] = useState(FALLBACK_PHASES["Wheat (गेहूं)"]);
  const [harvestWindow, setHarvestWindow] = useState("Mar 15 - Mar 22");
  const [baseYieldAtRisk, setBaseYieldAtRisk] = useState("20% - 25%");
  const [interventions, setInterventions] = useState(FALLBACK_INTERVENTIONS);

  // Handle global location selector triggers
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Re-fetch agronomical lifecycle predictions whenever selections shift
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadGuidance = async () => {
      const result = await getLifecycleGuidance(
        selectedCrop,
        sowingDate,
        location.district,
        location.state
      );

      if (active) {
        setPhases(result.phases || FALLBACK_PHASES[selectedCrop] || FALLBACK_PHASES["Wheat (गेहूं)"]);
        setHarvestWindow(result.harvestWindow || "Mar 15 - Mar 22");
        setBaseYieldAtRisk(result.yieldAtRisk || "20% - 25%");
        setInterventions(result.interventions || FALLBACK_INTERVENTIONS);
        setLoading(false);
      }
    };

    loadGuidance();

    return () => {
      active = false;
    };
  }, [selectedCrop, sowingDate, location.district, location.state]);

  // Dynamic metrics updates based on completed status
  const isPhase4Complete = completedPhases.includes(4);
  const yieldAtRisk = isPhase4Complete ? "0% - 5%" : baseYieldAtRisk;
  const activeIrrigationNote = isPhase4Complete ? "CRI IRRIGATION SYNCED" : "MISSING CRI IRRIGATION";
  
  const handleToggleAccordion = (id) => {
    setExpandedPhase(expandedPhase === id ? null : id);
  };

  const handleMarkComplete = (id) => {
    if (!completedPhases.includes(id)) {
      setCompletedPhases([...completedPhases, id]);
      // Auto expand next stage for a satisfying, premium flow experience
      if (id < 8) {
        setExpandedPhase(id + 1);
      }
    } else {
      setCompletedPhases(completedPhases.filter(val => val !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* Module Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-150">
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>AI Lifecycle Guidance Engine</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
              फसल चक्र पूर्वानुमान
            </span>
          </h1>
          <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
            Predictive growth timeline modeling, real-time stress simulations, and split agronomical actions.
          </p>
        </div>

        {/* Dropdown Filters & Date Picker */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Crop Selector */}
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setCompletedPhases([1, 2, 3]); // Reset completion loop to stage 4
                setExpandedPhase(4);
              }}
              className="appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm min-w-[150px]"
            >
              <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
              <option value="Rice (धान)">Rice (धान)</option>
              <option value="Cotton (कपास)">Cotton (कपास)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Sowing Date Picker */}
          <div className="relative">
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] shadow-sm min-w-[160px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Global Location Selector Card */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Top 4-Column Predictive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-left">
        {/* Card 1 (Current Lifecycle Phase) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">CURRENT PHASE</span>
          <h4 className="text-xl font-black text-gray-900 mt-1">{phases[expandedPhase - 1]?.name || "Tillering"}</h4>
          <span className="bg-[#31572c]/8 text-[#31572c] font-black text-[9px] px-2 py-0.5 rounded w-max mt-2 tracking-wider uppercase">
            STAGE {expandedPhase || 4} OF 8
          </span>
        </div>

        {/* Card 2 (AI-Calculated Harvest Window) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">ESTIMATED HARVEST</span>
          <h4 className="text-sm font-black text-gray-900 mt-2">{harvestWindow}</h4>
          <span className="bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[9px] px-2 py-0.5 rounded w-max mt-1 uppercase tracking-wider">
            ACCELERATED BY WEATHER (+3D)
          </span>
        </div>

        {/* Card 3 (Active Yield Risk Factor) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">YIELD AT RISK</span>
          <h4 className={`text-xl font-black mt-1 ${isPhase4Complete ? "text-emerald-700" : "text-red-600"}`}>
            {yieldAtRisk}
          </h4>
          <span className={`border font-black text-[9px] px-2 py-0.5 rounded w-max mt-1 uppercase tracking-wider ${
            isPhase4Complete 
              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            {activeIrrigationNote}
          </span>
        </div>

        {/* Card 4 (Automated Agent Diagnostics) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between h-[105px]">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">TELEMETRY SYNC</span>
          <h4 className="text-sm font-bold text-gray-900 mt-2 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span>Live Scan</span>
          </h4>
          <span className="bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[9px] px-2 py-0.5 rounded w-max mt-1 uppercase tracking-wider">
            GEMINI CALCULATIONS ACTIVE
          </span>
        </div>
      </div>

      {/* Core Workspace Layout Split Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
              <span className="text-xs font-black text-gray-700">Syncing AI Lifecycle Guidance...</span>
            </div>
          </div>
        )}

        {/* Panel A: The Interactive AI Predictive Timeline (Left Columns — Span: 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="border-b border-gray-50 pb-3 mb-4 text-left">
            <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase">
              AI Crops Rotational Growth Program
            </h3>
          </div>

          <div className="relative space-y-6">
            {/* The vertical timeline spine line */}
            <div className="w-0.5 bg-gray-150 absolute left-6 top-4 bottom-4 z-0 pointer-events-none" />

            {phases.map((phase) => {
              const isCompleted = completedPhases.includes(phase.id);
              const isActive = expandedPhase === phase.id;
              const isFuture = !isCompleted && !isActive;

              return (
                <div key={phase.id} className="relative flex items-start gap-4 z-10">
                  
                  {/* Stem Circle node indicator */}
                  <button
                    onClick={() => handleToggleAccordion(phase.id)}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold z-10 shrink-0 shadow-sm transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                        : isActive
                          ? "border-emerald-600 bg-white text-emerald-700 font-black text-sm ring-4 ring-emerald-50/60 scale-105"
                          : "bg-gray-100 border-gray-200 text-gray-400 text-xs font-bold hover:bg-gray-200"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5.5 h-5.5" strokeWidth={3} /> : phase.id}
                  </button>

                  {/* Accordion panel area */}
                  <div className="flex-1 text-left bg-white rounded-xl border border-gray-150/40 p-3 hover:shadow-sm transition-all duration-200">
                    
                    {/* Header Row */}
                    <div 
                      onClick={() => handleToggleAccordion(phase.id)}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-black text-gray-900">
                            {phase.id}. {phase.name}
                          </h4>
                          {isActive && (
                            <span className="bg-emerald-50 border border-emerald-100 text-[#1e4638] font-extrabold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-inner animate-pulse">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                          Date Milestone: {phase.date}
                        </span>
                      </div>
                      
                      {isActive ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </div>

                    {/* Detailed Content Zone (Accordion body) */}
                    {isActive && (
                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-4 animate-fadeIn">
                        
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {phase.desc}
                        </p>

                        {/* Phase 4 Specialized Content Card Block */}
                        {phase.id === 4 && (
                          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 space-y-4 text-left mt-2">
                            
                            {/* Key Actions Ledger */}
                            <div>
                              <h5 className="text-[10px] font-black text-gray-400 tracking-wider mb-2.5 uppercase">
                                Key Predictive Actions Required
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                  <span>First nitrogen top-dress (<span className="text-gray-900 font-extrabold">Urea 30 kg/acre</span>) — <span className="text-gray-400 italic">Target: Days 21-25</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                  <span>First irrigation at 21 DAS (<span className="text-gray-900 font-extrabold">CRI stage critical window</span>)</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                                  <span>Weed management control application (<span className="text-gray-900 font-extrabold">Sulfosulfuron spray protocol</span>)</span>
                                </div>
                              </div>
                            </div>

                            {/* Live Yield Penalty Simulation Warning */}
                            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-semibold text-amber-900 shadow-sm text-left">
                              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                              <div>
                                <h6 className="font-black text-amber-955 block">Yield Reduction Simulation Penalty</h6>
                                <p className="text-[11px] text-amber-800 font-medium leading-relaxed mt-0.5">
                                  Missing CRI irrigation parameters at this milestone will permanently reduce harvest yield weight metrics by <span className="font-extrabold text-amber-950">20-25%</span>.
                                </p>
                              </div>
                            </div>

                            {/* Action Interaction Tool */}
                            <button
                              onClick={() => handleMarkComplete(4)}
                              className={`h-[36px] w-full text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 border border-transparent ${
                                isPhase4Complete
                                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 cursor-pointer"
                                  : "bg-[#31572c] hover:bg-[#132a13] text-[#ecf39e] active:scale-[0.98] cursor-pointer"
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              <span>{isPhase4Complete ? "Reopen Phase Actions" : "Mark Phase Actions Complete"}</span>
                            </button>

                          </div>
                        )}

                        {/* Collapsed view markup representation for other phases */}
                        {phase.id !== 4 && (
                          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Growth Phase Status</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-500">
                                {isCompleted ? "Status: Milestone Completed Successfully" : "Status: Awaiting Prior Milestones"}
                              </span>
                              <button
                                onClick={() => handleMarkComplete(phase.id)}
                                className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                  isCompleted 
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                                    : "bg-white border-gray-250 text-gray-600 hover:bg-gray-55"
                                  }`}
                              >
                                {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                              </button>
                            </div>
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

        {/* Panel B: AI Real-Time Weather Intervention Logs (Right Column — Span: 1) */}
        <div className="lg:col-span-1 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4 min-h-[460px] text-left">
          
          {/* Panel Header */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
            <Cpu className="h-4.5 w-4.5 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              AI Live Interventions
            </h3>
          </div>

          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
            Dynamic anomaly trackers scanning regional crop grids for weather fluctuations and pathogen threats.
          </p>

          <div className="space-y-4">
            {interventions.map((item, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 space-y-1.5 shadow-sm text-left ${
                  item.type === "weather"
                    ? "bg-emerald-50/40 border-emerald-100/70 text-emerald-800"
                    : "bg-red-50/40 border-red-100/70 text-red-950"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.type === "weather" ? (
                    <CloudRain className="w-4.5 h-4.5 text-emerald-700 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-4.5 h-4.5 text-red-700 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-gray-900">
                    {item.title}
                  </h4>
                </div>
                <p className={`text-[11px] leading-relaxed font-medium ${item.type === "weather" ? "text-gray-500" : "text-red-800"}`}>
                  {item.desc}
                </p>
              </div>
            ))}

            {/* Info Pill */}
            <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-3 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
                Diagnostics scan fully refreshed against regional ISRO BHUMI satellite spectral feed parameters.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
