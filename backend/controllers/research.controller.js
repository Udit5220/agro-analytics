import Document from '../models/DocumentModel.js';
import ResearchQueryLog from '../models/ResearchQueryLog.js';
import { indexDocument, queryVectorStore, generateCompletion } from '../services/langchain.service.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import { fetchWhitePaperDashboardAI } from '../services/geminiGenaiService.js';

// Upload Document and Extract Text
export const uploadAndProcessDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, buffer, mimetype } = req.file;
    let extractedText = '';
    let fileType = 'txt';

    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
      fileType = 'pdf';
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
      fileType = 'docx';
    } else {
      extractedText = buffer.toString('utf-8');
      fileType = 'txt';
    }

    // Basic prompt to generate initial summary
    const prompt = `You are an agricultural expert. Summarize the following research text into a valid JSON object.
    Keys required: executiveSummary (string), objective (string), methodology (string), findings (string), keyInsights (array of strings), recommendations (string), futureScope (string).
    Text: ${extractedText.substring(0, 10000)} // truncate to avoid token limit just in case
    `;
    
    let summaryData = {};
    try {
        const jsonResponse = await generateCompletion(prompt, req.user ? req.user.role : null);
        let cleanJson = jsonResponse.trim();
        if (cleanJson.startsWith("\`\`\`")) {
          cleanJson = cleanJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
        }
        summaryData = JSON.parse(cleanJson);
    } catch(e) {
        console.error("Failed to generate initial summary via AI:", e);
    }

    // Dynamic Tag Generation for MongoDB and ChromaDB Metadata
    const metaPrompt = `Analyze the following research abstract and extract relevant metadata tags.
    Return ONLY a valid JSON object with the following array keys: cropType, region, soilFactor, climateImpact, tags.
    If a category is not applicable, return an empty array.
    Abstract: ${extractedText.substring(0, 3000)}`;

    let generatedMetadata = {
      cropType: [], region: [], soilFactor: [], climateImpact: [], tags: []
    };

    try {
      const metaResponse = await generateCompletion(metaPrompt, req.user ? req.user.role : null);
      let cleanMetaJson = metaResponse.trim();
      if (cleanMetaJson.startsWith("\`\`\`")) {
        cleanMetaJson = cleanMetaJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
      }
      const parsed = JSON.parse(cleanMetaJson);
      generatedMetadata = { ...generatedMetadata, ...parsed };
    } catch(e) {
      console.error("Failed to generate metadata tags:", e);
    }

    const newDoc = new Document({
      title: originalname,
      originalFileName: originalname,
      fileType,
      textExtract: extractedText,
      summary: summaryData,
      metadata: generatedMetadata
    });

    await newDoc.save();

    // Index document into ChromaDB in background, including the generated metadata
    indexDocument(extractedText, { source: originalname, docId: newDoc._id.toString(), ...generatedMetadata })
      .then(() => {
          newDoc.vectorStoreId = 'agro_research_docs';
          newDoc.save();
      })
      .catch(console.error);

    res.status(201).json({ success: true, document: newDoc });

  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({ error: 'Failed to process document.' });
  }
};

// RAG Search
export const searchResearchInsights = async (req, res) => {
  try {
    const { query } = req.body;
    const userRole = req.user ? req.user.role : 'Unknown';

    if (!query) return res.status(400).json({ error: 'Query is required.' });

    // Log the search query for analytics
    try {
      await ResearchQueryLog.create({ query, userRole, source: 'search' });
    } catch(e) {
      console.error("Failed to log research query:", e);
    }

    const result = await queryVectorStore(query);
    res.status(200).json({ success: true, answer: result.answer, sources: result.sourceDocuments });
  } catch (error) {
    console.error('RAG Search error:', error);
    res.status(500).json({ error: 'Failed to perform search.' });
  }
};

// Generate Persona Insights
export const generatePersonaInsights = async (req, res) => {
    try {
        const { summaryText } = req.body;
        const userRole = req.user ? req.user.role : 'Research Analyst';
        
        let prompt = '';

        // Role-Based Prompt Injection (Prompt Factory)
        if (userRole === 'Research Analyst') {
            prompt = `You are an "Academic Agricultural Scientist". Focus strictly on extracting technical methodologies, data points, statistical results, and formal citations from the following research summary. Do not simplify the language. Summary: ${summaryText}`;
        } else if (userRole === 'Agribusiness Manager') {
            prompt = `You are an "Agribusiness Strategic Consultant". Ignore dense academic jargon. Extract actionable market trends, supply chain impacts, crop demand forecasts, and commercial growth opportunities from the following research summary. Summary: ${summaryText}`;
        } else if (userRole === 'Government Official') {
            prompt = `You are an "Agricultural Policy Advisor". Translate the following research summary into water conservation strategies, crop diversification suggestions, district-level interventions, and subsidy optimization insights. Summary: ${summaryText}`;
        } else if (userRole === 'Company Admin') {
            prompt = `You are a "Corporate IT & AI Systems Executive". Provide a highly detailed, comprehensive operational and architectural analysis of the following research. 
            Focus specifically on:
            1. Enterprise IT architecture impact and data pipeline requirements.
            2. AI/LLM implementation strategies and associated compute cost orchestration.
            3. Data privacy frameworks, zero-trust security audits, and regulatory compliance.
            4. System scalability and vector database retrieval optimization metrics.
            Break down the insights into clear, actionable bullet points tailored for an enterprise technology leader managing agricultural tech infrastructure.
            Summary: ${summaryText}`;
        } else {
            // Default fallback
            prompt = `Explain the following agricultural research summary highlighting practical applications. Summary: ${summaryText}`;
        }

        const insight = await generateCompletion(prompt, userRole);
        res.status(200).json({ success: true, insight });
    } catch(error) {
        console.error('Persona insight error:', error);
        res.status(500).json({ error: 'Failed to generate persona insights.' });
    }
};

// White Paper Generation
export const generateWhitePaper = async (req, res) => {
    try {
        const { topic, crop, state, timePeriod } = req.body;
        
        const prompt = `Write a professional agricultural white paper on the topic: "${topic}".
        Context: Crop: ${crop}, State/Region: ${state}, Time Period: ${timePeriod}.
        Include the following sections with markdown formatting: Executive Summary, Market Analysis, Research Findings, Government Schemes, Industry Trends, Recommendations, and Conclusion.`;
        
        const content = await generateCompletion(prompt, req.user ? req.user.role : null);
        res.status(200).json({ success: true, content });
    } catch (error) {
        console.error('White paper generation error:', error);
        res.status(500).json({ error: 'Failed to generate white paper.' });
    }
};

// Generate insights based on wishlisted papers
export const getWishlistSummary = async (req, res) => {
    try {
        const { wishlist } = req.body;
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Research Analyst');

        if (!wishlist || !Array.isArray(wishlist) || wishlist.length === 0) {
            return res.status(200).json({ success: true, insight: "No wishlisted items found. Bookmark some researches to see a synthesized analysis." });
        }

        const itemsContext = wishlist.map(item => `- ${item.title}: ${item.abstract}`).join('\n');
        const prompt = `You are an expert AI Analyst advising a ${userRole}. The user has wishlisted the following research papers:
        
        ${itemsContext}
        
        Provide a concise, 1-paragraph synthesized insight (around 60 words) that connects these topics and explains why this combination of research is highly strategic for their specific role. Focus on the combined synergy of these papers.
        Do not use markdown formatting like asterisks or bullet points, just output the plain text paragraph.`;

        let generatedInsight = "";
        try {
            generatedInsight = await generateCompletion(prompt, userRole);
        } catch (apiError) {
            console.error("Wishlist Summary Gemini API failed, using fallback:", apiError.message);
            generatedInsight = `[SIMULATED] Based on your selected researches, integrating these methodologies provides a comprehensive strategic advantage for a ${userRole}, maximizing both operational efficiency and long-term sustainability across the targeted agricultural vectors.`;
        }

        res.status(200).json({ success: true, insight: generatedInsight });
    } catch (error) {
        console.error('Wishlist summary error:', error);
        res.status(500).json({ error: 'Failed to generate wishlist summary.' });
    }
};

// AI Voice Assistant Handler
export const handleVoiceCommand = async (req, res) => {
    try {
        const { query } = req.body;
        // The role is passed either via token (req.user) or custom header from the frontend
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');

        if (!query) {
            return res.status(400).json({ error: 'Voice query text is required.' });
        }

        // Enforce RBAC logic dynamically inside the prompt
        const rbacContext = `You are talking to an authorized ${userRole}. Tailor the insight strictly for this role. Only provide data relevant to their specific clearance level and interests (e.g. Government Official gets policy data, Agribusiness Manager gets supply chain data, Farmer gets agronomic/local market data).`;

        const prompt = `You are AgroSense, an advanced AI Voice Assistant.
        ${rbacContext}
        User's Voice Query: "${query}"
        Respond conversationally, concisely (max 3 sentences), and professionally. Provide a deep, actionable insight based on agricultural research.`;

        const insight = await generateCompletion(prompt, userRole);
        
        // Log voice query
        try {
            await ResearchQueryLog.create({ query: `[VOICE] ${query}`, userRole, source: 'voice' });
        } catch(e) {
            console.log("Failed to log voice query:", e.message);
        }

        res.status(200).json({ success: true, insight });

    } catch (error) {
        console.error('Voice Command Error:', error);
        res.status(500).json({ error: 'Failed to process voice command.' });
    }
};

// ------------------------------------------------------------------
// Research Analyst Specific Endpoints
// ------------------------------------------------------------------

