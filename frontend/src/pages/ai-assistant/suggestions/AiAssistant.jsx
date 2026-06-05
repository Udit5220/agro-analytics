// import React, { useState, useRef, useEffect } from "react";
// import { Globe, Mic, SendHorizontal, Leaf } from "lucide-react";
// import { generateContent } from "../../../services/gemini/client";
// import LocationSelector from "../../../components/LocationSelector";
// import { getSoilDataByPincode } from "../../../services/locationService";

// // Specialized multi-lingual agronomist welcome messages
// const GREETINGS = {
//   Hindi: {
//     text: "Namaskar! Main aapka AI Krishi Saathi hoon. Apni fasal ke baare mein poochhein.",
//     translation: "Hello! I am your AI Farm Companion. Ask me about your crops."
//   },
//   English: {
//     text: "Hello! I am your AI Krishi Saathi. Ask me anything about your crops, soil, or irrigation.",
//     translation: "How can I assist your farming operations today?"
//   },
//   Punjabi: {
//     text: "Sat Sri Akal! Main tuhada AI Krishi Saathi han. Apni fasal baare pucho.",
//     translation: "Greetings! I am your AI Farm Companion. Ask me about your crops."
//   },
//   Tamil: {
//     text: "Vanakkam! Naan ungalin AI Krishi Saathi. Ungal payirgalai patri kelungal.",
//     translation: "Hello! I am your AI Farm Companion. Ask me about your crops."
//   },
//   Telugu: {
//     text: "Namaskaram! Nenu mee AI Krishi Saathi. Mee panta gurinchi adagandi.",
//     translation: "Greetings! I am your AI Farm Companion. Ask me about your crops."
//   }
// };

// // Rich offline agronomic fallbacks if the API key fails
// const AGRONOMIST_FALLBACKS = {
//   wheat: {
//     text: "Gehun (Wheat) ke liye vegetative stage par irrigation schedule 20-25 days intervals par hona chahiye. Pehli sinchai Crown Root Initiation (CRI) stage par karein. NPK target recipe 120:60:40 kg/hectare standard hai.",
//     translation: "For Wheat, keep irrigation at 20-25 days intervals during the vegetative stage. Execute the first irrigation cycle during Crown Root Initiation (CRI) stage. Apply standard NPK at 120:60:40 kg/hectare."
//   },
//   rice: {
//     text: "Dhaan (Rice) ke liye July mahine mein NPK target 120:60:60 kg/acre urea, DAP aur MOP ke roop mein karein. Paani ka level field mein vegetative stage ke dauran 2-5 cm banaye rakhein.",
//     translation: "For Rice in July, fertilize using 120:60:60 kg/acre NPK via Urea, DAP, and MOP. Maintain water standing levels at 2-5 cm in the field during the vegetative stage."
//   },
//   pest: {
//     text: "Aapke kshetra mein humidity badhne se Blast aur Fungal infection ka khatra hai. Neem oil (1500 ppm) ka foliar spray 15-day intervals par karein ya chemical option ke liye Tricyclazole spray karein.",
//     translation: "Due to rising humidity, Blast and Fungal infection vector risks are moderate. Apply foliar sprays of Neem Oil (1500 ppm) at 15-day intervals or Tricyclazole for chemical protection."
//   },
//   generic: {
//     text: "Fasal aur mitti ki jaanch ke aadhar par sahi khad aur sinchai ka chayan karein. Adhik jankari ke liye fasal ka naam aur vartaman sthiti batayein.",
//     translation: "Select proper fertilizer dressings and irrigation schedules based on soil testing report. Please provide the crop name and stage for specific agronomic directions."
//   }
// };

// export default function AiAssistant() {
//   const [selectedLang, setSelectedLang] = useState("Hindi");
//   const [inputMessage, setInputMessage] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [isAiThinking, setIsAiThinking] = useState(false);
//   const [location, setLocation] = useState({
//     state: "Haryana",
//     district: "Faridabad",
//     pincode: "121001",
//     latitude: 28.4089,
//     longitude: 77.3178,
//     soilData: getSoilDataByPincode("121001")
//   });
//   const feedEndRef = useRef(null);

