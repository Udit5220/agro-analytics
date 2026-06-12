// src/pages/gov-schemes/farmer/FarmNotificationCenter.jsx
import React, { useState } from "react";
import {
  Bell,
  Search,
  Filter,
  Check,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  FileCheck,
  Building,
  Info
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "PMFBY Kharif Crop Insurance Deadline Imminent",
    description: "Final deadline to enroll Kharif Rice crop under PMFBY insurance is June 30. Keep your sowing certificate and land records handy to prevent last-minute server delays.",
    category: "Deadlines",
    timestamp: "2 hours ago",
    read: false,
    priority: "high",
    actionText: "Apply & Upload Records",
    schemeLink: "PMFBY Insurance"
  },
  {
    id: 2,
    title: "Eligibility Match: Haryana SC Farmer Electrification Scheme",
    description: "New database match identified! Based on your SC category, small farmer status, and location in Sonipat, you qualify for the ₹25,000 tubewell electrification subsidy.",
    category: "Matches",
    timestamp: "1 day ago",
    read: false,
    priority: "medium",
    actionText: "Read Manual & Guidelines",
    schemeLink: "Haryana SC Farmer Scheme"
  },
  {
    id: 3,
    title: "PM-KISAN DBT Seeding Warning",
    description: "Your PM Kisan status shows Aadhaar-Bank account linking is pending. The 17th installment of ₹2,000 is scheduled for release on June 20. Update seeding details to avoid transaction blockages.",
    category: "DBT Releases",
    timestamp: "2 days ago",
    read: false,
    priority: "high",
    actionText: "Resolve Blockage",
    schemeLink: "PM Kisan Samman Nidhi"
  },
  {
    id: 4,
    title: "Policy Update: KCC Interest Subvention 2026 Rules",
    description: "NABARD announced that prompt-repaying farmers will receive an extra 3% interest rebate on short-term crop loans up to ₹3 Lakh, reducing the effective interest rate to just 4%.",
    category: "Policy Updates",
    timestamp: "4 days ago",
    read: true,
    priority: "medium",
    actionText: "View Bank Rates",
    schemeLink: "Kisan Credit Card"
  },
  {
    id: 5,
    title: "Haryana Govt State Circular: Soil Testing Subsidy",
    description: "Official Gazette Notification: The state department of agriculture has set up free soil health check camps across Sonipat block centers. Get a valid Soil Health Card within 7 days.",
    category: "Circulars",
    timestamp: "1 week ago",
    read: true,
    priority: "low",
    actionText: "Find Nearest Camp",
    schemeLink: "Soil Health Card Scheme"
  }
];

const FarmNotificationCenter = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("All"); // All, Unread, Read
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Deadlines", "Matches", "DBT Releases", "Policy Updates", "Circulars"];

  // Toggle Read Status
  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Filter & Search Logic
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || n.category === categoryFilter;

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Unread" && !n.read) ||
      (activeTab === "Read" && n.read);

    return matchesSearch && matchesCategory && matchesTab;
  });

  const getPriorityColor = (priority) => {
    if (priority === "high") return "bg-red-50 text-red-700 border-red-200";
    if (priority === "medium") return "bg-yellow-50 text-yellow-800 border-yellow-200";
    return "bg-gray-50 text-gray-650 border-gray-150";
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case "Deadlines":
        return <Calendar className="h-4 w-4 text-red-550 shrink-0" />;
      case "Matches":
        return <FileCheck className="h-4 w-4 text-[#2d5a3d] shrink-0" />;
      case "DBT Releases":
        return <Clock className="h-4 w-4 text-green-600 shrink-0" />;
      case "Policy Updates":
        return <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />;
      default:
        return <Building className="h-4 w-4 text-gray-500 shrink-0" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f0]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A3A2A] text-[#C5F547] rounded-xl relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F2E1F]">Notification & Policy Alerts</h1>
            <p className="text-xs text-[#2d5a3d] font-medium">
              Official circulars, scheme matching warnings, and calendar deadline notifications.
            </p>
          </div>
        </div>

        {/* Source citation */}
        <div className="bg-[#1A3A2A]/5 border border-[#2d5a3d]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-xs">
          <Info className="h-4.5 w-4.5 text-[#2d5a3d] shrink-0" />
          <span className="text-[10px] text-[#2d5a3d] font-semibold">
            Aggregated from central/state government press releases & DAC&FW gazettes.
          </span>
        </div>
      </div>

      {/* Control Panel (Search, Read/Unread tabs, Mark all) */}
      <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Read/Unread Filters */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-start">
            {["All", "Unread", "Read"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 px-4 rounded-md text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#1A3A2A] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab} {tab === "Unread" ? `(${unreadCount})` : ""}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-[#2d5a3d] hover:text-[#0F2E1F] border border-[#2d5a3d]/20 hover:bg-[#2d5a3d]/5 px-3.5 py-1.5 rounded-lg transition"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Search & Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search circulars, alerts, policy updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d]"
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Notification Types" : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-150 py-16 text-center shadow-sm">
            <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-gray-500">No matching notifications found.</p>
            <p className="text-[10px] text-gray-400 mt-1">Try expanding your search query or filter categories.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`border border-gray-150 rounded-xl p-5 transition-all duration-200 bg-white shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative ${
                !notif.read ? "border-l-4 border-l-[#C5F547]" : "opacity-90"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Visual Type Indicator */}
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${notif.read ? "bg-gray-55/60 text-gray-400" : "bg-[#f4f7f0]"}`}>
                  {getIconForCategory(notif.category)}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-xs font-extrabold text-gray-900 leading-snug ${!notif.read ? "font-bold text-black" : "text-gray-700 font-medium"}`}>
                      {notif.title}
                    </h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getPriorityColor(notif.priority)}`}>
                      {notif.priority}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">• {notif.timestamp}</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                    {notif.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-[10px] text-gray-500 font-semibold pt-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      Category: {notif.category}
                    </span>
                    {notif.schemeLink && (
                      <span className="text-[#2d5a3d] font-bold">
                        Linked Scheme: {notif.schemeLink}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t border-gray-100 pt-3 md:border-t-0 md:pt-0 justify-end">
                <button
                  onClick={() => toggleReadStatus(notif.id)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition ${
                    notif.read
                      ? "text-gray-500 border-gray-200 hover:bg-gray-50"
                      : "text-[#2d5a3d] border-[#2d5a3d]/20 hover:bg-[#2d5a3d]/5"
                  }`}
                  title={notif.read ? "Mark as Unread" : "Mark as Read"}
                >
                  {notif.read ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  type="button"
                  className="text-[10px] font-bold bg-[#1A3A2A] hover:bg-[#0F2E1F] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  <span>{notif.actionText}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="text-gray-400 hover:text-red-650 p-2 rounded-lg hover:bg-red-50 transition"
                  title="Delete Alert"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Citizen Manual Notice Section */}
      <div className="mt-8 bg-[#1A3A2A] text-white rounded-xl p-5 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-44 w-44 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-sm font-extrabold text-[#C5F547] uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4.5 w-4.5" />
              Official Citizen manuals & Circulars Directory
            </h3>
            <p className="text-xs text-white/90 leading-relaxed font-semibold">
              Looking for official government PDFs and policy documentation? We have collected all publicly available manual resources from the Ministry of Agriculture portal to help you verify compliance checks.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-[#C5F547] text-[#0F2E1F] font-bold text-xs rounded-xl hover:bg-[#B0E030] transition duration-200 shrink-0 shadow-sm"
          >
            Access Public Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmNotificationCenter;
