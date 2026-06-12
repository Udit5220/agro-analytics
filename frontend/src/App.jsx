import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { RoleProvider, useRole } from "./context/RoleContext";
import Navbar from "./components/header/Navbar";
import Home from "./pages/home/Home";
import ModuleLayout from "./components/layout/ModuleLayout";
import CropRecommendationDashboard from "./pages/crop-recommendation/farmer/CropRecommendationDashboard";
import CropRankingEngine from "./pages/crop-recommendation/farmer/CropRankingEngine";
import SeasonalCalendar from "./pages/crop-recommendation/farmer/SeasonalCalendar";
import YieldRoiPredictor from "./pages/crop-recommendation/farmer/YieldRoiPredictor";
import MultiCropCompare from "./pages/crop-recommendation/farmer/MultiCropCompare";
import PestRiskDetection from "./pages/crop-recommendation/farmer/PestRiskDetection";
import MarketDemand from "./pages/crop-recommendation/farmer/MarketDemand";
import FarmJournal from "./pages/crop-recommendation/farmer/FarmJournal";
import CropRotationPlanner from "./pages/crop-recommendation/farmer/CropRotationPlanner";
import WaterRequirementIntelligence from "./pages/crop-recommendation/farmer/WaterRequirementIntelligence";
import ClimateRiskSimulator from "./pages/crop-recommendation/farmer/ClimateRiskSimulator";
import FpoCropRecDashboard from "./pages/crop-recommendation/fpo/CropRecDashboard";
import PestDiseaseDashboard from "./pages/disease-detection/farmer/PestDiseaseDashboard";
import RiskPredictionEngine from "./pages/disease-detection/farmer/RiskPredictionEngine";
import RegionHeatmap from "./pages/disease-detection/farmer/RegionHeatmap";
import TreatmentAdvisor from "./pages/disease-detection/farmer/TreatmentAdvisor";
import CropLifecycle from "./pages/disease-detection/farmer/CropLifecycle";
import HistoricalOutbreaks from "./pages/disease-detection/farmer/HistoricalOutbreaks";
import LeafScanner from "./pages/disease-detection/farmer/LeafScanner";
import DiseaseAlertCenter from "./pages/disease-detection/farmer/DiseaseAlertCenter";
import {
  ExecutiveDashboard,
  OutbreakMonitoring,
  DiseaseIntelligenceMap,
  FarmerCaseManagement,
  RiskForecasting,
  TreatmentCampaignCenter,
  DiseaseAlertsAdvisories,
  ImpactAnalytics,
  HistoricalDiseaseIntelligence,
} from "./pages/disease-detection/fpo";
import AgriDiseaseCommandCenter from "./pages/disease-detection/agribusiness/AgriDiseaseCommandCenter";
import AgriRegionalIntelligence from "./pages/disease-detection/agribusiness/RegionalIntelligence";
import SupplyChainOutbreakRisk from "./pages/disease-detection/agribusiness/SupplyChainOutbreakRisk";
import ContractCropHealthMonitor from "./pages/disease-detection/agribusiness/ContractCropHealthMonitor";
import DiseaseForecasting from "./pages/disease-detection/agribusiness/DiseaseForecasting";
import ProductDemand from "./pages/disease-detection/agribusiness/ProductDemand";
import BusinessInterventions from "./pages/disease-detection/agribusiness/BusinessInterventions";
import FinancialImpact from "./pages/disease-detection/agribusiness/FinancialImpact";
import HistoricalIntelligence from "./pages/disease-detection/agribusiness/HistoricalIntelligence";

