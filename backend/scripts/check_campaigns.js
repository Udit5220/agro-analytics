import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI_1 = process.env.MONGO_URI_1;

async function check() {
  console.log('Connecting to Primary MONGO_URI...');
  const primaryConn = await mongoose.connect(MONGO_URI);
  console.log('Primary Connected to:', primaryConn.connection.name);
  const primaryCols = await primaryConn.connection.db.listCollections().toArray();
  console.log('Primary Collections:', primaryCols.map(c => c.name));
  
  const primaryCampaigns = await primaryConn.connection.db.collection('agroindia_treatment_campaigns').find({}).toArray();
  console.log(`Primary agroindia_treatment_campaigns count: ${primaryCampaigns.length}`);
  console.log('Primary campaigns sample:', primaryCampaigns);
  
  await mongoose.disconnect();

  if (MONGO_URI_1) {
    console.log('\nConnecting to Secondary MONGO_URI_1...');
    const secondaryConn = await mongoose.connect(MONGO_URI_1, { dbName: 'agro-india' });
    console.log('Secondary Connected to:', secondaryConn.connection.name);
    const secondaryCols = await secondaryConn.connection.db.listCollections().toArray();
    console.log('Secondary Collections:', secondaryCols.map(c => c.name));
    
    const secondaryCampaigns = await secondaryConn.connection.db.collection('agroindia_treatment_campaigns').find({}).toArray();
    console.log(`Secondary agroindia_treatment_campaigns count: ${secondaryCampaigns.length}`);
    console.log('Secondary campaigns sample:', secondaryCampaigns);
    
    await mongoose.disconnect();
  }
}

check().catch(console.error);
