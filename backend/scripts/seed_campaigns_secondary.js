import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI_1 = process.env.MONGO_URI_1;

const defaultCampaigns = [
  { name: "Kharindwa Blast Control", disease: "Rice Blast", villages: ["Kharindwa", "Mehna"], progress: 65, status: "Active", officers: 3, targetFarmers: 120, completedFarmers: 78, type: "Chemical Spray", startDate: "2026-06-01", notes: "Applying copper fungicide solutions to early crop blocks." },
  { name: "Rust Prevention Drive", disease: "Yellow Rust", villages: ["Bhucho Mandi", "Talwandi"], progress: 90, status: "Active", officers: 4, targetFarmers: 180, completedFarmers: 162, type: "Prophylactic Dusting", startDate: "2026-05-28", notes: "Sowing protection spraying based on AI drift recommendations." },
  { name: "Blight Suppression Campaign", disease: "Late Blight", villages: ["Raman"], progress: 20, status: "Pending", officers: 2, targetFarmers: 80, completedFarmers: 16, type: "Systemic Fungicide", startDate: "2026-06-05", notes: "Targeted leaf spray application to contain concentric lesions." }
];

async function seed() {
  if (!MONGO_URI_1) {
    console.error('MONGO_URI_1 not set!');
    return;
  }
  
  console.log('Connecting to Secondary MONGO_URI_1 (agro-india)...');
  const conn = await mongoose.connect(MONGO_URI_1, { dbName: 'agro-india' });
  console.log('Connected to:', conn.connection.name);
  
  const col = conn.connection.db.collection('agroindia_treatment_campaigns');
  
  // Clear any existing campaigns in secondary to ensure clean auto-seeding or direct seeding
  console.log('Clearing old campaigns from secondary...');
  await col.deleteMany({});
  
  console.log('Inserting default campaigns to secondary...');
  await col.insertMany(defaultCampaigns);
  
  const count = await col.countDocuments();
  console.log(`Successfully seeded! New count in secondary: ${count}`);
  
  await mongoose.disconnect();
}

seed().catch(console.error);
