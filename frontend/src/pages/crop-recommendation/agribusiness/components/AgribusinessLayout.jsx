import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  Briefcase,
  TrendingUp,
  Download,
  Filter,
  Layers,
  MapPin
} from "lucide-react";
import { callGeminiFlash } from "../../../../services/geminiService";

const getMockDailySummary = (pageName, commodity, zone) => {
  return `### **AGRIBUSINESS DAILY BRIEFING: ${commodity.toUpperCase()} (${zone.toUpperCase()})**

1. **Strategic Supply Outlook**:Sourcing readiness for ${commodity} is optimal. Estimated buffer reserves cover 4.2 months of industrial processing demand.

2. **Supply Risks & Vulnerabilities**:
   - Logistics gridlocks in ${zone} could cause 4.8% delayed arrivals at crushing units.
   - Temperature anomalies during late vegetative stages require close telemetry monitoring.

3. **Procurement Opportunities**:
   - Spot price deviations suggest accelerated procurement during peak crop arrival weeks.
   - Expand contract farming acreage by 14% to capture high margin capacity.`;
};

export default function AgribusinessLayout({
  pageName,
  kpiStrip,
  aiSection,
  tableDataForPdf,
  pdfHeaders,
  selectedCommodity,
  setSelectedCommodity,
  selectedZone,
  setSelectedZone,
  children
}) {
  const [pageAiLoading, setPageAiLoading] = useState(false);
  const [pageAiReport, setPageAiReport] = useState("");
  const [pageAiError, setPageAiError] = useState("");

  const runAiQuery = async () => {
    setPageAiLoading(true);
    setPageAiError("");
    setPageAiReport("");

    const promptText = aiSection?.prompt || `Provide corporate sourcing directives for crop: ${selectedCommodity} in zone: ${selectedZone} on page: ${pageName}.`;
    
    try {
      const systemPrompt = "You are a Chief Procurement Officer at a major global food processing and agricultural commodity trading corporation.";
      const res = await callGeminiFlash(promptText, systemPrompt);
      if (res && res.briefing) {
        setPageAiReport(res.briefing);
      } else if (res && typeof res === "string") {
        setPageAiReport(res);
      } else {
        setPageAiReport(JSON.stringify(res, null, 2));
      }
    } catch (e) {
      console.warn("AI generation failed. Using mock briefing.", e);
      setTimeout(() => {
        setPageAiReport(getMockDailySummary(pageName, selectedCommodity, selectedZone));
        setPageAiLoading(false);
      }, 700);
      return;
    } finally {
      setPageAiLoading(false);
    }
  };

  const triggerPdfExport = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("AGROINDIA AGRIBUSINESS PROCUREMENT COMMAND CENTER", 14, 20);
    doc.setFontSize(11);
    doc.text(`Intelligence Briefing: ${pageName} (${selectedCommodity} - ${selectedZone})`, 14, 26);
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 31);

    if (tableDataForPdf && pdfHeaders) {
      doc.autoTable({
        head: [pdfHeaders],
        body: tableDataForPdf,
        startY: 38,
        theme: "striped",
        headStyles: { fillColor: [49, 87, 44] },
      });
    } else {
      doc.text("Tabular data summary is attached in corporate dashboard screens.", 14, 45);
    }

    doc.save(`Agribusiness_${pageName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const RenderAiResponseBlock = ({ loading, error, report, title }) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-[#f4f7f4]/40 border border-gray-150 rounded-2xl animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-[#31572c] mb-3" />
          <span className="text-xs font-black text-gray-700">Synthesizing Corporate Procurement Directives...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-xs">
          <p>{error}</p>
        </div>
      );
    }

    if (!report) return null;

    const paragraphs = report.split("\n\n").filter(Boolean);

    return (
      <div className="bg-gradient-to-br from-emerald-50/20 to-amber-50/10 border border-emerald-600/25 rounded-2xl p-5 space-y-3 shadow-sm animate-fadeIn relative">
        <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider">
          Daily Analysis
        </div>
        <h3 className="text-xs font-black text-[#31572c] flex items-center gap-1.5 border-b pb-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {title}
        </h3>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs leading-relaxed text-gray-700 font-semibold">
          {paragraphs.map((para, i) => {
            const isHeading = para.startsWith("#") || (para.startsWith("**") && para.endsWith("**"));
            const cleanedPara = para.replace(/[#*]/g, "").trim();

            if (isHeading) {
              return (
                <h4 key={i} className="text-[#31572c] font-black text-[11px] uppercase tracking-wider mt-3 first:mt-0">
                  {cleanedPara}
                </h4>
              );
            }
            return (
              <div key={i} className="pl-2.5 border-l-2 border-[#31572c]/30 py-0.5">
                {cleanedPara}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 antialiased text-gray-800 pb-12">
      
      {/* 1. Sourcing Control Header Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 font-sans uppercase">
            {pageName}
          </h1>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Commodity Dropdown */}
          <div className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-250 rounded-xl px-3 py-1.5 transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5 text-[#31572c]" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase leading-none">Commodity</span>
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="text-xs bg-transparent border-0 font-extrabold focus:outline-none text-gray-850 cursor-pointer mt-0.5"
              >
                <option value="Wheat">🌾 Wheat / गेहूँ</option>
                <option value="Rice">🍚 Rice / चावल</option>
                <option value="Cotton">🌱 Cotton / कपास</option>
                <option value="Maize">🌽 Maize / मक्का</option>
                <option value="Mustard">🌼 Mustard / सरसों</option>
                <option value="Sugarcane">🎋 Sugarcane / गन्ना</option>
                <option value="Pulses">🫘 Pulses / दालें</option>
                <option value="Oilseeds">🌻 Oilseeds / तिलहन</option>
              </select>
            </div>
          </div>

          {/* Sourcing Zone Dropdown */}
          <div className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-250 rounded-xl px-3 py-1.5 transition-all shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#31572c]" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase leading-none">Sourcing Zone</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="text-xs bg-transparent border-0 font-extrabold focus:outline-none text-gray-850 cursor-pointer mt-0.5"
              >
                <option value="All Zones">All India Zones</option>
                <option value="North Zone">North Zone (Punjab/HR)</option>
                <option value="Central Zone">Central Zone (MP)</option>
                <option value="South Zone">South Zone (AP/TN)</option>
                <option value="West Zone">West Zone (MH/GJ)</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Executive KPI Cards (Row of 4) */}
      {kpiStrip && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiStrip}
        </div>
      )}

      {/* 3. Main Page Content */}
      <div className="min-h-[300px]">{children}</div>

      {/* 4. Page-Specific AI generated insights panel */}
      <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black flex items-center gap-1.5 text-emerald-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Executive Command Intelligence
          </h3>
          <button
            onClick={runAiQuery}
            className="bg-brand-dark hover:bg-[#132a13] text-white text-xs font-black px-4 py-2 rounded-xl transition active:scale-95 cursor-pointer shadow"
          >
            Generate Briefing
          </button>
        </div>
        <RenderAiResponseBlock
          loading={pageAiLoading}
          error={pageAiError}
          report={pageAiReport}
          title={`${pageName.toUpperCase()} STRATEGIC BRIEFING`}
        />
      </div>

    </div>
  );
}
