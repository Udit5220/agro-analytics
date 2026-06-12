import React, { useState } from "react";
import {
  Bell,
  DollarSign,
  TrendingUp,
  Truck,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  RefreshCw,
  MessageSquare,
  Mail,
  Smartphone,
  Clock,
  Filter,
} from "lucide-react";

export default function MarketAlertsCenter() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showSettings, setShowSettings] = useState(false);

  const filters = ["All", "Price", "Demand", "Supply", "Market"];

  const alertSummary = [
    { type: "Price Alerts", count: 12, icon: DollarSign, color: "bg-emerald-500/10 text-emerald-600" },
    { type: "Demand Alerts", count: 8, icon: TrendingUp, color: "bg-blue-500/10 text-blue-600" },
    { type: "Supply Alerts", count: 5, icon: Truck, color: "bg-purple-500/10 text-purple-600" },
    { type: "Market Alerts", count: 3, icon: AlertTriangle, color: "bg-amber-500/10 text-amber-600" },
  ];

  const alertFeed = [
    { 
      id: 1, 
      type: "price", 
      commodity: "Wheat", 
      message: "Price crossed ₹2,150 threshold - increased by 2.5%", 
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10"
    },
    { 
      id: 2, 
      type: "demand", 
      commodity: "Soybean", 
      message: "Demand score increased to 88 - very high demand detected", 
      time: "4 hours ago",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    },
    { 
      id: 3, 
      type: "supply", 
      commodity: "Cotton", 
      message: "Supply reduced significantly in Punjab mandis", 
      time: "6 hours ago",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10"
    },
    { 
      id: 4, 
      type: "market", 
      commodity: "Maize", 
      message: "New market opportunity detected in Nashik mandi", 
      time: "8 hours ago",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10"
    },
    { 
      id: 5, 
      type: "price", 
      commodity: "Rice", 
      message: "Price dropped below ₹2,800 - selling opportunity", 
      time: "12 hours ago",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10"
    },
    { 
      id: 6, 
      type: "demand", 
      commodity: "Wheat", 
      message: "Export demand increased by 15% this week", 
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    },
  ];

  const notificationChannels = [
    { name: "SMS", icon: MessageSquare, enabled: true, color: "bg-emerald-500/10 text-emerald-600" },
    { name: "Email", icon: Mail, enabled: true, color: "bg-blue-500/10 text-blue-600" },
    { name: "Mobile App", icon: Smartphone, enabled: true, color: "bg-purple-500/10 text-purple-600" },
    { name: "WhatsApp", icon: MessageSquare, enabled: false, color: "bg-gray-100 text-gray-400" },
  ];

  const alertConfigurations = [
    { category: "Price Threshold Alerts", description: "Get notified when prices cross your set thresholds", enabled: true },
    { category: "Demand Alerts", description: "Alerts when demand scores change significantly", enabled: true },
    { category: "Supply Alerts", description: "Notifications about supply fluctuations", enabled: true },
    { category: "Market Alerts", description: "New market opportunities and changes", enabled: true },
  ];

  const filteredAlerts = selectedFilter === "All" 
    ? alertFeed 
    : alertFeed.filter(alert => alert.type === selectedFilter.toLowerCase());

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Market Alerts Center</h1>
          <p className="text-xs text-gray-500 mt-1">Centralized notification system for market updates</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
          >
            <Settings className="w-4 h-4" /> Configure Alerts
          </button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertSummary.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-brand-darkest">{item.count}</span>
            </div>
            <p className="text-xs text-gray-500 font-semibold">{item.type}</p>
          </div>
        ))}
      </div>

      {/* Alert Feed */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Alert Feed</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedFilter === filter
                      ? "bg-brand-darkest text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
              <div className={`p-2.5 rounded-xl ${alert.bgColor} flex-shrink-0`}>
                <alert.icon className={`w-5 h-5 ${alert.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-brand-darkest">{alert.commodity}</p>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{alert.message}</p>
              </div>
              <button className="p-1.5 hover:bg-white rounded-lg transition">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Notification Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notificationChannels.map((channel, index) => (
            <div key={index} className={`border rounded-xl p-4 ${channel.enabled ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${channel.color}`}>
                  <channel.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-brand-darkest">{channel.name}</p>
                  <p className="text-[10px] text-gray-400">{channel.enabled ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <div className={`w-10 h-5 rounded-full relative ${channel.enabled ? "bg-brand-medium" : "bg-gray-300"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${channel.enabled ? "left-5" : "left-0.5"}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Configuration Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-brand-darkest">Alert Configuration</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {alertConfigurations.map((config, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-brand-darkest mb-1">{config.category}</p>
                    <p className="text-[10px] text-gray-500">{config.description}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer ${config.enabled ? "bg-brand-medium" : "bg-gray-300"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${config.enabled ? "left-5" : "left-0.5"}`}></div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xs font-bold text-brand-darkest mb-3">Price Threshold Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24">Commodity</span>
                    <select className="flex-1 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold">
                      <option>Wheat</option>
                      <option>Rice</option>
                      <option>Soybean</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24">Min Price (₹)</span>
                    <input type="number" className="flex-1 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold" placeholder="2000" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24">Max Price (₹)</span>
                    <input type="number" className="flex-1 bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold" placeholder="2500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
