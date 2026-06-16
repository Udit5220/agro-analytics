import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
    getPlatformOpsAnalytics,
    getComprehensiveAnalytics,
    uploadKnowledgeBase,
    configurePromptTemplates,
    getAISettings
} from '../controllers/admin.controller.js';

const router = express.Router();

// Company Admin Routes
router.get('/admin/analytics/ops', requireAuth, getPlatformOpsAnalytics);
router.get('/admin/analytics/comprehensive', requireAuth, getComprehensiveAnalytics);
router.post('/admin/knowledge-base/upload', requireAuth, uploadKnowledgeBase);
router.get('/admin/prompts/configure', requireAuth, configurePromptTemplates);
router.post('/admin/prompts/configure', requireAuth, configurePromptTemplates);
router.get('/admin/model/settings', requireAuth, getAISettings);
router.post('/admin/model/settings', requireAuth, getAISettings);

export default router;
