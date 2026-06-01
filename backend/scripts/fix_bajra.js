import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import MandiPrice from '../models/MandiPrice.js';

async function run() {
  await connectDB();
  await MandiPrice.updateMany({ commodity: 'Bajra' }, { $set: { modalPrice: 2050, previousModalPrice: 2200 } });
  console.log('Updated Bajra prices in MongoDB');
  process.exit(0);
}
run();
