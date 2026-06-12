// src/pages/gov-schemes/farmer/FarmEligibilityCenter.jsx
import React, { useState, useMemo } from "react";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  Scale
} from "lucide-react";

const PUBLIC_SCHEMES_KNOWLEDGE_BASE = [
  {
    id: "pm_kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Income Support",
    benefits: "₹6,000 annually in 3 equal installments",
    officialLink: "https://pmkisan.gov.in/",
    rules: {
      maxLand: 99999, // Open to all landholders
      states: "All",
      requiresLandRecord: true,
      requiresAadhaar: true,
      requiresBank: true
    },
    docChecklist: ["Aadhaar Card copy", "Updated land ownership record (Jamabandi/Khatauni)", "Bank Passbook/Cancelled Cheque"]
  },
  {
    id: "pmfby",
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    category: "Crop Insurance",
    benefits: "Low-premium crop insurance covering climate risk and rainfall deficit",
    officialLink: "https://pmfby.gov.in/",
    rules: {
      maxLand: 99999,
      states: "All",
      requiresLandRecord: true,
      requiresAadhaar: true,
      requiresBank: true,
      allowedCrops: ["Rice", "Wheat", "Sugarcane", "Cotton"]
    },
    docChecklist: ["Aadhaar Card", "Land Jamabandi copy", "Crop Sowing Certificate issued by local agricultural department", "Active Bank account details"]
  },
  {
    id: "kcc",
    name: "KCC (Kisan Credit Card Crop Loan)",
    category: "Credit Support",
    benefits: "Short-term credit up to ₹3 Lakh at low 4% interest rate",
    officialLink: "https://www.myscheme.gov.in/schemes/kcc",
    rules: {
      maxLand: 99999,
      states: "All",
      requiresLandRecord: true,
      requiresAadhaar: true,
      requiresBank: true
    },
    docChecklist: ["Identity proof (Aadhaar/Voter ID)", "Land registry document copy", "Sowing verification proof"]
  },
  {
    id: "pmksy_drip",
    name: "PMKSY (Micro-Irrigation Subsidy)",
    category: "Irrigation Subsidy",
    benefits: "Up to 85% capital subsidy on Drip/Sprinkler micro-irrigation systems",
    officialLink: "https://pmksy.gov.in/",
    rules: {
      maxLand: 12.5, // 5 hectares cap
      states: "All",
      requiresLandRecord: true,
      requiresAadhaar: true,
      requiresBank: true,
      allowedCrops: ["Sugarcane", "Cotton", "Vegetables"]
    },
    docChecklist: ["Aadhaar Card copy", "Land ownership certificate", "Soil & Water feasibility audit report", "Quotations from empaneled micro-irrigation dealers"]
  },
  {
    id: "haryana_solar_pump",
    name: "Haryana Solar Water Pump Scheme",
    category: "Solar Subsidy",
    benefits: "75% subsidy on solar water pumps up to 10 HP capacity",
    officialLink: "https://hareda.gov.in/",
    rules: {
      maxLand: 25,
      states: "Haryana",
      requiresLandRecord: true,
      requiresAadhaar: true,
      requiresBank: true,
      allowedCrops: ["Rice", "Wheat", "Sugarcane"]
    },
    docChecklist: ["Aadhaar card linked with Haryana Parivar Pehchan Patra (PPP)", "Haryana Land record jamabandi copy", "Bank account verification", "Drip/Sprinkler setup layout certificate"]
  }
];

