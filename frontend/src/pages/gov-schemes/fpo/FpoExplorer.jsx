// src/pages/gov-schemes/fpo/FpoExplorer.jsx
import React, { useState } from "react";
import {
  Compass,
  Search,
  ChevronRight,
  X,
  CheckCircle2,
  Sparkles,
  FileText
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { FpoUtilizationHeader } from "./FpoHelper";

const FpoExplorer = () => {
  const { explorer } = govtSchemeData.fpoOpportunityData;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [viewingDetail, setViewingDetail] = useState(null);
  
  // Interactive application modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyProgress, setApplyProgress] = useState(false);
  const [projectName, setProjectName] = useState("Sonipat Warehousing Project");
  const [projectBudget, setProjectBudget] = useState("₹1.50 Crore");

  const sectors = ["All", "Infrastructure", "Processing", "Credit", "Market Access", "Capacity Building"];

  const filtered = explorer.filter((opp) => {
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "All" || opp.type.toLowerCase().includes(selectedSector.toLowerCase()) || opp.name.toLowerCase().includes(selectedSector.toLowerCase());
    return matchesSearch && matchesSector;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplyProgress(true);
    setTimeout(() => {
      setApplyProgress(false);
      setShowApplyModal(false);
      setViewingDetail(null);
      alert(`Application Draft for "${projectName}" has been created in the active pipeline!`);
    }, 2000);
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      <FpoUtilizationHeader subtitle="FPO Opportunity Explorer" />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-medium" />
            Opportunity Explorer
          </h1>
          <p className="text-xs text-gray-500 mt-1">Discover, evaluate, and prioritize government schemes, capital subsidies, and cooperative assistance.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm space-y-3.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search opportunities by name, ministry, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-brand-medium"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition ${
                selectedSector === sec
                  ? "bg-brand-medium text-white border-brand-medium"
                  : "bg-[#f4f7f4] text-gray-600 border-gray-200/60 hover:bg-gray-150"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((opp) => (
          <div key={opp.id} className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 hover:shadow-md hover:border-brand-medium/25 transition duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[9px] font-bold bg-[#132a13]/10 text-[#132a13] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {opp.type}
                </span>
                <span className="text-xs font-black text-brand-medium">{opp.amount}</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#132a13] hover:text-brand-medium cursor-pointer" onClick={() => setViewingDetail(opp)}>
                  {opp.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{opp.department}</p>
              </div>
              <p className="text-xs text-gray-500 leading-normal line-clamp-2">{opp.description}</p>
              <div className="grid grid-cols-3 gap-2 border-y border-gray-100 py-2.5 text-[10px] font-semibold text-gray-500">
                <div>
                  <span className="block text-gray-400 text-[8px] uppercase font-bold">Match Score</span>
                  <span className="font-bold text-gray-800 text-xs">{opp.matchScore}%</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-[8px] uppercase font-bold">Approval Prob</span>
                  <span className="font-bold text-emerald-600 text-xs">{opp.probability}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-[8px] uppercase font-bold">Complexity</span>
                  <span className="font-bold text-gray-800 text-xs">{opp.complexity}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-red-650 font-bold">Deadline: {opp.deadline}</span>
              <button
                type="button"
                onClick={() => setViewingDetail(opp)}
                className="text-xs font-bold bg-[#132a13] text-white px-3 py-1.5 rounded-lg hover:bg-brand-dark transition flex items-center gap-1"
              >
                View Details
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Slide Drawer */}
      {viewingDetail && (
        <div className="fixed inset-0 z-40 flex justify-end animate-fadeIn">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setViewingDetail(null)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl p-6 border-l border-gray-100 overflow-y-auto flex flex-col justify-between animate-slideLeft z-10">
            <div>
              <button
                type="button"
                onClick={() => setViewingDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-extrabold bg-brand-medium/10 text-brand-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
                {viewingDetail.type}
              </span>
              <h2 className="text-lg font-black text-[#132a13] mt-3 leading-tight pr-8">{viewingDetail.name}</h2>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{viewingDetail.department}</p>
              
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-2.5 mt-4 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-405">Funding Amount:</span>
                  <span className="font-black text-[#132a13] text-sm">{viewingDetail.amount}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-405">Expected ROI:</span>
                  <span className="text-emerald-700 font-black">{viewingDetail.roi}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-405">Approval Timeline:</span>
                  <span className="text-gray-700">{viewingDetail.approvalTime}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-405">Strategic Impact:</span>
                  <span className="text-gray-700">{viewingDetail.impact}</span>
                </div>
              </div>

              <div className="space-y-3.5 mt-5">
                <div>
                  <h4 className="text-xs font-extrabold text-[#132a13] uppercase tracking-wider">Program Description</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1 font-medium">{viewingDetail.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-[#132a13] uppercase tracking-wider">Required Checklist</h4>
                  <div className="mt-2 space-y-1.5">
                    {viewingDetail.requiredDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-medium" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setViewingDetail(null)}
                className="flex-1 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Close Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setProjectName(`Sonipat FPO ${viewingDetail.name}`);
                  setProjectBudget(viewingDetail.amount);
                  setShowApplyModal(true);
                }}
                className="flex-1 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
              >
                Initiate Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Application Setup Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-brand-medium" />
              Initiate Subsidy Application
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Configure parameters to start drafting this capital grant application for cooperative members.
            </p>

            {applyProgress ? (
              <div className="py-8 text-center text-xs font-bold text-[#132a13] animate-pulse">
                Generating active application workspace in pipeline...
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Project Value</label>
                    <input
                      type="text"
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs font-semibold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Expected Term</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none">
                      <option>3 Years</option>
                      <option>5 Years</option>
                      <option>7 Years</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-[#f4f7f4] border border-brand-medium/10 rounded-xl space-y-1.5 text-xs text-gray-650 font-semibold">
                  <p className="font-bold text-[#132a13] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-medium" />
                    AI Eligibility Verification
                  </p>
                  <p>Cooperative meets **95% eligibility** criteria. Dynamic match rating is **96/100** based on active Sonipat land logs.</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
                  >
                    Initialize Draft
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

export default FpoExplorer;
