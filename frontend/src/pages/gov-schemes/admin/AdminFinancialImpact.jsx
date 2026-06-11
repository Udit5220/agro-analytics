import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Coins,
  IndianRupee,
  ShieldAlert,
  Users,
  Building,
  ArrowUpRight,
  ArrowRight,
  Info,
  Award,
} from "lucide-react";

export default function AdminFinancialImpact() {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // CFO KPI Summary Cards
  const stats = [
    { label: "Total Benefits Received", value: "₹12,40,000", change: "+58.9%", changeType: "up", desc: "FY 2025-26 active payouts" },
    { label: "Sanctioned Pending Payouts", value: "₹15,00,000", change: "2 Tranches", changeType: "neutral", desc: "Awaiting milestone UC signs" },
    { label: "Direct Cost Offsets", value: "₹8,40,000", change: "68% of total", changeType: "up", desc: "Equipment & infrastructure subsidies" },
    { label: "Tax Exemption Savings", value: "₹4,00,000", change: "100% offset", changeType: "up", desc: "DPIIT 80-IAC corporate savings" }
  ];

  // Allocation breakdown categories
  const allocations = [
    { name: "Grants & Incubator support", percent: 40, value: "₹4,96,000", color: "#2e4057" },
    { name: "Capital Subsidies", percent: 30, value: "₹3,72,000", color: "#28a745" },
    { name: "Tax Exemption Benefits", percent: 30, value: "₹3,72,000", color: "#2ec4b6" }
  ];

  // Missed Opportunities Log
  const missedOpportunities = [
    {
      id: "MSD-01",
      name: "National Agri-Logistics Infrastructure Grant",
      closedDate: "2026-05-15",
      potentialBenefit: "₹15,00,000 Capital Subsidy",
      reason: "MSME turnover certification not synced on profile",
      impactLevel: "High"
    },
    {
      id: "MSD-02",
      name: "State Solar Power Borewell Subvention",
      closedDate: "2026-04-20",
      potentialBenefit: "₹4,50,000 Utility Offset",
      reason: "Land ownership records did not match boundary coordinates",
      impactLevel: "Medium"
    }
  ];

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Header section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#28a745]" />
            Financial Impact & CFO Dashboard
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Evaluate corporate subsidy returns, cost offsets, tax relief metrics, and downstream farmer benefits.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm hover:shadow-md transition">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{stat.label}</span>
            
            <div className="flex items-baseline gap-2 mt-1 justify-between">
              <span className="text-xl font-black text-[#2e4057]">{stat.value}</span>
              
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                stat.changeType === "up"
                  ? "bg-emerald-100 text-emerald-800"
                  : stat.changeType === "down"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {stat.changeType === "up" && <TrendingUp className="w-3 h-3" />}
                {stat.changeType === "down" && <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            
            <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Visualization splits (SVG based to prevent ReferenceErrors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Visual: Allocation breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-gray-700">Benefits Allocation Breakdown</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 justify-around py-4">
            {/* Custom SVG Donut Chart */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Gray placeholder bg ring */}
                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                
                {/* Sector 1: Grants (40% - Dasharray 40 * 2.51 = 100.4, Offset 0) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#2e4057"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="100.4 151"
                  strokeDashoffset="0"
                  className="transition-all duration-300 cursor-pointer"
                  style={{ strokeDasharray: "100.5 251.2" }}
                  onMouseEnter={() => setHoveredSlice("Grants")}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Sector 2: Capital Subsidies (30% - Dasharray 75.36, Offset -100.48) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#28a745"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="-100.5"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice("Subsidies")}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Sector 3: Tax Exemption (30% - Dasharray 75.36, Offset -175.84) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#2ec4b6"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="-175.9"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice("Tax")}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </svg>
              
              {/* Inner Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                  {hoveredSlice || "Total ROI"}
                </span>
                <span className="text-sm font-black text-gray-800">
                  {hoveredSlice === "Grants" && "40% Grants"}
                  {hoveredSlice === "Subsidies" && "30% Subsidies"}
                  {hoveredSlice === "Tax" && "30% Tax Saved"}
                  {!hoveredSlice && "₹12.4 Lakh"}
                </span>
              </div>
            </div>

            {/* Custom Legends list */}
            <div className="space-y-3.5 flex-1 w-full">
              {allocations.map((a, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold items-center">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }}></span>
                      {a.name}
                    </span>
                    <span className="text-gray-900">{a.value} ({a.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: a.color, width: `${a.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Visual: YoY progress */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-gray-700">Historical YoY Payout Progress</h3>
          
          {/* Custom SVG Line Chart */}
          <div className="relative w-full h-40">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f3f4f6" strokeWidth="1" />
              
              {/* Area path */}
              <path
                d="M 30 80 Q 150 50 270 20 L 270 95 L 30 95 Z"
                fill="url(#grad)"
                opacity="0.15"
              />
              
              {/* Area Line path */}
              <path
                d="M 30 80 Q 150 50 270 20"
                fill="transparent"
                stroke="#28a745"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Node points */}
              <circle cx="30" cy="80" r="4.5" fill="#2e4057" stroke="white" strokeWidth="1.5" />
              <circle cx="150" cy="50" r="4.5" fill="#28a745" stroke="white" strokeWidth="1.5" />
              <circle cx="270" cy="20" r="4.5" fill="#2ec4b6" stroke="white" strokeWidth="1.5" />

              {/* Gradients */}
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#28a745" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Custom Axis Labels */}
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 px-6">
              <span>FY24: ₹3.5 Lakh</span>
              <span>FY25: ₹7.8 Lakh</span>
              <span>FY26: ₹12.4 Lakh (Current)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Downstream User-Side Platform Impact */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] flex items-center gap-1.5">
          <Users className="w-4.5 h-4.5 text-[#28a745]" /> Downstream Platform Outreach Impact
        </h3>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Benefits routed directly down to your connected FPO structures and contract farmers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="block text-[8px] text-gray-400 font-bold uppercase">Connected FPO Structures</span>
              <span className="text-lg font-black text-[#2e4057]">5 Cooperatives</span>
            </div>
            <div className="bg-[#2e4057] text-[#ffc857] p-2 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="block text-[8px] text-gray-400 font-bold uppercase">Active Farmers Benefiting</span>
              <span className="text-lg font-black text-[#2e4057]">1,240 Landholders</span>
            </div>
            <div className="bg-[#2e4057] text-[#ffc857] p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="block text-[8px] text-gray-400 font-bold uppercase">Indirect Capital Transferred</span>
              <span className="text-lg font-black text-[#28a745]">₹1.48 Crore DBT</span>
            </div>
            <div className="bg-[#2e4057] text-[#ffc857] p-2 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Missed Opportunities Log */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3">
        <h3 className="font-black text-xs uppercase tracking-wider text-red-950 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600" /> Missed Opportunities Log
        </h3>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Closed qualifying government schemes which the company missed due to application delays or missing certifications.
        </p>

        <div className="border border-red-100 rounded-xl overflow-hidden mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-red-50/50 border-b border-red-100 text-[10px] font-bold text-red-800 uppercase">
                <th className="p-3">Scheme Name</th>
                <th className="p-3">Date Closed</th>
                <th className="p-3">Est. Benefit</th>
                <th className="p-3">Miss Reason</th>
                <th className="p-3 text-right">Impact Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50 font-semibold text-red-900">
              {missedOpportunities.map((op, idx) => (
                <tr key={idx} className="hover:bg-red-50/20 transition">
                  <td className="p-3 uppercase tracking-wide">{op.name}</td>
                  <td className="p-3 text-red-700/80">{op.closedDate}</td>
                  <td className="p-3 font-bold">{op.potentialBenefit}</td>
                  <td className="p-3 text-[11px] text-red-700">{op.reason}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      op.impactLevel === "High" ? "bg-red-200 text-red-900" : "bg-amber-200 text-amber-900"
                    }`}>
                      {op.impactLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-2 mt-2">
          <Info className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-950 font-semibold leading-relaxed">
            <span className="font-bold">Prevent future losses:</span> Complete MSME/Udyam credentials on your company profile tab to automatically unlock matches and prevent alerts from expiring.
          </p>
        </div>
      </div>

    </div>
  );
}
