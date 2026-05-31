import mongoose from 'mongoose';

const weatherAlertSchema = new mongoose.Schema({
  alertTitle: { type: String, required: true },
  alertType: {
    type: String,
    enum: ['heavy_rain', 'heatwave', 'frost', 'strong_wind', 'hailstorm', 'low_reservoir', 'irrigation_warning', 'harvesting_risk', 'cyclone', 'fog'],
    required: true,
  },
  locationName: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  recommendedAction: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  source: { type: String, default: 'IMD' },
  affectedCrops: [{ type: String }],
}, { timestamps: true, collection: 'agroindia_weather_alerts' });

weatherAlertSchema.index({ district: 1, status: 1 });
weatherAlertSchema.index({ status: 1, endTime: 1 });

export default mongoose.model('AgroindiWeatherAlert', weatherAlertSchema);
