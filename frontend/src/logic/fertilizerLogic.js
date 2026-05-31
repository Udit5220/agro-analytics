/**
 * Fertilizer Logic Engine - Deterministic rule-based calculator
 * Used as fallback when Gemini AI is unavailable
 */

// NPK requirements by crop (kg/ha)
const CROP_NPK_REQUIREMENTS = {
  wheat: { nitrogen: 120, phosphorus: 60, potassium: 40, zinc: 25 },
  rice: { nitrogen: 100, phosphorus: 50, potassium: 40, zinc: 20 },
  paddy: { nitrogen: 100, phosphorus: 50, potassium: 40, zinc: 20 },
  cotton: { nitrogen: 80, phosphorus: 40, potassium: 40, zinc: 15 },
  maize: { nitrogen: 100, phosphorus: 50, potassium: 40, zinc: 20 },
  sugarcane: { nitrogen: 150, phosphorus: 60, potassium: 60, zinc: 25 },
  mustard: { nitrogen: 60, phosphorus: 30, potassium: 20, zinc: 10 },
  default: { nitrogen: 100, phosphorus: 50, potassium: 40, zinc: 20 },
};

// Growth stage-specific splits (% of total)
const STAGE_SPLITS = {
  wheat: {
    germination: { nitrogen: 20, phosphorus: 40, potassium: 20 },
    tillering: { nitrogen: 40, phosphorus: 30, potassium: 40 },
    jointing: { nitrogen: 25, phosphorus: 20, potassium: 25 },
    flowering: { nitrogen: 15, phosphorus: 10, potassium: 15 },
    harvest: { nitrogen: 0, phosphorus: 0, potassium: 0 },
  },
  rice: {
    germination: { nitrogen: 25, phosphorus: 50, potassium: 25 },
    tillering: { nitrogen: 45, phosphorus: 25, potassium: 45 },
    flowering: { nitrogen: 30, phosphorus: 25, potassium: 30 },
    maturity: { nitrogen: 0, phosphorus: 0, potassium: 0 },
  },
  default: {
    germination: { nitrogen: 25, phosphorus: 40, potassium: 25 },
    tillering: { nitrogen: 40, phosphorus: 30, potassium: 40 },
    flowering: { nitrogen: 25, phosphorus: 20, potassium: 25 },
    maturity: { nitrogen: 10, phosphorus: 10, potassium: 10 },
  },
};

// Normalize crop name
const normalizeCrop = (cropName) => {
  if (!cropName) return "default";
  const lower = cropName.toLowerCase();
  if (lower.includes("wheat")) return "wheat";
  if (lower.includes("rice") || lower.includes("paddy")) return "rice";
  if (lower.includes("cotton")) return "cotton";
  if (lower.includes("maize") || lower.includes("corn")) return "maize";
  if (lower.includes("sugarcane")) return "sugarcane";
  if (lower.includes("mustard")) return "mustard";
  return "default";
};

// Normalize growth stage
const normalizeStage = (stage) => {
  if (!stage) return "tillering";
  const lower = stage.toLowerCase();
  if (lower.includes("germ")) return "germination";
  if (lower.includes("tiller")) return "tillering";
  if (lower.includes("joint")) return "jointing";
  if (lower.includes("flower") || lower.includes("reproductive"))
    return "flowering";
  if (lower.includes("matur") || lower.includes("harvest")) return "maturity";
  return "tillering";
};

/**
 * Calculate target NPK based on crop and soil data
 */
export const calculateTargetNPK = (crop, soilData = {}) => {
  const normalizedCrop = normalizeCrop(crop);
  const baseReq =
    CROP_NPK_REQUIREMENTS[normalizedCrop] || CROP_NPK_REQUIREMENTS.default;

  // Adjust based on soil organic carbon
  const oc = soilData.organicCarbon || 0.5;
  let adjustment = 1.0;
  if (oc > 0.75)
    adjustment = 0.85; // Rich soil → less fertilizer
  else if (oc < 0.4) adjustment = 1.2; // Poor soil → more fertilizer

  return {
    nitrogen: Math.round(baseReq.nitrogen * adjustment),
    phosphorus: Math.round(baseReq.phosphorus * adjustment),
    potassium: Math.round(baseReq.potassium * adjustment),
  };
};

/**
 * Check for excess nitrogen
 */
