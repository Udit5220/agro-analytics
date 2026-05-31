import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  RefreshCw,
  Award,
  Leaf,
  Droplets,
  Thermometer,
  MapPin,
  Calendar,
  Scale,
  Sparkles,
} from "lucide-react";
import { getCropRankings } from "../../services/geminiService";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { weatherApi } from "../../services/apiService";

const SOIL_TYPES = [
  "Sandy",
  "Loamy",
  "Clay",
  "Silt",
  "Peaty",
  "Chalky",
  "Alluvial",
];
const DISTRICTS = [
  "Faridabad",
  "Gurugram",
  "Panipat",
  "Karnal",
  "Hisar",
  "Rohtak",
  "Sonipat",
  "Ambala",
];

const INITIAL_CROP_RANKINGS = [
  {
    rank: 1,
    name: "Wheat",
    hindi: "गेहूं",
    score: 92,
    explanation:
      "Excellent organic soil profile match and cold winter climate indices.",
  },
  {
    rank: 2,
    name: "Rice",
    hindi: "चावल",
    score: 85,
    explanation:
      "Highly compatible water retention clay matrix matches rainfall onset.",
  },
  {
    rank: 3,
    name: "Maize",
    hindi: "मक्का",
    score: 78,
    explanation:
      "Balanced soil pH and moisture parameters favor organic yield metrics.",
  },
  {
    rank: 4,
    name: "Sugarcane",
    hindi: "गन्ना",
    score: 72,
    explanation:
      "Strong market price support makes it highly profitable long term.",
  },
  {
    rank: 5,
    name: "Cotton",
    hindi: "कपास",
    score: 65,
    explanation:
      "Drought-tolerant deep root system handles moisture fluctuations.",
  },
  {
    rank: 6,
    name: "Mustard",
    hindi: "सरसों",
    score: 60,
    explanation: "Low water requirement matches medium sandy-loam properties.",
  },
  {
    rank: 7,
    name: "Bajra",
    hindi: "बाजरा",
    score: 55,
    explanation:
      "Extremely resilient to high soil temperatures and drought indexes.",
  },
  {
    rank: 8,
    name: "Moong",
    hindi: "मूंग",
    score: 48,
    explanation:
      "Foliar growth stage helps in natural nitrogen fixation cycles.",
  },
  {
    rank: 9,
    name: "Sunflower",
    hindi: "सूरजमुखी",
    score: 42,
    explanation:
      "Moderate yields can be optimized with extra potassium inputs.",
  },
];

function getBarColor(score) {
  if (score >= 85) return "bg-[#132a13]";
  if (score >= 75) return "bg-[#31572c]";
  if (score >= 60) return "bg-[#4f772d]";
  if (score >= 50) return "bg-[#90a955]";
  return "bg-[#90a955]/60";
}

function getRankBadgeColor(rank) {
  if (rank === 1) return "bg-[#132a13] text-[#ecf39e] border-[#31572c]";
  if (rank === 2) return "bg-[#31572c] text-[#ecf39e] border-[#4f772d]";
  if (rank === 3) return "bg-[#4f772d] text-white border-[#90a955]";
  return "bg-[#f4f7f4] text-[#31572c] border-gray-300";
}

