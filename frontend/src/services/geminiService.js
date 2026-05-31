// PRIMARY: Gemini API
// FALLBACK: static data from dashboardContent.js

import { dashboardContent } from '../content/dashboardContent';

// Retrieve Gemini API Key from Vite env context
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Standard local mathematical calculator for Yield/ROI as a fallback to match existing formulas
function calculateLocalYieldRoiFallback(cropName, acreage, seedGrade, fertilizerBudget) {
  const CROP_PROFILES = {
    'Rice (Paddy)': { baseYield: 22, pricePerQtl: 2200 },
    'Wheat': { baseYield: 19, pricePerQtl: 2275 },
    'Cotton': { baseYield: 8.5, pricePerQtl: 7000 },
    'Maize (Corn)': { baseYield: 21, pricePerQtl: 2090 }
  };

  const SEED_GRADES = {
    'Basic': { multiplier: 1.0, costPerAcre: 800 },
    'Standard': { multiplier: 1.15, costPerAcre: 1500 },
    'Premium': { multiplier: 1.35, costPerAcre: 2400 }
  };

  const crop = CROP_PROFILES[cropName] || CROP_PROFILES['Rice (Paddy)'];
  const seed = SEED_GRADES[seedGrade] || SEED_GRADES['Standard'];

  let fertMultiplier = 1.0;
  if (fertilizerBudget < 3000) {
    fertMultiplier = 0.75 + (fertilizerBudget / 12000);
  } else if (fertilizerBudget >= 3000 && fertilizerBudget <= 5000) {
    fertMultiplier = 1.0 + ((fertilizerBudget - 3000) / 20000);
  } else {
    fertMultiplier = 1.1 + ((fertilizerBudget - 5000) / 50000);
    if (fertMultiplier > 1.2) fertMultiplier = 1.2;
  }

  const baseOpsCostPerAcre = 4000;
  const totalCostPerAcre = seed.costPerAcre + fertilizerBudget + baseOpsCostPerAcre;
  const totalCost = totalCostPerAcre * acreage;
  const totalYield = crop.baseYield * seed.multiplier * fertMultiplier * acreage;
  const grossRevenue = totalYield * crop.pricePerQtl;
  const netProfit = grossRevenue - totalCost;
  const roiPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    totalCost: Math.round(totalCost),
    totalYield: Math.round(totalYield * 10) / 10,
    grossRevenue: Math.round(grossRevenue),
    netProfit: Math.round(netProfit),
    roiPercent: Math.round(roiPercent),
    breakEvenYield: Math.round((totalCost / crop.pricePerQtl) * 10) / 10,
    downsideProfit: Math.round((totalYield * 0.8 * crop.pricePerQtl) - totalCost),
    kccLoanEstimate: Math.round(totalCost * 0.75),
    costBreakdown: {
      seedCost: Math.round(seed.costPerAcre * acreage),
      fertilizerCost: Math.round(fertilizerBudget * acreage),
      operationsCost: Math.round(baseOpsCostPerAcre * acreage)
    },
    subsidy: {
      schemeName: "Pradhan Mantri Fasal Bima Yojana",
      amount: "₹2,500 / acre premium subsidy",
      deadline: "31st July"
    }
  };
}

// Helper fetchWrapper to apply consistent API-to-fallback resolution flow
const fetchWithFallback = async (geminiCallFn, fallbackData) => {
  try {
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API Key is not set. Silently falling back to static data.");
      return fallbackData;
    }
    const result = await geminiCallFn();
    if (!result || Object.keys(result).length === 0) {
      return fallbackData;
    }
    return result;
  } catch (error) {
    console.warn("Gemini API call failed, using fallback data:", error);
    return fallbackData;
  }
};

// Generic HTTP Post execution function targeting gemini-3.5-flash
export async function callGeminiFlash(userPrompt, systemPrompt) {
  const model = "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 2048, temperature: 0.4 }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to invoke Gemini Flash.`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty candidate response returned from Gemini Flash.");
  }

  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// Generic HTTP Post execution function targeting gemini-3.1-pro-preview
export async function callGeminiPro(userPrompt, systemPrompt) {
  const model = "gemini-3.1-pro-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 2048, temperature: 0.4 }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to invoke Gemini Pro.`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty candidate response returned from Gemini Pro.");
  }

  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// Helper 1: getCropRecommendations
