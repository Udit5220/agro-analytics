import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  Sparkles,
  Landmark,
  Leaf,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  Loader2,
  Sprout,
  Bug,
  Beaker,
} from "lucide-react";
import { profileApi } from "../../../services/apiService";

// ─── CROP ROTATION COMPATIBILITY REGISTRY ─────────────────────────
const ROTATION_CROPS = [
  { id: "wheat", name: "Wheat", hindi: "गेहूं", season: "Rabi", family: "Cereal", nitrogen: -40, color: "#4f772d" },
  { id: "rice", name: "Rice", hindi: "धान", season: "Kharif", family: "Cereal", nitrogen: -35, color: "#132a13" },
  { id: "mustard", name: "Mustard", hindi: "सरसों", season: "Rabi", family: "Oilseed", nitrogen: -15, color: "#90a955" },
  { id: "maize", name: "Maize", hindi: "मक्का", season: "Kharif", family: "Cereal", nitrogen: -45, color: "#31572c" },
  { id: "moong", name: "Moong", hindi: "मूंग", season: "Zaid", family: "Legume", nitrogen: 30, color: "#2e7d32" },
  { id: "chana", name: "Chana", hindi: "चना", season: "Rabi", family: "Legume", nitrogen: 25, color: "#558b2f" },
  { id: "bajra", name: "Bajra", hindi: "बाजरा", season: "Kharif", family: "Millet", nitrogen: -20, color: "#556b2f" },
  { id: "cotton", name: "Cotton", hindi: "कपास", season: "Kharif", family: "Fiber", nitrogen: -30, color: "#a3b18a" },
  { id: "sugarcane", name: "Sugarcane", hindi: "गन्ना", season: "Kharif", family: "Cash", nitrogen: -50, color: "#3e6b2f" },
  { id: "peas", name: "Peas", hindi: "मटर", season: "Rabi", family: "Legume", nitrogen: 20, color: "#66bb6a" },
  { id: "soybean", name: "Soybean", hindi: "सोयाबीन", season: "Kharif", family: "Legume", nitrogen: 35, color: "#43a047" },
  { id: "watermelon", name: "Watermelon", hindi: "तरबूज", season: "Zaid", family: "Cucurbit", nitrogen: -10, color: "#e57373" },
];

// ─── COMPATIBILITY MATRIX ──────────────────────────────────────────
const COMPATIBILITY = {
  "Cereal→Legume": { score: 95, label: "Excellent", reason: "Legumes fix nitrogen depleted by cereals" },
  "Cereal→Oilseed": { score: 75, label: "Good", reason: "Different nutrient uptake profiles reduce depletion" },
  "Cereal→Cereal": { score: 35, label: "Poor", reason: "Continuous cereals deplete same nutrients and invite pests" },
  "Legume→Cereal": { score: 90, label: "Excellent", reason: "Nitrogen-enriched soil boosts cereal yields significantly" },
  "Legume→Legume": { score: 50, label: "Fair", reason: "Marginal benefit — no nutrient contrast" },
  "Legume→Oilseed": { score: 70, label: "Good", reason: "Residual nitrogen benefits oilseed establishment" },
  "Oilseed→Cereal": { score: 80, label: "Good", reason: "Deep taproots break compaction for shallow cereal roots" },
  "Oilseed→Legume": { score: 85, label: "Excellent", reason: "Complementary root architectures rebuild soil structure" },
  "Oilseed→Oilseed": { score: 30, label: "Poor", reason: "Same pest vector and nutrient drawdown" },
  "Fiber→Legume": { score: 88, label: "Excellent", reason: "Cotton exhausts soil — legume recovery is ideal" },
  "Fiber→Cereal": { score: 55, label: "Fair", reason: "Both are heavy nitrogen consumers" },
  "Millet→Legume": { score: 92, label: "Excellent", reason: "Millet-legume rotation is gold-standard for dryland farming" },
  "Millet→Cereal": { score: 60, label: "Fair", reason: "Similar root profiles but different pest cycles" },
  "Cash→Legume": { score: 85, label: "Excellent", reason: "Sugarcane depletes heavily — legumes restore balance" },
  "Cucurbit→Cereal": { score: 72, label: "Good", reason: "Different pest cycles and root depths" },
  "Cucurbit→Legume": { score: 80, label: "Good", reason: "Light feeder followed by nitrogen fixer" },
};

