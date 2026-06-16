import React, { useState, useEffect } from 'react';
import { Search, Bell, MapPin, Newspaper, Loader2, Info, AlertTriangle, TrendingUp, TrendingDown, Thermometer, CloudRain } from 'lucide-react';
import { statesAndCities } from '../../utils/statesAndCities';
import { useNewsIntelligence } from '../../hooks/useNewsIntelligence';

export default function NewsIntelligenceModule({ subPath }) {
  const [activeRole, setActiveRole] = useState(localStorage.getItem('userRole') || 'Farmer');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');
  const [selectedState, setSelectedState] = useState(localStorage.getItem('news_selected_state') || 'India');
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('news_selected_city') || '');
  const [activeSubpage, setActiveSubpage] = useState(subPath || 'Everything');
  const [expandedItems, setExpandedItems] = useState({});
  const [detailsCache, setDetailsCache] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [showBanner, setShowBanner] = useState(true);

  // Derive cities list for the selected state
  const stateData = statesAndCities.find(s => s.state === selectedState);
  const availableCities = stateData ? stateData.cities : [];

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    localStorage.setItem('news_selected_state', stateName);
    if (stateName !== 'India') {
      setSelectedCity('');
      localStorage.removeItem('news_selected_city');
    }
  };

  const handleCityChange = (cityName) => {
    if (cityName) {
      setSelectedCity(cityName);
      localStorage.setItem('news_selected_city', cityName);
    }
  };

  const toggleAccordion = async (idx, title, reg) => {
    setExpandedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
    
    if (!expandedItems[idx] && !detailsCache[idx]) {
       setLoadingDetails(prev => ({ ...prev, [idx]: true }));
       try {
           const res = await fetch(`http://localhost:5000/api/news/intelligence-details?title=${encodeURIComponent(title)}&location=${encodeURIComponent(reg)}&language=${language}`);
           const data = await res.json();
           if (data.success) {
               setDetailsCache(prev => ({ ...prev, [idx]: data.details }));
           } else {
               setDetailsCache(prev => ({ ...prev, [idx]: "Detailed insights are currently unavailable." }));
           }
       } catch (err) {
           setDetailsCache(prev => ({ ...prev, [idx]: "Failed to load detailed insights." }));
       } finally {
           setLoadingDetails(prev => ({ ...prev, [idx]: false }));
       }
    }
  };

  // Sync activeSubpage with subPath prop if it changes via sidebar navigation
  useEffect(() => {
    if (subPath) {
      setActiveSubpage(subPath);
    }
  }, [subPath]);
  
  const [menuItems, setMenuItems] = useState([]);

  // Default filters as fallback
  const fallbackFilters = [
    { label: 'Overview Dashboard', path: '' },
    { label: 'Mandi Insights', path: 'mandi-insights' },
    { label: 'Weather & Safety', path: 'weather-safety' }
  ];

  const filters = menuItems.length > 0 ? menuItems : fallbackFilters;

  // Listen for role and language changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newRole = localStorage.getItem('userRole') || 'Farmer';
      const newLang = localStorage.getItem('language') || 'English';
      if (newRole !== activeRole) {
        setActiveRole(newRole);
      }
      if (newLang !== language) {
        setLanguage(newLang);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also periodically check for local changes since same-tab localStorage sets don't trigger 'storage' event
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeRole, language]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/news/sidebar-menu', {
          headers: {
            'x-user-role': activeRole,
            'x-language': language
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.menu)) {
            setMenuItems(json.menu);
            // Set the first menu item as active if the current activeSubpage is not in the new menu
            const currentPathExists = json.menu.some(m => m.path === activeSubpage || m.label === activeSubpage);
            if (!currentPathExists && json.menu.length > 0) {
              setActiveSubpage(json.menu[0].path || json.menu[0].label);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [activeRole, language]);

  const userLoc = selectedState === 'India' ? 'India' : (selectedCity ? `${selectedCity}, ${selectedState}` : selectedState);
  const { data, loading, error, refetch } = useNewsIntelligence(activeRole, activeSubpage, userLoc, language);

  useEffect(() => {
    setShowBanner(true);
  }, [data]);

  return (
    <div className="bg-[#F8FAF9] min-h-screen text-slate-900 font-sans p-6 rounded-3xl animate-fadeIn overflow-x-hidden">
      {/* Header (Dynamic Titles & Dropdowns) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mt-1 shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-900 capitalize">
                {activeSubpage.replace(/-/g, ' ')}
              </h1>
              <button 
                onClick={refetch} 
                className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded hover:bg-emerald-200 transition"
              >
                Refresh Data
              </button>
            </div>
            <p className="text-sm text-emerald-500 mt-2 max-w-xl">
              {activeRole} Dashboard View • Real-time AI-Synthesized Feed
            </p>
          </div>
        </div>

        {/* State & City Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {language === 'Hindi' ? "स्तर / राज्य" : "Level / State"}
            </span>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="text-sm font-semibold text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-colors cursor-pointer w-full sm:w-[160px]"
            >
              <option value="India">
                {language === 'Hindi' ? "भारत (राष्ट्रीय)" : "India (National)"}
              </option>
              {statesAndCities.map((item) => (
                <option key={item.state} value={item.state}>
                  {language === 'Hindi' ? item.stateHi : item.state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {language === 'Hindi' ? "शहर" : "City"}
            </span>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={selectedState === 'India'}
              className="text-sm font-semibold text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-colors cursor-pointer w-full sm:w-[160px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {selectedState === 'India' ? (
                <option value="">
                  {language === 'Hindi' ? "अखिल भारतीय" : "All India"}
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    {language === 'Hindi' ? "शहर चुनें" : "Select City"}
                  </option>
                  {availableCities.map((cityObj) => (
                    <option key={cityObj.en} value={cityObj.en}>
                      {language === 'Hindi' ? cityObj.hi : cityObj.en}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Removed Pill Filters */}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 bg-emerald-100/50 animate-pulse rounded-2xl w-full"></div>
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="h-32 bg-emerald-100/30 animate-pulse rounded-2xl w-full"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-emerald-100/50 animate-pulse rounded-2xl w-full"></div>
            <div className="h-40 bg-emerald-100/30 animate-pulse rounded-2xl w-full"></div>
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (Banner + Feed) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Banner Alert */}
            {data.ban && showBanner && (
              <div className="bg-emerald-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm animate-fadeIn">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                  <Newspaper className="w-48 h-48 -mr-10 -mt-10 transform rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      {data.ban.typ}
                    </span>
                    <span className="text-emerald-200 text-xs font-semibold">Effective Immediately</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{data.ban.ttl}</h3>
                  <p className="text-emerald-100 text-sm max-w-xl leading-relaxed mb-6">
                    {data.ban.dsc}
                  </p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        const firstItem = document.getElementById('news-item-0');
                        if (firstItem) firstItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <Info className="w-4 h-4" />
                      View Details
                    </button>
                    <button 
                      onClick={() => setShowBanner(false)}
                      className="bg-emerald-950 hover:bg-emerald-950/80 text-emerald-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* News Feed Items */}
            <div className="space-y-4">
              {data.nws && data.nws.map((item, idx) => {
                const isExpanded = !!expandedItems[idx];
                const keyword = item.img_keyword || item.ttl.split(' ')[0].replace(/[^a-zA-Z]/g, '');
                const finalKeyword = keyword.length > 3 ? keyword : 'agriculture';
                
                return (
                <div id={`news-item-${idx}`} key={idx} className="bg-white rounded-2xl p-5 border border-emerald-50 shadow-sm flex flex-col sm:flex-row gap-5 transition-all hover:shadow-md cursor-pointer" onClick={() => toggleAccordion(idx, item.ttl, item.reg)}>
                  {/* Image Placeholder */}
                  <div className="w-full sm:w-48 h-28 shrink-0 rounded-xl overflow-hidden bg-emerald-100 relative">
                    <img 
                      src={`https://tse1.mm.bing.net/th?q=${encodeURIComponent(finalKeyword + " agriculture news")}&w=400&h=300&c=7&rs=1&p=0`}
                      alt={item.ttl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23064e3b"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" dominant-baseline="middle" text-anchor="middle">${encodeURIComponent(finalKeyword)}</text></svg>`; }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          item.tag === 'BULLISH' ? 'bg-emerald-100 text-emerald-800' :
                          item.tag === 'BEARISH' ? 'bg-red-100 text-red-800' :
                          item.tag === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.tag}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                          <span>{item.dur}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">{item.reg}</span>
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-emerald-950 mb-2 leading-tight">
                        {item.ttl}
                      </h4>
                    </div>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                       {loadingDetails[idx] ? (
                         <div className="flex items-center gap-2 text-sm text-emerald-600 animate-pulse py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating AI Insights...</span>
                         </div>
                       ) : (
                         <p className="text-sm text-emerald-700/80 leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                           {detailsCache[idx] || item.dsc || item.ttl} 
                         </p>
                       )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <button className="text-emerald-600 text-sm font-bold flex items-center gap-1.5 hover:text-emerald-800 transition-colors" onClick={(e) => { e.stopPropagation(); toggleAccordion(idx, item.ttl, item.reg); }}>
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        {language === 'Hindi' ? "विस्तृत विश्लेषण" : "AI Deep Dive"}
                      </button>
                      <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            
            {/* Dynamic Indicators Widget */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-emerald-950">{data.ind_title || "Local Indicators"}</h4>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">{language === 'Hindi' ? "लाइव अपडेट" : "Live Update"}</span>
              </div>
              <div className="space-y-4">
                {data.ind && data.ind.map((mandi, idx) => {
                  const isUp = mandi.dlt && mandi.dlt.startsWith('+');
                  const isDown = mandi.dlt && mandi.dlt.startsWith('-');
                  return (
                    <div key={idx} className="flex items-center justify-between pb-3 border-b border-emerald-50 last:border-0 last:pb-0">
                      <div>
                        <h5 className="text-sm font-bold text-slate-800">{mandi.var}</h5>
                        <p className="text-xs text-slate-400">{mandi.loc}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-950">{mandi.val}</div>
                        <div className={`text-xs flex items-center justify-end gap-1 font-semibold ${isUp ? 'text-emerald-500' : isDown ? 'text-red-500' : 'text-slate-400'}`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : null}
                          {mandi.dlt}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => alert(`Generating full detailed report for ${data.ind_title || "Local Indicators"}. This feature will be available shortly.`)}
                className="w-full mt-4 py-2.5 rounded-xl border border-emerald-200 text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
              >
                {data.ind_btn || "View Full Report"}
              </button>
            </div>

            {/* Dynamic Weather Alert */}
            {data.weather_alert && (
              <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                    <CloudRain className="w-3.5 h-3.5" />
                    {language === 'Hindi' ? "अलर्ट" : "Alert"}
                  </div>
                  <div className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-sm">{data.weather_alert.temperature}</div>
                </div>
                <h4 className="text-emerald-950 text-sm font-bold mb-1">{data.weather_alert.title}</h4>
                <p className="text-emerald-700/80 text-xs leading-relaxed mb-4">
                  {data.weather_alert.description}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-1 flex-1 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{data.weather_alert.probability}</span>
                </div>
              </div>
            )}

            {/* Dynamic Insight */}
            {data.ins && (
              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-900 text-sm">{data.insight_title || `${activeRole} Insight`}</h4>
                </div>
                <div className="border-l-2 border-emerald-400 pl-3 py-1">
                  <p className="text-xs italic text-emerald-800 leading-relaxed font-medium">
                    "{data.ins}"
                  </p>
                </div>
              </div>
            )}
            
          </div>
        </div>
      ) : null}
      
      {/* Bottom Nav Removed */}
    </div>
  );
}
