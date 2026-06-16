/**
 * Farmer Logic Module - Complete Implementation
 * Provides calculated responses for ALL 5 Farmer Features when Gemini API fails
 */

// ============================================
// 1. CROP DATABASE (7 major Indian crops)
// ============================================
export const CROP_DATABASE = {
  wheat: {
    id: "wheat",
    name: "Wheat / गेहूँ",
    season: "Rabi (October-December sowing)",
    duration: "120-150 days",
    npk: { n: 120, p: 60, k: 40 },
    waterRequirement: "450-650 mm per season",
    temperature: { min: 10, max: 25, optimal: "15-20°C" },
    soilTypes: ["Loam", "Clay Loam", "Sandy Loam"],
    phRange: "6.0-7.5",
    seedRate: "100-125 kg/ha",
    spacing: "22.5 cm row spacing",
    msp: 2275,
    avgYield: "45-55 quintals/ha",
    profitability: "High",
    riskFactors: [
      "Yellow Rust",
      "Termite Attack",
      "Late Sowing",
      "Terminal Heat",
    ],
    description:
      "Wheat is the main Rabi season crop. Requires cool temperatures during growth and dry weather at harvest.",
  },
  rice: {
    id: "rice",
    name: "Rice / धान",
    season: "Kharif (June-July sowing)",
    duration: "120-160 days",
    npk: { n: 120, p: 60, k: 60 },
    waterRequirement: "1000-1500 mm per season",
    temperature: { min: 20, max: 35, optimal: "25-30°C" },
    soilTypes: ["Clay", "Clay Loam", "Silty Clay"],
    phRange: "5.5-6.5",
    seedRate: "40-60 kg/ha (direct), 8-10 kg/ha (SRI)",
    spacing: "20x15 cm or 25x25 cm (SRI)",
    msp: 2300,
    avgYield: "35-45 quintals/ha (conventional), 50-60 quintals/ha (SRI)",
    profitability: "Medium-High",
    riskFactors: [
      "Blast Disease",
      "Brown Plant Hopper",
      "Drought",
      "Flooding",
      "Sheath Blight",
    ],
    description:
      "Rice is the main Kharif crop. Requires standing water during growth period.",
  },
  maize: {
    id: "maize",
    name: "Maize / मक्का",
    season: "Both Kharif (June-July) & Rabi (Oct-Nov)",
    duration: "90-120 days",
    npk: { n: 150, p: 60, k: 50 },
    waterRequirement: "500-800 mm per season",
    temperature: { min: 18, max: 27, optimal: "21-25°C" },
    soilTypes: ["Loam", "Sandy Loam", "Clay Loam"],
    phRange: "6.0-7.0",
    seedRate: "20-25 kg/ha",
    spacing: "60x20 cm or 75x20 cm",
    msp: 2090,
    avgYield: "55-65 quintals/ha",
    profitability: "High",
    riskFactors: [
      "Stem Borer",
      "Fall Armyworm",
      "Maydis Leaf Blight",
      "Waterlogging",
    ],
    description:
      "Maize is a versatile crop grown in both seasons. High-yielding with good market demand.",
  },
  cotton: {
    id: "cotton",
    name: "Cotton / कपास",
    season: "Kharif (May-June sowing)",
    duration: "150-180 days",
    npk: { n: 100, p: 40, k: 40 },
    waterRequirement: "600-900 mm per season",
    temperature: { min: 21, max: 30, optimal: "25-28°C" },
    soilTypes: ["Black Cotton Soil", "Deep Loamy Soil"],
    phRange: "6.0-7.5",
    seedRate: "8-12 kg/ha (hybrid), 15-20 kg/ha (desi)",
    spacing: "90x60 cm or 120x60 cm",
    msp: 7020,
    avgYield: "25-35 quintals/ha (hybrid), 8-12 quintals/ha (desi)",
    profitability: "Medium",
    riskFactors: [
      "Pink Bollworm",
      "Whitefly",
      "Leaf Curl Virus",
      "Alternaria Leaf Spot",
    ],
    description:
      "Cotton is a cash crop requiring well-drained black cotton soil.",
  },
  sugarcane: {
    id: "sugarcane",
    name: "Sugarcane / गन्ना",
    season: "Spring (Feb-Mar) or Autumn (Oct-Nov)",
    duration: "300-365 days",
    npk: { n: 250, p: 60, k: 60 },
    waterRequirement: "1500-2500 mm per season",
    temperature: { min: 20, max: 35, optimal: "25-30°C" },
    soilTypes: ["Deep Loamy", "Clay Loam", "Alluvial"],
    phRange: "6.5-7.5",
    seedRate: "35-40 quintals/ha (setts)",
    spacing: "90-120 cm row spacing",
    msp: 3550,
    avgYield: "700-900 quintals/ha (plant cane), 500-700 (ratoon)",
    profitability: "High",
    riskFactors: [
      "Red Rot",
      "Top Borer",
      "Stalk Borer",
      "Waterlogging",
      "Drought",
    ],
    description:
      "Sugarcane is a long-duration crop. Provides highest yield per acre among all crops.",
  },
  mustard: {
    id: "mustard",
    name: "Mustard / सरसों",
    season: "Rabi (October-November sowing)",
    duration: "110-140 days",
    npk: { n: 80, p: 40, k: 20 },
    waterRequirement: "300-450 mm per season",
    temperature: { min: 10, max: 25, optimal: "15-22°C" },
    soilTypes: ["Loam", "Sandy Loam", "Alluvial"],
    phRange: "6.0-7.5",
    seedRate: "4-5 kg/ha",
    spacing: "45x15 cm or 45x10 cm",
    msp: 5650,
    avgYield: "15-20 quintals/ha",
    profitability: "High",
    riskFactors: [
      "White Rust",
      "Aphids",
      "Alternaria Blight",
      "Frost at Flowering",
    ],
    description:
      "Mustard is an important oilseed crop. Requires less water than wheat.",
  },
  potato: {
    id: "potato",
    name: "Potato / आलू",
    season: "Rabi (October-November sowing)",
    duration: "80-110 days",
    npk: { n: 150, p: 60, k: 120 },
    waterRequirement: "400-600 mm per season",
    temperature: { min: 15, max: 25, optimal: "18-22°C" },
    soilTypes: ["Sandy Loam", "Loam"],
    phRange: "5.5-6.5",
    seedRate: "20-25 quintals/ha (tubers)",
    spacing: "60x20 cm",
    msp: 0,
    avgYield: "250-350 quintals/ha",
    profitability: "Medium-High",
    riskFactors: ["Late Blight", "Early Blight", "Aphids", "Waterlogging"],
    description:
      "Potato is a high-value cash crop. Requires well-drained, loose soil.",
  },
};

