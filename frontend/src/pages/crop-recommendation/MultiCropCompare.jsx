import React from "react";
import { X, Plus, HelpCircle, Columns } from "lucide-react";

export default function MultiCropCompare() {
  // Static crop configurations matching the visualization matrix
  const selectedCrops = [
    { id: "wheat", name: "Wheat", color: "#4f772d" },
    { id: "rice", name: "Rice", color: "#132a13" },
    { id: "maize", name: "Maize", color: "#90a955" },
  ];

  const attributes = [
    {
      label: "Suitability Score",
      wheat: { value: "92/100", status: "optimal" },
      rice: { value: "85/100", status: "neutral" },
      maize: { value: "78/100", status: "warning" },
    },
    {
      label: "Yield (qtl/acre)",
      wheat: { value: "22 qtl", status: "neutral" },
      rice: { value: "18 qtl", status: "warning" },
      maize: { value: "25 qtl", status: "optimal" },
    },
    {
      label: "ROI (₹/acre)",
      wheat: { value: "₹18,400", status: "optimal" },
      rice: { value: "₹15,200", status: "neutral" },
      maize: { value: "₹12,800", status: "warning" },
    },
    {
      label: "Water Need",
      wheat: { value: "Medium", status: "optimal" },
      rice: { value: "Very High", status: "warning" },
      maize: { value: "Medium", status: "optimal" },
    },
    {
      label: "Pest Risk",
      wheat: { value: "Low", status: "optimal" },
      rice: { value: "High", status: "warning" },
      maize: { value: "Medium", status: "neutral" },
    },
    {
      label: "Market Demand",
      wheat: { value: "Very High", status: "optimal" },
      rice: { value: "Very High", status: "optimal" },
      maize: { value: "High", status: "warning" },
    },
    {
      label: "Harvest Days",
      wheat: { value: "120 days", status: "neutral" },
      rice: { value: "135 days", status: "warning" },
      maize: { value: "90 days", status: "optimal" },
    },
  ];

  const getBadgeStyle = (status) => {
    switch (status) {
      case "optimal":
        return "bg-[#ecf39e] text-[#132a13] font-bold";
      case "warning":
        return "bg-red-50 text-red-750 border border-red-200/50 font-medium";
      default:
        return "text-gray-900 font-medium";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Columns className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Multi-Crop Comparison Matrix</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              फसल तुलना
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Compare crop suitability, water demands, harvest cycles, and economic returns side-by-side.
        </p>
      </div>

      <div className="space-y-4">
        {/* --- TOP BANNER / CONTROLS --- */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block w-full mb-1">
            Compare up to 4 crops side-by-side
          </span>

          {/* Active Chips */}
          {selectedCrops.map((crop) => (
            <div
              key={crop.id}
              className="flex items-center gap-1.5 bg-[#31572c] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
            >
              <span>{crop.name}</span>
              <button className="hover:text-[#ecf39e] transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add Crop Button */}
          <button className="flex items-center gap-1.5 border-2 border-dashed border-[#90a955] text-[#31572c] bg-white/60 hover:bg-white px-3 py-1.2 rounded-full text-xs font-bold transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Crop</span>
          </button>
        </div>

        {/* --- MAIN SPLIT CONTAINER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* TABLE COMPARISON CANVAS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#f4f7f4]/50">
                    <th className="p-4 text-xs font-bold text-[#31572c] tracking-wide uppercase max-w-[160px]">
                      Attribute
                    </th>
                    <th className="p-4 text-sm font-black text-[#4f772d] tracking-tight">
                      Wheat
                    </th>
                    <th className="p-4 text-sm font-black text-[#132a13] tracking-tight">
                      Rice
                    </th>
                    <th className="p-4 text-sm font-black text-[#90a955] tracking-tight">
                      Maize
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attributes.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#f4f7f4]/30 transition-colors"
                    >
                      {/* Attribute Label */}
                      <td className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider max-w-[160px]">
                        {row.label}
                      </td>

                      {/* Wheat Metrics */}
                      <td className="p-4 text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs inline-block ${getBadgeStyle(row.wheat.status)}`}
                        >
                          {row.wheat.value}
                        </span>
                      </td>

                      {/* Rice Metrics */}
                      <td className="p-4 text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs inline-block ${getBadgeStyle(row.rice.status)}`}
                        >
                          {row.rice.value}
                        </span>
                      </td>

                      {/* Maize Metrics */}
                      <td className="p-4 text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs inline-block ${getBadgeStyle(row.maize.status)}`}
                        >
                          {row.maize.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RADAR OVERVIEW CARD */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h3 className="text-sm font-bold text-gray-950 tracking-tight mb-4 flex items-center gap-1.5">
                Radar Overview
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </h3>

              {/* Vector Radar Visualization */}
              <div className="relative w-full aspect-square max-w-[260px] mx-auto my-2 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transform -rotate-18"
                >
                  {/* Concentric Web Grid Lines */}
                  <polygon
                    points="50,10 88,38 73,83 27,83 12,38"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.75"
                  />
                  <polygon
                    points="50,22 78,42 67,74 33,74 22,42"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                    strokeDasharray="1"
                  />
                  <polygon
                    points="50,34 69,47 61,65 39,65 31,47"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />

                  {/* Axis Spokes */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="10"
                    stroke="#f3f4f6"
                    strokeWidth="0.75"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="88"
                    y2="38"
                    stroke="#f3f4f6"
                    strokeWidth="0.75"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="73"
                    y2="83"
                    stroke="#f3f4f6"
                    strokeWidth="0.75"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="27"
                    y2="83"
                    stroke="#f3f4f6"
                    strokeWidth="0.75"
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="12"
                    y2="38"
                    stroke="#f3f4f6"
                    strokeWidth="0.75"
                  />

                  {/* Wheat Polygon Array (Active Element Green #4f772d) */}
                  <polygon
                    points="50,16 82,39 68,75 34,70 18,39"
                    fill="#4f772d"
                    fillOpacity="0.15"
                    stroke="#4f772d"
                    strokeWidth="1.5"
                  />

                  {/* Rice Polygon Array (Deep Forest Green #132a13) */}
                  <polygon
                    points="50,24 74,40 60,80 40,81 24,45"
                    fill="#132a13"
                    fillOpacity="0.1"
                    stroke="#132a13"
                    strokeWidth="1.5"
                  />

                  {/* Maize Polygon Array (Sage Accent #90a955) */}
                  <polygon
                    points="50,28 85,38 65,68 31,78 20,41"
                    fill="#90a955"
                    fillOpacity="0.15"
                    stroke="#90a955"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Fixed Labels overlaid around the SVG container */}
                <span className="absolute top-0 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Suit.
                </span>
                <span className="absolute right-0 top-[35%] text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Yield
                </span>
                <span className="absolute right-3 bottom-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  ROI
                </span>
                <span className="absolute bottom-0 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Water
                </span>
                <span className="absolute left-3 bottom-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Pest
                </span>
                <span className="absolute left-0 top-[35%] text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Demand
                </span>
              </div>
            </div>

            {/* Micro Telemetry Legend System */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4f772d]"></span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Wheat
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#132a13]"></span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Rice
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#90a955]"></span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Maize
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
