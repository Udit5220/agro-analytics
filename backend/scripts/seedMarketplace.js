import 'dotenv/config';
import mongoose from 'mongoose';
import MarketplaceListing from '../models/MarketplaceListing.js';
import BuyerRequirement from '../models/BuyerRequirement.js';
import Offer from '../models/Offer.js';
import Order from '../models/Order.js';
import Invoice from '../models/Invoice.js';

await mongoose.connect(process.env.MONGO_URI, { dbName: 'greenleaf-dev' });
console.log('✅ Connected to MongoDB');

// ─── Marketplace Listings ─────────────────────────────────────────────────────
const listings = [
  { sellerName: 'Ramesh Patel', sellerType: 'farmer', listingType: 'produce', commodity: 'Wheat', productName: 'Wheat — Lok-1 Variety', category: 'Grain', variety: 'Lok-1', grade: 'FAQ', quantity: 200, unit: 'Quintal', expectedPrice: 2350, harvestDate: new Date(Date.now() - 7*24*60*60*1000), availableDate: new Date(), pickupLocation: 'Village Khandwa Road', district: 'Indore', state: 'Madhya Pradesh', mandiBenchmarkPrice: 2200, priceComparisonPercent: 6.8, isVerifiedSeller: true, contactPreference: 'call', description: 'Fresh harvest. Good quality Lok-1 wheat. Can arrange transport.', status: 'active' },
  { sellerName: 'Suresh Kumar', sellerType: 'farmer', listingType: 'produce', commodity: 'Onion', productName: 'Onion — Nasik Red', category: 'Vegetable', variety: 'Nasik Red', grade: 'A Grade', quantity: 80, unit: 'Quintal', expectedPrice: 2100, harvestDate: new Date(Date.now() - 3*24*60*60*1000), availableDate: new Date(), pickupLocation: 'Lasalgaon APMC', district: 'Nashik', state: 'Maharashtra', mandiBenchmarkPrice: 1800, priceComparisonPercent: 16.7, isVerifiedSeller: true, contactPreference: 'whatsapp', description: 'Premium Nasik red onion. Export quality available.', status: 'active' },
  { sellerName: 'Kisan FPO Indore', sellerType: 'fpo', listingType: 'produce', commodity: 'Soybean', productName: 'Soybean — JS-335', category: 'Oilseed', variety: 'JS-335', grade: 'FAQ', quantity: 500, unit: 'Quintal', expectedPrice: 4900, harvestDate: new Date(Date.now() - 14*24*60*60*1000), availableDate: new Date(), pickupLocation: 'FPO Warehouse, Dewas', district: 'Indore', state: 'Madhya Pradesh', mandiBenchmarkPrice: 4800, priceComparisonPercent: 2.1, isVerifiedSeller: true, contactPreference: 'call', description: 'FPO aggregated soybean. Moisture tested. Ready for oil extraction.', status: 'active' },
  { sellerName: 'Mohan Patidar', sellerType: 'farmer', listingType: 'produce', commodity: 'Cotton', productName: 'Cotton — Bt Hybrid', category: 'Fiber', variety: 'Bt Cotton', grade: 'Shankar-6', quantity: 120, unit: 'Quintal', expectedPrice: 6600, harvestDate: new Date(Date.now() - 5*24*60*60*1000), availableDate: new Date(), pickupLocation: 'Near Akola APMC', district: 'Akola', state: 'Maharashtra', mandiBenchmarkPrice: 6800, priceComparisonPercent: -2.9, isVerifiedSeller: false, contactPreference: 'call', description: 'Good quality Bt cotton. First picking. Staple length 28mm.', status: 'active' },
  { sellerName: 'Vijay Seeds & Agri', sellerType: 'dealer', listingType: 'input', commodity: 'Seeds', productName: 'Certified Wheat Seeds — DBW-187', category: 'Seeds', variety: 'DBW-187', grade: 'Certified', quantity: 50, unit: 'Quintal', expectedPrice: 3200, availableDate: new Date(), pickupLocation: 'Vijay Agri Store, Jaipur', district: 'Jaipur', state: 'Rajasthan', isVerifiedSeller: true, contactPreference: 'call', description: 'ICAR certified wheat seeds. High yielding variety for Rabi season.', status: 'active' },
  { sellerName: 'AgroTech Inputs', sellerType: 'dealer', listingType: 'input', commodity: 'Fertilizer', productName: 'DAP Fertilizer — 50 kg bags', category: 'Fertilizers', variety: 'DAP', grade: 'Standard', quantity: 200, unit: 'Bag', expectedPrice: 1350, availableDate: new Date(), pickupLocation: 'AgroTech Store, Nagpur', district: 'Nagpur', state: 'Maharashtra', isVerifiedSeller: true, contactPreference: 'whatsapp', description: 'Original Iffco DAP. Bills provided. Delivery available in 50km.', status: 'active' },
  { sellerName: 'Rajasthan FPO', sellerType: 'fpo', listingType: 'produce', commodity: 'Mustard', productName: 'Mustard — Yellow Variety', category: 'Oilseed', variety: 'Yellow Mustard', grade: 'Grade-A', quantity: 350, unit: 'Quintal', expectedPrice: 5300, harvestDate: new Date(Date.now() - 20*24*60*60*1000), availableDate: new Date(), pickupLocation: 'Kota Mandi', district: 'Kota', state: 'Rajasthan', mandiBenchmarkPrice: 5100, priceComparisonPercent: 3.9, isVerifiedSeller: true, contactPreference: 'call', description: 'FPO batch — 350 qtl premium yellow mustard. Oil content tested 38%.', status: 'active' },
  { sellerName: 'South India Spice Traders', sellerType: 'trader', listingType: 'produce', commodity: 'Turmeric', productName: 'Turmeric — Erode Finger Grade', category: 'Spice', variety: 'Erode Turmeric', grade: 'Finger Grade', quantity: 60, unit: 'Quintal', expectedPrice: 14800, harvestDate: new Date(Date.now() - 30*24*60*60*1000), availableDate: new Date(), pickupLocation: 'Guntur Market', district: 'Guntur', state: 'Andhra Pradesh', mandiBenchmarkPrice: 14500, priceComparisonPercent: 2.1, isVerifiedSeller: true, contactPreference: 'call', description: 'Premium Erode turmeric. Polished. Curcumin content >4%.', status: 'active' },
];