// 1. Get Latest Publications (Role Filtered)
export const getLatestPublications = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        const docs = await Document.find({}).sort({ createdAt: -1 }).limit(5);
        
        let allText = docs.length 
          ? docs.map(d => `Title: ${d.title}\nText: ${d.textExtract?.substring(0, 500)}`).join('\n\n')
          : "No documents available in the database.";
        
        const isFarmer = userRole === 'Farmer';
        const isFPO = userRole === 'FPO';
        const isTrader = userRole === 'Commodity Trader';
        const isAnalyst = userRole === 'Research Analyst';
        const isManager = userRole === 'Agribusiness Manager';
        const isGov = userRole === 'Government Official';
        const isAdmin = userRole === 'Company Admin';
        const docCount = (isFarmer || isFPO || isTrader || isAnalyst || isManager || isGov || isAdmin) ? 8 : 3;
        
        const prompt = `You are an expert AI serving a ${userRole}. Extract and return a structured JSON array containing the metadata for the following recent documents.
        If the provided documents text says "No documents available", simulate and generate exactly ${docCount} highly realistic, cutting-edge documents relevant strictly to a ${userRole} working in Indian agriculture. 
        For example: If FPO, generate research on collective farming, bulk trading. If Farmer, highly localized agronomic reports. If Commodity Trader, generate research on macro supply/demand. If Research Analyst, academic biotech studies. If Agribusiness Manager, B2B supply chain and corporate ESG case studies. If Government Official, generate national policy efficacy reports. If Company Admin, generate corporate IT audits, AI systems implementation studies, RAG architecture overviews, and data privacy frameworks in agricultural tech.
        Format each item to explicitly include exactly these keys: 'title', 'authors', 'publicationDate', 'domainFocus', 'twoLineSummary', 'keyImpactMetrics' (array of strings), and 'url' (a real or simulated link).
        CRITICAL REQUIREMENT: Translate the values for 'title', 'domainFocus', and 'twoLineSummary' into ${language}.
        Documents:
        ${allText}
        `;
        
        let parsedPublications = [];
        try {
            const result = await generateCompletion(prompt, req.user ? req.user.role : null);
            let cleanJson = result.trim();
            if (cleanJson.startsWith("\`\`\`")) {
                cleanJson = cleanJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            }
            parsedPublications = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed, using fallback mock data:", apiError.message);
            // Dynamic fallback array creation
            let fallbackArray = [];
            if (userRole === 'FPO') {
                const fpoTitles = [
                    "Optimizing Cold Chain Logistics for Farmer Producer Organizations in Maharashtra",
                    "The Impact of Collective Bargaining on Bulk Commodity Trading",
                    "Digital Traceability Integration in FPO Export Supply Chains",
                    "Financial Feasibility of Shared Drone Spraying Systems in Collectives",
                    "Government Subsidies and Compliance: A Guide for Rural FPOs",
                    "Blockchain-based Procurement Tracking for Large-Scale Farmer Collectives",
                    "Mitigating Price Volatility Through Group Crop Insurance",
                    "Assessing the ROI of Automated Sorting Facilities for FPOs"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": fpoTitles[i],
                    "authors": ["Dr. M. Sharma", "Dr. K. Patel"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "Agri-Logistics & Bulk Trading",
                    "twoLineSummary": "An in-depth analysis on how collective operations and bulk infrastructure investments can significantly improve profit margins for Farmer Producer Organizations.",
                    "keyImpactMetrics": ["+20% Margin Increase", "Reduced Spoilage by 15%"],
                    "url": "https://scholar.google.com/"
                }));
            } else if (userRole === 'Commodity Trader') {
                const traderTitles = [
                    "Global Wheat Supply Shortages and the Impact on Asian Futures",
                    "Arbitrage Opportunities in Non-Basmati Rice Under New Export Quotas",
                    "Climate Volatility and the 2026 Soybean Commodity Index",
                    "Predictive Modeling of Sugar Prices Using Satellite Monsoonal Data",
                    "Hedging Strategies for Cotton Traders Amidst US-China Tariff Shifts",
                    "Analysis of Global Freight Rates on Maize Import Costs",
                    "The Ripple Effect of European Biofuel Mandates on Indian Oilseeds",
                    "Machine Learning Algorithms for High-Frequency Agri-Commodity Trading"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": traderTitles[i],
                    "authors": ["Dr. Analyst"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "Market Volatility & Futures",
                    "twoLineSummary": "A highly detailed macroeconomic analysis focusing on price fluctuations, global demand shifts, and hedging strategies.",
                    "keyImpactMetrics": ["High Volatility Expected", "Arbitrage Potential"],
                    "url": "https://scholar.google.com/"
                }));
            } else if (userRole === 'Farmer') {
                const farmerTitles = [
                    "High-Yield Heat-Resistant Wheat Varieties for Northern India",
                    "Cost-Benefit Analysis of Micro-Irrigation in Smallholder Cotton Farms",
                    "Localized Soil Nutrient Management: Reducing Fertilizer Costs by 15%",
                    "Direct-to-Consumer Market Access Strategies for Rural Farmers",
                    "Early Detection of Pink Bollworm Using Smartphone Imaging",
                    "Impact of Timely Sowing on Kharif Crop Yields During El Nino",
                    "Subsidized Solar Water Pumps: ROI for Individual Farmers",
                    "Crop Rotation Strategies to Naturally Restore Soil Health"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": farmerTitles[i],
                    "authors": ["Dr. Mock Researcher"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "Practical Agronomy",
                    "twoLineSummary": "A highly practical research paper detailing immediate, actionable steps a farmer can take to improve yield and reduce operational costs.",
                    "keyImpactMetrics": ["Positive Yield Trend", "Cost Reduction"],
                    "url": "https://scholar.google.com/"
                }));
            } else if (userRole === 'Research Analyst') {
                const analystTitles = [
                    "CRISPR-Cas9 Mediated Drought Tolerance in Oryza sativa L.",
                    "Statistical Variance in Drone-Based Multispectral Soil Analysis",
                    "Microbiome Sequencing of Nitrogen-Fixing Symbionts in Arid Climates",
                    "Methodological Flaws in Traditional Soil Carbon Sequestration Modeling",
                    "High-Throughput Phenotyping Using Machine Learning in Phenomics",
                    "Comparative Transcriptomics of Salinity Stress in Triticum aestivum",
                    "Next-Gen Sequencing Applications for Agricultural Diagnostics",
                    "A Meta-Analysis on the Efficacy of Bio-Stimulants Under Field Conditions"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": analystTitles[i],
                    "authors": ["Dr. R. Scientist"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "Biotechnology & R&D",
                    "twoLineSummary": "A rigorous, peer-reviewed academic paper focusing on methodology, statistical modeling, and biotechnological breakthroughs.",
                    "keyImpactMetrics": ["High Statistical Significance", "Novel Methodology"],
                    "url": "https://scholar.google.com/"
                }));
            } else if (userRole === 'Agribusiness Manager') {
                const managerTitles = [
                    "B2B Ag-Tech SaaS: ROI Analysis of Supply Chain Automation",
                    "ESG Compliance and Carbon Credit Monetization in Corporate Farming",
                    "Predictive Analytics for Agrochemical Inventory Optimization",
                    "M&A Trends in the Indian Agribusiness Sector: A 2026 Review",
                    "Cold-Chain Logistics Innovation for Export-Oriented Corporations",
                    "The Financial Impact of Corporate Contract Farming on Profit Margins",
                    "B2B Procurement Strategies for Organic Fertilizers at Scale",
                    "Risk Mitigation Models for Corporate Agricultural Supply Chains"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": managerTitles[i],
                    "authors": ["Prof. B. Strategist"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "Corporate Strategy & Supply Chain",
                    "twoLineSummary": "A highly detailed corporate case study focusing on ROI, B2B supply chain efficiency, and scaling operations.",
                    "keyImpactMetrics": ["+12% Operational Efficiency", "ESG Compliance"],
                    "url": "https://scholar.google.com/"
                }));
            } else if (userRole === 'Government Official') {
                const govTitles = [
                    "Economic Survey 2026: The Impact of PM-KISAN on Rural Wealth",
                    "NITI Aayog Report: Digital Agriculture Mission Interoperability",
                    "State-Wise Analysis of Groundwater Depletion vs Subsidy Allocation",
                    "Whitepaper on MSP Reform and Food Security Act Compliance",
                    "National Agri-Infra Fund: Utilization Rates in Tier-2 Districts",
                    "Policy Assessment of Drone Subsidy (SMAM) Penetration",
                    "Fiscal Impact of Export Tariffs on Domestic Basmati Prices",
                    "Climate Resilient Agriculture: A Framework for State Subsidies"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": govTitles[i],
                    "authors": ["Dept. of Agriculture / NITI Aayog"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "Public Policy & Economics",
                    "twoLineSummary": "A macro-level government report detailing the fiscal impact and efficacy of national agricultural policies.",
                    "keyImpactMetrics": ["Policy Efficacy", "Fiscal ROI"],
                    "url": "https://agricoop.nic.in/"
                }));
            } else if (isAdmin) {
                const adminTitles = [
                    "Security Auditing in Multi-Tenant Agricultural RAG Architectures",
                    "Cost Optimization for Enterprise LLM Inferences in AgTech SaaS",
                    "Zero-Trust Frameworks for Cross-Border Crop Yield Data",
                    "Evaluating Vector Database Latency in High-Volume Precision Agriculture",
                    "The Efficacy of Multi-Agent AI Workflows in Supply Chain Routing",
                    "Compliance Architectures for Rural Data Privacy (DPDP Act 2023)",
                    "Orchestrating Cloud Compute for Real-Time Satellite Image Parsing",
                    "Disaster Recovery and High Availability for National Farm Databases"
                ];
                fallbackArray = Array.from({ length: 8 }, (_, i) => ({
                    "title": adminTitles[i],
                    "authors": ["System Architecture Group"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "IT Systems & AI Governance",
                    "twoLineSummary": "A highly technical internal whitepaper detailing the architecture, security, and optimization of enterprise agricultural AI systems.",
                    "keyImpactMetrics": ["Enhanced System Security", "Reduced Inference Latency"],
                    "url": "https://internal.agrotech.local/docs/"
                }));
            } else {
                fallbackArray = Array.from({ length: 3 }, (_, i) => ({
                    "title": `Simulated Study ${i + 1} on Indian Agriculture`,
                    "authors": ["Dr. Mock Researcher"],
                    "publicationDate": "2026-05-15",
                    "domainFocus": "General Agronomy",
                    "twoLineSummary": "A simulated paper showcasing generalized impacts on local farming techniques.",
                    "keyImpactMetrics": ["Positive Yield Trend"],
                    "url": "https://scholar.google.com/"
                }));
            }
            parsedPublications = fallbackArray;
        }
        
        res.status(200).json({ success: true, publications: parsedPublications });
    } catch(err) {
        console.error("Latest Publications Error:", err);
        res.status(500).json({ error: "Failed to fetch latest publications." });
    }
};

