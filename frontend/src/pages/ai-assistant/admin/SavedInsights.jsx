import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../context/RoleContext";
import { Pin, Trash2 } from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const REPORT_FILES_DATABASE = seededData.aiAssistant1.savedInsightsReportFilesDatabase;

const SvgIcons = {
  FileText: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  MessageSquare: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  PieChart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  BarChart2: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  )
};

const roleSpecificInsights = Object.keys(seededData.aiAssistant1.savedInsightsRoleSpecific).reduce((acc, role) => {
  acc[role] = seededData.aiAssistant1.savedInsightsRoleSpecific[role].map(insight => ({
    ...insight,
    icon: SvgIcons[insight.icon] || null
  }));
  return acc;
}, {});

export default function SavedInsights() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const { activeRole } = useRole();
  const [activeViewReport, setActiveViewReport] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleDownload = (cardId) => {
    const doc = REPORT_FILES_DATABASE[cardId];
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

  const handleShare = (title) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`AgroIndia Insight: ${title}`);
      showToast(`Copied share link for "${title}" to clipboard!`);
    } else {
      showToast(`Shared "${title}" successfully!`);
    }
  };

  const handlePrimaryAction = (card) => {
    if (card.type === "chats") {
      navigate("/module/ai-assistant-1/chat-workspace", {
        state: {
          chatId: "chat_history_" + card.id,
          title: card.title,
          topic: card.title.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    } else if (card.type === "reports") {
      const doc = REPORT_FILES_DATABASE[card.id];
      if (doc) {
        setActiveViewReport(doc);
      } else {
        navigate("/module/ai-assistant-1/reports-center");
      }
    } else if (card.type === "recommendations") {
      const doc = REPORT_FILES_DATABASE[card.id];
      if (doc) {
        setActiveViewReport(doc);
      } else {
        navigate("/module/ai-assistant-1/chat-workspace", {
          state: {
            executePrompt: `Explain details and actions for the recommendation: "${card.title}". Context: ${card.description}`,
          },
        });
      }
    } else if (card.type === "analyses") {
      const doc = REPORT_FILES_DATABASE[card.id];
      if (doc) {
        setActiveViewReport(doc);
      } else {
        navigate("/module/ai-assistant-1/chat-workspace", {
          state: {
            executePrompt: `Provide an in-depth agricultural analysis on: "${card.title}". Details: ${card.description}`,
          },
        });
      }
    }
  };

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

  const tabs = [
    { id: "all", name: "All" },
    { id: "chats", name: "Chats" },
    { id: "reports", name: "Reports" },
    { id: "recommendations", name: "Recommendations" },
    { id: "analyses", name: "Analyses" },
  ];



  const insightsData = roleSpecificInsights[activeRole] || roleSpecificInsights.farmer;

  const filteredInsights =
    activeTab === "all"
      ? insightsData
      : insightsData.filter((item) => item.type === activeTab);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  return (
    <div className="animate-fadeIn bg-[#eef3eb]/30 min-h-screen font-sans w-full">
      {/* Dynamic Header Frame */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Saved Insights
        </h1>
        <p className="text-xs font-semibold text-gray-600 leading-relaxed mt-1">
          Your bookmarked reports, chats, and AI recommendations for quick
          access.
        </p>
      </div>

      {/* Navigation Filter Segment Tab Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-gray-200/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setActiveDropdownId(null);
            }}
            className={`pb-3 text-xs font-bold tracking-wide transition-all relative ${
              activeTab === tab.id
                ? "text-[#31572c]"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.name}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark rounded-full animate-fadeIn" />
            )}
          </button>
        ))}
      </div>

      {/* Grid Canvas Panel Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredInsights.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-gray-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
          >
            <div>
              {/* Card Meta Row Header */}
              <div className="flex items-start justify-between mb-4 relative">
                <div
                  className={`w-8 h-8 ${card.iconBg} rounded-xl flex items-center justify-center shadow-sm`}
                >
                  {card.icon}
                </div>

                {/* Context Action Overlay Switch Trigger */}
                <button
                  onClick={(e) => toggleDropdown(card.id, e)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition"
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
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {/* Inline Pop Dropdown Menu Frame */}
                {activeDropdownId === card.id && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-28 z-20 font-semibold text-[11px] text-gray-700 animate-fadeIn">
                    <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-gray-500" /> Pin Item
                    </button>
                    <button className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" /> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Descriptor Metadata Labels */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                {card.typeLabel} <span className="text-gray-200 mx-1">•</span>{" "}
                {card.date}
              </p>

              {/* Title Header */}
              <h3 className="text-sm font-black text-gray-900 tracking-tight mb-2">
                {card.title}
              </h3>

              {/* Description Summary Text block */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                {card.description}
              </p>

              {/* Horizontal Tag Pills Wrapper */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${tag.bg}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row Segment */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 mt-auto">
              <button
                onClick={() => handlePrimaryAction(card)}
                className="flex-1 bg-brand-dark hover:bg-[#1e381b] text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                {card.type === "chats" && (
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                )}
                {card.type !== "chats" && (
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
                )}
                <span>{card.primaryActionText}</span>
              </button>

              {/* Conditional Secondary Shortcut Hooks */}
              {card.hasDownload && (
                <button 
                  onClick={() => handleDownload(card.id)}
                  className="border border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-2 rounded-lg transition text-gray-500 cursor-pointer"
                  title="Download plain-text report"
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
              )}

              {card.hasShare && (
                <button 
                  onClick={() => handleShare(card.title)}
                  className="border border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-2 rounded-lg transition text-gray-500 cursor-pointer"
                  title="Share insight summary"
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
                      d="M8.684 10.742l4.136-1.378M13.62 14.62l3.418 1.14M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
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
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-dark/10 text-[#31572c] uppercase tracking-wider">
                  {activeViewReport.type}
                </span>
                <h3 className="text-base font-black text-gray-900 tracking-tight mt-1">
                  {activeViewReport.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Authored by <span className="font-semibold text-gray-500">{activeViewReport.author}</span> • Compiled on {activeViewReport.date}
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
                  handleDownload(activeViewReport.id);
                  setActiveViewReport(null);
                }}
                className="bg-brand-dark hover:bg-[#1e381b] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
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
        <div className="fixed bottom-6 right-6 z-50 bg-brand-dark text-[#ecf39e] border border-brand-medium/30 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn font-semibold text-xs transition-all duration-300">
          <svg className="w-4 h-4 text-[#ecf39e] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