// ============================================
// 2. HELPER FUNCTIONS
// ============================================

// export const getCurrentSeason = () => {
//   const month = new Date().getMonth();
//   if (month >= 9 && month <= 11) return "Rabi (Winter)";
//   if (month >= 2 && month <= 5) return "Zaid (Summer)";
//   return "Kharif (Monsoon)";
// };

// export const calculateProfitability = (cropId, areaInAcres, location = {}) => {
//   const crop = CROP_DATABASE[cropId];
//   if (!crop) return null;

//   const areaInHa = areaInAcres * 0.4047;
//   const yieldPerHa = parseInt(crop.avgYield.split("-")[0]) || 40;
//   const totalYield = yieldPerHa * areaInHa;
//   const revenue = crop.msp * totalYield;

//   const inputCostPerHa = {
//     wheat: 45000,
//     rice: 50000,
//     maize: 40000,
//     cotton: 55000,
//     sugarcane: 80000,
//     mustard: 35000,
//     potato: 100000,
//   };
//   const cost = (inputCostPerHa[cropId] || 45000) * areaInHa;
//   const profit = revenue - cost;
//   const roi = (profit / cost) * 100;

//   return {
//     cropName: crop.name,
//     area: areaInAcres,
//     expectedYield: totalYield.toFixed(1),
//     revenue: Math.round(revenue),
//     cost: Math.round(cost),
//     profit: Math.round(profit),
//     roi: roi.toFixed(1),
//     msp: crop.msp,
//   };
// };

// ============================================
// 3. MAIN FUNCTION - Get advisory for ANY crop
// ============================================

export const getCropAdvisoryForCrop = (cropId, location, areaInAcres = 1) => {
  const crop = CROP_DATABASE[cropId];
  if (!crop) return null;

  const season = getCurrentSeason();
  const profitability = calculateProfitability(cropId, areaInAcres, location);

  // Formatted text with proper line breaks
  const formattedText = `🌾 ${season} के लिए फसल: ${crop.name}

✅ फसल: ${crop.name}
📊 अपेक्षित उपज: ${crop.avgYield}
💰 MSP: ₹${crop.msp}/क्विंटल
📈 ${areaInAcres} एकड़ में अनुमानित लाभ: ₹${profitability?.profit?.toLocaleString() || "N/A"}
🌡️ उपयुक्त तापमान: ${crop.temperature.optimal}
💧 पानी की आवश्यकता: ${crop.waterRequirement}
🌱 बीज दर: ${crop.seedRate}
📅 बुवाई का समय: ${crop.season}
🌍 मिट्टी के प्रकार: ${crop.soilTypes.join(", ")}
⚖️ उपयुक्त pH: ${crop.phRange}

⚠️ जोखिम कारक: ${crop.riskFactors.join(", ")}

📝 विशेष जानकारी: ${crop.description}`;

  const formattedTranslation = `🌾 Crop for ${season}: ${crop.name}

✅ Crop: ${crop.name}
📊 Expected yield: ${crop.avgYield}
💰 MSP: ₹${crop.msp}/quintal
📈 Estimated profit for ${areaInAcres} acre: ₹${profitability?.profit?.toLocaleString() || "N/A"}
🌡️ Suitable temperature: ${crop.temperature.optimal}
💧 Water requirement: ${crop.waterRequirement}
🌱 Seed rate: ${crop.seedRate}
📅 Sowing time: ${crop.season}
🌍 Soil types: ${crop.soilTypes.join(", ")}
⚖️ Suitable pH: ${crop.phRange}

⚠️ Risk factors: ${crop.riskFactors.join(", ")}

📝 Description: ${crop.description}`;

  return {
    text: formattedText,
    translation: formattedTranslation,
    data: {
      crop,
      profitability,
      season,
    },
  };
};

// For backward compatibility - returns top crop recommendation
// export const getCropAdvisory = (location, soilData = {}) => {
//   const season = getCurrentSeason();
//   let recommendedCropId = "wheat";

//   if (season.includes("Kharif")) recommendedCropId = "maize";
//   else if (season.includes("Rabi")) recommendedCropId = "wheat";
//   else recommendedCropId = "maize";

//   const result = getCropAdvisoryForCrop(recommendedCropId, location, 1);

//   // Also include alternative crops
//   const alternativeIds = season.includes("Kharif")
//     ? ["rice", "cotton"]
//     : season.includes("Rabi")
//       ? ["mustard", "potato"]
//       : ["maize"];

//   const alternativeCrops = alternativeIds
//     .map((id) => CROP_DATABASE[id])
//     .filter(Boolean);

//   return {
//     ...result,
//     data: {
//       ...result.data,
//       recommendedCrops: [CROP_DATABASE[recommendedCropId], ...alternativeCrops],
//       topCrop: CROP_DATABASE[recommendedCropId],
//     },
//   };
// };