// Government Disease Detection Pages
import GovtDiseaseCommandCenter from "./pages/disease-detection/government/CommandCenter";
import DiseaseSurveillanceNetwork from "./pages/disease-detection/government/DiseaseSurveillanceNetwork";
import EarlyWarningCenter from "./pages/disease-detection/government/EarlyWarningCenter";
import FoodSecurityImpactMonitor from "./pages/disease-detection/government/FoodSecurityImpactMonitor";
import HistoricalIntelligenceRepository from "./pages/disease-detection/government/HistoricalIntelligenceRepository";
import NationalRiskMap from "./pages/disease-detection/government/NationalRiskMap";
import OutbreakResponseManagement from "./pages/disease-detection/government/OutbreakResponseManagement";
import PolicyInterventionAnalytics from "./pages/disease-detection/government/PolicyInterventionAnalytics";
import ResourceFieldOperations from "./pages/disease-detection/government/ResourceFieldOperations";
import DiseaseIntelligenceLayout from "./pages/disease-detection/admin/DiseaseIntelligenceLayout";
import AdminExecutiveDashboard from "./pages/disease-detection/admin/ExecutiveDashboard";
import GlobalDiseaseMap from "./pages/disease-detection/admin/GlobalDiseaseMap";
import CustomerRiskMonitor from "./pages/disease-detection/admin/CustomerRiskMonitor";
import ModelPerformanceCenter from "./pages/disease-detection/admin/ModelPerformanceCenter";
import AlertOperations from "./pages/disease-detection/admin/AlertOperations";
import InterventionEffectiveness from "./pages/disease-detection/admin/InterventionEffectiveness";
import PlatformImpactIntelligence from "./pages/disease-detection/admin/PlatformImpactIntelligence";
import OperationalControlCenter from "./pages/disease-detection/admin/OperationalControlCenter";
import DiseaseRepository from "./pages/disease-detection/admin/DiseaseRepository";
// import WeatherReservoirDashboard from "./pages/weather-reservoir/WeatherReservoirDashboard";
import GovSchemesDashboard from "./pages/gov-schemes/GovSchemesDashboard";
import MySchemes from "./pages/gov-schemes/farmer/MySchemes";
import BenefitsReceived from "./pages/gov-schemes/farmer/BenefitsReceived";
import AIAdvisor from "./pages/gov-schemes/farmer/AIAdvisor";
import FarmSchemeCalendar from "./pages/gov-schemes/farmer/FarmSchemeCalendar";
import FarmRegionalAnalytics from "./pages/gov-schemes/farmer/FarmRegionalAnalytics";
import FpoSchemeOverview from "./pages/gov-schemes/fpo/FpoSchemeOverview";
import FpoFarmerEnrollment from "./pages/gov-schemes/fpo/FpoFarmerEnrollment";
import FpoDisbursementIssues from "./pages/gov-schemes/fpo/FpoDisbursementIssues";
import FpoApplications from "./pages/gov-schemes/fpo/FpoApplications";
import FpoBoardReport from "./pages/gov-schemes/fpo/FpoBoardReport";
import GovGovernanceCommandCenter from "./pages/gov-schemes/gov/GovCommandCenter";
import GovSchemePerformance from "./pages/gov-schemes/gov/GovSchemePerformance";
import GovBeneficiaryCoverage from "./pages/gov-schemes/gov/GovBeneficiaryCoverage";
import GovFpoEcosystem from "./pages/gov-schemes/gov/GovFpoEcosystem";
import GovInfrastructureIntelligence from "./pages/gov-schemes/gov/GovInfrastructureIntelligence";
import GovPolicyImpact from "./pages/gov-schemes/gov/GovPolicyImpact";
import GovComplianceAudit from "./pages/gov-schemes/gov/GovComplianceAndPolicy";
import GovPolicyCommand from "./pages/gov-schemes/gov/GovPolicyCommand";

// Corporate Admin Government Schemes Pages
import AdminSchemeDiscovery from "./pages/gov-schemes/admin/AdminSchemeDiscovery";
import AdminSchemeDetail from "./pages/gov-schemes/admin/AdminSchemeDetail";
import AdminApplicationsTracker from "./pages/gov-schemes/admin/AdminApplicationsTracker";
import AdminComplianceCenter from "./pages/gov-schemes/admin/AdminComplianceCenter";
import AdminFinancialImpact from "./pages/gov-schemes/admin/AdminFinancialImpact";
import AdminCompanyProfile from "./pages/gov-schemes/admin/AdminCompanyProfile";
import AdminUserGuidance from "./pages/gov-schemes/admin/AdminUserGuidance";
import AdminAlertsCenter from "./pages/gov-schemes/admin/AdminAlertsCenter";

import ResearchAiDashboard from "./pages/research-ai/ResearchAiDashboard";
import NewsIntelDashboard from "./pages/news-intel/NewsIntelDashboard";
// import MarketplaceDashboard from "./pages/marketplace/MarketplaceDashboard";
import LearningHubDashboard from "./pages/learning-hub/LearningHubDashboard";
import ScrollToTop from "./components/utils/ScrollToTop";
import * as LucideIcons from "lucide-react";
import AiAssistant from "./pages/ai-assistant/suggestions/AiAssistant";
import CropAdvisory from "./pages/ai-assistant/suggestions/CropAdvisory";
// import DiseaseDetection from "./pages/roles/farmer/DiseaseDetection";
// import FarmerFertilizerPlanner from "./pages/roles/farmer/FertilizerPlanner";
// import IrrigationGuide from "./pages/roles/farmer/IrrigationGuide";
import SchemeFinder from "./pages/ai-assistant/suggestions/SchemeFinder";
import IrrigationScheduler from "./pages/ai-assistant/suggestions/IrrigationScheduler";
import FertilizerPlanner from "./pages/ai-assistant/suggestions/FertilizerPlanner";
import MandiPriceTracker from "./pages/ai-assistant/suggestions/MandiPriceTracker";
import LifecyclePredictor from "./pages/ai-assistant/suggestions/LifecyclePredictor";
import Profile from "./pages/home/Profile";
import AssistantDashboard from "./pages/ai-assistant/admin/Dashboard";

