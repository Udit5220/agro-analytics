/**
 * Static Data Layer for AgroSense Dashboard Modules
 * Decouples navigation sidebar links, user profiles, and mock crop telemetry details from layout code.
 */
export const dashboardContent = {
  // User Profile details displayed in sidebar bottom
  userProfile: {
    name: "Suresh Kumar",
    hindiName: "सुरेश कुमार",
    role: "Farmer",
    hindiRole: "किसान",
    location: "Faridabad, Haryana",
    avatar: "SK",
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
      { label: "Pest & Disease Risk", path: "pest-risk", icon: "ShieldAlert" },
      { label: "Market Demand", path: "market-demand", icon: "TrendingUp" },
      // { label: 'Settings', path: 'settings', icon: 'Settings' }
    ],
    "disease-detection": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Risk Prediction Engine", path: "risk-prediction", icon: "AlertTriangle" },
      { label: "Region Heatmap", path: "heatmap", icon: "Map" },
      { label: "Alert Management", path: "alerts", icon: "Bell" },
      { label: "Treatment Advisor", path: "treatment", icon: "ShieldPlus" },
      { label: "Crop Lifecycle", path: "lifecycle", icon: "Sprout" },
      { label: "Outbreak History", path: "history", icon: "History" }
    ],
    "ai-suggestion": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Agronomist Chat", path: "chat", icon: "Bot" },
      { label: "Irrigation Planner", path: "irrigation", icon: "Droplets" },
      { label: "Fertilizer Scheduler", path: "fertilizer", icon: "Sprout" },
      { label: "Climate Alerts", path: "climate", icon: "CloudLightning" }
    ],
    "market-intelligence": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Price Tracker", path: "tracker", icon: "TrendingUp" },
      { label: "Mandi Comparison", path: "compare", icon: "Columns" },
      { label: "Price Projections", path: "forecast", icon: "LineChart" },
      { label: "Volume Analytics", path: "volume", icon: "BarChart" }
    ],
    "weather-reservoir": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Weather Radar", path: "radar", icon: "CloudSun" },
      { label: "Reservoir Monitor", path: "reservoirs", icon: "Activity" },
      { label: "Soil Moisture Tracker", path: "moisture", icon: "Droplets" }
    ],
    "gov-schemes": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Scheme Matcher", path: "matching", icon: "FileText" },
      { label: "Subsidy Tracker", path: "subsidies", icon: "TrendingUp" },
      { label: "Application Center", path: "applications", icon: "Folder" }
    ],
    "research-ai": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Document RAG Engine", path: "rag", icon: "FileText" },
      { label: "Pathology Search", path: "pathology", icon: "Search" },
      { label: "Translation Center", path: "translate", icon: "Globe" }
    ],
    "news-intel": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Mandi News Feed", path: "mandi", icon: "Newspaper" },
      { label: "Policy Updates", path: "policies", icon: "FileText" },
      { label: "Market Impact Ratings", path: "impact", icon: "Activity" }
    ],
    "marketplace": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Produce Trading", path: "produce", icon: "Store" },
      { label: "Input Purchases", path: "inputs", icon: "ShoppingBag" },
      { label: "Logistics Tracker", path: "logistics", icon: "Tractor" }
    ],
    "learning-hub": [
      { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Bilingual Lecture Hall", path: "lectures", icon: "GraduationCap" },
      { label: "Crop Knowledge Base", path: "kb", icon: "BookOpen" },
      { label: "Interactive Quizzes", path: "quizzes", icon: "Award" }
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
      windSpeed: "14 km/h",
      windSpeedSub: "Gentle Westerly Wind",
    },
  },
};
