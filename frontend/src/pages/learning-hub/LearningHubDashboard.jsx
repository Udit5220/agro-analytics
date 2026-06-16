import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, User } from 'lucide-react';
import { useLearningIntelligence } from '../../hooks/useLearningIntelligence';

// Import Layout Components
import SidebarNavigation from './components/SidebarNavigation';

// Import Views
import DashboardView from './views/DashboardView';
import CourseCatalogView from './views/CourseCatalogView';
import AiTutorView from './views/AiTutorView';
import LessonView from './views/LessonView';
import CourseQuizView from './views/CourseQuizView';
import LearningAnalyticsView from './views/LearningAnalyticsView';

export default function LearningHubDashboard() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch dynamic data for the active view
  const { data, loading, error } = useLearningIntelligence(activeView, language, selectedCourse);

  // Sync language selection
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem('language') || 'English');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const userRole = localStorage.getItem('userRole') || 'Farmer';
  const allowedRoles = ['Farmer', 'FPO', 'Research Analyst', 'Company Admin'];
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border-4 border-rose-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              The Learning Hub Module is exclusively available to Farmers, FPOs, Research Analysts, and Company Admins. Your current role (<span className="font-bold text-gray-900">{userRole}</span>) does not have clearance.
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // View Renderer
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView language={language} setActiveView={setActiveView} setSelectedCourse={setSelectedCourse} data={data} loading={loading} error={error} />;
      case 'catalog':
        return <CourseCatalogView language={language} setActiveView={setActiveView} setSelectedCourse={setSelectedCourse} data={data} loading={loading} error={error} />;
      case 'ai-tutor':
        return <AiTutorView language={language} />;
      case 'lesson':
        return <LessonView language={language} setActiveView={setActiveView} data={data} loading={loading} error={error} />;
      case 'quiz':
        return <CourseQuizView language={language} setActiveView={setActiveView} data={data} loading={loading} error={error} />;
      case 'analytics':
        return <LearningAnalyticsView language={language} data={data} loading={loading} error={error} />;
      default:
        return <CourseCatalogView language={language} setActiveView={setActiveView} setSelectedCourse={setSelectedCourse} data={data} loading={loading} error={error} />;
    }
  };

  const getDynamicTitle = () => {
    switch (activeView) {
      case 'dashboard': return language === 'Hindi' ? "सीखने का अवलोकन" : "Learning Overview";
      case 'catalog': return language === 'Hindi' ? "पाठ्यक्रम सूची" : "Course Catalog";
      case 'ai-tutor': return language === 'Hindi' ? "एआई ट्यूटर सत्र" : "AI Tutor Session";
      case 'lesson': return language === 'Hindi' ? "सक्रिय पाठ" : "Active Lesson";
      case 'quiz': return language === 'Hindi' ? "मूल्यांकन" : "Assessment";
      case 'analytics': return language === 'Hindi' ? "शिक्षण एनालिटिक्स" : "Learning Analytics";
      default: 
        return activeView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50/50 antialiased overflow-hidden font-sans">
      
      {/* Desktop Sidebar Navigation */}
      <SidebarNavigation 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedCourse(null);
        }} 
        language={language} 
        userRole={userRole}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative z-50 w-64 h-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-4">
               <SidebarNavigation 
                activeView={activeView} 
                setActiveView={(view) => {
                  setActiveView(view);
                  setSelectedCourse(null); // Reset course selection on sidebar navigation
                  setIsMobileMenuOpen(false);
                }} 
                language={language} 
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Dynamic Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-emerald-950 capitalize tracking-wide">
              {getDynamicTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Kept empty or add specific learning-hub actions here if needed */}
          </div>
        </header>

        {/* Dynamic View Rendering Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {renderView()}
        </main>
        
      </div>

    </div>
  );
}
