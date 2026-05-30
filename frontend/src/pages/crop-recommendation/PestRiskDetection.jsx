import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  BellOff,
  ShieldCheck,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";

export default function PestRiskDetection() {
  const [selectedStage, setSelectedStage] = useState("Vegetative");
  const [mutedAlerts, setMutedAlerts] = useState({});

  const growthStages = [
    "Seed",
    "Germination",
    "Vegetative",
    "Flowering",
    "Harvest",
  ];

  const risks = [
    {
      id: "yellow_rust",
      name: "Yellow Rust",
      hindiName: "पीला रतुआ",
      level: "High",
      desc: "Airborne fungal disease — spreads fast in cool, humid weather.",
      probability: 72,
      color: "bg-red-600",
      badgeStyle: "bg-red-50 text-red-700 border border-red-200",
    },
    {
      id: "aphids",
      name: "Aphids",
      hindiName: "माहू",
      level: "Medium",
      desc: "Sap-sucking insects, reduce photosynthesis and spread viruses.",
      probability: 55,
      color: "bg-amber-500",
      badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    {
      id: "leaf_blight",
      name: "Leaf Blight",
      hindiName: "पत्ती झुलसा",
      level: "Medium",
      desc: "Fungal attack causing browning and drying of leaves.",
      probability: 45,
      color: "bg-amber-500",
      badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    {
      id: "powdery_mildew",
      name: "Powdery Mildew",
      hindiName: "सफेद चूर्ण",
      level: "Low",
      desc: "White powdery fungal coating on leaves, reduces grain fill.",
      probability: 38,
      color: "bg-[#4f772d]",
      badgeStyle: "bg-emerald-50 text-[#31572c] border border-[#90a955]/30",
    },
    {
      id: "army_worm",
      name: "Army Worm",
      hindiName: "सेना कीड़ा",
      level: "Low",
      desc: "Leaf-eating caterpillar, mostly a concern during vegetative stage.",
      probability: 22,
      color: "bg-[#4f772d]",
      badgeStyle: "bg-emerald-50 text-[#31572c] border border-[#90a955]/30",
    },
  ];

  const suggestions = [
    {
      id: "pbw343",
      name: "PBW 343",
      source: "Punjab Agriculture Univ.",
      highlight: "+18% yield over local variety",
    },
    {
      id: "hd2967",
      name: "HD 2967",
      source: "IARI New Delhi",
      highlight: "Rust-resistant, widely adopted",
    },
    {
      id: "gw322",
      name: "GW 322",
      source: "Gujarat Agri Univ.",
      highlight: "Tolerant to dry conditions",
    },
  ];

  const toggleAlert = (id) => {
    setMutedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Pest & Disease Risk Scanner</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              कीट और रोग जोखिम
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Monitor localized pathogen probability indices and view recommended defensive treatments.
        </p>
      </div>

      <div className="space-y-6">
        {/* --- CONTROLS BAR --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            {/* Crop Selector dropdown mimicking your wireframe header */}
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Crop
              </span>
              <div className="relative inline-block">
                <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer">
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Maize</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Growth Stage Horizontal Pill Toggle Selection */}
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Growth Stage
              </span>
              <div className="flex flex-wrap gap-1.5">
                {growthStages.map((stage) => {
                  const isActive = selectedStage === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => setSelectedStage(stage)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#31572c] text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-[#f4f7f4]"
                      }`}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* --- RISK MATRIX CANVAS --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section Inner Title Header */}
          <div className="bg-[#f4f7f4]/50 border-b border-gray-100 p-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-[#132a13] tracking-tight">
              Risk Matrix — Wheat ·{" "}
              <span className="text-[#31572c]">{selectedStage} Stage</span>
            </h2>
          </div>

          {/* Risk Metric List */}
          <div className="divide-y divide-gray-100">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f4f7f4]/20 transition-colors"
              >
                {/* Information Layer */}
                <div className="space-y-1.5 flex-1 max-w-xl">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-sm font-black text-gray-900">
                      {risk.name}
                    </span>
                    <span className="text-xs font-medium text-gray-400 font-hindi">
                      {risk.hindiName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${risk.badgeStyle}`}
                    >
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 tracking-normal leading-relaxed">
                    {risk.desc}
                  </p>
                </div>

                {/* Probability Tracking Sliders Layer */}
                <div className="flex items-center gap-4 flex-1 md:max-w-md w-full">
                  <div className="w-full space-y-1">
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${risk.color}`}
                        style={{ width: `${risk.probability}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold tracking-wider uppercase">
                      <span>Probability</span>
                      <span className="text-gray-900 font-black">
                        {risk.probability}%
                      </span>
                    </div>
                  </div>

                  {/* Configurable Alert Notifications Action Block */}
                  <button
                    onClick={() => toggleAlert(risk.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${
                      mutedAlerts[risk.id]
                        ? "bg-gray-50 border-gray-200 text-gray-400"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    {mutedAlerts[risk.id] ? (
                      <BellOff className="w-3.5 h-3.5" />
                    ) : (
                      <Bell className="w-3.5 h-3.5 text-[#4f772d]" />
                    )}
                    <span>Alert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECONDARY RESISTANT VARIETIES CONTAINER --- */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#31572c]" />
            <h3 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
              Resistant Variety Suggestions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <h4 className="text-sm font-black text-[#132a13] group-hover:text-[#31572c] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{item.source}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50">
                  <span className="inline-block text-[10px] font-bold bg-[#ecf39e] text-[#132a13] px-2.5 py-1 rounded-md border border-[#90a955]/20">
                    {item.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
