import React, { useState, useEffect } from "react";
import {
  Search,
  Sprout,
  FlaskConical,
  CalendarDays,
  AlertTriangle,
  Star,
  Loader2
} from "lucide-react";
import { getTreatments } from "../../services/diseaseGeminiService";

export default function TreatmentAdvisor() {
  const [treatmentType, setTreatmentType] = useState("organic"); // organic or chemical
  const [searchQuery, setSearchQuery] = useState("Rice Blast");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    treatments: [],
    spraySchedule: []
  });

  // Call API whenever searchQuery or treatmentType changes
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadTreatments = async () => {
      // Debounce the search query slightly if it changes too fast
      const delayTimer = setTimeout(async () => {
        try {
          const result = await getTreatments(searchQuery || "Blast Disease", treatmentType);
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

  const sprayDays = data.spraySchedule || [];
  const totalDays = 30;

  const formatCostPerAcre = (cost) => {
    if (typeof cost === "number") {
      return `₹${cost.toLocaleString("en-IN")}/acre`;
    }
    return cost;
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* --- MAIN PAGE ROOT HEADER --- */}
      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Therapeutic Management Modules
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">
          Evidence-based treatment plans for disease control
        </h1>
      </header>

      {/* --- FILTER CONTROL LAYER --- */}
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              treatmentType === "organic"
                ? "bg-[#4f772d] text-white shadow-sm font-extrabold cursor-pointer"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Organic Treatments</span>
          </button>
          <button
            onClick={() => setTreatmentType("chemical")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              treatmentType === "chemical"
                ? "bg-[#31572c] text-white shadow-sm font-extrabold cursor-pointer"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Chemical Treatments</span>
          </button>
        </div>
      </div>

      {/* --- THERAPEUTIC REGIMEN MATRIX LIST --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Showing treatment for:
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest bg-[#132a13] text-white px-2.5 py-1 rounded">
            {searchQuery || "Global Repository"}
          </span>
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c] ml-1" />}
        </div>

        {loading ? (
          // ─── PULSING SKELETON PLACEHOLDERS ───
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-44 bg-gray-100 border border-gray-200/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {(data.treatments || []).map((treatment, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Protocol Header Metadata */}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-50 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 tracking-tight">
                      {treatment.name}
                    </h3>
                    {/* Star Component Vector Display */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < (treatment.rating || 4) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Currency Estimation Token */}
                  <span className="text-sm font-black text-[#15803d] bg-emerald-50 px-3 py-1 rounded-lg">
                    {formatCostPerAcre(treatment.costPerAcre || treatment.cost || 250)}
                  </span>
                </div>

                {/* Micro Technical Grid Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      Timing
                    </span>
                    <p className="text-xs font-bold text-gray-800">
                      {treatment.timing}
                    </p>
                  </div>
                </div>

                {/* Warning Alert Banner Strip */}
                {treatment.warning && (
                  <div className="bg-red-50 text-red-800 px-4 py-2.5 rounded-xl border border-red-100 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{treatment.warning}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Zero State Fallback */}
            {(data.treatments || []).length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">No Treatments Found</h4>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- HIGH QUALITY SPRAY SCHEDULE CALENDAR GRID --- */}
      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#31572c]" />
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Spray Schedule — Next 30 Days
            </h2>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
            {sprayDays.length} Actions Programmed
          </span>
        </div>

        {/* Interactive Grid Canvas */}
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

        {/* High Fidelity Legend Micro Systems */}
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
      </section>
    </div>
  );
}