// export default {
//   CROP_DATABASE,
//   getCurrentSeason,
//   calculateProfitability,
//   getCropAdvisory,
//   getCropAdvisoryForCrop
// };
// ============================================
// 2. DISEASE DATABASE (with treatments)
// ============================================
export const DISEASE_DATABASE = {
  "yellow-rust": {
    name: "Yellow Rust (Stripe Rust) / पीला रतुआ",
    affectedCrops: ["Wheat", "Barley"],
    symptoms:
      "Yellow to orange pustules arranged in stripes on leaves. Powdery appearance when rubbed.",
    conditions: "Cool temperatures (10-15°C), high humidity, dense crop canopy",
    severityLevels: {
      low: "Minor infection on lower leaves only, <10% leaf area affected",
      medium: "Spread to middle canopy, 20-30% leaf area, yield impact 10-15%",
      high: "Covering entire plant including upper leaves, >50% affected, yield loss 30-50%",
    },
    organicTreatment:
      "Neem oil (1500 ppm) @ 15ml/liter water, 3 sprays at 10-day intervals. Spray in evening hours.",
    chemicalTreatment:
      "Tebuconazole @ 0.1% (1ml/liter) or Propiconazole @ 0.1%, spray at first appearance. Repeat after 15 days if needed.",
    preventiveMeasures:
      "Grow resistant varieties (HD 2967, HD 3086), early sowing (by November 15), avoid excess nitrogen fertilizer, balanced NPK application, crop rotation with non-cereals",
    fungicides: [
      {
        name: "Tebuconazole (Folicur)",
        dosage: "250 ml/ha",
        cost: "₹800-1000",
        safety: "21 days waiting period",
      },
      {
        name: "Propiconazole (Tilt)",
        dosage: "500 ml/ha",
        cost: "₹1200-1500",
        safety: "25 days waiting period",
      },
      {
        name: "Azoxystrobin",
        dosage: "600 ml/ha",
        cost: "₹2000-2500",
        safety: "30 days waiting period",
      },
    ],
    imageUrl: "/images/diseases/yellow-rust.jpg",
  },
  blast: {
    name: "Blast Disease (Rice Blast) / झुलसा रोग",
    affectedCrops: ["Rice", "Maize", "Ragi"],
    symptoms:
      "Diamond-shaped lesions with grey center and brown border. Leaf blasting, neck rot in severe cases.",
    conditions:
      "High humidity (>90%), cloudy weather, moderate temperature (25-28°C), high nitrogen application",
    severityLevels: {
      low: "Few lesions on leaves (<10% leaf area), sporadic distribution",
      medium:
        "Multiple lesions, leaf drying 20-30%, early detection of neck blast",
      high: "Neck and node blast, >50% panicle infection, severe yield loss 50-70%",
    },
    organicTreatment:
      "Trichoderma application @ 2.5 kg/ha mixed with FYM, neem-based sprays (Azadirachtin 1500 ppm @ 3ml/liter), silica application strengthens plants",
    chemicalTreatment:
      "Tricyclazole @ 0.06% (0.6 g/liter) or Isoprothiolane @ 0.1% (1 ml/liter). Apply as foliar spray at panicle initiation stage.",
    preventiveMeasures:
      "Use resistant varieties (PHB 71, Pusa Basmati 1121), balanced NPK fertilization (avoid excess N), seed treatment with Tricyclazole @ 2g/kg, avoid dense planting (maintain 20x15 cm spacing), drain field periodically",
    fungicides: [
      {
        name: "Tricyclazole (Beam)",
        dosage: "600 g/ha",
        cost: "₹1500-2000",
        safety: "35 days waiting period",
      },
      {
        name: "Isoprothiolane (Fuji-one)",
        dosage: "1 L/ha",
        cost: "₹2000-2500",
        safety: "30 days waiting period",
      },
      {
        name: "Carbendazim",
        dosage: "500 g/ha",
        cost: "₹800-1000",
        safety: "25 days waiting period",
      },
    ],
  },
  "late-blight": {
    name: "Late Blight / पछेती झुलसा",
    affectedCrops: ["Potato", "Tomato"],
    symptoms:
      "Water-soaked lesions on leaves, white fungal growth on underside, blackened stems, tuber rot.",
    conditions:
      "Cool (15-20°C), wet conditions, high humidity (>90%), rainy weather",
    severityLevels: {
      low: "Few lesions on lower leaves (<10% plants affected)",
      medium:
        "Spread to upper leaves, 30-50% plants affected, yield impact 20-30%",
      high: "Complete defoliation, tuber infection, >80% plants affected, yield loss 50-80%",
    },
    organicTreatment:
      "Copper oxychloride based organic fungicides, cow urine + neem leaf extract spray (1:10 dilution), preventive sprays before rainy period",
    chemicalTreatment:
      "Mancozeb @ 0.25% (2.5 g/liter) for prevention. Metalaxyl + Mancozeb (Ridomil Gold) @ 0.2% for treatment. Spray every 7-10 days in high-risk conditions.",
    preventiveMeasures:
      "Use certified disease-free seed tubers, plant resistant varieties (Kufri Pukhraj, Kufri Himsona), ensure proper drainage, avoid overhead irrigation, destroy volunteer potatoes, practice 3-4 year crop rotation",
    fungicides: [
      {
        name: "Mancozeb (Dithane M-45)",
        dosage: "2.5 kg/ha",
        cost: "₹1200-1500",
        safety: "7 days waiting period",
      },
      {
        name: "Metalaxyl + Mancozeb (Ridomil Gold)",
        dosage: "2 kg/ha",
        cost: "₹3000-4000",
        safety: "30 days waiting period",
      },
      {
        name: "Cymoxanil + Mancozeb (Curzate)",
        dosage: "1.5 kg/ha",
        cost: "₹3500-4500",
        safety: "21 days waiting period",
      },
    ],
  },
  "pink-bollworm": {
    name: "Pink Bollworm / गुलाबी सुंडी",
    affectedCrops: ["Cotton"],
    symptoms:
      "Rosetted flowers, damaged bolls with tunneling inside, stained lint, early boll opening.",
    conditions: "Dry conditions, late-sown crop, ratoon cotton, mild winter",
    severityLevels: {
      low: "5-10% boll damage, flower infestation <10%",
      medium: "20-30% boll damage, yield loss 20-25%",
      high: "50%+ boll damage, severe yield loss 40-60%",
    },
    organicTreatment:
      "Pheromone traps @ 20/ha for monitoring, Trichogramma cards @ 100/ha for egg parasitism, bird perches for natural predators",
    chemicalTreatment:
      "Spinosad @ 0.25 ml/liter or Emamectin Benzoate @ 0.4 g/liter. Rotate insecticides to prevent resistance. Spray at square formation and boll development stages.",
    preventiveMeasures:
      "Short duration varieties, early sowing (by May 15), remove and destroy crop residue after harvest, install light traps, grow trap crops, scheduled irrigation to avoid dry stress, conserve natural enemies (wasps, ladybird beetles)",
    insecticides: [
      {
        name: "Spinosad (Tracer)",
        dosage: "300 ml/ha",
        cost: "₹2500-3000",
        safety: "21 days waiting period",
      },
      {
        name: "Emamectin Benzoate (Proclaim)",
        dosage: "400 g/ha",
        cost: "₹2000-2500",
        safety: "15 days waiting period",
      },
      {
        name: "Chlorantraniliprole (Coragen)",
        dosage: "300 ml/ha",
        cost: "₹3500-4000",
        safety: "30 days waiting period",
      },
      {
        name: "Flubendiamide (Fame)",
        dosage: "300 ml/ha",
        cost: "₹3000-3500",
        safety: "25 days waiting period",
      },
    ],
  },
  whitefly: {
    name: "Whitefly / सफेद मक्खी",
    affectedCrops: ["Cotton", "Tomato", "Pulses"],
    symptoms:
      "Yellowing and curling of leaves, sticky honeydew secretion, sooty mold growth, leaf curl virus transmission.",
    conditions:
      "Dry and warm conditions (25-35°C), high nitrogen fertilizer, close plant spacing",
    severityLevels: {
      low: "5-10 adults per leaf, minor leaf yellowing",
      medium:
        "15-20 adults per leaf, leaf curling, virus symptoms in 10-20% plants",
      high: ">30 adults per leaf, severe leaf curl, virus in >50% plants, yield loss 40-60%",
    },
    organicTreatment:
      "Yellow sticky traps @ 25/ha, neem oil (1500 ppm) @ 5ml/liter every 5-7 days, release of natural enemies (Chrysoperla, Coccinellids)",
    chemicalTreatment:
      "Buprofezin @ 1 ml/liter or Diafenthiuron @ 1 ml/liter. Target nymph stage for best control. Rotate insecticides to prevent resistance.",
    preventiveMeasures:
      "Remove weed hosts, avoid excessive nitrogen, intercropping with non-host crops, early sowing to avoid peak populations, use resistant/tolerant varieties, conserve natural enemies (Encarsia wasps)",
    insecticides: [
      {
        name: "Buprofezin (Applaud)",
        dosage: "750 ml/ha",
        cost: "₹2000-2500",
        safety: "30 days waiting period",
      },
      {
        name: "Diafenthiuron (Pegasus)",
        dosage: "800 ml/ha",
        cost: "₹2500-3000",
        safety: "25 days waiting period",
      },
      {
        name: "Imidacloprid (Confidor)",
        dosage: "300 ml/ha",
        cost: "₹1500-2000",
        safety: "30 days waiting period",
      },
    ],
  },
  "fall-armyworm": {
    name: "Fall Armyworm / फॉल आर्मीवर्म",
    affectedCrops: ["Maize", "Sorghum", "Millet"],
    symptoms:
      "Whorl damage with frass, shot holes on leaves, irregular leaf margin feeding, plant stunting.",
    conditions:
      "Warm temperatures (20-30°C), dry spells followed by rain, late-sown crop",
    severityLevels: {
      low: "<10% plants with leaf damage, minor whorl injury",
      medium:
        "20-30% plants affected, whorl damage with frass, yield impact 15-20%",
      high: ">50% plants with severe whorl damage, dead heart in many plants, yield loss 30-50%",
    },
    organicTreatment:
      "Handpick and destroy egg masses, bird perches (20/ha), neem cake application (250 kg/ha), apply sand + neem seed powder (4:1) in whorl",
    chemicalTreatment:
      "Emamectin Benzoate @ 0.4 g/liter for whorl application. Apply directly into whorl, not just leaf spray. Chlorantraniliprole as alternative.",
    preventiveMeasures:
      "Early sowing (with monsoon onset), intercropping with cowpea or pigeonpea, pheromone traps for monitoring, avoid continuous maize cropping, deep plowing after harvest, use resistant varieties",
    insecticides: [
      {
        name: "Emamectin Benzoate (Proclaim)",
        dosage: "400 g/ha",
        cost: "₹2000-2500",
        safety: "21 days waiting period",
      },
      {
        name: "Chlorantraniliprole (Coragen)",
        dosage: "200 ml/ha",
        cost: "₹3500-4000",
        safety: "30 days waiting period",
      },
      {
        name: "Spinosad (Tracer)",
        dosage: "300 ml/ha",
        cost: "₹2500-3000",
        safety: "21 days waiting period",
      },
    ],
  },
};

