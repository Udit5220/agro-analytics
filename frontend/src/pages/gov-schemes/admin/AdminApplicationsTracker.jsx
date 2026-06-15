import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FolderCheck,
  Search,
  Filter,
  CheckCircle,
  Sparkles,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  X,
  FileText,
  Calendar,
  DollarSign,
  Download,
  Send,
  RefreshCw,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  Bookmark,
  ExternalLink,
  BookOpen,
  MousePointer,
  FileSpreadsheet,
  Building,
  Users,
  Eye,
} from "lucide-react";

/*
// --- OLD IMPLEMENTATION COMMENTED OUT ---
export default function AdminApplicationsTracker() {
  const location = useLocation();
  const autoStartId = location.state?.autoStart;

  const [activeTab, setActiveTab] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [appealAppId, setAppealAppId] = useState(null);

  const [applications, setApplications] = useState([
    {
      id: "APP-2026-004",
      schemeId: "adm-01",
      schemeName: "RKVY-RAFTAAR Agritech Incubator Support",
      submittedDate: "2026-05-10",
      stage: "Under Technical Review",
      status: "In Progress",
      actionRequired: "Verification of live telemetry logs with FPO database",
      deadline: "2026-06-18",
      refNumber: "RKVY/2026/HR-8840",
      tranchesPaid: "0/3",
      amountSanctioned: "₹25,00,000",
      timeline: [
        { title: "Application Submitted", date: "2026-05-10 10:14 AM", desc: "Corporate documents and CA logs signed off.", status: "done" },
        { title: "Initial Screen Passed", date: "2026-05-15 02:30 PM", desc: "Eligibility rules validated successfully.", status: "done" },
        { title: "Technical Review Board", date: "In Progress", desc: "Verifying FPO telemetry synchronization.", status: "active" },
        { title: "Disbursement Release", date: "Pending Stage 3", desc: "First tranche of 40% (₹10L) to be authorized.", status: "upcoming" }
      ],
      docs: ["Company PAN.pdf", "GSTR-3B_FY25.pdf", "Agritech_Incubation_Plan.pdf"]
    }
  ]);

  return (
    <div>Old Tracker Component</div>
  );
}
*/

import { getAnalyticsData, saveAnalyticsData, fetchAnalyticsData, syncAnalyticsData } from "./govSchemesHelper";

// --- NEW REDESIGNED OPPORTUNITY TRACKER COMPONENT ---

