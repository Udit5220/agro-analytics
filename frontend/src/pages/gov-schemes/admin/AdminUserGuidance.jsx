import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  X,
  FileText,
  Calendar,
  DollarSign,
  Download,
  Send,
  RefreshCw,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Sparkles,
  MessageSquare,
  Users,
  Smartphone,
  Check,
  Award,
} from "lucide-react";
import { getAnalyticsData, saveAnalyticsData } from "./govSchemesHelper";

/*
// --- OLD USER GUIDANCE COMPONENT COMMENTED OUT ---
export default function AdminUserGuidance() {
  return (
    <div>Old User Guidance Code</div>
  );
}
*/

// --- NEW REDESIGNED OUTREACH & GUIDANCE CENTER COMPONENT ---

export default function AdminUserGuidance() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [toastMessage, setToastMessage] = useState("");

  // Composer States
  const [campaignName, setCampaignName] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [segment, setSegment] = useState("Haryana Residents");
  const [template, setTemplate] = useState("Hello {farmer_name}, you qualify for the capital subsidy scheme. Link your profile inside AgroIndia to learn more.");

  // Segment builder states
  const [selState, setSelState] = useState("all");
  const [selCrop, setSelCrop] = useState("all");
  const [selSize, setSelSize] = useState("all");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSendCampaign = (e) => {
    e.preventDefault();
    if (!campaignName) {
      showToast("Please enter a campaign name.");
      return;
    }
    const updated = { ...analytics };
    
    // Create new campaign
    const newCamp = {
      id: `c-${updated.campaigns.length + 1}`,
      name: campaignName,
      channel,
      sentCount: Math.floor(Math.random() * 5000) + 1000,
      opens: 0,
      clicks: 0,
      status: "Delivered",
      date: new Date().toISOString().split("T")[0]
    };
    newCamp.opens = Math.round(newCamp.sentCount * 0.82);

    updated.campaigns.unshift(newCamp);
    // Increment stats
    updated.outreach.campaignsSent += 1;
    updated.outreach.farmersReached += newCamp.sentCount;

    saveAnalyticsData(updated);
    setAnalytics(updated);
    setCampaignName("");
    showToast(`Campaign "${newCamp.name}" dispatched to ${newCamp.sentCount} farmers!`);
  };

  const handleSingleOutreach = (farmerId) => {
    const updated = { ...analytics };
    const farmer = updated.farmers.find(f => f.id === farmerId);
    if (farmer) {
      farmer.outreachStatus = "Sent";
      farmer.lastComm = new Date().toISOString().split("T")[0];
      saveAnalyticsData(updated);
      setAnalytics(updated);
      showToast(`Outreach guidance message sent to ${farmer.name}!`);
    }
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative font-semibold">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Outreach Coordinator Terminal
          </span>
          <h1 className="text-2xl font-black tracking-tight">Outreach & Guidance Center</h1>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Coordinate crop support programs and dispatch notification alerts to matched farmers and cooperatives. 
            All campaigns and metrics are tracked internally using platform databases.
          </p>
        </div>
      </div>

      {/* Outreach Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Farmers Reached</p>
          <h3 className="text-xl font-black text-brand-darkest mt-1.5">{analytics.outreach.farmersReached.toLocaleString()} Farmers</h3>
          <span className="text-[9px] text-gray-500 font-semibold block mt-1">Platform outreach aggregate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Campaigns Sent</p>
          <h3 className="text-xl font-black text-brand-darkest mt-1.5">{analytics.outreach.campaignsSent} Broadcasts</h3>
          <span className="text-[9px] text-gray-500 font-semibold block mt-1">Direct-benefit matches</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Notification Opens</p>
          <h3 className="text-xl font-black text-brand-darkest mt-1.5">{analytics.outreach.notificationOpens.toLocaleString()} Opens</h3>
          <span className="text-[9px] text-gray-500 font-semibold block mt-1">Open rate details: 82%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Engagement Rate</p>
          <h3 className="text-xl font-black text-emerald-600 mt-1.5">{analytics.outreach.engagementRate}% Rate</h3>
          <span className="text-[9px] text-emerald-600 font-bold block mt-1">High conversion feedback</span>
        </div>
      </div>

      {/* Outreach Funnel Analytics */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-medium" /> Platform Outreach & Engagement Funnel
          </h3>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Platform Analytics Sourced</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-semibold">
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-center">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">Targeted Farmers</span>
            <span className="text-base font-black text-brand-darkest block">{analytics.outreach.farmersReached.toLocaleString()}</span>
            <span className="text-[8px] text-gray-400 font-bold block">100% of segment</span>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-center">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">Notifications Sent</span>
            <span className="text-base font-black text-brand-darkest block">11,920</span>
            <span className="text-[8px] text-brand-medium font-bold block">96.1% sent rate</span>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-center">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">Notifications Opened</span>
            <span className="text-base font-black text-brand-darkest block">9,774</span>
            <span className="text-[8px] text-emerald-600 font-bold block">82.0% open rate</span>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-center">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">Scheme Views</span>
            <span className="text-base font-black text-brand-darkest block">{analytics.outreach.notificationOpens.toLocaleString()}</span>
            <span className="text-[8px] text-emerald-600 font-bold block">43.3% view conversion</span>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-center">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">Guide Opens</span>
            <span className="text-base font-black text-brand-darkest block">1,820</span>
            <span className="text-[8px] text-emerald-600 font-bold block">42.9% read guides</span>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-center">
            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">Apply Clicks</span>
            <span className="text-base font-black text-brand-darkest block">840</span>
            <span className="text-[8px] text-emerald-650 font-bold block">46.1% apply intent</span>
          </div>
        </div>
      </div>

      {/* Composer & Segment Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Broadcast Composer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-brand-medium" /> Broadcast Composer
          </h3>

          <form onSubmit={handleSendCampaign} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Campaign Title</label>
                <input 
                  type="text" 
                  value={campaignName} 
                  onChange={(e) => setCampaignName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                  placeholder="e.g. Kharif Crop Insurance Advisory"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Broadcast Channel</label>
                <select 
                  value={channel} 
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                >
                  <option value="WhatsApp">WhatsApp Gateway</option>
                  <option value="SMS">SMS Gateway</option>
                  <option value="Email">Email Dispatch</option>
                  <option value="In-App">In-App Notification</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Message Template</label>
              <textarea 
                value={template} 
                onChange={(e) => setTemplate(e.target.value)} 
                rows="3"
                className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
              />
              <span className="text-[9px] text-gray-400 block font-semibold">Supports variables like {"{farmer_name}"} or {"{scheme_name}"}.</span>
            </div>

            <button 
              type="submit" 
              className="bg-brand-darkest hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              Send Broadcast Campaign <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Segment Builder */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-medium" /> Segment Builder
          </h3>

          <div className="space-y-3.5 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Target Location</label>
              <select value={selState} onChange={(e) => setSelState(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest">
                <option value="all">All Operational States</option>
                <option value="Haryana">Haryana Resident</option>
                <option value="Punjab">Punjab Resident</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Crop Cultivation</label>
              <select value={selCrop} onChange={(e) => setSelCrop(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest">
                <option value="all">All Crops</option>
                <option value="Paddy">Paddy</option>
                <option value="Wheat">Wheat</option>
              </select>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-[10px] text-emerald-900 leading-relaxed font-semibold">
              <span className="font-black block uppercase text-[8px] text-emerald-800">Dynamic Segment Size:</span>
              3,450 Farmers match these criteria filters. Broadcasting will target only this subgroup.
            </div>
          </div>
        </div>

      </div>

      {/* Estimated Scheme Match Recommendations Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-medium" /> Estimated Scheme Match Recommendations
          </h3>
        </div>

        <div className="overflow-x-auto text-xs font-semibold text-brand-darkest">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-150 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Farmer</th>
                <th className="p-4">Location</th>
                <th className="p-4">Crop</th>
                <th className="p-4 text-center">Match Score</th>
                <th className="p-4">Recommended Schemes</th>
                <th className="p-4 text-center">Outreach Status</th>
                <th className="p-4 text-center">Last Communication</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {analytics.farmers.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/30">
                  <td className="p-4">
                    <p className="font-black uppercase">{f.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{f.fpo}</p>
                  </td>
                  <td className="p-4 text-gray-700">{f.state}</td>
                  <td className="p-4 text-gray-700">{f.crop}</td>
                  <td className="p-4 text-center text-brand-medium font-bold">
                    {f.id === "f-01" ? "95%" : f.id === "f-02" ? "92%" : "88%"}
                  </td>
                  <td className="p-4 text-gray-700">
                    {(f.schemes || []).map(schemeName => {
                      if (schemeName === "PM-Kisan") return "PM-KISAN Income Support";
                      if (schemeName === "PMFBY") return "PMFBY Crop Risk Cover";
                      return schemeName;
                    }).join(", ")}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      f.outreachStatus === "Sent" 
                        ? "bg-brand-medium/10 text-brand-medium" 
                        : f.outreachStatus === "Interacted" 
                        ? "bg-emerald-50 text-emerald-800" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {f.outreachStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-500">{f.lastComm}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleSingleOutreach(f.id)}
                      className="text-[10px] font-black bg-brand-darkest hover:bg-brand-dark text-white px-3 py-1.5 rounded-xl transition uppercase tracking-wider"
                    >
                      Outreach
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Awareness Analytics */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5 border-b border-gray-100 pb-2">
          <HelpCircle className="w-4 h-4 text-brand-medium" /> Awareness Analytics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-semibold">
          <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
            <span className="font-black text-brand-darkest uppercase text-[9px] block">Top Searched Schemes</span>
            <ul className="space-y-1 text-gray-700">
              <li>1. PM-Kisan Income</li>
              <li>2. KCC Interest Subvention</li>
              <li>3. Tractor Subsidy 2026</li>
            </ul>
          </div>

          <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
            <span className="font-black text-brand-darkest uppercase text-[9px] block">Top Viewed Schemes</span>
            <ul className="space-y-1 text-gray-700">
              <li>1. PMFBY Crop Risk Cover</li>
              <li>2. Solar Pump Subvention</li>
              <li>3. Horticulture Subsidy</li>
            </ul>
          </div>

          <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
            <span className="font-black text-brand-darkest uppercase text-[9px] block">Top Questions</span>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>"How to seed Aadhaar?"</li>
              <li>"Timeline for payouts?"</li>
              <li>"How FPOs verify accounts?"</li>
            </ul>
          </div>

          <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
            <span className="font-black text-brand-darkest uppercase text-[9px] block">Top Advisory Requests</span>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Land registry uploads</li>
              <li>DBT bank mismatch links</li>
              <li>Organic crop certification</li>
            </ul>
          </div>

          <div className="space-y-2 bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl">
            <span className="font-black text-brand-darkest uppercase text-[9px] block">Top Regions By Interest</span>
            <ul className="space-y-1 text-gray-700">
              <li>1. Haryana (Sonipat, Rohtak)</li>
              <li>2. Punjab (Amritsar, Patiala)</li>
              <li>3. Rajasthan (Alwar)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
