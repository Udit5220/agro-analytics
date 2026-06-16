/**
 * Static Data Layer for AgroSense Dashboard Modules
 * Decouples navigation sidebar links, user profiles, and mock crop telemetry details from layout code.
 */
const userRole = localStorage.getItem('userRole') || 'Farmer';

export const dashboardContent = {
  // User Profile details displayed in sidebar bottom
  userProfile: {
    name: userRole === 'Farmer' ? "Suresh Kumar" : "System User",
    hindiName: "सुरेश कुमार",
    role: userRole,
    hindiRole: "उपयोगकर्ता",
    location: "Faridabad, Haryana",
    avatar: userRole === 'Farmer' ? "SK" : "SU",
  },

  // Sidebar menus dynamically mapped per active AI Tool module ID
  sidebarMenus: {
    "crop-recommendation": [
      { label: "Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Crop Ranking Engine", path: "crop-ranking", icon: "Award" },
      {
        label: "Seasonal Calendar",
        path: "seasonal-calendar",
        icon: "CalendarDays",
      },
      { label: "Yield & ROI", path: "yield-roi", icon: "CircleDollarSign" },
      { label: "Multi-crop Compare", path: "crop-compare", icon: "Columns" },
      { label: "Crop Rotation Planner", path: "crop-rotation", icon: "RefreshCcw" },
      { label: "Water Intelligence", path: "water-intelligence", icon: "Droplets" },
      { label: "Climate Risk Simulator", path: "climate-risk", icon: "CloudLightning" },
      // { label: "Pest & Disease Risk", path: "pest-risk", icon: "ShieldAlert" },
      // { label: "Market Demand", path: "market-demand", icon: "TrendingUp" },
      { label: "Farm Journal", path: "farm-journal", icon: "BookOpen" },
      // { label: 'Settings', path: 'settings', icon: 'Settings' }
    ],
    "disease-detection": [
      { label: "Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Leaf Scanner", path: "leaf-scanner", icon: "Camera" },
      { label: "Risk Prediction", path: "risk-prediction", icon: "AlertTriangle" },
      { label: "Regional Heatmap", path: "heatmap", icon: "Map" },
      { label: "Treatment & Spray Advisor", path: "treatment", icon: "Shield" },
      { label: "Crop Lifecycle Risks", path: "lifecycle", icon: "Sprout" },
      { label: "Historical Outbreaks", path: "history", icon: "History" },
      { label: "Disease Alert Center", path: "alerts", icon: "Bell" },
    ],
    "ai-suggestion": [
      { label: "AI Assistant", path: "", icon: "MessageSquare" },
      { label: "Irrigation Scheduler", path: "irrigation", icon: "Droplets" },
      { label: "Fertilizer Planner", path: "fertilizer", icon: "Beaker" },
      // { label: "Satellite Field View", path: "satellite", icon: "Satellite" },
      {
        label: "Mandi Price Tracker",
        path: "mandi-tracker",
        icon: "TrendingUp",
      },
      { label: "Lifecycle Guidance", path: "lifecycle", icon: "Sprout" },
      // { label: "Scheme Finder", path: "scheme-finder", icon: "Award" },
    ],
    "ai-assistant-1": [
      { label: "Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Chat Workspace", path: "chat-workspace", icon: "MessageSquare" },
      { label: "Prompt Library", path: "prompt-library", icon: "BookOpen" },
      { label: "Recommendation", path: "recommendation", icon: "Sparkles" },
      { label: "Chat History", path: "chat-history", icon: "History" },
      { label: "Saved Insight", path: "saved-insight", icon: "Bookmark" },
      { label: "Reports Center", path: "reports-center", icon: "FileText" },
    ],
    "market-intelligence": [
      { label: "Market Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Live Mandi Prices", path: "live-prices", icon: "TrendingUp" },
      { label: "Price Trends", path: "price-trends", icon: "LineChart" },
      { label: "Multi-Crop Compare", path: "commodity-compare", icon: "GitCompare" },
      { label: "Nearby Markets", path: "nearby-markets", icon: "MapPin" },
      { label: "My Watchlist", path: "watchlist", icon: "Bookmark" },
      { label: "Price Alerts", path: "price-alerts", icon: "Bell" },
    ],
    "weather-reservoir": [
      { label: "Weather Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "7-Day Forecast", path: "forecast", icon: "CalendarDays" },
      { label: "Rainfall Forecast", path: "rainfall", icon: "CloudRain" },
      { label: "Radar & Maps", path: "radar", icon: "Radar" },
      { label: "Reservoir Levels", path: "reservoirs", icon: "Waves" },
      { label: "Irrigation Advisory", path: "irrigation", icon: "Droplets" },
      {
        label: "Weather Alerts",
        path: "weather-alerts",
        icon: "AlertTriangle",
      },
    ],
    marketplace: [
      { label: "Marketplace Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Browse Listings", path: "listings", icon: "Store" },
      { label: "Sell Produce", path: "sell", icon: "Plus" },
      {
        label: "Buyer Requirements",
        path: "buyer-requirements",
        icon: "ClipboardList",
      },
      { label: "Buy Inputs", path: "buy-inputs", icon: "ShoppingBag" },
      { label: "My Listings", path: "my-listings", icon: "Package" },
      { label: "My Orders", path: "orders", icon: "Truck" },
      { label: "Payments & Invoices", path: "invoices", icon: "Receipt" },
    ],
    "learning-hub": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      {
        label: "Bilingual Lecture Hall",
        path: "lectures",
        icon: "GraduationCap",
      },
      { label: "Crop Knowledge Base", path: "kb", icon: "BookOpen" },
      { label: "Interactive Quizzes", path: "quizzes", icon: "Award" },
      { label: "Expert Webinars", path: "webinars", icon: "CalendarClock" },
      { label: "Virtual Farm Tours", path: "tours", icon: "View" }
    ],
    "gov-schemes": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Scheme Matcher", path: "matching", icon: "FileText" },
      { label: "Subsidy Tracker", path: "subsidies", icon: "CircleDollarSign" },
      { label: "Application Center", path: "applications", icon: "MousePointerClick" },
      { label: "State Grants", path: "state-grants", icon: "Landmark" },
      { label: "State Allocations", path: "budget", icon: "PieChart" }
    ],
    "research-ai": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Research Summary", path: "summary", icon: "FileText" },
      { label: "Proposal Drafting", path: "drafting", icon: "FileEdit" },
      { label: "Translation Center", path: "translate", icon: "Languages" },
      { label: "Predictor Models", path: "models", icon: "Network" }
    ],
    "news-intel": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Mandi News Feed", path: "mandi", icon: "Newspaper" },
      { label: "Policy Updates", path: "policies", icon: "BookOpen" },
      { label: "Market Impact Ratings", path: "impact", icon: "Activity" },
      { label: "AgriTech Trends", path: "agritech", icon: "Cpu" },
      { label: "Export Trends", path: "exports", icon: "Ship" }
    ] 
  },

  // Telemetry & recommendation metrics for the Crop Recommendation view
  cropRecommendationData: {
    // Current auto-detected banner details
    detectedBanner: {
      titleEnglish: "Kharif Season Detected",
      titleHindi: "खरीफ मौसम",
      location: "Faridabad, Haryana",
      badgeText: "Auto-detected",
      details:
        "Based on high temperature, soil moisture, and seasonal onset telemetry.",
    },

    // Top Recommended Crops Cards
    recommendedCrops: [
      {
        id: "crop-rice",
        name: "Rice (Paddy)",
        hindiName: "धान (चावल)",
        matchScore: 92,
        estimatedYield: "22 - 26 qtl/acre",
        roiEstimate: "₹48,500/acre",
        riskLevel: "Low Risk",
        riskColor: "green",
        isBestMatch: true,
        bgGradient: "from-emerald-500/10 to-teal-500/5",
        details:
          "Ideal soil moisture profile and forecast precipitation match perfectly.",
      },
      {
        id: "crop-cotton",
        name: "Cotton",
        hindiName: "कपास",
        matchScore: 85,
        estimatedYield: "8 - 10 qtl/acre",
        roiEstimate: "₹42,000/acre",
        riskLevel: "Low Risk",
        riskColor: "green",
        isBestMatch: false,
        bgGradient: "from-sky-500/10 to-indigo-500/5",
        details:
          "Excellent soil temperature profile but demands slightly higher irrigation cycles.",
      },
      {
        id: "crop-maize",
        name: "Maize (Corn)",
        hindiName: "मक्का",
        matchScore: 78,
        estimatedYield: "18 - 22 qtl/acre",
        roiEstimate: "₹34,000/acre",
        riskLevel: "Medium Risk",
        riskColor: "yellow",
        isBestMatch: false,
        bgGradient: "from-amber-500/10 to-orange-500/5",
        details:
          "Moderate nitrogen levels required. Pay attention to sudden rain drainage.",
      },
    ],

    // Realtime weather sensor indices
    weatherSummary: {
      temperature: "32°C",
      temperatureSub: "Optimal Soil Temp",
      humidity: "68%",
      humiditySub: "Adequate Moisture",
      rainfall: "12 mm",
      rainfallSub: "Mild showers forecast",
    },
  },
};
