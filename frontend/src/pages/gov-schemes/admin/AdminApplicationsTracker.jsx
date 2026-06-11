import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FolderCheck,
  Search,
  Filter,
  CheckCircle,
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
} from "lucide-react";

export default function AdminApplicationsTracker() {
  const location = useLocation();
  const autoStartId = location.state?.autoStart;

  // Active view tab: "all" (Active Applications), "disbursements" (Disbursement Logs), "renewals" (Renewals Calendar)
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null); // Selected application for Slide-out Drawer
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [appealAppId, setAppealAppId] = useState(null);

  // Mock initial applications data
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
    },
    {
      id: "APP-2026-003",
      schemeId: "adm-03",
      schemeName: "Agri-Infrastructure Fund (AIF) Subvention",
      submittedDate: "2026-04-12",
      stage: "Approved & Authorized",
      status: "Approved",
      actionRequired: "None - Payout Pending bank linkage clearing",
      deadline: "2026-07-15",
      refNumber: "AIF/2026/CENT-092",
      tranchesPaid: "1/2",
      amountSanctioned: "₹40,00,000",
      timeline: [
        { title: "Application Submitted", date: "2026-04-12", desc: "Infrastructure designs uploaded.", status: "done" },
        { title: "Documents Verified", date: "2026-04-20", desc: "Physical site blueprints verified.", status: "done" },
        { title: "Approved & Signed", date: "2026-05-02", desc: "Interest subvention code AIF-889 validated.", status: "done" },
        { title: "Tranche 1 Disbursed", date: "2026-05-15", desc: "₹20,00,000 processed to bank account.", status: "done" }
      ],
      docs: ["AIF_Blueprint.pdf", "Bank_Sanction_Letter.pdf", "Land_Record_Hry.pdf"]
    },
    {
      id: "APP-2026-002",
      schemeId: "adm-04",
      schemeName: "SIDBI Venture Capital Fund for MSME Agritech",
      submittedDate: "2026-03-20",
      stage: "Rejected",
      status: "Rejected",
      actionRequired: "Appeal before June 15 or re-apply with audited balances",
      deadline: "2026-06-15",
      refNumber: "SIDBI/VC/2026-041",
      tranchesPaid: "0/1",
      amountSanctioned: "₹2,00,000",
      timeline: [
        { title: "Application Submitted", date: "2026-03-20", desc: "Submitted under MSME quota.", status: "done" },
        { title: "Auditing Check Failed", date: "2026-04-05", desc: "Required 3-year turnover audit reports were missing sign-offs.", status: "done" },
        { title: "Rejected", date: "2026-04-06", desc: "Incomplete financial records provided.", status: "failed" }
      ],
      docs: ["MSME_Udyam.pdf", "Turnover_SelfDeclaration.pdf"]
    }
  ]);

  // Handle auto start application redirection from Detail page
  useEffect(() => {
    if (autoStartId) {
      // Create new application or simulate process
      const exist = applications.find(a => a.schemeId === autoStartId);
      if (!exist) {
        const newApp = {
          id: `APP-2026-00${applications.length + 1}`,
          schemeId: autoStartId,
          schemeName: autoStartId === "adm-05" ? "Haryana Agribusiness Export Capital Subsidy" : "Custom Seed Application",
          submittedDate: new Date().toISOString().split("T")[0],
          stage: "Draft Initiated",
          status: "Draft",
          actionRequired: "Complete document uploads and submit to department",
          deadline: "2026-06-25",
          refNumber: "PENDING-SUBMISSION",
          tranchesPaid: "0/1",
          amountSanctioned: "₹50,00,000",
          timeline: [
            { title: "Application Draft Initiated", date: "Just now", desc: "System auto-populated credentials from company profile.", status: "done" },
            { title: "Document Upload Checklist", date: "In Progress", desc: "Awaiting final audit checks and CA signs.", status: "active" }
          ],
          docs: []
        };
        setApplications(prev => [newApp, ...prev]);
        setSelectedApp(newApp);
      } else {
        setSelectedApp(exist);
      }
    }
  }, [autoStartId]);

  const handleAppealSubmit = (e) => {
    e.preventDefault();
    setApplications(prev => prev.map(app => {
      if (app.id === appealAppId) {
        return {
          ...app,
          status: "In Progress",
          stage: "Appeal Under Evaluation",
          actionRequired: "Under Department Re-evaluation",
          timeline: [
            ...app.timeline,
            { title: "Appeal Filed", date: "Just now", desc: `Reason: ${appealReason}`, status: "done" },
            { title: "Department Re-review", date: "In Progress", desc: "Re-evaluating eligibility files.", status: "active" }
          ]
        };
      }
      return app;
    }));
    setShowAppealModal(false);
    setAppealReason("");
    setAppealAppId(null);
  };

  const handleAppealClick = (appId) => {
    setAppealAppId(appId);
    setShowAppealModal(true);
  };

  // Filter application list
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.refNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "action" && app.actionRequired !== "None" && app.status !== "Rejected") ||
      app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Header section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FolderCheck className="w-5 h-5 text-[#28a745]" />
            Applications Tracker
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Monitor submission status, response timelines, and disbursement tranches.
          </p>
        </div>

        {/* Short metrics */}
        <div className="flex gap-2">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center">
            <span className="block text-[8px] font-black uppercase text-amber-800">Action Needed</span>
            <span className="text-sm font-black text-amber-900">2 Requests</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
            <span className="block text-[8px] font-black uppercase text-emerald-800">Approved</span>
            <span className="text-sm font-black text-emerald-900">₹40.0 Lakh</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl border border-gray-150">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "all" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("disbursements")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "disbursements" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Disbursement & Audit Logs
        </button>
        <button
          onClick={() => setActiveTab("renewals")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "renewals" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Periodic Renewals Tab
        </button>
      </div>

      {/* Main Tab 1: Active Applications */}
      {activeTab === "all" && (
        <div className="space-y-5">
          {/* Applications list table */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
            
            {/* Table filters */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by ID, scheme name, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-8 py-2 rounded-xl text-[#2e4057] font-semibold"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 text-xs p-2 rounded-xl text-[#2e4057] font-bold focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Draft">Drafts</option>
                <option value="action">Action Required</option>
              </select>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">App ID / Reference</th>
                    <th className="p-4">Scheme Name</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4">Current Stage</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <tr 
                        key={app.id} 
                        className={`hover:bg-gray-50/70 transition cursor-pointer ${
                          selectedApp?.id === app.id ? "bg-[#f4f7f4]" : ""
                        }`}
                        onClick={() => setSelectedApp(app)}
                      >
                        <td className="p-4">
                          <span className="block font-black text-[#2e4057]">{app.id}</span>
                          <span className="text-[10px] text-gray-400">{app.refNumber}</span>
                        </td>
                        <td className="p-4 max-w-[200px] truncate">
                          <span className="block text-gray-800 uppercase tracking-wide">{app.schemeName}</span>
                        </td>
                        <td className="p-4 text-gray-500">{app.submittedDate}</td>
                        <td className="p-4">
                          <span className="block text-gray-700">{app.stage}</span>
                          {app.actionRequired !== "None" && app.status !== "Rejected" && (
                            <span className="text-[9px] text-amber-700 font-bold block animate-pulse">⚠️ {app.actionRequired}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            app.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : app.status === "Draft"
                              ? "bg-gray-100 text-gray-600 border border-gray-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            {app.status === "Rejected" && (
                              <button
                                onClick={() => handleAppealClick(app.id)}
                                className="text-[10px] font-bold text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition"
                              >
                                Appeal
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="text-[10px] font-bold text-gray-600 hover:text-black border border-gray-200 bg-white px-2 py-1 rounded transition"
                            >
                              Track
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">
                        No applications matching the search queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Selected Application Detail Panel (Below the table) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            {selectedApp ? (
              <div className="space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">Ref: {selectedApp.refNumber}</span>
                    <h3 className="font-black text-sm text-[#2e4057] uppercase tracking-wide leading-tight">
                      {selectedApp.schemeName}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)} 
                    className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg border border-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Sanctioned Amount:</span>
                    <span className="font-black text-[#2e4057]">{selectedApp.amountSanctioned}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Tranches Paid:</span>
                    <span className="font-black text-[#28a745]">{selectedApp.tranchesPaid}</span>
                  </div>
                  {selectedApp.actionRequired !== "None" && (
                    <div className="pt-2 border-t border-gray-150 mt-1">
                      <span className="block text-[9px] text-amber-700 font-extrabold uppercase">Next Action Required</span>
                      <p className="text-xs text-amber-900 font-semibold mt-0.5 leading-relaxed">{selectedApp.actionRequired}</p>
                    </div>
                  )}
                </div>

                {/* Vertical Stepper Timeline */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-gray-400">Application Progress Stepper</h4>
                  
                  <div className="relative pl-6 space-y-5 border-l-2 border-gray-100 ml-2">
                    {selectedApp.timeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Stepper Bullet Emblem */}
                        <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white ${
                          step.status === "done"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                            : step.status === "failed"
                            ? "border-red-500 bg-red-50 text-red-500"
                            : step.status === "active"
                            ? "border-amber-500 bg-amber-50 text-amber-500"
                            : "border-gray-200"
                        }`}>
                          {step.status === "done" && <CheckCircle className="w-2.5 h-2.5 fill-emerald-600 text-white" />}
                          {step.status === "failed" && <XCircle className="w-2.5 h-2.5 fill-red-500 text-white" />}
                          {step.status === "active" && <Clock className="w-2.5 h-2.5 text-amber-500" />}
                        </span>
                        
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-gray-800">{step.title}</span>
                            <span className="text-[9px] text-gray-400 font-semibold">{step.date}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document attachments */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[10px] font-extrabold uppercase text-gray-400">Attached Documents</span>
                  <div className="space-y-1.5">
                    {selectedApp.docs.length > 0 ? (
                      selectedApp.docs.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50/50 border border-gray-100 p-2.5 rounded-xl">
                          <span className="text-xs text-gray-600 font-semibold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            {doc}
                          </span>
                          <button className="text-[9px] font-extrabold text-[#2e4057] hover:underline flex items-center gap-0.5">
                            <Download className="w-3 h-3" /> Get File
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-gray-400 font-semibold">No uploads attached to draft yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FolderCheck className="w-12 h-12 mx-auto text-gray-200 mb-2" />
                <h4 className="text-xs font-black uppercase tracking-wider mb-1">No Application Selected</h4>
                <p className="text-[10px] text-gray-400 font-semibold max-w-[200px] mx-auto">
                  Click on any application record in the tracker sheet to show verification status and progress logs.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Disbursement & Audit Logs */}
      {activeTab === "disbursements" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">Direct Bank Payouts & Audited Tranches</h3>
            <span className="text-[10px] text-[#28a745] font-bold">1 Overdue Audit Notification</span>
          </div>

          {/* Overdue tranche notification */}
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-red-950">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
              <p className="text-xs font-semibold leading-relaxed">
                <span className="font-bold">Overdue Milestone Utilization Certificate:</span> Agri-Infrastructure Fund Tranche 1 (₹20,00,000) requires physical asset audit signs before June 30 to unlock Tranche 2 release.
              </p>
            </div>
            <button className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl transition shrink-0">
              Submit UC Audit
            </button>
          </div>

          {/* Disbursement Table logs */}
          <div className="border border-gray-150 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                  <th className="p-3">Reference</th>
                  <th className="p-3">Beneficiary Account</th>
                  <th className="p-3">Tranche Release</th>
                  <th className="p-3">Amount Paid</th>
                  <th className="p-3">Date Disbursed</th>
                  <th className="p-3">Audit Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                <tr>
                  <td className="p-3">APP-2026-003</td>
                  <td className="p-3 text-gray-600">SBI Corporate Ac-****884</td>
                  <td className="p-3">Tranche 1 (50%)</td>
                  <td className="p-3 font-bold text-[#2e4057]">₹20,00,000</td>
                  <td className="p-3 text-gray-500">2026-05-15</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded border border-emerald-200">
                      Approved & Signed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Periodic Renewals Tab */}
      {activeTab === "renewals" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#28a745]" /> Periodic Filings Calendar
            </h3>
            <span className="text-[10px] text-gray-500 font-semibold">Upcoming deadlines for recurring support benefits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-red-200 bg-red-50/30 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase text-red-700 bg-red-100 px-2.5 py-0.5 rounded">Urgent Renewal</span>
                <span className="text-[10px] text-gray-400 font-bold">June 18</span>
              </div>
              <h4 className="text-xs font-black text-red-950 uppercase tracking-wide">DPIIT Income Tax Exemption</h4>
              <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                Section 80-IAC requires annual turnover certificate verification upload to prevent tax exemption suspension.
              </p>
              <button className="text-[10px] font-bold bg-[#2e4057] hover:bg-[#208837] text-white px-3 py-1.5 rounded-lg transition mt-2">
                Process Renewal
              </button>
            </div>

            <div className="border border-gray-200 p-4 rounded-2xl space-y-2 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">Standard Filing</span>
                <span className="text-[10px] text-gray-400 font-bold">July 15</span>
              </div>
              <h4 className="text-xs font-black text-[#2e4057] uppercase tracking-wide">AIF Loan Subvention Sync</h4>
              <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                Quarterly bank loan ledger sync must be finalized to authorize interest refund codes for Bank of Baroda branch.
              </p>
              <button className="text-[10px] font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg transition mt-2">
                Configure Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Form Modal */}
      {showAppealModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wide text-red-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" /> Appeal Rejected Application
              </h3>
              <button 
                onClick={() => setShowAppealModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAppealSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Application Reference ID</label>
                <input
                  type="text"
                  readOnly
                  value={appealAppId || ""}
                  className="w-full bg-gray-100 border border-gray-200 text-xs px-3 py-2 rounded-xl text-gray-700 font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Appeal Clarification Reason</label>
                <textarea
                  rows="4"
                  placeholder="Provide clarification details regarding turnover audits or missing certificates..."
                  required
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs p-3 rounded-xl text-gray-800 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition flex items-center gap-1"
                >
                  Submit Appeal <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