// 2. Get Dashboard Summary (Role Filtered)
export const getDashboardSummary = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        const totalDocs = await Document.countDocuments();
        const docs = await Document.find({}, 'metadata').limit(50);
        
        let summaryContext = `Total Documents Analyzed: ${totalDocs}.\n`;
        if (totalDocs > 0) {
          summaryContext += "Recent tags found: " + docs.map(d => (d.metadata?.tags || []).join(', ')).join('; ').substring(0, 1000);
        } else {
          summaryContext += `No documents available. Simulate a highly realistic and impressive weekly synthesis highlighting recent breakthroughs in Indian agriculture tailored specifically for a ${userRole}.`;
        }
        
        const isFarmer = userRole === 'Farmer';
        const isFPO = userRole === 'FPO';
        const isTrader = userRole === 'Commodity Trader';
        const isAnalyst = userRole === 'Research Analyst';
        const isManager = userRole === 'Agribusiness Manager';
        const isAdmin = userRole === 'Company Admin';
        
        let prompt = "";
        
        if (isFarmer) {
            prompt = `You are an AI reporting directly to a Farmer in India. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A highly practical paragraph explaining the week's ag-trends. Translate to ${language}.)
              - 'weatherAlerts': (string, A critical weather alert or "All clear". Translate to ${language}.)
              - 'farmingTips': (array of strings, exactly 4 actionable farming tips based on recent research. Translate to ${language}.)
              - 'marketPrices': (array of exactly 6 objects representing different common Indian crops like Wheat, Rice, Cotton, Soybean, Maize, Sugarcane. Each object has 'crop' (string, translated to ${language}), 'price' (string, e.g. "₹2500/Qtl"), 'trend' (string, 'up' or 'down'))
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else if (isFPO) {
            prompt = `You are an AI reporting directly to an FPO (Farmer Producer Organization) in India. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A highly practical paragraph explaining the week's bulk ag-trends. Translate to ${language}.)
              - 'supplyChainAlerts': (string, A critical logistics or supply chain alert. Translate to ${language}.)
              - 'policyUpdates': (array of strings, exactly 3 actionable policy or compliance updates for FPOs. Translate to ${language}.)
              - 'bulkMarketPrices': (array of exactly 6 objects representing bulk commodities. Each object has 'commodity' (string, translated to ${language}), 'bulkPrice' (string, e.g. "₹24,000/Ton"), 'demand' (string, 'High', 'Medium', 'Low'))
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else if (isTrader) {
            prompt = `You are an AI reporting directly to a Commodity Trader in India. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A macroeconomic paragraph explaining the week's global trade trends. Translate to ${language}.)
              - 'exportImportAlerts': (string, A critical global trade or tariff alert. Translate to ${language}.)
              - 'globalMarketTrends': (array of strings, exactly 3 actionable macro-economic trends. Translate to ${language}.)
              - 'commodityFutures': (array of exactly 6 objects representing traded commodities. Each object has 'commodity' (string, translated to ${language}), 'futuresPrice' (string, e.g. "₹2450/Qtl"), 'volume' (string, 'High', 'Medium', 'Low'))
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else if (isAnalyst) {
            prompt = `You are an AI reporting directly to a Research Analyst in India. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A highly academic paragraph explaining the week's R&D breakthroughs. Translate to ${language}.)
              - 'peerReviewedAlerts': (string, A critical update on a recent high-impact journal publication. Translate to ${language}.)
              - 'methodologyBreakthroughs': (array of strings, exactly 3 cutting-edge lab or analytical techniques. Translate to ${language}.)
              - 'fundingAndGrants': (array of exactly 6 objects representing research grants. Each object has 'grantName' (string, translated to ${language}), 'amount' (string, e.g. "₹50 Lakh"), 'deadline' (string, e.g. "Oct 2026"))
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else if (isManager) {
            prompt = `You are an AI reporting directly to an Agribusiness Manager in India. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A high-level corporate B2B paragraph explaining the week's operational trends. Translate to ${language}.)
              - 'supplyChainOptimization': (string, A critical update on logistics or cold-chain efficiency. Translate to ${language}.)
              - 'corporatePolicyUpdates': (array of strings, exactly 3 actionable corporate compliance or ESG updates. Translate to ${language}.)
              - 'b2bMarketPrices': (array of exactly 6 objects representing B2B products like Fertilizers or Machinery. Each object has 'product' (string, translated to ${language}), 'bulkPrice' (string, e.g. "₹1200/Bag"), 'availability' (string, 'High', 'Medium', 'Low'))
              - 'investmentOpportunities': (array of exactly 3 objects representing new Agribusiness investment areas. Each object has 'sector' (string, translated to ${language}), 'roi' (string, e.g. "18%"), 'riskLevel' (string, 'High', 'Medium', 'Low'))
              - 'laborMarketTrends': (string, A paragraph explaining labor availability vs mechanization costs. Translate to ${language}.)
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else if (userRole === 'Government Official') {
            prompt = `You are an AI reporting directly to a Government Official in India. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A macro-level policy paragraph explaining the week's national ag-trends. Translate to ${language}.)
              - 'subsidyUpdates': (array of strings, exactly 3 updates on national or state schemes. Translate to ${language}.)
              - 'regulatoryAlerts': (string, A critical alert regarding MSP, export bans, or compliance. Translate to ${language}.)
              - 'environmentalImpact': (string, A paragraph explaining an urgent ecological issue like groundwater depletion. Translate to ${language}.)
              - 'stateWiseYieldEstimates': (array of exactly 4 objects. Each object has 'state' (string, translated to ${language}), 'crop' (string, translated to ${language}), 'estimate' (string, e.g. "+4% YoY"))
              - 'budgetAllocations': (array of exactly 3 objects. Each object has 'scheme' (string, translated to ${language}), 'allocation' (string, e.g. "₹60,000 Cr"), 'status' (string, e.g. "Disbursed"))
              - 'agriExportTargets': (array of exactly 3 objects. Each object has 'commodity' (string, translated to ${language}), 'target' (string, e.g. "50k Tonnes"), 'actual' (string, e.g. "45k Tonnes"), 'status' (string, 'On Track', 'Behind'))
              - 'infrastructureProjects': (array of exactly 2 objects. Each object has 'project' (string, translated to ${language}), 'completion' (string, e.g. "85%"), 'impact' (string, translated to ${language}))
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else if (isAdmin) {
            summaryContext = "Generate 3 system health alerts, 3 model adoption metrics, 2 API cost estimates, and 2 security audit logs.";
            prompt = `You are an AI System Administrator reporting to the Company Admin.
            Generate a JSON object summarizing the AI platform's usage.
            The JSON must contain the exact following structure:
              - 'systemHealthAlerts': (array of strings, translated to ${language})
              - 'modelAdoption': (array of exactly 3 objects. Each object has 'department' (string, translated to ${language}), 'adoptionRate' (string, e.g. "85%"), 'status' (string, 'Optimal', 'Low'))
              - 'apiCostEstimates': (array of exactly 2 objects. Each object has 'service' (string, translated to ${language}), 'estimatedCost' (string, e.g. "$450"), 'trend' (string, 'up', 'down'))
              - 'securityAuditLogs': (array of exactly 2 objects. Each object has 'event' (string, translated to ${language}), 'severity' (string, 'High', 'Medium', 'Low'), 'timestamp' (string, e.g. "2 hours ago"))
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        } else {
            prompt = `You are an AI reporting directly to a ${userRole}. Based on the following metrics/instructions, generate a strict JSON object with EXACTLY the following keys:
              - 'weeklySummary': (string, A highly relevant paragraph explaining the week's trends. Translate to ${language}.)
              Do not include markdown formatting, just raw JSON.
              Metrics/Instructions: ${summaryContext}`;
        }
        
        let finalData = {};
        try {
            const result = await generateCompletion(prompt, req.user ? req.user.role : null);
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            finalData = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed, using fallback mock data for summary:", apiError.message);
            if (isFPO) {
                finalData = {
                    weeklySummary: "This week's research heavily emphasizes collective bargaining and the integration of IoT sensors for bulk storage optimization.",
                    supplyChainAlerts: "Highway transit delays expected in northern corridors.",
                    policyUpdates: ["New government subsidy available for solar cold storage", "GST compliance deadline extended for rural FPOs", "Export quality standards updated for Basmati rice"],
                    bulkMarketPrices: [
                      {commodity: "Wheat", bulkPrice: "₹21,000/Ton", demand: "High"},
                      {commodity: "Rice", bulkPrice: "₹28,500/Ton", demand: "Medium"},
                      {commodity: "Cotton", bulkPrice: "₹71,000/Ton", demand: "High"},
                      {commodity: "Soybean", bulkPrice: "₹47,000/Ton", demand: "Low"},
                      {commodity: "Maize", bulkPrice: "₹18,000/Ton", demand: "High"},
                      {commodity: "Sugarcane", bulkPrice: "₹3,100/Ton", demand: "Medium"}
                    ]
                };
            } else if (isTrader) {
                finalData = {
                    weeklySummary: "Global wheat indices have surged 4% following unseasonal rains in North America, triggering arbitrage opportunities across Asian commodity markets.",
                    exportImportAlerts: "Export ban lifted on non-basmati white rice effective next month.",
                    globalMarketTrends: ["European biofuel mandates driving up oilseed futures", "Freight rates stabilizing across the Suez canal", "High volatility expected in sugar indices due to El Nino"],
                    commodityFutures: [
                      {commodity: "Wheat", futuresPrice: "₹2,450/Qtl", volume: "High"},
                      {commodity: "Rice", futuresPrice: "₹3,100/Qtl", volume: "High"},
                      {commodity: "Cotton", futuresPrice: "₹7,500/Qtl", volume: "Medium"},
                      {commodity: "Soybean", futuresPrice: "₹5,100/Qtl", volume: "Low"},
                      {commodity: "Maize", futuresPrice: "₹2,050/Qtl", volume: "High"},
                      {commodity: "Sugarcane", futuresPrice: "₹340/Qtl", volume: "Medium"}
                    ]
                };
            } else if (isAnalyst) {
                finalData = {
                    weeklySummary: "Recent developments in CRISPR-Cas9 application have significantly accelerated the timeline for developing drought-tolerant transgenic varieties of Oryza sativa L.",
                    peerReviewedAlerts: "A highly cited paper on microbiome sequencing was recently published in 'Nature Agronomy'.",
                    methodologyBreakthroughs: ["High-throughput phenotyping with UAVs", "Single-cell RNA sequencing for root microbiomes", "AI-driven geospatial yield modeling"],
                    fundingAndGrants: [
                      {grantName: "ICAR Genomics Grant", amount: "₹85 Lakh", deadline: "Nov 2026"},
                      {grantName: "AgriTech Innovation Fund", amount: "₹40 Lakh", deadline: "Oct 2026"},
                      {grantName: "Climate Resilience Research", amount: "₹1.2 Crore", deadline: "Jan 2027"},
                      {grantName: "Soil Biome Exploration", amount: "₹65 Lakh", deadline: "Dec 2026"},
                      {grantName: "Precision Ag Methods", amount: "₹30 Lakh", deadline: "Sep 2026"},
                      {grantName: "Water Conservation R&D", amount: "₹55 Lakh", deadline: "Feb 2027"}
                    ]
                };
            } else if (isManager) {
                finalData = {
                    weeklySummary: "B2B procurement optimizations in Q3 have led to a 12% reduction in cold-chain logistics costs, heavily driven by new predictive AI routing software integrations.",
                    supplyChainOptimization: "New automated sorting lines reduced post-harvest transit time by 48 hours.",
                    corporatePolicyUpdates: ["New corporate tax incentives for rural ESG compliance", "Mandatory supply chain traceability tracking required by 2027", "Subsidies announced for fleet electrification"],
                    b2bMarketPrices: [
                      {product: "Fertilizer NPK", bulkPrice: "₹1,250/Bag", availability: "High"},
                      {product: "Urea (Bulk)", bulkPrice: "₹260/Bag", availability: "Medium"},
                      {product: "Drip Irrigation Tubes", bulkPrice: "₹14/Meter", availability: "High"},
                      {product: "Tractor Leases", bulkPrice: "₹45,000/Mo", availability: "Low"},
                      {product: "Pesticide (Organic)", bulkPrice: "₹850/L", availability: "Medium"},
                      {product: "Cold Storage Rent", bulkPrice: "₹120/SqFt", availability: "High"}
                    ],
                    investmentOpportunities: [
                      {sector: "AI-Driven Drone Fleet Services", roi: "22%", riskLevel: "High"},
                      {sector: "Corporate Bio-Fertilizer Plants", roi: "15%", riskLevel: "Medium"},
                      {sector: "Automated Greenhouse Facilities", roi: "18%", riskLevel: "Low"}
                    ],
                    laborMarketTrends: "Rural labor shortages have increased manual harvesting costs by 8%, accelerating the corporate transition towards mechanized harvesters and AI-driven sorting facilities."
                };
            } else if (userRole === 'Government Official') {
                finalData = {
                    weeklySummary: "The newly released Digital Agriculture Mission reports a 34% increase in unified farmer registry enrollments across central states, significantly streamlining direct benefit transfers.",
                    regulatoryAlerts: "Immediate export tariffs on onions have been extended for another quarter to maintain domestic price stability.",
                    subsidyUpdates: ["PM-KISAN 15th installment finalized for DBT", "Agri-Infra Fund interest subvention extended to FPOs", "SMAM drone subsidy applications extended by 30 days"],
                    environmentalImpact: "Groundwater depletion rates in Haryana and Punjab persist at 1.5m per year; urgent crop diversification incentives required in the upcoming Kharif season.",
                    stateWiseYieldEstimates: [
                      {state: "Punjab", crop: "Wheat", estimate: "+4.2% YoY"},
                      {state: "Maharashtra", crop: "Sugarcane", estimate: "-2.1% YoY"},
                      {state: "Madhya Pradesh", crop: "Soybean", estimate: "+6.5% YoY"},
                      {state: "West Bengal", crop: "Rice", estimate: "+1.8% YoY"}
                    ],
                    budgetAllocations: [
                      {scheme: "PM-KISAN", allocation: "₹60,000 Cr", status: "75% Disbursed"},
                      {scheme: "Agri-Infra Fund", allocation: "₹1 Lakh Cr", status: "Ongoing"},
                      {scheme: "Per Drop More Crop", allocation: "₹4,000 Cr", status: "Under Review"}
                    ],
                    agriExportTargets: [
                      {commodity: "Non-Basmati Rice", target: "5.5M Tons", actual: "4.8M Tons", status: "Behind"},
                      {commodity: "Spices & Extracts", target: "1.2M Tons", actual: "1.3M Tons", status: "On Track"},
                      {commodity: "Marine Products", target: "$8 Billion", actual: "$6.2 Billion", status: "Behind"}
                    ],
                    infrastructureProjects: [
                      {project: "Mega Food Park (Godavari)", completion: "88%", impact: "Will support 12,000 local farmers."},
                      {project: "National Cold Chain Grid Phase-2", completion: "45%", impact: "Expected to reduce transit spoilage by 18%."}
                    ]
                };
            } else if (isAdmin) {
                finalData = {
                    systemHealthAlerts: [
                        "Vector DB memory usage approaching 85%. Consider scaling up cluster.",
                        "API rate limits for third-party weather endpoints are stable.",
                        "New Gemini-1.5-Pro integration is fully operational with 1.2s avg latency."
                    ],
                    modelAdoption: [
                        {department: "Agribusiness Ops", adoptionRate: "92%", status: "Optimal"},
                        {department: "Field Agronomy", adoptionRate: "45%", status: "Low"},
                        {department: "Commodity Trading", adoptionRate: "88%", status: "Optimal"}
                    ],
                    apiCostEstimates: [
                        {service: "Gemini Pro Inferences", estimatedCost: "$1,250", trend: "up"},
                        {service: "Vector Database Storage", estimatedCost: "$320", trend: "down"}
                    ],
                    securityAuditLogs: [
                        {event: "Failed login attempt from unauthorized IP", severity: "High", timestamp: "1 hour ago"},
                        {event: "Bulk data export initiated by Analyst", severity: "Medium", timestamp: "4 hours ago"}
                    ]
                };
            } else {
                finalData = {
                    weeklySummary: "This week's research heavily emphasizes the integration of IoT sensors and drone-based imaging to combat climate-induced pest variations.",
                    weatherAlerts: "No critical alerts. Moderate rain expected.",
                    farmingTips: ["Check soil moisture", "Prepare for Kharif sowing", "Monitor pest activity", "Optimize fertilizer use"],
                    marketPrices: [
                      {crop: "Wheat", price: "₹2125/Qtl", trend: "up"},
                      {crop: "Rice", price: "₹2950/Qtl", trend: "down"},
                      {crop: "Cotton", price: "₹7200/Qtl", trend: "up"},
                      {crop: "Soybean", price: "₹4800/Qtl", trend: "down"},
                      {crop: "Maize", price: "₹1900/Qtl", trend: "up"},
                      {crop: "Sugarcane", price: "₹315/Qtl", trend: "up"}
                    ]
                };
            }
        }
        
        res.status(200).json({ 
            success: true, 
            metrics: { totalDocs }, 
            ...finalData
        });
    } catch (err) {
        console.error("Dashboard Summary Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard summary." });
    }
};

// 2b. Get Dashboard Charts (Role Filtered)
export const getDashboardCharts = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        
        const prompt = `You are a Data Analyst AI reporting to a ${userRole}. 
        Generate an array of exactly 2 highly relevant, realistic data charts tailored for this role's specific interests in Indian agriculture (e.g. for Farmer: Crop Yields, Local Market Prices, or Rainfall. For Gov Official: Policy Budget Allocation, District Interventions).
        Format your response strictly as a JSON array of objects. Each object must have:
        - 'title' (string, translated to ${language})
        - 'type' (string, either 'bar', 'area', or 'pie')
        - 'dataKey' (string, English, e.g. 'value' or 'papers')
        - 'data' (array of objects, where each object has a 'name' (translated to ${language}) and a numerical value corresponding to the dataKey). 
        Do not include markdown blocks, just raw JSON.`;
        
        let parsedCharts = [];
        try {
            const result = await generateCompletion(prompt, req.user ? req.user.role : null);
            const match = result.match(/\[[\s\S]*\]/);
            const cleanJson = match ? match[0] : result.trim();
            parsedCharts = JSON.parse(cleanJson);
        } catch (apiError) {
            console.error("Gemini API failed for Charts, using fallback:", apiError.message);
            const isFarmer = userRole === 'Farmer';
            const isFPO = userRole === 'FPO';
            const isTrader = userRole === 'Commodity Trader';
            const isAnalyst = userRole === 'Research Analyst';
            const isManager = userRole === 'Agribusiness Manager';
            const isGov = userRole === 'Government Official';
            const isAdmin = userRole === 'Company Admin';

            if (isFarmer) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] Quarterly Crop Yield Estimates",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Q1', value: 12}, {name: 'Q2', value: 18}, {name: 'Q3', value: 25}, {name: 'Q4', value: 15}]
                    },
                    {
                        title: "[SIMULATED] Local Market Prices (₹/Qtl)",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Wheat', value: 2125}, {name: 'Rice', value: 2950}, {name: 'Cotton', value: 7200}]
                    }
                ];
            } else if (isFPO) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] Collective Procurement Volume (Tons)",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Q1', value: 450}, {name: 'Q2', value: 890}, {name: 'Q3', value: 1200}, {name: 'Q4', value: 950}]
                    },
                    {
                        title: "[SIMULATED] Storage Capacity Utilization (%)",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Cold Storage', value: 85}, {name: 'Dry Warehouse', value: 60}, {name: 'Sorting Lines', value: 92}]
                    }
                ];
            } else if (isTrader) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] Global Futures Volatility Index",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Jan', value: 14}, {name: 'Feb', value: 28}, {name: 'Mar', value: 42}, {name: 'Apr', value: 18}]
                    },
                    {
                        title: "[SIMULATED] Export Volume by Commodity (K-Tons)",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Basmati', value: 450}, {name: 'Spices', value: 320}, {name: 'Sugar', value: 890}]
                    }
                ];
            } else if (isAnalyst) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] Ag-Tech Patent Filings (YoY)",
                        type: "area",
                        dataKey: "value",
                        data: [{name: '2023', value: 120}, {name: '2024', value: 210}, {name: '2025', value: 340}, {name: '2026', value: 520}]
                    },
                    {
                        title: "[SIMULATED] Research Grants by Sector (₹ Crores)",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Genomics', value: 45}, {name: 'Soil AI', value: 85}, {name: 'Drones', value: 30}]
                    }
                ];
            } else if (isManager) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] B2B Supply Chain Efficiency (%)",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Q1', value: 72}, {name: 'Q2', value: 78}, {name: 'Q3', value: 85}, {name: 'Q4', value: 92}]
                    },
                    {
                        title: "[SIMULATED] ESG Compliance Status",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Emissions', value: 88}, {name: 'Waste Reduction', value: 65}, {name: 'Energy', value: 95}]
                    }
                ];
            } else if (isGov) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] PM-KISAN Disbursal Rate (Crores)",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Q1', value: 15000}, {name: 'Q2', value: 18000}, {name: 'Q3', value: 22000}, {name: 'Q4', value: 24000}]
                    },
                    {
                        title: "[SIMULATED] State-Wise Water Stress Interventions",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Punjab', value: 120}, {name: 'Haryana', value: 95}, {name: 'Rajasthan', value: 145}]
                    }
                ];
            } else if (isAdmin) {
                parsedCharts = [
                    {
                        title: "[SIMULATED] Daily API Token Usage (Tokens)",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Mon', value: 1.2e6}, {name: 'Tue', value: 2.4e6}, {name: 'Wed', value: 1.8e6}, {name: 'Thu', value: 3.2e6}]
                    },
                    {
                        title: "[SIMULATED] Active Users by Role",
                        type: "pie",
                        dataKey: "value",
                        data: [{name: 'Farmers', value: 450}, {name: 'Traders', value: 120}, {name: 'Managers', value: 85}]
                    }
                ];
            } else {
                parsedCharts = [
                    {
                        title: "[SIMULATED] General Quarterly Analysis",
                        type: "area",
                        dataKey: "value",
                        data: [{name: 'Q1', value: 120}, {name: 'Q2', value: 190}, {name: 'Q3', value: 150}, {name: 'Q4', value: 280}]
                    },
                    {
                        title: "[SIMULATED] General Metrics Breakdown",
                        type: "bar",
                        dataKey: "value",
                        data: [{name: 'Metric A', value: 45}, {name: 'Metric B', value: 60}, {name: 'Metric C', value: 30}]
                    }
                ];
            }
        }
        
        res.status(200).json({ success: true, charts: parsedCharts });
    } catch (err) {
        console.error("Dashboard Charts Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard charts." });
    }
};

// 3. Summarize Document Strict
export const summarizeDocument = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required." });
        
        const isFarmer = userRole === 'Farmer';
        const isFPO = userRole === 'FPO';
        const isTrader = userRole === 'Commodity Trader';
        const isAnalyst = userRole === 'Research Analyst';
        const isManager = userRole === 'Agribusiness Manager';
        const isGov = userRole === 'Government Official';
        const isAdmin = userRole === 'Company Admin';
        
        let roleSpecificInstructions = `You are an AI analyst summarizing agricultural research directly for a ${userRole}. Provide a highly detailed summary.`;
        if (isFarmer) {
            roleSpecificInstructions = `You are an expert Agricultural Advisor talking directly to a Farmer on the ground.
               CRITICAL: You must provide a HIGHLY DETAILED, STEP-BY-STEP, MULTI-PARAGRAPH breakdown of the research.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Core Insight: Explain the research simply but with deep detail on what was discovered.
               2. Financial & Yield Impact: Provide exact numerical estimates on cost savings, yield boosts, or market timing strategies.
               3. Step-by-Step Action Plan: List out exactly what the farmer should do tomorrow (e.g., specific fertilizer ratios, exact seed variants, precise water measurements).`;
        } else if (isFPO) {
            roleSpecificInstructions = `You are an expert Agri-Business Consultant talking directly to a Farmer Producer Organization (FPO).
               CRITICAL: You must provide a HIGHLY DETAILED, MULTI-PARAGRAPH breakdown of the research.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Core Insight for Collectives: Explain the research with a focus on collective farming, bulk storage, or supply chain.
               2. Financial Impact: Provide estimates on bulk financial negotiations, economies of scale, or export value.
               3. FPO Action Plan: List out exactly what the FPO management should do (e.g., bulk procurement strategies, compliance checks, member coordination).`;
        } else if (isTrader) {
            roleSpecificInstructions = `You are an expert Quantitative Market Analyst talking directly to a Commodity Trader.
               CRITICAL: You must provide a HIGHLY DETAILED, MULTI-PARAGRAPH breakdown of the research through a macroeconomic lens.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Core Market Insight: Explain how the research affects global/regional supply and demand curves.
               2. Arbitrage & Trading Impact: Provide exact numerical estimates on price volatility, futures projections, or hedging risks.
               3. Trader Action Plan: List out exactly what the trader should do (e.g., specific long/short positions, commodities to hedge, markets to arbitrage).`;
        } else if (isAnalyst) {
            roleSpecificInstructions = `You are a Senior Principal Scientist summarizing a peer-reviewed paper for a Research Analyst.
               CRITICAL: You must provide a HIGHLY DETAILED, MULTI-PARAGRAPH academic breakdown of the research.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Core Scientific Finding: Deep dive into the academic discovery, biological mechanisms, or algorithms.
               2. Methodology Assessment: Critique the statistical variance, control groups, and lab techniques used.
               3. R&D Next Steps: Propose follow-up study ideas, open scientific questions, and potential grant funding angles.`;
        } else if (isManager) {
            roleSpecificInstructions = `You are an Executive Business Strategist summarizing a corporate case study for an Agribusiness Manager.
               CRITICAL: You must provide a HIGHLY DETAILED, MULTI-PARAGRAPH corporate breakdown of the research.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Strategic Business Insight: Detail the core corporate takeaway, efficiency gains, or B2B supply chain improvements.
               2. Operational & Financial Impact: Provide calculated ROI, scalability estimates, and ESG cost reductions.
               3. Managerial Action Plan: Propose immediate operational steps for the corporate leadership to integrate these findings.`;
        } else if (isGov) {
            roleSpecificInstructions = `You are a Senior Policy Advisor summarizing a legislative document or economic survey for a Government Official.
               CRITICAL: You must provide a HIGHLY DETAILED, MULTI-PARAGRAPH macro-economic breakdown of the document.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Policy Efficacy & National Impact: Detail the core legislative takeaway, highlighting national food security or scheme penetration.
               2. Fiscal & Economic Assessment: Provide calculated budgetary impacts, state-level ROI, and inflation/export metrics.
               3. Legislative Directives: Propose actionable next steps for government committees, MSP adjustments, or subsidy realignments.`;
        } else if (isAdmin) {
            roleSpecificInstructions = `You are a Corporate IT & AI Systems Executive summarizing a technical whitepaper for a Company Admin.
               CRITICAL: You must provide a HIGHLY DETAILED, MULTI-PARAGRAPH architectural and operational breakdown of the research.
               Do not give a generic summary. Provide at least 3 detailed paragraphs:
               1. Enterprise Architecture Impact: Detail the core IT/AI systems takeaway, focusing on data pipelines, vector DB scaling, or LLM infrastructure.
               2. Security & Compliance Assessment: Provide specific insights on zero-trust frameworks, DPDP Act 2023 compliance, and access controls.
               3. Infrastructure Action Plan: Propose immediate operational steps for the IT department regarding compute cost orchestration, disaster recovery, or system auditing.`;
        }

        const prompt = `${roleSpecificInstructions}
        Summarize the following document into a strict JSON object with exactly these keys: 'executiveSummary', 'methodology', 'quantitativeDataFindings', 'researchLimitations', 'citations'. The citations should be an array of APA/IEEE formatted strings generated based on the context.
        CRITICAL REQUIREMENT: Translate the values for 'executiveSummary', 'methodology', 'quantitativeDataFindings', and 'researchLimitations' into ${language}. Keep the JSON keys in English.
        Make sure the 'executiveSummary' is very long and highly detailed.
        Text: ${text.substring(0, 8000)}`;
        
        let parsedSummary;
        
        try {
            const result = await generateCompletion(prompt, req.user ? req.user.role : null);
            
            // Extract JSON block even if there is surrounding text
            const match = result.match(/\{[\s\S]*\}/);
            const cleanJson = match ? match[0] : result.trim();
            
            parsedSummary = JSON.parse(cleanJson);
        } catch (apiError) {
            console.error("Gemini API failed or returned malformed JSON, using fallback mock data:", apiError.message);
            
            // Extract title for dynamic mock data
            let mockTitle = "the selected research paper";
            const titleMatch = text.match(/Title:\s*(.+)/);
            if (titleMatch) mockTitle = titleMatch[1];
            
            let mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\nAn executive analysis of "${mockTitle}". This paper demonstrates significant advancements in agricultural methodology, specifically targeting resilience and modern techniques.`;
            let mockMethodology = "A multi-site comparative study utilizing advanced telemetry, IoT sensors, and automated data collection.";
            let mockFindings = `Analysis of "${mockTitle}" indicates a 20% increase in yield metrics and a 15% reduction in overall resource usage across test sites.`;
            
            if (isFarmer) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Core Insight:**\nThis research on "${mockTitle}" reveals a breakthrough in localized agricultural practices. It demonstrates that by slightly altering the sowing window and utilizing precise micro-irrigation schedules, soil moisture retention improves drastically during dry spells. This minimizes the stress on the crop roots, leading to a much healthier vegetative growth phase.\n\n**2. Financial & Yield Impact:**\nApplying these methods can result in a direct yield boost of approximately 18-22% per acre. More importantly, the reduction in unnecessary watering cuts irrigation costs by nearly ₹1,200 per acre, providing a significant boost to your overall profit margin for the season.\n\n**3. Step-by-Step Action Plan:**\n- **Tomorrow:** Check the soil moisture levels in your primary field using the hand-feel method or a basic sensor.\n- **This Week:** Delay your next heavy irrigation cycle by 2 days to encourage deeper root growth.\n- **Next Month:** When purchasing seeds for the next cycle, ask your supplier for the specific drought-resistant variant mentioned in this study (e.g., HD-3226 for wheat).`;
                mockMethodology = "On-ground field trials conducted across 50 small-holder farms in central India, measuring daily soil moisture and final crop yield over two seasons.";
                mockFindings = "Farmers who followed the adjusted schedule saw an average yield of 24 quintals/acre compared to the control group's 19 quintals/acre, alongside a 20% drop in water usage.";
            } else if (isFPO) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Core Insight for Collectives:**\nThis research on "${mockTitle}" outlines a highly efficient model for bulk aggregation and decentralized cold storage. By pooling resources to establish solar-powered micro-cold storage units at the village level, FPOs can drastically reduce post-harvest losses and bypass middle-men during peak harvest gluts.\n\n**2. Financial Impact:**\nImplementing this collective storage model allows the FPO to delay selling produce by 3-4 weeks, capturing off-season price premiums of up to 35%. The initial CAPEX for the solar units is recovered within 1.5 to 2 harvest cycles due to the sheer volume of saved produce and better price realization.\n\n**3. FPO Action Plan:**\n- **Immediate:** Convene a board meeting to assess the volume of highly perishable crops (like tomatoes or onions) expected this season.\n- **Short-Term:** Apply for the newly announced rural infrastructure subsidy scheme to offset 40% of the cold storage installation costs.\n- **Long-Term:** Draft a member-agreement ensuring that 80% of the collective's produce is routed through the new storage facility to guarantee operational capacity.`;
                mockMethodology = "Financial modeling and logistical analysis of 15 FPOs operating in rural districts, tracking price realization and post-harvest spoilage rates.";
                mockFindings = "FPOs utilizing decentralized cold chains reduced spoilage from 22% to 4%, increasing collective net revenue by an average of ₹14.5 Lakhs per season.";
            } else if (isTrader) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Core Market Insight:**\nThis research on "${mockTitle}" highlights a critical shift in global supply chains caused by recent climate anomalies in major exporting nations. The data indicates a severe contraction in global wheat reserves, which will fundamentally distort the supply-demand equilibrium across Asian markets over the next two quarters.\n\n**2. Arbitrage & Trading Impact:**\nThe anticipated supply shock is projected to increase price volatility by 40% on the NCDEX. Futures for December deliveries are undervalued by approximately 12-15% based on the predictive models shown in the paper. Furthermore, export tariffs are highly likely to be restructured, creating a brief but highly profitable arbitrage window between domestic surplus zones and international ports.\n\n**3. Trader Action Plan:**\n- **Immediate Position:** Take a long position on Q4 wheat futures to capitalize on the upcoming supply shock.\n- **Hedging Strategy:** Hedge exposure by shorting correlated fertilizer indices, as lower planting acreage will suppress chemical demand.\n- **Market Target:** Monitor port authorities in Gujarat for early lifting of export quotas to execute immediate arbitrage.`;
                mockMethodology = "Quantitative modeling of global supply chains overlaid with predictive weather data and historical commodity price fluctuations.";
                mockFindings = "The models predict a 90% probability of a 15% price surge in Q4 futures, accompanied by a sharp widening of regional arbitrage spreads.";
            } else if (isAnalyst) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Core Scientific Finding:**\nThis research on "${mockTitle}" demonstrates a breakthrough in identifying genetic markers associated with salt-tolerance in arid environments. The authors successfully utilized CRISPR-Cas9 techniques to modify the vacuolar Na+/H+ antiporter expression, leading to a 45% increase in cellular survival under hyperosmotic stress conditions.\n\n**2. Methodology Assessment:**\nThe study exhibits robust experimental design with a well-isolated control group consisting of wild-type strains. The statistical variance across the 5 replications was low (p < 0.01). However, the methodology relies heavily on lab-controlled environments, meaning field-level efficacy and cross-pollination risks remain unassessed. The usage of high-throughput phenotyping greatly enhances the reliability of their quantitative claims.\n\n**3. R&D Next Steps:**\n- **Follow-up Study:** A secondary study should be initiated to test these transgenic lines in actual saline soils across coastal regions over two full harvest cycles.\n- **Grant Angle:** Apply for the ICAR 'Climate Resilient Agriculture' grant, framing the proposal around scaling this exact CRISPR methodology for commercial viability.\n- **Open Question:** Investigate whether this genetic modification inadvertently suppresses the plant's natural immune response to local fungal pathogens.`;
                mockMethodology = "In vitro gene editing using CRISPR-Cas9, followed by transcriptomic analysis and high-throughput cellular phenotyping in controlled greenhouse saline environments.";
                mockFindings = "Modified subjects exhibited a 45% higher survival rate at 150mM NaCl concentration compared to the wild-type control group.";
            } else if (isManager) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Strategic Business Insight:**\nThis corporate case study on "${mockTitle}" outlines a comprehensive integration of AI-driven predictive logistics within B2B supply chains. By automating fleet routing and real-time cold-chain telemetry, agribusinesses can drastically reduce the operational bottlenecks associated with perishable transport.\n\n**2. Operational & Financial Impact:**\nThe integration models suggest an estimated 14% reduction in overall fuel and transit costs. Furthermore, spoilage rates drop by 6%, creating a highly favorable 18-month ROI for the initial software CAPEX. Additionally, the tracking system automatically ensures compliance with the upcoming 2027 ESG emissions regulations.\n\n**3. Managerial Action Plan:**\n- **Immediate Step:** Audit the current cold-chain fleet to identify which transport units lack real-time IoT temperature logging.\n- **Vendor Assessment:** Issue RFPs to Top 3 AgTech SaaS providers to pilot predictive routing software on a single high-volume transit corridor.\n- **Corporate Policy:** Update the procurement SLA with 3rd-party logistics providers, mandating automated transit reporting by Q4.`;
                mockMethodology = "A robust B2B operational analysis of 5 tier-one agribusiness corporations over a 2-year predictive routing software rollout.";
                mockFindings = "Implementation resulted in a 14% drop in transit overhead and ensured 100% compliance with preliminary regional ESG guidelines.";
            } else if (isGov) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Policy Efficacy & National Impact:**\nThis government whitepaper on "${mockTitle}" evaluates the interoperability of the Digital Agriculture Mission. The findings confirm that linking land records (Bhoomi) with the centralized AgriStack has successfully removed 2.4 million ghost beneficiaries from the national registry, ensuring tighter national food security metrics.\n\n**2. Fiscal & Economic Assessment:**\nThe fiscal impact is highly positive. The deduplication of the registry saved approximately ₹1,200 Crore in the last financial year alone. However, state-wise adoption remains asymmetric; while central states show a 92% adoption rate, eastern corridors lag at 41%, temporarily skewing the distribution of the Agri-Infra fund allocations.\n\n**3. Legislative Directives:**\n- **Immediate Step:** The inter-ministerial committee must mandate a hard deadline of Dec 2026 for all remaining states to API-integrate their land records with the central stack.\n- **Budget Reallocation:** Temporarily divert 15% of the saved PM-KISAN funds towards digital literacy camps in the lagging eastern districts.\n- **Regulatory Action:** Draft a gazette notification requiring biometric verification for all bulk fertilizer subsidies starting next Rabi season.`;
                mockMethodology = "A comprehensive macroeconomic review of state-level API integration logs and Direct Benefit Transfer (DBT) fiscal audits over a 12-month period.";
                mockFindings = "Identified and removed 2.4 million ghost beneficiaries, resulting in a ₹1,200 Crore budget surplus while highlighting regional integration disparities.";
            } else if (isAdmin) {
                mockExecutiveSummary = `[SIMULATED DATA DUE TO GOOGLE API RATE LIMIT]\n\n**1. Enterprise Architecture Impact:**\nThis technical whitepaper on "${mockTitle}" outlines critical optimizations required for our multi-tenant agricultural RAG (Retrieval-Augmented Generation) infrastructure. The research demonstrates that migrating to a distributed vector database topology minimizes retrieval latency by 35% during peak usage hours when multiple enterprise clients are accessing real-time crop disease heuristics concurrently.\n\n**2. Security & Compliance Assessment:**\nThe analysis underscores a major vulnerability in cross-border crop yield data transmissions. The implementation of a strict Zero-Trust framework, coupled with end-to-end encryption at the edge (IoT sensors), guarantees full compliance with the DPDP Act 2023. Additionally, audit logs confirm that federated learning models successfully prevent proprietary enterprise data from bleeding into the base LLM.\n\n**3. Infrastructure Action Plan:**\n- **Immediate Step:** Initiate a comprehensive security audit on all third-party API endpoints accessing the primary telemetry database.\n- **Cost Orchestration:** Shift non-critical batch LLM inferences to off-peak spot instances to reduce monthly cloud compute overhead by an estimated 22%.\n- **Disaster Recovery:** Deploy a localized failover cluster for the vector DB in the secondary availability zone to guarantee 99.99% uptime for premium corporate clients.`;
                mockMethodology = "A robust architectural audit and load-testing simulation of distributed vector databases under simulated high-concurrency agricultural query loads.";
                mockFindings = "Implementation of the distributed architecture reduced P99 query latency from 1.2s to 450ms while ensuring strict data compartmentalization across tenants.";
            }

            if (language === 'Hindi') {
                mockExecutiveSummary = `[सिम्युलेटेड डेटा - API सीमा] यह शोध "${mockTitle}" के बारे में है। यह आपके विशिष्ट भूमिका के लिए कृषि और तकनीकी प्रक्रियाओं में सुधार का वर्णन करता है। वित्तीय और ढांचागत लाभ महत्वपूर्ण हैं। \n\n**1. मुख्य जानकारी:**\nनवीनतम डेटा और शोध आपके क्षेत्र में बेहतर उत्पादन और कार्यकुशलता दिखाते हैं। \n\n**2. रणनीतिक प्रभाव:**\nइस शोध के उपयोग से लागत में कमी और उत्पादन में वृद्धि हो सकती है।`;
                mockMethodology = "विभिन्न कृषि और तकनीकी डेटा का उन्नत विश्लेषण और सिमुलेशन।";
                mockFindings = "लागू किए गए परीक्षणों के अनुसार दक्षता में लगभग 20% सुधार देखा गया।";
            }
            
            parsedSummary = {
                executiveSummary: mockExecutiveSummary,
                methodology: mockMethodology,
                quantitativeDataFindings: mockFindings,
                researchLimitations: language === 'Hindi' ? "विशिष्ट मौसम पैटर्न और अल्पकालिक परीक्षणों तक सीमित।" : "Limited to specific localized weather patterns and short-term trial periods.",
                citations: [
                    `Mock Author et al. (2026). A study on ${mockTitle}. Journal of AgriTech, 14(2), 112-125.`
                ]
            };
        }
        
        res.status(200).json({ success: true, summary: parsedSummary });
    } catch (err) {
        console.error("Summarize Document Error:", err);
        res.status(500).json({ error: "Failed to summarize document." });
    }
};

