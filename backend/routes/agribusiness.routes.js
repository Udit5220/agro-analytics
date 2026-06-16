import express from 'express';
import { 
    getSnapshot, 
    getTrends, 
    generateForecast, 
    getRiskAnalysis, 
    getAdminAnalytics 
} from '../controllers/agribusiness.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Agribusiness Manager Routes
router.get('/agribusiness/dashboard-snapshot', requireAuth, getSnapshot);
router.get('/agribusiness/industry-trends', requireAuth, getTrends);
router.post('/agribusiness/crop-forecasts', requireAuth, generateForecast);
router.get('/agribusiness/risk-mitigation', requireAuth, getRiskAnalysis);
router.get('/agribusiness/admin-analytics', requireAuth, getAdminAnalytics);

export default router;