const getCompatibility = (fromFamily, toFamily) => {
  const key = `${fromFamily}→${toFamily}`;
  return COMPATIBILITY[key] || { score: 60, label: "Fair", reason: "No specific data — generic rotation benefit applies" };
};

const getScoreBadge = (score) => {
  if (score >= 85) return "bg-emerald-50 text-emerald-950 border border-emerald-300";
  if (score >= 65) return "bg-[#ecf39e] text-[#132a13] border border-[#90a955]/40";
  if (score >= 45) return "bg-amber-50 text-amber-950 border border-amber-300";
  return "bg-red-50 text-red-950 border border-red-300";
};

// ─── PREDEFINED ROTATION TEMPLATES ────────────────────────────────
const ROTATION_TEMPLATES = [
  { label: "Classic Cereal-Legume", slots: ["rice", "wheat", "moong"], desc: "Rice → Wheat → Moong — the gold standard for Indo-Gangetic plains" },
  { label: "Oilseed Rotation", slots: ["bajra", "mustard", "watermelon"], desc: "Bajra → Mustard → Watermelon — ideal for sandy-loam soils" },
  { label: "Cotton Recovery", slots: ["cotton", "chana", "maize"], desc: "Cotton → Chana → Maize — restores nitrogen after fiber depletion" },
  { label: "Pulse Focus", slots: ["maize", "peas", "soybean"], desc: "Maize → Peas → Soybean — maximum nitrogen enrichment" },
];

