import GovScheme from '../models/GovScheme.js';
import FarmerProfile from '../models/FarmerProfile.js';
import geminiKeyManager from '../utils/geminiKeyManager.js';
import fs from 'fs';
import path from 'path';

const fail = (res, msg, status = 500) => res.status(status).json({ success: false, message: msg });
const ok = (res, data) => res.json({ success: true, ...data });

// Helper to get active profile or fall back
const getActiveFarmerProfile = async () => {
  try {
    const profile = await FarmerProfile.findOne({ userId: 'guest' });
    if (profile) return profile;
  } catch (e) {
    console.error('[Gov Schemes Controller] Profile fetch error:', e.message);
  }
  
  // Default fallback matching frontend seeds
  return {
    name: 'Suresh Kumar',
    location: 'Faridabad, Haryana',
    pincode: '121001',
    primaryCrops: ['Rice', 'Wheat'],
    farms: [
      {
        name: 'Home Sector Flatlands',
        location: 'Faridabad Outskirts',
        totalLand: 4.5,
        crops: [
          { name: 'Rice (Paddy)', sowingDate: '2026-05-01', sownArea: 2.5 },
          { name: 'Mustard', sowingDate: '2026-05-15', sownArea: 1.5 }
        ]
      }
    ]
  };
};

// Calculate eligibility dynamically based on farmer profile
const calculateEligibility = (scheme, stateName, totalLand, cropsList, categoriesList) => {
  let matchScore = scheme.matchScore || 85;
  let status = scheme.status || 'Not Applied';
  let statusType = scheme.statusType || 'not_applied';
  
  const state = stateName ? stateName.toLowerCase() : '';
  const isHaryana = state.includes('haryana') || state.includes('sonipat') || state.includes('faridabad');
  const schemeNameLower = scheme.name.toLowerCase();
  
  // Rule 1: State Scheme restrictions
  if (schemeNameLower.includes('haryana') && !isHaryana) {
    matchScore = Math.max(matchScore - 40, 10);
    status = 'Not Eligible';
    statusType = 'rejected';
  }
  
  // Rule 2: Land size restrictions (e.g. Small / Marginal vs Large)
  if (schemeNameLower.includes('kisan') && totalLand > 5) {
    // PM Kisan is typically for all landholders but let's adjust matching slightly
    matchScore = Math.max(matchScore - 20, 50);
  }
  
  // Rule 3: Category restrictions (e.g. Haryana SC Farmer Scheme requires SC)
  if (schemeNameLower.includes('sc farmer') && categoriesList) {
    const hasSC = categoriesList.some(cat => cat.toLowerCase().includes('sc'));
    if (!hasSC) {
      matchScore = Math.max(matchScore - 45, 10);
      status = 'Not Eligible';
      statusType = 'rejected';
    }
  }
  
  // Rule 4: Crop matching (e.g. Solar Pump, Micro Irrigation)
  if (schemeNameLower.includes('micro irrigation') || schemeNameLower.includes('kusum')) {
    const hasWaterIntensive = cropsList.some(c => {
      const name = c.toLowerCase();
      return name.includes('rice') || name.includes('sugarcane') || name.includes('paddy');
    });
    if (hasWaterIntensive) {
      matchScore = Math.min(matchScore + 5, 100);
    } else {
      matchScore = Math.max(matchScore - 15, 60);
    }
  }

  return { matchScore, status, statusType };
};

