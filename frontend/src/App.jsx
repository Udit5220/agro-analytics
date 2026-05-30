import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/header/Navbar';
import Home from './pages/home/Home';
import ModuleLayout from './components/layout/ModuleLayout';
import CropRecommendationDashboard from './pages/crop-recommendation/CropRecommendationDashboard';
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
  const { moduleId } = useParams();
  
  if (moduleId === 'crop-recommendation') {
    return <CropRecommendationDashboard />;
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
          ? 'AgroSense leaf pathogen detection model is scanning the crop health database. Fungal, viral, and bacterial neural network nodes are currently active in standby.'
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
