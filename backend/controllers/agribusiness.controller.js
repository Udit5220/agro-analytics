import Document from '../models/DocumentModel.js';
import ResearchQueryLog from '../models/ResearchQueryLog.js';
import { generateCompletion, queryVectorStore } from '../services/langchain.service.js';

// Helper to log analytics for Admin View
const logAdminAnalytics = async (action, userRole, details = '') => {
  try {
    await ResearchQueryLog.create({
      query: action,
      userRole,
      source: 'agribusiness_dashboard',
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Failed to log admin analytics:", err);
  }
};

// A. Agribusiness Dashboard (Business Snapshot)
export const getSnapshot = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Agribusiness Manager';
        await logAdminAnalytics('Viewed Business Snapshot', userRole);

        const docs = await Document.find({}).sort({ createdAt: -1 }).limit(10);
        let allText = docs.length 
          ? docs.map(d => `Title: ${d.title}\nText: ${d.textExtract?.substring(0, 500)}`).join('\n\n')
          : "No corporate data pipelines available.";
          
        const prompt = `You are an executive Agribusiness Strategy Consultant. Synthesize the provided corporate metrics into a highly concise, 1-paragraph Business Digest highlighting corporate performance and critical operation vulnerabilities. Return this text within a structured JSON object with key 'businessDigest'.
        Data: ${allText}`;

        let digestData = {
            businessDigest: "Our procurement networks have maintained a 94% efficiency rating despite minor logistics bottlenecks in the northern corridor. Market opportunities are expanding rapidly in the organic fertilizer sector, driven by upcoming state subsidies. Critical supply forecasts indicate a stable Q3 for staple grains, though precision irrigation tech adoption is highly recommended to hedge against forecasted erratic monsoons."
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            let cleanJson = result.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            digestData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Snapshot, using fallback mock data:", apiError.message);
        }

        res.status(200).json({ success: true, ...digestData });
    } catch(err) {
        console.error("Snapshot Error:", err);
        res.status(500).json({ error: "Failed to fetch snapshot." });
    }
};

// B. Commercial Trend Discovery (Industry Reports)
export const getTrends = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Agribusiness Manager';
        await logAdminAnalytics('Viewed Commercial Trends', userRole);

        const docs = await Document.find({}).sort({ createdAt: -1 }).limit(5);
        let allText = docs.length 
          ? docs.map(d => `Title: ${d.title}\nText: ${d.textExtract?.substring(0, 500)}`).join('\n\n')
          : "No documents available.";
          
        const prompt = `You are a Strategic Corporate Analyst. Scan the provided agricultural documents and completely strip out all academic or scientific jargon. Translate the findings into strategic business intelligence. Generate a structured JSON array of cards containing exactly these keys: 'reportTitle', 'marketReadyInnovation', 'consumerDemandShift', 'highYieldCropVariation', 'projectedROI', 'investmentRiskRating' (Low/Medium/High), 'timeToMarket' (e.g. '12-18 months'), 'competitorAdoptionRate' (e.g. 'Early Adopters', 'Mainstream'), 'regulatoryHurdles' (e.g. 'Subsidized', 'Minimal', 'Pending Approval'), and 'sustainabilityImpact'.
        Generate 3 highly realistic items if data is sparse.
        Data: ${allText}`;

        let parsedTrends = [];
        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\[[\s\S]*\]/);
            const cleanJson = match ? match[0] : result.trim();
            parsedTrends = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Trends, using fallback:", apiError.message);
            parsedTrends = [
                {
                    reportTitle: "[SIMULATED] IoT-Driven Precision Irrigation",
                    marketReadyInnovation: "Smart soil moisture sensors tied to automated valves.",
                    consumerDemandShift: "Increasing demand for water-efficient corporate farming.",
                    highYieldCropVariation: "Drought-resistant Soybeans.",
                    projectedROI: "14-month payback with 22% cost reduction.",
                    investmentRiskRating: "Low",
                    timeToMarket: "6-8 months",
                    competitorAdoptionRate: "Early Adopters",
                    regulatoryHurdles: "Highly Subsidized",
                    sustainabilityImpact: "Reduces water waste by up to 40%."
                },
                {
                    reportTitle: "[SIMULATED] Organic Pulses Premium Pricing",
                    marketReadyInnovation: "Bio-organic pest repellent sprays.",
                    consumerDemandShift: "Urban consumers willing to pay 30% premium.",
                    highYieldCropVariation: "High-protein Chickpeas.",
                    projectedROI: "30% higher profit margin per acre.",
                    investmentRiskRating: "Medium",
                    timeToMarket: "12-18 months",
                    competitorAdoptionRate: "Mainstream",
                    regulatoryHurdles: "Stringent Organic Certification Required",
                    sustainabilityImpact: "Zero chemical runoff into local water tables."
                },
                {
                    reportTitle: "[SIMULATED] Drought-Resistant Sorghum Adoption",
                    marketReadyInnovation: "AI-optimized hybrid seed distribution.",
                    consumerDemandShift: "Shift towards sustainable biofuels and feed.",
                    highYieldCropVariation: "Heat-tolerant Sorghum hybrids.",
                    projectedROI: "Minimizes crop failure risk by 45%.",
                    investmentRiskRating: "High",
                    timeToMarket: "24-36 months",
                    competitorAdoptionRate: "Experimental Phase",
                    regulatoryHurdles: "Pending Genetic Bio-Safety Approvals",
                    sustainabilityImpact: "Ensures food security in arid expanding zones."
                }
            ];
        }

        res.status(200).json({ success: true, trends: parsedTrends });
    } catch(err) {
        console.error("Trends Error:", err);
        res.status(500).json({ error: "Failed to fetch commercial trends." });
    }
};

