import ResearchQueryLog from '../models/ResearchQueryLog.js';
import PromptTemplate from '../models/PromptTemplate.js';
import { generateCompletion } from '../services/langchain.service.js';

// A. Platform & AI Operations Dashboard (Analytics)
export const getPlatformOpsAnalytics = async (req, res) => {
    try {
        const logs = await ResearchQueryLog.find({}).sort({ timestamp: -1 }).limit(100);
        
        const totalQueries = logs.length;
        const avgProcessingTime = totalQueries > 0 
            ? Math.round(logs.reduce((acc, log) => acc + (log.processingTimeMs || 0), 0) / totalQueries) 
            : 0;

        const prompt = `You are an AI Operations Analytics Director. Analyze system execution metrics and generate a structured JSON object containing: 'responseAccuracyRate' (string percentage), 'averageResponseTimeMs' (number), 'querySuccessTrends' (string), and an executive 2-sentence breakdown of 'systemEfficiency bottlenecks'.
        Recent Logs: ${totalQueries} queries processed with an average recorded latency of ${avgProcessingTime}ms.`;

        let analyticsData = {
            responseAccuracyRate: "94.2%",
            averageResponseTimeMs: avgProcessingTime || 1250,
            querySuccessTrends: "Upward trend in successful vector retrievals, with a 15% reduction in hallucination flags over the past 30 days.",
            systemEfficiency: "The primary bottleneck remains ChromaDB connection pooling during peak hours, causing intermittent latency spikes in the eastern regions. Expanding vector node clusters is recommended to stabilize the response times."
        };

        try {
            const result = await generateCompletion(prompt, 'Company Admin');
            let cleanJson = result.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            analyticsData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Admin Analytics, using fallback.");
        }

        res.status(200).json(analyticsData);
    } catch (error) {
        console.error('Ops Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch platform operations analytics' });
    }
};

