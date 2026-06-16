import React, { useState } from "react";
import { 
  History, Calendar, Archive, Search, 
  TrendingUp, Award, Thermometer, ShieldAlert, Cpu 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const MULTIYEAR_TRENDS = [
  { year: "2021", rustOccurrences: 12, blastOccurrences: 8 },
  { year: "2022", rustOccurrences: 18, blastOccurrences: 15 },
  { year: "2023", rustOccurrences: 15, blastOccurrences: 22 },
  { year: "2024", rustOccurrences: 24, blastOccurrences: 19 },
  { year: "2025", rustOccurrences: 32, blastOccurrences: 28 },
  { year: "2026", rustOccurrences: 38, blastOccurrences: 35 }
];

const HISTORICAL_DB = [
  { id: 1, date: "Nov 2025", region: "Kharindwa Village", crop: "Rice", disease: "Rice Blast", severity: "Critical", containment: "Completed" },
  { id: 2, date: "Dec 2025", region: "Bhucho Block", crop: "Wheat", disease: "Yellow Rust", severity: "High", containment: "Completed" },
  { id: 3, date: "Jan 2026", region: "Ludhiana Area", crop: "Wheat", disease: "Yellow Rust", severity: "Moderate", containment: "Completed" },
  { id: 4, date: "Feb 2026", region: "Raman District", crop: "Potato", disease: "Late Blight", severity: "Low", containment: "Completed" },
  { id: 5, date: "Mar 2026", region: "Nilokheri Sector", crop: "Sugarcane", disease: "Red Rot", severity: "Low", containment: "Completed" }
];

const STRATEGIC_INSIGHTS = [
  { pathogen: "Yellow Rust", seasonality: "Cyclical (Nov - Feb)", alert: "Winter temperature drops trigger spore germination.", resilience: "Seed rust-resistant hybrids like HD-3086." },
  { pathogen: "Rice Blast", seasonality: "High Humidity (>85%)", alert: "Wind-driven vector corridors disperse spore clouds.", resilience: "Deploy early copper sprays based on humidity alarms." }
];

export default function HistoricalIntelligence() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDb = HISTORICAL_DB.filter(
    (item) =>
      item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Historical Disease Intelligence</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Explore past outbreaks records, analyze multi-year pathogen trends, and review strategic resilience guidelines.
        </p>
      </div>

      {/* Historical Stats KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Outbreak Records"
          value="45 Logs"
          trend="Since 2020"
          trendType="neutral"
          subtext="Searchable disease repository"
          icon={<Archive className="text-[#31572c]" />}
        />
        <StatsCard
          title="Seasonality Peak"
          value="Nov - Feb"
          trend="Yellow Rust focus"
          trendType="neutral"
          subtext="Cyclical pathogen spikes"
          icon={<Calendar className="text-[#31572c]" />}
        />
        <StatsCard
          title="Forecast Accuracy"
          value="94.8%"
          trend="Verified models"
          trendType="success"
          subtext="Predicted vs actual validation"
          icon={<Cpu className="text-[#31572c]" />}
        />
        <StatsCard
          title="El Nino Risk Index"
          value="Elevated"
          trend="Climate impact"
          trendType="danger"
          subtext="Correlates with blast cycles"
          icon={<ShieldAlert className="text-[#31572c]" />}
        />
      </div>

      {/* Multi-Year Trend Chart & Strategic Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Multi-Year Outbreak Frequency (Recharts Line Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#31572c]" /> Multi-Year Pathogen Outbreaks Frequency
          </h3>
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MULTIYEAR_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '10px' }} />
                <Legend textAnchor="middle" />
                <Line type="monotone" dataKey="rustOccurrences" stroke="#ef4444" strokeWidth={2.5} name="Yellow Rust" />
                <Line type="monotone" dataKey="blastOccurrences" stroke="#31572c" strokeWidth={2.5} name="Rice Blast" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Resilience Insights */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#31572c]" /> Strategic Sourcing Insights
          </h3>
          <div className="space-y-4 text-xs font-semibold text-slate-700">
            {STRATEGIC_INSIGHTS.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1.5">
                <span className="font-black text-slate-900 block">{item.pathogen} • {item.seasonality}</span>
                <span className="text-[10px] text-red-650 block">Warning: {item.alert}</span>
                <span className="text-[10px] text-[#31572c] block font-bold">Resilience Plan: {item.resilience}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Searchable Historical Database */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <Archive className="w-4 h-4 text-[#31572c]" /> Historical Outbreaks Searchable Logs
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search date, disease, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8.5 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c] w-52 bg-slate-50"
            />
          </div>
        </div>

        <GenericTable
          columns={[
            { header: "Outbreak Date", accessor: "date", className: "font-black text-slate-950" },
            { header: "Infected Village", accessor: "region" },
            { header: "Crop Affected", accessor: "crop" },
            { header: "Pathogen Inspected", accessor: "disease" },
            { 
              header: "Outbreak Severity", 
              accessor: "severity",
              cell: (val) => (
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  val === "Critical" ? "bg-red-105 text-red-700" : val === "High" ? "bg-orange-105 text-orange-700" : "bg-yellow-105 text-yellow-750"
                }`}>{val}</span>
              )
            },
            { 
              header: "Containment Status", 
              accessor: "containment",
              cell: (val) => (
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {val}
                </span>
              )
            }
          ]}
          data={filteredDb}
          emptyMessage="No historical logs found matching search terms."
        />
      </div>
    </div>
  );
}
