// import React, { useState, useEffect } from "react";
// import {
//   AlertTriangle,
//   Activity,
//   Sprout,
//   MapPin,
//   Bell,
//   ShieldAlert,
//   Droplets,
//   Thermometer,
//   Wind,
//   CloudRain,
//   ShieldCheck,
//   ChevronDown,
// } from "lucide-react";
// import { getDashboardData } from "../../services/diseaseGeminiService";

// const DISTRICT_LIST = [
//   "Faridabad",
//   "Gurugram",
//   "Hisar",
//   "Karnal",
//   "Panipat",
//   "Rohtak",
//   "Sonipat",
//   "Ambala",
//   "Yamunanagar",
//   "Kurukshetra",
//   "Palwal",
//   "Nuh",
// ];

// const WEATHER_ICONS = {
//   Humidity: <Droplets size={14} className="text-[#31572c]" />,
//   Temperature: <Thermometer size={14} className="text-[#31572c]" />,
//   Wind: <Wind size={14} className="text-[#31572c]" />,
//   Rainfall: <CloudRain size={14} className="text-[#31572c]" />,
// };

// export default function PestDiseaseDashboard() {
//   const [district, setDistrict] = useState("Faridabad");
//   const [dashData, setDashData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;
//     setLoading(true);

//     const loadData = async () => {
//       const result = await getDashboardData(district, "Haryana");
//       if (active) {
//         setDashData(result);
//         setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       active = false;
//     };
//   }, [district]);

//   // Bind metrics mapping icons dynamically
//   const getMetricIcon = (title) => {
//     switch (title) {
//       case "Active Alerts":
//         return {
//           icon: <AlertTriangle className="h-4.5 w-4.5" />,
//           iconBg: "bg-red-100/50 text-red-655",
//           levelColor: "text-red-655 bg-red-100/30",
//           level: "High",
//         };
//       case "Crops Monitored":
//         return {
//           icon: <Sprout className="h-4.5 w-4.5" />,
//           iconBg: "bg-[#31572c]/10 text-[#31572c]",
//           levelColor: "text-[#31572c] bg-[#31572c]/10",
//           level: "Active",
//         };
//       case "Districts Covered":
//         return {
//           icon: <MapPin className="h-4.5 w-4.5" />,
//           iconBg: "bg-sky-100 text-sky-700",
//           levelColor: "text-sky-700 bg-sky-100/30",
//           level: "Regions",
//         };
//       case "Alerts Sent Today":
//       default:
//         return {
//           icon: <Activity className="h-4.5 w-4.5" />,
//           iconBg: "bg-amber-100 text-amber-705",
//           levelColor: "text-amber-705 bg-amber-100/30",
//           level: "Live SMS",
//         };
//     }
//   };

//   const getRiskBadgeStyle = (level) => {
//     if (level === "High") {
//       return "bg-red-100 text-red-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]";
//     } else if (level === "Moderate") {
//       return "bg-amber-100 text-amber-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]";
//     }
//     return "bg-emerald-100 text-emerald-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]";
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn antialiased">
//       {/* 1. Page Header with District selector */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
//         <div>
//           <div className="flex items-center gap-2.5">
//             <ShieldAlert className="h-6.5 w-6.5 text-[#31572c]" />
//             <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
//               <span>Pest & Disease Risk Dashboard</span>
//               <span className="text-gray-300 font-light text-xl">|</span>
//               <span className="text-[#31572c] font-bold text-sm md:text-base">
//                 जोखिम नियंत्रण
//               </span>
//             </h1>
//           </div>
//           <span className="text-gray-500 text-[11px] font-semibold tracking-wide block pb-1 mt-1.5 uppercase">
//             Live disease risk intelligence for your region
//           </span>
//         </div>

//         {/* Region selector Dropdown */}
//         <div className="relative">
//           <select
//             value={district}
//             onChange={(e) => setDistrict(e.target.value)}
//             className="appearance-none bg-white border border-[#90a955]/30 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] transition-all cursor-pointer h-[38px] shadow-sm select-none"
//           >
//             {DISTRICT_LIST.map((dist) => (
//               <option key={dist} value={dist}>
//                 Region: {dist}
//               </option>
//             ))}
//           </select>
//           <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
//         </div>
//       </div>