// 4. Draft Proposal
export const draftProposal = async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ error: "Topic is required." });
        
        // Use RAG to get context
        const ragResult = await queryVectorStore(topic);
        
        const prompt = `You are an Agricultural Research Analyst. Draft a formal agricultural research proposal on the topic: "${topic}".
        Use the following knowledge base data to support your claims:
        ${ragResult.sourceDocuments.map(d => d.pageContent).join('\n').substring(0, 4000)}
        
        Format your response in Markdown with exactly these sections:
        ## Problem Statement
        ## Literature Review Synthesis
        ## Expected Experimental Metrics
        `;
        
        const proposal = await generateCompletion(prompt, req.user ? req.user.role : null);
        res.status(200).json({ success: true, proposal });
    } catch(err) {
        console.error("Draft Proposal Error:", err);
        res.status(500).json({ error: "Failed to draft proposal." });
    }
};

// 5. Get Trends
export const getTrends = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        
        const isFarmer = userRole === 'Farmer';
        const isFPO = userRole === 'FPO';
        const isTrader = userRole === 'Commodity Trader';
        const isAnalyst = userRole === 'Research Analyst';
        const isManager = userRole === 'Agribusiness Manager';
        const isGov = userRole === 'Government Official';
        const isAdmin = userRole === 'Company Admin';
        const trendCount = (isFarmer || isFPO || isTrader || isAnalyst || isManager || isGov || isAdmin) ? 6 : 4;
        
        let contextInstruction = "";
        if (isFarmer) {
            contextInstruction = "Since the role is Farmer, focus heavily on practical trends like direct-to-market apps, localized drone spraying, heat-resistant seed variants, micro-irrigation subsidies, soil testing advancements, and AI crop disease detection.";
        } else if (isFPO) {
            contextInstruction = "Since the role is FPO, focus heavily on trends like bulk commodity trading, collective cold storage tech, ag-logistics optimization, export compliance AI, member management software, and collective bargaining.";
        } else if (isTrader) {
            contextInstruction = "Since the role is Commodity Trader, focus heavily on macroeconomic trends like global supply chain shifts, futures volatility, automated arbitrage algorithms, climate-impacted crop indices, and trade tariff adjustments.";
        } else if (isAnalyst) {
            contextInstruction = "Since the role is Research Analyst, focus heavily on scientific and biotech trends like CRISPR gene editing, soil microbiome sequencing, high-throughput phenotyping, remote sensing via satellite, statistical meta-analyses, and lab automation.";
        } else if (isManager) {
            contextInstruction = "Since the role is Agribusiness Manager, focus heavily on corporate trends like AgTech SaaS integrations, ESG and corporate compliance tracking, automated B2B supply chains, corporate farming M&A, and robotic facility automation.";
        } else if (isGov) {
            contextInstruction = "Since the role is Government Official, focus heavily on macro-policy trends like Digital Agriculture Mission adoption, PM-KISAN subsidy penetration, national food security indices, groundwater conservation acts, and state-level MSP adjustments.";
        } else if (isAdmin) {
            contextInstruction = "Since the role is Company Admin, focus heavily on IT/AI trends like Enterprise LLM adoption, Vector Database optimization, AI agentic workflows in agriculture, Data privacy frameworks, zero-trust architectures, and Cloud compute costs.";
        }
        
        const prompt = `You are a Data Analyst AI summarizing trends for a ${userRole}.
        Identify exactly ${trendCount} emerging trends from the global agricultural landscape relevant to this role.
        ${contextInstruction}
        Return a strict JSON array of objects. Each object must have exactly:
        - 'topic' (string, translated to ${language})
        - 'growthScore' (string, formatted as e.g. '+45%' or '+120%')
        Do not include markdown formatting around the array.`;
        
        let parsedTrends = [];
        try {
            const result = await generateCompletion(prompt, req.user ? req.user.role : null);
            
            // Robustly extract JSON array
            const match = result.match(/\[[\s\S]*\]/);
            const cleanJson = match ? match[0] : result.trim();
            
            parsedTrends = JSON.parse(cleanJson);
        } catch (apiError) {
            console.error("Gemini API failed for Trends, using fallback mock data:", apiError.message);
            
            let fallbackTrends = [];
            if (isFarmer) {
                fallbackTrends = [
                    { topic: "Micro-Irrigation Adoption", growthScore: "+125%" },
                    { topic: "Drone Spraying Subsidies", growthScore: "+85%" },
                    { topic: "Direct-to-Market AgTech Apps", growthScore: "+210%" },
                    { topic: "Heat-Resistant Wheat Variants", growthScore: "+60%" },
                    { topic: "AI Soil Health Scanning", growthScore: "+115%" },
                    { topic: "Climate-Risk Crop Insurance", growthScore: "+90%" }
                ];
            } else if (isFPO) {
                fallbackTrends = [
                    { topic: "Bulk Cold Storage Automation", growthScore: "+140%" },
                    { topic: "Blockchain Traceability for Exports", growthScore: "+110%" },
                    { topic: "Ag-Logistics Route Optimization", growthScore: "+205%" },
                    { topic: "Collective Procurement Software", growthScore: "+95%" },
                    { topic: "Group Carbon Credit Monetization", growthScore: "+180%" },
                    { topic: "AI-Powered Yield Forecasting", growthScore: "+125%" }
                ];
            } else if (isTrader) {
                fallbackTrends = [
                    { topic: "Algorithmic Arbitrage in Agri-Commodities", growthScore: "+310%" },
                    { topic: "Weather-Indexed Futures Trading", growthScore: "+175%" },
                    { topic: "AI Prediction of Export Tariffs", growthScore: "+140%" },
                    { topic: "Global Freight Rate Volatility", growthScore: "+85%" },
                    { topic: "Satellite-Based Yield Speculation", growthScore: "+220%" },
                    { topic: "Alternative Biofuel Demand Surges", growthScore: "+160%" }
                ];
            } else if (isAnalyst) {
                fallbackTrends = [
                    { topic: "CRISPR-Cas9 Crop Genomics", growthScore: "+420%" },
                    { topic: "AI-Driven Soil Microbiome Mapping", growthScore: "+350%" },
                    { topic: "UAV Multispectral Phenotyping", growthScore: "+210%" },
                    { topic: "Machine Learning in Plant Pathology", growthScore: "+280%" },
                    { topic: "Ag-Biotech Patent Filings", growthScore: "+145%" },
                    { topic: "Automated Greenhouse Telemetry", growthScore: "+190%" }
                ];
            } else if (isManager) {
                fallbackTrends = [
                    { topic: "B2B SaaS Cold Chain Tracking", growthScore: "+280%" },
                    { topic: "Corporate ESG Compliance Automation", growthScore: "+310%" },
                    { topic: "Agribusiness M&A Synergies", growthScore: "+140%" },
                    { topic: "Predictive B2B Procurement AI", growthScore: "+245%" },
                    { topic: "Autonomous Sorting Facilities", growthScore: "+195%" },
                    { topic: "Scope-3 Carbon Emissions Tracking", growthScore: "+225%" }
                ];
            } else if (isGov) {
                fallbackTrends = [
                    { topic: "AgriStack Land Record API Integration", growthScore: "+450%" },
                    { topic: "Drone Subsidy (SMAM) Utilization", growthScore: "+320%" },
                    { topic: "PM-KISAN DBT Efficiency", growthScore: "+180%" },
                    { topic: "National Water Conservation Adoption", growthScore: "+210%" },
                    { topic: "Agri-Infra Fund Disbursals", growthScore: "+145%" },
                    { topic: "Export Tariff Adjustments Impact", growthScore: "+95%" }
                ];
            } else if (isAdmin) {
                fallbackTrends = [
                    { topic: "Enterprise LLM Model Fine-Tuning", growthScore: "+450%" },
                    { topic: "Vector DB Retrieval Optimization", growthScore: "+320%" },
                    { topic: "Agentic AI Workflows in AgTech", growthScore: "+280%" },
                    { topic: "Zero-Trust Data Security Architectures", growthScore: "+175%" },
                    { topic: "Cloud Compute Cost Orchestration", growthScore: "+150%" },
                    { topic: "AI Governance & Compliance Audits", growthScore: "+190%" }
                ];
            } else {
                fallbackTrends = [
                    { topic: "Climate-Smart Agriculture", growthScore: "+145%" },
                    { topic: "Autonomous Drone Spraying", growthScore: "+88%" },
                    { topic: "Regenerative Soil Practices", growthScore: "+210%" },
                    { topic: "Genomic Crop Editing", growthScore: "+65%" }
                ];
            }
            
            parsedTrends = fallbackTrends;
        }
        
        res.status(200).json({ success: true, trends: parsedTrends });
    } catch(err) {
        console.error("Trends Error:", err);
        res.status(500).json({ error: "Failed to fetch trends." });
    }
};

