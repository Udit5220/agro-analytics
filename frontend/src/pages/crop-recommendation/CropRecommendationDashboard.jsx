import React from 'react';
import * as LucideIcons from 'lucide-react';
import { dashboardContent } from '../../content/dashboardContent';

export default function CropRecommendationDashboard() {
  const { cropRecommendationData } = dashboardContent;
  const { detectedBanner, recommendedCrops, weatherSummary } = cropRecommendationData;

  // Function to calculate SVG stroke-dashoffset for clean match score rendering
  const getCircleStrokeProps = (score) => {
    const radius = 24;
    const strokeWidth = 4.5;
    const circumference = 2 * Math.PI * radius; // Approx 150.8
    const offset = circumference - (score / 100) * circumference;
    return { circumference, offset, radius, strokeWidth };
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. HEADER DESCRIPTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <span>Crop Recommendation Dashboard</span>
            <span className="text-[#132a13] font-bold text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
              फसल अनुशंसा
            </span>
          </h1>
          <p className="text-gray-500 text-[11px] md:text-xs tracking-normal mt-1 font-medium">
            AI-powered recommendations for your farm based on real-time soil chemistry and weather models.
          </p>
        </div>

        {/* Sync Trigger Icon */}
        <button className="self-start md:self-auto flex items-center space-x-1.5 text-[11px] font-bold tracking-wider uppercase border border-gray-200 bg-white rounded-lg px-3 py-1.5 shadow-sm hover:bg-gray-50 transition-colors text-gray-700 active:scale-[0.98]">
          <LucideIcons.RefreshCw className="h-3.5 w-3.5" />
          <span>Sync Soil Data</span>
        </button>
      </div>

      {/* 2. AUTO-DETECTED BANNER — Light-Tint Premium Canvas */}
      <div className="w-full bg-[#4f772d]/[0.08] border border-[#4f772d]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1 transition-all">
        
        <div className="flex items-start gap-4">
          {/* Left Icon Panel */}
          <div className="p-3 bg-white rounded-xl border border-[#4f772d]/20 text-[#31572c] shadow-sm shrink-0">
            <LucideIcons.CloudRainWind className="h-5 w-5" />
          </div>

          {/* Typography Content */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#132a13] font-bold text-xs tracking-wide">
                {detectedBanner.titleHindi}
              </span>
              <span className="bg-[#132a13] text-[#ecf39e] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                {detectedBanner.badgeText}
              </span>
            </div>
            
            <h2 className="text-[#132a13] font-extrabold text-base md:text-lg mt-1 flex items-center gap-1.5">
              {detectedBanner.titleEnglish} <span className="text-gray-400 font-light">•</span> <span className="text-gray-700 text-sm font-medium">{detectedBanner.location}</span>
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
            const { circumference, offset, radius, strokeWidth } = getCircleStrokeProps(crop.matchScore);
            
            return (
              <div
                key={crop.id}
                className={`relative bg-white border ${
                  crop.isBestMatch 
                    ? 'border-[#4f772d]/40 shadow-xl' 
                    : 'border-gray-200/60'
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
                          className={crop.isBestMatch ? 'text-[#31572c]' : 'text-[#90a955]'}
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
                        <LucideIcons.Wheat className="h-4 w-4 text-[#90a955]" /> Yield Prediction
                      </span>
                      <span className="font-bold text-gray-800">{crop.estimatedYield}</span>
                    </div>
                    
                    {/* Parameter: ROI */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium flex items-center gap-1.5">
                        <LucideIcons.Coins className="h-4 w-4 text-[#90a955]" /> Estimated Profit
                      </span>
                      <span className="font-semibold text-emerald-700">{crop.roiEstimate}</span>
                    </div>

                  </div>

                </div>

                {/* Bottom Footer: Risk Badge and Navigation Link */}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                    crop.riskLevel === 'Low Risk' 
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-950 border border-amber-200'
                  }`}>
                    {crop.riskLevel}
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
              <h4 className="text-lg font-black text-gray-800 mt-0.5">{weatherSummary.temperature}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{weatherSummary.temperatureSub}</p>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <LucideIcons.Droplet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Humidity</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">{weatherSummary.humidity}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{weatherSummary.humiditySub}</p>
            </div>
          </div>

          {/* Rainfall */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <LucideIcons.CloudRain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Rainfall</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">{weatherSummary.rainfall}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{weatherSummary.rainfallSub}</p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <LucideIcons.Wind className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Wind Speed</p>
              <h4 className="text-lg font-black text-gray-800 mt-0.5">{weatherSummary.windSpeed}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{weatherSummary.windSpeedSub}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
