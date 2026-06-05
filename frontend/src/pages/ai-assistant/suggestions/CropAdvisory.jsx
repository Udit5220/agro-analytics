import React, { useState, useEffect } from "react";
import {
  Sprout,
  Calendar,
  TrendingUp,
  IndianRupee,
  Thermometer,
  Droplet,
  Scale,
  Layers,
  Activity,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  CheckCircle,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { useRole } from "../../../context/RoleContext";
import LocationSelector from "../../../components/LocationSelector";
import { getSoilDataByPincode } from "../../../services/locationService";
import {
  CROP_DATABASE,
  getCurrentSeason,
  calculateProfitability,
  getCropAdvisoryForCrop,
} from "../../../logic/farmerLogic";



// ============================================================================
// SUB-COMPONENT: Dynamic Premium Crop Specification Sheet
// ============================================================================
function CropSpecificationSheet({ data }) {
  const defaultData = {
    cropName: "Rice",
    cropNameHindi: "धान",
    seasonContext: "Zaid (Summer)",
    expectedYield: "35–45 quintals/ha (conventional), 50–60 quintals/ha (SRI)",
    msp: "₹2,300/quintal",
    estimatedProfit: "₹12,343",
    suitableTemperature: "25–30°C",
    waterRequirement: "1000–1500 mm per season",
    seedRate: "40–60 kg/ha (direct), 8–10 kg/ha (SRI)",
    sowingTime: "Kharif (June-July sowing)",
    soilTypes: ["Clay", "Clay Loam", "Silty Clay"],
    suitablePh: "5.5–6.5",
    riskFactors: [
      "Blast Disease",
      "Brown Plant Hopper",
      "Drought",
      "Flooding",
      "Sheath Blight",
    ],
    description:
      "Rice is the main Kharif crop. Requires standing water during growth period.",
  };

  const activeData = { ...defaultData, ...data };

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm font-['Plus_Jakarta_Sans',_sans-serif] text-sm w-full animate-fadeIn antialiased">
      {/* HEADER MATRIX CONTEXT */}
      <div className="bg-gray-50/80 px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Sprout className="w-5 h-5 text-[#31572c]" />
          <h3 className="font-bold text-gray-900 text-sm md:text-base tracking-tight">
            {activeData.cropName}
            <span className="text-gray-300 mx-2 font-light">|</span>
            <span className="text-[#31572c] font-semibold">
              {activeData.cropNameHindi}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-[#31572c]/8 text-[#31572c] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
          <Calendar className="w-3.5 h-3.5" />
          <span>{activeData.seasonContext} Matrix</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* SECTION 1: YIELD & ECONOMIC TARGETS */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Yield & Economic Targets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-gray-50/50 border border-gray-100 rounded-lg flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Expected Output
                </p>
                <p className="text-xs font-bold text-gray-800 mt-0.5 leading-tight">
                  {activeData.expectedYield}
                </p>
              </div>
            </div>
            <div className="p-3.5 bg-gray-50/50 border border-gray-100 rounded-lg flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-[#31572c] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Govt MSP Rate
                </p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  {activeData.msp}
                </p>
              </div>
            </div>
            <div className="p-3.5 bg-[#31572c]/5 border border-[#31572c]/10 rounded-lg flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#31572c] shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#31572c] uppercase">
                  Est. Net Profit (Per Acre)
                </p>
                <p className="text-xs font-bold text-[#31572c] mt-0.5">
                  {activeData.estimatedProfit}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ENVIRONMENTAL & AGRONOMIC METRIC SUBSECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Environmental Matrix */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-white shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-1.5">
              Environmental Thresholds
            </span>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>Suitable Climate Scope</span>
              </div>
              <span className="font-semibold text-gray-800">
                {activeData.suitableTemperature}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span>Hydration Requirement</span>
              </div>
              <span className="font-semibold text-gray-800">
                {activeData.waterRequirement}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Optimal Sowing Window</span>
              </div>
              <span className="font-semibold text-gray-800 text-right">
                {activeData.sowingTime}
              </span>
            </div>
          </div>

          {/* Right Column: Agronomic Framework */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-white shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-1.5">
              Agronomic Framework
            </span>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Target Soil Profiles</span>
              </div>
              <span className="font-semibold text-gray-800 text-right">
                {Array.isArray(activeData.soilTypes)
                  ? activeData.soilTypes.join(", ")
                  : activeData.soilTypes}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Alkalinity pH Range</span>
              </div>
              <span className="font-semibold text-gray-800">
                {activeData.suitablePh}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Scale className="w-4 h-4 text-gray-400" />
                <span>Standard Seed Rate</span>
              </div>
              <span className="font-semibold text-gray-800 text-right leading-tight max-w-[180px]">
                {activeData.seedRate}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: RISK VECTORS & FIELD STRESSORS */}
        <div className="bg-red-50/40 border border-red-100 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
              Risk Vectors & Field Stressors
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(activeData.riskFactors) &&
                activeData.riskFactors.map((risk, index) => (
                  <span
                    key={index}
                    className="bg-white border border-red-200/60 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded"
                  >
                    {risk}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: DETAILED TEXT OVERVIEW */}
        <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Cultivation Overview
            </span>
            <p className="text-gray-600 text-xs leading-relaxed font-medium">
              {activeData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE MODULE COMPONENT
// ============================================================================
export default function CropAdvisory() {
  const { roleConfig } = useRole();
  const [selectedCropId, setSelectedCropId] = useState("rice");
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [profitability, setProfitability] = useState(null);

  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
    activeFarm: null,
  });

  const season = getCurrentSeason();

  // Helper to map crop name string to standard database crop ID keys
  const getCropKey = (cropName) => {
    const lower = cropName.toLowerCase();
    if (lower.includes("rice")) return "rice";
    if (lower.includes("wheat")) return "wheat";
    if (lower.includes("mustard")) return "mustard";
    if (lower.includes("potato")) return "potato";
    return lower;
  };

  // Derive crops list and details dynamically from the selected farm inside location.activeFarm
  const activeFarm = location?.activeFarm;
  const activeCrops = activeFarm?.crops || [
    { name: "Rice (Paddy)", sownArea: 2.5 },
    { name: "Mustard", sownArea: 1.5 },
  ];

  const activeCropObject = activeCrops.find(
    (c) => getCropKey(c.name) === selectedCropId
  ) || activeCrops[0];

  // Derive active area allocation cleanly
  const activeCropArea = activeCropObject ? activeCropObject.sownArea || activeCropObject.size || 1 : 1;

  // Synchronize dynamic crop selection when activeFarm changes
  useEffect(() => {
    if (activeFarm && activeFarm.crops && activeFarm.crops.length > 0) {
      setSelectedCropId(getCropKey(activeFarm.crops[0].name));
    } else {
      setSelectedCropId("rice");
    }
  }, [activeFarm]);

  // Track dynamic API calculation re-evaluation triggers
  useEffect(() => {
    loadAdvisoryForCrop();
  }, [selectedCropId, location, activeCropArea]);

  const loadAdvisoryForCrop = async () => {
    setLoading(true);
    try {
      const result = await getCropAdvisoryForCrop(
        selectedCropId,
        location,
        activeCropArea,
      );
      setAdvisory(result);

      const profitData = calculateProfitability(
        selectedCropId,
        activeCropArea,
        location,
      );
      setProfitability(profitData);
    } catch (error) {
      console.error("Error loading crop advisory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const currentCrop = CROP_DATABASE[selectedCropId];

  // Map incoming telemetry to custom template
  const dynamicSpecData = advisory
    ? {
        cropName: currentCrop?.name || activeCropObject?.label || activeCropObject?.name || "Crop Data",
        cropNameHindi:
          selectedCropId === "wheat"
            ? "गेहूं"
            : selectedCropId === "rice"
              ? "धान"
              : selectedCropId === "potato"
                ? "आलू"
                : "सरसों",
        seasonContext: `${currentCrop?.season || "Custom"}`,
        expectedYield: `${currentCrop?.avgYield || "Dependent Specification"}`,
        msp:
          currentCrop?.msp && currentCrop.msp > 0
            ? `₹${currentCrop.msp}/quintal`
            : selectedCropId === "potato"
              ? "₹1,600/quintal (Mandi)"
              : "N/A",
        estimatedProfit: profitability
          ? `₹${profitability.profit.toLocaleString()}`
          : "Calculating...",
        suitableTemperature: currentCrop?.temperature?.optimal || "Variable",
        waterRequirement: currentCrop?.waterRequirement || "Variable",
        seedRate: currentCrop?.seedRate || "Standard Baseline",
        sowingTime: `${currentCrop?.season || "Active"} Cycle`,
        soilTypes: currentCrop?.soilTypes || ["Standard Loam Blend"],
        suitablePh: currentCrop?.phRange || "6.0–7.0",
        riskFactors: currentCrop?.riskFactors || ["Climatic Fluctuations"],
        description:
          advisory.translation ||
          "No extended overview summary provided from backend API.",
      }
    : null;

  return (
    <div className="space-y-5 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-xs max-w-7xl mx-auto w-full p-4">
      {/* 1. Page Header Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#31572c]" />
            <span>Crop Advisory</span>
            <span className="text-gray-300 font-light text-xs">|</span>
            <span className="text-[#31572c] font-bold text-[10px] md:text-xs bg-[#31572c]/8 px-2 py-0.5 rounded-md">
              फसल सलाह
            </span>
          </h1>
          <p className="text-gray-500 text-[10px] mt-0.5">
            Synchronize registered land profiles to view live analytical
            metrics.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start md:self-auto px-2 py-0.5 bg-[#31572c]/8 rounded text-[10px] font-bold text-[#31572c]">
          <Calendar className="w-3.5 h-3.5 text-[#31572c]" />
          <span>{season} Season Active</span>
        </div>
      </div>

      {/* 2. Interactive Location Selector Module */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <LocationSelector
          value={location}
          onChange={handleLocationChange}
          onCropSelect={setSelectedCropId}
          selectedCropId={selectedCropId}
        />
      </div>

      {/* 4. Dynamic Diagnostics Switchboard Presentation Block */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100">
            <Loader2 className="w-6 h-6 text-[#31572c] animate-spin" />
            <span className="text-[10px] font-medium text-gray-600">
              Syncing Matrix Calculations...
            </span>
          </div>
        ) : advisory ? (
          <CropSpecificationSheet data={dynamicSpecData} />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
            <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">
              No active diagnostics initialized.
            </p>
          </div>
        )}
      </div>

      {/* 5. Command Action Rows */}
      <div className="flex justify-end gap-2.5 pt-2">
        <button
          onClick={loadAdvisoryForCrop}
          className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analysis</span>
        </button>
        <button className="px-4 py-1.5 bg-[#31572c] text-white rounded-lg text-[11px] font-medium hover:bg-[#132a13] transition-colors flex items-center gap-1.5 shadow-sm">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Commit to Profile</span>
        </button>
      </div>
    </div>
  );
}
