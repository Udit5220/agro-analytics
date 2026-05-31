// // PRIMARY: Gemini API (gemini-1.5-flash or gemini-1.5-pro mapped to gemini-3.5-flash or gemini-3.1-pro-preview)
// // FALLBACK: static hardcoded data from original component

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// // Custom robust cascading fallback wrapper as defined by rules
// const fetchWithFallback = async (geminiCallFn, fallbackData) => {
//   try {
//     if (!API_KEY) {
//       console.warn(
//         "Disease Gemini API Key is missing. Serving high-fidelity static fallbacks.",
//       );
//       return fallbackData;
//     }
//     const result = await geminiCallFn();
//     if (!result || Object.keys(result).length === 0) {
//       return fallbackData;
//     }
//     return result;
//   } catch (error) {
//     console.warn("Gemini API failed, using fallback:", error);
//     return fallbackData;
//   }
// };

// /**
//  * Invokes the standard quick-inference model gemini-3.5-flash.
//  */
// export async function callGeminiFlash(userPrompt, systemPrompt) {
//   const model = "gemini-3.5-flash";
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ role: "user", parts: [{ text: userPrompt }] }],
//       system_instruction: { parts: [{ text: systemPrompt }] },
//       generationConfig: { maxOutputTokens: 1000, temperature: 0.4 },
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: Failed to invoke Gemini Flash.`);
//   }

//   const data = await response.json();
//   const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//   if (!text) {
//     throw new Error("Empty response returned from Gemini Flash.");
//   }

//   const clean = text.replace(/```json|```/gi, "").trim();
//   return JSON.parse(clean);
// }

// /**
//  * Invokes the high-intelligence analytical model gemini-3.1-pro-preview.
//  */
// export async function callGeminiPro(userPrompt, systemPrompt) {
//   const model = "gemini-3.1-pro-preview";
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ role: "user", parts: [{ text: userPrompt }] }],
//       system_instruction: { parts: [{ text: systemPrompt }] },
//       generationConfig: { maxOutputTokens: 1000, temperature: 0.4 },
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}: Failed to invoke Gemini Pro.`);
//   }

//   const data = await response.json();
//   const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//   if (!text) {
//     throw new Error("Empty response returned from Gemini Pro.");
//   }

//   const clean = text.replace(/```json|```/gi, "").trim();
//   return JSON.parse(clean);
// }

// /**
//  * Dynamic Disease Risk Dashboard details helper.
//  */
// export async function getDashboardData(district, state) {
//   const systemPrompt =
//     "You are a plant pathology expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
//   const userPrompt = `Given district: ${district}, state: ${state}
//   Return this exact JSON shape:
//   {
//     "criticalAlert": {
//       "crop": "Rice",
//       "disease": "Blast Disease",
//       "probability": 74,
//       "message": "High Blast Risk in Your Region This Week — ${district} district — Rice Blast (Pyricularia oryzae) — Probability 74%. Immediate fungicide application advised."
//     },
//     "metrics": {
//       "activeAlerts": 7,
//       "cropsMonitored": 9,
//       "districtsCovered": 14,
//       "alertsSentToday": 34
//     },
//     "riskSummary": [
//       {
//         "crop": "Wheat",
//         "cropHindi": "गेहूं",
//         "disease": "Yellow Rust",
//         "riskLevel": "High",
//         "action": "Apply fungicide immediately — Propiconazole 0.1%"
//       },
//       {
//         "crop": "Rice",
//         "cropHindi": "धान",
//         "disease": "Blast Disease",
//         "riskLevel": "High",
//         "action": "Spray Tricyclazole 75 WP @ 300g/acre"
//       },
//       {
//         "crop": "Cotton",
//         "cropHindi": "कपास",
//         "disease": "Whitefly",
//         "riskLevel": "Moderate",
//         "action": "Monitor daily; spray Imidacloprid if count exceeds 10/leaf"
//       },
//       {
//         "crop": "Maize",
//         "cropHindi": "मक्का",
//         "disease": "Leaf Blight",
//         "riskLevel": "Low",
//         "action": "Preventive copper fungicide spray recommended"
//       },
//       {
//         "crop": "Mustard",
//         "cropHindi": "सरसों",
//         "disease": "Alternaria Blight",
//         "riskLevel": "Moderate",
//         "action": "Seed treatment with Thiram; field monitoring twice weekly"
//       }
//     ],
//     "weatherInfluence": [
//       {
//         "parameter": "Humidity",
//         "currentValue": "78%",
//         "variance": "↑ +18%",
//         "impact": "High humidity accelerates fungal spread",
//         "isDanger": true
//       },
//       {
//         "parameter": "Temperature",
//         "currentValue": "29°C",
//         "variance": "↑ +8%",
//         "impact": "Warm nights favor pathogen growth",
//         "isDanger": true
//       },
//       {
//         "parameter": "Wind",
//         "currentValue": "6 km/h",
//         "variance": "↓ -5%",
//         "impact": "Low wind reduces spore dispersal",
//         "isDanger": false
//       },
//       {
//         "parameter": "Rainfall",
//         "currentValue": "2mm",
//         "variance": "↑ +12%",
//         "impact": "Recent rain creates leaf wetness — high blast risk",
//         "isDanger": true
//       }
//     ]
//   }
//   Return exactly 5 risk summary rows and 4 weather influence cards. Make data realistic and urgent for ${district} in state ${state} during the current season.`;

//   const fallbackDashboard = {
//     criticalAlert: {
//       crop: "Rice",
//       disease: "Blast Disease",
//       probability: 74,
//       message: `High Blast Risk in Your Region This Week — ${district} district — Rice Blast (Pyricularia oryzae) — Probability 74%. Immediate fungicide application advised.`,
//     },
//     metrics: {
//       activeAlerts: 7,
//       cropsMonitored: 9,
//       districtsCovered: 14,
//       alertsSentToday: 34,
//     },
//     riskSummary: [
//       {
//         crop: "Wheat",
//         cropHindi: "गेहूं",
//         disease: "Yellow Rust",
//         riskLevel: "High",
//         action: "Apply fungicide immediately — Propiconazole 0.1%",
//       },
//       {
//         crop: "Rice",
//         cropHindi: "धान",
//         disease: "Blast Disease",
//         riskLevel: "High",
//         action: "Spray Tricyclazole 75 WP @ 300g/acre",
//       },
//       {
//         crop: "Cotton",
//         cropHindi: "कपास",
//         disease: "Whitefly",
//         riskLevel: "Moderate",
//         action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
//       },
//       {
//         crop: "Maize",
//         cropHindi: "मक्का",
//         disease: "Leaf Blight",
//         riskLevel: "Low",
//         action: "Preventive copper fungicide spray recommended",
//       },
//       {
//         crop: "Mustard",
//         cropHindi: "सरसों",
//         disease: "Alternaria Blight",
//         riskLevel: "Moderate",
//         action: "Seed treatment with Thiram; field monitoring twice weekly",
//       },
//     ],
//     weatherInfluence: [
//       {
//         parameter: "Humidity",
//         currentValue: "78%",
//         variance: "↑ +18%",
//         impact: "High humidity accelerates fungal spread",
//         isDanger: true,
//       },
//       {
//         parameter: "Temperature",
//         currentValue: "29°C",
//         variance: "↑ +8%",
//         impact: "Warm nights favor pathogen growth",
//         isDanger: true,
//       },
//       {
//         parameter: "Wind",
//         currentValue: "6 km/h",
//         variance: "↓ -5%",
//         impact: "Low wind reduces spore dispersal",
//         isDanger: false,
//       },
//       {
//         parameter: "Rainfall",
//         currentValue: "2mm",
//         variance: "↑ +12%",
//         impact: "Recent rain creates leaf wetness — high blast risk",
//         isDanger: true,
//       },
//     ],
//   };

//   return fetchWithFallback(
//     () => callGeminiFlash(userPrompt, systemPrompt),
//     fallbackDashboard,
//   );
// }