//       {loading ? (
//         // ─── SKELETON LOADER SENSORS CANVASES ───
//         <div className="space-y-6">
//           <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, idx) => (
//               <div
//                 key={idx}
//                 className="h-28 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"
//               ></div>
//             ))}
//           </div>
//           <div className="h-[280px] bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, idx) => (
//               <div
//                 key={idx}
//                 className="h-24 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"
//               ></div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         // ─── DYNAMIC METRICS POPULATE CANVASES ───
//         <>
//           {/* 2. Critical Alert Banner */}
//           {dashData?.criticalAlert && (
//             <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
//               <AlertTriangle className="h-5 w-5 text-red-650 shrink-0 mt-0.5 animate-pulse" />
//               <div className="space-y-1">
//                 <h3 className="text-red-900 font-extrabold text-sm tracking-tight flex items-center gap-2">
//                   Critical Outbreak Notification
//                   <span className="bg-red-200 text-red-950 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
//                     {dashData.criticalAlert.probability}% Risk Alert
//                   </span>
//                 </h3>
//                 <p className="text-red-800 text-xs font-semibold leading-relaxed">
//                   {dashData.criticalAlert.message}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* 3. Summary Metric Grid Blocks */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {Object.keys(dashData?.metrics || {}).map((key, idx) => {
//               const titles = {
//                 activeAlerts: "Active Alerts",
//                 cropsMonitored: "Crops Monitored",
//                 districtsCovered: "Districts Covered",
//                 alertsSentToday: "Alerts Sent Today",
//               };
//               const title = titles[key] || key;
//               const value = dashData.metrics[key];
//               const styles = getMetricIcon(title);

//               return (
//                 <div
//                   key={idx}
//                   className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className={`p-2 rounded-xl ${styles.iconBg}`}>
//                       {styles.icon}
//                     </div>
//                     <span
//                       className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${styles.levelColor}`}
//                     >
//                       {styles.level}
//                     </span>
//                   </div>
//                   <div>
//                     <h4 className="text-gray-900 text-2xl font-black tracking-tight">
//                       {value}
//                     </h4>
//                     <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mt-0.5">
//                       {title}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* 4. Risk Summary Table Sheet Ledger */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
//             <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
//               Today's Risk Summary
//             </span>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse min-w-[720px] table-fixed">
//                 <thead>
//                   <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
//                     <th className="p-3 pl-1 w-[160px]">Crop</th>
//                     <th className="p-3 w-[150px]">Disease</th>
//                     <th className="p-3 w-[120px]">Risk Level</th>
//                     <th className="p-3">Recommended Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100/65">
//                   {(dashData?.riskSummary || []).map((item, idx) => (
//                     <tr
//                       key={idx}
//                       className="hover:bg-[#f4f7f4]/35 transition-colors"
//                     >
//                       <td className="p-3.5 pl-1 flex items-center gap-2">
//                         <span className="w-1.5 h-1.5 rounded-full bg-[#31572c] shrink-0" />
//                         <span className="text-xs font-bold text-gray-900">
//                           {item.crop}
//                         </span>
//                         <span className="text-gray-500 text-xs font-medium pl-1 font-hindi">
//                           ({item.cropHindi || item.crop})
//                         </span>
//                       </td>
//                       <td className="p-3.5 text-xs font-bold text-gray-700">
//                         {item.disease}
//                       </td>
//                       <td className="p-3.5">
//                         <span className={getRiskBadgeStyle(item.riskLevel)}>
//                           {item.riskLevel} Risk
//                         </span>
//                       </td>
//                       <td className="p-3.5 text-gray-700 font-medium text-xs">
//                         {item.action}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* 5. Weather Influence on Disease Risk */}
//           <div>
//             <span className="text-sm font-bold text-[#31572c] tracking-wide mt-6 mb-3 block">
//               Weather Influence on Disease Risk
//             </span>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {(dashData?.weatherInfluence || []).map((w, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white rounded-2xl p-4.5 border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
//                       {WEATHER_ICONS[w.parameter] || (
//                         <Droplets size={14} className="text-[#31572c]" />
//                       )}
//                       {w.parameter} {w.currentValue}
//                     </span>
//                     <span
//                       className={`text-xs font-black flex items-center ${w.isDanger ? "text-red-600" : "text-emerald-650"}`}
//                     >
//                       {w.variance}
//                     </span>
//                   </div>
//                   <p className="text-gray-655 text-xs mt-3 font-medium leading-relaxed">
//                     {w.impact}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Activity,
  Sprout,
  MapPin,
  Bell,
  ShieldAlert,
  Droplets,
  Thermometer,
  Wind,
  CloudRain,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react";
