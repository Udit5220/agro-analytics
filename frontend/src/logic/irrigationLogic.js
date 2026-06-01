/**
 * Irrigation Logic Engine - Rule-based deterministic calculator
 * Used as fallback when Gemini AI is unavailable or for hybrid strategy
 */

// Crop-specific water requirements (mm per day)
const CROP_WATER_REQUIREMENT = {
  rice: {
    germination: 5,
    tillering: 6,
    flowering: 7,
    maturity: 4,
    default: 5.5,
  },
  paddy: {
    germination: 5,
    tillering: 6,
    flowering: 7,
    maturity: 4,
    default: 5.5,
  },
  wheat: {
    germination: 3,
    tillering: 4,
    flowering: 5,
    maturity: 2,
    default: 3.5,
  },
  cotton: {
    germination: 2,
    tillering: 3.5,
    flowering: 4.5,
    maturity: 2.5,
    default: 3,
  },
  maize: {
    germination: 3,
    tillering: 4.5,
    flowering: 5.5,
    maturity: 3,
    default: 4,
  },
  sugarcane: {
    germination: 4,
    tillering: 6,
    flowering: 7,
    maturity: 4,
    default: 5,
  },
  default: {
    germination: 3,
    tillering: 4,
    flowering: 5,
    maturity: 3,
    default: 4,
  },
};

// Stage-specific irrigation intervals (days between irrigations)
const STAGE_INTERVALS = {
  germination: { min: 3, max: 5, optimal: 4 },
  tillering: { min: 5, max: 8, optimal: 6 },
  flowering: { min: 4, max: 7, optimal: 5 },
  maturity: { min: 8, max: 15, optimal: 10 },
  default: { min: 5, max: 7, optimal: 6 },
};

// Optimal soil moisture ranges by stage (%)
const OPTIMAL_MOISTURE = {
  germination: { min: 70, max: 85, optimal: 78 },
  tillering: { min: 65, max: 80, optimal: 72 },
  flowering: { min: 70, max: 85, optimal: 78 },
  maturity: { min: 45, max: 60, optimal: 52 },
  default: { min: 60, max: 75, optimal: 68 },
};

// Helper: Normalize crop name
const normalizeCrop = (cropName) => {
  if (!cropName) return "default";
  const lower = cropName.toLowerCase();
  if (lower.includes("rice") || lower.includes("paddy")) return "rice";
  if (lower.includes("wheat")) return "wheat";
  if (lower.includes("cotton")) return "cotton";
  if (lower.includes("maize") || lower.includes("corn")) return "maize";
  if (lower.includes("sugarcane")) return "sugarcane";
  return "default";
};

// Helper: Normalize growth stage
const normalizeStage = (stage) => {
  if (!stage) return "default";
  const lower = stage.toLowerCase();
  if (lower.includes("germ")) return "germination";
  if (lower.includes("tiller")) return "tillering";
  if (lower.includes("flower") || lower.includes("reproductive"))
    return "flowering";
  if (lower.includes("matur") || lower.includes("harvest")) return "maturity";
  return "default";
};

/**
 * Calculate current soil moisture based on:
 * - Days since last irrigation
 * - Rainfall received
 * - Crop water requirement
 * - Temperature factor
 */
export const calculateSoilMoisture = ({
  daysSinceLastIrrigation = 3,
  rainfallLast7Days = 0,
  crop,
  stage,
  temperature = 30,
}) => {
  const normalizedCrop = normalizeCrop(crop);
  const normalizedStage = normalizeStage(stage);

  const waterReq =
    CROP_WATER_REQUIREMENT[normalizedCrop]?.[normalizedStage] ||
    CROP_WATER_REQUIREMENT[normalizedCrop]?.default ||
    CROP_WATER_REQUIREMENT.default.default;

  // Temperature increases evaporation (above 32°C, add 15% stress)
  const tempFactor = temperature > 32 ? 1.15 : temperature > 35 ? 1.3 : 1.0;

  // Water depletion since last irrigation (mm)
  const dailyDepletion = waterReq * tempFactor;
  const totalDepletion = daysSinceLastIrrigation * dailyDepletion;

  // Rainfall contribution (assuming 70% effective)
  const effectiveRainfall = rainfallLast7Days * 0.7;

  // Soil moisture calculation (start at 100%, subtract depletion, add rainfall)
  let moisture = 100 - (totalDepletion - effectiveRainfall);

  // Clamp to realistic bounds (20% to 100%)
  moisture = Math.min(100, Math.max(20, Math.round(moisture)));

  return moisture;
};