export const checkExcessNitrogen = (currentN, targetN) => {
  const excess = currentN > targetN * 1.15; // 15% above target
  return {
    isExcess: excess,
    warningText: excess
      ? `⚠️ High soil nitrogen (${currentN} kg/ha). Reduce urea application by 30%. Excess N causes lodging and pest attack.`
      : currentN < targetN * 0.7
        ? `📉 Low nitrogen (${currentN} kg/ha). Apply 25% extra basal dose.`
        : `✅ Nitrogen levels optimal (${currentN} kg/ha). Continue with planned schedule.`,
  };
};

/**
 * Generate split fertilizer schedule
 */
export const generateScheduleSteps = (crop, stage, targetNPK, currentNPK) => {
  const normalizedCrop = normalizeCrop(crop);
  const normalizedStage = normalizeStage(stage);

  const splits =
    STAGE_SPLITS[normalizedCrop]?.[normalizedStage] ||
    STAGE_SPLITS.default.tillering;

  const steps = [];

  // Calculate actual NPK for this stage
  const stepN = Math.round((targetNPK.nitrogen * splits.nitrogen) / 100);
  const stepP = Math.round((targetNPK.phosphorus * splits.phosphorus) / 100);
  const stepK = Math.round((targetNPK.potassium * splits.potassium) / 100);

  // Adjust if current soil has excess
  let adjustmentText = "";
  if (currentNPK.nitrogen > targetNPK.nitrogen) {
    adjustmentText = " (Reduced due to high soil N)";
  }

  // Build schedule based on growth stage
  if (normalizedStage === "germination") {
    steps.push({
      step: 1,
      timing: "At Sowing",
      title: "Basal Dose Application",
      desc: `Apply ${stepN} kg N, ${stepP} kg P, ${stepK} kg K per hectare as basal. Mix DAP or SSP during final ploughing.${adjustmentText}`,
    });
    steps.push({
      step: 2,
      timing: "21-25 Days After Sowing",
      title: "First Top Dressing",
      desc: `Apply ${Math.round(stepN * 0.8)} kg N through urea. Critical for tillering initiation.`,
    });
  } else if (normalizedStage === "tillering") {
    steps.push({
      step: 1,
      timing: "At Sowing",
      title: "Basal Dose",
      desc: `Apply ${Math.round(stepN * 0.6)} kg N, ${stepP} kg P, ${stepK} kg K.`,
    });
    steps.push({
      step: 2,
      timing: "Current Stage (Tillering)",
      title: "Active Tillering Application",
      desc: `Apply ${Math.round(stepN * 0.4)} kg N through urea to promote tillering.${adjustmentText}`,
    });
  } else if (normalizedStage === "flowering") {
    steps.push({
      step: 1,
      timing: "At Sowing",
      title: "Basal Dose",
      desc: `Apply ${Math.round(stepN * 0.5)} kg N, ${stepP} kg P, ${stepK} kg K.`,
    });
    steps.push({
      step: 2,
      timing: "Tillering Stage",
      title: "Second Split",
      desc: `Apply ${Math.round(stepN * 0.3)} kg N.`,
    });
    steps.push({
      step: 3,
      timing: "Current Stage (Flowering)",
      title: "Flowering / Grain Filling",
      desc: `Apply ${Math.round(stepN * 0.2)} kg N and foliar spray of 2% DAP. Critical for grain development.${adjustmentText}`,
    });
  } else {
    steps.push({
      step: 1,
      timing: "At Sowing",
      title: "Basal Application",
      desc: `Apply ${stepN} kg N, ${stepP} kg P, ${stepK} kg K per hectare.`,
    });
    steps.push({
      step: 2,
      timing: "30-35 Days After Sowing",
      title: "Top Dressing",
      desc: `Apply ${Math.round(stepN * 0.5)} kg N through urea.${adjustmentText}`,
    });
  }

  return steps;
};

/**
 * Main export: Get complete fertilizer recommendation
 */
export const getFertilizerRecommendation = ({
  crop,
  growthStage,
  location,
  soilData = {},
  currentNPK = null,
}) => {
  // Calculate target NPK based on crop and soil
  const targetNPK = calculateTargetNPK(crop, soilData);

  // Use provided current NPK or default from soil data
  const current = currentNPK || {
    nitrogen: soilData.nitrogen || 80,
    phosphorus: soilData.phosphorus || 35,
    potassium: soilData.potassium || 35,
  };

  // Check nitrogen excess
  const { isExcess, warningText } = checkExcessNitrogen(
    current.nitrogen,
    targetNPK.nitrogen,
  );

  // Generate schedule steps
  const scheduleSteps = generateScheduleSteps(
    crop,
    growthStage,
    targetNPK,
    current,
  );

  return {
    targetNPK,
    isExcessN: isExcess,
    warningText,
    scheduleSteps,
    _source: "rule-based-engine",
  };
};
