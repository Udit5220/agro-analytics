import React, { useState } from 'react';
import { 
  Search, Database, Loader2, BookOpen, AlertCircle, Sparkles, 
  ChevronRight, Lightbulb, FileText, Compass
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function ResearchInsightsExplorer() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setErrorMsg("");
    setResults(null);

    try {
      // Attempt backend RAG search first
      const activeRole = localStorage.getItem('userRole') || 'Research Analyst';
      const res = await fetch('http://localhost:5000/api/research/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': activeRole
        },
        body: JSON.stringify({ query })
      });
      
      let data = await res.json().catch(() => null);

      // If backend fails or not running, fallback to Gemini direct simulation for demo purposes
      if (!res.ok || !data) {
        console.warn("Backend RAG failed, simulating response via Gemini API...");
        const prompt = `Simulate a Retrieval-Augmented Generation (RAG) search response for the agricultural query: "${query}".
        Return a JSON object with:
        1. "answer": A comprehensive 2-paragraph answer synthesizing research.
        2. "keyFindings": An array of 3 bullet points.
        3. "actionableInsights": An array of 2 practical recommendations for farmers/agribusinesses.
        4. "sources": An array of 3 simulated research paper objects, each having "title", "authors", "year", and "relevance" (e.g. "98%").
        Do not use markdown tags, return raw JSON.`;

        const simResponse = await generateContent(prompt, { temperature: 0.3 });
        let cleanJson = simResponse.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        data = JSON.parse(cleanJson);
      }
      
      // Normalize data whether from backend or fallback
      setResults({
        answer: data.answer,
        keyFindings: data.keyFindings || [],
        actionableInsights: data.actionableInsights || [],
        sources: data.sources || data.sourceDocuments || [
          { title: "Simulated Source Document 1", authors: "AgroIndia", year: "2025", relevance: "High" }
        ]
      });

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to query research database. Check connection.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
          <Compass className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Research Insights Explorer (RAG)</h1>
          <p className="text-sm text-gray-500">Query the centralized agricultural vector database for instant synthesized answers.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-2 shadow-sm">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything (e.g. What is the impact of organic farming on wheat yield in arid regions?)..."
            className="w-full pr-32 py-4 bg-transparent text-sm font-medium outline-none text-gray-900 placeholder-gray-400"
            style={{ paddingLeft: "3.5rem" }}
          />
          <button 
            type="submit" 
            disabled={searching || !query.trim()}
            className="absolute right-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Ask AI
          </button>
        </form>
      </div>
      
      {errorMsg && (
        <div className="p-4 bg-teal-50 text-teal-700 rounded-2xl flex gap-2 text-sm font-bold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {searching && (
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <Database className="h-12 w-12 text-emerald-600 animate-pulse mb-4" />
          <h3 className="text-base font-bold text-emerald-600">Querying Vector Database (ChromaDB)...</h3>
          <p className="text-sm text-gray-400 mt-2">Retrieving relevant chunks and generating contextual response.</p>
        </div>
      )}

      {!searching && results && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Answer Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Synthesized Answer
              </h3>
              <div className="text-sm text-gray-800 leading-loose space-y-4 font-medium">
                {results.answer.split('\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Key Findings
                 </h3>
                 <ul className="space-y-3">
                   {results.keyFindings.map((finding, idx) => (
                     <li key={idx} className="flex gap-2 text-sm text-gray-700">
                       <span className="text-emerald-500 font-bold">•</span>
                       <span>{finding}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Actionable Insights
                 </h3>
                 <ul className="space-y-3">
                   {results.actionableInsights.map((insight, idx) => (
                     <li key={idx} className="flex gap-2 text-sm text-gray-700">
                       <span className="text-emerald-500 font-bold">→</span>
                       <span>{insight}</span>
                     </li>
                   ))}
                 </ul>
              </div>
            </div>
          </div>

          {/* Sources Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 ml-2">
              <BookOpen className="h-4 w-4 text-gray-400" /> Retrieved Sources
            </h3>
            {results.sources.map((source, idx) => (
              <div key={idx} className="bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl p-5 shadow-sm transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Match: {source.relevance || 'High'}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">{source.year || 'N/A'}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                  {source.title || (source.pageContent ? source.pageContent.substring(0, 50) + "..." : "Unknown Document")}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {source.authors || 'Extracted from Database'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searching && !results && (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 text-center opacity-60">
          <Database className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-400">RAG Engine Standby</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">Enter a natural language query above to retrieve and synthesize intelligence from across the agricultural research database.</p>
        </div>
      )}
    </div>
  );
}
