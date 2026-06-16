import express from 'express';
import {
  getCampaigns, createCampaign, updateCampaign, deleteCampaign
} from '../controllers/campaign.controller.js';

const router = express.Router();

router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);
router.patch('/campaigns/:id', updateCampaign);
router.delete('/campaigns/:id', deleteCampaign);

export default router;