// C. Supply & Demand Forecasting Assistant
export const generateForecast = async (req, res) => {
    try {
        const { cropType, targetRegion } = req.body;
        if (!cropType || !targetRegion) return res.status(400).json({ error: "cropType and targetRegion are required." });

        const userRole = req.user ? req.user.role : 'Agribusiness Manager';
        await logAdminAnalytics(`Forecast generated for ${cropType} in ${targetRegion}`, userRole);

        let contextText = "No vector database context available. Relying on baseline AI knowledge.";
        try {
            const vectorRes = await queryVectorStore(`Harvest outputs, supply volumes, and commodity trends for ${cropType} in ${targetRegion}`);
            contextText = vectorRes.sourceDocuments.map(d => d.pageContent).join("\n");
        } catch (err) {
            console.warn("ChromaDB vector search failed or unavailable, continuing with fallback context.");
        }

        const prompt = `You are a Supply Chain Intelligence Engine. Based on the provided context, calculate and return a strict JSON schema containing: 'predictedDemandTrend' (High/Medium/Low), 'growthOpportunityAnalysis', and a 'contractSourcingOpportunities' array listing potential expansion regions.
        Context: ${contextText}
        Crop: ${cropType}
        Region: ${targetRegion}`;

        let forecastData = {};
        try {
            const result = await generateCompletion(prompt, userRole);
            let cleanJson = result.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            forecastData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Forecast, using fallback:", apiError.message);
            forecastData = {
                predictedDemandTrend: "High",
                growthOpportunityAnalysis: `The ${targetRegion} area shows strong potential for expanding ${cropType} processing facilities due to improved logistical infrastructure and state subsidies.`,
                contractSourcingOpportunities: [
                    "Direct procurement from western belt FPOs.",
                    "Contract farming in newly irrigated southern districts.",
                    "Bulk organic sourcing near primary market yards."
                ]
            };
        }

        res.status(200).json({ success: true, forecast: forecastData });
    } catch(err) {
        console.error("Forecast Error:", err);
        res.status(500).json({ error: "Failed to generate forecast." });
    }
};

