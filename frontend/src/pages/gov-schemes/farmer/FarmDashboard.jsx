// pages/FarmDashboard.jsx
import React, { useState } from "react";
import {
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  IndianRupee,
  Clock as ClockIcon,
  CalendarDays,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  X,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const FarmDashboard = () => {
  const {
    farmerProfile,
    kpiCards,
    benefitDistribution,
    trendData,
    aiRecommendedSchemes,
    upcomingActions,
  } = govtSchemeData;

  const [applyScheme, setApplyScheme] = useState(null);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  const iconMap = {
    CheckCircle2: <CheckCircle2 className="text-[#4f772d]" />,
    FileText: <FileText className="text-[#31572c]" />,
    IndianRupee: <IndianRupee className="text-[#132a13]" />,
    Clock: <ClockIcon className="text-[#90a955]" />,
    CalendarDays: <CalendarDays className="text-red-600" />,
    AlertCircle: <AlertCircle className="text-amber-500" />,
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color }} className="mb-0.5">
              {p.name}: ₹{p.value}
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

  const totalBenefitDist = benefitDistribution.reduce((acc, curr) => acc + curr.amount, 0);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setShowApplySuccess(true);
    setTimeout(() => {
      setShowApplySuccess(false);
      setApplyScheme(null);
    }, 2000);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40">
      {/* Branded Header */}
      <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <LayoutDashboard className="h-6 w-6 text-[#4f772d]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#132a13]">
              Welcome back, {farmerProfile.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#4f772d]" />
              <span>{farmerProfile.location}</span>
              <span className="text-gray-300">•</span>
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Last updated: {farmerProfile.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpiCards.map((card) => (
          <StatsCard
            key={card.id}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendType={card.trendType}
            subtext={card.subtext}
            icon={iconMap[card.iconName]}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Benefit Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1">
              Benefit Distribution
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Total: ₹{totalBenefitDist.toLocaleString()} | Hover on segments for details
            </p>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={benefitDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={true}
                  >
                    {benefitDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Detailed Legend Grid below the chart to ensure Machinery Subsidy is 100% visible */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {benefitDistribution.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-md shrink-0 border border-gray-200"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0">
                  <p className="font-bold text-gray-700 truncate leading-none">{entry.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{entry.value}% (₹{entry.amount.toLocaleString()})</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Trend Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="font-bold text-[#132a13] text-sm mb-1">
            Government Support Trend
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Solid: Received | Dashed: Approved | Dotted: Pending
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Received"
                  stroke="#132a13"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Approved"
                  stroke="#4f772d"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Pending"
                  stroke="#90a955"
                  strokeDasharray="2 2"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Schemes and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-[#132a13] mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4f772d]" />
            AI Recommended Schemes
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Based on your profile: SC category, 4.5 acres, drip irrigation, Haryana state
          </p>
          <div className="space-y-4">
            {aiRecommendedSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-[#4f772d]/20 transition-all duration-200"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: scheme.color }}
                      ></div>
                      <h4 className="font-bold text-[#132a13]">{scheme.name}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{scheme.reason}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">
                        Missing: {scheme.missing}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: scheme.color }}
                        >
                          {scheme.match} match
                        </span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${scheme.matchScore}%`,
                              backgroundColor: scheme.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#132a13]">
                      {scheme.benefit}
                    </p>
                    <button
                      onClick={() => setApplyScheme(scheme)}
                      className="mt-3 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 bg-[#4f772d] hover:bg-[#31572c] hover:shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Actions Panel */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-[#132a13] mb-1">Upcoming Actions</h3>
          <p className="text-xs text-gray-400 mb-4">
            Priority tasks to maximize your benefits
          </p>
          <div className="space-y-4">
            {upcomingActions.map((action, idx) => {
              const colorClasses = {
                red: "bg-red-500",
                yellow: "bg-amber-500",
                green: "bg-emerald-500",
              };
              const textColorClasses = {
                red: "text-red-600 bg-red-50 border-red-100",
                yellow: "text-amber-700 bg-amber-50 border-amber-100",
                green: "text-emerald-700 bg-emerald-50 border-emerald-100",
              };
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${colorClasses[action.color]}`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">
                      {action.text}
                    </p>
                    {action.due && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${textColorClasses[action.color]}`}
                      >
                        {action.due}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowActionsModal(true)}
              className="text-xs font-bold text-[#4f772d] hover:text-[#31572c] hover:underline w-full text-center"
            >
              View all pending actions
            </button>
          </div>
        </div>
      </div>

      {/* Apply Now Modal */}
      {applyScheme && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-xl relative my-auto max-h-[85vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setApplyScheme(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {showApplySuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle className="w-8 h-8 text-emerald-600 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Application Initiated!
                </h3>
                <p className="text-xs text-gray-500">
                  Your profile details have been pre-filled. Redirecting to vault...
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-[#132a13] mb-1">
                  Apply for Scheme
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Verify your details below to initiate your application for:
                </p>
                <div className="bg-[#f4f7f4] border border-[#4f772d]/10 rounded-xl p-3.5 mb-4">
                  <p className="text-sm font-bold text-[#132a13]">
                    {applyScheme.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Benefit Value: <span className="font-bold text-[#4f772d]">{applyScheme.benefit}</span>
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Applicant Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                      value={farmerProfile.name}
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                        value={farmerProfile.state}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Land Size (acres)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                        value={farmerProfile.landSize}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyScheme(null)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-[#4f772d] hover:bg-[#31572c] text-white rounded-xl text-xs font-semibold transition"
                    >
                      Submit Details
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Actions Modal */}
      {showActionsModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-xl relative my-auto max-h-[85vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setShowActionsModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#132a13] mb-1">
              All Pending Actions
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Complete these verification items to unlock eligible schemes:
            </p>
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              <div className="flex gap-3 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Aadhaar-Bank Seeding</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Link Aadhaar at your bank branch to unlock PM Kisan installments.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Crop Insurance Sowing Proof</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Upload certified sowing records before June 30 closes.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Caste Certificate Renewal</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">SC Caste Certificate expiring. File for renewal online.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Tractor RC Upload</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Upload Tractor RC to activate machinery subsidy applications.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowActionsModal(false)}
              className="w-full mt-5 px-4 py-2.5 bg-[#132a13] text-white rounded-xl text-xs font-semibold hover:bg-[#31572c] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmDashboard;
