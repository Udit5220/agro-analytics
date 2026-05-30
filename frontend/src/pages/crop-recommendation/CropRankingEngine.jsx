import React, { useState } from 'react';
import { ChevronDown, RefreshCw, Award, Leaf, Droplets, Thermometer, MapPin, Calendar } from 'lucide-react';

// Static ranking data
const CROP_RANKINGS = [
  { rank: 1, name: 'Wheat', hindi: 'गेहूं', score: 92 },
  { rank: 2, name: 'Rice', hindi: 'चावल', score: 85 },
  { rank: 3, name: 'Maize', hindi: 'मक्का', score: 78 },
  { rank: 4, name: 'Soybean', hindi: 'सोयाबीन', score: 72 },
  { rank: 5, name: 'Cotton', hindi: 'कपास', score: 65 },
  { rank: 6, name: 'Groundnut', hindi: 'मूंगफली', score: 60 },
  { rank: 7, name: 'Mustard', hindi: 'सरसों', score: 55 },
  { rank: 8, name: 'Sugarcane', hindi: 'गन्ना', score: 48 },
  { rank: 9, name: 'Jowar', hindi: 'ज्वार', score: 42 },
];

const SOIL_TYPES = ['Sandy', 'Loamy', 'Clay', 'Silt', 'Peaty', 'Chalky', 'Alluvial'];
const DISTRICTS = ['Faridabad', 'Gurugram', 'Panipat', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Ambala'];

// Map score ranges to progressively lighter brand greens
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
  // Farm condition states
  const [rainfall, setRainfall] = useState(420);
  const [temperature, setTemperature] = useState(28);
  const [soilType, setSoilType] = useState('Loamy');
  const [waterAvailability, setWaterAvailability] = useState('Medium');
  const [landArea, setLandArea] = useState(5);
  const [district, setDistrict] = useState('Faridabad');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
          <Award className="h-6.5 w-6.5 text-[#31572c]" />
          <span>Crop Ranking Engine</span>
        </h1>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium tracking-normal mt-1">
          Enter your farm parameters and soil profile to run the agricultural neural model.
        </p>
      </div>

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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
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
              <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
                <span>100mm</span>
                <span>1200mm</span>
              </div>
            </div>

            {/* ─── Average Temperature Slider ─── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
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
              <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
                <span>10°C</span>
                <span>45°C</span>
              </div>
            </div>

            {/* ─── Soil Type Dropdown ─── */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ─── Water Availability Radio Buttons ─── */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Water Availability Index
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setWaterAvailability(level)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
                      waterAvailability === level
                        ? 'bg-[#31572c] text-white border-[#31572c] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#90a955] hover:text-[#31572c]'
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
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
              <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
                <span>0.5 ac</span>
                <span>50 ac</span>
              </div>
            </div>

            {/* ─── District Selector ─── */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ─── Season Auto Banner ─── */}
            <div className="flex items-center justify-between bg-[#f4f7f4] border border-gray-100 rounded-xl px-3.5 py-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#90a955]" />
                Season
              </span>
              <span className="text-[#31572c] font-extrabold text-xs">
                Kharif <span className="text-gray-400 font-medium text-[9px]">(Auto)</span>
              </span>
            </div>

            {/* ─── Recalculate Trigger ─── */}
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={isCalculating}
              className="w-full bg-[#31572c] text-white hover:bg-[#132a13] font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-3"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
              {isCalculating ? 'Computing Models...' : 'Recalculate Matrix'}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* RIGHT COLUMN: Ranked Results Scoreboard    */}
        {/* ═══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between">
          
          <div>
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-[#31572c] text-sm font-bold flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-[#4f772d]" />
                <span>Ranked Crop Scores — {district}</span>
              </h2>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                {CROP_RANKINGS.length} Crops Scored
              </span>
            </div>

            {/* Ranking List */}
            <div className={`space-y-2 ${isCalculating ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-300`}>
              {CROP_RANKINGS.map((crop) => (
                <div
                  key={crop.rank}
                  className="bg-[#f4f7f4]/30 border border-gray-100 hover:border-[#90a955]/30 p-2.5 rounded-xl flex items-center justify-between gap-4 hover:shadow-sm transition-all duration-200 group"
                >
                  {/* Left: Rank Badge + Crop Name */}
                  <div className="flex items-center gap-2.5 min-w-[130px]">
                    <div className={`h-7 w-7 rounded-lg border flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm ${getRankBadgeColor(crop.rank)}`}>
                      {crop.rank}
                    </div>
                    <div>
                      <span className="text-gray-900 font-bold text-xs block leading-tight">
                        {crop.name}
                      </span>
                      <span className="text-gray-400 font-bold text-[10px] tracking-wide block">
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
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#31572c] transition-colors duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Model Suitability index:</span>
            <div className="flex items-center gap-3">
              {[
                { label: 'Excellent', color: 'bg-[#132a13]' },
                { label: 'Good', color: 'bg-[#31572c]' },
                { label: 'Fair', color: 'bg-[#4f772d]' },
                { label: 'Moderate', color: 'bg-[#90a955]' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-[9px] font-bold text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
