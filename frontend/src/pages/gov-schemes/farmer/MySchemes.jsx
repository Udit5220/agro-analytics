// src/pages/gov-schemes/farmer/MySchemes.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { govSchemesApi } from "../../../services/apiService";
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  Info,
  Check,
  X,
  FileText,
  BookmarkCheck,
  Compass
} from "lucide-react";

// Mock fallback data representing the schema in case API fails
const MOCK_SCHEMES_DB = [
  {
    _id: "scheme_001",
    name: "PM Kisan Samman Nidhi",
    category: "DBT",
    benefitAmount: "₹6,000 / year",
    description: "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
    eligibilityMatch: 100,
    deadlineDate: "2026-06-30",
    daysRemaining: 20,
    blockerField: null,
    blockerDescription: null,
    officialPortalUrl: "https://pmkisan.gov.in/",
    documentsRequired: ["Aadhaar Card", "Land Registry Details", "Bank Passbook"]
  },
  {
    _id: "scheme_002",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "Insurance",
    benefitAmount: "Up to ₹50,000 / hectare crop cover",
    description: "Financial support to farmers suffering crop loss/damage arising out of natural calamities.",
    eligibilityMatch: 95,
    deadlineDate: "2026-06-15",
    daysRemaining: 5,
    blockerField: "land_records",
    blockerDescription: "Land registry record (Khatauni) is not uploaded or verified in your profile.",
    officialPortalUrl: "https://pmfby.gov.in/",
    documentsRequired: ["Land record (Khatauni)", "Sowing Certificate", "Aadhaar Card"]
  },
  {
    _id: "scheme_003",
    name: "PMKSY (Micro Irrigation Subsidy)",
    category: "Subsidy",
    benefitAmount: "Up to 85% subsidy on Drip/Sprinkler systems",
    description: "Financial assistance for installing water-saving micro-irrigation systems to improve crop yield.",
    eligibilityMatch: 88,
    deadlineDate: "2026-07-15",
    daysRemaining: 35,
    blockerField: "bank_seeding",
    blockerDescription: "Your bank account is not linked/seeded with your Aadhaar Card for Direct Benefit Transfer.",
    officialPortalUrl: "https://www.myscheme.gov.in/schemes/pmksypdmc",
    documentsRequired: ["Aadhaar Card", "Land Jamabandi", "Irrigation Feasibility Report", "Caste Certificate"]
  },
  {
    _id: "scheme_004",
    name: "Kisan Credit Card (KCC) Crop Loan",
    category: "Loan",
    benefitAmount: "Up to ₹3 Lakh loan at 4% interest rate",
    description: "Short term credit facility for crop cultivation, post-harvest expenses, and maintenance of farm assets.",
    eligibilityMatch: 100,
    deadlineDate: "2026-08-31",
    daysRemaining: 82,
    blockerField: null,
    blockerDescription: null,
    officialPortalUrl: "https://www.myscheme.gov.in/schemes/kcc",
    documentsRequired: ["Aadhaar Card", "Land Jamabandi copy", "Crop Sowing proof"]
  }
];

