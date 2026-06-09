// src/pages/farmer/FarmCropInsurance.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Shield,
  Wheat,
  Leaf,
  IndianRupee,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Droplet,
  Sun,
  Bug,
  Waves,
  FileText,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import StatsCard from "../../../components/partials/StatsCard";

const FarmCropInsurance = () => {
  const { cropInsuranceData } = govtSchemeData;
  const {
    overviewCards,
    coverageCards,
    coverageByCrop,
    premiumVsClaims,
    monthlyClaimsTrend,
    claimTracker,
    riskIntelligence,
  } = cropInsuranceData;

  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const COLORS = ["#132a13", "#31572c", "#4f772d", "#90a955"];

  const getRiskIcon = (riskName) => {
    switch (riskName) {
      case "Flood Risk":
        return <Waves className="w-4 h-4 shrink-0" />;
      case "Drought Risk":
        return <Droplet className="w-4 h-4 shrink-0" />;
      case "Heat Stress":
        return <Sun className="w-4 h-4 shrink-0" />;
      case "Pest Alert":
        return <Bug className="w-4 h-4 shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 shrink-0" />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-50 border-red-100";
      case "Moderate":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Low":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-150";
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Active") {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    } else if (status === "Claim Settled") {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          <CheckCircle className="w-3 h-3" />
          Claim Settled
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          <Clock className="w-3 h-3" />
          {status}
        </span>
      );
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color }} className="mb-0.5">
              {p.name}: ₹{p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p>Share: {data.value}%</p>
          <p>Amount: ₹{data.amount.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-[#4f772d]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">Crop Insurance Hub</h1>
            <p className="text-xs text-gray-500">Manage PMFBY crop insurance policies, premium records, and track active claim statuses</p>
          </div>
        </div>
      </div>

      {/* Insurance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          title="Insured Crops"
          value={overviewCards.insuredCrops}
          icon={<Wheat className="text-[#4f772d]" />}
          subtext="Wheat + Rice + Cane"
        />
        <StatsCard
          title="Coverage Value"
          value={overviewCards.coverageValue}
          icon={<ShieldCheck className="text-[#4f772d]" />}
          subtext="Total sum assured"
        />
        <StatsCard
          title="Premium Paid"
          value={overviewCards.premiumPaid}
          icon={<IndianRupee className="text-[#4f772d]" />}
          subtext="Kharif + Rabi total"
        />
        <StatsCard
          title="Claims Submitted"
          value={overviewCards.claimsSubmitted}
          icon={<FileText className="text-[#4f772d]" />}
          subtext="1 Claim Settled"
        />
        <StatsCard
          title="Claims Paid"
          value={overviewCards.claimsApproved}
          icon={<CheckCircle className="text-emerald-500" />}
          subtext={`Amount: ${overviewCards.claimsAmount}`}
        />
      </div>

      {/* Coverage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {coverageCards.map((crop, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden hover:shadow-md hover:border-[#4f772d]/15 transition-all duration-200"
          >
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    {crop.crop === "Wheat" ? (
                      <Wheat className="w-5 h-5 text-[#90a955]" />
                    ) : (
                      <Leaf className="w-5 h-5 text-[#4f772d]" />
                    )}
                    <div>
                      <h3 className="font-bold text-[#132a13] text-sm leading-tight">
                        {crop.crop}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{crop.season}</p>
                    </div>
                  </div>
                  {getStatusBadge(crop.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 bg-[#f4f7f4]/45 border border-gray-50 rounded-xl p-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sum Insured</p>
                    <p className="font-bold text-gray-800 mt-0.5">
                      {crop.sumInsured}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmer Premium</p>
                    <p className="font-bold text-gray-850 mt-0.5">
                      {crop.premium}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Coverage Period: {crop.seasonPeriod}</span>
                  </div>
                </div>

                {crop.claimAmount && (
                  <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="text-xs text-emerald-700 font-bold">
                      Claim Settled: {crop.claimAmount}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPolicy(crop)}
                className="mt-4 w-full py-2 rounded-xl text-xs font-bold transition border border-gray-200 text-gray-650 hover:border-[#4f772d] hover:text-[#4f772d]"
              >
                View Policy details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Donut Chart - Coverage by Crop */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4">
          <h3 className="font-bold text-[#132a13] text-sm mb-2">Coverage by Crop</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageByCrop}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {coverageByCrop.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Premium vs Claims */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4">
          <h3 className="font-bold text-[#132a13] text-sm mb-2">
            Historical Premium vs Claims
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={premiumVsClaims}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="premium"
                  stroke="#132a13"
                  strokeWidth={2}
                  name="Premium Paid"
                />
                <Line
                  type="monotone"
                  dataKey="claims"
                  stroke="#4f772d"
                  strokeWidth={2}
                  name="Claims Received"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Monthly Claims Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4">
          <h3 className="font-bold text-[#132a13] text-sm mb-1">
            Monthly Claim Filing Trend
          </h3>
          <p className="text-[10px] text-gray-400 mb-2">Sonipat District historical records</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyClaimsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="claims" fill="#31572c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Claim Tracker Timeline Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
          <h3 className="font-bold text-[#132a13] text-sm">Active Claim Tracker</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Reference ID: {claimTracker.claimId} | Crop: {claimTracker.crop} ({claimTracker.season})
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="space-y-1 text-xs text-gray-650">
              <p>
                Filed Date: <span className="font-bold text-gray-805">{claimTracker.filedDate}</span>
              </p>
              <p>
                Cause of Damage: <span className="font-bold text-gray-805">{claimTracker.cause}</span>
              </p>
              <p>
                Estimated Compensation Payout: <span className="font-bold text-[#132a13]">{claimTracker.compensation}</span>
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between">
              {claimTracker.timeline.map((step, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center border z-10 relative ${
                        step.status === "completed"
                          ? "bg-[#4f772d] border-[#4f772d] text-white"
                          : "bg-gray-100 border-gray-200 text-gray-400"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    {idx < claimTracker.timeline.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${
                          step.status === "completed"
                            ? "bg-[#4f772d]"
                            : "bg-gray-250"
                        }`}
                      ></div>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-gray-700 mt-2">
                    {step.stage}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{step.date || "Pending"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Intelligence Map Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4f772d]" />
            <h3 className="font-bold text-[#132a13] text-sm">
              Geo-Risk Intelligence Matrix
            </h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Region: {riskIntelligence.district}, Haryana - Satellite Meteorological Feed
          </p>
        </div>
        <div className="p-6">
          {/* Card-Based Risk Visualization */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {riskIntelligence.risks.map((risk, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${getRiskColor(risk.level)}`}
              >
                <div className="p-1.5 bg-white/55 rounded-lg">
                  {getRiskIcon(risk.name)}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">{risk.name}</p>
                  <p className="text-sm font-bold mt-0.5">{risk.level}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations Callout */}
          <div className="bg-[#f4f7f4] border border-[#4f772d]/10 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-[#132a13] mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#4f772d]" />
              Agronomic Safety Recommendations
            </h4>
            <div className="space-y-2">
              {riskIntelligence.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4f772d] mt-1.5 shrink-0"></div>
                  <p className="leading-relaxed font-semibold">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Policy Detail Modal */}
      {selectedPolicy && createPortal(
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
              <button
                onClick={() => setSelectedPolicy(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-[#132a13] mb-1">
                Insurance Policy details
              </h3>
              <p className="text-xs text-gray-500 mb-4 font-bold">
                PMFBY Policy Reference
              </p>

              <div className="space-y-4">
                <div className="bg-[#f4f7f4] border border-[#4f772d]/10 rounded-xl p-4 space-y-2 text-xs">
                  <p className="font-bold text-[#132a13]">Crop Category: <span className="font-black text-[#4f772d]">{selectedPolicy.crop}</span></p>
                  <p className="text-gray-600">Season coverage: <span className="font-semibold">{selectedPolicy.season}</span></p>
                  <p className="text-gray-600">Sum Insured: <span className="font-bold text-gray-800">{selectedPolicy.sumInsured}</span></p>
                  <p className="text-gray-600 font-mono">Policy ID: PMFBY-{selectedPolicy.crop.toUpperCase()}-2026-00412</p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-xs space-y-1.5">
                  <p className="font-bold text-gray-700">Detailed Terms & Clauses:</p>
                  <p className="text-gray-500">1. Coverage applies to yield losses caused by storm, hail, inundation, pests, and local droughts.</p>
                  <p className="text-gray-500">2. Losses must be reported to the village Patwari or agricultural office within 72 hours of damage occurrence.</p>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setSelectedPolicy(null)}
                    className="px-4 py-2 bg-[#132a13] text-white rounded-xl text-xs font-semibold hover:bg-[#31572c] transition-all"
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FarmCropInsurance;
