import React from "react";
import {
  TrendingUp,
  LineChart,
  Columns,
  BarChart3,
  MapPin,
  Landmark,
  ArrowUpRight,
  Award,
} from "lucide-react";
import bannerImg from "../../assets/images/Commodity Market Intelligence.png";

export default function MarketIntelligenceDashboard() {
  const metrics = [
    {
      label: "Crops Tracked",
      value: "102",
      sub: "National scale",
      color: "text-[#31572c] bg-brand-dark/10",
    },
    {
      label: "Top Mandi Gain",
      value: "Mustard",
      sub: "+3.2% this week",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "National Volume",
      value: "1.2M Tons",
      sub: "Active exchanges",
      color: "text-sky-700 bg-sky-50",
    },
    {
      label: "Mandi Listings",
      value: "248",
      sub: "Haryana region",
      color: "text-amber-705 bg-amber-50",
    },
  ];

  const mandiPrices = [
    {
      mandi: "Faridabad APMC",
      crop: "Wheat (गेहूं)",
      price: "₹2,440",
      change: "+2.1%",
      volume: "450 Tons",
    },
    {
      mandi: "Palwal Grain Market",
      crop: "Rice (धान)",
      price: "₹2,420",
      change: "+1.8%",
      volume: "380 Tons",
    },
    {
      mandi: "Ballabhgarh Market",
      crop: "Mustard (सरसों)",
      price: "₹5,410",
      change: "+3.2%",
      volume: "120 Tons",
    },
    {
      mandi: "Hodal Mandi",
      crop: "Maize (मक्का)",
      price: "₹2,090",
      change: "+0.9%",
      volume: "290 Tons",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f4f7f4] to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 w-full md:w-2/3">
          <div>
            <div className="flex items-center gap-2.5">
              <TrendingUp className="h-6.5 w-6.5 text-[#31572c]" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
                <span>Commodity Market Intelligence</span>
                <span className="text-gray-300 font-light text-xl">|</span>
                <span className="text-[#31572c] font-bold text-sm md:text-base">
                  कमोडिटी बाजार खुफिया
                </span>
              </h1>
            </div>
            <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
              Track real-time Mandi transaction price indices and localized crop
              demand projections.
            </p>
          </div>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
          >
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">
              {m.label}
            </span>
            <div>
              <h4 className="text-gray-900 text-xl font-black tracking-tight">
                {m.value}
              </h4>
              <span
                className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 ${m.color}`}
              >
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mandi Prices & Yield Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Mandi Prices Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
            Best Mandi Prices — Haryana This Week
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3 pl-1">Mandi Name</th>
                  <th className="p-3">Crop</th>
                  <th className="p-3">Price / Qtl</th>
                  <th className="p-3 text-right pr-2">7-Day Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {mandiPrices.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#f4f7f4]/30 transition-colors text-xs font-semibold"
                  >
                    <td className="p-3 pl-1 text-gray-900 font-bold">
                      {item.mandi}
                    </td>
                    <td className="p-3 text-gray-550">{item.crop}</td>
                    <td className="p-3 text-emerald-700 font-black">
                      {item.price}
                    </td>
                    <td className="p-3 text-right pr-2 text-emerald-700 font-bold">
                      {item.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Key Mandi Highlights */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Landmark size={13} className="text-[#31572c]" />
            <span>Mandi Index Warnings</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-2.5">
              <ArrowUpRight
                size={18}
                className="text-[#31572c] shrink-0 mt-0.5"
              />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">
                  High Demand Alerts
                </span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed font-semibold">
                  Mustard crop matches high volume benchmarks; sell-out returns
                  expected.
                </span>
              </div>
            </div>

            <div className="bg-[#f4f7f4] border border-gray-150 p-3 rounded-xl flex gap-2.5">
              <Award size={18} className="text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-800 block">
                  MSP Price Guard
                </span>
                <span className="text-[11px] text-gray-550 block mt-0.5 leading-relaxed font-medium">
                  Haryana state MSP guarantees minimum ₹2,275 per Quintal Wheat
                  support levels.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
