import mongoose from 'mongoose';
import geminiKeyManager from '../utils/geminiKeyManager.js';
import GlCommodityValue from '../models/GlCommodityValue.js';
import GlCommodityFutures from '../models/GlCommodityFutures.js';

const tryMongo = async (fn) => {
  try {
    return await fn();
  } catch (e) {
    console.warn("[AI] MongoDB error:", e.message);
    return null;
  }
};

const ok = (res, data, extra = {}) => res.json({ success: true, ...data, ...extra });
const fail = (res, msg, status = 500) => res.status(status).json({ success: false, message: msg });

async function resolveCommodityId(name) {
  const meta = await tryMongo(() => mongoose.connection.db.collection('commodities').findOne({ 
    $or: [ { commodity_name: new RegExp(`^${name}$`, 'i') }, { name: new RegExp(`^${name}$`, 'i') } ]
  }));
  return meta?._id || meta?.commodity_id || null;
}

export const chatWithCommodityAI = async (req, res) => {
  try {
    const { message, commodity = "Wheat", userType = "trader", pageContext = "overview" } = req.body;

    if (!message) {
      return fail(res, "Message is required", 400);
    }

    // 1. Gather MongoDB Context
    let source = "live_data";
    
    // Resolve ID
    const cid = await resolveCommodityId(commodity);

    // Spot Price
    let spotPrice = null;
    if (cid) {
      const latestSpot = await tryMongo(() => GlCommodityValue.findOne({ commodity_id: cid, is_active: true }).sort({ date: -1 }).lean());
      if (latestSpot) spotPrice = latestSpot.price || latestSpot.spot_price;
    }
    if (!spotPrice) {
      spotPrice = 2200; // Seed fallback
      source = "mixed";
    }

    // Futures & Spread
    let nearestFuture = null;
    let futuresData = null;
    if (cid) {
      futuresData = await tryMongo(() => GlCommodityFutures.findOne({ commodity_id: cid, is_active: true }).sort({ date: -1 }).lean());
    }
    if (futuresData && futuresData.expiry_data && futuresData.expiry_data.length > 0) {
      nearestFuture = parseFloat(futuresData.expiry_data[0].last_price);
    }
    if (!nearestFuture) {
      nearestFuture = spotPrice * 1.05; // 5% premium seed
      source = "seed_fallback";
    }

    const spread = Math.floor(nearestFuture - spotPrice);
    const basis = Math.floor(spotPrice - nearestFuture);
    const signal = spread > 0 ? "Bullish" : "Bearish";

    // Tariff
    let tariffData = await tryMongo(() => mongoose.connection.db.collection('tariffconfigs').findOne({
      $or: [
        { commodity_name: new RegExp(`^${commodity}$`, 'i') },
        { commodityType: new RegExp(`^${commodity}$`, 'i') }
      ]
    }));
    
    const basicDuty = tariffData?.basicDuty || tariffData?.duty || (commodity === 'Wheat' ? '40%' : '15%');
    const restriction = tariffData?.tradeRestriction || tariffData?.restriction || 'Standard';

    // 2. Build AI Context String
    const mongoContext = `
Commodity: ${commodity}
Spot Price: ₹${Math.floor(spotPrice)}
Nearest Future: ₹${Math.floor(nearestFuture)}
Spread: ₹${spread}
Basis: ₹${basis}
Signal: ${signal}
Confidence: 75%
Currency: USD/INR 95.00, +0.15%
Tariff: Basic Duty ${basicDuty}, Restriction ${restriction}
Source: ${source}
Page Context: ${pageContext}
User Type: ${userType}
`;

    const systemInstruction = `You are AgroIndia AI Assistant for an agriculture commodity trading terminal. 
You help farmers, traders, businessmen, importers, and exporters understand commodity prices, spot prices, futures prices, spreads, basis, support/resistance, currency impact, tariff impact, and market signals.
Use only the provided MongoDB context below. 
Do not invent prices or facts.
Do not provide guaranteed financial advice.
Use simple language.
Explain terms for beginners.
Use safe wording like monitor, caution, market signal, possible opportunity.
Always include a short risk note when discussing trading or price direction.
Answer based on the current page context (${pageContext}) and tailor the explanation slightly for a ${userType}.

MongoDB Context:
${mongoContext}

User Question:
${message}

Answer rules:
- Answer in simple words.
- Mention data source (${source}).
- Do not say "buy now" or "sell now".
- Say "monitor", "compare mandi price", "check support/resistance", or "use caution".
- Give farmer/trader/businessman-specific explanation if userType is provided.
`;

    // 3. Call Gemini with Rotation
    let responseText = null;
    let attempts = 0;
    const maxAttempts = geminiKeyManager.keyCount;

    while (attempts < maxAttempts && !responseText) {
      const apiKey = geminiKeyManager.getNextKey();
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemInstruction }] }]
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Gemini API Error');
        }

        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        console.warn(`[AI] Gemini call failed on attempt ${attempts + 1}: ${err.message}`);
      }
      attempts++;
    }

    if (!responseText) {
      return fail(res, "AI assistant is temporarily unavailable. Please try again later.", 503);
    }

    // 4. Return formatted response
    return ok(res, {
      answer: responseText,
      dataSource: source,
      usedData: {
        commodity,
        spotPrice: Math.floor(spotPrice),
        futurePrice: Math.floor(nearestFuture),
        spread,
        signal
      }
    });

  } catch (e) {
    console.error("[AI Controller Error]", e);
    return fail(res, "Internal Server Error", 500);
  }
};
