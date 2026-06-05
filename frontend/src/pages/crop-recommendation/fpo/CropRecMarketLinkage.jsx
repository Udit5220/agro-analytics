// CropRecMarketLinkage.jsx
import React, { useState, useMemo } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Briefcase,
  Sparkles,
  Clock,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

import seededData from "../../../seed-json/seededData.json";

const {
  marketLinkageBuyerDemand: BUYER_DEMAND_DATA,
  marketLinkageBuyerDiscovery: BUYER_DISCOVERY_LIST,
  marketLinkagePriceTrends: PRICE_TRENDS_DATA,
  marketLinkageSellingWindows: SELLING_WINDOWS,
} = seededData.cropRecommendation1.fpo;

export default function CropRecMarketLinkage() {
  const [selectedCrop, setSelectedCrop] = useState("Soybean");
  const [negotiatingQty, setNegotiatingQty] = useState(500);
  const [targetPrice, setTargetPrice] = useState(43500);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const selectedCropWindow = useMemo(() => {
    return SELLING_WINDOWS[selectedCrop] || SELLING_WINDOWS.Soybean;
  }, [selectedCrop]);

  // Revenue simulation calculations
  const simRev = useMemo(() => {
    const profiles = {
      Soybean: { price: 43500, msp: 42000 },
      Maize: { price: 21500, msp: 20900 },
      Mustard: { price: 55200, msp: 54500 },
      Wheat: { price: 23200, msp: 22750 },
      Chickpea: { price: 53000, msp: 52000 },
    };

    const rate = profiles[selectedCrop] || profiles.Soybean;
    const contractVal = negotiatingQty * targetPrice;
    const mspVal = negotiatingQty * rate.msp;
    const difference = contractVal - mspVal;
    const premiumPct = ((difference / mspVal) * 100).toFixed(1);

    return {
      contractVal,
      mspVal,
      difference,
      premiumPct,
    };
  }, [selectedCrop, negotiatingQty, targetPrice]);

  const handleApplyContract = (buyerName) => {
    triggerToast(`Proposal sent to ${buyerName} for ${negotiatingQty} MT of ${selectedCrop} at ₹${targetPrice}/MT.`);
  };

  const buyerColumns = [
    { header: "Buyer Corporate", accessor: "buyer", className: "font-bold text-gray-900" },
    { header: "Target Crop Profile", accessor: "crop", className: "font-semibold" },
    { header: "Volume Offer (MT)", accessor: "qty", cell: (val) => `${val.toLocaleString()} MT` },
    { header: "Price Offer (₹/MT)", accessor: "price", cell: (val) => `₹${val.toLocaleString()}`, className: "font-mono font-black text-emerald-800" },
    { header: "Logistics Type", accessor: "logistics" },
    { header: "Buyer Rating", accessor: "rating", cell: (val) => <span className="text-amber-500 font-bold">★ {val}</span> },
    {
      header: "Status",
      accessor: "status",
      cell: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
            val === "OPEN"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : val === "NEGOTIATING"
                ? "bg-amber-50 text-amber-700 border border-amber-250"
                : "bg-[#132a13]/10 text-[#132a13] border border-[#132a13]/20"
          }`}
        >
          {val}
        </span>
      ),
    },
    { header: "Agreement Type", accessor: "opportunity", className: "font-semibold text-gray-600" },
  ];

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#132a13] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-[#ecf39e]" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Compass className="h-6 w-6 text-[#31572c]" />
            <span>Market Linkage & Buyer Intelligence</span>
            <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
              | COMMERCIAL DEMAND HUB
            </span>
          </h1>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            Discover active corporate buyers · Forward contracts management · Price tracking index
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Buyer Demand"
          value="9,600 MT"
          subtext="Corporate aggregated"
          icon={<ShoppingBag className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Active Contract Volume"
          value="5,100 MT"
          subtext="53.1% committed"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Avg Market Premium"
          value="+14.2%"
          subtext="Above baseline MSP"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Committed Forward Revenue"
          value="₹2.24 Cr"
          subtext="Guaranteed payout value"
          icon={<IndianRupee className="w-5 h-5 text-[#31572c]" />}
        />
      </div>

      {/* Buyer Discovery Engine */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#31572c]" />
            Corporate Buyer Discovery & Forward Opportunities
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            Active verified commercial demands accepting forward contracting and direct purchases
          </p>
        </div>

        <GenericTable
          columns={buyerColumns}
          data={BUYER_DISCOVERY_LIST}
          itemsPerPage={5}
          showSearch={false}
          emptyMessage="No corporate buyer listings found"
        />
      </div>

      {/* Price Intelligence & Selling Window Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price comparisons */}
        <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-[#31572c]" />
              Price Intelligence comparison
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-4">
              Comparing MSP, Spot Market, and FPO Forecast Sowing prices (₹/MT)
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRICE_TRENDS_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="crop" tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}/MT`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="msp" name="Govt MSP" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="market" name="Current Spot Price" fill="#4f772d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast" name="FPO Harvest Forecast" fill="#132a13" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selling window analyzer */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-[#31572c]" />
              Best Selling Window Analysis
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-4">
              Select crop to examine crop-holding windows and storage risk profiles
            </p>

            <div className="space-y-4">
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  const priceMap = { Soybean: 43500, Maize: 21500, Mustard: 55200, Wheat: 23200, Chickpea: 53000 };
                  setTargetPrice(priceMap[e.target.value] || 40000);
                }}
                className="w-full text-xs font-bold bg-gray-50 border rounded-xl px-3 py-2.5"
              >
                {Object.keys(SELLING_WINDOWS).map((crop) => (
                  <option key={crop} value={crop}>
                    {crop} Analysis
                  </option>
                ))}
              </select>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-semibold">Recommended Window:</span>
                  <span className="font-bold text-[#31572c]">{selectedCropWindow.bestWindow}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-semibold">Projected Premium:</span>
                  <span className="font-bold text-emerald-700">{selectedCropWindow.premium}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-semibold">Associated Storage Risk:</span>
                  <span className="font-bold text-amber-600">{selectedCropWindow.risk}</span>
                </div>
              </div>

              <div className="bg-[#132a13]/5 border border-[#132a13]/10 p-3.5 rounded-xl text-[10px] text-gray-600 leading-relaxed font-semibold">
                <span className="font-black text-[#132a13] uppercase block">FPO Sourcing Strategy Advice</span>
                {selectedCropWindow.advice}
              </div>
            </div>
          </div>

          <div className="text-[9px] text-gray-400 font-bold uppercase pt-3 border-t">
            📅 Update rate: Weekly spot data sync
          </div>
        </div>
      </div>

      {/* Interactive Revenue Opportunity Matrix & AI forward contract guides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proposal Simulation */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <Briefcase className="w-5 h-5 text-[#31572c]" />
              Contract Revenue Simulator
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-4">
              Simulate forward contract valuations against mandated baseline MSP rates
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-1">Quantity (MT)</label>
                  <input
                    type="number"
                    value={negotiatingQty}
                    onChange={(e) => setNegotiatingQty(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-mono font-bold bg-gray-50 border rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-1">Price Offer (₹/MT)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-mono font-bold bg-gray-50 border rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* Simulation outcomes */}
              <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-semibold">Simulated Contract Valuation:</span>
                  <span className="font-mono font-bold text-gray-900">₹{simRev.contractVal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-semibold">Government MSP Payout:</span>
                  <span className="font-mono font-bold text-gray-900">₹{simRev.mspVal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t pt-2 mt-2">
                  <span className="text-emerald-800 font-black">Net Contract Premium:</span>
                  <span className="font-mono font-black text-emerald-800">
                    +₹{simRev.difference.toLocaleString()} ({simRev.premiumPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleApplyContract("ITC Agri-Business")}
            className="w-full mt-4 bg-[#31572c] hover:bg-[#132a13] text-white text-xs font-black uppercase py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <FileText size={14} /> Send Contract Proposal
          </button>
        </div>

        {/* AI Market Advisor */}
        <div className="bg-[#132a13]/5 border border-[#132a13]/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <h2 className="text-xs font-black text-[#132a13] uppercase tracking-wider">AI Market Linkage Advisory</h2>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed space-y-3">
              <span>
                Based on forecast indices for Faridabad, Haryana, the market spot prices for <b>Mustard</b> and <b>Soybean</b> are projected to hold high premiums (+8-12% above MSP) for the upcoming 60 days.
              </span>
              <br />
              <br />
              <span>
                <b>Actionable Directives:</b>
                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                  <li>Forward contract at least <b>40%</b> of the Maize harvest with Cargill to guarantee dry-weight shipping terms.</li>
                  <li>Avoid spot-selling Soybean in September; early reports indicate a supply glut which will level out by November.</li>
                  <li>Leverage the FPO storage credit line to issue farmer advancements, reducing pressure for distress selling.</li>
                </ul>
              </span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#132a13]/10 flex justify-between items-center text-[10px] font-bold text-[#31572c]">
            <span className="flex items-center gap-1">
              <ArrowUpRight size={14} /> FPO COMMERCE RECOMMENDATIONS
            </span>
            <span>UPDATED 2H AGO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