let lInserted = 0, lSkipped = 0;
for (const l of listings) {
  const exists = await MarketplaceListing.findOne({ productName: l.productName, sellerName: l.sellerName });
  if (!exists) { await MarketplaceListing.create({ ...l, sellerId: 'guest', source: 'agroindia-seed' }); lInserted++; } else lSkipped++;
}
console.log(`✅ Listings: ${lInserted} inserted, ${lSkipped} skipped`);

// ─── Buyer Requirements ───────────────────────────────────────────────────────
const buyerReqs = [
  { buyerName: 'National Food Processors', buyerType: 'processor', commodity: 'Wheat', variety: 'Any', grade: 'FAQ', quantity: 1000, unit: 'Quintal', targetPrice: 2180, deliveryLocation: 'Bhopal Plant', district: 'Bhopal', state: 'Madhya Pradesh', requiredByDate: new Date(Date.now() + 15*24*60*60*1000), notes: 'Need moisture <12%. Bulk requirement for flour mill.', contactNumber: '9876543210' },
  { buyerName: 'Cooking Oil Industries', buyerType: 'processor', commodity: 'Soybean', variety: 'Any', grade: 'Crushing Grade', quantity: 2000, unit: 'Quintal', targetPrice: 4750, deliveryLocation: 'Indore Factory', district: 'Indore', state: 'Madhya Pradesh', requiredByDate: new Date(Date.now() + 10*24*60*60*1000), notes: 'Ongoing monthly requirement. Prefer FPO sellers.', contactNumber: '9765432109' },
  { buyerName: 'Textile Export House', buyerType: 'exporter', commodity: 'Cotton', variety: 'Shankar-6', grade: 'Shankar-6', quantity: 500, unit: 'Quintal', targetPrice: 6700, deliveryLocation: 'Surat Port', district: 'Surat', state: 'Gujarat', requiredByDate: new Date(Date.now() + 20*24*60*60*1000), notes: 'Export order. Staple length min 28mm required.', contactNumber: '9654321098' },
  { buyerName: 'Spice Board India', buyerType: 'exporter', commodity: 'Turmeric', variety: 'Any', grade: 'FAQ', quantity: 100, unit: 'Quintal', targetPrice: 14200, deliveryLocation: 'Kochi Warehouse', district: 'Ernakulam', state: 'Kerala', requiredByDate: new Date(Date.now() + 25*24*60*60*1000), notes: 'Quality certificate required. Curcumin >3.5%.', contactNumber: '9543210987' },
  { buyerName: 'Delhi Wholesale Mandi', buyerType: 'trader', commodity: 'Onion', variety: 'Nasik Red', grade: 'A Grade', quantity: 200, unit: 'Quintal', targetPrice: 1950, deliveryLocation: 'Azadpur Mandi', district: 'Delhi', state: 'Delhi', requiredByDate: new Date(Date.now() + 7*24*60*60*1000), notes: 'Regular weekly requirement. Good price for consistent supply.', contactNumber: '9432109876' },
];

