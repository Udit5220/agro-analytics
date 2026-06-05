import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldAlert, Map, Users, Sprout, ArrowUpRight, 
  Activity, AlertTriangle, FileText, CheckCircle, 
  TrendingUp, Award, DollarSign, ExternalLink
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { campaignApi } from "../../../services/apiService";

export default function AgriDiseaseCommandCenter() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch campaigns from the secondary database agro-india (handled automatically by backend)
  useEffect(() => {
    campaignApi.getCampaigns()
      .then(res => {
        setCampaigns(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching campaigns:", err);
        setLoading(false);
      });
  }, []);

  // Outbreaks at sourcing zones
  const sourcingOutbreaks = [
    { id: 1, FPO: "Kharindwa Rice Cluster", crop: "Rice", disease: "Rice Blast", severity: "Critical", status: "Active Treatment", exposure: "₹18,50,000" },
    { id: 2, FPO: "Bhucho Mandi Wheat Coop", crop: "Wheat", disease: "Yellow Rust", severity: "High", status: "Monitoring", exposure: "₹42,50,000" },
    { id: 3, FPO: "Raman Potato Growers", crop: "Potato", disease: "Late Blight", severity: "Moderate", status: "Contained", exposure: "₹8,20,000" },
    { id: 4, group: "Ludhiana Wheat FPO", crop: "Wheat", disease: "White Rust", severity: "Low", status: "Monitoring", exposure: "₹2,10,000" }
  ];

  const diseaseDistribution = [
    { name: "Yellow Rust (Wheat)", share: 45, color: "bg-red-500" },
    { name: "Rice Blast (Rice)", share: 30, color: "bg-amber-500" },
    { name: "Late Blight (Potato)", share: 15, color: "bg-blue-500" },
    { name: "Others", share: 10, color: "bg-slate-350" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-1">
        <div className="h-10 w-10 bg-[#31572c]/10 text-[#31572c] rounded-xl flex items-center justify-center">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">
            Agribusiness Disease Command Center
          </h1>
          <p className="text-slate-500 text-[11px] md:text-xs font-semibold mt-0.5">
            Monitor pathogen spread across contract FPOs, mitigate sourcing deficits, and track containment campaigns.
          </p>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Acreage at Risk"
          value="4,250 ac"
          trend="Wheat & Rice"
          trendType="neutral"
          subtext="High vulnerability zones"
          icon={<ShieldAlert className="text-[#31572c]" />}
        />
        <StatsCard
          title="Active Outbreak Zones"
          value="6 Villages"
          trend="+2 this week"
          trendType="danger"
          subtext="Containment drives active"
          icon={<Map className="text-[#31572c]" />}
        />
        <StatsCard
          title="Monitored Growers"
          value="1,840"
          trend="94% engagement"
          trendType="success"
          subtext="Active contract checks"
          icon={<Users className="text-[#31572c]" />}
        />
        <StatsCard
          title="Sourcing Deficit Est."
          value="12%"
          trend="Within tolerance"
          trendType="success"
          subtext="Estimated 120 tons impact"
          icon={<Sprout className="text-[#31572c]" />}
        />
      </div>

      {/* Revenue Exposure & Procurement Impact Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Exposure */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#31572c]" /> Sourcing Revenue Exposure
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Capital Exposed</span>
              <span className="text-3xl font-black text-slate-900">₹69,20,000</span>
            </div>
            <div className="space-y-2.5 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center bg-red-50 p-2.5 rounded-xl border border-red-100/30">
                <span className="text-red-700 font-bold">Wheat (Yellow Rust Exposure)</span>
                <span className="font-black text-red-750">₹42,50,000</span>
              </div>
              <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded-xl border border-amber-100/30">
                <span className="text-amber-800 font-bold">Rice (Rice Blast Exposure)</span>
                <span className="font-black text-amber-850">₹18,50,000</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-605 font-bold">Potato (Late Blight Exposure)</span>
                <span className="font-black text-slate-705">₹8,20,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disease Distribution Analytics */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#31572c]" /> Disease Distribution %
          </h3>
          <div className="space-y-4.5 pt-2">
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
              {diseaseDistribution.map((item, idx) => (
                <div key={idx} className={`h-full ${item.color}`} style={{ width: `${item.share}%` }} title={`${item.name}: ${item.share}%`} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3.5 text-[10px] font-bold text-slate-700">
              {diseaseDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-sm shrink-0 ${item.color}`} />
                  <span className="truncate">{item.name} ({item.share}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Procurement Impact Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#31572c]" /> Procurement Status
            </h3>
            <div className="space-y-3.5 text-xs text-slate-700 font-semibold pt-1">
              <div className="flex justify-between">
                <span>Contract target volume</span>
                <span className="font-black text-slate-905">2,800 Tons</span>
              </div>
              <div className="flex justify-between text-red-650">
                <span>Expected shortfalls</span>
                <span className="font-black">-120 Tons</span>
              </div>
              <div className="flex justify-between text-[#31572c]">
                <span>Secured through sprays</span>
                <span className="font-black">+450 Tons</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/module/disease-detection/supply-chain-risk")}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            Open Logistics Room <ExternalLink className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Main Grid: Business Risk Table & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Business Risk Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#31572c]" /> Contract Sourcing Outbreak Risk Registry
          </h3>

          <GenericTable
            columns={[
              { header: "Contract FPO / Coop", accessor: "FPO", className: "font-black text-slate-900" },
              { header: "Sourcing Crop", accessor: "crop" },
              { header: "Pathogen Threat", accessor: "disease" },
              { 
                header: "Revenue Exposure", 
                accessor: "exposure",
                cell: (val) => <span className="font-bold text-slate-700">{val}</span>
              },
              { 
                header: "Severity", 
                accessor: "severity",
                cell: (val) => (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    val === "Critical" ? "bg-red-100 text-red-700" : val === "High" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-750"
                  }`}>
                    {val}
                  </span>
                )
              },
              { 
                header: "Status", 
                accessor: "status",
                cell: (val) => (
                  <span className="text-[10px] text-slate-500 font-bold">{val}</span>
                )
              }
            ]}
            data={sourcingOutbreaks}
            showSearch={false}
            itemsPerPage={5}
          />
        </div>

        {/* Executive Action Center & AI recommendations */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> AI Recommendations
            </h3>
            <p className="text-[10px] text-slate-600 font-bold leading-relaxed mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50">
              Rice Blast severity in Kharindwa village has increased by 14% over the last 48 hours. Sourcing target allocations for Basmati Rice may fall short by 8% if containment drives are not expedited. We suggest activating alternative supply routes from Punjab West.
            </p>
          </div>
          
          {/* Action Center */}
          <div className="space-y-2.5 pt-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Executive Action Center</span>
            <button
              onClick={() => navigate("/module/disease-detection/contract-farming")}
              className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4" /> Evaluate Contract Risks
            </button>
            <button
              onClick={() => navigate("/module/disease-detection/interventions")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" /> Launch Treatment Campaign
            </button>
          </div>
        </div>

      </div>

      {/* Active Treatment Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-[#31572c]" /> FPO Treatment Campaigns (Database: agro-india)
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#31572c]" />
          </div>
        ) : (
          <GenericTable
            columns={[
              { header: "Campaign Title", accessor: "name", className: "font-black text-slate-900" },
              { header: "Target Disease", accessor: "disease" },
              { header: "Type", accessor: "type" },
              { 
                header: "Progress", 
                accessor: "progress",
                cell: (val) => (
                  <div className="w-24 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>{val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#31572c]" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                )
              },
              { 
                header: "Status", 
                accessor: "status",
                cell: (val) => (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    val === "Completed" ? "bg-emerald-100 text-emerald-700" : val === "Active" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {val}
                  </span>
                )
              }
            ]}
            data={campaigns}
            emptyMessage="No campaigns active on agro-india database currently."
          />
        )}
      </div>
    </div>
  );
}