//   // Automatically scroll message feed to bottom on new updates
//   useEffect(() => {
//     feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory, isAiThinking]);

//   const handleLocationChange = (newLocation) => {
//     setLocation(newLocation);
//   };

//   // Submit chat prompt handler
//   const handleSendMessage = async (e, directText = null) => {
//     if (e && e.preventDefault) e.preventDefault();
//     const messageToSend = directText || inputMessage;
//     const trimmed = messageToSend.trim();
//     if (!trimmed || isAiThinking) return;

//     // 1. Add user message
//     const userMsg = { role: "user", text: trimmed };
//     setChatHistory((prev) => [...prev, userMsg]);
//     setInputMessage("");
//     setIsAiThinking(true);

//     // 2. Fetch AI agronomist inference from Gemini or fallback
//     try {
//       const systemPrompt = `You are Senior AI Krishi Saathi, a highly knowledgeable and friendly agronomist assistant for Indian farmers.
//       The user is currently farming in ${location.district}, ${location.state} (Pincode: ${location.pincode || "121001"}).
//       Soil details: type is ${location.soilData?.soilType || "Clay Loam"}, pH is ${location.soilData?.pH || "7.2"}, Nitrogen is ${location.soilData?.nitrogen || "180"} kg/ha, Phosphorus is ${location.soilData?.phosphorus || "45"} kg/ha, Potassium is ${location.soilData?.potassium || "35"} kg/ha.
//       Respond in Romanized transliterated Hindi (Hinglish) alongside a direct English translation on a new line.
//       Respond strictly in a clean paragraph format, avoiding bullet points or markdown code blocks. Selected language preference: ${selectedLang}.`;

//       const responseText = await generateContent(trimmed, {
//         model: "gemini-3.1-flash-lite",
//         temperature: 0.45,
//         maxOutputTokens: 500,
//         system_instruction: systemPrompt
//       });

//       setChatHistory((prev) => [...prev, { role: "model", text: responseText.trim() }]);
//       setIsAiThinking(false);
//     } catch (err) {
//       console.warn("AI Assistant falling back to static agronomic database:", err);

//       // Select best agronomist fallback matches based on keyword queries
//       const query = trimmed.toLowerCase();
//       let matchedFallback = AGRONOMIST_FALLBACKS.generic;

//       if (query.includes("wheat") || query.includes("gehun") || query.includes("irrigation")) {
//         matchedFallback = {
//           text: `Gehun (Wheat) ke liye vegetative stage par irrigation schedule 20-25 days intervals par hona chahiye. Pehli sinchai Crown Root Initiation (CRI) stage par karein. Aapke ${location.district} ke liye NPK target recipe 120:60:40 kg/hectare standard hai.`,
//           translation: `For Wheat in ${location.district}, keep irrigation at 20-25 days intervals during the vegetative stage. Execute the first irrigation cycle during Crown Root Initiation (CRI) stage. Apply standard NPK at 120:60:40 kg/hectare.`
//         };
//       } else if (query.includes("rice") || query.includes("dhaan") || query.includes("npk")) {
//         matchedFallback = {
//           text: `Dhaan (Rice) ke liye ${location.state} mein NPK target 120:60:60 kg/acre urea, DAP aur MOP ke roop mein karein. Paani ka level field mein vegetative stage ke dauran 2-5 cm banaye rakhein.`,
//           translation: `For Rice in ${location.state}, fertilize using 120:60:60 kg/acre NPK via Urea, DAP, and MOP. Maintain water standing levels at 2-5 cm in the field during the vegetative stage.`
//         };
//       } else if (query.includes("pest") || query.includes("rust") || query.includes("disease")) {
//         matchedFallback = {
//           text: `Aapke kshetra (${location.district}) mein humidity badhne se Blast aur Fungal infection ka khatra hai. Neem oil (1500 ppm) ka foliar spray 15-day intervals par karein ya chemical option ke liye Tricyclazole spray karein.`,
//           translation: `Due to rising humidity in ${location.district}, Blast and Fungal infection vector risks are moderate. Apply foliar sprays of Neem Oil (1500 ppm) at 15-day intervals or Tricyclazole for chemical protection.`
//         };
//       } else {
//         matchedFallback = {
//           text: `Aapke ${location.district} ke mitti aur fasal ke aadhar par sahi khad aur sinchai ka chayan karein. Adhik jankari ke liye fasal ka naam aur vartaman sthiti batayein.`,
//           translation: `Select proper fertilizer dressings and irrigation schedules in ${location.district} based on soil testing report. Please provide the crop name and stage for specific agronomic directions.`
//         };
//       }