// 6. Agribusiness Summaries
export const getAgribusinessSummaries = async (req, res) => {
    try {
        const docs = await Document.find({}).sort({ createdAt: -1 }).limit(5);
        let allText = docs.length 
          ? docs.map(d => `Title: ${d.title}\nText: ${d.textExtract?.substring(0, 500)}`).join('\n\n')
          : "No documents available in the database.";
          
        const prompt = `You are an Agribusiness Strategic Consultant. Review the following agricultural research and extract 3 highly relevant commercial insights or executive summaries. 
        Format as a JSON array of objects with keys: 'title' (string) and 'tag' (string, e.g., 'Climate Risk', 'AgriTech Growth').
        Documents:
        ${allText}`;

        let parsedSummaries = [];
        try {
            const result = await generateCompletion(prompt, req.user ? req.user.role : null);
            
            // Robustly extract JSON array
            const match = result.match(/\[[\s\S]*\]/);
            const cleanJson = match ? match[0] : result.trim();
            
            parsedSummaries = JSON.parse(cleanJson);
        } catch(apiError) {
            console.error("Gemini API failed for Agribusiness Summaries, using fallback mock data:", apiError.message);
            parsedSummaries = [
                { title: "[SIMULATED] Impact of El Niño on Soybean Yields in Q3", tag: "Climate Risk" },
                { title: "[SIMULATED] Commercial Viability of Drone Spraying", tag: "AgriTech Growth" },
                { title: "[SIMULATED] Fertilizer Supply Chain Bottlenecks 2026", tag: "Supply Forecast" }
            ];
        }

        res.status(200).json({ success: true, summaries: parsedSummaries });
    } catch(err) {
        console.error("Agribusiness Summaries Error:", err);
        res.status(500).json({ error: "Failed to fetch agribusiness summaries." });
    }
};

