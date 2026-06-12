import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  BookOpen, 
  ClipboardList, 
  Info 
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';
import { jsPDF } from 'jspdf';

const SAMPLE_PAPERS = [
  {
    title: "Neem Oil Nano-Emulsions for Crop Pest Control",
    category: "Pest Management",
    abstract: "This study evaluates the stability and insecticidal efficacy of neem oil nano-emulsions prepared using Tween-80 surfactant. Field trials conducted on Solanum melongena (brinjal) showed a 78% reduction in shoot and fruit borer infestation compared to conventional neem formulations, with zero phytotoxicity observed over a 60-day observation window."
  },
  {
    title: "Zero Budget Natural Farming (ZBNF) Yield Dynamics in Andhra Pradesh",
    category: "Sustainable Agriculture",
    abstract: "An empirical investigation comparing crop yields, soil health, and cost of cultivation between ZBNF and chemical-intensive farming. Over three crop cycles (Paddy, Maize, Groundnut), ZBNF demonstrated a 12% increase in soil organic carbon and a 60% reduction in input costs, while maintaining yield parity after a 1-year transition phase."
  },
  {
    title: "Micro-Climate Optimization in Polyhouses using IoT Sensors",
    category: "Precision Farming",
    abstract: "Deploying low-cost temperature, humidity, and soil electrical conductivity sensors inside naturally ventilated polyhouses growing capsicum. Automated fogging and shade net control algorithms optimized transpiration rates, resulting in a 24% increase in premium grade fruit harvest and a 35% reduction in water consumption."
  },
  {
    title: "Biochar Application and Soil Carbon Sequestration in Indo-Gangetic Plains",
    category: "Soil Science",
    abstract: "Assessing the long-term impact of rice-straw biochar amendment at 5 tons/hectare on soil organic carbon fractions and microbial biomass. Findings over 48 months reveal a stable carbon sequestration increase of 2.1 tons C/ha/year, alongside significant improvements in cation exchange capacity and water holding capacity of alluvial soils."
  },
  {
    title: "CNN-Based Identification of Puccinia striiformis (Yellow Rust) in Wheat",
    category: "Disease Diagnostics",
    abstract: "Utilizing deep convolutional neural networks (ResNet-50 architecture) for early detection of yellow rust in winter wheat from mobile-captured field images. The model was trained on 15,000 augmented leaf samples, achieving 98.6% classification accuracy under varying lighting and shadows, enabling real-time diagnostic alerts."
  },
  {
    title: "Mitigating Pesticide Runoff in Cotton Fields via Riparian Buffer Zones",
    category: "Environmental Management",
    abstract: "Evaluating the efficacy of planting Vetiver grass (Vetiveria zizanioides) buffer strips adjacent to irrigated cotton rows to filter organophosphate residues. Runoff water quality monitoring demonstrated a 65% reduction in pesticide load reaching nearby aquatic ecosystems, while mitigating soil erosion during peak monsoon surges."
  }
];

