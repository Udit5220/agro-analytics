import mongoose from 'mongoose';

const weatherForecastSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, default: '' },
  coordinates: { lat: { type: Number }, lng: { type: Number } },
  currentTemp: { type: Number, default: 0 },
  minTemp: { type: Number, default: 0 },
  maxTemp: { type: Number, default: 0 },
  humidity: { type: Number, default: 0 },
  windSpeed: { type: Number, default: 0 },
  windDirection: { type: String, default: 'N' },
  rainProbability: { type: Number, default: 0 }, // 0-100
  expectedRainfall: { type: Number, default: 0 }, // mm
  weatherCondition: { type: String, default: 'Sunny' }, // Sunny, Cloudy, Rainy, etc.
  forecastDate: { type: Date, required: true },
  forecastType: { type: String, enum: ['current', 'hourly', 'daily'], default: 'daily' },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  recommendation: { type: String, default: '' },
  farmingActivity: { type: String, default: '' }, // "Suitable for sowing", etc.
  source: { type: String, default: 'agroindia' },
}, { timestamps: true, collection: 'agroindia_weather_forecasts' });

weatherForecastSchema.index({ district: 1, forecastDate: 1 });
weatherForecastSchema.index({ forecastDate: 1 });

export default mongoose.model('AgroindiWeatherForecast', weatherForecastSchema);
