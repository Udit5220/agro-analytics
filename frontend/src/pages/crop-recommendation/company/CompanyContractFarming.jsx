import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import CompanyLeafletMap from "./components/CompanyLeafletMap";
import { 
  FileText, 
  Award, 
  MapPin, 
  Settings, 
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle2 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const {
  fpoDatabase,
  readinessFactors,
  expansionRegions,
  contractMapCircles,
  contractMapMarkers
} = seededData.cropRecommendation1.company;

// Mock FPOs database by crop
const getFpoDatabase = (commodity) => {
  return fpoDatabase[commodity] || fpoDatabase["Wheat"];
};

// Expansion recommendations dataset by crop
const getExpansionRegions = (commodity) => {
  return expansionRegions[commodity] || expansionRegions["Wheat"];
};

// Map circles coordinates by crop
const getContractMapCircles = (commodity) => {
  return contractMapCircles[commodity] || contractMapCircles["Wheat"];
};

// Map markers (FPO Hubs) by crop
const getContractMapMarkers = (commodity) => {
  return contractMapMarkers[commodity] || contractMapMarkers["Wheat"];
};

export default function CompanyContractFarming() {
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

  const fpoList = getFpoDatabase(selectedCommodity);
  const fpos = fpoList.filter(f => selectedZone === "All India" || f.region.includes(selectedZone));

  const pdfHeaders = ["FPO Co-operative", "Sourcing Zone", "Compliance", "Production MT", "Quality Grade", "Delivery SLA"];
  const tableDataForPdf = fpos.map(f => [f.name, f.region, f.compliance, f.production, f.quality, f.delivery]);

  const contractedFarmers = selectedCommodity === "Wheat" ? "14,250 Farmers" : (selectedCommodity === "Rice" ? "12,400 Farmers" : (selectedCommodity === "Cotton" ? "15,800 Farmers" : "9,200 Farmers"));
  const contractedAcreage = selectedCommodity === "Wheat" ? "285,000 Acres" : (selectedCommodity === "Rice" ? "240,000 Acres" : (selectedCommodity === "Cotton" ? "310,000 Acres" : "185,000 Acres"));
  const fpoCompliance = selectedCommodity === "Wheat" ? "92.8% Rate" : (selectedCommodity === "Rice" ? "91.4% Rate" : (selectedCommodity === "Cotton" ? "93.2% Rate" : "90.5% Rate"));
  const successRate = selectedCommodity === "Wheat" ? "96.5% Rate" : (selectedCommodity === "Rice" ? "94.8% Rate" : (selectedCommodity === "Cotton" ? "95.6% Rate" : "92.4% Rate"));

  const fullCircles = getContractMapCircles(selectedCommodity);
  const circles = fullCircles.filter(c => selectedZone === "All India" || c.name.includes(selectedZone));

  const fullMarkers = getContractMapMarkers(selectedCommodity);
  const markers = fullMarkers.filter(m => selectedZone === "All India" || m.name.includes(selectedZone));

  const fullExpansion = getExpansionRegions(selectedCommodity);
  const expansionRegions = fullExpansion.filter(e => selectedZone === "All India" || e.district.includes(selectedZone));

  return (
    <CompanyLayout
      pageName="Contract Farming Intelligence"
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contracted Farmers</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{contractedFarmers}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">▲ 14% growth vs last year</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Acreage</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{contractedAcreage}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">94% Geo-fenced verified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Percent className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">FPO Compliance</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{fpoCompliance}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">SLA delivery matches target</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Contract Success Rate</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{successRate}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Over 90% renewal expectation</span>
          </div>
        </>
      }
    >
      {/* Visual content: Map + performance indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coverage Map */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Contract Coverage GIS Map</h2>
            <p className="text-[10px] font-medium text-slate-500">Active regional contract farming clusters and FPO hubs</p>
          </div>

          <CompanyLeafletMap
            activeLayer="contract"
            circles={circles}
            markers={markers}
          />
        </div>

        {/* FPO Scorecard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">FPO Performance Scorecard</h2>
            <p className="text-[10px] font-medium text-slate-500">Compliance & quality delivery metrics</p>
          </div>

          <div className="space-y-3">
            {fpos.map((f, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50/50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{f.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{f.region}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-slate-900 text-emerald-400 rounded-full font-bold">
                    {f.quality}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-50 text-[10px] font-semibold text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Compliance</span>
                    <span className="font-extrabold text-slate-800">{f.compliance}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Est. Vol</span>
                    <span className="font-extrabold text-slate-800">{f.production}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">SLA Deliv.</span>
                    <span className="font-extrabold text-emerald-600">{f.delivery}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Readiness Engine */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Contract Readiness Engine</h2>
            <p className="text-[10px] font-medium text-slate-500">Multi-criteria compliance feasibility indicators</p>
          </div>

          <div className="space-y-4">
            {readinessFactors.map((r, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-700">{r.factor}</span>
                  <span className="font-black text-[#31572c]">{r.score}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-brand-dark h-full rounded-full transition-all duration-500" 
                    style={{ width: `${r.score}%` }} 
                    />
                </div>
                <span className="text-[9px] text-slate-400 font-semibold block">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expansion Recommendations */}
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Geospatial AI expansion model</span>
            <h3 className="text-sm font-black uppercase">Farming Cluster Expansion Recommendation</h3>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              The AI model has detected high historical correlation and soil organic readiness (SOC &gt; 0.8) in target zones. Expand contract farming coverage to capitalize on peak sowing windows.
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-emerald-800">
            {expansionRegions.slice(0, 2).map((exp, index) => (
              <div key={index} className="flex justify-between items-center text-[10px] font-bold">
                <div>
                  <span className="block text-white">{exp.district.split(" (")[0]}</span>
                  <span className="block text-emerald-400 text-[8px]">Crops: {exp.crops}</span>
                </div>
                <div className="text-right">
                  <span className="block text-emerald-350">{exp.acreage}</span>
                  <span className="block text-[8px] text-slate-350">Readiness: {exp.readiness}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black py-2 rounded-xl transition active:scale-95 cursor-pointer mt-3">
            <span>Review Expansion Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </CompanyLayout>
  );
}
