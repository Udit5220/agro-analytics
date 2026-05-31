import React from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
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
import FarmJournal from './pages/crop-recommendation/FarmJournal';
import PestDiseaseDashboard from './pages/disease-detection/PestDiseaseDashboard';
import RiskPredictionEngine from './pages/disease-detection/RiskPredictionEngine';
import RegionHeatmap from './pages/disease-detection/RegionHeatmap';
import TreatmentAdvisor from './pages/disease-detection/TreatmentAdvisor';
import CropLifecycle from './pages/disease-detection/CropLifecycle';
import HistoricalOutbreaks from './pages/disease-detection/HistoricalOutbreaks';
import AiSuggestionDashboard from './pages/ai-suggestion/AiSuggestionDashboard';
import MarketIntelligenceDashboard from './pages/market-intelligence/MarketIntelligenceDashboard';
import WeatherReservoirDashboard from './pages/weather-reservoir/WeatherReservoirDashboard';
import GovSchemesDashboard from './pages/gov-schemes/GovSchemesDashboard';
import ResearchAiDashboard from './pages/research-ai/ResearchAiDashboard';
import NewsIntelDashboard from './pages/news-intel/NewsIntelDashboard';
import MarketplaceDashboard from './pages/marketplace/MarketplaceDashboard';
import LearningHubDashboard from './pages/learning-hub/LearningHubDashboard';
import ScrollToTop from './components/utils/ScrollToTop';
import * as LucideIcons from 'lucide-react';

// Wrapper layout for the main landing page
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
  
  // Crop Recommendation module — sub-page routing
  if (moduleId === 'crop-recommendation') {
    if (subPath === 'crop-ranking') {
      return <CropRankingEngine />;
    }
    if (subPath === 'seasonal-calendar') {
      return <SeasonalCalendar />;
    }
    if (subPath === 'yield-roi') {
      return <YieldRoiPredictor />;
    }
    if (subPath === 'crop-compare') {
      return <MultiCropCompare />;
    }
    if (subPath === 'pest-risk') {
      return <PestRiskDetection />;
    }
    if (subPath === 'market-demand') {
      return <MarketDemand />;
    }
    if (subPath === 'farm-journal') {
      return <FarmJournal />;
    }
    // Default index view
    return <CropRecommendationDashboard />;
  }

  // Disease Detection module — sub-page routing
  if (moduleId === 'disease-detection') {
    if (subPath === 'risk-prediction') {
      return <RiskPredictionEngine />;
    }
    if (subPath === 'heatmap') {
      return <RegionHeatmap />;
    }
    if (subPath === 'treatment') {
      return <TreatmentAdvisor />;
    }
    if (subPath === 'lifecycle') {
      return <CropLifecycle />;
    }
    if (subPath === 'history') {
      return <HistoricalOutbreaks />;
    }
    // Default index view
    return <PestDiseaseDashboard />;
  }

  // AI Agriculture Assistant / suggestion routing
  if (moduleId === 'ai-suggestion') {
    return <AiSuggestionDashboard />;
  }

  // Commodity Market Intelligence routing
  if (moduleId === 'market-intelligence') {
    return <MarketIntelligenceDashboard />;
  }

  // Weather & Reservoir Intel routing
  if (moduleId === 'weather-reservoir') {
    return <WeatherReservoirDashboard />;
  }

  // Government Scheme Center routing
  if (moduleId === 'gov-schemes') {
    return <GovSchemesDashboard />;
  }

  // White Paper & Research AI routing
  if (moduleId === 'research-ai') {
    return <ResearchAiDashboard />;
  }

  // News Intelligence routing
  if (moduleId === 'news-intel') {
    return <NewsIntelDashboard />;
  }

  // Marketplace routing
  if (moduleId === 'marketplace') {
    return <MarketplaceDashboard />;
  }

  // Learning Hub routing
  if (moduleId === 'learning-hub') {
    return <LearningHubDashboard />;
  }

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
      <ScrollToTop />
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
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
