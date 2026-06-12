// src/pages/gov-schemes/gov/GovPolicyImpact.jsx
import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  X,
  Eye,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Map,
  Building2,
  Award,
  Target,
  PieChart,
  Filter,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const GovPolicyImpact = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Get policy impact data from JSON or use defaults
  const policyData = govtSchemeData.govPolicyImpactData || {
    impactTrends: [
      {
        quarter: "Q1 2025",
        farmersReached: 12500,
        subsidiesDisbursed: 2.8,
        employmentGenerated: 3200,
      },
      {
        quarter: "Q2 2025",
        farmersReached: 15800,
        subsidiesDisbursed: 3.2,
        employmentGenerated: 4100,
      },
      {
        quarter: "Q3 2025",
        farmersReached: 18200,
        subsidiesDisbursed: 3.8,
        employmentGenerated: 5200,
      },
      {
        quarter: "Q4 2025",
        farmersReached: 21400,
        subsidiesDisbursed: 4.2,
        employmentGenerated: 6800,
      },
      {
        quarter: "Q1 2026",
        farmersReached: 24500,
        subsidiesDisbursed: 4.8,
        employmentGenerated: 8200,
      },
      {
        quarter: "Q2 2026",
        farmersReached: 26800,
        subsidiesDisbursed: 5.2,
        employmentGenerated: 9500,
      },
    ],
    schemeWiseImpact: [
      {
        name: "PM Kisan",
        beneficiaries: 125000,
        disbursed: "₹750 Cr",
        impact: "High",
        color: "#132a13",
      },
      {
        name: "PMFBY",
        beneficiaries: 89000,
        disbursed: "₹420 Cr",
        impact: "High",
        color: "#31572c",
      },
      {
        name: "PMKSY",
        beneficiaries: 45000,
        disbursed: "₹280 Cr",
        impact: "Medium",
        color: "#4f772d",
      },
      {
        name: "PM Kusum",
        beneficiaries: 28000,
        disbursed: "₹190 Cr",
        impact: "Medium",
        color: "#90a955",
      },
      {
        name: "KCC",
        beneficiaries: 112000,
        disbursed: "₹890 Cr",
        impact: "Very High",
        color: "#ecf39e",
      },
    ],
    regionalImpact: [
      {
        district: "Sonipat",
        farmers: 18500,
        coverage: 72,
        schemesImplemented: 12,
        color: "#132a13",
      },
      {
        district: "Panipat",
        farmers: 14200,
        coverage: 65,
        schemesImplemented: 10,
        color: "#31572c",
      },
      {
        district: "Karnal",
        farmers: 16800,
        coverage: 78,
        schemesImplemented: 14,
        color: "#4f772d",
      },
      {
        district: "Rohtak",
        farmers: 12300,
        coverage: 58,
        schemesImplemented: 9,
        color: "#90a955",
      },
      {
        district: "Hisar",
        farmers: 15600,
        coverage: 68,
        schemesImplemented: 11,
        color: "#132a13",
      },
    ],
    policyMetrics: [
      {
        title: "FARMERS REACHED",
        value: "2.68L",
        trend: "+28%",
        trendType: "success",
        subtext: "Last 6 months",
        icon: "Users",
      },
      {
        title: "SUBSIDIES DISBURSED",
        value: "₹5.2 Cr",
        trend: "+18%",
        trendType: "success",
        subtext: "Q2 2026",
        icon: "TrendingUp",
      },
      {
        title: "SCHEMES ACTIVE",
        value: "22",
        trend: "+5 new",
        trendType: "success",
        subtext: "This year",
        icon: "FileText",
      },
      {
        title: "EMPLOYMENT GENERATED",
        value: "9,500",
        trend: "+42%",
        trendType: "success",
        subtext: "Direct+Indirect",
        icon: "Users",
      },
    ],
    impactScorecards: [
      {
        metric: "Income Increase",
        before: "₹2.2L",
        after: "₹3.1L",
        change: "+41%",
        status: "positive",
      },
      {
        metric: "Productivity Gain",
        before: "4.2 tons/ha",
        after: "5.1 tons/ha",
        change: "+21%",
        status: "positive",
      },
      {
        metric: "Input Cost Reduction",
        before: "₹35K",
        after: "₹28K",
        change: "-20%",
        status: "positive",
      },
      {
        metric: "Market Access",
        before: "Local only",
        after: "State+Export",
        change: "Expanded",
        status: "positive",
      },
    ],
    districtRanking: [
      {
        rank: 1,
        district: "Karnal",
        score: 92,
        improvement: "+12%",
        schemes: 14,
      },
      {
        rank: 2,
        district: "Sonipat",
        score: 88,
        improvement: "+8%",
        schemes: 12,
      },
      {
        rank: 3,
        district: "Hisar",
        score: 85,
        improvement: "+10%",
        schemes: 11,
      },
      {
        rank: 4,
        district: "Panipat",
        score: 82,
        improvement: "+7%",
        schemes: 10,
      },
      {
        rank: 5,
        district: "Rohtak",
        score: 78,
        improvement: "+5%",
        schemes: 9,
      },
    ],
  };

  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    setDownloadProgress(true);
    setTimeout(() => {
      setDownloadProgress(false);
      setShowDownloadModal(false);
      alert("Policy Impact Report downloaded successfully!");
    }, 2000);
  };

  const getIcon = (iconName) => {
    const icons = {
      Users: <Users className="text-[#132a13]" />,
      TrendingUp: <TrendingUp className="text-brand-medium" />,
      FileText: <FileText className="text-[#31572c]" />,
      default: <BarChart3 className="text-[#132a13]" />,
    };
    return icons[iconName] || icons.default;
  };

  // Table columns for regional impact
  const regionalColumns = [
    {
      header: "DISTRICT",
      accessor: "district",
      sortable: true,
      cell: (value) => <span className="font-bold text-gray-800">{value}</span>,
    },
    {
      header: "FARMERS",
      accessor: "farmers",
      sortable: true,
      cell: (value) => <span>{value.toLocaleString()}</span>,
    },
    {
      header: "COVERAGE",
      accessor: "coverage",
      sortable: true,
      cell: (value) => (
        <span className="font-medium text-green-600">{value}%</span>
      ),
    },
    {
      header: "SCHEMES",
      accessor: "schemesImplemented",
      sortable: true,
      cell: (value) => <span>{value}</span>,
    },
  ];

  // Colors for pie chart
  const COLORS = ["#132a13", "#31572c", "#4f772d", "#90a955", "#ecf39e"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-medium" />
          Policy Impact Analytics
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor policy effectiveness, track scheme penetration, and analyze
          economic impact across districts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policyData.policyMetrics.map((metric, idx) => (
          <StatsCard
            key={idx}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            trendType={metric.trendType}
            subtext={metric.subtext}
            icon={getIcon(metric.icon)}
          />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Trends */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Policy Impact Trends (Q1 2025 - Q2 2026)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={policyData.impactTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="quarter" tick={{ fontSize: 9 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(val) => `${val / 1000}k`}
                  tick={{ fontSize: 9 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(val) => `₹${val}Cr`}
                  tick={{ fontSize: 9 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="farmersReached"
                  stroke="#132a13"
                  strokeWidth={2}
                  name="Farmers Reached"
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="subsidiesDisbursed"
                  stroke="#4f772d"
                  strokeWidth={2}
                  name="Subsidies (₹ Cr)"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scheme-wise Impact Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <PieChart size={16} />
            Scheme-wise Beneficiary Distribution
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={policyData.schemeWiseImpact}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="beneficiaries"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {policyData.schemeWiseImpact.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} farmers`}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {policyData.schemeWiseImpact.map((scheme, idx) => (
              <div key={idx} className="flex items-center gap-1 text-[9px]">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></div>
                <span>{scheme.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Scorecards & Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Scorecards */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Award size={16} />
            Key Impact Scorecards
          </h3>
          <div className="space-y-3">
            {policyData.impactScorecards.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {item.metric}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 line-through">
                      {item.before}
                    </span>
                    <ArrowRight size={10} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-green-600">
                      {item.after}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.status === "positive"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Impact Table */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Map size={16} />
            Regional Impact Analysis
          </h3>
          <GenericTable
            columns={regionalColumns}
            data={policyData.regionalImpact}
            itemsPerPage={5}
            showSearch={true}
            showSort={true}
            searchPlaceholder="Search district..."
            emptyMessage="No regional data found"
          />
        </div>
      </div>

      {/* District Ranking */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
          <Target size={16} />
          District Performance Ranking
        </h3>
        <div className="space-y-2">
          {policyData.districtRanking.map((district, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="w-8 text-center">
                <span
                  className={`text-sm font-bold ${
                    district.rank === 1
                      ? "text-yellow-500"
                      : district.rank === 2
                        ? "text-gray-400"
                        : district.rank === 3
                          ? "text-orange-500"
                          : "text-gray-500"
                  }`}
                >
                  #{district.rank}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">
                    {district.district}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-xs text-gray-500">
                      {district.schemes} schemes
                    </span>
                    <span className="text-xs font-bold text-green-600">
                      ↑ {district.improvement}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-[#132a13] h-1.5 rounded-full"
                    style={{ width: `${district.score}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-right">
                <span className="text-sm font-bold text-[#132a13]">
                  {district.score}
                </span>
                <span className="text-[8px] text-gray-400">/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDownloadModal(true)}
          className="flex-1 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
        >
          <Download size={16} />
          Download Policy Impact Report
        </button>
        <button className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2">
          <Eye size={16} />
          Preview
        </button>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-brand-medium" />
              Download Policy Impact Report
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Export comprehensive policy impact analysis with district-wise
              performance.
            </p>

            {downloadProgress ? (
              <div className="py-8 text-center">
                <Loader2 className="w-8 h-8 text-brand-medium animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-[#132a13]">
                  Generating report...
                </p>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Report Period
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-medium">
                    <option>FY 2025-26 (Current)</option>
                    <option>FY 2024-25</option>
                    <option>FY 2023-24</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Include Sections
                  </label>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">Impact Trends Analysis</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">Scheme-wise Performance</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">District Rankings</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDownloadModal(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-sm font-medium transition"
                  >
                    Download PDF
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for arrow
const ArrowRight = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default GovPolicyImpact;
