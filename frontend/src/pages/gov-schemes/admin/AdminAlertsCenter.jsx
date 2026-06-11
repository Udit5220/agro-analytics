import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  Info,
  ShieldAlert,
  Sliders,
  Check,
  Building,
  Mail,
  UserCheck,
  ChevronRight,
  Trash2,
} from "lucide-react";

export default function AdminAlertsCenter() {
  const navigate = useNavigate();

  // Active view tab: "inbox" (Alert Inbox Feed), "routing" (Alert Route Config)
  const [activeTab, setActiveTab] = useState("inbox");
  const [inboxFilter, setInboxFilter] = useState("all");

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "NTF-981",
      title: "MSME Udyam Credential Gap",
      desc: "Haryana Capital Subsidy profile audit failed. Sync Udyam certificate to prevent matching score degradation.",
      type: "critical",
      category: "Profile Gaps",
      date: "2 Hours ago",
      targetPath: "/module/gov-schemes/admin/profile",
      actionText: "Update Profile"
    },
    {
      id: "NTF-980",
      title: "Utilization Certificate (GFR 12-C) Overdue",
      desc: "Agri-Infrastructure Fund Tranche 1 requires CA audit signs immediately to authorize Tranche 2 release.",
      type: "warning",
      category: "Compliance Deadlines",
      date: "1 Day ago",
      targetPath: "/module/gov-schemes/admin/compliance",
      actionText: "Submit Audit Logs"
    },
    {
      id: "NTF-979",
      title: "Tranche Payout Credit Cleared",
      desc: "SBI Corporate Account credited with ₹20,00,000 for AIF Tranche 1. Receipt validation code REC-104928 active.",
      type: "info",
      category: "Payment Approvals",
      date: "3 Days ago",
      targetPath: "/module/gov-schemes/admin/tracker",
      actionText: "Check Transaction"
    }
  ]);

  // Alert Routing Preferences
  const [routingRules, setRoutingRules] = useState({
    disbursements: "Finance (CFO)",
    renewals: "Operations Manager",
    compliance: "Compliance Auditor",
    profileAlerts: "Operations Manager"
  });

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSnooze = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, date: "Snoozed for 24 hours" };
      }
      return n;
    }));
  };

  const handleRuleChange = (key, value) => {
    setRoutingRules(prev => ({ ...prev, [key]: value }));
  };

  const filteredAlerts = notifications.filter(n => {
    if (inboxFilter === "all") return true;
    return n.type === inboxFilter;
  });

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Header section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#28a745]" />
            Scheme Alerts & Notification Center
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Track urgent deadline alerts, payout validation warnings, profile audits, and route feeds to departments.
          </p>
        </div>

        <span className="text-xs font-bold text-gray-500 bg-white border border-gray-150 px-3 py-1.5 rounded-xl shadow-sm">
          {notifications.length} Pending Notifications
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl border border-gray-150">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "inbox" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Alerts Inbox ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab("routing")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "routing" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Alert Routing Settings
        </button>
      </div>

      {/* Tab 1: Alert Inbox Feed */}
      {activeTab === "inbox" && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Inbox Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-gray-150 shadow-sm flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 mr-2">Filter Level:</span>
            <button
              onClick={() => setInboxFilter("all")}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                inboxFilter === "all" ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setInboxFilter("critical")}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                inboxFilter === "critical" ? "bg-red-50 text-red-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setInboxFilter("warning")}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                inboxFilter === "warning" ? "bg-amber-50 text-amber-700" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Warnings
            </button>
          </div>

          {/* Cards Feed */}
          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((n) => (
                <div
                  key={n.id}
                  className={`bg-white border p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4 transition relative overflow-hidden ${
                    n.type === "critical"
                      ? "border-red-150 bg-red-50/10"
                      : n.type === "warning"
                      ? "border-amber-150 bg-amber-50/10"
                      : "border-gray-150"
                  }`}
                >
                  {/* Left part: icon, title, description */}
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl border ${
                      n.type === "critical"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : n.type === "warning"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {n.type === "critical" && <ShieldAlert className="w-5 h-5" />}
                      {n.type === "warning" && <AlertTriangle className="w-5 h-5" />}
                      {n.type === "info" && <Info className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">{n.date}</span>
                      </div>
                      <h3 className="text-sm font-black text-[#2e4057] uppercase tracking-wide">{n.title}</h3>
                      <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-2xl">{n.desc}</p>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex gap-2 shrink-0 md:self-center">
                    <button
                      onClick={() => handleSnooze(n.id)}
                      className="text-xs font-bold text-gray-500 hover:text-black border border-gray-200 bg-white px-3 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> Snooze
                    </button>
                    
                    <button
                      onClick={() => navigate(n.targetPath)}
                      className="text-xs font-bold text-white bg-[#2e4057] hover:bg-[#208837] px-3 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      {n.actionText} <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDismiss(n.id)}
                      title="Dismiss Alert"
                      className="text-gray-400 hover:text-red-600 border border-gray-200 bg-white p-2 rounded-xl transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-150 p-8 rounded-2xl text-center shadow-sm">
                <CheckCircle className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                <h4 className="text-xs font-black uppercase tracking-wider mb-1 text-gray-800">Clear Alerts Inbox</h4>
                <p className="text-[11px] text-gray-400 font-semibold">No pending warnings. All compliance schedules and MSME credentials synchronized successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Alert Routing preferences */}
      {activeTab === "routing" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 animate-fadeIn">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-1.5">
            <Sliders className="w-4.5 h-4.5 text-[#28a745]" />
            <div>
              <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">Department Notification Rules</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Map government notification alerts to target teams</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-gray-800">Disbursement & Credits</span>
                  <span className="block text-[10px] text-gray-400 font-semibold">Tranche bank transfers payouts</span>
                </div>
                <select
                  value={routingRules.disbursements}
                  onChange={(e) => handleRuleChange("disbursements", e.target.value)}
                  className="bg-white border border-gray-200 text-xs p-2 rounded-xl text-gray-800 font-semibold focus:outline-none"
                >
                  <option value="Finance (CFO)">Finance (CFO)</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Compliance Auditor">Compliance Auditor</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-gray-800">Periodic Scheme Renewals</span>
                  <span className="block text-[10px] text-gray-400 font-semibold">Annual/Quarterly filings alerts</span>
                </div>
                <select
                  value={routingRules.renewals}
                  onChange={(e) => handleRuleChange("renewals", e.target.value)}
                  className="bg-white border border-gray-200 text-xs p-2 rounded-xl text-gray-800 font-semibold focus:outline-none"
                >
                  <option value="Finance (CFO)">Finance (CFO)</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Compliance Auditor">Compliance Auditor</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-gray-800">Utilization & Audit Filings</span>
                  <span className="block text-[10px] text-gray-400 font-semibold">Statutory report templates alerts</span>
                </div>
                <select
                  value={routingRules.compliance}
                  onChange={(e) => handleRuleChange("compliance", e.target.value)}
                  className="bg-white border border-gray-200 text-xs p-2 rounded-xl text-gray-800 font-semibold focus:outline-none"
                >
                  <option value="Finance (CFO)">Finance (CFO)</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Compliance Auditor">Compliance Auditor</option>
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-gray-800">Profile Audit Gaps</span>
                  <span className="block text-[10px] text-gray-400 font-semibold">Missing registration parameters warnings</span>
                </div>
                <select
                  value={routingRules.profileAlerts}
                  onChange={(e) => handleRuleChange("profileAlerts", e.target.value)}
                  className="bg-white border border-gray-200 text-xs p-2 rounded-xl text-gray-800 font-semibold focus:outline-none"
                >
                  <option value="Finance (CFO)">Finance (CFO)</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Compliance Auditor">Compliance Auditor</option>
                </select>
              </div>
            </div>

            <div className="bg-[#f4f7f4] border border-gray-150 rounded-xl p-3.5 flex items-center gap-2 mt-2">
              <Check className="w-4 h-4 text-[#28a745] shrink-0" />
              <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">
                Rules are automatically enforced. Routed alerts will dispatch target SMS messages to the designated coordinator contact phone numbers.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
