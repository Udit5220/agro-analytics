import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Factory,
  Globe,
  ShoppingBag,
  Scissors,
  Wheat,
  Droplets,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
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

export default function DemandIntelligence() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("30 Days");

  const timeFilters = ["7 Days", "30 Days", "90 Days", "1 Year"];

  const demandTrendData = [
    { month: "Jan", demand: 75, growth: 2 },
    { month: "Feb", demand: 78, growth: 4 },
    { month: "Mar", demand: 82, growth: 5 },
    { month: "Apr", demand: 85, growth: 4 },
    { month: "May", demand: 88, growth: 3 },
    { month: "Jun", demand: 91, growth: 3 },
  ];

  const demandSources = [
    {
      name: "Food Processing Industry",
      percentage: 35,
      trend: "+5%",
      volume: "2.5M tons",
      icon: Factory,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      name: "Export Market",
      percentage: 28,
      trend: "+8%",
      volume: "2.0M tons",
      icon: Globe,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      name: "Retail Market",
      percentage: 22,
      trend: "+3%",
      volume: "1.6M tons",
      icon: ShoppingBag,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      name: "Textile Industry",
      percentage: 8,
      trend: "-2%",
      volume: "0.6M tons",
      icon: Scissors,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      name: "Animal Feed Industry",
      percentage: 4,
      trend: "+1%",
      volume: "0.3M tons",
      icon: Wheat,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      name: "Oil Extraction Industry",
      percentage: 3,
      trend: "+4%",
      volume: "0.2M tons",
      icon: Droplets,
      color: "bg-teal-500/10 text-teal-600",
    },
  ];

  const topDemandedCommodities = [
    { commodity: "Wheat", demandScore: 91, weeklyGrowth: 5.2, monthlyGrowth: 12.8 },
    { commodity: "Rice", demandScore: 85, weeklyGrowth: 3.8, monthlyGrowth: 9.5 },
    { commodity: "Soybean", demandScore: 88, weeklyGrowth: 6.5, monthlyGrowth: 15.2 },
    { commodity: "Maize", demandScore: 76, weeklyGrowth: 2.1, monthlyGrowth: 7.3 },
    { commodity: "Cotton", demandScore: 72, weeklyGrowth: 1.5, monthlyGrowth: 4.8 },
  ];

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Demand Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Market demand analysis and insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Demand Score Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Overall Demand Score</h2>
          <span className="text-xs text-gray-500">Based on market analysis</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
              <circle cx="80" cy="80" r="70" stroke="var(--brand-medium)" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="40" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-brand-darkest">91</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-brand-medium" />
              <div>
                <p className="text-xs text-gray-500">Demand Level</p>
                <p className="text-sm font-bold text-brand-medium">Very High Demand</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-500">Trend</p>
                <p className="text-sm font-bold text-emerald-600">Growing (+12.8% this month)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demand Trend Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Demand Trend Analysis</h2>
          <div className="flex items-center gap-1">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedTimeFilter === filter
                    ? "bg-brand-darkest text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={demandTrendData}>
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
            <Area type="monotone" dataKey="demand" stroke="var(--brand-medium)" fill="var(--brand-medium)" fillOpacity={0.3} name="Demand Score" />
            <Line type="monotone" dataKey="growth" stroke="#3b82f6" strokeWidth={2} dot={false} name="Growth %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Demand Sources */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Demand Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demandSources.map((source, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-brand-medium transition">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${source.color}`}>
                  <source.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-bold ${source.trend.includes("+") ? "text-emerald-600" : "text-red-600"}`}>
                  {source.trend}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-semibold mb-1">{source.name}</p>
              <p className="text-2xl font-black text-brand-darkest">{source.percentage}%</p>
              <p className="text-xs text-gray-400 mt-1">{source.volume}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demand Heatmap Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Regional Demand Heatmap</h2>
        <div className="h-64 bg-gradient-to-br from-brand-darkest/5 to-brand-medium/10 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-brand-medium mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-500">Interactive Map</p>
            <p className="text-[10px] text-gray-400">MapTiler integration coming soon</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-xs text-gray-500">High Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-xs text-gray-500">Medium Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400"></div>
            <span className="text-xs text-gray-500">Low Demand</span>
          </div>
        </div>
      </div>

      {/* Top Demanded Commodities */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Top Demanded Commodities</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Commodity</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Demand Score</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Weekly Growth</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Monthly Growth</th>
              </tr>
            </thead>
            <tbody>
              {topDemandedCommodities.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-bold text-brand-darkest">{item.commodity}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-medium h-full" style={{ width: `${item.demandScore}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.demandScore}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-bold flex items-center gap-1 ${item.weeklyGrowth > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {item.weeklyGrowth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(item.weeklyGrowth)}%
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-bold flex items-center gap-1 ${item.monthlyGrowth > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {item.monthlyGrowth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(item.monthlyGrowth)}%
                    </span>
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
