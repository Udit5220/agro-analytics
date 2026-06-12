// src/pages/farmer/FarmApplications.jsx
import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  FileText,
  Calendar,
  IndianRupee,
  User,
  Building2,
  Upload,
  RefreshCw,
  ChevronRight,
  Filter,
  Search,
  Eye,
  FolderOpen,
  X,
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { createPortal } from "react-dom";

const FarmApplications = () => {
  const [sortField, setSortField] = useState("submittedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [viewingApp, setViewingApp] = useState(null);
  const [showReapplyConfirm, setShowReapplyConfirm] = useState(false);
  const [reapplySuccess, setReapplySuccess] = useState(false);

  const { applicationsData } = govtSchemeData;
  const { summaryCards, applicationsList, pipelineStages, rejectionAnalysis } =
    applicationsData;

  const getStatusBadge = (status, statusText, statusColor) => {
    const colorClasses = {
      amber: "bg-amber-50 text-amber-700 border-amber-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-emerald-50 text-emerald-700 border-emerald-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      red: "bg-red-50 text-red-700 border-red-200",
    };

    const icons = {
      action_needed: <AlertCircle className="w-3.5 h-3.5" />,
      in_review: <Clock className="w-3.5 h-3.5" />,
      approved: <CheckCircle className="w-3.5 h-3.5" />,
      active: <CheckCircle className="w-3.5 h-3.5" />,
      recommended: <TrendingUp className="w-3.5 h-3.5" />,
      rejected: <XCircle className="w-3.5 h-3.5" />,
    };

    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 font-semibold ${colorClasses[statusColor] || "bg-gray-50 border-gray-200"}`}
      >
        {icons[status] || icons.in_review}
        {statusText}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredApplications = applicationsList
    .filter((app) => {
      if (
        searchQuery &&
        !app.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedStatus !== "all" && app.status !== selectedStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === "submittedDate") {
        const dateA =
          a.submittedDate === "Not Applied" ? "9999-12-31" : a.submittedDate;
        const dateB =
          b.submittedDate === "Not Applied" ? "9999-12-31" : b.submittedDate;
        return sortDirection === "asc"
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      }
      if (sortField === "benefitAmount") {
        const numA = parseInt(a.benefitAmount.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.benefitAmount.replace(/[^0-9]/g, "")) || 0;
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }
      return 0;
    });

  const handleReapply = () => {
    setShowReapplyConfirm(true);
  };

  const handleReapplySubmit = (e) => {
    e.preventDefault();
    setReapplySuccess(true);
    setTimeout(() => {
      setReapplySuccess(false);
      setShowReapplyConfirm(false);
      alert("Application resubmitted successfully! It is now 'In Review'.");
    }, 1500);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <FolderOpen className="h-5 w-5 text-brand-medium" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">
              My Applications
            </h1>
            <p className="text-xs text-gray-500">
              Track registration progress, approval milestones and benefit
              disbursements
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Submitted
          </p>
          <p className="text-2xl font-black text-gray-900 leading-none">
            {summaryCards.submitted}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Under Review
          </p>
          <p className="text-2xl font-black text-blue-600 leading-none">
            {summaryCards.underReview}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Approved
          </p>
          <p className="text-2xl font-black text-emerald-600 leading-none">
            {summaryCards.approved}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Rejected
          </p>
          <p className="text-2xl font-black text-red-600 leading-none">
            {summaryCards.rejected}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-150 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Benefits Released
          </p>
          <p className="text-2xl font-black text-[#132a13] leading-none">
            {summaryCards.benefitsReleased}
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by scheme name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-medium bg-white shadow-sm"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white shadow-sm focus:outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="action_needed">Action Needed</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="recommended">Recommended</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f7f4]/60 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Scheme Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  App ID
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#132a13]"
                  onClick={() => handleSort("submittedDate")}
                >
                  Submitted Date{" "}
                  {sortField === "submittedDate" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Current Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Expected Approval
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#132a13]"
                  onClick={() => handleSort("benefitAmount")}
                >
                  Benefit Amount{" "}
                  {sortField === "benefitAmount" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-4 py-3 text-xs font-bold text-[#132a13]">
                    {app.schemeName}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                    {app.id}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {app.submittedDate}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {app.currentStage}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {app.expectedApproval}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#132a13]">
                    {app.benefitAmount}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(
                      app.status,
                      app.statusText,
                      app.statusColor,
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setViewingApp(app)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-medium transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Pipeline Visual (Kanban Style) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
          <h3 className="font-bold text-[#132a13] text-sm">
            Application Pipeline Stages
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Process map for active scheme verification
          </p>
        </div>
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {pipelineStages.map((stage, idx) => (
              <div
                key={idx}
                className="w-48 bg-[#f4f7f4]/35 rounded-xl p-3 border border-gray-200/50"
              >
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-[#132a13] uppercase tracking-wider">
                    {stage.name}
                  </p>
                  <span className="text-xs font-bold bg-[#132a13] text-white px-2 py-0.5 rounded-lg">
                    {stage.applications.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {stage.applications.map((appId, appIdx) => {
                    const app = applicationsList.find((a) => a.id === appId);
                    return app ? (
                      <div
                        key={appIdx}
                        className="bg-white border border-gray-150 rounded-lg p-2.5 shadow-sm hover:border-brand-medium cursor-pointer transition-all"
                        onClick={() => setViewingApp(app)}
                      >
                        <p className="text-xs font-bold text-gray-800 leading-tight">
                          {app.schemeName}
                        </p>
                        <p className="text-[10px] text-gray-450 font-mono mt-1">
                          {app.id}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rejection Analysis Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50/60">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-955 text-sm">
              Rejection Analysis
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {rejectionAnalysis.schemeName}
                </p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                  {rejectionAnalysis.applicationId}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Rejection Reason
                </p>
                <p className="text-xs text-red-600 font-medium mt-0.5">
                  {rejectionAnalysis.reason}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Suggested Resolution
                </p>
                <p className="text-xs text-gray-650 mt-0.5">
                  {rejectionAnalysis.suggestedFix}
                </p>
              </div>
            </div>
            <button
              onClick={handleReapply}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all bg-[#132a13] hover:bg-brand-dark hover:shadow-sm shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reapply
            </button>
          </div>
        </div>
      </div>
      {/* Detail View Modal */}
      {viewingApp &&
        createPortal(
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-155 shadow-xl relative animate-scaleUp">
                <button
                  onClick={() => setViewingApp(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-[#132a13] mb-1">
                  Application Details
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">
                  Detailed breakdown of registration status.
                </p>

                <div className="space-y-4">
                  <div className="bg-[#f4f7f4] border border-brand-medium/10 rounded-xl p-3.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Scheme
                    </p>
                    <p className="text-sm font-bold text-[#132a13] mt-0.5">
                      {viewingApp.schemeName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200/50">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                          Application ID
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-755">
                          {viewingApp.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                          Benefit Value
                        </span>
                        <span className="text-xs font-bold text-brand-medium">
                          {viewingApp.benefitAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Progress Log
                    </p>
                    <div className="space-y-3 pl-3 border-l-2 border-gray-150 relative">
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-medium"></div>
                        <p className="text-xs font-bold text-gray-800 font-semibold">
                          Sowing/Land Docs Verified
                        </p>
                        <p className="text-[10px] text-gray-450 mt-0.5">
                          District land records synced with Aadhaar
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-medium"></div>
                        <p className="text-xs font-bold text-gray-800 font-semibold">
                          Current Stage: {viewingApp.currentStage}
                        </p>
                        <p className="text-[10px] text-gray-450 mt-0.5">
                          Expected: {viewingApp.expectedApproval}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-xs font-bold text-gray-400 font-semibold">
                          Final Disbursement
                        </p>
                        <p className="text-[10px] text-gray-350 mt-0.5">
                          Awaiting stage verification approval
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => setViewingApp(null)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-650 hover:bg-gray-50 transition"
                    >
                      Close Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Reapply Confirmation Modal */}
      {showReapplyConfirm &&
        createPortal(
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-155 shadow-xl relative animate-scaleUp">
                <button
                  onClick={() => setShowReapplyConfirm(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-[#132a13] mb-1">
                  Confirm Resubmission
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Would you like to resubmit your application for{" "}
                  <span className="font-bold text-[#132a13]">
                    {rejectionAnalysis.schemeName}
                  </span>
                  ?
                </p>

                <form onSubmit={handleReapplySubmit} className="space-y-4">
                  <div className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl">
                    <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                      By clicking submit, you confirm that you have updated the
                      required{" "}
                      <span className="text-brand-medium">
                        {rejectionAnalysis.missingDocuments}
                      </span>{" "}
                      in your vault.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReapplyConfirm(false)}
                      className="flex-1 px-4 py-2.5 text-xs font-bold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 text-xs font-bold bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition"
                    >
                      Confirm Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FarmApplications;
