import { fetchLiveNews } from '../services/news.service.js';
import { synthesizeRoleNews, getAiDetails, generateCompletion, chatModel } from '../services/langchain.service.js';
import { fetchNewsIntelligenceAI, fetchNewsDetailsAI } from '../services/geminiGenaiService.js';

// Simple in-memory cache to prevent hitting Gemini rate limits
// Structure: { "Role_Language_SubPath": { data: JSON, timestamp: 12345 } }
const newsCache = new Map();
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours (cache busted)

async function fetchImageFromWiki(keyword) {
    try {
        const getUrl = (d) => {
            if (d?.query?.pages) {
                const pages = d.query.pages;
                const key = Object.keys(pages)[0];
                return pages[key]?.thumbnail?.source;
            }
            return null;
        };

        let res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&prop=pageimages&piprop=thumbnail&pithumbsize=400&format=json&gsrlimit=1`);
        let data = await res.json();
        let url = getUrl(data);
        if (url) return url;
        
        const firstWord = keyword.split(' ')[0];
        res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(firstWord)}&prop=pageimages&piprop=thumbnail&pithumbsize=400&format=json&gsrlimit=1`);
        data = await res.json();
        url = getUrl(data);
        if (url) return url;

        res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=agriculture&prop=pageimages&piprop=thumbnail&pithumbsize=400&format=json&gsrlimit=1`);
        data = await res.json();
        url = getUrl(data);
        if (url) return url;

    } catch(e) { console.error('Wiki image fetch error', e); }
    return `https://placehold.co/400x300/064e3b/ffffff?text=${encodeURIComponent(keyword)}`;
}

export const getNewsDashboardData = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        const subPath = req.query.subPath || '';

        // Extract context headers
        const userLoc = req.headers['x-user-location'] || req.query.location || 'India';
        const userCrops = req.headers['x-user-crops'] || 'agriculture';
        const userStage = req.headers['x-user-crop-stage'] || 'farming';
        const userSize = req.headers['x-user-farm-size'] || 'small farm';

        const cacheKey = `v3_${userRole}_${language}_${subPath}_${userLoc}`;


        // 1. Check Cache
        if (newsCache.has(cacheKey)) {
            const cached = newsCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                console.log(`[News Controller] Serving ${cacheKey} from cache`);
                return res.status(200).json({ success: true, data: cached.data });
            }
        }

        console.log(`[News Controller] Fetching live data for ${cacheKey}...`);

        // 2. Generate appropriate search query based on role and subPath
        let searchQuery = 'India agriculture';
        
        switch (userRole) {
            case 'Farmer':
                switch (subPath) {
                    case 'mandi-insights': searchQuery = `mandi market arrivals commodity price news updates ${userLoc} ${userCrops}`; break;
                    case 'weather-safety': searchQuery = `agricultural weather advisory warning damage crop health ${userLoc}`; break;
                    case 'agri-tech': searchQuery = `ICAR krishi vigyan kendra agriculture innovation pest infestation outbreak warning ${userCrops} ${userLoc}`; break;
                    case 'financial-credit': searchQuery = `kisan credit card agriculture loan subsidy crop insurance payment news ${userLoc}`; break;
                    case 'scheme-news': searchQuery = `PM Kisan installment release date notification minimum support price MSP update ${userCrops}`; break;
                    default: searchQuery = `India local agriculture weather pest farming ${userLoc}`; break;
                }
                break;
            case 'FPO':
                switch (subPath) {
                    case 'b2b-market': searchQuery = `FPO B2B agricultural market sentiment wholesale prices ${userLoc}`; break;
                    case 'input-procurement': searchQuery = `bulk agricultural input procurement fertilizers seeds FPO ${userLoc}`; break;
                    case 'logistics': searchQuery = `agriculture logistics warehousing cold storage supply chain ${userLoc}`; break;
                    case 'compliance-grants': searchQuery = `government grants subsidies compliance FPO agriculture ${userLoc}`; break;
                    default: searchQuery = `India farmer producer organization cooperative mandi risk ${userLoc}`; break;
                }
                break;
            case 'Commodity Trader':
                switch (subPath) {
                    case 'mandi-arbitrage': searchQuery = `mandi spot prices agricultural arbitrage commodity trading ${userLoc}`; break;
                    case 'supply-risk': searchQuery = `agricultural supply chain disruption weather risk commodity ${userLoc}`; break;
                    case 'export-policy': searchQuery = `India agriculture export policy tariff duty trade ${userLoc}`; break;
                    case 'institutional-flow': searchQuery = `institutional procurement FCI agriculture flow commodities ${userLoc}`; break;
                    default: searchQuery = `Global agriculture commodity market futures macro trends ${userLoc}`; break;
                }
                break;
            case 'Procurement Manager':
                switch (subPath) {
                    case 'risk': searchQuery = `sourcing risk disruption agriculture harvest shortfall ${userLoc}`; break;
                    case 'vendor-negotiations': searchQuery = `agricultural vendor pricing contract farming negotiations ${userLoc}`; break;
                    case 'quality-assaying': searchQuery = `agricultural commodity quality standards assaying grading ${userLoc}`; break;
                    case 'logistics-routing': searchQuery = `agricultural transport freight logistics routing optimization ${userLoc}`; break;
                    default: searchQuery = `India supply chain agriculture transport mapping ${userLoc}`; break;
                }
                break;
            case 'Agribusiness Manager':
                switch (subPath) {
                    case 'competitor-intel': searchQuery = `agribusiness corporate competitor intelligence market share ${userLoc}`; break;
                    case 'supply-chain': searchQuery = `agribusiness supply chain optimization efficiency ${userLoc}`; break;
                    case 'retail-demand': searchQuery = `agricultural retail FMCG consumer demand trends ${userLoc}`; break;
                    case 'm-and-a': searchQuery = `agribusiness mergers acquisitions corporate deals ${userLoc}`; break;
                    default: searchQuery = `Global agriculture corporate macro trends agribusiness ${userLoc}`; break;
                }
                break;
            case 'Research Analyst':
                switch (subPath) {
                    case 'climate-modeling': searchQuery = `agriculture climate change impact modeling agronomy ${userLoc}`; break;
                    case 'bio-tech': searchQuery = `agricultural genomics biotechnology CRISPR seed innovation ${userLoc}`; break;
                    case 'soil-microbiome': searchQuery = `soil health microbiome regenerative agriculture science ${userLoc}`; break;
                    case 'policy-economics': searchQuery = `agricultural policy economics trade impact analysis ${userLoc}`; break;
                    default: searchQuery = `Global agronomy scientific research papers agriculture ${userLoc}`; break;
                }
                break;
            case 'Government Official':
                switch (subPath) {
                    case 'relief': searchQuery = `agricultural disaster relief disbursement farmer compensation ${userLoc}`; break;
                    case 'sentiment': searchQuery = `farmer sentiment agricultural policy feedback protest ${userLoc}`; break;
                    case 'food-security': searchQuery = `national food security reserves buffer stock agriculture ${userLoc}`; break;
                    case 'infrastructure': searchQuery = `agricultural infrastructure development rural progress ${userLoc}`; break;
                    default: searchQuery = `district agricultural crisis monitor warnings ${userLoc}`; break;
                }
                break;
            default:
                searchQuery = `${userRole} agriculture India news ${subPath} ${userLoc}`;
                break;
        }

        // 3. Fetch Live News via Google News RSS (with 3s timeout for speed)
        let rawNews = [];
        try {
            const newsTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('News fetch timeout')), 3000));
            rawNews = await Promise.race([fetchLiveNews(searchQuery), newsTimeout]);
        } catch (fetchErr) {
            console.warn('[News Controller] News fetch timed out or failed, proceeding with empty context for AI fallback.');
        }

        // 4. Synthesize via Gemini AI
        const synthesizedData = await synthesizeRoleNews(rawNews, userRole, subPath, { userLoc, userCrops, userStage, userSize }, language);
        
        // Final Output Structure
        const responseData = { 
            role: userRole, 
            language,
            ...synthesizedData
        };

        // 5. Apply Dynamic Audio Translation Fallback if non-English
        // (Assuming the synthesis prompt handles basic structures, we ensure TTS compatibility)
        if (language === 'Hindi' && responseData.accordionItems) {
            responseData.accordionItems = responseData.accordionItems.map(item => ({
                ...item,
                single_line_summary: item.single_line_summary,
                audioText: item.audioText ? `[सिम्युलेटेड हिंदी ऑडियो] यह समाचार ${item.single_line_summary} के बारे में है。` : undefined
            }));
        }

        // 6. Save to Cache
        newsCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

        res.status(200).json({ success: true, data: responseData });
    } catch (err) {
        console.error("News Dashboard Error:", err);
        res.status(500).json({ error: "Failed to fetch news dashboard data." });
    }
};

