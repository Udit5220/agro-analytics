import React, { useState } from "react";
import { Send, X, Bot, User, Sparkles } from "lucide-react";

export default function AIChatAssistant({ isOpen, onClose }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Hello! I am your CommodIQ Market Assistant. Ask me about price forecasts, cross-exchange spreads, or target input cost forecasting.",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setChat([...chat, { role: "user", text: msg }]);
    setMsg("");

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I'm processing this under static mode. Once linked to your backend Gemini cluster, I will parse global benchmarks against local spot indices.",
        },
      ]);
    }, 1000);
  };

  const suggestions = [
    "What is the 90-day projection for Wheat?",
    "Calculate landing cost parity metrics",
    "Show current MCX vs NCDEX spreads",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col z-[100] animate-slideInRight font-sans">
      {/* Module Title Bar */}
      <div className="bg-brand-dark text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-green-200" />
          <h2 className="font-bold text-sm">CommodIQ AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Message Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex gap-3 ${c.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${c.role === "user" ? "bg-green-100 text-green-800" : "bg-brand-dark text-white"}`}
            >
              {c.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-sm ${c.role === "user" ? "bg-brand-dark text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"}`}
            >
              {c.text}
            </div>
          </div>
        ))}
      </div>

      {/* Preset Action Prompts */}
      <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto hide-scrollbar">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setMsg(s)}
            className="whitespace-nowrap px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold hover:bg-green-100 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Frame */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-slate-200"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Ask AI about commodities..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-4 pr-12 py-3 outline-none focus:border-[#31572c] focus:ring-1 focus:ring-[#31572c] transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 h-8 w-8 bg-brand-dark text-white rounded-lg flex items-center justify-center hover:bg-green-800 transition-colors"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
