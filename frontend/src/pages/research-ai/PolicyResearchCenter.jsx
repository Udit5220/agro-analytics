import React, { useState } from 'react';
import { 
  Landmark, Search, Loader2, AlertCircle, FileText, 
  CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function PolicyResearchCenter() {
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [policyData, setPolicyData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setAnalyzing(true);
    setErrorMsg("");
    setPolicyData(null);

    const prompt = `Analyze the following government scheme, agricultural policy, or query: "${query}".
    Structure your response as a valid JSON object with the following keys:
    1. "policyName": Name of the scheme/policy.
    2. "summary": A brief, farmer-friendly explanation of what the policy is.
    3. "eligibility": An array of 3 bullet points outlining who is eligible.
    4. "benefits": An array of 3 bullet points outlining financial or operational benefits.
    5. "impact": A short paragraph on the macro-economic impact of this policy.
    Return raw JSON only, no markdown tags.`;

    try {
      const response = await generateContent(prompt, { temperature: 0.2 });
      let cleanJson = response.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      setPolicyData(JSON.parse(cleanJson));
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze policy. Please check your network or try another query.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
          <Landmark className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Policy & Government Research Center</h1>
          <p className="text-sm text-gray-500">Analyze schemes, subsidies, and agricultural policies with farmer-friendly explanations.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-3 shadow-sm">
        <form onSubmit={handleAnalyze} className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies (e.g. PM-Kisan Samman Nidhi, Crop Insurance subsidies)..."
            className="w-full pr-36 py-3 bg-transparent text-sm font-medium outline-none text-gray-900 placeholder-gray-400"
            style={{ paddingLeft: "3.5rem" }}
          />
          <button 
            type="submit" 
            disabled={analyzing || !query.trim()}
            className="absolute right-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Analyze Policy
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 bg-teal-50 text-teal-700 rounded-2xl flex gap-2 text-sm font-bold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {analyzing && (
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <Landmark className="h-12 w-12 text-emerald-600 animate-bounce mb-4" />
          <h3 className="text-base font-bold text-emerald-600">Analyzing Government Data...</h3>
          <p className="text-sm text-gray-400 mt-2">Correlating scheme details and eligibility criteria.</p>
        </div>
      )}

      {!analyzing && policyData && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm h-full">
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-4">{policyData.policyName}</h2>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Farmer-Friendly Summary
                </h3>
                <p className="text-sm text-emerald-950 font-medium leading-relaxed">{policyData.summary}</p>
              </div>

              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Key Benefits & Subsidies
              </h3>
              <ul className="space-y-3 mb-6">
                {policyData.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-emerald-600" /> Macro Economic Impact
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {policyData.impact}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 border border-emerald-800 rounded-3xl p-8 shadow-md h-full text-white">
              <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Eligibility Checklist
              </h3>
              <ul className="space-y-4">
                {policyData.eligibility?.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-emerald-100 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-emerald-800/50">
                <p className="text-xs text-emerald-300/70 text-center">
                  Eligibility criteria generated by AI analysis. Farmers should verify with local authorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!analyzing && !policyData && (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 text-center opacity-60">
          <Landmark className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-400">Policy Center Standby</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">Search for any state or central government scheme to get a simplified breakdown.</p>
        </div>
      )}
    </div>
  );
}
