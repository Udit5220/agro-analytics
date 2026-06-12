import React, { useState } from 'react';
import { 
  Newspaper, 
  FileText, 
  Activity, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

export default function NewsIntelDashboard() {
  const [selectedArticle, setSelectedArticle] = useState(null); // stores article object when slide-over/modal is open

  const metrics = [
    {
      label: "SCRAPED SOURCES",
      value: "200+",
      badge: "REAL-TIME CRAWLER",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200"
    },
    {
      label: "DAILY ARTICLES",
      value: "128",
      badge: "PROCESSED BY LLM",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-100"
    },
    {
      label: "MARKET SENTIMENT",
      value: "Positive",
      badge: "+0.62 INDEX SCORE",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-100"
    },
    {
      label: "POLICY ALERTS",
      value: "3 Active",
      badge: "CRITICAL RATINGS",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-100"
    }
  ];

  const newsItems = [
    {
      id: 1,
      title: "Mandi Wheat Arrival Surges by 15% in Haryana Region",
      impact: "High Supply",
      rating: "Price Stabilized",
      time: "2 hours ago",
      aiSummary: "AI impact assessment indicates high arrival volumes at Karnal and Kurukshetra mandis. Price fluctuations are stabilized due to robust regional warehouse offloading. Minimum Support Price (MSP) operations are fully functional.",
      financialImpact: "Neutral-Positive: Stabilizes procurement prices for local flour mills, preventing sudden price hikes for end-consumers.",
      agriImpact: "High: Temporary storage constraints at primary mandis require FPOs to regulate logistics timelines."
    },
    {
      id: 2,
      title: "Central Govt Announces New Micro-Irrigation Subsidy Package",
      impact: "Major Policy",
      rating: "Subsidy Boost",
      time: "5 hours ago",
      aiSummary: "The Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) budget has received an additional allocation targeting dryland farming hubs. Micro-drip and sprinkler systems are subsidized up to 80% for smallholder FPO clusters.",
      financialImpact: "Highly Positive: Reduces capital expenditure on water management equipment by 30-40% for cooperative farms.",
      agriImpact: "Critical: Improves water-use efficiency in cotton and oilseed crop cycles, mitigating dry-season soil degradation."
    },
    {
      id: 3,
      title: "Haryana Crop Insurance Registry Window Extended to June 15",
      impact: "Direct Welfare",
      rating: "Relief for Farmers",
      time: "1 day ago",
      aiSummary: "State government has extended the registration portal window for PM Fasal Bima Yojana (PMFBY). This allows farmers in western districts to cover late-sown kharif crops against severe dry spells.",
      financialImpact: "Positive: Provides critical financial buffer against potential crop failures, securing credit eligibility for future seasons.",
      agriImpact: "High: Guarantees risk mitigation parameters for over 1.2 Lakh hectare crop fields."
    },
    {
      id: 4,
      title: "Monsoon Front Enters Central India 4 Days Ahead of Schedule",
      impact: "Atmospheric",
      rating: "Early Sowing Alert",
      time: "1 day ago",
      aiSummary: "Indian Meteorological Department (IMD) confirms advancement of the southwest monsoon over Madhya Pradesh. Pre-monsoon showers have triggered early sowing prep for Soybean and Maize cultivation.",
      financialImpact: "Positive: Early sowing reduces fuel costs for irrigation and improves seed germination cycles, increasing net yield ROI.",
      agriImpact: "High: Recommends immediate land preparation and seed sorting cycles to capitalize on early soil moisture windows."
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      
      {/* 1. Page Header & Hero Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mt-1 shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">News Intelligence Module</h1>
              <span className="text-[#31572c] font-bold text-sm md:text-base font-hindi">समाचार खुफिया</span>
            </div>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Track news crawling nodes, state policy updates, and real-time AI agricultural sentiment ratings.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">{m.label}</span>
              <span className="text-xl font-extrabold text-slate-900 block">{m.value}</span>
            </div>
            <div className={`mt-3 self-start text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border ${m.badgeClass}`}>
              {m.badge}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom dual-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: News Feed Table (2/3 width) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Agronomic & Policy News Feed — Real-time</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-1">Article Headline</th>
                  <th className="pb-3">Impact Level</th>
                  <th className="pb-3">Market Rating</th>
                  <th className="pb-3 text-right pr-2">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {newsItems.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => setSelectedArticle(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-1 font-bold text-slate-900 leading-snug max-w-[280px] group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </td>
                    <td className="py-4 text-orange-600 font-extrabold font-sans">
                      {item.impact}
                    </td>
                    <td className="py-4 text-emerald-800 font-extrabold">
                      {item.rating}
                    </td>
                    <td className="py-4 text-right pr-2 text-slate-450 font-bold flex items-center justify-end gap-1.5 mt-1 sm:mt-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AI Mandi Sentiment Index & Urgent Alerts (1/3 width) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-5">
              <Activity className="w-4 h-4 text-[#31572c]" />
              <h2>⚡ AI Mandi Sentiment Index</h2>
            </div>

            <div className="space-y-4">
              {/* Block 1 (Active Policy Shift) */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Active Policy Shift</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Crop procurement e-registrations have commenced in Palwal and Rohtak districts. Register land details early.
                  </p>
                </div>
              </div>

              {/* Block 2 (Supply Chains Alert) */}
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold text-rose-950">Supply Chains Alert</h3>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    Trucking volumes down due to local regional bypass maintenance on National Highway 44. Expected delays 12h.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Sentiment Score: Positive</span>
            </span>
            <span className="text-emerald-800 font-bold">+0.62 Index</span>
          </div>
        </div>

      </div>

      {/* Slide-over Detail Modal Panel */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          {/* Overlay click to close */}
          <div className="absolute inset-0" onClick={() => setSelectedArticle(null)} />
          
          <div className="bg-white h-full max-w-lg w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between p-6 sm:p-8 animate-slideOver">
            
            <div>
              {/* Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  AI Summary & Impact Node
                </span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-150 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedArticle.time} • {selectedArticle.impact}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">{selectedArticle.title}</h3>
                </div>

                {/* AI Summary Block */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-800" />
                    <span>LLM PARSED KNOWLEDGE SUMMARY</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedArticle.aiSummary}
                  </p>
                </div>

                {/* Agricultural Impact */}
                <div className="p-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>AGRICULTURAL SECTOR IMPACT</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
                    {selectedArticle.agriImpact}
                  </p>
                </div>

                {/* Financial/Market Impact */}
                <div className="p-5 bg-blue-50/20 border border-blue-100/50 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black uppercase text-blue-800 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-blue-700" />
                    <span>MARKET & FINANCIAL IMPACT</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                    {selectedArticle.financialImpact}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Done trigger */}
            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-full bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
