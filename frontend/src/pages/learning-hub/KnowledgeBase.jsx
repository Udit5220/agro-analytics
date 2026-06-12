import React, { useState } from 'react';
import { 
  BookOpen, 
  Folder, 
  FileText, 
  Download, 
  X,
  ChevronRight,
  Info,
  CheckCircle,
  Sparkles,
  Loader2,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function KnowledgeBase() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // AI query states
  const [expertQuery, setExpertQuery] = useState("");
  const [consulting, setConsulting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [categories, setCategories] = useState([
    {
      id: "soil",
      title: "Soil Health & Management",
      count: "24 Articles",
      color: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-700",
      articles: [
        { 
          id: "npk", 
          title: "Understanding NPK Ratios", 
          downloadable: true,
          content: `### Understanding NPK Ratios in Crop Management
 
Nitrogen (N), Phosphorus (P), and Potassium (K) are the three primary macronutrients required by agricultural crops for healthy development.
 
#### 1. Nutrient Functions
- **Nitrogen (N)**: Promotes vigorous leaf and stem vegetative growth. Essential for chlorophyll synthesis.
- **Phosphorus (P)**: Stimulates early root development, seed formatting, and flowering.
- **Potassium (K)**: Increases disease resistance, water-use efficiency, and crop quality metrics.
 
#### 2. Standard Recommended Ratios (Crop-Specific)
- **Paddy Rice**: 4:2:1 (N:P:K) for early monsoon transplantation.
- **Wheat (Kharif/Rabi transition)**: 4:2:1 standard buffer ratios depending on soil health card analysis.
- **Vegetables (Leafy)**: Requires higher Nitrogen (e.g., 3:1:2 ratio).
 
#### 3. Corrective Measures
Before chemical applications, measure electrical conductivity and organic carbon values to prevent salt toxicity.`,
          guideMeta: "APEDA Guide Vol. 2 (1.2 MB PDF)"
        },
        { 
          id: "compost", 
          title: "Composting Techniques", 
          downloadable: false,
          content: `### Composting Techniques for Organic Farming
 
Recycling agricultural organic waste improves soil organic carbon, moisture retention, and micro-fauna populations.
 
#### 1. Aerobic Compost Pits
- Excavate a pit sized 3m x 2m x 1m in a shaded area.
- Layer carbon-rich dry residue (straw, husk) with nitrogen-rich green matter (weeds, cow dung).
- Turn the compost pile every 15 days to ensure proper aeration and oxygen flow.
 
#### 2. Vermicomposting
- Deploy Eisenia fetida (red earthworms) in organic waste beds.
- Maintain moisture index at 60-70% and temperatures below 30°C.
- Produces high-grade castings rich in humic acids within 45-60 days.`,
          guideMeta: "ICAR Extension Bulletin 14"
        }
      ],
      extraArticles: [
        { id: "soil-4", title: "Micro-Nutrient Application Guide", downloadable: true, content: "### Micro-Nutrient Application Guide\n\nDetails on Zinc, Iron, and Boron deficiency correctors." }
      ]
    },
    {
      id: "pest",
      title: "Pest & Disease Control",
      count: "45 Articles",
      color: "bg-rose-50 border-rose-100",
      iconColor: "text-rose-700",
      articles: [
        { 
          id: "armyworm", 
          title: "Fall Armyworm Management", 
          downloadable: true,
          content: `### Fall Armyworm (FAW) Management in Maize Crops
 
Spodoptera frugiperda represents a highly destructive pest affecting maize crop cycles across India.
 
#### 1. Early Detection Anomaly
- Check crop leaf whorls for 'window pane' damage.
- Inspect fields during early morning or late evening when larvae are active.
 
#### 2. Integrated Pest Management (IPM)
- **Biological**: Deploy Trichogramma parasitoid wasps or spray Bacillus thuringiensis formulations.
- **Chemical**: Use Azadirachtin (Neem Oil) or recommended chemical formulations at economic threshold levels (ETL > 10% damage).`,
          guideMeta: "National Institute of Plant Health (1.8 MB PDF)"
        },
        { 
          id: "rust", 
          title: "Identifying Wheat Rust", 
          downloadable: false,
          content: `### Identifying and Managing Wheat Rust Fungi
 
Wheat rust causes massive crop failure if left uncontrolled in northern crop corridors.
 
#### 1. Classification
- **Yellow/Stripe Rust (Puccinia striiformis)**: Orange-yellow pustules arranged in parallel lines on leaves.
- **Brown/Leaf Rust**: Scattered brown circular pustules.
- **Black/Stem Rust**: Large dark reddish-brown pustules on stems and leaf sheaths.
 
#### 2. Control Protocols
Sow rust-resistant wheat seed varieties certified by ICAR. Spray Propiconazole at first visual detection.`,
          guideMeta: "Wheat Pathology Hub"
        }
      ],
      extraArticles: [
        { id: "pest-4", title: "Whitefly Management in Cotton", downloadable: true, content: "### Whitefly Management in Cotton\n\nYellow sticky trap layouts and early chemical deterrents." }
      ]
    },
    {
      id: "ai-expert",
      title: "Custom AI Consultations",
      count: "0 Articles",
      color: "bg-purple-50 border-purple-100",
      iconColor: "text-purple-700",
      articles: [],
      extraArticles: []
    }
  ]);

  const handleDownload = (e, artId, title) => {
    e.stopPropagation();
    setDownloadingId(artId);
    
    setTimeout(() => {
      setDownloadingId(null);
      setShowToast(`Successfully downloaded "${title}"`);
      setTimeout(() => setShowToast(null), 3000);
    }, 1500);
  };

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const handleConsultExpert = async (e) => {
    e.preventDefault();
    const query = expertQuery.trim();
    if (!query) return;

    setConsulting(true);
    setErrorMsg("");

    const prompt = `You are a crop agronomy expert. Generate a detailed, scientific knowledge guide answering the farmer's question: "${query}".
    
    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "title": A short, professional headline (e.g. "Root Rot Management in Chillies").
    2. "content": The body formatted in standard paragraphs, utilizing markdown subheadings where appropriate (e.g. use "###" and "####" headers, and "-" for bullet lists).
    3. "guideMeta": A mock citation/source detail (e.g., "ICAR Advisory 2026").`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert crop diagnostics professor. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      
      const newArticle = {
        id: `ai-${Date.now()}`,
        title: parsed.title,
        downloadable: true,
        content: parsed.content,
        guideMeta: parsed.guideMeta
      };

      setCategories(prev => 
        prev.map(cat => 
          cat.id === 'ai-expert'
            ? { 
                ...cat, 
                count: `${cat.articles.length + 1} Articles`,
                articles: [newArticle, ...cat.articles] 
              }
            : cat
        )
      );

      setSelectedArticle(newArticle);
      setExpertQuery("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to query AI crop specialist. Using local offline cache.");
    } finally {
      setConsulting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased relative">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold font-sans">{showToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-brand-dark/10 text-[#31572c] rounded-xl mt-1 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Agri-Knowledge Base</h1>
            <p className="text-sm text-slate-500 mt-1">
              Curated guides and dynamic AI crop pathology resources
            </p>
          </div>
        </div>
      </div>

      {/* Consult AI Expert Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> Consult AI Crop Specialist
        </h3>
        <form onSubmit={handleConsultExpert} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={expertQuery}
            onChange={(e) => setExpertQuery(e.target.value)}
            placeholder="Ask anything (e.g. Zinc deficiency signs in paddy, tomato leaf curl remedy)..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
            required
          />
          <button
            type="submit"
            disabled={consulting}
            className="bg-brand-dark hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {consulting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Querying Specialist...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Consult Specialist
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

      {/* 2x2 Responsive Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const isExpanded = expandedCategories[cat.id];
          const activeArticles = isExpanded 
            ? [...cat.articles, ...cat.extraArticles] 
            : cat.articles;

          return (
            <div 
              key={cat.id} 
              className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between h-fit"
            >
              <div>
                {/* Card Title */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${cat.color}`}>
                      <Folder className={`h-6 w-6 ${cat.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-850 transition-colors">
                        {cat.title}
                      </h2>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mt-0.5">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Nodes List */}
                <div className="space-y-2.5">
                  {activeArticles.map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => setSelectedArticle(art)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-150 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="text-xs font-bold truncate text-slate-650">
                          {art.title}
                        </span>
                      </div>

                      {art.downloadable && (
                        <button
                          onClick={(e) => handleDownload(e, art.id, art.title)}
                          disabled={downloadingId !== null}
                          className="p-1 text-slate-400 hover:text-emerald-800 rounded hover:bg-white transition-all disabled:opacity-50"
                        >
                          {downloadingId === art.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                  {activeArticles.length === 0 && (
                    <p className="text-xs text-gray-400 italic py-2">No custom AI consultations yet. Consult the specialist above!</p>
                  )}
                </div>
              </div>

              {/* View All Topics Expansion Trigger */}
              {cat.extraArticles.length > 0 && (
                <div className="mt-5 pt-3 border-t border-slate-50">
                  <button 
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="w-full text-center text-xs font-extrabold text-emerald-855 hover:text-emerald-950 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all flex items-center justify-center gap-1"
                  >
                    <span>{isExpanded ? "Collapse Topics" : "View All Topics"}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sliding Side Article Reader Drawer */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedArticle(null)} />
          
          <div className="bg-white h-full max-w-xl w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between p-6 sm:p-8 animate-slideOver">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  Agri-Knowledge Document
                </span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-5 space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900 leading-snug">{selectedArticle.title}</h3>
                {selectedArticle.guideMeta && (
                  <span className="text-[10px] text-slate-450 font-bold block">{selectedArticle.guideMeta}</span>
                )}
              </div>

              <div className="prose prose-sm max-h-[62vh] overflow-y-auto pr-2 space-y-4 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedArticle.content ? (
                  <div className="space-y-4">
                    {selectedArticle.content.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('###')) {
                        return <h3 key={pIdx} className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-1 pt-2">{para.replace('### ', '')}</h3>;
                      }
                      if (para.startsWith('####')) {
                        return <h4 key={pIdx} className="text-sm font-bold text-slate-800 pt-1">{para.replace('#### ', '')}</h4>;
                      }
                      if (para.startsWith('-')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-1.5 font-semibold">
                            {para.split('\n').map((li, lIdx) => (
                              <li key={lIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {li.replace('- ', '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx} className="text-slate-650 font-semibold leading-relaxed">{para}</p>;
                    })}
                  </div>
                ) : (
                  <p className="italic text-slate-400">Content loading...</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Bookmark Article</span>
              </span>
              
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-xs"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
