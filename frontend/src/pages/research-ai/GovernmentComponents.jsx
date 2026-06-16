import React, { useState, useEffect } from 'react';
import { Map, AlertTriangle, Navigation, Landmark, FileText, CheckCircle2, XCircle, Siren, BarChart4, TrendingUp, Globe } from 'lucide-react';

export const DistrictIntervention = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/government/district-intervention', {
          headers: { 'x-user-role': 'Government Official' }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.intervention);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 rounded-xl"><Map className="h-6 w-6 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Policy Advisor: District Interventions</h1>
          <p className="text-sm text-gray-500">Analyze risk districts and immediate department actions.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Analyzing district intelligence...</div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-teal-500" /> Critical Risk Districts</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {data.riskDistricts?.map((d, i) => (
                <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-teal-100">{d}</span>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Root Causes</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{data.rootCauses}</p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
               <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Affected Pop.</h4>
                  <p className="text-lg font-black text-gray-900">{(data.affectedPopulation || 0).toLocaleString()}</p>
               </div>
               <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Urgency</h4>
                  <p className={`text-lg font-black ${data.urgencyLevel === 'High' ? 'text-teal-600' : 'text-emerald-500'}`}>{data.urgencyLevel || 'Unknown'}</p>
               </div>
            </div>

            {(data.resourceDeficit || data.politicalSensitivity || data.timelineForIntervention) && (
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                {data.resourceDeficit && (
                  <div className="flex justify-between items-center text-sm bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    <span className="font-bold text-rose-700">Resource Deficit</span>
                    <span className="font-medium text-rose-900">{data.resourceDeficit}</span>
                  </div>
                )}
                {data.politicalSensitivity && (
                  <div className="flex justify-between items-center text-sm bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    <span className="font-bold text-amber-700">Political Sensitivity</span>
                    <span className="font-medium text-amber-900">{data.politicalSensitivity}</span>
                  </div>
                )}
                {data.timelineForIntervention && (
                  <div className="flex justify-between items-center text-sm bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-700">Intervention Timeline</span>
                    <span className="font-medium text-blue-900">{data.timelineForIntervention}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-emerald-950 to-teal-900 p-6 rounded-3xl text-white shadow-lg">
            <h3 className="text-sm font-bold text-emerald-200 mb-6 flex items-center gap-2"><Navigation className="h-5 w-5" /> Recommended Actions</h3>
            <ul className="space-y-4">
              {data.recommendedActions?.map((action, i) => (
                <li key={i} className="flex gap-3 text-sm text-emerald-50 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const PolicyRecommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('Anantapur');
  const [focus, setFocus] = useState('Water Scarcity & Sustainability');

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/government/policy-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'Government Official' },
        body: JSON.stringify({ targetDistrict: district, focusArea: focus })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.recommendations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 rounded-xl"><Landmark className="h-6 w-6 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Strategic Policy Recommendations</h1>
          <p className="text-sm text-gray-500">Cross-reference ChromaDB vectors to optimize subsidies and sustainability.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target District</label>
          <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm p-3 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Focus Area</label>
          <input type="text" value={focus} onChange={(e) => setFocus(e.target.value)} className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm p-3 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <button onClick={generate} disabled={loading} className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Processing...' : 'Generate Policy'}
        </button>
      </div>

      {data && !loading && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4">Water Conservation</h4>
              <ul className="space-y-3">
                {data.waterConservationStrategies?.map((item, i) => (
                  <li key={i} className="text-sm text-emerald-900 leading-relaxed flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4">Crop Diversification</h4>
              <ul className="space-y-3">
                {data.cropDiversificationSuggestions?.map((item, i) => (
                  <li key={i} className="text-sm text-emerald-900 leading-relaxed flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4">Subsidy Optimization</h4>
              <p className="text-sm text-emerald-900 leading-relaxed">{data.subsidyOptimizationOpportunities}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expected Economic Impact</h4>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">{data.expectedEconomicImpact || "Data not synthesized yet."}</p>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Implementation Timeline</h4>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">{data.implementationTimeline || "Data not synthesized yet."}</p>
             </div>

             {data.estimatedCostToImplement && (
               <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Estimated Cost</h4>
                  <p className="text-xl font-black text-emerald-900">{data.estimatedCostToImplement}</p>
               </div>
             )}
             {data.publicResistanceRisk && (
               <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 shadow-sm">
                  <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Public Resistance Risk</h4>
                  <p className="text-sm font-medium text-amber-900 leading-relaxed">{data.publicResistanceRisk}</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SchemeIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/government/scheme-analytics', {
          headers: { 'x-user-role': 'Government Official' }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 rounded-xl"><FileText className="h-6 w-6 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Scheme Intelligence</h1>
          <p className="text-sm text-gray-500">Beneficiary tracking and policy eligibility impact analysis.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Evaluating program data...</div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Adoption Analytics Summary</h4>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium bg-gray-50 p-5 rounded-2xl border border-gray-100">{data.adoptionAnalyticsSummary}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-teal-500" /> Eligibility Impact Analysis</h4>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium bg-teal-50/50 p-5 rounded-2xl border border-teal-100">{data.eligibilityImpactAnalysis}</p>
                </div>

                {data.underperformingDemographics && (
                  <div>
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-500" /> Vulnerable Demographics</h4>
                    <p className="text-sm text-rose-900 leading-relaxed font-medium bg-rose-50 p-5 rounded-2xl border border-rose-100">{data.underperformingDemographics}</p>
                  </div>
                )}
             </div>
             
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-500" /> Top Performing Schemes</h4>
                  <ul className="space-y-2">
                     {data.topPerformingSchemes?.map((s, i) => (
                        <li key={i} className="flex gap-2 items-center text-sm font-medium text-gray-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {s}</li>
                     ))}
                  </ul>
                </div>

                {data.budgetUtilizationEfficiency && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Budget Utilization</h4>
                    <p className="text-xl font-black text-amber-700">{data.budgetUtilizationEfficiency}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-emerald-500" /> Fraud Detection Alerts</h4>
                  <p className="text-sm text-emerald-900 leading-relaxed font-medium bg-emerald-50 p-5 rounded-2xl border border-emerald-100">{data.fraudDetectionAlerts || "No critical anomalies detected."}</p>
                </div>
             </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const EmergencyReliefManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disaster, setDisaster] = useState('Drought');
  const [region, setRegion] = useState('Anantapur');

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/government/emergency-relief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'Government Official' },
        body: JSON.stringify({ disasterType: disaster, targetRegion: region })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.reliefPlan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-50 rounded-xl"><Siren className="h-6 w-6 text-teal-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Relief Manager</h1>
          <p className="text-sm text-gray-500">Rapid disaster response planning and resource allocation.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Disaster Type</label>
          <input type="text" value={disaster} onChange={(e) => setDisaster(e.target.value)} className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm p-3 focus:ring-teal-500 focus:border-teal-500" />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Region</label>
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border-gray-200 bg-gray-50 rounded-xl text-sm p-3 focus:ring-teal-500 focus:border-teal-500" />
        </div>
        <button onClick={generate} disabled={loading} className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-teal-700 disabled:opacity-50">
          {loading ? 'Processing...' : 'Generate Relief Plan'}
        </button>
      </div>

      {data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-3xl border border-teal-100 shadow-sm space-y-6">
            <div>
               <h4 className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Severity Assessment</h4>
               <p className="text-sm text-gray-800 leading-relaxed font-medium bg-teal-50 p-4 rounded-xl">{data.severityAssessment}</p>
            </div>
            <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Emergency Fund Allocation</h4>
               <p className="text-2xl font-black text-teal-600">{data.emergencyFundAllocation}</p>
            </div>

            {data.estimatedRecoveryTime && (
              <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Estimated Recovery Time</h4>
                 <p className="text-sm text-gray-700 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100">{data.estimatedRecoveryTime}</p>
              </div>
            )}
            
            {data.longTermVulnerabilityFix && (
              <div>
                 <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Long-Term Vulnerability Fix</h4>
                 <p className="text-sm text-blue-900 font-medium bg-blue-50 p-4 rounded-xl border border-blue-100">{data.longTermVulnerabilityFix}</p>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-teal-950 to-emerald-900 p-6 rounded-3xl text-white shadow-lg space-y-6">
            <div>
               <h4 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-4">Critical Supplies Routing</h4>
               <ul className="space-y-3">
                 {data.criticalSuppliesRouting?.map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm text-teal-50 items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                     <span className="leading-relaxed">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
            <div className="pt-4 border-t border-teal-800/50">
               <h4 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-4">Field Team Deployments</h4>
               <ul className="space-y-3">
                 {data.fieldTeamDeployments?.map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm text-teal-50 items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                     <span className="leading-relaxed">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TradeExportDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/government/trade-analytics', {
          headers: { 'x-user-role': 'Government Official' }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 rounded-xl"><BarChart4 className="h-6 w-6 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trade & Export Analytics</h1>
          <p className="text-sm text-gray-500">Global market trends, MSP recommendations, and export quotas.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Analyzing global trade markets...</div>
      ) : data ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-500" /> Market Export Insights</h4>
            <p className="text-sm text-gray-800 leading-relaxed font-medium bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">{data.marketExportInsights}</p>

            {(data.geopoliticalTradeRisk || data.emergingImportMarkets) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {data.geopoliticalTradeRisk && (
                  <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Geopolitical Trade Risk</h4>
                    <p className="text-sm font-medium text-rose-900">{data.geopoliticalTradeRisk}</p>
                  </div>
                )}
                {data.emergingImportMarkets && (
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Globe className="w-3 h-3" /> Emerging Import Markets</h4>
                    <p className="text-sm font-medium text-blue-900">{data.emergingImportMarkets}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-500" /> MSP Recommendations</h4>
              <div className="space-y-4">
                 {data.mspRecommendations?.map((msp, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900">{msp.crop}</span>
                        <span className="text-emerald-600 font-black">{msp.recommendedMSP}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{msp.rationale}</p>
                    </div>
                 ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 p-6 rounded-3xl text-white shadow-lg">
               <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Export Quota Adjustments</h4>
               <ul className="space-y-4">
                 {data.exportQuotaAdjustments?.map((item, i) => (
                   <li key={i} className="flex gap-3 text-sm text-emerald-50 items-center bg-white/10 p-3 rounded-xl border border-white/5">
                     <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                     <span className="leading-relaxed font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