// /**
//  * Heavy Predictive Analytics for Pathology Risks.
//  */
// export async function getRiskPrediction(
//   crop,
//   growthStage,
//   location,
//   temperature,
//   humidity,
//   rainfall,
//   windSpeed,
// ) {
//   const systemPrompt =
//     "You are an AI plant disease prediction expert. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
//   const userPrompt = `Given conditions —
//   Crop: ${crop}, Growth Stage: ${growthStage},
//   State: ${location.state || "Haryana"}, District: ${location.district || "Faridabad"}, Pincode: ${location.pincode || "121001"},
//   Soil Type: ${location.soilData?.soilType || "Loamy Soil"}, Soil pH: ${location.soilData?.pH || 6.8},
//   Soil Nitrogen (N): ${location.soilData?.nitrogen || 275} kg/ha, Soil Phosphorus (P): ${location.soilData?.phosphorus || 19} kg/ha,
//   Temperature: ${temperature}C, Humidity: ${humidity}%, Rainfall: ${rainfall}mm,
//   Wind Speed: ${windSpeed} km/h
//   Return this exact JSON shape:
//   {
//     "compositeRiskScore": 65,
//     "riskLevel": "Medium",
//     "pathogens": [
//       {
//         "name": "Blast Disease",
//         "probability": 72,
//         "severity": "High",
//         "trend": "Rising"
//       },
//       {
//         "name": "Brown Spot",
//         "probability": 55,
//         "severity": "Medium",
//         "trend": "Stable"
//       },
//       {
//         "name": "Sheath Blight",
//         "probability": 45,
//         "severity": "Medium",
//         "trend": "Stable"
//       },
//       {
//         "name": "Leaf Blight",
//         "probability": 25,
//         "severity": "Low",
//         "trend": "Falling"
//       }
//     ],
//     "treatments": [
//       {
//         "priority": "Immediate",
//         "action": "Apply fungicide immediately — Propiconazole 0.1%",
//         "product": "Propiconazole"
//       },
//       {
//         "priority": "Preventive",
//         "action": "Spray Tricyclazole 75 WP @ 300g/acre",
//         "product": "Tricyclazole"
//       },
//       {
//         "priority": "Monitor",
//         "action": "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
//         "product": "Imidacloprid"
//       }
//     ],
//     "analysis": "Warm nights and high humidity favor blast pathogen growth. Dense canopy increases leaf wetness duration."
//   }
//   Return exactly 4 pathogens and 3 treatments. compositeRiskScore must reflect the combined effect of the soil structure, location coordinates, and weather inputs on the specific crop and growth stage.`;

//   const fallbackPrediction = {
//     compositeRiskScore: 65,
//     riskLevel: "Medium",
//     pathogens: [
//       {
//         name: "Blast Disease",
//         probability: 72,
//         severity: "High",
//         trend: "Rising",
//       },
//       {
//         name: "Brown Spot",
//         probability: 55,
//         severity: "Medium",
//         trend: "Stable",
//       },
//       {
//         name: "Sheath Blight",
//         probability: 45,
//         severity: "Medium",
//         trend: "Stable",
//       },
//       {
//         name: "Leaf Blight",
//         probability: 25,
//         severity: "Low",
//         trend: "Falling",
//       },
//     ],
//     treatments: [
//       {
//         priority: "Immediate",
//         action: "Apply fungicide immediately — Propiconazole 0.1%",
//         product: "Propiconazole",
//       },
//       {
//         priority: "Preventive",
//         action: "Spray Tricyclazole 75 WP @ 300g/acre",
//         product: "Tricyclazole",
//       },
//       {
//         priority: "Monitor",
//         action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
//         product: "Imidacloprid",
//       },
//     ],
//     analysis:
//       "Warm nights and high humidity favor blast pathogen growth. Dense canopy increases leaf wetness duration.",
//   };

//   return fetchWithFallback(
//     () => callGeminiPro(userPrompt, systemPrompt),
//     fallbackPrediction,
//   );
// }

// /**
//  * Heatmap spatial nodes mapping.
//  */
// export async function getHeatmapData(disease, state, district) {
//   const systemPrompt =
//     "You are a disease outbreak mapping expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
//   const userPrompt = `Given disease filter: ${disease}, state: ${state}
//   Return this exact JSON shape:
//   {
//     "nodes": [
//       {
//         "id": "north_1",
//         "label": "Punjab / J&K Border",
//         "state": "Punjab",
//         "x": 140,
//         "y": 110,
//         "riskWeight": 88,
//         "crop": "Wheat",
//         "incidents": 24,
//         "radius": 25
//       }
//     ],
//     "activeIncidents": [
//       {
//         "location": "Karnal",
//         "disease": "Blast Disease",
//         "severity": "High",
//         "reportedAt": "2 hours ago",
//         "affectedArea": "340 acres"
//       }
//     ]
//   }
//   Return exactly 8 nodes spread across India map coordinates (x between 20 and 380, y between 20 and 430) and exactly 4 active incidents. If state is not "All" focus nodes on that state.`;

//   const fallbackHeatmap = {
//     nodes: [
//       {
//         id: "north_1",
//         label: "Punjab / J&K Border",
//         state: "Punjab",
//         x: 140,
//         y: 110,
//         riskWeight: 88,
//         crop: "Wheat",
//         incidents: 24,
//         radius: 25,
//       },
//       {
//         id: "north_2",
//         label: "Karnal Cluster",
//         state: "Haryana",
//         x: 180,
//         y: 140,
//         riskWeight: 92,
//         crop: "Rice",
//         incidents: 14,
//         radius: 30,
//       },
//       {
//         id: "north_3",
//         label: "Panipat Core",
//         state: "Haryana",
//         x: 190,
//         y: 160,
//         riskWeight: 78,
//         crop: "Wheat",
//         incidents: 11,
//         radius: 20,
//       },
//       {
//         id: "north_4",
//         label: "Faridabad Zone",
//         state: "Haryana",
//         x: 200,
//         y: 190,
//         riskWeight: 95,
//         crop: "Rice",
//         incidents: 17,
//         radius: 28,
//       },
//       {
//         id: "west_1",
//         label: "Sri Ganganagar Belt",
//         state: "Rajasthan",
//         x: 90,
//         y: 170,
//         riskWeight: 42,
//         crop: "Bajra",
//         incidents: 5,
//         radius: 18,
//       },
//       {
//         id: "west_2",
//         label: "Jaipur Basin",
//         state: "Rajasthan",
//         x: 120,
//         y: 230,
//         riskWeight: 35,
//         crop: "Mustard",
//         incidents: 2,
//         radius: 15,
//       },
//       {
//         id: "central_1",
//         label: "Mathura Fringe",
//         state: "Uttar Pradesh",
//         x: 230,
//         y: 200,
//         riskWeight: 65,
//         crop: "Vegetables",
//         incidents: 9,
//         radius: 22,
//       },
//       {
//         id: "central_2",
//         label: "Lucknow Interior",
//         state: "Uttar Pradesh",
//         x: 320,
//         y: 240,
//         riskWeight: 58,
//         crop: "Sugarcane",
//         incidents: 12,
//         radius: 24,
//       },
//     ],
//     activeIncidents: [
//       {
//         location: "Karnal",
//         disease: "Blast Disease",
//         severity: "High",
//         reportedAt: "2 hours ago",
//         affectedArea: "340 acres",
//       },
//       {
//         location: "Panipat",
//         disease: "Yellow Rust",
//         severity: "Moderate",
//         reportedAt: "4 hours ago",
//         affectedArea: "180 acres",
//       },
//       {
//         location: "Sirsa",
//         disease: "Whitefly",
//         severity: "High",
//         reportedAt: "1 day ago",
//         affectedArea: "210 acres",
//       },
//       {
//         location: "Faridabad",
//         disease: "Sheath Blight",
//         severity: "Moderate",
//         reportedAt: "3 days ago",
//         affectedArea: "145 acres",
//       },
//     ],
//   };

