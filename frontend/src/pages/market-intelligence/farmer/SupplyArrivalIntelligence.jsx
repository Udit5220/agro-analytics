import React, { useState } from "react";
import {
  Truck,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  MapPin,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function SupplyArrivalIntelligence() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Weekly");

  const timeFilters = ["Daily", "Weekly", "Monthly"];

  const arrivalSummary = {
    today: 2500,
    weekly: 17500,
    monthly: 75000,
    change: 12.5,
  };

  const arrivalTrendData = [
    { day: "Mon", daily: 2200, weekly: 15400, monthly: 66000 },
    { day: "Tue", daily: 2400, weekly: 16800, monthly: 72000 },
    { day: "Wed", daily: 2300, weekly: 16100, monthly: 69000 },
    { day: "Thu", daily: 2500, weekly: 17500, monthly: 75000 },
    { day: "Fri", daily: 2600, weekly: 18200, monthly: 78000 },
    { day: "Sat", daily: 2100, weekly: 14700, monthly: 63000 },
    { day: "Sun", daily: 1800, weekly: 12600, monthly: 54000 },
  ];

  const supplyDemandData = [
    { month: "Jan", supply: 65000, demand: 58000 },
    { month: "Feb", supply: 68000, demand: 60000 },
    { month: "Mar", supply: 70000, demand: 62000 },
    { month: "Apr", supply: 72000, demand: 65000 },
    { month: "May", supply: 75000, demand: 68000 },
    { month: "Jun", supply: 78000, demand: 70000 },
  ];

  const supplyAlerts = [
    { type: "increase", message: "Wheat arrivals increased by 18% in Punjab mandis", time: "2 hours ago", icon: TrendingUp, color: "text-emerald-600" },
    { type: "decrease", message: "Onion supply reduced significantly in Maharashtra", time: "4 hours ago", icon: TrendingDown, color: "text-red-600" },
    { type: "alert", message: "Cotton arrivals expected to surge next week", time: "6 hours ago", icon: AlertTriangle, color: "text-amber-600" },
    { type: "info", message: "Maize supply stable across northern regions", time: "8 hours ago", icon: Activity, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Supply & Arrival Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Track supply pressure and commodity arrivals</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Arrival Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-brand-medium/10 text-brand-medium">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Today's Arrivals</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">{arrivalSummary.today.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">tons</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Weekly Arrivals</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">{arrivalSummary.weekly.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">tons</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 font-semibold">Monthly Arrivals</span>
          </div>
          <p className="text-2xl font-black text-brand-darkest">{arrivalSummary.monthly.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">tons</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2.5 rounded-xl ${arrivalSummary.change > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
              {arrivalSummary.change > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <span className="text-xs text-gray-500 font-semibold">Arrival Change</span>
          </div>
          <p className={`text-2xl font-black ${arrivalSummary.change > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {arrivalSummary.change > 0 ? "+" : ""}{arrivalSummary.change}%
          </p>
          <p className="text-xs text-gray-400 mt-1">vs last period</p>
        </div>
      </div>

      {/* Commodity Arrival Trends */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Commodity Arrival Trends</h2>
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
          <AreaChart data={arrivalTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="daily" stroke="var(--brand-medium)" fill="var(--brand-medium)" fillOpacity={0.3} name="Daily" />
            <Area type="monotone" dataKey="weekly" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Weekly" />
            <Area type="monotone" dataKey="monthly" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Monthly" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Supply Pressure Meter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Supply Pressure Meter</h2>
        <div className="flex items-center justify-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
              <circle cx="96" cy="96" r="80" stroke="var(--brand-medium)" strokeWidth="16" fill="none" strokeDasharray="502" strokeDashoffset="251" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Gauge className="w-8 h-8 text-brand-medium mb-1" />
              <span className="text-3xl font-black text-brand-darkest">Balanced</span>
              <span className="text-xs text-gray-500">Supply Level</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-gray-700">Low Supply (0-33%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs font-bold text-gray-700">Balanced Supply (33-66%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-xs font-bold text-gray-700">Oversupply (66-100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supply vs Demand Analysis */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Supply vs Demand Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={supplyDemandData}>
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
            <Bar dataKey="supply" fill="var(--brand-medium)" name="Supply (tons)" />
            <Bar dataKey="demand" fill="#3b82f6" name="Demand (tons)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Regional Supply Map & Supply Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Supply Map Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-darkest mb-4">Regional Supply Map</h2>
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
              <span className="text-xs text-gray-500">High Supply</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-xs text-gray-500">Medium Supply</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-400"></div>
              <span className="text-xs text-gray-500">Low Supply</span>
            </div>
          </div>
        </div>

        {/* Supply Alerts Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-darkest mb-4">Supply Alerts</h2>
          <div className="space-y-3">
            {supplyAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`p-2 rounded-lg ${alert.color.replace("text", "bg")}/10`}>
                  <alert.icon className={`w-4 h-4 ${alert.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">{alert.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
