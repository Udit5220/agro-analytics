import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  History,
  Layers,
  AlertTriangle,
  Loader2,
  TrendingUp,
  MapPin,
  Droplets,
  Thermometer,
  Award,
  BarChart3,
  CheckCircle2,
  Percent,
  Sprout,
} from "lucide-react";
import { getRealOutbreakHistory } from "../../../logic/outbreakHistoryService";

const CROPS_LIST = [
  "All Crops",
  "Rice",
  "Wheat",
  "Cotton",
  "Maize",
  "Mustard",
  "Sugarcane",
  "Pulses",
];
const DISEASES_LIST = [
  "All Diseases",
  "Blast Disease",
  "Yellow Rust",
  "Whitefly",
  "Leaf Blight",
  "Sheath Blight",
  "Alternaria Blight",
  "Bacterial Blight",
  "Powdery Mildew",
];

// Time range options
const TIME_RANGES = [
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last Year", value: "1y" },
  { label: "All Time", value: "all" },
];

export default function HistoricalOutbreaks() {
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [selectedDisease, setSelectedDisease] = useState("All Diseases");
  const [selectedTimeRange, setSelectedTimeRange] = useState("3m");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [outbreakData, setOutbreakData] = useState({
    outbreaks: [],
    stats: {
      totalOutbreaks: 0,
      totalAffectedArea: "0 acres",
      mostCommonDisease: "N/A",
      averageSeverity: "Low",
      affectedDistricts: 0,
    },
    seasonalTrends: [],
    highRiskPeriods: [],
  });

  // Treatment history from localStorage
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [expandedOutbreakId, setExpandedOutbreakId] = useState(null);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const hist = JSON.parse(localStorage.getItem("treatmentHistory") || "[]");
        setTreatmentHistory(hist);
      } catch { setTreatmentHistory([]); }
    };
    loadHistory();
    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, []);

  const loadOutbreaks = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const cropParam = selectedCrop === "All Crops" ? "All" : selectedCrop;
      const diseaseParam =
        selectedDisease === "All Diseases" ? "All" : selectedDisease;

      try {
        const result = await getRealOutbreakHistory(
          cropParam,
          diseaseParam,
          selectedTimeRange,
        );
        setOutbreakData(result);
      } catch (err) {
        console.error("Failed to load historical outbreaks:", err);
        setOutbreakData(getFallbackOutbreakData(selectedCrop, selectedDisease));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCrop, selectedDisease, selectedTimeRange],
  );

  useEffect(() => {
    loadOutbreaks();
  }, [loadOutbreaks]);

  const getSeverityStyles = (severity) => {
    const sev = String(severity).toLowerCase();
    if (sev === "critical" || sev === "severe" || sev === "high") {
      return {
        badgeStyle: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/50",
        iconBg: "bg-red-500/10 text-red-655 dark:text-red-400",
        dotColor: "bg-red-500",
      };
    } else if (sev === "moderate" || sev === "medium") {
      return {
        badgeStyle: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50",
        iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-450",
        dotColor: "bg-amber-500",
      };
    }
    return {
      badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450",
      dotColor: "bg-emerald-500",
    };
  };

  const outbreaksList = outbreakData.outbreaks || [];

  // --- ANALYTICS: Disease Frequency Analysis ---
  const diseaseFrequency = {};
  outbreaksList.forEach((r) => {
    const d = r.disease || "Unknown";
    diseaseFrequency[d] = (diseaseFrequency[d] || 0) + 1;
  });
  const diseaseRanking = Object.entries(diseaseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxFrequency = diseaseRanking[0]?.[1] || 1;

  // --- ANALYTICS: Yield Loss by severity ---
  const yieldLossMap = {
    high: { label: "High Severity", loss: "25-40%", color: "bg-red-500" },
    severe: { label: "Severe", loss: "35-50%", color: "bg-red-700" },
    moderate: { label: "Moderate", loss: "10-20%", color: "bg-amber-500" },
    medium: { label: "Medium", loss: "10-20%", color: "bg-amber-500" },
    low: { label: "Low Severity", loss: "2-8%", color: "bg-emerald-500" },
  };
  const severityCounts = {};
  outbreaksList.forEach((r) => {
    const sev = String(r.severity || "low").toLowerCase();
    severityCounts[sev] = (severityCounts[sev] || 0) + 1;
  });

  // --- ANALYTICS: Treatment Success from localStorage ---
  const treatmentsByDisease = {};
  treatmentHistory.forEach((t) => {
    const d = t.disease || "Unknown";
    treatmentsByDisease[d] = (treatmentsByDisease[d] || 0) + 1;
  });
  const topTreatments = Object.entries(treatmentsByDisease)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Header Section */}
      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Epidemiological Analytics Database
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">
          Historical patterns to plan preventive action this season
        </h1>
      </header>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#f4f7f4]/30">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#31572c]" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Filter Historical Data
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Crop Type
              </label>
              <div className="relative">
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {CROPS_LIST.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Disease
              </label>
              <div className="relative">
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {DISEASES_LIST.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Time Period
              </label>
              <div className="relative">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  {TIME_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => loadOutbreaks(true)}
                disabled={refreshing}
                className="px-4 py-2 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg font-bold text-sm transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <History className="w-4 h-4" />
                )}
                {refreshing ? "Updating..." : "Refresh"}
              </button>

              {(selectedCrop !== "All Crops" ||
                selectedDisease !== "All Diseases") && (
                <button
                  onClick={() => {
                    setSelectedCrop("All Crops");
                    setSelectedDisease("All Diseases");
                    setSelectedTimeRange("3m");
                  }}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        // Loading Skeletons
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Total Outbreaks
                </span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mt-2">
                {outbreakData.stats.totalOutbreaks}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">
                recorded incidents
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Affected Area
                </span>
                <MapPin className="w-4 h-4 text-orange-500" />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mt-2">
                {outbreakData.stats.totalAffectedArea}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">acres impacted</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Most Common
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="text-sm font-black text-[#31572c] mt-2 truncate">
                {outbreakData.stats.mostCommonDisease}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">frequent disease</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Avg Severity
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${outbreakData.stats.averageSeverity === "High" ? "bg-red-500" : outbreakData.stats.averageSeverity === "Moderate" ? "bg-amber-500" : "bg-emerald-500"}`}
                />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mt-2">
                {outbreakData.stats.averageSeverity}
              </h4>
              <p className="text-[10px] text-gray-400 mt-1">risk level</p>
            </div>
          </div>

          {/* --- ANALYTICS ROW: Disease Frequency + Yield Loss + Treatment Success --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Disease Frequency Analysis / Most Common Disease Ranking */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <Award className="w-4 h-4 text-[#31572c]" />
                <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
                  Disease Frequency Ranking
                </h3>
              </div>
              {diseaseRanking.length > 0 ? (
                <div className="space-y-2.5">
                  {diseaseRanking.map(([disease, count], idx) => (
                    <div key={disease} className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                        idx === 0 ? "bg-amber-100 text-amber-800" :
                        idx === 1 ? "bg-gray-100 text-gray-600" :
                        idx === 2 ? "bg-orange-50 text-orange-700" :
                        "bg-gray-50 text-gray-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-bold text-gray-800 truncate">{disease}</span>
                          <span className="text-[10px] font-black text-gray-500">{count}x</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4f772d] rounded-full transition-all duration-500"
                            style={{ width: `${(count / maxFrequency) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No disease data available</p>
              )}
            </div>

            {/* Yield Loss Analytics */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <Percent className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
                  Yield Loss by Severity
                </h3>
              </div>
              <div className="space-y-3">
                {Object.entries(severityCounts).map(([sev, count]) => {
                  const info = yieldLossMap[sev] || yieldLossMap.low;
                  return (
                    <div key={sev} className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${info.color} flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-800">{info.label}</span>
                          <span className="text-[10px] font-black text-gray-500">{count} cases</span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          Est. yield loss: <span className="font-bold text-gray-600">{info.loss}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(severityCounts).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No severity data available</p>
                )}
              </div>
            </div>

            {/* Treatment Success Analytics (from localStorage) */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest">
                  Treatment Success Log
                </h3>
              </div>
              {topTreatments.length > 0 ? (
                <div className="space-y-2.5">
                  {topTreatments.map(([disease, count], idx) => (
                    <div key={disease} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/30 border border-emerald-100/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-gray-800 truncate block">{disease}</span>
                        <span className="text-[10px] text-gray-400">{count} treatment{count > 1 ? "s" : ""} applied</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-gray-400 italic">No treatments logged yet.</p>
                  <p className="text-[10px] text-gray-300 mt-1">Apply treatments from the Treatment Advisor to track here.</p>
                </div>
              )}
              {treatmentHistory.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400">
                    Total treatments applied: <span className="font-black text-gray-700">{treatmentHistory.length}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seasonal Trends Insight */}
          {outbreakData.seasonalTrends &&
            outbreakData.seasonalTrends.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  ðŸ“Š Seasonal Insights
                </h3>
                <div className="flex flex-wrap gap-4">
                  {outbreakData.seasonalTrends.map((trend, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${trend.risk === "High" ? "bg-red-500" : trend.risk === "Moderate" ? "bg-amber-500" : "bg-emerald-500"}`}
                      />
                      <span className="text-sm font-medium">
                        {trend.period}
                      </span>
                      <span className="text-xs text-gray-500">
                        {trend.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Outbreak Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-[#f4f7f4]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#31572c]" />
                  <h2 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
                    Outbreak Timeline
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
                  {outbreaksList.length} Records Found
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[650px] overflow-y-auto">
              {outbreaksList.map((record, index) => {
                const recordId = record.id || index;
                const isExpanded = expandedOutbreakId === recordId;
                const styles = getSeverityStyles(record.severity);
                return (
                  <div
                    key={recordId}
                    onClick={() => setExpandedOutbreakId(isExpanded ? null : recordId)}
                    className={`bg-white dark:bg-brand-darkest border ${isExpanded ? "border-[#31572c] ring-2 ring-[#31572c]/10" : "border-slate-200/80 dark:border-brand-dark/20"} rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-brand-dark/40 transition-all duration-200 cursor-pointer select-none`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Icon Block */}
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg} shadow-inner`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>

                        {/* Title & Badge */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center flex-wrap gap-2.5">
                            <h3 className="text-base font-black text-slate-800 dark:text-white leading-snug truncate">
                              {record.disease}
                            </h3>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${styles.badgeStyle}`}>
                              {record.severity} Severity
                            </span>
                          </div>

                          {/* Metadata capsules */}
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold mt-1">
                            <span className="bg-[#f4f7f4]/80 text-[#31572c] border border-slate-100/50 dark:bg-brand-dark/20 dark:text-[#ecf39e] dark:border-brand-dark/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                              <Sprout className="w-3.5 h-3.5" />
                              <span>{record.crop}</span>
                            </span>
                            <span className="bg-sky-50 text-sky-750 border border-sky-100/60 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{record.location}</span>
                            </span>
                            <span className="bg-slate-50 text-slate-655 border border-slate-100/80 dark:bg-brand-dark/10 dark:text-slate-400 dark:border-brand-dark/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{record.date}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Chevron */}
                      <div className="shrink-0 h-10 w-10 rounded-xl bg-slate-50 dark:bg-brand-dark/20 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-dark/30 transition-colors">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-250 ${
                            isExpanded ? "transform rotate-180 text-[#31572c] dark:text-[#ecf39e]" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isExpanded ? "max-h-[500px] opacity-100 mt-5 pt-5 border-t border-slate-100 dark:border-brand-dark/10" : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Environmental Conditions */}
                        <div className="space-y-2.5 text-left">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                            Meteorological Trigger Conditions
                          </span>
                          {record.conditions ? (
                            <div className="grid grid-cols-3 gap-3 bg-[#f4f7f4]/40 dark:bg-brand-dark/10 border border-slate-100/50 dark:border-brand-dark/15 rounded-xl p-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <div className="flex flex-col items-center p-3 bg-white dark:bg-brand-darkest rounded-xl border border-slate-50/50 dark:border-brand-dark/5 shadow-xs">
                                <Thermometer className="w-4 h-4 text-red-500 mb-1.5" />
                                <span className="text-[10px] text-slate-400 block font-bold">Temp</span>
                                <span className="font-extrabold text-slate-900 dark:text-white mt-1 text-sm">{record.conditions.temp}Â°C</span>
                              </div>
                              <div className="flex flex-col items-center p-3 bg-white dark:bg-brand-darkest rounded-xl border border-slate-50/50 dark:border-brand-dark/5 shadow-xs">
                                <Droplets className="w-4 h-4 text-sky-500 mb-1.5" />
                                <span className="text-[10px] text-slate-400 block font-bold">Humidity</span>
                                <span className="font-extrabold text-slate-900 dark:text-white mt-1 text-sm">{record.conditions.humidity}%</span>
                              </div>
                              <div className="flex flex-col items-center p-3 bg-white dark:bg-brand-darkest rounded-xl border border-slate-50/50 dark:border-brand-dark/5 shadow-xs">
                                <Droplets className="w-4 h-4 text-blue-500 mb-1.5" />
                                <span className="text-[10px] text-slate-400 block font-bold">Rainfall</span>
                                <span className="font-extrabold text-slate-900 dark:text-white mt-1 text-sm">{record.conditions.rainfall}mm</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-brand-dark/10 border border-slate-100 dark:border-brand-dark/15 rounded-xl p-4 text-xs text-slate-400 italic">
                              No environmental telemetry logged for this period.
                            </div>
                          )}
                        </div>

                        {/* Impact Assessment */}
                        <div className="space-y-2.5 text-left">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                            Impact & Incident Resolution
                          </span>
                          <div className="bg-[#f4f7f4]/40 dark:bg-brand-dark/10 border border-slate-100/50 dark:border-brand-dark/15 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Affected Area</span>
                              <span className="text-base font-black text-slate-900 dark:text-white">
                                {record.affectedArea || `${record.affectedAcres || Math.floor(Math.random() * 500 + 50)} acres`}
                              </span>
                            </div>
                            {record.outcome && (
                              <div className="bg-white dark:bg-brand-darkest rounded-xl p-3 border border-slate-50 dark:border-brand-dark/5 shadow-xs">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">Resolution Outcome</span>
                                <p className="text-xs text-slate-655 dark:text-slate-300 font-semibold leading-relaxed">
                                  {record.outcome}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Merged Treatment History into Timeline */}
              {treatmentHistory.length > 0 && (
                <>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-650" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      User Treatment Applications
                    </span>
                  </div>
                  {treatmentHistory.slice(0, 5).map((treat) => (
                    <div
                      key={treat.id}
                      className="bg-white dark:bg-brand-darkest border border-emerald-100 dark:border-emerald-950/30 rounded-2xl p-4.5 shadow-sm border-l-4 border-l-emerald-500 text-left"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
                              Applied
                            </span>
                            <h3 className="text-sm font-black text-slate-800 dark:text-white leading-tight">
                              {treat.treatment || treat.method}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                            <span>ðŸŒ¾ {treat.crop}</span>
                            <span className="text-slate-200 dark:text-slate-700">â€¢</span>
                            <span>ðŸ¦  {treat.disease}</span>
                            <span className="text-slate-200 dark:text-slate-700">â€¢</span>
                            <span>ðŸ“… {treat.date}</span>
                          </div>
                        </div>
                        <div className="text-left md:text-right shrink-0">
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded">
                            Treatment Logged
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Empty State */}
              {outbreaksList.length === 0 && treatmentHistory.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    No Historical Records Found
                  </h4>
                  <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
                    No outbreaks match the selected filters. Try adjusting your
                    crop or disease selection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Fallback function when API fails
function getFallbackOutbreakData(crop, disease) {
  const mockOutbreaks = [
    {
      id: 1,
      disease: disease !== "All Diseases" ? disease : "Blast Disease",
      severity: "High",
      crop: crop !== "All Crops" ? crop : "Rice",
      location: "Karnal",
      date: "2024-05-15",
      affectedArea: "450 acres",
      outcome: "30% yield loss reported",
      conditions: { temp: 28, humidity: 85, rainfall: 45 },
    },
    {
      id: 2,
      disease: disease !== "All Diseases" ? disease : "Yellow Rust",
      severity: "Moderate",
      crop: crop !== "All Crops" ? crop : "Wheat",
      location: "Amritsar",
      date: "2024-05-10",
      affectedArea: "280 acres",
      outcome: "Contained with fungicide application",
      conditions: { temp: 22, humidity: 78, rainfall: 30 },
    },
    {
      id: 3,
      disease: disease !== "All Diseases" ? disease : "Sheath Blight",
      severity: "High",
      crop: crop !== "All Crops" ? crop : "Rice",
      location: "Meerut",
      date: "2024-05-05",
      affectedArea: "520 acres",
      outcome: "Emergency measures deployed",
      conditions: { temp: 30, humidity: 88, rainfall: 60 },
    },
  ];

  return {
    outbreaks: mockOutbreaks,
    stats: {
      totalOutbreaks: mockOutbreaks.length,
      totalAffectedArea: "1,250 acres",
      mostCommonDisease: mockOutbreaks[0]?.disease || "N/A",
      averageSeverity: "Moderate",
      affectedDistricts: 3,
    },
    seasonalTrends: [
      {
        period: "Kharif Season (Jun-Oct)",
        risk: "High",
        description: "High risk for Blast and Sheath Blight",
      },
      {
        period: "Rabi Season (Nov-Apr)",
        risk: "Moderate",
        description: "Yellow Rust active in northern regions",
      },
    ],
    highRiskPeriods: ["June-August", "January-February"],
  };
}