//   return fetchWithFallback(
//     () => callGeminiFlash(userPrompt, systemPrompt),
//     fallbackHeatmap,
//   );
// }

// /**
//  * Therapeutic Advisors Treatment Programs helper.
//  */
// export async function getTreatments(disease, treatmentType) {
//   const systemPrompt =
//     "You are an agricultural treatment expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
//   const userPrompt = `Given disease: ${disease}, treatment type: ${treatmentType}
//   where treatmentType is either organic or chemical
//   Return this exact JSON shape:
//   {
//     "treatments": [
//       {
//         "name": "Trichoderma viride",
//         "rating": 4,
//         "costPerAcre": 320,
//         "method": "Soil drench + seed treatment",
//         "dosage": "2.5 kg/acre",
//         "timing": "Before sowing + at tillering",
//         "warning": null,
//         "effectiveness": "High"
//       }
//     ],
//     "spraySchedule": [
//       1, 5, 10, 15, 22, 28
//     ]
//   }
//   Return exactly 3 treatments appropriate for that disease and type. spraySchedule must be an array of day numbers between 1 and 30 on which spraying should be done, return 6 spray days. Make recommendations realistic for Indian farming conditions.`;

//   const fallbackTreatments = {
//     treatments: [
//       {
//         name: "Trichoderma viride",
//         rating: 4,
//         costPerAcre: 320,
//         method: "Soil drench + seed treatment",
//         dosage: "2.5 kg/acre",
//         timing: "Before sowing + at tillering",
//         warning: null,
//         effectiveness: "High",
//       },
//       {
//         name: "Neem Oil Spray",
//         rating: 3,
//         costPerAcre: 180,
//         method: "Foliar spray",
//         dosage: "3L neem oil in 200L water",
//         timing: "Every 10 days from flag leaf stage",
//         warning: "Avoid spraying during flowering",
//         effectiveness: "Medium",
//       },
//       {
//         name: "Pseudomonas fluorescens",
//         rating: 4,
//         costPerAcre: 280,
//         method: "Seed coating + soil application",
//         dosage: "10g/kg seed + 2.5 kg/acre",
//         timing: "Seed treatment + 30 DAT",
//         warning: null,
//         effectiveness: "High",
//       },
//     ],
//     spraySchedule: [1, 5, 10, 15, 22, 28],
//   };

//   return fetchWithFallback(
//     () => callGeminiFlash(userPrompt, systemPrompt),
//     fallbackTreatments,
//   );
// }

// /**
//  * Phenological Stages & Checklist advisor.
//  */
// export async function getLifecycleData(crop) {
//   const systemPrompt =
//     "You are an agronomic crop lifecycle expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
//   const userPrompt = `Given crop: ${crop}
//   Return this exact JSON shape:
//   {
//     "stages": [
//       {
//         "name": "Seed",
//         "duration": "0-7 days",
//         "status": "completed",
//         "progressPercent": 100,
//         "diseases": [
//           "Seed rot", "Damping off"
//         ],
//         "actions": [
//           "Seed treatment with fungicide"
//         ],
//         "checklist": []
//       }
//     ],
//     "currentStageIndex": 2
//   }
//   Return exactly 6 stages: Seed, Germination, Vegetative, Flowering, Maturity, Harvest with realistic durations and disease risks for ${crop} in Haryana India. Only one stage should have status current, earlier completed, later upcoming. Only current stage has checklist items, others empty.`;

//   const fallbackLifecycle = {
//     stages: [
//       {
//         name: "Seed",
//         duration: "0-7 days",
//         status: "completed",
//         progressPercent: 100,
//         diseases: ["Seed rot", "Damping off"],
//         actions: ["Seed treatment with fungicide"],
//         checklist: [],
//       },
//       {
//         name: "Germination",
//         duration: "7-21 days",
//         status: "completed",
//         progressPercent: 100,
//         diseases: ["Seedling blight"],
//         actions: ["Monitor moisture levels"],
//         checklist: [],
//       },
//       {
//         name: "Vegetative",
//         duration: "21-60 days",
//         status: "current",
//         progressPercent: 40,
//         diseases: ["Blast disease", "Leaf blight"],
//         actions: ["Weekly scouting", "Apply nitrogen top dressing"],
//         checklist: [
//           { id: "scouting", label: "Weekly scouting done" },
//           { id: "nitrogen", label: "N top dressing applied" },
//           { id: "weedControl", label: "Weed control done" },
//         ],
//       },
//       {
//         name: "Flowering",
//         duration: "60-80 days",
//         status: "upcoming",
//         progressPercent: 0,
//         diseases: ["Stem rot", "Bacterial blight"],
//         actions: ["Monitor humidity levels"],
//         checklist: [],
//       },
//       {
//         name: "Maturity",
//         duration: "80-110 days",
//         status: "upcoming",
//         progressPercent: 0,
//         diseases: ["Grain discoloration"],
//         actions: ["Ensure field drainage"],
//         checklist: [],
//       },
//       {
//         name: "Harvest",
//         duration: "110-130 days",
//         status: "upcoming",
//         progressPercent: 0,
//         diseases: ["Storage mold"],
//         actions: ["Dry grains before storage"],
//         checklist: [],
//       },
//     ],
//     currentStageIndex: 2,
//   };

//   return fetchWithFallback(
//     () => callGeminiFlash(userPrompt, systemPrompt),
//     fallbackLifecycle,
//   );
// }

// /**
//  * Historical records filters and counters.
//  */
// export async function getOutbreakHistory(crop, disease) {
//   const systemPrompt =
//     "You are a disease outbreak historian for Indian agriculture. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
//   const userPrompt = `Given filters — crop: ${crop}, disease: ${disease}
//   where either can be All to return all records.
//   Return this exact JSON shape:
//   {
//     "outbreaks": [
//       {
//         "id": "h1",
//         "disease": "Blast Disease",
//         "crop": "Rice",
//         "location": "Karnal",
//         "severity": "High",
//         "affectedArea": "340 acres",
//         "date": "Aug 12, 2025",
//         "outcome": "Fungicide spray checked spread within 10 days"
//       }
//     ],
//     "stats": {
//       "totalOutbreaks": 6,
//       "totalAffectedArea": "1,150 acres",
//       "mostCommonDisease": "Blast Disease"
//     }
//   }
//   Return 6 outbreak records filtered by crop and disease if provided. If both are All return all 6 records. Stats must reflect the returned records. Make locations realistic Haryana districts.`;

//   const fallbackOutbreaks = {
//     outbreaks: [
//       {
//         id: "h1",
//         disease: "Blast Disease",
//         crop: "Rice",
//         location: "Karnal",
//         severity: "High",
//         affectedArea: "340 acres",
//         date: "Aug 12, 2025",
//         outcome: "Fungicide spray checked spread within 10 days",
//       },
//       {
//         id: "h2",
//         disease: "Yellow Rust",
//         crop: "Wheat",
//         location: "Panipat",
//         severity: "Moderate",
//         affectedArea: "180 acres",
//         date: "Aug 4, 2025",
//         outcome: "Early advisory restricted damage to 5% loss",
//       },
//       {
//         id: "h3",
//         disease: "Whitefly",
//         crop: "Cotton",
//         location: "Sirsa",
//         severity: "High",
//         affectedArea: "210 acres",
//         date: "Jul 20, 2025",
//         outcome: "Resistance built due to continuous insecticide use",
//       },
//       {
//         id: "h4",
//         disease: "Leaf Blight",
//         crop: "Maize",
//         location: "Hisar",
//         severity: "Low",
//         affectedArea: "80 acres",
//         date: "Jun 30, 2025",
//         outcome: "Standard copper spray resolved symptoms quickly",
//       },
//       {
//         id: "h5",
//         disease: "Sheath Blight",
//         crop: "Rice",
//         location: "Faridabad",
//         severity: "Moderate",
//         affectedArea: "145 acres",
//         date: "May 18, 2025",
//         outcome: "Canopy aeration techniques checked infection",
//       },
//       {
//         id: "h6",
//         disease: "Alternaria Blight",
//         crop: "Mustard",
//         location: "Ambala",
//         severity: "Moderate",
//         affectedArea: "95 acres",
//         date: "Apr 5, 2025",
//         outcome: "Seed dressing significantly reduced field severity",
//       },
//     ],
//     stats: {
//       totalOutbreaks: 6,
//       totalAffectedArea: "1,150 acres",
//       mostCommonDisease: "Blast Disease",
//     },
//   };

