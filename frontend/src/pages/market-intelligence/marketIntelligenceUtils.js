import {
  MSP_REFERENCE,
  DUTY_RATES,
  TRADE_INTELLIGENCE,
  POLICY_ALERTS,
  BENCHMARK_PARITY,
  PROCUREMENT_INSIGHTS,
} from "./marketIntelligenceData";

export const formatINR = (value, noSymbol = false) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const num = Number(value);
  const formatted = num.toLocaleString("en-IN");
  return noSymbol ? formatted : `₹${formatted}`;
};

export const formatUnit = (commodity) => {
  const qtlItems = [
    "Wheat",
    "Chana",
    "Cotton",
    "Soybean",
    "Mustard",
    "Turmeric",
    "Onion",
    "Maize",
    "Paddy",
    "Sugar",
  ];
  return qtlItems.includes(commodity) ? "₹/qtl" : "₹/MT";
};

export const getMarketStatus = (sourceLive) => {
  if (sourceLive === true)
    return { label: "Live", color: "bg-emerald-100 text-emerald-700" };
  if (sourceLive === false)
    return { label: "Demo Data", color: "bg-amber-100 text-amber-800" };
  return { label: "Delayed", color: "bg-slate-100 text-slate-600" };
};

export const buildAIMarketSummary = (dash, compareData, futures, prices) => {
  const rising = dash?.topRising || [];
  const falling = dash?.topFalling || [];
  const weighted = (arr, sign) =>
    arr.reduce(
      (sum, item) => sum + (item.maxChange || item.minChange || 0) * sign,
      0,
    );
  const score = weighted(rising, 1) + weighted(falling, -1);
  let marketSignal = "Neutral";
  if (score >= 10) marketSignal = "Bullish";
  else if (score <= -10) marketSignal = "Bearish";
  else if (score >= 5 || score <= -5) marketSignal = "Mixed";
  const topOpportunity = rising[0]?._id || "Cotton";
  const topRisk = falling[0]?._id || "Palm Oil";

  const insights = [];
  if (rising.length)
    insights.push(
      `${rising[0]._id} is leading gains with +${(rising[0].maxChange || 0).toFixed(1)}%.`,
    );
  if (falling.length)
    insights.push(
      `${falling[0]._id} is under pressure and may soften further.`,
    );
  if (compareData?.summary?.strongestTrend)
    insights.push(
      `${compareData.summary.strongestTrend} shows the strongest price momentum.`,
    );
  if (futures?.contracts?.length)
    insights.push(
      `Futures show ${futures.contracts[0].contract} at ₹${(futures.contracts[0].lastPrice || 0).toLocaleString()}.`,
    );
  if (!insights.length)
    insights.push("Market is balanced with a mixed signal across commodities.");

  const suggestedAction =
    marketSignal === "Bullish"
      ? `Consider selling market-ready crops now; monitor near-term supply news.`
      : marketSignal === "Bearish"
        ? `Hold stocks and wait for a stronger reversal signal; avoid new forward contracts.`
        : `Monitor price moves closely; use nearby mandi spread to choose the best selling point.`;

  return {
    marketSignal,
    insights: insights.slice(0, 4),
    topOpportunity,
    topRisk,
    suggestedAction,
  };
};

export const buildMSPDecision = (prices) => {
  if (!prices?.length) return null;
  const known = prices
    .map((row) => {
      const msp = MSP_REFERENCE[row.commodity] || null;
      const delta = msp ? row.modalPrice - msp : null;
      const pct = msp ? (delta / msp) * 100 : null;
      const status =
        pct === null
          ? "Watch"
          : pct >= 5
            ? "Sell Now"
            : pct >= 0
              ? "Store"
              : "Hold";
      return { ...row, msp, delta, pct, status };
    })
    .filter((row) => row.msp !== null);
  if (!known.length) return null;
  const best = known.sort((a, b) => (b.pct || 0) - (a.pct || 0))[0];
  return {
    commodity: best.commodity,
    mandi: best.mandiName,
    marketPrice: best.modalPrice,
    msp: best.msp,
    difference: best.delta,
    pctAboveMsp: best.pct,
    recommendedAction: best.status,
    aiNote:
      best.status === "Sell Now"
        ? `${best.commodity} is trading comfortably above MSP in ${best.mandiName}. Consider booking sales now.`
        : best.status === "Store"
          ? `${best.commodity} is near MSP. Hold for a better premium if storage is available.`
          : `${best.commodity} is below MSP; wait for stronger mandi levels before selling.`,
  };
};

export const buildFuturesPreview = (futures, prices) => {
  const contracts = futures?.contracts || [];
  const currentSpot = prices?.[0]?.modalPrice || null;
  const nearest = contracts[0] || null;
  const basis =
    currentSpot && nearest?.lastPrice
      ? Math.round(nearest.lastPrice - currentSpot)
      : null;
  return {
    commodity: futures?.commodity || "Cotton",
    spotPrice: currentSpot || null,
    futuresPrice: nearest?.lastPrice || null,
    basis,
    openInterest: nearest?.openInterest || null,
    volume: nearest?.volume || null,
    contract: nearest?.contract || "Near",
    signal: basis > 0 ? "Contango" : basis < 0 ? "Backwardation" : "Flat",
    spreadOpportunity: basis ? `₹${basis}/qtl` : "N/A",
  };
};

export const getTradeIntelligence = () => TRADE_INTELLIGENCE;
export const getPolicyAlerts = () => POLICY_ALERTS;
export const getBenchmarkParity = () => BENCHMARK_PARITY;
export const getProcurementInsights = () => PROCUREMENT_INSIGHTS;

export const calculateDutyCost = ({
  commodity,
  hsCode,
  cifPrice,
  port,
  quantity,
}) => {
  const code = String(hsCode || "default");
  const rates = DUTY_RATES[code] || DUTY_RATES.default;
  const baseValue = Number(cifPrice) || 0;
  const qty = Number(quantity) || 1;
  const bcd = (baseValue * rates.BCD) / 100;
  const aidc = (baseValue * rates.AIDC) / 100;
  const sws = (baseValue * rates.SWS) / 100;
  const igst = (baseValue * rates.IGST) / 100;
  const portFee = (baseValue * rates.portCharges) / 100;
  const landedPerUnit = baseValue + bcd + aidc + sws + igst + portFee;
  const totalLanded = Math.round(landedPerUnit * qty);
  const unitCost = Math.round(landedPerUnit);
  return {
    BCD: rates.BCD,
    AIDC: rates.AIDC,
    SWS: rates.SWS,
    IGST: rates.IGST,
    portCharges: rates.portCharges,
    landedPerUnit: unitCost,
    totalLanded,
    importViability:
      baseValue > 0 && unitCost / baseValue <= 1.25 ? "Viable" : "Not Viable",
  };
};
