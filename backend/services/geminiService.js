/**
 * Gemini AI Service — Placeholder for future integration
 * 
 * Currently uses rule-based fallback logic.
 * When GEMINI_API_KEY is provided in .env, full AI integration will be activated.
 * 
 * Supported contexts:
 * - commodity price trend → selling suggestion
 * - weather rain probability → farming activity
 * - marketplace listing vs mandi price → price comparison insight
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ─── Rule-based fallback recommendations ─────────────────────────────────────
const ruleBased = (context) => {
  const { trend, rainProbability, modalPrice, expectedPrice, mandiBenchmarkPrice, riskLevel, irrigationAdvice } = context;

  // Commodity price trend
  if (trend === 'up') return 'Price is moving upward. You may wait if storage is available.';
  if (trend === 'down') return 'Price is declining. Consider selling soon to avoid further loss.';
  if (trend === 'stable') return 'Price is stable. Good time to plan your sale.';

  // Weather
  if (rainProbability > 70) return 'Heavy rain expected. Avoid spraying, harvesting, or transporting produce.';
  if (rainProbability > 40) return 'Moderate rain possible. Monitor weather before field operations.';
  if (riskLevel === 'high') return 'High weather risk in your area. Delay non-essential farm activities.';

  // Marketplace price comparison
  if (mandiBenchmarkPrice && expectedPrice) {
    const diff = ((expectedPrice - mandiBenchmarkPrice) / mandiBenchmarkPrice) * 100;
    if (diff < -5) return `This offer is ${Math.abs(diff.toFixed(1))}% below current mandi benchmark. Consider negotiating.`;
    if (diff > 10) return `Great deal — this listing is ${diff.toFixed(1)}% above current mandi price.`;
    return 'This listing is priced close to current mandi benchmark.';
  }

  // Irrigation
  if (irrigationAdvice === 'irrigate_today') return 'Soil moisture is low. Irrigate today for optimal crop health.';
  if (irrigationAdvice === 'avoid') return 'Rain expected. Skip irrigation to prevent waterlogging.';
  if (irrigationAdvice === 'wait') return 'Adequate moisture present. Wait 2–3 days before next irrigation.';

  return 'Monitor market conditions and weather before making decisions.';
};

// ─── Main recommendation function ────────────────────────────────────────────
export const getRecommendation = async (context = {}) => {
  if (!GEMINI_API_KEY) {
    // Fallback to rule-based
    return {
      source: 'rule-based',
      text: ruleBased(context),
    };
  }

  // TODO: Implement Gemini API call when key is available
  // const { GoogleGenerativeAI } = await import('@google/generative-ai');
  // const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  // const prompt = buildPrompt(context);
  // const result = await model.generateContent(prompt);
  // return { source: 'gemini', text: result.response.text() };

  return {
    source: 'rule-based',
    text: ruleBased(context),
  };
};

export default { getRecommendation };