// ─── Commodity Market Intelligence Terminal ──────────────────────────────────
import CommodityTerminalLayout from "./pages/market-intelligence/CommodityTerminalLayout";
import Overview from "./pages/market-intelligence/terminal/Overview";
import Watchlist from "./pages/market-intelligence/terminal/Watchlist";
import SpotPrices from "./pages/market-intelligence/terminal/SpotPrices";
import FuturesPrices from "./pages/market-intelligence/terminal/FuturesPrices";
import AdvancedCharts from "./pages/market-intelligence/terminal/AdvancedCharts";
import SpreadAnalysis from "./pages/market-intelligence/terminal/SpreadAnalysis";
import MarketSignals from "./pages/market-intelligence/terminal/MarketSignals";
import GlobalTradeImpact from "./pages/market-intelligence/terminal/GlobalTradeImpact";
import AiCommentary from "./pages/market-intelligence/terminal/AiCommentary";
import Alerts from "./pages/market-intelligence/terminal/Alerts";
// ─── Commodity Market Intelligence Pages ─────────────────────────────────────
import MarketDashboard from "./pages/market-intelligence/MarketDashboard";
import LiveMandiPrices from "./pages/market-intelligence/LiveMandiPrices";
import PriceTrends from "./pages/market-intelligence/PriceTrends";
import NearbyMarkets from "./pages/market-intelligence/NearbyMarkets";
import MyWatchlist from "./pages/market-intelligence/MyWatchlist";
import PriceAlerts from "./pages/market-intelligence/PriceAlerts";

// Farmer Market Intelligence Pages
import FarmerMarketDashboard from "./pages/market-intelligence/farmer/MarketIntelligenceDashboard";
import FarmerPriceIntelligence from "./pages/market-intelligence/farmer/PriceIntelligence";
import FarmerDemandIntelligence from "./pages/market-intelligence/farmer/DemandIntelligence";
import FarmerMandiIntelligence from "./pages/market-intelligence/farmer/MandiIntelligence";
import FarmerSupplyArrival from "./pages/market-intelligence/farmer/SupplyArrivalIntelligence";
import FarmerSellingIntelligence from "./pages/market-intelligence/farmer/SellingIntelligence";
import FarmerTransportProfit from "./pages/market-intelligence/farmer/TransportProfitAnalyzer";
import FarmerCommodityWatchlist from "./pages/market-intelligence/farmer/CommodityWatchlist";
import FarmerMarketAlerts from "./pages/market-intelligence/farmer/MarketAlertsCenter";
import FarmerMarketReports from "./pages/market-intelligence/farmer/MarketReportsAnalytics";

// ─── Weather & Reservoir Intelligence Pages ───────────────────────────────────
import WeatherDashboard from "./pages/weather-reservoir/WeatherDashboard";
import SevenDayForecast from "./pages/weather-reservoir/SevenDayForecast";
import RainfallForecast from "./pages/weather-reservoir/RainfallForecast";
import RadarMaps from "./pages/weather-reservoir/RadarMaps";
import ReservoirLevels from "./pages/weather-reservoir/ReservoirLevels";
import IrrigationAdvisory from "./pages/weather-reservoir/IrrigationAdvisory";
import WeatherAlerts from "./pages/weather-reservoir/WeatherAlerts";

// ─── Marketplace Pages ────────────────────────────────────────────────────────
import MarketplaceDashboard from "./pages/marketplace/MarketplaceDashboard";
import BrowseListings from "./pages/marketplace/BrowseListings";
import SellProduce from "./pages/marketplace/SellProduce";
import BuyerRequirements from "./pages/marketplace/BuyerRequirements";
import BuyInputs from "./pages/marketplace/BuyInputs";
import MyListings from "./pages/marketplace/MyListings";
import MyOrders from "./pages/marketplace/MyOrders";
import PaymentsInvoices from "./pages/marketplace/PaymentsInvoices";

// import GovSchemesDashboard from './pages/gov-schemes/GovSchemesDashboard';
// import ResearchAiDashboard from './pages/research-ai/ResearchAiDashboard';
// import NewsIntelDashboard from './pages/news-intel/NewsIntelDashboard';
// import LearningHubDashboard from './pages/learning-hub/LearningHubDashboard';
import MandiNewsFeed from "./pages/news-intel/MandiNewsFeed";
import PolicyUpdates from "./pages/news-intel/PolicyUpdates";
import MarketImpactRatings from "./pages/news-intel/MarketImpactRatings";

import SchemeMatcher from "./pages/gov-schemes/SchemeMatcher";
import SubsidyTracker from "./pages/gov-schemes/SubsidyTracker";
import ApplicationCenter from "./pages/gov-schemes/ApplicationCenter";
import StateGrants from "./pages/gov-schemes/StateGrants";
import StateBudgetAllocation from "./pages/gov-schemes/StateBudgetAllocation";

