import React from "react";
import { Newspaper, FileText, Activity, AlertTriangle, ArrowUpRight, Award, Megaphone } from "lucide-react";

export default function NewsIntelDashboard() {
  const metrics = [
    { label: "Scraped Sources", value: "200+", sub: "Real-time crawler", color: "text-[#31572c] bg-[#31572c]/10" },
    { label: "Daily Articles", value: "128", sub: "Processed by LLM", color: "text-emerald-700 bg-emerald-50" },
    { label: "Market Sentiment", value: "Positive", sub: "+0.62 Index score", color: "text-sky-700 bg-sky-50" },
    { label: "Policy Alerts", value: "3 Active", sub: "Critical ratings", color: "text-red-700 bg-red-50" },
  ];

  const newsItems = [
    { title: "Mandi Wheat Arrival Surges by 15% in Haryana Region", impact: "High Supply", rating: "Price Stabilized", time: "2 hours ago" },
    { title: "Central Govt Announces New Micro-Irrigation Subsidy Package", impact: "Major Policy", rating: "Subsidy Boost", time: "5 hours ago" },
    { title: "Haryana Crop Insurance Registry Window Extended to June 15", impact: "Direct Welfare", rating: "Relief for Farmers", time: "1 day ago" },
    { title: "Monsoon Front Enters Central India 4 Days Ahead of Schedule", impact: "Atmospheric", rating: "Early Sowing Alert", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Newspaper className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>News Intelligence Module</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              समाचार खुफिया
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Track news crawling nodes, state policy updates, and real-time AI agricultural sentiment ratings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">
              {m.label}
            </span>
            <div>
              <h4 className="text-gray-900 text-xl font-black tracking-tight">{m.value}</h4>
              <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 ${m.color}`}>
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* News Feeds & Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: News Feed Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
            Agronomic & Policy News Feed — Real-time
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3 pl-1">Article Headline</th>
                  <th className="p-3">Impact Level</th>
                  <th className="p-3">Market Rating</th>
                  <th className="p-3 text-right pr-2">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {newsItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f4f7f4]/30 transition-colors text-xs font-semibold">
                    <td className="p-3 pl-1 text-gray-900 font-bold leading-snug max-w-[280px]">{item.title}</td>
                    <td className="p-3 text-amber-700 font-black">{item.impact}</td>
                    <td className="p-3 text-[#31572c] font-black">{item.rating}</td>
                    <td className="p-3 text-right pr-2 text-gray-450 font-bold">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Key News Highlights */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={13} className="text-[#31572c]" />
            <span>AI Mandi Sentiment Index</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-[#f4f7f4] border border-gray-150 p-3 rounded-xl flex gap-2.5">
              <Megaphone size={18} className="text-[#31572c] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-800 block">Active Policy Shift</span>
                <span className="text-[11px] text-gray-650 block mt-0.5 leading-relaxed font-semibold">
                  Crop procurement e-registrations have commenced in Palwal and Rohtak districts. Register land details early.
                </span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 text-red-950 p-3 rounded-xl flex gap-2.5">
              <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-red-900 block">Supply Chains Alert</span>
                <span className="text-[11px] text-red-950 block mt-0.5 leading-relaxed font-medium">
                  Trucking volumes down due to local regional bypass maintenance on National Highway 44. Expected delays 12h.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
