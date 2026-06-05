import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Shield, Play, Pause, Trash2, Plus, 
  Activity, CheckCircle, Navigation, Users, Sprout 
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { campaignApi } from "../../../services/apiService";

const FIELD_TEAMS = [
  { id: 1, team: "North Spray Squadron", region: "Kharindwa Village", strength: "4 Operators, 2 Drones", status: "Active Spraying" },
  { id: 2, team: "Central Disease Unit", region: "Bhucho Block", strength: "3 Operators, 1 Vector Analyzer", status: "Surveying" },
  { id: 3, team: "Emergency Rust Team", region: "Ludhiana Cluster", strength: "5 Operators, 3 Tractor Sprayers", status: "Standby" }
];

export default function BusinessInterventions() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    disease: "",
    type: "Fungicide Spraying",
    progress: 0,
    status: "Pending"
  });

  const fetchCampaigns = () => {
    setLoading(true);
    campaignApi.getCampaigns()
      .then(res => {
        setCampaigns(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading campaigns:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    campaignApi.createCampaign(form)
      .then(() => {
        setIsModalOpen(false);
        setForm({ name: "", disease: "", type: "Fungicide Spraying", progress: 0, status: "Pending" });
        fetchCampaigns();
      })
      .catch(err => {
        alert("Error creating campaign: " + err.message);
      });
  };

  const handleUpdateStatus = (id, newStatus) => {
    campaignApi.updateCampaign(id, { status: newStatus })
      .then(() => {
        fetchCampaigns();
      })
      .catch(err => {
        alert("Error updating campaign: " + err.message);
      });
  };

  const handleDeleteCampaign = (id) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      campaignApi.deleteCampaign(id)
        .then(() => {
          fetchCampaigns();
        })
        .catch(err => {
          alert("Error deleting campaign: " + err.message);
        });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Business Intervention Control Room</h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Dispatch spray teams, monitor field interventions, and manage active treatment campaigns.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#31572c] hover:bg-[#132a13] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Intervention KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Intervention Coverage"
          value="78%"
          trend="Target: 90%"
          trendType="neutral"
          subtext="Treated at-risk acreage"
          icon={<Shield className="text-[#31572c]" />}
        />
        <StatsCard
          title="Drones Scheduled"
          value="6 Drones"
          trend="4 Active today"
          trendType="success"
          subtext="Autonomous spraying units"
          icon={<Navigation className="text-[#31572c]" />}
        />
        <StatsCard
          title="Active Field Teams"
          value="3 Teams"
          trend="Across 6 zones"
          trendType="success"
          subtext="Spray & inspection workers"
          icon={<Users className="text-[#31572c]" />}
        />
        <StatsCard
          title="Yield Saved Est."
          value="450 Tons"
          trend="Value: ₹42.5L"
          trendType="success"
          subtext="Pathogen damage prevented"
          icon={<Sprout className="text-[#31572c]" />}
        />
      </div>

      {/* Campaigns Table & Field Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign Management Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#31572c]" /> Outbreak Interventions & Campaigns
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
                  header: "Status", 
                  accessor: "status",
                  cell: (val) => (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      val === "Completed" ? "bg-emerald-100 text-emerald-700" : val === "Active" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {val}
                    </span>
                  )
                },
                {
                  header: "Actions",
                  accessor: "id",
                  cell: (_, row) => (
                    <div className="flex items-center gap-2">
                      {row.status === "Pending" || row.status === "Paused" ? (
                        <button
                          onClick={() => handleUpdateStatus(row._id || row.id, "Active")}
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 rounded-lg cursor-pointer"
                          title="Start Campaign"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : row.status === "Active" ? (
                        <button
                          onClick={() => handleUpdateStatus(row._id || row.id, "Paused")}
                          className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50 rounded-lg cursor-pointer"
                          title="Pause Campaign"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDeleteCampaign(row._id || row.id)}
                        className="p-1 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200/50 rounded-lg cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={campaigns}
              emptyMessage="No active campaigns in database."
            />
          )}
        </div>

        {/* Field Team Tracker */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#31572c]" /> Field Operations Tracking
          </h3>
          <div className="space-y-3.5 text-xs text-slate-700 font-semibold pt-1">
            {FIELD_TEAMS.map((team, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{team.team}</span>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-[#31572c]/10 text-[#31572c]">
                    {team.status}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Region: {team.region}</span>
                  <span>Assets: {team.strength}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Centered Modal Viewport (React Portal attached to document.body) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full p-6 space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#31572c]" /> Create Response Campaign
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Kharindwa Rust Spray Control"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-55 font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Target Disease</label>
                <input
                  type="text"
                  required
                  value={form.disease}
                  onChange={(e) => setForm(prev => ({ ...prev, disease: e.target.value }))}
                  placeholder="e.g. Yellow Rust"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-55 font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Campaign Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 bg-white font-bold"
                >
                  <option value="Fungicide Spraying">Fungicide Spraying</option>
                  <option value="Pesticide Spraying">Pesticide Spraying</option>
                  <option value="Bio-Control Treatment">Bio-Control Treatment</option>
                  <option value="Grower Advisory Campaign">Grower Advisory Campaign</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-4"
              >
                Launch Campaign (Write: agro-india)
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