//   return fetchWithFallback(
//     () => callGeminiFlash(userPrompt, systemPrompt),
//     fallbackOutbreaks,
//   );
// }

// /**
//  * Multimodal image-based plant disease diagnosis calling gemini-1.5-flash.
//  * Accepts image file base64 data and mimeType and returns a detailed 16-key JSON pathology report.
//  */
// export async function diagnosePlantLeafImage(base64Data, mimeType) {
//   const model = "gemini-1.5-flash";
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

//   const systemPrompt =
//     "You are an expert Agricultural Plant Pathologist, Crop Disease Specialist, and Agronomist. Analyze the uploaded plant image carefully and provide a detailed agricultural diagnosis report. Always return ONLY raw JSON, no markdown backticks (e.g. no ```json), no explanations, just a single valid JSON block.";

//   const userPrompt = `Given this plant leaf image, identify the crop, diagnose it, and return strictly this JSON shape:
//   {
//     "plant_name": "Crop Name (e.g. Rice (Paddy) / Oryza sativa)",
//     "health_status": "Diseased / Healthy",
//     "disease_name": "Disease Name (e.g. Rice Blast / Brown Spot) or 'None' if healthy",
//     "confidence": "Estimated confidence score (e.g. 92%)",
//     "severity": "Severity level (Low / Moderate / High / Critical)",
//     "symptoms": ["bullet point list of visible symptoms"],
//     "possible_causes": ["bullet point list of causes including weather, moisture, nutrients, fungi, pests, soil, irrigation"],
//     "impact_on_crop": "Short explanation of how this affects plant growth and yield",
//     "why_it_happened": "Agronomical reason why this pathogen infection occurred",
//     "organic_treatments": ["recommended organic treatments like neem oil, bio-fungicides, compost tea"],
//     "chemical_treatments": ["recommended chemical fungicides/pesticides/bactericides with dosage"],
//     "recovery_steps": ["immediate recovery actions for the farmer"],
//     "recovery_probability": "High / Medium / Low",
//     "prevention_tips": ["how to avoid future outbreaks of this disease"],
//     "farmer_advice": "Simple, supportive, farmer-friendly recommendation in simple bilingual language",
//     "additional_notes": "Any other critical diagnostic notes or image limitations"
//   }`;

//   const fallbackDiagnosis = {
//     plant_name: "Rice (Paddy) / Oryza sativa",
//     health_status: "Diseased",
//     disease_name: "Rice Blast (caused by Pyricularia oryzae)",
//     confidence: "90%",
//     severity: "High",
//     symptoms: [
//       "Spindle-shaped or diamond-shaped lesions on leaves with pointed ends, gray centers, and brown borders.",
//       "Lesions coalescing to dry up and kill large segments of the leaf blade.",
//       "Dark brown to black necrotic ring surrounding the panicle neck node (neck blast).",
//     ],
//     possible_causes: [
//       "Fungal infection by Pyricularia oryzae spores.",
//       "High relative humidity above 90% for consecutive days.",
//       "Excessive nitrogenous urea application promoting soft canopy leaves.",
//       "Nocturnal temperatures in the 25°C to 28°C range with heavy leaf wetness.",
//     ],
//     impact_on_crop:
//       "Neck blast chokes vascular flow to developing grain panicles, causing complete grain blanking, poor kernel filling, and stem lodging, with potential yield losses of up to 100%.",
//     why_it_happened:
//       "High humidity and succulent foliage promote rapid appressorium formation by fungal conidia, facilitating cell wall penetration within 8 hours.",
//     organic_treatments: [
//       "Apply Neem Oil foliar spray (1500 ppm) @ 3-5 ml/L with organic emulsifier.",
//       "Apply Trichoderma viride or Pseudomonas fluorescens formulations @ 10g/L to boost systemic resistance.",
//     ],
//     chemical_treatments: [
//       "Foliar spray Tricyclazole 75% WP @ 300g per acre in 200 liters of water immediately at booting leaf stage.",
//       "Apply Isoprothiolane 40% EC @ 1.5 - 2.0 ml/L to disrupt mycelial growth.",
//     ],
//     recovery_steps: [
//       "Immediately stop urea/nitrogen application to restrict succulent tissue growth.",
//       "Keep a thin, fresh moisture layer in the soil; do not let the field stay completely dry or flooded.",
//       "Apply systemic Tricyclazole fungicide in windless evening hours.",
//     ],
//     recovery_probability: "Medium",
//     prevention_tips: [
//       "Adopt certified blast-resistant seed varieties.",
//       "Maintain a balanced NPK fertilizer split to prevent excessive nitrogen spurts.",
//       "Use optimal transplanting spacing (20 cm x 15 cm) to facilitate canopy air flow.",
//     ],
//     farmer_advice:
//       "Dear Suresh, stop adding Urea immediately as it makes leaves soft and easy for the blast fungus to destroy. Spray Tricyclazole 75 WP as soon as possible, ensure good air circulation between crop lanes, and manage drainage carefully.",
//     additional_notes:
//       "Offline Diagnostic Reference: Model processed using seeded pathological indices because the dynamic API is in offline standby mode. Confirm precise symptoms on field inspection.",
//   };

//   return fetchWithFallback(async () => {
//     if (!API_KEY) throw new Error("Gemini API key is not configured");

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               { text: `${systemPrompt}\n\n${userPrompt}` },
//               {
//                 inlineData: {
//                   mimeType: mimeType,
//                   data: base64Data,
//                 },
//               },
//             ],
//           },
//         ],
//         generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(
//         `HTTP ${response.status}: Failed to invoke Gemini Vision API.`,
//       );
//     }

//     const data = await response.json();
//     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!text) {
//       throw new Error(
//         "Empty candidate response returned from Gemini Vision model.",
//       );
//     }

//     const clean = text.replace(/```json|```/gi, "").trim();
//     return JSON.parse(clean);
//   }, fallbackDiagnosis);
// }

// PRIMARY: Gemini API (gemini-3.5-flash / gemini-3.1-pro-preview)
// FALLBACK: Static hardcoded data from original component

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const BASE = "/api";

// Centralized internal fetch wrapper to route paths cleanly through the Vite proxy context
const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    console.error(`API Error [${url}]:`, err.message);
    throw err;
  }
};

// Custom robust cascading fallback wrapper as defined by rules
const fetchWithFallback = async (geminiCallFn, fallbackData) => {
  try {
    if (!API_KEY) {
      console.warn(
        "Disease Gemini API Key is missing. Serving high-fidelity static fallbacks.",
      );
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
  const model = "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 1000, temperature: 0.4 },
    }),
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
  const model = "gemini-2.5-pro";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      system_instruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 1000, temperature: 0.4 },
    }),
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

// diseaseGeminiService.js — updated exports for PestDiseaseDashboard

// ... keep all existing code above unchanged ...

/**
 * Enhanced Dashboard Data — now accepts real weather, rainfall, and crop context.
 * Gemini gets real sensor data → more accurate, farm-specific disease risk.
 */
