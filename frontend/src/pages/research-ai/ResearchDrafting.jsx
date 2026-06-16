import React, { useState } from 'react';
import { 
  Sparkles, Download, Loader2, AlertCircle, FileText, 
  FileSignature, Bookmark, Sprout, Compass, DollarSign, Calendar
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';
import { jsPDF } from 'jspdf';

const PRESETS = [
  { topic: "AI-Driven Yield Prediction", objective: "Develop localized ML models for wheat", budget: "₹500,000", duration: "12 Months" },
  { topic: "Solar-Powered Drip Irrigation", objective: "Evaluate ROI in semi-arid zones", budget: "₹850,000", duration: "24 Months" },
  { topic: "Organic Pest Control Validation", objective: "Compare neem extract vs synthetic pesticides", budget: "₹300,000", duration: "6 Months" }
];

export default function ResearchDrafting() {
  const [topic, setTopic] = useState("");
  const [objective, setObjective] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  
  const [drafting, setDrafting] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectPreset = (preset) => {
    setTopic(preset.topic);
    setObjective(preset.objective);
    setBudget(preset.budget);
    setDuration(preset.duration);
    setProposalData(null);
    setErrorMsg("");
  };

  const handleGenerateProposal = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !objective.trim()) {
      setErrorMsg("Please fill in Topic and Objective.");
      return;
    }

    setDrafting(true);
    setErrorMsg("");
    setProposalData(null);

    try {
      const activeRole = localStorage.getItem('userRole') || 'Research Analyst';
      const res = await fetch('http://localhost:5000/api/research/draft-proposal', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': activeRole
        },
        body: JSON.stringify({ topic, objective, budget, duration })
      });

      if (!res.ok) throw new Error("Failed to draft proposal");
      const json = await res.json();
      
      setProposalData({
        title: `Research Proposal: ${topic}`,
        content: json.proposal
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not generate proposal draft. Please try again.");
    } finally {
      setDrafting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!proposalData) return;
    const doc = new jsPDF();
    let y = 30;
    
    doc.setFillColor(49, 87, 44);
    doc.rect(0, 0, 210, 15, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("AgroIndia Research Proposal", 15, 10);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(proposalData.title, 180);
    doc.text(titleLines, 15, y);
    y += titleLines.length * 6 + 10;
    
    const writeSection = (title, content) => {
        if(y > 270) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(49, 87, 44);
        doc.text(title, 15, y);
        y += 6;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const lines = doc.splitTextToSize(String(content), 180);
        doc.text(lines, 15, y);
        y += lines.length * 5 + 8;
    };

    writeSection("Abstract", proposalData.abstract);
    writeSection("Background", proposalData.background);
    writeSection("Objectives", proposalData.objectives);
    writeSection("Methodology", proposalData.methodology);
    writeSection("Budget & Timeline", `${proposalData.budget} | ${proposalData.timeline}`);
    writeSection("Expected Outcomes", proposalData.expectedOutcomes);

    doc.save(`proposal.pdf`);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2.5 bg-[#31572c]/10 rounded-xl">
          <FileSignature className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Proposal Drafting Assistant</h1>
          <p className="text-sm text-gray-500">Generate Research Proposals, Grant Applications, and Funding Documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-[#31572c]" /> Proposal Details
            </h3>
            <form onSubmit={handleGenerateProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Topic</label>
                <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Objective</label>
                <textarea value={objective} onChange={e=>setObjective(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-xl text-sm h-20" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Budget</label>
                  <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. ₹5 Lakhs" className="w-full p-3 bg-gray-50 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Duration</label>
                  <input value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. 12 Months" className="w-full p-3 bg-gray-50 border rounded-xl text-sm" />
                </div>
              </div>
              <button disabled={drafting} className="w-full bg-[#31572c] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#1a3018]">
                {drafting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4"/>} 
                Generate Draft
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          {!proposalData && !drafting ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-gray-50/50 border border-dashed rounded-3xl">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-sm font-bold text-gray-800">Awaiting Details</h3>
            </div>
          ) : drafting ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white border rounded-3xl shadow-sm">
              <Loader2 className="h-10 w-10 text-[#31572c] animate-spin mb-4" />
              <h3 className="text-sm font-bold text-[#31572c]">Drafting Proposal...</h3>
            </div>
          ) : (
            <div className="bg-white border rounded-3xl p-8 shadow-sm h-full max-h-[700px] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">{proposalData.title}</h2>
                <button onClick={handleDownloadPDF} className="bg-[#31572c] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Download className="h-4 w-4"/> PDF
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap prose prose-emerald">
                  {proposalData.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
