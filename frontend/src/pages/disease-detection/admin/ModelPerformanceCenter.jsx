import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Cpu,
  Sliders,
  Database,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Play,
  ArrowRight,
  RefreshCw,
  Plus
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";

export default function ModelPerformanceCenter() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("90D");
  const [trainingModal, setTrainingModal] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(45);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Simulate training progress increment
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setTrainingProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const stats = [
    { label: "Overall Model Accuracy", val: "83.4%", arrow: "↑", change: "1.2%", status: "Healthy" },
    { label: "Avg Inference Latency", val: "142ms", arrow: "↓", change: "8ms", status: "Healthy" },
    { label: "Prediction Volume (MTD)", val: "4.2M", arrow: "↑", change: "18%", status: "Healthy" },
    { label: "Models Needing Retraining", val: "2", arrow: "↑", change: "1", status: "Warning" }
  ];

  const modelsList = [
    { name: "Leaf Disease Vision Model", version: "v2.4.1", status: "Live", acc: 87.2, precision: 86.5, recall: 88.0, f1: 87.2, latency: 45, samples: "284K", drift: "Stable", driftPct: 0.8 },
    { name: "Outbreak Risk Predictor", version: "v1.8.3", status: "Warning", acc: 81.4, precision: 80.2, recall: 79.5, f1: 79.8, latency: 85, samples: "192K", drift: "Drift Detected", driftPct: 5.4 },
    { name: "14-Day Forecast Model", version: "v3.1.0", status: "Live", acc: 79.8, precision: 78.4, recall: 81.2, f1: 79.8, latency: 125, samples: "340K", drift: "Stable", driftPct: 1.1 },
    { name: "Satellite Stress Classifier", version: "v2.0.2", status: "Live", acc: 84.6, precision: 83.9, recall: 85.0, f1: 84.4, latency: 240, samples: "410K", drift: "Stable", driftPct: 1.4 },
    { name: "Disease Spread Propagator", version: "v1.2.4", status: "Retraining", acc: 71.3, precision: 68.2, recall: 73.1, f1: 70.6, latency: 195, samples: "155K", drift: "Drift Detected", driftPct: 7.2 }
  ];

  // Accuracy Trend over time by timeframe
  const trendDataByTimeframe = {
    "30D": [
      { name: "Day 5", Leaf: 85.9, Outbreak: 82.8, Forecast: 78.9, Satellite: 83.2, Propagator: 73.8 },
      { name: "Day 10", Leaf: 86.2, Outbreak: 83.1, Forecast: 79.2, Satellite: 83.8, Propagator: 74.5 },
      { name: "Day 20", Leaf: 86.8, Outbreak: 82.3, Forecast: 79.6, Satellite: 84.1, Propagator: 72.4 },
      { name: "Day 30", Leaf: 87.2, Outbreak: 81.4, Forecast: 79.8, Satellite: 84.6, Propagator: 71.3 }
    ],
    "90D": [
      { name: "Day 10", Leaf: 86.2, Outbreak: 83.1, Forecast: 79.2, Satellite: 83.8, Propagator: 74.5 },
      { name: "Day 30", Leaf: 86.8, Outbreak: 82.5, Forecast: 79.5, Satellite: 84.1, Propagator: 73.2 },
      { name: "Day 60", Leaf: 87.0, Outbreak: 81.9, Forecast: 79.7, Satellite: 84.4, Propagator: 72.1 },
      { name: "Day 90", Leaf: 87.2, Outbreak: 81.4, Forecast: 79.8, Satellite: 84.6, Propagator: 71.3 }
    ],
    "6M": [
      { name: "Month 1", Leaf: 85.1, Outbreak: 84.2, Forecast: 78.1, Satellite: 82.4, Propagator: 75.8 },
      { name: "Month 2", Leaf: 85.9, Outbreak: 83.5, Forecast: 78.7, Satellite: 83.1, Propagator: 74.9 },
      { name: "Month 3", Leaf: 86.2, Outbreak: 83.1, Forecast: 79.2, Satellite: 83.8, Propagator: 74.5 },
      { name: "Month 4", Leaf: 86.8, Outbreak: 82.5, Forecast: 79.5, Satellite: 84.1, Propagator: 73.2 },
      { name: "Month 5", Leaf: 87.0, Outbreak: 81.9, Forecast: 79.7, Satellite: 84.4, Propagator: 72.1 },
      { name: "Month 6", Leaf: 87.2, Outbreak: 81.4, Forecast: 79.8, Satellite: 84.6, Propagator: 71.3 }
    ]
  };

  const trendData = trendDataByTimeframe[timeframe] || trendDataByTimeframe["90D"];

  // False Prediction Data
  const falsePredictionData = [
    { name: "Leaf Vision", FP: 120, FN: 85 },
    { name: "Outbreak Risk", FP: 240, FN: 190 },
    { name: "14D Forecast", FP: 310, FN: 220 },
    { name: "Satellite Classifier", FP: 95, FN: 110 },
    { name: "Spread Propagator", FP: 420, FN: 380 }
  ];

  // Prediction Accuracy Heatmap table grid: Crop x Disease
  const crops = ["Rice", "Wheat", "Cotton", "Maize", "Pulses", "Sugarcane"];
  const diseases = ["Rice Blast", "Leaf Rust", "BPH", "Yellow Mosaic", "Late Blight", "Sheath Blight"];
  const heatmapData = {
    "Rice": { "Rice Blast": 88.5, "Leaf Rust": 0, "BPH": 86.2, "Yellow Mosaic": 0, "Late Blight": 0, "Sheath Blight": 84.1 },
    "Wheat": { "Rice Blast": 0, "Leaf Rust": 89.2, "BPH": 0, "Yellow Mosaic": 72.4, "Late Blight": 0, "Sheath Blight": 0 },
    "Cotton": { "Rice Blast": 0, "Leaf Rust": 0, "BPH": 0, "Yellow Mosaic": 81.8, "Late Blight": 0, "Sheath Blight": 0 },
    "Maize": { "Rice Blast": 0, "Leaf Rust": 82.1, "BPH": 78.4, "Yellow Mosaic": 0, "Late Blight": 69.5, "Sheath Blight": 71.2 },
    "Pulses": { "Rice Blast": 0, "Leaf Rust": 0, "BPH": 0, "Yellow Mosaic": 85.5, "Late Blight": 70.1, "Sheath Blight": 0 },
    "Sugarcane": { "Rice Blast": 0, "Leaf Rust": 76.5, "BPH": 0, "Yellow Mosaic": 0, "Late Blight": 0, "Sheath Blight": 78.2 }
  };

  const getCellColor = (val) => {
    if (val === 0) return "bg-gray-50 text-gray-300";
    if (val >= 85) return "bg-emerald-100 text-emerald-900 font-extrabold";
    if (val >= 70) return "bg-amber-100 text-amber-900 font-extrabold";
    return "bg-red-100 text-red-900 font-extrabold";
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-[400px] bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Hero Header Banner */}
      <div className="bg-[#132a13] rounded-2xl p-6 text-white border border-[#31572c]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="flex flex-col space-y-1.5 z-10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
            AI Intelligence
          </span>
          <h2 className="text-xl font-black tracking-tight">
            ML Model Performance Center
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Row 1 — 4 Model Health KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                card.status === "Healthy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
              }`}>
                {card.status}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-3.5 mb-1.5">
              <span className="text-3xl font-black text-gray-950 tracking-tight font-mono">{card.val}</span>
              <span className={`text-xs font-black ${card.arrow === "↑" && card.status === "Warning" ? "text-red-500" : "text-emerald-500"}`}>
                {card.arrow} {card.change}
              </span>
            </div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">vs baseline model</span>
          </div>
        ))}
      </div>

      {/* Row 2 — Model Cards grid (3+2 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modelsList.map((model, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-snug">{model.name}</h4>
                  <span className="text-[9px] font-bold text-slate-400 font-mono">{model.version}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                  model.status === 'Live' ? 'bg-emerald-50 text-emerald-700' : model.status === 'Warning' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-800'
                }`}>
                  {model.status}
                </span>
              </div>

              {/* Metrics chips row */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 text-center text-[9px] font-black uppercase">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block font-bold text-[8px]">Acc</span>
                  <span className="text-slate-800 font-mono font-black">{model.acc}%</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block font-bold text-[8px]">Prec</span>
                  <span className="text-slate-800 font-mono font-black">{model.precision}%</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block font-bold text-[8px]">Rec</span>
                  <span className="text-slate-800 font-mono font-black">{model.recall}%</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block font-bold text-[8px]">F1</span>
                  <span className="text-slate-800 font-mono font-black">{model.f1}%</span>
                </div>
              </div>

              <div className="mt-3.5 space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-mono text-slate-700 font-bold">{model.latency}ms avg</span>
                </div>
                <div className="flex justify-between">
                  <span>Samples:</span>
                  <span className="font-mono text-slate-700 font-bold">{model.samples}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Drift Index:</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                    model.drift === 'Stable' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                  }`}>{model.drift} ({model.driftPct}%)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-gray-100 pt-3">
              <button
                onClick={() => alert(`Detailed diagnostics for ${model.name}:\n- F1-Score: ${model.f1}%\n- Inference Latency: ${model.latency}ms\n- Version: ${model.version}\n- Status: ${model.status}`)}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-slate-700 text-[9px] font-black uppercase py-1.5 rounded-xl border border-gray-200 transition"
              >
                View Details
              </button>
              <button
                onClick={() => alert(`Retraining queued for ${model.name}`)}
                className="bg-[#31572c] hover:bg-[#4f772d] text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-xl transition shadow active:scale-95"
              >
                Retrain
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Accuracy Trend */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Model Accuracy Trend</h3>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden text-[9px] font-black">
              {["30D", "90D", "6M"].map(r => (
                <button
                  key={r}
                  onClick={() => setTimeframe(r)}
                  className={`px-3 py-1.5 transition ${
                    timeframe === r ? "bg-[#31572c] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} domain={[70, 95]} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Line type="monotone" dataKey="Leaf" stroke="#4f772d" strokeWidth={2} name="Leaf Vision" />
                <Line type="monotone" dataKey="Outbreak" stroke="#90a955" strokeWidth={2} name="Outbreak Predictor" />
                <Line type="monotone" dataKey="Forecast" stroke="#ecf39e" strokeWidth={2} name="Forecast Model" />
                <Line type="monotone" dataKey="Satellite" stroke="#e74c3c" strokeWidth={2} name="Satellite Classifier" />
                
                {/* Dashed red line at 75% accuracy threshold */}
                <Line type="monotone" data={[75, 75, 75, 75]} stroke="#f87171" strokeDasharray="5 5" strokeWidth={1.5} name="SLA Min (75%)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Model Drift Analytics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Model Drift Analytics</h3>
          </div>
          <div className="overflow-x-auto flex-1 scrollbar-thin">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-3 text-gray-400 font-bold uppercase">Model</th>
                  <th className="p-3 text-gray-400 font-bold uppercase text-right">Current</th>
                  <th className="p-3 text-gray-400 font-bold uppercase text-right">Baseline</th>
                  <th className="p-3 text-gray-400 font-bold uppercase text-right">Drift</th>
                  <th className="p-3 text-gray-400 font-bold uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {modelsList.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 font-semibold text-gray-700">
                    <td className="p-3 font-bold text-gray-900">{row.name}</td>
                    <td className="p-3 text-right font-mono">{row.acc}%</td>
                    <td className="p-3 text-right font-mono">{row.acc + (row.drift === 'Stable' ? 0.5 : 4.5)}%</td>
                    <td className="p-3 text-right font-mono text-red-600 font-black">{row.driftPct}%</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        row.driftPct >= 5 ? 'bg-red-50 text-red-700' : row.driftPct >= 2 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {row.drift}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Col 1: False Prediction Analytics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-2">
            False Prediction Analytics (M-TD)
          </h4>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={falsePredictionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: "8px" }} />
                <YAxis style={{ fontSize: "8px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Bar dataKey="FP" fill="#f59e0b" name="False Positives" radius={[3, 3, 0, 0]} />
                <Bar dataKey="FN" fill="#ef4444" name="False Negatives" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-950 font-bold leading-relaxed">
            ⚠️ <span className="font-extrabold uppercase">Critical Impact Note:</span> False Negatives on Rice Blast mean a farmer is not warned, leading directly to crop yield loss and customer churn. Minimizing False Negatives is prioritized in retrain cycles.
          </div>
        </div>

        {/* Col 2: Training Center */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-3">
              Retraining Center Status
            </h4>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                  <span>Disease Spread Propagator training</span>
                  <span className="font-mono text-[#31572c] font-black">{trainingProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                  <div className="bg-[#31572c] h-full rounded-full transition-all duration-500" style={{ width: `${trainingProgress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-black uppercase">
                <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                  <span className="text-gray-400 block font-bold text-[8px]">Dataset Size</span>
                  <span className="text-slate-800 font-mono">1.2M Samples</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                  <span className="text-gray-400 block font-bold text-[8px]">New Since Trained</span>
                  <span className="text-slate-800 font-mono">+42K Images</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                  <span className="text-gray-400 block font-bold text-[8px]">Quality Score</span>
                  <span className="text-[#31572c] font-mono">98.4/100</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setTrainingProgress(0)}
            className="w-full bg-[#31572c] hover:bg-[#4f772d] text-white text-[10px] font-black uppercase py-2 rounded-xl transition active:scale-95 shadow-md flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} className="animate-spin" /> Schedule Retraining Job
          </button>
        </div>
      </div>

      {/* Row 5 — Prediction Accuracy Heatmap matrix */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
          Prediction Accuracy by Crop & Disease Matrix
        </h4>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-center border border-gray-200 text-xs border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-gray-200">
                <th className="p-3 text-left border-r border-gray-200 font-black">Crop Type</th>
                {diseases.map(d => (
                  <th key={d} className="p-3 font-black text-[10px] uppercase tracking-wider">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crops.map(crop => (
                <tr key={crop} className="border-b border-gray-200 hover:bg-[#4f772d]/5 transition-colors font-semibold">
                  <td className="p-3 text-left border-r border-gray-200 font-black text-slate-800">{crop}</td>
                  {diseases.map(d => {
                    const val = heatmapData[crop]?.[d];
                    return (
                      <td key={d} className={`p-3 font-mono border-r border-gray-100 ${getCellColor(val)}`}>
                        {val > 0 ? `${val}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