export async function getCropRecommendations(district, state, season) {
  const systemPrompt = "You are an agriculture expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation.";
  const userPrompt = `Given location: ${district}, ${state}, season: ${season}, return this exact JSON shape:
  {
    "recommendedCrops": [
      {
        "id": "crop-rice",
        "name": "Rice (Paddy)",
        "hindiName": "धान (चावल)",
        "matchScore": 92,
        "estimatedYield": "22 - 26 qtl/acre",
        "roiEstimate": "₹48,500/acre",
        "riskLevel": "Low Risk",
        "isBestMatch": true,
        "details": "Ideal soil moisture profile and forecast precipitation match perfectly."
      },
      {
        "id": "crop-cotton",
        "name": "Cotton",
        "hindiName": "कपास",
        "matchScore": 85,
        "estimatedYield": "8 - 10 qtl/acre",
        "roiEstimate": "₹42,000/acre",
        "riskLevel": "Low Risk",
        "isBestMatch": false,
        "details": "Excellent soil temperature profile but demands slightly higher irrigation cycles."
      },
      {
        "id": "crop-maize",
        "name": "Maize (Corn)",
        "hindiName": "मक्का",
        "matchScore": 78,
        "estimatedYield": "18 - 22 qtl/acre",
        "roiEstimate": "₹34,000/acre",
        "riskLevel": "Medium Risk",
        "isBestMatch": false,
        "details": "Moderate nitrogen levels required. Pay attention to sudden rain drainage."
      }
    ],
    "weatherSummary": {
      "temperature": "32°C",
      "temperatureSub": "Optimal Soil Temp",
      "humidity": "68%",
      "humiditySub": "Adequate Moisture",
      "rainfall": "420 mm",
      "rainfallSub": "Optimal rainy seasonal index",
      "windSpeed": "14 km/h",
      "windSpeedSub": "Gentle Westerly Wind"
    },
    "detectedBanner": {
      "titleEnglish": "Kharif Season Detected",
      "titleHindi": "खरीफ मौसम",
      "badgeText": "Auto-detected",
      "details": "Based on high temperature, soil moisture, and seasonal onset telemetry."
    }
  }
  Ensure crop recommended match scores are mathematically calculated based on the climate index of ${district}, ${state}. Make it realistic. Return exactly 3 crops. Use dynamic details.`;

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    {
      recommendedCrops: dashboardContent.cropRecommendationData.recommendedCrops.map(c => ({
        ...c,
        riskLevel: c.riskLevel || "Low Risk"
      })),
      weatherSummary: {
        temperature: dashboardContent.cropRecommendationData.weatherSummary.temperature,
        temperatureSub: dashboardContent.cropRecommendationData.weatherSummary.temperatureSub || "Optimal Soil Temp",
        humidity: dashboardContent.cropRecommendationData.weatherSummary.humidity,
        humiditySub: dashboardContent.cropRecommendationData.weatherSummary.humiditySub || "Adequate Moisture",
        rainfall: dashboardContent.cropRecommendationData.weatherSummary.rainfall,
        rainfallSub: dashboardContent.cropRecommendationData.weatherSummary.rainfallSub || "Rainy seasonal index",
        windSpeed: dashboardContent.cropRecommendationData.weatherSummary.windSpeed,
        windSpeedSub: dashboardContent.cropRecommendationData.weatherSummary.windSpeedSub || "Gentle wind"
      },
      detectedBanner: {
        titleEnglish: dashboardContent.cropRecommendationData.detectedBanner.titleEnglish,
        titleHindi: dashboardContent.cropRecommendationData.detectedBanner.titleHindi,
        badgeText: dashboardContent.cropRecommendationData.detectedBanner.badgeText,
        details: dashboardContent.cropRecommendationData.detectedBanner.details
      }
    }
  );
}