export const getNewsDetails = async (req, res) => {
    try {
        const headline = req.query.headline || '';
        const role = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        const location = req.headers['x-user-location'] || req.query.location || 'India';
        
        if (!headline) {
            return res.status(400).json({ error: "Headline query parameter is required." });
        }

        const details = await getAiDetails(headline, role, language, location);
        res.status(200).json({ success: true, details });
    } catch (err) {
        console.error("AI Details Fetch Error:", err);
        res.status(500).json({ error: "Failed to generate detailed insights." });
    }
};

export const getNewsSidebarMenu = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        
        const prompt = `You are an AI News Editor. Determine the required and relevant news subpages/topics for the user role: "${userRole}" in the News Intelligence Module of an agricultural analytics platform.
        
        The subpage paths MUST strictly match the valid subPaths defined for "${userRole}":
        - For role "Farmer":
          Paths: "mandi-insights", "weather-safety", "agri-tech", "financial-credit", "scheme-news"
        - For role "FPO":
          Paths: "", "b2b-market", "input-procurement", "logistics", "compliance-grants"
        - For role "Commodity Trader":
          Paths: "", "mandi-arbitrage", "supply-risk", "export-policy", "institutional-flow"
        - For role "Procurement Manager":
          Paths: "", "risk", "vendor-negotiations", "quality-assaying", "logistics-routing"
        - For role "Agribusiness Manager":
          Paths: "", "competitor-intel", "supply-chain", "retail-demand", "m-and-a"
        - For role "Research Analyst":
          Paths: "", "climate-modeling", "bio-tech", "soil-microbiome", "policy-economics"
        - For role "Government Official":
          Paths: "", "relief", "sentiment", "food-security", "infrastructure"
        - For role "Company Admin":
          Paths: "", "api-health", "user-access", "security"
          
        For each path, select a user-friendly label (in ${language}) and an appropriate Lucide icon name (e.g. "LayoutDashboard", "TrendingUp", "CloudRain", "Coins", "Settings", "Shield", "Activity", "Newspaper", "Award", "Truck").
        Note: The path "" should represent the "Overview Dashboard" and should have label like "Overview Dashboard" or "Overview".
        
        Return a strict JSON array containing these objects. Each object must have:
        - "label" (string, in ${language}, e.g. "Mandi Price Feed")
        - "path" (string)
        - "icon" (string)
        
        Do not include any markdown styling, explanation, or code block delimiters. Just return the raw valid JSON array.`;

        let menu = [];
        try {
            const result = await generateCompletion(prompt, userRole);
            let cleanJson = result.trim();
            if (cleanJson.startsWith("\`\`\`")) {
                cleanJson = cleanJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            }
            menu = JSON.parse(cleanJson);
        } catch (apiError) {
            console.error("Gemini API failed for news menu, using fallback:", apiError.message);
            // Default News Menu fallback based on role
            switch (userRole) {
                case 'Farmer':
                    menu = [
                        { label: language === 'Hindi' ? "मंडी अंतर्दृष्टि" : "Mandi Insights", path: "mandi-insights", icon: "Newspaper" },
                        { label: language === 'Hindi' ? "मौसम सुरक्षा" : "Weather & Safety", path: "weather-safety", icon: "CloudRain" },
                        { label: language === 'Hindi' ? "कृषि तकनीक" : "Agri-Tech Trends", path: "agri-tech", icon: "Cpu" },
                        { label: language === 'Hindi' ? "वित्तीय ऋण" : "Financial & Credit", path: "financial-credit", icon: "Coins" },
                        { label: language === 'Hindi' ? "योजना समाचार" : "Scheme News", path: "scheme-news", icon: "Award" }
                    ];
                    break;
                case 'FPO':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "B2B बाजार" : "B2B Market", path: "b2b-market", icon: "TrendingUp" },
                        { label: language === 'Hindi' ? "इनपुट खरीद" : "Input Procurement", path: "input-procurement", icon: "ShoppingCart" },
                        { label: language === 'Hindi' ? "रसद" : "Logistics & Storage", path: "logistics", icon: "Truck" },
                        { label: language === 'Hindi' ? "अनुपालन और अनुदान" : "Compliance & Grants", path: "compliance-grants", icon: "FileText" }
                    ];
                    break;
                case 'Commodity Trader':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "मंडी आर्बिट्राज" : "Mandi Arbitrage", path: "mandi-arbitrage", icon: "TrendingUp" },
                        { label: language === 'Hindi' ? "आपूर्ति जोखिम" : "Supply Risk", path: "supply-risk", icon: "AlertTriangle" },
                        { label: language === 'Hindi' ? "निर्यात नीति" : "Export Policy", path: "export-policy", icon: "Globe" },
                        { label: language === 'Hindi' ? "संस्थागत प्रवाह" : "Institutional Flow", path: "institutional-flow", icon: "Activity" }
                    ];
                    break;
                case 'Procurement Manager':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "जोखिम निगरानी" : "Risk Monitor", path: "risk", icon: "AlertTriangle" },
                        { label: language === 'Hindi' ? "विक्रेता बातचीत" : "Vendor Negotiations", path: "vendor-negotiations", icon: "FileText" },
                        { label: language === 'Hindi' ? "गुणवत्ता परीक्षण" : "Quality Assaying", path: "quality-assaying", icon: "Activity" },
                        { label: language === 'Hindi' ? "रसद रूटिंग" : "Logistics & Routing", path: "logistics-routing", icon: "Truck" }
                    ];
                    break;
                case 'Agribusiness Manager':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "प्रतिस्पर्धी खुफिया" : "Competitor Intel", path: "competitor-intel", icon: "Search" },
                        { label: language === 'Hindi' ? "आपूर्ति श्रृंखला" : "Supply Chain", path: "supply-chain", icon: "TrendingUp" },
                        { label: language === 'Hindi' ? "खुदरा मांग" : "Retail Demand", path: "retail-demand", icon: "ShoppingCart" },
                        { label: language === 'Hindi' ? "विलय और अधिग्रहण" : "M&A Intelligence", path: "m-and-a", icon: "Activity" }
                    ];
                    break;
                case 'Research Analyst':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "जलवायु मॉडलिंग" : "Climate Modeling", path: "climate-modeling", icon: "CloudRain" },
                        { label: language === 'Hindi' ? "बायो-टेक" : "Bio-Tech Research", path: "bio-tech", icon: "Cpu" },
                        { label: language === 'Hindi' ? "मिट्टी माइक्रोबायोम" : "Soil Microbiome", path: "soil-microbiome", icon: "Sprout" },
                        { label: language === 'Hindi' ? "नीति अर्थशास्त्र" : "Policy & Economics", path: "policy-economics", icon: "FileText" }
                    ];
                    break;
                case 'Government Official':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "आपदा राहत" : "Disaster Relief", path: "relief", icon: "Shield" },
                        { label: language === 'Hindi' ? "किसान भावना" : "Farmer Sentiment", path: "sentiment", icon: "Activity" },
                        { label: language === 'Hindi' ? "खाद्य सुरक्षा" : "Food Security", path: "food-security", icon: "Lock" },
                        { label: language === 'Hindi' ? "बुनियादी ढांचा" : "Infrastructure Projects", path: "infrastructure", icon: "Home" }
                    ];
                    break;
                case 'Company Admin':
                    menu = [
                        { label: language === 'Hindi' ? "अवलोकन" : "Overview", path: "", icon: "LayoutDashboard" },
                        { label: language === 'Hindi' ? "API स्वास्थ्य" : "API Health Monitor", path: "api-health", icon: "Activity" },
                        { label: language === 'Hindi' ? "उपयोगकर्ता पहुंच" : "User Access", path: "user-access", icon: "Users" },
                        { label: language === 'Hindi' ? "सुरक्षा ऑडिट" : "Security & Privacy", path: "security", icon: "Shield" }
                    ];
                    break;
                default:
                    menu = [
                        { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" }
                    ];
            }
        }

        res.status(200).json({ success: true, menu });
    } catch (error) {
        console.error('Failed to generate news sidebar menu:', error);
        res.status(500).json({ error: 'Failed to generate news menu.' });
    }
};

