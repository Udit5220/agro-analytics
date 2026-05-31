// PRIMARY: Gemini API (gemini-1.5-flash or gemini-1.5-pro mapped to gemini-3.5-flash or gemini-3.1-pro-preview)
// FALLBACK: static hardcoded data from original component

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Custom robust cascading fallback wrapper as defined by rules
const fetchWithFallback = async (geminiCallFn, fallbackData) => {
  try {
    if (!API_KEY) {
      console.warn("Disease Gemini API Key is missing. Serving high-fidelity static fallbacks.");
      return fallbackData;
    }
    const result = await geminiCallFn();
    if (!result || Object.keys(result).length === 0) {
      return fallbackData;
    }
    return result;
  } catch (error) {
    console.warn("Gemini API failed, using fallback:", error);
    return fallbackData;
  }
};

/**
 * Invokes the standard quick-inference model gemini-3.5-flash.
 */
export async function callGeminiFlash(userPrompt, systemPrompt) {
  const model = "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 1000, temperature: 0.4 }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to invoke Gemini Flash.`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response returned from Gemini Flash.");
  }

  const clean = text.replace(/```json|```/gi, "").trim();
  return JSON.parse(clean);
}

/**
 * Invokes the high-intelligence analytical model gemini-3.1-pro-preview.
 */
export async function callGeminiPro(userPrompt, systemPrompt) {
  const model = "gemini-3.1-pro-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 1000, temperature: 0.4 }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to invoke Gemini Pro.`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response returned from Gemini Pro.");
  }

  const clean = text.replace(/```json|```/gi, "").trim();
  return JSON.parse(clean);
}

/**
 * Dynamic Disease Risk Dashboard details helper.
 */