export default function CropRotationPlanner() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 3-slot rotation: Kharif → Rabi → Zaid
  const [slot1, setSlot1] = useState("rice");
  const [slot2, setSlot2] = useState("wheat");
  const [slot3, setSlot3] = useState("moong");

  useEffect(() => {
    const loadFarms = async () => {
      try {
        setIsLoading(true);
        const res = await profileApi.getProfile();
        if (res?.success && res?.data?.farms?.length > 0) {
          setFarms(res.data.farms);
          setSelectedFarmId(res.data.farms[0]._id);
        }
      } catch (err) {
        console.warn("Profile offline — using standalone mode.");
      } finally {
        setIsLoading(false);
      }
    };
    loadFarms();
  }, []);

  const crop1 = ROTATION_CROPS.find((c) => c.id === slot1) || ROTATION_CROPS[0];
  const crop2 = ROTATION_CROPS.find((c) => c.id === slot2) || ROTATION_CROPS[1];
  const crop3 = ROTATION_CROPS.find((c) => c.id === slot3) || ROTATION_CROPS[2];

  const compat12 = getCompatibility(crop1.family, crop2.family);
  const compat23 = getCompatibility(crop2.family, crop3.family);
  const compat31 = getCompatibility(crop3.family, crop1.family);

  const overallScore = Math.round((compat12.score + compat23.score + compat31.score) / 3);
  const totalNitrogen = crop1.nitrogen + crop2.nitrogen + crop3.nitrogen;

  const applyTemplate = (template) => {
    setSlot1(template.slots[0]);
    setSlot2(template.slots[1]);
    setSlot3(template.slots[2]);
  };

  const CropSlot = ({ value, onChange, seasonLabel, seasonHindi }) => (
    <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-all min-w-[200px] flex-1">
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-0.5 rounded-md">
        {seasonLabel} · {seasonHindi}
      </span>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-black text-gray-950 text-center focus:outline-none focus:border-[#31572c] cursor-pointer"
        >
          {ROTATION_CROPS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.hindi})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
      </div>
      {(() => {
        const crop = ROTATION_CROPS.find((c) => c.id === value);
        if (!crop) return null;
        return (
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-800">
              <span>Family</span>
              <span className="bg-brand-dark/10 text-[#132a13] font-black px-2 py-0.5 rounded">{crop.family}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-800">
              <span>N₂ Balance</span>
              <span className={`font-black px-2 py-0.5 rounded ${crop.nitrogen > 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                {crop.nitrogen > 0 ? "+" : ""}{crop.nitrogen} kg/ha
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-800">
              <span>Season</span>
              <span className="text-gray-950">{crop.season}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );

  const CompatArrow = ({ compat }) => (
    <div className="flex flex-col items-center justify-center px-2 shrink-0">
      <ArrowRight className="w-5 h-5 text-gray-400" />
      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${getScoreBadge(compat.score)}`}>
        {compat.score}%
      </span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <RefreshCcw className="h-6 w-6 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Crop Rotation Planner</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-black text-sm md:text-base">
              फसल चक्र योजना
            </span>
          </h1>
        </div>
        <p className="text-gray-800 text-[11px] md:text-xs font-semibold mt-1.5">
          Design optimal multi-season crop sequences to maximize soil health, break pest cycles, and improve yields.
        </p>
      </div>

      {/* Farm Profile Selector */}
      {farms.length > 0 && (
        <div className="bg-white border border-gray-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-dark/10 rounded-xl text-[#31572c]">
              <Landmark size={18} />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-800 uppercase block tracking-wider">Active Farm Unit</label>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="mt-1 appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[240px]"
              >
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.totalLand} Acres)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quick Template Selector */}
      <div className="space-y-2">
        <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#31572c]" />
          Quick Rotation Templates
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROTATION_TEMPLATES.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(t)}
              className="text-left bg-white border border-gray-300 rounded-xl p-3.5 hover:border-[#31572c] hover:shadow-sm transition-all cursor-pointer group"
            >
              <h4 className="text-xs font-black text-gray-950 group-hover:text-[#31572c] transition-colors">{t.label}</h4>
              <p className="text-[10px] text-gray-700 font-semibold mt-1 leading-relaxed">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Rotation Planner Strip */}
      <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
          <RefreshCcw className="w-4 h-4 text-[#31572c]" />
          3-Season Rotation Sequence
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#31572c]" />
            <span className="text-xs font-bold text-gray-700 ml-2">Loading farm data...</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-2">
            <CropSlot value={slot1} onChange={setSlot1} seasonLabel="Season 1" seasonHindi="मौसम १" />
            <CompatArrow compat={compat12} />
            <CropSlot value={slot2} onChange={setSlot2} seasonLabel="Season 2" seasonHindi="मौसम २" />
            <CompatArrow compat={compat23} />
            <CropSlot value={slot3} onChange={setSlot3} seasonLabel="Season 3" seasonHindi="मौसम ३" />
          </div>
        )}
      </div>

      {/* Analysis Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Overall Rotation Score */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#31572c]" />
            Rotation Quality Index
          </h3>
          <div className="flex items-center justify-center">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="56" cy="56" r="44" fill="transparent"
                  stroke={overallScore >= 75 ? "#31572c" : overallScore >= 50 ? "#eab308" : "#dc2626"}
                  strokeWidth="8" pathLength="100"
                  strokeDasharray={`${overallScore}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xl font-black text-gray-950">{overallScore}%</span>
            </div>
          </div>
          <div className="text-center">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${getScoreBadge(overallScore)}`}>
              {overallScore >= 85 ? "Excellent Rotation" : overallScore >= 65 ? "Good Rotation" : overallScore >= 45 ? "Fair Rotation" : "Poor Rotation"}
            </span>
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#31572c]" />
            Transition Compatibility
          </h3>
          <div className="space-y-3">
            {[
              { from: crop1, to: crop2, compat: compat12 },
              { from: crop2, to: crop3, compat: compat23 },
              { from: crop3, to: crop1, compat: compat31 },
            ].map((pair, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-950">
                    {pair.from.name} → {pair.to.name}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getScoreBadge(pair.compat.score)}`}>
                    {pair.compat.label} ({pair.compat.score}%)
                  </span>
                </div>
                <p className="text-[10px] text-gray-700 font-semibold leading-relaxed flex items-start gap-1">
                  <Info className="w-3 h-3 text-gray-500 mt-0.5 shrink-0" />
                  {pair.compat.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Health Impact */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#31572c]" />
            Soil Health Impact
          </h3>
          <div className="space-y-3">
            {/* Nitrogen Balance */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                  <Beaker className="w-3.5 h-3.5 text-brand-medium" />
                  Net Nitrogen Balance
                </span>
                <span className={`text-sm font-black ${totalNitrogen >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  {totalNitrogen > 0 ? "+" : ""}{totalNitrogen} kg/ha
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${totalNitrogen >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                  style={{ width: `${Math.min(100, Math.abs(totalNitrogen) + 50)}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-700 font-semibold mt-1.5 flex items-center gap-1.5">
                {totalNitrogen >= 0 ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Positive nitrogen balance — soil enrichment active</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Negative balance — consider adding a legume phase</span>
                  </>
                )}
              </p>
            </div>

            {/* Pest Break */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                  <Bug className="w-3.5 h-3.5 text-brand-medium" />
                  Pest Cycle Break
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${crop1.family !== crop2.family && crop2.family !== crop3.family ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                  {crop1.family !== crop2.family && crop2.family !== crop3.family ? "Strong Break" : "Partial Break"}
                </span>
              </div>
              <p className="text-[10px] text-gray-700 font-semibold">
                {crop1.family !== crop2.family && crop2.family !== crop3.family
                  ? "All 3 seasons use different crop families — optimal pest disruption."
                  : "Consecutive same-family crops may sustain pest populations."}
              </p>
            </div>

            {/* Organic Matter */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-brand-medium" />
                  Organic Matter Trend
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  [crop1, crop2, crop3].some((c) => c.family === "Legume")
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}>
                  {[crop1, crop2, crop3].some((c) => c.family === "Legume") ? "Improving" : "Stable"}
                </span>
              </div>
              <p className="text-[10px] text-gray-700 font-semibold">
                {[crop1, crop2, crop3].some((c) => c.family === "Legume")
                  ? "Legume phase adds organic biomass and improves microbial activity."
                  : "No legume in rotation — consider green manuring to supplement organic matter."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-brand-medium/[0.06] border border-gray-300 rounded-2xl p-5 space-y-3">
        <h3 className="text-[11px] font-black text-[#132a13] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#31572c]" />
          AI Rotation Advisory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {overallScore < 65 && (
            <div className="bg-white border border-amber-300 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-gray-950">Rotation Quality Warning</h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  Your current sequence scores below 65%. Consider replacing one cereal with a legume (Moong, Chana, or Soybean) to significantly boost soil recovery.
                </p>
              </div>
            </div>
          )}
          {totalNitrogen < -30 && (
            <div className="bg-white border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <Beaker className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-gray-950">Nitrogen Deficit Alert</h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  Net nitrogen loss of {Math.abs(totalNitrogen)} kg/ha per cycle. Add Soybean or Moong to restore balance, or apply 40-60 kg/ha supplemental urea.
                </p>
              </div>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Leaf className="w-4 h-4 text-[#31572c] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-gray-950">Yield Improvement Estimate</h4>
              <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                Proper rotation can improve yields by <span className="text-[#31572c] font-black">15–25%</span> over monoculture, and reduce fertilizer costs by <span className="text-[#31572c] font-black">₹2,000–3,500/acre</span>.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#31572c] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-gray-950">Pest Resistance Advisory</h4>
              <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                Rotating across at least 3 different crop families reduces pest and disease pressure by <span className="text-[#31572c] font-black">40–60%</span> versus continuous cropping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
