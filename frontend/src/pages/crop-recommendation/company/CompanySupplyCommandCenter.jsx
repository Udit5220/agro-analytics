import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import CompanyLeafletMap from "./components/CompanyLeafletMap";
import { 
  TrendingUp, 
  MapPin, 
  Users, 
  Activity, 
  DollarSign, 
  Warehouse, 
  AlertCircle,
  FileCheck 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const { regionData } = seededData.cropRecommendation1.company.supplyCommandCenter;

// Mock sourcing data for regions based on commodity
const getRegionData = (commodity) => {
  return regionData[commodity] || regionData["Wheat"];
};

export default function CompanySupplyCommandCenter() {
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

  const [activeLayer, setActiveLayer] = useState("production"); // production, revenue, risk, contract, readiness

  const regions = getRegionData(selectedCommodity).filter(r => 
    selectedZone === "All India" || r.name.includes(selectedZone)
  );

  // Generate dynamic KPIs based on filtered regions
  const totalProduction = regions.reduce((sum, r) => sum + parseInt(r.production.replace(/,/g, "")), 0);
  const totalRevenue = regions.reduce((sum, r) => sum + parseInt(r.revenue.replace(/[₹,M]/g, "")), 0);

  // Prepare table data for PDF export capability
  const pdfHeaders = ["Region Name", "Expected Production", "Procurement Potential", "Est. Revenue Opportunity", "Supply Stability"];
  const tableDataForPdf = regions.map(r => [r.name, r.production, r.potential, r.revenue, r.stability]);

  return (
    <CompanyLayout
      pageName="Executive Supply Command Center"
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Production</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              {totalProduction ? `${totalProduction.toLocaleString()} MT` : "420,000 MT"}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">▲ 4.8% vs last season</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contracted Acreage</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              {selectedCommodity === "Cotton" ? "245,000 Acres" : "185,000 Acres"}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">91% Compliance verification</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Revenue</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">
              {totalRevenue ? `₹${totalRevenue}M` : "₹3,400M"}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">₹14.2M Sourcing savings</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-red-50 text-red-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Activity className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Supply Risk Index</span>
            <span className="text-xl font-extrabold text-red-600 block mt-1">12% / Low</span>
            <span className="text-[9px] font-bold text-red-600 block mt-0.5">1 Sourcing checkpoint lag alert</span>
          </div>
        </>
      }
    >
      {/* 2 Grid Sections: GIS map + Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Column */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">National Supply GIS Map</h2>
              <p className="text-[10px] font-medium text-slate-500">Toggle layers to analyze regional sourcing dynamics</p>
            </div>

            {/* Map Layer controller */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: "production", label: "Production" },
                { id: "revenue", label: "Revenue" },
                { id: "risk", label: "Risk" },
                { id: "contract", label: "Contract" },
                { id: "readiness", label: "Readiness" }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer ${
                    activeLayer === l.id 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-650 hover:bg-slate-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <CompanyLeafletMap
            activeLayer={activeLayer}
            circles={regions.map(r => ({
              ...r,
              color: "#10b981",
              riskColor: "#ef4444",
              revenueColor: "#f59e0b",
              readinessColor: "#3b82f6",
              contractColor: "#8b5cf6"
            }))}
          />
        </div>

        {/* Board Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Supply Opportunity Board</h2>
            <p className="text-[10px] font-medium text-slate-500">Regional ranks by corporate procurement feasibility</p>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {regions.map((r, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50/50 transition cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">{r.name.split(" ")[0]}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full font-bold">
                    Stability: {r.stability}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2.5 border-t border-slate-100/60 pt-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 font-bold block text-[8px] uppercase">Est. Vol</span>
                    <span className="font-extrabold text-slate-800">{r.production}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[8px] uppercase">Margin Value</span>
                    <span className="font-extrabold text-slate-800">{r.revenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[8px] uppercase">Proc. Pot</span>
                    <span className="font-extrabold text-slate-800 text-emerald-700">{r.potential}</span>
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
