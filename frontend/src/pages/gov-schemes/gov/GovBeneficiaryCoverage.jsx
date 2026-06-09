import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Smartphone, 
  Layers, 
  Clock,
  Sparkles
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";

export default function GovBeneficiaryCoverage() {
  const [activeCategory, setActiveCategory] = useState("marginal"); // marginal, women, youth, tribal
  const [selectedVillage, setSelectedVillage] = useState(null);
  
  // Campaign launch states
  const [campaignSegment, setCampaignSegment] = useState("Crop Insurance");
  const [campaignBlock, setCampaignBlock] = useState("Sonipat Sector A");
  const [campaignProgress, setCampaignProgress] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(false);
  const [campaignSize, setCampaignSize] = useState(12000);

  const coverageDetails = {
    totalEligible: "5.4L",
    covered: "3.8L",
    uncovered: "1.6L",
    rate: "70.3%"
  };

  const opportunities = [
    { text: "25,000 eligible farmers are not enrolled in crop insurance in Panipat.", metric: "Panipat District" },
    { text: "12,000 eligible marginal farmers are not receiving KCC benefits.", metric: "Rohtak District" },
    { text: "Beneficiary coverage in tribal blocks remains below 40% threshold.", metric: "Jhajjar Block C" }
  ];

  const demographicLayers = {
    marginal: { title: "Marginal Farmers Coverage", covered: "1.8L", total: "2.5L", rate: 72, risk: "High", actionText: "Requires custom micro-lending options" },
    women: { title: "Women Farmer Enrolment", covered: "45k", total: "1.2L", rate: 37, risk: "Critical", actionText: "Lacks localized Mahila self-help groups" },
    youth: { title: "Youth Agri-Enterprises", covered: "22k", total: "40k", rate: 55, risk: "Medium", actionText: "Needs post-harvest technology grants" },
    tribal: { title: "Scheduled Castes / Tribes Inclusion", covered: "38k", total: "95k", rate: 40, risk: "High", actionText: "Language barrier during verification portal" }
  };

  const villageCoverage = [
    { name: "Sector A (Kharindwa Zone)", covered: 180, total: 240, block: "Sonipat", rate: 75, status: "Healthy" },
    { name: "Sector B (Bhadana Zone)", covered: 120, total: 180, block: "Sonipat", rate: 66, status: "Moderate" },
    { name: "Sector C (Murthal Zone)", covered: 90, total: 250, block: "Rohtak", rate: 36, status: "Underserved" },
    { name: "Sector D (Ganaur Zone)", covered: 30, total: 90, block: "Panipat", rate: 33, status: "Underserved" }
  ];

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    setCampaignProgress(true);
    setCampaignSuccess(false);

    // Randomize campaign size
    const sizes = { "Crop Insurance": 25000, "KCC Loans": 12000, "PM-Kisan Linkage": 18000 };
    setCampaignSize(sizes[campaignSegment] || 15000);

    setTimeout(() => {
      setCampaignProgress(false);
      setCampaignSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#4f772d]" />
          Beneficiary Coverage Intelligence
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor inclusion rates, track demographic penetration and direct campaign setups to uncovered segments.
        </p>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Eligible Population" value={coverageDetails.totalEligible} subtext="Total agricultural workers" icon={<Users className="text-[#4f772d]" />} />
        <StatsCard title="Covered Beneficiaries" value={coverageDetails.covered} trend={coverageDetails.rate} trendType="success" subtext="Receiving active benefits" />
        <StatsCard title="Uncovered Farmers" value={coverageDetails.uncovered} trend="29.7% Gap" trendType="danger" subtext="Not linked to any schemes" />
        <StatsCard title="Inclusion Target" value="95%" trend="Active Campaign" trendType="success" subtext="Target threshold by year end" />
      </div>

      {/* Opportunity Detection and Demographics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inclusion Segments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#4f772d]" /> Inclusion Segments
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Select a target segment to evaluate structural inclusion indexes and core operational recommendations.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(demographicLayers).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    activeCategory === key 
                      ? "bg-[#132a13]/10 border-[#4f772d]/45" 
                      : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  <p className="text-gray-500 text-[9px] uppercase tracking-wide">Category</p>
                  <p className="font-black mt-0.5 capitalize">{key}</p>
                  <p className="text-xs text-[#4f772d] font-bold mt-1">{value.rate}% Covered</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#f4f7f4] border border-[#4f772d]/10 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#132a13]">{demographicLayers[activeCategory].title}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                demographicLayers[activeCategory].risk === "Critical" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
              }`}>{demographicLayers[activeCategory].risk} Gap</span>
            </div>
            <p className="text-gray-600 leading-normal font-semibold">
              Covered: <span className="font-bold text-gray-800">{demographicLayers[activeCategory].covered}</span> of {demographicLayers[activeCategory].total}
            </p>
            <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-1">
              <Sparkles className="w-3.5 h-3.5 text-[#4f772d]" /> Recommendation: {demographicLayers[activeCategory].actionText}
            </p>
          </div>
        </div>

        {/* Opportunity Detection Engine */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#4f772d]" /> Opportunity Detection Engine
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              AI-driven triggers pointing to regions with severe policy mismatches and missing benefits.
            </p>
            <div className="space-y-3">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl text-xs">
                  <p className="font-semibold text-amber-900 leading-relaxed">{opp.text}</p>
                  <p className="text-[9px] font-bold text-amber-600 font-mono mt-1 tracking-wider uppercase">Region: {opp.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Campaign Setup */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#4f772d]" /> Direct Service Outreach Center
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Schedule direct broadcast campaigns (WhatsApp/SMS) targeted at unlinked farmers in selected blocks.
            </p>

            {campaignSuccess ? (
              <div className="text-center py-6 space-y-3 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-xs">Campaign Outreach Triggered!</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed px-4">
                  Successfully dispatched SMS advisories to <span className="font-bold">{campaignSize.toLocaleString()}</span> unregistered farmers in {campaignBlock}.
                </p>
                <button 
                  onClick={() => setCampaignSuccess(false)}
                  className="text-[10px] font-bold text-[#4f772d] hover:underline"
                >
                  Launch another campaign
                </button>
              </div>
            ) : (
              <form onSubmit={handleLaunchCampaign} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Target Scheme Campaign</label>
                  <select 
                    value={campaignSegment}
                    onChange={(e) => setCampaignSegment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                  >
                    <option>Crop Insurance</option>
                    <option>KCC Loans</option>
                    <option>PM-Kisan Linkage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Target District / Block</label>
                  <select 
                    value={campaignBlock}
                    onChange={(e) => setCampaignBlock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                  >
                    <option>Sonipat Sector A</option>
                    <option>Panipat Sector D</option>
                    <option>Rohtak Sector C</option>
                    <option>Jhajjar Block B</option>
                  </select>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-150">
                  <p className="text-[9px] text-gray-400 leading-relaxed">
                    Message Template: "Dear Farmer, You are currently not registered for the {campaignSegment}. Launching mobile enrollment drives at your block this Monday. Keep Aadhaar and land records ready."
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={campaignProgress}
                  className="w-full text-xs font-bold text-center py-2.5 bg-[#132a13] hover:bg-[#31572c] text-white rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {campaignProgress ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Distributing Messages...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" /> Dispatch SMS Outreach
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Underserved Regions Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-3">Underserved Regions Coverage Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {villageCoverage.map((village, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedVillage(village)}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-[#4f772d]/25 transition cursor-pointer flex flex-col justify-between h-28"
            >
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-gray-400 uppercase tracking-wide">{village.block} Block</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    village.status === "Healthy" ? "bg-emerald-50 text-emerald-700" : village.status === "Moderate" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-650"
                  }`}>{village.status}</span>
                </div>
                <h4 className="font-bold text-[#132a13] text-xs mt-1.5 truncate">{village.name}</h4>
              </div>
              <div>
                <p className="text-sm font-black text-[#132a13]">{village.rate}% <span className="text-xs font-medium text-gray-400">coverage</span></p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className={`h-full ${
                    village.rate >= 70 ? "bg-[#4f772d]" : village.rate >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`} style={{ width: `${village.rate}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Village Detailed Stats Overlay */}
        {selectedVillage && (
          <div className="mt-4 p-4 border border-gray-100 bg-[#f4f7f4]/20 rounded-2xl flex justify-between items-center animate-slideUp">
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#132a13]">{selectedVillage.name} Regional Coverage Audit</p>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                Active covered members: <span className="font-black text-gray-800">{selectedVillage.covered}</span> out of {selectedVillage.total} farmers. The remaining {selectedVillage.total - selectedVillage.covered} require seed/fertilizer subvention validation.
              </p>
            </div>
            <button 
              onClick={() => setSelectedVillage(null)}
              className="text-[10px] font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg bg-white"
            >
              Close Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