import {
  getCombinedDashboardAndForecast,
  fetchOpenMeteoWeather,
  resolveGeographicZone,
  getImdRainfallMatrix,
  HARYANA_DISTRICT_COORDS,
} from "../../services/diseaseGeminiService";

// ─── USER PROFILE (replace with real context/API call in production) ───
const USER_PROFILE = {
  name: "Suresh Kumar",
  location: "Faridabad, Haryana",
  pincode: "121001",
  farms: [
    {
      _id: "6a1bd649ff396ef5e03a3394",
      name: "Home Sector Flatlands",
      location: "Faridabad Outskirts",
      district: "Faridabad",
      state: "Haryana",
      totalLand: 4.5,
      crops: [
        { name: "Rice (Paddy)", sowingDate: "2026-05-01", sownArea: 2.5 },
        { name: "Mustard", sowingDate: "2026-05-15", sownArea: 1.5 },
      ],
    },
    {
      _id: "6a1bd649ff396ef5e03a3397",
      name: "Northern Tube-well Plot",
      location: "Ballabhgarh Boundary",
      district: "Ballabhgarh",
      state: "Haryana",
      totalLand: 3.2,
      crops: [{ name: "Wheat", sowingDate: "2025-11-10", sownArea: 2 }],
    },
  ],
};

const WEATHER_ICONS = {
  Humidity: <Droplets size={14} className="text-[#31572c]" />,
  Temperature: <Thermometer size={14} className="text-[#31572c]" />,
  Wind: <Wind size={14} className="text-[#31572c]" />,
  Rainfall: <CloudRain size={14} className="text-[#31572c]" />,
};

const RISK_SCORE_COLOR = (score) => {
  if (score >= 75) return "text-red-700 bg-red-100";
  if (score >= 50) return "text-amber-700 bg-amber-100";
  return "text-emerald-700 bg-emerald-100";
};

const RISK_LEVEL_BADGE = (level) => {
  switch (level) {
    case "Critical":
      return "bg-red-200 text-red-900 font-black";
    case "High":
      return "bg-red-100 text-red-800 font-bold";
    case "Moderate":
      return "bg-amber-100 text-amber-800 font-bold";
    default:
      return "bg-emerald-100 text-emerald-800 font-bold";
  }
};

