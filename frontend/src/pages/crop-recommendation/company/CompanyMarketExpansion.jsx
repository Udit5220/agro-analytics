import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import { 
  Compass, 
  MapPin, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const { scoreboardDistricts, quadrantLabels, marketKpis } = seededData.cropRecommendation1.company.marketExpansion;

// Expansion Scoreboard districts dataset by crop
const getScoreboardDistricts = (commodity) => {
  return scoreboardDistricts[commodity] || scoreboardDistricts["Wheat"];
};

// Pipeline stages dataset by crop
const getPipelineStages = (commodity, counts) => {
  return [
    { stage: "Identified Opportunities", count: counts.identified, color: "border-slate-200 border-l-slate-400 bg-slate-50 text-slate-800", desc: "Preliminary GIS mapping completed" },
    { stage: "Under Evaluation", count: counts.evaluating, color: "border-slate-200 border-l-amber-500 bg-amber-50/15 text-slate-850", desc: "Agronomic soil testing in progress" },
    { stage: "Active Pilots", count: counts.pilots, color: "border-slate-200 border-l-blue-500 bg-blue-50/15 text-slate-850", desc: "100-acre contract farming trials" },
    { stage: "Scaling Up", count: counts.scaling, color: "border-slate-200 border-l-emerald-400 bg-emerald-50/15 text-slate-850", desc: "Transitioning to commercial contracts" },
    { stage: "Operational", count: counts.operational, color: "border-emerald-200 border-l-emerald-600 bg-emerald-50/30 text-emerald-900", desc: "FPO fully integrated with supply desk" }
  ];
};

// Quadrant labels by crop
const getQuadrantLabels = (commodity) => {
  return quadrantLabels[commodity] || quadrantLabels["Wheat"];
};

// KPIs dataset by crop
const getMarketKpis = (commodity) => {
  return marketKpis[commodity] || marketKpis["Wheat"];
};

export default function CompanyMarketExpansion() {
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

  const fullScoreboard = getScoreboardDistricts(selectedCommodity);
  const scoreboardDistricts = fullScoreboard.filter(d => 
    selectedZone === "All India" || d.name.includes(selectedZone)
  );

  const kpis = getMarketKpis(selectedCommodity);
  const pipelineStages = getPipelineStages(selectedCommodity, kpis.pipeline);
  const quadrants = getQuadrantLabels(selectedCommodity);

  const pdfHeaders = ["Rank", "Candidate District", "Sourcing Score", "Yield Growth Potential", "Demand Density", "Infrastructure Score"];
  const tableDataForPdf = scoreboardDistricts.map(d => [d.rank, d.name, `${d.score}/100`, d.growth, d.demand, d.infra]);

  return (
    <CompanyLayout
      pageName="Market Expansion & Opportunity"
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
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">New Districts</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.newZones}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">▲ Soil readiness verified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Commodities</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.count}</span>
            <span className="text-[9px] font-bold text-slate-500 block mt-0.5">High-res yield models</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expansion revenue</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.revenue}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">From untapped acreage</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Untapped Acreage</span>
            <span className="text-xl font-extrabold text-emerald-700 block mt-1">{kpis.acreage}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">High organic density</span>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expansion Scoreboard table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Expansion Opportunity Scoreboard</h2>
            <p className="text-[10px] font-medium text-slate-500">Ranked candidate districts for commercial contract procurement</p>
          </div>

          <div className="overflow-x-auto">
            {scoreboardDistricts.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px]">
                    <th className="py-2.5">Rank</th>
                    <th className="py-2.5">District Candidate</th>
                    <th className="py-2.5 text-right">Growth Rate</th>
                    <th className="py-2.5 text-center">Demand Profile</th>
                    <th className="py-2.5 text-center">Infra Grade</th>
                    <th className="py-2.5 text-right">Target Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreboardDistricts.map((d, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                      <td className="py-3 font-bold text-slate-400">#{i + 1}</td>
                      <td className="py-3 font-extrabold text-slate-800">{d.name}</td>
                      <td className="py-3 font-black text-emerald-700 text-right">{d.growth}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold">
                          {d.demand}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-600 text-center">{d.infra}</td>
                      <td className="py-3 font-black text-[#31572c] text-right">{d.score}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-slate-500 font-medium">
                No scoreboard candidates found matching the selected Sourcing Zone.
              </div>
            )}
          </div>
        </div>

        {/* Growth Opportunity Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Growth Opportunity Matrix</h2>
            <p className="text-[10px] font-medium text-slate-500">Districts plotted along yield growth potential and demand density</p>
          </div>

          <div className="grid grid-cols-2 gap-2 h-[200px] border border-slate-200 rounded-xl relative p-1 text-center">
            {/* Top Left: High Growth, Low Competition */}
            <div className="border-r border-b border-slate-100 p-2 flex flex-col justify-between bg-emerald-50/20">
              <span className="text-[8px] text-emerald-800 font-extrabold uppercase">High Growth / Low Comp</span>
              <span className="text-xs font-black text-emerald-700 self-center">{quadrants.tl}</span>
            </div>
            {/* Top Right: High Growth, High Demand */}
            <div className="border-b border-slate-100 p-2 flex flex-col justify-between bg-emerald-50/40">
              <span className="text-[8px] text-emerald-900 font-extrabold uppercase">High Growth & Demand (Priority)</span>
              <span className="text-xs font-black text-emerald-850 self-center">{quadrants.tr}</span>
            </div>
            {/* Bottom Left: Low Growth, Low Margin */}
            <div className="border-r border-slate-100 p-2 flex flex-col justify-between bg-slate-50/20">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase">Low Growth / Avoid</span>
              <span className="text-xs font-semibold text-slate-400 self-center">{quadrants.bl}</span>
            </div>
            {/* Bottom Right: Low Growth, High Margin */}
            <div className="p-2 flex flex-col justify-between bg-slate-50/50">
              <span className="text-[8px] text-slate-500 font-extrabold uppercase">Stable Margin / Mature</span>
              <span className="text-xs font-black text-slate-655 self-center">{quadrants.br}</span>
            </div>
          </div>
        </div>

        {/* Opportunity Pipeline Flow tracker */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Sourcing Opportunity Pipeline</h2>
            <p className="text-[10px] font-medium text-slate-500">Commercial contract development workflow stage progression</p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-3">
            {pipelineStages.map((stage, index) => (
              <React.Fragment key={index}>
                <div className={`flex-1 border border-l-4 rounded-2xl p-4 flex flex-col justify-between min-h-[120px] transition hover:shadow-md ${stage.color}`}>
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Stage 0{index + 1}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border border-slate-200/60 shadow-sm">{stage.count}</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-800 uppercase mt-2">{stage.stage}</h4>
                    <p className="text-[9px] font-medium text-slate-500 mt-1 leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
                {index < pipelineStages.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 self-center shadow-sm">
                    <ArrowRight className="w-4 h-4 text-emerald-700 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </CompanyLayout>
  );
}
