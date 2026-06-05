// import React, { useState, useEffect } from "react";
// import * as LucideIcons from "lucide-react";
// import { dashboardContent } from "../../../content/dashboardContent";
// import LocationSelector from "../../../components/LocationSelector";
// import {
//   getSoilDataByPincode,
//   getLocationByGPS,
// } from "../../../services/locationService";
// import { getCropRecommendations } from "../../../services/geminiService";
// import { weatherApi } from "../../../services/apiService";

// export default function CropRecommendationDashboard() {
//   const [location, setLocation] = useState({
//     state: "Haryana",
//     district: "Faridabad",
//     pincode: "121001",
//     latitude: 28.4089,
//     longitude: 77.3178,
//     soilData: getSoilDataByPincode("121001"),
//   });

//   const [dashData, setDashData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [dbWeather, setDbWeather] = useState(null);

//   // Re-fetch current weather telemetry from the database API
//   useEffect(() => {
//     let active = true;
//     const fetchWeather = async () => {
//       try {
//         const res = await weatherApi.getCurrentWeather(
//           location.district,
//           location.latitude,
//           location.longitude
//         );
//         if (res && res.success && res.data && active) {
//           setDbWeather(res.data);
//           console.log(`[Dashboard] Weather database sync: `, res.data);
//         }
//       } catch (err) {
//         console.warn("[Dashboard] Weather API offline/error:", err.message);
//       }
//     };

//     fetchWeather();

//     return () => {
//       active = false;
//     };
//   }, [location.district, location.latitude, location.longitude]);

//   // Re-fetch crop recommendations when location variables change
//   useEffect(() => {
//     let active = true;
//     setLoading(true);

//     const loadRecommendations = async () => {
//       const result = await getCropRecommendations(
//         location.district,
//         location.state,
//         "Kharif",
//       );
//       if (active) {
//         setDashData(result);
//         setLoading(false);
//       }
//     };

//     loadRecommendations();

//     return () => {
//       active = false;
//     };
//   }, [location.district, location.state, location.pincode, location.latitude, location.longitude]);

//   const handleLocationChange = (newLocation) => {
//     // Only update if district, state, pincode, or coordinates actually changed value to avoid redundant renders
//     if (
//       newLocation.district !== location.district ||
//       newLocation.state !== location.state ||
//       newLocation.pincode !== location.pincode ||
//       newLocation.latitude !== location.latitude ||
//       newLocation.longitude !== location.longitude
//     ) {
//       setLocation(newLocation);
//     }
//   };

//   // Trigger geolocation detection and synchronize in the dashboard state
//   const handleFetchLocation = async () => {
//     setIsDetecting(true);
//     try {
//       const geo = await getLocationByGPS();
//       const freshSoil = getSoilDataByPincode(geo.pincode);
//       setLocation({
//         state: geo.state,
//         district: geo.district,
//         pincode: geo.pincode,
//         soilData: freshSoil,
//       });
//     } catch (err) {
//       alert(err.message || "Unable to detect location. Using default.");
//     } finally {
//       setIsDetecting(false);
//     }
//   };

//   // Bind references dynamically from loaded API/fallback response
//   const dataLayer = dashData || {
//     recommendedCrops: [],
//     weatherSummary: {},
//     detectedBanner: {},
//   };

//   const sortedCrops = [...dataLayer.recommendedCrops].sort(
//     (a, b) => b.matchScore - a.matchScore,
//   );

//   return (
//     <div className="space-y-8 animate-fadeIn antialiased">
//       {/* 1. HEADER DESCRIPTION WITH GENERIC DISTRICT PICKER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
//         <div>
//           <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
//             <span>Crop Recommendation Dashboard</span>
//             <span className="text-[#132a13] font-bold text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
//               फसल अनुशंसा
//             </span>
//           </h1>
//           <p className="text-gray-550 text-[11px] md:text-xs tracking-normal mt-1 font-medium font-sans">
//             AI-powered recommendations for your farm based on real-time soil
//             chemistry and weather models.
//           </p>
//         </div>

