/**
 * Static Content Layer for AgroSense Landing Page
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
    subtitle: 'Optimize your crops, identify crop diseases in seconds, and secure premium yields with AgroSense\'s cloud-native multi-model farming intelligence. Built by leading agronomists and AI researchers.',
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

  // AI Tools Module Grid Data (3 Cards)
  aiTools: [
    {
      id: 'crop-rec',
      title: 'Smart Crop Recommendation',
      description: 'Analyze soil nitrogen, phosphorus, potassium, temperature, humidity, and pH levels to determine the highest yielding crop for your unique field topology.',
      badgeText: '20 Features',
      badgeColor: 'brand-accent',
      icon: 'Sprout',
      linkUrl: '/module/crop-recommendation'
    },
    {
      id: 'disease-det',
      title: 'Disease Detection',
      description: 'Upload high-resolution leaf photos to instantly diagnose bacterial, fungal, or viral infections using our custom convolutional neural networks.',
      badgeText: '15 Features',
      badgeColor: 'brand-light',
      icon: 'ShieldAlert',
      linkUrl: '/module/disease-detection'
    },
    {
      id: 'agri-sugg',
      title: 'AI Agriculture Suggestion',
      description: 'Receive real-time micro-climate warnings, irrigation timing insights, fertilizer schedules, and general agronomic guidelines powered by LLM agents.',
      badgeText: 'Beta Active',
      badgeColor: 'brand-accent',
      icon: 'Brain',
      linkUrl: '/module/ai-suggestion'
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
