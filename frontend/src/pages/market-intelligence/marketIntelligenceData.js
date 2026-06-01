export const MSP_REFERENCE = {
  Wheat: 2325,
  Chana: 5250,
  Cotton: 5800,
  Soybean: 4825,
  Mustard: 5300,
  Turmeric: 7025,
  Onion: 2225,
  Maize: 1950,
  Paddy: 1960,
  Sugar: 3700,
};

export const PROCUREMENT_INSIGHTS = [
  {
    commodity: "Wheat",
    marketPrice: 2480,
    procurementPrice: 2425,
    status: "Saving",
    supplier: "Agro Procure Pvt. Ltd.",
    outlook: "Stable to firm",
    risk: "Medium",
  },
  {
    commodity: "Soybean",
    marketPrice: 4920,
    procurementPrice: 5050,
    status: "Overpaying",
    supplier: "Central Oilseed Co.",
    outlook: "Bearish",
    risk: "High",
  },
  {
    commodity: "Chana",
    marketPrice: 5380,
    procurementPrice: 5250,
    status: "Saving",
    supplier: "Pulses Trade Corp.",
    outlook: "Firm",
    risk: "Low",
  },
];

export const TRADE_INTELLIGENCE = [
  {
    commodity: "Rice",
    signal: "Export Friendly",
    fobBenchmark: 37500,
    landedCost: 38300,
    country: "Bangladesh",
    status: "Positive",
  },
  {
    commodity: "Palm Oil",
    signal: "Import Pressure",
    fobBenchmark: 9100,
    landedCost: 9450,
    country: "Malaysia",
    status: "Caution",
  },
  {
    commodity: "Cotton",
    signal: "Policy Risk",
    fobBenchmark: 6500,
    landedCost: 6675,
    country: "Vietnam",
    status: "Watch",
  },
];

export const POLICY_ALERTS = [
  {
    id: "policy-1",
    type: "MSP Announcement",
    commodity: "Wheat",
    impact: "Bullish",
    reason: "Government retains MSP, supporting farmer margins.",
    time: "2h ago",
    severity: "high",
  },
  {
    id: "policy-2",
    type: "Import Duty Change",
    commodity: "Palm Oil",
    impact: "Bearish",
    reason: "Lowered duty makes imports more attractive.",
    time: "4h ago",
    severity: "medium",
  },
  {
    id: "policy-3",
    type: "Export Quota Alert",
    commodity: "Chana",
    impact: "Neutral",
    reason: "Export quota under review; monitor availability.",
    time: "1d ago",
    severity: "medium",
  },
];

export const BENCHMARK_PARITY = [
  {
    commodity: "Cotton",
    indiaPrice: 6600,
    globalBenchmark: 6450,
    premiumDiscount: "+2.3%",
    signal: "Export Parity",
  },
  {
    commodity: "Palm Oil",
    indiaPrice: 9300,
    globalBenchmark: 9200,
    premiumDiscount: "+1.1%",
    signal: "Neutral",
  },
  {
    commodity: "Chana",
    indiaPrice: 5380,
    globalBenchmark: 5250,
    premiumDiscount: "+2.4%",
    signal: "Export Friendly",
  },
];

export const DUTY_RATES = {
  default: {
    BCD: 10,
    AIDC: 7.5,
    SWS: 2.5,
    IGST: 5,
    portCharges: 3.2,
  },
  1006: {
    // Rice
    BCD: 30,
    AIDC: 15,
    SWS: 4,
    IGST: 5,
    portCharges: 3.0,
  },
  1511: {
    // Palm oil
    BCD: 2.5,
    AIDC: 7.5,
    SWS: 2.5,
    IGST: 5,
    portCharges: 3.2,
  },
  1207: {
    // Cotton
    BCD: 10,
    AIDC: 8,
    SWS: 2.5,
    IGST: 5,
    portCharges: 3.5,
  },
};

export const QUICK_ACTIONS = [
  {
    label: "Compare Crops",
    sub: "Multi-crop trend analysis",
    icon: "GitCompare",
    path: "commodity-compare",
  },
  {
    label: "Set Price Alert",
    sub: "Notify on price movement",
    icon: "Bell",
    path: "price-alerts",
  },
  {
    label: "My Watchlist",
    sub: "Track crops you care about",
    icon: "Bookmark",
    path: "watchlist",
  },
  {
    label: "Sell on Marketplace",
    sub: "List your produce for buyers",
    icon: "Store",
    path: "/module/marketplace/sell",
    external: true,
  },
  {
    label: "Check MSP",
    sub: "Compare market vs MSP",
    icon: "Award",
    path: "commodity-compare",
  },
  {
    label: "Calculate Import Cost",
    sub: "Import parity calculator",
    icon: "Calculator",
    path: "commodity-compare",
  },
  {
    label: "Export Opportunity",
    sub: "Trade flow signals",
    icon: "Briefcase",
    path: "commodity-compare",
  },
  {
    label: "Ask AI Advisor",
    sub: "Market signal briefing",
    icon: "Zap",
    path: "commodity-compare",
  },
];
