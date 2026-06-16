import Document from '../models/DocumentModel.js';
import ResearchQueryLog from '../models/ResearchQueryLog.js';
import { generateCompletion, queryVectorStore } from '../services/langchain.service.js';

// Helper to log analytics for Admin View
const logAdminAnalytics = async (action, userRole, details = '') => {
    try {
        await ResearchQueryLog.create({
            query: action,
            filters: { details },
            userRole: userRole,
            resultsCount: 1,
            processingTimeMs: 0
        });
    } catch (err) {
        console.error("Error logging admin analytics:", err);
    }
};

// A. Policy Overview Dashboard (District Statistics)
export const getPolicySnapshot = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Government Official';
        await logAdminAnalytics('Viewed Policy Snapshot', userRole);

        const docs = await Document.find({}).sort({ uploadDate: -1 }).limit(3);
        const allText = docs.length > 0 
          ? docs.map(d => `Title: ${d.title}\nText: ${d.textExtract?.substring(0, 500)}`).join('\n\n')
          : "No regional data available.";
          
        const prompt = `You are an expert Government Policy Director. Synthesize the provided district statistics and regional metrics into a highly concise, 1-paragraph Executive Policy Brief. Highlight macro trends and critical operational bottlenecks. Keep it extremely brief and actionable. Return this text within a structured JSON object with keys:
        - 'executivePolicyBrief' (string)
        - 'activeSubsidiesCount' (number)
        - 'pendingApplications' (number)
        - 'totalBudgetAllocated' (string, e.g. "₹500 Cr")
        - 'regionalRiskLevel' (string, e.g. "Moderate")
        - 'projectedPolicyImpact' (string)
        - 'immediateActionRequired' (string)
        Data: ${allText}`;

        let snapshotData = {
            executivePolicyBrief: "[SIMULATED] Recent district data reveals a strong macro trend toward hybrid crop adoption in the northern belt. Critical operational bottlenecks persist in subsidy distribution logistics.",
            activeSubsidiesCount: 142,
            pendingApplications: 12450,
            totalBudgetAllocated: "₹850 Cr",
            regionalRiskLevel: "High",
            projectedPolicyImpact: "Will stabilize crop yields by 14% over next 2 years.",
            immediateActionRequired: "Streamline digital verification pipelines for Kharif subsidies."
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            snapshotData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Policy Snapshot, using fallback:", apiError.message);
        }

        res.status(200).json(snapshotData);
    } catch (error) {
        console.error('Snapshot Error:', error);
        res.status(500).json({ error: 'Failed to fetch policy snapshot' });
    }
};

// B. AI Policy Advisor (District Intervention Suite)
export const getDistrictIntervention = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Government Official';
        await logAdminAnalytics('Viewed District Interventions', userRole);
        
        const docs = await Document.find({}).sort({ uploadDate: -1 }).limit(5);
        const allText = docs.length > 0 
          ? docs.map(d => `Title: ${d.title}\nText: ${d.textExtract?.substring(0, 500)}`).join('\n\n')
          : "No documents available.";
          
        const prompt = `You are a Senior Agricultural Policy Advisor. Your job is to answer queries such as 'Which districts require intervention?'. Analyze the provided district data and return a structured JSON response identifying:
        - 'riskDistricts' (Array of strings)
        - 'rootCauses' (string, keep it under 2 sentences)
        - 'recommendedActions' (Array of strings, short action-oriented bullet points)
        - 'affectedPopulation' (number)
        - 'urgencyLevel' (string: High, Medium, or Low)
        - 'resourceDeficit' (string, e.g. 'Shortage of 500 MT Urea')
        - 'politicalSensitivity' (string, e.g. 'High - Approaching elections')
        - 'timelineForIntervention' (string, e.g. 'Within 72 Hours')
        Data: ${allText}`;

        let interventionData = {
            riskDistricts: ["Bikaner", "Jaisalmer", "Anantapur"],
            rootCauses: "[SIMULATED] Severe water scarcity coupled with rapidly depleting groundwater reserves and delayed monsoon onset.",
            recommendedActions: [
                "Deploy emergency solar pump subsidies to affected blocks.",
                "Initiate direct cash transfers for drought-resistant seed procurement.",
                "Dispatch rapid response extension teams to guide drip irrigation setups."
            ],
            affectedPopulation: 450000,
            urgencyLevel: "High",
            resourceDeficit: "Shortage of 1200 MT Drought-Resistant Seeds",
            politicalSensitivity: "High - Agrarian protests anticipated",
            timelineForIntervention: "Immediate (24-48 Hours)"
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            interventionData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Interventions, using fallback:", apiError.message);
        }

        res.status(200).json({ success: true, intervention: interventionData });
    } catch (error) {
        console.error('Intervention Error:', error);
        res.status(500).json({ error: 'Failed to fetch district interventions' });
    }
};

