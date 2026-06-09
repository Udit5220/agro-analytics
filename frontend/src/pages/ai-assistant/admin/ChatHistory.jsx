import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../context/RoleContext";
import GenericTable from "../../../components/partials/GenericTable";
import { MessageSquare, Eye, Trash2 } from "lucide-react";

export default function ChatHistory() {
  const [filterTopic, setFilterTopic] = useState("all");
  const { activeRole } = useRole();
  const navigate = useNavigate();

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

  // Unified history dataset matching any active analytical perspective
  const roleSpecificChats = {
    farmer: [
      { id: "LOG_F01", chatTitle: "Rice Leaf Blast Spot Treatment Consultation", topic: "Diagnostics", dateTime: "May 28, 2026 • 11:24 AM", messages: 12 },
      { id: "LOG_F02", chatTitle: "Urea split schedule calculator response", topic: "Agronomy", dateTime: "May 24, 2026 • 09:15 AM", messages: 6 },
      { id: "LOG_F03", chatTitle: "PM-KISAN eligibility documents checklist", topic: "Planning", dateTime: "May 20, 2026 • 14:30 PM", messages: 4 },
      { id: "LOG_F04", chatTitle: "Monsoon onset weekly reservoir report", topic: "Agronomy", dateTime: "May 19, 2026 • 11:05 AM", messages: 8 }
    ],
    fpo: [
      { id: "LOG_FPO01", chatTitle: "Member crop acreage consolidation study", topic: "Planning", dateTime: "May 28, 2026 • 11:24 AM", messages: 24 },
      { id: "LOG_FPO02", chatTitle: "Bulk NPK procurement pooling volume optimization", topic: "Logistics", dateTime: "May 24, 2026 • 09:15 AM", messages: 15 },
      { id: "LOG_FPO03", chatTitle: "Collective market auction warehouse logs", topic: "Planning", dateTime: "May 20, 2026 • 14:30 PM", messages: 19 }
    ],
    trader: [
      { id: "LOG_T01", chatTitle: "Kharif Paddy Spot Mandi Index forecast", topic: "Market Analytics", dateTime: "May 28, 2026 • 11:24 AM", messages: 32 },
      { id: "LOG_T02", chatTitle: "Indore to Akola price spread margin check", topic: "Market Analytics", dateTime: "May 24, 2026 • 09:15 AM", messages: 14 },
      { id: "LOG_T03", chatTitle: "Arrival volume density forecasting", topic: "Market Analytics", dateTime: "May 20, 2026 • 14:30 PM", messages: 20 }
    ],
    procurement: [
      { id: "LOG_P01", chatTitle: "North Sector moisture tolerance exception logs", topic: "Logistics", dateTime: "May 28, 2026 • 11:24 AM", messages: 18 },
      { id: "LOG_P02", chatTitle: "Supplier seasonal contract fulfilment tracking", topic: "Planning", dateTime: "May 24, 2026 • 09:15 AM", messages: 22 },
      { id: "LOG_P03", chatTitle: "Warehouse silo capacity optimization manifest", topic: "Logistics", dateTime: "May 20, 2026 • 14:30 PM", messages: 11 }
    ],
    researcher: [
      { id: "LOG_R01", chatTitle: "Wheat phenotype standard deviation trial metrics", topic: "Research Core", dateTime: "May 28, 2026 • 11:24 AM", messages: 42 },
      { id: "LOG_R02", chatTitle: "Nitrogen fixation in root nodules literature review", topic: "Research Core", dateTime: "May 24, 2026 • 09:15 AM", messages: 16 },
      { id: "LOG_R03", chatTitle: "ANOVA test runs on plot trial outputs", topic: "Research Core", dateTime: "May 20, 2026 • 14:30 PM", messages: 28 }
    ],
    government: [
      { id: "LOG_G01", chatTitle: "District-wise crop acreage estimation run", topic: "Policy Framework", dateTime: "May 28, 2026 • 11:24 AM", messages: 35 },
      { id: "LOG_G02", chatTitle: "PM-KISAN regional scheme adoption statistics", topic: "Policy Framework", dateTime: "May 24, 2026 • 09:15 AM", messages: 27 },
      { id: "LOG_G03", chatTitle: "Disaster assessment and subsidy allocation model", topic: "Policy Framework", dateTime: "May 20, 2026 • 14:30 PM", messages: 45 }
    ]
  };

  const chatData = roleSpecificChats[activeRole] || roleSpecificChats.farmer;

  const topics = [
    { id: "all", name: "All Log Streams" },
    { id: "Diagnostics", name: "Diagnostics" },
    { id: "Pathogenic", name: "Pathogenic" },
    { id: "Planning", name: "Planning" },
    { id: "Market Analytics", name: "Market Analytics" },
    { id: "Policy Framework", name: "Policy Framework" },
    { id: "Agronomy", name: "Agronomy" },
    { id: "Logistics", name: "Logistics" },
    { id: "Research Core", name: "Research Core" },
  ];

  const filteredData =
    filterTopic === "all"
      ? chatData
      : chatData.filter((chat) => chat.topic === filterTopic);

  const handleRowClick = (chat) => {
    handleView(chat);
  };

  const handleView = (chat) => {
    navigate("/module/ai-assistant-1/chat-workspace", {
      state: {
        chatId: `chat_history_${chat.id}`,
        title: chat.chatTitle,
        topic: chat.topic,
        messagesCount: chat.messages,
      },
    });
  };

  const handleDelete = (chat) => {
    console.log(`[Audit Logs] Purging row session node id: ${chat.id}`);
  };

  const columns = [
    {
      header: "Session Node",
      accessor: "id",
      sortable: true,
      className: "w-28 text-gray-400 font-mono text-[11px]",
    },
    {
      header: "Conversation Description Summary",
      accessor: "chatTitle",
      sortable: true,
      className: "min-w-[240px] font-bold text-gray-800",
    },
    {
      header: "Category Domain",
      accessor: "topic",
      sortable: true,
      className: "w-36 text-xs text-gray-500 font-semibold",
    },
    {
      header: "Timestamp Record",
      accessor: "dateTime",
      sortable: true,
      className: "w-44 text-xs text-gray-400 font-medium",
    },
    {
      header: "Payload Load",
      accessor: "messages",
      sortable: true,
      className: "w-24 text-center font-black text-emerald-800",
    },
  ];

  const actions = [
    {
      label: (
        <span className="flex items-center gap-1 text-xs text-[#31572c] font-bold hover:underline cursor-pointer">
          <Eye className="w-3.5 h-3.5" /> Rehydrate
        </span>
      ),
      onClick: handleView,
    },
    {
      label: (
        <span className="flex items-center gap-1 text-xs text-red-500 font-bold hover:underline cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" /> Drop
        </span>
      ),
      onClick: handleDelete,
    },
  ];

  return (
    <div className="font-sans animate-fadeIn space-y-6 w-full">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#31572c]" />
            Session Archives Matrix [{activeRole?.toUpperCase() || "OPERATOR"}]
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access and sort historical consultation log streams secured under
            your workspace configuration.
          </p>
        </div>
        <div className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-400 rounded-lg text-[10px] font-mono self-start md:self-center">
          Active Store: Key-Routed Storage
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setFilterTopic(topic.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              filterTopic === topic.id
                ? "bg-[#31572c] text-white border-[#31572c] shadow-xs"
                : "bg-white border-gray-200 text-gray-500 hover:border-[#31572c] hover:text-[#31572c]"
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 overflow-x-auto">
          <GenericTable
            columns={columns}
            data={filteredData}
            onRowClick={handleRowClick}
            actions={actions}
            itemsPerPage={6}
            showSearch={true}
            showSort={true}
            searchPlaceholder="Filter past conversation indexes..."
            emptyMessage="No historical logs found matching parameter filters."
          />
        </div>
      </div>
    </div>
  );
}
