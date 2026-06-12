// src/pages/gov-schemes/fpo/FpoReadiness.jsx
import React, { useState } from "react";
import {
  CheckCircle2,
  Upload,
  X,
  AlertCircle,
  Clock,
  Users,
  Building2,
  Target,
  TrendingUp,
  ShieldAlert,
  Eye,
  AlertTriangle,
  Phone,
  Mail,
  ChevronRight,
  History,
  CircleDollarSign,
  CalendarDays,
  Loader2,
  LayoutDashboard,
  FileCheck,
  Gauge,
  BarChart3,
  UserCheck,
  FileText,
  Landmark,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { FpoUtilizationHeader } from "./FpoHelper";
import StatsCard from "./../../../components/partials/StatsCard";

const FpoReadiness = () => {
  // Extract data from JSON
  const readinessData =
    govtSchemeData.fpoReadinessData || govtSchemeData.fpoOpportunityData;

  const [activeScore, setActiveScore] = useState(readinessData.overall || 84);
  const [missingReqs, setMissingReqs] = useState(
    readinessData.missingRequirements || [],
  );
  const [workflowStages, setWorkflowStages] = useState(
    readinessData.workflowStages || [],
  );
  const [recentActivity, setRecentActivity] = useState(
    readinessData.recentActivity || [],
  );
  const [officerContacts, setOfficerContacts] = useState(
    readinessData.officerContacts || [],
  );
  const [activeTab, setActiveTab] = useState("missing");

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const triggerUploadFlow = (req) => {
    setSelectedReq(req);
    setShowUploadModal(true);
    setUploadFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setUploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploadProgress(true);
    setTimeout(() => {
      setUploadProgress(false);
      setShowUploadModal(false);
      setMissingReqs((prev) =>
        prev.filter((item) => item.name !== selectedReq.name),
      );
      setActiveScore((prev) =>
        Math.min(prev + Math.floor(Math.random() * 8) + 4, 100),
      );

      const newActivity = {
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        action: `${selectedReq.name} uploaded`,
        user: "FPO Manager",
        status: "pending_review",
      };
      setRecentActivity((prev) => [newActivity, ...prev.slice(0, 9)]);

      alert(
        `✅ "${selectedReq.name}" uploaded successfully! Under review by ${selectedReq.assignedTo}.`,
      );
    }, 2000);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Critical":
        return "text-red-600 bg-red-50";
      case "High":
        return "text-orange-600 bg-orange-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Missing: "bg-red-100 text-red-800",
      "Pending Draft": "bg-yellow-100 text-yellow-800",
      Overdue: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      pending: "bg-gray-100 text-gray-800",
      locked: "bg-gray-100 text-gray-500",
      success: "bg-green-100 text-green-800",
      alert: "bg-red-100 text-red-800",
      pending_review: "bg-yellow-100 text-yellow-800",
    };
    return badges[status] || "bg-gray-100 text-gray-600";
  };

  // Calculate totals
  const totalBlockedFunds = missingReqs.reduce((sum, req) => {
    const amount = parseFloat(req.value.replace(/[^0-9.-]+/g, "")) * 10000000;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalOpportunity = readinessData.totalOpportunity || 78000000;
  const unlockedFunds = totalOpportunity - totalBlockedFunds;

  // Stats cards data
  const statsCards = [
    {
      title: "CRITICAL BLOCKERS",
      value: missingReqs
        .filter((r) => r.riskLevel === "Critical")
        .length.toString(),
      trend: "Requires immediate action",
      trendType: "danger",
      subtext: `${missingReqs.length} total requirements pending`,
      icon: <AlertCircle />,
    },
    {
      title: "BLOCKED FUNDS",
      value: `₹${(totalBlockedFunds / 10000000).toFixed(1)} Cr`,
      trend: `${missingReqs.length} items blocking`,
      trendType: "danger",
      subtext: "Funds pending compliance clearance",
      icon: <CircleDollarSign />,
    },
    {
      title: "OFFICERS ASSIGNED",
      value: officerContacts.length.toString(),
      trend: `${officerContacts.length} contacts available`,
      trendType: "success",
      subtext: "Reach out for faster approvals",
      icon: <Users />,
    },
    {
      title: "NEXT DEADLINE",
      value: readinessData.deadlineSummary?.nextDeadline || "20 Jun 2026",
      trend: "Critical deadline approaching",
      trendType: "danger",
      subtext: "Submit before due date",
      icon: <CalendarDays />,
    },
  ];

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Eligibility & Compliance Readiness Center" />

      {/* Main Heading */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-brand-medium" />
          FPO Compliance & Readiness Command Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor compliance checklist, track document submissions, unlock
          blocked funds, and manage officer communications for Sonipat FPO.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => (
          <StatsCard
            key={idx}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendType={card.trendType}
            subtext={card.subtext}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Row 1: FPO Readiness Index & Category Breakdown (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FPO Readiness Index - Circular Dial */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
            <Gauge size={16} />
            FPO Readiness Index
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center h-40 w-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <defs>
                  <linearGradient
                    id="readinessFpoGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#90a955" />
                    <stop offset="100%" stopColor="#132a13" />
                  </linearGradient>
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r="55"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="55"
                  stroke="url(#readinessFpoGrad)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 55}
                  strokeDashoffset={2 * Math.PI * 55 * (1 - activeScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#132a13]">
                  {activeScore}%
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Compliant
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p
                className={`text-sm font-medium ${
                  activeScore >= 85
                    ? "text-green-600"
                    : activeScore >= 70
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {activeScore >= 85
                  ? "Excellent - Ready for all grants"
                  : activeScore >= 70
                    ? "Good - Actions required to unlock full potential"
                    : "Critical - Immediate action required"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {missingReqs.length} requirement
                {missingReqs.length !== 1 ? "s" : ""} pending
              </p>
            </div>
          </div>
        </div>

        {/* Readiness Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
            <BarChart3 size={16} />
            Readiness Category Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={readinessData.components}
                layout="vertical"
                margin={{ left: 10, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                  width={120}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" fill="#4f772d" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Compliance Trend */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
          <TrendingUp size={16} />
          Compliance Trend (Last 6 Months)
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={readinessData.complianceTrend}>
              <defs>
                <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f772d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f772d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#90a955"
                fill="none"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#132a13"
                fill="url(#complianceGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#132a13]"></div> Actual Score
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-[#90a955] border border-dashed"></div>{" "}
            Target (95% by Q3)
          </span>
          <span>📈 +14% improvement YTD</span>
        </div>
      </div>

      {/* Row 3: Risk Assessment & What Unlocks (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment Matrix */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
            <ShieldAlert size={16} />
            Risk Assessment Matrix
          </h3>
          <div className="space-y-4">
            {readinessData.riskAssessment?.map((risk, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-gray-700">{risk.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                      risk.risk === "High"
                        ? "bg-red-100 text-red-700"
                        : risk.risk === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {risk.risk}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${risk.probability}%`,
                      backgroundColor: risk.color,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Blocked: {risk.impact}</span>
                  <span>{risk.probability}% rejection probability</span>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What Full Compliance Unlocks */}
        <div className="bg-gradient-to-br from-[#132a13] to-[#31572c] p-5 rounded-2xl shadow-sm text-white">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <CircleDollarSign size={16} />
            What Full Compliance Unlocks
          </h3>
          <div className="space-y-3">
            {readinessData.whatUnlocks?.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-xl p-3 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white/70">{item.scheme}</p>
                    <p className="text-base font-bold">{item.amount}</p>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded ${
                      item.status === "Blocked"
                        ? "bg-red-500/30 text-red-200"
                        : item.status === "Partially Blocked"
                          ? "bg-yellow-500/30 text-yellow-200"
                          : "bg-green-500/30 text-green-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
            View Full Pipeline <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="border-b border-gray-150 px-5">
          <div className="flex gap-1 overflow-x-auto">
            {[
              {
                id: "missing",
                label: "Missing Requirements",
                icon: FileText,
                count: missingReqs.length,
              },
              {
                id: "workflow",
                label: "Approval Workflow",
                icon: Clock,
                count: workflowStages.filter((s) => s.status === "in_progress")
                  .length,
              },
              {
                id: "activity",
                label: "Recent Activity",
                icon: History,
                count: null,
              },
              {
                id: "contacts",
                label: "Officer Contacts",
                icon: Phone,
                count: officerContacts.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-[#132a13]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? "bg-[#132a13] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#132a13] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* Missing Requirements Tab */}
          {activeTab === "missing" && (
            <div className="space-y-3">
              {missingReqs.map((req, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-150 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-bold text-gray-900">{req.name}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRiskColor(req.riskLevel)}`}
                        >
                          {req.riskLevel}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusBadge(req.status)}`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{req.impact}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-500">
                        <div>
                          <span className="font-medium">Value at Risk:</span>{" "}
                          {req.value}
                        </div>
                        <div>
                          <span className="font-medium">Assigned To:</span>{" "}
                          {req.assignedTo}
                        </div>
                        <div>
                          <span className="font-medium">Last Filed:</span>{" "}
                          {req.lastFiled}
                        </div>
                        {req.submissionDeadline && (
                          <div>
                            <span className="font-medium">Deadline:</span>{" "}
                            {req.submissionDeadline}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => triggerUploadFlow(req)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-2 border border-brand-medium text-brand-medium rounded-lg hover:bg-brand-medium/5 transition"
                      >
                        <Upload size={14} />
                        Upload
                      </button>
                      <button className="flex items-center gap-1 text-xs font-bold px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {missingReqs.length === 0 && (
                <div className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    All requirements met! Your FPO is fully compliant.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ready to apply for ₹{totalOpportunity / 10000000} Cr in
                    opportunities
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Workflow Tab */}
          {activeTab === "workflow" && (
            <div className="space-y-0">
              {workflowStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 pb-6 ${idx !== workflowStages.length - 1 ? "border-l-2 border-gray-200 ml-4" : ""}`}
                >
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stage.status === "completed"
                        ? "bg-green-500"
                        : stage.status === "in_progress"
                          ? "bg-blue-500"
                          : stage.status === "locked"
                            ? "bg-gray-400"
                            : "bg-gray-200"
                    }`}
                  >
                    {stage.status === "completed" ? (
                      <CheckCircle2 size={16} className="text-white" />
                    ) : stage.status === "in_progress" ? (
                      <Loader2 size={16} className="text-white animate-spin" />
                    ) : (
                      <Clock size={14} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <h4 className="font-bold text-gray-900">{stage.stage}</h4>
                      <div className="flex gap-3 text-xs text-gray-500">
                        {stage.date && <span>Started: {stage.date}</span>}
                        {stage.daysSpent > 0 && (
                          <span>Days spent: {stage.daysSpent}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Assigned to: {stage.assignedTo}
                    </p>
                    {stage.comments && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        {stage.comments}
                      </p>
                    )}
                    {stage.status === "in_progress" && (
                      <button className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1">
                        Track Progress <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "alert"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <span className="text-xs text-gray-400">
                          {activity.date}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                          By: {activity.user}
                        </p>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full ${getStatusBadge(activity.status)}`}
                        >
                          {activity.status === "pending_review"
                            ? "Pending Review"
                            : activity.status === "success"
                              ? "Completed"
                              : activity.status === "alert"
                                ? "Action Required"
                                : activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          )}

          {/* Officer Contacts Tab */}
          {activeTab === "contacts" && (
            <div className="space-y-3">
              {officerContacts.map((officer, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-150 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#132a13]/10 flex items-center justify-center flex-shrink-0">
                        <Landmark size={18} className="text-[#132a13]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {officer.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {officer.designation}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Jurisdiction: {officer.jurisdiction}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
                        <Phone size={12} />
                        {officer.phone}
                      </button>
                      <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                        <Mail size={12} />
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#132a13] flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-brand-medium" />
              Upload {selectedReq.name}
            </h2>

            <div className="bg-amber-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-amber-800">
                <span className="font-bold">Impact if missing:</span>{" "}
                {selectedReq.impact} ({selectedReq.value})
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Required format: {selectedReq.requiredFormat}
              </p>
            </div>

            {uploadProgress ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-brand-medium animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">
                  Verifying document...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Checking signatures and metadata
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                    dragActive
                      ? "border-brand-medium bg-brand-medium/5"
                      : "border-gray-250 hover:border-gray-300"
                  }`}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {uploadFile
                      ? uploadFile.name
                      : "Drag and drop your file here, or click to browse"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
                    Supports PDF, DOCX, JPEG up to 10MB
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-2.5 border border-gray-250 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFile}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                      uploadFile
                        ? "bg-brand-medium hover:bg-brand-dark text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit Document
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

export default FpoReadiness;
