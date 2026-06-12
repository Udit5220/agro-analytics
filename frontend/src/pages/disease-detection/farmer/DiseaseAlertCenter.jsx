import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  Bell,
  AlertTriangle,
  Activity,
  CheckCircle,
  Calendar,
  Shield,
  Trash2,
  Map,
  Eye,
  Clock,
  X,
  PlusCircle,
  Check,
} from "lucide-react";
import seededData from "../../../seed-json/seededData.json";
import StatsCard from "../../../components/partials/StatsCard";

export default function DiseaseAlertCenter() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // all, pending, resolved
  const [sourceFilter, setSourceFilter] = useState("all");
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null); // For "View Disease" modal
  const [toastMessage, setToastMessage] = useState("");

  // Initialize and load alerts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("diseaseAlerts");
    const defaultAlerts = seededData?.diseaseDetection?.alerts || [];
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch (e) {
        setAlerts(defaultAlerts);
      }
    } else {
      localStorage.setItem("diseaseAlerts", JSON.stringify(defaultAlerts));
      setAlerts(defaultAlerts);
    }
  }, []);

  const saveAlerts = (updated) => {
    setAlerts(updated);
    localStorage.setItem("diseaseAlerts", JSON.stringify(updated));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDismiss = (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    saveAlerts(updated);
    showToast("Alert dismissed successfully.");
  };

  const handleResolve = (id) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, resolved: true } : a,
    );
    saveAlerts(updated);
    showToast("Alert marked as resolved.");

    // Also save a treatment record dynamically to show data flow
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      const storedTreatments = localStorage.getItem("treatmentHistory") || "[]";
      try {
        const list = JSON.parse(storedTreatments);
        list.push({
          id: `tr-${Date.now()}`,
          crop: alert.crop,
          disease: alert.disease,
          date: new Date().toISOString().split("T")[0],
          outcome: "Resolved via Alert Center control panel",
          severity: alert.severity,
          method: "Preventive Spray",
        });
        localStorage.setItem("treatmentHistory", JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleScheduleSpray = (alert) => {
    const storedReminders = localStorage.getItem("activeReminders") || "[]";
    try {
      const list = JSON.parse(storedReminders);
      const isExist = list.some(
        (r) => r.disease === alert.disease && !r.completed,
      );
      if (isExist) {
        showToast(`Spray operation already scheduled for ${alert.disease}.`);
        return;
      }

      const newReminder = {
        id: `rem-${Date.now()}`,
        crop: alert.crop,
        disease: alert.disease,
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 3 days from now
        completed: false,
        windLimit: "12 km/h",
        weatherCondition: "Favorable",
      };
      list.push(newReminder);
      localStorage.setItem("activeReminders", JSON.stringify(list));
      showToast(
        `Spray reminder scheduled for ${alert.crop} — ${alert.disease}.`,
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Compute analytics from localStorage alerts state
  const totalAlertsCount = alerts.length;
  const criticalCount = alerts.filter(
    (a) => a.severity === "Critical" && !a.resolved,
  ).length;
  const pendingCount = alerts.filter((a) => !a.resolved).length;
  const resolvedCount = alerts.filter((a) => a.resolved).length;

  // Filter logic
  const filteredAlerts = alerts.filter((a) => {
    // Status filter
    if (activeFilter === "pending" && a.resolved) return false;
    if (activeFilter === "resolved" && !a.resolved) return false;

    // Source filter
    if (sourceFilter !== "all" && a.source !== sourceFilter) return false;

    // Timeline filter
    if (timelineFilter !== "all" && a.timestamp !== timelineFilter)
      return false;

    return true;
  });

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/50";
      case "High":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200/50";
      case "Moderate":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50";
      default:
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif] text-slate-800 dark:text-slate-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-dark text-white border border-[#ecf39e]/30 px-5 py-3 rounded-xl shadow-lg z-50 text-xs font-black flex items-center gap-2 animate-slideUp">
          <CheckCircle className="h-4.5 w-4.5 text-[#ecf39e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#132a13] to-[#31572c] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-32 w-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-3.5 mb-2.5">
          <div className="h-10 w-10 bg-[#ecf39e]/20 text-[#ecf39e] rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Disease Alert Center
            </h1>
            <p className="text-white/80 text-[11px] md:text-xs font-semibold mt-0.5">
              Aggregated real-time outbreak threats, satellite anomalies, and
              government directives.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Alerts"
          value={totalAlertsCount}
          trend="Active logs"
          trendType="neutral"
          subtext="Total aggregated threat logs"
          icon={<Bell className="text-[#31572c]" />}
        />
        <StatsCard
          title="Critical Threats"
          value={criticalCount}
          trend="Urgent Action"
          trendType={criticalCount > 0 ? "danger" : "neutral"}
          subtext="Requiring immediate response"
          icon={<AlertTriangle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Pending Action"
          value={pendingCount}
          trend="Requires Treat"
          trendType="neutral"
          subtext="Awaiting grower containment"
          icon={<Clock className="text-[#31572c]" />}
        />
        <StatsCard
          title="Resolved"
          value={resolvedCount}
          trend="Protected Crops"
          trendType="success"
          subtext="Successfully contained threats"
          icon={<CheckCircle className="text-[#31572c]" />}
        />
      </div>

      {/* Filter and Content Controls */}
      <div className="bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/20 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-brand-dark/10 pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-brand-dark/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeFilter === "all"
                  ? "bg-brand-dark text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeFilter === "pending"
                  ? "bg-brand-dark text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter("resolved")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                activeFilter === "resolved"
                  ? "bg-brand-dark text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Quick Clear Filter Link */}
          {(sourceFilter !== "all" || timelineFilter !== "all") && (
            <button
              onClick={() => {
                setSourceFilter("all");
                setTimelineFilter("all");
              }}
              className="text-xs font-bold text-[#31572c] dark:text-[#ecf39e] hover:underline"
            >
              Reset Category Filters
            </button>
          )}
        </div>

        {/* Dropdowns Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Source Filter */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Alert Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-brand-dark/5 border border-slate-200 dark:border-brand-dark/25 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="AI Forecast">AI Forecast</option>
              <option value="Weather">Weather Engine</option>
              <option value="Government">Government Directives</option>
              <option value="Satellite">Satellite Observations</option>
              <option value="Nearby Outbreak">Nearby Reports</option>
            </select>
          </div>

          {/* Timeline Filter */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
              Timeline Window
            </label>
            <select
              value={timelineFilter}
              onChange={(e) => setTimelineFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-brand-dark/5 border border-slate-200 dark:border-brand-dark/25 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="all">All Timeframes</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/20 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
                alert.resolved ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide ${getSeverityStyles(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {alert.crop} —{" "}
                      <span className="underline">{alert.disease}</span>
                    </h3>
                    <span className="text-[9px] bg-slate-100 dark:bg-brand-dark/25 px-2 py-0.5 rounded text-slate-400 font-bold uppercase tracking-widest">
                      Source: {alert.source}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {alert.date}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="p-2 border border-slate-200 dark:border-brand-dark/25 hover:bg-slate-50 dark:hover:bg-brand-dark/10 rounded-xl transition text-slate-500 dark:text-slate-300"
                    title="View Disease Pathological details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {!alert.resolved ? (
                    <>
                      <button
                        onClick={() => {
                          handleResolve(alert.id);
                        }}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1 transition shadow-sm"
                        title="Mark Treatment Completed"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Treat</span>
                      </button>
                      <button
                        onClick={() => handleScheduleSpray(alert)}
                        className="px-3 py-2 bg-brand-dark hover:bg-[#132a13] text-white rounded-xl text-xs font-black flex items-center gap-1 transition shadow-sm"
                        title="Schedule Preventive Spray Reminders"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Schedule</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-950/50">
                      Resolved
                    </span>
                  )}

                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-2 border border-red-100 hover:bg-red-50 text-red-600 rounded-xl transition"
                    title="Dismiss Alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-brand-darkest border border-dashed border-slate-200 dark:border-brand-dark/25 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              No Alerts Found
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Modify your filter criteria or status options to check other
              diagnostics logs.
            </p>
          </div>
        )}
      </div>

      {/* Disease Detail Modal */}
      {/* {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/25 rounded-3xl p-6 shadow-xl max-w-md w-full space-y-4 animate-scaleUp">
            
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded tracking-widest ${getSeverityStyles(selectedAlert.severity)}`}>
                  {selectedAlert.severity} Severity
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                  {selectedAlert.disease}
                </h3>
                <p className="text-xs text-[#31572c] dark:text-[#ecf39e] font-bold mt-0.5">
                  Target Crop: {selectedAlert.crop}
                </p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-slate-50 dark:bg-brand-dark/5 rounded-2xl p-4 border border-slate-100 dark:border-brand-dark/10">
                <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider block mb-1">Threat Overview</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {selectedAlert.message}
                </p>
              </div>

              {selectedAlert.symptoms && (
                <div className="bg-slate-50 dark:bg-brand-dark/5 rounded-2xl p-4 border border-slate-100 dark:border-brand-dark/10">
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider block mb-1">Pathogen Symptoms</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    {selectedAlert.symptoms}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedAlert(null);
                  navigate("/module/disease-detection/treatment");
                }}
                className="py-2.5 bg-brand-dark text-white hover:bg-[#132a13] rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Shield className="h-4 w-4" />
                <span>Advisor</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAlert(null);
                  navigate("/module/disease-detection/heatmap");
                }}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-brand-dark/15 dark:hover:bg-brand-dark/30 text-slate-700 dark:text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Map className="h-4 w-4" />
                <span>Map Overlay</span>
              </button>
            </div>

          </div>
        </div>
      )} */}

      {/* Disease Detail Modal - rendered via Portal to escape parent stacking context */}
      {selectedAlert &&
        createPortal(
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setSelectedAlert(null)}
          >
            <div
              className="bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/25 rounded-3xl p-6 shadow-xl w-full max-w-md max-h-[80vh] flex flex-col animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header - never scrolls */}
              <div className="flex justify-between items-start shrink-0 mb-4">
                <div>
                  <span
                    className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded tracking-widest ${getSeverityStyles(selectedAlert.severity)}`}
                  >
                    {selectedAlert.severity} Severity
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                    {selectedAlert.disease}
                  </h3>
                  <p className="text-xs text-[#31572c] dark:text-[#ecf39e] font-bold mt-0.5">
                    Target Crop: {selectedAlert.crop}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto flex-1 space-y-3 pr-1 text-xs">
                <div className="bg-slate-50 dark:bg-brand-dark/5 rounded-2xl p-4 border border-slate-100 dark:border-brand-dark/10">
                  <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                    Threat Overview
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    {selectedAlert.message}
                  </p>
                </div>

                {selectedAlert.symptoms && (
                  <div className="bg-slate-50 dark:bg-brand-dark/5 rounded-2xl p-4 border border-slate-100 dark:border-brand-dark/10">
                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider block mb-1">
                      Pathogen Symptoms
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      {selectedAlert.symptoms}
                    </p>
                  </div>
                )}
              </div>

              {/* Fixed Footer Buttons - never scrolls */}
              <div className="grid grid-cols-2 gap-3 pt-4 shrink-0">
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate("/module/disease-detection/treatment");
                  }}
                  className="py-2.5 bg-brand-dark text-white hover:bg-[#132a13] rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Advisor</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate("/module/disease-detection/heatmap");
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-brand-dark/15 dark:hover:bg-brand-dark/30 text-slate-700 dark:text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Map className="h-4 w-4" />
                  <span>Map Overlay</span>
                </button>
              </div>
            </div>
          </div>,
          document.body, // ← Renders directly into <body>, escaping all parent contexts
        )}
    </div>
  );
}
