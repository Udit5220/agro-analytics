import 'dotenv/config';
import mongoose from 'mongoose';
import GovScheme from '../models/GovScheme.js';

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    const uriSecondary = process.env.MONGO_URI_1;

    console.log('--- Connecting to Primary (greenleaf-dev) ---');
    await mongoose.connect(uri, { dbName: 'greenleaf-dev' });
    const countPrimary = await GovScheme.countDocuments({});
    console.log(`Primary count: ${countPrimary}`);
    const schemesPrimary = await GovScheme.find({}, 'id name category').sort({ id: 1 }).lean();
    schemesPrimary.forEach(s => console.log(`  - [ID: ${s.id}] ${s.name} (${s.category})`));
    await mongoose.disconnect();

    if (uriSecondary) {
      console.log('\n--- Connecting to Secondary (agro-india) ---');
      await mongoose.connect(uriSecondary, { dbName: 'agro-india' });
      const countSecondary = await GovScheme.countDocuments({});
      console.log(`Secondary count: ${countSecondary}`);
      const schemesSecondary = await GovScheme.find({}, 'id name category').sort({ id: 1 }).lean();
      schemesSecondary.forEach(s => console.log(`  - [ID: ${s.id}] ${s.name} (${s.category})`));
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Error running check script:', err);
  }
}

check();