// ─── GET /api/gov-schemes ────────────────────────────────────────────────────
export const getGovSchemes = async (req, res) => {
  try {
    const profile = await getActiveFarmerProfile();
    
    // Read query overrides
    const queryState = req.query.state;
    const queryCrops = req.query.crops ? req.query.crops.split(',').filter(Boolean) : null;
    const queryLandSize = req.query.landSize ? Number(req.query.landSize) : null;
    const queryCategories = req.query.categories ? req.query.categories.split(',').filter(Boolean) : null;

    // Determine final values
    const finalState = queryState || profile.location || 'Haryana';
    
    let finalCrops = [];
    if (queryCrops && queryCrops.length > 0) {
      finalCrops = queryCrops;
    } else if (profile.farms) {
      profile.farms.forEach(f => {
        if (f.crops) {
          f.crops.forEach(c => {
            if (c.name) finalCrops.push(c.name);
          });
        }
      });
    }
    if (finalCrops.length === 0) {
      finalCrops = ['Rice', 'Wheat'];
    }

    const profileLand = profile.farms ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0) : 4.5;
    const finalLandSize = queryLandSize !== null && !isNaN(queryLandSize) ? queryLandSize : profileLand;

    const finalCategories = queryCategories || (profile.category || ['SC', 'Small Farmer']);

    const schemes = await GovScheme.find({}).sort({ id: 1 }).lean();
    
    // Dynamically map eligibility parameters
    const processedSchemes = schemes.map(scheme => {
      const { matchScore, status, statusType } = calculateEligibility(scheme, finalState, finalLandSize, finalCrops, finalCategories);
      return {
        ...scheme,
        matchScore,
        status: scheme.status === 'Not Applied' ? status : scheme.status,
        statusType: scheme.statusType === 'not_applied' ? statusType : scheme.statusType
      };
    });

    return ok(res, { schemes: processedSchemes });
  } catch (err) {
    console.error('[Gov Schemes Controller] Error:', err);
    return fail(res, 'Internal Server Error', 500);
  }
};

// ─── GET /api/gov-schemes/:id ────────────────────────────────────────────────
export const getGovSchemeById = async (req, res) => {
  try {
    const schemeId = Number(req.params.id);
    if (isNaN(schemeId)) {
      return fail(res, 'Invalid Scheme ID', 400);
    }

    const scheme = await GovScheme.findOne({ id: schemeId }).lean();
    if (!scheme) {
      return fail(res, 'Scheme not found', 404);
    }

    const profile = await getActiveFarmerProfile();
    const totalLand = profile.farms ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0) : 4.5;
    const crops = [];
    if (profile.farms) {
      profile.farms.forEach(f => {
        if (f.crops) {
          f.crops.forEach(c => {
            if (c.name) crops.push(c.name);
          });
        }
      });
    }

    // Process eligibility
    const { matchScore, status, statusType } = calculateEligibility(
      scheme, 
      profile.location || 'Haryana', 
      totalLand, 
      crops, 
      profile.category || ['SC', 'Small Farmer']
    );
    
    return ok(res, { 
      scheme: {
        ...scheme,
        matchScore,
        status: scheme.status === 'Not Applied' ? status : scheme.status,
        statusType: scheme.statusType === 'not_applied' ? statusType : scheme.statusType
      }
    });
  } catch (err) {
    console.error('[Gov Schemes Controller] Error:', err);
    return fail(res, 'Internal Server Error', 500);
  }
};

