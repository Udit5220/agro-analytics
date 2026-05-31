import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, MoveHorizontal, Lightbulb, ChevronDown, Bell, Loader2, MapPin } from "lucide-react";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";
import { getMarketData } from "../../services/geminiService";

const CROP_MULTIPLIERS = {
  "Wheat (गेहूं)": 1.0,
  "Rice (धान)": 1.35,
  "Cotton (कпас)": 2.85,
  "Mustard (सरसों)": 2.25
};

export default function MandiPriceTracker() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat (गेहूं)");
  const [alertPrice, setAlertPrice] = useState("2400");
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Global location state synchronized
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001")
  });

  // Dynamic state loaded from Gemini/fallback
  const [marketData, setMarketData] = useState(null);

  // Handle global coordinates / district update
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Re-fetch mandi prices whenever selections shift
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadMarket = async () => {
      const result = await getMarketData(selectedCrop, location.district);
      if (active) {
        setMarketData(result);
        setLoading(false);
      }
    };

    loadMarket();

    return () => {
      active = false;
    };
  }, [selectedCrop, location.district]);

  // Dynamic multipliers based on selected crop
  const multiplier = CROP_MULTIPLIERS[selectedCrop] || 1.0;

  // Format currency helper
  const formatPrice = (val) => {
    return Math.round(val).toLocaleString("en-IN");
  };

  // Safe fallback chart points
  const generateFallbackPoints = () => {
    const basePrice = 2150 * multiplier;
    const points = [];
    for (let i = 0; i < 30; i++) {
      const wave = Math.sin(i * 0.45) * 75 + Math.cos(i * 0.25) * 45;
      const noise = (i % 3 === 0 ? 12 : -8) + (i % 5 === 0 ? 18 : 0);
      points.push(Math.round(basePrice + wave + noise));
    }
    return points;
  };

  // Resolve active chart data
  const chartData = marketData?.priceChart?.map(p => p.price) || generateFallbackPoints();
  const minPrice = Math.min(...chartData);
  const maxPrice = Math.max(...chartData);

  // Auto-fill price alert input when crop changes
  useEffect(() => {
    const defaultAlertVal = Math.round(2300 * multiplier);
    setAlertPrice(defaultAlertVal.toString());
  }, [selectedCrop, multiplier]);

  // Render SVG Path for smooth price line
  const renderSvgPath = (data, w, h) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const padding = 20;
    const chartH = h - padding * 2;
    const chartW = w;
    const stepX = chartW / (data.length - 1);

    return data.map((val, idx) => {
      const x = idx * stepX;
      const y = h - padding - ((val - min) / (max - min)) * chartH;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  };

  // Render SVG Path for background color gradient fill
  const renderSvgArea = (data, w, h) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const padding = 20;
    const chartH = h - padding * 2;
    const chartW = w;
    const stepX = chartW / (data.length - 1);

    const pathPoints = data.map((val, idx) => {
      const x = idx * stepX;
      const y = h - padding - ((val - min) / (max - min)) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M 0,${h} L 0,${pathPoints[0].split(",")[1]} ${pathPoints.map(p => `L ${p.replace(",", " ")}`).join(" ")} L ${chartW},${h} Z`;
  };

  // Resolve best mandi today
  const bestMandi = marketData?.mandis?.find(m => m.isBest) || {
    name: selectedCrop.includes("Wheat") ? "Azadpur Mandi (Delhi)" : "Karnal Mandi (Haryana)",
    price: Math.round(2340 * multiplier),
    weeklyChange: 2.1
  };

  // Resolve Today's Prices Ledger
  const ledgerData = marketData?.mandis || [
    { name: "Azadpur Mandi, Delhi", price: 2340 * multiplier, weeklyChange: 2.1, isBest: true },
    { name: "Karnal Mandi, Haryana", price: 2180 * multiplier, weeklyChange: 1.8, isBest: false },
    { name: "Amritsar Mandi, Punjab", price: 2120 * multiplier, weeklyChange: 0.2, isBest: false },
    { name: "Jaipur Mandi, Rajasthan", price: 2050 * multiplier, weeklyChange: -1.2, isBest: false },
    { name: "Indore Mandi, MP", price: 2000 * multiplier, weeklyChange: 0.1, isBest: false }
  ];

  // Resolve tip text
  const tipText = marketData?.diversificationTip || `Consider adding Mustard to your rotation to reduce price volatility and improve nitrogen baseline indices.`;

  return (
    <div className="space-y-6 animate-fadeIn antialiased font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-150">
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Mandi Price Tracker</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
              मंडी भाव ट्रैकर
            </span>
          </h1>
          <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
            Realtime commodity market prices, historical oscillations, and predictive hedging alerts.
          </p>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Crop Selector */}
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 h-[38px] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#31572c] cursor-pointer shadow-sm min-w-[150px]"
            >
              <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
              <option value="Rice (धान)">Rice (धान)</option>
              <option value="Cotton (कपास)">Cotton (कपास)</option>
              <option value="Mustard (सरसों)">Mustard (सरसों)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Global Location Selector Card */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Best Price Today Banner */}
      <div className="bg-white border border-gray-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm mt-4 w-full">
        <div className="flex items-center text-left">
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl mr-3 shadow-inner shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-950 block">Best Price Today</span>
            <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
              {bestMandi.name} — <span className="text-emerald-700 font-black">₹{formatPrice(bestMandi.price)}/qt</span>, {bestMandi.weeklyChange || 12}% above average
            </span>
          </div>
        </div>
        <button className="text-xs font-bold border border-gray-200 px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer shrink-0">
          View Details →
        </button>
      </div>

      {/* Split Graph Analytics Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start relative min-h-[360px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
              <span className="text-xs font-black text-gray-700">Syncing AI Market Indices...</span>
            </div>
          </div>
        )}

        {/* Left Card: 30-Day Price Trend Graph Panel (Span: 2) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[360px]">
          <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase text-left">
              Price Trend — {selectedCrop.split(" ")[0]} (₹/quintal)
            </h3>
            <span className="text-[10px] font-bold text-[#31572c] bg-[#31572c]/8 px-2 py-0.5 rounded">
              Live Mandi Indices
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="relative mt-4 flex-1 h-[220px] bg-slate-50/30 rounded-xl border border-slate-100/50 p-2 flex flex-col justify-between overflow-hidden">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
              <div className="border-b border-dashed border-gray-200 w-full h-0" />
              <div className="border-b border-dashed border-gray-200 w-full h-0" />
              <div className="border-b border-dashed border-gray-200 w-full h-0" />
              <div className="border-b border-dashed border-gray-200 w-full h-0" />
            </div>

            {/* SVG Visual Canvas */}
            <svg viewBox="0 0 500 200" className="w-full h-full z-10 overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Shaded Area under the curve */}
              <path
                d={renderSvgArea(chartData, 500, 200)}
                fill="url(#chartGrad)"
                stroke="none"
              />

              {/* Smooth stroke line path */}
              <path
                d={renderSvgPath(chartData, 500, 200)}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Highlight dynamic points */}
              {chartData.map((val, idx) => {
                if (idx % 4 === 0 || idx === chartData.length - 1) {
                  const stepX = 500 / (chartData.length - 1);
                  const x = idx * stepX;
                  const y = 200 - 20 - ((val - minPrice) / (maxPrice - minPrice)) * 160;
                  const isLast = idx === chartData.length - 1;
                  
                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isLast ? "5" : "3.5"}
                        fill={isLast ? "#10b981" : "#ffffff"}
                        stroke="#10b981"
                        strokeWidth="2"
                        className={isLast ? "animate-pulse" : ""}
                      />
                      {isLast && (
                        <circle
                          cx={x}
                          cy={y}
                          r="10"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="1.5"
                          className="animate-ping"
                          style={{ transformOrigin: `${x}px ${y}px` }}
                        />
                      )}
                    </g>
                  );
                }
                return null;
              })}
            </svg>

            {/* Bottom X-Axis labels */}
            <div className="flex justify-between text-[9px] font-bold text-gray-400 px-4 border-t border-slate-100/80 pt-1.5 bg-white">
              <span>Day 1</span>
              <span>Midpoint</span>
              <span>Today</span>
            </div>
          </div>

          {/* Aggregated Quick Metrics Row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100 text-left">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Min Index Price</span>
              <span className="text-xs font-black text-gray-800">₹{formatPrice(minPrice)}/qt</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Average Market Price</span>
              <span className="text-xs font-black text-[#31572c]">₹{formatPrice((minPrice + maxPrice) / 2)}/qt</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Max Index Price</span>
              <span className="text-xs font-black text-gray-800">₹{formatPrice(maxPrice)}/qt</span>
            </div>
          </div>
        </div>

        {/* Right Cards: Alert Form & Diversification Widget Stack (Span: 1) */}
        <div className="lg:col-span-1 space-y-4 w-full flex flex-col justify-start">
          
          {/* Price Alert Box */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col text-left">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">
              Price Alert
            </h3>
            
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4">
              Get notified immediately on your mobile device when {selectedCrop.split(" ")[0]} wholesale price triggers this target.
            </p>

            <div className="space-y-4">
              {/* Input field with currency prefix and unit suffix */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-black text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-xl pl-8 pr-12 h-[38px] text-xs font-black text-gray-800 focus:outline-none focus:border-[#31572c] focus:bg-white shadow-sm"
                  placeholder="Enter target price"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold text-[10px]">/qt</span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-gray-800">Enable alerts</span>
                <button
                  type="button"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alertsEnabled ? "bg-[#31572c]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      alertsEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Set alert button */}
              <button
                disabled={!alertsEnabled}
                className={`w-full h-[36px] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 border border-transparent ${
                  alertsEnabled
                    ? "bg-[#31572c] hover:bg-[#132a13] text-[#ecf39e] active:scale-[0.98] cursor-pointer"
                    : "bg-gray-150 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Save Alert Rule</span>
              </button>
            </div>
          </div>

          {/* Diversification Tip Box */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 text-left flex items-start space-x-3 shadow-inner">
            <div className="p-2 bg-emerald-50 border border-emerald-150 rounded-lg text-emerald-700 shrink-0">
              <Lightbulb className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900">Diversification Tip</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-medium mt-1">
                {tipText}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Today's Prices Ledger Data Table to Full Width */}
      <div className="w-full bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mt-6 text-left">
        
        {/* Table Header Banner */}
        <div className="p-4 border-b border-gray-100 bg-[#f4f7f4]/20 flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
            Today's Prices at {location.district} Region
          </h3>
          <span className="text-[10px] font-bold text-gray-400 bg-white border px-2 py-0.5 rounded shadow-sm">
            Live Feed Updates
          </span>
        </div>

        {/* High-Density Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 border-b border-gray-100 uppercase">Mandi</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 border-b border-gray-100 uppercase">Modal (₹/qt)</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 border-b border-gray-100 uppercase">Min</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 border-b border-gray-100 uppercase">Max</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 border-b border-gray-100 uppercase text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.map((row, idx) => {
                const modalVal = Math.round(row.price);
                const minVal = Math.round(row.price * 0.94);
                const maxVal = Math.round(row.price * 1.06);
                const weeklyChange = row.weeklyChange || 0;
                const trend = weeklyChange > 0.5 ? "up" : weeklyChange < -0.5 ? "down" : "stable";

                return (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/60 border-b border-gray-100/50 transition-colors duration-150"
                  >
                    <td className="p-3.5 text-xs font-bold text-gray-800">{row.name || row.mandi}</td>
                    <td className="p-3.5 text-xs font-black text-gray-950">₹{formatPrice(modalVal)}</td>
                    <td className="p-3.5 text-xs font-bold text-gray-500">₹{formatPrice(minVal)}</td>
                    <td className="p-3.5 text-xs font-bold text-gray-500">₹{formatPrice(maxVal)}</td>
                    <td className="p-3.5 text-xs font-bold text-center">
                      <div className="inline-flex items-center justify-center">
                        {trend === "up" && (
                          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-black uppercase">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                            Up ({weeklyChange}%)
                          </span>
                        )}
                        {trend === "down" && (
                          <span className="flex items-center gap-1 text-red-600 bg-red-50/50 px-2 py-0.5 rounded border border-red-100 text-[10px] font-black uppercase">
                            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                            Down ({weeklyChange}%)
                          </span>
                        )}
                        {trend === "stable" && (
                          <span className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-[10px] font-black uppercase">
                            <MoveHorizontal className="w-3.5 h-3.5 text-gray-400" />
                            Stable
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
