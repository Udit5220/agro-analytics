import React, { useState, useEffect } from "react";
import {
  Droplets,
  Landmark,
  CloudRain,
  Thermometer,
  Sprout,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Loader2,
  Lightbulb,
  Gauge,
  ChevronDown,
  Timer,
} from "lucide-react";
import { profileApi } from "../../../services/apiService";
import seededData from "../../../seed-json/seededData.json";

// ─── CROP WATER REQUIREMENT DATABASE (mm per growth stage) ─────────
const CROP_WATER_DATA = seededData.cropRecommendation.cropWaterData;

const getIntensityColor = (mm, maxMm) => {
  const pct = (mm / maxMm) * 100;
  if (pct >= 70) return "bg-blue-600";
  if (pct >= 45) return "bg-blue-400";
  if (pct >= 20) return "bg-blue-300";
  return "bg-blue-200";
};

const getIntensityLabel = (mm, maxMm) => {
  const pct = (mm / maxMm) * 100;
  if (pct >= 70) return { label: "Critical", style: "bg-red-50 text-red-950 border border-red-300" };
  if (pct >= 45) return { label: "High", style: "bg-amber-50 text-amber-950 border border-amber-300" };
  if (pct >= 20) return { label: "Medium", style: "bg-[#ecf39e] text-[#132a13] border border-[#90a955]/40" };
  return { label: "Low", style: "bg-emerald-50 text-emerald-950 border border-emerald-300" };
};

