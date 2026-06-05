import 'dotenv/config';
import mongoose from 'mongoose';
import Reservoir from '../models/Reservoir.js';
import WeatherForecast from '../models/WeatherForecast.js';
import WeatherAlert from '../models/WeatherAlert.js';
import IrrigationAdvisory from '../models/IrrigationAdvisory.js';

const dbName = process.env.MONGO_URI_1 ? 'agro-india' : 'greenleaf-dev';
await mongoose.connect(process.env.MONGO_URI_1 || process.env.MONGO_URI, { dbName });
console.log(`✅ Connected to MongoDB (${process.env.MONGO_URI_1 ? 'Secondary' : 'Primary'}/Seeding) to database: ${dbName}`);

// ─── Major Indian Reservoirs ──────────────────────────────────────────────────
const reservoirs = [
  { damName: 'Sardar Sarovar', reservoirName: 'Sardar Sarovar Reservoir', district: 'Narmada', state: 'Gujarat', river: 'Narmada', location: { type: 'Point', coordinates: [73.7481, 21.8306] }, fullReservoirLevel: 138.68, currentWaterLevel: 120.5, liveStorage: 8.12, storageCapacity: 9.46, storagePercentage: 86, previousYearStorage: 7.8, tenYearAvgStorage: 6.9, status: 'normal' },
  { damName: 'Bhakra Nangal', reservoirName: 'Gobind Sagar Lake', district: 'Bilaspur', state: 'Himachal Pradesh', river: 'Sutlej', location: { type: 'Point', coordinates: [76.4287, 31.4182] }, fullReservoirLevel: 518, currentWaterLevel: 385.2, liveStorage: 4.85, storageCapacity: 9.34, storagePercentage: 52, previousYearStorage: 5.1, tenYearAvgStorage: 4.9, status: 'low' },
  { damName: 'Hirakud', reservoirName: 'Hirakud Reservoir', district: 'Sambalpur', state: 'Odisha', river: 'Mahanadi', location: { type: 'Point', coordinates: [83.8707, 21.5263] }, fullReservoirLevel: 192, currentWaterLevel: 168.5, liveStorage: 4.2, storageCapacity: 8.14, storagePercentage: 52, previousYearStorage: 5.8, tenYearAvgStorage: 5.2, status: 'low' },
  { damName: 'Nagarjuna Sagar', reservoirName: 'Nagarjuna Sagar Lake', district: 'Nalgonda', state: 'Telangana', river: 'Krishna', location: { type: 'Point', coordinates: [79.3177, 16.5748] }, fullReservoirLevel: 179.83, currentWaterLevel: 172.4, liveStorage: 9.8, storageCapacity: 11.77, storagePercentage: 83, previousYearStorage: 9.2, tenYearAvgStorage: 8.8, status: 'normal' },
  { damName: 'Koyna', reservoirName: 'Shivsagar Lake', district: 'Satara', state: 'Maharashtra', river: 'Koyna', location: { type: 'Point', coordinates: [73.7478, 17.3981] }, fullReservoirLevel: 659.9, currentWaterLevel: 598.3, liveStorage: 2.65, storageCapacity: 2.797, storagePercentage: 95, previousYearStorage: 2.4, tenYearAvgStorage: 2.3, status: 'normal' },
  { damName: 'Tungabhadra', reservoirName: 'Tungabhadra Reservoir', district: 'Vijayanagara', state: 'Karnataka', river: 'Tungabhadra', location: { type: 'Point', coordinates: [76.3344, 15.2636] }, fullReservoirLevel: 1633, currentWaterLevel: 1598.5, liveStorage: 3.48, storageCapacity: 3.77, storagePercentage: 92, previousYearStorage: 2.9, tenYearAvgStorage: 3.1, status: 'normal' },
  { damName: 'Jayakwadi', reservoirName: 'Jayakwadi Dam Lake', district: 'Aurangabad', state: 'Maharashtra', river: 'Godavari', location: { type: 'Point', coordinates: [75.3795, 19.4825] }, fullReservoirLevel: 549.06, currentWaterLevel: 498.2, liveStorage: 1.21, storageCapacity: 2.904, storagePercentage: 42, previousYearStorage: 1.8, tenYearAvgStorage: 1.5, status: 'low' },
  { damName: 'Indira Sagar', reservoirName: 'Indira Sagar Reservoir', district: 'Khandwa', state: 'Madhya Pradesh', river: 'Narmada', location: { type: 'Point', coordinates: [76.4721, 22.2608] }, fullReservoirLevel: 262.13, currentWaterLevel: 218.6, liveStorage: 4.68, storageCapacity: 12.22, storagePercentage: 38, previousYearStorage: 6.2, tenYearAvgStorage: 5.8, status: 'critical' },
  { damName: 'Bansagar', reservoirName: 'Bansagar Reservoir', district: 'Shahdol', state: 'Madhya Pradesh', river: 'Son', location: { type: 'Point', coordinates: [81.2896, 24.1999] }, fullReservoirLevel: 343.7, currentWaterLevel: 310.2, liveStorage: 3.25, storageCapacity: 5.41, storagePercentage: 60, previousYearStorage: 3.9, tenYearAvgStorage: 3.6, status: 'normal' },
  { damName: 'Ukai', reservoirName: 'Ukai Reservoir', district: 'Tapi', state: 'Gujarat', river: 'Tapi', location: { type: 'Point', coordinates: [73.6075, 21.2503] }, fullReservoirLevel: 105.15, currentWaterLevel: 89.4, liveStorage: 5.12, storageCapacity: 8.511, storagePercentage: 60, previousYearStorage: 5.8, tenYearAvgStorage: 5.4, status: 'normal' },
];