// Helper 2: getCropRankings
export async function getCropRankings(
  district, soilType, rainfall, temperature,
  waterAvailability, landArea, waterWeight, roiWeight, riskWeight
) {
  const systemPrompt = "You are an agriculture ranking expert. Always return ONLY raw JSON array, no markdown, no explanation.";
  const userPrompt = `Given farm inputs —
  District: ${district}, Soil: ${soilType}, 
  Rainfall: ${rainfall}mm, Temperature: ${temperature}C,
  Water: ${waterAvailability}, Area: ${landArea} acres,
  Farmer priorities — Water Saving: ${waterWeight}%, 
  ROI: ${roiWeight}%, Low Risk: ${riskWeight}%
  Return a JSON array sorted by score descending:
  [
    {
      "name": "Rice",
      "hindi": "चावल",
      "score": 85,
      "soilScore": 22,
      "waterScore": 18,
      "weatherScore": 17,
      "marketScore": 16,
      "historyScore": 12,
      "explanation": "High suitability score due to optimal soil clay structure and ample water indices."
    }
  ]
  Include exactly these 9 crops: Rice, Wheat, Cotton, Maize, Mustard, Sugarcane, Bajra, Moong, Sunflower. Assign scores out of 100 based on standard agronomical formulas. explanation must be exactly one sentence.`;

  const staticRankings = [
    { rank: 1, name: 'Wheat', hindi: 'गेहूं', score: 92, explanation: 'Excellent organic soil profile match and cold winter climate indices.' },
    { rank: 2, name: 'Rice', hindi: 'चावल', score: 85, explanation: 'Highly compatible water retention clay matrix matches rainfall onset.' },
    { rank: 3, name: 'Maize', hindi: 'मक्का', score: 78, explanation: 'Balanced soil pH and moisture parameters favor organic yield metrics.' },
    { rank: 4, name: 'Sugarcane', hindi: 'गन्ना', score: 72, explanation: 'Strong market price support makes it highly profitable long term.' },
    { rank: 5, name: 'Cotton', hindi: 'कपास', score: 65, explanation: 'Drought-tolerant deep root system handles moisture fluctuations.' },
    { rank: 6, name: 'Mustard', hindi: 'सरसों', score: 60, explanation: 'Low water requirement matches medium sandy-loam properties.' },
    { rank: 7, name: 'Bajra', hindi: 'बाजरा', score: 55, explanation: 'Extremely resilient to high soil temperatures and drought indexes.' },
    { rank: 8, name: 'Moong', hindi: 'मूंग', score: 48, explanation: 'Foliar growth stage helps in natural nitrogen fixation cycles.' },
    { rank: 9, name: 'Sunflower', hindi: 'सूरजमुखी', score: 42, explanation: 'Moderate yields can be optimized with extra potassium inputs.' }
  ];

  return fetchWithFallback(
    async () => {
      const parsed = await callGeminiPro(userPrompt, systemPrompt);
      if (Array.isArray(parsed)) {
        return parsed.map((item, idx) => ({
          rank: idx + 1,
          name: item.name,
          hindi: item.hindi || item.name,
          score: item.score,
          explanation: item.explanation || "Highly suitable agricultural profile."
        }));
      }
      return null;
    },
    staticRankings
  );
}

// Helper 3: getYieldRoiPrediction
export async function getYieldRoiPrediction(cropName, acreage, seedGrade, fertilizerBudget, district) {
  const systemPrompt = "You are an agricultural financial advisor for Indian farmers. Always return ONLY raw JSON, no markdown.";
  const userPrompt = `Given inputs —
  Crop: ${cropName}, Acreage: ${acreage} acres,
  Seed Grade: ${seedGrade}, 
  Fertilizer Budget: ${fertilizerBudget} per acre,
  District: ${district}, State: Haryana
  Return this exact JSON shape:
  {
    "totalCost": 45000,
    "totalYield": 110,
    "grossRevenue": 242000,
    "netProfit": 197000,
    "roiPercent": 437,
    "breakEvenYield": 20.5,
    "downsideProfit": 148600,
    "kccLoanEstimate": 33750,
    "costBreakdown": {
      "seedCost": 7500,
      "fertilizerCost": 17500,
      "operationsCost": 20000
    },
    "subsidy": {
      "schemeName": "PM-KISAN Crop Incentive / फसल प्रोत्साहन योजना",
      "amount": "₹6,000 / Year",
      "deadline": "31st August 2026"
    }
  }
  Ensure all figures are realistic for agriculture in Haryana, using realistic market pricing per quintal. Calculate costs correctly: totalCost = seedCost + fertilizerCost + operationsCost.`;

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    calculateLocalYieldRoiFallback(cropName, acreage, seedGrade, fertilizerBudget)
  );
}