// C. Strategic Policy Recommendations (Sustainability & Subsidies)
export const getPolicyRecommendations = async (req, res) => {
    try {
        const { targetDistrict, focusArea } = req.body;
        if (!targetDistrict || !focusArea) return res.status(400).json({ error: "targetDistrict and focusArea are required." });

        const userRole = req.user ? req.user.role : 'Government Official';
        await logAdminAnalytics(`Policy Recommendation generated for ${targetDistrict} (${focusArea})`, userRole);

        let contextText = "No vector database context available. Relying on baseline AI knowledge.";
        try {
            const vectorRes = await queryVectorStore(`Agricultural research papers on conservation, crop yields, and economic models in ${targetDistrict} focusing on ${focusArea}`);
            contextText = vectorRes.sourceDocuments.map(d => d.pageContent).join("\n");
        } catch (err) {
            console.warn("ChromaDB vector search failed or unavailable, continuing with fallback context.");
        }

        const prompt = `You are a Strategic Planning Analyst. Based on the provided research context and district vectors, generate a strict JSON schema containing concise insights:
        - 'waterConservationStrategies' (Array of strings, short bullet points)
        - 'cropDiversificationSuggestions' (Array of strings, short bullet points)
        - 'subsidyOptimizationOpportunities' (string, 1-2 sentences)
        - 'expectedEconomicImpact' (string, 1 sentence)
        - 'implementationTimeline' (string, short)
        - 'estimatedCostToImplement' (string, e.g. '₹500 Crores')
        - 'publicResistanceRisk' (string, e.g. 'Medium - Farmers may resist')
        Context: ${contextText}
        Target District: ${targetDistrict}
        Focus Area: ${focusArea}`;

        let policyData = {
            waterConservationStrategies: [
                "Mandatory implementation of micro-irrigation systems.",
                "Construction of decentralized rainwater harvesting ponds."
            ],
            cropDiversificationSuggestions: [
                "Shift 20% of paddy cultivation to millet.",
                "Introduce short-duration pulses as a catch crop."
            ],
            subsidyOptimizationOpportunities: "[SIMULATED] Reallocate 15% of chemical fertilizer subsidies towards organic input manufacturing grants and solar-powered cold storage units.",
            expectedEconomicImpact: "Increase net farmer income by 18% over 2 years and reduce state fertilizer subsidy burden by ₹120 Cr.",
            implementationTimeline: "Phase 1 roll-out across 45 vulnerable blocks within the next 3 months, scaling statewide by Q4.",
            estimatedCostToImplement: "₹350 Crores",
            publicResistanceRisk: "Medium - Farmers may resist transition from cash crops."
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            policyData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Policy Recommendations, using fallback:", apiError.message);
        }

        res.status(200).json({ success: true, recommendations: policyData });
    } catch (error) {
        console.error('Policy Recommendations Error:', error);
        res.status(500).json({ error: 'Failed to generate policy recommendations' });
    }
};

// D. Government Scheme Intelligence
export const getSchemeAnalytics = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Government Official';
        await logAdminAnalytics('Viewed Scheme Analytics', userRole);

        const prompt = `You are a Public Program Evaluator. Analyze the scheme performance data and output an executive summary of beneficiary tracking and adoption analytics. Keep explanations highly succinct. Return a clean JSON object with EXACTLY these keys:
        - 'adoptionAnalyticsSummary' (string, 2 sentences max)
        - 'eligibilityImpactAnalysis' (string, 2 sentences max)
        - 'topPerformingSchemes' (Array of strings)
        - 'fraudDetectionAlerts' (string, short alert message)
        - 'underperformingDemographics' (string, e.g. 'Marginalized farmers in tribal belts')
        - 'budgetUtilizationEfficiency' (string, e.g. '82% - Funds delayed')
        Data: Low PM-Kisan adoption in eastern sectors due to land record mismatch, high uptake of solar pump scheme in western states.`;

        let schemeData = {
            adoptionAnalyticsSummary: "[SIMULATED] Overall scheme adoption has increased by 12% Q-o-Q. However, beneficiary tracking indicates a 22% drop-off rate during final verification.",
            eligibilityImpactAnalysis: "Rigid documentation requirements are disqualifying tenant farmers. Relaxing proofs could improve onboarding by up to 35%.",
            topPerformingSchemes: ["PM-KUSUM (Solar Pumps)", "Paramparagat Krishi Vikas Yojana (PKVY)", "National Mission on Micro Irrigation"],
            fraudDetectionAlerts: "Anomaly detected in 432 PM-Kisan applications with duplicate land IDs.",
            underperformingDemographics: "Tenant farmers and unregistered sharecroppers in Eastern sectors.",
            budgetUtilizationEfficiency: "74% - Significant funds idle at state-level nodal agencies."
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            schemeData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Scheme Analytics, using fallback:", apiError.message);
        }

        res.status(200).json({ success: true, analytics: schemeData });
    } catch (error) {
        console.error('Scheme Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch scheme analytics' });
    }
};

