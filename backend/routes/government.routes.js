import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
    getPolicySnapshot,
    getDistrictIntervention,
    getPolicyRecommendations,
    getSchemeAnalytics,
    generateEmergencyReliefPlan,
    getTradeAnalytics
} from '../controllers/government.controller.js';

const router = express.Router();

// Government Official Routes
router.get('/government/policy-snapshot', requireAuth, getPolicySnapshot);
router.get('/government/district-intervention', requireAuth, getDistrictIntervention);
router.post('/government/policy-recommendations', requireAuth, getPolicyRecommendations);
router.get('/government/scheme-analytics', requireAuth, getSchemeAnalytics);
router.post('/government/emergency-relief', requireAuth, generateEmergencyReliefPlan);
router.get('/government/trade-analytics', requireAuth, getTradeAnalytics);

export default router;
