<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { dashboardContent } from '../../content/dashboardContent';
import LocationSelector from '../../components/LocationSelector';
import { getSoilDataByPincode, getLocationByGPS } from '../../services/locationService';
import { getCropRecommendations } from '../../services/geminiService';

export default function CropRecommendationDashboard() {
  const [location, setLocation] = useState({
    state: 'Haryana',
    district: 'Faridabad',
    pincode: '121001',
    soilData: getSoilDataByPincode('121001')
  });
=======
import React from "react";
import bannerImg from "../../assets/images/Smart Crop Recommendation.png";
import * as LucideIcons from "lucide-react";
import { dashboardContent } from "../../content/dashboardContent";

export default function CropRecommendationDashboard() {
  const { cropRecommendationData } = dashboardContent;
  const { detectedBanner, recommendedCrops, weatherSummary } =
    cropRecommendationData;
>>>>>>> 1165e29e31b1345a1a360a4f26bb75647806ae2f

  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  // Re-fetch crop recommendations when location variables change
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadRecommendations = async () => {
      const result = await getCropRecommendations(
        location.district, 
        location.state, 
        'Kharif'
      );
      if (active) {
        setDashData(result);
        setLoading(false);
      }
    };

    loadRecommendations();

    return () => {
      active = false;
    };
  }, [location.district, location.state]);

  const handleLocationChange = (newLocation) => {
    // Only update if district, state, or pincode actually changed value to avoid redundant renders
    if (
      newLocation.district !== location.district || 
      newLocation.state !== location.state ||
      newLocation.pincode !== location.pincode
    ) {
      setLocation(newLocation);
    }
  };

  // Trigger geolocation detection and synchronize in the dashboard state
  const handleFetchLocation = async () => {
    setIsDetecting(true);
    try {
      const geo = await getLocationByGPS();
      const freshSoil = getSoilDataByPincode(geo.pincode);
      setLocation({
        state: geo.state,
        district: geo.district,
        pincode: geo.pincode,
        soilData: freshSoil
      });
    } catch (err) {
      alert(err.message || 'Unable to detect location. Using default.');
    } finally {
      setIsDetecting(false);
    }
  };

  // Bind references dynamically from loaded API/fallback response
  const dataLayer = dashData || {
    recommendedCrops: [],
    weatherSummary: {},
    detectedBanner: {}
  };

  const sortedCrops = [...dataLayer.recommendedCrops].sort((a, b) => b.matchScore - a.matchScore);

  return (
<<<<<<< HEAD
    <div className="space-y-8 animate-fadeIn antialiased">
      
      {/* 1. HEADER DESCRIPTION WITH GENERIC DISTRICT PICKER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <span>Crop Recommendation Dashboard</span>
            <span className="text-[#132a13] font-bold text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
              फसल अनुशंसा
            </span>
          </h1>
          <p className="text-gray-550 text-[11px] md:text-xs tracking-normal mt-1 font-medium font-sans">
            AI-powered recommendations for your farm based on real-time soil chemistry and weather models.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Sync Trigger / Fetch Location Data Action Button */}
          <button 
            onClick={handleFetchLocation}
            disabled={isDetecting}
            className="flex items-center space-x-1.5 text-[11px] font-bold tracking-wider uppercase border border-[#90a955]/30 bg-white rounded-xl px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors text-gray-700 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDetecting ? (
              <>
                <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c]" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <LucideIcons.RefreshCw className="h-3.5 w-3.5 text-[#31572c]" />
                <span>Fetch Location Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: Location Selector Card (Always mounted to prevent unmount infinite loops) */}
      <LocationSelector value={location} onChange={handleLocationChange} />
=======
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f4f7f4] to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 w-full md:w-2/3 flex justify-between items-center pr-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
              <span>Crop Recommendation Dashboard</span>
              <span className="text-[#132a13] font-bold text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
                फसल अनुशंसा
              </span>
            </h1>
            <p className="text-gray-500 text-[11px] md:text-xs tracking-normal mt-1 font-medium">
              AI-powered recommendations for your farm based on real-time soil
              chemistry and weather models.
            </p>
          </div>

          {/* Sync Trigger Icon */}
          <button className="self-start md:self-auto flex items-center space-x-1.5 text-[11px] font-bold tracking-wider uppercase border border-gray-200 bg-white rounded-lg px-3 py-1.5 shadow-sm hover:bg-gray-50 transition-colors text-gray-700 active:scale-[0.98]">
            <LucideIcons.RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Soil Data</span>
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 opacity-20 md:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10 md:hidden" />
          <img
            src={bannerImg}
            alt="Banner"
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>

      {/* 2. AUTO-DETECTED BANNER — Light-Tint Premium Canvas */}
      <div className="w-full bg-[#4f772d]/[0.08] border border-[#4f772d]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1 transition-all">
        <div className="flex items-start gap-4">
          {/* Left Icon Panel */}
          <div className="p-3 bg-white rounded-xl border border-[#4f772d]/20 text-[#31572c] shadow-sm shrink-0">
            <LucideIcons.CloudRainWind className="h-5 w-5" />
          </div>
