import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Building2,
  Calendar,
  Search,
  Filter,
  XCircle,
  Clock,
  Download,
  Eye,
  MoreVertical,
  ChevronRight,
  BrainCircuit,
  Sliders,
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  PlayCircle,
  Save,
  CheckCircle2,
  BarChart4,
  BarChart3,
  Users,
  Map,
  Award,
  X,
  FileText,
  Loader2,
  PieChart as PieChartIcon, // Kept your alias from the first block
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const GovComplianceAndPolicy = () => {
  const [activeTab, setActiveTab] = useState("compliance");
  const [searchTerm, setSearchTerm] = useState("");
  const [budgetAllocation, setBudgetAllocation] = useState(500);
  const [targetDemographic, setTargetDemographic] = useState("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);

  // From GovPolicyImpact - ADD THESE
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState("all");

  // From GovPolicyCommand
  const policyIntelligenceStats = [
    {
      title: "POLICY EFFECTIVENESS SCORE",
      value: "82/100",
      trend: "+4 pts YoY",
      trendType: "success",
      subtext: "AI composite score",
      icon: <BrainCircuit className="text-[#2e4057]" />,
    },
    {
      title: "RECOMMENDED ADJUSTMENTS",
      value: "3",
      trend: "High priority",
      trendType: "neutral",
      subtext: "Pending executive review",
      icon: <Lightbulb className="text-amber-500" />,
    },
    {
      title: "PROJECTED ROI (FY26)",
      value: "2.4x",
      trend: "+0.2x from FY25",
      trendType: "success",
      subtext: "Economic return on grants",
      icon: <TrendingUp className="text-[#208837]" />,
    },
    {
      title: "AT-RISK METRICS",
      value: "12%",
      trend: "-2% from last quarter",
      trendType: "success",
      subtext: "Key performance indicators",
      icon: <Target className="text-[#28a745]" />,
    },
  ];

  const historicalImpactData = [
    { year: "2022", allocation: 350, impact: 280, baseline: 250 },
    { year: "2023", allocation: 400, impact: 350, baseline: 280 },
    { year: "2024", allocation: 480, impact: 420, baseline: 310 },
    { year: "2025", allocation: 550, impact: 510, baseline: 340 },
    {
      year: "2026 (Proj)",
      allocation: budgetAllocation,
      impact: Math.floor(budgetAllocation * 0.95),
      baseline: 370,
    },
  ];
  const policyData = {
    impactTrends: [
      { quarter: "Q1 2025", farmersReached: 12500, subsidiesDisbursed: 2.8 },
      { quarter: "Q2 2025", farmersReached: 15800, subsidiesDisbursed: 3.2 },
      { quarter: "Q3 2025", farmersReached: 18200, subsidiesDisbursed: 3.8 },
      { quarter: "Q4 2025", farmersReached: 21400, subsidiesDisbursed: 4.2 },
      { quarter: "Q1 2026", farmersReached: 24500, subsidiesDisbursed: 4.8 },
      { quarter: "Q2 2026", farmersReached: 26800, subsidiesDisbursed: 5.2 },
    ],
    schemeWiseImpact: [
      { name: "PM Kisan", beneficiaries: 125000 },
      { name: "PMFBY", beneficiaries: 89000 },
      { name: "PMKSY", beneficiaries: 45000 },
      { name: "PM Kusum", beneficiaries: 28000 },
      { name: "KCC", beneficiaries: 112000 },
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
    regionalImpact: [
      {
        district: "Sonipat",
        farmers: 18500,
        coverage: 72,
        schemesImplemented: 12,
      },
      {
        district: "Panipat",
        farmers: 14200,
        coverage: 65,
        schemesImplemented: 10,
      },
      {
        district: "Karnal",
        farmers: 16800,
        coverage: 78,
        schemesImplemented: 14,
      },
      {
        district: "Rohtak",
        farmers: 12300,
        coverage: 58,
        schemesImplemented: 9,
      },
      {
        district: "Hisar",
        farmers: 15600,
        coverage: 68,
        schemesImplemented: 11,
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

  const regionalColumns = [
    {
      header: "DISTRICT",
      accessor: "district",
      sortable: true,
      cell: (v) => <span className="font-bold text-gray-800">{v}</span>,
    },
    {
      header: "FARMERS",
      accessor: "farmers",
      sortable: true,
      cell: (v) => <span>{v.toLocaleString()}</span>,
    },
    {
      header: "COVERAGE",
      accessor: "coverage",
      sortable: true,
      cell: (v) => <span className="font-medium text-green-600">{v}%</span>,
    },
    { header: "SCHEMES", accessor: "schemesImplemented", sortable: true },
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResults({
        projectedReach: Math.floor(budgetAllocation * 1200),
        estimatedRoi: (budgetAllocation / 200).toFixed(1),
        riskFactor:
          budgetAllocation > 800
            ? "High"
            : budgetAllocation > 500
              ? "Medium"
              : "Low",
        timelineToImpact: "18-24 Months",
      });
    }, 1500);
  };

  const aiInsights = [
    {
      type: "opportunity",
      title: "Reallocate Unused PMFME Funds",
      desc: "Reallocating ₹45 Cr from unused PMFME urban zones to rural infrastructure could increase overall farmer reach by 18%.",
      impact: "High",
    },
    {
      type: "risk",
      title: "Solar Pump Subsidy Bottleneck",
      desc: "Current approval workflow for PM Kusum is causing a 4-month delay. Streamlining documentation could unlock 12,000 pending applications.",
      impact: "Critical",
    },
    {
      type: "success",
      title: "Warehouse Grant Optimization",
      desc: "AIF warehouse grants in Karnal district achieved a 3.2x ROI. Recommend replicating this model in Hisar and Rohtak.",
      impact: "Medium",
    },
  ];

  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    setDownloadProgress(true);
    setTimeout(() => {
      setDownloadProgress(false);
      setShowDownloadModal(false);
      alert("Policy Impact Report downloaded successfully!");
    }, 2000);
  };

  // Mock data for compliance metrics
  const complianceStats = [
    {
      title: "TOTAL AUDITS (FY25)",
      value: "1,248",
      trend: "+15% YoY",
      trendType: "success",
      subtext: "Across 22 districts",
      icon: <ShieldCheck className="text-[#2e4057]" />,
    },
    {
      title: "COMPLIANCE RATE",
      value: "84.5%",
      trend: "+2.3% from Q2",
      trendType: "success",
      subtext: "Scheme implementation",
      icon: <FileCheck className="text-[#208837]" />,
    },
    {
      title: "CRITICAL FINDINGS",
      value: "42",
      trend: "-12% from Q2",
      trendType: "success",
      subtext: "Requires immediate action",
      icon: <AlertTriangle className="text-amber-600" />,
    },
    {
      title: "PENDING RESOLUTIONS",
      value: "156",
      trend: "8 within SLA",
      trendType: "neutral",
      subtext: "Open audit observations",
      icon: <Clock className="text-[#28a745]" />,
    },
  ];

  const auditTrendsData = [
    { month: "Apr", scheduled: 85, completed: 80, findings: 12 },
    { month: "May", scheduled: 95, completed: 92, findings: 15 },
    { month: "Jun", scheduled: 110, completed: 105, findings: 8 },
    { month: "Jul", scheduled: 105, completed: 98, findings: 18 },
    { month: "Aug", scheduled: 120, completed: 115, findings: 14 },
    { month: "Sep", scheduled: 140, completed: 135, findings: 9 },
  ];

  const complianceCategoryData = [
    { name: "Financial Mgt", value: 35 },
    { name: "Scheme Delivery", value: 45 },
    { name: "Infrastructure", value: 15 },
    { name: "Data Accuracy", value: 5 },
  ];
  const COLORS = ["#2e4057", "#208837", "#28a745", "#2ec4b6"];

  const auditLogColumns = [
    {
      header: "AUDIT ID",
      accessor: "auditId",
      sortable: true,
      cell: (val) => <span className="font-bold text-[#2e4057]">{val}</span>,
    },
    {
      header: "DISTRICT / BLOCK",
      accessor: "location",
      sortable: true,
      cell: (val) => <span className="font-medium text-gray-700">{val}</span>,
    },
    {
      header: "SCHEME/PROGRAM",
      accessor: "scheme",
      sortable: true,
    },
    {
      header: "DATE",
      accessor: "date",
      sortable: true,
    },
    {
      header: "STATUS",
      accessor: "status",
      sortable: true,
      cell: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            val === "Completed"
              ? "bg-green-100 text-green-700"
              : val === "In Progress"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      header: "RATING",
      accessor: "rating",
      sortable: true,
      cell: (val) => (
        <div className="flex items-center gap-1">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${val >= 80 ? "bg-green-500" : val >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{val}%</span>
        </div>
      ),
    },
    {
      header: "ACTION",
      accessor: "action",
      cell: () => (
        <button className="p-1 hover:bg-gray-100 rounded text-gray-500 transition">
          <Eye size={16} />
        </button>
      ),
    },
  ];

  const auditLogsData = [
    {
      id: 1,
      auditId: "AUD-2025-089",
      location: "Karnal / Nilokheri",
      scheme: "PMKSY Implementation",
      date: "15 Oct 2025",
      status: "Completed",
      rating: 92,
    },
    {
      id: 2,
      auditId: "AUD-2025-090",
      location: "Sonipat / Ganaur",
      scheme: "AIF Warehouse Grant",
      date: "18 Oct 2025",
      status: "In Progress",
      rating: 65,
    },
    {
      id: 3,
      auditId: "AUD-2025-091",
      location: "Panipat / Samalkha",
      scheme: "PMFBY Claim Settlement",
      date: "22 Oct 2025",
      status: "Scheduled",
      rating: 0,
    },
    {
      id: 4,
      auditId: "AUD-2025-092",
      location: "Hisar / Hansi",
      scheme: "KCC Disbursement",
      date: "25 Oct 2025",
      status: "Completed",
      rating: 78,
    },
    {
      id: 5,
      auditId: "AUD-2025-093",
      location: "Rohtak / Meham",
      scheme: "PM-Kisan Verification",
      date: "28 Oct 2025",
      status: "Completed",
      rating: 88,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#2e4057] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#28a745]" />
            Compliance & Audit Monitoring
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track statutory compliance, audit findings, and scheme
            implementation standards across districts.
          </p>
        </div>
        {/* <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
            <Filter size={16} />
            Filter Audits
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2e4057] text-white rounded-xl text-sm font-bold hover:bg-[#208837] transition">
            <Download size={16} />
            Export Report
          </button>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-3 bg-white p-2 rounded-xl border border-gray-150 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("compliance")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "compliance"
              ? "bg-[#2e4057] text-white"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Compliance Audit
        </button>
        <button
          onClick={() => setActiveTab("policy")}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "policy"
              ? "bg-[#2e4057] text-white"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Policy & Impact
        </button>
      </div>
      {activeTab === "compliance" && (
        <>
          {/* Charts Section - DON'T CHANGE, just move it inside here */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            {/* Audit Completion Trends */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
              <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                <Calendar size={16} />
                Audit Execution Trends (H1 2025)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={auditTrendsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f3f1"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8faf8" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 10, paddingTop: "10px" }}
                    />
                    <Bar
                      dataKey="scheduled"
                      name="Scheduled Audits"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      name="Completed Audits"
                      fill="#28a745"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="findings"
                      name="Critical Findings"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Compliance Categories */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
              <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                <AlertTriangle size={16} />
                Findings by Category
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {complianceCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {complianceCategoryData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      ></div>
                      <span className="text-gray-600 font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Log Table - DON'T CHANGE, just move it inside here */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
            {/* Audit Log Table */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
              <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                <FileCheck size={16} />
                Recent & Upcoming Audits
              </h3>
              <GenericTable
                columns={auditLogColumns}
                data={auditLogsData}
                itemsPerPage={5}
                showSearch={true}
                searchPlaceholder="Search by Audit ID, District or Scheme..."
              />
            </div>
          </div>
        </>
      )}

      {/* POLICY TAB */}
      {activeTab === "policy" && (
        <>
          {/* PASTE FROM GovPolicyCommand.jsx — start from this line: */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulation Engine */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
                <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                  <Sliders size={16} />
                  Policy Parameter Sandbox
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Budget Allocation Simulation (₹ Crores)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="50"
                        value={budgetAllocation}
                        onChange={(e) =>
                          setBudgetAllocation(Number(e.target.value))
                        }
                        className="flex-1 accent-[#28a745]"
                      />
                      <span className="font-bold text-[#2e4057] w-12">
                        ₹{budgetAllocation}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">
                      Target Demographic Focus
                    </label>
                    <select
                      value={targetDemographic}
                      onChange={(e) => setTargetDemographic(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#28a745]"
                    >
                      <option value="all">Universal (All Farmers)</option>
                      <option value="small_marginal">
                        Small & Marginal Farmers
                      </option>
                      <option value="fpo">FPOs & Cooperatives</option>
                      <option value="women">Women Agri-Entrepreneurs</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold text-white flex justify-center items-center gap-2 transition ${
                      isSimulating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#2e4057] hover:bg-[#208837]"
                    }`}
                  >
                    {isSimulating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Running Simulation...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <PlayCircle size={16} />
                        Run AI Simulation
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Simulation Results */}
              {simulationResults && (
                <div className="bg-[#f8faf8] p-5 rounded-2xl border border-[#28a745]/20 shadow-sm animate-scaleUp">
                  <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                    <BarChart4 size={16} />
                    Projected Outcomes
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-xs text-gray-600">
                        Projected Reach
                      </span>
                      <span className="font-bold text-[#2e4057]">
                        {simulationResults.projectedReach.toLocaleString()}{" "}
                        Farmers
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-xs text-gray-600">
                        Estimated Economic ROI
                      </span>
                      <span className="font-bold text-green-600">
                        {simulationResults.estimatedRoi}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-xs text-gray-600">
                        Implementation Risk
                      </span>
                      <span
                        className={`font-bold ${
                          simulationResults.riskFactor === "High"
                            ? "text-red-600"
                            : simulationResults.riskFactor === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {simulationResults.riskFactor}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Timeline to Impact
                      </span>
                      <span className="font-bold text-[#2e4057]">
                        {simulationResults.timelineToImpact}
                      </span>
                    </div>
                    <button className="w-full mt-2 py-2 border border-[#28a745] text-[#28a745] rounded-xl text-xs font-bold hover:bg-[#28a745] hover:text-white transition flex justify-center items-center gap-2">
                      <Save size={14} />
                      Save as Policy Draft
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendations & Charts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
                <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-500" />
                  AI Strategic Recommendations
                </h3>
                <div className="space-y-4">
                  {aiInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-l-4 ${
                        insight.type === "opportunity"
                          ? "border-l-blue-500 bg-blue-50"
                          : insight.type === "risk"
                            ? "border-l-red-500 bg-red-50"
                            : "border-l-green-500 bg-green-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                          {insight.type === "opportunity" && (
                            <TrendingUp size={14} className="text-blue-500" />
                          )}
                          {insight.type === "risk" && (
                            <AlertCircle size={14} className="text-red-500" />
                          )}
                          {insight.type === "success" && (
                            <CheckCircle2
                              size={14}
                              className="text-green-500"
                            />
                          )}
                          {insight.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            insight.impact === "Critical"
                              ? "bg-red-100 text-red-700"
                              : insight.impact === "High"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {insight.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {insight.desc}
                      </p>
                      <button className="mt-3 text-[10px] font-bold text-[#2e4057] hover:text-[#28a745] flex items-center gap-1">
                        Review Detailed Proposal <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
                <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Historical Impact vs Simulated Projection (₹ Crores)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={historicalImpactData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f3f1"
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 10, paddingTop: "10px" }}
                      />
                      <Bar
                        dataKey="allocation"
                        name="Budget Allocation"
                        fill="#94a3b8"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="impact"
                        name="Economic Impact Generated"
                        stroke="#28a745"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="baseline"
                        name="Baseline (Without Intervention)"
                        fill="#f1f3f1"
                        stroke="none"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* PASTE FROM GovPolicyImpact.jsx — start from this line: */}
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impact Trends */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
              <h3 className="font-bold text-[#2e4057] text-sm mb-3 flex items-center gap-2">
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
                      stroke="#2e4057"
                      strokeWidth={2}
                      name="Farmers Reached"
                      dot={{ r: 3 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="subsidiesDisbursed"
                      stroke="#28a745"
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
              <h3 className="font-bold text-[#2e4057] text-sm mb-4 flex items-center gap-2">
                <PieChartIcon size={16} />
                Scheme-wise Beneficiary Distribution
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                  </PieChart>
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
              <h3 className="font-bold text-[#2e4057] text-sm mb-3 flex items-center gap-2">
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
              <h3 className="font-bold text-[#2e4057] text-sm mb-3 flex items-center gap-2">
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
            <h3 className="font-bold text-[#2e4057] text-sm mb-3 flex items-center gap-2">
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
                        className="bg-[#2e4057] h-1.5 rounded-full"
                        style={{ width: `${district.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-bold text-[#2e4057]">
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
              className="flex-1 py-2.5 bg-[#28a745] hover:bg-[#208837] text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Policy Impact Report
            </button>
          </div>

          {/* Download Modal */}
          {showDownloadModal &&
            createPortal(
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
                <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-[#2e4057] flex items-center gap-2 mb-2">
                    <Download className="w-5 h-5 text-[#28a745]" />
                    Download Policy Impact Report
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    Export comprehensive policy impact analysis with
                    district-wise performance.
                  </p>

                  {downloadProgress ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-8 h-8 text-[#28a745] animate-spin mx-auto mb-3" />
                      <p className="text-xs font-bold text-[#2e4057]">
                        Generating report...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleDownloadSubmit} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                          Report Period
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#28a745]">
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
                              className="accent-[#28a745]"
                            />
                            <span className="text-xs">
                              Impact Trends Analysis
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="accent-[#28a745]"
                            />
                            <span className="text-xs">
                              Scheme-wise Performance
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="accent-[#28a745]"
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
                          className="flex-1 py-2 bg-[#28a745] hover:bg-[#208837] text-white rounded-xl text-sm font-medium transition"
                        >
                          Download PDF
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  );
};

export default GovComplianceAndPolicy;