export async function getDashboardData(
  district,
  state,
  crops = [],
  weatherData = null,
  rainfallData = null,
) {
  const systemPrompt =
    "You are a plant pathology expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";

  const cropList = crops.length > 0 ? crops.join(", ") : "Rice, Wheat, Mustard";
  const humidity = weatherData?.humidity ?? 78;
  const temperature = weatherData?.temperature ?? 29;
  const windSpeed = weatherData?.windSpeed ?? 6;
  const rainfall = rainfallData?.actual_rain ?? weatherData?.rainfall ?? 2;

  const userPrompt = `Given district: ${district}, state: ${state}, active crops: ${cropList}
  Real-time weather: Temperature ${temperature}°C, Humidity ${humidity}%, Wind ${windSpeed} km/h, Recent Rainfall ${rainfall}mm
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
      "cropsMonitored": ${crops.length || 3},
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
      }
    ],
    "weatherInfluence": [
      {
        "parameter": "Humidity",
        "currentValue": "${humidity}%",
        "variance": "↑ +18%",
        "impact": "High humidity accelerates fungal spread",
        "isDanger": true
      },
      {
        "parameter": "Temperature",
        "currentValue": "${temperature}°C",
        "variance": "↑ +8%",
        "impact": "Warm nights favor pathogen growth",
        "isDanger": true
      },
      {
        "parameter": "Wind",
        "currentValue": "${windSpeed} km/h",
        "variance": "↓ -5%",
        "impact": "Low wind reduces spore dispersal",
        "isDanger": false
      },
      {
        "parameter": "Rainfall",
        "currentValue": "${rainfall}mm",
        "variance": "↑ +12%",
        "impact": "Recent rain creates leaf wetness — high blast risk",
        "isDanger": true
      }
    ]
  }
  Return exactly ${Math.min(crops.length > 0 ? crops.length + 2 : 5, 5)} risk summary rows covering the active crops: ${cropList}. 4 weather influence cards using the EXACT real values provided. Make risk data urgent and seasonal for ${district}, ${state}.`;

  const fallbackDashboard = {
    criticalAlert: {
      crop: crops[0] || "Rice",
      disease: "Blast Disease",
      probability: 74,
      message: `High Blast Risk in Your Region This Week — ${district} district — ${crops[0] || "Rice"} Blast — Probability 74%. Immediate fungicide application advised.`,
    },
    metrics: {
      activeAlerts: 7,
      cropsMonitored: crops.length || 3,
      districtsCovered: 14,
      alertsSentToday: 34,
    },
    riskSummary: [
      {
        crop: "Wheat",
        cropHindi: "गेहूं",
        disease: "Yellow Rust",
        riskLevel: "High",
        action: "Apply fungicide immediately — Propiconazole 0.1%",
      },
      {
        crop: "Rice",
        cropHindi: "धान",
        disease: "Blast Disease",
        riskLevel: "High",
        action: "Spray Tricyclazole 75 WP @ 300g/acre",
      },
      {
        crop: "Cotton",
        cropHindi: "कपास",
        disease: "Whitefly",
        riskLevel: "Moderate",
        action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
      },
      {
        crop: "Maize",
        cropHindi: "मक्का",
        disease: "Leaf Blight",
        riskLevel: "Low",
        action: "Preventive copper fungicide spray recommended",
      },
      {
        crop: "Mustard",
        cropHindi: "सरसों",
        disease: "Alternaria Blight",
        riskLevel: "Moderate",
        action: "Seed treatment with Thiram; field monitoring twice weekly",
      },
    ],
    weatherInfluence: [
      {
        parameter: "Humidity",
        currentValue: `${humidity}%`,
        variance: "↑ +18%",
        impact: "High humidity accelerates fungal spread",
        isDanger: humidity > 65,
      },
      {
        parameter: "Temperature",
        currentValue: `${temperature}°C`,
        variance: "↑ +8%",
        impact: "Warm nights favor pathogen growth",
        isDanger: temperature > 25,
      },
      {
        parameter: "Wind",
        currentValue: `${windSpeed} km/h`,
        variance: "↓ -5%",
        impact: "Low wind reduces spore dispersal",
        isDanger: windSpeed < 10,
      },
      {
        parameter: "Rainfall",
        currentValue: `${rainfall}mm`,
        variance: "↑ +12%",
        impact: "Recent rain creates leaf wetness — high blast risk",
        isDanger: rainfall > 1,
      },
    ],
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackDashboard,
  );
}

/**
 * Fetches 4-day disease risk forecast per crop using Gemini.
 * Called separately after main dashboard load.
 */
export async function getForecastData(
  district,
  state,
  crops = [],
  forecastWeather = [],
) {
  const systemPrompt =
    "You are a plant disease forecasting expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";

  const cropList = crops.join(", ") || "Rice, Wheat";
  const weatherSummary =
    forecastWeather
      .map(
        (d, i) =>
          `Day ${i + 1}: ${d.temp}°C, ${d.humidity}% humidity, ${d.rainfall}mm rain`,
      )
      .join("; ") ||
    "Day 1: 30°C, 76% humidity; Day 2: 29°C, 80% humidity; Day 3: 31°C, 72% humidity; Day 4: 28°C, 85% humidity";

  const userPrompt = `District: ${district}, State: ${state}, Crops: ${cropList}
  Forecast weather: ${weatherSummary}
  Return this exact JSON shape:
  {
    "forecast": [
      {
        "day": "Tomorrow",
        "date": "Jun 1",
        "overallRisk": "High",
        "riskScore": 78,
        "topThreat": { "crop": "Rice", "disease": "Blast Disease" },
        "action": "Pre-emptive fungicide spray recommended"
      }
    ]
  }
  Return exactly 4 forecast objects for the next 4 days (Tomorrow through Day 4). riskScore between 0-100. overallRisk one of: Low / Moderate / High / Critical. Make it specific to ${cropList} in ${district}.`;

  const today = new Date();
  const fallbackForecast = {
    forecast: [0, 1, 2, 3].map((offset) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offset + 1);
      const label = offset === 0 ? "Tomorrow" : `Day ${offset + 1}`;
      const dateStr = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      const scores = [78, 65, 82, 55];
      const risks = ["High", "Moderate", "High", "Moderate"];
      const threats = [
        { crop: crops[0] || "Rice", disease: "Blast Disease" },
        { crop: crops[1] || "Wheat", disease: "Yellow Rust" },
        { crop: crops[0] || "Rice", disease: "Sheath Blight" },
        { crop: crops[1] || "Wheat", disease: "Alternaria Blight" },
      ];
      return {
        day: label,
        date: dateStr,
        overallRisk: risks[offset],
        riskScore: scores[offset],
        topThreat: threats[offset],
        action:
          offset % 2 === 0
            ? "Pre-emptive fungicide spray recommended"
            : "Monitor fields twice daily",
      };
    }),
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackForecast,
  );
}

/**
 * Consolidates today's dashboard risk summaries and the 4-day forecast timeline
 * into a single unified Gemini API call, optimizing API volume.
 */
