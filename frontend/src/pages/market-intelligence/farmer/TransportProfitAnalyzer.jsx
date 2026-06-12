import React, { useState } from "react";
import {
  Truck,
  DollarSign,
  Route,
  MapPin,
  Fuel,
  Calculator,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export default function TransportProfitAnalyzer() {
  const [formData, setFormData] = useState({
    commodity: "Wheat",
    quantity: 10,
    vehicleType: "Truck",
    fuelCost: 1500,
    loadingCharges: 500,
    otherCosts: 300,
  });

  const profitData = [
    { market: "Azadpur", price: 2200, transportCost: 800, otherCosts: 300, netRevenue: 13200, profitDiff: 1200 },
    { market: "Vashi", price: 2180, transportCost: 1200, otherCosts: 350, netRevenue: 13080, profitDiff: 1080 },
    { market: "Kolar", price: 2150, transportCost: 1500, otherCosts: 400, netRevenue: 12900, profitDiff: 900 },
    { market: "Nashik", price: 2130, transportCost: 1800, otherCosts: 450, netRevenue: 12780, profitDiff: 780 },
    { market: "Solapur", price: 2100, transportCost: 2000, otherCosts: 500, netRevenue: 12600, profitDiff: 600 },
  ];

  const costBreakdown = [
    { name: "Fuel", value: 1500, color: "var(--brand-medium)" },
    { name: "Labor", value: 800, color: "#3b82f6" },
    { name: "Toll", value: 400, color: "#f59e0b" },
    { name: "Miscellaneous", value: 300, color: "#8b5cf6" },
  ];

  const bestMarket = {
    name: "Azadpur Mandi",
    location: "Delhi",
    distance: "45 km",
    travelTime: "1.5 hours",
    estimatedCost: "₹1,100",
    netProfit: "₹13,200",
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Transport Profit Analyzer</h1>
          <p className="text-xs text-gray-500 mt-1">Compare net profit after transportation costs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* User Input Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Input Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Commodity</label>
            <select
              value={formData.commodity}
              onChange={(e) => handleInputChange("commodity", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
            >
              <option>Wheat</option>
              <option>Rice</option>
              <option>Cotton</option>
              <option>Soybean</option>
              <option>Maize</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Quantity (quintals)</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Vehicle Type</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => handleInputChange("vehicleType", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
            >
              <option>Truck</option>
              <option>Mini Truck</option>
              <option>Tractor Trolley</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Fuel Cost (₹)</label>
            <input
              type="number"
              value={formData.fuelCost}
              onChange={(e) => handleInputChange("fuelCost", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Loading Charges (₹)</label>
            <input
              type="number"
              value={formData.loadingCharges}
              onChange={(e) => handleInputChange("loadingCharges", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Other Costs (₹)</label>
            <input
              type="number"
              value={formData.otherCosts}
              onChange={(e) => handleInputChange("otherCosts", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Profit Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Profit Comparison by Market</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Market</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Price (₹/qtl)</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Transport Cost</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Other Costs</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Net Revenue</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Profit Difference</th>
              </tr>
            </thead>
            <tbody>
              {profitData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-bold text-brand-darkest">{item.market}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">₹{item.price}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">₹{item.transportCost}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">₹{item.otherCosts}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">₹{item.netRevenue.toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-bold flex items-center gap-1 ${item.profitDiff > 1000 ? "text-emerald-600" : "text-amber-600"}`}>
                      <ArrowUpRight className="w-3 h-3" />
                      +₹{item.profitDiff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transportation Cost Breakdown & Route Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transportation Cost Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-darkest mb-4">Transportation Cost Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-600">{item.name}: ₹{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Analysis Map Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-darkest mb-4">Route Analysis</h2>
          <div className="h-64 bg-gradient-to-br from-brand-darkest/5 to-brand-medium/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Route className="w-12 h-12 text-brand-medium mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500">Interactive Route Map</p>
              <p className="text-[10px] text-gray-400">MapTiler integration coming soon</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500">Distance</span>
              <span className="text-xs font-bold text-brand-darkest">45 km</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500">Travel Time</span>
              <span className="text-xs font-bold text-brand-darkest">1.5 hours</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500">Estimated Cost</span>
              <span className="text-xs font-bold text-brand-darkest">₹1,100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Profit Market Recommendation */}
      <div className="bg-gradient-to-r from-brand-darkest to-[#208837] rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Best Profit Market Recommendation</h2>
            <p className="text-xs text-white/80">Based on your input parameters</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Market Name</p>
            <p className="text-lg font-black">{bestMarket.name}</p>
            <p className="text-xs text-white/60">{bestMarket.location}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Distance</p>
            <p className="text-lg font-black text-[#ffc857]">{bestMarket.distance}</p>
            <p className="text-xs text-white/60">{bestMarket.travelTime} travel</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Transport Cost</p>
            <p className="text-lg font-black">{bestMarket.estimatedCost}</p>
            <p className="text-xs text-white/60">total expenses</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Net Profit</p>
            <p className="text-lg font-black text-[#ffc857]">{bestMarket.netProfit}</p>
            <p className="text-xs text-white/60">after all costs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
