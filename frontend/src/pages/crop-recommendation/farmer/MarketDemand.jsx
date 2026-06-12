import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { MapPin, TrendingUp, Lightbulb, Loader2 } from "lucide-react";
import { getMarketData } from "../../../services/geminiService";

const CROPS = ["Wheat", "Rice", "Maize", "Cotton"];

export default function MarketDemand() {
  const [activeCrop, setActiveCrop] = useState("Wheat");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic state loaded from Gemini/fallback
  const [marketData, setMarketData] = useState({
    demandLevel: "High Demand",
    priceChart: [
      { day: "D1", price: 2210 },
      { day: "D3", price: 2240 },
      { day: "D5", price: 2220 },
      { day: "D7", price: 2260 },
      { day: "D9", price: 2280 },
      { day: "D11", price: 2250 },
      { day: "D13", price: 2280 },
      { day: "D15", price: 2310 },
      { day: "D16", price: 2285 },
      { day: "D18", price: 2330 },
      { day: "D20", price: 2355 },
      { day: "D21", price: 2340 },
      { day: "D23", price: 2375 },
      { day: "D25", price: 2390 },
      { day: "D26", price: 2410 },
      { day: "D28", price: 2395 },
      { day: "D29", price: 2440 },
      { day: "D30", price: 2460 }
    ],
    mandis: [
      { name: "Nuh Mandi, Faridabad", price: 2440, weeklyChange: 2.1, isBest: true },
      { name: "Palwal APMC", price: 2420, weeklyChange: 1.8, isBest: false },
      { name: "Ballabhgarh Grain Market", price: 2410, weeklyChange: 1.4, isBest: false },
      { name: "Hodal Mandi", price: 2390, weeklyChange: 0.9, isBest: false }
    ],
    diversificationTip: "Consider adding Mustard to your rotation to reduce wheat price volatility risk."
  });

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const loadMarketDetails = async () => {
      try {
        const result = await getMarketData(activeCrop, 'Faridabad');
        if (active) {
          setMarketData(result);
        }
      } catch (err) {
        console.error("Failed to load crop market data:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadMarketDetails();

    return () => {
      active = false;
    };
  }, [activeCrop]);

  const getDemandBadgeColor = (level) => {
    if (level === "High Demand") return "bg-[#ecf39e] text-[#132a13]";
    if (level === "Medium Demand") return "bg-brand-medium/20 text-[#31572c]";
    return "bg-amber-100 text-amber-900";
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <TrendingUp className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Market Demand & Mandi Analytics</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              बाजार मांग और मंडी मूल्य
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Track real-time Mandi transaction price indices and localized crop demand projections.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* --- LIVE SUB-HEADER & CONTROLS --- */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Live mandi prices and demand analytics for your crop
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => setActiveCrop(crop)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCrop === crop
                    ? "bg-brand-dark text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              Market Demand:
            </span>
            <span className={`font-black uppercase tracking-widest text-[9px] px-2.5 py-1 rounded ${getDemandBadgeColor(marketData.demandLevel)}`}>
              {marketData.demandLevel}
            </span>
            <span className="text-gray-400 font-bold">
              · Haryana region · This week
            </span>
            {isLoading && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase ml-2">
                <Loader2 className="h-3 w-3 animate-spin text-[#31572c]" />
                Refreshing...
              </span>
            )}
          </div>
        </div>

        {/* --- RECHARTS LINE CANVAS --- */}
        <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 ${isLoading ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-200`}>
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-950 tracking-tight">
              {activeCrop} Mandi Price — Last 30 Days
            </h2>
            <div className="flex items-center gap-1 text-[#15803d] font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>₹260 gain / average</span>
            </div>
          </div>

          {/* Interactive Chart Section */}
          <div className="w-full h-64 text-[10px] font-bold text-gray-400">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketData.priceChart}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  horizontal={false}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
                  dx={-5}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#31572c"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#4f772d" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- REGIONAL MANDI COMMODITY LIST --- */}
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isLoading ? 'opacity-40' : ''}`}>
          <div className="bg-[#f4f7f4]/50 border-b border-gray-100 p-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#31572c]" />
            <h3 className="text-sm font-bold text-[#132a13] tracking-tight">
              Best Mandi Prices — Haryana This Week
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Mandi</th>
                  <th className="p-4 text-center md:text-left">Price/Qtl</th>
                  <th className="p-4 text-right pr-6">7-Day Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marketData.mandis.map((mandi, idx) => {
                  const isBestMatch = mandi.isBest === true || mandi.isBest === "true";
                  
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-[#f4f7f4]/20 transition-colors"
                    >
                      {/* Mandi Name / Tag */}
                      <td className="p-4 pl-6 text-xs font-bold text-gray-700 flex items-center gap-2">
                        {isBestMatch && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-1.5 py-0.5 rounded">
                            Best
                          </span>
                        )}
                        <span>{mandi.name}</span>
                      </td>

                      {/* Saturated Emerald Pricing Accent */}
                      <td className="p-4 text-xs font-black text-[#15803d] text-center md:text-left font-mono">
                        ₹{Number(mandi.price).toLocaleString('en-IN')}
                      </td>

                      {/* Performance Indicators */}
                      <td className="p-4 text-xs font-bold text-[#15803d] text-right pr-6">
                        <span className="inline-flex items-center gap-0.5 font-mono">
                          ↗ {mandi.weeklyChange || mandi.change}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CONTEXTUAL DIVERSIFICATION FOOTER --- */}
        <div className="bg-[#ecf39e]/40 border border-[#90a955]/30 rounded-xl p-4 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-[#31572c] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-700 tracking-normal leading-relaxed">
            <span className="font-black text-[#31572c]">
              Diversification Tip ·
            </span>{" "}
            {marketData.diversificationTip || marketData.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
