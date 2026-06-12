import express from 'express';
import { 
  getGovSchemes, 
  getGovSchemeById, 
  getGovSchemesDashboard 
} from '../controllers/govSchemes.controller.js';
import { 
  getFpoSchemesStats, 
  getFpoFarmers, 
  updateFpoFarmerEnrollment,
  syncFpoRealData 
} from '../controllers/fpoGovSchemes.controller.js';

const router = express.Router();

router.get('/gov-schemes', getGovSchemes);
router.get('/gov-schemes/dashboard', getGovSchemesDashboard);
router.get('/gov-schemes/:id', getGovSchemeById);

// FPO Roles Gov-Schemes Endpoints
router.get('/gov-schemes/fpo/stats', getFpoSchemesStats);
router.get('/gov-schemes/fpo/farmers', getFpoFarmers);
router.patch('/gov-schemes/fpo/farmers/:id/enrollment', updateFpoFarmerEnrollment);
router.post('/gov-schemes/fpo/sync', syncFpoRealData);

export default router;