export async function getCombinedDashboardAndForecast(
  district,
  state,
  crops = [],
  weatherData = null,
  rainfallData = null,
  forecastWeather = [],
) {
  const systemPrompt =
    "You are a plant pathology and disease forecasting expert for Indian farmers. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";

  const cropList = crops.length > 0 ? crops.join(", ") : "Rice, Wheat, Mustard";
  const humidity = weatherData?.humidity ?? 78;
  const temperature = weatherData?.temperature ?? 29;
  const windSpeed = weatherData?.windSpeed ?? 6;
  const rainfall = rainfallData?.actual_rain ?? weatherData?.rainfall ?? 2;

  const weatherSummary =
    forecastWeather
      .map(
        (d, i) =>
          `Day ${i + 1}: ${d.temp}°C, ${d.humidity}% humidity, ${d.rainfall}mm rain`,
      )
      .join("; ") ||
    "Day 1: 30°C, 76% humidity; Day 2: 29°C, 80% humidity; Day 3: 31°C, 72% humidity; Day 4: 28°C, 85% humidity";

  const userPrompt = `Given district: ${district}, state: ${state}, active crops: ${cropList}
  Real-time weather: Temperature ${temperature}°C, Humidity ${humidity}%, Wind ${windSpeed} km/h, Recent Rainfall ${rainfall}mm
  Forecast weather: ${weatherSummary}

  Return a single consolidated JSON with this exact structure:
  {
    "dashboard": {
      "criticalAlert": {
        "crop": "Rice",
        "disease": "Blast Disease",
        "probability": 74,
        "message": "High Blast Risk in Your Region This Week — ${district} district — Rice Blast (Pyricularia oryzae) — Probability 74%. Immediate fungicide application advised."
      },
      "metrics": {
        "activeAlerts": 7,
        "cropsMonitored": ${crops.length || 3},
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
        }
      ],
      "weatherInfluence": [
        {
          "parameter": "Humidity",
          "currentValue": "${humidity}%",
          "variance": "↑ +18%",
          "impact": "High humidity accelerates fungal spread",
          "isDanger": true
        },
        {
          "parameter": "Temperature",
          "currentValue": "${temperature}°C",
          "variance": "↑ +8%",
          "impact": "Warm nights favor pathogen growth",
          "isDanger": true
        },
        {
          "parameter": "Wind",
          "currentValue": "${windSpeed} km/h",
          "variance": "↓ -5%",
          "impact": "Low wind reduces spore dispersal",
          "isDanger": false
        },
        {
          "parameter": "Rainfall",
          "currentValue": "${rainfall}mm",
          "variance": "↑ +12%",
          "impact": "Recent rain creates leaf wetness — high blast risk",
          "isDanger": true
        }
      ]
    },
    "forecast": [
      {
        "day": "Tomorrow",
        "date": "Jun 1",
        "overallRisk": "High",
        "riskScore": 78,
        "topThreat": { "crop": "Rice", "disease": "Blast Disease" },
        "action": "Pre-emptive fungicide spray recommended"
      }
    ]
  }

  Return exactly ${Math.min(crops.length > 0 ? crops.length + 2 : 5, 5)} risk summary rows covering the active crops: ${cropList}. 4 weather influence cards using the EXACT real values provided. Return exactly 4 forecast objects for the next 4 days (Tomorrow through Day 4) inside "forecast". Make data realistic and urgent for ${district}, ${state}.`;

  const today = new Date();
  const fallbackCombined = {
    dashboard: {
      criticalAlert: {
        crop: crops[0] || "Rice",
        disease: "Blast Disease",
        probability: 74,
        message: `High Blast Risk in Your Region This Week — ${district} district — ${crops[0] || "Rice"} Blast — Probability 74%. Immediate fungicide application advised.`,
      },
      metrics: {
        activeAlerts: 7,
        cropsMonitored: crops.length || 3,
        districtsCovered: 14,
        alertsSentToday: 34,
      },
      riskSummary: [
        {
          crop: "Wheat",
          cropHindi: "गेहूं",
          disease: "Yellow Rust",
          riskLevel: "High",
          action: "Apply fungicide immediately — Propiconazole 0.1%",
        },
        {
          crop: "Rice",
          cropHindi: "धान",
          disease: "Blast Disease",
          riskLevel: "High",
          action: "Spray Tricyclazole 75 WP @ 300g/acre",
        },
        {
          crop: "Cotton",
          cropHindi: "कपास",
          disease: "Whitefly",
          riskLevel: "Moderate",
          action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
        },
        {
          crop: "Maize",
          cropHindi: "मक्का",
          disease: "Leaf Blight",
          riskLevel: "Low",
          action: "Preventive copper fungicide spray recommended",
        },
        {
          crop: "Mustard",
          cropHindi: "सरसों",
          disease: "Alternaria Blight",
          riskLevel: "Moderate",
          action: "Seed treatment with Thiram; field monitoring twice weekly",
        },
      ],
      weatherInfluence: [
        {
          parameter: "Humidity",
          currentValue: `${humidity}%`,
          variance: "↑ +18%",
          impact: "High humidity accelerates fungal spread",
          isDanger: humidity > 65,
        },
        {
          parameter: "Temperature",
          currentValue: `${temperature}°C`,
          variance: "↑ +8%",
          impact: "Warm nights favor pathogen growth",
          isDanger: temperature > 25,
        },
        {
          parameter: "Wind",
          currentValue: `${windSpeed} km/h`,
          variance: "↓ -5%",
          impact: "Low wind reduces spore dispersal",
          isDanger: windSpeed < 10,
        },
        {
          parameter: "Rainfall",
          currentValue: `${rainfall}mm`,
          variance: "↑ +12%",
          impact: "Recent rain creates leaf wetness — high blast risk",
          isDanger: rainfall > 1,
        },
      ],
    },
    forecast: [0, 1, 2, 3].map((offset) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offset + 1);
      const label = offset === 0 ? "Tomorrow" : `Day ${offset + 1}`;
      const dateStr = d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      const scores = [78, 65, 82, 55];
      const risks = ["High", "Moderate", "High", "Moderate"];
      const threats = [
        { crop: crops[0] || "Rice", disease: "Blast Disease" },
        { crop: crops[1] || "Wheat", disease: "Yellow Rust" },
        { crop: crops[0] || "Rice", disease: "Sheath Blight" },
        { crop: crops[1] || "Wheat", disease: "Alternaria Blight" },
      ];
      return {
        day: label,
        date: dateStr,
        overallRisk: risks[offset],
        riskScore: scores[offset],
        topThreat: threats[offset],
        action:
          offset % 2 === 0
            ? "Pre-emptive fungicide spray recommended"
            : "Monitor fields twice daily",
      };
    }),
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackCombined,
  );
}


/**
 * Fetches real weather from Open-Meteo (free, no API key).
 * Uses pincode-derived lat/lng for Haryana districts.
 */
export async function fetchOpenMeteoWeather(lat, lng) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,relative_humidity_2m_max,precipitation_sum&forecast_days=5&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    return {
      current: {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        rainfall: current.precipitation ?? 0,
      },
      forecast: [1, 2, 3, 4].map((i) => ({
        temp: Math.round(daily.temperature_2m_max[i]),
        humidity: daily.relative_humidity_2m_max[i],
        rainfall: daily.precipitation_sum[i] ?? 0,
      })),
    };
  } catch (err) {
    console.warn("Open-Meteo fetch failed:", err.message);
    return {
      current: { temperature: 29, humidity: 78, windSpeed: 6, rainfall: 2 },
      forecast: [
        { temp: 30, humidity: 76, rainfall: 0 },
        { temp: 29, humidity: 80, rainfall: 3 },
        { temp: 31, humidity: 72, rainfall: 0 },
        { temp: 28, humidity: 85, rainfall: 5 },
      ],
    };
  }
}

/**
 * District lat/lng lookup for Haryana (used when GPS is unavailable).
 * Extend this map as more districts are added.
 */
export const HARYANA_DISTRICT_COORDS = {
  Faridabad: { lat: 28.4089, lng: 77.3178 },
  Gurugram: { lat: 28.4595, lng: 77.0266 },
  Hisar: { lat: 29.1492, lng: 75.7217 },
  Karnal: { lat: 29.6857, lng: 76.9905 },
  Panipat: { lat: 29.3909, lng: 76.9635 },
  Rohtak: { lat: 28.8955, lng: 76.6066 },
  Sonipat: { lat: 28.9931, lng: 77.0151 },
  Ambala: { lat: 30.3782, lng: 76.7767 },
  Yamunanagar: { lat: 30.129, lng: 77.2674 },
  Kurukshetra: { lat: 29.9695, lng: 76.8783 },
  Palwal: { lat: 28.1487, lng: 77.3324 },
  Nuh: { lat: 28.1074, lng: 77.0003 },
  Ballabhgarh: { lat: 28.341, lng: 77.322 },
};

/**
 * Heavy Predictive Analytics for Pathology Risks.
 */
