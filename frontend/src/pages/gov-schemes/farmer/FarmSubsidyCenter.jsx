// src/pages/farmer/FarmSubsidyCenter.jsx
import React, { useState } from "react";
import {
  Droplet,
  Tractor,
  Sun,
  Warehouse,
  Snowflake,
  Leaf,
  Sprout,
  PawPrint,
  Calculator,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  IndianRupee,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Line,
  ComposedChart,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { createPortal } from "react-dom";

const FarmSubsidyCenter = () => {
  const [activeTab, setActiveTab] = useState("Irrigation");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(45000);
  const [farmerCategory, setFarmerCategory] = useState("SC");
  const [applyingSubsidy, setApplyingSubsidy] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const { subsidyData } = govtSchemeData;
  const { categories, subsidies, roiCalculator } = subsidyData;

  const currentSubsidies = subsidies[activeTab] || subsidies["Irrigation"];
  const selectedSchemeData =
    selectedScheme !== null
      ? currentSubsidies.find((s) => s.id === selectedScheme)
      : currentSubsidies[0];

  const getCategoryIcon = (category) => {
    const icons = {
      Irrigation: <Droplet className="w-4 h-4 shrink-0" />,
      Machinery: <Tractor className="w-4 h-4 shrink-0" />,
      Solar: <Sun className="w-4 h-4 shrink-0" />,
      Storage: <Warehouse className="w-4 h-4 shrink-0" />,
      "Cold Chain": <Snowflake className="w-4 h-4 shrink-0" />,
      Greenhouse: <Leaf className="w-4 h-4 shrink-0" />,
      Organic: <Sprout className="w-4 h-4 shrink-0" />,
      Livestock: <PawPrint className="w-4 h-4 shrink-0" />,
    };
    return icons[category] || <Droplet className="w-4 h-4 shrink-0" />;
  };

  const calculateSubsidyAmount = () => {
    const subsidyPercent = selectedSchemeData
      ? selectedSchemeData.subsidyPercent
      : 55;
    const extraPercent =
      farmerCategory === "SC" &&
      (selectedSchemeData?.extraInfo?.toLowerCase().includes("sc") ||
        selectedSchemeData?.eligibilityChips?.some((chip) =>
          chip.toLowerCase().includes("sc"),
        ))
        ? 10
        : 0;
    const totalPercent = Math.min(subsidyPercent + extraPercent, 90);
    const subsidyAmount = (investmentAmount * totalPercent) / 100;
    const maxAmount =
      parseInt(selectedSchemeData?.maxAmount?.replace(/[^0-9]/g, "")) || 45000;
    return Math.min(subsidyAmount, maxAmount);
  };

  const calculateFarmerInvestment = () => {
    return investmentAmount - calculateSubsidyAmount();
  };

  const calculatePaybackPeriod = () => {
    const waterSavings = 18000;
    const farmerInvestment = calculateFarmerInvestment();
    if (waterSavings === 0) return 0;
    return (farmerInvestment / waterSavings).toFixed(1);
  };

  const calculateFiveYearBenefit = () => {
    const waterSavings = 18000;
    const subsidyAmount = calculateSubsidyAmount();
    return (
      waterSavings * 5 +
      subsidyAmount -
      calculateFarmerInvestment()
    ).toFixed(0);
  };

  const roiData = [
    {
      year: 0,
      investment: -calculateFarmerInvestment(),
      cumulative: -calculateFarmerInvestment(),
    },
    {
      year: 1,
      investment: 18000,
      cumulative: -calculateFarmerInvestment() + 18000,
    },
    {
      year: 2,
      investment: 18000,
      cumulative: -calculateFarmerInvestment() + 36000,
    },
    {
      year: 3,
      investment: 18000,
      cumulative: -calculateFarmerInvestment() + 54000,
    },
    {
      year: 4,
      investment: 18000,
      cumulative: -calculateFarmerInvestment() + 72000,
    },
    {
      year: 5,
      investment: 18000,
      cumulative: -calculateFarmerInvestment() + 90000,
    },
  ];

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setApplyingSubsidy(null);
    }, 1500);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <Sparkles className="h-5 w-5 text-brand-medium" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">
              Subsidy Opportunity Center
            </h1>
            <p className="text-xs text-gray-500">
              Discover and calculate capital subsidies for eco-investments and
              machinery
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-gray-200 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveTab(category);
              setSelectedScheme(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === category
                ? "bg-[#132a13] text-white"
                : "text-gray-600 hover:bg-[#132a13]/10"
            }`}
          >
            {getCategoryIcon(category)}
            {category}
          </button>
        ))}
      </div>

      {/* Subsidy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentSubsidies.map((subsidy) => (
          <div
            key={subsidy.id}
            className={`bg-white rounded-2xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${
              selectedScheme === subsidy.id
                ? "border-2 border-[#132a13]"
                : "border-gray-150"
            }`}
            onClick={() => setSelectedScheme(subsidy.id)}
          >
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-[#132a13] text-sm leading-snug">
                      {subsidy.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {subsidy.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-brand-medium">
                      {subsidy.subsidyPercent}%
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Subsidy
                    </p>
                  </div>
                </div>

                <div className="space-y-1 bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-3 mb-3 text-xs">
                  <p className="text-gray-600">
                    Max Limit:{" "}
                    <span className="font-bold text-gray-800">
                      {subsidy.maxAmount}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Farmer Share:{" "}
                    <span className="font-bold text-gray-800">
                      {subsidy.farmerContribution}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {subsidy.eligibilityChips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-650"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Window: {subsidy.window}</span>
                </div>

                {subsidy.extraInfo && (
                  <p className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-xl mb-4 leading-normal">
                    {subsidy.extraInfo}
                  </p>
                )}
              </div>

              <div className="flex gap-2 border-t border-gray-50 pt-3">
                <button
                  className="flex-1 text-[#132a13] bg-[#132a13]/5 text-xs font-bold px-3 py-2 rounded-xl transition hover:bg-[#132a13]/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedScheme(subsidy.id);
                  }}
                >
                  Calculate ROI
                </button>
                <button
                  className="px-4 py-2 rounded-xl border border-brand-medium/20 bg-brand-medium/5 text-brand-medium text-xs font-bold hover:bg-brand-medium/10 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setApplyingSubsidy(subsidy);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ROI Calculator Panel */}
      {selectedSchemeData && (
        <div
          className="rounded-2xl p-6 mb-6 text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, #132a13, #31572c)" }}
        >
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <Calculator className="w-5 h-5 text-[#ecf39e]" />
                Investment ROI Calculator
              </h3>
              <p className="text-white/70 text-xs">
                Simulate your financial returns and payback period for:{" "}
                <span className="font-bold text-white">
                  {selectedSchemeData.name}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/85 block mb-2">
                  Total Project Cost: ₹{investmentAmount.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={investmentAmount}
                  onChange={(e) =>
                    setInvestmentAmount(parseInt(e.target.value))
                  }
                  className="w-full accent-[#ecf39e]"
                />
                <div className="flex justify-between text-white/50 text-[10px] font-bold mt-1">
                  <span>₹0</span>
                  <span>₹50k</span>
                  <span>₹100k</span>
                  <span>₹150k</span>
                  <span>₹200k</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/85 block mb-2">
                  Assumed Subsidy Rate: {selectedSchemeData.subsidyPercent}%
                </label>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-[#ecf39e]"
                    style={{
                      width: `${selectedSchemeData.subsidyPercent}%`,
                    }}
                  ></div>
                </div>
                {selectedSchemeData.extraInfo?.includes("SC") && (
                  <p className="text-[#ecf39e] text-[10px] font-bold mt-1">
                    * Eligible for +10% SC special reservation bonus
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/85 block mb-2">
                  Farmer Category Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFarmerCategory("General")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      farmerCategory === "General"
                        ? "bg-white text-[#132a13]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    onClick={() => setFarmerCategory("SC")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      farmerCategory === "SC"
                        ? "bg-white text-[#132a13]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    SC/ST Category
                  </button>
                </div>
              </div>
            </div>

            {/* Output Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Your Upfront Share
                </p>
                <p className="text-lg font-black text-white mt-1">
                  ₹{calculateFarmerInvestment().toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Estimated Government Subsidy
                </p>
                <p className="text-lg font-black text-[#ecf39e] mt-1">
                  ₹{calculateSubsidyAmount().toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Estimated Payback Period
                </p>
                <p className="text-lg font-black text-white mt-1">
                  {calculatePaybackPeriod()} years
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Estimated Annual Savings
                </p>
                <p className="text-lg font-black text-white mt-1">₹18,000</p>
              </div>
              <div className="bg-brand-medium rounded-xl p-4 col-span-2 shadow-inner border border-[#ecf39e]/20">
                <p className="text-white/90 text-xs font-bold uppercase tracking-wider">
                  5-Year Net Project Return
                </p>
                <p className="text-2xl font-black text-white mt-1 leading-none">
                  ₹{calculateFiveYearBenefit().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* ROI Chart */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-3">
              Cumulative Investment Payback Performance
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={roiData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="year"
                    tick={{
                      fill: "rgba(255,255,255,0.7)",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      color: "#132a13",
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                  />
                  <Legend wrapperStyle={{ color: "white", fontSize: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    fill="rgba(236,243,158,0.25)"
                    stroke="#ecf39e"
                    strokeWidth={2}
                    name="Net Cumulative Cashflow"
                  />
                  <Line
                    type="monotone"
                    dataKey="investment"
                    stroke="#FFD700"
                    strokeWidth={2}
                    name="Annual Savings Benefit"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Subsidy Apply Confirmation Modal */}
      {applyingSubsidy &&
        createPortal(
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
                <button
                  onClick={() => setApplyingSubsidy(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {applySuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                      <Check className="w-8 h-8 text-emerald-600 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Application Logged!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Your subsidy allocation request has been routed to the
                      district review pipeline.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-base font-bold text-[#132a13] mb-1">
                      Confirm Subsidy Application
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Please confirm the capital subsidy request for the
                      following investment:
                    </p>

                    <div className="bg-[#f4f7f4] border border-brand-medium/10 rounded-xl p-3.5 mb-4 space-y-1.5 text-xs">
                      <p className="font-bold text-[#132a13]">
                        {applyingSubsidy.name}
                      </p>
                      <p className="text-gray-650">
                        Department: {applyingSubsidy.department}
                      </p>
                      <p className="text-gray-650">
                        Estimated Government Share:{" "}
                        <span className="font-bold text-[#4f752d]">
                          {applyingSubsidy.maxAmount}
                        </span>
                      </p>
                    </div>

                    <form onSubmit={handleApplySubmit} className="space-y-4">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[10px] text-amber-800 leading-normal font-semibold">
                          Note: You must upload the verified capital invoice in
                          the Document Vault after submission to process the
                          release.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setApplyingSubsidy(null)}
                          className="flex-1 px-4 py-2.5 text-xs font-bold border border-gray-200 rounded-xl text-gray-650 hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2.5 text-xs font-bold bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition"
                        >
                          Confirm Application
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FarmSubsidyCenter;