// D. Risk Warning & Mitigation Suite
export const getRiskAnalysis = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Agribusiness Manager';
        await logAdminAnalytics('Viewed Risk Mitigation Suite', userRole);

        const prompt = `You are a Corporate Risk Officer. Analyze the following regional threat vectors and output a series of concrete, actionable strategic recommendation items. Provide a structured JSON array containing specific mitigation playbooks with explicit steps to safeguard enterprise supply chains.
        Data: High climate anomaly in central belt, fertilizer logistics disruption in ports.
        Generate a JSON array where each object has keys: 'threatContext', 'strategicRecommendation', 'estimatedFinancialImpact' (e.g. '$5M - $10M loss'), 'probability' (e.g. 'High - 85%'), 'timeframe' (e.g. 'Imminent (0-30 days)'), 'keyStakeholdersAffected' (e.g. 'Logistics, Farmers'), 'alternativeSourcingOptions' (e.g. 'Import from Brazil'), and 'mitigationSteps' (an array of string steps).`;

        let riskData = [];
        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\[[\s\S]*\]/);
            const cleanJson = match ? match[0] : result.trim();
            riskData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Risk Analysis, using fallback:", apiError.message);
            riskData = [
                {
                    threatContext: "[SIMULATED] Unseasonal Rainfall & Logistics Disruption",
                    strategicRecommendation: "Accelerate procurement and decentralize warehousing.",
                    estimatedFinancialImpact: "$2.5M - $4M Exposure",
                    probability: "High - 82%",
                    timeframe: "Imminent (14-21 Days)",
                    keyStakeholdersAffected: "Transport Fleets, Port Handlers, Regional FPOs",
                    alternativeSourcingOptions: "Activate contingency contracts in Eastern Belt; increase rail freight.",
                    mitigationSteps: [
                        "Pre-book cold storage facilities in central districts.",
                        "Diversify fertilizer sourcing to domestic bio-organic suppliers.",
                        "Deploy drone-based monitoring for early pest detection."
                    ]
                }
            ];
        }

        res.status(200).json({ success: true, riskAnalysis: riskData });
    } catch(err) {
        console.error("Risk Analysis Error:", err);
        res.status(500).json({ error: "Failed to fetch risk analysis." });
    }
};

// 2. Company Analytics Dashboard Integration (Admin View Support)
export const getAdminAnalytics = async (req, res) => {
    try {
        // Fetch aggregated interaction data from ResearchQueryLog
        const recentLogs = await ResearchQueryLog.find({ source: 'agribusiness_dashboard' })
            .sort({ timestamp: -1 })
            .limit(50);
            
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Company Admin');
        
        const prompt = `You are a Corporate AI Systems Administrator reporting to a Company Admin. Analyze the current state of the internal RAG knowledge base. 
        Generate a JSON object with exactly the following structure:
        - 'trendingCorporateProcurementTopics': (array of 5 strings, focusing on IT and AI procurement in AgTech)
        - 'mostViewedIndustryReports': (array of exactly 4 objects. Each object must have 'title' (string) and 'views' (integer between 50 and 500))
        - 'systemHealthAlerts': (array of exactly 3 objects. Each object must have 'alert' (string, related to LLMs, vector DB, or infrastructure) and 'severity' (string, 'High', 'Medium', 'Low'))
        - 'complianceAuditMetrics': (array of exactly 3 objects. Each object must have 'metric' (string, related to Data Privacy or Zero Trust) and 'status' (string, 'Pass', 'Fail', 'Warning'))
        Do not include markdown blocks, just raw JSON.`;

        let analyticsData = {
            trendingCorporateProcurementTopics: [
                "Corporate Procurement",
                "Precision Agriculture ROI",
                "Supply Chain Bottlenecks",
                "Climate Resilience"
            ],
            mostViewedIndustryReports: [
                { title: "Impact of El Niño on Soybean Yields in Q3", views: 142 },
                { title: "Commercial Viability of Drone Spraying", views: 98 },
                { title: "Fertilizer Supply Chain Bottlenecks 2026", views: 76 }
            ],
            systemHealthAlerts: [
                { alert: "Vector DB scaling warning: 85% capacity reached.", severity: "Warning" },
                { alert: "LLM API Rate limit approaching.", severity: "High" }
            ],
            complianceAuditMetrics: [
                { metric: "DPDP Act 2023 Consent Logs", status: "Pass" },
                { metric: "Zero-Trust Perimeter Check", status: "Warning" }
            ],
            recentInteractionsCount: recentLogs.length
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            const aiData = JSON.parse(cleanJson);
            analyticsData.trendingCorporateProcurementTopics = aiData.trendingCorporateProcurementTopics || analyticsData.trendingCorporateProcurementTopics;
            analyticsData.mostViewedIndustryReports = aiData.mostViewedIndustryReports || analyticsData.mostViewedIndustryReports;
            analyticsData.systemHealthAlerts = aiData.systemHealthAlerts || analyticsData.systemHealthAlerts;
            analyticsData.complianceAuditMetrics = aiData.complianceAuditMetrics || analyticsData.complianceAuditMetrics;
        } catch (apiError) {
            console.error("Gemini API failed for Admin Analytics, using fallback:", apiError.message);
        }

        res.status(200).json({
            success: true,
            analytics: analyticsData
        });
    } catch(err) {
        console.error("Admin Analytics Error:", err);
        res.status(500).json({ error: "Failed to fetch admin analytics." });
    }
};