//       setTimeout(() => {
//         setChatHistory((prev) => [
//           ...prev,
//           {
//             role: "model",
//             text: `${matchedFallback.text}\n\n${matchedFallback.translation}`
//           }
//         ]);
//         setIsAiThinking(false);
//       }, 500);
//     }
//   };

//   const getDynamicWelcome = () => {
//     const mainText = GREETINGS[selectedLang].text;
//     const subText = GREETINGS[selectedLang].translation;
//     const locString = ` [Active context: ${location.district}, ${location.state} • Soil: ${location.soilData?.soilType || "Clay Loam"} • pH: ${location.soilData?.pH || "7.2"}]`;
//     return {
//       text: mainText + locString,
//       translation: subText
//     };
//   };

//   const welcome = getDynamicWelcome();

//   return (
//     <div className="space-y-4 animate-fadeIn antialiased max-w-5xl mx-auto w-full p-4 flex flex-col min-h-[calc(100vh-80px)] font-['Plus_Jakarta_Sans',_sans-serif]">

//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-150">
//         <div className="text-left">
//           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <span>AI Agriculture Assistant</span>
//             <span className="text-gray-300 font-light text-xl">|</span>
//             <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
//               कृषि एआई सहायक
//             </span>
//           </h1>
//           <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
//             Realtime conversational agronomist providing tailored soil, crop, and crop care treatments.
//           </p>
//         </div>
//       </div>

//       {/* 1. Location Selector Card */}
//       <LocationSelector value={location} onChange={handleLocationChange} />

//       {/* Main Chat Workspace Card */}
//       <div className="bg-white border border-gray-200/60 rounded-2xl flex-1 flex flex-col justify-between shadow-sm min-h-[500px] overflow-hidden">
//         {/* Status Header */}
//         <div className="text-[9px] font-black tracking-widest text-gray-400 p-3 bg-gray-50/50 border-b border-gray-100 flex justify-between uppercase">
//           <span className="flex items-center gap-1.5">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
//             AI Assistant Active
//           </span>
//           <span>Multilingual Mode</span>
//         </div>

//         {/* Message Feed Window */}
//         <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px]">
//           {/* Default initial welcome bot message */}
//           <div className="flex items-start gap-3 text-left">
//             <div className="w-9 h-9 rounded-full bg-[#31572c]/8 flex items-center justify-center text-[#31572c] shrink-0">
//               <Leaf className="w-4 h-4" />
//             </div>
//             <div className="bg-white border border-gray-200/60 rounded-2xl rounded-tl-sm p-4 max-w-2xl shadow-sm space-y-1">
//               <h4 className="text-xs font-bold text-[#132a13] leading-relaxed">
//                 {welcome.text}
//               </h4>
//               <p className="text-gray-450 text-[11px] italic font-medium">
//                 {welcome.translation}
//               </p>
//             </div>
//           </div>

