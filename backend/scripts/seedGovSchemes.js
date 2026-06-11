import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import GovScheme from '../models/GovScheme.js';

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

      const doc = {
        id: scheme.id,
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

    console.log(`✅ Seeded ${insertedCount} government schemes successfully in ${dbName}!`);
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
