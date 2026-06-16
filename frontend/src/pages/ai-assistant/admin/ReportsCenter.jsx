import React, { useState, useEffect } from "react";
import { useRole } from "../../../context/RoleContext";

import seededData from "../../../seed-json/seededData.json";

const REPORT_FILES_DATABASE = seededData.aiAssistant1.reportsCenterReportFilesDatabase;

export default function ReportsCenter() {
  const { activeRole } = useRole();

  if (activeRole === "admin" || activeRole === "company") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white border border-gray-200/60 shadow-sm rounded-2xl max-w-2xl mx-auto my-8 animate-fadeIn font-sans">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
          Access Restricted
        </h2>
        <p className="text-xs font-semibold text-gray-500 mt-2 max-w-sm leading-relaxed">
          The AI Assistant & Copilot workspace is optimized for active field operators, traders, and agronomists. It is not available for Admin or Company profiles.
        </p>
      </div>
    );
  }

  const [activeViewReport, setActiveViewReport] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleDownload = (report) => {
    const doc = REPORT_FILES_DATABASE[report.id];
    if (!doc) {
      showToast("Report data unavailable for download.");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    const fileName = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".txt";
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Successfully downloaded: ${doc.title}`);
  };

  const handleView = (report) => {
    const doc = REPORT_FILES_DATABASE[report.id];
    if (doc) {
      setActiveViewReport(doc);
} else {
      showToast("Detailed view not available for this report.");
    }
  };

  const roleSpecificReports = seededData.aiAssistant1.reportsCenterRoleSpecificReports;

  const [reports, setReports] = useState(() => roleSpecificReports[activeRole] || roleSpecificReports.farmer);

  useEffect(() => {
    setReports(roleSpecificReports[activeRole] || roleSpecificReports.farmer);
  }, [activeRole]);

  const quickGenerateCards = [
    {
      title: "Crop Health Report",
      desc: "Analyze current NDVI and disease risk.",
      icon: (
        <svg
          className="w-4 h-4 text-[#31572c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18M3 12h18M5 5l14 14M5 19L14 10"
          />
        </svg>
      ),
    },
    {
      title: "Seasonal Planning Report",
      desc: "Forecast yield and resource allocation.",
      icon: (
        <svg
          className="w-4 h-4 text-[#31572c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Scheme Eligibility Report",
      desc: "Check compliance for ag-subsidies.",
      icon: (
        <svg
          className="w-4 h-4 text-[#31572c]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];  const handleGenerate = (title) => {
    const newId = `rep_${Date.now()}`;
    const newReport = {
      id: newId,
      name: `${title} - Generated Run`,
      type: title.includes("Health") ? "Disease" : (title.includes("Scheme") ? "Planning" : "Soil"),
      typeBg: title.includes("Health") ? "bg-red-50 text-red-700" : "bg-[#dbe7c4] text-[#31572c]",
      date: "Today",
      pages: Math.floor(Math.random() * 8) + 3,
    };
    
    // Add to local database
    REPORT_FILES_DATABASE[newId] = {
      id: newId,
      title: newReport.name,
      date: newReport.date,
      type: newReport.type,
      author: "AgroIndia AI Advisor",
      summary: `Automated dynamic crop advisory report compiled on-demand for parameter query: "${title}".`,
      content: `
=========================================
AGROINDIA AUTOMATED REPORT DISPATCH
DOCUMENT ID: ${newId.toUpperCase()}
GENERATED: ${new Date().toLocaleDateString()}
=========================================

1. EXECUTIVE SYNOPSIS
---------------------
This automated advisory report was successfully compiled for the operational segment: "${title}". Real-time environmental and soil parameters indicate normal saturation dynamics.

2. COMPILATION AND TELEMETRY LOGS
---------------------------------
- Sensor Nodes: Core Grid block [Active]
- Calibration Rate: 100% compliant
- Suggested active action plan: Review moisture delta ratios, optimize NPK split margins, and schedule foliage check loops.

3. DISPATCH CONFIRMATION METRICS
--------------------------------
- Report payload pages: ${newReport.pages} pages.
- Status: Authenticated & Certified under active regional profile.
`,
    };

    setReports([newReport, ...reports]);
    showToast(`Successfully generated: ${title}`);
  };

  return (
    <div className="animate-fadeIn bg-[#eef3eb]/20 min-h-screen font-sans w-full">
      {/* Title Header Block Area Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
            Reports Center
          </h1>
          <p className="text-xs font-semibold text-gray-600 leading-relaxed mt-1">
            Generate, view, and manage your agricultural analytics reports.
          </p>
        </div>
      </div>

      {/* Quick Generate Interactive Deck Grid Layout */}
      <div className="mb-10">
        <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">
          Quick Generate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickGenerateCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-40"
            >
              <div>
                <div className="w-8 h-8 bg-[#ecf39e]/30 rounded-xl flex items-center justify-center mb-3">
                  {card.icon}
                </div>
                <h4 className="text-xs font-black text-gray-955 tracking-tight mb-1">
                  {card.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <button
                onClick={() => handleGenerate(card.title)}
                className="text-[11px] font-bold text-[#31572c] hover:text-[#4f772d] flex items-center gap-1 self-start transition-colors group mt-2 cursor-pointer"
              >
                <span>Generate</span>
                <svg
                  className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* High Density Ledger Structural Grid Matrix Component Container */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
            Generated Reports
          </h3>
          <button className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm hover:bg-gray-50 cursor-pointer">
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 uppercase">
                    Report Name
                  </th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 uppercase">
                    Type
                  </th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 uppercase">
                    Date Generated
                  </th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 uppercase">
                    Pages
                  </th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider p-3.5 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#4f772d]/5 transition-colors duration-150"
                  >
                    <td className="p-3.5 flex items-center gap-2.5 min-w-[260px]">
                      <div className="text-gray-400 flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span 
                        onClick={() => handleView(report)}
                        className="text-xs font-black text-gray-900 tracking-tight hover:text-[#31572c] cursor-pointer hover:underline"
                      >
                        {report.name}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${report.typeBg}`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs font-semibold text-gray-500">
                      {report.date}
                    </td>
                    <td className="p-3.5 text-xs font-semibold text-gray-500">
                      {report.pages}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button 
                        onClick={() => handleView(report)}
                        className="text-gray-400 hover:text-[#31572c] p-1.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center cursor-pointer"
                        title="View Report Preview"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDownload(report)}
                        className="text-gray-400 hover:text-[#31572c] p-1.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center cursor-pointer"
                        title="Download Plain-Text Report"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Ledger Nav Statistics bar */}
          <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Showing 1 to {reports.length} of {reports.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded text-gray-300 cursor-not-allowed"
                disabled
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="bg-[#31572c] text-white text-[11px] font-bold w-5 h-5 rounded flex items-center justify-center shadow-sm">
                1
              </span>
              <button className="p-1 rounded text-gray-350 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {activeViewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setActiveViewReport(null)}
          />
          
          {/* Modal Container */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-2xl max-w-2xl w-full relative z-10 flex flex-col max-h-[85vh] animate-scaleUp overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-[#eef3eb]/45 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#31572c]/10 text-[#31572c] uppercase tracking-wider">
                  {activeViewReport.type}
                </span>
                <h3 className="text-base font-black text-gray-900 tracking-tight mt-1">
                  {activeViewReport.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Authored by <span className="font-semibold text-gray-500">{activeViewReport.author}</span> â€¢ Compiled on {activeViewReport.date}
                </p>
              </div>
              <button 
                onClick={() => setActiveViewReport(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="bg-[#ecf39e]/15 border border-[#31572c]/10 p-4 rounded-xl">
                <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Executive Brief
                </h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {activeViewReport.summary}
                </p>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2">
                  System Plain-Text Document Payload
                </h4>
                <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 font-mono text-[11px] text-gray-700 whitespace-pre-wrap overflow-x-auto leading-relaxed shadow-inner max-h-[300px]">
                  {activeViewReport.content.trim()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex justify-end items-center gap-2">
              <button 
                onClick={() => setActiveViewReport(null)}
                className="px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-500 transition cursor-pointer"
              >
                Close View
              </button>
              <button 
                onClick={() => {
                  handleDownload(activeViewReport);
                  setActiveViewReport(null);
                }}
                className="bg-[#31572c] hover:bg-[#1e381b] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Report (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#31572c] text-[#ecf39e] border border-[#4f772d]/30 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn font-semibold text-xs transition-all duration-300">
          <svg className="w-4 h-4 text-[#ecf39e] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
