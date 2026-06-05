import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  BellOff,
  ShieldCheck,
  ChevronDown,
  ShieldAlert,
  Thermometer,
  Droplet,
  Loader2
} from "lucide-react";
import { getPestRisks } from "../../../services/geminiService";

const GROWTH_STAGES = ["Seed", "Germination", "Vegetative", "Flowering", "Harvest"];
const CROP_LIST = ["Wheat", "Rice", "Maize"];

export default function PestRiskDetection() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedStage, setSelectedStage] = useState("Vegetative");
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(65);
  
  const [mutedAlerts, setMutedAlerts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic risk parameters loaded from Gemini/fallback
  const [riskData, setRiskData] = useState({
    risks: [
      { id: "yellow_rust", name: "Yellow Rust", nameHindi: "पीला रतुआ", severity: "High", description: "Airborne fungal disease — spreads fast in cool, humid weather.", probability: 72, outbreakNearby: true },
      { id: "aphids", name: "Aphids", nameHindi: "माहू", severity: "Medium", description: "Sap-sucking insects, reduce photosynthesis and spread viruses.", probability: 55, outbreakNearby: false },
      { id: "leaf_blight", name: "Leaf Blight", nameHindi: "पत्ती झुलसा", severity: "Medium", description: "Fungal attack causing browning and drying of leaves.", probability: 45, outbreakNearby: false },
      { id: "powdery_mildew", name: "Powdery Mildew", nameHindi: "सफेद चूर्ण", severity: "Low", description: "White powdery fungal coating on leaves, reduces grain fill.", probability: 38, outbreakNearby: false },
      { id: "army_worm", name: "Army Worm", nameHindi: "सेना कीड़ा", severity: "Low", description: "Leaf-eating caterpillar, mostly a concern during vegetative stage.", probability: 22, outbreakNearby: false }
    ],
    resistantVarieties: [
      { name: "PBW 343", advantage: "+18% yield over local variety", university: "Punjab Agriculture Univ." },
      { name: "HD 2967", advantage: "Rust-resistant, widely adopted", university: "IARI New Delhi" },
      { name: "GW 322", advantage: "Tolerant to dry conditions", university: "Gujarat Agri Univ." }
    ]
  });

  useEffect(() => {
    let active = true;

    // Premium 400ms debounce delay to buffer rapid slider dragging events
    const delayTimer = setTimeout(() => {
      setIsLoading(true);
      const loadPestRisks = async () => {
        try {
          const result = await getPestRisks(
            selectedCrop,
            selectedStage,
            temperature,
            humidity,
            'Faridabad' // default region
          );
          if (active) {
            setRiskData(result);
          }
        } catch (err) {
          console.error("Failed to load pest risk analytics:", err);
        } finally {
          if (active) {
            setIsLoading(false);
          }
        }
      };

      loadPestRisks();
    }, 400);

    return () => {
      active = false;
      clearTimeout(delayTimer);
    };
  }, [selectedCrop, selectedStage, temperature, humidity]);

  const toggleAlert = (id) => {
    setMutedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityBadgeStyle = (sev) => {
    if (sev === "High") return "bg-red-50 text-red-750 border border-red-200";
    if (sev === "Medium") return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-emerald-50 text-[#31572c] border border-[#90a955]/30";
  };

  const getProbabilityBarColor = (prob) => {
    if (prob >= 70) return "bg-red-600";
    if (prob >= 40) return "bg-amber-500";
    return "bg-[#31572c]";
  };

  // Check if any active risk has an outbreak alert nearby
  const hasOutbreakAlert = riskData.risks.some(r => r.outbreakNearby === true || r.outbreakNearby === "true");

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
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
        
        {/* --- CONTROLS BAR WITH SLIDERS --- */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 items-center">
            
            {/* Left selector fields */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Crop Selector dropdown */}
              <div className="flex-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Select Crop
                </span>
                <div className="relative inline-block w-full">
                  <select 
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer"
                  >
                    {CROP_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Growth Stage Horizontal Pill Toggle Selection */}
              <div className="flex-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Growth Stage
                </span>
                <div className="relative inline-block w-full">
                  <select 
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] cursor-pointer"
                  >
                    {GROWTH_STAGES.map(s => (
                      <option key={s} value={s}>{s} Stage</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right: Weather parameters sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="h-3.5 w-3.5 text-[#90a955]" />
                    Temperature
                  </label>
                  <span className="text-[#31572c] font-bold text-xs">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded accent-[#31572c] cursor-pointer"
                />
              </div>

              {/* Humidity Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Droplet className="h-3.5 w-3.5 text-[#90a955]" />
                    Humidity Ratio
                  </label>
                  <span className="text-[#31572c] font-bold text-xs">{humidity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full h-1 bg-gray-100 rounded accent-[#31572c] cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* --- RISK MATRIX CANVAS --- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          
          {/* Outbreak warning alert strip */}
          {hasOutbreakAlert && (
            <div className="bg-red-50 border-b border-red-200/60 p-4 text-red-800 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <AlertTriangle className="h-4.5 w-4.5 text-red-600 animate-bounce" />
              <span>Outbreak alert in neighboring district — monitor immediately</span>
            </div>
          )}

          {/* Section Inner Title Header */}
          <div className="bg-[#f4f7f4]/50 border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-[#132a13] tracking-tight">
                Risk Matrix — {selectedCrop} ·{" "}
                <span className="text-[#31572c]">{selectedStage} Stage</span>
              </h2>
            </div>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c]" />
                Analyzing...
              </div>
            )}
          </div>

          {/* Risk Metric List */}
          <div className={`divide-y divide-gray-100 ${isLoading ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-200`}>
            {riskData.risks.map((risk) => (
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
                      {risk.nameHindi || risk.hindiName}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getSeverityBadgeStyle(risk.severity)}`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 tracking-normal leading-relaxed">
                    {risk.description || risk.desc}
                  </p>
                </div>

                {/* Probability Tracking Sliders Layer with Transition */}
                <div className="flex items-center gap-4 flex-1 md:max-w-md w-full">
                  <div className="w-full space-y-1">
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProbabilityBarColor(risk.probability)}`}
                        style={{ width: `${risk.probability}%`, transition: "width 0.4s ease" }}
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
            {riskData.resistantVarieties.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <h4 className="text-sm font-black text-[#132a13] group-hover:text-[#31572c] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{item.university}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50">
                  <span className="inline-block text-[10px] font-bold bg-[#ecf39e] text-[#132a13] px-2.5 py-1 rounded-md border border-[#90a955]/20">
                    {item.advantage}
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
