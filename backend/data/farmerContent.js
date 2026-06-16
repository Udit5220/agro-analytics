export const farmerContent = {
  dashboard: {
    banner_heading: "Welcome to the Farmer Learning Hub",
    banner_subtext: "Explore courses on organic farming, crop management, and modern agriculture techniques.",
    active_course: { title: "Organic Farming Basics", progress: 60, time_spent: "2h 30m" },
    recommended_courses: [
      { title: "Pest & Disease Control", duration: "1h 30m", badge: "CRITICAL", keyword_for_image: "pest control agriculture" },
      { title: "Smart Irrigation Systems", duration: "2h 00m", badge: "HOT", keyword_for_image: "drip irrigation" },
      { title: "Soil Health & Fertilizers", duration: "1h 45m", badge: "ESSENTIAL", keyword_for_image: "soil farming" },
      { title: "Weather Adaptive Farming", duration: "3h 15m", badge: "PRO", keyword_for_image: "weather agriculture" }
    ]
  },
  lesson: {
    module_title: "Organic Pest Management",
    tags: ["Organic", "Pest Control", "Sustainable"],
    duration: "45 mins",
    notes: "Learn integrated pest management techniques without relying on harmful synthetic chemicals.",
    key_insight: "Encouraging natural predators like ladybugs can reduce aphid populations by up to 80%.",
    timeline: []
  },
  quiz: {
    course_title: "Soil Health Quiz",
    question: "What is the ideal pH range for most agricultural crops?",
    options: [
      { id: "A", text: "4.0 - 5.0" },
      { id: "B", text: "6.0 - 7.0" },
      { id: "C", text: "8.0 - 9.0" },
      { id: "D", text: "2.0 - 3.0" }
    ],
    correct_option_id: "B",
    keyword_for_image: "soil ph test"
  },
  analytics: {
    metrics: { total_learners: "12k+", average_score: "78%", certificates: "4.5k", at_risk: "12%" },
    top_modules: [], activities: []
  },
  'crop-management': {
    activeRole: "Farmer",
    currentSubpage: "crop-management",
    timestamp: new Date().toISOString(),
    searchQueryUsed: "",
    uiElements: {
      pageTitle: "Crop Management Topics",
      subHeading: "Explore expert knowledge relevant to this domain.",
      filters: ["All Courses", "Seeds", "Soil", "Harvesting"],
      courses: [
        { id: "cm-1", title: "Advanced Crop Management", rating: 4.8, reviewCount: "2k", duration: "3h", enrollmentCount: "10k", badge: "HOT", thumbnailPlaceholder: "crop management", actionText: "Enroll Now" },
        { id: "cm-2", title: "High-Yield Seed Selection", rating: 4.7, reviewCount: "1.8k", duration: "1h", enrollmentCount: "9k", badge: "BASICS", thumbnailPlaceholder: "seeds", actionText: "Enroll Now" },
        { id: "cm-3", title: "Soil Preparation Techniques", rating: 4.6, reviewCount: "1.2k", duration: "2h", enrollmentCount: "6k", badge: "CORE", thumbnailPlaceholder: "plowing field", actionText: "Enroll Now" },
        { id: "cm-4", title: "Crop Rotation Strategies", rating: 4.9, reviewCount: "3k", duration: "2.5h", enrollmentCount: "8k", badge: "PRO", thumbnailPlaceholder: "crop rotation", actionText: "Enroll Now" },
        { id: "cm-5", title: "Organic Fertilizer Application", rating: 4.5, reviewCount: "900", duration: "1.5h", enrollmentCount: "4k", badge: "ESSENTIAL", thumbnailPlaceholder: "organic fertilizer", actionText: "Enroll Now" },
        { id: "cm-6", title: "Harvesting Best Practices", rating: 4.7, reviewCount: "1.5k", duration: "2h", enrollmentCount: "7k", badge: "TRENDING", thumbnailPlaceholder: "harvesting", actionText: "Enroll Now" }
      ]
    }
  },
  'pest-control': {
    activeRole: "Farmer",
    currentSubpage: "pest-control",
    timestamp: new Date().toISOString(),
    searchQueryUsed: "",
    uiElements: {
      pageTitle: "Pest Control Topics",
      subHeading: "Explore expert knowledge relevant to this domain.",
      filters: ["All Courses", "IPM", "Natural Predators", "Weeds"],
      courses: [
        { id: "pc-1", title: "Integrated Pest Management (IPM)", rating: 4.9, reviewCount: "2.5k", duration: "4h", enrollmentCount: "12k", badge: "PRO", thumbnailPlaceholder: "pest management", actionText: "Enroll Now" },
        { id: "pc-2", title: "Identifying Common Crop Diseases", rating: 4.7, reviewCount: "1.8k", duration: "2h", enrollmentCount: "8k", badge: "CORE", thumbnailPlaceholder: "crop disease", actionText: "Enroll Now" },
        { id: "pc-3", title: "Natural Predators for Pest Control", rating: 4.8, reviewCount: "2k", duration: "1.5h", enrollmentCount: "9k", badge: "HOT", thumbnailPlaceholder: "ladybug", actionText: "Enroll Now" },
        { id: "pc-4", title: "Safe Pesticide Application", rating: 4.6, reviewCount: "1.2k", duration: "2.5h", enrollmentCount: "6k", badge: "SAFETY", thumbnailPlaceholder: "pesticide spray", actionText: "Enroll Now" },
        { id: "pc-5", title: "Weed Control Strategies", rating: 4.5, reviewCount: "900", duration: "2h", enrollmentCount: "5k", badge: "ESSENTIAL", thumbnailPlaceholder: "weeds", actionText: "Enroll Now" },
        { id: "pc-6", title: "Rodent Management in Storage", rating: 4.4, reviewCount: "600", duration: "1h", enrollmentCount: "3k", badge: "PRACTICAL", thumbnailPlaceholder: "grain storage", actionText: "Enroll Now" }
      ]
    }
  },
  'irrigation-weather': {
    activeRole: "Farmer",
    currentSubpage: "irrigation-weather",
    timestamp: new Date().toISOString(),
    searchQueryUsed: "",
    uiElements: {
      pageTitle: "Irrigation & Weather Topics",
      subHeading: "Explore expert knowledge relevant to this domain.",
      filters: ["All Courses", "Drip Irrigation", "Weather Patterns", "Water Conservation"],
      courses: [
        { id: "iw-1", title: "Drip Irrigation Setup & Maintenance", rating: 4.8, reviewCount: "3k", duration: "3h", enrollmentCount: "15k", badge: "HOT", thumbnailPlaceholder: "drip irrigation", actionText: "Enroll Now" },
        { id: "iw-2", title: "Understanding Weather Patterns", rating: 4.7, reviewCount: "1.5k", duration: "2h", enrollmentCount: "8k", badge: "CORE", thumbnailPlaceholder: "weather forecast", actionText: "Enroll Now" },
        { id: "iw-3", title: "Water Conservation Techniques", rating: 4.9, reviewCount: "4k", duration: "4h", enrollmentCount: "20k", badge: "PRO", thumbnailPlaceholder: "water conservation", actionText: "Enroll Now" },
        { id: "iw-4", title: "Sprinkler Systems Optimization", rating: 4.6, reviewCount: "1.2k", duration: "2.5h", enrollmentCount: "6k", badge: "TECH", thumbnailPlaceholder: "sprinkler", actionText: "Enroll Now" },
        { id: "iw-5", title: "Rainwater Harvesting", rating: 4.8, reviewCount: "2.5k", duration: "3h", enrollmentCount: "12k", badge: "SUSTAINABLE", thumbnailPlaceholder: "rainwater harvesting", actionText: "Enroll Now" },
        { id: "iw-6", title: "Drought Resilience Farming", rating: 4.9, reviewCount: "5k", duration: "5h", enrollmentCount: "25k", badge: "CRITICAL", thumbnailPlaceholder: "drought", actionText: "Enroll Now" }
      ]
    }
  },
  defaultCatalog: {
    activeRole: "Farmer",
    currentSubpage: "catalog",
    timestamp: new Date().toISOString(),
    searchQueryUsed: "",
    uiElements: {
      pageTitle: "Browse Course Catalog",
      subHeading: "Discover specialized tutorials and certifications to upgrade your skills.",
      filters: ["All Courses", "Crop Management", "Sustainable Farming", "Market Intelligence", "Disease Protection"],
      courses: [
        { id: "dc-1", title: "Advanced Crop Management", rating: 4.8, reviewCount: "2k", duration: "3h", enrollmentCount: "10k", badge: "HOT", thumbnailPlaceholder: "crop management", actionText: "Enroll Now" },
        { id: "dc-2", title: "Drip Irrigation Setup", rating: 4.5, reviewCount: "1.5k", duration: "1.5h", enrollmentCount: "8k", badge: "NEW", thumbnailPlaceholder: "drip irrigation", actionText: "Enroll Now" },
        { id: "dc-3", title: "Understanding Weather Patterns", rating: 4.2, reviewCount: "800", duration: "1h", enrollmentCount: "5k", badge: "ESSENTIAL", thumbnailPlaceholder: "weather forecast", actionText: "Enroll Now" },
        { id: "dc-4", title: "Local Market Pricing Guide", rating: 4.9, reviewCount: "3k", duration: "2h", enrollmentCount: "15k", badge: "PRO", thumbnailPlaceholder: "market prices", actionText: "Enroll Now" },
        { id: "dc-5", title: "Tractor & Machinery Maintenance", rating: 4.6, reviewCount: "1.2k", duration: "2.5h", enrollmentCount: "6k", badge: "PRACTICAL", thumbnailPlaceholder: "tractor maintenance", actionText: "Enroll Now" },
        { id: "dc-6", title: "High-Yield Seed Selection", rating: 4.7, reviewCount: "1.8k", duration: "1h", enrollmentCount: "9k", badge: "BASICS", thumbnailPlaceholder: "seeds", actionText: "Enroll Now" },
        { id: "dc-7", title: "Greenhouse Farming Basics", rating: 4.6, reviewCount: "900", duration: "4h", enrollmentCount: "3k", badge: "SPECIALTY", thumbnailPlaceholder: "greenhouse", actionText: "Enroll Now" },
        { id: "dc-8", title: "Water Conservation Techniques", rating: 4.8, reviewCount: "2.1k", duration: "2h", enrollmentCount: "11k", badge: "HOT", thumbnailPlaceholder: "water conservation", actionText: "Enroll Now" },
        { id: "dc-9", title: "Post-Harvest Storage", rating: 4.4, reviewCount: "1.1k", duration: "1.5h", enrollmentCount: "7k", badge: "ESSENTIAL", thumbnailPlaceholder: "grain storage", actionText: "Enroll Now" },
        { id: "dc-10", title: "Farm Financial Planning", rating: 4.9, reviewCount: "4k", duration: "5h", enrollmentCount: "20k", badge: "PRO", thumbnailPlaceholder: "farm finance", actionText: "Enroll Now" }
      ]
    }
  },
  defaultCatalog: {
    pageTitle: "Browse Course Catalog",
    subHeading: "Discover specialized tutorials and certifications to upgrade your skills.",
    filters: ["All Courses"],
    courses: [
      { id: "def-1", title: "General Agriculture Fundamentals", rating: 4.5, reviewCount: "1k", duration: "2h", enrollmentCount: "5k", badge: "BASICS", thumbnailPlaceholder: "agriculture", actionText: "Enroll Now" }
    ]
  },
  lesson: {
    module_title: "Organic Farming Basics",
    tags: ["Organic", "Basics", "Soil"],
    duration: "45 mins",
    notes: "Organic farming relies on fertilizers of organic origin such as compost manure, green manure, and bone meal and places emphasis on techniques such as crop rotation and companion planting. It fosters soil health and biodiversity.",
    key_insight: "Healthy soil biology naturally protects plants from diseases and pests, reducing the need for chemical interventions by up to 80%.",
    timeline: [
      { title: "Introduction to Organic Farming", duration: "10 mins", status: "completed" },
      { title: "Soil Preparation and Composting", duration: "15 mins", status: "active" },
      { title: "Natural Pest Control", duration: "20 mins", status: "locked" }
    ]
  },
  quiz: {
    course_title: "Organic Farming Basics",
    question: "Which of the following is NOT a primary component of organic compost?",
    img: "https://picsum.photos/seed/compost/800/400",
    options: [
      { id: "A", text: "Green materials (grass clippings, food scraps)" },
      { id: "B", text: "Brown materials (dry leaves, twigs)" },
      { id: "C", text: "Synthetic urea" },
      { id: "D", text: "Water and aeration" }
    ],
    correctAnswer: "C"
  }
};