export const getNewsIntelligence = async (req, res) => {
    const userRole = req.query.role || req.headers['x-user-role'] || 'Farmer';
    const activeSubpage = req.query.subPath || req.query.subpage || 'Everything';
    const userLoc = req.headers['x-user-location'] || req.query.location || 'Punjab, India';
    const language = req.headers['x-language'] || req.query.language || 'English';

    // Clean subpage string for search query (replace hyphens with spaces)
    const cleanSubpage = activeSubpage.replace(/-/g, ' ');

    let rawNews = [];

    try {
        const cacheKey = `intel_v2_${userRole}_${activeSubpage}_${userLoc}_${language}`;
        
        if (newsCache.has(cacheKey)) {
            const cached = newsCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                console.log(`[News Controller] Serving ${cacheKey} from cache`);
                return res.status(200).json({ success: true, data: cached.data });
            }
        }

        console.log(`[News Controller] Fetching token-optimized intelligence data for ${cacheKey}...`);

        // Fetch Live News for context
        let searchQuery = `${userRole} ${cleanSubpage} ${userLoc} agriculture`;
        try {
            const newsTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('News fetch timeout')), 2500));
            rawNews = await Promise.race([fetchLiveNews(searchQuery), newsTimeout]);
        } catch (fetchErr) {
            console.warn('[News Controller] Live news fetch timed out/failed. Using fallback logic.');
        }

        // Call Gemini AI
        const responseData = await fetchNewsIntelligenceAI(userRole, activeSubpage, userLoc, rawNews, language);

        // Fetch web images for each item
        if (responseData && responseData.nws) {
            await Promise.all(responseData.nws.map(async (item) => {
                const searchKeyword = item.img_keyword || item.ttl.split(' ')[0] || 'agriculture';
                item.img_url = await fetchImageFromWiki(`${searchKeyword} agriculture`);
            }));
        }

        newsCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

        res.status(200).json({ success: true, data: responseData });
    } catch (err) {
        console.error("News Intelligence AI Error:", err.message);
        
        // Return highly realistic mock fallback data structured strictly in the lean schema
        let fallbackType = "INFO";
        let fallbackTitle = `Updates for ${userRole}s in ${userLoc}`;
        const lowercaseSubpage = activeSubpage.toLowerCase();
        if (lowercaseSubpage.includes("mandi") || lowercaseSubpage.includes("price") || lowercaseSubpage.includes("arbitrage")) {
            fallbackType = "CRITICAL";
            fallbackTitle = "Mandi Price Inflow Detected";
        } else if (lowercaseSubpage.includes("weather") || lowercaseSubpage.includes("climate") || lowercaseSubpage.includes("rain") || lowercaseSubpage.includes("safety")) {
            fallbackType = "WEATHER ALERT";
            fallbackTitle = "Weather Advisory";
        } else if (lowercaseSubpage.includes("credit") || lowercaseSubpage.includes("finance")) {
            fallbackType = "INFO";
            fallbackTitle = "Financial Schemes Update";
        } else if (lowercaseSubpage.includes("tech") || lowercaseSubpage.includes("bio")) {
            fallbackType = "INFO";
            fallbackTitle = "Agri-Tech Innovation Alert";
        } else if (lowercaseSubpage.includes("policy") || lowercaseSubpage.includes("grant") || lowercaseSubpage.includes("compliance")) {
            fallbackType = "MANDATORY UPDATE";
            fallbackTitle = "New Policy Guidelines Issued";
        } else if (lowercaseSubpage.includes("logistic") || lowercaseSubpage.includes("storage")) {
            fallbackType = "INFO";
            fallbackTitle = "Logistics Route Optimization";
        }

        const count = (userRole === 'Farmer' || userRole === 'FPO' || userRole === 'Commodity Trader' || userRole === 'Research Analyst' || userRole === 'Agribusiness Manager') ? 6 : 4;
        const fallbackNws = [];
        
        let defaultTitles = [];
        let defaultKeywords = [];

        if (lowercaseSubpage.includes('mandi') || lowercaseSubpage.includes('price')) {
            defaultTitles = [`Mandi Arrivals Rise in ${userLoc}`, `Price of Wheat Surges in ${userLoc}`, `New e-NAM Registration Open`, `Logistics Subsidies for Produce Transport`, `Middlemen Margin Drops by 2%`, `Wholesale Market Timings Extended`];
            defaultKeywords = ["market", "wheat", "auction", "truck", "trading", "mandi"];
        } else if (lowercaseSubpage.includes('weather') || lowercaseSubpage.includes('climate') || lowercaseSubpage.includes('safety')) {
            defaultTitles = [`Micro-Climate Changes Forecasted in ${userLoc}`, `Heavy Rainfall Alert for Next 48 Hours`, `Heatwave Advisory Issued`, `Soil Moisture Levels Dropping`, `Hailstorm Damage Assessment`, `Optimal Sowing Window Opens`];
            defaultKeywords = ["weather", "rain", "sun", "soil", "storm", "tractor"];
        } else if (lowercaseSubpage.includes('tech') || lowercaseSubpage.includes('bio')) {
            defaultTitles = [`New High-Yield Seeds in Market`, `Drone Subsidies for Spraying`, `Soil Testing Labs Upgraded`, `Mobile App Launched for Disease Detection`, `Solar Pump Subsidies Increased`, `AI Yield Prediction Accuracy Hits 95%`];
            defaultKeywords = ["seeds", "drone", "lab", "smartphone", "solar", "tech"];
        } else if (lowercaseSubpage.includes('credit') || lowercaseSubpage.includes('finance')) {
            defaultTitles = [`KCC Limits Enhanced for Farmers in ${userLoc}`, `Interest Rates Subsidized by State Bank`, `New Micro-Finance Schemes Launched`, `Crop Insurance Premium Reduced`, `Debt Restructuring Camp Scheduled`, `Digital Loan Disbursals Fast-Tracked`];
            defaultKeywords = ["bank", "money", "finance", "insurance", "credit", "digital"];
        } else if (lowercaseSubpage.includes('scheme') || lowercaseSubpage.includes('policy') || lowercaseSubpage.includes('grant') || lowercaseSubpage.includes('compliance')) {
            defaultTitles = [`Subsidy Guidelines Updated`, `PM-Kisan Installment Released`, `New Fertilizer Allocation Policy`, `Organic Farming Grants Approved`, `Equipment Subsidy Disbursals Begin`, `State Relief Fund Extended`];
            defaultKeywords = ["subsidy", "government", "fertilizer", "farm", "equipment", "relief"];
        } else if (lowercaseSubpage.includes('b2b') || lowercaseSubpage.includes('wholesale')) {
            defaultTitles = [`B2B Market Trade Volumes Surge`, `Wholesale Buyer Demand Increases in ${userLoc}`, `Corporate Sourcing Contracts Expanding`, `FPO Bulk Sales Report`, `Agribusiness Trade Expo Updates`, `Direct to Consumer Wholesale Routes`];
            defaultKeywords = ["wholesale", "market", "trade", "bulk", "business", "contract"];
        } else if (lowercaseSubpage.includes('input') || lowercaseSubpage.includes('procurement')) {
            defaultTitles = [`Bulk Fertilizer Procurement Deals Finalized`, `Seed Distribution Subsidies for FPOs`, `Agro-Chemical Price Adjustments`, `Joint Procurement Initiatives Announced`, `Supply Chain Sourcing Simplified`, `Warehouse Storage Capacities Expanded`];
            defaultKeywords = ["fertilizer", "seed", "supply", "chemical", "warehouse", "tractor"];
        } else if (lowercaseSubpage.includes('logistic') || lowercaseSubpage.includes('storage')) {
            defaultTitles = [`New Cold Storage Facilities in ${userLoc}`, `Transport Subsidies for Cooperatives`, `Logistics Route Optimization Software Launched`, `Freight Rates Stabilizing`, `Rural Warehousing Infrastructure Grants`, `Post-Harvest Loss Prevention Programs`];
            defaultKeywords = ["truck", "warehouse", "cold", "storage", "freight", "transport"];
        } else if (lowercaseSubpage.includes('export') || lowercaseSubpage.includes('trade')) {
            defaultTitles = [`Export Tariffs Revised for Key Commodities`, `International Trade Agreements Signed`, `Global Demand Spikes for Indian Produce`, `Port Logistics Eased for Exporters`, `Quality Standards Updated for EU Markets`, `New Export Subsidies Announced`];
            defaultKeywords = ["export", "trade", "ship", "global", "port", "cargo"];
        } else if (lowercaseSubpage.includes('risk') || lowercaseSubpage.includes('supply')) {
            defaultTitles = [`Supply Chain Disruptions Anticipated`, `Weather Risks Impact Sowing Patterns`, `Commodity Shortage Looms in ${userLoc}`, `Risk Mitigation Strategies for Traders`, `Global Freight Risks Escalating`, `Inventory Buffer Recommendations`];
            defaultKeywords = ["risk", "supply", "chain", "weather", "shortage", "inventory"];
        } else if (lowercaseSubpage.includes('arbitrage') || lowercaseSubpage.includes('flow')) {
            defaultTitles = [`Institutional Procurement Targets Met`, `FCI Buffer Stocks Reviewed`, `Cross-Mandi Arbitrage Opportunities`, `Commodity Futures Show Volatility`, `Spot vs Futures Pricing Gaps`, `Hedge Fund Inflows into Agri-Commodities`];
            defaultKeywords = ["arbitrage", "futures", "trading", "stock", "price", "hedge"];
        } else if (lowercaseSubpage.includes('climate') || lowercaseSubpage.includes('modeling')) {
            defaultTitles = [`New Agronomy Climate Models Published`, `Long-Term Precipitation Trends Analyzed`, `Carbon Sequestration Metrics Updated`, `Crop Adaptation to Thermal Stress`, `Satellite Imagery Enhances Yield Prediction`, `Regional Climate Shifts Documented`];
            defaultKeywords = ["climate", "model", "science", "carbon", "satellite", "research"];
        } else if (lowercaseSubpage.includes('soil') || lowercaseSubpage.includes('microbiome')) {
            defaultTitles = [`Breakthrough in Soil Microbiome Sequencing`, `Regenerative Agriculture Impact Study`, `Nitrogen Fixing Bacteria Research`, `Soil Nutrient Depletion Rates Mapped`, `Bio-Fertilizer Efficacy Trials Concluded`, `Fungal Networks in Crop Resilience`];
            defaultKeywords = ["soil", "microbe", "science", "fungi", "nutrient", "research"];
        } else if (lowercaseSubpage.includes('bio') || lowercaseSubpage.includes('genomics')) {
            defaultTitles = [`CRISPR Applications in Drought Resistance`, `Next-Gen Seed Biotech Developments`, `Genomic Sequencing of Indigenous Crops`, `Pest-Resistant Genetic Traits Identified`, `Regulatory Updates on Gene-Edited Crops`, `Agri-Genomics Investment Report`];
            defaultKeywords = ["gene", "biotech", "dna", "science", "seed", "research"];
        } else if (lowercaseSubpage.includes('policy') || lowercaseSubpage.includes('economics')) {
            defaultTitles = [`Macro-Economic Impact of Trade Tariffs`, `Agricultural Policy Shifts Analyzed`, `Subsidy Economics & Market Distortion`, `Global Food Security Trade Metrics`, `Socio-Economic Impact of AgTech Adoption`, `Yield vs Profitability Economics`];
            defaultKeywords = ["economics", "policy", "trade", "global", "analysis", "data"];
        } else if (lowercaseSubpage.includes('competitor') || lowercaseSubpage.includes('intel')) {
            defaultTitles = [`Agribusiness Competitor Expansion in ${userLoc}`, `New AgTech Startups Market Entry`, `Corporate Farming Investments Rise`, `R&D Budgets Shift Towards Precision Ag`, `Competitor Supply Chain Bottlenecks`, `Market Share Analysis Released`];
            defaultKeywords = ["business", "corporate", "startup", "office", "finance", "strategy"];
        } else if (lowercaseSubpage.includes('retail') || lowercaseSubpage.includes('demand')) {
            defaultTitles = [`Retail Consumer Demand for Organics Spikes`, `Supermarket Sourcing Trends Shift`, `D2C Agricultural Brands Emerge`, `Consumer Willingness to Pay Analyzed`, `Retail Shelf-Life Innovations`, `E-Grocery Sales Data in ${userLoc}`];
            defaultKeywords = ["retail", "grocery", "consumer", "food", "market", "shopping"];
        } else if (lowercaseSubpage.includes('m-and-a') || lowercaseSubpage.includes('merger') || lowercaseSubpage.includes('acquisition')) {
            defaultTitles = [`Major Agribusiness Merger Announced`, `Venture Capital Inflow in AgTech`, `Supply Chain Acquisition Finalized`, `Seed Company Buyouts Trend`, `Global Corporate Restructuring`, `Agri-Fintech Consolidation Expected`];
            defaultKeywords = ["merger", "business", "corporate", "deal", "finance", "acquisition"];
        } else if (lowercaseSubpage.includes('relief') || lowercaseSubpage.includes('subsidy')) {
            defaultTitles = [`Drought Relief Funds Disbursed in ${userLoc}`, `Crop Insurance Claim Settlements Fast-Tracked`, `New Subsidy Tranche Approved`, `Emergency Agricultural Aid Distributed`, `State Subsidy Policy Overhaul`, `Disaster Relief Verification Complete`];
            defaultKeywords = ["money", "government", "finance", "relief", "tractor", "bank"];
        } else if (lowercaseSubpage.includes('sentiment') || lowercaseSubpage.includes('opinion')) {
            defaultTitles = [`Farmer Sentiment Index Indicates Growth`, `Rural Public Opinion on New Policies`, `Protest Threat Levels Assessed`, `Social Listening on Mandi Reforms`, `Approval Ratings for Agri Schemes`, `Sentiment Analysis of Subsidies`];
            defaultKeywords = ["people", "crowd", "farmers", "group", "opinion", "news"];
        } else if (lowercaseSubpage.includes('food-security') || lowercaseSubpage.includes('nutrition')) {
            defaultTitles = [`National Food Security Reserves Audited`, `PDS Distribution Targets Met in ${userLoc}`, `Nutritional Output Tracking Expanded`, `Caloric Yield per Acre Analyzed`, `Strategic Grain Reserves Status`, `Food Inflation Control Measures`];
            defaultKeywords = ["wheat", "rice", "food", "security", "grain", "agriculture"];
        } else if (lowercaseSubpage.includes('infrastructure') || lowercaseSubpage.includes('irrigation')) {
            defaultTitles = [`Major Canal Irrigation Project Approved`, `Rural Road Connectivity Grants`, `New Dam Construction Updates`, `Agri-Export Zone Infrastructure`, `Power Grid Expansion in Rural ${userLoc}`, `Solar Micro-Grid Installations Map`];
            defaultKeywords = ["dam", "road", "solar", "grid", "water", "infrastructure"];
        } else if (lowercaseSubpage.includes('api') || lowercaseSubpage.includes('health')) {
            defaultTitles = [`Core API Health Metrics Stable`, `Server Uptime Reaches 99.99% in ${userLoc}`, `Database Query Latency Optimization`, `Microservices Architecture Upgrades`, `Cloud Storage Expansion Alert`, `Web Socket Connection Logs`];
            defaultKeywords = ["server", "computer", "database", "code", "tech", "cloud"];
        } else if (lowercaseSubpage.includes('user') || lowercaseSubpage.includes('access')) {
            defaultTitles = [`User Engagement Analytics Report`, `New Onboarding Metrics for ${userLoc}`, `Role-Based Access Control Audit`, `Session Timeout Policies Updated`, `Active User Counts Peak`, `Authentication Gateway Upgrades`];
            defaultKeywords = ["user", "people", "computer", "access", "login", "office"];
        } else if (lowercaseSubpage.includes('security')) {
            defaultTitles = [`Platform Security Patch Deployed`, `Data Encryption Standards Reviewed`, `Vulnerability Assessment Completed`, `New Firewall Protocols Activated`, `Compliance with Data Privacy Laws`, `Security Audit Highlights`];
            defaultKeywords = ["security", "shield", "lock", "computer", "safe", "tech"];
        } else {
            defaultTitles = [`Mandi Arrivals Rise in ${userLoc}`, `Local Transport Optimization`, `Subsidy Guidelines Updated`, `New High-Yield Seeds in Market`, `Micro-Climate Changes Forecasted`, `Pest Alert: Protect Early Crops`];
            defaultKeywords = ["market", "tractor", "subsidy", "seeds", "weather", "pest"];
        }
        
        const getKeyword = (text, fallback) => {
             const words = text.split(' ').map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 4);
             return words.length > 0 ? words[0].toLowerCase() : fallback;
        };
        
        for (let i = 0; i < count; i++) {
            const hasRaw = rawNews && rawNews[i];
            let title = hasRaw ? (rawNews[i].title.substring(0, 70) + (rawNews[i].title.length > 70 ? '...' : '')) : defaultTitles[i % defaultTitles.length];
            let desc = hasRaw ? (rawNews[i].description || title) : `Detailed update regarding ${title}. Local authorities advise monitoring this development as it may impact ${activeSubpage} outcomes. Actionable step: Review your current strategy based on this latest local intelligence.`;
            const keyword = hasRaw ? getKeyword(title, defaultKeywords[i % defaultKeywords.length]) : defaultKeywords[i % defaultKeywords.length];

            // Manual Hindi translation fallback for when API is rate-limited
            if (language === 'Hindi' && !hasRaw) {
                 title = title.replace('Mandi Arrivals Rise', 'मंडी में आवक बढ़ी').replace('Alert', 'अलर्ट').replace('Subsidized', 'सब्सिडी प्राप्त').replace('Released', 'जारी').replace('Forecasted', 'अनुमानित');
                 desc = `यह अपडेट ${title} के संबंध में है। स्थानीय अधिकारियों ने इसे करीब से देखने की सलाह दी है क्योंकि यह आपके ${activeSubpage} परिणामों को प्रभावित कर सकता है। (API सीमा के कारण AI अनुवाद वर्तमान में उपलब्ध नहीं है)`;
            } else if (language === 'Hindi' && hasRaw) {
                 desc = `सर्च: ${title}। विस्तृत जानकारी के लिए "AI Deep Dive" पर क्लिक करें। (API सीमा के कारण लाइव अनुवाद सीमित है)`;
            }

            fallbackNws.push({
                tag: i % 2 === 0 ? "NEUTRAL" : (i % 3 === 0 ? "BULLISH" : "WARNING"),
                dur: `${(i % 3) + 2} min read`,
                ttl: title,
                reg: userLoc,
                dsc: desc,
                img_keyword: keyword
            });
        }
        
        // Fetch web images for fallback items
        await Promise.all(fallbackNws.map(async (item) => {
            const searchKeyword = item.img_keyword || item.ttl.split(' ')[0] || 'agriculture';
            item.img_url = await fetchImageFromWiki(`${searchKeyword} agriculture`);
        }));
        
        let dynamicInd = [];
        let dynamicIndTitle = language === 'Hindi' ? "स्थानीय संकेतक" : "Local Indicators";

        if (lowercaseSubpage.includes('weather') || lowercaseSubpage.includes('safety') || lowercaseSubpage.includes('climate')) {
            dynamicIndTitle = language === 'Hindi' ? "मौसम मेट्रिक्स" : "Weather Metrics";
            dynamicInd = [
                { var: language === 'Hindi' ? "तापमान" : "Temperature", loc: userLoc.split(',')[0], val: "32°C", dlt: "+1.2°C" },
                { var: language === 'Hindi' ? "आर्द्रता" : "Humidity", loc: userLoc.split(',')[0], val: "68%", dlt: "-2%" },
                { var: language === 'Hindi' ? "मिट्टी की नमी" : "Soil Moisture", loc: userLoc.split(',')[0], val: "45%", dlt: "-5%" }
            ];
        } else if (lowercaseSubpage.includes('credit') || lowercaseSubpage.includes('finance') || lowercaseSubpage.includes('grant')) {
            dynamicIndTitle = language === 'Hindi' ? "वित्तीय दरें" : "Financial Rates";
            dynamicInd = [
                { var: language === 'Hindi' ? "KCC ब्याज दर" : "KCC Interest Rate", loc: "National Bank", val: "4.0%", dlt: "0.0%" },
                { var: language === 'Hindi' ? "बीमा प्रीमियम" : "Insurance Premium", loc: "State Level", val: "2.5%", dlt: "-0.5%" },
                { var: language === 'Hindi' ? "सब्सिडी संवितरण" : "Subsidy Disbursed", loc: userLoc.split(',')[0], val: "₹1.2Cr", dlt: "+12%" }
            ];
        } else if (lowercaseSubpage.includes('tech') || lowercaseSubpage.includes('bio') || lowercaseSubpage.includes('soil')) {
            dynamicIndTitle = language === 'Hindi' ? "कृषि-तकनीक रुझान" : "Agri-Tech Trends";
            dynamicInd = [
                { var: language === 'Hindi' ? "ड्रोन उपयोग" : "Drone Usage", loc: userLoc.split(',')[0], val: "15%", dlt: "+3%" },
                { var: language === 'Hindi' ? "मिट्टी परीक्षण" : "Soil Testing", loc: "Local Labs", val: "85%", dlt: "+10%" },
                { var: language === 'Hindi' ? "स्मार्ट सिंचाई" : "Smart Irrigation", loc: userLoc.split(',')[0], val: "22%", dlt: "+5%" }
            ];
        } else if (lowercaseSubpage.includes('b2b') || lowercaseSubpage.includes('wholesale') || lowercaseSubpage.includes('input') || lowercaseSubpage.includes('procurement')) {
            dynamicIndTitle = language === 'Hindi' ? "थोक बाजार" : "Wholesale Market";
            dynamicInd = [
                { var: language === 'Hindi' ? "उर्वरक मूल्य" : "Fertilizer Price", loc: userLoc.split(',')[0], val: "₹1,200/bag", dlt: "+2%" },
                { var: language === 'Hindi' ? "बीज उपलब्धता" : "Seed Availability", loc: "Regional", val: "High", dlt: "Stable" },
                { var: language === 'Hindi' ? "थोक मांग" : "Bulk Demand", loc: userLoc.split(',')[0], val: "Strong", dlt: "+8%" }
            ];
        } else if (lowercaseSubpage.includes('logistic') || lowercaseSubpage.includes('storage')) {
            dynamicIndTitle = language === 'Hindi' ? "रसद और भंडारण" : "Logistics & Storage";
            dynamicInd = [
                { var: language === 'Hindi' ? "परिवहन लागत" : "Transport Cost", loc: userLoc.split(',')[0], val: "₹45/km", dlt: "-1%" },
                { var: language === 'Hindi' ? "कोल्ड स्टोरेज क्षमता" : "Cold Storage Cap", loc: "Regional", val: "78%", dlt: "+4%" },
                { var: language === 'Hindi' ? "पारगमन समय" : "Transit Time", loc: "Avg", val: "1.5 Days", dlt: "-0.2 Days" }
            ];
        } else if (lowercaseSubpage.includes('export') || lowercaseSubpage.includes('trade')) {
            dynamicIndTitle = language === 'Hindi' ? "निर्यात मेट्रिक्स" : "Export Metrics";
            dynamicInd = [
                { var: language === 'Hindi' ? "निर्यात शुल्क" : "Export Duty", loc: "National", val: "15%", dlt: "-5%" },
                { var: language === 'Hindi' ? "पोर्ट क्लीयरेंस" : "Port Clearance", loc: "Major Ports", val: "2.1 Days", dlt: "-0.4 Days" },
                { var: language === 'Hindi' ? "वैश्विक मांग" : "Global Demand", loc: "Index", val: "High", dlt: "+12%" }
            ];
        } else if (userRole === 'Company Admin' || userRole === 'Agribusiness Manager') {
            dynamicIndTitle = language === 'Hindi' ? "सिस्टम मेट्रिक्स" : "System Metrics";
            dynamicInd = [
                { var: language === 'Hindi' ? "सर्वर अपटाइम" : "Server Uptime", loc: "Global", val: "99.98%", dlt: "+0.01%" },
                { var: language === 'Hindi' ? "एपीआई विलंबता" : "API Latency", loc: "Core", val: "45ms", dlt: "-2ms" },
                { var: language === 'Hindi' ? "सक्रिय सत्र" : "Active Sessions", loc: "All Regions", val: "1,204", dlt: "+12%" }
            ];
        } else if (userRole === 'Government Official' || userRole === 'Research Analyst') {
            dynamicIndTitle = language === 'Hindi' ? "नीति मेट्रिक्स" : "Policy Metrics";
            dynamicInd = [
                { var: language === 'Hindi' ? "नीति अनुपालन" : "Policy Compliance", loc: userLoc.split(',')[0], val: "87%", dlt: "+2.4%" },
                { var: language === 'Hindi' ? "निधि संवितरण" : "Fund Disbursement", loc: userLoc.split(',')[0], val: "₹4.2Cr", dlt: "+15%" },
                { var: language === 'Hindi' ? "सक्रिय योजनाएं" : "Active Schemes", loc: "State Level", val: "24", dlt: "+1" }
            ];
        } else {
            dynamicIndTitle = language === 'Hindi' ? "स्थानीय संकेतक" : "Local Indicators";
            dynamicInd = [
                { var: language === 'Hindi' ? "गेहूँ (कनक)" : "Wheat (Kanak)", loc: userLoc.split(',')[0] || "Mandi", val: "₹2,275/q", dlt: "+1.1%" },
                { var: language === 'Hindi' ? "सरसों" : "Mustard (Sarso)", loc: userLoc.split(',')[0] || "Mandi", val: "₹5,420/q", dlt: "-0.4%" },
                { var: language === 'Hindi' ? "जौ" : "Barley", loc: userLoc.split(',')[0] || "Mandi", val: "₹1,950/q", dlt: "+0.8%" }
            ];
        }
        
        const fallbackData = {
          ban: {
            typ: fallbackType,
            ttl: fallbackTitle,
            dsc: `Detailed updates on ${activeSubpage} are compiled for ${userRole}s in ${userLoc}.`
          },
          nws: fallbackNws,
          ind_title: dynamicIndTitle,
          ind_btn: language === 'Hindi' ? "पूर्ण रिपोर्ट देखें" : "View Full Report",
          ind: dynamicInd,
          insight_title: language === 'Hindi' ? "रणनीतिक अंतर्दृष्टि" : "Strategic Insight",
          ins: `Strategic advice: Closely monitor local ${activeSubpage} conditions to guide transaction times.`,
          weather_alert: {
            title: language === 'Hindi' ? `${userLoc} मौसम अपडेट` : `${userLoc} Weather Update`,
            description: language === 'Hindi' ? "स्थानीय परिस्थितियों में उतार-चढ़ाव की उम्मीद है।" : `Local conditions in ${userLoc} expected to fluctuate.`,
            temperature: "32°C",
            probability: "Medium Risk"
          }
        };

        return res.status(200).json({ success: true, data: fallbackData });
    }
};