/**
 * Generate irrigation schedule (30-day calendar)
 */
export const generateIrrigationSchedule = ({
  crop,
  stage,
  district,
  state,
  rainfallForecast = [],
  currentMoisture = null,
  temperatureForecast = [],
}) => {
  const normalizedCrop = normalizeCrop(crop);
  const normalizedStage = normalizeStage(stage);

  const intervals = STAGE_INTERVALS[normalizedStage] || STAGE_INTERVALS.default;
  const optimalMoistureRange =
    OPTIMAL_MOISTURE[normalizedStage] || OPTIMAL_MOISTURE.default;

  let scheduledDays = [];
  let optionalDays = [];

  // Base schedule: every N days from day 1
  let currentDay = 1;
  while (currentDay <= 30) {
    scheduledDays.push(currentDay);
    currentDay += intervals.optimal;
  }

  // Add optional days (midpoints between scheduled)
  for (let i = 0; i < scheduledDays.length - 1; i++) {
    const mid = Math.floor((scheduledDays[i] + scheduledDays[i + 1]) / 2);
    if (mid > scheduledDays[i] && mid < scheduledDays[i + 1]) {
      optionalDays.push(mid);
    }
  }

  // Adjust based on rainfall forecast
  if (rainfallForecast && rainfallForecast.length > 0) {
    rainfallForecast.forEach((rain, index) => {
      const day = index + 1;
      if (rain > 15) {
        // Heavy rain: remove scheduled day
        scheduledDays = scheduledDays.filter((d) => d !== day);
        // Add as optional instead
        if (!optionalDays.includes(day)) optionalDays.push(day);
      } else if (rain > 8) {
        // Moderate rain: keep but mark optional if scheduled
        if (scheduledDays.includes(day)) {
          scheduledDays = scheduledDays.filter((d) => d !== day);
          optionalDays.push(day);
        }
      }
    });
  }

  // Sort days
  scheduledDays.sort((a, b) => a - b);
  optionalDays.sort((a, b) => a - b);

  // Calculate moisture level
  const moistureLevel =
    currentMoisture !== null
      ? currentMoisture
      : calculateSoilMoisture({ crop, stage: normalizedStage });

  return {
    scheduledDays,
    optionalDays,
    moistureLevel,
  };
};

/**
 * Generate water saving tips based on crop and stage
 */
