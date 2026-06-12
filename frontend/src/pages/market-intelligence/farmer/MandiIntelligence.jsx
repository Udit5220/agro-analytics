import React, { useState } from "react";
import {
  MapPin,
  DollarSign,
  Truck,
  Users,
  Star,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Route,
  Navigation,
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
  LineChart,
  Line,
} from "recharts";

export default function MandiIntelligence() {
  const [selectedMandis, setSelectedMandis] = useState(["Azadpur", "Vashi"]);

  const nearbyMarkets = [
    { name: "Azadpur", distance: "45 km", price: 2200, arrival: 1500, buyerActivity: 85, marketScore: 92 },
    { name: "Vashi", distance: "120 km", price: 2180, arrival: 1200, buyerActivity: 78, marketScore: 88 },
    { name: "Kolar", distance: "180 km", price: 2150, arrival: 900, buyerActivity: 72, marketScore: 85 },
    { name: "Nashik", distance: "220 km", price: 2130, arrival: 750, buyerActivity: 68, marketScore: 82 },
    { name: "Solapur", distance: "280 km", price: 2100, arrival: 600, buyerActivity: 65, marketScore: 78 },
  ];

  const mandiComparisonData = [
    { name: "Azadpur", price: 2200, arrival: 1500, buyers: 85 },
    { name: "Vashi", price: 2180, arrival: 1200, buyers: 78 },
    { name: "Kolar", price: 2150, arrival: 900, buyers: 72 },
  ];

  const buyerActivityData = [
    { time: "6AM", activity: 20 },
    { time: "8AM", activity: 45 },
    { time: "10AM", activity: 85 },
    { time: "12PM", activity: 95 },
    { time: "2PM", activity: 80 },
    { time: "4PM", activity: 60 },
    { time: "6PM", activity: 30 },
  ];

  const bestMarket = {
    name: "Azadpur Mandi",
    location: "Delhi",
    expectedProfit: "+₹120/qtl",
    travelDistance: "45 km",
    marketRating: "4.8/5",
    buyerActivity: "Very High",
  };

  return (
    <div className="space-y-6 p-6 bg-[#f4f7f4]/40 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-darkest">Mandi Intelligence</h1>
          <p className="text-xs text-gray-500 mt-1">Compare mandis and find the best selling locations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Interactive Mandi Map Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Interactive Mandi Map</h2>
        <div className="h-80 bg-gradient-to-br from-brand-darkest/5 to-brand-medium/10 rounded-xl flex items-center justify-center relative">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-brand-medium mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-500">Interactive Map</p>
            <p className="text-[10px] text-gray-400">MapTiler integration coming soon</p>
          </div>
          {/* Simulated markers */}
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-brand-medium rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-amber-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Nearby Markets Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-brand-darkest mb-4">Nearby Markets</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Mandi Name</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Distance</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Current Price</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Arrival Volume</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Buyer Activity</th>
                <th className="text-left text-xs font-bold text-gray-500 py-3 px-2">Market Score</th>
              </tr>
            </thead>
            <tbody>
              {nearbyMarkets.map((market, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-bold text-brand-darkest">{market.name}</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Route className="w-3 h-3" /> {market.distance}
                  </td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">₹{market.price}/qtl</td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-700">{market.arrival} tons</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-medium h-full" style={{ width: `${market.buyerActivity}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{market.buyerActivity}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-gray-700">{market.marketScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandi Comparison Tool */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-brand-darkest">Mandi Comparison Tool</h2>
          <span className="text-xs text-gray-500">Compare up to 5 mandis</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mandiComparisonData}>
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
            <Bar dataKey="price" fill="var(--brand-medium)" name="Price (₹)" />
            <Bar dataKey="arrival" fill="#3b82f6" name="Arrival (tons)" />
            <Bar dataKey="buyers" fill="#f59e0b" name="Buyer Activity" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Market Card */}
      <div className="bg-gradient-to-r from-brand-darkest to-[#208837] rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Best Market Today</h2>
            <p className="text-xs text-white/80">Based on price, distance, and buyer activity</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Market Name</p>
            <p className="text-lg font-black">{bestMarket.name}</p>
            <p className="text-xs text-white/60">{bestMarket.location}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Expected Profit</p>
            <p className="text-lg font-black text-[#ffc857]">{bestMarket.expectedProfit}</p>
            <p className="text-xs text-white/60">vs nearest alternative</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Travel Distance</p>
            <p className="text-lg font-black">{bestMarket.travelDistance}</p>
            <p className="text-xs text-white/60">from your location</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 font-semibold mb-1">Market Rating</p>
            <p className="text-lg font-black text-[#ffc857]">{bestMarket.marketRating}</p>
            <p className="text-xs text-white/60">{bestMarket.buyerActivity} activity</p>
          </div>
        </div>
      </div>

      {/* Buyer Activity Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-darkest mb-4">Buyer Activity Timeline</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={buyerActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="activity" stroke="var(--brand-medium)" strokeWidth={2} dot={{ fill: "var(--brand-medium)" }} name="Activity %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-darkest mb-4">Buyer Activity Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-brand-medium" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Active Buyers</p>
                  <p className="text-sm font-bold text-brand-darkest">245 today</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">+12%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Purchase Volume</p>
                  <p className="text-sm font-bold text-brand-darkest">1,850 tons</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">+8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Demand Intensity</p>
                  <p className="text-sm font-bold text-brand-darkest">Very High</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Peak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
