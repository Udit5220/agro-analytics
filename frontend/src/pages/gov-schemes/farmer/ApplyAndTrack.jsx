// src/pages/gov-schemes/farmer/ApplyAndTrack.jsx
import React from "react";
import {
  FileText,
  ExternalLink,
  Info,
  CheckCircle,
  HelpCircle,
  Building,
  Key,
  ShieldCheck,
  Calendar,
  Layers,
  Search
} from "lucide-react";

const PORTALS_DIRECTORY = [
  {
    name: "PM-KISAN Samman Nidhi Portal",
    url: "https://pmkisan.gov.in/",
    description: "Official portal for fresh farmer registration, checking Aadhaar seeding status, and updating bank accounts.",
    authority: "Ministry of Agriculture & Farmers Welfare",
    checklist: ["Aadhaar Card copy", "Land records (Khatauni)", "Bank passbook linked with Aadhaar"]
  },
  {
    name: "PMFBY Crop Insurance Portal",
    url: "https://pmfby.gov.in/",
    description: "Submit crop sowing certificates, pay subsidized premiums, and calculate crop cover eligibility.",
    authority: "Ministry of Agriculture & Farmers Welfare",
    checklist: ["Land Jamabandi certificate", "Sowing Certificate from Patwari", "Active KCC / Bank details"]
  },
  {
    name: "PM-KUSUM Solar Subsidy Portal",
    url: "https://pmkusum.mnre.gov.in/",
    description: "Apply for up to 60% capital subsidies for solar-powered water irrigation pumps up to 7.5 HP.",
    authority: "Ministry of New & Renewable Energy",
    checklist: ["Land title certificate", "Irrigation layout report", "Caste Certificate (for SC/ST subsidy)"]
  },
  {
    name: "National Agriculture Market (e-NAM)",
    url: "https://enam.gov.in/",
    description: "Register to list your crop harvests directly for trade, view MSP floor prices, and trade with national buyers.",
    authority: "SFAC / Ministry of Agriculture",
    checklist: ["Farming license or Aadhaar", "Bank Account check copy", "Mobile number linked to Aadhaar"]
  }
];

const GENERAL_GUIDELINE_STEPS = [
  {
    title: "1. Profile Authentication (UIDAI)",
    description: "Ensure your mobile number is updated in your Aadhaar card. Almost all government portals verify your credentials via a single-use OTP (One Time Password) sent by UIDAI."
  },
  {
    title: "2. Get Certified State Land Records (Jamabandi)",
    description: "Do not upload raw sketches. Download a digitally signed copy of your Jamabandi/Khatauni land records from your state land records portal (e.g. jamabandi.nic.in for Haryana)."
  },
  {
    title: "3. Complete Bank DBT NPCI Seeding",
    description: "Your bank account must be actively seeded on the NPCI mapper. Payouts are made via Aadhaar-enabled Payment Systems (AePS). Visit your local bank manager to submit the seeding consent form."
  },
  {
    title: "4. Register on myScheme Portal",
    description: "Use the centralized government portal to automatically cross-verify details and receive application reference IDs."
  }
];

export default function ApplyAndTrack() {
  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f0]/40 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A3A2A] text-[#C5F547] rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F2E1F]">Government Portal Application Guide</h1>
            <p className="text-xs text-[#2d5a3d] font-medium">
              Readiness checklists, citizen manuals, and official direct registration links for active central and state schemes.
            </p>
          </div>
        </div>

        {/* Source citation */}
        <div className="bg-[#1A3A2A]/5 border border-[#2d5a3d]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-xs">
          <Info className="h-4.5 w-4.5 text-[#2d5a3d] shrink-0" />
          <span className="text-[10px] text-[#2d5a3d] font-semibold">
            Sources: myScheme.gov.in & National e-Governance Division (NeGD)
          </span>
        </div>
      </div>

      {/* Privacy disclaimer */}
      <div className="mb-6 bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex gap-3.5 items-start">
        <ShieldCheck className="h-5 w-5 text-[#2d5a3d] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0F2E1F] leading-relaxed font-semibold">
          <p className="font-bold uppercase tracking-wider text-[#2d5a3d] mb-0.5">Privacy First Platform Architecture</p>
          <p>
            To protect your personal data, this analytics platform does not collect, host, or submit your private files (like Aadhaar, bank records, or land deeds). All registrations must be completed securely on the official government portals listed below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portals Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Building className="h-4.5 w-4.5 text-[#2d5a3d]" />
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Official Registration Portals</h2>
            </div>

            <div className="space-y-4">
              {PORTALS_DIRECTORY.map((portal, idx) => (
                <div
                  key={idx}
                  className="border border-gray-150 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-snug">{portal.name}</h3>
                      <span className="text-[9px] text-[#2d5a3d] font-bold block uppercase tracking-wider mt-0.5">{portal.authority}</span>
                    </div>
                    
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-white bg-[#1A3A2A] hover:bg-[#0F2E1F] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <p className="text-[11px] text-gray-550 font-semibold mb-3 leading-relaxed">
                    {portal.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Required Documents Check:</span>
                    <div className="flex flex-wrap gap-2">
                      {portal.checklist.map((item, idy) => (
                        <span
                          key={idy}
                          className="bg-gray-100 text-gray-650 text-[10px] px-2 py-0.5 rounded font-semibold border border-gray-200"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step-by-Step Citizen Guidelines */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <Key className="h-4.5 w-4.5 text-[#2d5a3d]" />
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">How to Apply Online</h2>
            </div>

            <div className="space-y-4">
              {GENERAL_GUIDELINE_STEPS.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-900">{step.title}</h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-semibold bg-gray-50/50 p-2.5 rounded border border-gray-100">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Grievance PGPortal Guide */}
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <HelpCircle className="h-4.5 w-4.5 text-amber-550" />
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Official Status Check</h2>
            </div>
            
            <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
              To verify if your payment transactions or documents have been officially updated, you can search public registries securely using the Central DBT public link:
            </p>
            
            <a
              href="https://pfms.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 border border-brand-medium/30 text-[#2d5a3d] hover:bg-[#2d5a3d]/5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>Check Payment Status on PFMS ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
