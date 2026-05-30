/**
 * Static Data Layer for AgroSense Dashboard Modules
 * Decouples navigation sidebar links, user profiles, and mock crop telemetry details from layout code.
 */
export const dashboardContent = {
  // User Profile details displayed in sidebar bottom
  userProfile: {
    name: 'Suresh Kumar',
    hindiName: 'सुरेश कुमार',
    role: 'Farmer',
    hindiRole: 'किसान',
    location: 'Faridabad, Haryana',
    avatar: 'SK'
  },

  // Sidebar menus dynamically mapped per active AI Tool module ID
  sidebarMenus: {
    'crop-recommendation': [
      { label: 'Dashboard', path: '', icon: 'LayoutDashboard' },
      { label: 'Crop Ranking Engine', path: 'crop-ranking', icon: 'Award' },
      { label: 'Seasonal Calendar', path: 'seasonal-calendar', icon: 'CalendarDays' },
      { label: 'Yield & ROI', path: 'yield-roi', icon: 'CircleDollarSign' },
      { label: 'Multi-crop Compare', path: 'crop-compare', icon: 'Columns' },
      { label: 'Pest & Disease Risk', path: 'pest-risk', icon: 'ShieldAlert' },
      { label: 'Market Demand', path: 'market-demand', icon: 'TrendingUp' },
      { label: 'Settings', path: 'settings', icon: 'Settings' }
    ],
    'disease-detection': [
      { label: 'Disease Scanner', path: '', icon: 'ScanFace' },
      { label: 'Infection History', path: 'history', icon: 'History' },
      { label: 'Pathogen Analytics', path: 'analytics', icon: 'BarChart3' },
      { label: 'Fungicide Guide', path: 'treatment', icon: 'ShieldPlus' },
      { label: 'Expert Consultation', path: 'experts', icon: 'MessageSquare' },
      { label: 'Settings', path: 'settings', icon: 'Settings' }
    ],
    'ai-suggestion': [
      { label: 'Agronomist Chat', path: '', icon: 'Bot' },
      { label: 'Irrigation Planner', path: 'irrigation', icon: 'Droplets' },
      { label: 'Fertilizer Scheduler', path: 'fertilizer', icon: 'Sprout' },
      { label: 'Climate Alerts', path: 'climate', icon: 'CloudLightning' },
      { label: 'Settings', path: 'settings', icon: 'Settings' }
    ]
  },

  // Telemetry & recommendation metrics for the Crop Recommendation view
  cropRecommendationData: {
    // Current auto-detected banner details
    detectedBanner: {
      titleEnglish: 'Kharif Season Detected',
      titleHindi: 'खरीफ मौसम',
      location: 'Faridabad, Haryana',
      badgeText: 'Auto-detected',
      details: 'Based on high temperature, soil moisture, and seasonal onset telemetry.'
    },

    // Top Recommended Crops Cards
    recommendedCrops: [
      {
        id: 'crop-rice',
        name: 'Rice (Paddy)',
        hindiName: 'धान (चावल)',
        matchScore: 92,
        estimatedYield: '22 - 26 qtl/acre',
        roiEstimate: '₹48,500/acre',
        riskLevel: 'Low Risk',
        riskColor: 'green',
        isBestMatch: true,
        bgGradient: 'from-emerald-500/10 to-teal-500/5',
        details: 'Ideal soil moisture profile and forecast precipitation match perfectly.'
      },
      {
        id: 'crop-cotton',
        name: 'Cotton',
        hindiName: 'कपास',
        matchScore: 85,
        estimatedYield: '8 - 10 qtl/acre',
        roiEstimate: '₹42,000/acre',
        riskLevel: 'Low Risk',
        riskColor: 'green',
        isBestMatch: false,
        bgGradient: 'from-sky-500/10 to-indigo-500/5',
        details: 'Excellent soil temperature profile but demands slightly higher irrigation cycles.'
      },
      {
        id: 'crop-maize',
        name: 'Maize (Corn)',
        hindiName: 'मक्का',
        matchScore: 78,
        estimatedYield: '18 - 22 qtl/acre',
        roiEstimate: '₹34,000/acre',
        riskLevel: 'Medium Risk',
        riskColor: 'yellow',
        isBestMatch: false,
        bgGradient: 'from-amber-500/10 to-orange-500/5',
        details: 'Moderate nitrogen levels required. Pay attention to sudden rain drainage.'
      }
    ],

    // Realtime weather sensor indices
    weatherSummary: {
      temperature: '32°C',
      temperatureSub: 'Optimal Soil Temp',
      humidity: '68%',
      humiditySub: 'Adequate Moisture',
      rainfall: '12 mm',
      rainfallSub: 'Mild showers forecast',
      windSpeed: '14 km/h',
      windSpeedSub: 'Gentle Westerly Wind'
    }
  }
};
