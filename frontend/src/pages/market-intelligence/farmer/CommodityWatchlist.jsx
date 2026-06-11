import React, { useState } from "react";
import {
  Plus,
  X,
  Pin,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Star,
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

export default function CommodityWatchlist() {
  const [watchlist, setWatchlist] = useState([
    { id: 1, commodity: "Wheat", currentPrice: 2155, demandScore: 85, sentiment: "Bullish", supplyStatus: "Balanced", priceTrend: "up", pinned: true },
    { id: 2, commodity: "Rice", currentPrice: 2860, demandScore: 78, sentiment: "Bullish", supplyStatus: "Adequate", priceTrend: "up", pinned: false },
    { id: 3, commodity: "Soybean", currentPrice: 4280, demandScore: 88, sentiment: "Bullish", supplyStatus: "Low", priceTrend: "up", pinned: true },
    { id: 4, commodity: "Cotton", currentPrice: 6650, demandScore: 72, sentiment: "Neutral", supplyStatus: "High", priceTrend: "down", pinned: false },
    { id: 5, commodity: "Maize", currentPrice: 1960, demandScore: 75, sentiment: "Bullish", supplyStatus: "Balanced", priceTrend: "up", pinned: false },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const watchlistPerformanceData = [
    { date: "Mon", wheat: 2100, rice: 2800, soybean: 4200 },
    { date: "Tue", wheat: 2120, rice: 2820, soybean: 4220 },
    { date: "Wed", wheat: 2115, rice: 2810, soybean: 4250 },
    { date: "Thu", wheat: 2130, rice: 2830, soybean: 4230 },
    { date: "Fri", wheat: 2145, rice: 2840, soybean: 4260 },
    { date: "Sat", wheat: 2150, rice: 2850, soybean: 4280 },
    { date: "Sun", wheat: 2155, rice: 2860, soybean: 4280 },
  ];

  const activeAlerts = [
    { commodity: "Wheat", type: "price", message: "Price crossed ₹2,150 threshold", time: "2 hours ago" },
    { commodity: "Soybean", type: "demand", message: "Demand score increased to 88", time: "4 hours ago" },
    { commodity: "Cotton", type: "supply", message: "Supply status changed to High", time: "6 hours ago" },
  ];

  const handleRemove = (id) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  const handlePin = (id) => {
    setWatchlist(watchlist.map(item => 
      item.id === id ? { ...item, pinned: !item.pinned } : item
    ));
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Bullish": return "bg-emerald-100 text-emerald-700";
      case "Bearish": return "bg-red-100 text-red-700";
      case "Neutral": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2e4057]">Commodity Watchlist</h1>
          <p className="text-xs text-gray-500 mt-1">Track and monitor your important commodities</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2e4057] hover:bg-[#208837] text-white rounded-xl text-xs font-bold transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#28a745] hover:bg-[#208837] text-white rounded-xl text-xs font-bold transition"
          >
            <Plus className="w-4 h-4" /> Add Commodity
          </button>
        </div>
      </div>

      {/* Watchlist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative">
            {item.pinned && (
              <div className="absolute top-3 right-3">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#2e4057]">{item.commodity}</h3>
                <p className="text-xs text-gray-500">Current Price</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handlePin(item.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                >
                  <Pin className={`w-4 h-4 ${item.pinned ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                </button>
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-2xl font-black text-[#2e4057]">₹{item.currentPrice}</p>
              <p className="text-xs text-gray-400">per quintal</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Demand Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#28a745] h-full" style={{ width: `${item.demandScore}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{item.demandScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Market Sentiment</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Supply Status</span>
                <span className="text-xs font-bold text-gray-700">{item.supplyStatus}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Price Trend</span>
                <div className="flex items-center gap-1">
                  {item.priceTrend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs font-bold ${item.priceTrend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    {item.priceTrend === "up" ? "Up" : "Down"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Watchlist Performance Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#2e4057] mb-4">Watchlist Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={watchlistPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
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
            <Line type="monotone" dataKey="soybean" stroke="#f59e0b" strokeWidth={2} dot={false} name="Soybean" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alert Status Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2e4057]">Active Alerts</h2>
          <span className="text-xs text-gray-500">{activeAlerts.length} active alerts</span>
        </div>
        <div className="space-y-3">
          {activeAlerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-[#2e4057]">{alert.commodity}</p>
                  <span className="text-[10px] text-gray-400">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-600">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Commodity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#2e4057]">Add Commodity to Watchlist</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Select Commodity</label>
                <select className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold">
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Cotton</option>
                  <option>Soybean</option>
                  <option>Maize</option>
                  <option>Onion</option>
                  <option>Tomato</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-[#2e4057] hover:bg-[#208837] text-white rounded-xl text-xs font-bold transition"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
