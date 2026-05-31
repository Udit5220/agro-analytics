import WeatherForecast from '../models/WeatherForecast.js';
import WeatherAlert from '../models/WeatherAlert.js';
import Reservoir from '../models/Reservoir.js';
import IrrigationAdvisory from '../models/IrrigationAdvisory.js';

// ─── Helper: graceful MongoDB fallback ───────────────────────────────────────
const tryMongo = async (fn, fallback = null) => {
  try { return await fn(); }
  catch (e) { console.warn('[Weather] MongoDB unavailable:', e.message); return fallback; }
};

// ─── Proximity Euclidean Distance Helper ──────────────────────────────────────
const getDistance = (lat1, lng1, lat2, lng2) => {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

// ─── GET /api/weather/current ─────────────────────────────────────────────────
export const getCurrentWeather = async (req, res) => {
  try {
    const { district = 'Indore', state = 'Madhya Pradesh', lat, lng } = req.query;
    const now = new Date();

    let targetDistrict = district;

    // Resolve nearest district based on coordinates if passed
    if (lat !== undefined && lng !== undefined) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        const distinctWeatherStations = await tryMongo(() => WeatherForecast.find({ forecastType: 'current' }), []);
        if (distinctWeatherStations && distinctWeatherStations.length > 0) {
          // Filter unique stations
          const stations = [];
          const seen = new Set();
          for (const s of distinctWeatherStations) {
            if (s.coordinates && s.coordinates.lat && s.coordinates.lng && !seen.has(s.district)) {
              seen.add(s.district);
              stations.push(s);
            }
          }

          if (stations.length > 0) {
            let closest = stations[0];
            let minDist = getDistance(parsedLat, parsedLng, closest.coordinates.lat, closest.coordinates.lng);
            for (let i = 1; i < stations.length; i++) {
              const d = getDistance(parsedLat, parsedLng, stations[i].coordinates.lat, stations[i].coordinates.lng);
              if (d < minDist) {
                minDist = d;
                closest = stations[i];
              }
            }
            targetDistrict = closest.district;
            console.log(`[Weather Controller] Geolocation proximity match: (${parsedLat}, ${parsedLng}) resolved to closest station: ${targetDistrict}`);
          }
        }
      }
    }

    // Get today's forecast
    let current = await tryMongo(() => WeatherForecast.findOne({
      district: { $regex: targetDistrict, $options: 'i' },
      forecastType: 'current',
      forecastDate: { $gte: new Date(now.setHours(0, 0, 0, 0)) },
    }).sort({ createdAt: -1 }));

    if (!current) {
      current = await tryMongo(() => WeatherForecast.findOne({
        district: { $regex: targetDistrict, $options: 'i' },
      }).sort({ forecastDate: -1 }));
    }

    // Ultimate fallback if no match found
    if (!current) {
      current = await tryMongo(() => WeatherForecast.findOne({ forecastType: 'current' }).sort({ createdAt: -1 }));
    }

    const alerts = await tryMongo(() => WeatherAlert.find({
      $or: [
        { district: { $regex: targetDistrict, $options: 'i' } },
        { district: 'All' },
      ],
      status: 'active',
      endTime: { $gte: new Date() },
    }).limit(3)) || [];

    res.json({ success: true, data: current, alerts, district: current ? current.district : targetDistrict, state: current ? current.state : state });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── GET /api/weather/forecast ────────────────────────────────────────────────
export const getWeatherForecast = async (req, res) => {
  try {
    const { district = 'Indore', days = 7 } = req.query;
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + parseInt(days));

    const forecast = await tryMongo(() => WeatherForecast.find({
      district: { $regex: district, $options: 'i' },
      forecastType: 'daily',
      forecastDate: { $gte: fromDate, $lte: toDate },
    }).sort({ forecastDate: 1 }).limit(parseInt(days))) || [];

    res.json({ success: true, data: forecast, district, days: parseInt(days) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── GET /api/weather/rainfall ────────────────────────────────────────────────
export const getRainfallData = async (req, res) => {
  try {
    const { district = 'Indore', days = 14 } = req.query;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    const rainfall = await tryMongo(() => WeatherForecast.find({
      district: { $regex: district, $options: 'i' },
      forecastDate: { $gte: fromDate },
    }).sort({ forecastDate: 1 }).select('forecastDate expectedRainfall rainProbability weatherCondition riskLevel district')) || [];

    const totalExpected = rainfall.reduce((s, r) => s + (r.expectedRainfall || 0), 0);
    const avgProbability = rainfall.length ? Math.round(rainfall.reduce((s, r) => s + r.rainProbability, 0) / rainfall.length) : 0;
    const heavyRainDays = rainfall.filter(r => r.expectedRainfall > 20).length;

    res.json({
      success: true,
      data: rainfall,
      summary: { totalExpectedRainfall: totalExpected.toFixed(1), avgRainProbability: avgProbability, heavyRainDays },
      district,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── GET /api/weather/alerts ──────────────────────────────────────────────────
export const getWeatherAlerts = async (req, res) => {
  try {
    const { district, state, riskLevel } = req.query;
    const filter = { status: 'active', endTime: { $gte: new Date() } };
    if (district) filter.$or = [{ district: { $regex: district, $options: 'i' } }, { district: 'All' }];
    if (state) filter.state = { $regex: state, $options: 'i' };
    if (riskLevel) filter.riskLevel = riskLevel;

    const alerts = await tryMongo(() => WeatherAlert.find(filter).sort({ riskLevel: -1, startTime: 1 })) || [];
    res.json({ success: true, data: alerts, count: alerts.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── GET /api/reservoirs ──────────────────────────────────────────────────────
export const getReservoirs = async (req, res) => {
  try {
    const { state, status, page = 1, limit = 20, lat, lng } = req.query;
    const filter = { isActive: true };
    if (state) filter.state = { $regex: state, $options: 'i' };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await tryMongo(() => Reservoir.countDocuments(filter)) || 0;
    const reservoirs = await tryMongo(() => Reservoir.find(filter)
      .sort({ storagePercentage: 1 })
      .skip(skip)
      .limit(parseInt(limit))) || [];

    // Sort by proximity to farmer's location if coordinates are provided
    if (lat !== undefined && lng !== undefined) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        reservoirs.sort((a, b) => {
          // Reservoir coordinates are in location.coordinates: [longitude, latitude] format
          const latA = a.location?.coordinates?.[1] || 0;
          const lngA = a.location?.coordinates?.[0] || 0;
          const latB = b.location?.coordinates?.[1] || 0;
          const lngB = b.location?.coordinates?.[0] || 0;

          const distA = getDistance(parsedLat, parsedLng, latA, lngA);
          const distB = getDistance(parsedLat, parsedLng, latB, lngB);
          return distA - distB;
        });
        console.log(`[Reservoir Controller] Proximity sort applied relative to coordinates: (${parsedLat}, ${parsedLng})`);
      }
    }

    const summaryArr = await tryMongo(() => Reservoir.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        avgStorage: { $avg: '$storagePercentage' },
        critical: { $sum: { $cond: [{ $eq: ['$status', 'critical'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$status', 'low'] }, 1, 0] } },
        normal: { $sum: { $cond: [{ $eq: ['$status', 'normal'] }, 1, 0] } },
        totalCapacity: { $sum: '$storageCapacity' },
        totalLiveStorage: { $sum: '$liveStorage' },
      }},
    ])) || [];

    res.json({
      success: true,
      data: reservoirs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      summary: summaryArr[0] || {},
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getReservoirById = async (req, res) => {
  try {
    const reservoir = await tryMongo(() => Reservoir.findById(req.params.id));
    if (!reservoir) return res.status(404).json({ success: false, error: 'Reservoir not found' });
    res.json({ success: true, data: reservoir });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getIrrigationAdvisory = async (req, res) => {
  try {
    const { district = 'Indore', crop } = req.query;
    const filter = { district: { $regex: district, $options: 'i' } };
    if (crop) filter.crop = { $regex: crop, $options: 'i' };

    const advisories = await tryMongo(() => IrrigationAdvisory.find(filter)
      .sort({ validForDate: -1 })
      .limit(10)) || [];

    res.json({ success: true, data: advisories, district });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