export default function WaterRequirementIntelligence() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [currentAcreage, setCurrentAcreage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCropId, setSelectedCropId] = useState("rice");
  const [annualRainfall, setAnnualRainfall] = useState(608);

  useEffect(() => {
    const loadFarms = async () => {
      try {
        setIsLoading(true);
        const res = await profileApi.getProfile();
        if (res?.success && res?.data?.farms?.length > 0) {
          setFarms(res.data.farms);
          const firstFarm = res.data.farms[0];
          setSelectedFarmId(firstFarm._id);
          setCurrentAcreage(firstFarm.totalLand || 5);
        }
      } catch (err) {
        console.warn("Profile offline — using defaults.");
      } finally {
        setIsLoading(false);
      }
    };
    loadFarms();
  }, []);

  const handleFarmChange = (farmId) => {
    setSelectedFarmId(farmId);
    const farm = farms.find((f) => f._id === farmId);
    if (farm) setCurrentAcreage(farm.totalLand || 5);
  };

  const selectedCrop = CROP_WATER_DATA.find((c) => c.id === selectedCropId) || CROP_WATER_DATA[0];
  const stageEntries = Object.entries(selectedCrop.stages);
  const maxStageMm = Math.max(...stageEntries.map(([, v]) => v));
  const totalSeasonalNeed = selectedCrop.totalWater * currentAcreage;
  const effectiveRainfall = Math.round(annualRainfall * 0.7); // 70% effective
  const irrigationNeed = Math.max(0, selectedCrop.totalWater - effectiveRainfall);
  const waterSurplusDeficit = effectiveRainfall - selectedCrop.totalWater;

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Droplets className="h-6 w-6 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Water Requirement Intelligence</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-black text-sm md:text-base">
              जल आवश्यकता विश्लेषण
            </span>
          </h1>
        </div>
        <p className="text-gray-800 text-[11px] md:text-xs font-semibold mt-1.5">
          Analyze crop water demands across growth stages, calculate irrigation budgets, and optimize water usage.
        </p>
      </div>

      {/* Farm Profile + Controls */}
      <div className="bg-white border border-gray-300 p-4 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-dark/10 rounded-xl text-[#31572c]">
            <Landmark size={18} />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-800 uppercase block tracking-wider">Active Farm</label>
            {farms.length > 0 ? (
              <select
                value={selectedFarmId}
                onChange={(e) => handleFarmChange(e.target.value)}
                className="mt-1 appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[220px]"
              >
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.totalLand} Acres)
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-bold text-gray-600 mt-1 block">{currentAcreage} Acres (Default)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-800 uppercase block tracking-wider mb-1">Select Crop</label>
            <div className="relative">
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-1.5 pr-8 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[160px]"
              >
                {CROP_WATER_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.hindi})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-800 uppercase block tracking-wider mb-1">Annual Rainfall</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="100"
                max="1500"
                value={annualRainfall}
                onChange={(e) => setAnnualRainfall(Number(e.target.value))}
                className="w-24 h-1 bg-gray-200 rounded accent-[#31572c] cursor-pointer"
              />
              <span className="text-xs font-black text-[#31572c] min-w-[55px]">{annualRainfall} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-700 rounded-xl">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Total Need</span>
          </div>
          <h3 className="text-xl font-black text-gray-950">{selectedCrop.totalWater} <span className="text-xs font-bold text-gray-600">mm/season</span></h3>
          <p className="text-[10px] text-gray-700 font-semibold mt-0.5">{totalSeasonalNeed.toLocaleString("en-IN")} mm for {currentAcreage} acres</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-700 rounded-xl">
              <CloudRain className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Effective Rain</span>
          </div>
          <h3 className="text-xl font-black text-gray-950">{effectiveRainfall} <span className="text-xs font-bold text-gray-600">mm</span></h3>
          <p className="text-[10px] text-gray-700 font-semibold mt-0.5">70% of {annualRainfall}mm annual</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-xl ${waterSurplusDeficit >= 0 ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-700"}`}>
              {waterSurplusDeficit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
              {waterSurplusDeficit >= 0 ? "Surplus" : "Deficit"}
            </span>
          </div>
          <h3 className={`text-xl font-black ${waterSurplusDeficit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {waterSurplusDeficit > 0 ? "+" : ""}{waterSurplusDeficit} <span className="text-xs font-bold">mm</span>
          </h3>
          <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
            {waterSurplusDeficit >= 0 ? "Rainfall covers crop requirement" : `${irrigationNeed}mm from irrigation needed`}
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-brand-dark/10 text-[#31572c] rounded-xl">
              <Timer className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Irrigations</span>
          </div>
          <h3 className="text-xl font-black text-gray-950">{selectedCrop.irrigations} <span className="text-xs font-bold text-gray-600">cycles</span></h3>
          <p className="text-[10px] text-gray-700 font-semibold mt-0.5">Via {selectedCrop.method}</p>
        </div>
      </div>

      {/* Growth Stage Water Timeline */}
      <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
        <h3 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
          <Sprout className="w-4 h-4 text-[#31572c]" />
          Water Demand by Growth Stage — {selectedCrop.name} ({selectedCrop.hindi})
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#31572c]" />
          </div>
        ) : (
          <div className="space-y-3">
            {stageEntries.map(([stage, mm]) => {
              const pct = Math.round((mm / selectedCrop.totalWater) * 100);
              const barWidthPct = Math.round((mm / maxStageMm) * 100);
              const intensity = getIntensityLabel(mm, maxStageMm);
              return (
                <div key={stage} className="grid grid-cols-[160px_1fr_80px_90px] items-center gap-3">
                  <div className="text-left">
                    <span className="text-xs font-black text-gray-950">{stage.replace(/_/g, " ")}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${getIntensityColor(mm, maxStageMm)}`}
                      style={{ width: `${barWidthPct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white mix-blend-difference">
                      {mm} mm
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-gray-800 text-right">{pct}%</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-center ${intensity.style}`}>
                    {intensity.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Crop Comparison Table */}
      <div className="bg-white border border-gray-300 rounded-2xl p-1 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-100">
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase bg-gray-200 border-r border-gray-300">Crop</th>
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase text-center">Total Water (mm)</th>
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase text-center">Irrigations</th>
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase text-center">Method</th>
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase text-center">Need for {currentAcreage} Ac</th>
                <th className="p-4 text-[11px] font-black text-gray-950 tracking-wider uppercase text-center">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {CROP_WATER_DATA.map((crop) => {
                const totalForFarm = crop.totalWater * currentAcreage;
                const isSelected = crop.id === selectedCropId;
                const intensityLevel = crop.totalWater >= 1000 ? "Critical" : crop.totalWater >= 600 ? "High" : crop.totalWater >= 400 ? "Medium" : "Low";
                const intensityStyle = crop.totalWater >= 1000
                  ? "bg-red-50 text-red-950 border border-red-300"
                  : crop.totalWater >= 600
                    ? "bg-amber-50 text-amber-950 border border-amber-300"
                    : crop.totalWater >= 400
                      ? "bg-[#ecf39e] text-[#132a13] border border-[#90a955]/40"
                      : "bg-emerald-50 text-emerald-950 border border-emerald-300";

                return (
                  <tr
                    key={crop.id}
                    onClick={() => setSelectedCropId(crop.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-brand-dark/5" : "hover:bg-gray-50"}`}
                  >
                    <td className="p-4 bg-gray-50 border-r border-gray-200">
                      <span className="text-xs font-black text-gray-950">{crop.name}</span>
                      <span className="text-[10px] font-bold text-gray-600 ml-1.5">{crop.hindi}</span>
                    </td>
                    <td className="p-4 text-sm font-black text-center text-gray-950">{crop.totalWater.toLocaleString()}</td>
                    <td className="p-4 text-xs font-black text-center text-gray-800">{crop.irrigations}</td>
                    <td className="p-4 text-xs font-bold text-center text-gray-800">{crop.method}</td>
                    <td className="p-4 text-xs font-black text-center text-blue-700">{totalForFarm.toLocaleString("en-IN")} mm</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${intensityStyle}`}>
                        {intensityLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Water Saving Tips */}
      <div className="bg-brand-medium/[0.06] border border-gray-300 rounded-2xl p-5 space-y-3">
        <h3 className="text-[11px] font-black text-[#132a13] uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#31572c]" />
          Water Conservation Advisory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Gauge className="w-4 h-4 text-[#31572c] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-gray-950">Crop-Specific Tip</h4>
              <p className="text-[10px] text-gray-700 font-semibold mt-0.5">{selectedCrop.saving}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#31572c] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-gray-950">Smart Scheduling</h4>
              <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                Irrigate during early morning (5–8 AM) to reduce evapotranspiration loss by <span className="text-[#31572c] font-black">15–20%</span>.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <CloudRain className="w-4 h-4 text-[#31572c] mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-gray-950">Rainwater Harvesting</h4>
              <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                Farm pond storage of 500m³ per hectare can supplement {Math.round(annualRainfall * 0.15)}mm of effective seasonal irrigation.
              </p>
            </div>
          </div>
          {waterSurplusDeficit < 0 && (
            <div className="bg-white border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-gray-950">Deficit Warning</h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  Current rainfall is insufficient for {selectedCrop.name}. You need {irrigationNeed}mm supplemental irrigation. Consider switching to a low-water crop like Bajra or Mustard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
