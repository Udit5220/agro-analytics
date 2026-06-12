// src/pages/gov-schemes/fpo/FpoSimulator.jsx
import React, { useState } from "react";
import {
  PlayCircle,
  Sparkles,
  X,
  CheckCircle2,
  FileText
} from "lucide-react";
import { FpoUtilizationHeader } from "./FpoHelper";

const FpoSimulator = () => {
  const [projectType, setProjectType] = useState("Warehouse");
  const [investment, setInvestment] = useState(4500000);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmProgress, setConfirmProgress] = useState(false);

  const subsidyRate = projectType === "Warehouse" ? 0.33 : projectType === "Cold Storage" ? 0.35 : 0.50;
  const subsidyAmount = investment * subsidyRate;
  const netFunding = investment - subsidyAmount;
  const simulatedRoi = projectType === "Warehouse" ? 18.2 : projectType === "Cold Storage" ? 22.5 : 26.4;
  const simulatedPayback = (netFunding / (investment * (simulatedRoi / 100))).toFixed(1);

  const handleConfirmLock = (e) => {
    e.preventDefault();
    setConfirmProgress(true);
    setTimeout(() => {
      setConfirmProgress(false);
      setShowConfirmModal(false);
      alert(`Strategic Plan for "${projectType}" has been locked and saved! Generating DPR guidelines...`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Strategic Opportunity Simulator" />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-brand-medium" />
          Strategic Opportunity Simulator
        </h1>
        <p className="text-xs text-gray-500 mt-1">Evaluate and compare post-harvest infrastructure projects side-by-side to optimize ROI and subsidy allocations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Configurator */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-[#132a13] text-sm mb-1">Scenario Builder</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {["Warehouse", "Cold Storage", "Solar Project"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setProjectType(type);
                  setInvestment(type === "Warehouse" ? 4500000 : type === "Cold Storage" ? 6500000 : 2500000);
                }}
                className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${
                  projectType === type
                    ? "border-brand-medium bg-brand-medium/5 text-brand-medium"
                    : "border-gray-250 hover:border-gray-300 text-gray-655"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">
              Project Scale Cost: ₹{investment.toLocaleString()}
            </label>
            <input
              type="range"
              min={1000000}
              max={10000000}
              step={500000}
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full accent-[#4f772d] mt-1"
            />
          </div>

          <div className="bg-[#f4f7f4]/45 border border-brand-medium/10 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase font-bold">Subsidy Rate</span>
              <span className="text-lg font-black text-[#132a13]">{subsidyRate * 100}%</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase font-bold">Government Share</span>
              <span className="text-lg font-black text-emerald-700">₹{(subsidyAmount/100000).toFixed(1)}L</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase font-bold">Estimated ROI</span>
              <span className="text-lg font-black text-brand-medium">{simulatedRoi}%</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase font-bold">Payback Period</span>
              <span className="text-lg font-black text-gray-800">{simulatedPayback} Years</span>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-brand-medium" />
              AI Recommendation
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">Optimal investment choice evaluated from current crop production logs</p>
            <div className="space-y-3.5 text-xs text-gray-655 font-semibold leading-relaxed">
              <p>Based on your **78% crop capacity deficit** in cold storage and high **Kharif output forecast**, we recommend prioritizing:</p>
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1 text-[#132a13]">
                <p className="font-bold text-xs">200 MT Multi-Chamber Cold Storage</p>
                <p className="text-[10px] text-emerald-800">Subsidy Allocation: **35% (NHB cold chain scheme)**</p>
                <p className="text-[10px] text-emerald-800">Calculated Payback: **4.2 Years** (Fastest amortization)</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-full mt-4 text-xs font-bold text-center py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition"
          >
            Lock Strategic Plan
          </button>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-brand-medium" />
              Confirm Strategic Investment
            </h2>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to lock this simulated project design as the active target plan?</p>

            {confirmProgress ? (
              <div className="py-8 text-center text-xs font-bold text-[#132a13] animate-pulse">
                Writing configuration parameters to storage vaults...
              </div>
            ) : (
              <form onSubmit={handleConfirmLock} className="space-y-4">
                <div className="space-y-2 bg-[#f4f7f4]/45 border border-brand-medium/10 rounded-xl p-3.5 text-xs text-gray-650 font-semibold">
                  <div className="flex justify-between">
                    <span>Project Type:</span>
                    <span className="font-bold text-[#132a13]">{projectType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Investment:</span>
                    <span className="font-bold text-[#132a13]">₹{investment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calculated Payback Rate:</span>
                    <span className="font-bold text-emerald-700">{simulatedPayback} Years</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
                  >
                    Confirm & Save Plan
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

export default FpoSimulator;
