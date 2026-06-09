// src/pages/gov-schemes/fpo/FpoCommandCenter.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  Compass,
  FolderKanban,
  CheckCircle2,
  Users,
  AlertCircle,
  Layers,
  Sparkles,
  X,
  Plus
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { FpoUtilizationHeader } from "./FpoHelper";

const FpoCommandCenter = () => {
  const { kpis, distribution, deadlines } = govtSchemeData.fpoOpportunityData;
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(false);
  const [campaignTarget, setCampaignTarget] = useState("AIF Infrastructure");
  const [campaignMessage, setCampaignMessage] = useState(
    "Dear Farmer, you are eligible for a 35% subsidy on warehouse construction under the AIF. Apply now or visit the FPO center."
  );

  const iconMap = {
    "kpi-opportunities": <Compass className="text-[#4f772d]" />,
    "kpi-potential": <Plus className="text-[#31572c]" />,
    "kpi-pipeline": <FolderKanban className="text-[#132a13]" />,
    "kpi-secured": <CheckCircle2 className="text-[#90a955]" />,
    "kpi-readiness": <FolderKanban className="text-amber-500" />,
    "kpi-coverage": <Users className="text-[#4f772d]" />
  };

  const totalFund = distribution.reduce((sum, d) => sum + d.amount, 0);

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    setCampaignSuccess(true);
    setTimeout(() => {
      setCampaignSuccess(false);
      setShowCampaignModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Opportunity Command Center" />

      {/* Header Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-[#4f772d]" />
          Opportunity Command Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor grant opportunities, compliance checklist logs, application funnel stages, and member scheme coverage across Sonipat FPO.
        </p>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <StatsCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            trendType={kpi.trendType}
            subtext={kpi.subtext}
            icon={iconMap[kpi.id] || <Layers />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Funnel */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1">Opportunity Stage Funnel</h3>
            <p className="text-[10px] text-gray-400 mb-4">Pipeline volumes and cumulative estimated values at each development stage</p>
            <div className="space-y-3.5 pt-2">
              {[
                { stage: "Opportunity Identified", count: 14, val: "₹3.5 Cr", width: "100%", color: "#132a13" },
                { stage: "Eligibility Confirmed", count: 10, val: "₹2.8 Cr", width: "85%", color: "#224222" },
                { stage: "Documents Prepared", count: 6, val: "₹1.5 Cr", width: "68%", color: "#31572c" },
                { stage: "Application Submitted", count: 8, val: "₹2.2 Cr", width: "55%", color: "#4f772d" },
                { stage: "Under Review", count: 4, val: "₹1.8 Cr", width: "42%", color: "#6a994e" },
                { stage: "Approved", count: 3, val: "₹1.2 Cr", width: "30%", color: "#90a955" },
                { stage: "Funds Released", count: 7, val: "₹2.4 Cr", width: "20%", color: "#a7c957" }
              ].map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{s.stage} ({s.count})</span>
                    <span className="font-bold font-mono text-[#132a13]">{s.val}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: s.width, backgroundColor: s.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Executive Brief */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#4f772d] animate-pulse" />
              AI Executive Brief
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">Urgent highlights and recommendations compiled by AgroIndia Opportunity Engine</p>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-red-650 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold text-red-900">High-Priority Deadline</p>
                  <p className="text-red-700 mt-0.5">Agriculture Infrastructure Fund application closes in 12 days. **₹2.0 Cr** funding value at risk.</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold text-amber-900">Compliance Action Needed</p>
                  <p className="text-amber-700 mt-0.5">Q4 GST Return Filing is overdue. Upload filing receipts to restore **84%** compliance rating.</p>
                </div>
              </div>
              <div className="p-3 bg-[#f4f7f4] border border-[#4f772d]/10 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#4f772d] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold text-[#132a13]">FPO Member Coverage Gap</p>
                  <p className="text-gray-600 mt-0.5">240 members in Kharindwa village are eligible but not yet registered for PMFBY Rabi Crop insurance.</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowCampaignModal(true)}
            className="w-full mt-4 text-xs font-bold text-center py-2 bg-[#132a13] text-white hover:bg-[#31572c] rounded-xl transition"
          >
            Launch Out-reach Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Donut */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1">Opportunity Distribution</h3>
            <p className="text-[10px] text-gray-400 mb-4">Total Potential Funding Value: ₹{totalFund.toLocaleString()}</p>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 mt-2 text-[10px] font-semibold text-gray-600">
            {distribution.map((d, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0 border" style={{ backgroundColor: d.color }}></span>
                <span className="truncate">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1">Upcoming Compliance & Funding Deadlines</h3>
            <p className="text-[10px] text-gray-400 mb-4">Critical timelines affecting subsidy approvals and active grant programs</p>
            <div className="divide-y divide-gray-100">
              {deadlines.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider ${
                      item.priority === "HIGH" 
                        ? "bg-red-50 text-red-650 border border-red-200" 
                        : item.priority === "MEDIUM" 
                          ? "bg-amber-50 text-amber-700 border border-amber-200" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {item.priority}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.action}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">{item.type} Deadline</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-[#132a13]">{item.amount}</p>
                    <p className="text-[9px] text-red-650 font-bold">{item.daysLeft} days remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Outreach Campaign Launch Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              type="button"
              onClick={() => setShowCampaignModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#4f772d]" />
              Launch Outreach Campaign
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Send SMS broadcasts and system notifications to FPO members about eligible grants and benefits.
            </p>

            {campaignSuccess ? (
              <div className="py-8 text-center text-xs font-bold text-emerald-700 bg-emerald-50/50 rounded-xl border border-emerald-150 animate-pulse">
                Campaign Launched Successfully! Sending broadcasts...
              </div>
            ) : (
              <form onSubmit={handleLaunchCampaign} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Target Scheme</label>
                  <select
                    value={campaignTarget}
                    onChange={(e) => setCampaignTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="AIF Infrastructure">Agriculture Infrastructure Fund (Warehouse)</option>
                    <option value="PM Kusum Solar">PM Kusum Solar Pump Subsidy</option>
                    <option value="PMFBY Insurance">PMFBY Crop Insurance</option>
                    <option value="SMAM Machinery">SMAM Machinery Custom Hiring</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Target Audience</label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#4f772d]" />
                      <span>Kharindwa Village</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#4f772d]" />
                      <span>Bhadana Village</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                      <input type="checkbox" className="accent-[#4f772d]" />
                      <span>Murthal Outskirts</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                      <input type="checkbox" className="accent-[#4f772d]" />
                      <span>Drip Irrigators</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Broadcast Message</label>
                  <textarea
                    rows="4"
                    value={campaignMessage}
                    onChange={(e) => setCampaignMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-[#4f772d] resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#4f772d] hover:bg-[#31572c] text-white rounded-xl text-xs font-bold transition"
                  >
                    Launch Campaign
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FpoCommandCenter;
