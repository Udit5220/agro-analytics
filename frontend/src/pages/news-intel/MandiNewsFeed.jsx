import React, { useState } from 'react';
import { Newspaper, Filter, Clock, MapPin, TrendingUp, TrendingDown, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function MandiNewsFeed() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [commodityInput, setCommodityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [newsItems, setNewsItems] = useState([
    { 
      id: 1,
      title: "Wheat Arrival Surges by 15% in Haryana Region as Harvest Peaks", 
      excerpt: "Local mandis across Rohtak and Hisar report a massive influx of wheat, leading to temporary storage shortages. Authorities are working on emergency procurement measures.",
      category: "Supply Chain",
      impact: "High Supply", 
      impactColor: "text-blue-600 bg-blue-50 border-blue-100",
      rating: "Price Stabilized", 
      time: "2 hours ago",
      location: "Haryana",
      trend: "down"
    },
    { 
      id: 2,
      title: "Monsoon Front Enters Central India 4 Days Ahead of Schedule", 
      excerpt: "Meteorological department confirms early arrival of monsoon in MP and Maharashtra. Farmers advised to prepare fields for early Kharif sowing.",
      category: "Weather",
      impact: "Atmospheric", 
      impactColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
      rating: "Early Sowing Alert", 
      time: "1 day ago",
      location: "Central India",
      trend: "neutral"
    },
    { 
      id: 3,
      title: "Soybean Prices Hit New High at Indore Mandi Amid Export Demand", 
      excerpt: "International demand pushes soybean prices past previous resistance levels. Traders anticipate continued volatility throughout the week.",
      category: "Prices",
      impact: "Price Alert", 
      impactColor: "text-rose-600 bg-rose-50 border-rose-100",
      rating: "High Volatility", 
      time: "3 hours ago",
      location: "Indore, MP",
      trend: "up"
    },
    { 
      id: 4,
      title: "New E-NAM Integration Guidelines Released for Onion Traders", 
      excerpt: "Lasalgaon mandi moves to fully digital auctioning starting next week. Registration camps set up for farmers.",
      category: "Policy",
      impact: "Regulation", 
      impactColor: "text-amber-600 bg-amber-50 border-amber-100",
      rating: "Process Change", 
      time: "5 hours ago",
      location: "Lasalgaon, MH",
      trend: "neutral"
    }
  ]);

  const handleGenerateNews = async (e) => {
    e.preventDefault();
    const queryText = commodityInput.trim();
    if (!queryText) {
      setErrorMsg("Please enter a commodity or market name.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const prompt = `You are a real-time agricultural news crawler and market intelligence analyst. Generate 3 realistic, highly relevant mandi news articles focusing on the following commodity/market: "${queryText}".
    
    Structure your response as a valid JSON array. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    Each object in the array must represent a news article and contain exactly these keys:
    1. "title": A realistic, professional headline.
    2. "excerpt": A detailed summary of the news (25-35 words).
    3. "category": Choose one of: "Prices", "Supply Chain", "Weather", "Policy".
    4. "impact": A short impact level tag (e.g., "High Supply", "Price Alert", "Regulation").
    5. "rating": A brief market rating (e.g., "Price Stabilized", "High Volatility", "Strong Demand").
    6. "time": Time label (e.g., "Just now", "2 hours ago").
    7. "location": Indian region (e.g., "Nashik, MH", "Karnal, HR").
    8. "trend": Either "up", "down", or "neutral".`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an agricultural news simulation engine. Always return response as raw JSON array.",
        temperature: 0.3
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsedArray = JSON.parse(cleanJson);
      
      const updatedNews = parsedArray.map((item, idx) => {
        let impactColor = "text-gray-600 bg-gray-50 border-gray-100";
        if (item.category === 'Prices') impactColor = "text-rose-600 bg-rose-50 border-rose-100";
        else if (item.category === 'Supply Chain') impactColor = "text-blue-600 bg-blue-50 border-blue-100";
        else if (item.category === 'Weather') impactColor = "text-indigo-600 bg-indigo-50 border-indigo-100";
        else if (item.category === 'Policy') impactColor = "text-amber-600 bg-amber-50 border-amber-100";
        
        return {
          id: Date.now() + idx,
          ...item,
          impactColor
        };
      });

      setNewsItems(updatedNews);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not fetch new mandi alerts. Using local news repository.");
    } finally {
      setLoading(false);
    }
  };

  const filters = ['All', 'Prices', 'Supply Chain', 'Weather', 'Policy'];

  const filteredNews = activeFilter === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeFilter);

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#31572c]/10 rounded-lg">
            <Newspaper className="h-6 w-6 text-[#31572c]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Mandi News Feed</h1>
            <p className="text-sm text-gray-500">Real-time localized agricultural updates and price alerts</p>
          </div>
        </div>
      </div>

      {/* Dynamic News Crawler Controller */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> Live AI News Crawler
        </h3>
        <form onSubmit={handleGenerateNews} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={commodityInput}
            onChange={(e) => setCommodityInput(e.target.value)}
            placeholder="Search crop or mandi (e.g. Onion, Karnal Wheat, Garlic)..."
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
                <Loader2 className="h-4 w-4 animate-spin" /> Crawling Mandis...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Crawl Live News
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
      
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="h-4 w-4 text-gray-400 mr-1" />
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeFilter === f 
                ? 'bg-[#31572c] text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-6">
          {filteredNews.map((item) => (
            <div key={item.id} className="group flex flex-col md:flex-row gap-5 p-5 border border-gray-100 rounded-xl hover:border-[#31572c]/30 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <span className="text-[#31572c]">{item.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center text-gray-500 gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {item.time}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#31572c] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${item.impactColor}`}>
                    {item.impact}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                </div>
              </div>
              
              <div className="hidden md:flex flex-col items-end justify-between border-l border-gray-100 pl-5 w-48 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">Market Rating</span>
                  <span className="text-sm font-black text-gray-800">{item.rating}</span>
                </div>
                <div className={`p-3 rounded-full ${
                  item.trend === 'up' ? 'bg-rose-50 text-rose-600' : 
                  item.trend === 'down' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="h-6 w-6" /> : 
                   item.trend === 'down' ? <TrendingDown className="h-6 w-6" /> : 
                   <div className="h-6 w-6 flex items-center justify-center font-bold">-</div>}
                </div>
              </div>
            </div>
          ))}
          
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No news found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
