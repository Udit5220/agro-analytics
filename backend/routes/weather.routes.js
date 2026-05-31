import express from 'express';
import {
  getCurrentWeather, getWeatherForecast, getRainfallData, getWeatherAlerts,
  getReservoirs, getReservoirById, getIrrigationAdvisory,
} from '../controllers/weather.controller.js';

const router = express.Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/rainfall', getRainfallData);
router.get('/alerts', getWeatherAlerts);

router.get('/reservoirs', getReservoirs);
router.get('/reservoirs/:id', getReservoirById);
router.get('/irrigation-advisory', getIrrigationAdvisory);

export default router;
