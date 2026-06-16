import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import { 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  ShieldCheck, 
  Percent, 
  Zap,
  ArrowRight 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const {
  beforeAfterData,
  transitionImpact,
  stabilityVariance,
  chainKpis
} = seededData.cropRecommendation1.company.supplyChainPerformance;

// Before vs After data dataset by crop
const getBeforeAfterData = (commodity) => {
  return beforeAfterData[commodity] || beforeAfterData["Wheat"];
};

// Yield impact of crop transitions dataset by crop
const getTransitionImpact = (commodity) => {
  return transitionImpact[commodity] || transitionImpact["Wheat"];
};

// Weekly supply stability variance dataset by crop
const getStabilityVariance = (commodity) => {
  return stabilityVariance[commodity] || stabilityVariance["Wheat"];
};

// Chain Performance KPIs dataset by crop
const getChainKpis = (commodity) => {
  return chainKpis[commodity] || chainKpis["Wheat"];
};

export default function CompanySupplyChainPerformance() {
  const [selectedCommodity, setSelectedCommodity] = useState(() => {
    return localStorage.getItem("company_selectedCommodity") || "Wheat";
  });
  const [selectedZone, setSelectedZone] = useState(() => {
    return localStorage.getItem("company_selectedZone") || "All India";
  });

  const handleSetCommodity = (val) => {
    setSelectedCommodity(val);
    localStorage.setItem("company_selectedCommodity", val);
  };

  const handleSetZone = (val) => {
    setSelectedZone(val);
    localStorage.setItem("company_selectedZone", val);
  };

  const beforeAfterData = getBeforeAfterData(selectedCommodity);
  const transitionImpact = getTransitionImpact(selectedCommodity);
  const stabilityVariance = getStabilityVariance(selectedCommodity);
  const kpis = getChainKpis(selectedCommodity);

  const pdfHeaders = ["Metric Evaluated", "Before Adoption", "After System Recommendations", "Net Performance Boost"];
  const tableDataForPdf = beforeAfterData.map(b => {
    const change = b.before !== 0 ? ((b.after - b.before) / b.before * 100).toFixed(1) : "0.0";
    return [b.metric, b.before, b.after, `${change}%`];
  });

  return (
    <CompanyLayout
      pageName="Supply Chain Performance Intelligence"
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={handleSetCommodity}
      selectedZone={selectedZone}
      setSelectedZone={handleSetZone}
      pdfHeaders={pdfHeaders}
      tableDataForPdf={tableDataForPdf}
      kpiStrip={
        <>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Supply Improvement</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.supply} Tonnage</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">▲ Stabilization index verified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Yield Improvement</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.yield} Output</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Across contracted farmers</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Percent className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Procurement Efficiency</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.sla} SLA Match</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Logistics delivery time reduced</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Revenue Impact</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.revenue} Added</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Sourcing margins optimized</span>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Before vs After Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Before vs After Adoption Matrix</h2>
            <p className="text-[10px] font-medium text-slate-500">Corporate sourcing performance indicators before platform adoption vs after recommendations</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="metric" tick={{ fontSize: 9, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Bar dataKey="before" fill="#94a3b8" name="Before System Adoption" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" fill="#10b981" name="After Platform Recommendations" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Supply Stability Area Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Weekly Supply Stability Analysis</h2>
            <p className="text-[10px] font-medium text-slate-500">Weekly supply volume variance (MT) smoothing effect post-recommendations</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stabilityVariance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Area type="monotone" dataKey="beforeRec" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.2} name="Weekly Vol Before Recommendations" />
                <Area type="monotone" dataKey="afterRec" stroke="#10b981" fill="#a7f3d0" fillOpacity={0.4} name="Weekly Vol After Recommendations" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yield Impact Analysis (Crop Transitions) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Crop Transition Yield Impact Analysis</h2>
            <p className="text-[10px] font-medium text-slate-500">Financial and natural resource impact of transition recommendations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {transitionImpact.map((item, index) => (
              <div key={index} className="border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 transition relative overflow-hidden">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800 text-xs">
                  {item.transition}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-semibold text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Water Saved</span>
                    <span className="font-extrabold text-emerald-700">{item.waterSaved}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Yield Boost</span>
                    <span className="font-extrabold text-emerald-700">{item.yieldImprovement}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Margin Delta</span>
                    <span className="font-extrabold text-slate-800">{item.marginIncrease}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </CompanyLayout>
  );
}
