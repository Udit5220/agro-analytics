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
      { label: "Market Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Live Mandi Prices", path: "live-prices", icon: "TrendingUp" },
      { label: "Price Trends", path: "price-trends", icon: "LineChart" },
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
      { label: "Weather Alerts", path: "weather-alerts", icon: "AlertTriangle" },
    ],
    "marketplace": [
      { label: "Marketplace Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Browse Listings", path: "listings", icon: "Store" },
      { label: "Sell Produce", path: "sell", icon: "Plus" },
      { label: "Buyer Requirements", path: "buyer-requirements", icon: "ClipboardList" },
      { label: "Buy Inputs", path: "buy-inputs", icon: "ShoppingBag" },
      { label: "My Listings", path: "my-listings", icon: "Package" },
      { label: "My Orders", path: "orders", icon: "Truck" },
      { label: "Payments & Invoices", path: "invoices", icon: "Receipt" },
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
