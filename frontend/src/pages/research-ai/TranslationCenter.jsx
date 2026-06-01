import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, CheckCheck, Loader2 } from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function TranslationCenter() {
  const [sourceText, setSourceText] = useState("Apply urea only when the soil has sufficient moisture, preferably after light irrigation.");
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedText, setTranslatedText] = useState("यूरिया का प्रयोग तभी करें जब मिट्टी में पर्याप्त नमी हो, अधिमानतः हल्की सिंचाई के बाद।");
  const [copied, setCopied] = useState(false);
  const [translating, setTranslating] = useState(false);

  const langNames = {
    hi: "Hindi (हिंदी)",
    pa: "Punjabi (ਪੰਜਾਬੀ)",
    mr: "Marathi (मराठी)"
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setTranslating(true);
    try {
      const prompt = `Translate the following English agronomic text into ${langNames[targetLang]}. Ensure you preserve domain-specific agricultural terminology (e.g. soil moisture, nitrogen, split application, irrigation) in standard technical usage of the target language.
      
      Text: "${sourceText.trim()}"
      
      Return ONLY the translated text without any explanations or extra commentary.`;

      const response = await generateContent(prompt, {
        system_instruction: "You are an expert bilingual agricultural translator specializing in converting English research terms into regional Indian languages.",
        temperature: 0.1
      });

      setTranslatedText(response.trim());
    } catch (err) {
      console.error(err);
      setTranslatedText("Could not fetch translation. Please check your API key configuration.");
    } finally {
      setTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="p-2 bg-[#31572c]/10 rounded-lg">
          <Languages className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Agronomic Translation Center</h1>
          <p className="text-sm text-gray-500">Domain-specific AI translation preserving agricultural terminology</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-stretch border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/30">
          
          {/* Source Side */}
          <div className="flex-1 p-6 relative group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">English (Auto)</span>
              </div>
              <textarea
                className="w-full h-40 bg-transparent resize-none outline-none text-lg text-gray-800 placeholder-gray-400 font-medium leading-relaxed"
                placeholder="Enter agronomic text here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </div>
            
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleTranslate}
                disabled={translating || !sourceText.trim()}
                className="bg-[#31572c] hover:bg-[#1a3018] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                {translating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Translating...
                  </>
                ) : (
                  <>
                    Translate Term <ArrowRightLeft className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center lg:w-16 bg-gray-100 lg:border-l lg:border-r border-gray-200">
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-200 z-10 -my-4 lg:my-0 lg:-mx-4">
              <ArrowRightLeft className="h-5 w-5 text-[#31572c] lg:rotate-0 rotate-90" />
            </div>
          </div>

          {/* Target Side */}
          <div className="flex-1 p-6 relative bg-white lg:bg-transparent flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="text-sm font-bold text-[#31572c] bg-[#31572c]/5 px-3 py-1.5 rounded-lg border border-[#31572c]/20 outline-none cursor-pointer"
                >
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="mr">Marathi (मराठी)</option>
                </select>
                
                <button 
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                  title="Copy Translation"
                >
                  {copied ? <CheckCheck className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="w-full min-h-[160px] text-lg text-gray-900 font-bold leading-relaxed whitespace-pre-wrap">
                {translating ? (
                  <span className="text-gray-400 font-medium animate-pulse">Running agronomic translation models...</span>
                ) : sourceText ? (
                  translatedText
                ) : (
                  <span className="text-gray-300 font-medium">Translation will appear here...</span>
                )}
              </div>
            </div>
            
            {sourceText && !translating && (
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 self-end">
                <Languages className="h-3 w-3" /> Gemini AI Translated
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