// E. Emergency Relief Manager (Disaster Assessment)
export const generateEmergencyReliefPlan = async (req, res) => {
    try {
        const { disasterType, targetRegion } = req.body;
        if (!disasterType || !targetRegion) return res.status(400).json({ error: "disasterType and targetRegion are required." });

        const userRole = req.user ? req.user.role : 'Government Official';
        await logAdminAnalytics(`Emergency Relief generated for ${disasterType} in ${targetRegion}`, userRole);

        let contextText = "No vector database context available. Relying on baseline AI knowledge for disaster response.";
        try {
            const vectorRes = await queryVectorStore(`Agricultural disaster relief, weather impact, and supply distribution for ${disasterType} in ${targetRegion}`);
            contextText = vectorRes.sourceDocuments.map(d => d.pageContent).join("\n");
        } catch (err) {
            console.warn("ChromaDB vector search failed or unavailable, continuing with fallback context.");
        }

        const prompt = `You are a Government Crisis Management Director. Based on the provided context, generate a rapid emergency agricultural relief plan for a ${disasterType} in ${targetRegion}. Return a strict JSON object containing EXACTLY:
        - 'severityAssessment' (string)
        - 'emergencyFundAllocation' (string, e.g. "₹200 Cr")
        - 'criticalSuppliesRouting' (Array of strings, e.g. ["Divert 500 tons of fodder from District X", "Deploy 100 mobile water tankers"])
        - 'fieldTeamDeployments' (Array of strings)
        - 'estimatedRecoveryTime' (string, e.g. '4 to 6 months')
        - 'longTermVulnerabilityFix' (string)
        Context: ${contextText}
        Make the response highly actionable, brief, and directly addressed to the state agricultural department.`;

        let reliefData = {
            severityAssessment: `[SIMULATED] The ${disasterType} in ${targetRegion} is classified as severe. Immediate resource mobilization required to prevent livelihood collapse.`,
            emergencyFundAllocation: "₹120 Cr",
            criticalSuppliesRouting: [
                "Divert 500 tons of drought-resistant seeds from central granaries.",
                "Deploy 150 mobile water tankers to severely affected blocks."
            ],
            fieldTeamDeployments: [
                "Dispatch 45 agricultural extension officers to assess crop damage.",
                "Activate 3 rapid response veterinary units for livestock protection."
            ],
            estimatedRecoveryTime: "3 to 5 months for soil moisture restoration",
            longTermVulnerabilityFix: "Mandate contour bunding and establish local community seed banks."
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            reliefData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Emergency Relief, using fallback:", apiError.message);
        }

        res.status(200).json({ success: true, reliefPlan: reliefData });
    } catch (error) {
        console.error('Emergency Relief Error:', error);
        res.status(500).json({ error: 'Failed to generate emergency relief plan' });
    }
};

// F. Trade & Export Analytics
export const getTradeAnalytics = async (req, res) => {
    try {
        const userRole = req.user ? req.user.role : 'Government Official';
        await logAdminAnalytics('Viewed Trade & Export Analytics', userRole);

        const prompt = `You are a National Agricultural Trade Economist. Analyze recent macro-economic trends and output a strict JSON object containing insights for export planning and Minimum Support Price (MSP) setting. Return EXACTLY:
        - 'marketExportInsights' (string)
        - 'mspRecommendations' (Array of objects with keys: 'crop' (string), 'recommendedMSP' (string), 'rationale' (string))
        - 'exportQuotaAdjustments' (Array of strings)
        - 'geopoliticalTradeRisk' (string, e.g. 'Moderate due to tariffs')
        - 'emergingImportMarkets' (string)
        Data: Global wheat shortage predicted for Q4, domestic sugar surplus, rising transport logistics costs.`;

        let tradeData = {
            marketExportInsights: "[SIMULATED] Global supply constraints present an opportunity to capture Middle East markets. Domestic surplus requires immediate quota relaxation.",
            mspRecommendations: [
                { crop: "Wheat", recommendedMSP: "₹2,275/quintal", rationale: "To encourage acreage expansion in response to global demand." },
                { crop: "Sugar Cane", recommendedMSP: "₹315/quintal", rationale: "Maintaining current levels to balance surplus stocks with ethanol diversion targets." }
            ],
            exportQuotaAdjustments: [
                "Lift export restrictions on non-basmati white rice.",
                "Increase sugar export quotas by 1.5 million tonnes."
            ],
            geopoliticalTradeRisk: "Moderate - Potential EU tariffs on chemical residue limits.",
            emergingImportMarkets: "Southeast Asia for coarse grains; MENA region for refined sugar."
        };

        try {
            const result = await generateCompletion(prompt, userRole);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            tradeData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Trade Analytics, using fallback:", apiError.message);
        }

        res.status(200).json({ success: true, analytics: tradeData });
    } catch (error) {
        console.error('Trade Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch trade analytics' });
    }
};
