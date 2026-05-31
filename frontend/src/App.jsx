import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/header/Navbar';
import Home from './pages/home/Home';
import ModuleLayout from './components/layout/ModuleLayout';
import CropRecommendationDashboard from './pages/crop-recommendation/CropRecommendationDashboard';
import CropRankingEngine from './pages/crop-recommendation/CropRankingEngine';
import SeasonalCalendar from './pages/crop-recommendation/SeasonalCalendar';
import YieldRoiPredictor from './pages/crop-recommendation/YieldRoiPredictor';
import MultiCropCompare from './pages/crop-recommendation/MultiCropCompare';
import PestRiskDetection from './pages/crop-recommendation/PestRiskDetection';
import MarketDemand from './pages/crop-recommendation/MarketDemand';
import PestDiseaseDashboard from './pages/disease-detection/PestDiseaseDashboard';
import AiSuggestionDashboard from './pages/ai-suggestion/AiSuggestionDashboard';
import GovSchemesDashboard from './pages/gov-schemes/GovSchemesDashboard';
import ResearchAiDashboard from './pages/research-ai/ResearchAiDashboard';
import NewsIntelDashboard from './pages/news-intel/NewsIntelDashboard';
import LearningHubDashboard from './pages/learning-hub/LearningHubDashboard';
import * as LucideIcons from 'lucide-react';

// ─── Commodity Market Intelligence Terminal ──────────────────────────────────
import CommodityTerminalLayout from './pages/market-intelligence/CommodityTerminalLayout';
import Overview from './pages/market-intelligence/terminal/Overview';
import Watchlist from './pages/market-intelligence/terminal/Watchlist';
import SpotPrices from './pages/market-intelligence/terminal/SpotPrices';
import FuturesPrices from './pages/market-intelligence/terminal/FuturesPrices';
import AdvancedCharts from './pages/market-intelligence/terminal/AdvancedCharts';
import SpreadAnalysis from './pages/market-intelligence/terminal/SpreadAnalysis';
import MarketSignals from './pages/market-intelligence/terminal/MarketSignals';
import GlobalTradeImpact from './pages/market-intelligence/terminal/GlobalTradeImpact';
import AiCommentary from './pages/market-intelligence/terminal/AiCommentary';
import Alerts from './pages/market-intelligence/terminal/Alerts';

// ─── Weather & Reservoir Intelligence Pages ───────────────────────────────────
import WeatherDashboard from './pages/weather-reservoir/WeatherDashboard';
import SevenDayForecast from './pages/weather-reservoir/SevenDayForecast';
import RainfallForecast from './pages/weather-reservoir/RainfallForecast';
import RadarMaps from './pages/weather-reservoir/RadarMaps';
import ReservoirLevels from './pages/weather-reservoir/ReservoirLevels';
import IrrigationAdvisory from './pages/weather-reservoir/IrrigationAdvisory';
import WeatherAlerts from './pages/weather-reservoir/WeatherAlerts';

// ─── Marketplace Pages ────────────────────────────────────────────────────────
import MarketplaceDashboard from './pages/marketplace/MarketplaceDashboard';
import BrowseListings from './pages/marketplace/BrowseListings';
import SellProduce from './pages/marketplace/SellProduce';
import BuyerRequirements from './pages/marketplace/BuyerRequirements';
import BuyInputs from './pages/marketplace/BuyInputs';
import MyListings from './pages/marketplace/MyListings';
import MyOrders from './pages/marketplace/MyOrders';
import PaymentsInvoices from './pages/marketplace/PaymentsInvoices';

// Wrapper layout for the main landing page — UNCHANGED
function LandingPage() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

