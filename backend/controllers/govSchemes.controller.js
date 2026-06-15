import GovScheme from "../models/GovScheme.js";
import FarmerProfile from "../models/FarmerProfile.js";
import GovSchemeInteraction from "../models/GovSchemeInteraction.js";
import GovSchemeAdminAnalytics from "../models/GovSchemeAdminAnalytics.js";
import geminiKeyManager from "../utils/geminiKeyManager.js";
import fs from "fs";
import path from "path";

const fail = (res, msg, status = 500) =>
  res.status(status).json({ success: false, message: msg });
const ok = (res, data) => res.json({ success: true, ...data });

// Helper to get active profile or fall back
const getActiveFarmerProfile = async () => {
  try {
    const profile = await FarmerProfile.findOne({ userId: "guest" });
    if (profile) return profile;
  } catch (e) {
    console.error("[Gov Schemes Controller] Profile fetch error:", e.message);
  }

  // Default fallback matching frontend seeds
  return {
    name: "Suresh Kumar",
    location: "Faridabad, Haryana",
    pincode: "121001",
    primaryCrops: ["Rice", "Wheat"],
    farms: [
      {
        name: "Home Sector Flatlands",
        location: "Faridabad Outskirts",
        totalLand: 4.5,
        crops: [
          { name: "Rice (Paddy)", sowingDate: "2026-05-01", sownArea: 2.5 },
          { name: "Mustard", sowingDate: "2026-05-15", sownArea: 1.5 },
        ],
      },
    ],
  };
};

