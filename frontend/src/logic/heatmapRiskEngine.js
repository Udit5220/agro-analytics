// export const calculateRegionalRisk = ({
//   temperature,
//   humidity,
//   rainfall,
//   windSpeed,
// }) => {
//   let score = 0;

//   score += (humidity / 100) * 35;

//   score += Math.min(rainfall / 100, 1) * 30;

//   score += Math.max(0, 20 - Math.abs(24 - temperature));

//   score += windSpeed < 8 ? 15 : 5;

//   return Math.min(Math.round(score), 100);
// };

// services/heatmapRiskEngine.js
import { fetchOpenMeteoWeather } from "./weatherService";

// Complete list of Indian agricultural regions with coordinates
const REGIONS_DATABASE = [
  // Haryana
  {
    id: "karnal",
    name: "Karnal",
    state: "Haryana",
    lat: 29.6857,
    lon: 76.9905,
    majorCrops: ["Rice", "Wheat", "Sugarcane"],
  },
  {
    id: "hisar",
    name: "Hisar",
    state: "Haryana",
    lat: 29.1492,
    lon: 75.7217,
    majorCrops: ["Cotton", "Wheat", "Mustard"],
  },
  {
    id: "rohtak",
    name: "Rohtak",
    state: "Haryana",
    lat: 28.8955,
    lon: 76.6066,
    majorCrops: ["Wheat", "Gram", "Sugarcane"],
  },
  {
    id: "ambala",
    name: "Ambala",
    state: "Haryana",
    lat: 30.3782,
    lon: 76.7767,
    majorCrops: ["Rice", "Wheat", "Maize"],
  },
  {
    id: "sonipat",
    name: "Sonipat",
    state: "Haryana",
    lat: 28.9948,
    lon: 77.0111,
    majorCrops: ["Wheat", "Sugarcane", "Vegetables"],
  },

  // Punjab
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    lat: 31.634,
    lon: 74.8723,
    majorCrops: ["Wheat", "Rice", "Cotton"],
  },
  {
    id: "ludhiana",
    name: "Ludhiana",
    state: "Punjab",
    lat: 30.901,
    lon: 75.8573,
    majorCrops: ["Wheat", "Rice", "Maize"],
  },
  {
    id: "jalandhar",
    name: "Jalandhar",
    state: "Punjab",
    lat: 31.326,
    lon: 75.5762,
    majorCrops: ["Wheat", "Rice", "Sugarcane"],
  },
  {
    id: "patiala",
    name: "Patiala",
    state: "Punjab",
    lat: 30.3398,
    lon: 76.3869,
    majorCrops: ["Wheat", "Rice", "Cotton"],
  },
  {
    id: "bathinda",
    name: "Bathinda",
    state: "Punjab",
    lat: 30.211,
    lon: 74.9455,
    majorCrops: ["Cotton", "Wheat", "Bajra"],
  },

  // Uttar Pradesh
  {
    id: "meerut",
    name: "Meerut",
    state: "Uttar Pradesh",
    lat: 28.9845,
    lon: 77.7064,
    majorCrops: ["Sugarcane", "Wheat", "Rice"],
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lon: 80.9462,
    majorCrops: ["Wheat", "Rice", "Pulses"],
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    lat: 27.1767,
    lon: 78.0081,
    majorCrops: ["Wheat", "Bajra", "Mustard"],
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3176,
    lon: 82.9739,
    majorCrops: ["Rice", "Wheat", "Pulses"],
  },
  {
    id: "bareilly",
    name: "Bareilly",
    state: "Uttar Pradesh",
    lat: 28.367,
    lon: 79.4304,
    majorCrops: ["Sugarcane", "Wheat", "Rice"],
  },

  // Rajasthan
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lon: 75.7873,
    majorCrops: ["Bajra", "Wheat", "Mustard"],
  },
  {
    id: "jodhpur",
    name: "Jodhpur",
    state: "Rajasthan",
    lat: 26.2389,
    lon: 73.0243,
    majorCrops: ["Bajra", "Pulses", "Guar"],
  },
  {
    id: "bikaner",
    name: "Bikaner",
    state: "Rajasthan",
    lat: 28.0229,
    lon: 73.3119,
    majorCrops: ["Bajra", "Wheat", "Pulses"],
  },
  {
    id: "kota",
    name: "Kota",
    state: "Rajasthan",
    lat: 25.2138,
    lon: 75.8648,
    majorCrops: ["Wheat", "Soybean", "Mustard"],
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    lat: 24.5854,
    lon: 73.7125,
    majorCrops: ["Maize", "Wheat", "Pulses"],
  },
];

