export const calculateDiseaseRisk = ({
  temperature,
  humidity,
  rainfall,
  windSpeed,
  growthStage,
  soilData,
}) => {
  let score = 0;

  // Humidity (30)
  score += (humidity / 100) * 30;

  // Rainfall (25)
  score += Math.min(rainfall / 100, 1) * 25;

  // Temperature (20)
  const optimalTemp = 24;
  score += Math.max(0, 20 - Math.abs(optimalTemp - temperature));

  // Wind (10)
  if (windSpeed < 5) score += 10;
  else if (windSpeed < 10) score += 8;
  else if (windSpeed < 20) score += 5;
  else score += 2;

  // Growth stage (10)
  const stageRisk = {
    Seed: 2,
    Germination: 8,
    Vegetative: 10,
    Flowering: 10,
    "Grain Fill": 6,
    Harvest: 2,
  };

  score += stageRisk[growthStage] || 0;

  // Soil (5)
  let soilRisk = 0;

  if (soilData) {
    if (soilData.pH < 5.5 || soilData.pH > 8) soilRisk += 2;

    if (
      soilData.soilType?.toLowerCase().includes("clay") ||
      soilData.soilType?.toLowerCase().includes("alluvial")
    ) {
      soilRisk += 3;
    }
  }

  score += soilRisk;

  const finalScore = Math.min(Math.round(score), 100);

  let riskLevel = "Low";

  if (finalScore >= 75) riskLevel = "High";
  else if (finalScore >= 45) riskLevel = "Medium";

  return {
    compositeRiskScore: finalScore,
    riskLevel,
  };
};

export const generateAnalysis = ({
  temperature,
  humidity,
  rainfall,
  windSpeed,
}) => {
  const reasons = [];

  if (humidity > 75)
    reasons.push("High humidity favors fungal disease development.");

  if (rainfall > 50)
    reasons.push("Recent rainfall increases leaf wetness duration.");

  if (temperature >= 18 && temperature <= 30)
    reasons.push("Temperature is favorable for pathogen growth.");

  if (windSpeed < 8) reasons.push("Low wind speed reduces canopy drying.");

  if (!reasons.length)
    reasons.push(
      "Current environmental conditions indicate low disease pressure.",
    );

  return reasons.join(" ");
};

export const generatePathogens = (risk) => {
  return [
    {
      name: "Blast Disease",
      probability: Math.min(risk + 10, 95),
      severity: risk >= 70 ? "High" : risk >= 45 ? "Medium" : "Low",
      trend: risk >= 70 ? "Rising" : "Stable",
    },
    {
      name: "Brown Spot",
      probability: Math.max(risk - 5, 10),
      severity: risk >= 60 ? "Medium" : "Low",
      trend: "Stable",
    },
    {
      name: "Leaf Blight",
      probability: Math.max(risk - 20, 5),
      severity: "Low",
      trend: "Stable",
    },
    {
      name: "Sheath Blight",
      probability: Math.max(risk - 15, 5),
      severity: risk >= 75 ? "Medium" : "Low",
      trend: risk >= 75 ? "Rising" : "Stable",
    },
  ];
};