export async function getDashboardData(district, state) {
  const systemPrompt = "You are a plant pathology expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
  const userPrompt = `Given district: ${district}, state: ${state}
  Return this exact JSON shape:
  {
    "criticalAlert": {
      "crop": "Rice",
      "disease": "Blast Disease",
      "probability": 74,
      "message": "High Blast Risk in Your Region This Week — ${district} district — Rice Blast (Pyricularia oryzae) — Probability 74%. Immediate fungicide application advised."
    },
    "metrics": {
      "activeAlerts": 7,
      "cropsMonitored": 9,
      "districtsCovered": 14,
      "alertsSentToday": 34
    },
    "riskSummary": [
      {
        "crop": "Wheat",
        "cropHindi": "गेहूं",
        "disease": "Yellow Rust",
        "riskLevel": "High",
        "action": "Apply fungicide immediately — Propiconazole 0.1%"
      },
      {
        "crop": "Rice",
        "cropHindi": "धान",
        "disease": "Blast Disease",
        "riskLevel": "High",
        "action": "Spray Tricyclazole 75 WP @ 300g/acre"
      },
      {
        "crop": "Cotton",
        "cropHindi": "कपास",
        "disease": "Whitefly",
        "riskLevel": "Moderate",
        "action": "Monitor daily; spray Imidacloprid if count exceeds 10/leaf"
      },
      {
        "crop": "Maize",
        "cropHindi": "मक्का",
        "disease": "Leaf Blight",
        "riskLevel": "Low",
        "action": "Preventive copper fungicide spray recommended"
      },
      {
        "crop": "Mustard",
        "cropHindi": "सरसों",
        "disease": "Alternaria Blight",
        "riskLevel": "Moderate",
        "action": "Seed treatment with Thiram; field monitoring twice weekly"
      }
    ],
    "weatherInfluence": [
      {
        "parameter": "Humidity",
        "currentValue": "78%",
        "variance": "↑ +18%",
        "impact": "High humidity accelerates fungal spread",
        "isDanger": true
      },
      {
        "parameter": "Temperature",
        "currentValue": "29°C",
        "variance": "↑ +8%",
        "impact": "Warm nights favor pathogen growth",
        "isDanger": true
      },
      {
        "parameter": "Wind",
        "currentValue": "6 km/h",
        "variance": "↓ -5%",
        "impact": "Low wind reduces spore dispersal",
        "isDanger": false
      },
      {
        "parameter": "Rainfall",
        "currentValue": "2mm",
        "variance": "↑ +12%",
        "impact": "Recent rain creates leaf wetness — high blast risk",
        "isDanger": true
      }
    ]
  }
  Return exactly 5 risk summary rows and 4 weather influence cards. Make data realistic and urgent for ${district} in state ${state} during the current season.`;

  const fallbackDashboard = {
    criticalAlert: {
      crop: "Rice",
      disease: "Blast Disease",
      probability: 74,
      message: `High Blast Risk in Your Region This Week — ${district} district — Rice Blast (Pyricularia oryzae) — Probability 74%. Immediate fungicide application advised.`
    },
    metrics: {
      activeAlerts: 7,
      cropsMonitored: 9,
      districtsCovered: 14,
      alertsSentToday: 34
    },
    riskSummary: [
      { crop: "Wheat", cropHindi: "गेहूं", disease: "Yellow Rust", riskLevel: "High", action: "Apply fungicide immediately — Propiconazole 0.1%" },
      { crop: "Rice", cropHindi: "धान", disease: "Blast Disease", riskLevel: "High", action: "Spray Tricyclazole 75 WP @ 300g/acre" },
      { crop: "Cotton", cropHindi: "कपास", disease: "Whitefly", riskLevel: "Moderate", action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf" },
      { crop: "Maize", cropHindi: "मक्का", disease: "Leaf Blight", riskLevel: "Low", action: "Preventive copper fungicide spray recommended" },
      { crop: "Mustard", cropHindi: "सरसों", disease: "Alternaria Blight", riskLevel: "Moderate", action: "Seed treatment with Thiram; field monitoring twice weekly" }
    ],
    weatherInfluence: [
      { parameter: "Humidity", currentValue: "78%", variance: "↑ +18%", impact: "High humidity accelerates fungal spread", isDanger: true },
      { parameter: "Temperature", currentValue: "29°C", variance: "↑ +8%", impact: "Warm nights favor pathogen growth", isDanger: true },
      { parameter: "Wind", currentValue: "6 km/h", variance: "↓ -5%", impact: "Low wind reduces spore dispersal", isDanger: false },
      { parameter: "Rainfall", currentValue: "2mm", variance: "↑ +12%", impact: "Recent rain creates leaf wetness — high blast risk", isDanger: true }
    ]
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackDashboard
  );
}

/**
 * Heavy Predictive Analytics for Pathology Risks.
 */
export async function getRiskPrediction(crop, growthStage, location, temperature, humidity, rainfall, windSpeed) {
  const systemPrompt = "You are an AI plant disease prediction expert. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
  const userPrompt = `Given conditions —
  Crop: ${crop}, Growth Stage: ${growthStage},
  State: ${location.state || "Haryana"}, District: ${location.district || "Faridabad"}, Pincode: ${location.pincode || "121001"},
  Soil Type: ${location.soilData?.soilType || "Loamy Soil"}, Soil pH: ${location.soilData?.pH || 6.8},
  Soil Nitrogen (N): ${location.soilData?.nitrogen || 275} kg/ha, Soil Phosphorus (P): ${location.soilData?.phosphorus || 19} kg/ha,
  Temperature: ${temperature}C, Humidity: ${humidity}%, Rainfall: ${rainfall}mm,
  Wind Speed: ${windSpeed} km/h
  Return this exact JSON shape:
  {
    "compositeRiskScore": 65,
    "riskLevel": "Medium",
    "pathogens": [
      {
        "name": "Blast Disease",
        "probability": 72,
        "severity": "High",
        "trend": "Rising"
      },
      {
        "name": "Brown Spot",
        "probability": 55,
        "severity": "Medium",
        "trend": "Stable"
      },
      {
        "name": "Sheath Blight",
        "probability": 45,
        "severity": "Medium",
        "trend": "Stable"
      },
      {
        "name": "Leaf Blight",
        "probability": 25,
        "severity": "Low",
        "trend": "Falling"
      }
    ],
    "treatments": [
      {
        "priority": "Immediate",
        "action": "Apply fungicide immediately — Propiconazole 0.1%",
        "product": "Propiconazole"
      },
      {
        "priority": "Preventive",
        "action": "Spray Tricyclazole 75 WP @ 300g/acre",
        "product": "Tricyclazole"
      },
      {
        "priority": "Monitor",
        "action": "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
        "product": "Imidacloprid"
      }
    ],
    "analysis": "Warm nights and high humidity favor blast pathogen growth. Dense canopy increases leaf wetness duration."
  }
  Return exactly 4 pathogens and 3 treatments. compositeRiskScore must reflect the combined effect of the soil structure, location coordinates, and weather inputs on the specific crop and growth stage.`;

  const fallbackPrediction = {
    compositeRiskScore: 65,
    riskLevel: "Medium",
    pathogens: [
      { name: "Blast Disease", probability: 72, severity: "High", trend: "Rising" },
      { name: "Brown Spot", probability: 55, severity: "Medium", trend: "Stable" },
      { name: "Sheath Blight", probability: 45, severity: "Medium", trend: "Stable" },
      { name: "Leaf Blight", probability: 25, severity: "Low", trend: "Falling" }
    ],
    treatments: [
      { priority: "Immediate", action: "Apply fungicide immediately — Propiconazole 0.1%", product: "Propiconazole" },
      { priority: "Preventive", action: "Spray Tricyclazole 75 WP @ 300g/acre", product: "Tricyclazole" },
      { priority: "Monitor", action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf", product: "Imidacloprid" }
    ],
    analysis: "Warm nights and high humidity favor blast pathogen growth. Dense canopy increases leaf wetness duration."
  };

  return fetchWithFallback(
    () => callGeminiPro(userPrompt, systemPrompt),
    fallbackPrediction
  );
}

/**
 * Heatmap spatial nodes mapping.
 */
export async function getHeatmapData(disease, state, district) {
  const systemPrompt = "You are a disease outbreak mapping expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
  const userPrompt = `Given disease filter: ${disease}, state: ${state}
  Return this exact JSON shape:
  {
    "nodes": [
      {
        "id": "north_1",
        "label": "Punjab / J&K Border",
        "state": "Punjab",
        "x": 140,
        "y": 110,
        "riskWeight": 88,
        "crop": "Wheat",
        "incidents": 24,
        "radius": 25
      }
    ],
    "activeIncidents": [
      {
        "location": "Karnal",
        "disease": "Blast Disease",
        "severity": "High",
        "reportedAt": "2 hours ago",
        "affectedArea": "340 acres"
      }
    ]
  }
  Return exactly 8 nodes spread across India map coordinates (x between 20 and 380, y between 20 and 430) and exactly 4 active incidents. If state is not "All" focus nodes on that state.`;

  const fallbackHeatmap = {
    nodes: [
      { id: "north_1", label: "Punjab / J&K Border", state: "Punjab", x: 140, y: 110, riskWeight: 88, crop: "Wheat", incidents: 24, radius: 25 },
      { id: "north_2", label: "Karnal Cluster", state: "Haryana", x: 180, y: 140, riskWeight: 92, crop: "Rice", incidents: 14, radius: 30 },
      { id: "north_3", label: "Panipat Core", state: "Haryana", x: 190, y: 160, riskWeight: 78, crop: "Wheat", incidents: 11, radius: 20 },
      { id: "north_4", label: "Faridabad Zone", state: "Haryana", x: 200, y: 190, riskWeight: 95, crop: "Rice", incidents: 17, radius: 28 },
      { id: "west_1", label: "Sri Ganganagar Belt", state: "Rajasthan", x: 90, y: 170, riskWeight: 42, crop: "Bajra", incidents: 5, radius: 18 },
      { id: "west_2", label: "Jaipur Basin", state: "Rajasthan", x: 120, y: 230, riskWeight: 35, crop: "Mustard", incidents: 2, radius: 15 },
      { id: "central_1", label: "Mathura Fringe", state: "Uttar Pradesh", x: 230, y: 200, riskWeight: 65, crop: "Vegetables", incidents: 9, radius: 22 },
      { id: "central_2", label: "Lucknow Interior", state: "Uttar Pradesh", x: 320, y: 240, riskWeight: 58, crop: "Sugarcane", incidents: 12, radius: 24 }
    ],
    activeIncidents: [
      { location: "Karnal", disease: "Blast Disease", severity: "High", reportedAt: "2 hours ago", affectedArea: "340 acres" },
      { location: "Panipat", disease: "Yellow Rust", severity: "Moderate", reportedAt: "4 hours ago", affectedArea: "180 acres" },
      { location: "Sirsa", disease: "Whitefly", severity: "High", reportedAt: "1 day ago", affectedArea: "210 acres" },
      { location: "Faridabad", disease: "Sheath Blight", severity: "Moderate", reportedAt: "3 days ago", affectedArea: "145 acres" }
    ]
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackHeatmap
  );
}

/**
 * Therapeutic Advisors Treatment Programs helper.
 */
export async function getTreatments(disease, treatmentType) {
  const systemPrompt = "You are an agricultural treatment expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
  const userPrompt = `Given disease: ${disease}, treatment type: ${treatmentType}
  where treatmentType is either organic or chemical
  Return this exact JSON shape:
  {
    "treatments": [
      {
        "name": "Trichoderma viride",
        "rating": 4,
        "costPerAcre": 320,
        "method": "Soil drench + seed treatment",
        "dosage": "2.5 kg/acre",
        "timing": "Before sowing + at tillering",
        "warning": null,
        "effectiveness": "High"
      }
    ],
    "spraySchedule": [
      1, 5, 10, 15, 22, 28
    ]
  }
  Return exactly 3 treatments appropriate for that disease and type. spraySchedule must be an array of day numbers between 1 and 30 on which spraying should be done, return 6 spray days. Make recommendations realistic for Indian farming conditions.`;

  const fallbackTreatments = {
    treatments: [
      { name: "Trichoderma viride", rating: 4, costPerAcre: 320, method: "Soil drench + seed treatment", dosage: "2.5 kg/acre", timing: "Before sowing + at tillering", warning: null, effectiveness: "High" },
      { name: "Neem Oil Spray", rating: 3, costPerAcre: 180, method: "Foliar spray", dosage: "3L neem oil in 200L water", timing: "Every 10 days from flag leaf stage", warning: "Avoid spraying during flowering", effectiveness: "Medium" },
      { name: "Pseudomonas fluorescens", rating: 4, costPerAcre: 280, method: "Seed coating + soil application", dosage: "10g/kg seed + 2.5 kg/acre", timing: "Seed treatment + 30 DAT", warning: null, effectiveness: "High" }
    ],
    spraySchedule: [1, 5, 10, 15, 22, 28]
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackTreatments
  );
}

/**
 * Phenological Stages & Checklist advisor.
 */
export async function getLifecycleData(crop) {
  const systemPrompt = "You are an agronomic crop lifecycle expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
  const userPrompt = `Given crop: ${crop}
  Return this exact JSON shape:
  {
    "stages": [
      {
        "name": "Seed",
        "duration": "0-7 days",
        "status": "completed",
        "progressPercent": 100,
        "diseases": [
          "Seed rot", "Damping off"
        ],
        "actions": [
          "Seed treatment with fungicide"
        ],
        "checklist": []
      }
    ],
    "currentStageIndex": 2
  }
  Return exactly 6 stages: Seed, Germination, Vegetative, Flowering, Maturity, Harvest with realistic durations and disease risks for ${crop} in Haryana India. Only one stage should have status current, earlier completed, later upcoming. Only current stage has checklist items, others empty.`;

  const fallbackLifecycle = {
    stages: [
      { name: "Seed", duration: "0-7 days", status: "completed", progressPercent: 100, diseases: ["Seed rot", "Damping off"], actions: ["Seed treatment with fungicide"], checklist: [] },
      { name: "Germination", duration: "7-21 days", status: "completed", progressPercent: 100, diseases: ["Seedling blight"], actions: ["Monitor moisture levels"], checklist: [] },
      { name: "Vegetative", duration: "21-60 days", status: "current", progressPercent: 40, diseases: ["Blast disease", "Leaf blight"], actions: ["Weekly scouting", "Apply nitrogen top dressing"], checklist: [{ id: "scouting", label: "Weekly scouting done" }, { id: "nitrogen", label: "N top dressing applied" }, { id: "weedControl", label: "Weed control done" }] },
      { name: "Flowering", duration: "60-80 days", status: "upcoming", progressPercent: 0, diseases: ["Stem rot", "Bacterial blight"], actions: ["Monitor humidity levels"], checklist: [] },
      { name: "Maturity", duration: "80-110 days", status: "upcoming", progressPercent: 0, diseases: ["Grain discoloration"], actions: ["Ensure field drainage"], checklist: [] },
      { name: "Harvest", duration: "110-130 days", status: "upcoming", progressPercent: 0, diseases: ["Storage mold"], actions: ["Dry grains before storage"], checklist: [] }
    ],
    currentStageIndex: 2
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackLifecycle
  );
}

/**
 * Historical records filters and counters.
 */
export async function getOutbreakHistory(crop, disease) {
  const systemPrompt = "You are a disease outbreak historian for Indian agriculture. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
  const userPrompt = `Given filters — crop: ${crop}, disease: ${disease}
  where either can be All to return all records.
  Return this exact JSON shape:
  {
    "outbreaks": [
      {
        "id": "h1",
        "disease": "Blast Disease",
        "crop": "Rice",
        "location": "Karnal",
        "severity": "High",
        "affectedArea": "340 acres",
        "date": "Aug 12, 2025",
        "outcome": "Fungicide spray checked spread within 10 days"
      }
    ],
    "stats": {
      "totalOutbreaks": 6,
      "totalAffectedArea": "1,150 acres",
      "mostCommonDisease": "Blast Disease"
    }
  }
  Return 6 outbreak records filtered by crop and disease if provided. If both are All return all 6 records. Stats must reflect the returned records. Make locations realistic Haryana districts.`;

  const fallbackOutbreaks = {
    outbreaks: [
      { id: "h1", disease: "Blast Disease", crop: "Rice", location: "Karnal", severity: "High", affectedArea: "340 acres", date: "Aug 12, 2025", outcome: "Fungicide spray checked spread within 10 days" },
      { id: "h2", disease: "Yellow Rust", crop: "Wheat", location: "Panipat", severity: "Moderate", affectedArea: "180 acres", date: "Aug 4, 2025", outcome: "Early advisory restricted damage to 5% loss" },
      { id: "h3", disease: "Whitefly", crop: "Cotton", location: "Sirsa", severity: "High", affectedArea: "210 acres", date: "Jul 20, 2025", outcome: "Resistance built due to continuous insecticide use" },
      { id: "h4", disease: "Leaf Blight", crop: "Maize", location: "Hisar", severity: "Low", affectedArea: "80 acres", date: "Jun 30, 2025", outcome: "Standard copper spray resolved symptoms quickly" },
      { id: "h5", disease: "Sheath Blight", crop: "Rice", location: "Faridabad", severity: "Moderate", affectedArea: "145 acres", date: "May 18, 2025", outcome: "Canopy aeration techniques checked infection" },
      { id: "h6", disease: "Alternaria Blight", crop: "Mustard", location: "Ambala", severity: "Moderate", affectedArea: "95 acres", date: "Apr 5, 2025", outcome: "Seed dressing significantly reduced field severity" }
    ],
    stats: {
      totalOutbreaks: 6,
      totalAffectedArea: "1,150 acres",
      mostCommonDisease: "Blast Disease"
    }
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackOutbreaks
  );
}
