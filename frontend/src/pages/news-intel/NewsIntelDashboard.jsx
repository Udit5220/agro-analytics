import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Loader2, AlertCircle } from 'lucide-react';
import { dashboardContent } from '../../content/dashboardContent';
import { useAITranslation } from '../../hooks/useAITranslation';
import { statesAndCities } from '../../utils/statesAndCities';
import FarmerNewsView from './FarmerNewsView';
import FPONewsView from './FPONewsView';
import TraderNewsView from './TraderNewsView';
import ProcurementNewsView from './ProcurementNewsView';
import AgribusinessNewsView from './AgribusinessNewsView';
import ResearcherNewsView from './ResearcherNewsView';
import GovNewsView from './GovNewsView';
import AdminNewsView from './AdminNewsView';

export default function NewsIntelDashboard({ subPath }) {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(localStorage.getItem('userRole') || 'Farmer');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'English');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // Initialize selected state & city from localStorage (defaults to India)
  const [selectedState, setSelectedState] = useState(localStorage.getItem('news_selected_state') || 'India');
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('news_selected_city') || '');

  // Derive cities list for the selected state
  const stateData = statesAndCities.find(s => s.state === selectedState);
  const availableCities = stateData ? stateData.cities : [];

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    if (stateName === 'India') {
      setSelectedCity('');
      localStorage.setItem('news_selected_state', 'India');
      localStorage.setItem('news_selected_city', '');
      localStorage.setItem('news_selected_location', 'India');
      window.location.reload();
    } else {
      setSelectedCity(''); // Reset city selection so user must explicitly choose one
      localStorage.setItem('news_selected_state', stateName);
      // Remove selected city & location from localStorage until the city is selected
      localStorage.removeItem('news_selected_city');
      localStorage.removeItem('news_selected_location');
    }
  };

  const handleCityChange = (cityName) => {
    if (cityName) {
      setSelectedCity(cityName);
      localStorage.setItem('news_selected_city', cityName);
      localStorage.setItem('news_selected_location', `${cityName}, ${selectedState}`);
      // Page reloads only when both state and city are selected
      window.location.reload();
    }
  };

  // Determine the dynamic page title based on the active subPath
  const currentMenu = menuItems.find(m => m.path === (subPath || ''));
  const pageTitle = currentMenu ? currentMenu.label : (subPath ? subPath.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'News Intelligence Module');

  const uiStrings = React.useMemo(() => [
    pageTitle,
    `${activeRole} Dashboard View • Real-time AI-Synthesized Feed`,
    'Aggregating News Feeds...',
    'News Intelligence Module',
    'Failed to fetch news intelligence data'
  ], [pageTitle, activeRole]);

  const { t } = useAITranslation(uiStrings);

  useEffect(() => {
    // Sync with local storage just in case it changes
    const role = localStorage.getItem('userRole') || 'Farmer';
    const lang = localStorage.getItem('language') || 'English';
    setActiveRole(role);
    setLanguage(lang);

    // Sync state/city selectors from localStorage
    const storedState = localStorage.getItem('news_selected_state') || 'India';
    const storedCity = localStorage.getItem('news_selected_city') || '';
    setSelectedState(storedState);
    setSelectedCity(storedCity);

    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/news/sidebar-menu', {
          headers: {
            'x-user-role': role,
            'x-language': lang
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.menu)) {
            setMenuItems(json.menu);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenu();

    // Redirect to default path if the root module is accessed and the role requires a specific path
    const getValidPaths = (r) => {
        switch (r) {
            case 'Farmer': return ['mandi-insights', 'weather-safety', 'agri-tech', 'financial-credit', 'scheme-news'];
            case 'FPO': return ['', 'b2b-market', 'input-procurement', 'logistics', 'compliance-grants'];
            case 'Commodity Trader': return ['', 'mandi-arbitrage', 'supply-risk', 'export-policy', 'institutional-flow'];
            case 'Procurement Manager': return ['', 'risk', 'vendor-negotiations', 'quality-assaying', 'logistics-routing'];
            case 'Agribusiness Manager': return ['', 'competitor-intel', 'supply-chain', 'retail-demand', 'm-and-a'];
            case 'Research Analyst': return ['', 'climate-modeling', 'bio-tech', 'soil-microbiome', 'policy-economics'];
            case 'Government Official': return ['', 'relief', 'sentiment', 'food-security', 'infrastructure'];
            case 'Company Admin': return ['', 'api-health', 'user-access', 'security'];
            default: return [''];
        }
    };

    const validPaths = getValidPaths(role);
    const currentSubPath = subPath || '';

    if (!validPaths.includes(currentSubPath)) {
      const targetPath = validPaths[0] ? `/module/news-intel/${validPaths[0]}` : '/module/news-intel';
      navigate(targetPath, { replace: true });
      return;
    }

    const fetchDashboardData = async () => {
      // If state is not India, both state and city must be selected
      if (selectedState !== 'India' && (!selectedState || !selectedCity)) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const userLoc = selectedState === 'India' ? 'India' : (localStorage.getItem('news_selected_location') || `${selectedCity}, ${selectedState}`);
        const locationQuery = `location=${encodeURIComponent(userLoc)}&t=${Date.now()}`;
        const queryParams = subPath ? `?subPath=${subPath}&${locationQuery}` : `?${locationQuery}`;
        const res = await fetch(`http://localhost:5000/api/news/dashboard${queryParams}`, {
          headers: {
            'x-user-role': role,
            'x-language': lang,
            'x-user-location': userLoc,
            'x-user-crops': 'Wheat, Mustard',
            'x-user-crop-stage': 'Sowing Phase',
            'x-user-farm-size': '2.5 Acres'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch news intelligence data');
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeRole, language, subPath, selectedState, selectedCity]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <h3 className="text-emerald-600 font-medium">{t("Aggregating News Feeds...")}</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <p className="font-bold">{t(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* 1. Page Header & Hero Banner */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mt-1 shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-900">{t(pageTitle)}</h1>
            </div>
            <p className="text-sm text-emerald-500 mt-2 max-w-xl">
              {t(`${activeRole} Dashboard View • Real-time AI-Synthesized Feed`)}
            </p>
          </div>
        </div>

        {/* State & City Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {language === 'Hindi' ? "स्तर / राज्य" : "Level / State"}
            </span>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="text-sm font-semibold text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-colors cursor-pointer w-full sm:w-[160px]"
            >
              <option value="India">
                {language === 'Hindi' ? "भारत (राष्ट्रीय)" : "India (National)"}
              </option>
              {statesAndCities.map((item) => (
                <option key={item.state} value={item.state}>
                  {language === 'Hindi' ? item.stateHi : item.state}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              {language === 'Hindi' ? "शहर" : "City"}
            </span>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={selectedState === 'India'}
              className="text-sm font-semibold text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-colors cursor-pointer w-full sm:w-[160px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {selectedState === 'India' ? (
                <option value="">
                  {language === 'Hindi' ? "अखिल भारतीय" : "All India"}
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    {language === 'Hindi' ? "शहर चुनें" : "Select City"}
                  </option>
                  {availableCities.map((cityObj) => (
                    <option key={cityObj.en} value={cityObj.en}>
                      {language === 'Hindi' ? cityObj.hi : cityObj.en}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Role-Based Canvas */}
      <div className="mt-8">
        {activeRole === 'Farmer' && <FarmerNewsView data={data} subPath={subPath} />}
        {activeRole === 'FPO' && <FPONewsView data={data} subPath={subPath} />}
        {activeRole === 'Commodity Trader' && <TraderNewsView data={data} subPath={subPath} />}
        {activeRole === 'Procurement Manager' && <ProcurementNewsView data={data} subPath={subPath} />}
        {activeRole === 'Agribusiness Manager' && <AgribusinessNewsView data={data} subPath={subPath} />}
        {activeRole === 'Research Analyst' && <ResearcherNewsView data={data} subPath={subPath} />}
        {activeRole === 'Government Official' && <GovNewsView data={data} subPath={subPath} />}
        {activeRole === 'Company Admin' && <AdminNewsView data={data} subPath={subPath} />}
      </div>
    </div>
  );
}
