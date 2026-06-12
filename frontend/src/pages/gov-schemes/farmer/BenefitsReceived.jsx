// src/pages/gov-schemes/farmer/BenefitsReceived.jsx
import React from "react";
import {
  Wallet,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Percent,
  CheckCircle,
  HelpCircle,
  TrendingUp
} from "lucide-react";

const DBT_PAYOUT_CYCLES = [
  {
    program: "PM-KISAN Samman Nidhi Payouts",
    cycleType: "Tri-annual (Three times a year)",
    standardSchedule: [
      { period: "Cycle 1 (Kharif Release)", months: "April to July", amount: "₹2,000" },
      { period: "Cycle 2 (Festive Release)", months: "August to November", amount: "₹2,000" },
      { period: "Cycle 3 (Winter Release)", months: "December to March", amount: "₹2,000" }
    ]
  },
  {
    program: "PMFBY Insurance Claim Settlements",
    cycleType: "Post-harvest season assessment",
    standardSchedule: [
      { period: "Kharif Claims Release", months: "December to January", amount: "Varies (by crop damage audit)" },
      { period: "Rabi Claims Release", months: "June to July", amount: "Varies (by crop damage audit)" }
    ]
  }
];

const SUBSIDY_RATE_SLABS = [
  {
    scheme: "PMFBY Crop Insurance Premiums",
    slabs: [
      { tier: "Kharif Crops (Rice, Cotton, Maize)", farmerPremium: "2.0% of Sum Insured", govtSubsidy: "Rest of premium subsidized (up to 95%)" },
      { tier: "Rabi Crops (Wheat, Mustard, Gram)", farmerPremium: "1.5% of Sum Insured", govtSubsidy: "Rest of premium subsidized (up to 97%)" },
      { tier: "Commercial/Horticultural (Sugarcane)", farmerPremium: "5.0% of Sum Insured", govtSubsidy: "Rest of premium subsidized" }
    ]
  },
  {
    scheme: "PM-KUSUM Solar Pump Capital Subsidy",
    slabs: [
      { tier: "Central Government Share", farmerPremium: "30% capital subsidy", govtSubsidy: "All Indian states eligibility" },
      { tier: "State Government Share", farmerPremium: "30% capital subsidy", govtSubsidy: "Additional state-specific outlays" },
      { tier: "Farmer Contribution", farmerPremium: "40% (remaining cost)", govtSubsidy: "Financing available via KCC loans" }
    ]
  },
  {
    scheme: "Kisan Credit Card (KCC) Interest Slabs",
    slabs: [
      { tier: "Standard Base Rate", farmerPremium: "9.0% annual interest", govtSubsidy: "Applicable up to limit of ₹3 Lakh" },
      { tier: "Central Subvention Rebate", farmerPremium: "7.0% effective interest", govtSubsidy: "2.0% subvention paid by government" },
      { tier: "Prompt Repayment Bonus", farmerPremium: "4.0% effective interest", govtSubsidy: "3.0% extra subvention if paid within 1 year" }
    ]
  }
];

export default function BenefitsReceived() {
  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f0]/40 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A3A2A] text-[#C5F547] rounded-xl">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F2E1F]">DBT Payout Cycles & Subsidy Rates</h1>
            <p className="text-xs text-[#2d5a3d] font-medium">
              Schedule timelines for direct bank cash releases and standard government subsidy slab breakdowns.
            </p>
          </div>
        </div>

        {/* Source citation */}
        <div className="bg-[#1A3A2A]/5 border border-[#2d5a3d]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-xs">
          <Info className="h-4.5 w-4.5 text-[#2d5a3d] shrink-0" />
          <span className="text-[10px] text-[#2d5a3d] font-semibold">
            Rates defined by Ministry of Agriculture, RBI interest circulars, and MNRE guidelines.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payout Cycles Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Calendar className="h-4.5 w-4.5 text-[#2d5a3d]" />
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Standard Payout release Cycles</h2>
            </div>

            <div className="space-y-6">
              {DBT_PAYOUT_CYCLES.map((cycle, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-bold text-gray-900 leading-snug">{cycle.program}</h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                      {cycle.cycleType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {cycle.standardSchedule.map((sched, idy) => (
                      <div key={idy} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col justify-between min-h-[90px]">
                        <div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{sched.period}</span>
                          <span className="text-[11px] font-bold text-[#0F2E1F] mt-1 block">{sched.months}</span>
                        </div>
                        <span className="text-xs font-black text-[#2d5a3d] mt-2 block border-t border-gray-100 pt-1.5">{sched.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slabs Grids */}
          {SUBSIDY_RATE_SLABS.map((slabObj, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <Percent className="h-4.5 w-4.5 text-[#2d5a3d]" />
                <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">{slabObj.scheme}</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="pb-2">Slab / Category Tier</th>
                      <th className="pb-2">Farmer Outlay Rate</th>
                      <th className="pb-2">Government Co-Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-650">
                    {slabObj.slabs.map((row, idy) => (
                      <tr key={idy}>
                        <td className="py-2.5 pr-2 font-bold text-gray-900">{row.tier}</td>
                        <td className="py-2.5 pr-2 text-brand-medium">{row.farmerPremium}</td>
                        <td className="py-2.5 text-gray-500 font-semibold">{row.govtSubsidy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Info - AePS and Bank Link validation */}
        <div className="space-y-6">
          <div className="bg-[#1A3A2A] text-white rounded-xl p-5 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-36 w-36 rounded-full bg-white/5 pointer-events-none"></div>
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#C5F547]" />
                <h3 className="text-xs font-extrabold text-[#C5F547] uppercase tracking-wider">
                  Understanding AePS & DBT
                </h3>
              </div>
              
              <p className="text-xs text-white/90 leading-relaxed font-semibold">
                Direct Benefit Transfer (DBT) funds are disbursed via the National Payments Corporation of India (NPCI) mapper database. 
              </p>
              
              <p className="text-[10.5px] text-white/80 leading-relaxed font-medium">
                Payments are automatically routed to the account which was **last seeded** with your Aadhaar card number. If you changed banks recently, verify that the NPCI map has synced correctly.
              </p>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
