import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Loader2, 
  AlertCircle, 
  FileText, 
  Layers, 
  Globe, 
  FileSignature, 
  Bookmark, 
  Sprout, 
  Compass
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';
import { jsPDF } from 'jspdf';

const PRESETS = [
  {
    topic: "Comparing Bio-stimulants for Root Development",
    crop: "Wheat",
    treatment: "Biological Control",
    region: "Indo-Gangetic Plains"
  },
  {
    topic: "Drip Irrigation Optimization with Hydrogels under Water Stress",
    crop: "Cotton",
    treatment: "Precision Irrigation",
    region: "Deccan Plateau Semi-Arid Zone"
  },
  {
    topic: "Arbuscular Mycorrhizal Fungi (AMF) Inoculation in Saline Soil",
    crop: "Paddy",
    treatment: "Soil Remediation",
    region: "Coastal Sundarbans"
  }
];

export default function ResearchDrafting() {
  const [topic, setTopic] = useState("");
  const [crop, setCrop] = useState("");
  const [treatment, setTreatment] = useState("Biological Control");
  const [region, setRegion] = useState("");
  
  const [drafting, setDrafting] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectPreset = (preset) => {
    setTopic(preset.topic);
    setCrop(preset.crop);
    setTreatment(preset.treatment);
    setRegion(preset.region);
    setProposalData(null);
    setErrorMsg("");
  };

  const handleGenerateProposal = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !crop.trim() || !region.trim()) {
      setErrorMsg("Please fill in all inputs or select a quick preset.");
      return;
    }

    setDrafting(true);
    setErrorMsg("");
    setProposalData(null);

    const prompt = `You are a senior agricultural research scientist and director at ICAR. Draft a comprehensive research proposal based on the following parameters:
    - Research Topic: "${topic.trim()}"
    - Target Crop: "${crop.trim()}"
    - Treatment Category: "${treatment}"
    - Target Region: "${region.trim()}"

    Structure your response as a valid JSON object. Do not include any markdown tags (like \`\`\`json or \`\`\`). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "title": A professional, academic title for the research proposal.
    2. "introduction": An introduction and background (around 100-150 words).
    3. "hypothesis": Hypothesis and objectives (around 80-120 words).
    4. "methodology": Detailed field design and experimental methodology (around 120-180 words).
    5. "outcomes": Expected agronomic outcomes and impacts (around 80-120 words).`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert academic research administrator in agriculture. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      setProposalData(parsed);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not generate proposal draft. Check your network or active Gemini key.");
      // Fallback
      setProposalData({
        title: `Efficacy of ${treatment} Treatments on ${crop} in the ${region} region`,
        introduction: `This research proposal focuses on investigating the agronomic effects of ${treatment} on ${crop} within the unique agro-climatic conditions of ${region}. High intensive agriculture has created a pressing need to explore sustainable and efficient methodologies that preserve soil structure while improving plant productivity and nutrient uptake efficiency.`,
        hypothesis: `It is hypothesized that applying ${treatment} techniques to ${crop} will lead to significant improvements in yield parameters, root architecture, and stress resilience compared to standard practices. The primary objective is to define optimal treatment dosages and record plant biometrics.`,
        methodology: `A randomized complete block design (RCBD) with four replications will be set up in representative fields across ${region}. Treatments will consist of control plots, standard chemical inputs, and various graduated concentrations of ${treatment}. Soil parameters, chlorophyll concentration, and leaf surface area will be monitored bi-weekly.`,
        outcomes: `Expected outcomes include a 15-20% improvement in resource use efficiency, enhanced soil microbial activity index, and a comprehensive database detailing agronomic response metrics. These findings will serve to publish extension materials for local farmers.`
      });
    } finally {
      setDrafting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!proposalData) return;

    const doc = new jsPDF();
    const limitY = 275;
    const margin = 15;
    const width = 180;
    
    // Header block
    doc.setFillColor(49, 87, 44); // #31572c
    doc.rect(0, 0, 210, 15, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("AgroIndia Research Proposal Assistant", 15, 10);

    // Document Metadata
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    
    let y = 30;
    
    // Proposal Title
    const splitTitle = doc.splitTextToSize(proposalData.title, width);
    doc.text(splitTitle, margin, y);
    y += splitTitle.length * 6 + 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`Crop Focus: ${crop} | Category: ${treatment} | Region: ${region}`, margin, y);
    y += 8;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, 195, y);
    y += 10;

    // Helper function to safely add paragraph text and manage page breaks
    const writeSection = (sectionTitle, sectionContent) => {
      // Draw section title
      if (y + 12 > limitY) {
        doc.addPage();
        doc.setFillColor(49, 87, 44);
        doc.rect(0, 0, 210, 10, "F");
        y = 22;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(49, 87, 44); // emerald green
      doc.text(sectionTitle, margin, y);
      y += 6;

      // Draw section body
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);

      const lines = doc.splitTextToSize(sectionContent, width);
      lines.forEach(line => {
        if (y + 6 > limitY) {
          doc.addPage();
          doc.setFillColor(49, 87, 44);
          doc.rect(0, 0, 210, 10, "F");
          y = 22;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(60, 60, 60);
        }
        doc.text(line, margin, y);
        y += 5.5;
      });

      y += 6; // padding between sections
    };

    writeSection("1. Introduction & Background", proposalData.introduction);
    writeSection("2. Hypothesis & Key Objectives", proposalData.hypothesis);
    writeSection("3. Experimental Methodology & Design", proposalData.methodology);
    writeSection("4. Expected Agronomic Outcomes", proposalData.outcomes);

    // Footer
    if (y + 15 > limitY) {
      doc.addPage();
      doc.setFillColor(49, 87, 44);
      doc.rect(0, 0, 210, 10, "F");
      y = 22;
    }
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text("Generated by AgroIndia Research AI Center. Confidential Research Draft.", margin, 280);

    const safeTitle = proposalData.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    doc.save(`${safeTitle}_proposal_draft.pdf`);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2.5 bg-[#31572c]/10 rounded-xl">
          <FileSignature className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Proposal Drafting Assistant</h1>
          <p className="text-sm text-gray-500">Draft structured academic agricultural research proposals with AI and export to PDF</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Presets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="h-4 w-4 text-[#31572c]" /> Quick Topic Presets
            </h3>
            <div className="space-y-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-3 border border-gray-150 rounded-xl hover:bg-gray-50/50 hover:border-[#31572c]/40 transition-all text-xs font-semibold text-gray-800"
                >
                  <span className="block text-[10px] text-emerald-800 font-bold uppercase mb-0.5">{preset.treatment}</span>
                  {preset.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleGenerateProposal} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-[#31572c]" /> Proposal Parameters
            </h3>

            {/* Research Topic */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Research Topic</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Assessing biochar amendment effects on soil moisture and microbial activity..."
                className="w-full h-20 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none resize-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Target Crop */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Target Crop</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Wheat"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
                  required
                />
              </div>

              {/* Treatment Category */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Treatment Type</label>
                <select
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none text-gray-800"
                >
                  <option value="Biological Control">Biological Control</option>
                  <option value="Organic Amendment">Organic Amendment</option>
                  <option value="Chemical Control">Chemical Control</option>
                  <option value="Precision Irrigation">Precision Irrigation</option>
                  <option value="Soil Remediation">Soil Remediation</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>
            </div>

            {/* Target Region */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Target Region</label>
              <div className="relative">
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Indo-Gangetic Plains"
                  className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
                  required
                />
                <Globe className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={drafting}
              className="w-full bg-[#31572c] hover:bg-[#1a3018] text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
            >
              {drafting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Drafting Proposal...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Draft Proposal Draft
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Proposal */}
        <div className="lg:col-span-7">
          {errorMsg && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2 text-xs font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!proposalData && !drafting ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
              <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                <FileText className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Proposal Preview Awaiting Details</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
                Provide the topic, crop type, treatment, and geographic target region on the left to output a professional research draft.
              </p>
            </div>
          ) : drafting ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <div className="relative h-20 w-20 mb-6">
                <div className="absolute inset-0 border-4 border-[#31572c]/25 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="h-6 w-6 text-[#31572c] animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-[#31572c]">Formulating Proposal Architecture...</h3>
              <p className="text-xs text-gray-400 mt-2">Gemini AI is structuring background literature and block design parameters.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fadeIn">
              {/* Proposal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="space-y-1 pr-4">
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider inline-block">
                    RESEARCH PROPOSAL DRAFT
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                    {proposalData.title}
                  </h3>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-[#31572c] hover:bg-[#1a3018] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>

              {/* Sections */}
              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                {/* Introduction */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#31572c] uppercase tracking-wider">
                    1. Introduction & Background
                  </h4>
                  <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                    {proposalData.introduction}
                  </p>
                </div>

                {/* Hypothesis */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#31572c] uppercase tracking-wider">
                    2. Hypothesis & Key Objectives
                  </h4>
                  <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                    {proposalData.hypothesis}
                  </p>
                </div>

                {/* Methodology */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#31572c] uppercase tracking-wider">
                    3. Experimental Methodology & Design
                  </h4>
                  <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                    {proposalData.methodology}
                  </p>
                </div>

                {/* Outcomes */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#31572c] uppercase tracking-wider">
                    4. Expected Agronomic Outcomes
                  </h4>
                  <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                    {proposalData.outcomes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
