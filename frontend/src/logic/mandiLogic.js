// services/mandiLogic.js
// Enhanced to use real API data when available

/**
 * Generate price chart from real spot data or estimate
 */
const generatePriceChart = (spotData, basePrice, days = 30) => {
  // If we have real spot data, use it
  if (spotData && spotData.length > 0) {
    return spotData.map((item, idx) => ({
      day: idx + 1,
      price: item.close_price || item.price,
      date: item.date,
    }));
  }

  // Otherwise generate estimated chart
  const chart = [];
  let currentPrice = basePrice;

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 30;
    const seasonal = Math.sin((i / 7) * Math.PI) * 15;
    currentPrice = Math.max(
      basePrice * 0.8,
      Math.min(basePrice * 1.2, currentPrice + change + seasonal),
    );
    chart.push({
      day: i + 1,
      price: Math.round(currentPrice),
    });
  }

  return chart;
};

/**
 * Generate future price prediction from expiry data
 */
const generateFuturePrediction = (futureData, currentPrice) => {
  if (futureData && futureData.length > 0) {
    // Extract future prices from actual contract data
    const predictions = [];
    futureData.forEach((contract) => {
      const lastPrice =
        contract.dataPoints?.[contract.dataPoints.length - 1]?.close_price;
      if (lastPrice) {
        predictions.push({
          expiryDate: contract.expiry_date,
          predictedPrice: lastPrice,
          confidence: "High (Contract Data)",
        });
      }
    });
    return predictions;
  }

  // AI-estimated forecast (beyond 7 days)
  const predictions = [];
  for (let i = 1; i <= 30; i++) {
    const seasonalFactor = Math.sin((i / 30) * Math.PI) * 0.05;
    const randomWalk = (Math.random() - 0.5) * 0.02;
    const multiplier = 1 + seasonalFactor + randomWalk;
    predictions.push({
      day: i,
      predictedPrice: Math.round(currentPrice * multiplier),
      confidence: i <= 7 ? "Medium (Historical)" : "Low (AI-Estimated)",
    });
  }

  return predictions;
};

/**
 * Main export - enhanced with real data support
 */
export const getMandiRecommendation = ({
  crop,
  district,
  state,
  realSpotData = null,
  realFutureData = null,
}) => {
  const cropName = crop?.split(" ")[0] || "Wheat";

  // Get base price from real data or fallback
  let basePrice = 2350;
  let priceChart = [];

  if (realSpotData && realSpotData.length > 0) {
    // Use real spot data
    const latestPrice = realSpotData[realSpotData.length - 1]?.close_price;
    basePrice = latestPrice || 2350;
    priceChart = generatePriceChart(realSpotData, basePrice);
  } else {
    // Fallback to estimated prices
    const cropPrices = BASE_PRICES[cropName] || BASE_PRICES.Wheat;
    basePrice = cropPrices[state] || cropPrices.default || 2350;
    priceChart = generatePriceChart(null, basePrice, 30);
  }

  // Generate future predictions
  const futurePredictions = generateFuturePrediction(realFutureData, basePrice);

  // Check if forecast is AI-estimated (beyond contract data)
  const hasRealFutureData = realFutureData && realFutureData.length > 0;
  const isForecastExtended = !hasRealFutureData || futurePredictions.length > 7;

  // Generate mandis list
  const mandis = generateMandis(cropName, district, state, basePrice);

  // Enhanced tip based on future predictions
  let diversificationTip = getDefaultTip(cropName);
  if (futurePredictions.length > 0) {
    const predictedTrend =
      futurePredictions[0].predictedPrice > basePrice ? "upward" : "downward";
    diversificationTip = `Prices show ${predictedTrend} trend in next 30 days. Consider ${
      predictedTrend === "upward" ? "delaying sales" : "early selling"
    } for better returns. ${getDefaultTip(cropName)}`;
  }

  return {
    priceChart,
    mandis,
    diversificationTip,
    futurePredictions,
    basePrice,
    isForecastExtended,
    realDataUsed: {
      spot: !!realSpotData,
      future: !!realFutureData,
    },
    _source: hasRealFutureData
      ? "rule-based-with-real-data"
      : "rule-based-estimated",
  };
};

// Helper functions
const BASE_PRICES = {
  Wheat: { default: 2350, Haryana: 2325, Punjab: 2350 },
  Rice: { default: 3050, Haryana: 3000, Punjab: 3050 },
  Cotton: { default: 5850, Haryana: 5900 },
  Mustard: { default: 5750, Haryana: 5750, Rajasthan: 5850 },
};

const generateMandis = (crop, district, state, basePrice) => {
  return [
    {
      name: `${district} Main Mandi`,
      price: basePrice,
      weeklyChange: 2.1,
      isBest: true,
    },
    {
      name: `Central Mandi, ${state}`,
      price: Math.round(basePrice * 0.97),
      weeklyChange: 1.2,
      isBest: false,
    },
    {
      name: `Regional APMC`,
      price: Math.round(basePrice * 0.94),
      weeklyChange: -0.5,
      isBest: false,
    },
  ];
};

const getDefaultTip = (cropName) => {
  const tips = {
    Rice: "Consider diversifying to Wheat or Mustard to reduce price volatility.",
    Wheat: "Store in warehouses if price expected to rise in next 2 months.",
    Cotton:
      "Monitor international prices as they directly impact local mandi rates.",
    Mustard: "Process into oil for better margins during price slumps.",
  };
  return (
    tips[cropName] || "Diversify crops to stabilize income throughout the year."
  );
};
