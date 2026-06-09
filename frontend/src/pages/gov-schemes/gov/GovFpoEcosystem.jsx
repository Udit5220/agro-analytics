import React, { useState } from "react";
import { 
  Building2, 
  Map, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  ShieldAlert, 
  Send,
  Zap
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

export default function GovFpoEcosystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rankingFilter, setRankingFilter] = useState("all"); // all, top, improved, risk

  // Support intervention states
  const [selectedFpo, setSelectedFpo] = useState(null);
  const [interventionType, setInterventionType] = useState("Dispatch Training");
  const [dispatchProgress, setDispatchProgress] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const fpos = [
    { id: "fpo-01", name: "Sonipat Organic Growers", members: 720, funding: "₹1.8 Cr", score: 92, status: "Active", rank: "top", region: "Haryana North" },
    { id: "fpo-02", name: "Murthal Agro Producer Co", members: 480, funding: "₹95 Lakh", score: 84, status: "Active", rank: "improved", region: "Haryana North" },
    { id: "fpo-03", name: "Ganaur Fruit Growers", members: 310, funding: "₹45 Lakh", score: 68, status: "Under-performing", rank: "risk", region: "Haryana East" },
    { id: "fpo-04", name: "Kharindwa Farmer Club", members: 210, funding: "₹15 Lakh", score: 55, status: "At-Risk", rank: "risk", region: "Haryana East" },
    { id: "fpo-05", name: "Panipat Allied Cooperative", members: 640, funding: "₹1.4 Cr", score: 88, status: "Active", rank: "top", region: "Haryana Central" }
  ];

  const columns = [
    { header: "FPO NAME", accessor: "name", sortable: true, cell: (v) => <span className="font-bold text-gray-800">{v}</span> },
    { header: "REGION", accessor: "region", sortable: true },
    { header: "MEMBERS", accessor: "members", sortable: true },
    { header: "SECURED FUNDING", accessor: "funding", sortable: true, cell: (v) => <span className="font-mono">{v}</span> },
    { header: "HEALTH SCORE", accessor: "score", sortable: true, cell: (v) => (
      <div className="flex items-center gap-1.5 font-bold">
        <span className={v >= 85 ? "text-emerald-700" : v >= 70 ? "text-amber-600" : "text-red-500"}>{v}%</span>
        <div className="w-10 bg-gray-150 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${v >= 85 ? "bg-[#4f772d]" : v >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${v}%` }} />
        </div>
      </div>
    )},
    { header: "STATUS", accessor: "status", sortable: true, cell: (v) => (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
        v === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
      }`}>{v}</span>
    )}
  ];

  const filteredFpos = fpos.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = rankingFilter === "all" || f.rank === rankingFilter;
    return matchesSearch && matchesRank;
  });

  const handleDispatchIntervention = (e) => {
    e.preventDefault();
    if (!selectedFpo) return;
    setDispatchProgress(true);
    setDispatchSuccess(false);

    setTimeout(() => {
      setDispatchProgress(false);
      setDispatchSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#4f772d]" />
          FPO Ecosystem Monitoring Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor cooperative health metrics, infrastructure assets, audit compliances, and trigger targeted governance support.
        </p>
      </div>

      {/* KPI dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total FPOs" value="45" subtext="Registered Cooperatives" icon={<Building2 className="text-[#4f772d]" />} />
        <StatsCard title="Active FPOs" value="38" trend="84%" trendType="success" subtext="Regular operations & filings" />
        <StatsCard title="Funded FPOs" value="28" subtext="Secured Infrastructure Grants" />
        <StatsCard title="High-Performing" value="12" subtext="Health score above 85%" />
        <StatsCard title="At-Risk FPOs" value="4" trend="10%" trendType="danger" subtext="Pending audits / compliances" />
      </div>

      {/* Ranking and Intervention Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FPO Ranking */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#4f772d]" /> Ecosystem Ranking
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Filter registered FPOs by performance metrics, improvements, or compliance failure indicators.
            </p>

            <div className="space-y-2">
              <button 
                onClick={() => setRankingFilter("all")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                  rankingFilter === "all" ? "bg-[#132a13]/10 border-[#4f772d]/30" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
              >
                <span>All FPOs</span>
                <span className="bg-[#132a13] text-white px-2 py-0.5 rounded-full">5</span>
              </button>
              <button 
                onClick={() => setRankingFilter("top")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                  rankingFilter === "top" ? "bg-emerald-50 border-emerald-250/50" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
              >
                <span className="text-emerald-800">Top 100 Performers</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full">2</span>
              </button>
              <button 
                onClick={() => setRankingFilter("improved")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                  rankingFilter === "improved" ? "bg-blue-50 border-blue-250/50" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
              >
                <span className="text-blue-800">Most Improved FPOs</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">1</span>
              </button>
              <button 
                onClick={() => setRankingFilter("risk")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                  rankingFilter === "risk" ? "bg-red-50 border-red-250/50" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
              >
                <span className="text-red-800">High Risk (Audit Pending)</span>
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full">2</span>
              </button>
            </div>
          </div>
        </div>

        {/* FPO Support Intervention Engine */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#4f772d]" /> FPO Support Intervention Engine
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Select an FPO and dispatch direct operational training, compliance warnings, or expedite pending infrastructure support requests.
            </p>

            {dispatchSuccess ? (
              <div className="p-6 text-center space-y-3 bg-[#f4f7f4]/45 border border-[#4f772d]/10 rounded-2xl animate-fadeIn my-auto">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-xs">Intervention Dispatched!</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed px-4">
                  Successfully initiated <span className="font-bold">{interventionType}</span> workflow for <span className="font-bold">{selectedFpo.name}</span>. Lead officers have been notified.
                </p>
                <button 
                  onClick={() => setDispatchSuccess(false)}
                  className="text-[10px] font-bold text-[#4f772d] hover:underline"
                >
                  Schedule another intervention
                </button>
              </div>
            ) : (
              <form onSubmit={handleDispatchIntervention} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Select Target FPO</label>
                    <select 
                      onChange={(e) => setSelectedFpo(fpos.find(f => f.id === e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                      required
                    >
                      <option value="">-- Choose FPO --</option>
                      {fpos.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Intervention Action</label>
                    <select 
                      value={interventionType}
                      onChange={(e) => setInterventionType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                    >
                      <option>Dispatch Training</option>
                      <option>Issue Compliance Warning</option>
                      <option>Expedite Infra Grant</option>
                      <option>Schedule Audit Panel</option>
                    </select>
                  </div>
                </div>

                {selectedFpo && (
                  <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 space-y-2">
                    <p className="font-bold text-gray-700">{selectedFpo.name} Info:</p>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500 font-mono">
                      <div>Members: {selectedFpo.members}</div>
                      <div>Funding: {selectedFpo.funding}</div>
                      <div>Health: {selectedFpo.score}%</div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={dispatchProgress || !selectedFpo}
                  className={`w-full text-xs font-bold text-center py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    selectedFpo 
                      ? "bg-[#132a13] hover:bg-[#31572c] text-white" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {dispatchProgress ? "Dispatching..." : "Launch Intervention Team"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-[#132a13] text-sm">FPO Ecosystem Directory</h3>
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 px-3 py-1.5 rounded-xl w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search FPOs..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full"
            />
          </div>
        </div>

        <GenericTable 
          columns={columns}
          data={filteredFpos}
          itemsPerPage={5}
          showSearch={false}
          showSort={true}
          emptyMessage="No FPOs found matching search filters."
        />
      </div>
    </div>
  );
}
