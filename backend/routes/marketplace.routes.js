import express from 'express';
import {
  getListings, createListing, getListingById, updateListing, deleteListing,
  getBuyerRequirements, createBuyerRequirement,
  createOffer, getOffers, updateOffer, acceptOffer,
  getOrders, createOrder, updateOrder,
  getInvoices, createInvoice,
  getMarketplaceDashboard,
} from '../controllers/marketplace.controller.js';

const router = express.Router();

router.get('/dashboard', getMarketplaceDashboard);

router.get('/listings', getListings);
router.post('/listings', createListing);
router.get('/listings/:id', getListingById);
router.patch('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);

router.get('/buyer-requirements', getBuyerRequirements);
router.post('/buyer-requirements', createBuyerRequirement);

router.post('/offers', createOffer);
router.get('/offers', getOffers);
router.patch('/offers/:id', updateOffer);
router.patch('/offers/:id/accept', acceptOffer);

router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.patch('/orders/:id', updateOrder);

router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);

export default router;
