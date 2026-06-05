// PRIMARY: Gemini API
// FALLBACK: static data from dashboardContent.js

import { dashboardContent } from "../content/dashboardContent";
import { profileApi } from "./apiService";
import seededData from "../seed-json/seededData.json";

// Retrieve Gemini API Key from Vite env context
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Standard local mathematical calculator for Yield/ROI as a fallback to match existing formulas
function calculateLocalYieldRoiFallback(
  cropName,
  acreage,
  seedGrade,
  fertilizerBudget,
) {
  const CROP_PROFILES = {
    "Rice (Paddy)": { baseYield: 22, pricePerQtl: 2200 },
    Wheat: { baseYield: 19, pricePerQtl: 2275 },
    Cotton: { baseYield: 8.5, pricePerQtl: 7000 },
    "Maize (Corn)": { baseYield: 21, pricePerQtl: 2090 },
  };

  const SEED_GRADES = {
    Basic: { multiplier: 1.0, costPerAcre: 800 },
    Standard: { multiplier: 1.15, costPerAcre: 1500 },
    Premium: { multiplier: 1.35, costPerAcre: 2400 },
  };

  const crop = CROP_PROFILES[cropName] || CROP_PROFILES["Rice (Paddy)"];
  const seed = SEED_GRADES[seedGrade] || SEED_GRADES["Standard"];

  let fertMultiplier = 1.0;
  if (fertilizerBudget < 3000) {
    fertMultiplier = 0.75 + fertilizerBudget / 12000;
  } else if (fertilizerBudget >= 3000 && fertilizerBudget <= 5000) {
    fertMultiplier = 1.0 + (fertilizerBudget - 3000) / 20000;
  } else {
    fertMultiplier = 1.1 + (fertilizerBudget - 5000) / 50000;
    if (fertMultiplier > 1.2) fertMultiplier = 1.2;
  }

  const baseOpsCostPerAcre = 4000;
  const totalCostPerAcre =
    seed.costPerAcre + fertilizerBudget + baseOpsCostPerAcre;
  const totalCost = totalCostPerAcre * acreage;
  const totalYield =
    crop.baseYield * seed.multiplier * fertMultiplier * acreage;
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
    downsideProfit: Math.round(totalYield * 0.8 * crop.pricePerQtl - totalCost),
    kccLoanEstimate: Math.round(totalCost * 0.75),
    costBreakdown: {
      seedCost: Math.round(seed.costPerAcre * acreage),
      fertilizerCost: Math.round(fertilizerBudget * acreage),
      operationsCost: Math.round(baseOpsCostPerAcre * acreage),
    },
    subsidy: {
      schemeName: "Pradhan Mantri Fasal Bima Yojana",
      amount: "₹2,500 / acre premium subsidy",
      deadline: "31st July",
    },
  };
}

// Helper fetchWrapper to apply consistent API-to-fallback resolution flow
const fetchWithFallback = async (geminiCallFn, fallbackData) => {
  try {
    if (!GEMINI_API_KEY) {
      console.warn(
        "Gemini API Key is not set. Silently falling back to static data.",
      );
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

// Generic HTTP Post execution function targeting gemini-3.1-flash-lite
export async function callGeminiFlash(userPrompt, systemPrompt) {
  const model = "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
    }),
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
  const cleanJson = clean.replace(/,\s*([\]}])/g, "$1");
  return JSON.parse(cleanJson);
}

// Generic HTTP Post execution function targeting gemini-2.5-pro
export async function callGeminiPro(userPrompt, systemPrompt) {
  const model = "gemini-2.5-pro";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
    }),
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
  const cleanJson = clean.replace(/,\s*([\]}])/g, "$1");
  return JSON.parse(cleanJson);
}