//           {/* User & AI conversational message streams */}
//           {chatHistory.map((chat, idx) => (
//             <div
//               key={idx}
//               className={`flex flex-col space-y-2 ${
//                 chat.role === "user" ? "items-end" : "items-start"
//               }`}
//             >
//               <div
//                 className={`p-3.5 rounded-2xl max-w-xl text-xs font-bold shadow-sm border text-left leading-relaxed ${
//                   chat.role === "user"
//                     ? "bg-[#31572c] text-white border-[#31572c]"
//                     : "bg-gray-50 text-gray-900 border-gray-200/60"
//                 }`}
//               >
//                 {chat.text}
//               </div>
//             </div>
//           ))}

//           {/* AI Thinking/Typing Indicator */}
//           {isAiThinking && (
//             <div className="flex items-start gap-3 text-left animate-pulse">
//               <div className="w-9 h-9 rounded-full bg-[#31572c]/8 flex items-center justify-center text-[#31572c] shrink-0">
//                 <Leaf className="w-4 h-4 animate-spin" />
//               </div>
//               <div className="bg-gray-50 border border-gray-200/60 rounded-2xl rounded-tl-sm p-3.5 max-w-2xl shadow-sm flex items-center gap-1.5">
//                 <span className="w-2 h-2 rounded-full bg-[#31572c] animate-bounce" style={{ animationDelay: "0ms" }}></span>
//                 <span className="w-2 h-2 rounded-full bg-[#31572c] animate-bounce" style={{ animationDelay: "150ms" }}></span>
//                 <span className="w-2 h-2 rounded-full bg-[#31572c] animate-bounce" style={{ animationDelay: "300ms" }}></span>
//                 <span className="text-[10px] font-black text-gray-500 ml-1.5 uppercase tracking-wider">Krishi Saathi typing...</span>
//               </div>
//             </div>
//           )}

//           <div ref={feedEndRef} />
//         </div>

//         {/* Pinned Bottom Message Input Controls Bar */}
//         <div className="p-4 border-t border-gray-100 bg-white space-y-3">
//           {/* Quick Suggestions capsules */}
//           <div className="flex flex-wrap items-center gap-2 pb-1">
//             {[
//               "Irrigation schedule for wheat",
//               "NPK ratio for rice in July",
//               "Pest alert near me"
//             ].map((suggestion, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 disabled={isAiThinking}
//                 onClick={() => handleSendMessage(null, suggestion)}
//                 className={`border border-[#31572c]/10 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm text-left ${
//                   isAiThinking
//                     ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
//                     : "bg-[#31572c]/5 text-[#31572c] hover:bg-[#31572c]/10"
//                 }`}
//               >
//                 {suggestion}
//               </button>
//             ))}
//           </div>

//           {/* Form controls dock */}
//           <form onSubmit={handleSendMessage} className="flex items-center gap-3">
//             <button
//               type="button"
//               disabled={isAiThinking}
//               className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer shrink-0 border-none disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Mic className="w-4 h-4" />
//             </button>

//             <div className={`flex-1 flex items-center relative gap-2 border rounded-2xl px-4 h-12 transition-all ${
//               isAiThinking
//                 ? "bg-gray-100 border-gray-200"
//                 : "bg-gray-50 border-gray-200/80 focus-within:border-[#31572c] focus-within:bg-white"
//             }`}>
//               <input
//                 type="text"
//                 value={inputMessage}
//                 disabled={isAiThinking}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 placeholder={isAiThinking ? "Waiting for response..." : "Apna sawaal poochhein... (Ask your question...)"}
//                 className="text-xs font-medium text-gray-800 bg-transparent w-full focus:outline-none placeholder-gray-400 h-full border-none pr-8 disabled:cursor-not-allowed"
//               />
//               <button
//                 type="submit"
//                 disabled={isAiThinking || !inputMessage.trim()}
//                 className="w-8 h-8 rounded-lg bg-[#31572c] text-white hover:bg-[#132a13] disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center cursor-pointer transition-colors shadow-sm absolute right-2 border-none disabled:cursor-not-allowed"
//               >
//                 <SendHorizontal className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Mic,
  SendHorizontal,
  Leaf,
  User,
  Users,
  TrendingUp,
  Factory,
  FlaskConical,
  Building2,
  Sprout,
} from "lucide-react";
import { generateContent } from "../../../services/gemini/client";
import LocationSelector from "../../../components/LocationSelector";
import { getSoilDataByPincode } from "../../../services/locationService";
import { useRole } from "../../../context/RoleContext";

