import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Sparkles, Download, Loader2, ArrowRight, AlertCircle, BookOpen, 
  UploadCloud, FileSearch, Info, Landmark, Sprout, Briefcase, BarChart3, CheckCircle2,
  PlayCircle, StopCircle, Bookmark, BookmarkCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generateContent } from '../../services/gemini/client';
import { useAITranslation } from '../../hooks/useAITranslation';

const MarkdownText = ({ text }) => {
  if (!text) return null;
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default function ResearchSummary() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [uploadMode, setUploadMode] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const fileInputRef = useRef(null);

  const activeRole = localStorage.getItem('userRole') || 'Research Analyst';
  
  const [activePersona, setActivePersona] = useState('Analyst');
  const [personaInsights, setPersonaInsights] = useState({});
  const [generatingPersona, setGeneratingPersona] = useState(false);

  const [latestPapers, setLatestPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(true);

  const lang = localStorage.getItem('language') || 'English';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const currentTitle = uploadMode ? customTitle : selectedPaper?.title;
    if (currentTitle) {
      const saved = JSON.parse(localStorage.getItem(`researchWishlist_${activeRole}`) || '[]');
      setIsWishlisted(saved.some(item => item.title === currentTitle));
    }
  }, [selectedPaper, customTitle, uploadMode, activeRole]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    if (!summaryData?.executiveSummary) return;

    const utterance = new SpeechSynthesisUtterance(summaryData.executiveSummary);
    const currentLang = localStorage.getItem('language') || 'English';
    const isHindi = currentLang === 'Hindi';
    
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    
    // Robust voice selection
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (isHindi) {
      // Catch hi-IN, hi_IN, hi-in, etc.
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes('hi'));
    } else {
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes('en') && (v.name.includes('Google') || v.name.includes('Natural')));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.toLowerCase().includes('en'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const toggleWishlist = () => {
    const currentTitle = uploadMode ? customTitle : selectedPaper?.title;
    const currentAbstract = uploadMode ? customText.substring(0, 200) : selectedPaper?.abstract;
    if (!currentTitle) return;

    const storageKey = `researchWishlist_${activeRole}`;
    let saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (isWishlisted) {
      saved = saved.filter(item => item.title !== currentTitle);
      setIsWishlisted(false);
    } else {
      saved.push({ title: currentTitle, abstract: currentAbstract || "Custom document" });
      setIsWishlisted(true);
    }
    localStorage.setItem(storageKey, JSON.stringify(saved));
  };

  const uiStrings = [
    "Research Summary Engine", "Transform agricultural research into persona-specific actionable insights.",
    "Publications", "Upload", "Role Context Active:", "The papers below are dynamically generated for a ",
    " Select any paper to generate a deeper executive summary tailored to your clearance and language.",
    "Awaiting Research Selection", "Select a publication from the list on the left to generate a structured summary and tailored persona-based insights.",
    "Extracting Intelligence...", "Research Summary", "AI Executive Summary", "Methodology", "Quantitative Findings",
    "Research Limitations", "Generated Citations (APA/IEEE)", "Not provided.", "No citations generated.",
    "Upload Document File (.txt, .md, .csv)", "Click to Browse Files", "OR PASTE TEXT", "Document Title",
    "Enter research paper title...", "Document Content", "Paste or upload the full text of the research document here...",
    "Generate Insights", "Analyzing..."
  ];
  const { t } = useAITranslation(uiStrings);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const language = localStorage.getItem('language') || 'English';
        const res = await fetch('http://localhost:5000/api/research/latest-publications', {
          headers: {
            'x-user-role': activeRole,
            'x-language': language
          }
        });
        if (res.ok) {
          const json = await res.json();
          // Map backend format to component's expected format
          const pubs = Array.isArray(json.publications) ? json.publications : [];
          const mapped = pubs.filter(Boolean).map((pub, idx) => ({
            id: idx + 1,
            title: pub?.title || "Unknown Title",
            authors: Array.isArray(pub?.authors) ? pub.authors.join(', ') : (typeof pub?.authors === 'string' ? pub.authors : "Unknown Authors"),
            date: pub?.publicationDate || "Recent",
            abstract: pub?.twoLineSummary || "No abstract provided."
          }));
          setLatestPapers(mapped);
        }
      } catch(err) {
        console.error("Failed to fetch papers:", err);
      } finally {
        setLoadingPapers(false);
      }
    };
    fetchPapers();
  }, [activeRole]);

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    if (!selectedPaper) {
      setErrorMsg("Please select a research paper first.");
      return;
    }

    setSummarizing(true);
    setErrorMsg("");
    setSummaryData(null);
    setPersonaInsights({});

    const textToSummarize = uploadMode 
      ? `Title: ${customTitle}\n\nContent: ${customText}`
      : `Title: ${selectedPaper.title}\nAuthors: ${selectedPaper.authors}\nDate: ${selectedPaper.date}\nAbstract: ${selectedPaper.abstract}`;

    try {
      const res = await fetch('http://localhost:5000/api/research/summarize-document', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': activeRole,
          'x-language': localStorage.getItem('language') || 'English'
        },
        body: JSON.stringify({ text: textToSummarize })
      });

      if (!res.ok) throw new Error("Failed to generate summary");
      const json = await res.json();
      
      setSummaryData(json.summary || json.parsedSummary || json);
      setActivePersona('Analyst');
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate strict scientific summary. Please try again.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Auto-fill title based on filename (removing extension)
    const titleWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setCustomTitle(titleWithoutExt);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomText(event.target.result);
    };
    reader.readAsText(file);
  };

  const generatePersonaData = async (data, persona) => {
      setActivePersona(persona);
      if (personaInsights[persona]) return; // Already generated
      
      setGeneratingPersona(true);
      
      const summaryText = JSON.stringify(data);
      const promptMap = {
          'Analyst': "Explain this to a research analyst. Output JSON: { 'dataTrends': '...', 'comparativeInsights': ['...'], 'statisticalSignificance': '...', 'extractionPoints': '...' }",
          'Agribusiness': "Explain this to an agribusiness manager. Output JSON: { 'marketImpact': '...', 'supplyChainOpportunities': '...', 'investmentAreas': ['...'], 'commercialViability': '...' }",
          'Government': "Explain this to a government official. Output JSON: { 'policyImplications': '...', 'districtLevelImpact': '...', 'subsidyRecommendations': ['...'], 'societalBenefits': '...' }",
          'Admin': "Explain this to a platform admin. Output JSON: { 'moduleAnalytics': '...', 'usagePotential': '...', 'featureIntegrations': ['...'], 'systemImpact': '...' }"
      };

      try {
          const response = await generateContent(promptMap[persona] + "\nSummary: " + summaryText, {
            system_instruction: "Always return response as raw JSON.",
            temperature: 0.3
          });
          let cleanJson = response.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
          const parsed = JSON.parse(cleanJson);
          
          setPersonaInsights(prev => ({...prev, [persona]: parsed}));
      } catch (err) {
          // fallback
          setPersonaInsights(prev => ({...prev, [persona]: { error: 'Failed to load persona insights. Using fallback.' }}));
      } finally {
          setGeneratingPersona(false);
      }
  };

  const handleDownloadPDF = () => {
    if (!summaryData) return;
    const doc = new jsPDF();
    doc.setFillColor(49, 87, 44);
    doc.rect(0, 0, 210, 15, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("AgroIndia AI Research Summary", 15, 10);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Executive Summary:", 15, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(summaryData.executiveSummary, 180);
    doc.text(splitSummary, 15, 36);
    
    doc.save(`research_summary.pdf`);
  };

  // Stop TTS when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#31572c]/10 rounded-xl">
            <BookOpen className="h-6 w-6 text-[#31572c]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("Research Summary Engine")}</h1>
            <p className="text-sm text-gray-500">{t("Transform agricultural research into persona-specific actionable insights.")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex border-b border-gray-100 mb-4 gap-4">
              <button 
                onClick={() => { setUploadMode(false); setSummaryData(null); }}
                className={`pb-3 flex-1 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${!uploadMode ? 'border-[#31572c] text-[#31572c]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                <FileText className="w-4 h-4" /> Publications
              </button>
              {activeRole === 'Company Admin' && (
                <button 
                  onClick={() => { setUploadMode(true); setSummaryData(null); setSelectedPaper(null); }}
                  className={`pb-3 flex-1 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${uploadMode ? 'border-[#31572c] text-[#31572c]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  <UploadCloud className="w-4 h-4" /> Upload
                </button>
              )}
            </div>

            {!uploadMode ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-[#4f772d]/10 border border-[#90a955]/30 rounded-2xl p-4 sm:p-6 mb-8 flex items-start gap-4">
                <Info className="h-6 w-6 text-[#90a955] shrink-0 mt-1" />
                <p className="text-sm text-[#4f772d] leading-relaxed">
                  <strong>{t("Role Context Active:")}</strong> {t("The papers below are dynamically generated for a ")} <strong>{activeRole}</strong>. {t(" Select any paper to generate a deeper executive summary tailored to your clearance and language.")}
                </p>
              </div>

              {loadingPapers ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {latestPapers.map((paper) => (
                    <div 
                      key={paper.id}
                      onClick={() => setSelectedPaper(paper)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPaper?.id === paper.id ? 'border-[#31572c] bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">{paper.title}</h4>
                        {selectedPaper?.id === paper.id && <CheckCircle2 className="w-4 h-4 text-[#31572c] shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-1">{paper.authors}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{paper.date}</p>
                    </div>
                  ))}
                </div>
              )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{t("Upload Document File (.txt, .md, .csv)")}</label>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".txt,.md,.csv"
                    onChange={handleFileUpload}
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-200 border-dashed text-gray-700 py-4 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <UploadCloud className="h-6 w-6 text-gray-400" />
                    <span>{t("Click to Browse Files")}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="h-px bg-gray-200 flex-1"></div>
                   <span className="text-xs font-bold text-gray-400 uppercase">{t("OR PASTE TEXT")}</span>
                   <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t("Document Title")}</label>
                  <input 
                    type="text" 
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter research paper title..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#31572c]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t("Document Content")}</label>
                  <textarea 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={t("Paste or upload the full text of the research document here...")}
                    className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#31572c] resize-none custom-scrollbar"
                  ></textarea>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateSummary}
              disabled={summarizing || (!uploadMode && !selectedPaper) || (uploadMode && (!customTitle || !customText))}
              className="w-full bg-[#31572c] hover:bg-[#1a3018] text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {summarizing ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("Analyzing...")}</> : <><Sparkles className="h-4 w-4" /> {t("Generate Insights")}</>}
            </button>

            {errorMsg && (
              <div className="p-4 bg-teal-50 border border-teal-200 text-teal-700 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output (8 cols) */}
        <div className="lg:col-span-8">
          {!summaryData && !summarizing ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-gray-200 rounded-3xl">
              <FileSearch className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-sm font-bold text-gray-800">{t("Awaiting Research Selection")}</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
                {t("Select a publication from the list on the left to generate a structured summary and tailored persona-based insights.")}
              </p>
            </div>
          ) : summarizing ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <div className="relative h-16 w-16 mb-4">
                <div className="absolute inset-0 border-4 border-[#31572c]/25 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-base font-bold text-[#31572c]">{t("Extracting Intelligence...")}</h3>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              
              {/* Top: General Summary */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-900">{t("Research Summary")}</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleWishlist} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
                      {isWishlisted ? <BookmarkCheck className="h-3.5 w-3.5 text-[#31572c]" /> : <Bookmark className="h-3.5 w-3.5" />} 
                      {isWishlisted ? "Wishlisted" : "Wishlist"}
                    </button>
                    <button onClick={handlePlayAudio} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
                      {isPlaying ? <StopCircle className="h-3.5 w-3.5 text-red-500" /> : <PlayCircle className="h-3.5 w-3.5 text-[#31572c]" />} 
                      {isPlaying ? "Stop" : "Play Audio"}
                    </button>
                    <button onClick={handleDownloadPDF} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </div>
                </div>
                
                {summaryData?.executiveSummary && (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm mt-2">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> {t("AI Executive Summary")}
                    </p>
                    <p className="text-sm font-medium text-emerald-900 leading-relaxed">
                      <MarkdownText text={summaryData.executiveSummary} />
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("Methodology")}</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      <MarkdownText text={summaryData?.methodology} />
                      {!summaryData?.methodology && t("Not provided.")}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("Quantitative Findings")}</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      <MarkdownText text={summaryData?.quantitativeDataFindings} />
                      {!summaryData?.quantitativeDataFindings && t("Not provided.")}
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("Research Limitations")}</p>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      <MarkdownText text={summaryData?.researchLimitations} />
                      {!summaryData?.researchLimitations && t("Not provided.")}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("Generated Citations (APA/IEEE)")}</p>
                    <ul className="list-disc list-inside text-sm font-medium text-gray-300 space-y-2">
                      {Array.isArray(summaryData?.citations) 
                        ? summaryData.citations.map((c, i) => <li key={i}>{c}</li>)
                        : (summaryData?.citations ? <li>{summaryData.citations}</li> : <li>{t("No citations generated.")}</li>)
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