let bInserted = 0;
for (const b of buyerReqs) {
  const exists = await BuyerRequirement.findOne({ buyerName: b.buyerName, commodity: b.commodity });
  if (!exists) { await BuyerRequirement.create({ ...b, buyerId: 'guest', source: 'agroindia-seed' }); bInserted++; }
}
console.log(`✅ Buyer Requirements: ${bInserted} inserted`);

// ─── Sample Offers, Orders, Invoices ─────────────────────────────────────────
const firstListing = await MarketplaceListing.findOne({ status: 'active' });
if (firstListing) {
  const offerExists = await Offer.findOne({ listingId: firstListing._id });
  if (!offerExists) {
    const offer = await Offer.create({
      listingId: firstListing._id, buyerId: 'guest', buyerName: 'National Food Processors',
      sellerId: 'guest', sellerName: firstListing.sellerName, commodity: firstListing.commodity,
      offerPrice: firstListing.expectedPrice * 0.97, quantity: 50, unit: 'Quintal',
      message: 'Interested in buying 50 quintals at ₹2280/qtl. Please confirm availability.', status: 'pending',
      source: 'agroindia-seed',
    });

    const order = await Order.create({
      listingId: firstListing._id, offerId: offer._id, buyerId: 'guest', buyerName: 'National Food Processors',
      sellerId: 'guest', sellerName: firstListing.sellerName, commodity: firstListing.commodity,
      quantity: 50, unit: 'Quintal', finalPrice: firstListing.expectedPrice * 0.97,
      totalAmount: 50 * firstListing.expectedPrice * 0.97,
      pickupLocation: firstListing.pickupLocation, deliveryLocation: 'Bhopal Plant', deliveryDistrict: 'Bhopal',
      deliveryState: 'Madhya Pradesh', orderStatus: 'confirmed', paymentStatus: 'pending',
      expectedDeliveryDate: new Date(Date.now() + 5*24*60*60*1000),
      source: 'agroindia-seed',
    });

    await Invoice.create({
      orderId: order._id, orderNumber: order.orderNumber, buyerId: 'guest', buyerName: 'National Food Processors',
      sellerId: 'guest', sellerName: firstListing.sellerName, commodity: firstListing.commodity,
      quantity: 50, unit: 'Quintal', unitPrice: firstListing.expectedPrice * 0.97,
      amount: 50 * firstListing.expectedPrice * 0.97, taxRate: 5,
      taxAmount: 50 * firstListing.expectedPrice * 0.97 * 0.05,
      totalAmount: 50 * firstListing.expectedPrice * 0.97 * 1.05, paymentStatus: 'pending',
      source: 'agroindia-seed',
    });

    console.log('✅ Sample Offer + Order + Invoice created');
  }
}

await mongoose.disconnect();
console.log('✅ Marketplace seed complete');
