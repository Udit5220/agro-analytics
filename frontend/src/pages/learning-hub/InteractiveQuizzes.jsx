import React, { useState } from 'react';
import { Award, Target, CheckCircle2, XCircle, Sparkles, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function InteractiveQuizzes() {
  const [quizTopic, setQuizTopic] = useState("Pest Management");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [selectedAns, setSelectedAns] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState(2450);

  const [question, setQuestion] = useState({
    text: "Which of the following is the most effective biological control agent against Whiteflies in Cotton?",
    correctId: "C",
    explanation: "Chrysoperla (Green Lacewing) larvae are highly effective predators of small sucking insects, specifically whitefly nymphs and aphids, in cotton fields.",
    options: [
      { id: 'A', text: "Ladybird Beetles" },
      { id: 'B', text: "Neem Oil Spray" },
      { id: 'C', text: "Chrysoperla (Green Lacewing)" },
      { id: 'D', text: "Copper Fungicide" }
    ]
  });

  const handleFetchQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSelectedAns(null);
    setSubmitted(false);

    const prompt = `You are a crop science university professor. Generate a challenging, multiple-choice question focusing on: "${quizTopic}".
    
    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "text": The question text.
    2. "correctId": The correct option identifier (e.g. "C").
    3. "explanation": Brief explanation (under 30 words) explaining why this answer is correct.
    4. "options": An array of exactly 4 objects containing:
       - "id": "A", "B", "C", or "D".
       - "text": The option text description.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert agronomist quiz master. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      setQuestion(parsed);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not fetch new AI quiz question. Re-displaying default question.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    if (!submitted) setSelectedAns(id);
  };

  const handleSubmit = () => {
    if (selectedAns) {
      setSubmitted(true);
      if (selectedAns === question.correctId) {
        setScoreCount(prev => prev + 100);
      }
    }
  };

  const nextQuestion = (e) => {
    handleFetchQuiz(e);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-brand-dark/10 rounded-lg">
          <Target className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Interactive Quizzes</h1>
          <p className="text-sm text-gray-500">Test your agronomy knowledge and earn scholarly certifications</p>
        </div>
      </div>

      {/* Select Topic Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> Quiz Topic Generator
        </h3>
        <form onSubmit={handleFetchQuiz} className="flex flex-col sm:flex-row gap-3">
          <select
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none text-gray-800"
          >
            <option value="Pest Management">Pest Management</option>
            <option value="Soil Health & Fertilization">Soil Health & Fertilization</option>
            <option value="Micro-Irrigation Setup">Micro-Irrigation Setup</option>
            <option value="Post-Harvest Grain Storage">Post-Harvest Grain Storage</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-dark hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Preparing Quiz...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Load AI Question
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

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Quiz Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="h-8 w-8 text-[#31572c] animate-spin" />
              <p className="text-xs text-gray-500 font-semibold">Generating customized challenge node...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Active Challenge Question</span>
                <span className="bg-brand-dark/10 text-[#31572c] px-3 py-1 rounded-full text-xs font-bold uppercase">{quizTopic}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8 leading-relaxed">
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((opt) => {
                  const isSelected = selectedAns === opt.id;
                  const isCorrect = opt.id === question.correctId;
                  
                  let stateClass = "border-gray-200 hover:border-[#31572c]/50 hover:bg-gray-50 cursor-pointer";
                  if (submitted) {
                    if (isCorrect) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
                    else if (isSelected && !isCorrect) stateClass = "border-red-500 bg-red-50 text-red-900";
                    else stateClass = "border-gray-200 opacity-50 cursor-not-allowed";
                  } else if (isSelected) {
                    stateClass = "border-[#31572c] bg-brand-dark/5 ring-2 ring-[#31572c]/20";
                  }

                  return (
                    <div 
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateClass}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          submitted && isCorrect ? 'bg-emerald-500 text-white' : 
                          submitted && isSelected && !isCorrect ? 'bg-red-500 text-white' : 
                          isSelected ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {opt.id}
                        </div>
                        <span className="font-semibold text-gray-800">{opt.text}</span>
                      </div>
                      
                      {submitted && isCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-6 p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                  <h4 className="text-xs font-black text-emerald-850 uppercase tracking-widest">Explanation</h4>
                  <p className="text-xs text-slate-650 font-semibold mt-1 leading-relaxed">{question.explanation}</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                {!submitted ? (
                  <button 
                    onClick={handleSubmit}
                    disabled={!selectedAns}
                    className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:bg-[#1a3018] transition-colors text-xs"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button 
                    onClick={nextQuestion}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-black transition-colors text-xs"
                  >
                    Next Question <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Gamification Sidebar */}
        <div className="w-full lg:w-80 bg-gradient-to-b from-[#31572c] to-[#1a3018] rounded-3xl p-6 text-white shadow-lg h-fit">
          <div className="flex flex-col items-center text-center pb-6 border-b border-white/20">
            <div className="h-20 w-20 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)] mb-4">
              <Award className="h-10 w-10 text-[#31572c]" />
            </div>
            <h3 className="text-xl font-bold">Level 4 Scholar</h3>
            <p className="text-emerald-100/70 text-sm mt-1">{scoreCount} XP points</p>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>Daily Streak</span>
                <span className="text-amber-400">🔥 4 Days</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7].map(d => (
                  <div key={d} className={`h-2 flex-1 rounded-full ${d <= 4 ? 'bg-amber-400' : 'bg-white/20'}`}></div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-2xl">
              <span className="text-xs uppercase tracking-widest text-emerald-200/60 font-bold block mb-2">Next Milestone</span>
              <p className="text-sm font-bold leading-snug">Get 10 answers correct to claim the ICAR Scholar Ribbon.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