export default function FarmEligibilityCenter() {
  // 1. Initial State matching farmer context
  const [landSize, setLandSize] = useState(4.5);
  const [cropType, setCropType] = useState("Rice");
  const [state, setState] = useState("Haryana");
  const [category, setCategory] = useState("SC");
  const [aadhaarAvailable, setAadhaarAvailable] = useState(true);
  const [bankAvailable, setBankAvailable] = useState(true);
  const [landRecordAvailable, setLandRecordAvailable] = useState(false);

  // 2. Active Fix Blocker Helper state
  const [activeFixGuideline, setActiveFixGuideline] = useState(null);

  // 3. Dynamic comparison logic based on public rules
  const eligibilityAssessment = useMemo(() => {
    let matches = [];
    let overallScoresSum = 0;
    let eligibleCount = 0;

    PUBLIC_SCHEMES_KNOWLEDGE_BASE.forEach((scheme) => {
      let score = 100;
      let missingList = [];
      let reasons = [];

      // Check State rule
      if (scheme.rules.states !== "All" && scheme.rules.states !== state) {
        score = 0;
        reasons.push(`Scheme restricted to ${scheme.rules.states} state residents.`);
      }

      // Check Land Size rule
      if (landSize > scheme.rules.maxLand) {
        score = Math.max(0, score - 30);
        reasons.push(`Land size exceeds the maximum limit of ${scheme.rules.maxLand} acres.`);
      }

      // Check Crops rule
      if (scheme.rules.allowedCrops && !scheme.rules.allowedCrops.includes(cropType)) {
        score = Math.max(0, score - 20);
        reasons.push(`Scheme targets different crop configurations (allowed: ${scheme.rules.allowedCrops.join(", ")}).`);
      }

      // Document availability scoring
      if (scheme.rules.requiresAadhaar && !aadhaarAvailable) {
        score = Math.max(0, score - 33);
        missingList.push("Aadhaar Card");
      }
      if (scheme.rules.requiresBank && !bankAvailable) {
        score = Math.max(0, score - 33);
        missingList.push("Bank Account");
      }
      if (scheme.rules.requiresLandRecord && !landRecordAvailable) {
        score = Math.max(0, score - 34);
        missingList.push("Land Registry Ownership Deed (Jamabandi/Khatauni)");
      }

      if (score >= 70) {
        eligibleCount++;
      }

      overallScoresSum += score;

      matches.push({
        ...scheme,
        readinessScore: score,
        missing: missingList,
        reasons
      });
    });

    const averageReadiness = Math.round(overallScoresSum / PUBLIC_SCHEMES_KNOWLEDGE_BASE.length);

    return {
      matches,
      averageReadiness,
      eligibleCount
    };
  }, [landSize, cropType, state, category, aadhaarAvailable, bankAvailable, landRecordAvailable]);

  const getScoreColorClass = (score) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-250";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-250";
    return "text-red-700 bg-red-50 border-red-250";
  };

  const getMeterGradient = (score) => {
    if (score >= 80) return "from-emerald-400 to-emerald-600";
    if (score >= 50) return "from-amber-400 to-amber-600";
    return "from-rose-400 to-rose-600";
  };

  const handleFixRedirect = (requirementName) => {
    let guide = "";
    if (requirementName.toLowerCase().includes("land")) {
      guide = "Step 1: Visit the Haryana land records website (Jamabandi portal) or your local Tehsil office.\nStep 2: Apply for an updated copy of your Jamabandi.\nStep 3: Keep the Khasra/Khatauni numbers handy for online portal verification.";
    } else if (requirementName.toLowerCase().includes("aadhaar")) {
      guide = "Step 1: Locate the nearest Aadhaar enrollment center (CSC/Bank branch).\nStep 2: Carry proof of address and identity.\nStep 3: File bio-metric update and obtain enrollment receipt.";
    } else {
      guide = "Step 1: Visit your nearest public sector bank branch.\nStep 2: Carry Aadhaar, land documents, and passbook.\nStep 3: Fill the Aadhaar-seeding consent form to enable Direct Benefit Transfer (DBT).";
    }
    setActiveFixGuideline({ name: requirementName, stepGuide: guide });
  };

  return (
    <div className="p-1 sm:p-2 bg-[#f4f7f4]/40 min-h-screen font-sans animate-fadeIn max-w-7xl mx-auto space-y-4">
      {/* 1. Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-darkest/10 rounded-xl">
          <FileCheck className="h-5 w-5 text-brand-medium" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-brand-darkest">Eligibility & Compliance Center</h1>
          <p className="text-xs text-gray-500">
            Self-assess your program readiness using publicly available government criteria rules.
          </p>
        </div>
      </div>

      {/* Disclamer block */}
      <div className="bg-[#f4f7f0] border border-brand-medium/10 rounded-xl p-3 text-xs text-gray-655 font-semibold leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-brand-medium shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> This module displays readiness assessments and opportunity guidance calculated from 
          officially published rules. It does not access private government records or databases, nor does it guarantee scheme approval. 
          All final submissions must be completed through official portals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side: Interactive Input parameters */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm space-y-4 self-start">
          <div className="border-b border-gray-100 pb-2.5">
            <h3 className="text-xs font-black text-brand-darkest uppercase tracking-wider">Readiness Assessment Inputs</h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Toggle farm parameters to recalculate matches</p>
          </div>

          <div className="space-y-3.5 text-xs font-bold text-gray-700">
            <div>
              <label className="block text-gray-500 font-bold mb-1">Land Size (Acres)</label>
              <input
                type="number"
                value={landSize}
                onChange={(e) => setLandSize(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-brand-medium"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-bold mb-1">Primary Crop Season Focus</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium cursor-pointer"
              >
                <option value="Rice">Rice (Paddy)</option>
                <option value="Wheat">Wheat</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Cotton">Cotton</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 font-bold mb-1">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium cursor-pointer"
                >
                  <option value="Haryana">Haryana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium cursor-pointer"
                >
                  <option value="SC">SC / ST</option>
                  <option value="OBC">OBC</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Document Checklists</label>
              
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aadhaarAvailable}
                  onChange={(e) => setAadhaarAvailable(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Aadhaar Card Available</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bankAvailable}
                  onChange={(e) => setBankAvailable(e.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Bank Account Seeded</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={landRecordAvailable}
                  onChange={(e) => setLandRecordAvailable(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600"
                />
                <span>Land Ownership Deed Ready</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Results Dashboards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Circular Readiness Meter and Opportunities Gap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Meter */}
            <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm text-center flex flex-col items-center justify-center space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Readiness Index</span>
              
              <div className="relative flex items-center justify-center w-24 h-24 mt-1">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="#f1f3f1" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={(2 * Math.PI * 38) - (eligibilityAssessment.averageReadiness / 100) * (2 * Math.PI * 38)}
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${
                      eligibilityAssessment.averageReadiness >= 80 
                        ? "text-emerald-500" 
                        : eligibilityAssessment.averageReadiness >= 50 
                        ? "text-amber-500" 
                        : "text-rose-500"
                    }`}
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-xl font-black text-gray-900 leading-none">{eligibilityAssessment.averageReadiness}%</p>
                </div>
              </div>
              
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getScoreColorClass(eligibilityAssessment.averageReadiness)}`}>
                {eligibilityAssessment.averageReadiness >= 80 ? "High Match" : eligibilityAssessment.averageReadiness >= 50 ? "Medium Match" : "Low Match"}
              </span>
            </div>

            {/* Matched Count */}
            <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Likely Eligible</span>
                <p className="text-3xl font-black text-gray-900 mt-2 leading-none">{eligibilityAssessment.eligibleCount}</p>
                <p className="text-xs text-gray-450 mt-2 font-semibold">Matched programs that align closely with your current profile setup.</p>
              </div>
              <span className="text-[9px] font-bold text-[#4f772d] bg-green-50/40 px-2 py-0.5 rounded border border-green-100 block self-start">Official Schemes</span>
            </div>

            {/* Missing documents count */}
            <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Unlocking Potential</span>
                <p className="text-xs font-black text-brand-darkest mt-2 block">Complete pending files to access 3 restricted state subsidies.</p>
              </div>
              {!landRecordAvailable && (
                <div className="bg-rose-50 border border-rose-100 p-2 rounded-lg text-[10px] font-bold text-rose-700 flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>Land record copy missing!</span>
                </div>
              )}
            </div>
          </div>

          {/* Matched Schemes List */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-black text-brand-darkest uppercase tracking-wider">Matched Schemes Assessment</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Eligibility predictions derived from public notifications</p>
            </div>

            <div className="space-y-3">
              {eligibilityAssessment.matches.map((item) => (
                <div key={item.id} className="border border-gray-150 rounded-xl p-4 space-y-3 hover:border-gray-350 transition duration-150">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded text-[9px] font-extrabold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-black text-brand-darkest mt-1.5">{item.name}</h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-500 font-bold">Match score:</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getScoreColorClass(item.readinessScore)}`}>
                        {item.readinessScore}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Subsidy Benefits</span>
                      <span className="font-bold text-gray-700 mt-0.5 block">{item.benefits}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Portal Reference</span>
                      <a
                        href={item.officialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-medium hover:underline font-bold mt-0.5 flex items-center gap-1"
                      >
                        Official Website <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {item.reasons.length > 0 && (
                    <div className="bg-red-50/50 border border-red-100 p-2.5 rounded-lg text-[10px] font-bold text-red-700 leading-normal">
                      <p>Exclusion Rules Triggered:</p>
                      <ul className="list-disc pl-3 mt-1 font-semibold">
                        {item.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Requirements Checklist */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Required Documents Checklist</span>
                    <div className="flex flex-wrap gap-2">
                      {item.docChecklist.map((doc, idx) => {
                        const isDocMissing = (doc.toLowerCase().includes("land") && !landRecordAvailable) ||
                                             (doc.toLowerCase().includes("aadhaar") && !aadhaarAvailable) ||
                                             (doc.toLowerCase().includes("bank") && !bankAvailable);
                        return (
                          <span
                            key={idx}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              isDocMissing
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {isDocMissing ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            <span>{doc}</span>
                            {isDocMissing && (
                              <button
                                onClick={() => handleFixRedirect(doc)}
                                className="text-[9px] text-red-800 underline ml-1 font-extrabold cursor-pointer hover:text-red-950"
                              >
                                Fix
                              </button>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Guide detail modal */}
      {activeFixGuideline && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-150 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setActiveFixGuideline(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:bg-gray-150 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3 border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-black text-brand-darkest leading-snug">
              Resolution Guide: {activeFixGuideline.name}
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Instructions from official citizen portals</p>

            <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-xs font-bold leading-relaxed text-gray-700 space-y-2 mt-4">
              {activeFixGuideline.stepGuide.split("\n").map((step, idx) => (
                <p key={idx}>{step}</p>
              ))}
            </div>

            <button
              onClick={() => setActiveFixGuideline(null)}
              className="w-full mt-4 py-2 bg-brand-darkest text-white text-xs font-bold rounded-lg hover:bg-brand-medium transition"
            >
              Acknowledge Guide
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
