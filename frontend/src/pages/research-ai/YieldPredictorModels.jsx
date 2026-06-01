import React, { useState } from 'react';
import { 
  Network, 
  Binary, 
  LineChart, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Brain,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

const MODEL_DATA = {
  'neural-net': {
    id: 'neural-net',
    name: 'Neural Net (LSTM)',
    title: 'Active Model: LSTM Ensembles',
    accuracy: 92,
    architectureTitle: 'Time-Series Weather Analysis',
    architectureIcon: Brain,
    architectureDescription: 'Utilizes Long Short-Term Memory (LSTM) networks to analyze sequential weather data over a 90-day growing period, capturing non-linear relationships between rainfall distribution and yield.',
    inputs: ['Soil Moisture', 'NDVI', 'Temperature', 'Solar Radiation']
  },
  'xgboost': {
    id: 'xgboost',
    name: 'XGBoost',
    title: 'Active Model: XGBoost Regressor',
    accuracy: 89,
    architectureTitle: 'Gradient Boosting Decision Trees',
    architectureIcon: Cpu,
    architectureDescription: 'Builds sequential decision trees where each new tree corrects errors from the previous one, optimizing prediction performance for tabular soil and nutrient profiles.',
    inputs: ['Nitrogen Level', 'Phosphorus Level', 'Potassium Level', 'Soil pH', 'Organic Matter']
  },
  'random-forest': {
    id: 'random-forest',
    name: 'Random Forest',
    title: 'Active Model: Random Forest Regressor',
    accuracy: 84,
    architectureTitle: 'Bootstrap Ensemble Aggregation',
    architectureIcon: Layers,
    architectureDescription: 'Constructs a multitude of decision trees during training and outputs the mean prediction of the individual trees, reducing overfitting and handling highly diverse soil parameters.',
    inputs: ['Historical Yields', 'Crop Variety Coefficient', 'Planting Density', 'Soil Texture']
  },
  'svr': {
    id: 'svr',
    name: 'SVR',
    title: 'Active Model: Support Vector Regression (SVR)',
    accuracy: 78,
    architectureTitle: 'Kernel-Based Margin Optimization',
    architectureIcon: Binary,
    architectureDescription: 'Finds a hyperplane in a high-dimensional space that fits the data points within a defined boundary margin, particularly effective for limited crop datasets and low-dimensional inputs.',
    inputs: ['Rainfall Volume', 'Irrigation Days', 'Elevation Coefficient']
  }
};

export default function YieldPredictorModels() {
  const [activeModelId, setActiveModelId] = useState('neural-net');
  const [forecasting, setForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const activeModel = MODEL_DATA[activeModelId];
  
  const chartItems = [
    { id: 'neural-net', label: 'Neural Net (LSTM)', val: 92 },
    { id: 'xgboost', label: 'XGBoost', val: 89 },
    { id: 'random-forest', label: 'Random Forest', val: 84 },
    { id: 'svr', label: 'SVR', val: 78 }
  ];

  const handleRunForecast = async () => {
    setForecasting(true);
    setErrorMsg("");
    setForecastResult(null);

    const prompt = `Simulate an agricultural yield forecast prediction output using the following machine learning model:
    - Model: ${activeModel.name}
    - Accuracy Level: ${activeModel.accuracy}%
    - Architecture: ${activeModel.architectureTitle} (${activeModel.architectureDescription})
    - Inputs used: ${activeModel.inputs.join(", ")}

    Provide a realistic forecast result, model application scope, and key advantages. Output a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "predictedYield": A string value (e.g. "24.6 qtl/acre")
    2. "yieldTrend": A trend description (e.g. "+12.4% vs baseline")
    3. "confidenceInterval": A range (e.g. "23.1 - 26.2 qtl/acre")
    4. "soilHealthAdvisory": A brief soil advisory (under 40 words)
    5. "riskAssessment": A brief risk summary (under 40 words)
    6. "scope": A detailed description of the model application scope in agriculture, detailing where it is best deployed (under 50 words)
    7. "pros": An array of 3 key pros/advantages of deploying this specific model architecture for precision agronomy.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are a crop telemetry machine learning modeling server. Return clean JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsedResult = JSON.parse(cleanJson);
      setForecastResult(parsedResult);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to ML prediction node. Check key setup.");
      setForecastResult({
        predictedYield: "22.8 qtl/acre",
        yieldTrend: "+8.2% vs baseline",
        confidenceInterval: "21.5 - 24.1 qtl/acre",
        soilHealthAdvisory: "Soil moisture and organic carbon levels are optimal for Split Nitrogen uptake.",
        riskAssessment: "Low risk of hypoxic root stress under current weather projection parameters.",
        scope: "Highly suited for regional temporal forecasting and time-series sensor integrations.",
        pros: [
          "Effective capturing of sequential time-series patterns.",
          "High resilience to noisy, real-time sensor field fluctuations.",
          "Excellent long-term scaling for predictive soil telemetry parameters."
        ]
      });
    } finally {
      setForecasting(false);
    }
  };

  const ArchitectureIcon = activeModel.architectureIcon;

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* 1. Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="p-2.5 bg-[#31572c]/10 rounded-xl">
          <Network className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Yield Prediction Models</h1>
          <p className="text-sm text-gray-500">Technical breakdown of AI methodologies for crop forecasting</p>
        </div>
      </div>

      {/* 2. Responsive 5-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Dynamic Active Model Analytics Workspace - 3/5 width */}
        <div className="lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {activeModel.title}
              </h2>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> {activeModel.accuracy}% Accuracy
              </span>
            </div>
            
            <div className="space-y-6">
              {/* Upper Content Block: Core Architecture */}
              <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-800 text-white rounded-lg">
                    <ArchitectureIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {activeModel.architectureTitle}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  {activeModel.architectureDescription}
                </p>
              </div>
              
              {/* Lower Content Block: Multivariate Inputs */}
              <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-800 text-white rounded-lg">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    Multivariate Inputs
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {activeModel.inputs.map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl shadow-2xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/40 p-4 border border-emerald-100/50 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-bold gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Model compiled & validated. Ready for forecast run.</span>
            </div>
            <button 
              onClick={handleRunForecast}
              disabled={forecasting}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 active:scale-[0.98] text-white px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              {forecasting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Forecasting...
                </>
              ) : (
                "Run Forecast"
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Benchmark Comparison Chart - 2/5 width */}
        <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Model Benchmark Comparison</h2>
            <p className="text-xs text-gray-400 mt-1 mb-6 leading-relaxed">
              Comparison of overall target validation accuracy across models. Click a bar to load its configuration.
            </p>
          </div>

          {/* Pure Tailwind CSS Vertical Bar Chart */}
          <div className="flex-1 flex gap-4 h-64 mt-2">
            
            {/* Y-Axis scale label markers */}
            <div className="flex flex-col justify-between text-[10px] font-bold text-gray-400 text-right w-6 pb-6 select-none">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Bars container */}
            <div className="flex-1 border-l border-b border-slate-100 flex justify-around items-end relative pb-2 px-2 gap-3">
              {chartItems.map((item) => {
                const isActive = activeModelId === item.id;
                return (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setActiveModelId(item.id);
                      setForecastResult(null);
                    }}
                    className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip percentage on hover/active */}
                    <span className={`text-[10px] font-black tracking-wide mb-1.5 transition-all py-0.5 px-1.5 rounded ${
                      isActive 
                        ? 'bg-emerald-800 text-white shadow-xs scale-105' 
                        : 'text-gray-500 group-hover:text-emerald-800 group-hover:scale-105'
                    }`}>
                      {item.val}%
                    </span>

                    {/* Bar visual graphic */}
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-emerald-800 ring-4 ring-emerald-800/20 scale-[1.02]' 
                          : 'bg-emerald-800/40 hover:bg-emerald-800/70'
                      }`}
                      style={{ height: `${item.val}%` }}
                    />
                  </div>
                );
              })}
            </div>

          </div>

          {/* X-Axis labels explicitly named */}
          <div className="flex text-[10px] font-black text-gray-400 text-center select-none pt-2 mt-1 border-t border-slate-100/50">
            <span className="w-6 shrink-0" />
            <div className="flex-1 flex justify-around pl-2">
              <span className="w-12 truncate block font-sans" title="Neural Net (LSTM)">LSTM</span>
              <span className="w-12 truncate block font-sans" title="XGBoost">XGBoost</span>
              <span className="w-12 truncate block font-sans" title="Random Forest">R. Forest</span>
              <span className="w-12 truncate block font-sans" title="Support Vector Regression">SVR</span>
            </div>
          </div>

        </div>

      </div>

      {/* Forecast Output Area */}
      {forecasting && (
        <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#31572c] animate-spin" />
          <h4 className="text-sm font-bold text-gray-800">Simulating Forecast Outlay...</h4>
          <p className="text-xs text-gray-500">Querying active model weights using Gemini AI.</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {forecastResult && !forecasting && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-800" />
              <span>Forecast Prediction Metrics</span>
            </h3>
            <span className="text-[10px] font-black text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
              {activeModel.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-gray-400 block uppercase">Predicted Crop Yield</span>
              <span className="text-xl font-extrabold text-slate-900 block mt-1">{forecastResult.predictedYield}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-gray-400 block uppercase">Estimated Trend</span>
              <span className="text-xl font-extrabold text-emerald-700 block mt-1">{forecastResult.yieldTrend}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-gray-400 block uppercase">Confidence Interval (95%)</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-1.5">{forecastResult.confidenceInterval}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
              <span className="text-xs font-black text-emerald-850 block uppercase">Soil Health Advisory</span>
              <p className="text-xs text-slate-700 font-semibold mt-1.5 leading-relaxed">{forecastResult.soilHealthAdvisory}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs font-black text-slate-800 block uppercase">Risk Assessment</span>
              <p className="text-xs text-slate-755 font-semibold mt-1.5 leading-relaxed">{forecastResult.riskAssessment}</p>
            </div>
          </div>

          {forecastResult.scope && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-xs font-black text-slate-800 block uppercase">Model Application Scope</span>
                <p className="text-xs text-slate-700 font-semibold mt-1.5 leading-relaxed">{forecastResult.scope}</p>
              </div>
              {forecastResult.pros && (
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                  <span className="text-xs font-black text-emerald-850 block uppercase">Architectural Advantages</span>
                  <ul className="space-y-1 mt-1.5">
                    {forecastResult.pros.map((pro, index) => (
                      <li key={index} className="text-xs text-slate-700 font-semibold flex items-start gap-1">
                        <span className="text-emerald-700">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
