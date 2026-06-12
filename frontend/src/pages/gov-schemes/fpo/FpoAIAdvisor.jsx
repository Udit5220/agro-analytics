// src/pages/gov-schemes/fpo/FpoAIAdvisor.jsx
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, Send } from "lucide-react";
import { FpoUtilizationHeader } from "./FpoHelper";

const FpoAIAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What funding should we pursue next?",
    "Which opportunity offers maximum ROI?",
    "What is blocking our eligibility?",
    "Which members are missing benefits?"
  ];

  const answers = {
    "what funding should we pursue next?": `Based on Sonipat FPO's crop profile (Rice/Sugarcane focus) and capacity deficits, your top opportunity is:
    
### 1. Agriculture Infrastructure Fund (AIF)
*   **Grant Value:** Up to ₹2.00 Crore
*   **Subsidy:** 3% interest subvention for 7 years
*   **Strategic Fit:** High (Required to build 1,500 MT warehouse)
*   **Approval Probability:** 92% (Documentation is 95% complete)

Would you like me to help draft the Detail Project Report (DPR) or check the application guidelines?`,
    "which opportunity offers maximum roi?": `Our simulations suggest **Cold Storage expansion** under the **National Horticulture Board Cold Chain Subsidy** yields the maximum return on capital:

*   **Total Project Cost:** ₹65.00 Lakh
*   **FPO Contribution:** ₹42.25 Lakh (Net Net)
*   **Estimated Annual Revenue Increase:** ₹18.50 Lakh
*   **Projected ROI:** **22.5%**
*   **Estimated Payback:** **4.2 Years**

This matches your 95% storage utilization rate and high horticultural output cluster in Bhadana village.`,
    "what is blocking our eligibility?": `There are currently **3 critical documentation gaps** blocking eligibility for major subsidies:

1.  **Audited Financial Statement FY25-26** (Overdue, blocks AIF & PMFME grants - ₹3.5 Cr value at risk)
2.  **GST Returns Q4 Receipt** (Pending, blocks tax-linked subventions - ₹20 Lakh impact)
3.  **Board of Directors AGM Resolution** (Draft pending, blocks NCDC capacity grant - ₹30 Lakh value)

Please instruct your cooperative secretary or accountant to upload these files in the Compliance Center immediately to restore 100% eligibility.`,
    "which members are missing benefits?": `We have identified **220 FPO members** who are eligible for central schemes but not receiving benefits:

*   **Kharindwa Village:** 60 farmers eligible for PM-KISAN (blocked by incomplete Aadhaar-Bank KYC seeding).
*   **Bhadana Village:** 45 farmers eligible for PMFBY Kharif Crop Insurance.
*   **Solar Pump opportunity:** 120 members with drip irrigation who qualify for 60% solar subsidy.

You can launch a direct outreach campaign by sending auto-generated SMS warnings to these farmers.`
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcome = {
      id: "welcome-fpo-msg",
      type: "bot",
      content: "Namaste! I am your AI Government Opportunity Advisor. I can help you find grants, monitor applications, calculate ROI, and audit compliance indices. Choose a question below or type a custom query.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcome]);
  }, []);

  const handleSendMessage = (textOverride) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = textToSend.toLowerCase().trim();
      const ansText = answers[lowerText] || "I apologize, but I only have simulated answers for the suggested queries at this time. Please try asking one of the recommended questions chips below.";
      
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        content: ansText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="AI Opportunity Advisor" />
      <div className="flex flex-col h-[550px] bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#132a13] text-white p-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-sm">AI Opportunity Advisor</h3>
            <p className="text-[10px] text-gray-300">FPO Decision Support Engine</p>
          </div>
          <Sparkles className="w-5 h-5 text-[#ecf39e] animate-pulse" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 text-xs font-semibold leading-relaxed shadow-sm ${
                m.type === "user" 
                  ? "bg-[#132a13] text-white" 
                  : "bg-white border border-gray-200 text-gray-800 whitespace-pre-wrap"
              }`}>
                {m.content}
                <span className={`block text-[9px] mt-1.5 ${m.type === "user" ? "text-white/60" : "text-gray-400"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-gray-405 italic">
                AI Advisor is analyzing data...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="p-3 border-t border-gray-100 flex flex-wrap gap-1.5 justify-center bg-white">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-[10px] font-bold px-3 py-1.5 border border-gray-255 rounded-full bg-white hover:border-brand-medium hover:text-brand-medium transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-250 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Ask a question about ROI, compliance, member benefits..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-brand-medium"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              inputValue.trim() ? "bg-[#132a13] text-white" : "bg-gray-200 text-gray-450 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default FpoAIAdvisor;