// Role-specific system prompts
const ROLE_SYSTEM_PROMPTS = {
  farmer: `You are Krishi Saathi, an AI agricultural advisor for Indian FARMERS.
    - Respond in Romanized Hindi (Hinglish) followed by English translation
    - Focus on: crop advisory, disease detection, irrigation, government schemes
    - Give specific quantities, timing, and locations
    - Keep responses short (max 3-4 sentences)`,

  fpo: `You are an AI advisor for FPO (Farmer Producer Organization) MANAGERS.
    - Focus on: collective crop planning, bulk procurement, member monitoring, marketing
    - Provide aggregate-level recommendations for groups of farmers
    - Include volume discounts, collective bargaining tips, scheme facilitation`,

  trader: `You are a Commodity Market Analyst for TRADERS.
    - Focus on: price forecasting, arbitrage opportunities, arrival predictions
    - Include confidence levels and specific data sources
    - Never recommend specific entry/exit prices (compliance)
    - Use mandi terminology (quintal, metric ton, bag)`,

  procurement: `You are a Procurement Intelligence advisor for PROCUREMENT MANAGERS.
    - Focus on: sourcing optimization, supply forecasting, quality prediction
    - Include region rankings, logistics costs, lead times
    - Provide supplier performance insights and risk assessments`,

  researcher: `You are a Research Assistant for agricultural RESEARCHERS.
    - Focus on: paper summarization, research Q&A, citation generation
    - Provide citations with page numbers when possible
    - Highlight contradictions and research gaps
    - Use academic but accessible language`,

  government: `You are a Policy Intelligence advisor for GOVERNMENT OFFICIALS.
    - Focus on: crop area estimation, scheme adoption tracking, disaster assessment
    - Provide district-level analysis and policy recommendations
    - Include data confidence levels and actionable insights`,

  admin: `You are a Platform Analytics advisor for ADMINISTRATORS.
    - Focus on: platform metrics, AI performance, user engagement
    - Provide operational insights and optimization recommendations`,
};

// Role-specific welcome messages
const ROLE_WELCOMES = {
  farmer: {
    text: "Namaskar! Main aapka AI Krishi Saathi hoon. Apni fasal, bimari, ya sarkari yojnaon ke baare mein poochhein.",
    translation:
      "Hello! I am your AI Krishi Saathi. Ask me about your crops, diseases, or government schemes.",
  },
  fpo: {
    text: "Namaskar! Main aapka FPO AI Advisor hoon. Main aapki member farms, collective planning, aur bulk procurement mein madad kar sakta hoon.",
    translation:
      "Hello! I am your FPO AI Advisor. I can help with member farms, collective planning, and bulk procurement.",
  },
  trader: {
    text: "Namaskar! Main aapka Commodity Market Analyst hoon. Main price forecasts, arbitrage opportunities, aur arrival predictions provide kar sakta hoon.",
    translation:
      "Hello! I am your Commodity Market Analyst. I can provide price forecasts, arbitrage opportunities, and arrival predictions.",
  },
  procurement: {
    text: "Namaskar! Main aapka Procurement Intelligence Advisor hoon. Main sourcing optimization, supply forecasting, aur quality prediction mein madad kar sakta hoon.",
    translation:
      "Hello! I am your Procurement Intelligence Advisor. I can help with sourcing optimization, supply forecasting, and quality prediction.",
  },
  researcher: {
    text: "Namaskar! Main aapka Research Assistant hoon. Main research papers summarize kar sakta hoon, Q&A kar sakta hoon, aur citations generate kar sakta hoon.",
    translation:
      "Hello! I am your Research Assistant. I can summarize research papers, answer questions, and generate citations.",
  },
  government: {
    text: "Namaskar! Main aapka Policy Intelligence Advisor hoon. Main crop estimation, scheme tracking, aur disaster assessment mein madad kar sakta hoon.",
    translation:
      "Hello! I am your Policy Intelligence Advisor. I can help with crop estimation, scheme tracking, and disaster assessment.",
  },
  admin: {
    text: "Namaskar! Main aapka Platform Analytics Advisor hoon. Main platform metrics, AI performance, aur user engagement insights provide kar sakta hoon.",
    translation:
      "Hello! I am your Platform Analytics Advisor. I can provide platform metrics, AI performance, and user engagement insights.",
  },
};