export default function MySchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [activeFixBlocker, setActiveFixBlocker] = useState(null);
  const [browseTab, setBrowseTab] = useState("matched"); // "matched" | "all"
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const res = await govSchemesApi.getSchemes();
        console.log("DEBUG: govSchemesApi.getSchemes() response:", res);
        if (res && res.success && res.schemes) {
          const mapped = res.schemes.map(scheme => {
            let daysRemaining = 30;
            let deadlineDate = scheme.deadline || "2026-07-31";
            if (deadlineDate && deadlineDate !== "Ongoing") {
              const diffTime = new Date(deadlineDate) - new Date();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (!isNaN(diffDays)) daysRemaining = diffDays;
            } else {
              deadlineDate = "Ongoing";
              daysRemaining = 999;
            }

            let blockerField = null;
            let blockerDescription = null;
            if (scheme.statusType === 'action_needed' || scheme.status === 'action_needed') {
              blockerField = "bank_seeding";
              blockerDescription = "Your bank account is not linked/seeded with your Aadhaar Card for Direct Benefit Transfer.";
            }

            const docRequiredMap = {
              "PM Kisan Samman Nidhi": ["Aadhaar Card", "Land Registry Details", "Bank Passbook"],
              "Pradhan Mantri Fasal Bima Yojana (PMFBY)": ["Land record (Khatauni)", "Sowing Certificate", "Aadhaar Card"],
              "PMKSY (Micro Irrigation Subsidy)": ["Aadhaar Card", "Land Jamabandi", "Irrigation Feasibility Report", "Caste Certificate"],
              "Kisan Credit Card (KCC) Crop Loan": ["Aadhaar Card", "Land Jamabandi copy", "Crop Sowing proof"]
            };

            // Normalize category for filtering alignment ("Direct Benefit" -> "DBT", "Credit" -> "Loan", etc.)
            let normalizedCategory = scheme.category || "Subsidy";
            const catLower = normalizedCategory.toLowerCase();
            if (catLower.includes("direct") || catLower.includes("dbt")) {
              normalizedCategory = "DBT";
            } else if (catLower.includes("credit") || catLower.includes("loan")) {
              normalizedCategory = "Loan";
            } else if (catLower.includes("insurance")) {
              normalizedCategory = "Insurance";
            } else if (catLower.includes("subsidy") || catLower.includes("organic") || catLower.includes("livestock") || catLower.includes("service") || catLower.includes("state")) {
              normalizedCategory = "Subsidy";
            }

            return {
              _id: scheme._id || `scheme_${scheme.id}`,
              id: scheme.id,
              name: scheme.name,
              category: normalizedCategory,
              benefitAmount: scheme.benefit || "Financial Support",
              description: scheme.details?.description || scheme.description || "No description available.",
              eligibilityMatch: scheme.matchScore !== undefined ? scheme.matchScore : 100,
              deadlineDate: deadlineDate,
              daysRemaining: daysRemaining,
              blockerField: scheme.blockerField || blockerField,
              blockerDescription: scheme.blockerDescription || blockerDescription,
              officialPortalUrl: (() => {
                if (scheme.officialPortalUrl) return scheme.officialPortalUrl;
                const nameLower = scheme.name.toLowerCase();
                if (nameLower.includes("kisan samman") || nameLower.includes("pm-kisan") || nameLower.includes("pm kisan")) {
                  return "https://pmkisan.gov.in/";
                }
                if (nameLower.includes("fasal bima") || nameLower.includes("pmfby") || nameLower.includes("insurance")) {
                  return "https://pmfby.gov.in/";
                }
                if (nameLower.includes("pmksy") || nameLower.includes("irrigation") || nameLower.includes("drip") || nameLower.includes("sprinkler") || nameLower.includes("khet ko pani")) {
                  return "https://www.myscheme.gov.in/schemes/pmksypdmc";
                }
                if (nameLower.includes("kcc") || nameLower.includes("kisan credit") || nameLower.includes("crop loan") || nameLower.includes("loan")) {
                  return "https://www.myscheme.gov.in/schemes/kcc";
                }
                return "https://www.myscheme.gov.in/";
              })(),
              documentsRequired: scheme.documentsRequired || docRequiredMap[scheme.name] || ["Aadhaar Card", "Land Ownership details"]
            };
          });
          setSchemes(mapped);
          setErrorMsg(null);
        } else {
          console.warn("API returned success: false or missing schemes, falling back.");
          setErrorMsg("API returned success: false or missing schemes. Using fallback offline schemes.");
          setSchemes(MOCK_SCHEMES_DB);
        }
      } catch (err) {
        console.error("Failed to load schemes, falling back to mock database:", err);
        setErrorMsg(`Failed to connect to backend: ${err.message}. Using offline fallback schemes.`);
        setSchemes(MOCK_SCHEMES_DB);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f4]/40 flex items-center justify-center font-sans">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2e4057] mx-auto mb-2"></div>
          <p className="text-xs font-bold text-gray-500">Syncing live database schemes...</p>
        </div>
      </div>
    );
  }

  // Filter Categories list
  const categories = ["all", "DBT", "Insurance", "Subsidy", "Loan"];

  // Filter and compute statistics
  const displaySchemes = schemes.filter(scheme => {
    // 1. Browse All toggle filter
    if (browseTab === "matched" && scheme.eligibilityMatch < 70) {
      return false;
    }
    // 2. Category filter
    if (filterCategory !== "all" && scheme.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  console.log("DEBUG: schemes total count = ", schemes.length, "browseTab = ", browseTab, "filterCategory = ", filterCategory, "display schemes count = ", displaySchemes.length);

  const totalMatched = schemes.filter(s => s.eligibilityMatch >= 70).length;
  const needActionCount = schemes.filter(s => s.eligibilityMatch >= 70 && ((s.daysRemaining >= 0 && s.daysRemaining < 7) || s.blockerField)).length;

  const handleFixIssue = (scheme) => {
    setActiveFixBlocker(scheme);
  };

  const handleApplyRedirect = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4]/40 p-1 sm:p-2 font-sans">
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto mb-2.5">
        <div className="bg-gradient-to-r from-[#2e4057] to-[#28a745] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-8 translate-y-8 pointer-events-none">
            <FileText className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <span className="bg-[#52b788]/30 text-[#d8f3dc] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              My Schemes
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1.5 leading-tight">
              {totalMatched} Matched Opportunities
            </h1>
            <p className="text-xs text-gray-250 mt-0.5 max-w-2xl font-medium">
              Schemes matched automatically for you based on land size (4.5 acres), crops (Rice/Wheat), and SC category.
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2.5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#ffb703] animate-pulse"></div>
                <div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase">Needs Action</p>
                  <p className="text-sm font-black text-white">{needActionCount} Scheme(s)</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2.5 border border-white/10">
                <CheckCircle className="w-4 h-4 text-[#52b788]" />
                <div>
                  <p className="text-[9px] text-gray-300 font-bold uppercase">Profile Status</p>
                  <p className="text-sm font-black text-[#d8f3dc]">88% Match Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-7xl mx-auto mb-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Toggle View Tabs (Browse All vs Matched) */}
      <div className="max-w-7xl mx-auto mb-2.5 flex gap-2 border-b border-gray-200 pb-1.5">
        <button
          onClick={() => setBrowseTab("matched")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            browseTab === "matched"
              ? "bg-[#2e4057] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>My Matched Schemes ({totalMatched})</span>
        </button>
        <button
          onClick={() => setBrowseTab("all")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            browseTab === "all"
              ? "bg-[#2e4057] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Browse All Schemes ({schemes.length})</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="max-w-7xl mx-auto mb-2.5 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
          className="w-full px-5 py-3 flex items-center justify-between font-bold text-[#2e4057] text-xs hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#28a745]" />
            <span>Category Filters ({filterCategory.toUpperCase()})</span>
          </div>
          {isFilterCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {!isFilterCollapsed && (
          <div className="px-5 pb-4 pt-1.5 border-t border-gray-100 bg-gray-50/30 animate-fadeIn">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#2e4057] text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat === "all" ? "Show All Categories" : cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
        {displaySchemes.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl py-8 px-4 text-center">
            <Info className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-500">No schemes found matching this criteria.</p>
          </div>
        ) : (
          displaySchemes.map((scheme) => {
            const isClosed = scheme.daysRemaining < 0 && 
              typeof scheme.deadlineDate === "string" && 
              scheme.deadlineDate.toLowerCase() !== "ongoing" && 
              scheme.deadlineDate.toLowerCase() !== "rolling";
            const isUrgent = !isClosed && scheme.daysRemaining >= 0 && scheme.daysRemaining < 7;
            const hasBlocker = !!scheme.blockerField;
            const isLowMatch = scheme.eligibilityMatch < 70;

            return (
              <div
                key={scheme._id}
                className={`bg-white rounded-xl border transition-all hover:shadow-sm flex flex-col justify-between overflow-hidden ${
                  isLowMatch
                    ? "border-gray-200 opacity-75"
                    : hasBlocker
                    ? "border-amber-200 bg-amber-50/5"
                    : isUrgent
                    ? "border-red-200"
                    : "border-gray-200"
                }`}
              >
                {/* Card Top Branding Header */}
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#2e4057]/10 text-[#2e4057] rounded text-[9px] font-extrabold uppercase tracking-wider">
                      {scheme.category}
                    </span>
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[11px] font-bold text-gray-500">
                        {scheme.eligibilityMatch}% Match
                      </span>
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isLowMatch ? "bg-gray-400" : "bg-[#28a745]"}`}
                          style={{ width: `${scheme.eligibilityMatch}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-[#2e4057] leading-snug">
                    {scheme.name}
                  </h3>
                  
                  {/* Benefit Amount Segment */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-[#28a745]">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs font-extrabold">{scheme.benefitAmount}</span>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Blocker Alert Warning Banner */}
                  {hasBlocker && (
                    <div className={`mt-3.5 p-2.5 border rounded-lg flex gap-2 items-start ${
                      isLowMatch 
                        ? "bg-gray-50 border-gray-200 text-gray-700" 
                        : "bg-amber-50 border-amber-200/80 text-amber-800"
                    }`}>
                      <ShieldAlert className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isLowMatch ? "text-gray-500" : "text-amber-600"}`} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider">
                          {isLowMatch ? "Ineligibility Factor" : "Blocker Issue Detected"}
                        </p>
                        <p className="text-[10px] font-semibold leading-relaxed mt-0.5">
                          {scheme.blockerDescription}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Required Documents Checklist */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Required Documents
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {scheme.documentsRequired.map((doc, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA Button */}
                <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                  {/* Deadline Indicators */}
                  <div className="flex items-center gap-1">
                    <Calendar className={`w-3.5 h-3.5 ${isClosed ? "text-gray-400" : isUrgent ? "text-red-500" : "text-gray-400"}`} />
                    <span className={`text-[11px] font-bold ${isClosed ? "text-gray-450 italic" : isUrgent ? "text-red-700" : "text-gray-500"}`}>
                      {isClosed 
                        ? `Closed` 
                        : isUrgent 
                        ? `${scheme.daysRemaining} days left!` 
                        : typeof scheme.deadlineDate === "string" && scheme.deadlineDate.toLowerCase() === "ongoing"
                        ? "Always Open"
                        : typeof scheme.deadlineDate === "string" && scheme.deadlineDate.toLowerCase() === "rolling"
                        ? "Apply Anytime"
                        : `Closes ${scheme.deadlineDate}`}
                    </span>
                  </div>

                  {isLowMatch ? (
                    <span className="text-[11px] font-bold text-gray-400 italic">Ineligible</span>
                  ) : hasBlocker ? (
                    <button
                      onClick={() => handleFixIssue(scheme)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <span>Fix Issue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyRedirect(scheme.officialPortalUrl)}
                      className="px-3.5 py-1.5 bg-[#2e4057] hover:bg-[#28a745] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Interactive Blocker Fix Resolution Panel Modal (Rendered with React Portal to fit viewport) */}
      {activeFixBlocker &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveFixBlocker(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              </div>

              <h3 className="text-base font-black text-[#2e4057] leading-tight">
                Resolve Blocker for {activeFixBlocker.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                Follow these simple steps to unblock this scheme benefit:
              </p>

              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 my-3">
                <p className="text-[10px] font-bold text-amber-800">Issue detail:</p>
                <p className="text-xs text-amber-700 mt-0.5 font-medium leading-relaxed">
                  {activeFixBlocker.blockerDescription}
                </p>
              </div>

              {/* Resolution Step Action Guides */}
              <div className="space-y-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  How to resolve this
                </p>
                
                {activeFixBlocker.blockerField === "land_records" && (
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                      <p className="leading-normal">Visit the **Document Vault** and select **Upload Land Jamabandi copy**.</p>
                    </div>
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                      <p className="leading-normal">Input your land Khata/Khasra number as recorded in the district records.</p>
                    </div>
                    <button
                      onClick={() => {
                        alert("Navigating to Document Vault for file upload...");
                        setActiveFixBlocker(null);
                      }}
                      className="w-full py-2 bg-[#2e4057] text-white text-xs font-bold rounded-lg hover:bg-[#28a745] transition mt-1"
                    >
                      Go to Document Vault
                    </button>
                  </div>
                )}

                {activeFixBlocker.blockerField === "bank_seeding" && (
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                      <p className="leading-normal">Go to your registered bank branch with a copy of your Aadhaar card.</p>
                    </div>
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                      <p className="leading-normal">Request the desk executive to complete the **Aadhaar-Seeding (NPCI Mapping)** form.</p>
                    </div>
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                      <p className="leading-normal">Check back here in 48 hours for automated portal status synchronization.</p>
                    </div>
                  </div>
                )}

                {activeFixBlocker.blockerField === "caste_certificate" && (
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                      <p className="leading-normal">Open your official state e-District portal or visit the local Common Service Centre (CSC).</p>
                    </div>
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                      <p className="leading-normal">Apply for caste category verification certificate renewal.</p>
                    </div>
                    <button
                      onClick={() => {
                        window.open("https://www.myscheme.gov.in/", "_blank");
                        setActiveFixBlocker(null);
                      }}
                      className="w-full py-2 bg-[#2e4057] text-white text-xs font-bold rounded-lg hover:bg-[#28a745] transition mt-1"
                    >
                      Open e-District Portal Link
                    </button>
                  </div>
                )}

                {activeFixBlocker.blockerField === "aadhaar_seeding" && (
                  <div className="space-y-2">
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                      <p className="leading-normal">Log in to the UIDAI portal to check if your mobile number matches your Aadhaar record.</p>
                    </div>
                    <div className="flex gap-2.5 items-start text-xs text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-[#2e4057]/10 text-[#2e4057] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                      <p className="leading-normal">Ensure your banking accounts are registered with the same mobile number.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100">
                <button
                  onClick={() => setActiveFixBlocker(null)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
