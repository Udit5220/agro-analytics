import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Scale, 
  Calendar, 
  AlertOctagon, 
  HelpCircle,
  Truck, 
  ChevronRight 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const { cropMatrix, calendarData, deficitDistricts } = seededData.cropRecommendation1.company.demandSupplyPlanning;

// Deficit districts mapping
const getDeficitDistricts = (commodity) => {
  return deficitDistricts[commodity] || deficitDistricts["Wheat"];
};

export default function CompanyDemandSupplyPlanning() {
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

  const pdfHeaders = ["Commodity", "Expected Demand", "Expected Supply", "Sourcing Gap", "Risk Matrix"];
  const tableDataForPdf = cropMatrix.map(c => [c.crop, `${c.demand.toLocaleString()} MT`, `${c.supply.toLocaleString()} MT`, `${c.gap.toLocaleString()} MT`, c.risk]);

  const activeTimeline = calendarData[selectedCommodity] || calendarData["Wheat"];
  const deficitDistricts = getDeficitDistricts(selectedCommodity);

  const activeCropDetails = cropMatrix.find(c => c.crop === selectedCommodity) || cropMatrix[0];
  const demandVal = activeCropDetails.demand;
  const supplyVal = activeCropDetails.supply;
  const gapVal = activeCropDetails.gap;
  const surplusZone = selectedCommodity === "Rice" ? "South Zone" : (selectedCommodity === "Cotton" ? "West Zone" : "North Zone");

  return (
    <CompanyLayout
      pageName="Demand & Supply Planning Center"
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
              <Scale className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Target Demand</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{demandVal.toLocaleString()} MT</span>
            <span className="text-[9px] font-bold text-slate-500 block mt-0.5">Sourcing contracts aggregate</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Supply</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{supplyVal.toLocaleString()} MT</span>
            <span className="text-[9px] font-bold text-red-600 block mt-0.5">{gapVal < 0 ? `▼ ${Math.abs(gapVal).toLocaleString()} MT Net Deficit` : `▲ +${gapVal.toLocaleString()} MT Surplus`}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-red-50 text-red-800 p-2 rounded-xl group-hover:scale-110 transition">
              <AlertOctagon className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Fulfillment Prob.</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{gapVal >= 0 ? "99.8%" : "91.2%"}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Confidence band verified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Surplus Zones</span>
            <span className="text-xl font-extrabold text-emerald-700 block mt-1">{surplusZone}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Arrivals peak distribution</span>
          </div>
        </>
      }
    >
      {/* 2x2 grid visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Demand vs Supply Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Demand vs Supply Matrix</h2>
            <p className="text-[10px] font-medium text-slate-500">Corporate processing capacity vs anticipated regional yield outputs</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropMatrix} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Bar dataKey="demand" fill="#334155" name="Target Demand (MT)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" fill="#10b981" name="Expected Supply (MT)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 12-Month Sourcing Calendar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">12-Month Sourcing & Sowing Calendar</h2>
            <p className="text-[10px] font-medium text-slate-500">Lifecycle arrivals tracker for {selectedCommodity}</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {activeTimeline.map((item, index) => (
              <div key={index} className={`border border-slate-100 rounded-xl p-3 flex flex-col justify-between text-center min-h-[72px] transition hover:shadow-sm ${item.color}`}>
                <span className="text-xs font-black">{item.month}</span>
                <span className="text-[9px] font-extrabold uppercase mt-1 tracking-wider">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gap Heatmap */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Supply Deficit District Tracker</h2>
            <p className="text-[10px] font-medium text-slate-500">Critical districts flagged with supply-gap alerts</p>
          </div>

          <div className="space-y-3">
            {deficitDistricts.map((d, index) => (
              <div key={index} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{d.district}</h4>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Crop: {d.crop} | Confidence: {d.confidence}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-red-600 block">{d.shortfall}</span>
                  <span className="text-[8px] px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded-full font-bold inline-block mt-0.5">
                    {d.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Supply Planner Directives */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">AI Supply Planner Directives</span>
            <h3 className="text-sm font-black uppercase">Alternate Sourcing Recommendation</h3>
            <p className="text-xs text-slate-350 leading-relaxed font-medium">
              Geospatial moisture patterns suggest transferring 15,000 MT of contract requirements for {selectedCommodity} from the West Zone (Rajasthan/MH border) to the North Zone (Haryana cluster B) to secure a 4.2% yield premium.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-[10px]">
            <div>
              <span className="text-slate-400 block font-bold">Estimated Cost Savings</span>
              <span className="text-sm font-black text-emerald-400">₹8.4M Saved</span>
            </div>
            <button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl transition active:scale-95 cursor-pointer">
              <span>Execute Divert</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </CompanyLayout>
  );
}
