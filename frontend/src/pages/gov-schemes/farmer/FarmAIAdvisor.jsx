// src/pages/farmer/FarmAIAdvisor.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Mic,
  User,
  Bot,
  ChevronRight,
  FileText,
  IndianRupee,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Shield,
  CreditCard,
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { generateContent } from "../../../services/gemini/client";
import { profileApi } from "../../../services/apiService";

const FarmAIAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const { aiAdvisorData, farmerProfile, kpiCards } = govtSchemeData;
  const { suggestedQuestions, sampleConversations, farmerContext } =
    aiAdvisorData;

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
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
    };
    fetchProfile();
  }, []);

  const activeProfile = profile ? {
    name: profile.name,
    location: profile.location || "Sonipat, Haryana",
    landSize: profile.farms?.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0) || farmerProfile.landSize,
    crops: profile.primaryCrops || profile.farms?.flatMap(f => f.crops.map(c => c.name)).filter((v, i, a) => a.indexOf(v) === i) || farmerProfile.crops,
    irrigation: profile.irrigation || farmerProfile.irrigation || "Drip",
    category: profile.category || farmerProfile.category || ["SC", "Small Farmer"],
    lastUpdated: new Date().toLocaleDateString("en-IN") + " (DB Live)"
  } : farmerProfile;

  useEffect(() => {
    const activeName = activeProfile.name || "Suresh Kumar";
    const activeDistrict = activeProfile.location ? activeProfile.location.split(',')[0]?.trim() || "Sonipat" : "Sonipat";
    const cropsText = activeProfile.crops.join(', ');
    
    const greetingMessage = {
      id: "welcome-msg",
      type: "bot",
      content: `Namaste ${activeName.split(' ')[0]} ji, it is good to see you are actively managing your farm. Given your location in ${activeDistrict}, your crop cycle (${cropsText}), and your status as an SC farmer, here are the critical tasks you should prioritize before **June 30th**:

### 1. PM-KISAN e-KYC & Land Seeding
To ensure your next installment of ₹2,000 is not delayed, please verify your status immediately.
*   **Action:** Check if your e-KYC is done and your land records are seeded on the [PM-KISAN portal](https://pmkisan.gov.in/).
*   **Why:** If your land records are not updated by the end of the month, your payment may be put on hold.
*   **How:** Visit your nearest **Common Service Centre (CSC)** or use the PM-KISAN mobile app.

### 2. Crop Insurance (PMFBY) Enrollment
Since you grow ${cropsText}, you are eligible for the **Pradhan Mantri Fasal Bima Yojana (PMFBY)**. 
*   **Action:** Check the notification for the Kharif season (Rice) in ${activeDistrict}. While windows vary, many banks require loan-linked insurance documentation to be finalized before the sowing season peaks.
*   **How:** Contact your bank branch or your local Agriculture Department office to ensure your crop details are correctly updated for the current season.

### 3. Haryana "Meri Fasal Mera Byora" (MFMB) Registration
This is the most important step for farmers in Haryana.
*   **Action:** Register your crops on the [fasal.haryana.gov.in](https://fasal.haryana.gov.in/) portal.
*   **Why:** Without this registration, you cannot sell your produce at Minimum Support Price (MSP) in the Mandi, nor can you avail of state-specific subsidies for seeds or fertilizers.
*   **Deadline:** The portal is currently open; completing this before June 30 ensures you are eligible for all state-level procurement benefits.

### 4. SC Category Subsidy Verification
As an SC farmer, you are eligible for higher subsidies on farm implements and drip irrigation maintenance.
*   **Action:** Visit the [Haryana Agriculture Department website](https://agriharyana.gov.in/) to check if any new applications for "SC Sub-plan" schemes are open.
*   **Documents Needed:** 
    *   Caste Certificate (Attested)
    *   Aadhaar Card
    *   Jamabandi (Land Record)
    *   Bank Passbook (linked with Aadhaar)

---

### How to resolve missing verification items:
If you find that your documents are not reflecting correctly on the portals:
1.  **Visit the "Krishi Vigyan Kendra" (KVK) in Sonipat:** They have dedicated help desks for farmers to resolve portal errors.
2.  **Contact your local Patwari:** If there is a mismatch in your land records (Jamabandi), only the Patwari can correct the digital entry.
3.  **Check your Bank:** Ensure your Aadhaar is linked to your bank account for **DBT (Direct Benefit Transfer)**. If it is not, your subsidies will fail.

Would you like me to help you check the specific status of your 4 active schemes or look for the nearest CSC location in Sonipat?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([greetingMessage]);
  }, [profile]);

  const getSimulatedResponse = (question) => {
    let response = generateAIResponse(question);
    const activeName = activeProfile.name || "Suresh Kumar";
    const firstName = activeName.split(' ')[0];
    if (typeof response === "string") {
      return response.replace(/Rajesh/g, firstName);
    } else if (response) {
      const copy = { ...response };
      if (copy.summary) copy.summary = copy.summary.replace(/Rajesh/g, firstName);
      if (copy.details) copy.details = copy.details.replace(/Rajesh/g, firstName);
      return copy;
    }
    return response;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getEligibleSchemesCount = () => {
    const eligibleCard = kpiCards.find(
      (card) => card.title === "ELIGIBLE SCHEMES",
    );
    return eligibleCard ? eligibleCard.value : "14";
  };

  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("pm kisan") && lowerQuestion.includes("delay")) {
      return sampleConversations[0].aiResponse;
    }

    if (lowerQuestion.includes("solar") || lowerQuestion.includes("pump")) {
      return sampleConversations[1].aiResponse;
    }

    if (
      lowerQuestion.includes("which scheme") ||
      lowerQuestion.includes("first")
    ) {
      return {
        title: "Top Recommended Scheme for You",
        summary:
          "Based on your profile, PM Kusum Solar Pump is your best opportunity",
        details: "94% match score with potential benefit of ₹1,20,000",
        steps: [
          "Complete solar feasibility report",
          "Gather land ownership documents",
          "Apply through PM Kusum portal before Jan 15",
        ],
        result:
          "This scheme offers the highest subsidy amount for your drip-irrigated farm",
        deadline: "Application window closes Jan 15, 2025",
      };
    }

    if (lowerQuestion.includes("tractor")) {
      return {
        title: "Tractor Subsidy Eligibility",
        summary:
          "You are eligible for 40% subsidy on tractor purchase up to ₹80,000",
        details: "Under Sub-Mission on Agricultural Mechanization (SMAM)",
        steps: [
          "Upload tractor RC (currently missing in document vault)",
          "Apply through local agriculture department",
          "Submit income certificate and land documents",
        ],
        result: "Subsidy amount will be credited within 45 days of approval",
        helpline: "NABARD Helpline: 1800-123-1234",
      };
    }

    if (lowerQuestion.includes("dec 31")) {
      return {
        title: "Urgent Actions Before Dec 31",
        summary: "Two critical deadlines approaching",
        steps: [
          "PMFBY crop insurance enrollment - ₹18,000 coverage at risk",
          "Caste certificate renewal - affects 3 state schemes",
          "PMKSY application window closing",
        ],
        result: "Complete these to avoid losing ₹43,000 in benefits",
        deadline: "Dec 31, 2024 is the cutoff date",
      };
    }

    return {
      title: "How can I help you?",
      summary:
        "I can assist with scheme eligibility, application status, document requirements, deadlines, and benefit calculations.",
      details: "Please ask a specific question about any government scheme.",
      steps: [
        "Check your eligibility for PM Kisan, PMFBY, KCC",
        "Track application status and pending benefits",
        "Get document requirements and deadlines",
        "Calculate subsidy amounts for various schemes",
      ],
      result: "Try one of the suggested questions above to get started.",
    };
  };

  const handleSendMessage = async (msgOverride) => {
    const textToSend = msgOverride || inputValue;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!msgOverride) setInputValue("");
    setIsTyping(true);

    try {
      const res = await profileApi.chatWithSchemeAI({
        message: textToSend,
        farmerProfile: activeProfile,
        schemeContext: {
          eligibleCount: eligibleSchemesCount,
          activeCount: 4,
          benefitsReceived: "₹42,500"
        }
      });

      if (res && res.success && res.answer) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response from backend");
      }
    } catch (error) {
      console.warn("Direct /api/gov-schemes/chat call failed, falling back to client-side/simulation:", error);
      try {
        const contextString = `
Farmer Profile Context:
- Name: ${activeProfile.name}
- Location: ${activeProfile.location}
- Land Size: ${activeProfile.landSize} Acres
- Crops grown: ${activeProfile.crops ? activeProfile.crops.join(', ') : 'None listed'}
- Irrigation Method: ${activeProfile.irrigation}
- Category: ${activeProfile.category ? activeProfile.category.join(', ') : 'General'}
Active Scheme Query Context: {"eligibleCount":"${eligibleSchemesCount}","activeCount":4,"benefitsReceived":"₹42,500"}
`;

        const systemInstruction = `You are AgroIndia AI Schemes Advisor, a helpful and knowledgeable agricultural government schemes specialist. 
Your goal is to help Indian farmers navigate government schemes, subsidies, loans, crop insurance, and eligibility requirements.
Keep in mind the farmer's profile:
${contextString}
Provide highly relevant, actionable, and personalized schemes information based on their crop list, location (State/District), landholdings, and caste category.
Use simple, clear, and reassuring language. 
Adhere to the following rules:
1. Do not invent scheme benefits or application windows.
2. Provide step-by-step guidance on how to apply, which documents are needed, and how to resolve missing verification items.
3. Keep the tone helpful, professional, and empathetic to rural users.
4. Keep the response concise and structured (use bullet points).
`;
        const answer = await generateContent(textToSend, {
          system_instruction: systemInstruction,
          temperature: 0.3,
        });

        if (answer) {
          const botMessage = {
            id: Date.now() + 1,
            type: "bot",
            content: answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          throw new Error("Empty answer received from Gemini");
        }
      } catch (err2) {
        const aiResponse = getSimulatedResponse(textToSend);
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderBotResponse = (response) => {
    if (typeof response === "string") {
      return (
        <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-semibold">
          {response}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900" style={{ color: "#132a13" }}>
          {response.title}
        </h4>
        <p className="text-sm text-gray-700">{response.summary}</p>

        {response.rootCause && (
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs font-semibold text-amber-800">Root Cause:</p>
            <p className="text-sm text-amber-700">{response.rootCause}</p>
          </div>
        )}

        {response.details && (
          <p className="text-sm text-gray-650">{response.details}</p>
        )}

        {response.steps && (
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-xs font-semibold text-emerald-800 mb-2">
              Fix in 3 steps:
            </p>
            <ol className="space-y-1">
              {response.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="text-sm text-emerald-700 flex items-start gap-2"
                >
                  <span className="font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {response.result && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{response.result}</p>
          </div>
        )}

        {response.deadline && (
          <div className="flex items-center gap-2 text-xs text-red-650 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Deadline: {response.deadline}</span>
          </div>
        )}

        {response.helpline && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>Helpline: {response.helpline}</span>
          </div>
        )}

        {response.matchScore && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Match Score:</span>
            <span className="text-sm font-bold" style={{ color: "#4f772d" }}>
              {response.matchScore}
            </span>
            <div className="flex-1 h-1.5 bg-gray-250 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: response.matchScore,
                  backgroundColor: "#4f772d",
                }}
              ></div>
            </div>
          </div>
        )}

        {response.requiredDocs && (
          <div>
            <p className="text-xs font-bold text-gray-700 mb-2">
              Required Documents:
            </p>
            <div className="flex flex-wrap gap-2">
              {response.requiredDocs.map((doc, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-650 font-semibold"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {response.applicationWindow && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{response.applicationWindow}</span>
          </div>
        )}

        {response.benefit && (
          <div
            className="flex items-center gap-2 text-lg font-bold"
            style={{ color: "#132a13" }}
          >
            <IndianRupee className="w-4 h-4 text-[#4f772d]" />
            <span>{response.benefit}</span>
          </div>
        )}

        <button
          type="button"
          className="mt-2 text-white text-xs font-bold px-4 py-2 rounded-xl transition bg-[#4f772d] hover:bg-[#31572c]"
        >
          Apply Now
        </button>
      </div>
    );
  };

  const eligibleSchemesCount = getEligibleSchemesCount();

  return (
    <div className="flex h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Chat Interface - Left Side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-250 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#132a13]/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#4f772d]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#132a13]">
                AI Government Advisor
              </h1>
              <p className="text-xs text-gray-500 font-semibold">
                Powered by Gemini AI • Active schemes analysis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-xs font-bold px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-[#132a13]/5 text-gray-600 transition"
          >
            {showSidebar ? "Hide Context" : "Show Context"}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" style={{ color: "#2D4A3E" }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hello, {farmerProfile.name}
              </h3>
              <p className="text-gray-500 mb-6">
                I'm your AI assistant for government schemes. Ask me anything
                about:
                <br />
                Eligibility, applications, documents, deadlines, or benefits.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" style={{ color: "#2D4A3E" }} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
                style={
                  message.type === "user" ? { backgroundColor: "#132a13" } : {}
                }
              >
                {message.type === "user" ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  renderBotResponse(message.content)
                )}
                <p
                  className={`text-xs mt-2 ${message.type === "user" ? "text-white/60" : "text-gray-400"}`}
                >
                  {message.timestamp}
                </p>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4" style={{ color: "#2D4A3E" }} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Chips */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-2 rounded-full border border-gray-200 bg-white hover:border-primary hover:text-primary transition font-bold"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-3">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about any scheme, eligibility, document, or payment..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#4f772d]"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className={`p-2 rounded-full transition ${
                inputValue.trim()
                  ? "text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              style={inputValue.trim() ? { backgroundColor: "#132a13" } : {}}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Context Panel */}
      {showSidebar && (
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0 animate-slideLeft">
          <div className="p-5">
            <h3 className="font-semibold text-gray-905 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4f772d]" />
              Farmer Context
            </h3>

            {/* Farmer Profile Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#132a13]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#4f772d]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-950">
                    {activeProfile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeProfile.location}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-450">Land Size:</span>
                  <span className="font-bold text-gray-800">
                    {activeProfile.landSize} acres
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-455">Crops:</span>
                  <span className="font-bold text-gray-850 truncate max-w-[120px]" title={activeProfile.crops.join(", ")}>
                    {activeProfile.crops.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-455">Irrigation:</span>
                  <span className="font-bold text-gray-800">
                    {activeProfile.irrigation}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-455">Category:</span>
                  <span className="font-bold text-gray-800">
                    {activeProfile.category.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Scheme Stats */}
            <h3 className="font-semibold text-gray-905 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4f772d]" />
              Current Stats
            </h3>

            <div className="space-y-3">
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm text-emerald-800">Eligible Schemes</span>
                  <span className="text-xl font-black text-[#132a13]">
                    {eligibleSchemesCount}
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm text-blue-800">
                    Active Applications
                  </span>
                  <span className="text-xl font-black text-blue-600">4</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm text-green-800">Benefits Received</span>
                  <span className="text-xl font-black text-green-600">
                    ₹42,500
                  </span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm text-amber-800">Pending Benefits</span>
                  <span className="text-xl font-black text-amber-600">
                    ₹12,000
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <h3 className="font-semibold text-gray-905 mb-3 mt-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#4f772d]" />
              Quick Actions
            </h3>

            <div className="space-y-2">
              <button type="button" className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#4f772d] hover:text-[#4f772d] transition text-sm flex items-center justify-between font-semibold">
                <span>Check PM Kisan Status</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button type="button" className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#4f772d] hover:text-[#4f772d] transition text-sm flex items-center justify-between font-semibold">
                <span>Apply for PM Kusum</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button type="button" className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#4f772d] hover:text-[#4f772d] transition text-sm flex items-center justify-between font-semibold">
                <span>Renew Caste Certificate</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button type="button" className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#4f772d] hover:text-[#4f772d] transition text-sm flex items-center justify-between font-semibold">
                <span>View All Schemes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Helpline Numbers */}
            <div className="mt-5 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Helpline Numbers
              </p>
              <div className="space-y-1 text-xs text-gray-600 font-semibold">
                <p>PM Kisan: 155261</p>
                <p>PMFBY: 1800-123-4567</p>
                <p>KCC: 1800-258-3333</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmAIAdvisor;