// ─── GET /api/gov-schemes/dashboard ──────────────────────────────────────────
export const getGovSchemesDashboard = async (req, res) => {
  try {
    const profile = await getActiveFarmerProfile();
    
    // Calculate dynamic stats
    const totalLand = profile.farms ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0) : 4.5;
    const crops = [];
    if (profile.farms) {
      profile.farms.forEach(f => {
        if (f.crops) {
          f.crops.forEach(c => {
            if (c.name) crops.push(c.name);
          });
        }
      });
    }

    const schemes = await GovScheme.find({}).lean();
    
    let eligibleCount = 0;
    let activeApplications = 0;
    let approvedCount = 0;
    let actionNeededCount = 0;

    schemes.forEach(scheme => {
      const { status, statusType } = calculateEligibility(
        scheme, 
        profile.location || 'Haryana', 
        totalLand, 
        crops, 
        profile.category || ['SC', 'Small Farmer']
      );
      const finalStatus = scheme.status === 'Not Applied' ? status : scheme.status;
      const finalStatusType = scheme.statusType === 'not_applied' ? statusType : scheme.statusType;
      
      if (finalStatusType === 'applied' || finalStatusType === 'active' || finalStatusType === 'approved' || finalStatusType === 'action_needed') {
        activeApplications++;
      }
      if (finalStatusType === 'approved') {
        approvedCount++;
      }
      if (finalStatusType === 'action_needed') {
        actionNeededCount++;
      }
      if (finalStatus !== 'Not Eligible') {
        eligibleCount++;
      }
    });

    // Load static metrics from govt_scheme.json to keep distribution and trend charts filled
    let templateData = {};
    try {
      const fileContent = fs.readFileSync(path.resolve('./seed-json/govt_scheme.json'), 'utf-8');
      templateData = JSON.parse(fileContent);
    } catch (e) {
      console.warn('Could not read seed json for dashboard fallback:', e.message);
    }

    const farmerProfile = {
      name: profile.name,
      location: profile.location,
      lastUpdated: new Date().toLocaleString('en-IN', { hour12: true }) + ' (Live)',
      landSize: totalLand,
      crops: crops.length ? crops : ['Rice', 'Wheat']
    };

    const kpiCards = [
      { id: 1, title: 'ELIGIBLE SCHEMES', value: String(eligibleCount), trend: '+3 new', trendType: 'success', subtext: 'Based on crops & location', iconName: 'CheckCircle2' },
      { id: 2, title: 'ACTIVE APPLICATIONS', value: String(activeApplications), trend: `${actionNeededCount} action needed`, trendType: 'info', subtext: `${approvedCount} Approved · ${activeApplications - approvedCount - actionNeededCount} In Review`, iconName: 'FileText' },
      { id: 3, title: 'BENEFITS RECEIVED', value: '₹64,200', trend: '₹21,700', trendType: 'success', subtext: 'this year', iconName: 'IndianRupee' },
      { id: 4, title: 'PENDING BENEFITS', value: '₹15,000', trend: 'Release scheduled', trendType: 'info', subtext: 'est. release: 20 Jun', iconName: 'Clock' },
      { id: 5, title: 'NEXT DEADLINE', value: '12 days', trend: 'Critical', trendType: 'danger', subtext: 'PMFBY enrollment closes Jun 30', iconName: 'CalendarDays' },
      { id: 6, title: 'REJECTED APPLICATIONS', value: '1', trend: 'Fix available', trendType: 'warning', subtext: 'PMKSY - Incomplete certificate', iconName: 'AlertCircle' }
    ];

    const benefitDistribution = templateData.benefitDistribution || [
      { name: "PM Kisan", value: 30, amount: 19260, color: "#132a13" },
      { name: "PMFBY", value: 25, amount: 16050, color: "#31572c" },
      { name: "Irrigation Subsidy", value: 20, amount: 12840, color: "#4f772d" }
    ];

    const trendData = templateData.trendData || [];
    const aiRecommendedSchemes = templateData.aiRecommendedSchemes || [];
    const upcomingActions = templateData.upcomingActions || [];
    const eligibilityData = templateData.eligibilityData || {
      governmentReadinessScore: 88,
      scoreLabel: "Excellent",
      scoreBreakdown: [
        { name: "Identity Verification", score: 100 },
        { name: "Land Records Matching", score: 90 },
        { name: "Crop Sowing Accuracy", score: 85 },
        { name: "Bank Seeding Status", score: 80 }
      ],
      eligibilitySummary: {
        eligible: { count: eligibleCount, potential: "₹1,80,000" },
        partiallyEligible: { count: 3, potential: "₹1,65,000", blocking: "Missing reports/certificates" },
        notEligible: { count: 2, reasons: ["Caste requirement", "FPO membership"] }
      },
      missingRequirements: [
        { name: "Solar pump feasibility report", status: "missing", affects: 2, fixAction: "Schedule a field visit via Haryana Renewable Energy agency.", fixLink: "schedule_visit" },
        { name: "Drip Irrigation installation certificate", status: "missing", affects: 1, fixAction: "Upload supplier invoice and photos of setup.", fixLink: "upload_cert" }
      ],
      benefitOpportunity: { totalEligible: "₹3,45,000", totalClaimed: "₹64,200", potentialGrowth: "+₹2,80,800" }
    };

    return ok(res, {
      farmerProfile,
      kpiCards,
      benefitDistribution,
      trendData,
      aiRecommendedSchemes,
      upcomingActions,
      eligibilityData
    });
  } catch (err) {
    console.error('[Gov Schemes Controller] Error:', err);
    return fail(res, 'Internal Server Error', 500);
  }
};

