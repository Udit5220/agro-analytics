// PAGE 9 — Historical Disease Intelligence
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/HistoricalDiseaseIntelligence.jsx

import React, { useState } from "react";
import { 
  Calendar, Search, Filter, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Activity, MapPin 
} from "lucide-react";

export default function HistoricalDiseaseIntelligence() {
  const initialHistory = [
    { year: 2025, season: "Kharif", disease: "Rice Blast", village: "Kharindwa", crop: "Rice (Paddy)", severity: "Critical", affected: 48, loss: "14.2%", treatment: "Copper Dusting", outcome: "Contained" },
    { year: 2025, season: "Rabi", disease: "Yellow Rust", village: "Bhucho Mandi", crop: "Wheat", severity: "High", affected: 35, loss: "9.5%", treatment: "Prophylactic Spray", outcome: "Contained" },
    { year: 2024, season: "Kharif", disease: "Rice Blast", village: "Mehna", crop: "Rice (Paddy)", severity: "High", affected: 42, loss: "12.8%", treatment: "Systemic Chemical", outcome: "Contained" },
    { year: 2024, season: "Rabi", disease: "Late Blight", village: "Raman", crop: "Potato", severity: "Critical", affected: 28, loss: "15.0%", treatment: "Foliar Fungicide", outcome: "Contained" },
    { year: 2023, season: "Kharif", disease: "Downy Mildew", village: "Shirur", crop: "Bajra", severity: "Moderate", affected: 22, loss: "8.4%", treatment: "Dusting Trials", outcome: "Contained" },
    { year: 2023, season: "Rabi", disease: "Yellow Rust", village: "Talwandi", crop: "Wheat", severity: "High", affected: 30, loss: "10.2%", treatment: "Hexaconazole Sprays", outcome: "Resolved" },
    { year: 2022, season: "Kharif", disease: "Bacterial Leaf Spot", village: "Jandiali", crop: "Cotton", severity: "Moderate", affected: 18, loss: "7.5%", treatment: "Antibiotic Splits", outcome: "Resolved" },
    { year: 2022, season: "Rabi", disease: "Alternaria Blight", village: "Bhikhiwind", crop: "Mustard", severity: "Low", affected: 12, loss: "3.2%", treatment: "Mancozeb Splits", outcome: "Resolved" },
    { year: 2021, season: "Kharif", disease: "Rice Blast", village: "Kharindwa", crop: "Rice (Paddy)", severity: "Critical", affected: 55, loss: "18.5%", treatment: "Copper Dusting", outcome: "Partially Saved" },
    { year: 2021, season: "Rabi", disease: "Yellow Rust", village: "Bhucho Mandi", crop: "Wheat", severity: "Critical", affected: 46, loss: "14.8%", treatment: "Chemical Sprays", outcome: "Resolved" }
  ];

  const cropIntelligence = [
    { name: "Rice (Paddy)", outbreaks: 18, avgLoss: "12.4%", common: "Rice Blast", resilience: "Medium" },
    { name: "Wheat", outbreaks: 12, avgLoss: "8.2%", common: "Yellow Rust", resilience: "High" },
    { name: "Potato", outbreaks: 9, avgLoss: "14.5%", common: "Late Blight", resilience: "Low" },
    { name: "Cotton", outbreaks: 7, avgLoss: "6.8%", common: "Bacterial Spot", resilience: "High" }
  ];

  const vulnerableVillages = [
    { name: "Kharindwa Block", outbreaks: 14, avgLoss: "13.8%", disease: "Rice Blast", trend: "improving" },
    { name: "Bhucho Mandi", outbreaks: 10, avgLoss: "9.2%", disease: "Yellow Rust", trend: "improving" },
    { name: "Raman Cluster", outbreaks: 8, avgLoss: "11.5%", disease: "Late Blight", trend: "stable" },
    { name: "Talwandi Block", outbreaks: 7, avgLoss: "8.5%", disease: "Yellow Rust", trend: "improving" },
    { name: "Mehna Heights", outbreaks: 5, avgLoss: "10.0%", disease: "Downy Mildew", trend: "worsening" }
  ];

  // Filters State
  const [yearFilter, setYearFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [diseaseFilter, setDiseaseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHistory = initialHistory.filter(h => {
    const matchesYear = yearFilter === "All" || h.year.toString() === yearFilter;
    const matchesSeason = seasonFilter === "All" || h.season === seasonFilter;
    const matchesDisease = diseaseFilter === "All" || h.disease === diseaseFilter;
    return matchesYear && matchesSeason && matchesDisease;
  });

  // Month vs Disease frequency matrix mockup (Heatmap grid values)
  const heatmapData = [
    { month: "Jan", Rust: 2, Blast: 0, Blight: 3 },
    { month: "Feb", Rust: 4, Blast: 1, Blight: 2 },
    { month: "Mar", Rust: 5, Blast: 0, Blight: 1 },
    { month: "Jul", Rust: 0, Blast: 4, Blight: 2 },
    { month: "Aug", Rust: 0, Blast: 6, Blight: 4 },
    { month: "Sep", Rust: 1, Blast: 5, Blight: 3 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">Historical Pathogen Audits</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Perform long-term crop epidemiology research, assess historical severity charts, and evaluate village risk factors.
        </p>
      </div>

      {/* SVG charts layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 5-Year Trend Chart Multi-line */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-purple-600" />
            5-Year Outbreak Frequency (2021 - 2025)
          </h3>

          <div className="h-44 relative w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* Grid */}
              <line x1="20" y1="10" x2="480" y2="10" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="110" x2="480" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Rice Blast (Red line): 2021: 18, 2022: 12, 2023: 15, 2024: 22, 2025: 14 */}
              <path d="M 30 50 L 140 75 L 250 65 L 360 40 L 470 68" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              {/* Yellow Rust (Amber line): 2021: 14, 2022: 9, 2023: 20, 2024: 15, 2025: 12 */}
              <path d="M 30 65 L 140 85 L 250 45 L 360 60 L 470 75" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              {/* Late Blight (Blue line): 2021: 8, 2022: 15, 2023: 10, 2024: 18, 2025: 9 */}
              <path d="M 30 88 L 140 65 L 250 82 L 360 52 L 470 85" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

              {/* Year points */}
              {["2021", "2022", "2023", "2024", "2025"].map((yr, idx) => (
                <text key={idx} x={20 + (idx * 110)} y="119" fill="#94a3b8" fontSize="8" fontWeight="bold">{yr}</text>
              ))}
            </svg>
          </div>
          <div className="flex justify-center gap-6 text-[9px] font-black uppercase text-slate-500 pt-1">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Rice Blast</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Yellow Rust</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Late Blight</span>
          </div>
        </div>

        {/* Seasonal Pattern Heatmap Grid */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
            Seasonal Disease Heatmap Matrix
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-4 text-center text-[8.5px] font-black uppercase text-slate-450 border-b pb-1.5">
              <span>Month</span>
              <span>Yellow Rust</span>
              <span>Rice Blast</span>
              <span>Late Blight</span>
            </div>

            {heatmapData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 items-center text-center text-xs font-bold text-slate-700">
                <span className="text-[10px] text-slate-500">{row.month}</span>
                
                {/* Rust Cell */}
                <span className={`p-1.5 rounded-lg border text-[10px] ${
                  row.Rust >= 4 ? "bg-red-500/20 text-red-700 border-red-200" : row.Rust >= 2 ? "bg-amber-500/20 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-400 border-transparent"
                }`}>
                  {row.Rust} cases
                </span>

                {/* Blast Cell */}
                <span className={`p-1.5 rounded-lg border text-[10px] ${
                  row.Blast >= 4 ? "bg-red-500/20 text-red-700 border-red-200" : row.Blast >= 2 ? "bg-amber-500/20 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-400 border-transparent"
                }`}>
                  {row.Blast} cases
                </span>

                {/* Blight Cell */}
                <span className={`p-1.5 rounded-lg border text-[10px] ${
                  row.Blight >= 4 ? "bg-red-500/20 text-red-700 border-red-200" : row.Blight >= 2 ? "bg-amber-500/20 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-400 border-transparent"
                }`}>
                  {row.Blight} cases
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Database Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        
        {/* Filters control bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Historical Disease Database
          </h3>

          <div className="flex flex-wrap gap-2.5">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white focus:outline-none"
            >
              <option value="All">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white focus:outline-none"
            >
              <option value="All">All Seasons</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
            </select>

            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white focus:outline-none"
            >
              <option value="All">All Pathogens</option>
              <option value="Rice Blast">Rice Blast</option>
              <option value="Yellow Rust">Yellow Rust</option>
              <option value="Late Blight">Late Blight</option>
              <option value="Downy Mildew">Downy Mildew</option>
            </select>
          </div>
        </div>

        {/* Database table ledger */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-2.5">Year</th>
                <th className="py-2.5">Season</th>
                <th className="py-2.5">Disease</th>
                <th className="py-2.5">Village</th>
                <th className="py-2.5">Crop</th>
                <th className="py-2.5 text-center">Severity</th>
                <th className="py-2.5 text-center">Farmers Impacted</th>
                <th className="py-2.5 text-center">Yield Loss %</th>
                <th className="py-2.5">Treatment Used</th>
                <th className="py-2.5 text-right">Outcome Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-705">
              {filteredHistory.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 text-slate-900">{h.year}</td>
                  <td className="py-3 text-slate-550">{h.season}</td>
                  <td className="py-3 text-slate-900">{h.disease}</td>
                  <td className="py-3 text-slate-550">{h.village}</td>
                  <td className="py-3 text-slate-550">{h.crop}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      h.severity === "Critical" ? "bg-red-100 text-red-700" : h.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {h.severity}
                    </span>
                  </td>
                  <td className="py-3 text-center text-slate-700">{h.affected}</td>
                  <td className="py-3 text-center text-red-600">{h.loss}</td>
                  <td className="py-3 text-slate-650">{h.treatment}</td>
                  <td className="py-3 text-right text-emerald-600 uppercase text-[9px] font-black">{h.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid for village audits and crop resiliency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Village Intelligence Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
            Top Vulnerable Villages Audits
          </h3>

          <div className="space-y-3.5">
            {vulnerableVillages.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex justify-between items-center text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <span className="font-black text-slate-900 block">{item.name}</span>
                  <span className="text-[10px] text-slate-450 block font-semibold">Recurring Threat: {item.disease}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] block">{item.outbreaks} outbreaks (5yr)</span>
                  <span className="text-[10px] text-red-600 block mt-0.5">Avg Loss: {item.avgLoss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Resilience audits */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
            Crop Pathology Intelligence Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="py-2">Crop Name</th>
                  <th className="py-2 text-center">Outbreaks</th>
                  <th className="py-2 text-center">Avg Loss %</th>
                  <th className="py-2">Primary Threat</th>
                  <th className="py-2 text-right">Resilience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {cropIntelligence.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-slate-900">{c.name}</td>
                    <td className="py-3 text-center text-slate-500">{c.outbreaks}</td>
                    <td className="py-3 text-center text-red-600">{c.avgLoss}</td>
                    <td className="py-3 text-slate-650">{c.common}</td>
                    <td className="py-3 text-right text-emerald-600 uppercase text-[9px] font-black">{c.resilience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