//         <div className="flex items-center gap-2.5 self-start md:self-auto">
//           {/* Sync Trigger / Fetch Location Data Action Button */}
//           <button
//             onClick={handleFetchLocation}
//             disabled={isDetecting}
//             className="flex items-center space-x-1.5 text-[11px] font-bold tracking-wider uppercase border border-[#90a955]/30 bg-white rounded-xl px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors text-gray-700 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
//           >
//             {isDetecting ? (
//               <>
//                 <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c]" />
//                 <span>Fetching...</span>
//               </>
//             ) : (
//               <>
//                 <LucideIcons.RefreshCw className="h-3.5 w-3.5 text-[#31572c]" />
//                 <span>Fetch Location Data</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* SECTION 1: Location Selector Card (Always mounted to prevent unmount infinite loops) */}
//       <LocationSelector value={location} onChange={handleLocationChange} />

//       {/* SECTION 2: Season Notification Strip */}
//       {loading ? (
//         <div className="h-24 bg-gray-100 border border-gray-200/50 rounded-2xl w-full animate-pulse flex items-center justify-center text-xs font-bold text-gray-400">
//           Loading season data...
//         </div>
//       ) : (
//         <div className="w-full bg-[#4f772d]/[0.08] border border-[#4f772d]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
//           <div className="flex items-start gap-4">
//             {/* Left Icon Panel */}
//             <div className="p-3 bg-white rounded-xl border border-[#4f772d]/20 text-[#31572c] shadow-sm shrink-0">
//               <LucideIcons.CloudRainWind className="h-5 w-5" />
//             </div>