// Helper 1: getCropRecommendations
export async function getCropRecommendations(district, state, season) {
  const systemPrompt =
    "You are an agriculture expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation.";
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

  return fetchWithFallback(() => callGeminiFlash(userPrompt, systemPrompt), {
    recommendedCrops:
      dashboardContent.cropRecommendationData.recommendedCrops.map((c) => ({
        ...c,
        riskLevel: c.riskLevel || "Low Risk",
      })),
    weatherSummary: {
      temperature:
        dashboardContent.cropRecommendationData.weatherSummary.temperature,
      temperatureSub:
        dashboardContent.cropRecommendationData.weatherSummary.temperatureSub ||
        "Optimal Soil Temp",
      humidity: dashboardContent.cropRecommendationData.weatherSummary.humidity,
      humiditySub:
        dashboardContent.cropRecommendationData.weatherSummary.humiditySub ||
        "Adequate Moisture",
      rainfall: dashboardContent.cropRecommendationData.weatherSummary.rainfall,
      rainfallSub:
        dashboardContent.cropRecommendationData.weatherSummary.rainfallSub ||
        "Rainy seasonal index",
      windSpeed:
        dashboardContent.cropRecommendationData.weatherSummary.windSpeed,
      windSpeedSub:
        dashboardContent.cropRecommendationData.weatherSummary.windSpeedSub ||
        "Gentle wind",
    },
    detectedBanner: {
      titleEnglish:
        dashboardContent.cropRecommendationData.detectedBanner.titleEnglish,
      titleHindi:
        dashboardContent.cropRecommendationData.detectedBanner.titleHindi,
      badgeText:
        dashboardContent.cropRecommendationData.detectedBanner.badgeText,
      details: dashboardContent.cropRecommendationData.detectedBanner.details,
    },
  });
}

// Helper 2: getCropRankings
export async function getCropRankings(
  district,
  soilType,
  rainfall,
  temperature,
  waterAvailability,
  landArea,
  waterWeight,
  roiWeight,
  riskWeight,
) {
  const staticRankings = seededData.cropRecommendation.fallbacks.cropRankings;

  try {
    const res = await profileApi.getCropRankings({
      district,
      soilType,
      rainfall,
      temperature,
      waterAvailability,
      landArea,
      waterWeight,
      roiWeight,
      riskWeight,
    });

    if (res && res.success && Array.isArray(res.data)) {
      return res.data;
    }
  } catch (err) {
    console.warn(
      "[geminiService] Backend crop ranking API offline/error. Cascading to browser Gemini or static fallbacks:",
      err.message,
    );
  }

  const systemPrompt =
    "You are an agriculture ranking expert. Always return ONLY raw JSON array, no markdown, no explanation.";
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

  return fetchWithFallback(async () => {
    const parsed = await callGeminiPro(userPrompt, systemPrompt);
    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => ({
        rank: idx + 1,
        name: item.name,
        hindi: item.hindi || item.name,
        score: item.score,
        explanation:
          item.explanation || "Highly suitable agricultural profile.",
      }));
    }
    return null;
  }, staticRankings);
}

// Helper 3: getYieldRoiPrediction
export async function getYieldRoiPrediction(
  cropName,
  acreage,
  seedGrade,
  fertilizerBudget,
  district,
) {
  const systemPrompt =
    "You are an agricultural financial advisor for Indian farmers. Always return ONLY raw JSON, no markdown.";
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
    calculateLocalYieldRoiFallback(
      cropName,
      acreage,
      seedGrade,
      fertilizerBudget,
    ),
  );
}

// Helper 4: getPestRisks
export async function getPestRisks(
  cropName,
  growthStage,
  temperature,
  humidity,
  district,
) {
  const systemPrompt =
    "You are a plant pathology expert for Indian farmers. Always return ONLY raw JSON, no markdown.";
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

  const fallbackRisks = seededData.cropRecommendation.fallbacks.pestRisks;

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackRisks,
  );
}

// Helper 5: getMarketData
export async function getMarketData(cropName, district) {
  const systemPrompt =
    "You are an agricultural market analyst for India. Always return ONLY raw JSON, no markdown.";
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

  const fallbackMarket = seededData.cropRecommendation.fallbacks.marketData;

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackMarket,
  );
}

// Helper 6: getSeasonalCalendar
export async function getSeasonalCalendar(selectedCrops, district, season) {
  const systemPrompt =
    "You are an agronomic calendar expert for Indian farmers. Always return ONLY raw JSON, no markdown.";
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

  const fallbackCalendar = seededData.cropRecommendation.fallbacks.seasonalCalendar;

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackCalendar,
  );
}

