import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  ShieldCheck,
  ClipboardList,
  Loader2,
  Activity,
  Eye,
  TrendingUp,
  Gauge,
} from "lucide-react";
import { getLifecycleData } from "../../../services/diseaseGeminiService";

const CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Mustard"];

// SVG gauge component for Preventive Action Score
const ActionScoreGauge = ({ score, maxScore = 100 }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / maxScore, 1);
  const offset = circumference - pct * circumference;
  const color = score >= 80 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center">
      <svg width="96" height="96" className="transform -rotate-90">
        <circle cx="48" cy="48" r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle cx="48" cy="48" r={radius} stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ marginTop: '24px' }}>
        <span className="text-xl font-black text-gray-900">{score}</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">/100</span>
      </div>
    </div>
  );
};

export default function CropLifecycle() {
  const [activeCrop, setActiveCrop] = useState("Rice");
  const [expandedStage, setExpandedStage] = useState(null);

  // Dynamic state loaded from diseaseGeminiService
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stages: [],
    currentStageIndex: 2
  });

  // Dynamic interactive Checklist State
  const [completedTasks, setCompletedTasks] = useState({});

  // Treatment history from localStorage for action score
  const [treatmentCount, setTreatmentCount] = useState(0);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const hist = JSON.parse(localStorage.getItem("treatmentHistory") || "[]");
        setTreatmentCount(hist.length);
      } catch { setTreatmentCount(0); }
    };
    loadHistory();
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadLifecycle = async () => {
      try {
        const result = await getLifecycleData(activeCrop);
        if (active) {
          setData(result);
          
          // Set expanded stage to current stage by default
          const currentStage = result.stages[result.currentStageIndex];
          if (currentStage) {
            setExpandedStage(currentStage.name);
            
            // Initialize completed tasks state dynamically
            const initialTasks = {};
            (currentStage.checklist || []).forEach((task) => {
              initialTasks[task.id] = false;
            });
            setCompletedTasks(initialTasks);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load lifecycle metrics:", err);
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLifecycle();

    return () => {
      active = false;
    };
  }, [activeCrop]);

  const toggleChecklist = (id) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate dynamic horizontal connecting progress line percentage
  const totalStages = data.stages.length || 6;
  const currentIdx = data.currentStageIndex !== undefined ? data.currentStageIndex : 2;
  const horizontalBarWidth = ((currentIdx + 0.5) / totalStages) * 100;

  // Resolve current interval banner details
  const currentStageInfo = data.stages[currentIdx] || { name: "Vegetative", duration: "21-60 days" };

  // Compute Preventive Action Score based on checklist completion + treatments applied
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const totalTaskCount = Object.keys(completedTasks).length || 1;
  const checklistScore = Math.round((completedCount / totalTaskCount) * 60); // 60% weight
  const treatmentScore = Math.min(treatmentCount * 10, 40); // 40% weight, max 40
  const actionScore = Math.min(checklistScore + treatmentScore, 100);

  // Generate disease probability data per stage
  const stageProbabilities = data.stages.map((stage, idx) => {
    const diseaseCount = (stage.diseases || []).length;
    const baseRisk = diseaseCount * 18;
    const isCurrent = idx === currentIdx;
    return {
      name: stage.name,
      probability: Math.min(baseRisk + (isCurrent ? 15 : 0), 95),
      diseases: diseaseCount,
      isCurrent,
      isCompleted: stage.status === "completed",
    };
  });

  // Monitoring frequency based on current stage risk
  const currentDiseases = (currentStageInfo.diseases || []).length;
  const monitoringFrequency = currentDiseases >= 3 ? "Every 2 Days" : currentDiseases >= 2 ? "Every 3 Days" : "Every 5 Days";
  const monitoringUrgency = currentDiseases >= 3 ? "Critical" : currentDiseases >= 2 ? "Moderate" : "Low";

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* --- PAGE ROOT HEADER --- */}
      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Phenological Phenotyping Platforms
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">
          Monitor crop progress and manage stage-specific disease risks
        </h1>
      </header>

      {/* --- CROP CONTROLS ROW --- */}
      <div className="flex flex-wrap items-center gap-2">
        {CROPS.map((crop) => (
          <button
            key={crop}
            onClick={() => setActiveCrop(crop)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              activeCrop === crop
                ? "bg-[#31572c] border-[#31572c] text-white shadow-sm font-extrabold"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {loading ? (
        // â”€â”€â”€ PULSING TIMELINE LOADER SKELETON â”€â”€â”€
        <div className="space-y-6">
          <div className="h-24 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
          <div className="h-10 bg-gray-100 border border-gray-200/50 rounded-xl animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-14 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* --- PROGRESS TIMELINE GRAPHIC BAR --- */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-x-auto">
            <div className="min-w-[640px] relative flex justify-between items-center px-4">
              {/* Absolute Horizontal Connecting Progress Line */}
              <div className="absolute top-[22px] left-10 right-10 h-1 bg-gray-200 z-0">
                <div
                  className="h-full bg-[#4f772d] transition-all duration-500 rounded-full"
                  style={{ width: `${horizontalBarWidth}%` }}
                ></div>
              </div>

              {/* Dynamic Stage Render Nodes */}
              {data.stages.map((stage, index) => {
                const isCompleted = stage.status === "completed";
                const isCurrent = stage.status === "current" || index === currentIdx;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 relative z-10 w-24 text-center"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-[#4f772d] text-white shadow-sm"
                          : isCurrent
                            ? "bg-white border-4 border-[#31572c] text-[#31572c] scale-110 shadow-md"
                            : "bg-white border-2 border-gray-200 text-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle
                          className={`w-3 h-3 ${isCurrent ? "fill-[#31572c]" : "fill-transparent"}`}
                        />
                      )}
                    </div>

                    <span
                      className={`text-[11px] block tracking-tight ${
                        isCurrent
                          ? "font-black text-gray-900"
                          : "font-bold text-gray-400"
                      }`}
                    >
                      {stage.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- STATS ROW: Action Score + Monitoring Advice + Interval --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Preventive Action Score */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <Gauge className="w-3.5 h-3.5" />
                <span>Preventive Action Score</span>
              </div>
              <div className="relative flex items-center justify-center">
                <ActionScoreGauge score={actionScore} />
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1">
                Based on checklist ({completedCount}/{totalTaskCount}) + treatments ({treatmentCount})
              </p>
            </div>

            {/* Monitoring Frequency Advice */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                <Eye className="w-3.5 h-3.5" />
                <span>Monitoring Frequency</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                  monitoringUrgency === "Critical" ? "bg-red-50 text-red-700 border border-red-200" :
                  monitoringUrgency === "Moderate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {monitoringUrgency}
                </div>
                <span className="text-lg font-black text-gray-900">{monitoringFrequency}</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Recommended inspection interval for <span className="font-bold text-gray-600">{currentStageInfo.name}</span> stage
                with {currentDiseases} active disease risk{currentDiseases !== 1 ? "s" : ""}.
              </p>
            </div>

            {/* Current Interval Info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Current Growth Stage</span>
              </div>
              <div className="mb-3">
                <h3 className="text-lg font-black text-[#31572c]">{currentStageInfo.name}</h3>
                <span className="text-xs font-bold text-gray-400">{currentStageInfo.duration}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#ecf39e] border border-[#90a955]/30 text-[#132a13] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit">
                <Activity className="w-3.5 h-3.5" />
                <span>Next: Flowering â€” Monitor forecasts</span>
              </div>
            </div>
          </div>

          {/* --- DISEASE PROBABILITY BY STAGE GRID --- */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#31572c]" />
                <h2 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
                  Disease Probability by Stage
                </h2>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
                {activeCrop} â€” {totalStages} Stages
              </span>
            </div>

            {/* Risk Bar Chart */}
            <div className="space-y-3">
              {stageProbabilities.map((sp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`text-[11px] w-24 truncate ${sp.isCurrent ? "font-black text-gray-900" : "font-bold text-gray-500"}`}>
                    {sp.name}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 ${
                        sp.probability >= 70 ? "bg-gradient-to-r from-red-500 to-red-400" :
                        sp.probability >= 40 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                        "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      }`}
                      style={{ width: `${sp.probability}%` }}
                    ></div>
                    <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-black text-gray-700">
                      {sp.probability}%
                    </span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                    sp.isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    sp.isCurrent ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-gray-50 text-gray-400 border-gray-200"
                  }`}>
                    {sp.isCompleted ? "Done" : sp.isCurrent ? "Active" : "Upcoming"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* --- ACCORDION CONFIGURATIONS SYSTEM --- */}
          <div className="space-y-3">
            {data.stages.map((stage, idx) => {
              const isExpanded = expandedStage === stage.name;
              const isCurrent = stage.status === "current" || idx === currentIdx;

              return (
                <div
                  key={stage.name}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? "border-[#31572c]/40 shadow-md ring-1 ring-[#31572c]/10"
                      : "border-gray-100 shadow-sm hover:border-gray-200"
                  }`}
                >
                  {/* Accordion Header Row */}
                  <button
                    onClick={() =>
                      setExpandedStage(isExpanded ? null : stage.name)
                    }
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          stage.status === "completed"
                            ? "border-[#4f772d] bg-[#f4f7f4]"
                            : isCurrent
                              ? "border-[#31572c] bg-white"
                              : "border-gray-200 bg-white"
                        }`}
                      >
                        {isCurrent && (
                          <div className="w-2 h-2 rounded-full bg-[#31572c]"></div>
                        )}
                        {stage.status === "completed" && (
                          <div className="w-2 h-2 rounded-full bg-[#4f772d]"></div>
                        )}
                      </div>

                      <span className="text-sm font-black text-gray-900">
                        {stage.name}
                      </span>

                      {isCurrent && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-0.5 rounded-md">
                          Current
                        </span>
                      )}

                      <span className="text-xs font-bold text-gray-400 font-sans tracking-normal">
                        {stage.duration}
                      </span>

                      {/* Disease count badge */}
                      {(stage.diseases || []).length > 0 && (
                        <span className="text-[9px] font-black bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                          {(stage.diseases || []).length} Risks
                        </span>
                      )}
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Accordion Inner Telemetry Body View panels */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-50 bg-[#f4f7f4]/20 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3">
                        {/* Column Block 1: Disease Matrix Vector Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Disease Risks</span>
                          </div>
                          <ul className="space-y-1.5 text-xs font-bold text-gray-600">
                            {(stage.diseases || []).map((dis, dIdx) => (
                              <li key={dIdx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                                {dis}
                              </li>
                            ))}
                            {(stage.diseases || []).length === 0 && (
                              <li className="text-gray-400 italic">No major risks recorded</li>
                            )}
                          </ul>
                        </div>

                        {/* Column Block 2: Preventative Actions */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#31572c] uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Preventive Actions</span>
                          </div>
                          <ul className="space-y-1.5 text-xs font-bold text-gray-600">
                            {(stage.actions || []).map((act, aIdx) => (
                              <li key={aIdx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4f772d]"></span>{" "}
                                {act}
                              </li>
                            ))}
                            {(stage.actions || []).length === 0 && (
                              <li className="text-gray-400 italic">No actions needed</li>
                            )}
                          </ul>
                        </div>

                        {/* Column Block 3: Verification Checks Action Forms */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>Monitoring Checklist</span>
                          </div>
                          <div className="space-y-2.5">
                            {isCurrent && stage.checklist && stage.checklist.length > 0 ? (
                              stage.checklist.map((item) => (
                                <label key={item.id} className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-700 select-none">
                                  <input
                                    type="checkbox"
                                    checked={!!completedTasks[item.id]}
                                    onChange={() => toggleChecklist(item.id)}
                                    className="rounded border-gray-300 text-[#31572c] focus:ring-[#31572c] w-4 h-4 accent-[#31572c]"
                                  />
                                  <span
                                    className={
                                      completedTasks[item.id]
                                        ? "line-through text-gray-400 font-medium"
                                        : ""
                                    }
                                  >
                                    {item.label}
                                  </span>
                                </label>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic font-medium leading-normal block">
                                Checklist only available for the current stage ({currentStageInfo.name}).
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
