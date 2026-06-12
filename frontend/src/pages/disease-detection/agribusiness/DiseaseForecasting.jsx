import React from "react";
import { 
  TrendingUp, Calendar, AlertTriangle, CloudLightning, 
  Wind, Shield, Info, Compass, HelpCircle, Activity 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const FORECAST_TIMELINE = [
  { day: "Day 1", probability: 12 },
  { day: "Day 3", probability: 18 },
  { day: "Day 5", probability: 28 },
  { day: "Day 7", probability: 42 },
  { day: "Day 9", probability: 68 },
  { day: "Day 11", probability: 85 },
  { day: "Day 13", probability: 92 },
  { day: "Day 14", probability: 95 }
];

const WEATHER_CORRELATION = [
  { id: 1, disease: "Yellow Rust", humidity: "82%", temp: "18°C", correlation: "Strong (0.88)", outbreakProb: "85%" },
  { id: 2, disease: "Rice Blast", humidity: "88%", temp: "26°C", correlation: "Very Strong (0.92)", outbreakProb: "92%" },
  { id: 3, disease: "Late Blight", humidity: "90%", temp: "15°C", correlation: "Strong (0.84)", outbreakProb: "78%" },
  { id: 4, disease: "Downy Mildew", humidity: "75%", temp: "22°C", correlation: "Moderate (0.68)", outbreakProb: "45%" }
];

const DRIVER_ANALYSIS = [
  { driver: "Relative Humidity (>85%)", impact: 42, color: "bg-brand-dark" },
  { driver: "Spore Concentration (PPM)", impact: 28, color: "bg-red-500" },
  { driver: "Ambient Temperature Drift", impact: 18, color: "bg-amber-500" },
  { driver: "Wind Direction Vectors", impact: 12, color: "bg-blue-500" }
];

export default function DiseaseForecasting() {
  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Disease Risk Forecasting</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Generate crop disease probability forecasts, analyze weather correlation indices, and review AI predictive breakdowns.
        </p>
      </div>

      {/* Forecast Dashboard KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Outbreak Probability"
          value="92%"
          trend="Critical"
          trendType="danger"
          subtext="Rice Blast (Kharindwa Zone)"
          icon={<AlertTriangle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Forecast Horizon"
          value="14 Days"
          trend="High confidence"
          trendType="success"
          subtext="Long-term vector simulations"
          icon={<Calendar className="text-[#31572c]" />}
        />
        <StatsCard
          title="Avg Model Accuracy"
          value="92%"
          trend="92.4% historical"
          trendType="success"
          subtext="Validated prediction rates"
          icon={<Shield className="text-[#31572c]" />}
        />
        <StatsCard
          title="Active Spore Count"
          value="240 ppm"
          trend="Rising"
          trendType="danger"
          subtext="Pathogen spore collection grids"
          icon={<Activity className="text-[#31572c]" />}
        />
      </div>

      {/* Timeline Chart & Drivers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#31572c]" /> 14-Day Outbreak Probability Timeline (%)
          </h3>
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '10px' }} />
                <Line type="monotone" dataKey="probability" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spore Disease Driver Analysis */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> Disease Driver Analysis
            </h3>
            
            <div className="space-y-3.5 mt-4 text-xs font-semibold text-slate-700">
              {DRIVER_ANALYSIS.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-[11px] text-slate-800">
                    <span>{item.driver}</span>
                    <span className="text-[#31572c]">{item.impact}% impact</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.impact}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Correlation Engine & Prediction Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Correlation Engine */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <CloudLightning className="w-4 h-4 text-[#31572c]" /> Pathogen vs Weather Correlation Engine
          </h3>
          <GenericTable
            columns={[
              { header: "Pathogen Disease", accessor: "disease", className: "font-black text-slate-900" },
              { header: "Humidity Threshold", accessor: "humidity" },
              { header: "Temp Range Optimal", accessor: "temp" },
              { header: "Correlation Factor", accessor: "correlation" },
              { 
                header: "Outbreak Prob", 
                accessor: "outbreakProb",
                cell: (val) => (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    parseInt(val) > 80 ? "bg-red-105 text-red-700" : "bg-amber-105 text-amber-700"
                  }`}>
                    {val} Risk
                  </span>
                )
              }
            ]}
            data={WEATHER_CORRELATION}
            showSearch={false}
          />
        </div>

        {/* AI Explanation brief */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-500" /> AI Prediction Commentary
            </h3>
            <p className="text-[10px] text-slate-605 font-bold leading-relaxed mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50">
              Weather models project a prolonged relative humidity cycle (&gt;88%) for the next 7 days in Kharindwa, directly correlating with an expedited Rice Blast outbreak. The neural forecasting network has reached a 92% confidence rating for this model. We recommend launching preventive copper sprays.
            </p>
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-3.5 mt-2">
            <span>Model: NeuralPredict v1.4</span>
            <span className="text-[#31572c] font-black">92% Confidence Score</span>
          </div>
        </div>

      </div>
    </div>
  );
}
