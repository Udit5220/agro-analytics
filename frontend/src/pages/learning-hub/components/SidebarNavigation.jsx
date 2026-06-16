import React from 'react';
import { 
  LayoutDashboard, BrainCircuit, 
  Sprout, Bug, CloudRain, 
  TrendingUp, Truck, Briefcase, 
  Globe, FlaskConical, BarChart2, 
  Activity, Users, HeartPulse
} from 'lucide-react';

export default function SidebarNavigation({ activeView, setActiveView, language, userRole }) {
  const getNavItems = () => {
    const commonTop = [
      { id: 'dashboard', icon: LayoutDashboard, labelEn: 'Overview', labelHi: 'अवलोकन' }
    ];
    
    const commonBottom = [
      { id: 'ai-tutor', icon: BrainCircuit, labelEn: 'AI Tutor', labelHi: 'एआई ट्यूटर' }
    ];

    let roleSpecific = [];

    switch (userRole) {
      case 'Farmer':
        roleSpecific = [
          { id: 'crop-management', icon: Sprout, labelEn: 'Crop Management', labelHi: 'फसल प्रबंधन' },
          { id: 'pest-control', icon: Bug, labelEn: 'Pest & Disease Control', labelHi: 'कीट एवं रोग नियंत्रण' },
          { id: 'irrigation-weather', icon: CloudRain, labelEn: 'Irrigation & Weather', labelHi: 'सिंचाई और मौसम' }
        ];
        break;
      case 'FPO':
        roleSpecific = [
          { id: 'market-trends', icon: TrendingUp, labelEn: 'Market Trends', labelHi: 'बाजार के रुझान' },
          { id: 'supply-chain', icon: Truck, labelEn: 'Supply Chain', labelHi: 'आपूर्ति श्रृंखला' },
          { id: 'financial-planning', icon: Briefcase, labelEn: 'Financial Planning', labelHi: 'वित्तीय योजना' }
        ];
        break;
      case 'Research Analyst':
        roleSpecific = [
          { id: 'climate-modeling', icon: Globe, labelEn: 'Climate Modeling', labelHi: 'जलवायु मॉडलिंग' },
          { id: 'soil-biotech', icon: FlaskConical, labelEn: 'Soil Biotech', labelHi: 'मृदा बायोटेक' },
          { id: 'data-analytics', icon: BarChart2, labelEn: 'Data Analytics', labelHi: 'डेटा एनालिटिक्स' }
        ];
        break;
      case 'Company Admin':
        roleSpecific = [
          { id: 'platform-metrics', icon: Activity, labelEn: 'Platform Metrics', labelHi: 'प्लेटफ़ॉर्म मेट्रिक्स' },
          { id: 'user-management', icon: Users, labelEn: 'User Management', labelHi: 'उपयोगकर्ता प्रबंधन' },
          { id: 'system-health', icon: HeartPulse, labelEn: 'System Health', labelHi: 'सिस्टम स्वास्थ्य' }
        ];
        break;
      default:
        roleSpecific = [
          { id: 'crop-management', icon: Sprout, labelEn: 'Crop Management', labelHi: 'फसल प्रबंधन' }
        ];
    }

    return [...commonTop, ...roleSpecific, ...commonBottom];
  };

  const navItems = getNavItems();

  return (
    <div className="w-full md:w-64 bg-[#132a13] border-r border-[#31572c]/40 flex-shrink-0 min-h-screen p-4 flex flex-col hidden md:flex text-white">
      <div className="mb-8 px-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/50 py-1.5 px-3 rounded-lg inline-block border border-emerald-800/50">
          {language === 'Hindi' ? "शिक्षण मॉड्यूल" : "Learning Module"}
        </h2>
      </div>
      
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-bold ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-400 hover:bg-emerald-900/60 hover:text-emerald-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-emerald-400'}`} />
              <span>{language === 'Hindi' ? item.labelHi : item.labelEn}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto p-4 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-emerald-300 uppercase">Daily Goal</span>
          <span className="text-[10px] font-black text-emerald-400">45/60 min</span>
        </div>
        <div className="h-1.5 w-full bg-emerald-950 rounded-full overflow-hidden border border-emerald-900/50">
          <div className="h-full bg-emerald-500 rounded-full w-[75%]"></div>
        </div>
      </div>
    </div>
  );
}
