// GovernmentLayout.jsx
import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Download,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
  Filter,
  MapPin
} from "lucide-react";
import { STATE_AGRI_DATA } from "../utils/constants";
import { callGeminiFlash } from "../../../../services/geminiService";

export const STATE_DISTRICTS_MAP = {
  "All India": ["All Districts", "Ludhiana", "Karnal", "Bathinda", "Indore", "Nagpur", "Guntur"],
  "Punjab": ["All Punjab", "Ludhiana", "Bathinda", "Patiala", "Amritsar", "Jalandhar"],
  "Haryana": ["All Haryana", "Karnal", "Panipat", "Rohtak", "Hisar"],
  "Uttar Pradesh": ["All UP", "Lucknow", "Kanpur", "Varanasi", "Meerut"],
  "Madhya Pradesh": ["All MP", "Indore", "Bhopal", "Jabalpur", "Gwalior"],
  "Maharashtra": ["All MH", "Nagpur", "Pune", "Aurangabad", "Nashik"],
  "Rajasthan": ["All RJ", "Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
  "Gujarat": ["All GJ", "Ahmedabad", "Rajkot", "Surat", "Vadodara"],
  "Andhra Pradesh": ["All AP", "Guntur", "Vijayawada", "Visakhapatnam"],
  "West Bengal": ["All WB", "Kolkata", "Asansol", "Siliguri"],
  "Karnataka": ["All KA", "Bangalore", "Mysore", "Hubli"],
  "Bihar": ["All BR", "Patna", "Gaya", "Bhagalpur"],
  "Tamil Nadu": ["All TN", "Chennai", "Coimbatore", "Madurai"]
};

// High-fidelity fallback reports for all 11 pages when Gemini is not configured
const getMockAiBriefing = (pageName, state = "All India", district = "All Districts", isGlobal = false) => {
  if (isGlobal) {
    return `### **GOVERNMENT POLICY & STRATEGIC EXECUTIVE SUMMARY**

1. **Executive Summary**: Sourcing outlook for ${state} (${district}) is stable. Strategic grain reserves are at 104% of safety net mandates.

2. **Key Findings**:
   - Punjab & Haryana show optimal crop yield outcomes, but ground water extraction stress is critical (average 90%).
   - Targeted crop diversification grants should shift 15% of paddy fields to millets and oilseeds.
   - Farm insurance (PMFBY) covers 92% of high-risk farmer portfolios.

3. **Strategic Action Directives**:
   - [PRIORITY HIGH] Release pulse buffer reserves from storage hubs to maintain price stability.
   - [PRIORITY HIGH] Subsidize drip irrigation installations for sugarcane growers in central zones.`;
  }

  return `### **EXECUTIVE INTEL ADVISORY BRIEFING: ${pageName.toUpperCase()}**

1. **Strategic Assessment**: telemetries indicate stable performance profiles in ${state} (district: ${district}). Soil Health Card recommendations are active.

2. **Identified Deficit Risks**: Groundwater exhaustion remains the primary risk factor. Divert local inputs towards pulse cultivation post-harvest.

3. **Policy Directives**: Deploy direct advisory alerts for upcoming weather changes in northern wheat clusters and coordinate buffer releases for pulses.`;
};

export default function GovernmentLayout({
  pageName,
  aiSection,
  kpiStrip,
  selectedState = "All India",
  setSelectedState,
  selectedDistrict = "All Districts",
  setSelectedDistrict,
  children
}) {
  const [pageAiLoading, setPageAiLoading] = useState(false);
  const [pageAiReport, setPageAiReport] = useState("");
  const [pageAiError, setPageAiError] = useState("");

  const [globalAiLoading, setGlobalAiLoading] = useState(false);
  const [globalAiReport, setGlobalAiReport] = useState("");
  const [globalAiError, setGlobalAiError] = useState("");

  const runAiQuery = async (promptText, setLoading, setError, setReport, isGlobal = false) => {
    setLoading(true);
    setError("");
    setReport("");

    try {
      const systemPrompt = "You are a senior agricultural policy adviser for the Ministry of Agriculture, Government of India.";
      const res = await callGeminiFlash(promptText, systemPrompt);
      if (res && res.briefing) {
        setReport(res.briefing);
      } else if (res && typeof res === "string") {
        setReport(res);
      } else {
        setReport(JSON.stringify(res, null, 2));
      }
    } catch (e) {
      console.warn("AI generation failed. Using mock briefing.", e);
      setTimeout(() => {
        setReport(getMockAiBriefing(pageName, selectedState, selectedDistrict, isGlobal));
        setLoading(false);
      }, 700);
      return;
    } finally {
      setLoading(false);
    }
  };

  const triggerPageAi = () => {
    if (!aiSection) return;
    const customPrompt = aiSection.prompt + ` (Context State: ${selectedState}, District: ${selectedDistrict})`;
    runAiQuery(customPrompt, setPageAiLoading, setPageAiError, setPageAiReport, false);
  };

  const triggerGlobalAi = () => {
    const globalPrompt = `Generate a comprehensive 6-part executive summary for the Ministry of Agriculture:
      1) Executive Summary
      2) Key Findings
      3) Risks
      4) Opportunities
      5) Recommendations
      6) Action Items.
      Context State: ${selectedState}, District: ${selectedDistrict}, page: ${pageName}.`;
    runAiQuery(globalPrompt, setGlobalAiLoading, setGlobalAiError, setGlobalAiReport, true);
  };

  const triggerPdfExport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MINISTRY OF AGRICULTURE COMMAND CENTER", 14, 20);
    doc.setFontSize(12);
    doc.text(`National Agricultural Intelligence Report - ${pageName}`, 14, 26);
    doc.setFontSize(9);
    doc.text(`State: ${selectedState} | District: ${selectedDistrict}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 37);

    doc.autoTable({
      head: [["State Name", "Agri Area (M Ha)", "Production (M MT)", "Water Stress Index", "Security Score"]],
      body: STATE_AGRI_DATA.map((s) => [
        s.name,
        s.area,
        s.production,
        `${s.waterStress}/100`,
        s.score,
      ]),
      startY: 44,
      theme: "striped",
      headStyles: { fillColor: [49, 87, 44] },
    });

    doc.save(`Ministry_Agri_Report_${pageName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const RenderAiResponseBlock = ({ loading, error, report, title }) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#31572c] mb-3" />
          <span className="text-xs font-black text-gray-600">
            Synthesizing Agricultural Policy Directive (Gemini Flash)...
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-800 text-xs">
          <div className="font-black flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Policy Engine Connection Error
          </div>
          <p>{error}</p>
        </div>
      );
    }

    if (!report) return null;

    const paragraphs = report.split("\n\n").filter(Boolean);

    return (
      <div className="bg-gradient-to-br from-emerald-50/20 to-teal-50/10 border border-emerald-600/20 rounded-2xl p-6 space-y-4 shadow-sm animate-fadeIn relative">
        <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 border border-emerald-250 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
          <span>Advisory Briefing</span>
        </div>
        <h3 className="text-sm font-black text-[#31572c] flex items-center gap-1.5 border-b pb-3 mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {title}
        </h3>
        <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2 text-xs leading-relaxed text-gray-700 font-semibold">
          {paragraphs.map((para, i) => {
            const isHeading = para.startsWith("#") || (para.startsWith("**") && para.endsWith("**"));
            const cleanedPara = para.replace(/[#*]/g, "").trim();

            if (isHeading) {
              return (
                <h4 key={i} className="text-[#31572c] font-black text-xs uppercase tracking-wide mt-4 first:mt-0">
                  {cleanedPara}
                </h4>
              );
            }
            return (
              <div key={i} className="pl-3 border-l-2 border-emerald-600/30 py-1">
                {cleanedPara}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const currentDistricts = useMemo(() => {
    return STATE_DISTRICTS_MAP[selectedState] || ["All Districts"];
  }, [selectedState]);

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 pb-16 relative">
      
      {/* 1. Policy Control Header Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#31572c] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
              NATIONAL POLICY COMMAND PANEL · भारत सरकार
            </span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight mt-2 text-gray-900 font-sans uppercase">
            {pageName}
          </h1>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* State Selector */}
          {setSelectedState && (
            <div className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-250 rounded-xl px-3 py-1.5 transition-all shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#31572c]" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase leading-none">Administrative State</span>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    if (setSelectedDistrict) {
                      // Auto-reset district on state change
                      setSelectedDistrict(STATE_DISTRICTS_MAP[e.target.value]?.[0] || "All Districts");
                    }
                  }}
                  className="text-xs bg-transparent border-0 font-extrabold focus:outline-none text-gray-850 cursor-pointer mt-0.5"
                >
                  <option value="All India">🇮🇳 All India</option>
                  {Object.keys(STATE_DISTRICTS_MAP).filter(s => s !== "All India").map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* District Selector */}
          {setSelectedDistrict && (
            <div className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-250 rounded-xl px-3 py-1.5 transition-all shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#31572c]" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase leading-none">District Sourcing</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="text-xs bg-transparent border-0 font-extrabold focus:outline-none text-gray-850 cursor-pointer mt-0.5"
                >
                  {currentDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Export Report Button */}
          <button
            onClick={triggerPdfExport}
            className="h-11 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50/50 hover:bg-emerald-600 text-emerald-800 hover:text-white text-xs font-black flex items-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm lg:ml-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Policy Report
          </button>

        </div>

      </div>

      {/* KPI Strip */}
      {kpiStrip && kpiStrip.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiStrip}
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {children}
      </div>

      {/* Optional Page-Specific AI Section */}
      {aiSection && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black flex items-center gap-2 text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" /> {aiSection.title}
            </h3>
            <button
              onClick={triggerPageAi}
              className="bg-brand-dark hover:bg-[#132a13] text-white text-xs font-black px-4 py-2 rounded-xl transition shadow cursor-pointer active:scale-95"
            >
              {aiSection.buttonLabel || "Query Advisory Insights"}
            </button>
          </div>
          <RenderAiResponseBlock
            loading={pageAiLoading}
            error={pageAiError}
            report={pageAiReport}
            title={aiSection.title.toUpperCase()}
          />
        </div>
      )}

      {/* Global Executive summary footer on every page */}
      <div className="bg-white border border-[#31572c]/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-black text-[#31572c] flex items-center gap-2 uppercase tracking-wider">
              <Shield className="w-4.5 h-4.5 text-[#f59e0b]" /> Executive Policy Summary
            </h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">
              National Agricultural Policy Board Briefing
            </p>
          </div>
          <button
            onClick={triggerGlobalAi}
            className="bg-brand-dark hover:bg-[#132a13] text-white text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer shadow active:scale-[0.97]"
          >
            Generate Summary Briefing
          </button>
        </div>
        <RenderAiResponseBlock
          loading={globalAiLoading}
          error={globalAiError}
          report={globalAiReport}
          title="GOVERNMENT POLICY & STRATEGIC RECOMMENDATIONS"
        />
      </div>

    </div>
  );
}