// 8. Translate UI Text
export const translateUIText = async (req, res) => {
    try {
        const { texts, targetLanguage } = req.body;
        if (!texts || !Array.isArray(texts) || !targetLanguage) {
            return res.status(400).json({ error: "texts array and targetLanguage are required." });
        }
        if (targetLanguage === 'English') {
            const mapped = {};
            texts.forEach(t => mapped[t] = t);
            return res.status(200).json({ success: true, translations: mapped });
        }

        const prompt = `Translate the following UI strings from English into ${targetLanguage}.
        You must return a strict JSON object where the KEYS are the EXACT original English strings provided below, and the VALUES are their translations in ${targetLanguage}.
        Only return raw JSON format without markdown blocks.
        
        Strings to translate:
        ${JSON.stringify(texts, null, 2)}`;
        
        const result = await generateCompletion(prompt, req.user ? req.user.role : null);
        const match = result.match(/\{[\s\S]*\}/);
        const cleanJson = match ? match[0] : result.trim();
        const parsed = JSON.parse(cleanJson);
        
        res.status(200).json({ success: true, translations: parsed });
    } catch (err) {
        console.error("UI Translation Error (Gemini API Failed):", err.message);
        
        // Fallback for Hindi if API hits rate limit
        if (req.body.targetLanguage === 'Hindi') {
            const hindiFallback = {
                "Workspace": "कार्यक्षेत्र",
                "Tailored agricultural intelligence and actionable reporting.": "कृषि बुद्धिमत्ता और डेटा रिपोर्टिंग।",
                "Weekly Research Synthesis": "साप्ताहिक शोध सारांश",
                "Total Papers Analyzed: ": "कुल कागजात: ",
                "Research Insights Search": "शोध अंतर्दृष्टि खोज",
                "Cross-document analysis using our RAG AI engine.": "RAG AI का उपयोग करके क्रॉस-दस्तावेज़ विश्लेषण।",
                "AI Trend Intelligence": "AI रुझान बुद्धिमत्ता",
                "Identify emerging scientific trends in crop health.": "फसल स्वास्थ्य में उभरते वैज्ञानिक रुझानों की पहचान करें।",
                "AI-Synthesized Emerging Trends": "AI-संश्लेषित उभरते रुझान",
                "Scanning global repositories for trends...": "रुझानों के लिए स्कैन किया जा रहा है...",
                "No emerging trends found.": "कोई उभरते रुझान नहीं मिले।",
                "Growth Score indicates rapid academic adoption.": "विकास स्कोर तेजी से अपनाने का संकेत देता है।",
                "Growth Score": "विकास स्कोर",
                "Chart Analysis": "चार्ट विश्लेषण",
                "Generating dynamic charts via AI...": "AI के माध्यम से गतिशील चार्ट उत्पन्न किए जा रहे हैं...",
                "Weather Alerts": "मौसम अलर्ट",
                "No weather alerts at this time.": "इस समय कोई मौसम अलर्ट नहीं।",
                "Live Market Prices": "लाइव बाजार मूल्य",
                "Crop": "फसल",
                "Price": "मूल्य",
                "Trend": "रुझान",
                "No market data available.": "कोई बाजार डेटा उपलब्ध नहीं है।",
                "Actionable Farming Tips": "व्यावहारिक खेती के टिप्स",
                "No farming tips generated.": "कोई खेती के टिप्स उत्पन्न नहीं हुए।",
                "Supply Chain Alerts": "आपूर्ति श्रृंखला अलर्ट",
                "No supply chain alerts.": "कोई आपूर्ति श्रृंखला अलर्ट नहीं।",
                "Bulk Commodity Prices": "थोक वस्तु मूल्य",
                "Commodity": "वस्तु",
                "Bulk Price": "थोक मूल्य",
                "Demand": "मांग",
                "No bulk market data available.": "कोई थोक बाजार डेटा उपलब्ध नहीं है।",
                "FPO Policy & Compliance Updates": "FPO नीति और अनुपालन अपडेट",
                "No policy updates.": "कोई नीति अपडेट नहीं।",
                "Export & Import Alerts": "निर्यात और आयात अलर्ट",
                "No global trade alerts.": "कोई वैश्विक व्यापार अलर्ट नहीं।",
                "Global Market Trends": "वैश्विक बाजार के रुझान",
                "No market trends detected.": "कोई बाजार रुझान नहीं मिला।",
                "Commodity Futures": "कमोडिटी फ्यूचर्स",
                "Futures Price": "फ्यूचर्स मूल्य",
                "Volume": "मात्रा",
                "No futures data available.": "कोई फ्यूचर्स डेटा उपलब्ध नहीं है।",
                "Peer-Reviewed Alerts": "सहकर्मी-समीक्षित अलर्ट",
                "No academic alerts.": "कोई अकादमिक अलर्ट नहीं।",
                "Methodology Breakthroughs": "कार्यप्रणाली में सफलताएं",
                "No methodology updates.": "कोई कार्यप्रणाली अपडेट नहीं।",
                "Research Funding & Grants": "अनुसंधान निधि और अनुदान",
                "Grant Name": "अनुदान का नाम",
                "Amount": "राशि",
                "Deadline": "अंतिम तिथि",
                "No funding data available.": "कोई अनुदान डेटा उपलब्ध नहीं है।",
                "Supply Chain Optimization": "आपूर्ति श्रृंखला अनुकूलन",
                "No optimization data available.": "कोई अनुकूलन डेटा उपलब्ध नहीं है।",
                "Corporate Policy & ESG Updates": "कॉर्पोरेट नीति और ईएसजी अपडेट",
                "No corporate policy updates.": "कोई कॉर्पोरेट नीति अपडेट नहीं।",
                "B2B Market Prices": "B2B बाजार मूल्य",
                "Product": "उत्पाद",
                "Availability": "उपलब्धता",
                "No B2B market data available.": "कोई B2B बाजार डेटा उपलब्ध नहीं है।",
                "Investment Opportunities": "निवेश के अवसर",
                "Sector": "क्षेत्र",
                "Expected ROI": "अपेक्षित ROI",
                "Risk Level": "जोखिम स्तर",
                "No investment data available.": "कोई निवेश डेटा उपलब्ध नहीं है।",
                "Labor Market Trends": "श्रम बाजार के रुझान",
                "No labor trends available.": "कोई श्रम रुझान उपलब्ध नहीं है।",
                "Subsidy Updates": "सब्सिडी अपडेट",
                "No subsidy updates available.": "कोई सब्सिडी अपडेट उपलब्ध नहीं है।",
                "Regulatory & Compliance Alerts": "नियामक और अनुपालन अलर्ट",
                "No regulatory alerts.": "कोई नियामक अलर्ट नहीं।",
                "State-Wise Yield Estimates": "राज्यवार उपज अनुमान",
                "State": "राज्य",
                "Estimate": "अनुमान",
                "No state yield data available.": "कोई राज्य उपज डेटा उपलब्ध नहीं है।",
                "National Budget Allocations": "राष्ट्रीय बजट आवंटन",
                "Scheme": "योजना",
                "Allocation": "आवंटन",
                "Status": "स्थिति",
                "No budget data available.": "कोई बजट डेटा उपलब्ध नहीं है।",
                "Environmental Impact Alerts": "पर्यावरणीय प्रभाव अलर्ट",
                "No environmental alerts.": "कोई पर्यावरणीय अलर्ट नहीं।",
                "Agri-Export Targets": "कृषि-निर्यात लक्ष्य",
                "Commodity": "वस्तु",
                "Target": "लक्ष्य",
                "Actual": "वास्तविक",
                "No export targets available.": "कोई निर्यात लक्ष्य उपलब्ध नहीं है।",
                "Infrastructure Projects": "बुनियादी ढांचा परियोजनाएं",
                "Project": "परियोजना",
                "Completion": "पूर्णता",
                "Impact": "प्रभाव",
                "No infrastructure data available.": "कोई बुनियादी ढांचा डेटा उपलब्ध नहीं है।",
                "System Health Alerts": "सिस्टम स्वास्थ्य अलर्ट",
                "No health alerts.": "कोई स्वास्थ्य अलर्ट नहीं।",
                "Model Adoption Rates": "मॉडल अपनाने की दर",
                "Department": "विभाग",
                "Adoption Rate": "अपनाने की दर",
                "No adoption data available.": "कोई डेटा उपलब्ध नहीं है।",
                "API Cost Estimates": "एपीआई लागत अनुमान",
                "Service": "सेवा",
                "Estimated Cost": "अनुमानित लागत",
                "No cost data available.": "कोई लागत डेटा उपलब्ध नहीं है।",
                "Security Audit Logs": "सुरक्षा ऑडिट लॉग",
                "Event": "आयोजन",
                "Severity": "गंभीरता",
                "Timestamp": "समय",
                "No audit logs available.": "कोई ऑडिट लॉग उपलब्ध नहीं है।",
                "Navigation": "नेविगेशन",
                "Overview Dashboard": "डैशबोर्ड",
                "Research Summary": "शोध सारांश",
                "Research Summary Engine": "शोध सारांश इंजन",
                "Transform agricultural research into persona-specific actionable insights.": "कृषि अनुसंधान को अंतर्दृष्टि में बदलें।",
                "Role Context Active:": "भूमिका संदर्भ सक्रिय:",
                "The papers below are dynamically generated for a ": "नीचे दिए गए कागजात इसके लिए गतिशील रूप से उत्पन्न होते हैं ",
                " Select any paper to generate a deeper executive summary tailored to your clearance and language.": " गहरा सारांश उत्पन्न करने के लिए किसी भी कागजात का चयन करें।",
                "Upload Document File (.txt, .md, .csv)": "दस्तावेज़ फ़ाइल अपलोड करें",
                "Click to Browse Files": "फ़ाइलें ब्राउज़ करने के लिए क्लिक करें",
                "OR PASTE TEXT": "या टेक्स्ट पेस्ट करें",
                "Document Title": "दस्तावेज़ का शीर्षक",
                "Paste or upload the full text of the research document here...": "अनुसंधान दस्तावेज़ का पूरा पाठ यहाँ पेस्ट या अपलोड करें...",
                "Document Content": "दस्तावेज़ सामग्री",
                "Generate Insights": "अंतर्दृष्टि उत्पन्न करें",
                "Analyzing...": "विश्लेषण किया जा रहा है...",
                "Awaiting Research Selection": "अनुसंधान चयन की प्रतीक्षा है",
                "Select a publication from the list on the left to generate a structured summary and tailored persona-based insights.": "सारांश उत्पन्न करने के लिए बाईं ओर की सूची से एक प्रकाशन का चयन करें।",
                "Extracting Intelligence...": "खुफिया जानकारी निकाली जा रही है...",
                "AI Executive Summary": "AI कार्यकारी सारांश",
                "Methodology": "कार्यप्रणाली",
                "Quantitative Findings": "मात्रात्मक निष्कर्ष",
                "Research Limitations": "अनुसंधान सीमाएँ",
                "Generated Citations (APA/IEEE)": "उत्पन्न उद्धरण",
                "Not provided.": "प्रदान नहीं किया गया।",
                "No citations generated.": "कोई उद्धरण उत्पन्न नहीं हुआ।",

                // Sidebar Topics & Labels
                "Primary Volume Metrics": "प्राथमिक मात्रा मेट्रिक्स",
                "Local Mandi & Market Insights": "स्थानीय मंडी और बाजार अंतर्दृष्टि",
                "Weather Anomalies & Safety": "मौसम विसंगतियाँ और सुरक्षा",
                "Historical Trend Analysis": "ऐतिहासिक प्रवृत्ति विश्लेषण",
                "Agri-Tech & Best Practices": "कृषि-तकनीक और सर्वोत्तम प्रथाएं",
                "Financial & Credit News": "वित्तीय और ऋण समाचार",
                "Govt Scheme & MSP Flash": "सरकारी योजना और एमएसपी फ्लैश",
                "Operations & Risk": "संचालन और जोखिम",
                "Cluster Risk Hub": "क्लस्टर जोखिम केंद्र",
                "B2B Market Sentiment": "B2B बाजार भावना",
                "Logistics & Procurement": "रसद और खरीद",
                "Bulk Input Procurement": "थोक इनपुट खरीद",
                "Logistics & Warehousing": "रसद और भंडारण",
                "Govt Grants & Compliance": "सरकारी अनुदान और अनुपालन",
                "Market Analysis": "बाजार विश्लेषण",
                "Global Futures & Macros": "वैश्विक वायदा और मैक्रोज़",
                "Local Mandi Arbitrage": "स्थानीय मंडी मध्यस्थता",
                "Risk & Policy": "जोखिम और नीति",
                "Weather & Supply Risk": "मौसम और आपूर्ति जोखिम",
                "Export & Tariff Policies": "exports और टैरिफ नीतियां",
                "Institutional Procurement Flow": "संस्थागत खरीद प्रवाह",
                "Sourcing & Logistics": "सोर्सिंग और रसद",
                "Supply Chain Map": "आपूर्ति श्रृंखला मानचित्र",
                "Sourcing Risk Grid": "सोर्सिंग जोखिम ग्रिड",
                "Quality & Vendors": "गुणवत्ता और विक्रेता",
                "Vendor Negotiations": "विक्रेता वार्ता",
                "Quality & Assaying": "गुणवत्ता और परख",
                "Logistics Routing": "रसद मार्ग",
                "Strategic Analysis": "रणनीतिक विश्लेषण",
                "Corporate Macro Trends": "कॉर्पोरेट मैक्रो रुझान",
                "Competitor Intelligence": "प्रतिस्पर्धी बुद्धिमत्ता",
                "Operations & Demand": "संचालन और मांग",
                "Supply Chain Optimization": "आपूर्ति श्रृंखला अनुकूलन",
                "Retail & Consumer Demand": "खुदरा और उपभोक्ता मांग",
                "Mergers & Acquisitions": "विलय और अधिग्रहण",
                "Scientific Research": "वैज्ञानिक अनुसंधान",
                "Global Agronomy Papers": "वैश्विक कृषि विज्ञान कागजात",
                "Climate Impact Modeling": "जलवायु प्रभाव मॉडलिंग",
                "Soil & Economics": "मिट्टी और अर्थशास्त्र",
                "Genomics & Bio-Tech": "जीनोमिक्स और बायो-टेक",
                "Soil & Micro-Biome": "मिट्टी और माइक्रो-बायोम",
                "Policy & Economics": "नीति और अर्थशास्त्र",
                "Crisis & Relief": "संकट और राहत",
                "District Crisis Monitor": "जिला संकट मॉनिटर",
                "Relief Disbursement": "राहत वितरण",
                "Reserves & Infrastructure": "भंडार और बुनियादी ढांचा",
                "Policy Sentiment": "नीति भावना",
                "Food Security Reserves": "खाद्य सुरक्षा भंडार",
                "Infrastructure Progress": "बुनियादी ढांचा प्रगति",
                "System Operations": "सिस्टम संचालन",
                "Ingestion Engine Status": "अंतर्ग्रहण इंजन स्थिति",
                "Translation": "अनुवाद",

                // Page Titles, Layout Labels & Subtitles
                "News Intelligence Module": "समाचार खुफिया मॉड्यूल",
                "Farmer Dashboard View • Real-time AI-Synthesized Feed": "किसान डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "FPO Dashboard View • Real-time AI-Synthesized Feed": "FPO डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Commodity Trader Dashboard View • Real-time AI-Synthesized Feed": "कमोडिटी ट्रेडर डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Procurement Manager Dashboard View • Real-time AI-Synthesized Feed": "खरीद प्रबंधक डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Agribusiness Manager Dashboard View • Real-time AI-Synthesized Feed": "कृषि व्यवसाय प्रबंधक डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Research Analyst Dashboard View • Real-time AI-Synthesized Feed": "अनुसंधान विश्लेषक डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Government Official Dashboard View • Real-time AI-Synthesized Feed": "सरकारी अधिकारी डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Company Admin Dashboard View • Real-time AI-Synthesized Feed": "कंपनी व्यवस्थापक डैशबोर्ड व्यू • वास्तविक समय एआई-संश्लेषित फीड",
                "Aggregating News Feeds...": "समाचार फीड एकत्रित किए जा रहे हैं...",
                "Failed to fetch news intelligence data": "समाचार खुफिया डेटा लाने में विफल",
                "Synthesizing live AI analysis...": "लाइव एआई विश्लेषण का संश्लेषण किया जा रहा है...",
                "Live Intelligence Feed": "लाइव इंटेलिजेंस फीड",
                "Updates": "अपडेट",
                "Market Intelligence Feed": "बाजार खुफिया फीड",
                "Bulletins": "बुलेटिन",
                "Academic Research Feed": "अकादमिक अनुसंधान फीड",
                "Papers": "पेपर्स",
                "Sourcing Intelligence Feed": "सोर्सिंग खुफिया फीड",
                "Alerts": "अलर्ट",
                "Crisis Intelligence Feed": "संकट खुफिया फीड",
                "Cluster Intelligence Feed": "क्लस्टर खुफिया फीड",
                "Corporate Intelligence Feed": "कॉर्पोरेट खुफिया फीड",
                "Reports": "रिपोर्ट",
                "System Log Feed": "सिस्टम लॉग फीड",
                "Synthesizing live intelligence feeds...": "लाइव इंटेलिजेंस फीड का संश्लेषण किया जा रहा है...",
                "Synthesizing Market Intelligence...": "बाजार खुफिया का संश्लेषण किया जा रहा है...",
                "Aggregating Research Papers & Models...": "अनुसंधान पत्रों और मॉडलों का एकत्रीकरण किया जा रहा है...",
                "Aggregating State Policy & Crisis Intelligence...": "राज्य नीति और संकट खुफिया का एकत्रीकरण किया जा रहा है...",
                "Aggregating Institutional Intelligence...": "संस्थागत खुफिया का एकत्रीकरण किया जा रहा है...",
                "Aggregating Corporate Intelligence...": "कॉर्पोरेट खुफिया का एकत्रीकरण किया जा रहा है...",
                "Connecting to Infrastructure Telemetry...": "बुनियादी ढांचा टेलीमेट्री से कनेक्ट किया जा रहा है...",
                "Aggregating Sourcing Intelligence...": "सोर्सिंग खुफिया का एकत्रीकरण किया जा रहा है...",
                "Aggregating Procurement Intelligence...": "खरीद खुफिया का एकत्रीकरण किया जा रहा है...",
                "FPO Operations Feed": "FPO संचालन फीड",
                "Academic Intelligence Synthesis": "अकादमिक खुफिया संश्लेषण",
                "Administrative Intelligence synthesis": "प्रशासनिक खुफिया संश्लेषण",
                "Reports Active": "सक्रिय रिपोर्ट",
                "Publications": "प्रकाशन",
                "ACTIVE LOGS": "सक्रिय लॉग",

                // Chart & Telemetry labels
                "Q1": "तिमाही 1",
                "Q2": "तिमाही 2",
                "Q3": "तिमाही 3",
                "Q4": "तिमाही 4",
                "Wk 1": "सप्ताह 1",
                "Wk 2": "सप्ताह 2",
                "Wk 3": "सप्ताह 3",
                "Wk 4": "सप्ताह 4",
                "Wk 5": "सप्ताह 5",
                "Price": "मूल्य",
                "Trend": "रुझान",
                "Arrival Vol": "आवक मात्रा",
                "Modal": "मॉडल मूल्य",
                "Demand": "मांग",
                "Actual": "वास्तविक",
                "Target": "लक्ष्य",
                "Bulk Price": "थोक मूल्य",
                "Fulfillment": "पूर्ति",
                "Estimated Cost": "अनुमानित लागत",
                "Supply Chain Disruption Map": "आपूर्ति श्रृंखला व्यवधान मानचित्र",
                "Live Disruptions": "लाइव व्यवधान",
                "Est. Delay": "अपेक्षित देरी",
                "[Geographic Heat Map Rendered Here]": "[भौगोलिक हीट मैप यहाँ प्रस्तुत है]"
            };
            
            // Map the requested texts to the fallback dictionary
            const mapped = {};
            if (Array.isArray(req.body.texts)) {
                req.body.texts.forEach(t => {
                    mapped[t] = hindiFallback[t] || t;
                });
            }
            return res.status(200).json({ success: true, translations: mapped });
        }

        res.status(500).json({ error: "Failed to translate UI text." });
    }
};

