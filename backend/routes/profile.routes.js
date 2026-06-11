import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  addFarm, 
  updateFarm, 
  deleteFarm,
  getCropRankingsBackend,
  createOrUpdateFarmerProfile,
  getFarmerProfileById
} from '../controllers/profile.controller.js';
import { chatWithSchemeAI } from '../controllers/govSchemes.controller.js';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/farms', addFarm);
router.put('/profile/farms/:id', updateFarm);
router.delete('/profile/farms/:id', deleteFarm);
router.post('/crop-ranking', getCropRankingsBackend);
router.post('/gov-schemes/chat', chatWithSchemeAI);

// New Farmer Profile routes for government schemes module wizard
router.post('/farmer/profile', createOrUpdateFarmerProfile);
router.get('/farmer/profile/:id', getFarmerProfileById);

export default router;
