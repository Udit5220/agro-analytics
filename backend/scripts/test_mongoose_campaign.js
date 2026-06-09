import 'dotenv/config';
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  disease: { type: String, required: true },
}, { timestamps: true, collection: 'agroindia_treatment_campaigns' });

async function run() {
  const uriSecondary = process.env.MONGO_URI_1;
  console.log('Connecting via createConnection to:', uriSecondary.replace(/:.*@/, ':*****@'));
  
  const secondaryConn = mongoose.createConnection(uriSecondary, {
    dbName: 'agro-india',
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  secondaryConn.on('connected', () => {
    console.log('✅ Secondary connection connected!');
  });

  secondaryConn.on('error', (err) => {
    console.error('❌ Secondary connection error:', err);
  });

  const CampaignModel = secondaryConn.model('Campaign', campaignSchema);

  console.log('Sending find() query...');
  try {
    const results = await CampaignModel.find().maxTimeMS(5000);
    console.log('✅ Query succeeded! Results count:', results.length);
  } catch (err) {
    console.error('❌ Query failed:', err.message);
  } finally {
    await secondaryConn.close();
  }
}

run().catch(console.error);