// Dynamically generate sidebar menu for Company Admin using Gemini AI API
export const getAdminSidebarMenu = async (req, res) => {
    try {
        const language = req.headers['x-language'] || 'English';
        
        const prompt = `You are an AI IT Administrator. Determine the required and relevant topics/subpages for the "Company Admin" (IT & AI platform administrator) role in the White Paper & Research AI module of an enterprise agrotech platform.
        The available topics/subpages are:
        - "Overview Dashboard" (path: "", icon: "LayoutDashboard")
        - "Research Summary" (path: "summary", icon: "FileText")
        - "Proposal Drafting" (path: "drafting", icon: "FileEdit")
        - "Translation Center" (path: "translate", icon: "Languages")
        - "Predictor Models" (path: "models", icon: "Network")
        - "Admin Panel" (path: "admin", icon: "Activity")
        - "Model Settings" (path: "settings", icon: "Settings")
        
        Select the topics/subpages that are appropriate for a Company Admin (e.g. Overview Dashboard, Research Summary, Admin Panel, and Model Settings are highly relevant for administrators to monitor performance and manage system configurations. Proposal Drafting, Translation Center, and Predictor Models are researcher/analyst tasks and might not be relevant for Company Admin).
        
        Return a strict JSON array containing only the selected and relevant objects.
        Each object in the array must contain:
        - "label" (string, translated to ${language} if language is Hindi, e.g. "अवलोकन डैशबोर्ड")
        - "path" (string)
        - "icon" (string, e.g. "LayoutDashboard", "FileText", "Activity", "Settings")
        
        Do not include any markdown styling, explanation, or code block delimiters. Just return the raw valid JSON array.`;

        let menu = [];
        try {
            const result = await generateCompletion(prompt, 'Company Admin');
            let cleanJson = result.trim();
            if (cleanJson.startsWith("\`\`\`")) {
                cleanJson = cleanJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
            }
            menu = JSON.parse(cleanJson);
        } catch (apiError) {
            console.error("Gemini API failed for admin menu, using fallback:", apiError.message);
            // Default Admin Menu fallback
            menu = [
                { label: language === 'Hindi' ? "अवलोकन डैशबोर्ड" : "Overview Dashboard", path: "", icon: "LayoutDashboard" },
                { label: language === 'Hindi' ? "अनुसंधान सारांश" : "Research Summary", path: "summary", icon: "FileText" },
                { label: language === 'Hindi' ? "एडमिन पैनल" : "Admin Panel", path: "admin", icon: "Activity" },
                { label: language === 'Hindi' ? "मॉडल सेटिंग्स" : "Model Settings", path: "settings", icon: "Settings" }
            ];
        }

        res.status(200).json({ success: true, menu });
    } catch (error) {
        console.error('Failed to generate admin sidebar menu:', error);
        res.status(500).json({ error: 'Failed to generate admin menu.' });
    }
};

