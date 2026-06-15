import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import GovScheme from '../models/GovScheme.js';

const corporateSchemes = [
  {
    id: "adm-01",
    name: "RKVY-RAFTAAR Agritech Incubator Support",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agritech Programs",
    level: "Central Government",
    benefitType: "Grants",
    benefitAmount: "₹25,00,000",
    deadline: "2026-06-20",
    daysLeft: 8,
    matchScore: 92,
    viewed: 15,
    guideOpened: 6,
    bookmarked: true,
    applyClicked: 4,
    selfReportedApplied: true,
    lastInteraction: "2026-06-12",
    status: "Applied (Self Reported)",
    statusType: "applied",
    description: "Direct grant-in-aid support for agritech startups demonstrating proof of concept and scalable MVP models.",
    potValue: 2500000,
    eligibilitySnapshot: "Registered agritech startup with functional prototype, DPIIT recognized, operational under 5 years.",
    isFarmerScheme: false
  },
  {
    id: "adm-02",
    name: "DPIIT Agritech Tax Holiday under Startup India",
    ministry: "DPIIT, Ministry of Commerce and Industry",
    category: "Startup Programs",
    level: "Central Government",
    benefitType: "Tax Benefits",
    benefitAmount: "₹45,00,000",
    deadline: "2026-12-31",
    daysLeft: 204,
    matchScore: 88,
    viewed: 12,
    guideOpened: 4,
    bookmarked: false,
    applyClicked: 2,
    selfReportedApplied: false,
    lastInteraction: "2026-06-10",
    status: "Researching",
    statusType: "not_applied",
    description: "Income tax exemption under section 80-IAC for eligible DPIIT-recognized agricultural technology startups.",
    potValue: 4500000,
    eligibilitySnapshot: "DPIIT Startup India certificate, incorporation post April 2016, turnover below 100cr.",
    isFarmerScheme: false
  },
  {
    id: "adm-03",
    name: "Agri-Infrastructure Fund (AIF) Subvention",
    ministry: "Ministry of Agriculture & State Depts",
    category: "Agritech Programs",
    level: "Both",
    benefitType: "Subsidies",
    benefitAmount: "₹40,00,000",
    deadline: "2026-07-15",
    daysLeft: 35,
    matchScore: 85,
    viewed: 9,
    guideOpened: 3,
    bookmarked: true,
    applyClicked: 2,
    selfReportedApplied: false,
    lastInteraction: "2026-06-11",
    status: "Ready To Apply",
    statusType: "not_applied",
    description: "Medium to long-term debt financing facility for investment in viable post-harvest management infrastructure.",
    potValue: 4000000,
    eligibilitySnapshot: "Agribusiness startups, FPOs, or entrepreneurs constructing post-harvest storage hubs.",
    isFarmerScheme: false
  },
  {
    id: "adm-04",
    name: "SIDBI Venture Capital Fund for MSME Agritech",
    ministry: "SIDBI",
    category: "MSME Programs",
    level: "Central Government",
    benefitType: "Loans",
    benefitAmount: "₹80,00,000",
    deadline: "2026-08-30",
    daysLeft: 81,
    matchScore: 78,
    viewed: 4,
    guideOpened: 1,
    bookmarked: false,
    applyClicked: 1,
    selfReportedApplied: false,
    lastInteraction: "2026-06-05",
    status: "Interested",
    statusType: "not_applied",
    description: "Collateral-free developmental funding support targeted at rural MSMEs operating technological processing hubs.",
    potValue: 8000000,
    eligibilitySnapshot: "Udyam registered MSME operating in agriculture value chain, minimum 3yr positive balance sheet.",
    isFarmerScheme: false
  },
  {
    id: "adm-05",
    name: "Haryana Agribusiness Export Capital Subsidy",
    ministry: "Haryana State Agriculture Department",
    category: "Export Incentives",
    level: "State Government",
    benefitType: "Export Incentives",
    benefitAmount: "₹50,00,000",
    deadline: "2026-06-25",
    daysLeft: 13,
    matchScore: 95,
    viewed: 2,
    guideOpened: 4,
    bookmarked: true,
    applyClicked: 0,
    selfReportedApplied: false,
    lastInteraction: "2026-06-12",
    status: "Ready To Apply",
    statusType: "not_applied",
    description: "Financial assistance for creating cold chain facilities, sorting lines, and primary processing for agro exports.",
    potValue: 5000000,
    eligibilitySnapshot: "Agribusiness registered in Haryana, actively exporting crops with valid APEDA certificates.",
    isFarmerScheme: false
  }
];

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

