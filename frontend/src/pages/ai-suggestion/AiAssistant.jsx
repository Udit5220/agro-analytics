import React, { useState, useRef, useEffect } from "react";
import { Globe, Mic, SendHorizontal, Leaf } from "lucide-react";
import { generateContent } from "../../services/gemini/client";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";

// Specialized multi-lingual agronomist welcome messages
const GREETINGS = {
  Hindi: {
    text: "Namaskar! Main aapka AI Krishi Saathi hoon. Apni fasal ke baare mein poochhein.",
    translation: "Hello! I am your AI Farm Companion. Ask me about your crops."
  },
  English: {
    text: "Hello! I am your AI Krishi Saathi. Ask me anything about your crops, soil, or irrigation.",
    translation: "How can I assist your farming operations today?"
  },
  Punjabi: {
    text: "Sat Sri Akal! Main tuhada AI Krishi Saathi han. Apni fasal baare pucho.",
    translation: "Greetings! I am your AI Farm Companion. Ask me about your crops."
  },
  Tamil: {
    text: "Vanakkam! Naan ungalin AI Krishi Saathi. Ungal payirgalai patri kelungal.",
    translation: "Hello! I am your AI Farm Companion. Ask me about your crops."
  },
  Telugu: {
    text: "Namaskaram! Nenu mee AI Krishi Saathi. Mee panta gurinchi adagandi.",
    translation: "Greetings! I am your AI Farm Companion. Ask me about your crops."
  }
};

// Rich offline agronomic fallbacks if the API key fails
const AGRONOMIST_FALLBACKS = {
  wheat: {
    text: "Gehun (Wheat) ke liye vegetative stage par irrigation schedule 20-25 days intervals par hona chahiye. Pehli sinchai Crown Root Initiation (CRI) stage par karein. NPK target recipe 120:60:40 kg/hectare standard hai.",
    translation: "For Wheat, keep irrigation at 20-25 days intervals during the vegetative stage. Execute the first irrigation cycle during Crown Root Initiation (CRI) stage. Apply standard NPK at 120:60:40 kg/hectare."
  },
  rice: {
    text: "Dhaan (Rice) ke liye July mahine mein NPK target 120:60:60 kg/acre urea, DAP aur MOP ke roop mein karein. Paani ka level field mein vegetative stage ke dauran 2-5 cm banaye rakhein.",
    translation: "For Rice in July, fertilize using 120:60:60 kg/acre NPK via Urea, DAP, and MOP. Maintain water standing levels at 2-5 cm in the field during the vegetative stage."
  },
  pest: {
    text: "Aapke kshetra mein humidity badhne se Blast aur Fungal infection ka khatra hai. Neem oil (1500 ppm) ka foliar spray 15-day intervals par karein ya chemical option ke liye Tricyclazole spray karein.",
    translation: "Due to rising humidity, Blast and Fungal infection vector risks are moderate. Apply foliar sprays of Neem Oil (1500 ppm) at 15-day intervals or Tricyclazole for chemical protection."
  },
  generic: {
    text: "Fasal aur mitti ki jaanch ke aadhar par sahi khad aur sinchai ka chayan karein. Adhik jankari ke liye fasal ka naam aur vartaman sthiti batayein.",
    translation: "Select proper fertilizer dressings and irrigation schedules based on soil testing report. Please provide the crop name and stage for specific agronomic directions."
  }
};

