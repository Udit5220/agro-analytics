import React, { useState, useEffect } from "react";
import {
  Search,
  Sprout,
  FlaskConical,
  CalendarDays,
  AlertTriangle,
  Star,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { getTreatments } from "../../../services/diseaseGeminiService";

// Simple donut chart component for efficacy visualization
const EfficacyDonut = ({ value, label, color = "#31572c" }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" className="transform -rotate-90">
        <circle cx="36" cy="36" r={radius} stroke="#e5e7eb" strokeWidth="6" fill="none" />
        <circle cx="36" cy="36" r={radius} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="text-xs font-black text-gray-900 -mt-[52px]">{value}%</span>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-6">{label}</span>
    </div>
  );
};

export default function TreatmentAdvisor() {
  const [treatmentType, setTreatmentType] = useState("organic"); // organic or chemical
  const [searchQuery, setSearchQuery] = useState("Rice Blast");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    treatments: [],
    spraySchedule: [],
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [reminderCrop, setReminderCrop] = useState("Rice (Paddy)");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("07:00");
  const [reminderNotes, setReminderNotes] = useState("");

  // Call API whenever searchQuery or treatmentType changes
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadTreatments = async () => {
      const delayTimer = setTimeout(async () => {
        try {
          const result = await getTreatments(
            searchQuery || "Blast Disease",
            treatmentType,
          );
          if (active) {
            setData(result);
            setLoading(false);
          }
        } catch (err) {
          console.error("Failed to load treatments:", err);
          if (active) {
            setLoading(false);
          }
        }
      }, 400);

      return () => {
        clearTimeout(delayTimer);
      };
    };

    loadTreatments();

    return () => {
      active = false;
    };
  }, [searchQuery, treatmentType]);

  const handleMarkApplied = (treatmentName) => {
    try {
      // 1. Add to treatmentHistory
      const history = JSON.parse(
        localStorage.getItem("treatmentHistory") || "[]",
      );
      const newRecord = {
        id: `treat-${Date.now()}`,
        crop: searchQuery.toLowerCase().includes("rice")
          ? "Rice (Paddy)"
          : searchQuery.toLowerCase().includes("wheat")
            ? "Wheat"
            : "Mustard",
        disease: searchQuery || "Unknown Disease",
        treatment: treatmentName,
        date: new Date().toISOString().split("T")[0],
        timestamp: new Date().toISOString(),
        cost: 250,
      };
      history.unshift(newRecord);
      localStorage.setItem("treatmentHistory", JSON.stringify(history));

      // 2. Resolve matching active alerts in diseaseAlerts
      const alerts = JSON.parse(localStorage.getItem("diseaseAlerts") || "[]");
      let updatedCount = 0;
      const updatedAlerts = alerts.map((alert) => {
        const cropMatch =
          alert.crop
            ?.toLowerCase()
            .includes((newRecord.crop || "").toLowerCase()) ||
          (newRecord.crop || "")
            .toLowerCase()
            .includes(alert.crop?.toLowerCase());
        const diseaseMatch =
          alert.disease
            ?.toLowerCase()
            .includes((newRecord.disease || "").toLowerCase()) ||
          (newRecord.disease || "")
            .toLowerCase()
            .includes(alert.disease?.toLowerCase());

        if (cropMatch && !alert.resolved) {
          updatedCount++;
          return { ...alert, resolved: true };
        }
        return alert;
      });
      localStorage.setItem("diseaseAlerts", JSON.stringify(updatedAlerts));

      setSuccessMsg(
        `Treatment "${treatmentName}" marked as applied successfully! ${updatedCount} active alerts resolved.`,
      );
      setTimeout(() => setSuccessMsg(""), 4000);

      // Trigger storage update
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleReminder = (e) => {
    e.preventDefault();
    if (!reminderDate) return;

    try {
      const reminders = JSON.parse(
        localStorage.getItem("activeReminders") || "[]",
      );
      const newReminder = {
        id: `reminder-${Date.now()}`,
        crop: reminderCrop,
        date: reminderDate,
        time: reminderTime,
        notes:
          reminderNotes || `Scheduled preventive spray for ${reminderCrop}`,
        weatherSuitability: "Excellent (Wind 6 km/h, NE)",
        completed: false,
      };
      reminders.push(newReminder);
      localStorage.setItem("activeReminders", JSON.stringify(reminders));

      // Also create a high-priority alert or notification in alerts feed
      const alerts = JSON.parse(localStorage.getItem("diseaseAlerts") || "[]");
      const scheduleAlert = {
        id: `alert-${Date.now()}`,
        crop: reminderCrop,
        disease: "Preventive Spray Schedule",
        severity: "Informational",
        message: `Preventive spray scheduled for ${reminderCrop} on ${reminderDate} at ${reminderTime}.`,
        source: "Scheduler",
        timestamp: "Today",
        date: new Date().toISOString().split("T")[0],
        resolved: false,
        symptoms: "Scheduled application reminder.",
      };
      alerts.unshift(scheduleAlert);
      localStorage.setItem("diseaseAlerts", JSON.stringify(alerts));

      setSuccessMsg(
        `Spray reminder scheduled successfully for ${reminderDate}!`,
      );
      setTimeout(() => setSuccessMsg(""), 4000);

      // Reset form
      setReminderDate("");
      setReminderNotes("");

      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  const sprayDays = data.spraySchedule || [];
  const totalDays = 30;

  const formatCostPerAcre = (cost) => {
    if (typeof cost === "number") {
      return `â‚¹${cost.toLocaleString("en-IN")}/acre`;
    }
    return cost;
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Header */}
      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Therapeutic Management Modules
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">
          Evidence-based treatment plans for disease control
        </h1>
      </header>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 animate-fadeIn">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Control Layer */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        {/* Dynamic Search Box */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
            placeholder="Search target pathogen or disease..."
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5 pointer-events-none" />
        </div>

        {/* Categorized Treatment Pill Toggles */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTreatmentType("organic")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              treatmentType === "organic"
                ? "bg-[#4f772d] text-white shadow-sm font-extrabold"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Organic Treatments</span>
          </button>
          <button
            onClick={() => setTreatmentType("chemical")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              treatmentType === "chemical"
                ? "bg-[#31572c] text-white shadow-sm font-extrabold"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Chemical Treatments</span>
          </button>
        </div>
      </div>

      {/* Regimen Matrix List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Showing treatment for:
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest bg-[#132a13] text-white px-2.5 py-1 rounded">
            {searchQuery || "Global Repository"}
          </span>
          {loading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c] ml-1" />
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-44 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {(data.treatments || []).map((treatment, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all text-left"
              >
                {/* Protocol Header Metadata */}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-50 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 tracking-tight">
                      {treatment.name}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < (treatment.rating || 4) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#15803d] bg-emerald-50 px-3 py-1 rounded-lg">
                    {formatCostPerAcre(
                      treatment.costPerAcre || treatment.cost || 250,
                    )}
                  </span>
                </div>

                {/* Micro Technical Grid Parameters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-[#f4f7f4]/40 p-3 rounded-xl border border-gray-100/40">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Application Method
                    </span>
                    <p className="text-xs font-bold text-gray-800">
                      {treatment.method}
                    </p>
                  </div>
                  <div className="bg-[#f4f7f4]/40 p-3 rounded-xl border border-gray-100/40">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Dosage per Acre
                    </span>
                    <p className="text-xs font-bold text-gray-800">
                      {treatment.dosage}
                    </p>
                  </div>
                  <div className="bg-[#f4f7f4]/40 p-3 rounded-xl border border-gray-100/40">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Success Rate
                    </span>
                    <p className="text-xs font-black text-emerald-700">
                      {treatment.successRate ||
                        (treatmentType === "organic"
                          ? "84% Success"
                          : "95% Success")}
                    </p>
                  </div>
                  <div className="bg-[#f4f7f4]/40 p-3 rounded-xl border border-gray-100/40">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Harvest Safety
                    </span>
                    <p className="text-xs font-bold text-amber-700">
                      {treatment.harvestSafety ||
                        (treatmentType === "organic"
                          ? "3 Days Interval"
                          : "14 Days Interval")}
                    </p>
                  </div>
                  <div className="bg-[#f4f7f4]/40 p-3 rounded-xl border border-gray-100/40">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Inventory Stock
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border inline-block ${
                        idx % 3 === 0
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : idx % 3 === 1
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {idx % 3 === 0
                        ? "Available"
                        : idx % 3 === 1
                          ? "Low Stock"
                          : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Warning Alert Banner Strip */}
                {treatment.warning && (
                  <div className="bg-red-50 text-red-800 px-4 py-2.5 rounded-xl border border-red-100 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{treatment.warning}</span>
                  </div>
                )}

                {/* Mark Treatment Applied Button */}
                <div className="flex justify-end pt-2 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => handleMarkApplied(treatment.name)}
                    className="px-4 py-2 bg-[#31572c] hover:bg-[#132a13] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Mark Treatment Applied</span>
                  </button>
                </div>
              </div>
            ))}

            {(data.treatments || []).length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                  No Treatments Found
                </h4>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cost Comparison: Organic vs Chemical */}
      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest border-b border-gray-50 pb-2">
          Cost-effectiveness Matrix: Organic vs Chemical Protocols
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold bg-slate-50/50">
                <th className="py-2.5 px-3">Treatment Category</th>
                <th className="py-2.5 px-3">Average Cost / Acre</th>
                <th className="py-2.5 px-3">Average Efficiency</th>
                <th className="py-2.5 px-3">Eco-Impact Rating</th>
                <th className="py-2.5 px-3">Harvest Safety Interval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              <tr>
                <td className="py-3 px-3 text-emerald-850 font-bold">
                  Organic Protocols (Neem, Bio-fungicides)
                </td>
                <td className="py-3 px-3">â‚¹180 - â‚¹350</td>
                <td className="py-3 px-3">78% â€“ 85%</td>
                <td className="py-3 px-3 text-emerald-700">
                  Excellent (Zero Residue)
                </td>
                <td className="py-3 px-3">0 â€“ 3 Days</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-amber-850 font-bold">
                  Chemical Protocols (Tricyclazole, Propiconazole)
                </td>
                <td className="py-3 px-3">â‚¹450 - â‚¹750</td>
                <td className="py-3 px-3">88% â€“ 95%</td>
                <td className="py-3 px-3 text-red-600">
                  Moderate Risk (Residue Risk)
                </td>
                <td className="py-3 px-3">14 â€“ 21 Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Calendar and Scheduler form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#31572c]" />
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                Spray Schedule â€” Next 30 Days
              </h2>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
              {sprayDays.length} Actions Programmed
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {[...Array(totalDays)].map((_, i) => {
              const dayNumber = i + 1;
              const isSprayDay = sprayDays.includes(dayNumber);

              return (
                <div
                  key={dayNumber}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border transition-all duration-200 group relative ${
                    isSprayDay
                      ? "bg-[#31572c] border-[#132a13] text-white shadow-sm font-black hover:bg-[#132a13]"
                      : "bg-[#f4f7f4]/40 border-gray-100 text-gray-400 font-bold hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-xs">{dayNumber}</span>
                  {isSprayDay && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ecf39e] mt-1 group-hover:scale-125 transition-transform"></span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#31572c] border border-[#132a13]"></span>
              <span>Spray Day Operation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#f4f7f4]/40 border border-gray-100"></span>
              <span>Rest/Observation Interval</span>
            </div>
          </div>
        </div>

        {/* Scheduler Form (Span 1) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 text-left flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#132a13] uppercase tracking-widest border-b border-gray-50 pb-2">
              Schedule Spray Event
            </h3>
            <form onSubmit={handleScheduleReminder} className="space-y-3 mt-3">
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">
                  Target Crop
                </label>
                <select
                  value={reminderCrop}
                  onChange={(e) => setReminderCrop(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-800"
                >
                  <option value="Rice (Paddy)">Rice (Paddy)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Mustard">Mustard</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">
                  Schedule Time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-800"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">
                  Scheduler Notes
                </label>
                <textarea
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="e.g. Apply copper fungicide spray early morning"
                  className="w-full border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-705 h-16"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Add Spray Reminder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