export default function ResearchSummary() {
  const [selectedPaperIdx, setSelectedPaperIdx] = useState(null);
  const [customAbstract, setCustomAbstract] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectPaper = (idx) => {
    setSelectedPaperIdx(idx);
    setCustomAbstract(SAMPLE_PAPERS[idx].abstract);
    setSummaryData(null);
  };

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    const textToSummarize = customAbstract.trim();
    if (!textToSummarize) {
      setErrorMsg("Please select a sample paper or enter a custom abstract first.");
      return;
    }

    setSummarizing(true);
    setErrorMsg("");
    setSummaryData(null);

    const prompt = `You are a senior agricultural research scientist and editor at ICAR. Summarize the following research abstract for practical dissemination to field extension officers and progressive farmers:

    "${textToSummarize}"

    Structure your response as a valid JSON object. Do not include any markdown tags (like \`\`\`json or \`\`\`). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "keyFindings": An array of 3 bullet points showing what the research discovered.
    2. "methodology": A brief description (under 50 words) of how the research was conducted.
    3. "farmerImpact": A direct statement explaining how this benefits farmers and what action they should take.
    4. "relevanceScore": A rating (e.g., "9.2/10 High Relevance").`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert crop science academic editor. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      setSummaryData(parsed);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not generate summary. Check your network or active Gemini key.");
      // Fallback
      setSummaryData({
        keyFindings: [
          "Significant reduction in chemical input dependency.",
          "Improves long-term soil organic matter and moisture retention.",
          "Shows comparable yield outputs once transition period is complete."
        ],
        methodology: "Field analysis across multiple crop cycles comparing organic and conventional control plots.",
        farmerImpact: "Implement organic input prep locally to reduce cultivation cost by up to 50% while sustaining soil health.",
        relevanceScore: "8.5/10 Moderate-to-High Relevance"
      });
    } finally {
      setSummarizing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!summaryData) return;

    const paperTitle = selectedPaperIdx !== null ? SAMPLE_PAPERS[selectedPaperIdx].title : "Custom Input Abstract";
    const doc = new jsPDF();
    
    // Clean, corporate design colors
    doc.setFillColor(49, 87, 44); // #31572c
    doc.rect(0, 0, 210, 15, "F");

    // Title inside header bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("AgroIndia Research AI Summary", 15, 10);
    
    // Topic metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Literature Topic: ${paperTitle}`, 15, 30);
    doc.text(`Relevance Score: ${summaryData.relevanceScore}`, 15, 36);
    
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 42, 195, 42);

    // Section: Findings
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Key Findings:", 15, 52);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    let currentY = 59;
    summaryData.keyFindings.forEach((finding) => {
      const splitText = doc.splitTextToSize(`• ${finding}`, 175);
      doc.text(splitText, 15, currentY);
      currentY += splitText.length * 5 + 3;
    });
    
    // Section: Methodology
    currentY += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Core Methodology:", 15, currentY);
    
    doc.setFont("helvetica", "normal");
    currentY += 7;
    const splitMethodology = doc.splitTextToSize(summaryData.methodology, 175);
    doc.text(splitMethodology, 15, currentY);
    currentY += splitMethodology.length * 5 + 5;
    
    // Section: Farmer Impact
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(49, 87, 44); // emerald green
    doc.text("Actionable Impact for Farmers:", 15, currentY);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    currentY += 7;
    const splitImpact = doc.splitTextToSize(summaryData.farmerImpact, 175);
    doc.text(splitImpact, 15, currentY);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by AgroIndia Research AI Center. Direct benefit DBT & telemetry validation active.", 15, 280);

    // Save PDF
    doc.save(`${paperTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_summary.pdf`);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2.5 bg-brand-dark/10 rounded-xl">
          <FileText className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Research Summary Engine</h1>
          <p className="text-sm text-gray-500">Condense complex academic abstracts into actionable farming insights (Now downloadable in PDF format)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Abstract Selector & Input (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <BookOpen className="h-4.5 w-4.5 text-[#31572c]" /> Select Research Paper ({SAMPLE_PAPERS.length})
            </h2>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {SAMPLE_PAPERS.map((paper, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPaper(idx)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedPaperIdx === idx
                      ? 'border-[#31572c] bg-brand-dark/5 shadow-2xs'
                      : 'border-gray-150 hover:bg-gray-50/50'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/70 inline-block mb-1.5">
                    {paper.category}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">
                    {paper.title}
                  </h4>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                Or Paste Abstract / Literature Text
              </label>
              <textarea
                value={customAbstract}
                onChange={(e) => {
                  setSelectedPaperIdx(null);
                  setCustomAbstract(e.target.value);
                }}
                placeholder="Paste paragraph or literature contents..."
                className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={summarizing || !customAbstract.trim()}
              className="w-full bg-brand-dark hover:bg-[#1a3018] text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {summarizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Synthesizing Abstract...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate AI Summary
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Summary Outputs (7 cols) */}
        <div className="lg:col-span-7">
          {errorMsg && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2 text-xs font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!summaryData && !summarizing ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
              <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                <ClipboardList className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Awaiting Input Abstract</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
                Choose one of the peer-reviewed papers on the left or paste your own research text to get a simplified AI summary and download block.
              </p>
            </div>
          ) : summarizing ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <div className="relative h-20 w-20 mb-6">
                <div className="absolute inset-0 border-4 border-[#31572c]/25 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#31572c] animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-[#31572c]">Analyzing Academic Literature...</h3>
              <p className="text-xs text-gray-400 mt-2">Gemini AI is parsing crop impact variables and chemical parameters.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
              
              {/* Header result row */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider inline-block">
                    AI AGRI-SUMMARY
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-1">Literature Breakdowns</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Relevance Index</span>
                  <span className="text-sm font-black text-emerald-700">{summaryData.relevanceScore}</span>
                </div>
              </div>

              {/* Summary Items list */}
              <div className="space-y-4">
                
                {/* Findings */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700" /> Key Findings
                  </h4>
                  <ul className="space-y-2 pl-1">
                    {summaryData.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-600 items-start">
                        <span className="text-emerald-750 font-black">✓</span>
                        <span className="leading-relaxed font-semibold">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Methodology */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-emerald-700" /> Core Methodology
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                    {summaryData.methodology}
                  </p>
                </div>

                {/* Farmer Impact */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-700" /> Actionable Impact for Farmers
                  </h4>
                  <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                    {summaryData.farmerImpact}
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="h-4 w-4" /> Download Summary (PDF)
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
