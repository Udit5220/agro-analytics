import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  History,
  Layers,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { getOutbreakHistory } from "../../services/diseaseGeminiService";

const CROPS_LIST = [
  "All Crops",
  "Rice",
  "Wheat",
  "Cotton",
  "Maize",
  "Mustard",
];

const DISEASES_LIST = [
  "All Diseases",
  "Blast Disease",
  "Yellow Rust",
  "Whitefly",
  "Leaf Blight",
  "Sheath Blight",
  "Alternaria Blight",
];

export default function HistoricalOutbreaks() {
  // Filter Dropdown Component States
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [selectedDisease, setSelectedDisease] = useState("All Diseases");

  const [loading, setLoading] = useState(true);
  const [outbreakData, setOutbreakData] = useState({
    outbreaks: [],
    stats: {
      totalOutbreaks: 0,
      totalAffectedArea: "0 acres",
      mostCommonDisease: "N/A"
    }
  });

  // Call dynamic service when filters change
  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadOutbreaks = async () => {
      // Strip prefix before passing coordinates filters
      const cropParam = selectedCrop === "All Crops" ? "All" : selectedCrop;
      const diseaseParam = selectedDisease === "All Diseases" ? "All" : selectedDisease;

      try {
        const result = await getOutbreakHistory(cropParam, diseaseParam);
        if (active) {
          setOutbreakData(result);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load historical outbreaks:", err);
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOutbreaks();

    return () => {
      active = false;
    };
  }, [selectedCrop, selectedDisease]);

  const getSeverityStyles = (severity) => {
    if (severity === "High") {
      return {
        borderStyle: "border-l-4 border-l-red-600",
        badgeStyle: "bg-red-50 text-red-700 border-red-200"
      };
    } else if (severity === "Moderate" || severity === "Medium") {
      return {
        borderStyle: "border-l-4 border-l-amber-500",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200"
      };
    }
    return {
      borderStyle: "border-l-4 border-l-[#4f772d]",
      badgeStyle: "bg-emerald-50 text-[#31572c] border-[#90a955]/30"
    };
  };

  const outbreaksList = outbreakData.outbreaks || [];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* --- PAGE ROOT HEADER --- */}
      <header className="border-b border-gray-200 pb-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          Epidemiological Analytics Database
        </span>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">
          Historical patterns to plan preventive action this season
        </h1>
      </header>

      {/* --- FILTER CONTROL UTILITY ACTION BAR --- */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-gray-400 mr-2">
          <Filter className="w-4 h-4 text-[#31572c]" />
        </div>

        {/* Selector Dropdown 1: Crops Filter */}
        <div className="relative">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer h-[36px]"
          >
            {CROPS_LIST.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Selector Dropdown 2: Pathogen Disease Filter */}
        <div className="relative">
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer h-[36px]"
          >
            {DISEASES_LIST.map((disease) => (
              <option key={disease} value={disease}>
                {disease}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Reset Filters Shortcut */}
        {(selectedCrop !== "All Crops" ||
          selectedDisease !== "All Diseases") && (
          <button
            onClick={() => {
              setSelectedCrop("All Crops");
              setSelectedDisease("All Diseases");
            }}
            className="text-xs font-bold text-[#31572c] hover:underline ml-auto cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        // ─── PULSING LOAD SKELETONS ───
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 border border-gray-200/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-20 bg-gray-100 border border-gray-200/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Dynamic Summary Stats Block */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Outbreaks</span>
              <h4 className="text-xl font-black text-gray-900 mt-1">{outbreakData.stats.totalOutbreaks}</h4>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Impact Area</span>
              <h4 className="text-xl font-black text-gray-900 mt-1">{outbreakData.stats.totalAffectedArea}</h4>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Frequent Vector</span>
              <h4 className="text-xs font-black text-[#31572c] mt-1 truncate">{outbreakData.stats.mostCommonDisease}</h4>
            </div>
          </div>

          {/* --- TIMELINE CONTAINER CANVAS --- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#31572c]" />
                <h2 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
                  Outbreak Timeline
                </h2>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-[#ecf39e] text-[#132a13] px-2 py-1 rounded">
                {outbreaksList.length} Registry Records Found
              </span>
            </div>

            {/* Dynamic Row Feed Map */}
            <div className="space-y-3 animate-fadeIn">
              {outbreaksList.map((record) => {
                const styles = getSeverityStyles(record.severity);
                return (
                  <div
                    key={record.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md ${styles.borderStyle}`}
                  >
                    {/* Pathology Context Block */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-sm font-black text-gray-900 tracking-tight">
                          {record.disease}
                        </h3>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles.badgeStyle}`}
                        >
                          {record.severity}
                        </span>
                      </div>

                      {/* Taxonomy Metadata Labels */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          {record.crop}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>{record.location} Region</span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {record.date}
                        </span>
                      </div>
                    </div>

                    {/* Quantitative Acreage Metric Display */}
                    <div className="text-left md:text-right flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block md:hidden">
                        Affected Impact Area
                      </span>
                      <div>
                        <span className="text-base font-black text-gray-900 font-sans tracking-tight block leading-none">
                          {record.affectedArea || `${record.affectedAcres} acres`}
                        </span>
                        {record.outcome && (
                          <span className="text-[10px] font-bold text-gray-400 mt-1 block max-w-xs">
                            {record.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Zero State Fallback UI */}
              {outbreaksList.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 space-y-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    No Historical Archives Found
                  </h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    There are no records matching the filtered selections for{" "}
                    {selectedCrop} or specified pathogen matrices.
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
