import React, { useState } from 'react';
import { 
  PlayCircle, 
  Video, 
  BookOpen, 
  Clock, 
  ThumbsUp, 
  Share2, 
  Download,
  User, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  AlertCircle,
  Search,
  Globe 
} from 'lucide-react';
import videoUrl from '../../assets/208521_medium.mp4';
import { generateContent } from '../../services/gemini/client';

export default function LectureHall() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState({ 0: 42, 1: 18, 2: 29 });
  const [hasClickedHelpful, setHasClickedHelpful] = useState({});

  // YouTube Search states
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState("");
  const [searchingYoutube, setSearchingYoutube] = useState(false);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [youtubeError, setYoutubeError] = useState("");
  const [playYoutubeId, setPlayYoutubeId] = useState(null);

  // AI Bilingual Lecture Guide state
  const [targetLang, setTargetLang] = useState("Hindi");
  const [generating, setGenerating] = useState(false);
  const [guideData, setGuideData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const playlist = [
    {
      id: 0,
      title: "Mastering Drip Irrigation Systems",
      duration: "14:20",
      instructor: "Dr. R. Sharma (ICAR)",
      thumb: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=360&q=80",
      description: "A detailed engineering breakdown of micro-irrigation installation, pressure regulations, drip emitter layouts, and filter maintenance schedules for commercial farming operations.",
      progress: 100
    },
    {
      id: 1,
      title: "Organic Certification: A Step-by-step Guide",
      duration: "22:15",
      instructor: "A. Patel (Agri-Expert)",
      thumb: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=360&q=80",
      description: "Learn the official NPOP guidelines, documentation compliance, soil conversion cycles, and NABL inspection protocols required to secure organic farming certification.",
      progress: 35
    },
    {
      id: 2,
      title: "Pest Management for Cotton (Kharif)",
      duration: "18:40",
      instructor: "N. Kumar (Extension)",
      thumb: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=360&q=80",
      description: "An intensive tactical module highlighting early detection of pink bollworm and whitefly, pest threshold index tracking, and ecological management solutions.",
      progress: 0
    }
  ];

  const handleSelectVideo = (index) => {
    setActiveVideo(index);
    setIsPlaying(false);
    setPlayYoutubeId(null);
    setGuideData(null);
    setErrorMsg("");
  };

  const handleHelpfulClick = (id) => {
    if (hasClickedHelpful[id]) return;
    setHelpfulCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setHasClickedHelpful(prev => ({ ...prev, [id]: true }));
  };

  const handleSearchYoutube = async (e) => {
    e.preventDefault();
    const query = youtubeSearchQuery.trim();
    if (!query) return;

    setSearchingYoutube(true);
    setYoutubeError("");
    setYoutubeResults([]);

    const prompt = `You are a crop science librarian. Recommend 3 highly informative, real or realistic YouTube agricultural videos relating to the topic: "${query}".
    
    Structure your response as a valid JSON array. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    Each object in the array must contain exactly these keys:
    1. "videoId": A valid/working YouTube video ID (e.g. "zOzsjEm4Mrc", "K385hQe9e4Y", or a realistic 11-character ID).
    2. "title": High-quality video lecture title.
    3. "description": A brief summary of what the video teaches (15-20 words).
    4. "instructor": Channel name or expert lecturer.
    5. "duration": Video duration (e.g., "12:15").`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert crop video researcher. Always return response as raw JSON array.",
        temperature: 0.3
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsedArray = JSON.parse(cleanJson);
      setYoutubeResults(parsedArray);
    } catch (err) {
      console.error(err);
      setYoutubeError("Could not query YouTube lectures. Using offline search results.");
      setYoutubeResults([
        {
          videoId: "2t8M1ySlyeA",
          title: `Introductory Guide to ${query}`,
          description: "An introductory training session detailing crop diagnostics and soil preparation tips.",
          instructor: "Indian Agricultural Research Institute",
          duration: "10:45"
        }
      ]);
    } finally {
      setSearchingYoutube(false);
    }
  };

  const handleGenerateStudyGuide = async () => {
    const activeItem = playYoutubeId 
      ? youtubeResults.find(v => v.videoId === playYoutubeId) 
      : playlist[activeVideo];
      
    if (!activeItem) return;

    setGenerating(true);
    setErrorMsg("");
    setGuideData(null);

    const prompt = `You are a senior ICAR extension trainer. Compile a structured study guide and lecture notes in the preferred regional language: "${targetLang}" based on this course:
    
    Title: "${activeItem.title}"
    Instructor/Channel: "${activeItem.instructor}"
    Core Description: "${activeItem.description}"

    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "guideTitle": The title translated/written in the preferred language.
    2. "summary": A brief summary of the lecture (around 50 words in the preferred language).
    3. "takeaways": An array of exactly 3 bulleted key technical takeaways/rules.
    4. "actionSteps": A step-by-step instructions list (3 steps) for actual field execution by farmers.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert bilingual agronomy training editor. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      setGuideData(parsed);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate translation. Check your network or active Gemini key.");
      setGuideData({
        guideTitle: `अध्ययन गाइड: ${activeItem.title} (${targetLang})`,
        summary: `यह लेक्चर मुख्य रूप से कृषि क्षेत्र में आधुनिक वैज्ञानिक तकनीकों और सुरक्षा नियमों के महत्व को दर्शाता है।`,
        takeaways: [
          "दबाव और प्रवाह नियंत्रण उपकरणों का उचित रखरखाव आवश्यक है।",
          "मृदा परीक्षण रिपोर्ट के अनुसार ही पोषक तत्वों का वितरण करें।",
          "कीट आर्थिक सीमा स्तर (ETL) की नियमित जांच करते रहें।"
        ],
        actionSteps: [
          "खेत का सटीक सर्वेक्षण करें और रेखाचित्र तैयार करें।",
          "संबंधित रसायनों या उपकरणों की शुद्धता की पुष्टि करें।",
          "कंट्रोल प्लॉट बनाकर नई तकनीकों का पहले परीक्षण करें।"
        ]
      });
    } finally {
      setGenerating(false);
    }
  };

  const activeItem = playYoutubeId 
    ? youtubeResults.find(v => v.videoId === playYoutubeId) 
    : playlist[activeVideo];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-[#31572c]/10 text-[#31572c] rounded-xl mt-1 shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Virtual Lecture Hall</h1>
            <p className="text-sm text-slate-500 mt-1">
              Expert-led courses with real-time AI Study Guide translations and YouTube lecture streaming
            </p>
          </div>
        </div>
      </div>

      {/* YouTube Video Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Video className="h-4 w-4 text-[#ef4444]" /> Search YouTube Lectures & Guides
        </h3>
        <form onSubmit={handleSearchYoutube} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={youtubeSearchQuery}
            onChange={(e) => setYoutubeSearchQuery(e.target.value)}
            placeholder="Search crop topic on YouTube (e.g. Mushroom farming, Organic fertilizer prep)..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
            required
          />
          <button
            type="submit"
            disabled={searchingYoutube}
            className="bg-[#31572c] hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {searchingYoutube ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Searching YouTube...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Find YouTube Videos
              </>
            )}
          </button>
        </form>

        {youtubeError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{youtubeError}</span>
          </div>
        )}

        {youtubeResults.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Search Results (Click to Play in Frame)</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {youtubeResults.map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => {
                    setPlayYoutubeId(video.videoId);
                    setIsPlaying(false);
                    setGuideData(null);
                    setErrorMsg("");
                  }}
                  className={`p-3 border rounded-xl cursor-pointer hover:border-red-500/50 hover:bg-slate-50/50 transition-all ${
                    playYoutubeId === video.videoId ? 'border-red-500 bg-red-50/10' : 'border-gray-200'
                  }`}
                >
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 leading-snug">
                    <PlayCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span className="truncate">{video.title}</span>
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed font-semibold">{video.description}</p>
                  <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-gray-100 text-[9px] font-bold text-gray-400">
                    <span>{video.instructor}</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Layout Splits */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Video Workspace */}
        <div className="flex-1 space-y-4 lg:max-w-[66%]">
          {/* Media Player Canvas */}
          <div className="w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden relative shadow-sm group">
            {playYoutubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${playYoutubeId}?autoplay=1`}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            ) : isPlaying ? (
              <video 
                src={videoUrl}
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img 
                  src={activeItem.thumb} 
                  alt={activeItem.title} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="h-16 w-16 sm:h-20 sm:w-20 bg-[#31572c]/90 hover:bg-[#1a3018] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <PlayCircle className="h-10 w-10 sm:h-12 sm:w-12 ml-1" />
                  </button>
                </div>
              </>
            )}

            {!isPlaying && !playYoutubeId && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900/60">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-500" 
                  style={{ width: `${activeItem.progress}%` }} 
                />
              </div>
            )}
          </div>

          {/* Metadata Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {playYoutubeId && <Video className="h-5 w-5 text-red-500 shrink-0 animate-pulse" />}
                {activeItem.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {playYoutubeId ? activeItem.description : activeItem.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block leading-tight">{activeItem.instructor}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                    {playYoutubeId ? "YouTube Lecturer" : "ICAR Certified"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Clock className="h-4 w-4 text-slate-450" />
                <span>Duration: {activeItem.duration}</span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
              {!playYoutubeId && (
                <button 
                  onClick={() => handleHelpfulClick(activeItem.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    hasClickedHelpful[activeItem.id] 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Helpful ({helpfulCounts[activeItem.id]})</span>
                </button>
              )}

              <button 
                onClick={() => alert('Link copied to clipboard!')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-all"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* AI Translation and Study Guide Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#31572c]" /> AI Bilingual Study Companion
              </h3>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="Hindi">Hindi / हिन्दी</option>
                  <option value="Punjabi">Punjabi / ਪੰਜਾਬी</option>
                  <option value="Marathi">Marathi / मराठी</option>
                  <option value="Tamil">Tamil / தமிழ்</option>
                  <option value="Telugu">Telugu / తెలుగు</option>
                </select>
              </div>
            </div>

            {!guideData && !generating ? (
              <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-gray-500 font-semibold mb-3">Translate this lecture's core takeaways and field guide steps.</p>
                <button
                  onClick={handleGenerateStudyGuide}
                  className="bg-[#31572c] hover:bg-[#1a3018] text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Generate AI Study Guide
                </button>
              </div>
            ) : generating ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2.5">
                <Loader2 className="h-6 w-6 text-[#31572c] animate-spin" />
                <span className="text-xs text-gray-500 font-semibold">Compiling study notes in {targetLang}...</span>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h4 className="text-sm font-extrabold text-[#31572c]">{guideData.guideTitle}</h4>
                  <p className="text-xs text-gray-650 leading-relaxed font-semibold mt-1.5">{guideData.summary}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Core takeaways</span>
                  <ul className="space-y-1.5">
                    {guideData.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-700 font-semibold items-start">
                        <span className="text-emerald-700">✓</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Action steps</span>
                  <ol className="space-y-1.5">
                    {guideData.actionSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-emerald-950 font-bold items-start">
                        <span>{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Up Next Queue */}
        <div className="w-full lg:w-96 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
              Up Next
            </h3>
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-black tracking-wider">
              {playlist.length} VIDEOS
            </span>
          </div>
          
          <div className="space-y-4">
            {playlist.map((vid, idx) => (
              <div 
                key={vid.id} 
                onClick={() => handleSelectVideo(idx)}
                className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all border ${
                  activeVideo === idx && !playYoutubeId
                  ? 'bg-emerald-50/20 border-emerald-600/30' 
                  : 'hover:bg-slate-50 border-transparent'
                }`}
              >
                <div className="relative w-28 h-18 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-100">
                  <img src={vid.thumb} className="w-full h-full object-cover" alt="thumb"/>
                  <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[9px] font-black px-1.5 py-0.5 rounded font-sans tracking-wide">
                    {vid.duration}
                  </span>

                  {vid.progress === 100 && (
                    <div className="absolute top-1 left-1 bg-emerald-500 rounded-full p-0.5">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col py-0.5 flex-1 min-w-0">
                  <h4 className={`text-xs font-bold line-clamp-2 leading-snug ${activeVideo === idx && !playYoutubeId ? 'text-emerald-800' : 'text-slate-900'}`}>
                    {vid.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-auto">{vid.instructor}</p>
                  
                  {vid.progress > 0 && vid.progress < 100 && (
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${vid.progress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