export async function getRiskPrediction(
  crop,
  growthStage,
  location,
  temperature,
  humidity,
  rainfall,
  windSpeed,
) {
  const systemPrompt =
    "You are an AI plant disease prediction expert. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
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
      {
        name: "Blast Disease",
        probability: 72,
        severity: "High",
        trend: "Rising",
      },
      {
        name: "Brown Spot",
        probability: 55,
        severity: "Medium",
        trend: "Stable",
      },
      {
        name: "Sheath Blight",
        probability: 45,
        severity: "Medium",
        trend: "Stable",
      },
      {
        name: "Leaf Blight",
        probability: 25,
        severity: "Low",
        trend: "Falling",
      },
    ],
    treatments: [
      {
        priority: "Immediate",
        action: "Apply fungicide immediately — Propiconazole 0.1%",
        product: "Propiconazole",
      },
      {
        priority: "Preventive",
        action: "Spray Tricyclazole 75 WP @ 300g/acre",
        product: "Tricyclazole",
      },
      {
        priority: "Monitor",
        action: "Monitor daily; spray Imidacloprid if count exceeds 10/leaf",
        product: "Imidacloprid",
      },
    ],
    analysis:
      "Warm nights and high humidity favor blast pathogen growth. Dense canopy increases leaf wetness duration.",
  };

  return fetchWithFallback(
    () => callGeminiPro(userPrompt, systemPrompt),
    fallbackPrediction,
  );
}

/**
 * Heatmap spatial nodes mapping.
 */
export async function getHeatmapData(disease, state, district) {
  const systemPrompt =
    "You are a disease outbreak mapping expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
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
      {
        id: "north_1",
        label: "Punjab / J&K Border",
        state: "Punjab",
        x: 140,
        y: 110,
        riskWeight: 88,
        crop: "Wheat",
        incidents: 24,
        radius: 25,
      },
      {
        id: "north_2",
        label: "Karnal Cluster",
        state: "Haryana",
        x: 180,
        y: 140,
        riskWeight: 92,
        crop: "Rice",
        incidents: 14,
        radius: 30,
      },
      {
        id: "north_3",
        label: "Panipat Core",
        state: "Haryana",
        x: 190,
        y: 160,
        riskWeight: 78,
        crop: "Wheat",
        incidents: 11,
        radius: 20,
      },
      {
        id: "north_4",
        label: "Faridabad Zone",
        state: "Haryana",
        x: 200,
        y: 190,
        riskWeight: 95,
        crop: "Rice",
        incidents: 17,
        radius: 28,
      },
      {
        id: "west_1",
        label: "Sri Ganganagar Belt",
        state: "Rajasthan",
        x: 90,
        y: 170,
        riskWeight: 42,
        crop: "Bajra",
        incidents: 5,
        radius: 18,
      },
      {
        id: "west_2",
        label: "Jaipur Basin",
        state: "Rajasthan",
        x: 120,
        y: 230,
        riskWeight: 35,
        crop: "Mustard",
        incidents: 2,
        radius: 15,
      },
      {
        id: "central_1",
        label: "Mathura Fringe",
        state: "Uttar Pradesh",
        x: 230,
        y: 200,
        riskWeight: 65,
        crop: "Vegetables",
        incidents: 9,
        radius: 22,
      },
      {
        id: "central_2",
        label: "Lucknow Interior",
        state: "Uttar Pradesh",
        x: 320,
        y: 240,
        riskWeight: 58,
        crop: "Sugarcane",
        incidents: 12,
        radius: 24,
      },
    ],
    activeIncidents: [
      {
        location: "Karnal",
        disease: "Blast Disease",
        severity: "High",
        reportedAt: "2 hours ago",
        affectedArea: "340 acres",
      },
      {
        location: "Panipat",
        disease: "Yellow Rust",
        severity: "Moderate",
        reportedAt: "4 hours ago",
        affectedArea: "180 acres",
      },
      {
        location: "Sirsa",
        disease: "Whitefly",
        severity: "High",
        reportedAt: "1 day ago",
        affectedArea: "210 acres",
      },
      {
        location: "Faridabad",
        disease: "Sheath Blight",
        severity: "Moderate",
        reportedAt: "3 days ago",
        affectedArea: "145 acres",
      },
    ],
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackHeatmap,
  );
}

/**
 * Therapeutic Advisors Treatment Programs helper.
 */
export async function getTreatments(disease, treatmentType) {
  const systemPrompt =
    "You are an agricultural treatment expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
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
      {
        name: "Trichoderma viride",
        rating: 4,
        costPerAcre: 320,
        method: "Soil drench + seed treatment",
        dosage: "2.5 kg/acre",
        timing: "Before sowing + at tillering",
        warning: null,
        effectiveness: "High",
      },
      {
        name: "Neem Oil Spray",
        rating: 3,
        costPerAcre: 180,
        method: "Foliar spray",
        dosage: "3L neem oil in 200L water",
        timing: "Every 10 days from flag leaf stage",
        warning: "Avoid spraying during flowering",
        effectiveness: "Medium",
      },
      {
        name: "Pseudomonas fluorescens",
        rating: 4,
        costPerAcre: 280,
        method: "Seed coating + soil application",
        dosage: "10g/kg seed + 2.5 kg/acre",
        timing: "Seed treatment + 30 DAT",
        warning: null,
        effectiveness: "High",
      },
    ],
    spraySchedule: [1, 5, 10, 15, 22, 28],
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackTreatments,
  );
}

/**
 * Phenological Stages & Checklist advisor.
 */
export async function getLifecycleData(crop) {
  const systemPrompt =
    "You are an agronomic crop lifecycle expert for India. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
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
      {
        name: "Seed",
        duration: "0-7 days",
        status: "completed",
        progressPercent: 100,
        diseases: ["Seed rot", "Damping off"],
        actions: ["Seed treatment with fungicide"],
        checklist: [],
      },
      {
        name: "Germination",
        duration: "7-21 days",
        status: "completed",
        progressPercent: 100,
        diseases: ["Seedling blight"],
        actions: ["Monitor moisture levels"],
        checklist: [],
      },
      {
        name: "Vegetative",
        duration: "21-60 days",
        status: "current",
        progressPercent: 40,
        diseases: ["Blast disease", "Leaf blight"],
        actions: ["Weekly scouting", "Apply nitrogen top dressing"],
        checklist: [
          { id: "scouting", label: "Weekly scouting done" },
          { id: "nitrogen", label: "N top dressing applied" },
          { id: "weedControl", label: "Weed control done" },
        ],
      },
      {
        name: "Flowering",
        duration: "60-80 days",
        status: "upcoming",
        progressPercent: 0,
        diseases: ["Stem rot", "Bacterial blight"],
        actions: ["Monitor humidity levels"],
        checklist: [],
      },
      {
        name: "Maturity",
        duration: "80-110 days",
        status: "upcoming",
        progressPercent: 0,
        diseases: ["Grain discoloration"],
        actions: ["Ensure field drainage"],
        checklist: [],
      },
      {
        name: "Harvest",
        duration: "110-130 days",
        status: "upcoming",
        progressPercent: 0,
        diseases: ["Storage mold"],
        actions: ["Dry grains before storage"],
        checklist: [],
      },
    ],
    currentStageIndex: 2,
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackLifecycle,
  );
}

/**
 * Historical records filters and counters.
 */
