import 'dotenv/config';
import mongoose from 'mongoose';

async function run() {
  const uriSecondary = process.env.MONGO_URI_1;
  if (!uriSecondary) {
    console.log('❌ MONGO_URI_1 is not set in your .env file.');
    process.exit(1);
  }

  console.log('Connecting to MONGO_URI_1 cluster to clean up old database...');
  // Connect to the old greenleaf-dev database on the secondary cluster
  const conn = await mongoose.connect(uriSecondary, { dbName: 'greenleaf-dev' });
  console.log('Connected to secondary cluster.');

  console.log('Dropping database "greenleaf-dev" from secondary cluster...');
  await conn.connection.db.dropDatabase();
  console.log('✅ Database "greenleaf-dev" dropped successfully from your MONGO_URI_1 cluster!');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => {
  console.error('❌ Failed to drop database:', e.message);
  process.exit(1);
});
