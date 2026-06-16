import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, BarChart2, Briefcase, 
  Target, Globe, Navigation, Layers, CheckCircle2, ShieldAlert
} from 'lucide-react';

// Common header component
const PageHeader = ({ title, description, icon: Icon, colorClass }) => (
  <div className="flex items-center gap-3 mb-8 animate-fadeIn">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

// B. Commercial Trend Discovery (Industry Reports)
export const CommercialTrendDiscovery = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/agribusiness/industry-trends', {
          headers: { 'x-user-role': 'Agribusiness Manager' }
        });
        if (res.ok) {
          const json = await res.json();
          setTrends(json.trends || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <PageHeader 
        title="Commercial Trend Discovery" 
        description="Market-ready technological innovations and corporate ROI focus derived from recent industry reports."
        icon={TrendingUp}
        colorClass="bg-emerald-50 text-emerald-600"
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Latest Market Intelligence</h3>
        
        {loading ? (
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Analyzing reports...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map((trend, i) => (
              <div key={i} className="group bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mt-1 mb-3">{trend.reportTitle}</h4>
                
                <div className="flex gap-2 mb-3">
                  <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-[10px] font-bold text-emerald-700 flex gap-1.5 items-center flex-1">
                    <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> <span className="truncate">{trend.projectedROI}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border text-[10px] font-bold flex items-center justify-center shrink-0 min-w-[70px] ${trend.investmentRiskRating === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' : trend.investmentRiskRating === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                    {trend.investmentRiskRating} Risk
                  </div>
                </div>

                <div className="text-[10px] font-bold text-gray-500 mb-4 bg-white p-2 rounded-lg border border-gray-100">
                  Time to Market: <span className="text-gray-900">{trend.timeToMarket}</span>
                </div>

                <div className="space-y-2 mt-2 text-xs text-gray-600">
                  <p><strong>Innovation:</strong> {trend.marketReadyInnovation}</p>
                  <p><strong>Demand Shift:</strong> {trend.consumerDemandShift}</p>
                  <p><strong>Yield Variation:</strong> {trend.highYieldCropVariation}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-gray-100/50 p-2 rounded-lg">
                    <span className="font-bold text-gray-500">Adoption Rate:</span>
                    <span className="text-gray-800 font-medium">{trend.competitorAdoptionRate}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100/50 p-2 rounded-lg">
                    <span className="font-bold text-gray-500">Regulatory:</span>
                    <span className="text-gray-800 font-medium text-right ml-2">{trend.regulatoryHurdles}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 text-emerald-800 font-medium mt-2">
                    <span className="font-bold text-emerald-600 block mb-0.5">Sustainability Impact</span>
                    {trend.sustainabilityImpact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// C. Supply & Demand Forecasting Assistant
export const ForecastingAssistant = () => {
  const [crop, setCrop] = useState('');
  const [region, setRegion] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForecast = async (e) => {
    e.preventDefault();
    if (!crop || !region) return;
    setLoading(true);
    setForecast(null);

    try {
      const res = await fetch('http://localhost:5000/api/agribusiness/crop-forecasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'Agribusiness Manager' },
        body: JSON.stringify({ cropType: crop, targetRegion: region })
      });
      if (res.ok) {
        const json = await res.json();
        setForecast(json.forecast);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <PageHeader 
        title="Supply & Demand Forecasting Assistant" 
        description="Predictive market modeling based on historical yield and supply chain metadata."
        icon={BarChart2}
        colorClass="bg-emerald-50 text-emerald-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Run Forecast Model</h3>
          <form onSubmit={handleForecast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Crop</label>
              <input type="text" required value={crop} onChange={e=>setCrop(e.target.value)} placeholder="e.g. Soybeans, Wheat" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Region</label>
              <input type="text" required value={region} onChange={e=>setRegion(e.target.value)} placeholder="e.g. Madhya Pradesh" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl transition-colors">
              {loading ? 'Modeling Forecast...' : 'Generate Forecast'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {forecast ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Predicted Demand</h4>
                <p className="text-xl font-black text-gray-900">{forecast.predictedDemandTrend}</p>
              </div>
              
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2"><Globe className="w-4 h-4"/> Emerging Regional Growth Opportunities</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{forecast.growthOpportunityAnalysis}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3"><Briefcase className="w-4 h-4 text-emerald-600"/> Contract Sourcing Opportunities</h4>
                <ul className="space-y-2">
                  {forecast.contractSourcingOpportunities?.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 items-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
             <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50 text-gray-400">
               <Layers className="w-12 h-12 mb-3 opacity-50" />
               <p className="text-sm font-medium">Enter parameters to generate corporate forecast</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// D. Risk Warning & Mitigation Suite
export const RiskMitigationSuite = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/agribusiness/risk-mitigation', {
          headers: { 'x-user-role': 'Agribusiness Manager' }
        });
        if (res.ok) {
          const json = await res.json();
          setRiskData(json.riskAnalysis);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRisk();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <PageHeader 
        title="Risk Warning & Mitigation Suite" 
        description="Aggregated regional threat data and auto-generated operational mitigation playbooks."
        icon={ShieldAlert}
        colorClass="bg-teal-50 text-teal-600"
      />

      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Analyzing enterprise risk vectors...</div>
      ) : riskData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {riskData.map((risk, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-teal-50/30">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-teal-500" /> {risk.threatContext}
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50">
                     <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1.5">Financial Exposure</p>
                     <p className="text-base font-black text-teal-900">{risk.estimatedFinancialImpact}</p>
                  </div>
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                     <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1.5">Probability</p>
                     <p className="text-base font-black text-rose-900">{risk.probability}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> {risk.timeframe}
                  </span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> {risk.keyStakeholdersAffected}
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Alternative Sourcing Options</h4>
                  <p className="text-sm text-gray-700 font-medium">{risk.alternativeSourcingOptions}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Strategic Recommendation</h4>
                  <p className="text-sm text-gray-800 font-medium">{risk.strategicRecommendation}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-950 to-teal-900 p-5 rounded-2xl shadow-inner text-white mt-auto">
                  <h4 className="text-xs font-bold text-teal-200 mb-3 flex items-center gap-2"><Navigation className="w-4 h-4" /> Mitigation Playbook</h4>
                  <ul className="space-y-3">
                    {risk.mitigationSteps?.map((step, i) => (
                      <li key={i} className="flex gap-3 text-xs text-teal-50 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1 shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