// Disease risk thresholds
const DISEASE_THRESHOLDS = {
  "Blast Disease": { minHumidity: 85, minRainfall: 50, optTemp: [22, 28] },
  "Yellow Rust": { minHumidity: 75, minRainfall: 30, optTemp: [10, 20] },
  Whitefly: { minHumidity: 60, minRainfall: 0, optTemp: [25, 35] },
  "Leaf Blight": { minHumidity: 80, minRainfall: 40, optTemp: [20, 30] },
  "Sheath Blight": { minHumidity: 85, minRainfall: 60, optTemp: [25, 32] },
  "Alternaria Blight": { minHumidity: 70, minRainfall: 30, optTemp: [18, 25] },
};

// Crop-disease mapping to avoid homogenous disease data across regions
const CROP_DISEASES = {
  Rice: ["Blast Disease", "Sheath Blight", "Leaf Blight"],
  Wheat: ["Yellow Rust", "Leaf Blight"],
  Cotton: ["Whitefly"],
  Mustard: ["Alternaria Blight"],
  Sugarcane: ["Leaf Blight", "Alternaria Blight"],
  Maize: ["Leaf Blight"],
  Gram: ["Alternaria Blight"],
  Bajra: ["Blast Disease"],
  Soybean: ["Leaf Blight"],
  Vegetables: ["Whitefly", "Alternaria Blight"],
  Pulses: ["Alternaria Blight", "Leaf Blight"],
  Guar: ["Alternaria Blight", "Leaf Blight"],
};

// Calculate disease risk for a region
export const calculateDiseaseRisk = (weather, crop) => {
  const { temperature, humidity, rainfall, windSpeed } = weather;
  const allowedDiseases = CROP_DISEASES[crop] || Object.keys(DISEASE_THRESHOLDS);
  let maxRisk = -1;
  let primaryDisease = allowedDiseases[0] || "None";
  let secondaryDisease = null;

  for (const disease of allowedDiseases) {
    const thresholds = DISEASE_THRESHOLDS[disease];
    if (!thresholds) continue;
    let risk = 0;

    // Humidity contribution
    if (humidity >= thresholds.minHumidity) {
      risk += Math.min(((humidity - thresholds.minHumidity) / 30) * 40, 40);
    } else if (humidity >= thresholds.minHumidity - 15) {
      risk += ((humidity - (thresholds.minHumidity - 15)) / 15) * 20;
    }

    // Rainfall contribution
    if (rainfall >= thresholds.minRainfall) {
      risk += Math.min(((rainfall - thresholds.minRainfall) / 50) * 30, 30);
    }

    // Temperature contribution
    const [optMin, optMax] = thresholds.optTemp;
    if (temperature >= optMin && temperature <= optMax) {
      risk += 30;
    } else if (temperature >= optMin - 5 && temperature <= optMax + 5) {
      risk += 15;
    }

    // Wind speed modifier (low wind increases disease spread)
    if (
      windSpeed < 8 &&
      (disease === "Blast Disease" || disease === "Yellow Rust")
    ) {
      risk += 10;
    }

    risk = Math.min(risk, 100);

    if (risk > maxRisk) {
      secondaryDisease = (primaryDisease !== "None" && maxRisk > -1) ? primaryDisease : null;
      primaryDisease = disease;
      maxRisk = risk;
    } else if (risk > 40 && risk === maxRisk) {
      secondaryDisease = disease;
    }
  }

  return {
    riskScore: Math.round(Math.max(0, maxRisk)),
    primaryDisease,
    secondaryDisease,
    riskLevel: maxRisk >= 75 ? "High" : maxRisk >= 40 ? "Moderate" : "Low",
  };
};