// Role icons for chat header
const RoleIcon = ({ role }) => {
  const icons = {
    farmer: <Sprout className="w-4 h-4" />,
    fpo: <Users className="w-4 h-4" />,
    trader: <TrendingUp className="w-4 h-4" />,
    procurement: <Factory className="w-4 h-4" />,
    researcher: <FlaskConical className="w-4 h-4" />,
    government: <Building2 className="w-4 h-4" />,
    admin: <User className="w-4 h-4" />,
  };
  return icons[role] || <Sprout className="w-4 h-4" />;
};

export default function AiAssistant() {
  const { activeRole, roleConfig } = useRole();
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });
  const feedEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiThinking]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Get role-specific system prompt
  const getSystemPrompt = () => {
    const basePrompt =
      ROLE_SYSTEM_PROMPTS[activeRole] || ROLE_SYSTEM_PROMPTS.farmer;
    return `${basePrompt}
    
    Current context:
    - User Role: ${roleConfig?.label || "Farmer"}
    - Location: ${location.district}, ${location.state} (Pincode: ${location.pincode})
    - Soil: ${location.soilData?.soilType || "Clay Loam"}, pH: ${location.soilData?.pH || "7.2"}
    - NPK: N-${location.soilData?.nitrogen || "180"}, P-${location.soilData?.phosphorus || "45"}, K-${location.soilData?.potassium || "35"} kg/ha
    
    Language preference: ${selectedLang}
    Respond appropriately for a ${roleConfig?.label || "farmer"} user.`;
  };

  // Role-specific fallback responses when API fails
  const getRoleFallback = (query, role, locationData) => {
    const lowerQuery = query.toLowerCase();

    const fallbacks = {
      farmer: () => {
        if (lowerQuery.includes("wheat") || lowerQuery.includes("gehun")) {
          return {
            text: `Gehun (Wheat) ke liye ${locationData.district} mein NPK 120:60:40 kg/hectare. Pehli sinchai CRI stage par karein.`,
            translation: `For Wheat in ${locationData.district}, apply NPK 120:60:40 kg/hectare. First irrigation at CRI stage.`,
          };
        }
        if (lowerQuery.includes("scheme") || lowerQuery.includes("yojna")) {
          return {
            text: `Aapke liye PM-KISAN (₹6000/saal) aur PMFBY (crop insurance) eligible hain. Kya aap apply karna chahenge?`,
            translation: `You are eligible for PM-KISAN (₹6000/year) and PMFBY crop insurance. Would you like to apply?`,
          };
        }
        return {
          text: `Aapki ${locationData.district} ki mitti ke liye regular soil test karein. Kya aap kisi specific fasal ke baare mein janna chahte hain?`,
          translation: `For your ${locationData.district} soil, get regular soil testing. Any specific crop you want to know about?`,
        };
      },

      fpo: () => {
        return {
          text: `Aapke FPO ke liye collective planning recommended hai. Kya aap member farm monitoring, bulk procurement, ya collective marketing ke baare mein janna chahenge?`,
          translation: `For your FPO, collective planning is recommended. Would you like to know about member monitoring, bulk procurement, or collective marketing?`,
        };
      },

      trader: () => {
        return {
          text: `${locationData.state} mandiyon mein commodity prices stable hain. Kya aap kisi specific commodity ke liye price forecast chahte hain?`,
          translation: `Commodity prices are stable in ${locationData.state} mandis. Want a price forecast for a specific commodity?`,
        };
      },

      procurement: () => {
        return {
          text: `Sourcing ke liye ${locationData.state} ke north districts better hain. Kya aap supply forecast ya quality prediction chahte hain?`,
          translation: `North districts of ${locationData.state} are better for sourcing. Want supply forecast or quality prediction?`,
        };
      },

      researcher: () => {
        return {
          text: `Main research papers summarize kar sakta hoon. Kripya ek PDF upload karein ya research topic batayein.`,
          translation: `I can summarize research papers. Please upload a PDF or tell me your research topic.`,
        };
      },

      government: () => {
        return {
          text: `${locationData.district} mein crop area estimation ke liye satellite data available hai. Kya aap scheme adoption ya disaster assessment dekhna chahenge?`,
          translation: `Satellite data is available for crop area estimation in ${locationData.district}. Want to see scheme adoption or disaster assessment?`,
        };
      },

      admin: () => {
        return {
          text: `Platform analytics dashboard ready. Total queries, user engagement, aur AI accuracy metrics available hain.`,
          translation: `Platform analytics dashboard ready. Total queries, user engagement, and AI accuracy metrics available.`,
        };
      },
    };

    const getFallback = fallbacks[role] || fallbacks.farmer;
    return getFallback();
  };

  const handleSendMessage = async (e, directText = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const messageToSend = directText || inputMessage;
    const trimmed = messageToSend.trim();
    if (!trimmed || isAiThinking) return;

    // Add user message
    const userMsg = { role: "user", text: trimmed };
    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsAiThinking(true);

    try {
      const systemPrompt = getSystemPrompt();

      const responseText = await generateContent(trimmed, {
        model: "gemini-3.1-flash-lite",
        temperature: 0.45,
        maxOutputTokens: 500,
        system_instruction: systemPrompt,
      });

      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: responseText.trim() },
      ]);
      setIsAiThinking(false);
    } catch (err) {
      console.warn(
        `AI Assistant (${activeRole} role) falling back to role-specific database:`,
        err,
      );

      const fallback = getRoleFallback(trimmed, activeRole, location);

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "model",
            text: `${fallback.text}\n\n${fallback.translation}\n\n_[Response mode: Offline Knowledge Base | Role: ${roleConfig?.label}]_`,
          },
        ]);
        setIsAiThinking(false);
      }, 500);
    }
  };

  const getDynamicWelcome = () => {
    const roleWelcome = ROLE_WELCOMES[activeRole] || ROLE_WELCOMES.farmer;
    const locString = ` [ðŸ“ ${location.district}, ${location.state} • ${location.soilData?.soilType || "Clay Loam"} • pH: ${location.soilData?.pH || "7.2"}]`;
    return {
      text: roleWelcome.text + locString,
      translation: roleWelcome.translation,
      role: activeRole,
      roleLabel: roleConfig?.label,
    };
  };

  const welcome = getDynamicWelcome();

  // Role-specific suggestion pills
  const getSuggestions = () => {
    const suggestions = {
      farmer: [
        "Irrigation schedule for wheat",
        "NPK ratio for rice",
        "Pest alert near me",
        "Government schemes",
      ],
      fpo: [
        "Member farm monitoring",
        "Collective crop planning",
        "Bulk input procurement",
        "Best mandi for selling",
      ],
      trader: [
        "Wheat price forecast 7 days",
        "Arbitrage opportunity",
        "Arrival prediction",
        "Market sentiment",
      ],
      procurement: [
        "Best state for maize",
        "Supply forecast 90 days",
        "Quality prediction",
        "Supplier scorecard",
      ],
      researcher: [
        "Summarize research paper",
        "Compare two papers",
        "Generate citation",
        "Find research gaps",
      ],
      government: [
        "Crop area estimation",
        "Scheme adoption tracking",
        "Disaster assessment",
        "Price monitoring",
      ],
      admin: [
        "Platform analytics",
        "AI accuracy metrics",
        "User engagement",
        "Cost optimization",
      ],
    };
    return suggestions[activeRole] || suggestions.farmer;
  };

  return (
    <div className="space-y-4 animate-fadeIn antialiased max-w-5xl mx-auto w-full p-4 flex flex-col min-h-[calc(100vh-80px)] font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Page Header with Role Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-150">
        <div className="text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              AI Agriculture Assistant
            </h1>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-xs md:text-sm bg-[#31572c]/8 px-2.5 py-0.5 rounded-md">
              कृषि एआई सहायक
            </span>
            {/* Role Badge */}
            <span
              className={`ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig?.badgeColor || "bg-gray-100 text-gray-800"}`}
            >
              <RoleIcon role={activeRole} />
              {roleConfig?.label}
            </span>
          </div>
          <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1">
            {roleConfig?.description}
          </p>
        </div>
      </div>

      {/* Location Selector Card */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Main Chat Workspace Card */}
      <div className="bg-white border border-gray-200/60 rounded-2xl flex-1 flex flex-col justify-between shadow-sm min-h-[500px] overflow-hidden">
        {/* Status Header */}
        <div className="text-[9px] font-black tracking-widest text-gray-400 p-3 bg-gray-50/50 border-b border-gray-100 flex justify-between uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            AI Assistant Active | {roleConfig?.label} Mode
          </span>
          <span>Multilingual | {selectedLang}</span>
        </div>

        {/* Message Feed Window */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px]">
          {/* Welcome message */}
          <div className="flex items-start gap-3 text-left">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${roleConfig?.badgeColor || "bg-gray-100"}`}
            >
              <RoleIcon role={activeRole} />
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

          {/* Chat history */}
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

          {/* Typing indicator */}
          {isAiThinking && (
            <div className="flex items-start gap-3 text-left animate-pulse">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${roleConfig?.badgeColor || "bg-gray-100"}`}
              >
                <RoleIcon role={activeRole} />
              </div>
              <div className="bg-gray-50 border border-gray-200/60 rounded-2xl rounded-tl-sm p-3.5 max-w-2xl shadow-sm flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-[#31572c] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#31572c] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-[#31572c] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
                <span className="text-[10px] font-black text-gray-500 ml-1.5 uppercase tracking-wider">
                  {roleConfig?.label} AI typing...
                </span>
              </div>
            </div>
          )}

          <div ref={feedEndRef} />
        </div>

        {/* Input Controls Bar */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-3">
          {/* Role-specific suggestion pills */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {getSuggestions().map((suggestion, index) => (
              <button
                key={index}
                type="button"
                disabled={isAiThinking}
                onClick={() => handleSendMessage(null, suggestion)}
                className={`border border-[#31572c]/10 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm text-left ${
                  isAiThinking
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                    : "bg-[#31572c]/5 text-[#31572c] hover:bg-[#31572c]/10"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3"
          >
            <button
              type="button"
              disabled={isAiThinking}
              className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200/80 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer shrink-0 border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-4 h-4" />
            </button>

            <div
              className={`flex-1 flex items-center relative gap-2 border rounded-2xl px-4 h-12 transition-all ${
                isAiThinking
                  ? "bg-gray-100 border-gray-200"
                  : "bg-gray-50 border-gray-200/80 focus-within:border-[#31572c] focus-within:bg-white"
              }`}
            >
              <input
                type="text"
                value={inputMessage}
                disabled={isAiThinking}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isAiThinking
                    ? "Waiting for response..."
                    : `Ask your ${roleConfig?.label || "farming"} question...`
                }
                className="text-xs font-medium text-gray-800 bg-transparent w-full focus:outline-none placeholder-gray-400 h-full border-none pr-8 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isAiThinking || !inputMessage.trim()}
                className="w-8 h-8 rounded-lg bg-[#31572c] text-white hover:bg-[#132a13] disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center cursor-pointer transition-colors shadow-sm absolute right-2 border-none disabled:cursor-not-allowed"
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