import ResearchSummary from "./pages/research-ai/ResearchSummary";
import ResearchDrafting from "./pages/research-ai/ResearchDrafting";
import TranslationCenter from "./pages/research-ai/TranslationCenter";
import YieldPredictorModels from "./pages/research-ai/YieldPredictorModels";

import LectureHall from "./pages/learning-hub/LectureHall";
import KnowledgeBase from "./pages/learning-hub/KnowledgeBase";
import InteractiveQuizzes from "./pages/learning-hub/InteractiveQuizzes";
import ExpertWebinars from "./pages/learning-hub/ExpertWebinars";
import VirtualFarmTours from "./pages/learning-hub/VirtualFarmTours";
import AgriTechTrends from "./pages/news-intel/AgriTechTrends";
import CommodityExportTrends from "./pages/news-intel/CommodityExportTrends";
import AIChatInterface from "./pages/ai-assistant/admin/AIChatInterface";
import AIRecommendations from "./pages/ai-assistant/admin/AIRecommendations";
import PromptLibrary from "./pages/ai-assistant/admin/PromptLibrary";
import ChatHistory from "./pages/ai-assistant/admin/ChatHistory";
import SavedInsights from "./pages/ai-assistant/admin/SavedInsights";
import ReportsCenter from "./pages/ai-assistant/admin/ReportsCenter";
import AdminDashboard from "./pages/ai-assistant/admin/AdminDashboard";
import UserAnalytics from "./pages/ai-assistant/admin/UserAnalytics";
import CommunicationIntelligence from "./pages/ai-assistant/admin/CommunicationIntelligence";
import IntentAnalysis from "./pages/ai-assistant/admin/IntentAnalysis";
import SentimentAnalysis from "./pages/ai-assistant/admin/SentimentAnalysis";
import ProblemDetection from "./pages/ai-assistant/admin/ProblemDetection";
import RegionalIntelligence from "./pages/ai-assistant/admin/RegionalIntelligence";
import ModelIntelligence from "./pages/ai-assistant/admin/ModelIntelligence";
import AdvisoryIntelligence from "./pages/ai-assistant/admin/AdvisoryIntelligence";
import DiseaseIntelligence from "./pages/ai-assistant/admin/DiseaseIntelligence";
import FarmerSuccess from "./pages/ai-assistant/admin/FarmerSuccess";
import KnowledgeBaseIntelligence from "./pages/ai-assistant/admin/KnowledgeBaseIntelligence";
import CropRecPlaning from "./pages/crop-recommendation/fpo/CropRecPlaning";
import CropRecProduction from "./pages/crop-recommendation/fpo/CropRecProduction";
import CropRecDemandForecast from "./pages/crop-recommendation/fpo/CropRecDemandForecast";
import CropRecAdoptionAnalytics from "./pages/crop-recommendation/fpo/CropRecAdoptionAnalytics";
import CropRecProcurement from "./pages/crop-recommendation/fpo/CropRecProcurement";
import CropRecRiskIntelligence from "./pages/crop-recommendation/fpo/CropRecRiskIntelligence";
import CropRecBenchmarking from "./pages/crop-recommendation/fpo/CropRecBenchmarking";
import CropRecMarketLinkage from "./pages/crop-recommendation/fpo/CropRecMarketLinkage";

// Government Pages
import NationalCommandCenter from "./pages/crop-recommendation/government/NationalCommandCenter";
import FoodSecurity from "./pages/crop-recommendation/government/FoodSecurity";
import StrategicInterventionCenter from "./pages/crop-recommendation/government/StrategicInterventionCenter";
import CropIntelligence from "./pages/crop-recommendation/government/CropIntelligence";
import ClimateRisk from "./pages/crop-recommendation/government/ClimateRisk";
import WaterSecurity from "./pages/crop-recommendation/government/WaterSecurity";
import PestDiseaseMonitor from "./pages/crop-recommendation/government/PestDiseaseMonitor";
import PolicyImpactIntelligence from "./pages/crop-recommendation/government/PolicyImpactIntelligence";
import SubsidySchemeIntelligence from "./pages/crop-recommendation/government/SubsidySchemeIntelligence";
import RegionalPerformanceIntelligence from "./pages/crop-recommendation/government/RegionalPerformanceIntelligence";
import PolicySimulationLab from "./pages/crop-recommendation/government/PolicySimulationLab";