// Helper 4: getPestRisks
export async function getPestRisks(cropName, growthStage, temperature, humidity, district) {
  const systemPrompt = "You are a plant pathology expert for Indian farmers. Always return ONLY raw JSON, no markdown.";
  const userPrompt = `Given conditions —
  Crop: ${cropName}, Growth Stage: ${growthStage},
  Temperature: ${temperature}C, Humidity: ${humidity}%,
  District: ${district}, State: Haryana
  Return this exact JSON shape:
  {
    "risks": [
      {
        "id": "yellow_rust",
        "name": "Yellow Rust",
        "nameHindi": "पीला रतुआ",
        "probability": 72,
        "severity": "High",
        "description": "Airborne fungal disease — spreads fast in cool, humid weather.",
        "outbreakNearby": true
      }
    ],
    "resistantVarieties": [
      {
        "name": "PBW 343",
        "advantage": "High resistance to Rust",
        "university": "PAU Ludhiana"
      }
    ]
  }
  Ensure that you return EXACTLY 5 risks and 3 resistant varieties. Make probability realistic based on temperature: ${temperature}°C and humidity: ${humidity}%. Set outbreakNearby to true for at least one if parameters are high.`;

  const fallbackRisks = {
    risks: [
      { id: "yellow_rust", name: "Yellow Rust", nameHindi: "पीला रतुआ", severity: "High", description: "Airborne fungal disease — spreads fast in cool, humid weather.", probability: 72, outbreakNearby: true },
      { id: "aphids", name: "Aphids", nameHindi: "माहू", severity: "Medium", description: "Sap-sucking insects, reduce photosynthesis and spread viruses.", probability: 55, outbreakNearby: false },
      { id: "leaf_blight", name: "Leaf Blight", nameHindi: "पत्ती झुलसा", severity: "Medium", description: "Fungal attack causing browning and drying of leaves.", probability: 45, outbreakNearby: false },
      { id: "powdery_mildew", name: "Powdery Mildew", nameHindi: "सफेद चूर्ण", severity: "Low", description: "White powdery fungal coating on leaves, reduces grain fill.", probability: 38, outbreakNearby: false },
      { id: "army_worm", name: "Army Worm", nameHindi: "सेना कीड़ा", severity: "Low", description: "Leaf-eating caterpillar, mostly a concern during vegetative stage.", probability: 22, outbreakNearby: false }
    ],
    resistantVarieties: [
      { name: "PBW 343", advantage: "+18% yield over local variety", university: "Punjab Agriculture Univ." },
      { name: "HD 2967", advantage: "Rust-resistant, widely adopted", university: "IARI New Delhi" },
      { name: "GW 322", advantage: "Tolerant to dry conditions", university: "Gujarat Agri Univ." }
    ]
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackRisks
  );
}

// Helper 5: getMarketData
export async function getMarketData(cropName, district) {
  const systemPrompt = "You are an agricultural market analyst for India. Always return ONLY raw JSON, no markdown.";
  const userPrompt = `Given crop: ${cropName}, district: ${district}, state: Haryana
  Return this exact JSON shape:
  {
    "demandLevel": "High Demand",
    "priceChart": [
      { "day": "Day 1", "price": 2210 }
    ],
    "mandis": [
      {
        "name": "Nuh Mandi, Faridabad",
        "price": 2440,
        "weeklyChange": 2.1,
        "isBest": true
      }
    ],
    "diversificationTip": "Consider adding Mustard to your rotation to reduce wheat price volatility risk."
  }
  Ensure that you return EXACTLY 18 days of price charts and EXACTLY 4 mandis with realistic prices for Haryana mandis.`;

  const fallbackMarket = {
    demandLevel: "High Demand",
    priceChart: [
      { day: "D1", price: 2210 },
      { day: "D3", price: 2240 },
      { day: "D5", price: 2220 },
      { day: "D7", price: 2260 },
      { day: "D9", price: 2280 },
      { day: "D11", price: 2250 },
      { day: "D13", price: 2280 },
      { day: "D15", price: 2310 },
      { day: "D16", price: 2285 },
      { day: "D18", price: 2330 },
      { day: "D20", price: 2355 },
      { day: "D21", price: 2340 },
      { day: "D23", price: 2375 },
      { day: "D25", price: 2390 },
      { day: "D26", price: 2410 },
      { day: "D28", price: 2395 },
      { day: "D29", price: 2440 },
      { day: "D30", price: 2460 }
    ],
    mandis: [
      { name: "Nuh Mandi, Faridabad", price: 2440, weeklyChange: 2.1, isBest: true },
      { name: "Palwal APMC", price: 2420, weeklyChange: 1.8, isBest: false },
      { name: "Ballabhgarh Grain Market", price: 2410, weeklyChange: 1.4, isBest: false },
      { name: "Hodal Mandi", price: 2390, weeklyChange: 0.9, isBest: false }
    ],
    diversificationTip: "Consider adding Mustard to your rotation to reduce wheat price volatility risk."
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackMarket
  );
}