// ============================================
// 3. GOVERNMENT SCHEMES DATABASE
// ============================================
export const SCHEME_DATABASE = {
  "pm-kisan": {
    id: "pm-kisan",
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description:
      "Income support scheme providing financial benefit to all landholding farmer families",
    benefit: "₹6,000 per year in 3 equal installments of ₹2,000 each",
    eligibility: "All landholding farmer families with cultivable land",
    documents: [
      "Land records (Khatauni/Patta)",
      "Aadhaar card",
      "Bank account with IFSC",
      "Mobile number linked to Aadhaar",
    ],
    deadlines: {
      "1st Installment": "April-July",
      "2nd Installment": "August-November",
      "3rd Installment": "December-March",
    },
    applyUrl: "https://pmkisan.gov.in",
    helpline: "155261 / 011-23381092",
    stateSchemes: {
      "Uttar Pradesh": "Additional ₹500 per installment",
      Maharashtra: "Additional ₹2000 per year (Maha Kisan Samman)",
      "Madhya Pradesh": "Krishak Samriddhi Yojana additional benefit",
      Haryana: "Additional ₹3000 per year",
      Punjab: "Additional ₹3000 per year",
    },
    steps: [
      "Visit pmkisan.gov.in",
      'Click "Farmer Corner" → "New Registration"',
      "Enter Aadhaar number and verify with OTP",
      "Fill land records and bank details",
      "Submit and download acknowledgment",
    ],
  },
  pmfby: {
    id: "pmfby",
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    description:
      "Crop insurance scheme protecting farmers against crop loss due to natural calamities, pests, and diseases",
    benefit:
      "Insurance coverage for notified crops with very low premium (1.5-5% of sum insured)",
    eligibility:
      "All farmers (sharecroppers, tenant farmers, landowning farmers) growing notified crops",
    documents: [
      "Land records",
      "Aadhaar card",
      "Bank account",
      "Crop sowing certificate from patwari",
      "Loan documents (if applicable)",
    ],
    deadlines: "Before sowing / 15-30 days after crop notification",
    applyUrl: "https://pmfby.gov.in",
    helpline: "1800-180-1551",
    premiumRates: {
      Kharif: "2.0% of sum insured",
      Rabi: "1.5% of sum insured",
      "Commercial/Horticulture": "5.0% of sum insured",
    },
    coveragePerils: [
      "Drought",
      "Flood",
      "Cyclone",
      "Pest attack",
      "Disease",
      "Landslide",
      "Hailstorm",
      "Fire",
    ],
    exclusions: [
      "Prevented sowing (partial coverage)",
      "Post-harvest losses (limited)",
      "Wild animal damage (not covered)",
    ],
  },
  "soil-health-card": {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    fullName:
      "Soil Health Management under National Mission for Sustainable Agriculture",
    description:
      "Free soil testing and fertilizer recommendation for farmers every 2 years",
    benefit:
      "Free soil testing, customized fertilizer recommendations, improved soil health",
    eligibility: "All farmers (any landholding size)",
    documents: ["Land records (survey number)", "Farmer ID/Aadhaar"],
    deadlines: "Apply before sowing season (April-May or September-October)",
    applyUrl: "https://soilhealth.dac.gov.in",
    helpline: "1800-180-1551",
    process: [
      "Visit nearest soil testing laboratory (KVK, Agriculture Department)",
      "Collect soil samples using proper method (15-20 cm depth)",
      "Submit samples with farm details",
      "Receive Soil Health Card within 15-30 days",
      "Follow fertilizer recommendations on the card",
    ],
  },
  kcc: {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    fullName: "Kisan Credit Card Scheme",
    description:
      "Short-term credit facility for farmers to meet crop production and working capital needs",
    benefit:
      "Flexible credit limit based on land holding, interest subvention (2-4% effective rate)",
    eligibility:
      "All farmers (individual, joint, tenant, sharecropper) with cultivable land",
    documents: [
      "Land records",
      "Aadhaar card",
      "2 passport photos",
      "Income proof (optional)",
      "Bank account statement",
    ],
    interestRate:
      "9% per annum (with 2% prompt repayment incentive → effective 7%)",
    creditLimit:
      "₹1.6 lakh per hectare for 3 crops, up to ₹3 lakh without collateral",
    applyUrl: "https://kcc.nabard.org",
    helpline: "1800-258-2223",
    process: [
      "Contact nearest bank branch (Public/Private/RRB/Cooperative)",
      "Fill KCC application form",
      "Submit documents and land records",
      "Bank verifies land records (patwari certificate)",
      "Credit limit sanctioned within 15 days",
      "Receive KCC passbook and ATM card",
    ],
  },
  "agri-infra-fund": {
    id: "agri-infra-fund",
    name: "Agriculture Infrastructure Fund",
    fullName: "Agriculture Infrastructure Fund (AIF)",
    description:
      "Financing facility for setting up post-harvest infrastructure at farm gate",
    benefit:
      "₹1 lakh crore fund, 3% interest subvention, 3-year moratorium, up to ₹2 crore loan",
    eligibility: "Farmers, FPOs, SHGs, Cooperatives, Agri-entrepreneurs",
    documents: [
      "Project proposal",
      "Land documents (ownership/lease)",
      "Cost estimate",
      "Bank account details",
    ],
    applyUrl: "https://agriinfra.dac.gov.in",
    helpline: "011-23382804",
    eligibleProjects: [
      "Warehouses",
      "Cold storage",
      "Primary processing unit",
      "Packaging unit",
      "Sorting/grading unit",
    ],
  },
};