let rInserted = 0, rSkipped = 0;
for (const r of reservoirs) {
  const exists = await Reservoir.findOne({ damName: r.damName });
  if (!exists) { await Reservoir.create(r); rInserted++; } else rSkipped++;
}
console.log(`✅ Reservoirs: ${rInserted} inserted, ${rSkipped} skipped`);

// ─── Weather Forecasts (7 days for 5 districts) ───────────────────────────────
const districts = [
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
];

const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Moderate Rain', 'Clear', 'Hazy'];
const farmingActivities = {
  'Sunny': 'Excellent for harvesting and field operations',
  'Partly Cloudy': 'Good for spraying and sowing',
  'Cloudy': 'Monitor closely — rain may follow',
  'Light Rain': 'Avoid spraying. Check drainage',
  'Moderate Rain': 'Avoid field operations. Ensure proper drainage',
  'Clear': 'Ideal for all farm activities',
  'Hazy': 'Moderate visibility — take care during transportation',
};

let wInserted = 0, wSkipped = 0;
for (const dist of districts) {
  for (let d = 0; d < 8; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    date.setHours(0, 0, 0, 0);

    const exists = await WeatherForecast.findOne({ district: dist.name, forecastDate: date, forecastType: d === 0 ? 'current' : 'daily' });
    if (exists) { wSkipped++; continue; }

    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const rainProb = condition.includes('Rain') ? 60 + Math.floor(Math.random() * 35) : Math.floor(Math.random() * 35);
    const expectedRain = rainProb > 50 ? +(Math.random() * 30 + 5).toFixed(1) : +(Math.random() * 5).toFixed(1);
    const riskLevel = rainProb > 75 ? 'high' : rainProb > 45 ? 'medium' : 'low';
    const temp = 25 + Math.floor(Math.random() * 15);

    await WeatherForecast.create({
      locationName: dist.name,
      district: dist.name,
      state: dist.state,
      coordinates: { lat: dist.lat, lng: dist.lng },
      currentTemp: temp,
      minTemp: temp - 5 - Math.floor(Math.random() * 4),
      maxTemp: temp + 2 + Math.floor(Math.random() * 5),
      humidity: 40 + Math.floor(Math.random() * 50),
      windSpeed: 8 + Math.floor(Math.random() * 20),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      rainProbability: rainProb,
      expectedRainfall: expectedRain,
      weatherCondition: condition,
      forecastDate: date,
      forecastType: d === 0 ? 'current' : 'daily',
      riskLevel,
      recommendation: riskLevel === 'high' ? 'Avoid field operations and harvesting today.' : riskLevel === 'medium' ? 'Monitor weather and plan accordingly.' : 'Good conditions for farming activities.',
      farmingActivity: farmingActivities[condition],
      source: 'agroindia-seed',
    });
    wInserted++;
  }
}
console.log(`✅ Weather Forecasts: ${wInserted} inserted, ${wSkipped} skipped`);

