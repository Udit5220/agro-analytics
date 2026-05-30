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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>Crop Recommendation Dashboard</span>
            <span className="text-[#132a13] font-bold text-lg md:text-xl ml-3 border-l-2 border-[#31572c] pl-3 bg-transparent uppercase">
              फसल अनुशंसा
            </span>
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">
            AI-powered recommendations for your farm based on real-time soil chemistry and weather models.
          </p>
        </div>

        {/* Sync Trigger Icon */}
        <button className="self-start md:self-auto flex items-center space-x-2 px-4 py-2 bg-white dark:bg-brand-darkest hover:bg-brand-medium hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 dark:border-brand-dark/25 shadow-sm transition-all duration-300 active:scale-[0.98]">
          <LucideIcons.RefreshCw className="h-4 w-4" />
          <span>Sync Soil Data</span>
        </button>
      </div>

      {/* 2. AUTO-DETECTED BANNER */}
      <div className="bg-brand-dark border border-brand-light/20 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Floating gradient details */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-accent/5 to-transparent pointer-events-none" />

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-brand-accent/20 rounded-2xl text-brand-accent border border-brand-accent/25 shrink-0 animate-pulse">
            <LucideIcons.CloudRainWind className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
                {detectedBanner.titleHindi}
              </span>
              <span className="text-[10px] font-bold bg-brand-accent text-brand-darkest px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {detectedBanner.badgeText}
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight mt-1 flex items-center gap-2">
              <span>{detectedBanner.titleEnglish}</span>
              <span className="text-slate-300/80 font-medium text-xs">•</span>
              <span className="text-slate-200 text-sm font-medium">{detectedBanner.location}</span>
            </h3>
            <p className="text-xs text-slate-300/90 leading-relaxed mt-0.5 max-w-xl">
              {detectedBanner.details}
            </p>
          </div>
        </div>

        {/* Badge Checkmark */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-brand-medium/55 border border-brand-light/30 rounded-2xl text-xs font-bold text-brand-accent">
          <LucideIcons.Check className="h-4 w-4" />
          <span>Telemetry Active</span>
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
                className={`relative bg-white dark:bg-brand-darkest border ${
                  crop.isBestMatch 
                    ? 'border-brand-medium dark:border-brand-accent shadow-xl' 
                    : 'border-slate-200 dark:border-brand-dark/20'
                } rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 mt-4`}
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
                        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
                          {crop.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-brand-medium dark:text-brand-accent mt-0.5 block">
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
                          className="text-slate-100 dark:text-brand-dark/15"
                          strokeWidth={strokeWidth}
                        />
                        {/* Dynamic score outline circle */}
                        <circle
                          cx="28"
                          cy="28"
                          r={radius}
                          fill="transparent"
                          stroke="currentColor"
                          className={crop.isBestMatch ? 'text-brand-medium dark:text-brand-accent' : 'text-brand-light'}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percent Tag centered */}
                      <span className="absolute text-[10px] font-black text-slate-800 dark:text-white">
                        {crop.matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Crop Description (Typography update - Slate 600 -> Slate 700) */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                    {crop.details}
                  </p>

                  {/* Primary Parameters (Typography update - Slate 500 -> Slate 600) */}
                  <div className="space-y-3.5 border-t border-slate-200 dark:border-brand-dark/10 pt-4 mb-6">
                    
                    {/* Parameter: Yield */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <LucideIcons.Wheat className="h-4 w-4 text-brand-light" /> Yield Prediction
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white">{crop.estimatedYield}</span>
                    </div>
                    
                    {/* Parameter: ROI */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                        <LucideIcons.Coins className="h-4 w-4 text-brand-light" /> Estimated Profit
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-brand-accent">{crop.roiEstimate}</span>
                    </div>

                  </div>

                </div>

                {/* Bottom Footer: Risk Badge and Navigation Link */}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200 dark:border-brand-dark/10">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                    crop.riskLevel === 'Low Risk' 
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-950 border border-amber-200'
                  }`}>
                    {crop.riskLevel}
                  </span>
                  
                  <a
                    href="#details"
                    className="text-[#31572c] hover:text-[#132a13] dark:text-brand-accent dark:hover:text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors duration-200"
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
      <div className="bg-white dark:bg-brand-darkest/25 border border-slate-100 dark:border-brand-dark/25 rounded-3xl p-6 shadow-sm">
        
        {/* Weather Title */}
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <LucideIcons.CloudSun className="h-5 w-5 text-brand-medium dark:text-brand-accent" />
          <span>Weather Sensor Array Summary</span>
        </h3>

        {/* 4 Weather parameters panels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4]/60 dark:bg-brand-darkest/50 border border-slate-50 dark:border-brand-dark/10 flex items-start space-x-3.5 hover:scale-[1.02] transition-all duration-300">
            <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
              <LucideIcons.Thermometer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Temperature</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{weatherSummary.temperature}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{weatherSummary.temperatureSub}</p>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4]/60 dark:bg-brand-darkest/50 border border-slate-50 dark:border-brand-dark/10 flex items-start space-x-3.5 hover:scale-[1.02] transition-all duration-300">
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <LucideIcons.Droplet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Humidity</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{weatherSummary.humidity}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{weatherSummary.humiditySub}</p>
            </div>
          </div>

          {/* Rainfall */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4]/60 dark:bg-brand-darkest/50 border border-slate-50 dark:border-brand-dark/10 flex items-start space-x-3.5 hover:scale-[1.02] transition-all duration-300">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <LucideIcons.CloudRain className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Rainfall</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{weatherSummary.rainfall}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{weatherSummary.rainfallSub}</p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4]/60 dark:bg-brand-darkest/50 border border-slate-50 dark:border-brand-dark/10 flex items-start space-x-3.5 hover:scale-[1.02] transition-all duration-300">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <LucideIcons.Wind className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Wind Speed</p>
              <h4 className="text-lg font-black text-slate-800 dark:text-white mt-0.5">{weatherSummary.windSpeed}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{weatherSummary.windSpeedSub}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
