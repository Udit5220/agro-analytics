import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { getDashboardData } from "../../services/diseaseGeminiService";

const DISTRICT_LIST = [
  "Faridabad", "Gurugram", "Hisar", "Karnal", "Panipat", "Rohtak",
  "Sonipat", "Ambala", "Yamunanagar", "Kurukshetra", "Palwal", "Nuh"
];

const WEATHER_ICONS = {
  Humidity: <Droplets size={14} className="text-[#31572c]" />,
  Temperature: <Thermometer size={14} className="text-[#31572c]" />,
  Wind: <Wind size={14} className="text-[#31572c]" />,
  Rainfall: <CloudRain size={14} className="text-[#31572c]" />
};

export default function PestDiseaseDashboard() {
  const [district, setDistrict] = useState("Faridabad");
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadData = async () => {
      const result = await getDashboardData(district, "Haryana");
      if (active) {
        setDashData(result);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [district]);

  // Bind metrics mapping icons dynamically
  const getMetricIcon = (title) => {
    switch (title) {
      case "Active Alerts":
        return {
          icon: <AlertTriangle className="h-4.5 w-4.5" />,
          iconBg: "bg-red-100/50 text-red-655",
          levelColor: "text-red-655 bg-red-100/30",
          level: "High"
        };
      case "Crops Monitored":
        return {
          icon: <Sprout className="h-4.5 w-4.5" />,
          iconBg: "bg-[#31572c]/10 text-[#31572c]",
          levelColor: "text-[#31572c] bg-[#31572c]/10",
          level: "Active"
        };
      case "Districts Covered":
        return {
          icon: <MapPin className="h-4.5 w-4.5" />,
          iconBg: "bg-sky-100 text-sky-700",
          levelColor: "text-sky-700 bg-sky-100/30",
          level: "Regions"
        };
      case "Alerts Sent Today":
      default:
        return {
          icon: <Activity className="h-4.5 w-4.5" />,
          iconBg: "bg-amber-100 text-amber-705",
          levelColor: "text-amber-705 bg-amber-100/30",
          level: "Live SMS"
        };
    }
  };

  const getRiskBadgeStyle = (level) => {
    if (level === "High") {
      return "bg-red-100 text-red-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]";
    } else if (level === "Moderate") {
      return "bg-amber-100 text-amber-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]";
    }
    return "bg-emerald-100 text-emerald-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]";
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      
      {/* 1. Page Header with District selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-6.5 w-6.5 text-[#31572c]" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
              <span>Pest & Disease Risk Dashboard</span>
              <span className="text-gray-300 font-light text-xl">|</span>
              <span className="text-[#31572c] font-bold text-sm md:text-base">
                जोखिम नियंत्रण
              </span>
            </h1>
          </div>
          <span className="text-gray-500 text-[11px] font-semibold tracking-wide block pb-1 mt-1.5 uppercase">
            Live disease risk intelligence for your region
          </span>
        </div>

        {/* Region selector Dropdown */}
        <div className="relative">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="appearance-none bg-white border border-[#90a955]/30 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] transition-all cursor-pointer h-[38px] shadow-sm select-none"
          >
            {DISTRICT_LIST.map((dist) => (
              <option key={dist} value={dist}>Region: {dist}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        // ─── SKELETON LOADER SENSORS CANVASES ───
        <div className="space-y-6">
          <div className="h-20 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-28 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
          <div className="h-[280px] bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-24 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        // ─── DYNAMIC METRICS POPULATE CANVASES ───
        <>
          {/* 2. Critical Alert Banner */}
          {dashData?.criticalAlert && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-red-650 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-red-900 font-extrabold text-sm tracking-tight flex items-center gap-2">
                  Critical Outbreak Notification
                  <span className="bg-red-200 text-red-950 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                    {dashData.criticalAlert.probability}% Risk Alert
                  </span>
                </h3>
                <p className="text-red-800 text-xs font-semibold leading-relaxed">
                  {dashData.criticalAlert.message}
                </p>
              </div>
            </div>
          )}

          {/* 3. Summary Metric Grid Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(dashData?.metrics || {}).map((key, idx) => {
              const titles = {
                activeAlerts: "Active Alerts",
                cropsMonitored: "Crops Monitored",
                districtsCovered: "Districts Covered",
                alertsSentToday: "Alerts Sent Today"
              };
              const title = titles[key] || key;
              const value = dashData.metrics[key];
              const styles = getMetricIcon(title);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${styles.iconBg}`}>
                      {styles.icon}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${styles.levelColor}`}>
                      {styles.level}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-gray-900 text-2xl font-black tracking-tight">{value}</h4>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mt-0.5">
                      {title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Risk Summary Table Sheet Ledger */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
            <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
              Today's Risk Summary
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px] table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3 pl-1 w-[160px]">Crop</th>
                    <th className="p-3 w-[150px]">Disease</th>
                    <th className="p-3 w-[120px]">Risk Level</th>
                    <th className="p-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/65">
                  {(dashData?.riskSummary || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#f4f7f4]/35 transition-colors">
                      <td className="p-3.5 pl-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#31572c] shrink-0" />
                        <span className="text-xs font-bold text-gray-900">{item.crop}</span>
                        <span className="text-gray-500 text-xs font-medium pl-1 font-hindi">({item.cropHindi || item.crop})</span>
                      </td>
                      <td className="p-3.5 text-xs font-bold text-gray-700">{item.disease}</td>
                      <td className="p-3.5">
                        <span className={getRiskBadgeStyle(item.riskLevel)}>
                          {item.riskLevel} Risk
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-700 font-medium text-xs">
                        {item.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Weather Influence on Disease Risk */}
          <div>
            <span className="text-sm font-bold text-[#31572c] tracking-wide mt-6 mb-3 block">
              Weather Influence on Disease Risk
            </span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(dashData?.weatherInfluence || []).map((w, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4.5 border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      {WEATHER_ICONS[w.parameter] || <Droplets size={14} className="text-[#31572c]" />}
                      {w.parameter} {w.currentValue}
                    </span>
                    <span className={`text-xs font-black flex items-center ${w.isDanger ? "text-red-600" : "text-emerald-650"}`}>
                      {w.variance}
                    </span>
                  </div>
                  <p className="text-gray-655 text-xs mt-3 font-medium leading-relaxed">
                    {w.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