// Helper 7: getIrrigationSchedule
export async function getIrrigationSchedule(crop, stage, district, state, rainfallData = null) {
  const systemPrompt =
    "You are a smart irrigation scheduling expert. Always return ONLY raw JSON, no markdown.";
  
  let rainfallContext = "";
  if (rainfallData) {
    if (rainfallData.summary) {
      rainfallContext = `Recent 7-day forecast rainfall summary: Total expected rainfall: ${rainfallData.summary.totalExpectedRainfall}mm, Average rain probability: ${rainfallData.summary.avgRainProbability}%.`;
    } else {
      rainfallContext = `Forecast/Rainfall context: ${JSON.stringify(rainfallData)}.`;
    }
  }

  const userPrompt = `Given crop: ${crop}, growth stage: ${stage}, location: ${district}, ${state}. ${rainfallContext}
  Return irrigation recommendations in this exact JSON shape:
  {
    "scheduledDays": [1, 5, 12, 18, 26, 30],
    "optionalDays": [8, 22],
    "moistureLevel": 62,
    "waterSavingTip": "Drip irrigation saves 40% water vs flood irrigation for wheat at tillering stage."
  }
  Ensure the days array represents dates within a 30-day month. Keep it realistic based on the crop's water demands. If high rainfall is predicted, decrease irrigation frequency to conserve water.`;

  const fallback = {
    scheduledDays: [1, 5, 12, 18, 26, 30],
    optionalDays: [8, 22],
    moistureLevel: crop.includes("Rice")
      ? 75
      : crop.includes("Cotton")
        ? 58
        : 62,
    waterSavingTip: `Drip irrigation saves 40% water vs flood irrigation for ${crop.split(" ")[0]} at ${stage} stage.`,
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallback,
  );
}


// Helper 8: getFertilizerPlan
export async function getFertilizerPlan(
  crop,
  stage,
  region,
  nitrogen,
  phosphorus,
  potassium,
) {
  const systemPrompt =
    "You are an agricultural soil chemistry expert. Always return ONLY raw JSON, no markdown.";
  const userPrompt = `Given Crop: ${crop}, Stage: ${stage}, Region: ${region}, soil measurements: N=${nitrogen}, P=${phosphorus}, K=${potassium} kg/ha.
  Return recommended targets and split fertilizer application programs in this exact JSON shape:
  {
    "targetNPK": { "nitrogen": 120, "phosphorus": 60, "potassium": 40 },
    "isExcessN": true,
    "warningText": "Current regional N levels exceed recommended 120 kg/ha for Wheat at Tillering. Reduce nitrogen application to avoid crop burning.",
    "scheduleSteps": [
      {
        "step": "1",
        "title": "Basal Dressing (Sowing)",
        "desc": "Apply 50kg/acre NPK 12:32:16 as seed-bed baseline dressing.",
        "timing": "Sowing Day 1"
      },
      {
        "step": "2",
        "title": "First Top Dressing (Tillering)",
        "desc": "Apply standard Urea dressing restricted to 25kg/acre (reduced by 15kg due to high baseline N).",
        "timing": "Day 21 - 25"
      },
      {
        "step": "3",
        "title": "Second Top Dressing (Jointing)",
        "desc": "Apply 30kg/acre Urea mixed with 10kg Zinc Sulphate for grain initiation.",
        "timing": "Day 45"
      },
      {
        "step": "4",
        "title": "Foliar Spray (Flowering)",
        "desc": "Apply 2% DAP foliar spray to optimize phosphorus transmission to spikelets.",
        "timing": "Day 60"
      }
    ]
  }
  Ensure your target calculation is realistic for ${crop} at ${stage}.`;

  const fallback = {
    targetNPK: { nitrogen: 120, phosphorus: 60, potassium: 40 },
    isExcessN: nitrogen > 120,
    warningText:
      nitrogen > 120
        ? `Current regional N levels (${nitrogen} kg/ha) exceed recommended 120 kg/ha for ${crop.split(" ")[0]} at ${stage}. Reduce nitrogen application to avoid crop burning.`
        : `Current regional N levels (${nitrogen} kg/ha) sit below recommended 120 kg/ha. Standard Urea dressings should be fully applied to maximize tillering counts.`,
    scheduleSteps: [
      {
        step: "1",
        title: "Basal Dressing (Sowing)",
        desc: "Apply 50kg/acre NPK 12:32:16 as seed-bed baseline dressing.",
        timing: "Sowing Day 1",
      },
      {
        step: "2",
        title: "First Top Dressing (Tillering)",
        desc:
          nitrogen > 120
            ? `Apply standard Urea dressing restricted to 25kg/acre (reduced by ${nitrogen - 120}kg due to high baseline N).`
            : "Apply Urea dressing at 40kg/acre to elevate available nitrogen.",
        timing: "Day 21 - 25",
      },
      {
        step: "3",
        title: "Second Top Dressing (Jointing)",
        desc: "Apply 30kg/acre Urea mixed with 10kg Zinc Sulphate for grain initiation.",
        timing: "Day 45",
      },
      {
        step: "4",
        title: "Foliar Spray (Flowering)",
        desc: "Apply 2% DAP foliar spray to optimize phosphorus transmission to spikelets.",
        timing: "Day 60",
      },
    ],
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallback,
  );
}

