import React, { useState } from "react";
import {
  FileText,
  Download,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function MarketReportsAnalytics() {
  const [selectedReport, setSelectedReport] = useState("Weekly");

  const reportTypes = ["Weekly", "Monthly", "Quarterly", "Annual"];

  const reportCards = [
    { type: "Weekly Report", count: 52, icon: Calendar, color: "bg-emerald-500/10 text-emerald-600" },
    { type: "Monthly Report", count: 12, icon: Calendar, color: "bg-blue-500/10 text-blue-600" },
    { type: "Quarterly Report", count: 4, icon: Calendar, color: "bg-purple-500/10 text-purple-600" },
    { type: "Annual Report", count: 1, icon: Calendar, color: "bg-amber-500/10 text-amber-600" },
  ];

  const topPerformingCommodities = [
    { rank: 1, commodity: "Soybean", performance: 15.2, trend: "up" },
    { rank: 2, commodity: "Wheat", performance: 12.8, trend: "up" },
    { rank: 3, commodity: "Rice", performance: 9.5, trend: "up" },
    { rank: 4, commodity: "Maize", performance: 7.3, trend: "up" },
    { rank: 5, commodity: "Cotton", performance: 4.8, trend: "down" },
  ];

  const marketTrendData = [
    { month: "Jan", price: 2050, demand: 75, supply: 80 },
    { month: "Feb", price: 2080, demand: 78, supply: 82 },
    { month: "Mar", price: 2100, demand: 82, supply: 85 },
    { month: "Apr", price: 2120, demand: 85, supply: 88 },
    { month: "May", price: 2140, demand: 88, supply: 90 },
    { month: "Jun", price: 2155, demand: 91, supply: 92 },
  ];

  const demandSupplyData = [
    { commodity: "Wheat", demand: 91, supply: 85 },
    { commodity: "Rice", demand: 85, supply: 88 },
    { commodity: "Soybean", demand: 88, supply: 72 },
    { commodity: "Maize", demand: 76, supply: 80 },
    { commodity: "Cotton", demand: 72, supply: 95 },
  ];

  const executiveSummary = {
    majorTrends: [
      "Soybean prices surged by 15.2% due to strong export demand",
      "Wheat demand reached 91% - highest in 6 months",
      "Cotton supply increased by 18% in Punjab region",
    ],
    keyOpportunities: [
      "Excellent selling conditions for Soybean and Wheat",
      "New mandi opportunities in Delhi and Maharashtra",
      "Export market showing 12% growth this quarter",
    ],
    marketRisks: [
      "Cotton oversupply may impact prices next month",
      "Transportation costs increased by 8% due to fuel prices",
      "Monsoon uncertainty affecting planting decisions",
    ],
    recommendedActions: [
      "Sell Soybean within 7-10 days for maximum returns",
      "Consider diversifying to Wheat for stable returns",
      "Monitor Cotton supply levels before selling",
      "Explore new mandi markets for better prices",
    ],
  };

  const downloadOptions = [
    { format: "PDF", icon: FileText, color: "bg-red-500/10 text-red-600" },
    { format: "Excel", icon: FileSpreadsheet, color: "bg-emerald-500/10 text-emerald-600" },
    { format: "CSV", icon: FileText, color: "bg-blue-500/10 text-blue-600" },
  ];

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Market Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">Deep analytical reporting and market insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Report Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Report Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportCards.map((card, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-brand-medium transition cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-brand-darkest">{card.count}</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold">{card.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Commodities */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Top Performing Commodities</h2>
        <div className="space-y-3">
          {topPerformingCommodities.map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${item.rank <= 3 ? "bg-brand-medium" : "bg-gray-400"}`}>
                  {item.rank}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-darkest">{item.commodity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${item.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                  {item.trend === "up" ? "+" : ""}{item.performance}%
                </span>
                {item.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trend Analysis */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Market Trend Analysis</h2>
          <div className="flex items-center gap-1">
            {reportTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedReport(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedReport === type
                    ? "bg-brand-darkest text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={marketTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="price" stroke="var(--brand-medium)" fill="var(--brand-medium)" fillOpacity={0.3} name="Price (₹)" />
            <Area type="monotone" dataKey="demand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Demand (%)" />
            <Area type="monotone" dataKey="supply" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Supply (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Demand vs Supply Insights */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Demand vs Supply Insights</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={demandSupplyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="commodity" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="demand" fill="var(--brand-medium)" name="Demand (%)" />
            <Bar dataKey="supply" fill="#3b82f6" name="Supply (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Download Center */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Download Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {downloadOptions.map((option, index) => (
            <button key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-brand-medium hover:bg-gray-50 transition">
              <div className={`p-2.5 rounded-xl ${option.color}`}>
                <option.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-brand-darkest">Download as {option.format}</p>
                <p className="text-[10px] text-gray-400">Full report data</p>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Executive Market Summary */}
      <div className="bg-gradient-to-r from-brand-darkest to-[#208837] rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Executive Market Summary</h2>
            <p className="text-xs text-white/80">Key insights and recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Major Trends */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#ffc857]" />
              <h3 className="text-xs font-bold">Major Trends</h3>
            </div>
            <ul className="space-y-2">
              {executiveSummary.majorTrends.map((trend, index) => (
                <li key={index} className="text-xs text-white/90 flex items-start gap-2">
                  <span className="text-[#ffc857]">•</span>
                  {trend}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Opportunities */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[#ffc857]" />
              <h3 className="text-xs font-bold">Key Opportunities</h3>
            </div>
            <ul className="space-y-2">
              {executiveSummary.keyOpportunities.map((opportunity, index) => (
                <li key={index} className="text-xs text-white/90 flex items-start gap-2">
                  <span className="text-[#ffc857]">•</span>
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>

          {/* Market Risks */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#ffc857]" />
              <h3 className="text-xs font-bold">Market Risks</h3>
            </div>
            <ul className="space-y-2">
              {executiveSummary.marketRisks.map((risk, index) => (
                <li key={index} className="text-xs text-white/90 flex items-start gap-2">
                  <span className="text-[#ffc857]">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[#ffc857]" />
              <h3 className="text-xs font-bold">Recommended Actions</h3>
            </div>
            <ul className="space-y-2">
              {executiveSummary.recommendedActions.map((action, index) => (
                <li key={index} className="text-xs text-white/90 flex items-start gap-2">
                  <span className="text-[#ffc857]">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
