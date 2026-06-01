// services/geminiService.js
import { getIrrigationRecommendation } from "./irrigationLogic";

// Gemini API call (mock/placeholder - replace with actual)
const callGeminiAPI = async (prompt) => {
  // Your actual Gemini API call here
  // For now, simulating failure to test fallback
  throw new Error("Gemini API quota exceeded");
};

export const getIrrigationSchedule = async (
  crop,
  growthStage,
  district,
  state,
  rainfallData = null,
  temperatureData = null,
  currentMoisture = null,
) => {
  const MAX_RETRIES = 2;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const prompt = buildPrompt(
        crop,
        growthStage,
        district,
        state,
        rainfallData,
      );
      const response = await callGeminiAPI(prompt);
      const parsed = JSON.parse(response);

      // Validate response
      if (
        parsed.scheduledDays &&
        parsed.optionalDays &&
        typeof parsed.moistureLevel === "number"
      ) {
        console.log(`✅ Gemini success (attempt ${attempt})`);
        return {
          ...parsed,
          _source: "gemini-ai",
        };
      }
      throw new Error("Invalid Gemini response");
    } catch (error) {
      console.warn(`⚠️ Gemini attempt ${attempt} failed:`, error.message);

      if (attempt === MAX_RETRIES) {
        console.log("🔄 Falling back to rule-based irrigation engine");

        // 👇 USE YOUR DEDICATED LOGIC FILE HERE
        return getIrrigationRecommendation({
          crop,
          growthStage,
          district,
          state,
          rainfallData,
          temperatureData,
          currentMoisture,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  // Final fallback (should never reach)
  return getIrrigationRecommendation({
    crop,
    growthStage,
    district,
    state,
    rainfallData,
    temperatureData,
    currentMoisture,
  });
};

const buildPrompt = (crop, stage, district, state, rainfall) => {
  return `You are an agricultural irrigation expert...
    Crop: ${crop}
    Stage: ${stage}
    Location: ${district}, ${state}
    Rainfall: ${JSON.stringify(rainfall)}
    
    Return JSON with scheduledDays, optionalDays, moistureLevel, waterSavingTip`;
};

// services/geminiService.js (Mandi section)

import {
  getHistoricalSpotPrices,
  getFuturePriceCurve,
  getCommodityId,
  getDistrictId,
} from "./mandiApiService";
import { getMandiRecommendation } from "./mandiLogic";

/**
 * Get market data with hybrid strategy:
 * 1. Fetch real data from backend APIs
 * 2. Send to Gemini for AI analysis
 * 3. Fallback to rule-based logic
 */
export const getMarketData = async (cropName, districtName, stateName) => {
  try {
    // Step 1: Get commodity ID and district ID
    const commodityId = getCommodityId(cropName, districtName);
    const districtId = await getDistrictId(districtName, stateName);

    // Step 2: Fetch real data from backend APIs
    const [spotData, futureData] = await Promise.all([
      getHistoricalSpotPrices(commodityId, null, null, districtId),
      getFuturePriceCurve(commodityId, null, null),
    ]);

    if (!spotData.success && !futureData.success) {
      throw new Error("No real market data available");
    }

    // Step 3: Enhance with Gemini AI (if available)
    try {
      const geminiAnalysis = await callGeminiForMarketAnalysis(
        cropName,
        districtName,
        spotData.data,
        futureData.data,
      );

      return {
        ...geminiAnalysis,
        _source: "gemini-ai",
        _realDataUsed: {
          spot: spotData.success,
          future: futureData.success,
        },
      };
    } catch (geminiError) {
      console.warn(
        "Gemini analysis failed, using rule-based with real data:",
        geminiError,
      );

      // Step 4: Fallback to rule-based logic with real data
      return getMandiRecommendation({
        crop: cropName,
        district: districtName,
        state: stateName,
        realSpotData: spotData.data,
        realFutureData: futureData.data,
      });
    }
  } catch (error) {
    console.error("Market data API failed:", error);

    // Final fallback: rule-based with estimated data
    return getMandiRecommendation({
      crop: cropName,
      district: districtName,
      state: stateName,
    });
  }
};

/**
 * Call Gemini for AI-powered market analysis
 */
const callGeminiForMarketAnalysis = async (
  crop,
  district,
  spotData,
  futureData,
) => {
  const prompt = `
    You are an agricultural commodity market analyst for ${district}.
    
    **Real Market Data:**
    - Historical Spot Prices (last 30 days): ${JSON.stringify(spotData?.slice(-10))}
    - Future Contracts: ${JSON.stringify(futureData?.slice(0, 3))}
    
    **Crop:** ${crop}
    
    Generate a JSON response with:
    1. priceChart: Array of {day, price} for last 30 days
    2. mandis: Array of {name, price, weeklyChange, isBest}
    3. diversificationTip: String advice
    4. pricePrediction: 30-day forecast with confidence level
    5. isForecastExtended: true if forecast > 7 days
    
    Use the REAL data provided. Return ONLY valid JSON.
  `;

  // Your existing Gemini API call
  const response = await callGeminiAPI(prompt);
  return JSON.parse(response);
};
