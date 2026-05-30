import React from "react";
import { CloudSun, CloudRain, Droplets, Wind, ArrowUpRight, Award, Waves, AlertTriangle } from "lucide-react";

export default function WeatherReservoirDashboard() {
  const metrics = [
    { label: "Cumulative Rainfall", value: "142 mm", sub: "12% above average", color: "text-emerald-700 bg-emerald-50" },
    { label: "Reservoir Levels", value: "68.4%", sub: "Normal volume", color: "text-[#31572c] bg-[#31572c]/10" },
    { label: "Soil Moisture Index", value: "38.2%", sub: "Adequate moisture", color: "text-sky-700 bg-sky-50" },
    { label: "Evaporation Rate", value: "4.2 mm/day", sub: "Low loss", color: "text-amber-700 bg-amber-50" },
  ];

  const reservoirs = [
    { name: "Hathnikund Barrage (Yamunanagar)", level: "72.5%", status: "Normal Flow", inflow: "18,200 cusecs" },
    { name: "Kaushalya Dam (Panchkula)", level: "61.2%", status: "Steady", inflow: "2,100 cusecs" },
    { name: "Ottu Barrage (Sirsa)", level: "58.6%", status: "Moderate", inflow: "4,500 cusecs" },
    { name: "Tajewala Barrage", level: "81.3%", status: "Heavy Inflow", inflow: "22,000 cusecs" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <CloudSun className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Weather & Reservoir Intel</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              मौसम और जलाशय खुफिया
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Monitor real-time weather alerts, telemetry sensor feeds, and active reservoir volume ratings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">
              {m.label}
            </span>
            <div>
              <h4 className="text-gray-900 text-xl font-black tracking-tight">{m.value}</h4>
              <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 ${m.color}`}>
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reservoirs & Weather Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Reservoir Status Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
            Major Reservoir Status — Haryana Region
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3 pl-1">Reservoir / Dam</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right pr-2">Inflow / Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {reservoirs.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f4f7f4]/30 transition-colors text-xs font-semibold">
                    <td className="p-3 pl-1 text-gray-900 font-bold">{item.name}</td>
                    <td className="p-3 text-[#31572c] font-black">{item.level}</td>
                    <td className="p-3 text-gray-550">{item.status}</td>
                    <td className="p-3 text-right pr-2 text-slate-700 font-bold">{item.inflow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Weather Highlights */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Waves size={13} className="text-[#31572c]" />
            <span>Water Resource Guidelines</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-2.5">
              <CloudRain size={18} className="text-[#31572c] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">Precipitation Warning</span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed font-semibold">
                  Light-to-medium rain showers predicted next Tuesday. Delay scheduled sprinkler runs.
                </span>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex gap-2.5">
              <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-900 block">Silt Accumulation</span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed font-medium">
                  Ottu Barrage reported minor siltation spikes. High filtration recommended for tube-wells.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
