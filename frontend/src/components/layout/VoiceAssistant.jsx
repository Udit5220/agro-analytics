import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Bot, X } from 'lucide-react';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        handleVoiceQuery(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      setIsOpen(true);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceQuery = async (queryText) => {
    setLoading(true);
    try {
      const role = localStorage.getItem('userRole') || 'Farmer';
      const res = await fetch('http://localhost:5000/api/research/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role
        },
        body: JSON.stringify({ query: queryText })
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.insight);
        speakResponse(data.insight);
      } else {
        setResponse("I'm sorry, I encountered an error or you don't have permission to access this data.");
      }
    } catch (err) {
      console.error(err);
      setResponse("Network error connecting to the AI Voice core.");
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      // Basic cleanup of markdown formatting for speech
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={toggleListening}
        className={`p-2 rounded-xl border transition-all duration-300 ${
          isListening 
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
            : 'bg-white/10 border-white/20 text-[#ecf39e] hover:bg-white/20'
        }`}
        title="AI Voice Assistant"
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 opacity-70" />}
      </button>

      {/* Voice Assistant Modal/Popup */}
      {isOpen && (
        <div className="absolute top-14 right-0 w-80 bg-[#132a13] border border-[#4f772d]/50 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-[#4f772d]/20 px-4 py-3 flex items-center justify-between border-b border-[#4f772d]/30">
            <div className="flex items-center gap-2 text-[#ecf39e]">
              <Bot className="w-5 h-5" />
              <span className="font-bold text-sm">Role-Aware AI Assistant</span>
            </div>
            <button onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }} className="text-[#ecf39e]/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {transcript && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-xs text-[#ecf39e]/60 font-bold uppercase mb-1">You asked:</p>
                <p className="text-sm text-white">{transcript}</p>
              </div>
            )}
            
            <div className="bg-[#4f772d]/10 rounded-xl p-3 min-h-[80px]">
              <p className="text-xs text-[#ecf39e]/60 font-bold uppercase mb-1">AI Response:</p>
              {loading ? (
                <div className="flex items-center gap-2 text-white/50 text-sm py-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing security matrix & researching...
                </div>
              ) : response ? (
                <p className="text-sm text-white/90 leading-relaxed">{response}</p>
              ) : isListening ? (
                <p className="text-sm text-white/50 italic flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"/> Listening...</p>
              ) : (
                <p className="text-sm text-white/50 italic">Click the mic to speak a command.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
