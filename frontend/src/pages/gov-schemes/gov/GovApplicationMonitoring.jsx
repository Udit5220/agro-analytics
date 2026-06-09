import React, { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  UserCheck, 
  Search,
  Zap
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

export default function GovApplicationMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Reallocation simulator states
  const [reallocateFrom, setReallocateFrom] = useState("Panipat");
  const [reallocateTo, setReallocateTo] = useState("Karnal");
  const [backlogTransferCount, setBacklogTransferCount] = useState(150);
  const [reallocateProgress, setReallocateProgress] = useState(false);
  const [reallocateSuccess, setReallocateSuccess] = useState(false);

  // Initial backlog states
  const [backlogs, setBacklogs] = useState({
    Panipat: 340,
    Jhajjar: 210,
    Rohtak: 180,
    Karnal: 45,
    Sonipat: 32
  });

  const pipeline = [
    { stage: "Submitted", count: "14,500", pct: 100 },
    { stage: "Verified", count: "12,100", pct: 83 },
    { stage: "Approved", count: "9,450", pct: 65 },
    { stage: "Disbursed", count: "8,900", pct: 61 },
    { stage: "Completed", count: "8,200", pct: 56 }
  ];

  const districtSlaData = [
    { district: "Karnal", total: 3200, approved: 2980, avgDays: "3.2 Days", slaCompliance: 98, status: "Healthy" },
    { district: "Sonipat", total: 4500, approved: 3820, avgDays: "3.8 Days", slaCompliance: 96, status: "Healthy" },
    { district: "Rohtak", total: 2300, approved: 1840, avgDays: "6.5 Days", slaCompliance: 84, status: "Attention" },
    { district: "Jhajjar", total: 1800, approved: 1200, avgDays: "8.2 Days", slaCompliance: 76, status: "Attention" },
    { district: "Panipat", total: 2100, approved: 1100, avgDays: "14.5 Days", slaCompliance: 52, status: "Breached" }
  ];

  const columns = [
    { header: "DISTRICT", accessor: "district", sortable: true, cell: (v) => <span className="font-bold text-gray-800">{v}</span> },
    { header: "TOTAL FILED", accessor: "total", sortable: true },
    { header: "APPROVED", accessor: "approved", sortable: true, cell: (v) => <span className="text-emerald-700 font-bold">{v}</span> },
    { header: "AVG APPROVAL TIME", accessor: "avgDays", sortable: true },
    { header: "SLA COMPLIANCE", accessor: "slaCompliance", sortable: true, cell: (v) => (
      <div className="flex items-center gap-2">
        <span className="font-black text-[#132a13]">{v}%</span>
        <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${v >= 90 ? "bg-[#4f772d]" : v >= 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${v}%` }} />
        </div>
      </div>
    )},
    { header: "SLA STATUS", accessor: "status", sortable: true, cell: (v) => (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
        v === "Healthy" ? "bg-emerald-50 text-emerald-700" : v === "Attention" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-650"
      }`}>{v}</span>
    )}
  ];

  const handleReallocate = (e) => {
    e.preventDefault();
    if (reallocateFrom === reallocateTo) {
      alert("Source and target districts must be different.");
      return;
    }
    if (backlogs[reallocateFrom] < backlogTransferCount) {
      alert(`Selected count exceeds active backlogs in ${reallocateFrom}.`);
      return;
    }

    setReallocateProgress(true);
    setReallocateSuccess(false);

    setTimeout(() => {
      setBacklogs(prev => ({
        ...prev,
        [reallocateFrom]: prev[reallocateFrom] - backlogTransferCount,
        [reallocateTo]: prev[reallocateTo] + backlogTransferCount
      }));
      setReallocateProgress(false);
      setReallocateSuccess(true);
    }, 1500);
  };

  const filteredSlaData = districtSlaData.filter(d => 
    d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#4f772d]" />
          Application & Service Delivery Monitoring
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor application processing timelines, officer turnaround performance, and reallocate caseloads to bypass verification bottlenecks.
        </p>
      </div>

      {/* SLA summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Applications" value="14,500" subtext="Current Kharif season" icon={<Clock className="text-[#4f772d]" />} />
        <StatsCard title="Avg Approval Cycle" value="5.8 Days" trend="SLA Target: 7 Days" trendType="success" subtext="State level average" />
        <StatsCard title="Verification Backlogs" value={Object.values(backlogs).reduce((a, b) => a + b, 0)} trend="+4.2% week-on-week" trendType="danger" subtext="Cases pending review" />
        <StatsCard title="SLA Compliance Rate" value="81.2%" trend="Breached: 1 District" trendType="danger" subtext="State compliance average" />
      </div>

      {/* Application Funnel Flow */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-4">Verification Funnel & Verification Yield</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipeline.map((step, idx) => (
            <div key={idx} className="bg-gray-50/50 border border-gray-150 rounded-2xl p-4 flex flex-col justify-between h-24">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                <span>STAGE {idx + 1}</span>
                <span>{step.pct}% Yield</span>
              </div>
              <h4 className="font-bold text-[#132a13] text-xs">{step.stage}</h4>
              <p className="text-lg font-black text-[#4f772d]">{step.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reallocation Simulator & Backlog Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Load Reallocation */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#4f772d]" /> Caseload Reallocator (SLA Bypass)
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Simulate dispatching verify workloads from backlogged offices to high-performing districts.
            </p>

            {reallocateSuccess ? (
              <div className="text-center py-6 space-y-3 bg-[#f4f7f4]/45 border border-[#4f772d]/10 rounded-2xl animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-bold text-gray-900 text-xs">Workload Reallocated!</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed px-4">
                  Successfully transferred <span className="font-bold">{backlogTransferCount}</span> cases from {reallocateFrom} to {reallocateTo}.
                </p>
                <button 
                  onClick={() => setReallocateSuccess(false)}
                  className="text-[10px] font-bold text-[#4f772d] hover:underline"
                >
                  Transfer more workload
                </button>
              </div>
            ) : (
              <form onSubmit={handleReallocate} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">From (Backlogged)</label>
                    <select 
                      value={reallocateFrom}
                      onChange={(e) => setReallocateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                    >
                      {Object.keys(backlogs).map(k => (
                        <option key={k} value={k}>{k} ({backlogs[k]} cases)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">To (Efficient)</label>
                    <select 
                      value={reallocateTo}
                      onChange={(e) => setReallocateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                    >
                      {Object.keys(backlogs).map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Caseload Count to Transfer</label>
                  <input 
                    type="number"
                    value={backlogTransferCount}
                    onChange={(e) => setBacklogTransferCount(Number(e.target.value))}
                    max={backlogs[reallocateFrom]}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={reallocateProgress || reallocateFrom === reallocateTo}
                  className={`w-full text-xs font-bold text-center py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    reallocateFrom !== reallocateTo 
                      ? "bg-[#132a13] hover:bg-[#31572c] text-white" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {reallocateProgress ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Dispatching files...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Reallocate Cases
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* SLA violation warnings */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#4f772d]" /> SLA Breach & Backlog Warnings
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Geographic units violating the 7-day state-mandated scheme clearance timeline. Action required.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-red-50/50 border border-red-100 text-red-950 rounded-xl text-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="font-bold">District Panipat: Critical SLA Breach</p>
                  <p className="text-gray-500 font-semibold">Average cycle is 14.5 days. 340 pending cases backlog.</p>
                </div>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-black shrink-0">14.5 Days</span>
              </div>
              
              <div className="p-3 bg-amber-50/50 border border-amber-100 text-amber-950 rounded-xl text-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="font-bold">District Jhajjar: Pending Warning Threshold</p>
                  <p className="text-gray-500 font-semibold">Average cycle is 8.2 days. 210 pending cases backlog.</p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black shrink-0">8.2 Days</span>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 text-amber-950 rounded-xl text-xs flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="font-bold">District Rohtak: Impending Bottleneck</p>
                  <p className="text-gray-500 font-semibold">Average cycle is 6.5 days. 180 pending cases backlog.</p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black shrink-0">6.5 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLA table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-[#132a13] text-sm">District SLA Performance Scorecard</h3>
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 px-3 py-1.5 rounded-xl w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search districts..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full"
            />
          </div>
        </div>

        <GenericTable 
          columns={columns}
          data={filteredSlaData}
          itemsPerPage={5}
          showSearch={false}
          showSort={true}
          emptyMessage="No districts found."
        />
      </div>
    </div>
  );
}
