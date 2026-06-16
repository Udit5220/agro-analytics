import express from 'express';
import multer from 'multer';
import { 
    uploadAndProcessDocument, searchResearchInsights, generatePersonaInsights, 
    generateWhitePaper, getLatestPublications, getDashboardSummary, 
    summarizeDocument, draftProposal, getTrends, getAgribusinessSummaries,
    handleVoiceCommand, getDashboardCharts, translateUIText, getWishlistSummary,
    getAdminSidebarMenu, getWhitePaperDashboard
} from '../controllers/research.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', requireAuth, upload.single('document'), uploadAndProcessDocument);
router.post('/search', requireAuth, searchResearchInsights);
router.post('/persona', requireAuth, generatePersonaInsights);
router.post('/whitepaper', requireAuth, generateWhitePaper);
router.post('/voice-assistant', requireAuth, handleVoiceCommand);

// Research Analyst Specific Routes
router.get('/latest-publications', requireAuth, getLatestPublications);
router.get('/dashboard-summary', requireAuth, getDashboardSummary);
router.get('/dashboard-charts', requireAuth, getDashboardCharts);
router.post('/summarize-document', requireAuth, summarizeDocument);
router.post('/wishlist-summary', requireAuth, getWishlistSummary);
router.post('/translate-ui', translateUIText);
router.post('/draft-proposal', requireAuth, draftProposal);
router.get('/trends', requireAuth, getTrends);
router.get('/agribusiness-summaries', requireAuth, getAgribusinessSummaries);
router.get('/admin-menu', requireAuth, getAdminSidebarMenu);
router.get('/whitepaper-dashboard', requireAuth, getWhitePaperDashboard);

export default router;
