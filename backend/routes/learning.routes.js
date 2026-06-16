import express from 'express';
import { handleAiTutorChat, getLearningDashboardData } from '../controllers/learning.controller.js';

const router = express.Router();

router.post('/chat', handleAiTutorChat);
router.get('/dashboard', getLearningDashboardData);

export default router;
