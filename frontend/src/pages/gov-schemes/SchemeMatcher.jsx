import React, { useState } from 'react';
import { FileText, CheckCircle2, Search, ChevronRight, MapPin, Sprout, Building2, AlertCircle } from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function SchemeMatcher() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Form input states
  const [region, setRegion] = useState("Haryana");
  const [landHolding, setLandHolding] = useState(1.5);
  const [cropCategory, setCropCategory] = useState("Cereals & Grains (Wheat/Rice)");
  
  // Results states
  const [matches, setMatches] = useState([]);
  const [profileCategory, setProfileCategory] = useState("Small & Marginal Farmer");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setErrorMsg("");
    setShowResults(false);

    const prompt = `Evaluate agricultural scheme eligibility for a farmer in India:
    - State/Region: ${region}
    - Land Holding: ${landHolding} Hectares
    - Primary Crop: ${cropCategory}

    Identify the top 3-4 most relevant active Indian central or state schemes this farmer would qualify for.
    Return ONLY a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json or \`\`\`. Return only the raw JSON string.
    Each object in the array MUST have these exact keys:
    - "name": Name of the scheme (e.g., "PM-Kisan Samman Nidhi")
    - "match": Match percentage as string (e.g., "99% MATCH")
    - "benefit": The specific financial or material benefit (e.g., "₹6,000 per year")
    - "description": Contextual explanation based on their land size (${landHolding} ha) and crop (${cropCategory}) in ${region}.
    - "action": Application action button text (e.g., "Apply via E-Mitra", "Calculate Premium", "Start Application")
    - "color": One of "emerald", "blue", "amber", or "stone" depending on scheme type.

    Determine the classification of farmer based on land holding (e.g. Marginal < 1 ha, Small 1-2 ha, Semi-medium 2-4 ha, Medium 4-10 ha, Large > 10 ha) and include it in your classification.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert welfare advisor database matching agricultural profiles to Indian government schemes. Return ONLY JSON.",
        temperature: 0.2
      });

      // Parse JSON from response
      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      
      const parsedMatches = JSON.parse(cleanJson);
      setMatches(parsedMatches);

      // Determine profile category label
      let category = "Marginal Farmer";
      if (landHolding > 10) category = "Large Farmer";
      else if (landHolding > 4) category = "Medium Farmer";
      else if (landHolding > 2) category = "Semi-Medium Farmer";
      else if (landHolding >= 1) category = "Small Farmer";
      setProfileCategory(`${category} (${region})`);

      setShowResults(true);
    } catch (err) {
      console.error("Failed to fetch matching schemes:", err);
      setErrorMsg("Failed to run AI Matcher. Please check your network connection or API configuration.");
      // Fallback data in case of error
      setMatches([
        {
          name: "PM-Kisan Samman Nidhi",
          match: "99% MATCH",
          benefit: "₹6,000 / year",
          description: `Income support of ₹6,000 per year in three equal installments. Based on your land record (${landHolding} hectares), you are fully eligible as a small farmer.`,
          action: "Apply via E-Mitra",
          color: "emerald"
        },
        {
          name: `${region} Micro-Irrigation Subsidy`,
          match: "85% MATCH",
          benefit: "85% Off Setup",
          description: `Available for your selected region (${region}). Up to 85% subsidy on drip and sprinkler irrigation setups to promote water conservation.`,
          action: "Start Application",
          color: "blue"
        }
      ]);
      setProfileCategory("Marginal & Small Farmer");
      setShowResults(true);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="p-2 bg-brand-dark/10 rounded-lg">
          <FileText className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">AI Eligibility Engine</h1>
          <p className="text-sm text-gray-500">Find central and state schemes tailored to your farm profile</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Farm Profile Form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Your Farm Profile</h2>
          
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">State / Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none appearance-none cursor-pointer"
                >
                  <option>Haryana</option>
                  <option>Madhya Pradesh</option>
                  <option>Punjab</option>
                  <option>Maharashtra</option>
                  <option>Rajasthan</option>
                  <option>Uttar Pradesh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Land Holding (Hectares)</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="number" 
                  value={landHolding} 
                  onChange={(e) => setLandHolding(parseFloat(e.target.value) || 0)}
                  step="0.1" 
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Primary Crop Category</label>
              <div className="relative">
                <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select 
                  value={cropCategory}
                  onChange={(e) => setCropCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none appearance-none cursor-pointer"
                >
                  <option>Cereals & Grains (Wheat/Rice)</option>
                  <option>Oilseeds (Soybean/Mustard)</option>
                  <option>Horticulture (Fruits/Veg)</option>
                  <option>Cash Crops (Cotton/Sugarcane)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={analyzing}
              className="w-full mt-6 bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-[#1a3018] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4" /> Run AI Matcher
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2">
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!showResults && !analyzing ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
              <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Awaiting Profile Data</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-2">Enter your farm details on the left and run the AI Matcher to find subsidies you're eligible for.</p>
            </div>
          ) : analyzing ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <div className="relative h-20 w-20 mb-6">
                <div className="absolute inset-0 border-4 border-[#31572c]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#31572c] animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#31572c]">Scanning 200+ Schemes...</h3>
              <p className="text-sm text-gray-500 mt-2">Cross-referencing state policies and land records using Gemini AI.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Top Matches ({matches.length})</h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Profile: {profileCategory}</span>
              </div>
              
              {matches.map((match, idx) => {
                const colorTheme = 
                  match.color === 'blue' 
                    ? { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-900', badge: 'bg-blue-500 text-white', iconColor: 'text-blue-600', iconBg: 'bg-blue-50' }
                    : match.color === 'amber'
                    ? { bg: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-900', badge: 'bg-amber-500 text-white', iconColor: 'text-amber-600', iconBg: 'bg-amber-50' }
                    : match.color === 'stone'
                    ? { bg: 'bg-stone-50/50', border: 'border-stone-200', text: 'text-stone-900', badge: 'bg-stone-500 text-white', iconColor: 'text-stone-600', iconBg: 'bg-stone-100' }
                    : { bg: 'bg-gradient-to-r from-emerald-50 to-white', border: 'border-emerald-100', text: 'text-emerald-950', badge: 'bg-emerald-500 text-white', iconColor: 'text-emerald-600', iconBg: 'bg-white' };

                return (
                  <div key={idx} className={`p-5 border ${colorTheme.border} ${colorTheme.bg} rounded-2xl hover:shadow-md transition-shadow group relative overflow-hidden`}>
                    {match.color === 'emerald' && <div className="absolute right-0 top-0 bottom-0 w-2 bg-emerald-500"></div>}
                    <div className="flex items-start gap-4">
                      <div className={`${colorTheme.iconBg} p-3 rounded-full shadow-sm`}>
                        <CheckCircle2 className={`h-6 w-6 ${colorTheme.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-base sm:text-lg font-black ${colorTheme.text}`}>{match.name}</h3>
                          <span className={`${colorTheme.badge} text-xs font-black px-2 py-1 rounded shadow-sm shrink-0`}>{match.match}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 mt-2 font-medium">
                          <strong className="block text-slate-900 mb-0.5">Benefit: {match.benefit}</strong>
                          {match.description}
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          <button className="px-4 py-1.5 bg-brand-dark hover:bg-[#1a3018] text-white text-xs font-bold rounded-lg shadow-sm transition">
                            {match.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

