import React, { useState } from 'react';
import { 
  Lightbulb, MapPin, Sprout, Target, Loader2, AlertCircle, 
  BookOpen, CheckCircle2, FlaskConical, ArrowRight, Sparkles // Added missing Sparkles import
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function ResearchRecommendationEngine() {
  const [location, setLocation] = useState("");
  const [crop, setCrop] = useState("");
  const [problem, setProblem] = useState("");
  
  const [recommending, setRecommending] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!location.trim() || !crop.trim() || !problem.trim()) {
      setErrorMsg("Please fill in all criteria.");
      return;
    }

    setRecommending(true);
    setErrorMsg("");
    setRecommendations(null);

    const prompt = `Act as an agricultural research recommendation engine.
    Given the following scenario:
    - Location: ${location}
    - Crop: ${crop}
    - Problem Statement: ${problem}
    
    Structure your response as a valid JSON object. Do not include markdown tags, return raw JSON only.
    Keys required:
    1. "relevantPapers": Array of 3 objects containing "title", "authors", and "summary".
    2. "bestPractices": Array of 3 bullet points with direct solutions.
    3. "scientificRecommendations": A paragraph explaining the scientific approach to mitigate the problem.
    4. "caseStudies": Array of 2 similar successful case studies (brief 1-sentence summaries).`;

    try {
      const response = await generateContent(prompt, { 
        system_instruction: "You are an expert agricultural research AI. You must ALWAYS return your response as raw, valid JSON without any markdown formatting.",
        temperature: 0.3 
      });

      // Robust JSON extraction fallback (extracts content between first '{' and last '}')
      let cleanJson = response.trim();
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(cleanJson);
      setRecommendations(parsedData);
    } catch (err) {
      console.error("Parsing or Fetching Error:", err);
      setErrorMsg("Failed to generate or parse recommendations. Please try again.");
    } finally {
      setRecommending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
          <Lightbulb className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Research Recommendation Engine</h1>
          <p className="text-sm text-gray-500">Get tailored scientific practices, papers, and case studies based on specific farm problems.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleRecommend} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Farm Location</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  required
                />
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Crop Type</label>
              <div className="relative">
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Grapes"
                  className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  required
                />
                <Sprout className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase flex items-center gap-1.5">
                <Target className="h-4 w-4 text-teal-500" /> Problem Statement
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. Unseasonal rain causing premature fruit drop and fungal infections..."
                className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={recommending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
            >
              {recommending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Get AI Recommendations
            </button>
            
            {errorMsg && (
              <div className="p-4 bg-teal-50 text-teal-700 rounded-2xl flex gap-2 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          {!recommendations && !recommending ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
              <FlaskConical className="h-14 w-14 text-gray-300 mb-4" />
              <h3 className="text-sm font-bold text-gray-800">Awaiting Problem Context</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
                Describe the specific challenges your crop is facing to receive tailored scientific recommendations and relevant research papers.
              </p>
            </div>
          ) : recommending ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
              <h3 className="text-sm font-bold text-emerald-600">Cross-referencing Global Research...</h3>
              <p className="text-xs text-gray-400 mt-2">Matching your problem parameters against the scientific database.</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
              
              {/* Scientific Recommendations */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 border border-emerald-100/50 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" /> Scientific Approach
                </h3>
                <p className="text-sm text-emerald-950 leading-relaxed font-medium">
                  {recommendations.scientificRecommendations}
                </p>
              </div>

              {/* Best Practices & Case Studies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Actionable Best Practices
                  </h3>
                  <ul className="space-y-4">
                    {recommendations.bestPractices?.map((practice, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-gray-700 items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Similar Case Studies
                  </h3>
                  <ul className="space-y-4">
                    {recommendations.caseStudies?.map((study, idx) => (
                      <li key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 font-medium">
                        {study}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Relevant Papers */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-500" /> Recommended Academic Papers
                </h3>
                <div className="space-y-4">
                  {recommendations.relevantPapers?.map((paper, idx) => (
                    <div key={idx} className="p-5 border border-gray-150 rounded-2xl hover:border-emerald-300 transition-colors group cursor-pointer">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                        {paper.title}
                      </h4>
                      <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-2">
                        {paper.authors}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {paper.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}