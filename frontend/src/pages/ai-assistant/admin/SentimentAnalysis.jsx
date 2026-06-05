import React from "react";
import StatsCard from "../../../components/partials/StatsCard";
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
  Bar,
} from "recharts";
import seededData from "../../../seed-json/seededData.json";

const mainMetrics = seededData.aiAssistant1.sentimentMainMetrics;
const timelineData = seededData.aiAssistant1.sentimentTimelineData;
const emotions = seededData.aiAssistant1.sentimentEmotions;
const cropSentimentData = seededData.aiAssistant1.sentimentCropSentimentData;
const regionalSentimentData = seededData.aiAssistant1.sentimentRegionalSentimentData;
const painPoints = seededData.aiAssistant1.sentimentPainPoints;

export default function SentimentAnalysis() {
  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Title Header without filters, state toggle, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Farmer Sentiment & Confidence Analysis
        </h1>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">
          Evaluates the emotional climate of the farming ecosystem, crop confidence, and feedback signals.
        </p>
      </div>

      {/* HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((metric, idx) => (
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

      {/* AI Insights Panel */}
      <div className="bg-[#132a13] text-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
          <svg className="w-4 h-4 text-[#ecf39e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">AI Sentiment Pulse</h4>
          <p className="text-xs text-white/90 leading-relaxed font-medium mt-1">
            **Market Anxiety** has dropped by **4.8%** following stabilizes in wholesale MSP index. However, **Disease Concern** remains elevated for **Cotton** growers in Gujarat due to pest warnings. The overall **Farmer Confidence Index** is healthy at **78.4/100**.
          </p>
        </div>
      </div>

      {/* Charts: Sentiment Trend and Emotion Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment over Time */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Sentiment Trend (Confidence vs. Anxiety)
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#132a13]" />
                <span className="text-gray-900">Farmer Confidence</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-red-500" />
                <span>Agronomic Anxiety</span>
              </div>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Line type="monotone" dataKey="confidence" name="Confidence Index" stroke="#132a13" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="anxiety" name="Anxiety Index" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emotion progress indicators */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-3.5">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
            Agricultural Emotion Index
          </h3>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {emotions.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-black text-gray-955 font-mono">{item.rate}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.rate }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional & Crop-specific Sentiment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment by Region */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Regional Sentiment Analysis
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Farmer Confidence score across primary agricultural states
            </p>
          </div>
          <div className="h-44 w-full flex items-center justify-center mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalSentimentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="confidence" name="Confidence Index" fill="#132a13" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Specific Sentiment */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">
            Crop-Specific Sentiment Profile
          </h3>
          <div className="space-y-4 py-1">
            {cropSentimentData.map((seg, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 w-16 shrink-0">{seg.crop}</span>
                <div className="flex-1 h-3.5 rounded overflow-hidden flex shadow-2xs">
                  <div className="bg-[#132a13]" style={{ width: `${seg.positive}%` }} title={`Pos: ${seg.positive}%`}></div>
                  <div className="bg-gray-300" style={{ width: `${seg.neutral}%` }} title={`Neu: ${seg.neutral}%`}></div>
                  <div className="bg-red-500" style={{ width: `${seg.negative}%` }} title={`Neg: ${seg.negative}%`}></div>
                </div>
                <span className="text-[10px] font-black font-mono text-gray-900 w-8 text-right">{seg.positive}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-5 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-[#132a13]" />
              <span>Pos</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-gray-300" />
              <span>Neu</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-red-500" />
              <span>Neg</span>
            </div>
          </div>
        </div>

        {/* Top Farmer Complaints Table */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-3">
            Top Farmer Complaints
          </h3>
          <div className="space-y-2 mt-2">
            {painPoints.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-b-0">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{item.cause}</h4>
                  <span className="text-[9px] text-gray-400 mt-0.5 block">{item.users}</span>
                </div>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                  item.priority === "CRITICAL" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-900 border-amber-200"
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