export default function CropRankingEngine() {
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

  const [rainfall, setRainfall] = useState(608);
  const [temperature, setTemperature] = useState(42);
  const [soilType, setSoilType] = useState("Clay");
  const [waterAvailability, setWaterAvailability] = useState("Medium");
  const [landArea, setLandArea] = useState(20);
  const [district, setDistrict] = useState("Faridabad");
  const [season, setSeason] = useState("Kharif");

  const [waterWeight, setWaterWeight] = useState(22);
  const [roiWeight, setRoiWeight] = useState(50);
  const [riskWeight, setRiskWeight] = useState(72);

  const [rankings, setRankings] = useState(INITIAL_CROP_RANKINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState("static");

  const handleLocationChange = (newLocation) => {
    if (
      newLocation.district !== location.district ||
      newLocation.state !== location.state ||
      newLocation.pincode !== location.pincode
    ) {
      setLocation(newLocation);
    }
  };

  // Sync farm parameters with weather APIs ONLY when user swaps their location card
  useEffect(() => {
    let active = true;

    if (location.district) {
      setDistrict(location.district);
      const month = new Date().getMonth() + 1;
      const derived =
        month >= 6 && month <= 10
          ? "Kharif"
          : month >= 11 || month <= 3
            ? "Rabi"
            : "Zaid";
      setSeason(derived);
    }

    if (location.soilData && location.soilData.soilType) {
      const matched = SOIL_TYPES.find(
        (s) => s.toLowerCase() === location.soilData.soilType.toLowerCase(),
      );
      if (matched) {
        setSoilType(matched);
      } else {
        if (location.soilData.soilType.toLowerCase().includes("clay")) {
          setSoilType("Clay");
        } else {
          setSoilType("Loamy");
        }
      }
    }

    const syncWeatherSensors = async () => {
      try {
        const res = await weatherApi.getCurrentWeather(
          location.district,
          location.latitude,
          location.longitude,
        );
        if (res && res.success && res.data && active) {
          setTemperature(res.data.currentTemp || 42);
          setRainfall(
            Math.max(
              100,
              Math.min(
                1200,
                Math.round((res.data.expectedRainfall || 12) * 20),
              ),
            ),
          );
        }
      } catch (err) {
        console.warn(
          "[Ranking Engine] Sensor extraction complete.",
          err.message,
        );
      }
    };

    syncWeatherSensors();
    return () => {
      active = false;
    };
  }, [location]);

  // Handle explicit submission action triggered exclusively by manual user click
  const handleRecalculate = async () => {
    setIsLoading(true);
    try {
      const result = await getCropRankings(
        district,
        soilType,
        rainfall,
        temperature,
        waterAvailability,
        landArea,
        waterWeight,
        roiWeight,
        riskWeight,
        season,
      );

      const coreData = result?.data || result;
      const sourceIndicator = result?.source || coreData?.source || "static";

      if (coreData && Array.isArray(coreData)) {
        setRankings(coreData);
        setDataSource(sourceIndicator);
      } else if (result?.success && Array.isArray(result.data)) {
        setRankings(result.data);
        setDataSource(result.source || "gemini");
      } else {
        setRankings(INITIAL_CROP_RANKINGS);
        setDataSource("static");
      }
    } catch (err) {
      console.error("Execution error routing parameters upstream:", err);
      setRankings(INITIAL_CROP_RANKINGS);
      setDataSource("static");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
          <Award className="h-6.5 w-6.5 text-[#31572c]" />
          <span>Crop Ranking Engine</span>
        </h1>
        <p className="text-gray-800 text-[11px] md:text-xs font-semibold tracking-normal mt-1">
          Enter your farm parameters and soil profile to run the agricultural
          neural model.
        </p>
      </div>

      <LocationSelector value={location} onChange={handleLocationChange} />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        {/* LEFT: Inputs Form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-5">
          <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-3 border-b border-gray-200">
            <Leaf className="h-4 w-4 text-[#4f772d]" />
            <span>Farm Inputs Matrix</span>
          </h2>

          <div className="space-y-4">
            {/* Rainfall Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-[#4f772d]" />
                  Annual Rainfall
                </label>
                <span className="text-[#31572c] font-black text-xs tracking-wide">
                  {rainfall} MM
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #31572c ${((rainfall - 100) / 1100) * 100}%, #e5e7eb ${((rainfall - 100) / 1100) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-700 mt-1 font-bold">
                <span>100mm</span>
                <span>1200mm</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-[#4f772d]" />
                  Avg. Temperature
                </label>
                <span className="text-[#31572c] font-black text-xs">
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #4f772d ${((temperature - 10) / 35) * 100}%, #e5e7eb ${((temperature - 10) / 35) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-700 mt-1 font-bold">
                <span>10°C</span>
                <span>45°C</span>
              </div>
            </div>

            {/* Soil Type */}
            <div>
              <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1.5 block">
                Soil Profile Type
              </label>
              <div className="relative">
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-700 pointer-events-none" />
              </div>
            </div>

            {/* Water Availability */}
            <div>
              <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1.5 block">
                Water Availability Index
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Low", "Medium", "High"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setWaterAvailability(level)}
                    className={`py-1.5 rounded-lg text-xs font-black transition-all border cursor-pointer ${
                      waterAvailability === level
                        ? "bg-[#31572c] text-white border-[#31572c] shadow-sm"
                        : "bg-white text-gray-800 border-gray-300 hover:border-[#31572c]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Land Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                  Land Cultivation Size
                </label>
                <span className="text-[#31572c] font-black text-xs">
                  {landArea} ACRES
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #31572c ${((landArea - 0.5) / 49.5) * 100}%, #e5e7eb ${((landArea - 0.5) / 49.5) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-700 mt-1 font-bold">
                <span>0.5 ac</span>
                <span>50 ac</span>
              </div>
            </div>

            {/* District */}
            <div>
              <label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#4f772d]" /> Target Region
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-700 pointer-events-none" />
              </div>
            </div>

            {/* Season Banner */}
            <div className="flex items-center justify-between bg-[#f4f7f4] border border-gray-200 rounded-xl px-3.5 py-2">
              <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#4f772d]" /> Season
              </span>
              <span className="text-[#31572c] font-black text-xs">
                {season}{" "}
                <span className="text-gray-700 font-bold text-[9px]">
                  (Auto)
                </span>
              </span>
            </div>

            {/* Priority Weights */}
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-[#31572c]" />
                <span>Priority Weights Setup</span>
              </h3>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                    Water Saving Priority
                  </label>
                  <span className="text-gray-950 font-black text-[10px]">
                    {waterWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded accent-[#31572c] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                    High ROI Priority
                  </label>
                  <span className="text-gray-950 font-black text-[10px]">
                    {roiWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={roiWeight}
                  onChange={(e) => setRoiWeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded accent-[#31572c] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                    Low Risk Priority
                  </label>
                  <span className="text-gray-950 font-black text-[10px]">
                    {riskWeight}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskWeight}
                  onChange={(e) => setRiskWeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded accent-[#31572c] cursor-pointer"
                />
              </div>
            </div>

            {/* Manual submission anchor */}
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={isLoading}
              className="w-full bg-[#31572c] text-white hover:bg-[#132a13] font-black py-2.5 px-4 rounded-xl shadow-sm transition-all uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Computing AI Model..." : "Recalculate Matrix"}
            </button>
          </div>
        </div>

        {/* RIGHT: Ranked Results */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h2 className="text-[#31572c] text-sm font-bold flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-[#4f772d]" />
                <span>Ranked Crop Scores — {district}</span>
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    dataSource === "local-agronomy-model" ||
                    dataSource === "gemini"
                      ? "bg-[#ecf39e] text-[#132a13] border-[#31572c]/20"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {dataSource === "local-agronomy-model" ||
                  dataSource === "gemini"
                    ? "AI Engine Connected"
                    : "Static Default"}
                </span>
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                  {rankings.length} Crops Loaded
                </span>
              </div>
            </div>

            <div
              className={`space-y-3.5 ${isLoading ? "opacity-40 pointer-events-none" : ""} transition-opacity duration-300`}
            >
              {rankings.map((crop) => (
                <div
                  key={crop.rank || crop.name}
                  className="bg-[#f4f7f4]/40 border border-gray-200 hover:border-[#90a955]/60 p-3 rounded-xl flex flex-col gap-2 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-[130px]">
                      <div
                        className={`h-7 w-7 rounded-lg border flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm ${getRankBadgeColor(crop.rank)}`}
                      >
                        {crop.rank}
                      </div>
                      <div>
                        <span className="text-gray-950 font-black text-xs block leading-tight">
                          {crop.name}
                        </span>
                        <span className="text-gray-800 font-extrabold text-[11px] tracking-wide block">
                          {crop.hindi}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mx-2 hidden sm:block">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(crop.score)}`}
                          style={{ width: `${crop.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[#132a13] font-black text-sm tabular-nums min-w-[28px] text-right">
                        {crop.score}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-900 font-bold italic flex items-center gap-1.5 leading-relaxed pl-9 border-l-2 border-gray-400">
                    <Sparkles className="h-3 w-3 text-[#4f772d] shrink-0" />
                    <span>{crop.explanation}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
              Model Suitability Index:
            </span>
            <div className="flex items-center gap-3">
              {[
                { label: "Excellent", color: "bg-[#132a13]" },
                { label: "Good", color: "bg-[#31572c]" },
                { label: "Fair", color: "bg-[#4f772d]" },
                { label: "Moderate", color: "bg-[#90a955]" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-[10px] font-black text-gray-800">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