>>>>>>> 1165e29e31b1345a1a360a4f26bb75647806ae2f

      {/* SECTION 2: Season Notification Strip */}
      {loading ? (
        <div className="h-24 bg-gray-100 border border-gray-200/50 rounded-2xl w-full animate-pulse flex items-center justify-center text-xs font-bold text-gray-400">
          Loading season data...
        </div>
      ) : (
        <div className="w-full bg-[#4f772d]/[0.08] border border-[#4f772d]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
          <div className="flex items-start gap-4">
            {/* Left Icon Panel */}
            <div className="p-3 bg-white rounded-xl border border-[#4f772d]/20 text-[#31572c] shadow-sm shrink-0">
              <LucideIcons.CloudRainWind className="h-5 w-5" />
            </div>
<<<<<<< HEAD

            {/* Typography Content */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#132a13] font-bold text-xs tracking-wide">
                  {dataLayer.detectedBanner.titleHindi || "खरीफ मौसम"}
                </span>
                <span className="bg-[#132a13] text-[#ecf39e] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                  {dataLayer.detectedBanner.badgeText || "Auto-detected"}
                </span>
=======

            <h2 className="text-[#132a13] font-extrabold text-base md:text-lg mt-1 flex items-center gap-1.5">
              {detectedBanner.titleEnglish}{" "}
              <span className="text-gray-400 font-light">•</span>{" "}
              <span className="text-gray-700 text-sm font-medium">
                {detectedBanner.location}
              </span>
            </h2>

            <p className="text-gray-600 text-xs font-medium mt-0.5">
              {detectedBanner.details}
            </p>
          </div>
        </div>

        {/* Right: Telemetry Active Indicator */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm self-start md:self-auto text-xs font-bold text-[#132a13]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Telemetry Active
        </div>
      </div>

      {/* 3. TOP RECOMMENDED CROPS CARDS GRID */}
      <div>
        <h2 className="text-[#31572c] font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 mb-4">
          <LucideIcons.Sparkles className="h-4 w-4 text-[#31572c]" />
          <span>Top Matches for Selected Soil Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCrops.map((crop) => {
            // Circle parameters
            const { circumference, offset, radius, strokeWidth } =
              getCircleStrokeProps(crop.matchScore);

            return (
              <div
                key={crop.id}
                className={`relative bg-white border ${
                  crop.isBestMatch
                    ? "border-[#4f772d]/40 shadow-xl"
                    : "border-gray-200/60"
                } rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 mt-4`}
              >
                {/* Recommended Top Tag */}
                {crop.isBestMatch && (
                  <div className="absolute -top-3.5 left-6 bg-[#132a13] text-[#ecf39e] text-[10px] font-bold tracking-widest px-3 py-1 rounded-md uppercase z-10 shadow-sm animate-fadeIn">
                    RECOMMENDED
                  </div>
                )}

                <div>
                  {/* Top info and Circular Progress Ring */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <h3 className="text-lg font-extrabold text-gray-900">
                          {crop.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#4f772d] mt-0.5 block">
                        {crop.hindiName}
                      </span>
                    </div>

                    {/* SVG CIRCULAR MATCH INDEX */}
                    <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                      <svg className="transform -rotate-90 w-full h-full">
                        {/* Background track circle */}
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          fill="transparent"
                          stroke="currentColor"
                          className="text-slate-100"
                          strokeWidth={strokeWidth}
                        />
                        {/* Dynamic score outline circle */}
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          fill="transparent"
                          stroke="currentColor"
                          className={
                            crop.isBestMatch
                              ? "text-[#31572c]"
                              : "text-[#90a955]"
                          }
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percent Tag centered */}
                      <span className="absolute text-[10px] font-black text-gray-800">
                        {crop.matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Crop Description (Typography update - Slate 600 -> Slate 700) */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-5">
                    {crop.details}
                  </p>

                  {/* Primary Parameters */}
                  <div className="space-y-3 border-t border-gray-100 pt-4 mb-5">
                    {/* Parameter: Yield */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium flex items-center gap-1.5">
                        <LucideIcons.Wheat className="h-4 w-4 text-[#90a955]" />{" "}
                        Yield Prediction
                      </span>
                      <span className="font-bold text-gray-800">
                        {crop.estimatedYield}
                      </span>
                    </div>

                    {/* Parameter: ROI */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium flex items-center gap-1.5">
                        <LucideIcons.Coins className="h-4 w-4 text-[#90a955]" />{" "}
                        Estimated Profit
                      </span>
                      <span className="font-semibold text-emerald-700">
                        {crop.roiEstimate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer: Risk Badge and Navigation Link */}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                      crop.riskLevel === "Low Risk"
                        ? "bg-emerald-100 text-emerald-950 border border-emerald-200"
                        : "bg-amber-100 text-amber-950 border border-amber-200"
                    }`}
                  >
                    {crop.riskLevel}
                  </span>

                  <a
                    href="#details"
                    className="text-[#31572c] hover:text-[#132a13] font-bold text-xs uppercase flex items-center gap-1 transition-colors duration-200"
                  >
                    <span>View Recipe &rarr;</span>
                  </a>
                </div>
>>>>>>> 1165e29e31b1345a1a360a4f26bb75647806ae2f
              </div>
              
              <h2 className="text-[#132a13] font-extrabold text-base md:text-lg mt-1 flex items-center gap-1.5">
                {dataLayer.detectedBanner.titleEnglish || "Kharif Season Detected"}{' '}
                <span className="text-gray-400 font-light">•</span>{' '}
                <span className="text-gray-700 text-sm font-medium">
                  {location.district}, {location.state} {location.pincode ? `(${location.pincode})` : ''}
                </span>
              </h2>
              
              <p className="text-gray-600 text-xs font-medium mt-0.5">
                {dataLayer.detectedBanner.details || "Based on climate data in Haryana."}
              </p>
            </div>
          </div>

          {/* Right: Telemetry Active Indicator */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm self-start md:self-auto text-xs font-bold text-[#132a13]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Telemetry Active
          </div>
        </div>
<<<<<<< HEAD
      )}

      {/* SECTION 3: Weather Summary Card */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
          <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
          <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
          <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
            <LucideIcons.CloudSun className="h-5 w-5 text-[#4f772d]" />
            <span>Weather Sensor Array Summary</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Temperature */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
              <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
                <LucideIcons.Thermometer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Temperature</p>
                <h4 className="text-lg font-black text-gray-800 mt-0.5">{dataLayer.weatherSummary.temperature}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{dataLayer.weatherSummary.temperatureSub || "Optimal Soil Temp"}</p>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
              <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                <LucideIcons.Droplet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Humidity</p>
                <h4 className="text-lg font-black text-gray-800 mt-0.5">{dataLayer.weatherSummary.humidity}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{dataLayer.weatherSummary.humiditySub || "Adequate Moisture"}</p>
              </div>
            </div>

            {/* Rainfall */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <LucideIcons.CloudRain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Rainfall</p>
                <h4 className="text-lg font-black text-gray-800 mt-0.5">{dataLayer.weatherSummary.rainfall}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{dataLayer.weatherSummary.rainfallSub || "Mild showers forecast"}</p>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <LucideIcons.Wind className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Wind Speed</p>
                <h4 className="text-lg font-black text-gray-800 mt-0.5">{dataLayer.weatherSummary.windSpeed}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{dataLayer.weatherSummary.windSpeedSub || "Gentle wind"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Soil Health Profile Matrix Card (Renders instantly using local soil classification) */}
      {location.soilData && (
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-[#31572c]/10 rounded-xl text-[#31572c]">
                <LucideIcons.Sprout className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  Soil Health Profile Matrix
                  <span className="text-gray-400 font-medium lowercase text-xs tracking-normal">
                    (मृदा स्वास्थ्य प्रोफाइल)
                  </span>
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                  Resolved chemical telemetry for selection
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-[#4f772d]/[0.05] px-2.5 py-1 rounded-lg border border-[#90a955]/20">
              <LucideIcons.Activity className="h-3 w-3 text-[#31572c]" />
              ICAR Bhumi Standard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Soil Classification Card */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Soil Classification
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <LucideIcons.Layers className="h-5 w-5 text-[#4f772d] shrink-0" />
                <p className="text-xs font-black text-gray-800 leading-tight">
                  {location.soilData.soilType}
                </p>
              </div>
              <p className="text-[10px] font-medium text-gray-400 mt-2.5 italic leading-relaxed">
                Ideal physical composition for moisture holding and capillary action.
              </p>
            </div>

            {/* pH Balance Index Card */}
            {(() => {
              const phVal = location.soilData.pH;
              let phStatus = { label: 'Optimal Neutral', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
              if (phVal < 6.0) phStatus = { label: 'Acidic / अम्लीय', color: 'text-amber-600 bg-amber-50 border-amber-200' };
              else if (phVal > 7.5) phStatus = { label: 'Alkaline / क्षारीय', color: 'text-sky-600 bg-sky-50 border-sky-200' };
              else phStatus = { label: 'Optimal Neutral / अनुकूल उदासीन', color: 'text-[#31572c] bg-emerald-55 border-emerald-200' };

              return (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      pH Balance Index
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${phStatus.color}`}>
                      {phVal} pH
                    </span>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-400 via-emerald-500 to-sky-400 relative">
                      <div 
                        className="absolute -top-1 h-4 w-1.5 rounded bg-black border border-white shadow-md transform -translate-x-1/2 transition-all duration-500"
                        style={{ left: `${((phVal - 5) / 4) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-1">
                      <span>Acidic (5.0)</span>
                      <span>Neut (7.0)</span>
                      <span>Alk (9.0)</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-600 mt-1">
                    Status: <span className="text-gray-900">{phStatus.label}</span>
                  </p>
                </div>
              );
            })()}

            {/* Nitrogen Card */}
            {(() => {
              const nVal = location.soilData.nitrogen;
              const ratio = nVal / 450;
              let nStatus = { label: 'High / प्रचुर', color: 'bg-emerald-50 text-[#31572c] border-emerald-200', width: 'w-full bg-[#31572c]' };
              if (ratio < 0.4) nStatus = { label: 'Low / कम', color: 'bg-red-50 text-red-655 border-red-200', width: 'w-1/3 bg-red-500' };
              else if (ratio < 0.75) nStatus = { label: 'Medium / मध्यम', color: 'bg-amber-50 text-amber-600 border border-amber-200', width: 'w-2/3 bg-amber-500' };

              return (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nitrogen (N)</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${nStatus.color}`}>
                      {nStatus.label}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-gray-900">{nVal}</span>
                    <span className="text-[10px] font-bold text-gray-400">kg/ha</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${nStatus.width}`} />
                  </div>
                </div>
              );
            })()}

            {/* Phosphorus Card */}
            {(() => {
              const pVal = location.soilData.phosphorus;
              const ratio = pVal / 45;
              let pStatus = { label: 'High / प्रचुर', color: 'bg-emerald-50 text-[#31572c] border-emerald-200', width: 'w-full bg-[#31572c]' };
              if (ratio < 0.4) pStatus = { label: 'Low / कम', color: 'bg-red-50 text-red-655 border-red-200', width: 'w-1/3 bg-red-500' };
              else if (ratio < 0.75) pStatus = { label: 'Medium / मध्यम', color: 'bg-amber-50 text-amber-600 border border-amber-200', width: 'w-2/3 bg-amber-500' };

              return (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition-all duration-300 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phosphorus (P)</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${pStatus.color}`}>
                      {pStatus.label}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-gray-900">{pVal}</span>
                    <span className="text-[10px] font-bold text-gray-400">kg/ha</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${pStatus.width}`} />
                  </div>
                </div>
              );
            })()}
          </div>

          <p className="text-[9px] font-medium text-gray-400 text-right leading-none italic">
            * Dynamic parameters represent estimated organic carbon and soil profiles. Future updates will hook directly to the ICAR Bhumi API.
          </p>
        </div>
      )}

      {/* SECTION 5: Top Recommended Crops Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 bg-gray-150 rounded-2xl"></div>
          <div className="h-64 bg-gray-150 rounded-2xl"></div>
          <div className="h-64 bg-gray-150 rounded-2xl"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-[#31572c] font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 mb-4">
            <LucideIcons.Sparkles className="h-4 w-4 text-[#31572c]" />
            <span>Top Matches for Selected Soil Matrix</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCrops.map((crop) => {
              const isBestMatch = crop.isBestMatch === true || crop.isBestMatch === "true";
              
              return (
                <div
                  key={crop.id || crop.name}
                  className={`relative bg-white border ${
                    isBestMatch 
                      ? 'border-[#4f772d]/40 shadow-xl' 
                      : 'border-gray-200/60'
                  } rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 mt-4`}
                >
                  {/* Recommended Top Tag */}
                  {isBestMatch && (
                    <div className="absolute -top-3.5 left-6 bg-[#132a13] text-[#ecf39e] text-[10px] font-bold tracking-widest px-3 py-1 rounded-md uppercase z-10 shadow-sm animate-fadeIn">
                      RECOMMENDED
                    </div>
                  )}

                  <div>
                    
                    {/* Top info and Circular Progress Ring */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <h3 className="text-lg font-extrabold text-gray-900">
                            {crop.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[#4f772d] mt-0.5 block">
                          {crop.hindiName || "फसल"}
                        </span>
                      </div>

                      {/* SVG CIRCULAR MATCH INDEX WITH DYNAMIC strokeDasharray FORMULA */}
                      <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                        <svg className="transform -rotate-90 w-full h-full">
                          {/* Background track circle */}
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="transparent"
                            stroke="currentColor"
                            className="text-slate-100"
                            strokeWidth="4.5"
                          />
                          {/* Dynamic score outline circle */}
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="transparent"
                            stroke="currentColor"
                            className={isBestMatch ? 'text-[#31572c]' : 'text-[#90a955]'}
                            strokeWidth="4.5"
                            pathLength="100"
                            strokeDasharray={`${crop.matchScore || 50}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        {/* Percent Tag centered */}
                        <span className="absolute text-[10px] font-black text-gray-800">
                          {crop.matchScore || 50}%
                        </span>
                      </div>
                    </div>

                    {/* Crop Description */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-5">
                      {crop.details || "Ideal conditions match standard agricultural indices."}
                    </p>

                    {/* Primary Parameters */}
                    <div className="space-y-3 border-t border-gray-100 pt-4 mb-5">
                      
                      {/* Parameter: Yield */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium flex items-center gap-1.5 font-sans">
                          <LucideIcons.Wheat className="h-4 w-4 text-[#90a955]" /> Yield Prediction
                        </span>
                        <span className="font-bold text-gray-800">{crop.estimatedYield || crop.yieldPrediction}</span>
                      </div>
                      
                      {/* Parameter: ROI */}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium flex items-center gap-1.5 font-sans">
                          <LucideIcons.Coins className="h-4 w-4 text-[#90a955]" /> Estimated Profit / ROI
                        </span>
                        <span className="font-semibold text-emerald-700">{crop.roiEstimate || crop.roi}</span>
                      </div>

                    </div>

                  </div>

                  {/* Bottom Footer: Risk Badge and Navigation Link */}
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                      (crop.riskLevel || crop.risk) === 'Low Risk' 
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-950 border border-amber-200'
                    }`}>
                      {crop.riskLevel || crop.risk}
                    </span>
                    
                    <a
                      href="#details"
                      className="text-[#31572c] hover:text-[#132a13] font-bold text-xs uppercase flex items-center gap-1 transition-colors duration-200"
                    >
                      <span>View Recipe &rarr;</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

=======
      </div>

      {/* 4. WEATHER SUMMARY ROW */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        {/* Weather Title */}
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
          <LucideIcons.CloudSun className="h-5 w-5 text-[#4f772d]" />
          <span>Weather Sensor Array Summary</span>
        </h3>

        {/* 4 Weather parameters panels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
              <LucideIcons.Thermometer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Temperature</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">
                {weatherSummary.temperature}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {weatherSummary.temperatureSub}
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <LucideIcons.Droplet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Humidity</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">
                {weatherSummary.humidity}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {weatherSummary.humiditySub}
              </p>
            </div>
          </div>

          {/* Rainfall */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <LucideIcons.CloudRain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Rainfall</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">
                {weatherSummary.rainfall}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {weatherSummary.rainfallSub}
              </p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <LucideIcons.Wind className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Wind Speed</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">
                {weatherSummary.windSpeed}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {weatherSummary.windSpeedSub}
              </p>
            </div>
          </div>
        </div>
      </div>
>>>>>>> 1165e29e31b1345a1a360a4f26bb75647806ae2f
    </div>
  );
}