// Router switcher to dynamic active sub-views with interactive mock alerts
function DashboardSwitcher() {
  const { moduleId, '*': subPath } = useParams();

  // ── Crop Recommendation (existing) ─────────────────────────────────────────
  if (moduleId === 'crop-recommendation') {
    if (subPath === 'crop-ranking') return <CropRankingEngine />;
    if (subPath === 'seasonal-calendar') return <SeasonalCalendar />;
    if (subPath === 'yield-roi') return <YieldRoiPredictor />;
    if (subPath === 'crop-compare') return <MultiCropCompare />;
    if (subPath === 'pest-risk') return <PestRiskDetection />;
    if (subPath === 'market-demand') return <MarketDemand />;
    return <CropRecommendationDashboard />;
  }

  // ── Disease Detection (existing) ───────────────────────────────────────────
  if (moduleId === 'disease-detection') return <PestDiseaseDashboard />;

  // ── AI Agriculture Assistant (existing) ───────────────────────────────────
  if (moduleId === 'ai-suggestion') return <AiSuggestionDashboard />;

  // ── Commodity Market Intelligence (NEW) ────────────────────────────────────
  // Handled by specific route in App component

  // ── Weather & Reservoir Intelligence (NEW) ─────────────────────────────────
  if (moduleId === 'weather-reservoir') {
    if (subPath === 'forecast') return <SevenDayForecast />;
    if (subPath === 'rainfall') return <RainfallForecast />;
    if (subPath === 'radar') return <RadarMaps />;
    if (subPath === 'reservoirs') return <ReservoirLevels />;
    if (subPath === 'irrigation') return <IrrigationAdvisory />;
    if (subPath === 'weather-alerts') return <WeatherAlerts />;
    return <WeatherDashboard />;
  }

  // ── Government Scheme Center (existing) ───────────────────────────────────
  if (moduleId === 'gov-schemes') return <GovSchemesDashboard />;

  // ── White Paper & Research AI (existing) ──────────────────────────────────
  if (moduleId === 'research-ai') return <ResearchAiDashboard />;

  // ── News Intelligence (existing) ──────────────────────────────────────────
  if (moduleId === 'news-intel') return <NewsIntelDashboard />;

  // ── Marketplace (NEW) ─────────────────────────────────────────────────────
  if (moduleId === 'marketplace') {
    if (subPath === 'listings') return <BrowseListings />;
    if (subPath === 'sell') return <SellProduce />;
    if (subPath === 'buyer-requirements') return <BuyerRequirements />;
    if (subPath === 'buy-inputs') return <BuyInputs />;
    if (subPath === 'my-listings') return <MyListings />;
    if (subPath === 'orders') return <MyOrders />;
    if (subPath === 'invoices') return <PaymentsInvoices />;
    return <MarketplaceDashboard />;
  }

  // ── Learning Hub (existing) ───────────────────────────────────────────────
  if (moduleId === 'learning-hub') return <LearningHubDashboard />;

  const isDisease = moduleId === 'disease-detection';

  return (
    <div className="bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/25 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm mt-12 animate-fadeIn">
      <div className="h-16 w-16 mx-auto bg-brand-medium/10 text-brand-medium dark:text-brand-accent rounded-2xl flex items-center justify-center mb-6">
        {isDisease ? (
          <LucideIcons.ScanFace className="h-7 w-7 text-brand-medium dark:text-brand-accent" />
        ) : (
          <LucideIcons.Bot className="h-7 w-7 text-brand-medium dark:text-brand-accent" />
        )}
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white capitalize">
        {moduleId ? moduleId.replaceAll('-', ' ') : 'Module'} Node Active
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-md mx-auto">
        {isDisease
          ? 'AgroIndia leaf pathogen detection model is scanning the crop health database. Fungal, viral, and bacterial neural network nodes are currently active in standby.'
          : 'Llama-3 agronomist chat engine is initialized. Real-time soil micro-climate advisors and fertilizer recommendations are syncing to your mobile device.'
        }
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Active Standby</span>
        </span>
        <span className="text-xs font-bold text-slate-400">
          Last Check: Just now
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Commodity Trading Terminal (Specific Override) */}
        <Route path="/module/market-intelligence" element={<CommodityTerminalLayout />}>
          <Route index element={<Overview />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="spot" element={<SpotPrices />} />
          <Route path="futures" element={<FuturesPrices />} />
          <Route path="charts" element={<AdvancedCharts />} />
          <Route path="spreads" element={<SpreadAnalysis />} />
          <Route path="signals" element={<MarketSignals />} />
          <Route path="trade" element={<GlobalTradeImpact />} />
          <Route path="ai" element={<AiCommentary />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>

        {/* Multi-Module Routed Dashboard */}
        <Route path="/module/:moduleId" element={<ModuleLayout />}>
          <Route index element={<DashboardSwitcher />} />
          {/* Nested wildcard routes to prevent 404 on sidebar sub-paths */}
          <Route path="*" element={<DashboardSwitcher />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