// ─── POST /api/gov-schemes/chat (AI Advisor) ─────────────────────────────────
export const chatWithSchemeAI = async (req, res) => {
  try {
    const { message, farmerProfile, schemeContext } = req.body;

    if (!message) {
      return fail(res, "Message is required", 400);
    }

    const defaultProfile = {
      name: "Suresh Kumar",
      location: "Faridabad, Haryana",
      landSize: 4.5,
      crops: ["Rice", "Wheat"],
      irrigation: "Drip",
      category: ["SC", "Small Farmer"]
    };

    const profile = farmerProfile || defaultProfile;

    // Build farmer profile context string for Gemini
    const contextString = `
Farmer Profile Context:
- Name: ${profile.name}
- Location: ${profile.location}
- Land Size: ${profile.landSize} Acres
- Crops grown: ${profile.crops ? profile.crops.join(', ') : 'None listed'}
- Irrigation Method: ${profile.irrigation}
- Category: ${profile.category ? profile.category.join(', ') : 'General'}
${schemeContext ? `Active Scheme Query Context: ${JSON.stringify(schemeContext)}` : ''}
`;

    const systemInstruction = `You are AgroIndia AI Schemes Advisor, a helpful and knowledgeable agricultural government schemes specialist. 
Your goal is to help Indian farmers navigate government schemes, subsidies, loans, crop insurance, and eligibility requirements.
Keep in mind the farmer's profile:
${contextString}
Provide highly relevant, actionable, and personalized schemes information based on their crop list, location (State/District), landholdings, and caste category.
Use simple, clear, and reassuring language. 
Adhere to the following rules:
1. Do not invent scheme benefits or application windows.
2. Provide step-by-step guidance on how to apply, which documents are needed, and how to resolve missing verification items.
3. Keep the tone helpful, professional, and empathetic to rural users.
4. Keep the response concise and structured (use bullet points).
`;

    let responseText = null;
    let attempts = 0;
    const maxAttempts = Math.max(geminiKeyManager.keyCount, 1);

    while (attempts < maxAttempts && !responseText) {
      try {
        const apiKey = geminiKeyManager.getNextKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: message }]
              }
            ],
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000
            }
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Gemini API Error');
        }

        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        console.warn(`[AI Schemes Advisor] Gemini call failed on attempt ${attempts + 1}: ${err.message}`);
        if (geminiKeyManager.keyCount <= 1) {
          break;
        }
      }
      attempts++;
    }

    if (!responseText) {
      responseText = `I apologize, but my live connection to the Gemini AI advisor is busy. Based on your profile (${profile.location}, ${profile.landSize} acres), here is what I recommend:
- Check your **PM Kisan** status (you are eligible for ₹6,000/year).
- Complete your **Bank-Aadhaar seeding** to unlock pending installments.
- Since you grow ${profile.crops ? profile.crops.join(', ') : 'crops'}, check the **PMFBY Crop Insurance** deadlines for the current season.
Please try again in a few moments for full interactive chat.`;
    }

    return ok(res, { answer: responseText });
  } catch (e) {
    console.error("[Schemes AI Controller Error]", e);
    return fail(res, "Internal Server Error", 500);
  }
};
