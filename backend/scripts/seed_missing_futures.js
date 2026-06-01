import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import GlCommodityFutures from '../models/GlCommodityFutures.js';
import GlCommodity from '../models/GlCommodity.js';

const SEED_FUTURES = {
  Wheat:    [2290, 2330, 2360, 2390, 2410, 2450],
  Onion:    [1900, 1980, 2050, 2120, 2200, 2300],
  Maize:    [2100, 2160, 2220, 2280, 2340, 2400],
  Paddy:    [1900, 1980, 2060, 2140, 2220, 2300],
  Turmeric: [13000, 13600, 14200, 14800, 15400, 16000],
  Tomato:   [1000, 1120, 1240, 1360, 1480, 1600],
  Soybean:  [4500, 4600, 4700, 4800, 4900, 5000],
  Chana:    [5800, 5950, 6100, 6250, 6400, 6500],
  Mustard:  [5300, 5400, 5500, 5600, 5700, 5800],
  Cotton:   [57000, 57500, 58000, 58500, 59000, 59500]
};

async function run() {
  await connectDB();
  const crops = Object.keys(SEED_FUTURES);

  for (const crop of crops) {
    // 1. Find commodity ID
    const cDoc = await GlCommodity.findOne({ commodity_name: { $regex: new RegExp(`^${crop}$`, 'i') } });
    if (!cDoc) {
      console.log(`Commodity ${crop} not found in DB! Skipping...`);
      continue;
    }

    // 2. Check if futures data exists
    const existing = await GlCommodityFutures.findOne({ commodity_id: cDoc._id });
    if (existing) {
      console.log(`Futures data already exists for ${crop} in MongoDB.`);
      continue;
    }

    // 3. Generate mock futures record
    console.log(`No futures data for ${crop}. Injecting mock data...`);
    const prices = SEED_FUTURES[crop];
    const months = ['near-month', '3-month', '6-month', '9-month', '12-month', '15-month'];
    const expiryData = prices.map((p, i) => {
      const prev = p * (1 - (Math.random() * 0.04 - 0.02));
      return {
        contract: `Contract ${i + 1} (${months[i]})`,
        last_price: p,
        change_in_price: p - prev,
        open_price: p * 0.99,
        high_price: p * 1.02,
        low_price: p * 0.98,
        previous_price: prev,
        volume: Math.floor(Math.random() * 5000 + 1000),
        open_interest: Math.floor(Math.random() * 10000 + 2000)
      };
    });

    const newRecord = new GlCommodityFutures({
      commodity_id: cDoc._id,
      date: new Date().toISOString().split('T')[0],
      portal: 'agroindia-mock',
      source: 'agroindia-mock',
      is_active: true,
      expiry_data: expiryData
    });

    await newRecord.save();
    console.log(`Successfully seeded futures for ${crop}.`);
  }

  process.exit(0);
}

run().catch(console.error);