// 3. Get White Paper Dashboard (New Overview)
export const getWhitePaperDashboard = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'] || (req.user ? req.user.role : 'Farmer');
        const language = req.headers['x-language'] || 'English';
        const activeSubpage = req.query.subpage || 'Overview';
        const searchQuery = req.query.searchQuery || '';

        let data;
        try {
            data = await fetchWhitePaperDashboardAI(userRole, activeSubpage, language, searchQuery);
        } catch (apiError) {
            console.error("Gemini API failed for whitepaper dashboard, using fallback:", apiError.message);
            // Fallback Data based on Role
            
            const determineKeyword = (title) => {
                const t = title.toLowerCase();
                if(t.includes('soil') || t.includes('microbiome')) return 'soil';
                if(t.includes('water') || t.includes('irrigation') || t.includes('rain') || t.includes('aquifer')) return 'water';
                if(t.includes('drone') || t.includes('tech') || t.includes('digital') || t.includes('ai') || t.includes('platform')) return 'iot';
                if(t.includes('market') || t.includes('trading') || t.includes('price') || t.includes('arbitrage')) return 'market';
                if(t.includes('subsidy') || t.includes('policy') || t.includes('government') || t.includes('development')) return 'government';
                if(t.includes('supply') || t.includes('logistics') || t.includes('harvest') || t.includes('inventory')) return 'warehouse';
                if(t.includes('finance') || t.includes('loan') || t.includes('cost') || t.includes('revenue')) return 'money';
                if(t.includes('climate') || t.includes('weather') || t.includes('disaster') || t.includes('carbon')) return 'carbon';
                if(t.includes('seed') || t.includes('genetic') || t.includes('protein')) return 'plant';
                if(t.includes('security') || t.includes('privacy')) return 'security';
                return 'farm';
            };

            const generateTrend = (type, title, abstract, author, badge) => {
                const kw = determineKeyword(title);
                return { 
                    type, title, abstract, date: '2026-06-15', publishDate: '2026-06-15', author, badge,
                    imageUrl: urlMap[kw] || 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400&h=400',
                    keyFindings: [
                        'Identified highly significant growth vectors.',
                        'Mapped out efficiency and operational gains.',
                        'Highlighted strategic pathway for immediate implementation.'
                    ]
                };
            };
            const generateReport = (title, region, author, status) => ({ title, region, author, status });
            const urlMap = {
              'farmer': 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400&h=400',
              'drone': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400&h=400',
              'soil': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400&h=400',
              'money': 'https://images.unsplash.com/photo-1580519542036-ed47f3e42a9b?auto=format&fit=crop&q=80&w=400&h=400',
              'community': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400&h=400',
              'water': 'https://images.unsplash.com/photo-1548883354-94cb0b432f80?auto=format&fit=crop&q=80&w=400&h=400',
              'warehouse': 'https://images.unsplash.com/photo-1586528116311-ad8ed7c83a56?auto=format&fit=crop&q=80&w=400&h=400',
              'computer': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=400',
              'finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=400',
              'market': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=400&h=400',
              'quality': 'https://images.unsplash.com/photo-1563514222027-a06ece3bb164?auto=format&fit=crop&q=80&w=400&h=400',
              'truck': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400&h=400',
              'trading': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400&h=400',
              'chart': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=400',
              'cargo': 'https://images.unsplash.com/photo-1494412519320-ce1e15f33e88?auto=format&fit=crop&q=80&w=400&h=400',
              'server': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400&h=400',
              'asia': 'https://images.unsplash.com/photo-1532236204992-f5e85c024202?auto=format&fit=crop&q=80&w=400&h=400',
              'math': 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=400&h=400',
              'government': 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?auto=format&fit=crop&q=80&w=400&h=400',
              'economy': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400&h=400',
              'satellite': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=400',
              'blockchain': 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&q=80&w=400&h=400',
              'women': 'https://images.unsplash.com/photo-1590059344158-7505fc1a62d1?auto=format&fit=crop&q=80&w=400&h=400',
              'carbon': 'https://images.unsplash.com/photo-1508344928928-7137b2f694db?auto=format&fit=crop&q=80&w=400&h=400',
              'business': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400&h=400',
              'iot': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400',
              'corporate': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400&h=400',
              'people': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400&h=400',
              'handshake': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400&h=400',
              'factory': 'https://images.unsplash.com/photo-1565615694348-18e0013b06dc?auto=format&fit=crop&q=80&w=400&h=400',
              'laboratory': 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=400&h=400',
              'data': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=400',
              'microscope': 'https://images.unsplash.com/photo-1582719471324-4ab488950541?auto=format&fit=crop&q=80&w=400&h=400',
              'plant': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400&h=400',
              'robot': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400&h=400',
              'database': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400&h=400',
              'code': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400&h=400',
              'security': 'https://images.unsplash.com/photo-1510511459019-5efa7ae67115?auto=format&fit=crop&q=80&w=400&h=400',
              'mobile': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400&h=400'
            };
            const generatePub = (journal, title, description, readTime, keyword) => ({ 
                journal, title, description, readTime, imageKeyword: keyword, 
                imageUrl: urlMap[keyword] || 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400&h=400', 
                abstract: 'This comprehensive abstract covers the latest findings in ' + title + ', providing actionable strategies for agricultural stakeholders.',
                author: 'Dr. Jane Smith',
                publishDate: '2026-06-12',
                keyFindings: [
                    'Significantly improves efficiency.',
                    'Lowers operational costs across the board.',
                    'Highly scalable for agricultural applications.'
                ]
            });

            const roleFallbacks = {
                'Farmer': {
                    emergingTrends: [
                        generateTrend('PDF Document', 'Climate-Resilient Seeds', 'Discover the latest seed varieties optimized for erratic weather patterns.', 'AgriScience Inst.', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Drip Irrigation Innovations', 'Cost-effective methods to improve water efficiency on small farms.', 'EcoWater Solutions', 'Featured'),
                        generateTrend('Guide', 'Organic Pest Repellents', 'Natural ways to keep your crops safe without chemicals.', 'GreenEarth', 'New'),
                        generateTrend('Analysis', 'Soil Microbiology Basics', 'Understanding the life under the topsoil.', 'Agro Docs', 'Trending'),
                        generateTrend('Report', 'Post-Harvest Loss Reduction', 'Techniques to store and transport safely.', 'Logistics', 'Essential'),
                        generateTrend('HOT TOPIC', 'Fertilizer Subsidy Impacts', 'How recent government policy changes affect your crop planning.', 'Gov Docs', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Yield Optimization Guide', 'India', 'Agro Research', 'Published'),
                        generateReport('Pest Control Strategies', 'Local', 'PestMetrics', 'Draft'),
                        generateReport('Organic Transition Manual', 'India', 'GreenEarth', 'Published'),
                        generateReport('Market Direct Selling', 'Asia', 'Farmer Connect', 'Review'),
                        generateReport('Weather Risk Assessment', 'Regional', 'MeteoAg', 'Published'),
                        generateReport('Crop Rotation Benefits', 'Global', 'AgriScience Inst.', 'Draft')
                    ],
                    newPublications: [
                        generatePub('Kisan Patrika', 'Maximizing Profits', 'Step-by-step guide to increasing margins.', '5 min read', 'farmer'),
                        generatePub('Tech Farming', 'Drone Usage in Fields', 'Using low-cost drones for crop monitoring.', '8 min read', 'drone'),
                        generatePub('Eco Farm', 'Soil Health Practices', 'Regenerative practices for better soil.', '6 min read', 'soil'),
                        generatePub('Agri Finance', 'Micro-loans for Farmers', 'How to secure low-interest loans.', '7 min read', 'money'),
                        generatePub('Rural Life', 'Community Farming', 'Benefits of sharing resources.', '4 min read', 'community'),
                        generatePub('Water Tech', 'Rainwater Harvesting', 'Building simple catchment systems.', '9 min read', 'water')
                    ]
                },
                'FPO': {
                    emergingTrends: [
                        generateTrend('Case Study', 'Collective Bargaining', 'How top FPOs secure 15% better rates.', 'FPO Network', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Supply Chain Tech', 'Digitizing inventory and warehousing.', 'AgriTech', 'Featured'),
                        generateTrend('Guide', 'Member Engagement Strategy', 'Keeping farmers actively involved.', 'Agro HR', 'New'),
                        generateTrend('Analysis', 'Bulk Input Purchasing', 'Cost savings through aggregated demand.', 'Finance Desk', 'Trending'),
                        generateTrend('Report', 'Value-Added Processing', 'Setting up local milling and packaging.', 'AgriBusiness', 'Essential'),
                        generateTrend('HOT TOPIC', 'Export Market Access', 'New certification pathways for direct export.', 'Global Trade', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Procurement Strategies', 'India', 'Agro Research', 'Published'),
                        generateReport('Risk Management for FPOs', 'Global', 'RiskMetrics', 'Draft'),
                        generateReport('FPO Compliance Guide', 'India', 'Gov Docs', 'Published'),
                        generateReport('B2B Market Opportunities', 'Asia', 'Market Intel', 'Review'),
                        generateReport('Storage Infrastructure', 'Regional', 'Logistics', 'Published'),
                        generateReport('Agri-Tech Adoption Rates', 'National', 'TechAgro', 'Draft')
                    ],
                    newPublications: [
                        generatePub('FPO Leader', 'Scaling Operations', 'Strategies for expanding FPO reach.', '7 min read', 'warehouse'),
                        generatePub('Tech Farming', 'ERP Systems for FPOs', 'Choosing the right software for management.', '10 min read', 'computer'),
                        generatePub('Agri Finance', 'Accessing Credit', 'Navigating institutional lending.', '6 min read', 'finance'),
                        generatePub('Market Connect', 'Direct to Retail', 'Bypassing traditional mandis.', '8 min read', 'market'),
                        generatePub('Quality Control', 'Standardization Practices', 'Ensuring consistent output quality.', '5 min read', 'quality'),
                        generatePub('Agri Logistics', 'Cold Chain Basics', 'Reducing perishability during transport.', '11 min read', 'truck')
                    ]
                },
                'Commodity Trader': {
                    emergingTrends: [
                        generateTrend('Market Analysis', 'Volatility Index', 'Predictive models for upcoming harvests.', 'Trade Desk', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Algorithmic Trading', 'Leveraging AI for optimal trades.', 'QuantAgro', 'Featured'),
                        generateTrend('Guide', 'Derivatives in Agri', 'Options and futures explained.', 'Finance Hub', 'New'),
                        generateTrend('Analysis', 'Currency Fluctuations', 'Impact of forex on agri-exports.', 'Global Insight', 'Trending'),
                        generateTrend('Report', 'Storage Arbitrage', 'Profiting from seasonal price variations.', 'Storage Metrics', 'Essential'),
                        generateTrend('HOT TOPIC', 'Geopolitical Impacts', 'How recent tariffs reshape global supply.', 'Global Insight', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Futures Outlook', 'Global', 'Market Intel', 'Published'),
                        generateReport('Supply Squeeze', 'Asia', 'RiskMetrics', 'Draft'),
                        generateReport('Import/Export Regulatory Changes', 'India', 'Gov Docs', 'Published'),
                        generateReport('Arbitrage Opportunities', 'Domestic', 'Trade Research', 'Review'),
                        generateReport('Freight Rate Trends', 'International', 'Logistics', 'Published'),
                        generateReport('Climate Event Disruptions', 'Global', 'MeteoAg', 'Draft')
                    ],
                    newPublications: [
                        generatePub('Trader Journal', 'Hedging Strategies', 'Advanced risk mitigation techniques.', '8 min read', 'trading'),
                        generatePub('Agri Economics', 'Demand Forecasting', 'Macro-economic factors driving demand.', '12 min read', 'chart'),
                        generatePub('Global Logistics', 'Freight Costs', 'Impact of shipping rates on margins.', '5 min read', 'cargo'),
                        generatePub('Tech Trader', 'HFT in Agriculture', 'High-frequency trading in commodities.', '10 min read', 'server'),
                        generatePub('Market Connect', 'Emerging Market Demand', 'Analyzing dietary shifts in Asia.', '7 min read', 'asia'),
                        generatePub('Risk Mgmt', 'Options Pricing Models', 'Black-Scholes adaptations for agri.', '15 min read', 'math')
                    ]
                },
                'Government Official': {
                    emergingTrends: [
                        generateTrend('Policy Brief', 'Subsidy Allocation', 'Data-driven approaches to optimizing subsidies.', 'Policy Inst.', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Digital Infrastructure', 'Implementing unified registries.', 'GovTech', 'Featured'),
                        generateTrend('Guide', 'Rural Development Goals', 'Aligning local action with national targets.', 'Planning Comm', 'New'),
                        generateTrend('Analysis', 'Water Resource Management', 'State-level aquifer conservation.', 'Water Board', 'Trending'),
                        generateTrend('Report', 'Food Security Metrics', 'Tracking nutritional availability.', 'Health Dept', 'Essential'),
                        generateTrend('HOT TOPIC', 'Climate Disaster Relief', 'Rapid response frameworks for weather events.', 'Disaster Mgmt', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Welfare Impact Study', 'India', 'Social Research', 'Published'),
                        generateReport('Drought Resilience', 'State-level', 'Agro Dept', 'Draft'),
                        generateReport('MSP Implementation Review', 'National', 'Audit Bureau', 'Published'),
                        generateReport('SDG Alignment', 'Global', 'UN Docs', 'Review'),
                        generateReport('e-NAM Adoption Rates', 'National', 'GovTech', 'Published'),
                        generateReport('Fertilizer Usage Patterns', 'Regional', 'AgriScience Inst.', 'Draft')
                    ],
                    newPublications: [
                        generatePub('Public Admin', 'Effective Policy Interventions', 'Case studies in successful interventions.', '10 min read', 'government'),
                        generatePub('Agri Economics', 'Economic Impact of Infrastructure', 'Evaluating rural economic growth.', '15 min read', 'economy'),
                        generatePub('Tech Farming', 'Satellite Monitoring', 'Using space data for crop yield estimation.', '7 min read', 'satellite'),
                        generatePub('GovTech Review', 'Digitizing Land Records', 'Blockchain applications in land registry.', '12 min read', 'blockchain'),
                        generatePub('Social Policy', 'Women in Agriculture', 'Empowering female farmers through targeted schemes.', '8 min read', 'women'),
                        generatePub('Climate Action', 'Carbon Credit Frameworks', 'Setting up state-run carbon markets.', '14 min read', 'carbon')
                    ]
                },
                'Agribusiness Manager': {
                    emergingTrends: [
                        generateTrend('Strategy Doc', 'Supply Chain Resilience', 'Building robust networks against disruptions.', 'Corp Strategy', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Consumer Trends', 'Shift towards organic and traceably sourced products.', 'Market Intel', 'Featured'),
                        generateTrend('Guide', 'Lean Manufacturing in Agri', 'Waste reduction in processing plants.', 'Ops Mgmt', 'New'),
                        generateTrend('Analysis', 'B2B E-commerce', 'Digital platforms for wholesale distribution.', 'Tech Sales', 'Trending'),
                        generateTrend('Report', 'Sustainability Audits', 'Preparing for mandatory ESG reporting.', 'Compliance', 'Essential'),
                        generateTrend('HOT TOPIC', 'M&A Opportunities', 'Consolidation trends in the ag-tech sector.', 'Finance Desk', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Market Share Analysis', 'Global', 'Agro Research', 'Published'),
                        generateReport('Cost Optimization', 'Enterprise', 'RiskMetrics', 'Draft'),
                        generateReport('ESG Compliance Guidelines', 'International', 'Gov Docs', 'Published'),
                        generateReport('New Product Development', 'Asia', 'R&D Dept', 'Review'),
                        generateReport('Labor Automation Impact', 'Regional', 'TechAgro', 'Published'),
                        generateReport('Brand Equity in Agri', 'National', 'Market Intel', 'Draft')
                    ],
                    newPublications: [
                        generatePub('AgriBusiness Review', 'Scaling Operations', 'Leadership strategies for growth.', '9 min read', 'business'),
                        generatePub('Tech Farming', 'IoT Integration', 'Connecting the entire supply chain.', '11 min read', 'iot'),
                        generatePub('Eco Farm', 'Corporate Sustainability', 'Achieving net-zero emissions.', '8 min read', 'corporate'),
                        generatePub('HR Management', 'Talent Retention', 'Keeping skilled agronomists in the firm.', '6 min read', 'people'),
                        generatePub('Sales Tactics', 'Key Account Management', 'Building relationships with major retailers.', '7 min read', 'handshake'),
                        generatePub('Supply Chain', 'Predictive Maintenance', 'Using AI to prevent equipment breakdowns.', '10 min read', 'factory')
                    ]
                },
                'Research Analyst': {
                    emergingTrends: [
                        generateTrend('Research Paper', 'Genetic Modifications', 'Exploring CRISPR applications for yield.', 'BioAgri Labs', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Soil Microbiome Analytics', 'Next-generation sequencing for soil health.', 'AgriSci Inst.', 'Featured'),
                        generateTrend('Guide', 'Statistical Models in Agri', 'R vs Python for agronomic data.', 'Data Tools', 'New'),
                        generateTrend('Analysis', 'Vertical Farming Yields', 'Energy consumption vs biomass output.', 'Urban Agri', 'Trending'),
                        generateTrend('Report', 'Alternative Proteins', 'Plant-based meat market trajectories.', 'Food Tech', 'Essential'),
                        generateTrend('HOT TOPIC', 'AI-Driven Yield Prediction', 'Integrating satellite and ground sensor data.', 'DataAgro', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Agronomy Review', 'Global', 'Research Council', 'Published'),
                        generateReport('Pesticide Efficacy Study', 'North America', 'ChemAg', 'Draft'),
                        generateReport('Climate Impact Models', 'International', 'Climate Desk', 'Published'),
                        generateReport('Biotech Advancements', 'Europe', 'BioAgri', 'Review'),
                        generateReport('Nanotechnology in Fertilizers', 'Asia', 'NanoAg', 'Published'),
                        generateReport('Synthetic Biology Outlook', 'Global', 'BioTech', 'Draft')
                    ],
                    newPublications: [
                        generatePub('Agronomy Today', 'Phenotyping Techniques', 'High-throughput phenotyping in breeding.', '14 min read', 'laboratory'),
                        generatePub('Data Farming', 'Machine Learning Applications', 'Predictive models for disease outbreaks.', '12 min read', 'data'),
                        generatePub('BioTech Agri', 'Bio-stimulants Efficacy', 'Impact of seaweed extracts on crop resilience.', '10 min read', 'microscope'),
                        generatePub('Scientific Journal', 'Water Stress Responses', 'Cellular changes during drought.', '18 min read', 'plant'),
                        generatePub('Lab Notes', 'Automated Soil Testing', 'Robotics in the chemistry lab.', '6 min read', 'robot'),
                        generatePub('Data Science', 'Open Source Agri Data', 'Leveraging public datasets for research.', '9 min read', 'database')
                    ]
                },
                'Company Admin': {
                    emergingTrends: [
                        generateTrend('Strategy Brief', 'Platform Usage Metrics', 'Analyzing user engagement rates.', 'System Analytics', 'Peer-Reviewed'),
                        generateTrend('Whitepaper', 'Data Security', 'Ensuring compliance with data privacy regulations.', 'CyberSec', 'Featured'),
                        generateTrend('Guide', 'Cloud Migration', 'Moving legacy systems to AWS.', 'DevOps', 'New'),
                        generateTrend('Analysis', 'User Retention', 'Why farmers drop off after day 30.', 'Product Team', 'Trending'),
                        generateTrend('Report', 'System Uptime Metrics', 'Achieving 99.99% availability.', 'SRE Team', 'Essential'),
                        generateTrend('HOT TOPIC', 'AI Cost Optimization', 'Strategies to reduce API token usage.', 'FinOps', 'HOT TOPIC')
                    ],
                    industryReports: [
                        generateReport('Module Performance', 'Internal', 'DevOps', 'Published'),
                        generateReport('User Onboarding Optimization', 'Global', 'Product Team', 'Draft'),
                        generateReport('System Architecture Review', 'Internal', 'Engineering', 'Published'),
                        generateReport('SaaS Revenue Projections', 'Global', 'Finance', 'Review'),
                        generateReport('Customer Support Metrics', 'Internal', 'Support', 'Published'),
                        generateReport('Mobile App Analytics', 'National', 'Mobile Team', 'Draft')
                    ],
                    newPublications: [
                        generatePub('SaaS Ops', 'Scaling Architecture', 'Managing high-concurrency data feeds.', '8 min read', 'server'),
                        generatePub('Tech Leadership', 'Agile Development', 'Accelerating feature delivery for rural users.', '9 min read', 'code'),
                        generatePub('Data Privacy', 'Compliance Regulations', 'Navigating agricultural data laws.', '7 min read', 'security'),
                        generatePub('FinOps Weekly', 'Cloud Cost Control', 'Identifying idle resources.', '5 min read', 'money'),
                        generatePub('UX Design', 'Offline-First Interfaces', 'Designing for low-bandwidth environments.', '11 min read', 'mobile'),
                        generatePub('Engineering Blog', 'Database Sharding', 'Scaling PostgreSQL for IoT time-series data.', '14 min read', 'database')
                    ]
                }
            };
            
            const defaultFallback = roleFallbacks['Farmer'];
            
            let baseData = roleFallbacks[userRole] || defaultFallback;
            
            if (searchQuery && searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const filterMatch = (item) => JSON.stringify(item).toLowerCase().includes(q);
                
                const filteredData = {
                    emergingTrends: baseData.emergingTrends.filter(filterMatch),
                    industryReports: baseData.industryReports.filter(filterMatch),
                    newPublications: baseData.newPublications.filter(filterMatch)
                };
                
                if (filteredData.emergingTrends.length === 0 && filteredData.industryReports.length === 0 && filteredData.newPublications.length === 0) {
                    data = baseData;
                } else {
                    data = filteredData;
                }
            } else {
                data = baseData;
            }
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("WhitePaper Dashboard Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard data." });
    }
};