// Calculate eligibility dynamically based on farmer profile
const calculateEligibility = (
  scheme,
  stateName,
  totalLand,
  cropsList,
  categoriesList,
) => {
  let matchScore = scheme.matchScore || 85;
  let status = scheme.status || "Not Applied";
  let statusType = scheme.statusType || "not_applied";

  const state = stateName ? stateName.toLowerCase() : "";
  const isHaryana =
    state.includes("haryana") ||
    state.includes("sonipat") ||
    state.includes("faridabad");
  const schemeNameLower = scheme.name.toLowerCase();

  // Rule 1: State Scheme restrictions
  if (schemeNameLower.includes("haryana") && !isHaryana) {
    matchScore = Math.max(matchScore - 40, 10);
    status = "Not Eligible";
    statusType = "rejected";
  }

  // Rule 2: Land size restrictions (e.g. Small / Marginal vs Large)
  if (schemeNameLower.includes("kisan") && totalLand > 5) {
    // PM Kisan is typically for all landholders but let's adjust matching slightly
    matchScore = Math.max(matchScore - 20, 50);
  }

  // Rule 3: Category restrictions (e.g. Haryana SC Farmer Scheme requires SC)
  if (schemeNameLower.includes("sc farmer") && categoriesList) {
    const hasSC = categoriesList.some((cat) =>
      cat.toLowerCase().includes("sc"),
    );
    if (!hasSC) {
      matchScore = Math.max(matchScore - 45, 10);
      status = "Not Eligible";
      statusType = "rejected";
    }
  }

  // Rule 4: Crop matching (e.g. Solar Pump, Micro Irrigation)
  if (
    schemeNameLower.includes("micro irrigation") ||
    schemeNameLower.includes("kusum")
  ) {
    const hasWaterIntensive = cropsList.some((c) => {
      const name = c.toLowerCase();
      return (
        name.includes("rice") ||
        name.includes("sugarcane") ||
        name.includes("paddy")
      );
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
    const queryCrops = req.query.crops
      ? req.query.crops.split(",").filter(Boolean)
      : null;
    const queryLandSize = req.query.landSize
      ? Number(req.query.landSize)
      : null;
    const queryCategories = req.query.categories
      ? req.query.categories.split(",").filter(Boolean)
      : null;
    const queryRole = req.query.role;

    // Determine final values
    const finalState = queryState || profile.location || "Haryana";

    let finalCrops = [];
    if (queryCrops && queryCrops.length > 0) {
      finalCrops = queryCrops;
    } else if (profile.farms) {
      profile.farms.forEach((f) => {
        if (f.crops) {
          f.crops.forEach((c) => {
            if (c.name) finalCrops.push(c.name);
          });
        }
      });
    }
    if (finalCrops.length === 0) {
      finalCrops = ["Rice", "Wheat"];
    }

    const profileLand = profile.farms
      ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0)
      : 4.5;
    const finalLandSize =
      queryLandSize !== null && !isNaN(queryLandSize)
        ? queryLandSize
        : profileLand;

    const finalCategories = queryCategories ||
      profile.category || ["SC", "Small Farmer"];

    // Build filter based on role query
    const dbFilter = {};
    if (queryRole === "farmer") {
      dbFilter.isFarmerScheme = true;
    }

    const schemes = await GovScheme.find(dbFilter).sort({ id: 1 }).lean();

    // Fetch and aggregate live telemetry interactions from GovSchemeInteraction
    const interactions = await GovSchemeInteraction.aggregate([
      {
        $group: {
          _id: { schemeId: "$schemeId", type: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);

    const interactionMap = {};
    interactions.forEach((item) => {
      const { schemeId, type } = item._id;
      if (!interactionMap[schemeId]) {
        interactionMap[schemeId] = {
          viewed: 0,
          guideOpened: 0,
          applyClicked: 0,
          farmerSavedCount: 0,
        };
      }
      if (type === "view") interactionMap[schemeId].viewed += item.count;
      if (type === "guide_open")
        interactionMap[schemeId].guideOpened += item.count;
      if (type === "apply_click")
        interactionMap[schemeId].applyClicked += item.count;
      if (type === "bookmark")
        interactionMap[schemeId].farmerSavedCount += item.count;
    });

    // Dynamically map eligibility parameters and merge telemetry
    const processedSchemes = schemes.map((scheme) => {
      const { matchScore, status, statusType } = calculateEligibility(
        scheme,
        finalState,
        finalLandSize,
        finalCrops,
        finalCategories,
      );
      const liveStats = interactionMap[scheme.id] || {
        viewed: 0,
        guideOpened: 0,
        applyClicked: 0,
        farmerSavedCount: 0,
      };

      return {
        ...scheme,
        matchScore,
        status: scheme.status === "Not Applied" ? status : scheme.status,
        statusType:
          scheme.statusType === "not_applied" ? statusType : scheme.statusType,
        viewed: (scheme.viewed || 0) + liveStats.viewed,
        guideOpened: (scheme.guideOpened || 0) + liveStats.guideOpened,
        applyClicked: (scheme.applyClicked || 0) + liveStats.applyClicked,
        farmerSavedCount:
          (scheme.farmerSavedCount || 0) + liveStats.farmerSavedCount,
      };
    });

    // Read static template metadata from seed JSON
    let templateData = {};
    try {
      const fileContent = fs.readFileSync(
        path.resolve("./seed-json/govt_scheme.json"),
        "utf-8",
      );
      templateData = JSON.parse(fileContent);
    } catch (e) {
      console.warn(
        "Could not read seed json for dashboard fallback:",
        e.message,
      );
    }

    return ok(res, {
      schemes: processedSchemes,
      discoveryFilters: templateData.discoveryFilters || {},
      matchBreakdown: templateData.matchBreakdown || {},
      blockingFactors: templateData.blockingFactors || [],
      farmerProfile: templateData.farmerProfile || {},
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── GET /api/gov-schemes/:id ────────────────────────────────────────────────
export const getGovSchemeById = async (req, res) => {
  try {
    const schemeId = req.params.id;
    if (!schemeId) {
      return fail(res, "Invalid Scheme ID", 400);
    }

    const scheme = await GovScheme.findOne({ id: schemeId }).lean();
    if (!scheme) {
      return fail(res, "Scheme not found", 404);
    }

    const profile = await getActiveFarmerProfile();
    const totalLand = profile.farms
      ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0)
      : 4.5;
    const crops = [];
    if (profile.farms) {
      profile.farms.forEach((f) => {
        if (f.crops) {
          f.crops.forEach((c) => {
            if (c.name) crops.push(c.name);
          });
        }
      });
    }

    // Process eligibility
    const { matchScore, status, statusType } = calculateEligibility(
      scheme,
      profile.location || "Haryana",
      totalLand,
      crops,
      profile.category || ["SC", "Small Farmer"],
    );

    // Fetch dynamic telemetry for this scheme
    const liveStats = {
      viewed: 0,
      guideOpened: 0,
      applyClicked: 0,
      farmerSavedCount: 0,
    };
    const interactionStats = await GovSchemeInteraction.aggregate([
      { $match: { schemeId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
    interactionStats.forEach((item) => {
      if (item._id === "view") liveStats.viewed += item.count;
      if (item._id === "guide_open") liveStats.guideOpened += item.count;
      if (item._id === "apply_click") liveStats.applyClicked += item.count;
      if (item._id === "bookmark") liveStats.farmerSavedCount += item.count;
    });

    return ok(res, {
      scheme: {
        ...scheme,
        matchScore,
        status: scheme.status === "Not Applied" ? status : scheme.status,
        statusType:
          scheme.statusType === "not_applied" ? statusType : scheme.statusType,
        viewed: (scheme.viewed || 0) + liveStats.viewed,
        guideOpened: (scheme.guideOpened || 0) + liveStats.guideOpened,
        applyClicked: (scheme.applyClicked || 0) + liveStats.applyClicked,
        farmerSavedCount:
          (scheme.farmerSavedCount || 0) + liveStats.farmerSavedCount,
      },
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── GET /api/gov-schemes/dashboard ──────────────────────────────────────────
export const getGovSchemesDashboard = async (req, res) => {
  try {
    const profile = await getActiveFarmerProfile();

    // Calculate dynamic stats
    const totalLand = profile.farms
      ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0)
      : 4.5;
    const crops = [];
    if (profile.farms) {
      profile.farms.forEach((f) => {
        if (f.crops) {
          f.crops.forEach((c) => {
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

    schemes.forEach((scheme) => {
      const { status, statusType } = calculateEligibility(
        scheme,
        profile.location || "Haryana",
        totalLand,
        crops,
        profile.category || ["SC", "Small Farmer"],
      );
      const finalStatus =
        scheme.status === "Not Applied" ? status : scheme.status;
      const finalStatusType =
        scheme.statusType === "not_applied" ? statusType : scheme.statusType;

      if (
        finalStatusType === "applied" ||
        finalStatusType === "active" ||
        finalStatusType === "approved" ||
        finalStatusType === "action_needed"
      ) {
        activeApplications++;
      }
      if (finalStatusType === "approved") {
        approvedCount++;
      }
      if (finalStatusType === "action_needed") {
        actionNeededCount++;
      }
      if (finalStatus !== "Not Eligible") {
        eligibleCount++;
      }
    });

    // Load static metrics from govt_scheme.json to keep distribution and trend charts filled
    let templateData = {};
    try {
      const fileContent = fs.readFileSync(
        path.resolve("./seed-json/govt_scheme.json"),
        "utf-8",
      );
      templateData = JSON.parse(fileContent);
    } catch (e) {
      console.warn(
        "Could not read seed json for dashboard fallback:",
        e.message,
      );
    }

    const farmerProfile = {
      name: profile.name,
      location: profile.location,
      lastUpdated:
        new Date().toLocaleString("en-IN", { hour12: true }) + " (Live)",
      landSize: totalLand,
      crops: crops.length ? crops : ["Rice", "Wheat"],
    };

    const kpiCards = [
      {
        id: 1,
        title: "ELIGIBLE SCHEMES",
        value: String(eligibleCount),
        trend: "+3 new",
        trendType: "success",
        subtext: "Based on crops & location",
        iconName: "CheckCircle2",
      },
      {
        id: 2,
        title: "ACTIVE APPLICATIONS",
        value: String(activeApplications),
        trend: `${actionNeededCount} action needed`,
        trendType: "info",
        subtext: `${approvedCount} Approved · ${activeApplications - approvedCount - actionNeededCount} In Review`,
        iconName: "FileText",
      },
      {
        id: 3,
        title: "BENEFITS RECEIVED",
        value: "₹64,200",
        trend: "₹21,700",
        trendType: "success",
        subtext: "this year",
        iconName: "IndianRupee",
      },
      {
        id: 4,
        title: "PENDING BENEFITS",
        value: "₹15,000",
        trend: "Release scheduled",
        trendType: "info",
        subtext: "est. release: 20 Jun",
        iconName: "Clock",
      },
      {
        id: 5,
        title: "NEXT DEADLINE",
        value: "12 days",
        trend: "Critical",
        trendType: "danger",
        subtext: "PMFBY enrollment closes Jun 30",
        iconName: "CalendarDays",
      },
      {
        id: 6,
        title: "REJECTED APPLICATIONS",
        value: "1",
        trend: "Fix available",
        trendType: "warning",
        subtext: "PMKSY - Incomplete certificate",
        iconName: "AlertCircle",
      },
    ];

    const benefitDistribution = templateData.benefitDistribution || [
      { name: "PM Kisan", value: 30, amount: 19260, color: "#132a13" },
      { name: "PMFBY", value: 25, amount: 16050, color: "#31572c" },
      {
        name: "Irrigation Subsidy",
        value: 20,
        amount: 12840,
        color: "#4f772d",
      },
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
        { name: "Bank Seeding Status", score: 80 },
      ],
      eligibilitySummary: {
        eligible: { count: eligibleCount, potential: "₹1,80,000" },
        partiallyEligible: {
          count: 3,
          potential: "₹1,65,000",
          blocking: "Missing reports/certificates",
        },
        notEligible: {
          count: 2,
          reasons: ["Caste requirement", "FPO membership"],
        },
      },
      missingRequirements: [
        {
          name: "Solar pump feasibility report",
          status: "missing",
          affects: 2,
          fixAction:
            "Schedule a field visit via Haryana Renewable Energy agency.",
          fixLink: "schedule_visit",
        },
        {
          name: "Drip Irrigation installation certificate",
          status: "missing",
          affects: 1,
          fixAction: "Upload supplier invoice and photos of setup.",
          fixLink: "upload_cert",
        },
      ],
      benefitOpportunity: {
        totalEligible: "₹3,45,000",
        totalClaimed: "₹64,200",
        potentialGrowth: "+₹2,80,800",
      },
    };

    return ok(res, {
      farmerProfile,
      kpiCards,
      benefitDistribution,
      trendData,
      aiRecommendedSchemes,
      upcomingActions,
      eligibilityData,
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Error:", err);
    return fail(res, "Internal Server Error", 500);
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
      category: ["SC", "Small Farmer"],
    };

    const profile = farmerProfile || defaultProfile;

    // Build farmer profile context string for Gemini
    const contextString = `
Farmer Profile Context:
- Name: ${profile.name}
- Location: ${profile.location}
- Land Size: ${profile.landSize} Acres
- Crops grown: ${profile.crops ? profile.crops.join(", ") : "None listed"}
- Irrigation Method: ${profile.irrigation}
- Category: ${profile.category ? profile.category.join(", ") : "General"}
${schemeContext ? `Active Scheme Query Context: ${JSON.stringify(schemeContext)}` : ""}
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: message }],
              },
            ],
            system_instruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Gemini API Error");
        }

        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        console.warn(
          `[AI Schemes Advisor] Gemini call failed on attempt ${attempts + 1}: ${err.message}`,
        );
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
- Since you grow ${profile.crops ? profile.crops.join(", ") : "crops"}, check the **PMFBY Crop Insurance** deadlines for the current season.
Please try again in a few moments for full interactive chat.`;
    }

    return ok(res, { answer: responseText });
  } catch (e) {
    console.error("[Schemes AI Controller Error]", e);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── POST /api/gov-schemes/:id/interact ──────────────────────────────────────
export const postInteraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;
    const farmerId = req.query.farmerId || "guest";

    if (!type) {
      return fail(res, "Interaction type is required", 405);
    }

    if (type === "bookmark" && value === false) {
      // Delete bookmark interaction to simulate toggle off
      await GovSchemeInteraction.deleteMany({
        schemeId: id,
        farmerId,
        type: "bookmark",
      });
      return ok(res, { message: "Bookmark removed successfully" });
    }

    // Otherwise create interaction log
    const interaction = await GovSchemeInteraction.create({
      schemeId: id,
      farmerId,
      type,
    });

    return ok(res, { message: "Interaction logged successfully", interaction });
  } catch (err) {
    console.error("[Gov Schemes Controller] Interaction error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── GET /api/gov-schemes/admin/analytics ────────────────────────────────────
export const CALENDAR_EVENTS = [
  {
    id: "12",
    title: "Haryana Organic Farming Subsidy Outlay",
    scheme: "Organic Farming Subsidy",
    category: "Subsidy",
    season: "Zaid",
    state: "Haryana",
    crop: "All",
    date: "2026-02-28",
    type: "deadline",
    priority: "high",
    description: "Submit crop sowing certificate and land verification to claim organic farming outlays.",
    amount: "₹15,000",
    action: "Complete Upload"
  },
  {
    id: "13",
    title: "PM-KISAN 16th Installment Aadhaar Seeding Correction",
    scheme: "PM Kisan Samman Nidhi",
    category: "Direct Benefit",
    season: "Rabi",
    state: "Haryana",
    crop: "All",
    date: "2026-04-15",
    type: "deadline",
    priority: "urgent",
    description: "Submit Aadhaar seeding correction consent slip to bank branch for winter installment clearance.",
    amount: "₹2,000",
    action: "Link Account"
  },
  {
    id: "10",
    title: "Soil Health Card Distribution Camp",
    scheme: "Soil Health Card Scheme",
    category: "Service",
    season: "Zaid",
    state: "Haryana",
    crop: "All",
    date: "2026-05-15",
    type: "training",
    priority: "low",
    description: "Free soil testing camp and fertilizer recommendation chart collection.",
    location: "Sonipat District Krishi Vigyan Kendra",
    amount: "Free Soil Test",
    action: "Collect Card"
  },
  {
    id: "11",
    title: "e-NAM Digital Trade Registration Drive",
    scheme: "e-NAM National Agriculture Market",
    category: "Service",
    season: "Zaid",
    state: "Haryana",
    crop: "All",
    date: "2026-05-20",
    type: "training",
    priority: "low",
    description: "Onboarding workshop for grain lists directly on the national digital market site.",
    location: "Sonipat Grain Mandi",
    amount: "Free Onboarding",
    action: "Register Now"
  },
  {
    id: "1",
    title: "PMFBY Kharif Crop Insurance Enrollment",
    scheme: "PMFBY Crop Insurance",
    category: "Insurance",
    season: "Kharif",
    state: "Haryana",
    crop: "Rice",
    date: "2026-06-30",
    type: "deadline",
    priority: "urgent",
    description: "Final deadline to submit crop sowing certificate and pay subsidized premium for paddy crop insurance.",
    amount: "₹75,000",
    action: "Renew Policy"
  },
  {
    id: "2",
    title: "PM Kisan 17th Installment Release",
    scheme: "PM Kisan Samman Nidhi",
    category: "Direct Benefit",
    season: "Kharif",
    state: "Haryana",
    crop: "All",
    date: "2026-06-20",
    type: "installment",
    priority: "high",
    description: "Scheduled release of ₹2,000 direct benefit transfer into Aadhaar-seeded bank accounts.",
    amount: "₹2,000",
    action: "Check Bank Status"
  },
  {
    id: "3",
    title: "PM Kusum Solar Pump Capital Subsidy Window",
    scheme: "PM Kusum Solar Pump",
    category: "Subsidy",
    season: "Kharif",
    state: "Haryana",
    crop: "Sugarcane",
    date: "2026-06-30",
    type: "deadline",
    priority: "high",
    description: "Application window closes for 60% capital subsidy on solar water pumps up to 7.5 HP.",
    amount: "₹1,20,000",
    action: "Complete Upload"
  },
  {
    id: "4",
    title: "Haryana State SC Farmer Tubewell Subsidy",
    scheme: "Haryana SC Farmer Scheme",
    category: "Subsidy",
    season: "Kharif",
    state: "Haryana",
    crop: "All",
    date: "2026-07-15",
    type: "deadline",
    priority: "medium",
    description: "State-specific subsidy applications for borewell and tubewell electrification for SC category farmers.",
    amount: "₹25,000",
    action: "Submit Caste Certificate"
  },
  {
    id: "5",
    title: "National Food Security Mission Seed Distribution Drive",
    scheme: "NFSM Seed Subsidy",
    category: "Subsidy",
    season: "Kharif",
    state: "Punjab",
    crop: "Rice",
    date: "2026-06-18",
    type: "training",
    priority: "medium",
    description: "Distribution of high-yielding rice seed varieties at 50% subsidized rates at local block offices.",
    amount: "50% Discount",
    location: "Block Dev Office, Sonipat",
    action: "Locate Center"
  }
];

export const getAdminAnalytics = async (req, res) => {
  try {
    const companyId = "guest";

    // 1. Fetch admin analytics metadata
    let adminAnalytics = await GovSchemeAdminAnalytics.findOne({
      companyId,
    }).lean();

    // Default structure matching frontend govSchemesHelper defaults
    const defaults = {
      profileStrength: 82,
      companyProfile: {
        gstin: "06AAAAA1111A1Z1",
        cin: "U01110HR2023PTC112233",
        udyam: "UDYAM-HR-12-0004567",
        dpiit: "DPIIT-88493",
        pan: "AAAAA1111A",
        turnover: "₹18.5 Crore",
        employees: "142",
        netWorth: "₹8.2 Crore",
        yearsInOperation: "3 Years",
        statesServed: ["Haryana", "Punjab", "Rajasthan"],
        farmerNetwork: "12,400+ Farmers",
        fpoPartnerships: "8 Active FPOs",
        cropFocus: ["Paddy", "Wheat", "Mustard", "Cotton"],
        techStack: "AgroIndia Analytics Dashboard & Soil Sensors V2",
        businessCategory: "Agribusiness & Agritech SaaS Provider",
        preferredStates: ["Haryana", "Punjab"],
        growthStage: "Early Scaleup",
        fundingStage: "Series A",
      },
      missedOpportunities: [
        {
          id: "missed-01",
          name: "National Beekeeping Honey Mission Support",
          potValue: "₹15,00,000",
          expiredDate: "2026-05-15",
          reason: "Deadline Missed",
          isFarmerScheme: true,
          farmerCount: 42,
        },
        {
          id: "missed-02",
          name: "PM Formalisation of Micro Food Processing Enterprises",
          potValue: "₹10,00,000",
          expiredDate: "2026-04-10",
          reason: "Required Certification Missing",
          isFarmerScheme: true,
          farmerCount: 18,
        },
        {
          id: "missed-03",
          name: "NABARD Agri-Clinic Venture Subsidy",
          potValue: "₹20,00,000",
          expiredDate: "2026-05-01",
          reason: "Missing Udyam Registration",
          isFarmerScheme: false,
        },
        {
          id: "missed-04",
          name: "SIDBI Agritech Digital Grant V1",
          potValue: "₹15,00,000",
          expiredDate: "2026-04-15",
          reason: "Profile Incomplete",
          isFarmerScheme: false,
        },
      ],
      outreach: {
        farmersReached: 12400,
        campaignsSent: 12,
        notificationOpens: 4235,
        engagementRate: 84.5,
      },
      campaigns: [
        {
          id: "c-01",
          name: "PM-Kisan Seed Funding Awareness",
          channel: "WhatsApp",
          sentCount: 4500,
          opens: 3950,
          clicks: 1240,
          status: "Delivered",
          date: "2026-06-08",
        },
        {
          id: "c-02",
          name: "Crop Insurance Renewal Campaign",
          channel: "SMS",
          sentCount: 6200,
          opens: 5100,
          clicks: 840,
          status: "Completed",
          date: "2026-06-01",
        },
        {
          id: "c-03",
          name: "Drip Irrigation Subsidy Info Dispatch",
          channel: "Email",
          sentCount: 1200,
          opens: 900,
          clicks: 310,
          status: "Completed",
          date: "2026-05-25",
        },
      ],
      farmers: [
        {
          id: "f-01",
          name: "Rajesh Kumar",
          state: "Haryana",
          crop: "Paddy",
          size: "Medium",
          type: "Smallholder",
          fpo: "Sonipat Organic FPO",
          schemes: ["PM-Kisan", "PMFBY"],
          outreachStatus: "Sent",
          lastComm: "2026-06-10",
        },
        {
          id: "f-02",
          name: "Satnam Singh",
          state: "Punjab",
          crop: "Wheat",
          size: "Large",
          type: "Commercial",
          fpo: "Amritsar Farmers Union",
          schemes: ["PMFBY"],
          outreachStatus: "Interacted",
          lastComm: "2026-06-11",
        },
        {
          id: "f-03",
          name: "Suresh Sharma",
          state: "Haryana",
          crop: "Mustard",
          size: "Small",
          type: "Smallholder",
          fpo: "Rohtak Agri Cooperative",
          schemes: ["PM-Kisan"],
          outreachStatus: "Not Contacted",
          lastComm: "-",
        },
      ],
      updates: [
        {
          id: "upd-01",
          title: "New Guidelines for PMFBY H1 2026",
          type: "Policy Updates",
          date: "2026-06-11",
          summary:
            "Ministry released operational guidelines detailing new subsidy slabs for organic mustard crops in Haryana.",
        },
        {
          id: "upd-02",
          title: "Circular 24-B: Export Credit Guarantee Slabs",
          type: "New Circulars",
          date: "2026-06-05",
          summary:
            "State bank circular revising interest coverage details for agribusiness startup export credit schemes.",
        },
      ],
      alerts: [
        {
          id: "a-01",
          title: "High Match Opportunity Detected: AIF Subvention",
          type: "Opportunity Alert",
          category: "opportunity",
          date: "2026-06-12",
          priority: "Critical",
          read: false,
        },
        {
          id: "a-02",
          title: "New Matching Scheme Available: Solar Pump Incentives",
          type: "Opportunity Alert",
          category: "opportunity",
          date: "2026-06-11",
          priority: "Info",
          read: false,
        },
        {
          id: "a-03",
          title: "Deadline Approaching: RKVY-RAFTAAR Seed Funding",
          type: "Opportunity Alert",
          category: "opportunity",
          date: "2026-06-12",
          priority: "Critical",
          read: false,
        },
        {
          id: "a-04",
          title: "Eligibility Criteria Updated: Tax Holiday Guidelines",
          type: "Opportunity Alert",
          category: "opportunity",
          date: "2026-06-09",
          priority: "Warning",
          read: true,
        },
        {
          id: "a-05",
          title: "Missing Registration: Udyam Registration Blocked",
          type: "Readiness Alert",
          category: "readiness",
          date: "2026-06-10",
          priority: "Critical",
          read: false,
        },
        {
          id: "a-06",
          title: "Profile Completion Dropped: Statements Expiring",
          type: "Readiness Alert",
          category: "readiness",
          date: "2026-06-10",
          priority: "Warning",
          read: false,
        },
        {
          id: "a-07",
          title: "Financial Records Outdated: CA Audited Files Needed",
          type: "Readiness Alert",
          category: "readiness",
          date: "2026-06-08",
          priority: "Warning",
          read: true,
        },
        {
          id: "a-08",
          title: "PMFBY Interest Increased 35% (Sonipat District)",
          type: "Farmer Interest Alert",
          category: "farmer_interest",
          date: "2026-06-12",
          priority: "Info",
          read: false,
        },
        {
          id: "a-09",
          title: "KCC Searches Increased 22% (Amritsar District)",
          type: "Farmer Interest Alert",
          category: "farmer_interest",
          date: "2026-06-11",
          priority: "Info",
          read: false,
        },
        {
          id: "a-10",
          title: "New Farmer Demand Trend Detected: Mustard Subsidy",
          type: "Farmer Interest Alert",
          category: "farmer_interest",
          date: "2026-06-09",
          priority: "Info",
          read: true,
        },
      ],
    };

    if (!adminAnalytics) {
      const initialDoc = {
        companyId,
        ...defaults,
      };
      adminAnalytics = await GovSchemeAdminAnalytics.create(initialDoc);
      adminAnalytics = adminAnalytics.toObject();
    } else {
      // Merge defaults for missing fields to avoid undefined errors
      for (const key of Object.keys(defaults)) {
        if (adminAnalytics[key] === undefined || adminAnalytics[key] === null) {
          adminAnalytics[key] = defaults[key];
        }
      }
    }

    // Sync missed opportunities from farmer calendar events
    try {
      const farmerProfile = await getActiveFarmerProfile();
      const mockTodayDateStr = "2026-06-12";
      const appliedEvents = farmerProfile.appliedCalendarEvents || [];
      const missedEvents = CALENDAR_EVENTS.filter(e => {
        const isPassed = e.date < mockTodayDateStr;
        const isApplied = appliedEvents.includes(String(e.id));
        return isPassed && !isApplied;
      });

      let currentMissed = adminAnalytics.missedOpportunities || [];
      currentMissed = currentMissed.filter(opp => !opp.id.startsWith("missed-cal-"));

      missedEvents.forEach(e => {
        currentMissed.push({
          id: `missed-cal-${e.id}`,
          name: e.title,
          potValue: e.amount,
          expiredDate: e.date,
          reason: "Deadline Missed",
          isFarmerScheme: true,
          farmerCount: 1
        });
      });

      adminAnalytics.missedOpportunities = currentMissed;
      await GovSchemeAdminAnalytics.updateOne(
        { companyId },
        { $set: { missedOpportunities: currentMissed } }
      );
    } catch (err) {
      console.error("[Gov Schemes Controller] Missed opportunities sync error:", err.message);
    }

    // 2. Fetch all schemes from MongoDB
    const schemes = await GovScheme.find({}).sort({ id: 1 }).lean();

    // 3. Query dynamic telemetry interactions aggregated from GovSchemeInteraction
    const interactions = await GovSchemeInteraction.aggregate([
      {
        $group: {
          _id: { schemeId: "$schemeId", type: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);

    const interactionMap = {};
    let totalViews = 0;
    let totalGuides = 0;
    let totalBookmarks = 0;
    let totalApplies = 0;

    interactions.forEach((item) => {
      const { schemeId, type } = item._id;
      if (!interactionMap[schemeId]) {
        interactionMap[schemeId] = {
          viewed: 0,
          guideOpened: 0,
          applyClicked: 0,
          farmerSavedCount: 0,
        };
      }
      if (type === "view") {
        interactionMap[schemeId].viewed += item.count;
        totalViews += item.count;
      }
      if (type === "guide_open") {
        interactionMap[schemeId].guideOpened += item.count;
        totalGuides += item.count;
      }
      if (type === "apply_click") {
        interactionMap[schemeId].applyClicked += item.count;
        totalApplies += item.count;
      }
      if (type === "bookmark") {
        interactionMap[schemeId].farmerSavedCount += item.count;
        totalBookmarks += item.count;
      }
    });

    const farmerSchemeMetadata = {
      "1": { potValue: 74400000, benefitAmount: "₹6,000/year Direct Benefit Transfer", viewed: 852, applyClicked: 920, guideOpened: 18, farmerSavedCount: 30 },
      "2": { potValue: 223200000, benefitAmount: "₹1,80,000/year Subsidized Crop Risk Cover", viewed: 531, applyClicked: 1240, guideOpened: 14, farmerSavedCount: 15 },
      "3": { potValue: 14880000, benefitAmount: "₹1,20,000 Solar Pump Subsidy", viewed: 320, applyClicked: 210, guideOpened: 8, farmerSavedCount: 12 },
      "4": { potValue: 37200000, benefitAmount: "₹3,00,000 Interest Subvention Credit", viewed: 450, applyClicked: 380, guideOpened: 10, farmerSavedCount: 20 },
      "5": { potValue: 5580000, benefitAmount: "₹45,000 Micro Irrigation Subsidy", viewed: 280, applyClicked: 195, guideOpened: 6, farmerSavedCount: 8 },
      "6": { potValue: 3100000, benefitAmount: "₹25,000 SC Category Subsidy", viewed: 190, applyClicked: 120, guideOpened: 4, farmerSavedCount: 5 },
      "7": { potValue: 12400000, benefitAmount: "₹1,00,000 Enterprises Support", viewed: 150, applyClicked: 85, guideOpened: 5, farmerSavedCount: 9 },
      "8": { potValue: 6200000, benefitAmount: "₹50,000 Livestock Subsidy", viewed: 98, applyClicked: 45, guideOpened: 2, farmerSavedCount: 3 },
      "9": { potValue: 9920000, benefitAmount: "₹80,000 Machinery Subsidy", viewed: 240, applyClicked: 150, guideOpened: 7, farmerSavedCount: 11 },
      "10": { potValue: 1240000, benefitAmount: "Free soil test & guidance/year", viewed: 410, applyClicked: 280, guideOpened: 12, farmerSavedCount: 14 },
      "11": { potValue: 6200000, benefitAmount: "₹50,000/ha Organic Farming Support", viewed: 180, applyClicked: 95, guideOpened: 4, farmerSavedCount: 6 },
      "12": { potValue: 18600000, benefitAmount: "Infrastructure Support Grants", viewed: 220, applyClicked: 130, guideOpened: 5, farmerSavedCount: 8 },
      "13": { potValue: 4960000, benefitAmount: "50% plant subsidy/year", viewed: 130, applyClicked: 70, guideOpened: 3, farmerSavedCount: 4 },
      "14": { potValue: 3720000, benefitAmount: "Rainfed Area Incentives", viewed: 110, applyClicked: 55, guideOpened: 2, farmerSavedCount: 3 },
      "15": { potValue: 2480000, benefitAmount: "Direct Online Selling Platform", viewed: 350, applyClicked: 240, guideOpened: 9, farmerSavedCount: 15 },
      "16": { potValue: 9920000, benefitAmount: "MSP Floor Assurance/year", viewed: 290, applyClicked: 180, guideOpened: 6, farmerSavedCount: 10 },
      "17": { potValue: 7440000, benefitAmount: "Tube-well Subsidy Support", viewed: 160, applyClicked: 90, guideOpened: 4, farmerSavedCount: 5 },
      "18": { potValue: 12400000, benefitAmount: "36% Credit Subsidy Support", viewed: 140, applyClicked: 75, guideOpened: 3, farmerSavedCount: 6 },
      "19": { potValue: 14880000, benefitAmount: "3% Interest Subvention Credit", viewed: 310, applyClicked: 220, guideOpened: 8, farmerSavedCount: 12 },
      "20": { potValue: 9920000, benefitAmount: "40% Pond Subsidy Support", viewed: 85, applyClicked: 30, guideOpened: 1, farmerSavedCount: 2 },
      "21": { potValue: 24800000, benefitAmount: "Cold Storage Subsidy Support", viewed: 200, applyClicked: 110, guideOpened: 5, farmerSavedCount: 8 },
      "22": { potValue: 3100000, benefitAmount: "₹25,000 Dairy Incentive", viewed: 115, applyClicked: 60, guideOpened: 2, farmerSavedCount: 4 }
    };

    // 4. Merge live metrics into corporate & farmer schemes
    const mergedSchemes = schemes.map((scheme) => {
      const liveStats = interactionMap[scheme.id] || {
        viewed: 0,
        guideOpened: 0,
        applyClicked: 0,
        farmerSavedCount: 0,
      };
      const meta = farmerSchemeMetadata[scheme.id] || {};
      return {
        ...scheme,
        potValue: scheme.potValue || meta.potValue || 0,
        benefitAmount: scheme.benefitAmount || meta.benefitAmount || scheme.benefit || '',
        viewed: (scheme.viewed || 0) + liveStats.viewed + (meta.viewed || 0),
        guideOpened: (scheme.guideOpened || 0) + liveStats.guideOpened + (meta.guideOpened || 0),
        applyClicked: (scheme.applyClicked || 0) + liveStats.applyClicked + (meta.applyClicked || 0),
        farmerSavedCount:
          (scheme.farmerSavedCount || 0) + liveStats.farmerSavedCount + (meta.farmerSavedCount || 0),
      };
    });

    // 5. Generate dynamic outreach events list based on live telemetry counts
    const events = [
      { type: "scheme_view", count: 42 + totalViews, label: "Schemes Viewed" },
      {
        type: "guide_open",
        count: 18 + totalGuides,
        label: "Portal Guides Opened",
      },
      { type: "bookmark", count: 12 + totalBookmarks, label: "Bookmarked" },
      {
        type: "apply_click",
        count: 9 + totalApplies,
        label: "Apply Now Clicked",
      },
      {
        type: "self_reported_applied",
        count: 3 + mergedSchemes.filter((s) => s.selfReportedApplied).length,
        label: "Self-Reported Applied",
      },
    ];

    // Combine outreach stats
    const outreach = {
      ...adminAnalytics.outreach,
      farmersReached: adminAnalytics.outreach?.farmersReached || 12400,
      campaignsSent: adminAnalytics.outreach?.campaignsSent || 12,
      notificationOpens: adminAnalytics.outreach?.notificationOpens || 4235,
      engagementRate: adminAnalytics.outreach?.engagementRate || 84.5,
    };

    return ok(res, {
      ...adminAnalytics,
      events,
      schemes: mergedSchemes,
      outreach,
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Admin Analytics Error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── POST /api/gov-schemes/admin/analytics ───────────────────────────────────
export const saveAdminAnalytics = async (req, res) => {
  try {
    const companyId = "guest";
    const payload = req.body;

    if (!payload) {
      return fail(res, "Payload is required", 400);
    }

    // 1. Separate corporate profile metrics and metadata
    const {
      companyProfile,
      alerts,
      campaigns,
      outreach,
      profileStrength,
      schemes,
    } = payload;

    const updatedDoc = {};
    if (companyProfile !== undefined)
      updatedDoc.companyProfile = companyProfile;
    if (alerts !== undefined) updatedDoc.alerts = alerts;
    if (campaigns !== undefined) updatedDoc.campaigns = campaigns;
    if (outreach !== undefined) updatedDoc.outreach = outreach;
    if (profileStrength !== undefined)
      updatedDoc.profileStrength = profileStrength;

    await GovSchemeAdminAnalytics.findOneAndUpdate(
      { companyId },
      { $set: updatedDoc },
      { upsert: true, new: true },
    );

    // 2. Synchronize scheme-specific fields (status, statusType, selfReportedApplied, bookmarked) in GovScheme collection
    if (schemes && Array.isArray(schemes)) {
      for (const schemeItem of schemes) {
        if (schemeItem.id) {
          const updateFields = {};
          if (schemeItem.status !== undefined)
            updateFields.status = schemeItem.status;
          if (schemeItem.statusType !== undefined)
            updateFields.statusType = schemeItem.statusType;
          if (schemeItem.selfReportedApplied !== undefined)
            updateFields.selfReportedApplied = schemeItem.selfReportedApplied;
          if (schemeItem.bookmarked !== undefined)
            updateFields.bookmarked = schemeItem.bookmarked;

          await GovScheme.updateOne(
            { id: schemeItem.id },
            { $set: updateFields },
          );
        }
      }
    }

    return ok(res, {
      message: "Admin analytics and schemes synced successfully",
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Save Admin Analytics Error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── GET /api/gov-schemes/farmer/dbt-subsidies ────────────────────────────────
export const getFarmerDbtSubsidies = async (req, res) => {
  try {
    const profile = await getActiveFarmerProfile();

    const payoutCycles = [
      {
        program: "PM-KISAN Samman Nidhi Payouts",
        cycleType: "Tri-annual (Three times a year)",
        standardSchedule: [
          { period: "Cycle 1 (Kharif Release)", months: "April to July", amount: "₹2,000" },
          { period: "Cycle 2 (Festive Release)", months: "August to November", amount: "₹2,000" },
          { period: "Cycle 3 (Winter Release)", months: "December to March", amount: "₹2,000" }
        ]
      },
      {
        program: "PMFBY Insurance Claim Settlements",
        cycleType: "Post-harvest season assessment",
        standardSchedule: [
          { period: "Kharif Claims Release", months: "December to January", amount: "Varies (by crop damage audit)" },
          { period: "Rabi Claims Release", months: "June to July", amount: "Varies (by crop damage audit)" }
        ]
      }
    ];

    const subsidySlabs = [
      {
        scheme: "PMFBY Crop Insurance Premiums",
        slabs: [
          { tier: "Kharif Crops (Rice, Cotton, Maize)", farmerPremium: "2.0% of Sum Insured", govtSubsidy: "Rest of premium subsidized (up to 95%)" },
          { tier: "Rabi Crops (Wheat, Mustard, Gram)", farmerPremium: "1.5% of Sum Insured", govtSubsidy: "Rest of premium subsidized (up to 97%)" },
          { tier: "Commercial/Horticultural (Sugarcane)", farmerPremium: "5.0% of Sum Insured", govtSubsidy: "Rest of premium subsidized" }
        ]
      },
      {
        scheme: "PM-KUSUM Solar Pump Capital Subsidy",
        slabs: [
          { tier: "Central Government Share", farmerPremium: "30% capital subsidy", govtSubsidy: "All Indian states eligibility" },
          { tier: "State Government Share", farmerPremium: "30% capital subsidy", govtSubsidy: "Additional state-specific outlays" },
          { tier: "Farmer Contribution", farmerPremium: "40% (remaining cost)", govtSubsidy: "Financing available via KCC loans" }
        ]
      },
      {
        scheme: "Kisan Credit Card (KCC) Interest Slabs",
        slabs: [
          { tier: "Standard Base Rate", farmerPremium: "9.0% annual interest", govtSubsidy: "Applicable up to limit of ₹3 Lakh" },
          { tier: "Central Subvention Rebate", farmerPremium: "7.0% effective interest", govtSubsidy: "2.0% subvention paid by government" },
          { tier: "Prompt Repayment Bonus", farmerPremium: "4.0% effective interest", govtSubsidy: "3.0% extra subvention if paid within 1 year" }
        ]
      }
    ];

    return ok(res, {
      payoutCycles,
      subsidySlabs,
      profileAadhaarSeeded: profile.aadhaarSeedingStatus === 'seeded',
      profileBankSeeded: profile.bankSeedingStatus === 'seeded'
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] DBT fetch error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── GET /api/gov-schemes/farmer/calendar ────────────────────────────────────
export const getFarmerCalendar = async (req, res) => {
  try {
    const profile = await getActiveFarmerProfile();
    const appliedCalendarEvents = profile.appliedCalendarEvents || [];

    return ok(res, {
      events: CALENDAR_EVENTS,
      appliedEvents: appliedCalendarEvents
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Calendar fetch error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};

// ─── POST /api/gov-schemes/farmer/calendar/apply ──────────────────────────────
export const toggleCalendarEvent = async (req, res) => {
  try {
    const { eventId, applied } = req.body;
    if (!eventId) {
      return fail(res, "Event ID is required", 400);
    }

    const profile = await FarmerProfile.findOne({ userId: "guest" });
    if (!profile) {
      return fail(res, "Farmer Profile not found", 404);
    }

    let appliedEvents = profile.appliedCalendarEvents || [];
    const eventIdStr = String(eventId);

    if (applied) {
      if (!appliedEvents.includes(eventIdStr)) {
        appliedEvents.push(eventIdStr);
      }
    } else {
      appliedEvents = appliedEvents.filter(id => id !== eventIdStr);
    }

    profile.appliedCalendarEvents = appliedEvents;
    profile.markModified('appliedCalendarEvents');
    await profile.save();

    // Trigger dynamic sync with corporate admin missed opportunities
    const companyId = "guest";
    let adminAnalytics = await GovSchemeAdminAnalytics.findOne({ companyId });
    if (adminAnalytics) {
      const mockTodayDateStr = "2026-06-12";
      const missedEvents = CALENDAR_EVENTS.filter(e => {
        const isPassed = e.date < mockTodayDateStr;
        const isApplied = appliedEvents.includes(String(e.id));
        return isPassed && !isApplied;
      });

      let currentMissed = adminAnalytics.missedOpportunities || [];
      currentMissed = currentMissed.filter(opp => !opp.id.startsWith("missed-cal-"));

      missedEvents.forEach(e => {
        currentMissed.push({
          id: `missed-cal-${e.id}`,
          name: e.title,
          potValue: e.amount,
          expiredDate: e.date,
          reason: "Deadline Missed",
          isFarmerScheme: true,
          farmerCount: 1
        });
      });

      await GovSchemeAdminAnalytics.updateOne(
        { companyId },
        { $set: { missedOpportunities: currentMissed } }
      );
    }

    return ok(res, {
      message: "Calendar event status synchronized successfully",
      appliedEvents
    });
  } catch (err) {
    console.error("[Gov Schemes Controller] Toggle Calendar Event Error:", err);
    return fail(res, "Internal Server Error", 500);
  }
};