const seedDb = async (uri, dbName) => {
  console.log(`Connecting to MongoDB database: ${dbName}...`);
  const conn = await mongoose.createConnection(uri, { dbName }).asPromise();
  console.log(`Connected successfully to ${dbName}.`);

  try {
    const dataPath = path.resolve('../frontend/src/seed-json/govt_scheme.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error(`govt_scheme.json not found at ${dataPath}`);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const { schemes, schemeDetails } = JSON.parse(rawData);

    // Bind GovScheme model to this specific connection
    const BoundGovScheme = conn.model('GovScheme', GovScheme.schema);

    // Clear existing
    await BoundGovScheme.deleteMany({});
    console.log(`Cleared existing government schemes from ${dbName}.`);

    let insertedCount = 0;

    // Seed Farmer Schemes
    for (const scheme of schemes) {
      const fallbackDetails = {
        authority: scheme.dept || "Ministry of Agriculture",
        description: `The ${scheme.name} is designed to provide assistance, financial support, and resources to farmers across the country, enhancing productivity and crop yield.`,
        benefits: {
          maximumBenefit: scheme.benefit || "Financial subsidy",
          perInstallment: "Direct benefit transfer",
          subsidyType: "Capital subsidy",
          coverage: "Eligible farming activities"
        },
        eligibilityMatrix: [
          { criterion: "Location", requirement: "State matching eligibility", status: true, value: "Verified" },
          { criterion: "Occupation", requirement: "Active farmer profile", status: true, value: "Verified" },
          { criterion: "Land Ownership", requirement: "Valid land records", status: true, value: "Verified" }
        ],
        exclusions: [
          "Institutional landholders",
          "Income tax payers of last assessment year"
        ],
        documents: [
          { name: "Aadhaar Card", status: "verified", statusType: "verified", uploadedDate: "Mar 2024" },
          { name: "Land Records", status: "verified", statusType: "verified", uploadedDate: "Mar 2024" }
        ],
        timeline: {
          steps: [
            { name: "Apply Online", status: "done", date: "Jan 10", description: "Submit application on portal" },
            { name: "Verification", status: "in-progress", date: null, description: "Officer verification in progress" }
          ],
          blocker: null
        },
        faqs: [
          { question: "How to check status?", answer: "Login to the portal and check details under applied applications." }
        ],
        launchYear: 2024,
        target: "Individual farmers & Cooperatives",
        budget: "₹15,000 Cr",
        ministry: scheme.dept || "Ministry of Agriculture"
      };

      const sourceDetails = schemeDetails[scheme.id] || schemeDetails[String(scheme.id)] || {};
      const faqsList = sourceDetails.faq || sourceDetails.faqs || fallbackDetails.faqs;
      const meta = farmerSchemeMetadata[String(scheme.id)] || {};

      const doc = {
        id: String(scheme.id),
        name: scheme.name,
        category: scheme.category,
        categoryColor: scheme.categoryColor || '#132a13',
        dept: scheme.dept,
        benefit: scheme.benefit,
        matchScore: scheme.matchScore || 100,
        status: scheme.status || 'Not Applied',
        statusType: scheme.statusType || 'not_applied',
        deadline: scheme.deadline || 'Ongoing',
        docsRequired: scheme.docsRequired || 0,
        docsUploaded: scheme.docsUploaded || 0,
        estApproval: scheme.estApproval || '15-30 days',
        isFarmerScheme: true,
        benefitAmount: meta.benefitAmount || scheme.benefit || '',
        potValue: meta.potValue || 0,
        viewed: meta.viewed || 0,
        guideOpened: meta.guideOpened || 0,
        applyClicked: meta.applyClicked || 0,
        farmerSavedCount: meta.farmerSavedCount || 0,
        details: {
          authority: sourceDetails.authority || fallbackDetails.authority,
          description: sourceDetails.description || fallbackDetails.description,
          benefits: sourceDetails.benefits || fallbackDetails.benefits,
          eligibility: sourceDetails.eligibility || fallbackDetails.eligibility,
          eligibilityMatrix: sourceDetails.eligibilityMatrix || fallbackDetails.eligibilityMatrix,
          exclusions: sourceDetails.exclusions || fallbackDetails.exclusions,
          documents: sourceDetails.documents || fallbackDetails.documents,
          timeline: sourceDetails.timeline || fallbackDetails.timeline,
          faqs: faqsList,
          launchYear: sourceDetails.launchYear || fallbackDetails.launchYear,
          target: sourceDetails.target || fallbackDetails.target,
          budget: sourceDetails.budget || fallbackDetails.budget,
          ministry: sourceDetails.ministry || fallbackDetails.ministry
        }
      };

      await BoundGovScheme.create(doc);
      insertedCount++;
    }

    // Seed Corporate Schemes
    for (const scheme of corporateSchemes) {
      const doc = {
        id: scheme.id,
        name: scheme.name,
        category: scheme.category,
        categoryColor: '#31572c',
        dept: scheme.ministry,
        benefit: scheme.benefitAmount,
        matchScore: scheme.matchScore,
        status: scheme.status,
        statusType: scheme.statusType,
        deadline: scheme.deadline,
        docsRequired: 5,
        docsUploaded: 3,
        estApproval: '30-45 days',
        isFarmerScheme: false,
        level: scheme.level,
        benefitType: scheme.benefitType,
        benefitAmount: scheme.benefitAmount,
        daysLeft: scheme.daysLeft,
        lastInteraction: scheme.lastInteraction,
        potValue: scheme.potValue,
        eligibilitySnapshot: scheme.eligibilitySnapshot,
        selfReportedApplied: scheme.selfReportedApplied,
        bookmarked: scheme.bookmarked,
        viewed: scheme.viewed,
        guideOpened: scheme.guideOpened,
        applyClicked: scheme.applyClicked,
        details: {
          authority: scheme.ministry,
          description: scheme.description,
          benefits: { maximumBenefit: scheme.benefitAmount },
          eligibilityMatrix: [
            { criterion: "Status", requirement: "DPIIT Recognised Startup", status: true, value: "Verified" }
          ],
          exclusions: [],
          documents: [],
          timeline: { steps: [] },
          faqs: [],
          launchYear: 2023,
          target: scheme.eligibilitySnapshot,
          budget: "₹1,000 Cr",
          ministry: scheme.ministry
        }
      };

      await BoundGovScheme.create(doc);
      insertedCount++;
    }

    console.log(`✅ Seeded ${insertedCount} government schemes (farmer & corporate) successfully in ${dbName}!`);
  } catch (error) {
    console.error(`❌ Seeding failed for ${dbName}:`, error);
  } finally {
    await conn.close();
    console.log(`Disconnected from ${dbName}.`);
  }
};

const main = async () => {
  const uri = process.env.MONGO_URI;
  const uri1 = process.env.MONGO_URI_1;

  if (uri) {
    await seedDb(uri, 'greenleaf-dev');
  }
  if (uri1) {
    await seedDb(uri1, 'agro-india');
  }

  // Also sync copy to backend seed-json
  try {
    const dataPath = path.resolve('../frontend/src/seed-json/govt_scheme.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const backendDest = path.resolve('./seed-json/govt_scheme.json');
    fs.writeFileSync(backendDest, rawData, 'utf-8');
    console.log(`✅ Copy of full schemes synced to backend seed-json at: ${backendDest}`);
  } catch (err) {
    console.warn('Could not sync copy to backend seed-json:', err.message);
  }

  console.log('✅ Seeding execution complete.');
};

main();
