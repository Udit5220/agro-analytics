import 'dotenv/config';
import mongoose from 'mongoose';
import DistrictAgriStats from '../models/DistrictAgriStats.js';
import FpoFarmer from '../models/FpoFarmer.js';

const SEED_DISTRICT = {
  districtName: 'Sonipat',
  stateName: 'Haryana',
  totalFarmers: 34500, // Operational Holdings census baseline
  operationalHoldings: {
    marginal: 15180,   // ~44%
    small: 11385,      // ~33%
    semiMedium: 5175,  // ~15%
    medium: 2415,      // ~7%
    large: 345         // ~1%
  },
  enrolledFarmers: 28400, // PM-Kisan Enrolled beneficiaries baseline
  nonEnrollmentReasons: [
    { reason: 'Lack of awareness of registration portals', percentage: 38, count: 2318 },
    { reason: 'Land record / Aadhaar name linkage mismatch', percentage: 29, count: 1769 },
    { reason: 'Eligibility exclusions (income tax payers/retired officials)', percentage: 18, count: 1098 },
    { reason: 'Digital accessibility & document submission barriers', percentage: 15, count: 915 }
  ],
  villages: [
    { name: 'Kharindwa', totalFarmers: 320, enrolledFarmers: 110, averageSchemesPerFarmer: 2.1, intensity: 'low' },
    { name: 'Bhadana', totalFarmers: 287, enrolledFarmers: 180, averageSchemesPerFarmer: 3.4, intensity: 'medium' },
    { name: 'Murthal', totalFarmers: 240, enrolledFarmers: 200, averageSchemesPerFarmer: 4.2, intensity: 'high' }
  ]
};

const SEED_FARMERS = [
  {
    farmerId: "F-101",
    name: "Ramesh Kumar",
    village: "Kharindwa",
    land: "1.2 Ha",
    landSizeNum: 1.2,
    category: "OBC",
    phone: "+91 98765 43210",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹2,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "eligible-not-enrolled"
    }
  },
  {
    farmerId: "F-102",
    name: "Sunita Devi",
    village: "Kharindwa",
    land: "0.8 Ha",
    landSizeNum: 0.8,
    category: "SC",
    phone: "+91 87654 32109",
    aadhaarSeeded: true,
    mobileVerified: false,
    pendingBenefits: "₹6,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-103",
    name: "Mahesh Singh",
    village: "Bhadana",
    land: "2.1 Ha",
    landSizeNum: 2.1,
    category: "General",
    phone: "+91 76543 21098",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "enrolled"
    }
  },
  {
    farmerId: "F-104",
    name: "Priya Yadav",
    village: "Kharindwa",
    land: "0.6 Ha",
    landSizeNum: 0.6,
    category: "OBC",
    phone: "+91 95432 10987",
    aadhaarSeeded: false,
    mobileVerified: false,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "eligible-not-enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-105",
    name: "Harpal Singh",
    village: "Murthal",
    land: "3.4 Ha",
    landSizeNum: 3.4,
    category: "General",
    phone: "+91 84321 09876",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹2,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "not-eligible",
      eNam: "enrolled"
    }
  },
  {
    farmerId: "F-106",
    name: "Kamla Devi",
    village: "Bhadana",
    land: "0.4 Ha",
    landSizeNum: 0.4,
    category: "SC",
    phone: "+91 73210 98765",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹4,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-107",
    name: "Rajveer Malik",
    village: "Murthal",
    land: "1.8 Ha",
    landSizeNum: 1.8,
    category: "OBC",
    phone: "+91 92109 87654",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "enrolled"
    }
  },
  {
    farmerId: "F-108",
    name: "Geeta Sharma",
    village: "Bhadana",
    land: "0.9 Ha",
    landSizeNum: 0.9,
    category: "General",
    phone: "+91 81098 76543",
    aadhaarSeeded: false,
    mobileVerified: true,
    pendingBenefits: "₹8,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "not-eligible",
      pmKmy: "eligible-not-enrolled",
      eNam: "eligible-not-enrolled"
    }
  },
  {
    farmerId: "F-109",
    name: "Sukhbir Hooda",
    village: "Kharindwa",
    land: "1.1 Ha",
    landSizeNum: 1.1,
    category: "OBC",
    phone: "+91 70987 65432",
    aadhaarSeeded: true,
    mobileVerified: false,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-110",
    name: "Anita Kumari",
    village: "Kharindwa",
    land: "0.5 Ha",
    landSizeNum: 0.5,
    category: "SC",
    phone: "+91 99876 54321",
    aadhaarSeeded: false,
    mobileVerified: false,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "eligible-not-enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-111",
    name: "Devraj Nain",
    village: "Murthal",
    land: "4.2 Ha",
    landSizeNum: 4.2,
    category: "General",
    phone: "+91 88765 43210",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹2,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "enrolled"
    }
  },
  {
    farmerId: "F-112",
    name: "Poonam Singh",
    village: "Bhadana",
    land: "0.7 Ha",
    landSizeNum: 0.7,
    category: "SC",
    phone: "+91 77654 32109",
    aadhaarSeeded: true,
    mobileVerified: false,
    pendingBenefits: "₹24,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-113",
    name: "Balram Yadav",
    village: "Kharindwa",
    land: "1.5 Ha",
    landSizeNum: 1.5,
    category: "OBC",
    phone: "+91 96543 21098",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "eligible-not-enrolled"
    }
  },
  {
    farmerId: "F-114",
    name: "Savitri Devi",
    village: "Murthal",
    land: "0.3 Ha",
    landSizeNum: 0.3,
    category: "ST",
    phone: "+91 85432 10987",
    aadhaarSeeded: false,
    mobileVerified: false,
    pendingBenefits: "₹0",
    schemes: {
      pmKisan: "eligible-not-enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible"
    }
  },
  {
    farmerId: "F-115",
    name: "Narendra Pal",
    village: "Bhadana",
    land: "2.8 Ha",
    landSizeNum: 2.8,
    category: "General",
    phone: "+91 74321 09876",
    aadhaarSeeded: true,
    mobileVerified: true,
    pendingBenefits: "₹4,000",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "eligible-not-enrolled"
    }
  }
];

const seedDb = async (uri, dbName) => {
  console.log(`Connecting to MongoDB database: ${dbName}...`);
  const conn = await mongoose.createConnection(uri, { dbName }).asPromise();
  console.log(`Connected successfully to ${dbName}.`);

  try {
    const BoundDistrictAgriStats = conn.model('DistrictAgriStats', DistrictAgriStats.schema);
    const BoundFpoFarmer = conn.model('FpoFarmer', FpoFarmer.schema);

    // Clear existing
    await BoundDistrictAgriStats.deleteMany({});
    await BoundFpoFarmer.deleteMany({});
    console.log(`Cleared existing FPO collections from ${dbName}.`);

    // Insert district stats
    await BoundDistrictAgriStats.create(SEED_DISTRICT);
    console.log(`Seeded DistrictAgriStats in ${dbName}.`);

    // Insert FPO farmers
    await BoundFpoFarmer.insertMany(SEED_FARMERS);
    console.log(`Seeded ${SEED_FARMERS.length} FpoFarmers in ${dbName}.`);

    console.log(`✅ Seeded FPO stats and farmers successfully in ${dbName}!`);
  } catch (error) {
    console.error(`❌ Seeding FPO data failed for ${dbName}:`, error);
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

  console.log('✅ Seeding execution complete.');
};

main();
