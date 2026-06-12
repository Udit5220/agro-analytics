import 'dotenv/config';
import mongoose from 'mongoose';
import GovSchemeAdminAnalytics from '../models/GovSchemeAdminAnalytics.js';
import GovScheme from '../models/GovScheme.js';

async function test() {
  const uri = process.env.MONGO_URI;
  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  console.log("Connected successfully.");

  try {
    const doc = await GovSchemeAdminAnalytics.findOne({ companyId: 'guest' });
    console.log("Admin Analytics Doc found:", !!doc);
    if (doc) {
      console.log("Doc details:");
      console.log("profileStrength:", doc.profileStrength);
      console.log("companyProfile keys:", Object.keys(doc.companyProfile || {}));
      console.log("companyProfile value:", JSON.stringify(doc.companyProfile, null, 2));
      console.log("missedOpportunities count:", doc.missedOpportunities ? doc.missedOpportunities.length : 0);
    }

    const schemeCount = await GovScheme.countDocuments({});
    console.log("Total government schemes in DB:", schemeCount);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

test();
