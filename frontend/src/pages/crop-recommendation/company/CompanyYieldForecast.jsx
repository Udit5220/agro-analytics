import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Sliders, 
  TrendingUp, 
  BarChart, 
  AlertTriangle, 
  Sun, 
  CloudRain, 
  Droplet, 
  Activity, 
  Cpu 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const { forecastData, baseStats } = seededData.cropRecommendation1.company.yieldForecast;

// Dynamic forecast timelines based on commodity
const getForecastData = (commodity) => {
  return forecastData[commodity] || forecastData["Wheat"];
};

const getBaseStats = (commodity) => {
  return baseStats[commodity] || baseStats["Wheat"];
};

export default function CompanyYieldForecast() {
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

  // Interactive Scenario Simulator States
  const [rainfall, setRainfall] = useState(0); // variance percentage (-50% to +50%)
  const [temperature, setTemperature] = useState(0); // variance in celsius (-5 to +5)
  const [irrigation, setIrrigation] = useState(0); // variance percentage
  const [pestIncidence, setPestIncidence] = useState(10); // rate 0 to 100%

  // Simulated calculations based on inputs
  const base = getBaseStats(selectedCommodity);
  const baseYield = base.yield;
  const baseProduction = base.production;
  const baseRevenue = base.revenue;

  // Multipliers representing agronomic math
  const rainfallImpact = (rainfall / 100) * 0.15; // up to +/- 7.5%
  const tempImpact = (temperature / 5) * -0.08; // higher temp degrades yield
  const irrImpact = (irrigation / 100) * 0.1;
  const pestImpact = (pestIncidence / 100) * -0.25; // up to -25% yield drop

  const yieldMultiplier = 1 + rainfallImpact + tempImpact + irrImpact + pestImpact;
  const simulatedYield = (baseYield * yieldMultiplier).toFixed(2);
  const simulatedProduction = Math.round(baseProduction * yieldMultiplier);
  const simulatedRevenue = Math.round(baseRevenue * yieldMultiplier);

  const forecastPoints = getForecastData(selectedCommodity);

  const pdfHeaders = ["Forecast Horizon", "Arrival Volume (MT)"];
  const tableDataForPdf = forecastPoints.map(f => [f.name, `${f.arrivals.toLocaleString()} MT`]);

  return (
    <CompanyLayout
      pageName="Yield & Production Forecast Center"
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Simulated Yield</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{simulatedYield} T/Acre</span>
            <span className="text-[9px] font-bold text-slate-500 block mt-0.5">Base: {baseYield} Tons/Acre</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <BarChart className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Forecast Production</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{simulatedProduction.toLocaleString()} MT</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Geo-spatial aggregation</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Sun className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Estimated Value</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">₹{simulatedRevenue}M</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">At standard baseline APMC spot pricing</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Confidence Score</span>
            <span className="text-xl font-extrabold text-emerald-700 block mt-1">94% Confidence</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Derived from historic climate runs</span>
          </div>
        </>
      }
    >
      {/* Visual layouts: Scenario Simulator and Arrival charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dynamic Scenario Simulator Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-4 h-4 text-emerald-600" /> Multi-Variable Sourcing Simulator
            </h2>
            <p className="text-[10px] font-medium text-slate-500">Alter key climate variables to instantly simulate yield and processing outputs</p>
          </div>

          <div className="space-y-4">
            {/* Rainfall slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-slate-450" /> Rainfall Deviation</span>
                <span>{rainfall > 0 ? `+${rainfall}%` : `${rainfall}%`}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={rainfall}
                onChange={(e) => setRainfall(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
              />
            </div>

            {/* Temperature slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-slate-450" /> Temperature Offset</span>
                <span>{temperature > 0 ? `+${temperature}°C` : `${temperature}°C`}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
              />
            </div>

            {/* Irrigation coverage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-slate-450" /> Irrigation Access deviation</span>
                <span>{irrigation > 0 ? `+${irrigation}%` : `${irrigation}%`}</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={irrigation}
                onChange={(e) => setIrrigation(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
              />
            </div>

            {/* Pest incidence */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1 text-red-600"><AlertTriangle className="w-3.5 h-3.5" /> Pest & Disease Severity</span>
                <span className="text-red-650">{pestIncidence}% Incidence</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={pestIncidence}
                onChange={(e) => setPestIncidence(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-[10px] text-slate-500 font-bold space-y-1 mt-4">
            <span className="text-[#31572c] uppercase text-[9px] block">Agronomic simulation rules:</span>
            <p>• High temperature offsets negatively stress grain development cycles (-8% per 5°C offset).</p>
            <p>• Pest severity introduces crop damage that directly reduces output tonnage (up to -25% decline).</p>
          </div>
        </div>

        {/* Harvest Arrival Forecast Curves */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Arrival Volume Forecast Curve</h2>
            <p className="text-[10px] font-medium text-slate-500">Projected arrival velocity over horizons for {selectedCommodity}</p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Area type="monotone" dataKey="arrivals" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorArrivals)" name="Arrivals (MT)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Harvest arrival hubs */}
          <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Expected Sourcing Hub Arrivals</span>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold">
              <div className="border border-slate-100 p-2.5 rounded-xl flex justify-between bg-slate-50/50">
                <div>
                  <span className="block font-extrabold text-slate-800">Haryana Silo A</span>
                  <span className="text-[8px] text-slate-400 font-bold block">ETA: 45 Days</span>
                </div>
                <span className="text-emerald-700 font-black self-center">14,200 MT</span>
              </div>
              <div className="border border-slate-100 p-2.5 rounded-xl flex justify-between bg-slate-50/50">
                <div>
                  <span className="block font-extrabold text-slate-800">Indore Processing Desk</span>
                  <span className="text-[8px] text-slate-400 font-bold block">ETA: 90 Days</span>
                </div>
                <span className="text-emerald-700 font-black self-center">21,000 MT</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </CompanyLayout>
  );
}
