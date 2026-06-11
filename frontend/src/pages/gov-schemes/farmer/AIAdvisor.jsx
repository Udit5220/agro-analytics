// src/pages/gov-schemes/farmer/AIAdvisor.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Calculator,
  ShieldCheck,
  ChevronRight,
  Loader,
  Calendar,
  AlertTriangle,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle,
  IndianRupee,
  Activity,
  X
} from "lucide-react";
import { profileApi } from "../../../services/apiService";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { generateContent } from "../../../services/gemini/client";

export default function AIAdvisor() {
  const { aiAdvisorData, farmerProfile } = govtSchemeData;
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showContext, setShowContext] = useState(false);

  // Dynamic custom state values for the inline calculator/widgets
  const [irrigationCost, setIrrigationCost] = useState(45000);
  const [casteCategory, setCasteCategory] = useState("SC");

  // Suggestion chips
  const suggestedChips = [
    { label: "Why is PM Kisan delayed?", type: "text", query: "Why is my PM Kisan payment delayed?" },
    { label: "How to link Aadhaar?", type: "text", query: "How to link Aadhaar with my bank account?" },
    { label: "Calculate subsidy for drip irrigation", type: "widget", widgetType: "roi_calc" },
    { label: "Check my PMFBY claim", type: "widget", widgetType: "claim_tracker" }
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

  const activeProfile = profile ? {
    name: profile.name,
    location: `${profile.district || 'Sonipat'}, ${profile.state || 'Haryana'}`,
    landSize: profile.landSize || farmerProfile.landSize,
    crops: profile.crops || farmerProfile.crops,
    irrigation: profile.irrigationMethod || farmerProfile.irrigation || "Drip",
    category: profile.casteCategory ? [profile.casteCategory] : ["SC", "Small Farmer"],
    income: profile.annualIncome ? `₹${(profile.annualIncome/100000).toFixed(1)}L` : farmerProfile.annualIncome,
    aadhaarSeeding: profile.aadhaarSeedingStatus || "seeded",
    bankSeeding: profile.bankSeedingStatus || "seeded"
  } : {
    name: farmerProfile.name,
    location: farmerProfile.location,
    landSize: farmerProfile.landSize,
    crops: farmerProfile.crops,
    irrigation: farmerProfile.irrigation,
    category: farmerProfile.category,
    income: farmerProfile.annualIncome,
    aadhaarSeeding: "seeded",
    bankSeeding: "seeded"
  };

  // Initial welcome greeting
  useEffect(() => {
    const cropsText = activeProfile.crops.join(", ");
    const initialMsg = {
      id: "welcome-msg",
      type: "bot",
      content: `Namaste ${activeProfile.name.split(" ")[0]} ji! I have analyzed your profile:
* **Location:** ${activeProfile.location}
* **Landholdings:** ${activeProfile.landSize} Acres
* **Active crops:** ${cropsText}
* **Aadhaar Status:** ${activeProfile.aadhaarSeeding === "seeded" ? "Linked ✓" : "Not Linked ✗"}

How can I help you today? You can ask a question or click any of the quick action chips below to calculate drip subsidies or track PMFBY claims.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
      content: widgetType === "roi_calc" 
        ? "Calculate subsidy for drip irrigation"
        : widgetType === "claim_tracker"
        ? "Check my PMFBY claim status"
        : text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      // Check simulated questions
      const lowerQuery = text.toLowerCase();
      let answer = "";

      if (lowerQuery.includes("pm kisan") && lowerQuery.includes("delay")) {
        answer = `Your PM Kisan installment Worth **₹2,000** is currently scheduled for release on **June 20, 2026**. 
Your profile checks indicate:
1. **e-KYC Status:** Completed ✓
2. **Land Seeding Status:** Completed ✓
3. **Aadhaar-Bank Seeding:** Active ✓

No delays are expected. If you experience issues, please visit your local Patwari or Common Service Centre (CSC) in ${activeProfile.location.split(",")[0]}.`;
      } else if (lowerQuery.includes("aadhaar") && lowerQuery.includes("bank")) {
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
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          ]);
          setIsTyping(false);
        }, 1000);
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
- Aadhaar status: ${activeProfile.aadhaarSeeding}
- Bank seeding: ${activeProfile.bankSeeding}
`;

      const systemPrompt = `You are AgroIndia AI government scheme specialist. Help the farmer solve queries regarding PM Kisan, PMFBY, KCC, Kusum solar pump, and state grants. Use simple, direct language. Context: ${context}`;
      const res = await generateContent(text, { system_instruction: systemPrompt });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: res || "I'm sorry, I couldn't process that. Please try another query or click one of the suggested chips.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error("AI chat query error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          content: "System connection timeout. Please check back later or contact the agricultural helpline: 1800-180-1551.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
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
    <div className="flex h-full w-full bg-[#f4f7f4]/40 overflow-hidden font-sans animate-fadeIn">
      {/* Left Area - Chat Space */}
      <div className="flex-1 flex flex-col h-full bg-[#f4f7f4]/10">
        {/* Chat Window Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2e4057]/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#28a745]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#2e4057]">AI Scheme Advisor</h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Gemini AI • Live Farmer Profile Loaded
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowContext(!showContext)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              showContext
                ? "bg-[#2e4057] text-white border-[#2e4057]"
                : "bg-white text-gray-700 border-gray-250 hover:bg-gray-50"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{showContext ? "Hide Context" : "Show Profile Context"}</span>
          </button>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.type === "user" ? "justify-end" : "justify-start"}`}>
              {m.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-[#2e4057]/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#28a745]" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                  m.type === "user"
                    ? "bg-[#2e4057] text-white border-[#2e4057]"
                    : "bg-white border-gray-150 text-gray-800"
                }`}
              >
                {/* Standard Text Message */}
                {m.content && (
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {m.content}
                  </div>
                )}

                {/* ROI Calculator Inline Widget */}
                {m.widget === "roi_calc" && (
                  <div className="space-y-4 w-72 sm:w-80">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#2e4057]">
                      <Calculator className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">PMKSY Subsidy & ROI Estimator</h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          System Cost: ₹{irrigationCost.toLocaleString()}
                        </label>
                        <input
                          type="range"
                          min="30000"
                          max="100000"
                          step="5000"
                          value={irrigationCost}
                          onChange={(e) => setIrrigationCost(Number(e.target.value))}
                          className="w-full accent-[#28a745]"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>₹30k</span>
                          <span>₹60k</span>
                          <span>₹100k</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Caste Tier</span>
                          <select
                            value={casteCategory}
                            onChange={(e) => setCasteCategory(e.target.value)}
                            className="p-1.5 border border-gray-200 rounded-lg w-full bg-white text-gray-700"
                          >
                            <option value="General">General (55%)</option>
                            <option value="SC">SC / ST (85%)</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Est. Subsidy</span>
                          <span className="text-emerald-700 font-bold block pt-1.5">{totalPercent}%</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#f4f7f4] rounded-xl text-xs space-y-1.5 border border-gray-150">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Government Share:</span>
                          <span className="font-bold text-[#2e4057]">₹{govShare.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Your Share:</span>
                          <span className="font-bold text-gray-900">₹{farmerShare.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-200">
                          <span className="text-gray-500">Payback Period:</span>
                          <span className="font-extrabold text-emerald-800">{payback} years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claim Tracker Inline Widget */}
                {m.widget === "claim_tracker" && (
                  <div className="space-y-4 w-72 sm:w-80">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#2e4057]">
                      <ShieldCheck className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">PMFBY active claims</h4>
                    </div>

                    <div className="space-y-3">
                      {govtSchemeData.cropInsuranceData.claimTracker.map((c) => (
                        <div key={c.id} className="p-3 border border-gray-150 rounded-xl space-y-1 bg-gray-50 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#2e4057]">{c.crop} ({c.reason})</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                              {c.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-500">
                            <span>Date: {c.appliedDate}</span>
                            <span className="font-bold text-gray-800">{c.claimAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className={`text-[10px] mt-2 ${m.type === "user" ? "text-white/60" : "text-gray-400"}`}>
                  {m.timestamp}
                </p>
              </div>
              {m.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-gray-655" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#2e4057]/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#28a745]" />
              </div>
              <div className="bg-white border border-gray-150 rounded-2xl px-4 py-3 shadow-sm">
                <Loader className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 pb-2 shrink-0 overflow-x-auto hide-scrollbar">
          <div className="flex flex-nowrap md:flex-wrap gap-2 md:justify-center">
            {suggestedChips.map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSendMessage(chip.query, chip.widgetType)}
                className="text-[11px] px-3.5 py-2 rounded-full border border-gray-200 bg-white hover:border-[#2e4057] hover:text-[#2e4057] transition font-bold text-gray-600 shadow-sm shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="border-t border-gray-200 bg-white p-4 shrink-0">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              placeholder="Ask me anything about government schemes..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#28a745] text-xs font-semibold"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-full transition shrink-0 ${
                inputValue.trim()
                  ? "bg-[#2e4057] text-white hover:bg-[#28a745]"
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
        <div className="fixed md:static inset-y-0 right-0 z-50 md:z-auto w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0 shadow-2xl md:shadow-none animate-fadeIn">
          <div className="p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[#2e4057]">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <h3 className="font-bold text-xs uppercase tracking-wider">Farmer Profile Context</h3>
              </div>
              <button
                onClick={() => setShowContext(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition md:hidden"
                title="Close Profile Panel"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Profile Card Summary */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2e4057]/10 flex items-center justify-center shrink-0">
                  <User className="w-4.5 h-4.5 text-[#28a745]" />
                </div>
                <div>
                  <p className="font-bold text-gray-850">{activeProfile.name}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{activeProfile.location}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-200/50 pt-2.5 font-semibold text-gray-650">
                <div className="flex justify-between">
                  <span>Landholdings:</span>
                  <span className="text-gray-900 font-bold">{activeProfile.landSize} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span>Crops Grown:</span>
                  <span className="text-gray-900 font-bold max-w-[120px] truncate" title={activeProfile.crops.join(", ")}>
                    {activeProfile.crops.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Irrigation:</span>
                  <span className="text-gray-900 font-bold">{activeProfile.irrigation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-gray-900 font-bold">{activeProfile.category.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Income:</span>
                  <span className="text-gray-900 font-bold">{activeProfile.income}</span>
                </div>
              </div>
            </div>

            {/* Verification Status parameters */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Integration Status</h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold p-2.5 bg-gray-50 border border-gray-150 rounded-xl">
                  <span>Aadhaar Seeding:</span>
                  {activeProfile.aadhaarSeeding === "seeded" ? (
                    <span className="text-emerald-700 font-bold">Linked ✓</span>
                  ) : (
                    <span className="text-amber-700 font-bold">Pending ✗</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs font-semibold p-2.5 bg-gray-50 border border-gray-150 rounded-xl">
                  <span>Bank DBT Status:</span>
                  {activeProfile.bankSeeding === "seeded" ? (
                    <span className="text-emerald-700 font-bold">Active ✓</span>
                  ) : (
                    <span className="text-amber-700 font-bold">Pending ✗</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