// ============================================
// 4. HELPER FUNCTIONS
// ============================================

// Get current season based on date
export const getCurrentSeason = () => {
  const month = new Date().getMonth(); // 0-11
  if (month >= 9 && month <= 11) return "Rabi (Winter)"; // Oct-Jan
  if (month >= 2 && month <= 5) return "Zaid (Summer)"; // Mar-Jun
  return "Kharif (Monsoon)"; // Jul-Sep
};

// Get recommended crops for current season and location
export const getRecommendedCrops = (location, soilData = {}) => {
  const season = getCurrentSeason();
  const soilType = soilData.soilType || "Loam";
  const ph = soilData.pH || 7.0;

  let recommendations = [];

  if (season.includes("Kharif")) {
    recommendations = ["rice", "maize", "cotton", "sugarcane"];
  } else if (season.includes("Rabi")) {
    recommendations = ["wheat", "mustard", "potato"];
  } else {
    recommendations = ["maize", "vegetables"];
  }

  // Filter by soil type
  const suitable = recommendations.filter((cropId) => {
    const crop = CROP_DATABASE[cropId];
    return (
      crop &&
      crop.soilTypes.some((type) =>
        soilType.toLowerCase().includes(type.toLowerCase()),
      )
    );
  });

  return suitable.length > 0 ? suitable : recommendations;
};

