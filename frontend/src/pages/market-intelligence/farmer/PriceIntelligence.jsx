import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Gauge,
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
  BarChart,
  Bar,
} from "recharts";

export default function PriceIntelligence() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("30 Days");

  const commodities = ["Wheat", "Rice", "Cotton", "Soybean", "Onion", "Tomato", "Maize"];
  const timeFilters = ["7 Days", "30 Days", "90 Days", "1 Year", "5 Years"];

  const priceSummary = {
    currentPrice: 2155,
    nationalAverage: 2100,
    stateAverage: 2080,
    mspReference: 2275,
    priceChange: 2.5,
  };

  const historicalData = [
    { month: "Jan", price: 2050, movingAvg: 2030 },
    { month: "Feb", price: 2080, movingAvg: 2045 },
    { month: "Mar", price: 2100, movingAvg: 2060 },
    { month: "Apr", price: 2120, movingAvg: 2075 },
    { month: "May", price: 2140, movingAvg: 2090 },
    { month: "Jun", price: 2155, movingAvg: 2105 },
  ];

  const volatilityData = [
    { range: "1800-1900", count: 5 },
    { range: "1900-2000", count: 12 },
    { range: "2000-2100", count: 25 },
    { range: "2100-2200", count: 30 },
    { range: "2200-2300", count: 18 },
    { range: "2300-2400", count: 8 },
    { range: "2400-2500", count: 2 },
  ];

  const seasonalData = [
    { month: "Jan", avgPrice: 2050, status: "low" },
    { month: "Feb", avgPrice: 2080, status: "low" },
    { month: "Mar", avgPrice: 2100, status: "medium" },
    { month: "Apr", avgPrice: 2120, status: "medium" },
    { month: "May", avgPrice: 2140, status: "high" },
    { month: "Jun", avgPrice: 2155, status: "high" },
    { month: "Jul", avgPrice: 2130, status: "medium" },
    { month: "Aug", avgPrice: 2110, status: "medium" },
    { month: "Sep", avgPrice: 2090, status: "low" },
    { month: "Oct", avgPrice: 2070, status: "low" },
    { month: "Nov", avgPrice: 2040, status: "low" },
    { month: "Dec", avgPrice: 2020, status: "low" },
  ];

  const getSeasonalColor = (status) => {
    switch (status) {
      case "high": return "bg-emerald-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-400";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Price Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Deep commodity price analysis and trends</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Commodity Selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select Commodity</label>
        <div className="flex flex-wrap gap-2">
          {commodities.map((commodity) => (
            <button
              key={commodity}
              onClick={() => setSelectedCommodity(commodity)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCommodity === commodity
                  ? "bg-brand-darkest text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {commodity}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-brand-medium/10 text-brand-medium">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Current Price</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">₹{priceSummary.currentPrice}</p>
          <p className="text-xs text-gray-400 mt-1">per quintal</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">National Average</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">₹{priceSummary.nationalAverage}</p>
          <p className="text-xs text-gray-400 mt-1">per quintal</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">State Average</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">₹{priceSummary.stateAverage}</p>
          <p className="text-xs text-gray-400 mt-1">per quintal</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">MSP Reference</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">₹{priceSummary.mspReference}</p>
          <p className="text-xs text-gray-400 mt-1">per quintal</p>
        </div>
      </div>

      {/* Price Change Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${priceSummary.priceChange > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
              {priceSummary.priceChange > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Price Change</p>
              <p className={`text-lg font-black ${priceSummary.priceChange > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {priceSummary.priceChange > 0 ? "+" : ""}{priceSummary.priceChange}%
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400">vs last period</span>
        </div>
      </div>

      {/* Advanced Price Charts */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Historical Price Trend</h2>
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
          <AreaChart data={historicalData}>
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
            <Area type="monotone" dataKey="price" stroke="var(--brand-medium)" fill="var(--brand-medium)" fillOpacity={0.3} name="Price" />
            <Line type="monotone" dataKey="movingAvg" stroke="#3b82f6" strokeWidth={2} dot={false} name="Moving Average" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Analysis */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Seasonal Analysis (12-Month Heatmap)</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {seasonalData.map((item) => (
            <div key={item.month} className="text-center">
              <div className={`h-16 rounded-xl ${getSeasonalColor(item.status)} flex items-center justify-center mb-2`}>
                <span className="text-xs font-bold text-white">₹{item.avgPrice}</span>
              </div>
              <p className="text-xs font-bold text-gray-700">{item.month}</p>
              <p className="text-[10px] text-gray-400 capitalize">{item.status}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-xs text-gray-500">High Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-xs text-gray-500">Medium Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400"></div>
            <span className="text-xs text-gray-500">Low Price</span>
          </div>
        </div>
      </div>

      {/* Price Distribution Analytics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Price Distribution Analytics</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={volatilityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="range" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="var(--brand-medium)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold">Average Range</p>
            <p className="text-lg font-black text-brand-darkest">₹2,100-2,200</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold">Most Frequent</p>
            <p className="text-lg font-black text-brand-darkest">30 occurrences</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold">Outliers</p>
            <p className="text-lg font-black text-brand-darkest">2.4%</p>
          </div>
        </div>
      </div>

      {/* Price Volatility Gauge */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Price Volatility Gauge</h2>
        <div className="flex items-center justify-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
              <circle cx="96" cy="96" r="80" stroke="var(--brand-medium)" strokeWidth="16" fill="none" strokeDasharray="502" strokeDashoffset="351" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Gauge className="w-8 h-8 text-brand-medium mb-1" />
              <span className="text-3xl font-black text-brand-darkest">Moderate</span>
              <span className="text-xs text-gray-500">Volatility</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-gray-700">Stable (0-20%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs font-bold text-gray-700">Moderate (20-40%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-xs font-bold text-gray-700">Volatile (40%+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