//             {/* Typography Content */}
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-[#132a13] font-bold text-xs tracking-wide">
//                   {dataLayer.detectedBanner.titleHindi || "खरीफ मौसम"}
//                 </span>
//                 <span className="bg-[#132a13] text-[#ecf39e] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
//                   {dataLayer.detectedBanner.badgeText || "Auto-detected"}
//                 </span>
//               </div>

//               <h2 className="text-[#132a13] font-extrabold text-base md:text-lg mt-1 flex items-center gap-1.5">
//                 {dataLayer.detectedBanner.titleEnglish ||
//                   "Kharif Season Detected"}{" "}
//                 <span className="text-gray-400 font-light">•</span>{" "}
//                 <span className="text-gray-700 text-sm font-medium">
//                   {location.district}, {location.state}{" "}
//                   {location.pincode ? `(${location.pincode})` : ""}
//                 </span>
//               </h2>

//               <p className="text-gray-600 text-xs font-medium mt-0.5">
//                 {dataLayer.detectedBanner.details ||
//                   "Based on climate data in Haryana."}
//               </p>
//             </div>
//           </div>

//           {/* Right: Telemetry Active Indicator */}
//           <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm self-start md:self-auto text-xs font-bold text-[#132a13]">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//             Telemetry Active
//           </div>
//         </div>
//       )}

//       {/* SECTION 3: Weather Summary Card */}
//       {loading ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
//           <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
//           <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
//           <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
//           <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl"></div>
//         </div>
//       ) : (
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
//           <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
//             <LucideIcons.CloudSun className="h-5 w-5 text-[#4f772d]" />
//             <span>Weather Sensor Array Summary</span>
//           </h3>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {/* Temperature */}
//             <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
//               <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl">
//                 <LucideIcons.Thermometer className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Temperature</p>
//                 <h4 className="text-lg font-black text-gray-800 mt-0.5">
//                   {dbWeather ? `${dbWeather.currentTemp}°C` : dataLayer.weatherSummary.temperature}
//                 </h4>
//                 <p className="text-[10px] text-gray-400 mt-0.5">
//                   {dbWeather ? dbWeather.weatherCondition : (dataLayer.weatherSummary.temperatureSub || "Optimal Soil Temp")}
//                 </p>
//               </div>
//             </div>

//             {/* Humidity */}
//             <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
//               <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
//                 <LucideIcons.Droplet className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Humidity</p>
//                 <h4 className="text-lg font-black text-gray-800 mt-0.5">
//                   {dbWeather ? `${dbWeather.humidity}%` : dataLayer.weatherSummary.humidity}
//                 </h4>
//                 <p className="text-[10px] text-gray-400 mt-0.5">
//                   {dbWeather ? "Relative Humidity" : (dataLayer.weatherSummary.humiditySub || "Adequate Moisture")}
//                 </p>
//               </div>
//             </div>

//             {/* Rainfall */}
//             <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
//               <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
//                 <LucideIcons.CloudRain className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Rainfall</p>
//                 <h4 className="text-lg font-black text-gray-800 mt-0.5">
//                   {dbWeather ? `${dbWeather.expectedRainfall} mm` : dataLayer.weatherSummary.rainfall}
//                 </h4>
//                 <p className="text-[10px] text-gray-400 mt-0.5">
//                   {dbWeather ? `${dbWeather.rainProbability}% Probability` : (dataLayer.weatherSummary.rainfallSub || "Mild showers forecast")}
//                 </p>
//               </div>
//             </div>

//             {/* Wind Speed */}
//             <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start space-x-3.5 hover:shadow-sm transition-all duration-300">
//               <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
//                 <LucideIcons.Wind className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Wind Speed</p>
//                 <h4 className="text-lg font-black text-gray-800 mt-0.5">
//                   {dbWeather ? `${dbWeather.windSpeed} km/h` : dataLayer.weatherSummary.windSpeed}
//                 </h4>
//                 <p className="text-[10px] text-gray-400 mt-0.5">
//                   {dbWeather ? `Direction: ${dbWeather.windDirection}` : (dataLayer.weatherSummary.windSpeedSub || "Gentle wind")}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* SECTION 4: Soil Health Profile Matrix Card (Renders instantly using local soil classification) */}
//       {/* {location.soilData && ( */}

//       {/* SECTION 5: Top Recommended Crops Cards */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
//           <div className="h-64 bg-gray-150 rounded-2xl"></div>
//           <div className="h-64 bg-gray-150 rounded-2xl"></div>
//           <div className="h-64 bg-gray-150 rounded-2xl"></div>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-[#31572c] font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 mb-4">
//             <LucideIcons.Sparkles className="h-4 w-4 text-[#31572c]" />
//             <span>Top Matches for Selected Soil Matrix</span>
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {sortedCrops.map((crop) => {
//               const isBestMatch =
//                 crop.isBestMatch === true || crop.isBestMatch === "true";

//               return (
//                 <div
//                   key={crop.id || crop.name}
//                   className={`relative bg-white border ${
//                     isBestMatch
//                       ? "border-[#4f772d]/40 shadow-xl"
//                       : "border-gray-200/60"
//                   } rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 mt-4`}
//                 >
//                   {/* Recommended Top Tag */}
//                   {isBestMatch && (
//                     <div className="absolute -top-3.5 left-6 bg-[#132a13] text-[#ecf39e] text-[10px] font-bold tracking-widest px-3 py-1 rounded-md uppercase z-10 shadow-sm animate-fadeIn">
//                       RECOMMENDED
//                     </div>
//                   )}

//                   <div>
//                     {/* Top info and Circular Progress Ring */}
//                     <div className="flex items-center justify-between mb-6">
//                       <div>
//                         <div className="flex items-baseline space-x-1.5">
//                           <h3 className="text-lg font-extrabold text-gray-900">
//                             {crop.name}
//                           </h3>
//                         </div>
//                         <span className="text-[10px] font-bold uppercase tracking-wide text-[#4f772d] mt-0.5 block">
//                           {crop.hindiName || "फसल"}
//                         </span>
//                       </div>

//                       {/* SVG CIRCULAR MATCH INDEX WITH DYNAMIC strokeDasharray FORMULA */}
//                       <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
//                         <svg className="transform -rotate-90 w-full h-full">
//                           {/* Background track circle */}
//                           <circle
//                             cx="28"
//                             cy="28"
//                             r="24"
//                             fill="transparent"
//                             stroke="currentColor"
//                             className="text-slate-100"
//                             strokeWidth="4.5"
//                           />
//                           {/* Dynamic score outline circle */}
//                           <circle
//                             cx="28"
//                             cy="28"
//                             r="24"
//                             fill="transparent"
//                             stroke="currentColor"
//                             className={
//                               isBestMatch ? "text-[#31572c]" : "text-[#90a955]"
//                             }
//                             strokeWidth="4.5"
//                             pathLength="100"
//                             strokeDasharray={`${crop.matchScore || 50}, 100`}
//                             strokeLinecap="round"
//                           />
//                         </svg>
//                         {/* Percent Tag centered */}
//                         <span className="absolute text-[10px] font-black text-gray-800">
//                           {crop.matchScore || 50}%
//                         </span>
//                       </div>
//                     </div>

//                     {/* Crop Description */}
//                     <p className="text-xs text-gray-600 leading-relaxed mb-5">
//                       {crop.details ||
//                         "Ideal conditions match standard agricultural indices."}
//                     </p>

//                     {/* Primary Parameters */}
//                     <div className="space-y-3 border-t border-gray-100 pt-4 mb-5">
//                       {/* Parameter: Yield */}
//                       <div className="flex justify-between items-center text-xs">
//                         <span className="text-gray-500 font-medium flex items-center gap-1.5 font-sans">
//                           <LucideIcons.Wheat className="h-4 w-4 text-[#90a955]" />{" "}
//                           Yield Prediction
//                         </span>
//                         <span className="font-bold text-gray-800">
//                           {crop.estimatedYield || crop.yieldPrediction}
//                         </span>
//                       </div>

//                       {/* Parameter: ROI */}
//                       <div className="flex justify-between items-center text-xs">
//                         <span className="text-gray-500 font-medium flex items-center gap-1.5 font-sans">
//                           <LucideIcons.Coins className="h-4 w-4 text-[#90a955]" />{" "}
//                           Estimated Profit / ROI
//                         </span>
//                         <span className="font-semibold text-emerald-700">
//                           {crop.roiEstimate || crop.roi}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Bottom Footer: Risk Badge and Navigation Link */}
//                   <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
//                     <span
//                       className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase shadow-sm ${
//                         (crop.riskLevel || crop.risk) === "Low Risk"
//                           ? "bg-emerald-100 text-emerald-950 border border-emerald-200"
//                           : "bg-amber-100 text-amber-950 border border-amber-200"
//                       }`}
//                     >
//                       {crop.riskLevel || crop.risk}
//                     </span>

//                     <a
//                       href="#details"
//                       className="text-[#31572c] hover:text-[#132a13] font-bold text-xs uppercase flex items-center gap-1 transition-colors duration-200"
//                     >
//                       <span>View Recipe &rarr;</span>
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { dashboardContent } from "../../../content/dashboardContent";
import LocationSelector from "../../../components/LocationSelector";
import {
  getSoilDataByPincode,
  getLocationByGPS,
} from "../../../services/locationService";
import { getCropRecommendations } from "../../../services/geminiService";
import { weatherApi } from "../../../services/apiService";

export default function CropRecommendationDashboard() {
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

  const [dashData, setDashData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [dbWeather, setDbWeather] = useState(null);

  const getDynamicCurrentSeason = () => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 5 && currentMonth <= 10) return "Kharif";
    if (currentMonth >= 2 && currentMonth < 5) return "Zaid";
    return "Rabi";
  };

  const activeSeason = getDynamicCurrentSeason();

  // Sync Live Weather sensor profiles from database API
  useEffect(() => {
    let active = true;
    const fetchWeather = async () => {
      try {
        const res = await weatherApi.getCurrentWeather(
          location.district,
          location.latitude,
          location.longitude,
        );
        if (res && res.success && res.data && active) {
          setDbWeather(res.data);
        }
      } catch (err) {
        console.warn("[Dashboard] Weather API lookup offline:", err.message);
      }
    };

    fetchWeather();
    return () => {
      active = false;
    };
  }, [location.district, location.latitude, location.longitude]);

  // Hydrate dynamic AI recommendations matching local parameters
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadRecommendations = async () => {
      try {
        const result = await getCropRecommendations(
          location.district,
          location.state,
          activeSeason,
        );

        if (active) {
          console.log("[Dashboard] Gemini API Raw Response Matrix: ", result);
          const cropsPayload =
            result?.recommendations ||
            result?.recommendedCrops ||
            result?.crops ||
            (Array.isArray(result) ? result : []);
          setDashData(cropsPayload);
          setLoading(false);
        }
      } catch (err) {
        console.error("AI Recommendation matrix parsing exception:", err);
        setLoading(false);
      }
    };

    loadRecommendations();
    return () => {
      active = false;
    };
  }, [
    location.district,
    location.state,
    location.pincode,
    location.latitude,
    location.longitude,
    activeSeason,
  ]);

  const handleLocationChange = (newLocation) => {
    if (
      newLocation.district !== location.district ||
      newLocation.state !== location.state ||
      newLocation.pincode !== location.pincode ||
      newLocation.latitude !== location.latitude ||
      newLocation.longitude !== location.longitude
    ) {
      setLocation(newLocation);
    }
  };

  const handleFetchLocation = async () => {
    setIsDetecting(true);
    try {
      const geo = await getLocationByGPS();
      const freshSoil = getSoilDataByPincode(geo.pincode);
      setLocation({
        state: geo.state,
        district: geo.district,
        pincode: geo.pincode,
        latitude: geo.latitude || 28.4089,
        longitude: geo.longitude || 77.3178,
        soilData: freshSoil,
      });
    } catch (err) {
      alert(err.message || "Unable to determine current GPS boundaries.");
    } finally {
      setIsDetecting(false);
    }
  };

  const resolveDynamicValue = (value, unitSuffix = "") => {
    if (value === undefined || value === null || value === "")
      return "Data Pending";
    if (typeof value === "number") return `${value}${unitSuffix}`;
    if (String(value).toLowerCase().includes(unitSuffix.toLowerCase().trim()))
      return value;
    return `${value}${unitSuffix}`;
  };

  const sortedCrops = [...dashData].sort(
    (a, b) => (b.matchScore || b.score || 0) - (a.matchScore || a.score || 0),
  );

  return (
    <div className="space-y-8 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <span>Crop Recommendation Dashboard</span>
            <span className="text-[#31572c] font-black text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
              फसल अनुशंसा ({activeSeason})
            </span>
          </h1>
          <p className="text-gray-900 text-[11px] md:text-xs mt-1 font-semibold">
            AI-powered recommendations for your farm based on real-time soil
            chemistry and seasonal weather models.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleFetchLocation}
            disabled={isDetecting}
            className="flex items-center space-x-1.5 text-[11px] font-black tracking-wider uppercase border border-gray-300 bg-white rounded-xl px-4 py-2 shadow-sm hover:bg-gray-50 text-gray-950 active:scale-[0.98] disabled:opacity-75 cursor-pointer"
          >
            {isDetecting ? (
              <>
                <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c]" />
                <span>Syncing boundaries...</span>
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

      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Season Notification Strip */}
      {loading ? (
        <div className="h-24 bg-white border border-gray-300 rounded-2xl w-full animate-pulse flex items-center justify-center text-xs font-black text-gray-700">
          Syncing local crop data matrices...
        </div>
      ) : (
        <div className="w-full bg-[#4f772d]/[0.06] border border-gray-300 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl border border-gray-300 text-[#31572c] shadow-sm shrink-0">
              <LucideIcons.CloudRainWind className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#132a13] font-black text-xs tracking-wide uppercase">
                  {activeSeason === "Kharif"
                    ? "खरीफ"
                    : activeSeason === "Rabi"
                      ? "रबी"
                      : "जायद"}{" "}
                  मौसम सक्रिय
                </span>
                <span className="bg-[#132a13] text-[#ecf39e] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                  Live Climate Checked
                </span>
              </div>

              <h2 className="text-[#132a13] font-extrabold text-base md:text-lg mt-1 flex items-center gap-1.5">
                {activeSeason} Cycle Active
                <span className="text-gray-300 font-light">•</span>
                <span className="text-gray-950 text-sm font-black">
                  {location.district}, {location.state}{" "}
                  {location.pincode ? `(${location.pincode})` : ""}
                </span>
              </h2>
              <p className="text-gray-900 text-xs font-semibold mt-0.5">
                Optimizing predictions for regional {activeSeason} weather
                metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm text-xs font-black text-[#132a13]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Telemetry Active
          </div>
        </div>
      )}

      {/* Weather Summary Card Array */}
      {!loading && (
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-5 flex items-center gap-2">
            <LucideIcons.CloudSun className="h-5 w-5 text-[#4f772d]" />
            <span>Weather Sensor Array Summary</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start space-x-3.5 hover:shadow-sm transition-all">
              <div className="p-2.5 bg-red-500/10 text-red-700 rounded-xl">
                <LucideIcons.Thermometer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-700 font-bold">Temperature</p>
                <h4 className="text-lg font-black text-gray-950 mt-0.5">
                  {dbWeather ? `${dbWeather.currentTemp}°C` : "42°C"}
                </h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  {dbWeather ? dbWeather.weatherCondition : "Sunny"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start space-x-3.5 hover:shadow-sm transition-all">
              <div className="p-2.5 bg-blue-500/10 text-blue-700 rounded-xl">
                <LucideIcons.Droplet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-700 font-bold">Humidity</p>
                <h4 className="text-lg font-black text-gray-950 mt-0.5">
                  {dbWeather ? `${dbWeather.humidity}%` : "22%"}
                </h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  Relative Density
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start space-x-3.5 hover:shadow-sm transition-all">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
                <LucideIcons.CloudRain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-700 font-bold">Rainfall</p>
                <h4 className="text-lg font-black text-gray-950 mt-0.5">
                  {dbWeather ? `${dbWeather.expectedRainfall} mm` : "0 mm"}
                </h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  {dbWeather
                    ? `${dbWeather.rainProbability}% Probability`
                    : "5% Probability"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start space-x-3.5 hover:shadow-sm transition-all">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-700 rounded-xl">
                <LucideIcons.Wind className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-700 font-bold">Wind Speed</p>
                <h4 className="text-lg font-black text-gray-950 mt-0.5">
                  {dbWeather ? `${dbWeather.windSpeed} km/h` : "8 km/h"}
                </h4>
                <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                  Vector: {dbWeather ? dbWeather.windDirection : "NE"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Recommendation Matches Grid Section */}
      {!loading && (
        <div>
          <h2 className="text-[#31572c] font-black text-xs tracking-wider uppercase flex items-center gap-1.5 mb-4">
            <LucideIcons.Sparkles className="h-4 w-4" />
            <span>Top AI Matches for Mapped Soil Parameters</span>
          </h2>

          {sortedCrops.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-300">
              <LucideIcons.Sprout className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">
                No matching crop records found for this season configuration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCrops.map((crop, idx) => {
                const score = crop.matchScore || crop.score || 75;
                const isBestMatch =
                  crop.isBestMatch === true ||
                  crop.isBestMatch === "true" ||
                  idx === 0;

                const yieldVal =
                  crop.estimatedYield ||
                  crop.yieldPrediction ||
                  crop.expectedYield ||
                  crop.yield;
                const profitVal =
                  crop.roiEstimate ||
                  crop.roi ||
                  crop.expectedProfit ||
                  crop.netProfit ||
                  crop.profit;

                return (
                  <div
                    key={crop.id || crop.name || idx}
                    className={`relative bg-white border ${
                      isBestMatch
                        ? "border-[#4f772d]/50 shadow-md"
                        : "border-gray-300"
                    } rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                  >
                    {isBestMatch && (
                      <div className="absolute -top-3.5 left-6 bg-[#132a13] text-[#ecf39e] text-[10px] font-black tracking-widest px-3 py-1 rounded-md uppercase z-10 shadow-sm">
                        RECOMMENDED MATCH
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-black text-gray-950">
                            {crop.name}
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-wide text-[#4f772d] mt-0.5 block">
                            {crop.hindiName || crop.hindi || "फसल"}
                          </span>
                        </div>

                        <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                          <svg className="transform -rotate-90 w-full h-full">
                            <circle
                              cx="28"
                              cy="28"
                              r="24"
                              fill="transparent"
                              stroke="#f1f5f9"
                              strokeWidth="4.5"
                            />
                            <circle
                              cx="28"
                              cy="28"
                              r="24"
                              fill="transparent"
                              stroke="currentColor"
                              className={
                                isBestMatch
                                  ? "text-[#31572c]"
                                  : "text-[#90a955]"
                              }
                              strokeWidth="4.5"
                              pathLength="100"
                              strokeDasharray={`${score}, 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-[10px] font-black text-gray-950">
                            {score}%
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-900 font-medium leading-relaxed mb-5">
                        {crop.details ||
                          crop.explanation ||
                          crop.desc ||
                          "Optimal soil and regional parameters match standard growth markers perfectly."}
                      </p>

                      <div className="space-y-3 border-t border-gray-200 pt-4 mb-5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-semibold flex items-center gap-1.5">
                            <LucideIcons.Wheat className="h-4 w-4 text-[#4f772d]" />{" "}
                            Yield Prediction
                          </span>
                          <span className="font-black text-gray-950">
                            {resolveDynamicValue(yieldVal, " qtl/acre")}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-semibold flex items-center gap-1.5">
                            <LucideIcons.Coins className="h-4 w-4 text-[#4f772d]" />{" "}
                            Estimated Net Profit
                          </span>
                          <span className="font-black text-emerald-800">
                            {resolveDynamicValue(profitVal, "/acre")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide uppercase shadow-sm ${
                          (crop.riskLevel || crop.risk || "")
                            .toLowerCase()
                            .includes("high")
                            ? "bg-amber-100 text-amber-950 border border-amber-300"
                            : "bg-emerald-100 text-emerald-950 border border-emerald-300"
                        }`}
                      >
                        {crop.riskLevel || crop.risk || "Low Risk"}
                      </span>

                      <a
                        href="#details"
                        className="text-[#31572c] hover:text-[#132a13] font-black text-xs uppercase flex items-center gap-1 transition-colors duration-200"
                      >
                        <span>View Crop Profile &rarr;</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
