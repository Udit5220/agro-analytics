import React, { useState } from 'react';
import { ChevronDown, RefreshCw, Award, Leaf, Droplets, Thermometer, MapPin, Calendar, Scale, Sparkles } from 'lucide-react';
import { getCropRankings } from '../../services/geminiService';
import LocationSelector from '../../components/LocationSelector';
import { getSoilDataByPincode } from '../../services/locationService';
import { weatherApi } from '../../services/apiService';

const SOIL_TYPES = ['Sandy', 'Loamy', 'Clay', 'Silt', 'Peaty', 'Chalky', 'Alluvial'];
const DISTRICTS = ['Faridabad', 'Gurugram', 'Panipat', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Ambala'];

const INITIAL_CROP_RANKINGS = [
  { rank: 1, name: 'Wheat', hindi: 'गेहूं', score: 92, explanation: 'Excellent organic soil profile match and cold winter climate indices.' },
  { rank: 2, name: 'Rice', hindi: 'चावल', score: 85, explanation: 'Highly compatible water retention clay matrix matches rainfall onset.' },
  { rank: 3, name: 'Maize', hindi: 'मक्का', score: 78, explanation: 'Balanced soil pH and moisture parameters favor organic yield metrics.' },
  { rank: 4, name: 'Sugarcane', hindi: 'गन्ना', score: 72, explanation: 'Strong market price support makes it highly profitable long term.' },
  { rank: 5, name: 'Cotton', hindi: 'कपास', score: 65, explanation: 'Drought-tolerant deep root system handles moisture fluctuations.' },
  { rank: 6, name: 'Mustard', hindi: 'सरसों', score: 60, explanation: 'Low water requirement matches medium sandy-loam properties.' },
  { rank: 7, name: 'Bajra', hindi: 'बाजरा', score: 55, explanation: 'Extremely resilient to high soil temperatures and drought indexes.' },
  { rank: 8, name: 'Moong', hindi: 'मूंग', score: 48, explanation: 'Foliar growth stage helps in natural nitrogen fixation cycles.' },
  { rank: 9, name: 'Sunflower', hindi: 'सूरजमुखी', score: 42, explanation: 'Moderate yields can be optimized with extra potassium inputs.' }
];

function getBarColor(score) {
  if (score >= 85) return 'bg-[#132a13]';
  if (score >= 75) return 'bg-[#31572c]';
  if (score >= 60) return 'bg-[#4f772d]';
  if (score >= 50) return 'bg-[#90a955]';
  return 'bg-[#90a955]/60';
}

function getRankBadgeColor(rank) {
  if (rank === 1) return 'bg-[#132a13] text-[#ecf39e] border-[#31572c]';
  if (rank === 2) return 'bg-[#31572c] text-[#ecf39e] border-[#4f772d]';
  if (rank === 3) return 'bg-[#4f772d] text-white border-[#90a955]';
  return 'bg-[#f4f7f4] text-[#31572c] border-gray-200';
}

export default function CropRankingEngine() {
  // Agricultural Field Selector coordinate matrices
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

  // Farm condition states
  const [rainfall, setRainfall] = useState(420);
  const [temperature, setTemperature] = useState(28);
  const [soilType, setSoilType] = useState('Loamy');
  const [waterAvailability, setWaterAvailability] = useState('Medium');
  const [landArea, setLandArea] = useState(5);
  const [district, setDistrict] = useState('Faridabad');
  
  // Custom slider priorities state
  const [waterWeight, setWaterWeight] = useState(50);
  const [roiWeight, setRoiWeight] = useState(50);
  const [riskWeight, setRiskWeight] = useState(50);

  // Dynamic ranking output states
  const [rankings, setRankings] = useState(INITIAL_CROP_RANKINGS);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (newLocation) => {
    if (
      newLocation.district !== location.district ||
      newLocation.state !== location.state ||
      newLocation.pincode !== location.pincode
    ) {
      setLocation(newLocation);
    }
  };

  // Synchronize agricultural inputs automatically on farm plot selection
  React.useEffect(() => {
    let active = true;

    if (location.district) {
      setDistrict(location.district);
    }
    if (location.soilData && location.soilData.soilType) {
      const matched = SOIL_TYPES.find(
        (s) => s.toLowerCase() === location.soilData.soilType.toLowerCase()
      );
      if (matched) {
        setSoilType(matched);
      } else {
        if (location.soilData.soilType.toLowerCase().includes('clay')) {
          setSoilType('Clay');
        } else if (location.soilData.soilType.toLowerCase().includes('loam')) {
          setSoilType('Loamy');
        } else {
          setSoilType('Loamy');
        }
      }
    }

    // Fetch proximity weather telemetry to auto-snap Rainfall & Temperature sliders
    const syncWeatherSensors = async () => {
      try {
        const res = await weatherApi.getCurrentWeather(
          location.district,
          location.latitude,
          location.longitude
        );
        if (res && res.success && res.data && active) {
          const temp = res.data.currentTemp;
          // Scale expected daily rainfall to annual MM scale for slider compatibility
          const rain = Math.max(100, Math.min(1200, Math.round((res.data.expectedRainfall || 12) * 20)));

          setTemperature(temp);
          setRainfall(rain);
          console.log(`[Ranking Engine] Auto-snapped sliders: Temp=${temp}°C, Rainfall=${rain}MM`);
        }
      } catch (err) {
        console.warn("[Ranking Engine] Failed to snap sliders to live weather:", err.message);
      }
    };

    syncWeatherSensors();

    return () => {
      active = false;
    };
  }, [location]);

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
        riskWeight
      );
      setRankings(result);
    } catch (err) {
      console.error("Failed to run Gemini Ranking analysis:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically recalculate with a premium 450ms debounce when sliders are dragged or dropdowns modify
  React.useEffect(() => {
    let active = true;
    
    const delayTimer = setTimeout(async () => {
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
          riskWeight
        );
        if (active) {
          setRankings(result);
        }
      } catch (err) {
        console.error("Failed to run Gemini Ranking analysis:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
  }, [district, soilType, rainfall, temperature, waterAvailability, landArea, waterWeight, roiWeight, riskWeight]);

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
          <Award className="h-6.5 w-6.5 text-[#31572c]" />
          <span>Crop Ranking Engine</span>
        </h1>
        <p className="text-gray-600 text-[11px] md:text-xs font-medium tracking-normal mt-1">
          Enter your farm parameters and soil profile to run the agricultural neural model.
        </p>
      </div>

      {/* 2-Section Compound Field Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">

        {/* ═══════════════════════════════════════════ */}
        {/* LEFT COLUMN: Farm Conditions Form Panel    */}
        {/* ═══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-5">
          
          {/* Form Title */}
          <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-3 border-b border-gray-100">
            <Leaf className="h-4 w-4 text-[#4f772d]" />
            <span>Farm Inputs Matrix</span>
          </h2>

          <div className="space-y-4">

            {/* ─── Annual Rainfall Slider ─── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-[#90a955]" />
                  Annual Rainfall
                </label>
                <span className="text-[#31572c] font-bold text-xs tracking-wide">{rainfall} MM</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #31572c ${((rainfall - 100) / 1100) * 100}%, #f3f4f6 ${((rainfall - 100) / 1100) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-medium">
                <span>100mm</span>
                <span>1200mm</span>
              </div>
            </div>

            {/* ─── Average Temperature Slider ─── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Thermometer className="h-3.5 w-3.5 text-[#90a955]" />
                  Avg. Temperature
                </label>
                <span className="text-[#31572c] font-bold text-xs">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #4f772d ${((temperature - 10) / 35) * 100}%, #f3f4f6 ${((temperature - 10) / 35) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-medium">
                <span>10°C</span>
                <span>45°C</span>
              </div>
            </div>

            {/* ─── Soil Type Dropdown ─── */}
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Soil Profile Type
              </label>
              <div className="relative">
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full appearance-none bg-[#f4f7f4] border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] transition-all duration-200 cursor-pointer"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* ─── Water Availability Radio Buttons ─── */}
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Water Availability Index
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setWaterAvailability(level)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border cursor-pointer ${
                      waterAvailability === level
                        ? 'bg-[#31572c] text-white border-[#31572c] shadow-sm'
                        : 'bg-white text-gray-750 border-gray-200 hover:border-[#90a955] hover:text-[#31572c]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Land Area Slider ─── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Land Cultivation Size
                </label>
                <span className="text-[#31572c] font-bold text-xs">{landArea} ACRES</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #31572c ${((landArea - 0.5) / 49.5) * 100}%, #f3f4f6 ${((landArea - 0.5) / 49.5) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[9px] text-gray-500 mt-1 font-medium">
                <span>0.5 ac</span>
                <span>50 ac</span>
              </div>
            </div>

            {/* ─── District Selector ─── */}
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#90a955]" />
                Target Region
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full appearance-none bg-[#f4f7f4] border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] transition-all duration-200 cursor-pointer"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* ─── Target Season Auto Banner ─── */}
            <div className="flex items-center justify-between bg-[#f4f7f4] border border-gray-100 rounded-xl px-3.5 py-2">
              <span className="text-[10px] font-bold text-gray-650 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#90a955]" />
                Season
              </span>
              <span className="text-[#31572c] font-extrabold text-xs">
                Kharif <span className="text-gray-500 font-medium text-[9px]">(Auto)</span>
              </span>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* WEIGHT PRIORITY SLIDERS                    */}
            {/* ═══════════════════════════════════════════ */}
            <div className="border-t border-gray-150 pt-4 space-y-4">
              <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-[#31572c]" />
                <span>Priority Weights Setup</span>
              </h3>

              {/* Water Saving weight */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Water Saving Priority</label>
                  <span className="text-gray-900 font-bold text-[10px]">{waterWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded accent-[#31572c] cursor-pointer"
                />
              </div>

              {/* High ROI weight */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">High ROI Priority</label>
                  <span className="text-gray-900 font-bold text-[10px]">{roiWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={roiWeight}
                  onChange={(e) => setRoiWeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded accent-[#31572c] cursor-pointer"
                />
              </div>

              {/* Low Risk weight */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">Low Risk Priority</label>
                  <span className="text-gray-900 font-bold text-[10px]">{riskWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskWeight}
                  onChange={(e) => setRiskWeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded accent-[#31572c] cursor-pointer"
                />
              </div>
            </div>

            {/* ─── Recalculate Trigger ─── */}
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={isLoading}
              className="w-full bg-[#31572c] text-white hover:bg-[#132a13] font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-3"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Computing AI Model...' : 'Recalculate Matrix'}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* RIGHT COLUMN: Ranked Results Scoreboard    */}
        {/* ═══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between min-h-[500px]">
          
          <div>
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-[#31572c] text-sm font-bold flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-[#4f772d]" />
                <span>Ranked Crop Scores — {district}</span>
              </h2>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                {rankings.length} Crops Scored
              </span>
            </div>

            {/* Ranking List */}
            <div className={`space-y-3.5 ${isLoading ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-300`}>
              {rankings.map((crop) => (
                <div
                  key={crop.rank || crop.name}
                  className="bg-[#f4f7f4]/30 border border-gray-100 hover:border-[#90a955]/30 p-3 rounded-xl flex flex-col gap-2 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Rank Badge + Crop Name */}
                    <div className="flex items-center gap-2.5 min-w-[130px]">
                      <div className={`h-7 w-7 rounded-lg border flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm ${getRankBadgeColor(crop.rank)}`}>
                        {crop.rank}
                      </div>
                      <div>
                        <span className="text-gray-900 font-bold text-xs block leading-tight">
                          {crop.name}
                        </span>
                        <span className="text-gray-500 font-bold text-[10px] tracking-wide block">
                          {crop.hindi}
                        </span>
                      </div>
                    </div>

                    {/* Center: Dynamic Score Bar */}
                    <div className="flex-1 mx-2 hidden sm:block">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(crop.score)}`}
                          style={{ width: `${crop.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Right: Score indicator */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[#132a13] font-extrabold text-sm tabular-nums min-w-[28px] text-right">
                        {crop.score}%
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Explanation Text below each crop progress bar */}
                  <p className="text-[10px] text-gray-600 font-semibold italic flex items-center gap-1 leading-relaxed pl-9 border-l border-gray-300">
                    <Sparkles className="h-3 w-3 text-[#90a955] shrink-0" />
                    <span>{crop.explanation}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Model Suitability index:</span>
            <div className="flex items-center gap-3">
              {[
                { label: 'Excellent', color: 'bg-[#132a13]' },
                { label: 'Good', color: 'bg-[#31572c]' },
                { label: 'Fair', color: 'bg-[#4f772d]' },
                { label: 'Moderate', color: 'bg-[#90a955]' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-[9px] font-bold text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