// ─── Weather Alerts ───────────────────────────────────────────────────────────
const alertsData = [
  { alertTitle: 'Heavy Rainfall Warning — Nashik Region', alertType: 'heavy_rain', locationName: 'Nashik', district: 'Nashik', state: 'Maharashtra', riskLevel: 'high', recommendedAction: 'Avoid harvesting onion and tomato. Ensure drainage in fields.', description: 'IMD has issued heavy rainfall warning for Nashik district. Expected 50-80mm in 24 hours.', affectedCrops: ['Onion', 'Tomato', 'Grapes'] },
  { alertTitle: 'Heatwave Alert — Rajasthan', alertType: 'heatwave', locationName: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', riskLevel: 'high', recommendedAction: 'Irrigate in early morning or evening. Provide shade to livestock.', description: 'Temperature expected to reach 46°C. High crop stress risk.', affectedCrops: ['Wheat', 'Mustard', 'Chana'] },
  { alertTitle: 'Low Reservoir Level — Indira Sagar', alertType: 'low_reservoir', locationName: 'Khandwa', district: 'Khandwa', state: 'Madhya Pradesh', riskLevel: 'high', recommendedAction: 'Prioritize irrigation scheduling. Consider drip irrigation.', description: 'Indira Sagar reservoir at 38% capacity — below critical threshold.', affectedCrops: ['Soybean', 'Cotton', 'Maize'] },
  { alertTitle: 'Strong Wind Advisory — Gujarat Coast', alertType: 'strong_wind', locationName: 'Rajkot', district: 'Rajkot', state: 'Gujarat', riskLevel: 'medium', recommendedAction: 'Avoid aerial spraying. Secure loose farm infrastructure.', description: 'Wind speeds of 40-60 km/h expected. Spray operations not advised.', affectedCrops: ['Cotton', 'Groundnut'] },
  { alertTitle: 'Irrigation Warning — Canal Release Delayed', alertType: 'irrigation_warning', locationName: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', riskLevel: 'medium', recommendedAction: 'Pump groundwater if available. Monitor crop water stress.', description: 'Canal release from Nagarjuna Sagar delayed by 5 days due to maintenance.', affectedCrops: ['Paddy', 'Chili'] },
];

let aInserted = 0, aSkipped = 0;
const now = new Date();
for (const a of alertsData) {
  const exists = await WeatherAlert.findOne({ alertTitle: a.alertTitle });
  if (!exists) {
    await WeatherAlert.create({ ...a, startTime: now, endTime: new Date(now.getTime() + 72 * 60 * 60 * 1000), status: 'active' });
    aInserted++;
  } else aSkipped++;
}
console.log(`✅ Weather Alerts: ${aInserted} inserted, ${aSkipped} skipped`);

// ─── Irrigation Advisories ────────────────────────────────────────────────────
const advisories = [
  { locationName: 'Indore', district: 'Indore', state: 'Madhya Pradesh', crop: 'Soybean', irrigationAdvice: 'wait', reason: 'Light rain expected in 2 days', rainExpected: true, rainProbability: 55, reservoirStatus: 'normal', recommendation: 'Wait for expected rainfall before irrigating. Monitor soil moisture.' },
  { locationName: 'Nashik', district: 'Nashik', state: 'Maharashtra', crop: 'Onion', irrigationAdvice: 'avoid', reason: 'Heavy rainfall warning active', rainExpected: true, rainProbability: 85, reservoirStatus: 'normal', recommendation: 'Heavy rain expected. Skip irrigation and ensure field drainage.' },
  { locationName: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', crop: 'Mustard', irrigationAdvice: 'irrigate_today', reason: 'Dry spell for 8+ days', rainExpected: false, rainProbability: 10, reservoirStatus: 'low', recommendation: 'Soil is critically dry. Irrigate immediately for crop health.' },
  { locationName: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', crop: 'Cotton', irrigationAdvice: 'monitor', reason: 'Adequate moisture for now', rainExpected: false, rainProbability: 30, reservoirStatus: 'normal', recommendation: 'Adequate moisture present. Monitor for next 3 days.' },
  { locationName: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', crop: 'Paddy', irrigationAdvice: 'irrigate_today', reason: 'Canal release delayed', rainExpected: false, rainProbability: 15, reservoirStatus: 'normal', recommendation: 'Canal water delayed. Use groundwater source for irrigation today.' },
];

let iInserted = 0;
for (const a of advisories) {
  const exists = await IrrigationAdvisory.findOne({ district: a.district, crop: a.crop });
  if (!exists) { await IrrigationAdvisory.create({ ...a, validForDate: new Date() }); iInserted++; }
}
console.log(`✅ Irrigation Advisories: ${iInserted} inserted`);

await mongoose.disconnect();
console.log('✅ Weather & Reservoir seed complete');
