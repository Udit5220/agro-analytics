import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import CompanyLeafletMap from "./components/CompanyLeafletMap";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Compass, 
  MapPin, 
  Layers, 
  TrendingUp, 
  CheckSquare, 
  Award,
  Globe 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const {
  suitabilityMatrix,
  clusterDiscoveryData,
  expansionMapCircles,
  regionalKpis,
  regionalAiAdvisor
} = seededData.cropRecommendation1.company;

// Suitability rows dataset by crop
const getSuitabilityMatrix = (commodity) => {
  return suitabilityMatrix[commodity] || suitabilityMatrix["Wheat"];
};

// Cluster Discovery Bar Chart
const getClusterDiscoveryData = (commodity) => {
  return clusterDiscoveryData[commodity] || clusterDiscoveryData["Wheat"];
};

// Expansion Map Circles
const getExpansionMapCircles = (commodity) => {
  return expansionMapCircles[commodity] || expansionMapCircles["Wheat"];
};

// KPIs data
const getRegionalKpis = (commodity) => {
  return regionalKpis[commodity] || regionalKpis["Wheat"];
};

// Advisor recommendation text
const getRegionalAiAdvisor = (commodity) => {
  return regionalAiAdvisor[commodity] || regionalAiAdvisor["Wheat"];
};

export default function CompanyRegionalExpansion() {
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

  const fullMatrix = getSuitabilityMatrix(selectedCommodity);
  const suitabilityMatrix = fullMatrix.filter(s => 
    selectedZone === "All India" || s.district.includes(selectedZone)
  );

  const clusterDiscoveryData = getClusterDiscoveryData(selectedCommodity).filter(c => 
    selectedZone === "All India" || c.name.includes(selectedZone)
  );

  const circles = getExpansionMapCircles(selectedCommodity).filter(c => 
    selectedZone === "All India" || c.name.includes(selectedZone)
  );

  const kpis = getRegionalKpis(selectedCommodity);
  const aiAdvisorText = getRegionalAiAdvisor(selectedCommodity);

  const pdfHeaders = ["District", "Soil Quality", "Water Resources", "Climate Stability", "Infrastructure", "Yield History", "Suitability Score"];
  const tableDataForPdf = suitabilityMatrix.map(s => [s.district, s.soil, s.water, s.climate, s.infrastructure, s.history, `${s.score}/100`]);

  return (
    <CompanyLayout
      pageName="Regional Suitability & Expansion Engine"
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
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expansion Potential</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.potential}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Untapped clusters identified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Compass className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Suitable Acreage</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.acreage}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Ideal climate band parameters</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Growth potential</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.growth} Rate</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Estimated output boost potential</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Supply Stability</span>
            <span className="text-xl font-extrabold text-emerald-700 block mt-1">{kpis.stability}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Water resilience buffers active</span>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expansion Map */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Expansion Opportunity GIS Map</h2>
            <p className="text-[10px] font-medium text-slate-500">Geospatial overlays matching target soil and infrastructure clusters</p>
          </div>

          <CompanyLeafletMap
            activeLayer="readiness"
            circles={circles}
          />
        </div>

        {/* Cluster Discovery Engine */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Cluster Discovery Engine</h2>
            <p className="text-[10px] font-medium text-slate-500">Detected annual output growth (%) across regional clusters</p>
          </div>

          <div className="h-[200px] w-full">
            {clusterDiscoveryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterDiscoveryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                  <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                  <Bar dataKey="yieldChange" fill="#10b981" name="Yield Output Growth (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                No cluster data found for the selected filter.
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-4 text-[10px] space-y-1 font-semibold leading-relaxed">
            <span className="text-emerald-400 font-bold block">AI Expansion Advisor:</span>
            <p>{aiAdvisorText}</p>
          </div>
        </div>

        {/* Regional Suitability Matrix */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Regional Suitability Matrix</h2>
            <p className="text-[10px] font-medium text-slate-500">Scoring matrices for sourcing candidates based on ground parameters</p>
          </div>

          <div className="overflow-x-auto">
            {suitabilityMatrix.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px]">
                    <th className="py-2.5">District</th>
                    <th className="py-2.5">Soil Suitability</th>
                    <th className="py-2.5">Water Security</th>
                    <th className="py-2.5">Climate Stability</th>
                    <th className="py-2.5">Logistics Infrastructure</th>
                    <th className="py-2.5">Historical Yields</th>
                    <th className="py-2.5 text-right">Readiness Score</th>
                  </tr>
                </thead>
                <tbody>
                  {suitabilityMatrix.map((s, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                      <td className="py-3 font-extrabold text-slate-800">{s.district}</td>
                      <td className="py-3 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold">
                          {s.soil}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-600">{s.water}</td>
                      <td className="py-3 font-semibold text-slate-655">{s.climate}</td>
                      <td className="py-3 font-semibold text-slate-655">{s.infrastructure}</td>
                      <td className="py-3 font-bold text-slate-700">{s.history}</td>
                      <td className="py-3 font-black text-[#31572c] text-right">{s.score}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-slate-500 font-medium">
                No suitability data found matching the selected Sourcing Zone.
              </div>
            )}
          </div>
        </div>

      </div>
    </CompanyLayout>
  );
}