// Helper 6: getSeasonalCalendar
export async function getSeasonalCalendar(selectedCrops, district, season) {
  const systemPrompt = "You are an agronomic calendar expert for Indian farmers. Always return ONLY raw JSON, no markdown.";
  const userPrompt = `Given crops: ${selectedCrops}, district: ${district}, season: ${season}, state: Haryana
  Return this exact JSON shape:
  {
    "seasons": [
      {
        "name": "Kharif",
        "months": "June – November",
        "temperature": "25°C – 35°C",
        "humidity": "70% – 90%",
        "description": "Sown with the onset of the southwest monsoon.",
        "crops": [
          {
            "name": "Rice",
            "hindiName": "धान",
            "npk": "120-60-40",
            "timeline": {
              "Jun": ["Sowing"],
              "Jul": ["Sowing", "Irrigation", "Fertilizer"]
            }
          }
        ]
      }
    ]
  }
  Ensure you return ALL 3 seasons: Kharif, Rabi, Zaid, with realistic timeline data mapping months to farming phases (Sowing, Irrigation, Fertilizer, Harvest).`;

  const fallbackCalendar = {
    seasons: [
      {
        name: "Kharif",
        months: "June – November",
        temperature: "25°C – 35°C",
        humidity: "70% – 90%",
        description: "Sown with the onset of the southwest monsoon. Characterized by high humidity, warm temperature models, and heavy rain demands.",
        crops: [
          { name: "Rice", hindiName: "धान", npk: "120-60-40", timeline: { Jun: ["Sowing"], Jul: ["Sowing", "Irrigation", "Fertilizer"], Aug: ["Irrigation"], Sep: ["Irrigation", "Fertilizer"], Oct: ["Harvest"], Nov: ["Harvest"] } },
          { name: "Maize", hindiName: "मक्का", npk: "100-50-40", timeline: { Jun: ["Sowing"], Jul: ["Sowing", "Fertilizer"], Aug: ["Irrigation", "Fertilizer"], Sep: ["Irrigation", "Harvest"], Oct: ["Harvest"] } },
          { name: "Cotton", hindiName: "कपास", npk: "80-40-40", timeline: { Jun: ["Sowing"], Jul: ["Irrigation"], Aug: ["Irrigation", "Fertilizer"], Sep: ["Irrigation", "Fertilizer"], Oct: ["Irrigation", "Harvest"], Nov: ["Harvest"] } }
        ]
      },
      {
        name: "Rabi",
        months: "November – April",
        temperature: "15°C – 25°C",
        humidity: "40% – 60%",
        description: "Sown in winter after the monsoon rains retreat. Requires mild temperatures during sowing/growing and warm weather during harvest.",
        crops: [
          { name: "Wheat", hindiName: "गेहूं", npk: "120-60-40", timeline: { Nov: ["Sowing"], Dec: ["Sowing", "Irrigation"], Jan: ["Irrigation", "Fertilizer"], Feb: ["Irrigation"], Mar: ["Harvest"], Apr: ["Harvest"] } }
        ]
      },
      {
        name: "Zaid",
        months: "March – June",
        temperature: "30°C – 40°C",
        humidity: "30% – 50%",
        description: "Short summer crop window between the Rabi harvest and Kharif sowing. Dominated by warm winds and rapid maturity requirements.",
        crops: [
          { name: "Watermelon", hindiName: "तरबूज", npk: "80-40-60", timeline: { Mar: ["Sowing"], Apr: ["Irrigation", "Fertilizer"], May: ["Irrigation"], Jun: ["Harvest"] } }
        ]
      }
    ]
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackCalendar
  );
}
