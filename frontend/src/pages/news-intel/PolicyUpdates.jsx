import React, { useState } from 'react';
import { 
  Scale, 
  ExternalLink, 
  Globe, 
  Building, 
  TrendingUp, 
  AlertTriangle,
  BookOpen, 
  X,
  Download,
  Printer,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function PolicyUpdates() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyInput, setPolicyInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [policies, setPolicies] = useState([
    {
      id: 1,
      date: "May 28, 2026",
      tag: "CENTRAL SCHEME",
      title: "Fertilizer Subsidy Re-allocation for Kharif Season",
      description: "The Union Cabinet has approved a revised nutrient-based subsidy (NBS) rate for Phosphatic and Potassic (P&K) fertilizers for the upcoming Kharif season, ensuring no price hike for farmers.",
      impact: "HIGH IMPACT",
      icon: Scale,
      iconColor: "text-emerald-700 bg-emerald-50 border-emerald-100",
      dotColor: "bg-emerald-500",
      gazetteMeta: {
        ministry: "Ministry of Chemicals and Fertilizers",
        department: "Department of Fertilizers",
        refNo: "F.No. 12012/3/2026-Ferts",
        signedBy: "Shri Rajesh Kumar, Joint Secretary",
        details: [
          { label: "Revised NBS Nitrogen (N) Rate", value: "₹22.50 per Kg" },
          { label: "Revised NBS Phosphate (P) Rate", value: "₹28.40 per Kg" },
          { label: "Revised NBS Potash (K) Rate", value: "₹18.60 per Kg" },
          { label: "Kharif Allocation Increment", value: "₹24,475 Crores Total Outlay" }
        ],
        background: "To insulate farmers from rise in international prices of fertilizers and raw materials. Subsidies will be directly routed to fertilizer manufacturing companies based on point-of-sale (PoS) machine transactions.",
        directives: [
          "No retail price revision permitted by manufacturers without prior departmental authorization.",
          "Buffer stocking nodes must report real-time supply chain inventory every 24 hours.",
          "State Agriculture Departments to monitor and penalize hoarding operations."
        ]
      }
    },
    {
      id: 2,
      date: "May 25, 2026",
      tag: "STATE LEVEL: MP",
      title: "Mukhya Mantri Bhavantar Bhugtan Yojana Revived",
      description: "Madhya Pradesh government reintroduces the price deficit financing scheme specifically for garlic and onion to protect farmers from distress sales.",
      impact: "MEDIUM IMPACT",
      icon: Building,
      iconColor: "text-blue-700 bg-blue-50 border-blue-100",
      dotColor: "bg-blue-500",
      gazetteMeta: {
        ministry: "Department of Agriculture & Farmer Welfare",
        department: "Government of Madhya Pradesh",
        refNo: "MP-BBY/2026/O-G-821",
        signedBy: "Smt. Anuradha Sen, Principal Secretary",
        details: [
          { label: "Target Commodities", value: "Garlic, Onion (Rabi Harvest)" },
          { label: "Registration Window", value: "June 1 - June 20, 2026" },
          { label: "Verification Node", value: "e-Uparjan Portal Validation" },
          { label: "Deficit Payment Mode", value: "Direct Benefit Transfer (DBT) to Bank Account" }
        ],
        background: "Following supply-chain gluts, the wholesale mandi rates dropped below production costs. This scheme compensates farmers directly for the difference between the government-declared modal price and the actual sale price.",
        directives: [
          "Farmers must upload valid Mandi Sale Receipts showing official auction dates.",
          "Maximum capping per hectare calculated on verified crop classification indexes.",
          "Payment processing completes within 14 working days of database registration."
        ]
      }
    }
  ]);

  const handleAnalyzePolicy = async (e) => {
    e.preventDefault();
    const queryText = policyInput.trim();
    if (!queryText) {
      setErrorMsg("Please enter a policy query or agricultural regulation.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg("");

    const prompt = `You are a legal and economic policy analyst at the Department of Agriculture, Government of India. Analyze the following agricultural policy or regulation: "${queryText}".
    Generate a complete, structured policy update corresponding to this query.

    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "title": A realistic, professional notification headline.
    2. "description": A concise summary (30-45 words) explaining the policy shift.
    3. "tag": Policy scope tag (e.g. "CENTRAL SCHEME", "STATE POLICY: PB", "QUALITY STANDARDS").
    4. "impact": Impact level (e.g. "HIGH IMPACT", "COMPLIANCE REQUIRED", "MARKET MOVING").
    5. "gazetteMeta": A sub-object containing:
       - "ministry": Name of the Ministry (e.g., "Ministry of Agriculture and Farmers Welfare").
       - "department": Specific Department name.
       - "refNo": Standard reference number (e.g., "G.S.R. 294(E)").
       - "signedBy": Name and title of the signing authority.
       - "details": An array of exactly 4 objects containing {"label": "...", "value": "..."} key-value metrics.
       - "background": A paragraph (50-70 words) explaining the preamble and context of this policy.
       - "directives": An array of exactly 3 specific, numbered directives.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert in Indian agricultural legislation and gazette publication templates. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      
      const newPolicy = {
        id: Date.now(),
        date: "Today",
        icon: Scale,
        dotColor: "bg-emerald-500",
        ...parsed
      };

      setPolicies((prev) => [newPolicy, ...prev]);
      setSelectedPolicy(newPolicy);
      setPolicyInput("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not analyze policy. Check your connection or key configuration.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-brand-dark/10 text-[#31572c] rounded-xl mt-1 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Policy & Regulation Updates</h1>
            <p className="text-sm text-slate-500 mt-1">
              Timeline of state and central agricultural governance (Now with AI Gazette Analytics)
            </p>
          </div>
        </div>
      </div>

      {/* AI Policy Impact Analyzer Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> AI Policy Analyst & Gazette Compiler
        </h3>
        <form onSubmit={handleAnalyzePolicy} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={policyInput}
            onChange={(e) => setPolicyInput(e.target.value)}
            placeholder="e.g. Haryana Drone spray policy, Onion export tariffs, PM-KISAN installment..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
            required
          />
          <button
            type="submit"
            disabled={analyzing}
            className="bg-brand-dark hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Policy...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Analyze Impact
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Main Single Column Card Container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Vertical Timeline Pipeline */}
        <div className="relative pl-4 sm:pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
          {policies.map((policy) => {
            return (
              <div key={policy.id} className="relative mb-12 last:mb-0 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[19px] sm:-left-[23px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white ${policy.dotColor || 'bg-emerald-500'} shadow-sm z-10 transition-transform group-hover:scale-110`} />

                <div className="ml-6 sm:ml-8">
                  {/* Date & Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="text-xs font-extrabold text-[#31572c] tracking-tight">{policy.date}</span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    
                    <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase border border-slate-200">
                      {policy.tag}
                    </span>
                    
                    <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 uppercase border border-amber-100">
                      {policy.impact}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors mb-2">
                    {policy.title}
                  </h3>

                  {/* Body Text */}
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 max-w-3xl">
                    {policy.description}
                  </p>

                  {/* Action Link Trigger */}
                  <button 
                    onClick={() => setSelectedPolicy(policy)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-850 hover:text-emerald-950 transition-colors"
                  >
                    <span>View Official Gazette</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gazette Bulletin Summary Drawer */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedPolicy(null)} />
          
          <div className="bg-white h-full max-w-2xl w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between animate-slideOver">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Official Gazette Bureau
                </span>
              </div>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Content Box */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/50">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden font-sans">
                {/* Government Watermark */}
                <div className="text-center pb-6 border-b border-double border-slate-300">
                  <div className="text-[10px] tracking-widest font-black uppercase text-slate-400 mb-1">
                    THE GAZETTE OF INDIA / भारत का राजपत्र
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    EXTRAORDINARY / असाधारण
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">
                    PUBLISHED BY AUTHORITY / प्राधिकार से प्रकाशित
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase">
                      {selectedPolicy.gazetteMeta.ministry}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedPolicy.gazetteMeta.department}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Ref No: {selectedPolicy.gazetteMeta.refNo}
                    </div>
                  </div>

                  <div className="h-px bg-slate-200 my-4" />

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase block">
                      Subject Notification
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {selectedPolicy.title}
                    </h3>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 my-4">
                    {selectedPolicy.gazetteMeta.details.map((detail, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">
                          {detail.label}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Background Info */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
                      1. PREAMBLE & STATEMENT OF OBJECTIVES
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedPolicy.gazetteMeta.background}
                    </p>
                  </div>

                  {/* Directives / Mandates */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">
                      2. LEGISLATIVE DIRECTIVES & MANDATES
                    </span>
                    <ul className="space-y-2">
                      {selectedPolicy.gazetteMeta.directives.map((directive, index) => (
                        <li key={index} className="flex gap-2 text-xs text-slate-600 items-start font-semibold">
                          <span className="font-bold text-emerald-800 shrink-0 mt-0.5">{index + 1}.</span>
                          <span className="leading-relaxed">{directive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sign off */}
                  <div className="pt-8 text-right space-y-1">
                    <p className="text-xs font-extrabold text-slate-800">
                      By Order of the President,
                    </p>
                    <p className="text-xs font-bold text-slate-900 italic">
                      {selectedPolicy.gazetteMeta.signedBy}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      Authenticated Electronic Record
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions bar */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert('Simulating PDF Download...')}
                  className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-2xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-xs"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