export const generateWaterSavingTip = (crop, stage, moisture, rainfall = 0) => {
  const normalizedCrop = normalizeCrop(crop);
  const normalizedStage = normalizeStage(stage);

  const tips = {
    rice: {
      germination:
        "Use shallow flooding (2-3 cm) to save 30% water while ensuring uniform germination.",
      tillering:
        "Alternate wetting and drying (AWD) can reduce water use by 25% without yield loss.",
      flowering:
        "Maintain 2-3 cm water depth — deeper water wastes without benefit.",
      maturity:
        "Stop irrigation 10-15 days before harvest to save water and improve grain quality.",
    },
    wheat: {
      germination:
        "Light pre-sowing irrigation (2.5 cm) improves germination efficiency.",
      tillering:
        "Apply irrigation only when soil moisture drops below 50% — wheat tolerates mild stress.",
      flowering:
        "Critical stage — but avoid over-irrigation. 5 cm every 7-10 days is sufficient.",
      maturity:
        "Stop irrigation when grains start hardening to prevent lodging.",
    },
    cotton: {
      germination: "Pre-sowing irrigation ensures uniform stand establishment.",
      tillering:
        "Cotton is drought-tolerant — irrigate only when leaves show wilting signs.",
      flowering:
        "Deep irrigation (7-8 cm) every 10-14 days is optimal during boll formation.",
      maturity:
        "Stop irrigation 30 days before harvest to promote boll opening.",
    },
    default: {
      germination:
        "Use drip or sprinkler irrigation for 40% water savings during early growth.",
      tillering:
        "Water early morning or late evening to reduce evaporation losses.",
      flowering:
        "Mulching around plants reduces soil evaporation by up to 30%.",
      maturity:
        "Monitor soil moisture — over-irrigation at maturity wastes water and harms quality.",
    },
  };

  const cropTips = tips[normalizedCrop] || tips.default;
  const tip = cropTips[normalizedStage] || cropTips.default;

  // Add rainfall adjustment
  if (rainfall > 10) {
    return `⚠️ ${rainfall}mm rainfall detected. Skip next irrigation. ${tip}`;
  }
  if (moisture < 45) {
    return `🚨 Soil moisture critical (${moisture}%). ${tip}`;
  }

  return tip;
};

/**
 * Calculate irrigation deficit warning level
 */
export const calculateDeficitLevel = (moisture, stage) => {
  const normalizedStage = normalizeStage(stage);
  const optimalRange =
    OPTIMAL_MOISTURE[normalizedStage] || OPTIMAL_MOISTURE.default;

  if (moisture < optimalRange.min) {
    return {
      level: "critical",
      message: `Moisture deficit detected (${moisture}% < ${optimalRange.min}%). Advance next irrigation by 2 days.`,
      action: "Immediate irrigation recommended",
    };
  } else if (moisture < optimalRange.optimal) {
    return {
      level: "warning",
      message: `Soil moisture below optimal (${moisture}% < ${optimalRange.optimal}%). Schedule irrigation within 2-3 days.`,
      action: "Plan irrigation soon",
    };
  } else if (moisture > optimalRange.max) {
    return {
      level: "excess",
      message: `Soil moisture high (${moisture}% > ${optimalRange.max}%). Risk of waterlogging.`,
      action: "Skip next irrigation",
    };
  }

  return {
    level: "optimal",
    message: `Soil moisture optimal (${moisture}%). Maintain current schedule.`,
    action: "Follow schedule",
  };
};

/**
 * Main export: Get complete irrigation recommendation
 * (Hybrid-ready: can be called directly or as Gemini fallback)
 */
export const getIrrigationRecommendation = ({
  crop,
  growthStage,
  district,
  state,
  rainfallData = null,
  temperatureData = null,
  currentMoisture = null,
}) => {
  // Extract rainfall forecast
  let rainfallForecast = [];
  let recentRainfall = 0;

  if (rainfallData) {
    recentRainfall =
      rainfallData.last7DaysTotal || rainfallData.rainfall_mm || 0;
    rainfallForecast = rainfallData.forecastNext7Days || [];
  }

  // Generate schedule
  const { scheduledDays, optionalDays, moistureLevel } =
    generateIrrigationSchedule({
      crop,
      stage: growthStage,
      district,
      state,
      rainfallForecast,
      currentMoisture,
    });

  // Calculate final moisture (could be overridden by actual sensor)
  const finalMoisture = currentMoisture || moistureLevel;

  // Generate tip
  const tip = generateWaterSavingTip(
    crop,
    growthStage,
    finalMoisture,
    recentRainfall,
  );

  // Calculate deficit level
  const deficit = calculateDeficitLevel(finalMoisture, growthStage);

  return {
    scheduledDays,
    optionalDays,
    moistureLevel: finalMoisture,
    waterSavingTip: tip,
    deficitLevel: deficit.level,
    deficitMessage: deficit.message,
    deficitAction: deficit.action,
    // Metadata for debugging/hybrid tracking
    _source: "rule-based-engine",
    _params: { crop, growthStage, recentRainfall },
  };
};