export default function AiAssistant() {
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    soilData: getSoilDataByPincode("121001")
  });
  const feedEndRef = useRef(null);

  // Automatically scroll message feed to bottom on new updates
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Submit chat prompt handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    // 1. Add user message
    const userMsg = { role: "user", text: trimmed };
    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage("");

    // 2. Fetch AI agronomist inference from Gemini or fallback
    try {
      const systemPrompt = `You are Senior AI Krishi Saathi, a highly knowledgeable and friendly agronomist assistant for Indian farmers. 
      The user is currently farming in ${location.district}, ${location.state} (Pincode: ${location.pincode || "121001"}).
      Soil details: type is ${location.soilData?.soilType || "Clay Loam"}, pH is ${location.soilData?.pH || "7.2"}, Nitrogen is ${location.soilData?.nitrogen || "180"} kg/ha, Phosphorus is ${location.soilData?.phosphorus || "45"} kg/ha, Potassium is ${location.soilData?.potassium || "35"} kg/ha.
      Respond in Romanized transliterated Hindi (Hinglish) alongside a direct English translation on a new line. 
      Respond strictly in a clean paragraph format, avoiding bullet points or markdown code blocks. Selected language preference: ${selectedLang}.`;

      const responseText = await generateContent(trimmed, {
        temperature: 0.45,
        maxOutputTokens: 500,
        system_instruction: systemPrompt
      });

      setChatHistory((prev) => [...prev, { role: "model", text: responseText.trim() }]);
    } catch (err) {
      console.warn("AI Assistant falling back to static agronomic database:", err);
      
      // Select best agronomist fallback matches based on keyword queries
      const query = trimmed.toLowerCase();
      let matchedFallback = AGRONOMIST_FALLBACKS.generic;

      if (query.includes("wheat") || query.includes("gehun") || query.includes("irrigation")) {
        matchedFallback = {
          text: `Gehun (Wheat) ke liye vegetative stage par irrigation schedule 20-25 days intervals par hona chahiye. Pehli sinchai Crown Root Initiation (CRI) stage par karein. Aapke ${location.district} ke liye NPK target recipe 120:60:40 kg/hectare standard hai.`,
          translation: `For Wheat in ${location.district}, keep irrigation at 20-25 days intervals during the vegetative stage. Execute the first irrigation cycle during Crown Root Initiation (CRI) stage. Apply standard NPK at 120:60:40 kg/hectare.`
        };
      } else if (query.includes("rice") || query.includes("dhaan") || query.includes("npk")) {
        matchedFallback = {
          text: `Dhaan (Rice) ke liye ${location.state} mein NPK target 120:60:60 kg/acre urea, DAP aur MOP ke roop mein karein. Paani ka level field mein vegetative stage ke dauran 2-5 cm banaye rakhein.`,
          translation: `For Rice in ${location.state}, fertilize using 120:60:60 kg/acre NPK via Urea, DAP, and MOP. Maintain water standing levels at 2-5 cm in the field during the vegetative stage.`
        };
      } else if (query.includes("pest") || query.includes("rust") || query.includes("disease")) {
        matchedFallback = {
          text: `Aapke kshetra (${location.district}) mein humidity badhne se Blast aur Fungal infection ka khatra hai. Neem oil (1500 ppm) ka foliar spray 15-day intervals par karein ya chemical option ke liye Tricyclazole spray karein.`,
          translation: `Due to rising humidity in ${location.district}, Blast and Fungal infection vector risks are moderate. Apply foliar sprays of Neem Oil (1500 ppm) at 15-day intervals or Tricyclazole for chemical protection.`
        };
      } else {
        matchedFallback = {
          text: `Aapke ${location.district} ke mitti aur fasal ke aadhar par sahi khad aur sinchai ka chayan karein. Adhik jankari ke liye fasal ka naam aur vartaman sthiti batayein.`,
          translation: `Select proper fertilizer dressings and irrigation schedules in ${location.district} based on soil testing report. Please provide the crop name and stage for specific agronomic directions.`
        };
      }

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "model",
            text: `${matchedFallback.text}\n\n${matchedFallback.translation}`
          }
        ]);
      }, 500);
    }
  };

  const getDynamicWelcome = () => {
    const mainText = GREETINGS[selectedLang].text;
    const subText = GREETINGS[selectedLang].translation;
    const locString = ` [Active context: ${location.district}, ${location.state} • Soil: ${location.soilData?.soilType || "Clay Loam"} • pH: ${location.soilData?.pH || "7.2"}]`;
    return {
      text: mainText + locString,
      translation: subText
    };
  };

  const welcome = getDynamicWelcome();

  return (
    <div className="space-y-4 animate-fadeIn antialiased max-w-5xl mx-auto w-full p-4 flex flex-col min-h-[calc(100vh-80px)] font-['Plus_Jakarta_Sans',_sans-serif]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-150">
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>AI Agriculture Assistant</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
              कृषि एआई सहायक
            </span>
          </h1>
          <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
            Realtime conversational agronomist providing tailored soil, crop, and crop care treatments.
          </p>
        </div>
      </div>

      {/* 1. Location Selector Card */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Language Selector Bar */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-3 flex items-center justify-between shadow-sm w-full">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-wider">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-[10px] uppercase font-black">Language Preference</span>
        </div>
        <div className="flex items-center gap-2">
          {["Hindi", "English", "Punjabi", "Tamil", "Telugu"].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedLang === lang
                  ? "bg-[#31572c] text-white shadow-sm"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Workspace Card */}
      <div className="bg-white border border-gray-200/60 rounded-2xl flex-1 flex flex-col justify-between shadow-sm min-h-[500px] overflow-hidden">
        {/* Status Header */}
        <div className="text-[9px] font-black tracking-widest text-gray-400 p-3 bg-gray-50/50 border-b border-gray-100 flex justify-between uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            AI Assistant Active
          </span>
          <span>Multilingual Mode</span>
        </div>

        {/* Message Feed Window */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px]">
          {/* Default initial welcome bot message */}
          <div className="flex items-start gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-[#31572c]/8 flex items-center justify-center text-[#31572c] shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-200/60 rounded-2xl rounded-tl-sm p-4 max-w-2xl shadow-sm space-y-1">
              <h4 className="text-xs font-bold text-[#132a13] leading-relaxed">
                {welcome.text}
              </h4>
              <p className="text-gray-450 text-[11px] italic font-medium">
                {welcome.translation}
              </p>
            </div>
          </div>

          {/* User & AI conversational message streams */}
          {chatHistory.map((chat, idx) => (
            <div
              key={idx}
              className={`flex flex-col space-y-2 ${
                chat.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-xl text-xs font-bold shadow-sm border text-left leading-relaxed ${
                  chat.role === "user"
                    ? "bg-[#31572c] text-white border-[#31572c]"
                    : "bg-gray-50 text-gray-900 border-gray-200/60"
                }`}
              >
                {chat.text}
              </div>
            </div>
          ))}
          <div ref={feedEndRef} />
        </div>

        {/* Pinned Bottom Message Input Controls Bar */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-3">
          {/* Quick Suggestions capsules */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {[
              "Irrigation schedule for wheat",
              "NPK ratio for rice in July",
              "Pest alert near me"
            ].map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setInputMessage(suggestion)}
                className="bg-[#31572c]/5 text-[#31572c] border border-[#31572c]/10 hover:bg-[#31572c]/10 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Form controls dock */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer shrink-0 border-none"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <div className="flex-1 flex items-center relative gap-2 bg-gray-50 border border-gray-200/80 rounded-2xl px-4 h-12 focus-within:border-[#31572c] focus-within:bg-white transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Apna sawaal poochhein... (Ask your question...)"
                className="text-xs font-medium text-gray-800 bg-transparent w-full focus:outline-none placeholder-gray-400 h-full border-none pr-8"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-lg bg-[#31572c] text-white hover:bg-[#132a13] flex items-center justify-center cursor-pointer transition-colors shadow-sm absolute right-2 border-none"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