export async function getOutbreakHistory(crop, disease) {
  const systemPrompt =
    "You are a disease outbreak historian for Indian agriculture. Always return ONLY raw JSON, no markdown, no explanation, no backticks, just raw JSON";
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
      {
        id: "h1",
        disease: "Blast Disease",
        crop: "Rice",
        location: "Karnal",
        severity: "High",
        affectedArea: "340 acres",
        date: "Aug 12, 2025",
        outcome: "Fungicide spray checked spread within 10 days",
      },
      {
        id: "h2",
        disease: "Yellow Rust",
        crop: "Wheat",
        location: "Panipat",
        severity: "Moderate",
        affectedArea: "180 acres",
        date: "Aug 4, 2025",
        outcome: "Early advisory restricted damage to 5% loss",
      },
      {
        id: "h3",
        disease: "Whitefly",
        crop: "Cotton",
        location: "Sirsa",
        severity: "High",
        affectedArea: "210 acres",
        date: "Jul 20, 2025",
        outcome: "Resistance built due to continuous insecticide use",
      },
      {
        id: "h4",
        disease: "Leaf Blight",
        crop: "Maize",
        location: "Hisar",
        severity: "Low",
        affectedArea: "80 acres",
        date: "Jun 30, 2025",
        outcome: "Standard copper spray resolved symptoms quickly",
      },
      {
        id: "h5",
        disease: "Sheath Blight",
        crop: "Rice",
        location: "Faridabad",
        severity: "Moderate",
        affectedArea: "145 acres",
        date: "May 18, 2025",
        outcome: "Canopy aeration techniques checked infection",
      },
      {
        id: "h6",
        disease: "Alternaria Blight",
        crop: "Mustard",
        location: "Ambala",
        severity: "Moderate",
        affectedArea: "95 acres",
        date: "Apr 5, 2025",
        outcome: "Seed dressing significantly reduced field severity",
      },
    ],
    stats: {
      totalOutbreaks: 6,
      totalAffectedArea: "1,150 acres",
      mostCommonDisease: "Blast Disease",
    },
  };

  return fetchWithFallback(
    () => callGeminiFlash(userPrompt, systemPrompt),
    fallbackOutbreaks,
  );
}

/**
 * Multimodal image-based plant disease diagnosis calling gemini-1.5-flash.
 * Accepts image file base64 data and mimeType and returns a detailed 16-key JSON pathology report.
 */
export async function diagnosePlantLeafImage(base64Data, mimeType) {
  const model = "gemini-3.1-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const systemPrompt =
    "You are an expert Agricultural Plant Pathologist, Crop Disease Specialist, and Agronomist. Analyze the uploaded plant image carefully and provide a detailed agricultural diagnosis report. Always return ONLY raw JSON, no markdown backticks (e.g. no \`\`\`json), no explanations, just a single valid JSON block.";

  const userPrompt = `Given this plant leaf image, identify the crop, diagnose it, and return strictly this JSON shape:
  {
    "plant_name": "Crop Name (e.g. Rice (Paddy) / Oryza sativa)",
    "health_status": "Diseased / Healthy",
    "disease_name": "Disease Name (e.g. Rice Blast / Brown Spot) or 'None' if healthy",
    "confidence": "Estimated confidence score (e.g. 92%)",
    "severity": "Severity level (Low / Moderate / High / Critical)",
    "symptoms": ["bullet point list of visible symptoms"],
    "possible_causes": ["bullet point list of causes including weather, moisture, nutrients, fungi, pests, soil, irrigation"],
    "impact_on_crop": "Short explanation of how this affects plant growth and yield",
    "why_it_happened": "Agronomical reason why this pathogen infection occurred",
    "organic_treatments": ["recommended organic treatments like neem oil, bio-fungicides, compost tea"],
    "chemical_treatments": ["recommended chemical fungicides/pesticides/bactericides with dosage"],
    "recovery_steps": ["immediate recovery actions for the farmer"],
    "recovery_probability": "High / Medium / Low",
    "prevention_tips": ["how to avoid future outbreaks of this disease"],
    "farmer_advice": "Simple, supportive, farmer-friendly recommendation in simple bilingual language",
    "additional_notes": "Any other critical diagnostic notes or image limitations"
  }`;

  const fallbackDiagnosis = {
    plant_name: "Rice (Paddy) / Oryza sativa",
    health_status: "Diseased",
    disease_name: "Rice Blast (caused by Pyricularia oryzae)",
    confidence: "90%",
    severity: "High",
    symptoms: [
      "Spindle-shaped or diamond-shaped lesions on leaves with pointed ends, gray centers, and brown borders.",
      "Lesions coalescing to dry up and kill large segments of the leaf blade.",
      "Dark brown to black necrotic ring surrounding the panicle neck node (neck blast).",
    ],
    possible_causes: [
      "Fungal infection by Pyricularia oryzae spores.",
      "High relative humidity above 90% for consecutive days.",
      "Excessive nitrogenous urea application promoting soft canopy leaves.",
      "Nocturnal temperatures in the 25°C to 28°C range with heavy leaf wetness.",
    ],
    impact_on_crop:
      "Neck blast chokes vascular flow to developing grain panicles, causing complete grain blanking, poor kernel filling, and stem lodging, with potential yield losses of up to 100%.",
    why_it_happened:
      "High humidity and succulent foliage promote rapid appressorium formation by fungal conidia, facilitating cell wall penetration within 8 hours.",
    organic_treatments: [
      "Apply Neem Oil foliar spray (1500 ppm) @ 3-5 ml/L with organic emulsifier.",
      "Apply Trichoderma viride or Pseudomonas fluorescens formulations @ 10g/L to boost systemic resistance.",
    ],
    chemical_treatments: [
      "Foliar spray Tricyclazole 75% WP @ 300g per acre in 200 liters of water immediately at booting leaf stage.",
      "Apply Isoprothiolane 40% EC @ 1.5 - 2.0 ml/L to disrupt mycelial growth.",
    ],
    recovery_steps: [
      "Immediately stop urea/nitrogen application to restrict succulent tissue tissue growth.",
      "Keep a thin, fresh moisture layer in the soil; do not let the field stay completely dry or flooded.",
      "Apply systemic Tricyclazole fungicide in windless evening hours.",
    ],
    recovery_probability: "Medium",
    prevention_tips: [
      "Adopt certified blast-resistant seed varieties.",
      "Maintain a balanced NPK fertilizer split to prevent excessive nitrogen spurts.",
      "Use optimal transplanting spacing (20 cm x 15 cm) to facilitate canopy air flow.",
    ],
    farmer_advice:
      "Dear Suresh, stop adding Urea immediately as it makes leaves soft and easy for the blast fungus to destroy. Spray Tricyclazole 75 WP as soon as possible, ensure good air circulation between crop lanes, and manage drainage carefully.",
    additional_notes:
      "Offline Diagnostic Reference: Model processed using seeded pathological indices because the dynamic API is in offline standby mode. Confirm precise symptoms on field inspection.",
  };

  return fetchWithFallback(async () => {
    if (!API_KEY) throw new Error("Gemini API key is not configured");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: Failed to invoke Gemini Vision API.`,
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error(
        "Empty candidate response returned from Gemini Vision model.",
      );
    }

    const clean = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(clean);
  }, fallbackDiagnosis);
}

// ─── GEOGRAPHY & HYDRO RESTRUCTURE ENHANCEMENT SUITE ───────────────────
/**
 * Resolves dynamic parameters using proxy endpoints explicitly
 */
export async function resolveGeographicZone(districtName) {
  try {
    const data = await request(`/commoditiesv2/get-alllocations`);
    // Safe evaluation checking for sub object arrays inside properties
    const dataList = data?.data || data || [];
    const matched = dataList.find(
      (loc) => loc.district_name?.toLowerCase() === districtName.toLowerCase(),
    );
    return (
      matched || {
        _id: "6a1bd649ff396ef5e03a33a1",
        state_id: "6a1bd649ff396ef5e03a3390",
      }
    );
  } catch (err) {
    console.warn("Proxy lookup dropped. Routing default Faridabad tokens.");
    return {
      _id: "6a1bd649ff396ef5e03a33a1",
      state_id: "6a1bd649ff396ef5e03a3390",
    };
  }
}

/**
 * Accesses sibling project rain data matrices securely
 */
export async function getImdRainfallMatrix(stateId, districtId) {
  try {
    const data = await request(`/commoditiesv2/get-district-rainfall-data`, {
      method: "POST",
      body: JSON.stringify({
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        source: "https://hydro.imd.gov.in/hydrometweb/landing.aspx",
        stateId: stateId,
        districtIds: [districtId],
      }),
    });
    const dataList = data?.data || data || [];
    return Array.isArray(dataList) ? dataList[0] : dataList;
  } catch (err) {
    console.warn("Precipitation endpoint connection down.");
    return null;
  }
}
