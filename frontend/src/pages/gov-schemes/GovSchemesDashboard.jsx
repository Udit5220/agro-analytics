import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  HelpCircle,
  X,
  ShieldCheck,
  Send,
  Loader2,
  FileCheck,
  HelpCircle as HelpIcon,
  Info
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function GovernmentSchemeCenter() {
  // Mocking the user context state (Suresh Kumar, Farmer from Haryana)
  const [userProfile, setUserProfile] = useState({
    name: "Suresh Kumar",
    role: "Farmer",
    state: "Haryana",
    district: "Faridabad",
    landArea: "5 Acres",
    primaryCrops: "Rice, Wheat"
  });

  const [selectedScheme, setSelectedScheme] = useState(null);
  
  // AI Advisor States
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);

  // Top metric highlights matching image_a5bbc3.jpg
  const metrics = [
    { label: "ACTIVE SCHEMES", value: "214", subtext: "NATIONALLY MATCHED", color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "ELIGIBLE SUBSIDIES", value: "8 Schemes", subtext: "HIGH MATCH SCORE", color: "text-amber-700", bg: "bg-amber-50" },
    { label: "PENDING CLAIMS", value: "2", subtext: "UNDER VERIFICATION", color: "text-blue-700", bg: "bg-blue-50" },
    { label: "TOTAL DISBURSED", value: "₹45,000", subtext: "PLATFORM VERIFIED", color: "text-stone-700", bg: "bg-stone-100" }
  ];

  // Primary Data Array for the Eligibility Matrix
  const [schemes, setSchemes] = useState([
    {
      id: "pm-kisan",
      name: "PM-KISAN Samman Nidhi",
      eligibility: "100% Eligible",
      benefit: "₹6,000 / year",
      status: "Active Disbursal",
      actionType: "badge-success",
      details: {
        authority: "Ministry of Agriculture & Farmers Welfare",
        description: "Central sector scheme providing income support of ₹6,000 per year in three equal installments directly to the bank accounts of all landholding farmers families.",
        requirements: ["Aadhaar Card (UIDAI Verified)", "Land Registry record (Khasra)", "Active Bank Account linked with Aadhaar"],
        timeline: "Disbursals occur in April-July, August-November, and December-March cycles."
      }
    },
    {
      id: "agri-machinery",
      name: "Agricultural Machinery Subsidies",
      eligibility: "95% Eligible",
      benefit: "50% Off Tractor/Seeder",
      status: "Apply Now",
      actionType: "button-primary",
      details: {
        authority: "Department of Agriculture, Govt. of Haryana",
        description: "Subsidy for purchasing modern agricultural machinery (laser levellers, rotavators, seeding machines) to promote mechanization and reduce manual labor costs.",
        requirements: ["Valid KCC (Kisan Credit Card)", "Panchayat Verification Form", "Vendor quotation invoice"],
        timeline: "Portal window closes August 31, 2026. Priority given to FPO clusters."
      }
    },
    {
      id: "pmfby",
      name: "PM Fasal Bima Yojana (PMFBY)",
      eligibility: "92% Eligible",
      benefit: "Crop Insurance Guard",
      status: "Active Cover",
      actionType: "badge-success",
      details: {
        authority: "Agricultural Insurance Company of India (AIC)",
        description: "Yield-based crop insurance scheme providing comprehensive financial coverage against natural catastrophes, pest infestations, and localized dry spells.",
        requirements: ["Land Sowing Certificate", "Bank Passbook photocopy", "Crop Insurance Premium receipt"],
        timeline: "Kharif registration window extended to June 15, 2026."
      }
    },
    {
      id: "pmksy",
      name: "Har Khet Ko Pani (PMKSY)",
      eligibility: "88% Eligible",
      benefit: "80% Tube-well Subsidy",
      status: "Verified",
      actionType: "badge-neutral",
      details: {
        authority: "Central Ground Water Board / State Water Resource Authority",
        description: "Subsidies targeting ground water micro-well creation, solar pump connections, and pressurized drip piping installations.",
        requirements: ["Ground Water feasibility certificate", "Land possession map", "Electricity connection registration or Kusum solar application ID"],
        timeline: "Ongoing budget allocations. Audits run quarterly."
      }
    }
  ]);

  // Consult Gemini AI for scheme recommendations
  const handleAIConsultation = async (e) => {
    e.preventDefault();
    if (!advisorInput.trim() || isConsulting) return;

    setIsConsulting(true);
    setAdvisorResponse(null);

    const promptText = `User is a farmer named ${userProfile.name} in ${userProfile.district}, ${userProfile.state} with ${userProfile.landArea} land growing ${userProfile.primaryCrops}.
    Question: "${advisorInput.trim()}"

    Recommend the most appropriate Indian Central/State agricultural schemes (e.g. PM-KISAN, KUSUM Solar Pump, PMFBY, Soil Health Card Schemes) matching this request. Format the answer with clear, structured bullet points containing:
    1. Scheme Name
    2. Estimated Benefit
    3. Action Plan / Next steps to apply.`;

    try {
      const response = await generateContent(promptText, {
        system_instruction: "You are an expert government welfare advisor specializing in Indian agricultural subsidies and Central/State schemes. Provide concise, direct, and structured recommendations.",
        temperature: 0.3
      });
      setAdvisorResponse(response);
    } catch (err) {
      console.error("Gemini Scheme Advisor failed:", err);
      setAdvisorResponse("Unable to fetch recommendations. Please ensure your Vite environment key is active.");
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 animate-fadeIn">
      
      {/* 1. Header Hero Banner */}
      <div className="mb-6 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-xs relative overflow-hidden">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mt-1">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Government Scheme Center</h1>
              <span className="text-emerald-800 font-bold font-hindi text-lg">सरकारी योजना केंद्र</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Match localized eligibility indices with active central and state agricultural welfare schemes.
            </p>
          </div>
        </div>
        
        {/* Subtle decorative vector matching the illustration tone */}
        <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none hidden lg:block">
          <div className="bg-emerald-800 w-48 h-full transform skew-x-12 translate-x-12" />
        </div>
      </div>

      {/* 2. Stat Grid Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 tracking-wider block mb-1 uppercase">{metric.label}</span>
              <span className="text-2xl font-extrabold text-slate-900 block">{metric.value}</span>
            </div>
            <div className={`mt-3 self-start text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-transparent ${metric.bg} ${metric.color}`}>
              {metric.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Dashboard Matrix Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Eligible Welfare & Subsidy Matrices Table (2/3 width) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900">Eligible Welfare & Subsidy Matrices</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <th className="pb-3 pl-1 font-semibold">Scheme Name</th>
                  <th className="pb-3 font-semibold">Eligibility Index</th>
                  <th className="pb-3 font-semibold">Benefits/Disbursal</th>
                  <th className="pb-3 font-semibold text-right pr-2">Action / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {schemes.map((scheme) => (
                  <tr 
                    key={scheme.id} 
                    onClick={() => setSelectedScheme(scheme)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 pl-1 font-bold text-slate-900 pr-2 group-hover:text-emerald-800 transition-colors">
                      {scheme.name}
                    </td>
                    <td className="py-4 text-emerald-600 font-extrabold">{scheme.eligibility}</td>
                    <td className="py-4 text-slate-500 font-semibold">{scheme.benefit}</td>
                    <td className="py-4 text-right pr-2">
                      {scheme.actionType === 'badge-success' && (
                        <span className="inline-block px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                          {scheme.status}
                        </span>
                      )}
                      {scheme.actionType === 'badge-neutral' && (
                        <span className="inline-block px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg">
                          {scheme.status}
                        </span>
                      )}
                      {scheme.actionType === 'button-primary' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheme(scheme);
                          }}
                          className="px-4 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-950 transition-colors shadow-2xs"
                        >
                          {scheme.status}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gemini AI Scheme Advisor widget */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-emerald-800" />
              <span>Gemini AI Scheme Advisor</span>
            </h3>
            
            <form onSubmit={handleAIConsultation} className="flex gap-2">
              <input
                type="text"
                value={advisorInput}
                onChange={(e) => setAdvisorInput(e.target.value)}
                placeholder="Ask AI: e.g., 'What subsidy can I get for a solar pump in Haryana?'"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-850"
              />
              <button
                type="submit"
                disabled={isConsulting || !advisorInput.trim()}
                className="bg-emerald-850 hover:bg-emerald-950 text-white font-bold p-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                {isConsulting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            {advisorResponse && (
              <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl animate-fadeIn space-y-2">
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider inline-block">
                  AI RECOMMENDATIONS
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {advisorResponse}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Reminders & Profile (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center space-x-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-5">
              <Clock className="w-4 h-4 text-[#31572c]" />
              <h2>Scheme Reminders</h2>
            </div>

            <div className="space-y-4">
              {/* Alert 1: e-KYC */}
              <div 
                onClick={() => alert("PM-KISAN dashboard details opened.")}
                className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start space-x-3 cursor-pointer hover:bg-orange-100/40 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-orange-850">e-KYC Mandatory Deadline</h3>
                  <p className="text-[11px] text-orange-800 mt-1 leading-relaxed font-semibold">
                    PM-KISAN online OTP-based KYC must be completed by Sunday to avoid installment delay.
                  </p>
                </div>
              </div>

              {/* Alert 2: Super-Seeder Subsidy */}
              <div 
                onClick={() => alert("Super-Seeder subsidy application portal opened.")}
                className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start space-x-3 cursor-pointer hover:bg-emerald-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-950">Super-Seeder Subsidy</h3>
                  <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed font-semibold">
                    {userProfile.state} Department of Agriculture opens online portal window. First-come first-served registry active.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help link footer matching the premium layout style */}
          <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need help claiming?</span>
            </span>
            <button 
              onClick={() => alert("Direct chat support connection initialized...")}
              className="text-emerald-800 hover:underline font-bold flex items-center gap-0.5"
            >
              View Guide <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

      {/* Scheme Detail Slide-over Drawer */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          {/* Overlay Click Close */}
          <div className="absolute inset-0" onClick={() => setSelectedScheme(null)} />
          
          <div className="bg-white h-full max-w-xl w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between p-6 sm:p-8 animate-slideOver">
            
            <div>
              {/* Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  SCHEME DETAILS
                </span>
                <button 
                  onClick={() => setSelectedScheme(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title & Authority */}
              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedScheme.details.authority}</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">{selectedScheme.name}</h3>
                <span className="text-emerald-600 font-extrabold text-xs block mt-1">{selectedScheme.eligibility} verified match</span>
              </div>

              {/* Drawer Content */}
              <div className="space-y-5 overflow-y-auto max-h-[60vh] pr-2">
                
                {/* Description */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <Info className="w-4 h-4 text-emerald-700" />
                    <span>Objective Description</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">
                    {selectedScheme.details.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-850 uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Welfare Benefit / Disbursal</span>
                  </div>
                  <p className="text-sm sm:text-base text-emerald-950 font-extrabold">
                    {selectedScheme.benefit}
                  </p>
                </div>

                {/* Requirements */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <FileCheck className="w-4 h-4 text-blue-700" />
                    <span>Required Verification Documents</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedScheme.details.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-600 items-start">
                        <span className="text-emerald-750 font-black">✓</span>
                        <span className="leading-relaxed font-semibold">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Registry & Calendar Timelines</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedScheme.details.timeline}
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Done trigger */}
            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedScheme(null)}
                className="w-full bg-[#31572c] hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}