export default function AdminApplicationsTracker() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeSegment, setActiveSegment] = useState("company");

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchAnalyticsData().then(data => setAnalytics(data)).catch(console.error);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Handle status changes dynamically inside the journey table
  const handleStatusChange = (schemeId, newStatus) => {
    const updated = { ...analytics };
    const scheme = updated.schemes.find((s) => s.id === schemeId);
    if (scheme) {
      scheme.status = newStatus;
      scheme.lastInteraction = new Date().toISOString().split("T")[0];
      if (newStatus === "Applied (Self Reported)") {
        scheme.selfReportedApplied = true;
        // Track self-reported applied event
        const applyEvent = updated.events.find(
          (e) => e.type === "self_reported_applied",
        );
        if (applyEvent) applyEvent.count += 1;
      } else {
        scheme.selfReportedApplied = false;
      }
      syncAnalyticsData(updated).then(data => setAnalytics(data));
      showToast(`Status updated to "${newStatus}" for ${scheme.name}`);
    }
  };

  // Funnel calculations derived from platform data — scoped to active segment
  const segmentSchemes = analytics.schemes.filter(s =>
    activeSegment === "company" ? !s.isFarmerScheme : s.isFarmerScheme
  );
  const matchedSchemesCount = segmentSchemes.length;
  const bookmarkedCount = segmentSchemes.filter((s) => s.bookmarked).length;
  const applyClickedCount = segmentSchemes.reduce(
    (sum, s) => sum + (s.applyClicked || 0),
    0,
  );
  const selfAppliedCount = segmentSchemes.filter(
    (s) => s.selfReportedApplied,
  ).length;

  // Filter schemes inside the table — respects active segment
  const filteredSchemes = analytics.schemes.filter((s) => {
    // Segment filtering
    if (activeSegment === "company" && s.isFarmerScheme) return false;
    if (activeSegment === "farmers" && !s.isFarmerScheme) return false;

    const matchesSearch = s.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Lists
  const mostBookmarked = analytics.schemes
    .filter((s) => s.bookmarked)
    .slice(0, 3);
  const highestApplyIntent = [...analytics.schemes]
    .sort((a, b) => b.applyClicked - a.applyClicked)
    .slice(0, 3);
  const highestConversion = analytics.schemes
    .filter((s) => s.selfReportedApplied)
    .slice(0, 3);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Internal Platform Audit
          </span>
          <h1 className="text-2xl font-black tracking-tight">
            Opportunity Journey Tracker
          </h1>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            {activeSegment === "company"
              ? "Track your company's interaction with government scheme portals — bookmarks, apply clicks, and self-reported submissions."
              : "Monitor how farmers in your network are engaging with government schemes — views, guide opens, bookmarks, and apply clicks."}
            <span className="font-extrabold text-amber-300">
              {" "}
              Note: This tracker records platform activities and does not link
              directly to private government agency backend databases.
            </span>
          </p>
        </div>
      </div>

      {/* Segment Switcher Tab */}
      <div className="bg-white p-2 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveSegment("company")}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 justify-center ${
              activeSegment === "company"
                ? "bg-brand-darkest text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Building className="w-3.5 h-3.5" /> For My Company
          </button>
          <button
            onClick={() => setActiveSegment("farmers")}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 justify-center ${
              activeSegment === "farmers"
                ? "bg-brand-darkest text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> For My Farmers / FPO Users
          </button>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
          {filteredSchemes.length} Schemes Tracked
        </span>
      </div>

      {/* Funnel Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <div className="flex items-center gap-1.5 text-gray-400">
            <FolderCheck className="w-4 h-4 text-brand-medium" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {activeSegment === "company" ? "Matched Schemes" : "Farmer Schemes"}
            </span>
          </div>
          <h3 className="text-xl font-black text-brand-darkest mt-2">
            {matchedSchemesCount} {activeSegment === "company" ? "Opportunities" : "Programs"}
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold mt-1 block">
            {activeSegment === "company" ? "Qualifying business programs" : "Schemes available for farmer network"}
          </span>
        </div>

        {activeSegment === "farmers" && (
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                Total Farmer Views
              </span>
            </div>
            <h3 className="text-xl font-black text-brand-darkest mt-2">
              {segmentSchemes.reduce((sum, s) => sum + (s.viewed || 0), 0)} Views
            </h3>
            <span className="text-[9px] text-gray-500 font-semibold mt-1 block">
              Farmers who viewed these schemes
            </span>
          </div>
        )}

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {activeSegment === "company" ? "Bookmarked" : "Farmer Saves"}
            </span>
          </div>
          <h3 className="text-xl font-black text-brand-darkest mt-2">
            {activeSegment === "company"
              ? `${bookmarkedCount} Saved`
              : `${segmentSchemes.reduce((sum, s) => sum + (s.farmerSavedCount || 0), 0)} Farmer Saves`
            }
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold mt-1 block">
            {activeSegment === "company" ? "Saved to workspace" : "Farmers who saved these schemes"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <div className="flex items-center gap-1.5 text-gray-400">
            <MousePointer className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-wider">
              {activeSegment === "company" ? "Portal Redirections" : "Farmer Apply Clicks"}
            </span>
          </div>
          <h3 className="text-xl font-black text-brand-darkest mt-2">
            {applyClickedCount} {activeSegment === "company" ? "Clicks" : "Farmers"}
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold mt-1 block">
            {activeSegment === "company" ? "External apply clicks logged" : "Farmers who clicked apply"}
          </span>
        </div>

        {activeSegment === "company" && (
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
            <div className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                Self-Reported Applied
              </span>
            </div>
            <h3 className="text-xl font-black text-brand-darkest mt-2">
              {selfAppliedCount} Submissions
            </h3>
            <span className="text-[9px] text-emerald-600 font-bold mt-1 block">
              Self-logged applications
            </span>
          </div>
        )}
      </div>

      {/* Main Table Layout */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-medium" /> Opportunity
            Journey Ledger
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search scheme name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs px-3 py-1.5 rounded-xl text-brand-darkest focus:outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs px-3 py-1.5 rounded-xl text-brand-darkest focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Interested">Interested</option>
              <option value="Researching">Researching</option>
              <option value="Ready To Apply">Ready To Apply</option>
              <option value="Applied (Self Reported)">
                Applied (Self Reported)
              </option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50/50 border-b border-gray-150 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
              {activeSegment === "company" ? (
                <tr>
                  <th className="p-4">Scheme</th>
                  <th className="p-4 text-center">Bookmarked</th>
                  <th className="p-4 text-center">Apply Clicked</th>
                  <th className="p-4 text-center">Last Interaction</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              ) : (
                <tr>
                  <th className="p-4">Scheme</th>
                  <th className="p-4 text-center">Viewed</th>
                  <th className="p-4 text-center">Guide Opened</th>
                  <th className="p-4 text-center">Saved</th>
                  <th className="p-4 text-center">Apply Clicks</th>
                  <th className="p-4 text-center">Last Interaction</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchemes.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/30 font-semibold">
                  <td className="p-4">
                    <p className="font-black text-brand-darkest uppercase">
                      {s.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {s.ministry}
                    </p>
                  </td>

                  {activeSegment === "company" ? (
                    /* ── Company Columns ── */
                    <>
                      <td className="p-4 text-center">
                        {s.bookmarked ? (
                          <Bookmark className="w-4 h-4 text-amber-500 fill-current mx-auto" />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center text-gray-700">
                        {s.applyClicked > 0 ? "Yes" : "-"}
                      </td>
                    </>
                  ) : (
                    /* ── Farmer Columns ── */
                    <>
                      <td className="p-4 text-center">
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          {s.viewed || 0} Farmers
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          {s.guideOpened || 0} Farmers
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-brand-medium/10 text-brand-medium border border-brand-medium/20 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          {s.farmerSavedCount || 0} Farmers
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                          {s.applyClicked || 0} Farmers
                        </span>
                      </td>
                    </>
                  )}

                  <td className="p-4 text-center text-gray-500">
                    {s.lastInteraction}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-xs px-2.5 py-1 rounded-xl text-brand-darkest font-bold focus:outline-none"
                    >
                      <option value="Interested">Interested</option>
                      <option value="Researching">Researching</option>
                      <option value="Ready To Apply">Ready To Apply</option>
                      <option value="Applied (Self Reported)">
                        Applied (Self Reported)
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Intent Analytics & Missed Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Intent Analytics panel */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-medium" /> User Intent
            Analytics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
              <span className="font-black text-brand-darkest uppercase text-[9px] block">
                Top Bookmarked Opportunities
              </span>
              <ul className="space-y-1.5 font-bold text-gray-700">
                {mostBookmarked.map((s, i) => (
                  <li key={i} className="truncate flex justify-between font-semibold">
                    <span>{s.name}</span>
                    <span className="text-gray-400 shrink-0 ml-1">
                      {s.isFarmerScheme ? `(${s.farmerSavedCount || 0} Farmers)` : "(Saved)"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
              <span className="font-black text-brand-darkest uppercase text-[9px] block">
                Highest Apply Intent
              </span>
              <ul className="space-y-1.5 font-bold text-gray-700">
                {highestApplyIntent.map((s, i) => (
                  <li key={i} className="truncate flex justify-between">
                    <span>{s.name}</span>
                    <span className="text-gray-400 shrink-0 ml-1">
                      ({s.applyClicked} clicks)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Missed Opportunity Panel */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 flex flex-col justify-start">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5 shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" /> Missed
            Opportunity Audit Log
          </h3>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar flex-1">
            {analytics.missedOpportunities.map((m, i) => (
              <div
                key={i}
                className="border border-gray-150 rounded-xl p-3 bg-red-50/20 hover:bg-red-50/40 transition text-xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-black text-brand-darkest uppercase truncate pr-2">
                    {m.name}
                  </span>
                  <span className="text-red-700 font-bold shrink-0">
                    {m.potValue}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-red-100/20 flex flex-col gap-1.5 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  <div className="flex justify-between items-center">
                    <span>Expired Date</span>
                    <span className="text-gray-600 font-black">{m.expiredDate}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="shrink-0">Audit Reason</span>
                    <span className="text-red-700 bg-red-100/60 px-2 py-1 rounded text-[8px] font-black break-words block text-left">
                      {m.isFarmerScheme
                        ? `${m.farmerCount} Farmers Missed (${m.reason})`
                        : m.reason}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {analytics.missedOpportunities.length === 0 && (
              <p className="text-gray-400 italic text-[11px] text-center py-4">No missed opportunities recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
