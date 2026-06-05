/**
 * Static Content Layer for AgroIndia Landing Page
 * Decouples static marketing texts, navigation paths, and platform flow details from the component layout.
 */
export const homeContent = {
  // Navigation Bar Links
  navbarLinks: [
    { label: 'Platform', href: '#platform' },
    { label: 'AI Tools', href: '#ai-tools' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Resources', href: '#resources' }
  ],

  // Hero Section Header Data
  hero: {
    badge: 'AI-Powered Agriculture Platform',
    titlePrefix: 'New Era of Farming —',
    titleHighlight: 'Powered by AI',
    subtitle: 'Optimize your crops, identify crop diseases in seconds, and secure premium yields with AgroIndia\'s cloud-native multi-model farming intelligence. Built by leading agronomists and AI researchers.',
    ctaPrimary: 'Get Started Free',
    ctaSecondary: 'Watch Demo'
  },

  // Floating Metrics Ribbon Data (4 Columns)
  metrics: [
    {
      value: '9',
      label: 'Crop Types Supported',
      subtext: 'Maize, Wheat, Rice, Sugarcane, etc.',
      icon: 'Wheat'
    },
    {
      value: '60+',
      label: 'AI Core Features',
      subtext: 'Predictive analytics & vision AI',
      icon: 'Cpu'
    },
    {
      value: '3',
      label: 'Active Seasons',
      subtext: 'Kharif, Rabi, and Zaid crops',
      icon: 'CalendarDays'
    },
    {
      value: '10K+',
      label: 'Registered Farmers',
      subtext: 'Active community and growing',
      icon: 'Users'
    }
  ],

  // AI Tools Module Grid Data (10 Cards representing the exact layout in Image 1)
  aiTools: [
    {
      id: 'ai-assistant',
      title: 'AI Agriculture Assistant',
      description: '24/7 conversational AI, 12 languages',
      icon: 'Bot',
      linkUrl: '/module/ai-assistant-1',
      badgeText: 'Conversational'
    },
    {
      id: 'market-intel',
      title: 'Commodity Market Intelligence',
      description: '100+ crops, all exchanges + intl',
      icon: 'TrendingUp',
      linkUrl: '/module/market-intelligence',
      badgeText: 'Live Mandi'
    },
    {
      id: 'weather-intel',
      title: 'Weather & Reservoir Intel',
      description: 'Hyperlocal forecasts, 250+ reservoirs',
      icon: 'CloudSun',
      linkUrl: '/module/weather-reservoir',
      badgeText: 'Hyperlocal'
    },
    {
      id: 'gov-schemes',
      title: 'Government Scheme Center',
      description: '200+ schemes, eligibility AI',
      icon: 'FileText',
      linkUrl: '/module/gov-schemes',
      badgeText: 'Eligibility'
    },
    {
      id: 'research-ai',
      title: 'White Paper & Research AI',
      description: 'PDF analysis, RAG, multilingual',
      icon: 'Leaf',
      linkUrl: '/module/research-ai',
      badgeText: 'Pathology'
    },
    {
      id: 'disease-det',
      title: 'Disease Detection Module',
      description: 'CV model, 2,000+ diseases, 94% accuracy',
      icon: 'Bug',
      linkUrl: '/module/disease-detection',
      badgeText: 'Computer Vision'
    },
    {
      id: 'crop-rec',
      title: 'Smart Crop Recommendation',
      description: 'Soil + climate + market optimization',
      icon: 'Sprout',
      linkUrl: '/module/crop-recommendation',
      badgeText: 'Agronomic AI'
    },
    {
      id: 'news-intel',
      title: 'News Intelligence Module',
      description: '200+ sources, AI market impact',
      icon: 'Newspaper',
      linkUrl: '/module/news-intel',
      badgeText: 'Real-time'
    },
    {
      id: 'marketplace',
      title: 'Marketplace Module',
      description: 'B2B/B2C produce & input trading',
      icon: 'Store',
      linkUrl: '/module/marketplace',
      badgeText: 'Produce Trade'
    },
    {
      id: 'learning-hub',
      title: 'Learning Hub',
      description: '5,000+ videos, 12 languages',
      icon: 'GraduationCap',
      linkUrl: '/module/learning-hub',
      badgeText: 'Training'
    }
  ],

  // Linear Platform Workflow Sequence Data (5 Steps)
  platformFlow: [
    {
      step: 1,
      title: 'Weather Data',
      description: 'Continuous satellite & IoT telemetry feed.',
      icon: 'CloudSun'
    },
    {
      step: 2,
      title: 'ML Engine',
      description: 'Deep neural processing of soil & weather indices.',
      icon: 'Cpu'
    },
    {
      step: 3,
      title: 'Crop Insight',
      description: 'Predictive health scoring and nitrogen recommendations.',
      icon: 'Eye'
    },
    {
      step: 4,
      title: 'Multi-channel Alert',
      description: 'Urgent mobile push notifications, SMS, & dashboard alerts.',
      icon: 'Bell'
    },
    {
      step: 5,
      title: 'Higher Yield',
      description: 'Enhanced harvesting execution & revenue growth.',
      icon: 'Sparkles'
    }
  ]
};
