import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  BarChart3,
  Activity,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MarketIntelligenceDashboard() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("7D");

  // Mock data for charts
  const priceMovementData = [
    { name: "Mon", wheat: 2100, rice: 2800, cotton: 6500, soybean: 4200, maize: 1900 },
    { name: "Tue", wheat: 2120, rice: 2820, cotton: 6550, soybean: 4180, maize: 1920 },
    { name: "Wed", wheat: 2115, rice: 2810, cotton: 6520, soybean: 4220, maize: 1910 },
    { name: "Thu", wheat: 2130, rice: 2830, cotton: 6580, soybean: 4250, maize: 1930 },
    { name: "Fri", wheat: 2145, rice: 2840, cotton: 6600, soybean: 4230, maize: 1940 },
    { name: "Sat", wheat: 2150, rice: 2850, cotton: 6620, soybean: 4260, maize: 1950 },
    { name: "Sun", wheat: 2155, rice: 2860, cotton: 6650, soybean: 4280, maize: 1960 },
  ];

  const commodityData = [
    { commodity: "Wheat", currentPrice: 2155, dailyChange: 2.5, weeklyChange: 5.2, demandScore: 85, supplyStatus: "Balanced", sentiment: "Bullish" },
    { commodity: "Rice", currentPrice: 2860, dailyChange: 1.8, weeklyChange: 4.1, demandScore: 78, supplyStatus: "Adequate", sentiment: "Bullish" },
    { commodity: "Cotton", currentPrice: 6650, dailyChange: -0.5, weeklyChange: 2.3, demandScore: 72, supplyStatus: "High", sentiment: "Neutral" },
    { commodity: "Soybean", currentPrice: 4280, dailyChange: 3.2, weeklyChange: 6.8, demandScore: 88, supplyStatus: "Low", sentiment: "Bullish" },
    { commodity: "Maize", currentPrice: 1960, dailyChange: 1.5, weeklyChange: 3.5, demandScore: 75, supplyStatus: "Balanced", sentiment: "Bullish" },
  ];

  const marketFeed = [
    { type: "price", message: "Wheat prices increased by 2.5% in major mandis", time: "2 hours ago", icon: TrendingUp, color: "text-emerald-600" },
    { type: "demand", message: "Soybean demand spikes in export markets", time: "4 hours ago", icon: Activity, color: "text-blue-600" },
    { type: "supply", message: "Cotton arrivals increased by 15% in Punjab", time: "6 hours ago", icon: BarChart3, color: "text-amber-600" },
    { type: "market", message: "New mandi opened in Haryana with competitive prices", time: "8 hours ago", icon: MapPin, color: "text-purple-600" },
  ];

  const timeFilters = ["7D", "30D", "90D", "1Y"];

  const kpiCards = [
    {
      title: "Trending Commodity",
      value: "Soybean",
      subValue: "₹4,280/qtl",
      change: "+3.2%",
      icon: TrendingUp,
      color: "bg-[#28a745]/10 text-[#28a745]",
    },
    {
      title: "Highest Demand",
      value: "Wheat",
      subValue: "Demand Score: 85",
      change: "Very High",
      icon: Activity,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Best Mandi Today",
      value: "Azadpur",
      subValue: "Delhi",
      change: "₹2,200/qtl",
      icon: MapPin,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Market Sentiment",
      value: "Bullish",
      subValue: "Positive Trend",
      change: "Strong",
      icon: ArrowUpRight,
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2e4057]">Market Intelligence Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time market insights, price analysis, and demand intelligence</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2e4057] hover:bg-[#208837] text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Market Opportunity Score */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2e4057]">Market Opportunity Score</h2>
          <span className="text-xs text-gray-500">Based on current market conditions</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
              <circle cx="80" cy="80" r="70" stroke="#28a745" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="70" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#2e4057]">84</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#28a745]" />
              <div>
                <p className="text-xs text-gray-500">Trend Direction</p>
                <p className="text-sm font-bold text-[#2e4057]">Upward</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#28a745]" />
              <div>
                <p className="text-xs text-gray-500">Opportunity Level</p>
                <p className="text-sm font-bold text-[#28a745]">Strong Selling Conditions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${card.change.includes("+") ? "text-emerald-600" : "text-red-600"}`}>
                {card.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-semibold mb-1">{card.title}</p>
            <p className="text-lg font-black text-[#2e4057]">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.subValue}</p>
          </div>
        ))}
      </div>

      {/* Commodity Overview Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2e4057]">Commodity Overview</h2>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search commodities..." className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#28a745]" />
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#28a745]">
              <option>All Commodities</option>
              <option>Cereals</option>
              <option>Oilseeds</option>
              <option>Fibers</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Commodity</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Current Price</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Daily Change</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Weekly Change</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Demand Score</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Supply Status</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {commodityData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-bold text-[#2e4057]">{item.commodity}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">₹{item.currentPrice}/qtl</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-bold flex items-center gap-1 ${item.dailyChange > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {item.dailyChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(item.dailyChange)}%
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-bold flex items-center gap-1 ${item.weeklyChange > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {item.weeklyChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(item.weeklyChange)}%
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#28a745] h-full" style={{ width: `${item.demandScore}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.demandScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs font-semibold text-gray-700">{item.supplyStatus}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      item.sentiment === "Bullish" ? "bg-emerald-100 text-emerald-700" :
                      item.sentiment === "Bearish" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {item.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Movement Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2e4057]">Price Movement</h2>
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
          <LineChart data={priceMovementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="wheat" stroke="#28a745" strokeWidth={2} dot={false} name="Wheat" />
            <Line type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={2} dot={false} name="Rice" />
            <Line type="monotone" dataKey="cotton" stroke="#f59e0b" strokeWidth={2} dot={false} name="Cotton" />
            <Line type="monotone" dataKey="soybean" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Soybean" />
            <Line type="monotone" dataKey="maize" stroke="#ef4444" strokeWidth={2} dot={false} name="Maize" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Market Feed & Regional Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Market Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#2e4057] mb-4">Daily Market Feed</h2>
          <div className="space-y-3">
            {marketFeed.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`p-2 rounded-lg ${item.color.replace("text", "bg")}/10`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">{item.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Market Heatmap Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#2e4057] mb-4">Regional Market Heatmap</h2>
          <div className="h-64 bg-gradient-to-br from-[#2e4057]/5 to-[#28a745]/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-[#28a745] mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">Interactive Map</p>
              <p className="text-[10px] text-gray-400">MapTiler integration coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