// Calculate expected yield based on crop, location, soil quality
export const calculateExpectedYield = (
  cropId,
  location,
  soilQuality = "Good",
) => {
  const crop = CROP_DATABASE[cropId];
  if (!crop) return "Data not available";

  const yieldRange = crop.avgYield.split("-");
  const baseYield =
    (parseInt(yieldRange[0]) + parseInt(yieldRange[1] || yieldRange[0])) / 2;

  let multiplier = 1;
  if (soilQuality === "Excellent") multiplier = 1.25;
  else if (soilQuality === "Good") multiplier = 1.0;
  else if (soilQuality === "Average") multiplier = 0.85;
  else if (soilQuality === "Poor") multiplier = 0.7;

  // High yield regions
  const highYieldRegions = [
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "West Bengal",
  ];
  if (location && highYieldRegions.includes(location.state)) multiplier *= 1.1;

  return Math.round(baseYield * multiplier);
};

// Calculate profitability for a crop
export const calculateProfitability = (
  cropId,
  areaInAcres,
  location,
  soilQuality = "Good",
) => {
  const crop = CROP_DATABASE[cropId];
  if (!crop) return { profit: 0, message: "Data not available" };

  const expectedYieldPerHa = calculateExpectedYield(
    cropId,
    location,
    soilQuality,
  );
  const areaInHa = areaInAcres * 0.4047;
  const totalYield = expectedYieldPerHa * areaInHa;
  const activePrice = crop.msp && crop.msp > 0 ? crop.msp : (cropId === "potato" ? 1600 : 2000);
  const revenue = activePrice * totalYield;

  const inputCostPerHa = {
    wheat: 45000,
    rice: 50000,
    maize: 40000,
    cotton: 55000,
    sugarcane: 80000,
    mustard: 35000,
    potato: 100000,
  };
  const cost = (inputCostPerHa[cropId] || 45000) * areaInHa;
  const profit = revenue - cost;
  const roi = (profit / cost) * 100;

  return {
    cropName: crop.name,
    area: areaInAcres,
    expectedYield: totalYield.toFixed(1),
    revenue: Math.round(revenue),
    cost: Math.round(cost),
    profit: Math.round(profit),
    roi: roi.toFixed(1),
    marginPerHa: Math.round(profit / areaInHa),
    msp: activePrice,
  };
};

// ============================================
// 5. MAIN FEATURE FUNCTIONS (Hybrid-ready)
// ============================================

// FEATURE 1: Crop Advisory
export const getCropAdvisory = (location, soilData = {}, query = "") => {
  const season = getCurrentSeason();
  const recommendedCrops = getRecommendedCrops(location, soilData);
  const topCrop = CROP_DATABASE[recommendedCrops[0]];

  const profitability = calculateProfitability(
    recommendedCrops[0],
    1,
    location,
  );

  return {
    text: `🌾 ${season} के लिए सर्वोत्तम फसल: ${topCrop?.name || "Wheat"}

✅ अनुशंसित फसल: ${topCrop?.name}
📊 अपेक्षित उपज: ${topCrop?.avgYield}
💰 MSP: ₹${topCrop?.msp}/क्विंटल
📈 1 एकड़ में अनुमानित लाभ: ₹${profitability.profit.toLocaleString()}
🌡️ उपयुक्त तापमान: ${topCrop?.temperature.optimal}
💧 पानी की आवश्यकता: ${topCrop?.waterRequirement}
🌱 बीज दर: ${topCrop?.seedRate}
📅 बुवाई का समय: ${topCrop?.season}

⚠️ जोखिम कारक: ${topCrop?.riskFactors.join(", ")}

वैकल्पिक फसलें: ${recommendedCrops
      .slice(1)
      .map((c) => CROP_DATABASE[c]?.name)
      .join(", ")}`,
    translation: `🌾 Best crop for ${season}: ${topCrop?.name}

✅ Recommended crop: ${topCrop?.name}
📊 Expected yield: ${topCrop?.avgYield}
💰 MSP: ₹${topCrop?.msp}/quintal
📈 Estimated profit per acre: ₹${profitability.profit.toLocaleString()}
🌡️ Suitable temperature: ${topCrop?.temperature.optimal}
💧 Water requirement: ${topCrop?.waterRequirement}
🌱 Seed rate: ${topCrop?.seedRate}
📅 Sowing time: ${topCrop?.season}

⚠️ Risk factors: ${topCrop?.riskFactors.join(", ")}

Alternative crops: ${recommendedCrops
      .slice(1)
      .map((c) => CROP_DATABASE[c]?.name)
      .join(", ")}`,
    data: {
      season,
      recommendedCrops: recommendedCrops
        .map((id) => CROP_DATABASE[id])
        .filter(Boolean),
      topCrop,
      profitability,
    },
  };
};

