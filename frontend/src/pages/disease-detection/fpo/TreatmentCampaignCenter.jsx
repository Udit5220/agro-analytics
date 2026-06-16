import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Activity, Calendar, Users, ShieldAlert, Plus, 
  Play, Pause, CheckCircle, Package, ArrowRight, X, Trash2 
} from "lucide-react";
import { campaignApi } from "../../../services/apiService";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

export default function TreatmentCampaignCenter() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState(null);

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignApi.getCampaigns();
      if (res.success) {
        setCampaigns(res.data);
        if (res.data.length > 0) {
          setSelectedCampId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    disease: "Rice Blast",
    villages: [],
    type: "Chemical Spray",
    startDate: "",
    officers: 1,
    targetFarmers: 100,
    notes: ""
  });

  // Overview calculations
  const totalCampaigns = campaigns.length;
  const activeCount = campaigns.filter(c => c.status === "Active").length;
  const completedCount = campaigns.filter(c => c.status === "Completed").length;
  const pendingCount = campaigns.filter(c => c.status === "Pending").length;
  const successRate = 94.5; // Fixed metric mockup
  const selectedCamp = campaigns.find(c => c.id === selectedCampId) || (campaigns.length > 0 ? campaigns[0] : null);

  // Resource Planning calculations mockups
  const resources = {
    fungicide: 420, // kg
    pesticide: 680, // liters
    cost: "₹1,24,500",
    inventoryOk: true // green/red status
  };

  // Form submission handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: newCampaign.name || "Untitled Campaign",
      disease: newCampaign.disease,
      villages: newCampaign.villages.length ? newCampaign.villages : ["General Sector"],
      progress: 0,
      status: "Pending",
      officers: Number(newCampaign.officers),
      targetFarmers: Number(newCampaign.targetFarmers),
      completedFarmers: 0,
      type: newCampaign.type,
      startDate: newCampaign.startDate || new Date().toISOString().split("T")[0],
      notes: newCampaign.notes
    };

    try {
      const res = await campaignApi.createCampaign(payload);
      if (res.success) {
        setCampaigns(prev => [res.data, ...prev]);
        setSelectedCampId(res.data.id);
        setShowForm(false);
        // Reset Form
        setNewCampaign({
          name: "",
          disease: "Rice Blast",
          villages: [],
          type: "Chemical Spray",
          startDate: "",
          officers: 1,
          targetFarmers: 100,
          notes: ""
        });
      }
    } catch (err) {
      console.error("Failed to create campaign:", err.message);
    }
  };

  const handleVillageSelect = (village) => {
    setNewCampaign(prev => {
      const idx = prev.villages.indexOf(village);
      if (idx > -1) {
        return { ...prev, villages: prev.villages.filter(v => v !== village) };
      }
      return { ...prev, villages: [...prev.villages, village] };
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    const target = campaigns.find(c => c.id === id);
    if (!target) return;
    
    const progress = newStatus === "Completed" ? 100 : target.progress;
    
    try {
      const res = await campaignApi.updateCampaign(id, { status: newStatus, progress });
      if (res.success) {
        setCampaigns(prev => prev.map(c => c.id === id ? res.data : c));
      }
    } catch (err) {
      console.error("Failed to update campaign status:", err.message);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await campaignApi.deleteCampaign(id);
      if (res.success) {
        setCampaigns(prev => {
          const updated = prev.filter(c => c.id !== id);
          if (selectedCampId === id) {
            setSelectedCampId(updated.length > 0 ? updated[0].id : null);
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to delete campaign:", err.message);
    }
  };

  const columns = [
    {
      header: "Campaign",
      accessor: "name",
      cell: (value, row) => (
        <div>
          <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[8.5px] font-black text-slate-550 uppercase tracking-wider block w-fit mb-1">
            {row.type}
          </span>
          <span className="font-black text-slate-900 block">{value}</span>
          <span className="text-[10px] text-slate-550 block font-semibold mt-0.5">Start: {row.startDate}</span>
        </div>
      )
    },
    {
      header: "Target Details",
      accessor: "disease",
      cell: (value, row) => (
        <div>
          <span className="font-bold text-slate-800 block">Disease: {value}</span>
          <span className="text-[10px] text-slate-550 block font-semibold mt-0.5">
            Villages: {row.villages?.join(", ") || "N/A"}
          </span>
        </div>
      )
    },
    {
      header: "Personnel & Reach",
      accessor: "targetFarmers",
      cell: (value, row) => (
        <div>
          <span className="block font-semibold text-slate-700">Officers: {row.officers}</span>
          <span className="text-[10px] text-slate-555 block font-semibold mt-0.5">
            Farmers: {row.completedFarmers} / {value}
          </span>
        </div>
      )
    },
    {
      header: "Coverage",
      accessor: "progress",
      cell: (value) => (
        <div className="w-24 space-y-1">
          <div className="flex justify-between text-[10px] font-bold">
            <span>{value}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#31572c] transition-all" style={{ width: `${value}%` }} />
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => (
        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
          value === "Completed" ? "bg-emerald-100 text-emerald-700" : value === "Active" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
        }`}>
          {value}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      sortable: false,
      cell: (value, row) => (
        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
          {(row.status === "Pending" || row.status === "Paused") && (
            <button
              type="button"
              onClick={() => handleStatusChange(row.id, "Active")}
              className="px-2 py-1 bg-[#31572c] hover:bg-[#132a13] text-white rounded text-[9px] font-black uppercase tracking-wider cursor-pointer"
            >
              {row.status === "Pending" ? "Start" : "Resume"}
            </button>
          )}
          {row.status === "Active" && (
            <button
              type="button"
              onClick={() => handleStatusChange(row.id, "Paused")}
              className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[9px] font-black uppercase tracking-wider cursor-pointer"
            >
              Pause
            </button>
          )}
          {row.status !== "Completed" && (
            <button
              type="button"
              onClick={() => handleStatusChange(row.id, "Completed")}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-black uppercase tracking-wider cursor-pointer"
            >
              Complete
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDeleteCampaign(row.id)}
            className="p-1 hover:bg-red-50 rounded text-red-650 cursor-pointer"
            title="Delete Campaign"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title & Action */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#132a13] tracking-tight">Therapeutic Treatment Campaigns</h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Establish, allocate resources for, and track chemical or biological containment drives.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Campaigns"
          value={activeCount}
          trend="+2 this week"
          trendType="neutral"
          subtext="Live containment campaigns"
          icon={<Activity className="text-[#31572c]" />}
        />
        <StatsCard
          title="Completed Campaigns"
          value={completedCount}
          trend="98% target met"
          trendType="success"
          subtext="Successfully finished drives"
          icon={<CheckCircle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Pending Campaigns"
          value={pendingCount}
          trend="Awaiting fields"
          trendType="neutral"
          subtext="Scheduled deployments"
          icon={<Calendar className="text-[#31572c]" />}
        />
        <StatsCard
          title="Success Rate %"
          value={`${successRate}%`}
          trend="+1.2% MoM"
          trendType="success"
          subtext="Overall drive effectiveness"
          icon={<Users className="text-[#31572c]" />}
        />
      </div>

      {/* Interactive Modal/Form Overlay */}
      {showForm && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-slate-100 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Create Treatment Campaign
              </h3>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="p-1 hover:bg-slate-105 rounded text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Campaign Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kharindwa Rust Control"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Disease Target</label>
                  <select
                    value={newCampaign.disease}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, disease: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-2 py-2 bg-white font-bold"
                  >
                    <option value="Rice Blast">Rice Blast</option>
                    <option value="Yellow Rust">Yellow Rust</option>
                    <option value="Late Blight">Late Blight</option>
                    <option value="Downy Mildew">Downy Mildew</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Campaign Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-2 py-2 bg-white font-bold"
                  >
                    <option value="Chemical Spray">Chemical Spray</option>
                    <option value="Prophylactic Dusting">Prophylactic Dusting</option>
                    <option value="Systemic Fungicide">Systemic Fungicide</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Target Villages (Select multiple)</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Kharindwa", "Bhucho Mandi", "Raman", "Shirur", "Mehna", "Talwandi"].map((v) => {
                    const isSelected = newCampaign.villages.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleVillageSelect(v)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase transition ${
                          isSelected ? "bg-[#31572c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Start Date</label>
                  <input 
                    type="date" 
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Target Farmers</label>
                  <input 
                    type="number" 
                    value={newCampaign.targetFarmers}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, targetFarmers: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Campaign Notes & Directives</label>
                <textarea 
                  rows="2"
                  placeholder="Enter chemical dosage limits or field officer team assignments..."
                  value={newCampaign.notes}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Submit & Deploy Campaign
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Campaigns Table - Full Width */}
      <div className="space-y-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#31572c]" /> Active Deployment Campaigns
        </h3>

        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#31572c]" />
            </div>
          ) : (
            <GenericTable
              columns={columns}
              data={campaigns}
              onRowClick={(row) => setSelectedCampId(row.id)}
              emptyMessage="No treatment campaigns deployed yet."
            />
          )}
        </div>
      </div>

      {/* Bottom Section - Details & Calculations in the same row below the table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Detailed Selected Campaign Info */}
        {selectedCamp ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#31572c]">
                <Activity className="w-4 h-4" /> Campaign Details & Directives
              </span>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                selectedCamp.status === "Completed" ? "bg-emerald-100 text-emerald-700" : selectedCamp.status === "Active" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}>
                {selectedCamp.status}
              </span>
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight">{selectedCamp.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Type: {selectedCamp.type}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Directives & Notes</span>
                <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50 italic font-medium">{selectedCamp.notes || "No additional directives provided."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Start Date</span>
                  <span className="text-slate-900 font-bold text-[11px]">{selectedCamp.startDate}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Field Officers</span>
                  <span className="text-slate-900 font-bold text-[11px]">{selectedCamp.officers} Leads</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100/80">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Coverage Breakdown</span>
                <div className="flex justify-between font-bold text-[11px]">
                  <span>Farmers Reached:</span>
                  <span>{selectedCamp.completedFarmers} of {selectedCamp.targetFarmers} ({selectedCamp.targetFarmers > 0 ? Math.round((selectedCamp.completedFarmers/selectedCamp.targetFarmers)*100) : 0}%)</span>
                </div>
                
                {/* Daily completion Sparkline SVG */}
                <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase text-slate-455">Daily Runs:</span>
                  <svg className="w-32 h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M 0 18 L 20 12 L 40 14 L 60 5 L 80 8 L 100 2" fill="none" stroke="#31572c" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center text-slate-400 text-xs py-8">
            Select a campaign from the table to view detailed metrics.
          </div>
        )}

        {/* Column 2: Resource Planning Widget */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#31572c]" /> Required Inventory Calculations
          </h3>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[9px] text-slate-450 uppercase block font-black">Fungicide volume</span>
                <span className="text-sm font-black text-slate-900">{resources.fungicide} kg</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[8.5px] font-black uppercase">
                Available
              </span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[9px] text-slate-450 uppercase block font-black">Pesticide volume</span>
                <span className="text-sm font-black text-slate-900">{resources.pesticide} L</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[8.5px] font-black uppercase">
                Available
              </span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[9px] text-slate-455 uppercase block font-black">Estimated Campaign cost</span>
                <span className="text-sm font-black text-slate-900">{resources.cost}</span>
              </div>
              <span className="text-[9px] text-slate-500 font-extrabold">FPO Allocation</span>
            </div>

            <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl text-[10px] text-red-800 leading-normal font-bold flex gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-650" />
              Ensure chemical inventory releases match designated buffer reserve thresholds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
