import 'dotenv/config';
import mongoose from 'mongoose';
import Commodity from '../models/Commodity.js';
import MandiPrice from '../models/MandiPrice.js';

await mongoose.connect(process.env.MONGO_URI, { dbName: 'greenleaf-dev' });
console.log('✅ Connected to MongoDB');

// ─── 10 Core Indian Agriculture Commodities ───────────────────────────────────
const commodities = [
  { name: 'Wheat', hindiName: 'गेहूं', category: 'grain', varieties: ['Lok-1', 'GW-322', 'HD-2781', 'DBW-187'], grades: ['FAQ', 'Grade-A', 'Grade-B'], season: 'rabi', unit: 'Quintal', icon: 'Wheat' },
  { name: 'Soybean', hindiName: 'सोयाबीन', category: 'oilseed', varieties: ['JS-335', 'NRC-86', 'Pusa-16', 'MACS-450'], grades: ['FAQ', 'Grade-A', 'Crushing Grade'], season: 'kharif', unit: 'Quintal', icon: 'Circle' },
  { name: 'Cotton', hindiName: 'कपास', category: 'fiber', varieties: ['Bt Cotton', 'Desi Cotton', 'Hybrid-4'], grades: ['FAQ', 'J-34', 'Shankar-6'], season: 'kharif', unit: 'Quintal', icon: 'Cloud' },
  { name: 'Onion', hindiName: 'प्याज', category: 'vegetable', varieties: ['Nasik Red', 'White Onion', 'Pusa Red'], grades: ['A Grade', 'B Grade', 'Export Grade'], season: 'rabi', unit: 'Quintal', icon: 'Circle' },
  { name: 'Maize', hindiName: 'मक्का', category: 'grain', varieties: ['Yellow Maize', 'White Maize', 'Sweet Corn', 'Baby Corn'], grades: ['FAQ', 'Grade-A', 'Feed Grade'], season: 'kharif', unit: 'Quintal', icon: 'Sprout' },
  { name: 'Paddy', hindiName: 'धान', category: 'grain', varieties: ['Basmati', 'Sona Masuri', 'IR-64', 'PR-106', 'Pusa-1121'], grades: ['FAQ', 'Grade-A', 'Basmati Grade'], season: 'kharif', unit: 'Quintal', icon: 'Sprout' },
  { name: 'Tomato', hindiName: 'टमाटर', category: 'vegetable', varieties: ['Hybrid Tomato', 'Desi Tomato', 'Cherry Tomato'], grades: ['A Grade', 'B Grade', 'Local'], season: 'perennial', unit: 'Quintal', icon: 'Apple' },
  { name: 'Chana', hindiName: 'चना', category: 'pulse', varieties: ['Desi Chana', 'Kabuli Chana', 'Bold Chana'], grades: ['FAQ', 'Grade-A', 'Dal Grade'], season: 'rabi', unit: 'Quintal', icon: 'Circle' },
  { name: 'Mustard', hindiName: 'सरसों', category: 'oilseed', varieties: ['Yellow Mustard', 'Black Mustard', 'Rajat'], grades: ['FAQ', 'Grade-A', 'Oil Grade'], season: 'rabi', unit: 'Quintal', icon: 'Flower2' },
  { name: 'Turmeric', hindiName: 'हल्दी', category: 'spice', varieties: ['Rajapuri', 'Erode Turmeric', 'Nizamabad Bulb'], grades: ['FAQ', 'Finger Grade', 'Bulb Grade', 'Polished'], season: 'kharif', unit: 'Quintal', icon: 'Leaf' },
];

let inserted = 0, skipped = 0;
for (const c of commodities) {
  const exists = await Commodity.findOne({ name: c.name });
  if (!exists) { await Commodity.create(c); inserted++; } else skipped++;
}

console.log(`✅ Commodities: ${inserted} inserted, ${skipped} skipped`);

// ─── Mandi Price Records ──────────────────────────────────────────────────────
const mandis = [
  { name: 'Indore', district: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
  { name: 'Kota', district: 'Kota', state: 'Rajasthan' },
  { name: 'Nagpur', district: 'Nagpur', state: 'Maharashtra' },
  { name: 'Akola', district: 'Akola', state: 'Maharashtra' },
  { name: 'Lasalgaon', district: 'Nashik', state: 'Maharashtra' },
  { name: 'Jaipur', district: 'Jaipur', state: 'Rajasthan' },
  { name: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Rajkot', district: 'Rajkot', state: 'Gujarat' },
];

// Realistic price base data per commodity (₹/Quintal)
const priceData = {
  'Wheat': { base: 2200, range: 200 },
  'Soybean': { base: 4800, range: 400 },
  'Cotton': { base: 6800, range: 600 },
  'Onion': { base: 1800, range: 600 },
  'Maize': { base: 1900, range: 200 },
  'Paddy': { base: 2100, range: 250 },
  'Tomato': { base: 1500, range: 800 },
  'Chana': { base: 5200, range: 300 },
  'Mustard': { base: 5100, range: 400 },
  'Turmeric': { base: 14500, range: 2000 },
};

const trends = ['up', 'up', 'down', 'stable', 'up', 'stable', 'down', 'up'];
let priceInserted = 0, priceSkipped = 0;

for (const commodity of commodities) {
  const { base, range } = priceData[commodity.name];
  for (const mandi of mandis) {
    // Generate last 30 days of price data
    for (let d = 29; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      date.setHours(0, 0, 0, 0);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const exists = await MandiPrice.findOne({ commodity: commodity.name, mandiName: mandi.name, priceDate: date });
      if (exists) { priceSkipped++; continue; }

      const variation = (Math.random() - 0.5) * range;
      const modal = Math.round(base + variation);
      const min = Math.round(modal * (0.92 + Math.random() * 0.04));
      const max = Math.round(modal * (1.02 + Math.random() * 0.06));
      const trend = trends[Math.floor(Math.random() * trends.length)];
      const changePercent = trend === 'up' ? +(Math.random() * 3).toFixed(2) : trend === 'down' ? -(Math.random() * 3).toFixed(2) : +(Math.random() * 0.5 - 0.25).toFixed(2);

      await MandiPrice.create({
        commodity: commodity.name,
        variety: commodity.varieties[0],
        grade: 'FAQ',
        mandiName: mandi.name,
        district: mandi.district,
        state: mandi.state,
        minPrice: min,
        maxPrice: max,
        modalPrice: modal,
        arrivalVolume: Math.round(50 + Math.random() * 500),
        unit: 'Quintal',
        priceDate: date,
        source: 'agroindia-seed',
        trend,
        changePercent,
        previousModalPrice: Math.round(modal * (1 - changePercent / 100)),
      });
      priceInserted++;
    }
  }
}

console.log(`✅ Mandi Prices: ${priceInserted} inserted, ${priceSkipped} skipped`);
await mongoose.disconnect();
console.log('✅ Seed complete — disconnected');
