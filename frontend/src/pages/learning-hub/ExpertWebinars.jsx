import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  ArrowRight, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  X, 
  BookOpen, 
  Award,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function ExpertWebinars() {
  const [topicInput, setTopicInput] = useState("");
  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: "Climate Resilient Crop Selection Strategies",
      date: "June 12, 2026 at 11:00 AM",
      status: "LIVE SOON",
      speaker: "Dr. Arvind Subramanian",
      role: "Director of Agrometeorology, IARI",
      speakerInitial: "AS",
      attendees: 184,
      speakerBio: {
        about: "Dr. Subramanian has spent over 25 years modeling monsoon impact trends in semi-arid zones, developing drought-resistant crop rotation guides.",
        highlights: "Recipient of the National Agriculture Innovation Award 2025.",
        bibliography: [
          "Micro-Climate Adaptation in Central India (2024)",
          "Drought Resilient Seed Varieties under Variable Monsoon (2025)"
        ]
      }
    },
    {
      id: 2,
      title: "Precision Carbon Sequestration via Biochar",
      date: "June 18, 2026 at 03:30 PM",
      status: "UPCOMING",
      speaker: "Dr. Meera Deshmukh",
      role: "Lead Research Scientist, Soil Chemistry, ICAR",
      speakerInitial: "MD",
      attendees: 112,
      speakerBio: {
        about: "Dr. Deshmukh focuses on soil carbon mapping and biochar pyrolysis kinetics to improve water holding capabilities in clay soils.",
        highlights: "Author of 40+ publications on organic matter dynamics.",
        bibliography: [
          "Pyrolysis Optimization for Crop-Straw Biochar (2023)",
          " Rhizosphere Microbial Alterations under Biochar Amendments (2025)"
        ]
      }
    }
  ]);
  const [registeredWebinarIds, setRegisteredWebinarIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPresenter, setSelectedPresenter] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFetchWebinars = async (e) => {
    e.preventDefault();
    const query = topicInput.trim();
    if (!query) return;

    setLoading(true);
    setErrorMsg("");

    const prompt = `You are a crop science webinar event coordinator. Generate 2 upcoming agricultural webinars focusing on: "${query}".
    
    Structure your response as a valid JSON array. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    Each object in the array must contain exactly these keys:
    1. "id": A unique integer.
    2. "title": A professional, scientific webinar title.
    3. "date": A realistic date/time (e.g., "June 24, 2026 at 10:00 AM").
    4. "status": Either "LIVE SOON" or "UPCOMING".
    5. "speaker": Name of the expert agronomist.
    6. "role": Professional title (e.g. "Senior Pathologist, ICAR").
    7. "speakerInitial": Two-letter initials (e.g. "AS").
    8. "attendees": Integer starting number of registrations (e.g. 145).
    9. "speakerBio": A sub-object containing:
       - "about": A brief summary of their career (around 30 words).
       - "highlights": A key professional award or achievement.
       - "bibliography": An array of 2 scientific papers published by the speaker.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert agricultural event organizer. Always return response as raw JSON array.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsedArray = JSON.parse(cleanJson);
      setWebinars(parsedArray);
      setTopicInput("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to search new webinars. Using existing schedule.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (id) => {
    if (registeredWebinarIds.includes(id)) return;
    setRegisteredWebinarIds(prev => [...prev, id]);
    setWebinars(prevList => 
      prevList.map(webinar => 
        webinar.id === id 
          ? { ...webinar, attendees: webinar.attendees + 1 } 
          : webinar
      )
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased relative">
      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-[#31572c]/10 text-[#31572c] rounded-xl mt-1 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Expert Webinars</h1>
            <p className="text-sm text-slate-500 mt-1">
              Live sessions with top agronomists and policymakers (AI Scheduling Active)
            </p>
          </div>
        </div>
      </div>

      {/* Query/Search Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> Live AI Webinar Finder
        </h3>
        <form onSubmit={handleFetchWebinars} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Search crop topic or expert specialty (e.g. Hydroponics, Carbon Capture, Drones)..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#31572c] hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Scheduling...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Schedule Webinars
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

      {/* Grid: 2 Card Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {webinars.map((webinar) => {
          const isRegistered = registeredWebinarIds.includes(webinar.id);

          return (
            <div 
              key={webinar.id} 
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[290px]"
            >
              {webinar.status === 'LIVE SOON' && (
                <div className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl shadow-xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                  <span>LIVE SOON</span>
                </div>
              )}

              {/* Title & Schedule */}
              <div className="pr-12">
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{webinar.date}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug tracking-tight mb-4">
                  {webinar.title}
                </h3>
              </div>

              {/* Speaker Profile Capsule */}
              <div 
                onClick={() => setSelectedPresenter(webinar)}
                className="bg-slate-50/60 hover:bg-slate-100/70 border border-slate-100 rounded-2xl p-4 transition-colors cursor-pointer flex items-center gap-3 mb-5"
              >
                <div className="h-10 w-10 bg-slate-300 rounded-full flex items-center justify-center font-extrabold text-slate-700 shrink-0 border-2 border-white shadow-sm font-sans">
                  {webinar.speakerInitial || webinar.speaker?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 leading-tight">
                    {webinar.speaker}
                  </h4>
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5">
                    {webinar.role}
                  </p>
                </div>
                <div className="ml-auto text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  View Bio
                </div>
              </div>

              {/* Bottom Metadata & CTA Button */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50/60 border border-slate-200 px-3 py-1.5 rounded-xl shadow-3xs">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{webinar.attendees} Registered</span>
                </div>

                <button
                  disabled={isRegistered}
                  onClick={() => handleRegister(webinar.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                    isRegistered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default shadow-none'
                      : 'bg-[#31572c] hover:bg-[#1a3018] text-white hover:shadow-xs'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Added to Calendar</span>
                    </>
                  ) : (
                    <>
                      <span>Register Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Presenter Profile Detail Slide-over Panel */}
      {selectedPresenter && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedPresenter(null)} />
          
          <div className="bg-white h-full max-w-md w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between p-6 sm:p-8 animate-slideOver">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  PRESENTER PROFILE INFO
                </span>
                <button 
                  onClick={() => setSelectedPresenter(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-slate-700 shrink-0 border-2 border-slate-100 shadow-sm font-sans">
                  {selectedPresenter.speakerInitial || selectedPresenter.speaker?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {selectedPresenter.speaker}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    {selectedPresenter.role}
                  </p>
                </div>
              </div>

              <div className="space-y-5 overflow-y-auto max-h-[60vh] pr-2">
                {selectedPresenter.speakerBio?.about && (
                  <div className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Agronomist Profile Summary</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                      {selectedPresenter.speakerBio.about}
                    </p>
                  </div>
                )}

                {selectedPresenter.speakerBio?.highlights && (
                  <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-850 uppercase tracking-wider">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>Sector Highlights</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
                      {selectedPresenter.speakerBio.highlights}
                    </p>
                  </div>
                )}

                {selectedPresenter.speakerBio?.bibliography && (
                  <div className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-blue-700" />
                      <span>Research Bibliography Publications</span>
                    </div>
                    <ul className="space-y-2 font-semibold">
                      {selectedPresenter.speakerBio.bibliography.map((bib, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-slate-600 items-start">
                          <span className="text-blue-600 font-black">•</span>
                          <span className="leading-relaxed italic">{bib}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedPresenter(null)}
                className="w-full bg-[#31572c] hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Close Bio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}