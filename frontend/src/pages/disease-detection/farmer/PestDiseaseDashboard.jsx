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
// import { getDashboardData } from "../../../services/diseaseGeminiService";

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
//           iconBg: "bg-brand-dark/10 text-[#31572c]",
//           levelColor: "text-[#31572c] bg-brand-dark/10",
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
//                         <span className="w-1.5 h-1.5 rounded-full bg-brand-dark shrink-0" />
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
import { useNavigate } from "react-router-dom";
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
} from "../../../services/diseaseGeminiService";

const DEFAULT_ALERTS = [
  {
    id: "alert-1",
    crop: "Rice (Paddy)",
    disease: "Rice Blast",
    severity: "High",
    message: "Sustained humidity (85%) in Faridabad has increased blast pathogen spore concentrations. Spot checks recommended.",
    source: "AI Forecast",
    timestamp: "Today",
    date: "2026-06-04",
    resolved: false,
  },
  {
    id: "alert-2",
    crop: "Wheat",
    disease: "Yellow Rust",
    severity: "Critical",
    message: "State Department of Agriculture released warning for airborne yellow rust spores in Faridabad boundary fields.",
    source: "Government",
    timestamp: "Today",
    date: "2026-06-04",
    resolved: false,
  },
  {
    id: "alert-3",
    crop: "Mustard",
    disease: "Alternaria Blight",
    severity: "Moderate",
    message: "Satellite imaging detected vegetation moisture index anomalies indicating potential leaf spot spread.",
    source: "Satellite",
    timestamp: "Yesterday",
    date: "2026-06-03",
    resolved: false,
  },
];

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
  const navigate = useNavigate();
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

  const [localAlerts, setLocalAlerts] = useState([]);
  const [localScans, setLocalScans] = useState([]);
  const [localReminders, setLocalReminders] = useState([]);

  useEffect(() => {
    const loadLocalData = () => {
      const storedAlerts = localStorage.getItem("diseaseAlerts");
      const storedScans = localStorage.getItem("recentScans");
      const storedReminders = localStorage.getItem("activeReminders");

      try {
        if (storedAlerts) {
          setLocalAlerts(JSON.parse(storedAlerts));
        } else {
          localStorage.setItem("diseaseAlerts", JSON.stringify(DEFAULT_ALERTS));
          setLocalAlerts(DEFAULT_ALERTS);
        }
      } catch (e) {
        setLocalAlerts([]);
      }

      try {
        if (storedScans) {
          setLocalScans(JSON.parse(storedScans));
        } else {
          setLocalScans([]);
        }
      } catch (e) {
        setLocalScans([]);
      }

      try {
        if (storedReminders) {
          setLocalReminders(JSON.parse(storedReminders));
        } else {
          setLocalReminders([]);
        }
      } catch (e) {
        setLocalReminders([]);
      }
    };

    loadLocalData();
    window.addEventListener("focus", loadLocalData);
    return () => window.removeEventListener("focus", loadLocalData);
  }, [selectedFarmId]);

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
        iconBg: "bg-brand-dark/10 text-[#31572c]",
        badge: "bg-brand-dark/10 text-[#31572c]",
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
                  {farm.name}
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
          <span className="bg-brand-dark/8 text-[#31572c] text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#31572c]" />
            {selectedFarm.location}
          </span>
          <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-gray-500" />
            {selectedFarm.totalLand} acres
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
            <span className="bg-sky-50 text-sky-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-sky-100 ml-auto flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                {weatherData.temperature}°C
              </span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                {weatherData.humidity}%
              </span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Wind className="w-3.5 h-3.5 text-sky-600" />
                {weatherData.windSpeed} km/h
              </span>
            </span>
          )}
        </div>
      )}

      {loadingMain ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-6 text-center animate-fadeIn py-12">
          {/* Elegant Circular Progress Loader */}
          <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
            {/* Outer spinning dash ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#31572c] animate-spin" style={{ animationDuration: '3s' }} />
            {/* Inner pulsing circle */}
            <div className="absolute h-13 w-13 rounded-full bg-[#f4f7f4]/60 dark:bg-brand-dark/10 flex items-center justify-center shadow-md animate-pulse">
              <Activity className="h-6.5 w-6.5 text-[#31572c] dark:text-[#ecf39e]" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Syncing Crop Health Data
            </h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
              Contacting live weather sensors and running AI epidemiological risk assessment models...
            </p>
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

          {/* ── New Executive Farm Health Overview Section ── */}
          {(() => {
            const activeAlerts = localAlerts.filter((a) => !a.resolved);
            let healthScore = 100;
            activeAlerts.forEach((a) => {
              if (a.severity === "Critical") healthScore -= 15;
              else if (a.severity === "High") healthScore -= 10;
              else if (a.severity === "Moderate") healthScore -= 5;
              else healthScore -= 2;
            });
            healthScore = Math.max(20, healthScore);

            const criticalAlertsCount = activeAlerts.filter((a) => a.severity === "Critical").length;
            const highAlertsCount = activeAlerts.filter((a) => a.severity === "High").length;
            const moderateAlertsCount = activeAlerts.filter((a) => a.severity === "Moderate").length;
            const lowAlertsCount = activeAlerts.filter((a) => a.severity === "Low").length;

            const sortedAlerts = [...activeAlerts].sort((a, b) => {
              const weight = { "Critical": 4, "High": 3, "Moderate": 2, "Low": 1 };
              return (weight[b.severity] || 0) - (weight[a.severity] || 0);
            });
            const topThreat = sortedAlerts[0] || null;

            const upcomingSpray = localReminders.find((r) => !r.completed);

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
                
                {/* Farm Health Score Card */}
                <div className="bg-white border border-slate-200 dark:border-brand-dark/20 dark:bg-brand-darkest rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Farm Health Score</span>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                          <defs>
                            <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#90a955" />
                              <stop offset="100%" stopColor="#31572c" />
                            </linearGradient>
                          </defs>
                          <circle cx="40" cy="40" r="32" stroke="#e6eee6" strokeWidth="6" fill="transparent" />
                          <circle cx="40" cy="40" r="32" stroke={healthScore >= 80 ? "url(#healthGrad)" : healthScore >= 50 ? "#d97706" : "#dc2626"} strokeWidth="6" fill="transparent" strokeDasharray={200} strokeDashoffset={200 - (200 * healthScore) / 100} strokeLinecap="round" className="transition-all duration-500" />
                        </svg>
                        <span className="absolute text-base font-black dark:text-white leading-none mt-0.5">{healthScore}%</span>
                      </div>
                      <div>
                        <span className="text-xs font-black text-gray-800 dark:text-white block">
                          {healthScore >= 90 ? "Excellent Condition" : healthScore >= 70 ? "Moderate Risks Active" : "Critical Actions Needed"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">Calculated from {activeAlerts.length} unresolved alerts</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 dark:border-brand-dark/10 pt-3 mt-4">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Alert Summary</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[10px] font-black px-2 py-0.5 rounded border border-red-100 dark:border-red-900/50">Critical: {criticalAlertsCount}</span>
                      <span className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 text-[10px] font-black px-2 py-0.5 rounded border border-orange-100 dark:border-orange-900/50">High: {highAlertsCount}</span>
                      <span className="bg-amber-50 dark:bg-amber-950/20 text-[#9a3412] dark:text-amber-400 text-[10px] font-black px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/50">Mod: {moderateAlertsCount}</span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50">Low: {lowAlertsCount}</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation & Top Threat Card */}
                <div className="bg-white border border-slate-200 dark:border-brand-dark/20 dark:bg-brand-darkest rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Top Threat Today</span>
                    {topThreat ? (
                      <div className="mt-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black bg-red-100 dark:bg-red-950/25 text-red-800 dark:text-red-400 px-2 py-0.5 rounded uppercase">
                            {topThreat.severity}
                          </span>
                          <span className="text-xs font-black text-gray-900 dark:text-white">{topThreat.crop}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-250 mt-1">{topThreat.disease}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">Expected Impact: {topThreat.severity === "Critical" ? "High Yield Loss Risk (15-30%)" : "Moderate Risk (5-15%)"}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-3 font-semibold">No active threats detected. Farm environment is stable.</p>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-brand-dark/10 pt-3 mt-4 bg-emerald-50/20 dark:bg-brand-dark/10 rounded-xl p-2.5 border border-emerald-100/40 dark:border-brand-dark/30">
                    <span className="text-[9px] font-black text-[#31572c] dark:text-[#ecf39e] uppercase tracking-widest block mb-1">AI Recommendation</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold leading-normal">
                      {topThreat ? (
                        topThreat.disease.includes("Blast")
                          ? "Apply preventive fungicide within 3 days. High humidity may increase blast risk. Monitor southern field section."
                          : topThreat.disease.includes("Rust")
                            ? "Airborne rust spores detected. Spray Propiconazole 0.1% or Tricyclazole 75 WP immediately."
                            : "Outbreak warning active. Check Treatment Advisor to execute crop recovery spray schedule."
                      ) : "Weather variables indicate low pressure. Maintain standard 5-day scanner checks."}
                    </p>
                  </div>
                </div>

                {/* Spray Window & Weather Correlation Card */}
                <div className="bg-white border border-slate-200 dark:border-brand-dark/20 dark:bg-brand-darkest rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Upcoming Spray Window</span>
                    {upcomingSpray ? (
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-400">Scheduled:</span>
                          <span className="text-slate-800 dark:text-white">{upcomingSpray.scheduledDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-400">Operation:</span>
                          <span className="text-[#31572c] dark:text-[#ecf39e]">{upcomingSpray.disease} Spray</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-400">Weather suitability:</span>
                          <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.25 rounded text-[9px]">{upcomingSpray.weatherCondition}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-400">Wind conditions:</span>
                          <span className="text-slate-600 dark:text-slate-300">{upcomingSpray.windLimit}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2.5 text-xs text-gray-400 italic font-semibold">
                        No spray operation scheduled.
                        <button onClick={() => navigate("/module/disease-detection/treatment")} className="text-[#31572c] dark:text-[#ecf39e] font-black underline uppercase text-[9px] block mt-1 hover:text-black">
                          Schedule Spray Operation &rarr;
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-brand-dark/10 pt-3 mt-4 space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-sans">Weather-Disease Correlation</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                      <div className="bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-1.5 text-center">
                        <span className="text-blue-700 dark:text-blue-400 block font-black">Humidity ↑</span>
                        <span className="text-gray-500 dark:text-slate-400 block font-normal text-[9px] mt-0.5">Disease Risk ↑</span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-1.5 text-center">
                        <span className="text-amber-700 dark:text-amber-400 block font-black">Wind Speed ↓</span>
                        <span className="text-gray-500 dark:text-slate-400 block font-normal text-[9px] mt-0.5">Spore Loading ↑</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ── Recent Scan Results Card Section ── */}
          <div className="bg-white border border-slate-200 dark:border-brand-dark/20 dark:bg-brand-darkest rounded-2xl p-5 shadow-sm space-y-3.5 my-6 text-left hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-brand-dark/10 pb-2.5">
              <h3 className="text-sm font-black text-gray-800 dark:text-white tracking-wide">
                Recent Leaf Scan Diagnostic Records
              </h3>
              <button onClick={() => navigate("/module/disease-detection/leaf-scanner")} className="text-[10px] font-black text-[#31572c] dark:text-[#ecf39e] hover:underline uppercase">
                Launch Leaf Scanner &rarr;
              </button>
            </div>
            
            {localScans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {localScans.slice(0, 3).map((scan, i) => (
                  <div key={scan.id || i} className="bg-slate-50 dark:bg-brand-dark/5 border border-slate-200 dark:border-brand-dark/25 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] bg-slate-200 dark:bg-brand-dark/20 text-slate-800 dark:text-slate-200 font-black uppercase px-2 py-0.5 rounded">{scan.crop}</span>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white mt-1.5">{scan.disease_name}</h4>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${scan.severity === "Severe" || scan.severity === "Critical" ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50" : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"}`}>
                        {scan.severity || "Moderate"}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-slate-400 font-bold leading-relaxed bg-white dark:bg-brand-darkest p-2 rounded-lg border border-slate-100 dark:border-brand-dark/10">
                      {scan.why_it_happened || "Analysis complete."}
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                      <span>Recovery Chance: <b className="text-slate-700 dark:text-slate-200">{scan.recovery_probability || "85%"}</b></span>
                      <span>{scan.date || "Just now"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs italic font-semibold">
                No recent scans. Use Leaf Scanner to analyze leaf health and diagnose potential pathogens.
              </div>
            )}
          </div>

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
              <span className="text-[10px] font-bold text-[#31572c] bg-brand-dark/8 px-2.5 py-1 rounded-lg uppercase tracking-wide">
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
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-dark shrink-0" />
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
                      <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{day.topThreat?.crop} — {day.topThreat?.disease}</span>
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
