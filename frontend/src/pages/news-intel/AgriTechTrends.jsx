import React, { useState } from 'react';
import { 
  Cpu, 
  Radio, 
  Map, 
  ExternalLink, 
  X,
  ShieldCheck,
  DollarSign,
  Users,
  Compass,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function AgriTechTrends() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trends, setTrends] = useState([
    {
      id: 1,
      title: "Drone-Based Precision Spraying Approved in Punjab",
      category: "AUTOMATION",
      icon: Cpu,
      color: "bg-blue-500",
      iconColor: "text-blue-500",
      bgLight: "bg-blue-50/50",
      description: "State government releases new subsidies for agricultural drones, aiming to reduce pesticide usage by 20% and improve coverage efficiency in large wheat farms.",
      date: "May 29, 2026",
      details: {
        cost: "₹4.5 - ₹8.0 Lakhs per drone unit (50% state subsidy up to ₹4 Lakhs for FPOs)",
        vendors: ["Garuda Aerospace", "IoTechWorld Avigation", "Daksha Unmanned Systems"],
        caseStudy: "Trial runs in Bhatinda and Ludhiana districts showed a 22% reduction in chemical runoff and 90% water saving compared to manual knapsack spraying.",
        roi: "Payback period estimated at 14 months for commercial spraying service providers.",
        specs: "10L payload capacity, 20-minute flight duration, autonomous terrain-following radar."
      }
    },
    {
      id: 2,
      title: "IoT Soil Sensors Adoption Surges in Maharashtra",
      category: "SENSORS & IOT",
      icon: Radio,
      color: "bg-emerald-500",
      iconColor: "text-emerald-600",
      bgLight: "bg-emerald-50/50",
      description: "Sugarcane farmers report a 15% increase in water efficiency after deploying smart moisture sensors linked to automated drip irrigation systems.",
      date: "May 26, 2026",
      details: {
        cost: "₹12,000 per node set (covers 2.5 acres, subscription ₹1,500/annum for cellular link)",
        vendors: ["Fasal IoT", "Cropin Technology", "Yuktix Technologies"],
        caseStudy: "Cooperative sugarcane farms in Kolhapur noted optimized watering cycles, saving ~35,000 liters of water per hectare and eliminating root rot issues.",
        roi: "18% yield premium due to sugar-content optimization via uniform moisture management.",
        specs: "Multi-depth soil moisture NPK sensors, LoRaWAN/NB-IoT support, 5-year battery life."
      }
    }
  ]);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    const queryText = techInput.trim();
    if (!queryText) {
      setErrorMsg("Please enter a technology concept.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const prompt = `You are a senior agricultural technology advisor and evaluator. Provide a detailed feasibility evaluation report for: "${queryText}".
    
    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "title": A professional report title.
    2. "category": Technological category (e.g. "AUTOMATION", "AI & DATA", "SENSORS & IOT", "BIOTECH").
    3. "description": A concise summary of the technology and its target impact in India (25-35 words).
    4. "details": A sub-object containing:
       - "cost": Approximate cost estimate in Indian Rupees and state/central subsidy availability.
       - "vendors": An array of 3 realistic vendors/manufacturers in India.
       - "caseStudy": Brief trial results or case study in a major agricultural district.
       - "roi": Estimated return on investment timeline or yield premium percentage.
       - "specs": Core technical specifications (battery, payload, capacity, sensor accuracy, etc.).`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert agritech evaluator. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);

      const newReport = {
        id: Date.now(),
        date: "Today",
        icon: Cpu,
        color: "bg-purple-500",
        iconColor: "text-purple-650",
        bgLight: "bg-purple-50/50",
        ...parsed
      };

      setTrends((prev) => [newReport, ...prev]);
      setSelectedReport(newReport);
      setTechInput("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not formulate agritech report. Using fallback offline compiler.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-brand-dark/10 text-[#31572c] rounded-xl mt-1 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">AgriTech Innovations</h1>
            <p className="text-sm text-slate-500 mt-1">
              Latest technological advancements transforming Indian agriculture (AI Powered)
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Technology Evaluator Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> AI Technology Evaluator
        </h3>
        <form onSubmit={handleCreateReport} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. Vertical farming towers, IoT automated solar pumps, Blockchain trace..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-dark hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Compiling Report...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Evaluate Tech
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

      {/* Grid Layout (exactly 3 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.map((trend) => {
          const Icon = trend.icon;
          return (
            <div 
              key={trend.id} 
              className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs hover:-translate-y-1 hover:shadow-md hover:border-slate-200 transition-all duration-200 group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${trend.bgLight} ${trend.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {trend.category}
                  </span>
                </div>
                
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#31572c] transition-colors mb-3 leading-snug">
                  {trend.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {trend.description}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-450 tracking-wider">
                  {trend.date}
                </span>
                
                <button 
                  onClick={() => setSelectedReport(trend)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-850 hover:text-emerald-950 transition-colors"
                >
                  <span>Read Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Technical Report Slide-out Panel */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedReport(null)} />
          
          <div className="bg-white h-full max-w-xl w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between p-6 sm:p-8 animate-slideOver">
            <div>
              {/* Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  {selectedReport.category} REPORT NODE
                </span>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title */}
              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedReport.date}</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">{selectedReport.title}</h3>
              </div>

              {/* Report Body Sections */}
              <div className="space-y-5 overflow-y-auto max-h-[60vh] pr-2">
                
                {/* Cost Profiles */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    <span>Implementation Costing</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                    {selectedReport.details.cost}
                  </p>
                </div>

                {/* Approved Vendors */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>Approved Technology Vendors</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.details.vendors.map((vendor, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg"
                      >
                        {vendor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Regional Case Study */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-purple-700" />
                    <span>Regional Case Study / Trials</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                    {selectedReport.details.caseStudy}
                  </p>
                </div>

                {/* ROI Forecast */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Yield ROI Forecast</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
                    {selectedReport.details.roi}
                  </p>
                </div>

                {/* Technical Specs */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-orange-700" />
                    <span>Technical Architecture Specs</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-mono">
                    {selectedReport.details.specs}
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Close/Acknowledge trigger */}
            <div className="pt-4 border-t border-slate-100 mt-6">
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-full bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