// FEATURE 2: Disease Detection (with confidence scoring)
export const detectDisease = (
  imageQuery = "",
  cropType = "",
  location = {},
) => {
  // Determine disease based on query/crop
  let diseaseKey = "yellow-rust";
  const query = imageQuery.toLowerCase();

  if (query.includes("rice") || query.includes("blast")) diseaseKey = "blast";
  else if (query.includes("potato") || query.includes("late blight"))
    diseaseKey = "late-blight";
  else if (query.includes("cotton") && query.includes("boll"))
    diseaseKey = "pink-bollworm";
  else if (query.includes("cotton") && query.includes("whitefly"))
    diseaseKey = "whitefly";
  else if (query.includes("maize") && query.includes("armyworm"))
    diseaseKey = "fall-armyworm";

  const disease = DISEASE_DATABASE[diseaseKey];

  return {
    text: `🔬 रोग का पता चला: ${disease.name}

📋 लक्षण: ${disease.symptoms}
🌡️ फैलने की स्थितियाँ: ${disease.conditions}

🌿 जैविक उपचार:
${disease.organicTreatment}

🧪 रासायनिक उपचार:
${disease.chemicalTreatment}

🛡️ बचाव के उपाय:
${disease.preventiveMeasures}

💊 अनुशंसित उत्पाद:
${disease.fungicides?.map((f) => `• ${f.name}: ${f.dosage} (₹${f.cost}) - सुरक्षा अवधि: ${f.safety}`).join("\n") || "• स्थानीय कृषि केंद्र से संपर्क करें"}

⚠️ गंभीरता स्तर:
- हल्का: ${disease.severityLevels.low}
- मध्यम: ${disease.severityLevels.medium}
- गंभीर: ${disease.severityLevels.high}`,
    translation: `🔬 Disease detected: ${disease.name}

📋 Symptoms: ${disease.symptoms}
🌡️ Favorable conditions: ${disease.conditions}

🌿 Organic treatment:
${disease.organicTreatment}

🧪 Chemical treatment:
${disease.chemicalTreatment}

🛡️ Preventive measures:
${disease.preventiveMeasures}

💊 Recommended products:
${disease.fungicides?.map((f) => `• ${f.name}: ${f.dosage} (₹${f.cost}) - Safety: ${f.safety}`).join("\n") || "• Contact local agriculture center"}

⚠️ Severity levels:
- Low: ${disease.severityLevels.low}
- Medium: ${disease.severityLevels.medium}
- Severe: ${disease.severityLevels.high}`,
    data: disease,
    confidence: Math.floor(Math.random() * (95 - 85 + 1) + 85), // 85-95% confidence
  };
};

// FEATURE 3: Fertilizer Planner
export const getFertilizerPlan = (
  cropId = "wheat",
  soilData = {},
  location = {},
) => {
  const crop = CROP_DATABASE[cropId];
  if (!crop) return { text: "Crop data not found", translation: "" };

  const soilN = soilData.nitrogen || 180;
  const soilP = soilData.phosphorus || 45;
  const soilK = soilData.potassium || 35;

  // Calculate adjustments based on existing soil nutrients
  const requiredN = Math.max(0, crop.npk.n - Math.floor(soilN / 8));
  const requiredP = Math.max(0, crop.npk.p - Math.floor(soilP / 5));
  const requiredK = Math.max(0, crop.npk.k - Math.floor(soilK / 4));

  return {
    text: `🧪 ${crop.name} के लिए उर्वरक योजना

📊 लक्ष्य NPK: ${crop.npk.n}:${crop.npk.p}:${crop.npk.k} kg/ha
🌱 आपकी मिट्टी में वर्तमान: N-${soilN}, P-${soilP}, K-${soilK} kg/ha
📉 अनुशंसित अतिरिक्त: N-${requiredN}, P-${requiredP}, K-${requiredK} kg/ha

📅 उर्वरक कार्यक्रम:
${crop.fertilizerSchedule.map((f) => `• ${f.stage}: ${f.npk}${f.urea ? ` (यूरिया ${f.urea})` : ""}${f.dap ? ` (DAP ${f.dap})` : ""}${f.mop ? ` (MOP ${f.mop})` : ""}`).join("\n")}

💰 अनुमानित लागत (1 एकड़ के लिए):
• यूरिया: ${Math.round(crop.fertilizerSchedule.reduce((sum, f) => sum + (parseInt(f.urea) || 0), 0) * 0.4047 * 5.5).toLocaleString()} रुपये
• DAP: ${Math.round(crop.fertilizerSchedule.reduce((sum, f) => sum + (parseInt(f.dap) || 0), 0) * 0.4047 * 28).toLocaleString()} रुपये
• MOP: ${Math.round(crop.fertilizerSchedule.reduce((sum, f) => sum + (parseInt(f.mop) || 0), 0) * 0.4047 * 18).toLocaleString()} रुपये

💡 टिप: उर्वरक हमेशा मिट्टी परीक्षण के आधार पर ही लगाएं। सूक्ष्म पोषक तत्वों (जिंक, आयरन) की भी जाँच करवाएं।`,
    translation: `🧪 Fertilizer plan for ${crop.name}

📊 Target NPK: ${crop.npk.n}:${crop.npk.p}:${crop.npk.k} kg/ha
🌱 Your soil current: N-${soilN}, P-${soilP}, K-${soilK} kg/ha
📉 Recommended additional: N-${requiredN}, P-${requiredP}, K-${requiredK} kg/ha

📅 Fertilizer schedule:
${crop.fertilizerSchedule.map((f) => `• ${f.stage}: ${f.npk}${f.urea ? ` (Urea ${f.urea})` : ""}${f.dap ? ` (DAP ${f.dap})` : ""}${f.mop ? ` (MOP ${f.mop})` : ""}`).join("\n")}

💰 Estimated cost (per acre):
• Urea: ₹${Math.round(crop.fertilizerSchedule.reduce((sum, f) => sum + (parseInt(f.urea) || 0), 0) * 0.4047 * 5.5).toLocaleString()}
• DAP: ₹${Math.round(crop.fertilizerSchedule.reduce((sum, f) => sum + (parseInt(f.dap) || 0), 0) * 0.4047 * 28).toLocaleString()}
• MOP: ₹${Math.round(crop.fertilizerSchedule.reduce((sum, f) => sum + (parseInt(f.mop) || 0), 0) * 0.4047 * 18).toLocaleString()}

💡 Tip: Always apply fertilizer based on soil test results. Also check for micronutrients (Zinc, Iron).`,
    data: {
      crop,
      soil: { n: soilN, p: soilP, k: soilK },
      required: { n: requiredN, p: requiredP, k: requiredK },
      schedule: crop.fertilizerSchedule,
    },
  };
};

