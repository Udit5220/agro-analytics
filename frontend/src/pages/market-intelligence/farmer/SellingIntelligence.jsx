import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SellingIntelligence() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("7 Days");

  const timeFilters = ["7 Days", "30 Days", "90 Days"];

  const sellingOpportunity = {
    score: 88,
    level: "Excellent Selling Opportunity",
  };

  const marketIndicators = [
    {
      name: "Demand Strength",
      value: 92,
      status: "Strong",
      icon: Activity,
      color: "bg-emerald-500/10 text-emerald-600",
      trend: "+5%",
    },
    {
      name: "Supply Pressure",
      value: 45,
      status: "Low",
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-600",
      trend: "-8%",
    },
    {
      name: "Buyer Activity",
      value: 85,
      status: "High",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
      trend: "+12%",
    },
    {
      name: "Price Momentum",
      value: 78,
      status: "Positive",
      icon: DollarSign,
      color: "bg-amber-500/10 text-amber-600",
      trend: "+3%",
    },
  ];

  const timingData = [
    { period: "Current", condition: 88, outlook: 90 },
    { period: "Week 1", condition: 85, outlook: 87 },
    { period: "Week 2", condition: 82, outlook: 84 },
    { period: "Week 3", condition: 80, outlook: 82 },
    { period: "Week 4", condition: 78, outlook: 80 },
  ];

  const riskLevel = {
    level: "Low Risk",
    score: 25,
    category: "low",
  };

  const strategyRecommendations = [
    {
      title: "Strong Demand",
      description: "Market demand is at 92% - excellent time to sell",
      icon: Activity,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Low Supply",
      description: "Supply pressure is low at 45% - favorable pricing",
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Active Buyers",
      description: "High buyer activity at 85% - quick sales expected",
      icon: Users,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Positive Market",
      description: "Price momentum is positive - good returns likely",
      icon: DollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  const getRiskColor = (category) => {
    switch (category) {
      case "low": return "bg-emerald-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2e4057]">Selling Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Make informed selling decisions with market insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2e4057] hover:bg-[#208837] text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Selling Opportunity Score */}
      <div className="bg-gradient-to-r from-[#2e4057] to-[#208837] rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">Selling Opportunity Score</h2>
          <span className="text-xs text-white/80">Based on market conditions</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
              <circle cx="80" cy="80" r="70" stroke="#ffc857" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="53" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{sellingOpportunity.score}</span>
              <span className="text-xs text-white/80">/100</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-black text-[#ffc857] mb-2">{sellingOpportunity.level}</p>
            <p className="text-sm text-white/80">Current market conditions are highly favorable for selling. Strong demand and low supply pressure create excellent opportunities.</p>
          </div>
        </div>
      </div>

      {/* Market Condition Indicators */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#2e4057] mb-4">Market Condition Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketIndicators.map((indicator, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-[#28a745] transition">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${indicator.color}`}>
                  <indicator.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${indicator.trend.includes("+") ? "text-emerald-600" : "text-red-600"}`}>
                  {indicator.trend}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-semibold mb-1">{indicator.name}</p>
              <p className="text-2xl font-black text-[#2e4057]">{indicator.value}</p>
              <p className="text-xs text-gray-400 mt-1">{indicator.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sell Timing Analysis */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2e4057]">Sell Timing Analysis</h2>
          <div className="flex items-center gap-1">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedTimeFilter === filter
                    ? "bg-[#2e4057] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="condition" stroke="#28a745" strokeWidth={2} dot={{ fill: "#28a745" }} name="Current Condition" />
            <Line type="monotone" dataKey="outlook" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} name="Short-term Outlook" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Market Risk Meter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#2e4057] mb-4">Market Risk Meter</h2>
        <div className="flex items-center justify-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
              <circle cx="96" cy="96" r="80" stroke={getRiskColor(riskLevel.category)} strokeWidth="16" fill="none" strokeDasharray="502" strokeDashoffset={502 - (502 * riskLevel.score / 100)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Shield className="w-8 h-8 text-[#28a745] mb-1" />
              <span className="text-3xl font-black text-[#2e4057]">{riskLevel.level}</span>
              <span className="text-xs text-gray-500">Risk Level</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-gray-700">Low Risk (0-33%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs font-bold text-gray-700">Medium Risk (33-66%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-xs font-bold text-gray-700">High Risk (66-100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Recommendation Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#2e4057] mb-4">Strategy Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategyRecommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className={`p-3 rounded-xl ${rec.color} flex-shrink-0`}>
                <rec.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2e4057] mb-1">{rec.title}</h3>
                <p className="text-xs text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="bg-gradient-to-r from-[#28a745]/10 to-[#208837]/10 rounded-2xl p-6 border border-[#28a745]/20">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-[#28a745]" />
          <h2 className="text-sm font-bold text-[#2e4057]">Recommended Action</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">Sell within the next 7-10 days to maximize returns</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">Target Azadpur or Vashi mandi for best prices</p>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">Monitor supply levels - expect slight increase next week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