// Helper 9: getLifecycleGuidance
export async function getLifecycleGuidance(crop, sowingDate, district, state) {
  const systemPrompt =
    "You are a senior agronomist tracking crop phenological growth calendars. Always return ONLY raw JSON, no markdown.";
  const userPrompt = `Given Crop: ${crop}, Sowing Date: ${sowingDate}, Location: ${district}, ${state}.
  Return an 8-stage phenological growth calendar and AI weather/pathogen alerts in this exact JSON shape:
  {
    "phases": [
      { "id": 1, "name": "Land Preparation", "desc": "Field plowed and baseline gypsum applied for salinity buffering.", "date": "Nov 05, 2025" },
      { "id": 2, "name": "Sowing", "desc": "Certified seeds sown at 4-5 cm depth.", "date": "Nov 15, 2025" }
    ],
    "harvestWindow": "Mar 15 - Mar 22",
    "yieldAtRisk": "20% - 25%",
    "interventions": [
      {
        "type": "weather",
        "title": "Nitrogen Application Optimization",
        "desc": "Based on this week's localized weather forecast (light rain expected on Thursday), the AI model advises delaying urea top-dressing by 3 days."
      },
      {
        "type": "pest",
        "title": "Microclimate Proximity Warning",
        "desc": "Thermal humidity index spikes detected. Monitor leaf wetness thresholds closely during the next 48 hours to prevent early Leaf Blight."
      }
    ]
  }
  Ensure you return exactly 8 phases starting from Land Preparation to Harvest.`;

  const fallback = {
    phases: [
      {
        id: 1,
        name: "Land Preparation",
        desc: "Field plowed and baseline gypsum applied for salinity buffering.",
        date: "Nov 05, 2025",
      },
      {
        id: 2,
        name: "Sowing",
        desc: "Certified seeds sown at 4-5 cm depth.",
        date: "Nov 15, 2025",
      },
      {
        id: 3,
        name: "Germination",
        desc: "Coleoptile emergence success rate mapped at 96%.",
        date: "Nov 25, 2025",
      },
      {
        id: 4,
        name: "Tillering",
        desc: "Crown roots initiating. Critical Nitrogen top-dressing required.",
        date: "Dec 18, 2025",
      },
      {
        id: 5,
        name: "Jointing",
        desc: "Stalk elongation phase. First node visible. Keep soil moisture at baseline.",
        date: "Jan 15, 2026",
      },
      {
        id: 6,
        name: "Flowering",
        desc: "Pollen tube expansion and spikelet emergence.",
        date: "Feb 10, 2026",
      },
      {
        id: 7,
        name: "Grain Filling",
        desc: "Milk-to-dough translocation to grain kernels.",
        date: "Feb 28, 2026",
      },
      {
        id: 8,
        name: "Harvest",
        desc: "Physiological maturity reached. Combine reaping recommended.",
        date: "Mar 20, 2026",
      },
    ],
    harvestWindow: "Mar 15 - Mar 22",
    yieldAtRisk: "20% - 25%",
    interventions: [
      {
        type: "weather",
        title: "Nitrogen Application Optimization",
        desc: "Based on this week's localized weather forecast (light rain expected on Thursday), the AI model advises delaying urea top-dressing by 3 days.",
      },
      {
        type: "pest",
        title: "Microclimate Proximity Warning",
        desc: "Thermal humidity index spikes detected. Monitor leaf wetness thresholds closely during the next 48 hours to prevent early Leaf Blight.",
      },
    ],
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallback,
  );
}
