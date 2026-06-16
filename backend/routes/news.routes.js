import express from 'express';
import { getNewsDashboardData, getNewsDetails, getNewsIntelligenceDetails, getNewsSidebarMenu, getNewsIntelligence } from '../controllers/news.controller.js';

const router = express.Router();

router.get('/dashboard', getNewsDashboardData);
router.get('/ai-details', getNewsDetails);
router.get('/intelligence-details', getNewsIntelligenceDetails);
router.get('/sidebar-menu', getNewsSidebarMenu);
router.get('/intelligence', getNewsIntelligence);

export default router;
