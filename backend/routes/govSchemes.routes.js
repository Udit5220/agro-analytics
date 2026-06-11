import express from 'express';
import { 
  getGovSchemes, 
  getGovSchemeById, 
  getGovSchemesDashboard 
} from '../controllers/govSchemes.controller.js';

const router = express.Router();

router.get('/gov-schemes', getGovSchemes);
router.get('/gov-schemes/dashboard', getGovSchemesDashboard);
router.get('/gov-schemes/:id', getGovSchemeById);

export default router;