// Fetch real-time data for all regions
export const fetchAllRegionsWeather = async () => {
  const regionsWithWeather = [];

  // Process regions in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < REGIONS_DATABASE.length; i += batchSize) {
    const batch = REGIONS_DATABASE.slice(i, i + batchSize);
    const batchPromises = batch.map(async (region) => {
      try {
        const weatherData = await fetchOpenMeteoWeather(region.lat, region.lon);

        // Determine primary crop for this season (simplified - use first major crop)
        const currentCrop = region.majorCrops[0];

        // Calculate disease risk based on actual weather
        const risk = calculateDiseaseRisk(weatherData, currentCrop);

        // Calculate incidents based on risk score
        const incidents =
          Math.floor(risk.riskScore / 4) + Math.floor(Math.random() * 15);

        return {
          ...region,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          rainfall: weatherData.rainfall,
          windSpeed: weatherData.windSpeed,
          riskScore: risk.riskScore,
          riskWeight: risk.riskScore,
          disease: risk.primaryDisease,
          secondaryDisease: risk.secondaryDisease,
          riskLevel: risk.riskLevel,
          incidents: incidents,
          affectedArea: `${Math.floor(incidents * 8 + 50)} acres`,
          reportedAt: `${Math.floor(Math.random() * 60)} min ago`,
          lastUpdated: new Date().toISOString(),
          crop: currentCrop,
          x: getXCoordinate(region.lon),
          y: getYCoordinate(region.lat),
        };
      } catch (error) {
        console.error(`Failed to fetch weather for ${region.name}:`, error);
        return getFallbackData(region);
      }
    });

    const batchResults = await Promise.all(batchPromises);
    regionsWithWeather.push(...batchResults);

    // Small delay between batches
    if (i + batchSize < REGIONS_DATABASE.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return regionsWithWeather;
};

// Get X coordinate from longitude (for SVG map)
const getXCoordinate = (lon) => {
  // Map longitude range (68°E to 97°E) to x coordinates (50 to 450)
  return 50 + ((lon - 68) / 29) * 400;
};

// Get Y coordinate from latitude (for SVG map)
const getYCoordinate = (lat) => {
  // Map latitude range (8°N to 37°N) to y coordinates (420 to 80)
  return 420 - ((lat - 8) / 29) * 340;
};

// Fallback data when API fails
const getFallbackData = (region) => {
  const mockRisk = Math.floor(Math.random() * 100);
  const currentCrop = region.majorCrops[0];
  const allowedDiseases = CROP_DISEASES[currentCrop] || Object.keys(DISEASE_THRESHOLDS);
  const primaryDisease = allowedDiseases[Math.floor(Math.random() * allowedDiseases.length)];

  return {
    ...region,
    temperature: Math.floor(Math.random() * 15) + 20,
    humidity: Math.floor(Math.random() * 50) + 40,
    rainfall: Math.floor(Math.random() * 80),
    windSpeed: Math.floor(Math.random() * 15) + 3,
    riskScore: mockRisk,
    riskWeight: mockRisk,
    disease: primaryDisease,
    riskLevel: mockRisk >= 75 ? "High" : mockRisk >= 40 ? "Moderate" : "Low",
    incidents: Math.floor(mockRisk / 5),
    affectedArea: `${Math.floor(mockRisk * 2 + 30)} acres`,
    reportedAt: `${Math.floor(Math.random() * 60)} min ago`,
    crop: currentCrop,
    x: getXCoordinate(region.lon),
    y: getYCoordinate(region.lat),
  };
};

// Filter regions by state and disease
export const filterRegions = (regions, state, disease) => {
  let filtered = regions;

  if (state && state !== "All") {
    filtered = filtered.filter((r) => r.state === state);
  }

  if (disease && disease !== "All") {
    filtered = filtered.filter((r) => r.disease === disease);
  }

  return filtered;
};
