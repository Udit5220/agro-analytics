import React from "react";
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
} from "lucide-react";

export default function PestDiseaseDashboard() {
  const summaryMetrics = [
    {
      title: "Active Alerts",
      value: "7",
      level: "High",
      levelColor: "text-red-650 bg-red-100/30",
      icon: <AlertTriangle className="h-4.5 w-4.5" />,
      iconBg: "bg-red-100/50 text-red-650",
    },
    {
      title: "Crops Monitored",
      value: "9",
      level: "Active",
      levelColor: "text-[#31572c] bg-[#31572c]/10",
      icon: <Sprout className="h-4.5 w-4.5" />,
      iconBg: "bg-[#31572c]/10 text-[#31572c]",
    },
    {
      title: "Districts Covered",
      value: "14",
      level: "Regions",
      levelColor: "text-sky-700 bg-sky-100/30",
      icon: <MapPin className="h-4.5 w-4.5" />,
      iconBg: "bg-sky-100 text-sky-700",
    },
    {
      title: "Alerts Sent Today",
      value: "34",
      level: "Live SMS",
      levelColor: "text-amber-705 bg-amber-100/30",
      icon: <Activity className="h-4.5 w-4.5" />,
      iconBg: "bg-amber-100 text-amber-705",
    },
  ];

  const risks = [
    {
      crop: "Wheat",
      hindiCrop: "(गेहूं)",
      disease: "Yellow Rust",
      level: "High Risk",
      badgeStyle: "bg-red-100 text-red-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]",
      action: "Apply fungicide immediately — Propiconazole 0.1%",
    },
    {
      crop: "Rice",
      hindiCrop: "(धान)",
      disease: "Blast Disease",
      level: "High Risk",
      badgeStyle: "bg-red-100 text-red-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]",
      action: "Spray Tricyclazole 75 WP @ 300g/acre",
    },
    {
      crop: "Cotton",
      hindiCrop: "(कपास)",
      disease: "Whitefly",
      level: "Moderate Risk",
      badgeStyle: "bg-amber-100 text-amber-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]",
      action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
    },
    {
      crop: "Maize",
      hindiCrop: "(मक्का)",
      disease: "Leaf Blight",
      level: "Low Risk",
      badgeStyle: "bg-emerald-100 text-emerald-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]",
      action: "Preventive copper fungicide spray recommended",
    },
    {
      crop: "Mustard",
      hindiCrop: "(सरसों)",
      disease: "Alternaria Blight",
      level: "Moderate Risk",
      badgeStyle: "bg-amber-100 text-amber-955 font-bold px-2.5 py-0.5 rounded-full text-[10px]",
      action: "Seed treatment with Thiram; field monitoring twice weekly",
    },
  ];

  const weatherInfluence = [
    {
      label: "Humidity 78%",
      variance: "↑ +18%",
      isDanger: true,
      desc: "High humidity accelerates fungal spread",
      icon: <Droplets size={14} className="text-[#31572c]" />,
    },
    {
      label: "Temperature 29°C",
      variance: "↑ +8%",
      isDanger: true,
      desc: "Warm nights favor pathogen growth",
      icon: <Thermometer size={14} className="text-[#31572c]" />,
    },
    {
      label: "Wind 6 km/h",
      variance: "↓ -5%",
      isDanger: false,
      desc: "Low wind reduces spore dispersal",
      icon: <Wind size={14} className="text-[#31572c]" />,
    },
    {
      label: "Rainfall 2mm",
      variance: "↑ +12%",
      isDanger: true,
      desc: "Recent rain creates leaf wetness — high blast risk",
      icon: <CloudRain size={14} className="text-[#31572c]" />,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      
      {/* 1. Page Header Introduction */}
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

      {/* 2. High Blast Risk Critical Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="h-5 w-5 text-red-650 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <h3 className="text-red-900 font-extrabold text-sm tracking-tight flex items-center gap-2">
            Critical Outbreak Notification
            <span className="bg-red-200 text-red-950 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
              High Risk Alert
            </span>
          </h3>
          <p className="text-red-800 text-xs font-semibold leading-relaxed">
            High Blast Risk in Your Region This Week — Faridabad district — Rice Blast (Pyricularia oryzae) — Probability 74%. Immediate fungicide application advised.
          </p>
        </div>
      </div>

      {/* 3. Summary Metric Grid Blocks (4 Columns) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl ${metric.iconBg}`}>
                {metric.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${metric.levelColor}`}>
                {metric.level}
              </span>
            </div>
            <div>
              <h4 className="text-gray-900 text-2xl font-black tracking-tight">{metric.value}</h4>
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mt-0.5">
                {metric.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. "Today's Risk Summary" Tabular Sheet Ledger */}
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
              {risks.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f4f7f4]/35 transition-colors">
                  <td className="p-3.5 pl-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#31572c] shrink-0" />
                    <span className="text-xs font-bold text-gray-900">{item.crop}</span>
                    <span className="text-gray-500 text-xs font-medium pl-1 font-hindi">{item.hindiCrop}</span>
                  </td>
                  <td className="p-3.5 text-xs font-bold text-gray-700">{item.disease}</td>
                  <td className="p-3.5">
                    <span className={item.badgeStyle}>
                      {item.level}
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

      {/* 5. "Weather Influence on Disease Risk" KPI Row */}
      <div>
        <span className="text-sm font-bold text-[#31572c] tracking-wide mt-6 mb-3 block">
          Weather Influence on Disease Risk
        </span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {weatherInfluence.map((w, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4.5 border border-gray-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  {w.icon}
                  {w.label}
                </span>
                <span className={`text-xs font-black flex items-center ${w.isDanger ? "text-red-600" : "text-emerald-650"}`}>
                  {w.variance}
                </span>
              </div>
              <p className="text-gray-655 text-xs mt-3 font-medium leading-relaxed">
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
