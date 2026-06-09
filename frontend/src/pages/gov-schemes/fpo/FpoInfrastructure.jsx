// src/pages/gov-schemes/fpo/FpoInfrastructure.jsx
import React, { useState } from "react";
import {
  Building2,
  Calculator,
  X,
  Sparkles,
  FileText
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { FpoUtilizationHeader } from "./FpoHelper";

const FpoInfrastructure = () => {
  const { infrastructure } = govtSchemeData.fpoOpportunityData;
  const [costSlider, setCostSlider] = useState(infrastructure.warehouse.cost);
  const [showDprModal, setShowDprModal] = useState(false);
  const [dprProgress, setDprProgress] = useState(false);
  const [dprStage, setDprStage] = useState(1);

  const calculatedSubsidy = costSlider * 0.35;
  const calculatedFarmer = costSlider - calculatedSubsidy;

  const handleGenerateDpr = (e) => {
    e.preventDefault();
    setDprProgress(true);
    setDprStage(1);
    
    // Simulate generation stages
    setTimeout(() => setDprStage(2), 700);
    setTimeout(() => setDprStage(3), 1400);
    
    setTimeout(() => {
      setDprProgress(false);
      setShowDprModal(false);
      alert("Detailed Project Report (DPR) compiled! Download link sent to registered FPO email.");
    }, 2100);
  };

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Infrastructure Planning" />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#4f772d]" />
          Infrastructure Support Planning
        </h1>
        <p className="text-xs text-gray-500 mt-1">Design post-harvest storage facilities, cold chain networks, and custom hiring hubs with central subsidies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gap Analysis */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm overflow-x-auto">
          <h3 className="font-bold text-[#132a13] text-sm mb-3">Capacity Gap Analysis</h3>
          <table className="w-full text-xs font-semibold text-left text-gray-600">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th className="py-2">Asset Type</th>
                <th className="py-2">Current Capacity</th>
                <th className="py-2">Target Required</th>
                <th className="py-2">Capacity Deficit</th>
                <th className="py-2">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(infrastructure).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50/40">
                  <td className="py-3 font-bold text-gray-800 uppercase text-[10px] tracking-wide">{key.replace("_", " ")}</td>
                  <td className="py-3 text-gray-700">{value.current}</td>
                  <td className="py-3 text-gray-700">{value.required}</td>
                  <td className="py-3 text-red-650 font-bold">{value.gap}</td>
                  <td className="py-3 text-emerald-700 font-bold">{value.utilization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ROI Calculator */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-1">
              <Calculator className="w-4 h-4 text-[#4f772d]" />
              Infrastructure ROI Calculator
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">Simulate capital investment requirements and expected payback under 35% subvention</p>
            
            <div className="space-y-4 pt-1">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                  Estimated Project Cost: ₹{costSlider.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={1000000}
                  max={10000000}
                  step={500000}
                  value={costSlider}
                  onChange={(e) => setCostSlider(Number(e.target.value))}
                  className="w-full accent-[#4f772d] mt-1"
                />
              </div>

              <div className="space-y-2 bg-[#f4f7f4]/45 border border-[#4f772d]/10 rounded-xl p-3.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">Government Share (35%):</span>
                  <span className="text-emerald-700 font-black">₹{calculatedSubsidy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">FPO Net Share:</span>
                  <span className="text-[#132a13] font-black">₹{calculatedFarmer.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 font-bold">
                  <span className="text-gray-600">Simulated Payback:</span>
                  <span className="text-gray-800 font-bold">3.2 Years</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setShowDprModal(true)}
            className="w-full mt-4 text-xs font-bold text-center py-2.5 bg-[#132a13] text-white rounded-xl hover:bg-[#31572c] transition"
          >
            Generate Detailed Business DPR
          </button>
        </div>
      </div>

      {/* DPR Generator Modal */}
      {showDprModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              type="button"
              onClick={() => setShowDprModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-[#4f772d]" />
              Generate Detailed Project Report (DPR)
            </h2>
            <p className="text-xs text-gray-500 mb-4">Create a compliance-ready DPR document for Bank Appraisal and AIF subvention applications.</p>

            {dprProgress ? (
              <div className="space-y-4 py-6 text-center">
                <div className="w-12 h-12 border-4 border-[#4f772d] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs font-bold text-[#132a13]">
                  {dprStage === 1 && "Fetching cooperative registration records..."}
                  {dprStage === 2 && "Calculating dynamic amortizations and cashflows..."}
                  {dprStage === 3 && "Finalizing signatures and generating PDF container..."}
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateDpr} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Asset Category</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none">
                      <option>Warehouse Infrastructure</option>
                      <option>Cold Storage Unit</option>
                      <option>Custom Hiring Center</option>
                      <option>Processing Facility</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Scale Capacity</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none">
                      <option>500 MT</option>
                      <option>1000 MT</option>
                      <option>1500 MT</option>
                      <option>2500 MT</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 bg-[#f4f7f4]/45 border border-[#4f772d]/10 rounded-xl p-3.5 text-xs text-gray-650 font-semibold">
                  <div className="flex justify-between">
                    <span>Project Cost:</span>
                    <span className="font-bold text-gray-800">₹{costSlider.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AIF Subsidy (35%):</span>
                    <span className="font-bold text-emerald-700">₹{calculatedSubsidy.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-1">
                    <span>Estimated Net Loan Required:</span>
                    <span className="font-bold text-[#132a13]">₹{(costSlider * 0.60).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDprModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#4f772d] hover:bg-[#31572c] text-white rounded-xl text-xs font-bold transition"
                  >
                    Compile DPR Draft
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

export default FpoInfrastructure;