// Company Pages
import CompanySupplyCommandCenter from "./pages/crop-recommendation/company/CompanySupplyCommandCenter";
import CompanyDemandSupplyPlanning from "./pages/crop-recommendation/company/CompanyDemandSupplyPlanning";
import CompanyContractFarming from "./pages/crop-recommendation/company/CompanyContractFarming";
import CompanyYieldForecast from "./pages/crop-recommendation/company/CompanyYieldForecast";
import CompanyCommodityOpportunity from "./pages/crop-recommendation/company/CompanyCommodityOpportunity";
import CompanyRegionalExpansion from "./pages/crop-recommendation/company/CompanyRegionalExpansion";
import CompanySupplyChainPerformance from "./pages/crop-recommendation/company/CompanySupplyChainPerformance";
import CompanyProcurementInventory from "./pages/crop-recommendation/company/CompanyProcurementInventory";
import CompanyMarketExpansion from "./pages/crop-recommendation/company/CompanyMarketExpansion";
import GovCommandCenter from "./pages/gov-schemes/gov/GovCommandCenter";
import GovBudgetAndSpending from "./pages/gov-schemes/gov/GovBudgetAndSpending";
import GovComplianceAndPolicy from "./pages/gov-schemes/gov/GovComplianceAndPolicy";
import GovApplicationPipeline from "./pages/gov-schemes/gov/GovApplicationPipeline";
// import FarmDiscovery from "./pages/gov-schemes/farmer/FarmDiscovery";

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
  const { moduleId, "*": subPath } = useParams();
  const { activeRole, switchRole } = useRole();
  console.log("ROUTE DBG:", { moduleId, subPath, activeRole });

  React.useEffect(() => {
    if (moduleId === "market-intelligence" && subPath?.startsWith("farmer/") && activeRole !== "farmer") {
      switchRole("farmer");
    }
  }, [moduleId, subPath, activeRole, switchRole]);

  if (moduleId === "profile") {
    return <Profile />;
  }

  // Crop Recommendation modules — sub-page routing based on role
  if (moduleId === "crop-recommendation") {
    if (activeRole === "farmer") {
      if (subPath === "crop-ranking") {
        return <CropRankingEngine />;
      }
      if (subPath === "seasonal-calendar") {
        return <SeasonalCalendar />;
      }
      if (subPath === "yield-roi") {
        return <YieldRoiPredictor />;
      }
      if (subPath === "crop-compare") {
        return <MultiCropCompare />;
      }
      if (subPath === "pest-risk") {
        return <PestRiskDetection />;
      }
      if (subPath === "market-demand") {
        return <MarketDemand />;
      }
      if (subPath === "farm-journal") {
        return <FarmJournal />;
      }
      if (subPath === "crop-rotation") {
        return <CropRotationPlanner />;
      }
      if (subPath === "water-intelligence") {
        return <WaterRequirementIntelligence />;
      }
      if (subPath === "climate-risk") {
        return <ClimateRiskSimulator />;
      }
      // Default index view for farmer
      return <CropRecommendationDashboard />;
    } else if (activeRole === "government") {
      if (subPath === "food-security") return <FoodSecurity />;
      if (subPath === "strategic-intervention")
        return <StrategicInterventionCenter />;
      if (subPath === "crop-intelligence") return <CropIntelligence />;
      if (subPath === "climate-risk") return <ClimateRisk />;
      if (subPath === "water-security") return <WaterSecurity />;
      if (subPath === "pest-disease") return <PestDiseaseMonitor />;
      if (subPath === "policy-impact") return <PolicyImpactIntelligence />;
      if (subPath === "subsidy-intelligence")
        return <SubsidySchemeIntelligence />;
      if (subPath === "regional-performance")
        return <RegionalPerformanceIntelligence />;
      if (subPath === "policy-sim") return <PolicySimulationLab />;
      return <NationalCommandCenter />;
    } else if (activeRole === "company" || activeRole === "admin") {
      if (subPath === "demand-supply") return <CompanyDemandSupplyPlanning />;
      if (subPath === "contract-farming") return <CompanyContractFarming />;
      if (subPath === "yield-forecast") return <CompanyYieldForecast />;
      if (subPath === "commodity-opportunity")
        return <CompanyCommodityOpportunity />;
      if (subPath === "regional-suitability")
        return <CompanyRegionalExpansion />;
      if (subPath === "supply-chain-performance")
        return <CompanySupplyChainPerformance />;
      if (subPath === "procurement-inventory")
        return <CompanyProcurementInventory />;
      if (subPath === "market-expansion") return <CompanyMarketExpansion />;
      return <CompanySupplyCommandCenter />;
    } else {
      if (subPath === "crop-planning") {
        return <CropRecPlaning />;
      }
      if (subPath === "forecast-center") {
        return <CropRecProduction />;
      }
      if (subPath === "demand-forecast") {
        return <CropRecDemandForecast />;
      }
      if (subPath === "adoption-analytics") {
        return <CropRecAdoptionAnalytics />;
      }
      if (subPath === "procurement") {
        return <CropRecProcurement />;
      }
      if (subPath === "risk-intelligence") {
        return <CropRecRiskIntelligence />;
      }
      if (subPath === "benchmarking") {
        return <CropRecBenchmarking />;
      }
      if (subPath === "market-linkage") {
        return <CropRecMarketLinkage />;
      }
      return <FpoCropRecDashboard />;
    }
  }

  // Disease Detection module — sub-page routing
  if (moduleId === "disease-detection") {
    if (activeRole === "farmer") {
      if (subPath === "leaf-scanner") {
        return <LeafScanner />;
      }
      if (subPath === "risk-prediction") {
        return <RiskPredictionEngine />;
      }
      if (subPath === "heatmap") {
        return <RegionHeatmap />;
      }
      if (subPath === "treatment") {
        return <TreatmentAdvisor />;
      }
      if (subPath === "lifecycle") {
        return <CropLifecycle />;
      }
      if (subPath === "history") {
        return <HistoricalOutbreaks />;
      }
      if (subPath === "alerts") {
        return <DiseaseAlertCenter />;
      }
      // Default index view
      return <PestDiseaseDashboard />;
    } else if (activeRole === "company" || activeRole === "admin") {
      if (subPath === "dashboard") return <AdminExecutiveDashboard />;
      if (subPath === "global-intelligence") return <GlobalDiseaseMap />;
      if (subPath === "customer-risk") return <CustomerRiskMonitor />;
      if (subPath === "model-performance") return <ModelPerformanceCenter />;
      if (subPath === "alerts") return <AlertOperations />;
      if (subPath === "interventions") return <InterventionEffectiveness />;
      if (subPath === "platform-impact") return <PlatformImpactIntelligence />;
      if (subPath === "operations") return <OperationalControlCenter />;
      if (subPath === "repository") return <DiseaseRepository />;

      // Fallbacks
      if (subPath === "regional-intelligence")
        return <AgriRegionalIntelligence />;
      if (subPath === "supply-chain-risk") return <SupplyChainOutbreakRisk />;
      if (subPath === "contract-farming") return <ContractCropHealthMonitor />;
      if (subPath === "forecasting") return <DiseaseForecasting />;
      if (subPath === "product-demand") return <ProductDemand />;
      if (subPath === "interventions-old") return <BusinessInterventions />;
      if (subPath === "financial-impact") return <FinancialImpact />;
      if (subPath === "history") return <HistoricalIntelligence />;
      return <AdminExecutiveDashboard />;
    } else if (activeRole === "government") {
      if (subPath === "surveillance") return <DiseaseSurveillanceNetwork />;
      if (subPath === "early-warning") return <EarlyWarningCenter />;
      if (subPath === "food-security") return <FoodSecurityImpactMonitor />;
      if (subPath === "risk-map") return <NationalRiskMap />;
      if (subPath === "outbreak-response")
        return <OutbreakResponseManagement />;
      if (subPath === "policy-interventions")
        return <PolicyInterventionAnalytics />;
      if (subPath === "field-operations") return <ResourceFieldOperations />;
      if (subPath === "history") return <HistoricalIntelligenceRepository />;
      return <GovtDiseaseCommandCenter />;
    } else {
      if (subPath === "outbreaks") return <OutbreakMonitoring />;
      if (subPath === "map") return <DiseaseIntelligenceMap />;
      if (subPath === "cases") return <FarmerCaseManagement />;
      if (subPath === "predictions") return <RiskForecasting />;
      if (subPath === "campaigns") return <TreatmentCampaignCenter />;
      if (subPath === "alerts") return <DiseaseAlertsAdvisories />;
      if (subPath === "analytics") return <ImpactAnalytics />;
      if (subPath === "history") return <HistoricalDiseaseIntelligence />;
      return <ExecutiveDashboard />;
    }
  }

  // AI Agriculture Assistant / suggestion routing
  if (moduleId === "ai-suggestion") {
    if (activeRole === "farmer") {
      if (subPath === "crop-advisory") {
        return <CropAdvisory />;
      }
      // if (subPath === "disease") {
      //   return <DiseaseDetection />;
      // }
      if (subPath === "disease") {
        return <LeafScanner />;
      }
      if (subPath === "fertilizer-plan" || subPath === "fertilizer") {
        return <FertilizerPlanner />;
      }
      if (subPath === "irrigation-guide" || subPath === "irrigation") {
        return <IrrigationScheduler />;
      }
      if (subPath === "scheme-finder") {
        return <SchemeFinder />;
      }
      return <AiAssistant />;
    }

    if (subPath === "irrigation") {
      return <IrrigationScheduler />;
    }
    if (subPath === "fertilizer") {
      return <FertilizerPlanner />;
    }
    if (subPath === "mandi-tracker") {
      return <MandiPriceTracker />;
    }
    if (subPath === "lifecycle") {
      return <LifecyclePredictor />;
    }
    return <AiAssistant />;
  }

  // AI Assistant 1 routing
  if (moduleId === "ai-assistant-1") {
    if (activeRole === "admin" || activeRole === "company") {
      if (subPath === "" || subPath === "executive-dashboard") {
        return <AdminDashboard />;
      }
      if (subPath === "user-analytics") {
        return <UserAnalytics />;
      }
      if (subPath === "conversation-intelligence") {
        return <CommunicationIntelligence />;
      }
      if (subPath === "intent-analysis") {
        return <IntentAnalysis />;
      }
      if (subPath === "sentiment-analysis") {
        return <SentimentAnalysis />;
      }
      if (subPath === "problem-detection") {
        return <ProblemDetection />;
      }
      if (subPath === "regional-intelligence") {
        return <RegionalIntelligence />;
      }
      if (subPath === "model-intelligence") {
        return <ModelIntelligence />;
      }
      if (subPath === "advisory-intelligence") {
        return <AdvisoryIntelligence />;
      }
      if (subPath === "disease-intelligence") {
        return <DiseaseIntelligence />;
      }
      if (subPath === "farmer-success") {
        return <FarmerSuccess />;
      }
      if (subPath === "knowledge-base-intelligence") {
        return <KnowledgeBaseIntelligence />;
      }
      return <AdminDashboard />;
    }

    if (subPath === "chat-workspace") {
      return <AIChatInterface />;
    }
    if (subPath === "prompt-library") {
      return <PromptLibrary />;
    }
    if (subPath === "recommendation" || subPath === "recommendations") {
      return <AIRecommendations />;
    }
    if (subPath === "chat-history") {
      return <ChatHistory />;
    }
    if (subPath === "saved-insight" || subPath === "saved-insights") {
      return <SavedInsights />;
    }
    if (subPath === "report-center" || subPath === "reports-center") {
      return <ReportsCenter />;
    }
    return <AssistantDashboard />;
  }

  // ── Commodity Market Intelligence (NEW) ────────────────────────────────────
  if (moduleId === "market-intelligence") {
    if (activeRole === "farmer" || subPath?.startsWith("farmer/")) {
      if (subPath === "farmer/dashboard" || !subPath || subPath === "farmer") return <FarmerMarketDashboard />;
      if (subPath === "farmer/price-intelligence") return <FarmerPriceIntelligence />;
      if (subPath === "farmer/demand-intelligence") return <FarmerDemandIntelligence />;
      if (subPath === "farmer/mandi-intelligence") return <FarmerMandiIntelligence />;
      if (subPath === "farmer/supply-arrival") return <FarmerSupplyArrival />;
      if (subPath === "farmer/selling-intelligence") return <FarmerSellingIntelligence />;
      if (subPath === "farmer/transport-profit") return <FarmerTransportProfit />;
      if (subPath === "farmer/watchlist") return <FarmerCommodityWatchlist />;
      if (subPath === "farmer/alerts") return <FarmerMarketAlerts />;
      if (subPath === "farmer/reports") return <FarmerMarketReports />;
      return <FarmerMarketDashboard />;
    } else {
      if (subPath === "live-prices") return <LiveMandiPrices />;
      if (subPath === "price-trends") return <PriceTrends />;
      if (subPath === "nearby-markets") return <NearbyMarkets />;
      if (subPath === "watchlist") return <MyWatchlist />;
      if (subPath === "price-alerts") return <PriceAlerts />;
      return <MarketDashboard />;
    }
  }

  // ── Weather & Reservoir Intelligence (NEW) ─────────────────────────────────
  if (moduleId === "weather-reservoir") {
    if (subPath === "forecast") return <SevenDayForecast />;
    if (subPath === "rainfall") return <RainfallForecast />;
    if (subPath === "radar") return <RadarMaps />;
    if (subPath === "reservoirs") return <ReservoirLevels />;
    if (subPath === "irrigation") return <IrrigationAdvisory />;
    if (subPath === "weather-alerts") return <WeatherAlerts />;
    return <WeatherDashboard />;
  }

  // ── Government Scheme Center (existing) ───────────────────────────────────
  if (moduleId === "gov-schemes") {
    if (activeRole === "admin" || activeRole === "company") {
      if (subPath === "admin") return <AdminSchemeDiscovery />;
      if (subPath === "admin/tracker") return <AdminApplicationsTracker />;
      if (subPath === "admin/compliance") return <AdminComplianceCenter />;
      if (subPath === "admin/financial-impact") return <AdminFinancialImpact />;
      if (subPath === "admin/profile") return <AdminCompanyProfile />;
      if (subPath === "admin/user-guidance") return <AdminUserGuidance />;
      if (subPath === "admin/alerts") return <AdminAlertsCenter />;
      if (subPath === "admin/detail" || (subPath && subPath.startsWith("admin/detail/"))) return <AdminSchemeDetail />;
      return <Navigate to="/module/gov-schemes/admin" replace />;
    }
    if (activeRole === "farmer") {
      if (subPath === "benefits") return <BenefitsReceived />;
      if (subPath === "advisor") return <AIAdvisor />;
      if (subPath === "calendar") return <FarmSchemeCalendar />;
      if (subPath === "analytics") return <FarmRegionalAnalytics />;
      return <MySchemes />;
    }
    if (activeRole === "fpo_manager" || activeRole === "fpo") {
      if (subPath === "enrollment") return <FpoFarmerEnrollment />;
      if (subPath === "disbursement") return <FpoDisbursementIssues />;
      if (subPath === "applications") return <FpoApplications />;
      if (subPath === "board-report") return <FpoBoardReport />;
      return <FpoSchemeOverview />;
    }
    if (activeRole === "government") {
      if (subPath === "gov-command-center") return <GovCommandCenter />;
      if (subPath === "scheme-performance") return <GovSchemePerformance />;
      if (subPath === "beneficiary-coverage") return <GovBeneficiaryCoverage />;
      if (subPath === "budget") return <GovBudgetAndSpending />;
      if (subPath === "pipeline") return <GovApplicationPipeline />;
      if (subPath === "compliance-policy") return <GovComplianceAndPolicy />;
      return <GovCommandCenter />;
    }
    if (subPath === "matchi") return <SchemeMatcher />;
    if (subPath === "subsidies") return <SubsidyTracker />;
    if (subPath === "applications") return <ApplicationCenter />;
    if (subPath === "state-grants") return <StateGrants />;
    if (subPath === "budget") return <StateBudgetAllocation />;
    return <GovSchemesDashboard />;
  }
  // ── White Paper & Research AI (existing) ──────────────────────────────────
  if (moduleId === "research-ai") {
    if (subPath === "summary") return <ResearchSummary />;
    if (subPath === "drafting") return <ResearchDrafting />;
    if (subPath === "translate") return <TranslationCenter />;
    if (subPath === "models") return <YieldPredictorModels />;
    return <ResearchAiDashboard />;
  }
  if (moduleId === "news-intel") {
    if (subPath === "mandi") return <MandiNewsFeed />;
    if (subPath === "policies") return <PolicyUpdates />;
    if (subPath === "impact") return <MarketImpactRatings />;
    if (subPath === "agritech") return <AgriTechTrends />;
    if (subPath === "exports") return <CommodityExportTrends />;
    return <NewsIntelDashboard />;
  }
  // ── Marketplace (NEW) ─────────────────────────────────────────────────────
  if (moduleId === "marketplace") {
    if (subPath === "listings") return <BrowseListings />;
    if (subPath === "sell") return <SellProduce />;
    if (subPath === "buyer-requirements") return <BuyerRequirements />;
    if (subPath === "buy-inputs") return <BuyInputs />;
    if (subPath === "my-listings") return <MyListings />;
    if (subPath === "orders") return <MyOrders />;
    if (subPath === "invoices") return <PaymentsInvoices />;
    return <MarketplaceDashboard />;
  }

  // Learning Hub routing
  if (moduleId === "learning-hub") {
    if (subPath === "lectures") return <LectureHall />;
    if (subPath === "kb") return <KnowledgeBase />;
    if (subPath === "quizzes") return <InteractiveQuizzes />;
    if (subPath === "webinars") return <ExpertWebinars />;
    if (subPath === "tours") return <VirtualFarmTours />;
    return <LearningHubDashboard />;
  }

  const isDisease = moduleId === "disease-detection";

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
        {moduleId ? moduleId.replaceAll("-", " ") : "Module"} Node Active
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-md mx-auto">
        {isDisease
          ? "AgroIndia leaf pathogen detection model is scanning the crop health database. Fungal, viral, and bacterial neural network nodes are currently active in standby."
          : "Llama-3 agronomist chat engine is initialized. Real-time soil micro-climate advisors and fertilizer recommendations are syncing to your mobile device."}
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
    <RoleProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Commodity Trading Terminal (Specific Override) */}
          <Route
            path="/module/market-intelligence"
            element={<CommodityTerminalLayout />}
          >
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

          {/* Disease Intelligence Admin (Specific Override) */}
          <Route
            path="/company/disease-intelligence"
            element={<DiseaseIntelligenceLayout />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminExecutiveDashboard />} />
            <Route path="global-intelligence" element={<GlobalDiseaseMap />} />
            <Route path="customer-risk" element={<CustomerRiskMonitor />} />
            <Route
              path="model-performance"
              element={<ModelPerformanceCenter />}
            />
            <Route path="alerts" element={<AlertOperations />} />
            <Route
              path="interventions"
              element={<InterventionEffectiveness />}
            />
            <Route
              path="platform-impact"
              element={<PlatformImpactIntelligence />}
            />
            <Route path="operations" element={<OperationalControlCenter />} />
            <Route path="repository" element={<DiseaseRepository />} />
          </Route>

          {/* Multi-Module Routed Dashboard */}
          <Route path="/module/:moduleId" element={<ModuleLayout />}>
            <Route index element={<DashboardSwitcher />} />
            {/* Nested wildcard routes to prevent 404 on sidebar sub-paths */}
            <Route path="*" element={<DashboardSwitcher />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