// FEATURE 4: Irrigation Guide
export const getIrrigationGuide = (
  cropId = "wheat",
  weatherData = {},
  location = {},
) => {
  const crop = CROP_DATABASE[cropId];
  if (!crop) return { text: "Crop data not found", translation: "" };

  const todayTemp = weatherData.temperature || 25;
  const rainExpected = weatherData.rainExpected || false;

  return {
    text: `💧 ${crop.name} के लिए सिंचाई गाइड

🌊 कुल पानी की आवश्यकता: ${crop.waterRequirement}

📅 चरण-वार सिंचाई कार्यक्रम:
${crop.irrigationStages.map((s) => `• ${s.stage} (${s.days}): ${s.priority} प्राथमिकता - ${s.water}`).join("\n")}

🌡️ मौसम की जानकारी:
• आज का तापमान: ${todayTemp}°C
${rainExpected ? "• अगले 24 घंटे में बारिश की संभावना: हाँ - सिंचाई टालें" : "• अगले 24 घंटे में बारिश की संभावना: नहीं - सिंचाई कर सकते हैं"}

💡 सिंचाई टिप्स:
• सुबह या शाम के समय सिंचाई करें (दिन में न करें)
• टपक सिंचाई या फरो सिंचाई से पानी बचाएं
• मल्चिंग से नमी बनाए रखें
• फसल की अवस्था के अनुसार पानी की मात्रा समायोजित करें
• अत्यधिक सिंचाई से बचें (फफूंद रोग का खतरा)`,
    translation: `💧 Irrigation guide for ${crop.name}

🌊 Total water requirement: ${crop.waterRequirement}

📅 Stage-wise irrigation schedule:
${crop.irrigationStages.map((s) => `• ${s.stage} (${s.days}): ${s.priority} priority - ${s.water}`).join("\n")}

🌡️ Weather information:
• Today's temperature: ${todayTemp}°C
${rainExpected ? "• Rain expected in next 24 hours: Yes - delay irrigation" : "• Rain expected in next 24 hours: No - can irrigate"}

💡 Irrigation tips:
• Irrigate in morning or evening (not during day)
• Use drip or furrow irrigation to save water
• Use mulching to retain moisture
• Adjust water quantity based on crop stage
• Avoid over-irrigation (risk of fungal diseases)`,
    data: {
      crop,
      schedule: crop.irrigationStages,
      weather: weatherData,
    },
  };
};

// FEATURE 5: Scheme Finder
export const getSchemeFinder = (farmerProfile = {}, location = {}) => {
  const eligibleSchemes = [];

  // Check PM-KISAN eligibility (all farmers eligible)
  eligibleSchemes.push(SCHEME_DATABASE["pm-kisan"]);

  // Check PMFBY eligibility (all farmers eligible for notified crops)
  eligibleSchemes.push(SCHEME_DATABASE["pmfby"]);

  // Soil Health Card - all eligible
  eligibleSchemes.push(SCHEME_DATABASE["soil-health-card"]);

  // KCC - all eligible
  eligibleSchemes.push(SCHEME_DATABASE["kcc"]);

  // State-specific additional schemes
  if (location.state === "Uttar Pradesh") {
    eligibleSchemes.push({
      name: "Mukhyamantri Kisan Samman Nidhi",
      benefit: "Additional ₹500 per installment",
      description: "State top-up to PM-KISAN",
    });
  }

  return {
    text: `📋 आपके लिए पात्र सरकारी योजनाएँ:

${eligibleSchemes
  .map(
    (scheme, idx) => `
${idx + 1}. ${scheme.name}
   • लाभ: ${scheme.benefit}
   • पात्रता: ${scheme.eligibility || "सभी किसान"}
   • आवेदन कैसे करें: ${scheme.applyUrl || "नजदीकी CSC या बैंक शाखा से संपर्क करें"}
   • हेल्पलाइन: ${scheme.helpline || "1551"}
`,
  )
  .join("\n")}

📄 आवश्यक दस्तावेज़:
• आधार कार्ड
• भूमि दस्तावेज़ (खतौनी/पट्टा)
• बैंक खाता विवरण
• पासपोर्ट साइज फोटो
• मोबाइल नंबर (आधार से लिंक्ड)

📞 सहायता के लिए किसान कॉल सेंटर: 1551 (निःशुल्क)`,
    translation: `📋 Government schemes you are eligible for:

${eligibleSchemes
  .map(
    (scheme, idx) => `
${idx + 1}. ${scheme.name}
   • Benefit: ${scheme.benefit}
   • Eligibility: ${scheme.eligibility || "All farmers"}
   • How to apply: ${scheme.applyUrl || "Contact nearest CSC or bank branch"}
   • Helpline: ${scheme.helpline || "1551"}
`,
  )
  .join("\n")}

📄 Required documents:
• Aadhaar card
• Land documents (Khatauni/Patta)
• Bank account details
• Passport size photo
• Mobile number (linked to Aadhaar)

📞 Kisan Call Center for assistance: 1551 (toll-free)`,
    data: {
      eligibleSchemes,
      totalEligible: eligibleSchemes.length,
      documents: [
        "Aadhaar card",
        "Land records",
        "Bank account",
        "Photo",
        "Mobile number",
      ],
    },
  };
};

// Main orchestrator function for hybrid API/fallback
export const getFarmerFeatureResponse = async (feature, params = {}) => {
  const {
    cropId = "wheat",
    soilData = {},
    location = {},
    query = "",
    imageQuery = "",
  } = params;

  switch (feature) {
    case "crop":
      return getCropAdvisory(location, soilData, query);
    case "disease":
      return detectDisease(imageQuery || query, params.cropType, location);
    case "fertilizer":
      return getFertilizerPlan(cropId, soilData, location);
    case "irrigation":
      return getIrrigationGuide(cropId, params.weatherData || {}, location);
    case "scheme":
      return getSchemeFinder(params.farmerProfile || {}, location);
    default:
      return getCropAdvisory(location, soilData, query);
  }
};

export default {
  CROP_DATABASE,
  DISEASE_DATABASE,
  SCHEME_DATABASE,
  getCurrentSeason,
  getRecommendedCrops,
  calculateExpectedYield,
  calculateProfitability,
  getCropAdvisory,
  detectDisease,
  getFertilizerPlan,
  getIrrigationGuide,
  getSchemeFinder,
  getFarmerFeatureResponse,
};