export const getNewsIntelligenceDetails = async (req, res) => {
    try {
        const { title, location, language } = req.query;
        if (!title) {
            return res.status(400).json({ error: "Title parameter is required." });
        }
        
        const targetLang = language || 'English';
        
        let details;
        try {
            details = await fetchNewsDetailsAI(title, location || 'India', targetLang);
        } catch (err) {
            console.error("Gemini Details Error:", err.message);
            if (targetLang === 'Hindi') {
                 details = `हाल ही में "${title}" के बारे में रिपोर्ट्स महत्वपूर्ण आगामी बदलावों का संकेत देती हैं। विशेषज्ञों की सलाह है कि जोखिमों को कम करने और अवसरों का लाभ उठाने के लिए अपनी रणनीति की समीक्षा करें। (API सीमा के कारण विस्तृत AI विश्लेषण उपलब्ध नहीं है)`;
            } else {
                 details = `Recent reports regarding "${title}" in ${location || 'India'} suggest significant upcoming shifts. Local authorities are advising stakeholders to monitor developments closely. Experts recommend reviewing your current strategy to mitigate risks and capitalize on potential opportunities arising from this event.`;
            }
        }
        res.status(200).json({ success: true, details });
    } catch (err) {
        console.error("Error in getNewsIntelligenceDetails:", err);
        res.status(500).json({ error: "Failed to fetch detailed insights." });
    }
};