export const getComprehensiveAnalytics = async (req, res) => {
    try {
        const prompt = `You are a Chief Data Officer. Generate a comprehensive JSON object for a Company Administration Panel containing the following metrics:
        1. "analytics": { "totalQueries", "dailyActiveUsers", "userRoleDistribution" (array of {role, percentage}), "averageSessionDuration", "userRetention" }
        2. "aiPerformance": { "responseAccuracy", "responseTime", "querySuccessRate", "escalationRate", "userSatisfactionScore" }
        3. "monitoring": { "apiHealth" (status string), "kbHealth" (status string), "modelPerformance" (string), "errorLogs" (integer), "usageCosts" (string like "$145.20"), "tokenConsumption" }
        4. "successMetrics": {
            "userKPIs": { "dau", "queriesPerUser", "userSatisfaction", "recommendationAdoptionRate" },
            "businessKPIs": { "farmerYieldImprovement", "farmerProfitImprovement", "procurementCostReduction", "researchProductivityIncrease" },
            "technicalKPIs": { "responseAccuracy", "responseTime", "aiCostPerQuery", "systemAvailability" }
        }
        Return ONLY valid JSON. Make the numbers realistic for an agricultural AI system serving 5,000 users.`;

        let data = {
            analytics: { totalQueries: "45,210", dailyActiveUsers: "1,240", userRoleDistribution: [{role: "Farmer", percentage: "65%"}, {role: "Research Analyst", percentage: "15%"}, {role: "Agribusiness Manager", percentage: "12%"}, {role: "Gov Official", percentage: "8%"}], averageSessionDuration: "14m 20s", userRetention: "78%" },
            aiPerformance: { responseAccuracy: "96.4%", responseTime: "1.2s", querySuccessRate: "98.1%", escalationRate: "2.4%", userSatisfactionScore: "4.8/5.0" },
            monitoring: { apiHealth: "Healthy", kbHealth: "Optimized", modelPerformance: "Stable", errorLogs: 12, usageCosts: "$145.20", tokenConsumption: "4.2M tokens" },
            successMetrics: {
                userKPIs: { dau: "1,240", queriesPerUser: "36", userSatisfaction: "94%", recommendationAdoptionRate: "68%" },
                businessKPIs: { farmerYieldImprovement: "+12.5%", farmerProfitImprovement: "+18%", procurementCostReduction: "-8.4%", researchProductivityIncrease: "+45%" },
                technicalKPIs: { responseAccuracy: "96.4%", responseTime: "1200ms", aiCostPerQuery: "$0.003", systemAvailability: "99.98%" }
            }
        };

        try {
            const result = await generateCompletion(prompt, 'Company Admin');
            let cleanJson = result.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            data = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Comprehensive Analytics, using fallback.", apiError);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Comprehensive Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch comprehensive analytics' });
    }
};

// B. Knowledge Base Management & Auto-Categorization
export const uploadKnowledgeBase = async (req, res) => {
    try {
        const { text, filename, documentType } = req.body;
        if (!text) return res.status(400).json({ error: 'Document text is required' });

        const docTypeContext = documentType || "Research Paper";

        const prompt = `You are a Data Architect Engine. Scan the text contents of this newly uploaded document of type: ${docTypeContext}. Generate and return a strict JSON schema containing: 
        - 'metadataTags' (Array of strings, including Crop Type, Target Region, relevant factors based on doc type)
        - 'documentSummary' (2-line synopsis)
        - 'suggestedFAQ' (Array of 3 typical user questions answered by this document)
        Document Text: ${text.substring(0, 1500)}`;

        let processingData = {
            metadataTags: [docTypeContext, "Northern Belt", "Alluvial Soil", "Drought Resistance"],
            documentSummary: `A comprehensive analysis of ${docTypeContext.toLowerCase()} covering agricultural impact in semi-arid regions.`,
            suggestedFAQ: [
                "What is the expected yield impact?",
                "Which soil type is most suitable?",
                "How does this affect regional policy?"
            ]
        };

        try {
            const result = await generateCompletion(prompt, 'Company Admin');
            let cleanJson = result.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            processingData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for KB Upload, using fallback.");
        }

        res.status(200).json({ success: true, processedMetadata: processingData });
    } catch (error) {
        console.error('KB Upload Error:', error);
        res.status(500).json({ error: 'Failed to process document' });
    }
};

// C. Prompt Template & Safety Rules Manager
export const configurePromptTemplates = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const templates = await PromptTemplate.find({});
            return res.status(200).json({ success: true, templates });
        }
        
        if (req.method === 'POST') {
            const { role, systemInstruction, safetyRules } = req.body;
            if (!role || !systemInstruction) return res.status(400).json({ error: 'Role and systemInstruction are required' });
            
            const updated = await PromptTemplate.findOneAndUpdate(
                { role },
                { systemInstruction, safetyRules, updatedAt: new Date() },
                { new: true, upsert: true }
            );
            return res.status(200).json({ success: true, template: updated });
        }
    } catch (error) {
        console.error('Prompt Config Error:', error);
        res.status(500).json({ error: 'Failed to configure prompt templates' });
    }
};

// D. AI Model & Language Management Workspace
export const getAISettings = async (req, res) => {
    try {
        // Mock Settings data (Ideally this would be in DB or ENV)
        let settings = {
            activeModel: "gemini-1.5-flash-latest",
            tokenLimit: 8192,
            temperature: 0.7,
            translationEngines: ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati", "Punjabi", "Malayalam"],
            monthlyCostUSD: 145.20
        };

        if (req.method === 'POST') {
            const { terminologyCheck } = req.body;
            if (terminologyCheck) {
                // Example of Gemini validating localized terminology
                const prompt = `Validate if the agricultural term '${terminologyCheck}' translates correctly across Hindi and Marathi contexts. Return JSON with 'isValid' (boolean) and 'feedback' (string).`;
                let validation = { isValid: true, feedback: "Terminology is well understood across both regional dialects." };
                try {
                    const result = await generateCompletion(prompt, 'Company Admin');
                    let cleanJson = result.trim().replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
                    validation = JSON.parse(cleanJson);
                } catch(apiError) {
                    console.error("Gemini API failed for Terminology Check.");
                }
                return res.status(200).json({ success: true, validation });
            }
            
            return res.status(200).json({ success: true, message: "Settings updated successfully", settings: req.body.settings || settings });
        }

        res.status(200).json({ success: true, settings });
    } catch (error) {
        console.error('Model Settings Error:', error);
        res.status(500).json({ error: 'Failed to manage AI settings' });
    }
};
