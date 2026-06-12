import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
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
  Bookmark,
  Sparkles,
  Info,
  ShieldCheck,
  Check,
  Megaphone,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";
import { getAnalyticsData, saveAnalyticsData } from "./govSchemesHelper";

/*
// --- OLD ALERTS CENTER COMPONENT COMMENTED OUT ---
export default function AdminAlertsCenter() {
  return (
    <div>Old Alerts Center Code</div>
  );
}
*/

// --- NEW REDESIGNED ALERTS & UPDATE CENTER COMPONENT ---

export default function AdminAlertsCenter() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [toastMessage, setToastMessage] = useState("");
  const [dismissedCount, setDismissedCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  // Routing preferences configuration states
  const [routing, setRouting] = useState({
    deadlines: { mgmt: true, finance: true, comp: true, ops: true },
    compliance: { mgmt: false, finance: true, comp: true, ops: false },
    guidelines: { mgmt: true, finance: false, comp: true, ops: true },
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDismissAlert = (alertId) => {
    const updated = { ...analytics };
    updated.alerts = updated.alerts.filter((a) => a.id !== alertId);
    saveAnalyticsData(updated);
    setAnalytics(updated);
    setDismissedCount((prev) => prev + 1);
    showToast("Alert dismissed from dashboard feed.");
  };

  const handleMarkAllRead = () => {
    const updated = { ...analytics };
    updated.alerts.forEach((a) => {
      a.read = true;
    });
    saveAnalyticsData(updated);
    setAnalytics(updated);
    showToast("All alerts marked as read.");
  };

  const handleToggleRouting = (cat, team) => {
    setRouting((prev) => {
      const updatedCat = { ...prev[cat], [team]: !prev[cat][team] };
      showToast("Alert routing criteria updated!");
      return { ...prev, [cat]: updatedCat };
    });
  };

  // Metric aggregates
  const unreadAlertsCount = analytics.alerts.filter((a) => !a.read).length;
  const criticalCount = analytics.alerts.filter(
    (a) => a.priority === "Critical",
  ).length;
  const companySchemes = analytics.schemes.filter((s) => !s.isFarmerScheme);
  const upcomingDeadlinesCount = companySchemes.filter(
    (s) => s.daysLeft <= 30,
  ).length;

  const filteredAlerts = analytics.alerts.filter(
    (a) => activeCategory === "all" || a.category === activeCategory,
  );

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative font-semibold">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Government Communications Feed
          </span>
          <h1 className="text-2xl font-black tracking-tight">
            Alerts & Government Update Center
          </h1>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Monitor public circular updates, customize internal recipient
            alerts, and inspect critical program deadline notifications.
          </p>
        </div>
      </div>

      {/* Alert Analytics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
            Unread Alerts
          </p>
          <h3 className="text-xl font-black text-brand-darkest mt-1.5">
            {unreadAlertsCount} Alerts
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold block mt-1">
            Inbox notifications
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
            Critical Alerts
          </p>
          <h3 className="text-xl font-black text-red-600 mt-1.5">
            {criticalCount} Critical
          </h3>
          <span className="text-[9px] text-red-500 font-bold block mt-1">
            Action required
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
            Resolved Alerts
          </p>
          <h3 className="text-xl font-black text-brand-darkest mt-1.5">
            {dismissedCount} Resolved
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold block mt-1">
            Dismissed this session
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">
            Upcoming Deadlines
          </p>
          <h3 className="text-xl font-black text-brand-darkest mt-1.5">
            {upcomingDeadlinesCount} Deadlines
          </h3>
          <span className="text-[9px] text-gray-500 font-semibold block mt-1">
            Matched schemes list
          </span>
        </div>
      </div>

      {/* Critical Alerts & Updates Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Critical Alerts Inbox */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-brand-medium" /> Critical Alerts
              Inbox
            </h3>
            {unreadAlertsCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-black text-brand-medium hover:underline uppercase tracking-wider"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Sub category tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-[10px] font-bold gap-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-1 py-1.5 rounded-lg transition ${activeCategory === "all" ? "bg-brand-darkest text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              All ({analytics.alerts.length})
            </button>
            <button
              onClick={() => setActiveCategory("opportunity")}
              className={`flex-1 py-1.5 rounded-lg transition ${activeCategory === "opportunity" ? "bg-brand-darkest text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Opportunity (
              {
                analytics.alerts.filter((a) => a.category === "opportunity")
                  .length
              }
              )
            </button>
            <button
              onClick={() => setActiveCategory("readiness")}
              className={`flex-1 py-1.5 rounded-lg transition ${activeCategory === "readiness" ? "bg-brand-darkest text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Readiness (
              {
                analytics.alerts.filter((a) => a.category === "readiness")
                  .length
              }
              )
            </button>
            <button
              onClick={() => setActiveCategory("farmer_interest")}
              className={`flex-1 py-1.5 rounded-lg transition ${activeCategory === "farmer_interest" ? "bg-brand-darkest text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              Farmer Interest (
              {
                analytics.alerts.filter((a) => a.category === "farmer_interest")
                  .length
              }
              )
            </button>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 border rounded-2xl flex justify-between items-start gap-4 transition text-xs font-semibold ${
                    !a.read
                      ? "bg-amber-50/20 border-amber-200"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="mt-0.5">
                      {a.priority === "Critical" ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      ) : a.priority === "Warning" ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-brand-darkest uppercase">
                          {a.title}
                        </span>
                        <span
                          className={`text-[8px] font-black uppercase px-2 py-0.2 rounded ${
                            a.priority === "Critical"
                              ? "bg-red-100 text-red-800"
                              : a.priority === "Warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {a.priority}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {a.type} • {a.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismissAlert(a.id)}
                    className="text-gray-400 hover:text-gray-700 transition shrink-0 p-1"
                    title="Dismiss Alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <ShieldCheck className="w-8 h-8 mx-auto text-gray-200 mb-2" />
                <p className="text-[11px] font-bold">
                  No active warnings or unread updates in this category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Public Updates Feed */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-brand-medium" /> Government
              Updates Feed
            </h3>
            <span className="text-[8px] text-gray-400 font-bold uppercase block mt-1">
              Sourced from public circulars & gazettes
            </span>
          </div>

          <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
            {analytics.updates.map((u) => (
              <div
                key={u.id}
                className="border-b border-gray-100 pb-3 space-y-1.5 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-brand-darkest text-white px-2 py-0.5 rounded">
                    {u.type}
                  </span>
                  <span className="text-[9px] text-gray-400">{u.date}</span>
                </div>
                <h4 className="font-black text-brand-darkest uppercase tracking-wide">
                  {u.title}
                </h4>
                <p className="text-gray-600 text-[11px] font-semibold">
                  {u.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Routing Configuration */}
      {/* <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-brand-medium" /> Alert Routing Configuration
        </h3>

        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Select checkbox items to route matched notification alerts dynamically to specific internal corporate coordinates:
        </p>
        <p className="text-[10px] text-gray-400 italic font-semibold mt-1">
          * Note: Alert routing parameters are configured and executed strictly within your company organization (AgroIndia platform). No notifications are dispatched to government department portals, offices, or ministry administrators.
        </p>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border border-gray-100 rounded-xl overflow-hidden font-semibold">
            <thead className="bg-gray-50/50 text-[9px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-150">
              <tr>
                <th className="p-3">Category Type</th>
                <th className="p-3 text-center">Management</th>
                <th className="p-3 text-center">Finance Team</th>
                <th className="p-3 text-center">Compliance Team</th>
                <th className="p-3 text-center">Operations Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              <tr>
                <td className="p-3 font-bold text-brand-darkest">Deadlines Closing Soon</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.deadlines.mgmt} onChange={() => handleToggleRouting("deadlines", "mgmt")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.deadlines.finance} onChange={() => handleToggleRouting("deadlines", "finance")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.deadlines.comp} onChange={() => handleToggleRouting("deadlines", "comp")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.deadlines.ops} onChange={() => handleToggleRouting("deadlines", "ops")} />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-darkest">Document Expirations</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.compliance.mgmt} onChange={() => handleToggleRouting("compliance", "mgmt")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.compliance.finance} onChange={() => handleToggleRouting("compliance", "finance")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.compliance.comp} onChange={() => handleToggleRouting("compliance", "comp")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.compliance.ops} onChange={() => handleToggleRouting("compliance", "ops")} />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-brand-darkest">Guideline Updates</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.guidelines.mgmt} onChange={() => handleToggleRouting("guidelines", "mgmt")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.guidelines.finance} onChange={() => handleToggleRouting("guidelines", "finance")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.guidelines.comp} onChange={() => handleToggleRouting("guidelines", "comp")} />
                </td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={routing.guidelines.ops} onChange={() => handleToggleRouting("guidelines", "ops")} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
