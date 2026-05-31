import MarketplaceListing from '../models/MarketplaceListing.js';
import BuyerRequirement from '../models/BuyerRequirement.js';
import Offer from '../models/Offer.js';
import Order from '../models/Order.js';
import Invoice from '../models/Invoice.js';
import MandiPrice from '../models/MandiPrice.js';
import WeatherForecast from '../models/WeatherForecast.js';

// ─── Helper: graceful MongoDB fallback ───────────────────────────────────────
const tryMongo = async (fn, fallback = null) => {
  try { return await fn(); }
  catch (e) { console.warn('[Marketplace] MongoDB unavailable:', e.message); return fallback; }
};

// ─── GET /api/marketplace/listings ───────────────────────────────────────────
export const getListings = async (req, res) => {
  try {
    const { commodity, district, state, listingType, sellerType, minPrice, maxPrice, grade, verified, page = 1, limit = 20 } = req.query;
    const filter = { status: 'active' };
    if (commodity) filter.commodity = { $regex: commodity, $options: 'i' };
    if (district) filter.district = { $regex: district, $options: 'i' };
    if (state) filter.state = { $regex: state, $options: 'i' };
    if (listingType) filter.listingType = listingType;
    if (sellerType) filter.sellerType = sellerType;
    if (grade) filter.grade = { $regex: grade, $options: 'i' };
    if (verified === 'true') filter.isVerifiedSeller = true;
    if (minPrice || maxPrice) {
      filter.expectedPrice = {};
      if (minPrice) filter.expectedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.expectedPrice.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await tryMongo(() => MarketplaceListing.countDocuments(filter), 0);
    const listings = await tryMongo(() =>
      MarketplaceListing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)), []
    );

    // Enrich with mandi benchmark (best-effort)
    const enriched = await Promise.all((listings || []).map(async (l) => {
      const benchmark = await tryMongo(() => MandiPrice.findOne({ commodity: l.commodity }).sort({ priceDate: -1 }));
      const comparison = benchmark ? (((l.expectedPrice - benchmark.modalPrice) / benchmark.modalPrice) * 100).toFixed(1) : 0;
      return { ...l.toObject(), mandiBenchmarkPrice: benchmark?.modalPrice || 0, priceComparisonPercent: parseFloat(comparison) };
    }));

    res.json({ success: true, data: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) || 1 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── POST /api/marketplace/listings ──────────────────────────────────────────
export const createListing = async (req, res) => {
  try {
    // Auto-enrich with mandi benchmark
    const benchmark = await MandiPrice.findOne({ commodity: req.body.commodity }).sort({ priceDate: -1 });
    const benchmarkPrice = benchmark?.modalPrice || 0;
    const comparison = benchmarkPrice ? (((req.body.expectedPrice - benchmarkPrice) / benchmarkPrice) * 100).toFixed(1) : 0;

    const listing = await MarketplaceListing.create({
      ...req.body,
      sellerId: 'guest',
      mandiBenchmarkPrice: benchmarkPrice,
      priceComparisonPercent: parseFloat(comparison),
    });
    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── GET /api/marketplace/listings/:id ───────────────────────────────────────
export const getListingById = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findByIdAndUpdate(
      req.params.id, { $inc: { viewCount: 1 } }, { new: true }
    );
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' });

    // Get benchmark price
    const benchmark = await MandiPrice.findOne({ commodity: listing.commodity }).sort({ priceDate: -1 });

    // Weather risk for listing district
    const weatherRisk = await WeatherForecast.findOne({ district: listing.district }).sort({ forecastDate: 1 });

    res.json({
      success: true,
      data: listing,
      mandiBenchmark: benchmark ? { modalPrice: benchmark.modalPrice, mandiName: benchmark.mandiName, trend: benchmark.trend } : null,
      weatherRisk: weatherRisk ? { riskLevel: weatherRisk.riskLevel, weatherCondition: weatherRisk.weatherCondition, rainProbability: weatherRisk.rainProbability } : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── PATCH /api/marketplace/listings/:id ─────────────────────────────────────
export const updateListing = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' });
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── DELETE /api/marketplace/listings/:id ────────────────────────────────────
export const deleteListing = async (req, res) => {
  try {
    await MarketplaceListing.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── GET /api/marketplace/buyer-requirements ──────────────────────────────────
export const getBuyerRequirements = async (req, res) => {
  try {
    const { commodity, district, state } = req.query;
    const filter = { status: 'active' };
    if (commodity) filter.commodity = { $regex: commodity, $options: 'i' };
    if (district) filter.district = { $regex: district, $options: 'i' };
    if (state) filter.state = { $regex: state, $options: 'i' };

    const requirements = await BuyerRequirement.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: requirements, count: requirements.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── POST /api/marketplace/buyer-requirements ─────────────────────────────────
export const createBuyerRequirement = async (req, res) => {
  try {
    const req_ = await BuyerRequirement.create({ ...req.body, buyerId: 'guest' });
    res.status(201).json({ success: true, data: req_ });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── POST /api/marketplace/offers ────────────────────────────────────────────
export const createOffer = async (req, res) => {
  try {
    const listing = await MarketplaceListing.findById(req.body.listingId);
    if (!listing) return res.status(404).json({ success: false, error: 'Listing not found' });

    const offer = await Offer.create({
      ...req.body,
      buyerId: 'guest',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      commodity: listing.commodity,
    });

    // Increment offer count on listing
    await MarketplaceListing.findByIdAndUpdate(req.body.listingId, { $inc: { offerCount: 1 } });

    res.status(201).json({ success: true, data: offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── GET /api/marketplace/offers ─────────────────────────────────────────────
export const getOffers = async (req, res) => {
  try {
    const { listingId, status } = req.query;
    const filter = {};
    if (listingId) filter.listingId = listingId;
    if (status) filter.status = status;
    filter.$or = [{ buyerId: 'guest' }, { sellerId: 'guest' }];

    const offers = await Offer.find(filter).sort({ createdAt: -1 }).populate('listingId', 'productName commodity district');
    res.json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── PATCH /api/marketplace/offers/:id ───────────────────────────────────────
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ success: false, error: 'Offer not found' });
    res.json({ success: true, data: offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── GET /api/marketplace/orders ─────────────────────────────────────────────
export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { $or: [{ buyerId: 'guest' }, { sellerId: 'guest' }] };
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    // Enrich with weather risk for delivery district
    const enriched = await Promise.all(orders.map(async (o) => {
      if (o.deliveryDistrict) {
        const weather = await WeatherForecast.findOne({ district: o.deliveryDistrict }).sort({ forecastDate: 1 });
        if (weather && weather.riskLevel !== 'low') {
          const note = weather.riskLevel === 'high'
            ? `⚠️ Heavy rain expected near ${o.deliveryDistrict}. Delivery may be delayed.`
            : `⚠️ Weather caution in ${o.deliveryDistrict}. Monitor delivery conditions.`;
          return { ...o.toObject(), weatherRiskNote: note };
        }
      }
      return o.toObject();
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── POST /api/marketplace/orders ────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, buyerId: 'guest' });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── PATCH /api/marketplace/orders/:id ───────────────────────────────────────
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── GET /api/marketplace/invoices ───────────────────────────────────────────
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ $or: [{ buyerId: 'guest' }, { sellerId: 'guest' }] })
      .sort({ createdAt: -1 })
      .populate('orderId', 'orderNumber orderStatus');
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── POST /api/marketplace/invoices ──────────────────────────────────────────
export const createInvoice = async (req, res) => {
  try {
    const taxRate = req.body.taxRate || 0;
    const amount = req.body.amount || 0;
    const taxAmount = (amount * taxRate) / 100;
    const totalAmount = amount + taxAmount;

    const invoice = await Invoice.create({ ...req.body, buyerId: 'guest', taxAmount, totalAmount });
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── GET /api/marketplace/dashboard ──────────────────────────────────────────
export const getMarketplaceDashboard = async (req, res) => {
  try {
    const [activeListings, buyerRequirements, totalOffers, orders, invoices] = await Promise.all([
      tryMongo(() => MarketplaceListing.countDocuments({ status: 'active' }), 0),
      tryMongo(() => BuyerRequirement.countDocuments({ status: 'active' }), 0),
      tryMongo(() => Offer.countDocuments({ $or: [{ buyerId: 'guest' }, { sellerId: 'guest' }] }), 0),
      tryMongo(() => Order.find({ $or: [{ buyerId: 'guest' }, { sellerId: 'guest' }] }).sort({ createdAt: -1 }).limit(5), []),
      tryMongo(() => Invoice.find({ $or: [{ buyerId: 'guest' }, { sellerId: 'guest' }] }), []),
    ]);

    const totalSalesValue = (invoices || []).filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.totalAmount, 0);
    const pendingPayments = (invoices || []).filter(i => i.paymentStatus === 'pending').length;

    const topDemand = await tryMongo(() => BuyerRequirement.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$commodity', count: { $sum: 1 }, avgTargetPrice: { $avg: '$targetPrice' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]), []);

    res.json({
      success: true,
      data: {
        summary: { activeListings, buyerRequirements, totalOffers, pendingPayments, totalSalesValue },
        recentOrders: orders || [],
        topDemandCommodities: topDemand || [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
