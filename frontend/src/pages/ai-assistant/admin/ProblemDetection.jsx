import React from "react";
import StatsCard from "../../../components/partials/StatsCard";

export default function ProblemDetection() {
  // Core metrics
  const hudMetrics = [
    {
      title: "Critical Anomalies",
      value: "2",
      trend: "Critical",
      trendType: "danger",
      subtext: "Unresolved high-priority errors",
    },
    {
      title: "AI Failure Rate",
      value: "1.4%",
      trend: "â†“ 0.2%",
      trendType: "success",
      subtext: "Incorrect recommendations issued",
    },
    {
      title: "AI Hallucination Rate",
      value: "0.08%",
      trend: "â†“ 0.01%",
      trendType: "success",
      subtext: "Nonsensical advice flagged",
    },
    {
      title: "Model Drift Index",
      value: "1.25",
      trend: "+0.04",
      trendType: "danger",
      subtext: "Deviation from reference weights",
    },
  ];

  // AI Failure Cases requiring immediate intervention
  const criticalCases = [
    {
      id: "FAIL_01",
      category: "Wrong Disease Detection",
      title: "Rice Blast mistaken for Brown Spot",
      description: "Model mistook leaf blast symptoms for standard brown spot pathogen. Dispatched incorrect fungicide recommendation.",
      affectedRegion: "Ferozepur district, Punjab",
      impact: "180 farmers affected",
      imgUrl: "/leaf_scan_diag.png",
      status: "Retraining",
    },
    {
      id: "FAIL_02",
      category: "Wrong Market Prediction",
      title: "Soybean price forecast anomaly (+45%)",
      description: "Forecasting engine generated an impossible wholesale price spike due to missing mandi weather feeds.",
      affectedRegion: "Indore Mandi, MP",
      impact: "1,240 lookups affected",
      imgUrl: "/feed_chart_diag.png",
      status: "In Progress",
    },
  ];

  // System issue log
  const issueLog = [
    {
      id: "#ERR-8902",
      category: "Wrong Disease Detection",
      title: "Rice Blast mistaken for Brown Spot",
      severity: "Critical",
      users: "180",
      status: "Retraining Model",
      statusColor: "bg-red-500",
    },
    {
      id: "#ERR-8903",
      category: "Wrong Market Prediction",
      title: "Soybean price forecast anomaly (+45%)",
      severity: "Critical",
      users: "1,240",
      status: "Restarting API Sync",
      statusColor: "bg-red-500",
    },
    {
      id: "#ERR-8904",
      category: "Image Diagnosis Failure",
      title: "Over-exposure glare reject loop on Cotton photos",
      severity: "High",
      users: "840",
      status: "Updating App Config",
      statusColor: "bg-amber-500",
    },
    {
      id: "#ERR-8905",
      category: "Voice Recognition Failure",
      title: "Marathi dialect transcription loop for irrigation queries",
      severity: "High",
      users: "420",
      status: "Pending Patch Deploy",
      statusColor: "bg-amber-500",
    },
    {
      id: "#ERR-8906",
      category: "Wrong Weather Advice",
      title: "Missing high-temp alert in western Rajasthan desert",
      severity: "Medium",
      users: "3,100",
      status: "Monitoring Weather Feed",
      statusColor: "bg-blue-500",
    },
    {
      id: "#ERR-8907",
      category: "Wrong Crop Recommendation",
      title: "Drought-sensitive Paddy variety advice on dry soil",
      severity: "Medium",
      users: "520",
      status: "Recalibrated Logic",
      statusColor: "bg-emerald-500",
    },
  ];

  const getSeverityBadge = (sev) => {
    const s = sev.toLowerCase();
    if (s === "critical") return "bg-red-50 text-red-700 border-red-100";
    if (s === "high") return "bg-amber-50 text-amber-900 border-amber-200";
    if (s === "medium") return "bg-blue-50 text-blue-800 border-blue-100";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Title Header without filters, state toggle, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Agricultural AI Anomaly & Problem Detection
        </h1>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">
          Tracks wrong recommendations, image processing bottlenecks, audio dialect rejects, and model hallucinations.
        </p>
      </div>

      {/* HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hudMetrics.map((metric, idx) => (
          <StatsCard
            key={idx}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            trendType={metric.trendType}
            subtext={metric.subtext}
          />
        ))}
      </div>

      {/* AI Insights and Health Warning */}
      <div className="bg-[#132a13] text-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#ecf39e]">
          âš ï¸
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">AI System Health Report</h4>
          <p className="text-xs text-white/90 leading-relaxed font-medium mt-1">
            Model drift detected in **NIR spectrum analysis** parameters following app release **v4.2.1-b**. Over-exposure rejects are affecting leaf diagnostics during midday sun. Dispatched hotfix config patch to mitigate transcription delays in Marathi/Gujarati voice inputs.
          </p>
        </div>
      </div>

      {/* Immediate Action Grid - Clean Cards without left red highlights */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
          Critical AI Failures Requiring Intervention
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {criticalCases.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between gap-5 transition-shadow hover:shadow-md">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 block mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block">{item.category}</span>
                    <h4 className="text-sm font-black text-gray-900 tracking-tight leading-snug mt-0.5">{item.title}</h4>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  <div className="bg-red-50 border border-red-100 p-2 rounded-lg text-left">
                    <span className="text-gray-400 block uppercase tracking-wider text-[8px]">Impact</span>
                    <span className="text-red-800 block mt-0.5 leading-none">{item.impact}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-left">
                    <span className="text-gray-400 block uppercase tracking-wider text-[8px]">Region</span>
                    <span className="text-gray-800 block mt-0.5 leading-none">{item.affectedRegion}</span>
                  </div>
                </div>

                <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex gap-2 pt-1">
                  <button className="bg-[#132a13] hover:bg-[#31572c] text-white font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl shadow-xs transition">
                    Retrain Model
                  </button>
                  <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl hover:bg-gray-50 transition">
                    Inspect Logs
                  </button>
                </div>
              </div>

              <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 self-center md:self-auto">
                <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Issues Log Table */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden p-5">
        <h2 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">
          Comprehensive AI Anomaly Log
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3">Log ID</th>
                <th className="p-3">Failure Mode</th>
                <th className="p-3">Specific Bug/Query</th>
                <th className="p-3">Severity</th>
                <th className="p-3 text-center">Farmers Affected</th>
                <th className="p-3 text-right">Intervention Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {issueLog.map((row) => (
                <tr key={row.id} className="hover:bg-[#4f772d]/5 transition-colors">
                  <td className="p-3 font-mono text-gray-500">{row.id}</td>
                  <td className="p-3 font-bold text-gray-900">{row.category}</td>
                  <td className="p-3 text-gray-600 truncate max-w-[200px]">{row.title}</td>
                  <td className="p-3">
                    <span className={`inline-block text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${getSeverityBadge(row.severity)}`}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">{row.users}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`w-1.5 h-1.5 rounded-full ${row.statusColor}`} />
                      <span className="text-gray-800 text-xs">{row.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
