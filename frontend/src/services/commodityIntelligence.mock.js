/**
 * commodityIntelligence.mock.js
 * 
 * Provides deterministic mock data for advanced features in the 
 * Commodity Intelligence module that don't yet have backend APIs.
 */

// ─── KISAN MODE (FARMER) MOCKS ──────────────────────────────────────────

export const getKisanAdvisory = async (commodity, location) => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 600));

  const mocks = {
    Wheat: {
      advice: `Agle 2-3 hafte mein bhav ₹2,250–₹2,300 tak ja sakta hai. Agar aapko abhi zaroorat nahi hai toh thoda ruko.`,
      confidence: 88,
      action: 'Hold',
      news: [
        { id: 1, title: 'गेहूं के दाम में तेजी, किसानों को मिल रहा अच्छा भाव', time: '2 ghante pehle', source: 'Mandi Samachar' },
        { id: 2, title: 'MSP से ऊपर बिक रहा गेहूं, अगले हफ्ते और बढ़ोत्तरी संभव', time: '5 ghante pehle', source: 'Krishi News' }
      ]
    },
    Cotton: {
      advice: `Kapas ki aavak badhne se bhav dabav mein hai. Current price ₹58,000 ke aas-paas hai. Kuch hissa abhi bechna surakshit rahega.`,
      confidence: 76,
      action: 'Sell Partial',
      news: [
        { id: 1, title: 'कपास निर्यात में कमी से घटे भाव', time: '4 ghante pehle', source: 'Agri News' },
        { id: 2, title: 'गुजरात और महाराष्ट्र में कपास की बंपर आवक', time: '1 din pehle', source: 'Mandi Live' }
      ]
    },
    Soybean: {
      advice: `Soybean mein acchi demand dekhi ja rahi hai. Bhav ₹4,900 ke paar ja sakta hai. Agle hafte tak rukna behtar hoga.`,
      confidence: 82,
      action: 'Hold',
      news: [
        { id: 1, title: 'सोयाबीन प्लांट डिलीवरी रेट में उछाल', time: '1 ghante pehle', source: 'Oilseed Samachar' },
        { id: 2, title: 'विदेशी बाजारों में सोया तेल की मांग बढ़ी', time: '3 ghante pehle', source: 'Krishi Times' }
      ]
    }
  };

  return mocks[commodity] || {
    advice: `Bhav filhal sthir hai. Local mandi ki aavak par nazar rakhein.`,
    confidence: 65,
    action: 'Watch',
    news: [
      { id: 1, title: `${commodity} mandiyon mein aavak aamtaur par sthir`, time: '1 ghante pehle', source: 'Mandi News' }
    ]
  };
};

export const getMockMSPData = async (commodity) => {
  await new Promise(r => setTimeout(r, 400));
  const mspTable = {
    Wheat: 2015, // Using screenshot value
    Chana: 5440,
    Soybean: 4600,
    Cotton: 6620,
    Turmeric: 12000,
    Maize: 2090,
    Paddy: 2183
  };
  return mspTable[commodity] || 2000;
};

export const getBestMandis = async (commodity, location) => {
  await new Promise(r => setTimeout(r, 500));
  // Static mock based on the screenshot for Indore
  return [
    { mandi: 'Ujjain', distance: 55, price: 2240, tag: 'Best' },
    { mandi: 'Dewas', distance: 38, price: 2205, tag: '' },
    { mandi: 'Indore', distance: 8, price: 2180, tag: '' },
    { mandi: 'Sehore', distance: 72, price: 2160, tag: '' },
    { mandi: 'Ratlam', distance: 98, price: 2145, tag: '' }
  ];
};

// ─── COMMODIQ (TRADER) MOCKS ──────────────────────────────────────────

export const getTraderNewsAndAlerts = async (commodity) => {
  await new Promise(r => setTimeout(r, 700));
  
  return {
    news: [
      { id: 1, title: 'FCI ramps up wheat procurement in Punjab ahead of season peak', source: 'Mint', time: '2h ago', sentiment: 'BULLISH', sentimentValue: '+2.5%' },
      { id: 2, title: 'Govt may release buffer stock to cool domestic flour prices', source: 'ET', time: '4h ago', sentiment: 'BEARISH', sentimentValue: '-1.8%' },
      { id: 3, title: 'Rabi sowing area up 3% YoY, IMD forecasts favourable weather', source: 'Reuters', time: '6h ago', sentiment: 'BULLISH', sentimentValue: '' },
      { id: 4, title: 'Global output revised higher by USDA', source: 'Bloomberg', time: '8h ago', sentiment: 'BEARISH', sentimentValue: '-1.5%' }
    ],
    alerts: [
      { id: 1, text: `${commodity} > ₹2,200/qtl`, subtext: 'Triggered 12 min ago', status: 'active', color: 'emerald' },
      { id: 2, text: 'Chana Spread > ₹140', subtext: 'Active now', status: 'active', color: 'emerald' },
      { id: 3, text: 'Cotton < ₹58,000', subtext: 'Watching', status: 'watching', color: 'slate' }
    ],
    aiCommentary: `${commodity} outlook remains bullish near-term. Procurement demand and lower arrivals support prices above MSP. Watch for MSP-driven floor at ₹2,015. Seasonal pattern suggests entering historical accumulation window.`
  };
};

export const getPortfolioAndSignals = async () => {
  await new Promise(r => setTimeout(r, 600));

  return {
    portfolio: [
      { id: 1, commodity: 'Wheat', exchange: 'NCDEX', qty: 50, avgBuy: 2410, ltp: 2485, pnl: 3750, pnlPct: 3.1, signal: 'BUY' },
      { id: 2, commodity: 'Chana', exchange: 'MCX', qty: 30, avgBuy: 5420, ltp: 5310, pnl: -3300, pnlPct: -2.0, signal: 'SELL' },
      { id: 3, commodity: 'Soybean', exchange: 'NCDEX', qty: 40, avgBuy: 4580, ltp: 4720, pnl: 5600, pnlPct: 3.0, signal: 'BUY' },
      { id: 4, commodity: 'Cotton', exchange: 'MCX', qty: 10, avgBuy: 59200, ltp: 58400, pnl: -8000, pnlPct: -1.4, signal: 'HOLD' },
      { id: 5, commodity: 'Turmeric', exchange: 'NCDEX', qty: 25, avgBuy: 13650, ltp: 14250, pnl: 15000, pnlPct: 4.4, signal: 'BUY' }
    ],
    signals: [
      { commodity: 'Turmeric', signal: 'BUY', confidence: 'High', reasoning: 'Strong export demand & low arrivals.' },
      { commodity: 'Chana', signal: 'SELL', confidence: 'Medium', reasoning: 'Bearish on rising stock levels.' },
      { commodity: 'Cotton', signal: 'HOLD', confidence: 'Low', reasoning: 'Range-bound; await USDA report.' }
    ]
  };
};

export const getSpreadData = async () => {
  // Mock data for the Spread Calculator chart (MCX vs NCDEX spread over 6 weeks)
  return [
    { week: 'W1', spread: 110, threshold: 120 },
    { week: 'W2', spread: 115, threshold: 120 },
    { week: 'W3', spread: 125, threshold: 120 },
    { week: 'W4', spread: 140, threshold: 120 },
    { week: 'W5', spread: 145, threshold: 120 },
    { week: 'W6', spread: 160, threshold: 120 }
  ];
};
