// PAGE 7 — Disease Alerts & Advisories
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/DiseaseAlertsAdvisories.jsx

import React, { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  ShieldAlert,
  Send,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BarChart2,
  Users,
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";

export default function DiseaseAlertsAdvisories() {
  // Mock Data
  const initialAlerts = [
    {
      id: "alt-1",
      type: "Emergency",
      message:
        "URGENT: Rice Blast infestation confirmed in Kharindwa village. Immediately inspect fields and complete copper sprays.",
      audience: "Kharindwa • Rice (Paddy) • High Risk",
      sentTime: "2 hours ago",
      stats: { sent: 420, delivered: 415, read: 380, acknowledged: 290 },
    },
    {
      id: "alt-2",
      type: "Disease Alert",
      message:
        "Yellow Rust forecast values exceeded safety limits. Check wheat leaves for yellow-orange dust spots.",
      audience: "Bhucho Mandi • Wheat • All",
      sentTime: "Yesterday",
      stats: { sent: 350, delivered: 342, read: 290, acknowledged: 180 },
    },
    {
      id: "alt-3",
      type: "Weather Alert",
      message:
        "High relative humidity (>85%) predicted over the next 48 hours. Potentially escalates potato blight. Apply shield dustings.",
      audience: "Raman • Potato • All",
      sentTime: "3 days ago",
      stats: { sent: 280, delivered: 278, read: 220, acknowledged: 130 },
    },
  ];

  const channelPerformance = [
    { name: "SMS Broadcasts", sent: 1050, delivered: "98.5%", read: "82%" },
    { name: "WhatsApp Alerts", sent: 1050, delivered: "99.2%", read: "94%" },
    { name: "Mobile App Alerts", sent: 1247, delivered: "100%", read: "65%" },
    { name: "Email Newsletters", sent: 850, delivered: "94.8%", read: "38%" },
  ];

  const [alerts, setAlerts] = useState(initialAlerts);
  const [expandedId, setExpandedId] = useState(null);

  // Composer state variables
  const [composer, setComposer] = useState({
    type: "Disease Alert",
    village: "Kharindwa",
    crop: "Rice (Paddy)",
    riskGroup: "High Risk",
    message: "",
    sms: true,
    whatsapp: true,
    app: true,
    email: false,
    priority: "High",
  });

  // Global counter calculations
  const totalSent = alerts.reduce((acc, curr) => acc + curr.stats.sent, 0);
  const totalDelivered = alerts.reduce(
    (acc, curr) => acc + curr.stats.delivered,
    0,
  );
  const totalRead = alerts.reduce((acc, curr) => acc + curr.stats.read, 0);
  const totalAck = alerts.reduce(
    (acc, curr) => acc + curr.stats.acknowledged,
    0,
  );
  const globalDeliveryRate = ((totalDelivered / totalSent) * 100).toFixed(1);

  // Composer Form submission handler
  const handleComposerSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `alt-${Date.now()}`,
      type: composer.type,
      message: composer.message || "No content provided",
      audience: `${composer.village} • ${composer.crop} • ${composer.riskGroup}`,
      sentTime: "Just now",
      stats: {
        sent: 420, // default dummy statistics matching village scope
        delivered: 418,
        read: 310,
        acknowledged: 140,
      },
    };
    setAlerts((prev) => [created, ...prev]);
    // Reset composer
    setComposer((prev) => ({ ...prev, message: "" }));
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">
          Advisories & Emergency Alerts
        </h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Draft advisories, target specific village crop sections, and track
          delivery response indices across FPO members.
        </p>
      </div>

      {/* Global delivery rate row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Alerts Sent"
          value={totalSent}
          trend="Broadcast Active"
          trendType="neutral"
          subtext="Targeted message count"
          icon={<Send className="text-[#31572c]" />}
        />
        <StatsCard
          title="Delivered"
          value={`${totalDelivered} (${globalDeliveryRate}%)`}
          trend="99.1% Target"
          trendType="success"
          subtext="Successful transmission rate"
          icon={<CheckCircle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Read Rate %"
          value={`${((totalRead / totalDelivered) * 100).toFixed(1)}%`}
          trend="+2.4% MoM"
          trendType="success"
          subtext="Recipient open reads"
          icon={<MessageSquare className="text-[#31572c]" />}
        />
        <StatsCard
          title="Acknowledged Rate %"
          value={`${((totalAck / totalRead) * 100).toFixed(1)}%`}
          trend="High engagement"
          trendType="success"
          subtext="Action feedback responses"
          icon={<ShieldAlert className="text-[#31572c]" />}
        />
      </div>

      {/* Grid containing Message composer and Delivery channel statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#31572c]" /> Alert Advisory
              Composer
            </h3>

            <form
              onSubmit={handleComposerSubmit}
              className="space-y-4 text-xs font-semibold text-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Alert Type
                  </label>
                  <select
                    value={composer.type}
                    onChange={(e) =>
                      setComposer((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 bg-white font-bold"
                  >
                    <option value="Disease Alert">Disease Alert</option>
                    <option value="Weather Alert">Weather Alert</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Advisory">Advisory</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Target Village
                  </label>
                  <select
                    value={composer.village}
                    onChange={(e) =>
                      setComposer((prev) => ({
                        ...prev,
                        village: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 bg-white font-bold"
                  >
                    <option value="Kharindwa">Kharindwa</option>
                    <option value="Bhucho Mandi">Bhucho Mandi</option>
                    <option value="Raman">Raman</option>
                    <option value="Shirur">Shirur</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Target Crop
                  </label>
                  <select
                    value={composer.crop}
                    onChange={(e) =>
                      setComposer((prev) => ({ ...prev, crop: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 bg-white font-bold"
                  >
                    <option value="Rice (Paddy)">Rice (Paddy)</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Potato">Potato</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Priority & Target Risk Group
                </label>
                <div className="flex gap-2">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setComposer((prev) => ({ ...prev, priority: p }))
                      }
                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase transition cursor-pointer ${
                        composer.priority === p
                          ? "bg-red-650 text-white animate-pulse"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Message Composer Content
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Compose advisory alerts describing pathogen spot signs, wind vector warnings or chemical instructions..."
                  value={composer.message}
                  onChange={(e) =>
                    setComposer((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c] leading-relaxed"
                />
              </div>

              {/* Delivery channel checkboxes */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                  Delivery Channels
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={composer.sms}
                      onChange={(e) =>
                        setComposer((prev) => ({ ...prev, sms: e.checked }))
                      }
                      className="rounded text-[#31572c] focus:ring-[#31572c] h-4 w-4"
                    />
                    SMS Broadcast
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={composer.whatsapp}
                      onChange={(e) =>
                        setComposer((prev) => ({
                          ...prev,
                          whatsapp: e.checked,
                        }))
                      }
                      className="rounded text-[#31572c] focus:ring-[#31572c] h-4 w-4"
                    />
                    WhatsApp
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={composer.app}
                      onChange={(e) =>
                        setComposer((prev) => ({ ...prev, app: e.checked }))
                      }
                      className="rounded text-[#31572c] focus:ring-[#31572c] h-4 w-4"
                    />
                    Mobile App
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={composer.email}
                      onChange={(e) =>
                        setComposer((prev) => ({ ...prev, email: e.checked }))
                      }
                      className="rounded text-[#31572c] focus:ring-[#31572c] h-4 w-4"
                    />
                    Email Newsletter
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-1 border-t border-slate-100">
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Schedule
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-dark hover:bg-[#132a13] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" /> Dispatch Alert
                </button>
              </div>
            </form>
          </div>

          {/* Recent sent alerts feeds */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
              Dispatched Alerts History
            </h3>

            <div className="space-y-4">
              {alerts.map((alt) => {
                const isExpanded = expandedId === alt.id;
                return (
                  <div
                    key={alt.id}
                    className="border border-slate-100 rounded-2xl p-4.5 space-y-2.5"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                            alt.type === "Emergency"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-750"
                          }`}
                        >
                          {alt.type}
                        </span>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">
                          Audience: {alt.audience} • Sent: {alt.sentTime}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : alt.id)
                        }
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-600 cursor-pointer"
                      >
                        {isExpanded ? "Hide Data" : "View Details"}
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      {alt.message}
                    </p>

                    {/* Expandable channel details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-semibold text-slate-700 animate-slideIn">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase block font-black">
                            Target Members
                          </span>
                          <span>{alt.stats.sent}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase block font-black">
                            Delivered
                          </span>
                          <span className="text-blue-650">
                            {alt.stats.delivered}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase block font-black">
                            Open Reads
                          </span>
                          <span className="text-amber-600">
                            {alt.stats.read}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase block font-black">
                            Acknowledged
                          </span>
                          <span className="text-[#31572c]">
                            {alt.stats.acknowledged}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side panels */}
        <div className="space-y-6">
          {/* Delivery Channel Performance */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
              Delivery Channel Analytics
            </h3>

            <div className="space-y-3.5">
              {channelPerformance.map((ch, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-800">
                      {ch.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {ch.sent} Dispatched
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-650">
                    <div className="bg-white rounded p-1 border border-slate-100">
                      <span className="text-[8px] text-slate-400 uppercase block leading-none">
                        Delivered
                      </span>
                      <span className="text-blue-600 font-black">
                        {ch.delivered}
                      </span>
                    </div>
                    <div className="bg-white rounded p-1 border border-slate-100">
                      <span className="text-[8px] text-slate-400 uppercase block leading-none">
                        Open Read
                      </span>
                      <span className="text-[#31572c] font-black">
                        {ch.read}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Performance Analytics chart (SVG) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#31572c]" /> 30-Day Open vs
              Response Rate
            </h3>

            <div className="h-32 pt-2">
              <svg
                className="w-full h-full"
                viewBox="0 0 200 80"
                preserveAspectRatio="none"
              >
                {/* Grid */}
                <line
                  x1="10"
                  y1="10"
                  x2="190"
                  y2="10"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <line
                  x1="10"
                  y1="40"
                  x2="190"
                  y2="40"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <line
                  x1="10"
                  y1="70"
                  x2="190"
                  y2="70"
                  stroke="#cbd5e1"
                  strokeWidth="1.2"
                />

                {/* Open rate (emerald green line) */}
                <path
                  d="M 10 35 L 50 25 L 90 28 L 130 18 L 170 15 L 190 12"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Response rate (blue line) */}
                <path
                  d="M 10 55 L 50 48 L 90 42 L 130 35 L 170 30 L 190 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-center gap-4 text-[9px] font-black uppercase text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" /> Open
                Reads
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#3b82f6]" /> Response
                Ack
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