export default function PestDiseaseDashboard() {
  const [selectedFarmId, setSelectedFarmId] = useState(
    USER_PROFILE.farms[0]._id,
  );
  const [dashData, setDashData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const selectedFarm = USER_PROFILE.farms.find((f) => f._id === selectedFarmId);

  // Extract district name — fallback to "Faridabad" if not mapped
  const resolveDistrict = (farm) => {
    return farm.district || farm.location?.split(" ")?.[0] || "Faridabad";
  };

  const loadDashboard = useCallback(async () => {
    if (!selectedFarm) return;

    setLoadingMain(true);
    setLoadingForecast(true);
    setDashData(null);
    setForecastData(null);

    const district = resolveDistrict(selectedFarm);
    const state = selectedFarm.state || "Haryana";
    const cropNames = selectedFarm.crops.map((c) => c.name);

    // ── Step 1: Fetch real weather (Open-Meteo, free, no key) ──
    const coords =
      HARYANA_DISTRICT_COORDS[district] || HARYANA_DISTRICT_COORDS["Faridabad"];
    const weather = await fetchOpenMeteoWeather(coords.lat, coords.lng);
    setWeatherData(weather.current);

    // ── Step 2: Resolve geographic zone IDs for sibling rainfall API ──
    let geoZone = null;
    let rainfall = null;
    try {
      geoZone = await resolveGeographicZone(district);
      if (geoZone?._id && geoZone?.state_id) {
        rainfall = await getImdRainfallMatrix(geoZone.state_id, geoZone._id);
        setRainfallData(rainfall);
      }
    } catch {
      // Non-fatal: continue with weather-only data
    }

    // ── Steps 3 & 4: Combined Dashboard & Forecast via Gemini (Single Consolidated API Call) ──
    try {
      const combined = await getCombinedDashboardAndForecast(
        district,
        state,
        cropNames,
        weather.current,
        rainfall,
        weather.forecast,
      );
      setDashData(combined.dashboard);
      setForecastData(combined);
    } catch (err) {
      console.error("Failed to load combined dashboard/forecast via Gemini:", err);
    } finally {
      setLoadingMain(false);
      setLoadingForecast(false);
      setLastRefreshed(new Date());
    }
  }, [selectedFarmId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const getMetricConfig = (key) => {
    const map = {
      activeAlerts: {
        label: "Active Alerts",
        icon: <AlertTriangle className="h-4 w-4" />,
        iconBg: "bg-red-100 text-red-700",
        badge: "bg-red-100 text-red-700",
        badgeLabel: "High",
      },
      cropsMonitored: {
        label: "Crops Monitored",
        icon: <Sprout className="h-4 w-4" />,
        iconBg: "bg-[#31572c]/10 text-[#31572c]",
        badge: "bg-[#31572c]/10 text-[#31572c]",
        badgeLabel: "Active",
      },
      districtsCovered: {
        label: "Districts Covered",
        icon: <MapPin className="h-4 w-4" />,
        iconBg: "bg-sky-100 text-sky-700",
        badge: "bg-sky-100 text-sky-700",
        badgeLabel: "Regions",
      },
      alertsSentToday: {
        label: "Alerts Sent Today",
        icon: <Activity className="h-4 w-4" />,
        iconBg: "bg-amber-100 text-amber-700",
        badge: "bg-amber-100 text-amber-700",
        badgeLabel: "Live SMS",
      },
    };
    return map[key] || map.alertsSentToday;
  };

  const getRiskRowBadge = (level) =>
    `text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide ${RISK_LEVEL_BADGE(level)}`;

  // ─── SKELETON ───────────────────────────────────────────────
  const SkeletonBlock = ({ h = "h-24", extra = "" }) => (
    <div
      className={`${h} ${extra} bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse`}
    />
  );

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-6 w-6 text-[#31572c]" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
              <span>Pest & Disease Risk Dashboard</span>
              <span className="text-gray-300 font-light">|</span>
              <span className="text-[#31572c] font-bold text-sm md:text-base">
                जोखिम नियंत्रण
              </span>
            </h1>
          </div>
          <span className="text-gray-500 text-[11px] font-semibold tracking-wide block mt-1.5 uppercase">
            Live disease risk intelligence ·{" "}
            {selectedFarm?.location || "Your farm"}
          </span>
          {lastRefreshed && (
            <span className="text-gray-400 text-[10px] block mt-0.5">
              Last updated:{" "}
              {lastRefreshed.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Farm selector + refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="appearance-none bg-white border border-[#90a955]/30 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] transition-all cursor-pointer h-[38px] shadow-sm"
            >
              {USER_PROFILE.farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  🌾 {farm.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
          <button
            onClick={loadDashboard}
            title="Refresh data"
            className="h-[38px] w-[38px] flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-[#31572c]/40 hover:bg-[#f4f7f4] transition-all shadow-sm"
          >
            <RefreshCw size={15} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Farm Context Strip ── */}
      {selectedFarm && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Farm context:
          </span>
          <span className="bg-[#31572c]/8 text-[#31572c] text-[11px] font-bold px-2.5 py-1 rounded-lg">
            📍 {selectedFarm.location}
          </span>
          <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-lg">
            🌾 {selectedFarm.totalLand} acres
          </span>
          {selectedFarm.crops.map((c) => (
            <span
              key={c.name}
              className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-100"
            >
              {c.name} · {c.sownArea}ac
            </span>
          ))}
          {weatherData && (
            <span className="bg-sky-50 text-sky-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-sky-100 ml-auto">
              🌡 {weatherData.temperature}°C · 💧 {weatherData.humidity}% · 🌬{" "}
              {weatherData.windSpeed} km/h
            </span>
          )}
        </div>
      )}

      {loadingMain ? (
        <div className="space-y-6">
          <SkeletonBlock h="h-20" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonBlock key={i} h="h-28" />
            ))}
          </div>
          <SkeletonBlock h="h-[280px]" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonBlock key={i} h="h-24" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Critical Alert Banner ── */}
          {dashData?.criticalAlert && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1 flex-1">
                <h3 className="text-red-900 font-extrabold text-sm tracking-tight flex flex-wrap items-center gap-2">
                  Critical Outbreak Notification
                  <span className="bg-red-200 text-red-950 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                    {dashData.criticalAlert.probability}% Risk
                  </span>
                  <span className="bg-red-100 text-red-800 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                    {dashData.criticalAlert.crop}
                  </span>
                </h3>
                <p className="text-red-800 text-xs font-semibold leading-relaxed">
                  {dashData.criticalAlert.message}
                </p>
              </div>
            </div>
          )}

          {/* ── Metrics Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dashData?.metrics || {}).map(([key, value]) => {
              const cfg = getMetricConfig(key);
              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${cfg.iconBg}`}>
                      {cfg.icon}
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${cfg.badge}`}
                    >
                      {cfg.badgeLabel}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-gray-900 text-2xl font-black tracking-tight">
                      {value}
                    </h4>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mt-0.5">
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Today's Risk Summary Table ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                Today's Risk Summary
              </span>
              <span className="text-[10px] font-bold text-[#31572c] bg-[#31572c]/8 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                {selectedFarm?.crops.length} crop
                {selectedFarm?.crops.length !== 1 ? "s" : ""} ·{" "}
                {resolveDistrict(selectedFarm)}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[680px] table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3 pl-1 w-[160px]">Crop</th>
                    <th className="p-3 w-[160px]">Disease</th>
                    <th className="p-3 w-[110px]">Risk Level</th>
                    <th className="p-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/65">
                  {(dashData?.riskSummary || []).map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#f4f7f4]/40 transition-colors"
                    >
                      <td className="p-3.5 pl-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#31572c] shrink-0" />
                          <span className="text-xs font-bold text-gray-900">
                            {item.crop}
                          </span>
                          <span className="text-gray-400 text-[10px] font-medium font-hindi">
                            ({item.cropHindi})
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-xs font-bold text-gray-700">
                        {item.disease}
                      </td>
                      <td className="p-3.5">
                        <span className={getRiskRowBadge(item.riskLevel)}>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-600 font-medium text-xs leading-snug">
                        {item.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Weather Influence Cards ── */}
          <div>
            <span className="text-sm font-bold text-[#31572c] tracking-wide mb-3 block">
              Weather Influence on Disease Risk
              {rainfallData && (
                <span className="text-[10px] font-semibold text-gray-400 ml-2 normal-case">
                  · IMD rainfall: {rainfallData.actual_rain ?? "—"}mm
                </span>
              )}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(dashData?.weatherInfluence || []).map((w, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      {WEATHER_ICONS[w.parameter] || (
                        <Droplets size={14} className="text-[#31572c]" />
                      )}
                      {w.parameter}
                    </span>
                    <span
                      className={`text-xs font-black ${w.isDanger ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {w.variance}
                    </span>
                  </div>
                  <div className="mt-2 text-lg font-black text-gray-900">
                    {w.currentValue}
                  </div>
                  <p className="text-gray-500 text-xs mt-2 font-medium leading-relaxed">
                    {w.impact}
                  </p>
                  {w.isDanger && (
                    <div className="mt-2 w-full h-1 rounded-full bg-red-100">
                      <div
                        className="h-1 rounded-full bg-red-400"
                        style={{ width: "75%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── 4-Day Forecast Strip ── */}
          <div>
            <span className="text-sm font-bold text-gray-800 tracking-wide mb-3 block">
              Next 4-Day Disease Risk Forecast
            </span>
            {loadingForecast ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonBlock key={i} h="h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(forecastData?.forecast || []).map((day, idx) => {
                  const scoreColor = RISK_SCORE_COLOR(day.riskScore);
                  const TrendIcon =
                    day.riskScore >= 70
                      ? TrendingUp
                      : day.riskScore >= 45
                        ? Minus
                        : TrendingDown;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-gray-900">
                            {day.day}
                          </div>
                          <div className="text-[10px] text-gray-400 font-semibold">
                            {day.date}
                          </div>
                        </div>
                        <TrendIcon
                          size={16}
                          className={
                            day.riskScore >= 70
                              ? "text-red-500"
                              : day.riskScore >= 45
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xl font-black tabular-nums px-2 py-0.5 rounded-lg ${scoreColor}`}
                        >
                          {day.riskScore}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${RISK_LEVEL_BADGE(day.overallRisk)}`}
                        >
                          {day.overallRisk}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-semibold">
                        ⚠ {day.topThreat?.crop} — {day.topThreat?.disease}
                      </div>
                      <div className="text-[10px] text-gray-600 font-medium leading-snug border-t border-gray-100 pt-2">
                        {day.action}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
