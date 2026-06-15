import express from 'express';
import { 
  getGovSchemes, 
  getGovSchemeById, 
  getGovSchemesDashboard,
  postInteraction,
  getAdminAnalytics,
  saveAdminAnalytics,
  getFarmerDbtSubsidies,
  getFarmerCalendar,
  toggleCalendarEvent
} from '../controllers/govSchemes.controller.js';
import { 
  getFpoOverview, 
  getFpoFarmers, 
  createFpoFarmer,
  bulkCreateFpoFarmers,
  updateFpoFarmerEnrollment,
  syncFpoRealData,
  getFpoAnalytics,
  resolveFpoDisbursement,
  getFpoApplications,
  uploadCorporateDocument,
  getFpoBoardReport
} from '../controllers/fpoGovSchemes.controller.js';

const router = express.Router();

router.get('/gov-schemes', getGovSchemes);
router.get('/gov-schemes/dashboard', getGovSchemesDashboard);
router.get('/gov-schemes/admin/analytics', getAdminAnalytics);
router.post('/gov-schemes/admin/analytics', saveAdminAnalytics);
router.post('/gov-schemes/:id/interact', postInteraction);
router.get('/gov-schemes/:id', getGovSchemeById);

// Farmer Role Gov-Schemes Endpoints
router.get('/gov-schemes/farmer/dbt-subsidies', getFarmerDbtSubsidies);
router.get('/gov-schemes/farmer/calendar', getFarmerCalendar);
router.post('/gov-schemes/farmer/calendar/apply', toggleCalendarEvent);

// FPO Roles Gov-Schemes Endpoints
router.get('/gov-schemes/fpo/overview', getFpoOverview);
router.get('/gov-schemes/fpo/farmers', getFpoFarmers);
router.post('/gov-schemes/fpo/farmers', createFpoFarmer);
router.post('/gov-schemes/fpo/farmers/bulk', bulkCreateFpoFarmers);
router.patch('/gov-schemes/fpo/farmers/:id/enrollment', updateFpoFarmerEnrollment);
router.post('/gov-schemes/fpo/sync', syncFpoRealData);
router.get('/gov-schemes/fpo/analytics', getFpoAnalytics);
router.post('/gov-schemes/fpo/disbursements/resolve', resolveFpoDisbursement);
router.get('/gov-schemes/fpo/applications', getFpoApplications);
router.post('/gov-schemes/fpo/applications/upload', uploadCorporateDocument);
router.get('/gov-schemes/fpo/board-report', getFpoBoardReport);

export default router;
