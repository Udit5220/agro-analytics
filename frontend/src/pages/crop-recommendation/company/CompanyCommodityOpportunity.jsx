import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { 
  Coins, 
  TrendingUp, 
  Layers, 
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Sparkles 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const { commodityRankings, priceProjections } = seededData.cropRecommendation1.company;

// Price projections based on crop
const getPriceProjection = (commodity) => {
  return priceProjections[commodity] || priceProjections["Wheat"];
};

export default function CompanyCommodityOpportunity() {
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

  const priceData = getPriceProjection(selectedCommodity);

  const pdfHeaders = ["Opportunity Rank", "Commodity", "Margin Potential", "Opportunity Score", "Supply Status", "Procurement Feasibility"];
  const tableDataForPdf = commodityRankings.map(c => [c.rank, c.crop, c.margin, c.score, c.supply, c.feasibility]);

  return (
    <CompanyLayout
      pageName="Commodity Opportunity Engine"
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
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Margin Potential</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              {selectedCommodity === "Mustard" ? "+18.4%" : "+14.2%"}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">▲ Premium margin threshold</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Demand Growth</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">+12.2% Rate</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Sourcing capacity expands</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-red-50 text-red-800 p-2 rounded-xl group-hover:scale-110 transition">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Supply Tightness</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              {selectedCommodity === "Mustard" || selectedCommodity === "Maize" ? "High Alert" : "Stable"}
            </span>
            <span className="text-[9px] font-bold text-red-600 block mt-0.5">Buffer replenishment advised</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Opportunity Score</span>
            <span className="text-xl font-extrabold text-[#31572c] block mt-1">94/100</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Highly recommended buy status</span>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Commodity Ranking Engine Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Commodity Profitability Rankings</h2>
            <p className="text-[10px] font-medium text-slate-500">Corporate sourcing feasibility scorecards and baseline margins</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px]">
                  <th className="py-2.5">Rank</th>
                  <th className="py-2.5">Commodity</th>
                  <th className="py-2.5 text-right">Margin Potential</th>
                  <th className="py-2.5 text-right">Spot Price</th>
                  <th className="py-2.5 text-center">Supply Matrix</th>
                  <th className="py-2.5 text-center">Feasibility</th>
                  <th className="py-2.5 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {commodityRankings.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="py-3 font-bold text-slate-400">#{c.rank}</td>
                    <td className="py-3 font-extrabold text-slate-800">{c.crop}</td>
                    <td className="py-3 font-black text-emerald-700 text-right">{c.margin}</td>
                    <td className="py-3 font-bold text-slate-700 text-right">{c.price}</td>
                    <td className="py-3 text-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        c.supply === "Tight" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"
                      }`}>
                        {c.supply}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-600 text-center">{c.feasibility}</td>
                    <td className="py-3 font-black text-[#31572c] text-right">{c.score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commodity Margin Opportunity Matrix Quadrant Visual */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Margin Opportunity Matrix</h2>
            <p className="text-[10px] font-medium text-slate-500">Commodities mapped along feasibility vs margin potential</p>
          </div>

          <div className="grid grid-cols-2 gap-2 h-[220px] border border-slate-200 rounded-xl relative p-1 bg-white">
            {/* Top Left: High Margin, Low Feasibility */}
            <div className="border-r border-b border-slate-100 p-3 flex flex-col bg-amber-50/15 h-full">
              <span className="text-[8px] text-amber-800 font-extrabold uppercase leading-tight">Evaluate (High Margin / Med Feas.)</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-700 bg-white border border-amber-200 shadow-sm px-2.5 py-1 rounded-lg">Maize</span>
              </div>
            </div>
            {/* Top Right: High Margin, High Feasibility */}
            <div className="border-b border-slate-100 p-3 flex flex-col bg-emerald-50/30 h-full">
              <span className="text-[8px] text-emerald-800 font-extrabold uppercase leading-tight">Sustain/Buy (High Margin & Feas.)</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-800 bg-white border border-emerald-200 shadow-sm px-2.5 py-1 rounded-lg">Mustard, Wheat</span>
              </div>
            </div>
            {/* Bottom Left: Low Margin, Low Feasibility */}
            <div className="border-r border-slate-100 p-3 flex flex-col bg-red-50/15 h-full">
              <span className="text-[8px] text-red-800 font-extrabold uppercase leading-tight">Avoid (Low Margin & Feas.)</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs font-bold text-red-700 bg-white border border-red-200 shadow-sm px-2.5 py-1 rounded-lg">Sugarcane</span>
              </div>
            </div>
            {/* Bottom Right: Low Margin, High Feasibility */}
            <div className="p-3 flex flex-col bg-blue-50/20 h-full">
              <span className="text-[8px] text-blue-800 font-extrabold uppercase leading-tight">Volume Play (Low Margin / High Feas.)</span>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700 bg-white border border-blue-200 shadow-sm px-2.5 py-1 rounded-lg">Rice, Cotton</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 text-white rounded-xl p-4 text-[10px] space-y-1 font-semibold leading-relaxed">
            <span className="text-emerald-400 font-bold block">AI Analyst Recommendation:</span>
            <p>Accelerate contracts for Mustard in Central zone. Market tightness will peak in 90 days, yielding a clear price advantage.</p>
          </div>
        </div>

        {/* Spot Price Forecast Chart */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Spot Price Forecast Chart</h2>
            <p className="text-[10px] font-medium text-slate-500">Estimated price paths (₹/Quintal) under different market conditions for {selectedCommodity}</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Line type="monotone" dataKey="bullish" stroke="#ef4444" name="Bullish Scenario (₹)" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="baseline" stroke="#3b82f6" name="Baseline Projection (₹)" strokeWidth={2} />
                <Line type="monotone" dataKey="bearish" stroke="#10b981" name="Bearish Scenario (₹)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </CompanyLayout>
  );
}
