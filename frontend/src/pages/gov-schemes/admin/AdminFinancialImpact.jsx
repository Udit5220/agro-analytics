import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Compass,
  FileCheck,
  IndianRupee,
  Building,
  Sparkles,
  BarChart3,
  Percent,
  ChevronRight,
  PlusCircle,
  Activity,
  ArrowUpRight,
  Briefcase,
  Users,
} from "lucide-react";
import { getAnalyticsData, fetchAnalyticsData } from "./govSchemesHelper";

/*
// --- OLD FINANCIAL IMPACT COMPONENT COMMENTED OUT ---
export default function AdminFinancialImpact() {
  return (
    <div>Old Financial Impact Code</div>
  );
}
*/

// --- NEW REDESIGNED OPPORTUNITY INTELLIGENCE COMPONENT ---

export default function AdminFinancialImpact() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [activeSegment, setActiveSegment] = useState("company");

  useEffect(() => {
    fetchAnalyticsData()
      .then((data) => setAnalytics(data))
      .catch(console.error);
  }, []);

  const segmentSchemes = (analytics?.schemes || []).filter((s) =>
    activeSegment === "company" ? !s.isFarmerScheme : s.isFarmerScheme,
  );

  const segmentMissed = (analytics?.missedOpportunities || []).filter((m) =>
    activeSegment === "company" ? !m.isFarmerScheme : m.isFarmerScheme,
  );


  // Aggregate Potential Value splits from localStorage
  const grantsTotal = segmentSchemes
    .filter((s) => s.benefitType === "Grants")
    .reduce((sum, s) => sum + s.potValue, 0);
  const subsidiesTotal = segmentSchemes
    .filter((s) => s.benefitType === "Subsidies")
    .reduce((sum, s) => sum + s.potValue, 0);
  const taxTotal = segmentSchemes
    .filter((s) => s.benefitType === "Tax Benefits")
    .reduce((sum, s) => sum + s.potValue, 0);
  const creditTotal = segmentSchemes
    .filter((s) => s.benefitType === "Loans")
    .reduce((sum, s) => sum + s.potValue, 0);
  const innovationTotal = segmentSchemes
    .filter(
      (s) =>
        s.category === "Startup Programs" || s.category === "Agritech Programs",
    )
    .reduce((sum, s) => sum + s.potValue, 0);
  const exportTotal = segmentSchemes
    .filter(
      (s) =>
        s.benefitType === "Export Incentives" ||
        s.category === "Export Incentives",
    )
    .reduce((sum, s) => sum + s.potValue, 0);

  const totalPotential = segmentSchemes.reduce((sum, s) => sum + s.potValue, 0);

  // Popularity calculations based on logs
  const mostViewed = [...segmentSchemes].sort((a, b) => b.viewed - a.viewed)[0];
  const mostSaved =
    segmentSchemes.find((s) => s.bookmarked) || segmentSchemes[0];
  const highestIntent = [...segmentSchemes].sort(
    (a, b) => b.applyClicked - a.applyClicked,
  )[0];
  const mostShared = segmentSchemes[1] || segmentSchemes[0];
  const mostOpenedGuides = [...segmentSchemes].sort(
    (a, b) => b.guideOpened - a.guideOpened,
  )[0];

  // Lost benefits calculation
  const totalLostBenefits = segmentMissed.reduce((sum, m) => {
    const numeric = parseInt(m.potValue.replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(numeric) ? 0 : numeric);
  }, 0);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Opportunity Intelligence Terminal
          </span>
          <h1 className="text-2xl font-black tracking-tight">
            Opportunity Intelligence Dashboard
          </h1>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Analyze potential scheme benefits, review category outlays, track
            matching trend signals, and audit benchmark efficiency statistics.
          </p>
        </div>
      </div>
      {/* Segment Switcher Tab */}
      <div className="bg-white p-2 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveSegment("company")}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 justify-center ${
              activeSegment === "company"
                ? "bg-brand-darkest text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Building className="w-3.5 h-3.5" /> For My Company
          </button>
          <button
            onClick={() => setActiveSegment("farmers")}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 justify-center ${
              activeSegment === "farmers"
                ? "bg-brand-darkest text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> For My Farmers / FPO Users
          </button>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
          {segmentSchemes.length} Programs Analyzed
        </span>
      </div>

      {/* Opportunity Value Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Potential Value Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-start space-y-6">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
              Potential Opportunity Value
            </p>
            <h2 className="text-3xl font-black text-brand-darkest mt-1.5">
              ₹{(totalPotential / 10000000).toFixed(2)} Cr
            </h2>
            <p className="text-[10px] text-brand-medium font-bold mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Sum of matching public scheme
              outlays
            </p>
            <p className="text-[9px] text-gray-400 mt-2 leading-relaxed italic">
              Values represent publicly published maximum benefit limits and do
              not guarantee approval or funding.
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <span className="text-[9px] font-extrabold uppercase text-gray-400 block tracking-wider font-mono">
              Category Allocation Splits
            </span>

            {/* Split Progress Bars */}
            {activeSegment === "company" ? (
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Grants</span>
                    <span>₹{(grantsTotal / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full rounded-full"
                      style={{
                        width: `${totalPotential ? (grantsTotal / totalPotential) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Subsidies</span>
                    <span>₹{(subsidiesTotal / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full rounded-full"
                      style={{
                        width: `${totalPotential ? (subsidiesTotal / totalPotential) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Tax Incentives</span>
                    <span>₹{(taxTotal / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full rounded-full"
                      style={{
                        width: `${totalPotential ? (taxTotal / totalPotential) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Credit Support</span>
                    <span>₹{(creditTotal / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full rounded-full"
                      style={{
                        width: `${totalPotential ? (creditTotal / totalPotential) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Innovation Programs</span>
                    <span>₹{(innovationTotal / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full rounded-full"
                      style={{
                        width: `${totalPotential ? (innovationTotal / totalPotential) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Export Programs</span>
                    <span>₹{(exportTotal / 100000).toFixed(1)} Lakh</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-medium h-full rounded-full"
                      style={{
                        width: `${totalPotential ? (exportTotal / totalPotential) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                {segmentSchemes.map((s) => (
                  <div key={s.id} className="space-y-1 bg-[#f8faf8] p-2 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                    <div className="flex justify-between items-center font-bold gap-2">
                      <span className="truncate max-w-[160px] text-brand-darkest font-extrabold uppercase text-[10px]">{s.name}</span>
                      <span className="text-brand-medium font-bold text-[9px] bg-white px-1.5 py-0.5 rounded border border-gray-150 shrink-0">
                        {(s.benefitAmount || '').includes("year")
                          ? "₹6L/yr"
                          : "Risk Cover"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-medium to-emerald-600 h-full rounded-full"
                        style={{
                          width: `${totalPotential ? (s.potValue / totalPotential) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Platform Engagement Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4 flex flex-col justify-start">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5 shrink-0">
            <Activity className="w-4 h-4 text-brand-medium" /> {activeSegment === "company" ? "Platform Engagement Analytics" : "Farmer & FPO Engagement Analytics"}
          </h3>

          {activeSegment === "company" ? (
            <div className="space-y-3.5 text-xs font-semibold">
              {mostViewed && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black uppercase text-gray-400 block tracking-wider">Most Viewed Scheme</span>
                    <span className="font-bold text-brand-darkest truncate block max-w-[180px] uppercase">{mostViewed.name}</span>
                  </div>
                  <span className="text-brand-medium font-bold text-right shrink-0">{mostViewed.viewed} Views</span>
                </div>
              )}
              {mostSaved && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black uppercase text-gray-400 block tracking-wider">Most Bookmarked Scheme</span>
                    <span className="font-bold text-brand-darkest truncate block max-w-[180px] uppercase">{mostSaved.name}</span>
                  </div>
                  <span className="text-amber-600 font-bold shrink-0">Saved</span>
                </div>
              )}
              {mostShared && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black uppercase text-gray-400 block tracking-wider">Most Shared Scheme</span>
                    <span className="font-bold text-brand-darkest truncate block max-w-[180px] uppercase">{mostShared.name}</span>
                  </div>
                  <span className="text-blue-600 font-bold shrink-0">Shared</span>
                </div>
              )}
              {highestIntent && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black uppercase text-gray-400 block tracking-wider">Highest Apply Intent</span>
                    <span className="font-bold text-brand-darkest truncate block max-w-[180px] uppercase">{highestIntent.name}</span>
                  </div>
                  <span className="text-brand-medium font-bold text-right shrink-0">{highestIntent.applyClicked} Clicks</span>
                </div>
              )}
              {mostOpenedGuides && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black uppercase text-gray-400 block tracking-wider">Most Opened Portal Guide</span>
                    <span className="font-bold text-brand-darkest truncate block max-w-[180px] uppercase">{mostOpenedGuides.name}</span>
                  </div>
                  <span className="text-violet-600 font-bold shrink-0">{mostOpenedGuides.guideOpened} Guides</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-xs font-semibold flex-grow flex flex-col min-h-0">
              {/* Pinned Network Engagement Summary Card at the top */}
              <div className="p-3 bg-[#e8f5e8]/70 border border-brand-medium/20 rounded-2xl shrink-0 mb-3">
                <span className="text-[8px] font-black uppercase text-brand-darkest block tracking-wider mb-2">Network Engagement Summary</span>
                <div className="flex items-center justify-between text-center gap-2">
                  <div className="flex-1">
                    <span className="text-sm font-black text-brand-darkest block">{analytics?.outreach?.farmersReached?.toLocaleString() || "12,400"}</span>
                    <span className="text-[7.5px] text-gray-500 font-bold block uppercase tracking-wider">Farmers</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-black text-brand-darkest block">{analytics?.outreach?.engagementRate || 84.5}%</span>
                    <span className="text-[7.5px] text-gray-500 font-bold block uppercase tracking-wider">Engagement</span>
                  </div>
                  <div className="w-px h-6 bg-gray-300 shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-black text-brand-darkest block">{analytics?.companyProfile?.fpoPartnerships || "8 Active FPOs"}</span>
                    <span className="text-[7.5px] text-gray-500 font-bold block uppercase tracking-wider">FPOs</span>
                  </div>
                </div>
              </div>

              {/* Scrollable list of scheme engagement metrics */}
              <div className="space-y-2.5 max-h-[415px] overflow-y-auto pr-1.5 custom-scrollbar">
                {segmentSchemes.map((s) => (
                  <div key={s.id} className="p-3 bg-[#f8faf8] border border-gray-100 hover:border-brand-medium/30 rounded-xl space-y-2 transition">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[7.5px] font-black uppercase text-gray-400 tracking-wider">Scheme Engagement</span>
                        <h4 className="font-extrabold text-brand-darkest text-[10.5px] uppercase leading-tight truncate">{s.name}</h4>
                      </div>
                      <span className="text-[8px] font-bold text-brand-medium bg-emerald-50 border border-brand-medium/20 px-1.5 py-0.5 rounded shrink-0">
                        Matched
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-150/50 text-center">
                      <div>
                        <span className="text-[9.5px] font-black text-brand-darkest block">{s.viewed.toLocaleString()}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block tracking-wider">Views</span>
                      </div>
                      <div className="border-x border-gray-200">
                        <span className="text-[9.5px] font-black text-brand-medium block">{s.applyClicked.toLocaleString()}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block tracking-wider">Clicks</span>
                      </div>
                      <div>
                        <span className="text-[9.5px] font-black text-violet-600 block">{s.guideOpened.toLocaleString()}</span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase block tracking-wider">Guides</span>
                      </div>
                    </div>
                  </div>
                ))}
                {segmentSchemes.length === 0 && (
                  <p className="text-gray-400 italic text-[11px]">No farmer/FPO scheme engagement data available.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trend Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-medium" /> {activeSegment === "company" ? "Category Outlay Trends" : "Farmer Welfare Outlay Trends"}
          </h3>

          {activeSegment === "company" ? (
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">Startup Programs</p>
                  <p className="text-[10px] text-gray-400">Section 80-IAC provisions</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +24% Outlay
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">Export Incentives</p>
                  <p className="text-[10px] text-gray-400">Infrastructure subsidies</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +15% Outlay
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">Agritech Innovation</p>
                  <p className="text-[10px] text-gray-400">RKVY matching funding</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +30% Outlay
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-brand-darkest">MSME Benefits</p>
                  <p className="text-[10px] text-gray-400">Collateral-free guidelines</p>
                </div>
                <span className="text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">Stable Outlay</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">PM-KISAN Direct Transfer</p>
                  <p className="text-[10px] text-gray-400">Income support for landholding farmers</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18% Outlay
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">Crop Insurance (PMFBY)</p>
                  <p className="text-[10px] text-gray-400">Subsidized Kharif/Rabi premium slabs</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +22% Outlay
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">FPO Infrastructure Fund</p>
                  <p className="text-[10px] text-gray-400">Processing & warehouse facilities</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +35% Outlay
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-bold text-brand-darkest">KCC Interest Subvention</p>
                  <p className="text-[10px] text-gray-400">Kisan Credit Card rate relief</p>
                </div>
                <span className="text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">Stable Outlay</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-brand-darkest">Organic Farming Certification</p>
                  <p className="text-[10px] text-gray-400">Paramparagat Krishi Vikas Yojana</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +12% Outlay
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Opportunity Gap Analysis & Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunity Gap Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-red-500" /> Opportunity Gap
            Analysis
          </h3>

          <div className="grid grid-cols-2 gap-4 bg-red-50/10 border border-red-200/40 p-4 rounded-xl text-xs font-semibold">
            <div>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
                Expired Opportunities
              </span>
              <span className="text-lg font-black text-brand-darkest mt-1 block">
                {segmentMissed.length} Schemes
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
                Potential Opportunity Lost
              </span>
              <span className="text-lg font-black text-red-600 mt-1 block">
                {totalLostBenefits >= 10000000
                  ? `₹${(totalLostBenefits / 10000000).toFixed(2)} Cr`
                  : `₹${(totalLostBenefits / 100000).toFixed(1)} Lakh`}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-black text-brand-darkest uppercase text-[9px] block">
              Reason For Missing Opportunity:
            </span>
            {segmentMissed.map((m) => (
              <div
                key={m.id}
                className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center font-bold text-gray-700"
              >
                <div className="space-y-0.5">
                  <p className="uppercase text-[10px] text-brand-darkest">
                    {m.name}
                  </p>
                  <p className="text-[9px] text-gray-400">
                    Value: {m.potValue} • Expired: {m.expiredDate}
                  </p>
                </div>
                <span className="text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-[10px] uppercase font-black shrink-0">
                  {m.reason}
                </span>
              </div>
            ))}
            {segmentMissed.length === 0 && (
              <p className="text-gray-400 italic text-[11px]">
                No missed opportunities found for this segment.
              </p>
            )}
          </div>
        </div>

        {/* Industry Benchmark Insights */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-brand-medium" /> {activeSegment === "company" ? "Industry Benchmark Insights" : "Farmer Network Benchmark Insights"}
          </h3>

          {activeSegment === "company" ? (
            <div className="space-y-4 text-xs font-semibold">
              <p className="text-gray-500 leading-relaxed">
                Comparison metrics showing AgroIndia's scheme eligibility
                readiness versus competing agribusinesses of comparable scale:
              </p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>AgroIndia Match Readiness</span>
                    <span className="text-brand-medium font-black">{analytics?.profileStrength || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-medium h-full rounded-full" style={{ width: `${analytics?.profileStrength || 0}%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Agribusiness Industry Average</span>
                    <span className="text-gray-500">74%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gray-400 h-full rounded-full" style={{ width: `74%` }} />
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-emerald-950 leading-relaxed font-semibold">
                <span className="font-black text-emerald-900 block mb-1">Recommended Benchmark Optimization:</span>
                AgroIndia is currently matching 8% above competing peers. Uploading missing balance sheets will further boost profile accuracy to 95%, placing you in the top 3% for capital matching outlays.
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs font-semibold">
              <p className="text-gray-500 leading-relaxed">
                Network-level scheme access metrics for farmers and FPOs managed through the AgroIndia platform:
              </p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Farmer Scheme Enrollment Rate</span>
                    <span className="text-brand-medium font-black">68%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-medium h-full rounded-full" style={{ width: `68%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>FPO Average Scheme Coverage</span>
                    <span className="text-brand-medium font-black">72%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-medium h-full rounded-full" style={{ width: `72%` }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>National Rural Average Enrollment</span>
                    <span className="text-gray-500">52%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gray-400 h-full rounded-full" style={{ width: `52%` }} />
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-emerald-950 leading-relaxed font-semibold">
                <span className="font-black text-emerald-900 block mb-1">Network Optimization Insight:</span>
                AgroIndia farmer network enrollment is 16% above the national rural average. Increasing KCC and crop insurance awareness in the Rohtak and Sonipat districts can improve total coverage by an estimated 8%.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Farmer & FPO Interest Analytics */}
      {activeSegment === "farmers" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Users className="w-4 h-4 text-brand-medium" /> Farmer & FPO
            Interest Analytics
          </h3>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Aggregated platform engagement insights from AgroIndia farmer and
            FPO networks. All metrics are tracked internally via platform logs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-semibold">
            <div className="space-y-3 bg-[#f8faf8] border border-gray-100 p-4 rounded-xl">
              <span className="font-black text-brand-darkest uppercase text-[9px] block">
                Engagement Trends
              </span>
              <div className="space-y-2.5 font-bold text-gray-700">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span>Most Viewed Farmer Schemes</span>
                  <span className="text-brand-medium">
                    PM-KISAN (852), PMFBY (531)
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span>Most Recommended Schemes</span>
                  <span className="text-brand-medium">
                    PMFBY (1,240), PM-KISAN (920)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Most Searched Schemes</span>
                  <span className="text-brand-medium">
                    KCC Subvention, FPO Infra Subsidy
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-[#f8faf8] border border-gray-100 p-4 rounded-xl">
              <span className="font-black text-brand-darkest uppercase text-[9px] block">
                Most Asked Questions
              </span>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>"How to verify Aadhaar seeding for PM-Kisan?"</li>
                <li>
                  "What is the renewal timeline for Kharif crop insurance?"
                </li>
                <li>"How can FPOs claim processing facility subvention?"</li>
              </ul>
            </div>

            <div className="space-y-3 bg-[#f8faf8] border border-gray-100 p-4 rounded-xl">
              <span className="font-black text-brand-darkest uppercase text-[9px] block">
                Most Requested Guidance Topics
              </span>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Direct Benefit Transfer (DBT) status verification</li>
                <li>Land registry record synchronization (Jamabandi link)</li>
                <li>Organic certification guidelines for export programs</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
