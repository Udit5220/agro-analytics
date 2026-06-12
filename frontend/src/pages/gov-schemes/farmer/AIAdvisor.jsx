// src/pages/gov-schemes/farmer/AIAdvisor.jsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Calculator,
  ShieldCheck,
  Loader,
  X,
  PlusCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Trash2,
} from "lucide-react";
import { profileApi } from "../../../services/apiService";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { generateContent } from "../../../services/gemini/client";

export default function AIAdvisor() {
  const { farmerProfile } = govtSchemeData;
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showContext, setShowContext] = useState(false); // Default open for premium desktop layout

  // Dynamic custom state values for the inline calculator/widgets
  const [irrigationCost, setIrrigationCost] = useState(45000);
  const [casteCategory, setCasteCategory] = useState("SC");

  // Suggestion chips
  const suggestedChips = [
    {
      label: "Why is PM Kisan delayed?",
      type: "text",
      query: "Why is my PM Kisan payment delayed?",
    },
    {
      label: "How to link Aadhaar?",
      type: "text",
      query: "How to link Aadhaar with my bank account?",
    },
    {
      label: "Calculate subsidy for drip irrigation",
      type: "widget",
      widgetType: "roi_calc",
    },
    {
      label: "Check my PMFBY claim",
      type: "widget",
      widgetType: "claim_tracker",
    },
  ];

  // Fetch active profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await profileApi.getProfile();
        if (res && res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  const activeProfile = profile
    ? {
        name: profile.name,
        location: `${profile.district || "Sonipat"}, ${profile.state || "Haryana"}`,
        landSize: profile.landSize || farmerProfile.landSize,
        crops: profile.crops || farmerProfile.crops,
        irrigation:
          profile.irrigationMethod || farmerProfile.irrigation || "Drip",
        category: profile.casteCategory
          ? [profile.casteCategory]
          : ["SC", "Small Farmer"],
        income: profile.annualIncome
          ? `₹${(profile.annualIncome / 100000).toFixed(1)}L`
          : farmerProfile.annualIncome,
        aadhaarSeeding: profile.aadhaarSeedingStatus || "seeded",
        bankSeeding: profile.bankSeedingStatus || "seeded",
      }
    : {
        name: farmerProfile.name,
        location: farmerProfile.location,
        landSize: farmerProfile.landSize,
        crops: farmerProfile.crops,
        irrigation: farmerProfile.irrigation,
        category: farmerProfile.category,
        income: farmerProfile.annualIncome,
        aadhaarSeeding: "seeded",
        bankSeeding: "seeded",
      };

  // Initial welcome greeting
  useEffect(() => {
    const cropsText = activeProfile.crops.join(", ");
    const initialMsg = {
      id: "welcome-msg",
      type: "bot",
      content: `Namaste ${activeProfile.name.split(" ")[0]} ji! I have loaded and verified your local agricultural profile:
• **Location:** ${activeProfile.location}
• **Landholdings:** ${activeProfile.landSize} Acres
• **Active Crops:** ${cropsText}

How can I assist you with government scheme outlays today? You can type a question below or tap any suggested calculations.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([initialMsg]);
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text, widgetType = null) => {
    if (!text && !widgetType) return;

    // User Message
    const userMsg = {
      id: Date.now(),
      type: "user",
      content:
        widgetType === "roi_calc"
          ? "Calculate subsidy for drip irrigation"
          : widgetType === "claim_tracker"
            ? "Check my PMFBY claim status"
            : text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      if (widgetType) {
        // Handle widget generation responses
        setTimeout(() => {
          const botMsg = {
            id: Date.now() + 1,
            type: "bot",
            widget: widgetType,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
        }, 800);
        return;
      }

      // Check simulated questions
      const lowerQuery = text.toLowerCase();
      let answer = "";

      if (lowerQuery.includes("pm kisan") && lowerQuery.includes("delay")) {
        answer = `Your PM Kisan installment Worth **₹2,000** is scheduled for release on **June 20, 2026**. 

Based on official central guidelines:
1. **e-KYC Status:** Completed ✓
2. **Land Seeding Status:** Completed ✓
3. **Aadhaar-Bank Seeding:** Active ✓

No delays are expected. If you experience verification issues, please visit your local Block Agriculture Office or Common Service Centre (CSC) in ${activeProfile.location.split(",")[0]}.`;
      } else if (
        lowerQuery.includes("aadhaar") &&
        lowerQuery.includes("bank")
      ) {
        answer = `To complete Aadhaar Seeding for direct bank transfers (DBT):
1. **Visit bank branch:** Take a physical copy of your Aadhaar card and passbook.
2. **Submit NPCI Seeding Form:** Request the accounts desk executive to link your bank account to Aadhaar for NPCI mapping.
3. **Verification:** The bank updates mapping in 48 hours. Your dashboard score here will auto-sync on the next refresh.`;
      }

      if (answer) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              type: "bot",
              content: answer,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
          setIsTyping(false);
        }, 800);
        return;
      }

      // Fallback: Query Gemini API
      const context = `
Farmer Context:
- Name: ${activeProfile.name}
- Location: ${activeProfile.location}
- Land size: ${activeProfile.landSize} Acres
- Crops: ${activeProfile.crops.join(", ")}
- Category: ${activeProfile.category.join(", ")}
- Income: ${activeProfile.income}
`;

      const systemPrompt = `You are the AgroIndia AI specialist. Help the farmer solve queries regarding PM Kisan, PMFBY, KCC, Kusum solar pump, and state grants. Use simple, direct, helpful formatting with bullet points. Context: ${context}`;
      const res = await generateContent(text, {
        system_instruction: systemPrompt,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content:
            res ||
            "I'm sorry, I couldn't process that. Please try another query or click one of the suggested chips.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error("AI chat query error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content:
            "System connection timeout. Please check back later or contact the agricultural helpline: 1800-180-1551.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    const cropsText = activeProfile.crops.join(", ");
    setMessages([
      {
        id: "welcome-msg-reset",
        type: "bot",
        content: `Chat history cleared. Live profile context is loaded for Suresh Kumar (${activeProfile.location}). How can I assist you with government scheme outlays today?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // ROI Calculator Calculations
  const calculateSubsidy = () => {
    const baseSubsidy = 55; // PMKSY baseline 55%
    const scBonus = casteCategory === "SC" ? 30 : 0; // SC extra subsidy
    const totalPercent = Math.min(baseSubsidy + scBonus, 85); // cap at 85%
    const govShare = (irrigationCost * totalPercent) / 100;
    const farmerShare = irrigationCost - govShare;
    const payback = (farmerShare / 18000).toFixed(1); // annual savings ₹18,000
    return { govShare, farmerShare, payback, totalPercent };
  };

  const { govShare, farmerShare, payback, totalPercent } = calculateSubsidy();

  return (
    <div className="flex h-full w-full bg-[#f4f7f0]/40 overflow-hidden font-sans animate-fadeIn">
      {/* Left Area - Chat Workspace */}
      <div className="flex-1 flex flex-col h-full bg-[#f4f7f0]/10 relative">
        {/* Chat Window Header */}
        <div className="bg-[#0F2E1F] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0 shadow-md z-10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#C5F547] flex items-center justify-center border border-white/10 relative">
              <Bot className="w-5 h-5" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#0F2E1F]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black tracking-wide uppercase">
                  AI Scheme Advisor
                </h1>
                <span className="bg-[#C5F547]/10 text-[#C5F547] text-[8.5px] font-extrabold px-1.5 py-0.5 rounded border border-[#C5F547]/20 uppercase">
                  Gemini AI
                </span>
              </div>
              <p className="text-[10px] text-white/50 font-semibold mt-0.5">
                Profile loaded: {activeProfile.name} ({activeProfile.location})
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowContext(!showContext)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                showContext
                  ? "bg-[#C5F547] text-[#0F2E1F] border-[#C5F547]"
                  : "bg-white/5 text-white/95 border-white/10 hover:bg-white/10"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {showContext ? "Hide Details" : "Show Profile Details"}
              </span>
            </button>
          </div>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#0F2E1F]/5 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3.5 ${m.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.type === "bot" && (
                <div className="w-8 h-8 rounded-xl bg-[#0F2E1F] text-[#C5F547] flex items-center justify-center shrink-0 border border-white/10">
                  <Bot className="w-4.5 h-4.5" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm relative ${
                  m.type === "user"
                    ? "bg-[#0F2E1F] text-white rounded-tr-none border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    : "bg-white border border-gray-150 text-gray-800 rounded-tl-none"
                }`}
              >
                {/* Standard Text Message */}
                {m.content && (
                  <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap font-semibold">
                    {m.content}
                  </div>
                )}

                {/* ROI Calculator Inline Widget */}
                {m.widget === "roi_calc" && (
                  <div className="space-y-4 w-72 sm:w-80 text-gray-800">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#0F2E1F]">
                      <Calculator className="w-4 h-4 text-[#2d5a3d]" />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        PMKSY Subsidy Estimator
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                          System Outlay Cost: ₹{irrigationCost.toLocaleString()}
                        </label>
                        <input
                          type="range"
                          min="30000"
                          max="100000"
                          step="5000"
                          value={irrigationCost}
                          onChange={(e) =>
                            setIrrigationCost(Number(e.target.value))
                          }
                          className="w-full accent-[#2d5a3d] cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-extrabold mt-0.5">
                          <span>₹30k</span>
                          <span>₹65k</span>
                          <span>₹100k</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                        <div>
                          <span className="text-[9px] text-gray-450 uppercase tracking-wider block mb-1">
                            Caste Slabs
                          </span>
                          <select
                            value={casteCategory}
                            onChange={(e) => setCasteCategory(e.target.value)}
                            className="p-2 border border-gray-250 rounded-lg w-full bg-white text-gray-700 font-bold"
                          >
                            <option value="General">General (55%)</option>
                            <option value="SC">SC / ST (85%)</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-450 uppercase tracking-wider block mb-1">
                            Est. Subsidy
                          </span>
                          <span className="text-green-700 font-black text-sm block pt-1.5">
                            {totalPercent}% Slab
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#f4f7f0]/60 rounded-xl text-[11px] space-y-2 border border-brand-accent/60">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-500">
                            Government Share:
                          </span>
                          <span className="text-[#0F2E1F]">
                            ₹{govShare.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-500">
                            Farmer Net Share:
                          </span>
                          <span className="text-gray-900">
                            ₹{farmerShare.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-gray-200 font-extrabold text-[#2d5a3d]">
                          <span>Est. Payback Sowing:</span>
                          <span>{payback} years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claim Tracker Inline Widget */}
                {m.widget === "claim_tracker" && (
                  <div className="space-y-4 w-72 sm:w-80 text-gray-800">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#0F2E1F]">
                      <ShieldCheck className="w-4 h-4 text-[#2d5a3d]" />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        PMFBY Insurance Claims
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {govtSchemeData.cropInsuranceData.claimTracker.map(
                        (c) => (
                          <div
                            key={c.id}
                            className="p-3 border border-gray-150 rounded-xl bg-gray-50/70 text-xs"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-extrabold text-[#0F2E1F]">
                                {c.crop} ({c.reason})
                              </span>
                              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 uppercase">
                                {c.status}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                              <span>Sowing: {c.appliedDate}</span>
                              <span className="font-extrabold text-gray-800">
                                {c.claimAmount}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <p
                  className={`text-[9px] font-bold mt-2 text-right ${m.type === "user" ? "text-white/50" : "text-gray-400"}`}
                >
                  {m.timestamp}
                </p>
              </div>

              {m.type === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#C5F547] text-[#0F2E1F] flex items-center justify-center shrink-0 border border-[#C5F547]/20 shadow-sm font-bold text-xs uppercase">
                  {activeProfile.name[0]}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-[#0F2E1F] text-[#C5F547] flex items-center justify-center shrink-0 border border-white/10">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="bg-white border border-gray-150 rounded-2xl px-4 py-3 shadow-sm flex items-center">
                <Loader className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 pb-2.5 shrink-0 overflow-x-auto hide-scrollbar bg-[#0F2E1F]/5 pt-2">
          <div className="flex flex-nowrap md:flex-wrap gap-2 md:justify-center">
            {suggestedChips.map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSendMessage(chip.query, chip.widgetType)}
                className="text-[10.5px] px-3.5 py-2 rounded-full border border-[#2d5a3d]/20 bg-white hover:bg-[#E8F5C0] hover:text-[#0F2E1F] hover:border-[#C5F547] transition-all duration-200 font-bold text-gray-600 shadow-sm shrink-0 active:scale-95 cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="border-t border-gray-150 bg-white p-4 shrink-0 shadow-md">
          <div className="flex gap-2.5 max-w-3xl mx-auto items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleSendMessage(inputValue)
              }
              placeholder="Ask anything about government schemes, eligibility, or budgets..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d] text-xs font-semibold"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-full transition shrink-0 active:scale-95 cursor-pointer ${
                inputValue.trim()
                  ? "bg-[#0F2E1F] text-white hover:bg-[#1A3A2A]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Area - Context Sidebar Panel */}
      {showContext && (
        <div className="fixed md:static inset-y-0 right-0 z-50 md:z-auto w-72 bg-white border-l border-gray-150 overflow-y-auto shrink-0 shadow-2xl md:shadow-none animate-fadeIn flex flex-col justify-between">
          <div className="p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[#0F2E1F]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2d5a3d]" />
                <h3 className="font-extrabold text-xs uppercase tracking-wider">
                  Farmer Profile Context
                </h3>
              </div>
              <button
                onClick={() => setShowContext(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-650 transition md:hidden"
                title="Close Profile Panel"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Profile Card Summary */}
            <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0F2E1F] text-[#C5F547] flex items-center justify-center shrink-0 shadow-xs border border-white/5 font-bold uppercase text-[11px]">
                  {activeProfile.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">
                    {activeProfile.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                    {activeProfile.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-250/60 pt-2.5 font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Landholdings:</span>
                  <span className="text-gray-900 font-bold">
                    {activeProfile.landSize} Acres
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Crops Grown:</span>
                  <span
                    className="text-gray-900 font-bold max-w-[120px] truncate"
                    title={activeProfile.crops.join(", ")}
                  >
                    {activeProfile.crops.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Irrigation:</span>
                  <span className="text-gray-900 font-bold">
                    {activeProfile.irrigation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-gray-900 font-bold">
                    {activeProfile.category.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Income:</span>
                  <span className="text-gray-900 font-bold">
                    {activeProfile.income}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Centralized Agriculture Helplines Info Box */}
          <div className="p-5 border-t border-gray-150 bg-gray-50/50 space-y-2.5">
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">
              Official Portal Resources
            </span>
            <div className="space-y-1.5 text-[10px] text-gray-600 font-bold">
              <p>
                • Kisan Suvidha Helpline:{" "}
                <strong className="text-[#0F2E1F]">1800-180-1551</strong>
              </p>
              <p>
                • Central Portal:{" "}
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2d5a3d] underline"
                >
                  myscheme.gov.in
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
