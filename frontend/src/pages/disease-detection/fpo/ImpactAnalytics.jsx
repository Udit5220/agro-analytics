// PAGE 8 — Impact Analytics
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/ImpactAnalytics.jsx

import React, { useState } from "react";
import { 
  BarChart, TrendingUp, ShieldCheck, DollarSign, 
  ArrowUpRight, ArrowDownRight, Award, Map, Sprout 
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";

export default function ImpactAnalytics() {
  const [activeTrendTab, setActiveTrendTab] = useState("Seasonal"); // Monthly | Seasonal | Yearly

  // Side-by-side Rankings lists
  const damagingDiseases = [
    { name: "Rice Blast", lost: "1,200 ac", lossPct: 65 },
    { name: "Yellow Rust", lost: "850 ac", lossPct: 48 },
    { name: "Late Blight", lost: "520 ac", lossPct: 32 }
  ];

  const affectedCrops = [
    { name: "Rice (Paddy)", farmers: 450, countPct: 80 },
    { name: "Wheat", farmers: 320, countPct: 60 },
    { name: "Potato", farmers: 180, countPct: 35 }
  ];

  const vulnerableVillages = [
    { name: "Kharindwa Block", loss: "14.2%", lossPct: 88 },
    { name: "Bhucho Mandi", loss: "9.5%", lossPct: 62 },
    { name: "Raman Cluster", loss: "7.8%", lossPct: 48 }
  ];

  // Treatment performance records
  const performance = [
    { disease: "Rice Blast", success: "92%", avgRecovery: "12 Days", successRate: 92 },
    { disease: "Yellow Rust", success: "88%", avgRecovery: "14 Days", successRate: 88 },
    { disease: "Late Blight", success: "95%", avgRecovery: "10 Days", successRate: 95 },
    { disease: "Downy Mildew", success: "85%", avgRecovery: "18 Days", successRate: 85 }
  ];  return (
    <div className="space-y-5 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title */}
      <div>
        <h1 className="text-lg font-black text-[#132a13] tracking-tight">Campaign Impact & ROI Analytics</h1>
        <p className="text-slate-505 text-[10px] font-bold mt-0.5">
          Monitor yield volume losses prevented, total net revenue savings, and treatment campaign efficiency rates.
        </p>
      </div>

      {/* Stats summaries cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Yield Loss Prevented"
          value="1,840 tons"
          trend="High efficiency"
          trendType="success"
          subtext="Fungicide drive success"
          icon={<ShieldCheck className="text-[#31572c]" />}
        />
        <StatsCard
          title="Revenue Saved"
          value="₹42,50,000"
          trend="8.8x leverage"
          trendType="success"
          subtext="FPO market protection"
          icon={<DollarSign className="text-[#31572c]" />}
        />
        <StatsCard
          title="Treatment Cost"
          value="₹4,80,000"
          trend="12% budget"
          trendType="neutral"
          subtext="Chemical & labor inputs"
          icon={<DollarSign className="text-[#31572c]" />}
        />
        <StatsCard
          title="Net Campaign Benefit"
          value="₹37,70,000"
          trend="Net positive"
          trendType="success"
          subtext="Overall FPO value creation"
          icon={<Award className="text-[#31572c]" />}
        />
        <StatsCard
          title="Financial ROI %"
          value="785%"
          trend="Top tier ROI"
          trendType="success"
          subtext="Return on treatment spend"
          icon={<TrendingUp className="text-[#31572c]" />}
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Yield Impact chart (SVG) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
            <BarChart className="w-3.5 h-3.5 text-[#31572c]" /> Prevented vs Actual Yield Loss (Tons)
          </h3>

          <div className="h-44 relative w-full pt-3">
            <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
              <line x1="20" y1="10" x2="480" y2="10" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="110" x2="480" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Grouped bars per crop: Expected, Actual, Prevented */}
              {[
                { crop: "Rice", expected: 120, actual: 40, prevented: 80 },
                { crop: "Wheat", expected: 90, actual: 30, prevented: 60 },
                { crop: "Potato", expected: 70, actual: 15, prevented: 55 },
                { crop: "Mustard", expected: 50, actual: 10, prevented: 40 }
              ].map((c, idx) => {
                const x = 30 + (idx * 115);
                const hExp = c.expected * 0.75;
                const hAct = c.actual * 0.75;
                const hPrev = c.prevented * 0.75;

                return (
                  <g key={idx}>
                    {/* Expected (Red bar) */}
                    <rect x={x} y={110 - hExp} width="12" height={hExp} fill="#ef4444" opacity="0.8" rx="2" />
                    {/* Actual (Amber bar) */}
                    <rect x={x + 14} y={110 - hAct} width="12" height={hAct} fill="#f59e0b" opacity="0.8" rx="2" />
                    {/* Prevented (Green bar) */}
                    <rect x={x + 28} y={110 - hPrev} width="12" height={hPrev} fill="#31572c" opacity="0.85" rx="2" />
                    {/* Label */}
                    <text x={x + 6} y="118" fill="#94a3b8" fontSize="8" fontWeight="bold">{c.crop}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-center gap-5 text-[8.5px] font-black uppercase text-slate-500 pt-0.5">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-red-500" /> Expected Loss</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-amber-500" /> Actual Loss</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded bg-brand-dark" /> Prevented Loss</span>
          </div>
        </div>

        {/* Economic impact breakdown stacked visual */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest pb-1.5 border-b border-slate-100">
            Net Campaign ROI Breakdown
          </h3>

          <div className="space-y-4 text-[10px] font-semibold text-slate-700">
            {/* Visual stacked gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-[10px]">
                <span>Financial Net Benefits:</span>
                <span className="text-[#31572c]">₹37,70,000 Saved</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-red-500">
                {/* Green represent saved segment */}
                <div className="h-full bg-brand-dark" style={{ width: "88%" }} />
              </div>
              <div className="flex justify-between text-[7.5px] font-black uppercase tracking-wider text-slate-450">
                <span>Revenue Saved (88%)</span>
                <span>Campaign Cost (12%)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100/60 rounded-xl space-y-1">
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">Operational Highlight</span>
              <p className="leading-relaxed text-[9.5px]">
                Preventative fungicides splits limited rust pathogen spore drifting, yielding an average ROI multiplier of 8.8x on FPO capital outlays.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Side-by-side Rankings list panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Most Damaging Diseases */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4.5 space-y-3">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-red-500" /> Damaging Pathogens
          </h3>
          <div className="space-y-3 text-[10px] font-bold text-slate-705">
            {damagingDiseases.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span>{d.name}</span>
                  <span className="text-red-655">{d.lost} Affected</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${d.lossPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Affected Crops */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4.5 space-y-3">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-amber-500" /> Most Affected Crops
          </h3>
          <div className="space-y-3 text-[10px] font-bold text-slate-705">
            {affectedCrops.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="text-amber-600">{c.farmers} Growers</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${c.countPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Vulnerable Villages */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4.5 space-y-3">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-[#31572c]" /> Vulnerable Villages
          </h3>
          <div className="space-y-3 text-[10px] font-bold text-slate-705">
            {vulnerableVillages.map((v, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span>{v.name}</span>
                  <span className="text-[#31572c]">{v.loss} Yield Loss</span>
                </div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-brand-dark" style={{ width: `${v.lossPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Treatment performance registry */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest pb-1.5 border-b border-slate-100">
          Pathogen Treatment Recovery Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-2">Disease Targeted</th>
                <th className="py-2">Success Rating %</th>
                <th className="py-2 text-center">Avg Recovery Period</th>
                <th className="py-2 text-right">Containment Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
              {performance.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 text-slate-900">{item.disease}</td>
                  <td className="py-3 w-40">
                    <div className="space-y-1">
                      <span>{item.success}</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-brand-dark" style={{ width: `${item.successRate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center text-slate-500">{item.avgRecovery}</td>
                  <td className="py-3 text-right text-emerald-600 flex items-center justify-end gap-1 font-black">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Improving
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
