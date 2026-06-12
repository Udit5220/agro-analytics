import React from "react";
import StatsCard from "../../../components/partials/StatsCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import seededData from "../../../seed-json/seededData.json";

const stats = seededData.aiAssistant1.userAnalyticsStats;
const growthData = seededData.aiAssistant1.userAnalyticsGrowthData;
const cropUsageData = seededData.aiAssistant1.userAnalyticsCropUsageData;
const regionalAdoptionData = seededData.aiAssistant1.userAnalyticsRegionalAdoptionData;
const segmentPerformance = seededData.aiAssistant1.userAnalyticsSegmentPerformance;

export default function UserAnalytics() {
  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Page Title Header without state-controller, filters, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
          <span>Intelligence</span> <span>›</span>{" "}
          <span className="text-gray-900 font-black">User Analytics</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955 mt-0.5">
          Agricultural User & Segment Analytics
        </h1>
        <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
          Active users growth, retention, and segments performance tracking.
        </p>
      </div>

      {/* HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((metric, idx) => (
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

      {/* AI Insights & Recommendation Effectiveness Track Panel */}
      <div className="bg-[#132a13] text-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#ecf39e]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">
            AI Segment Insight & Effectiveness
          </h4>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            Advisory consumption among **Small Farmers** has grown by <strong className="text-[#ecf39e]">+18.4% MoM</strong>, driven by disease image diagnoses for **Rice** and **Cotton**. The recommendation acceptance rate is highest in the **FPO** segment at <strong className="text-[#ecf39e]">92.0%</strong>. Localized crop advisory features have lowered spray failure rates by **15%** this season.
          </p>
        </div>
      </div>

      {/* User growth and Crop Usage breakdown charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth by Segment */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                User Growth by Segment
              </h3>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                Growth of active accounts by agricultural stakeholder type
              </p>
            </div>
            <span className="text-[10px] font-bold text-gray-600 bg-gray-150 px-2.5 py-1 rounded-lg border border-gray-200">
              Last 6 Months
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9, paddingTop: 10 }} />
                <Bar dataKey="small" name="Small Farmers" fill="#132a13" stackId="a" />
                <Bar dataKey="medium" name="Medium Farmers" fill="#31572c" stackId="a" />
                <Bar dataKey="large" name="Large Farmers" fill="#4f772d" stackId="a" />
                <Bar dataKey="fpos" name="FPOs" fill="#90a955" stackId="a" />
                <Bar dataKey="traders" name="Traders" fill="#cbd5e1" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Usage Analysis progress indicators */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                Crop Usage Analysis
              </h3>
              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                Query volume and acceptance rate per major crop type
              </p>
            </div>
            <div className="space-y-3 pt-1">
              {cropUsageData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-mono text-gray-955">
                      {item.consults.toLocaleString()} consults ({item.acceptance}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-dark h-full rounded-full"
                      style={{ width: `${item.acceptance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Adoption and State Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Adoption Metrics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Regional Adoption Metrics
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Farmers and FPOs onboarding rate by primary agricultural states
            </p>
          </div>
          <div className="h-44 w-full flex items-center justify-center mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalAdoptionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="farmers" name="Active Farmers" fill="#132a13" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment and Farmer Retention table */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                Segment Performance & Retention Metrics
              </h3>
              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                Engagement index and cohort retention of farming user groups
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-emerald-50/30 border-b border-gray-100">
                  <th className="p-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Stakeholder Segment</th>
                  <th className="p-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active Users</th>
                  <th className="p-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active Rate</th>
                  <th className="p-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">30-Day Retention</th>
                  <th className="p-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Primary Crop Interest</th>
                  <th className="p-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                {segmentPerformance.map((row, idx) => (
                  <tr key={idx} className="hover:bg-brand-medium/5 transition-colors">
                    <td className="p-3 font-bold text-gray-900">{row.segment}</td>
                    <td className="p-3 font-mono text-gray-600">{row.users}</td>
                    <td className="p-3 font-mono text-gray-600">{row.activeRate}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gray-900 w-8">{row.retention}</span>
                        <div className="w-16 bg-gray-100 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-[#132a13] h-full rounded-full"
                            style={{ width: row.retention }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
                        {row.topCrop}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${row.style}`}>
                        {row.status}
                      </span>
                    </td>
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
